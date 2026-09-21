require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check endpoints for uptime monitoring
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 1. GET /api/graph
app.get('/api/graph', async (req, res) => {
  try {
    const filterProject = req.query.project || '';
    
    let [
      { data: services, error: sErr },
      { data: features, error: fErr },
      { data: dependencies, error: dErr }
    ] = await Promise.all([
      supabase.from('services').select('*').eq('project', filterProject),
      supabase.from('features').select('*').eq('project', filterProject),
      supabase.from('dependencies').select('*')
    ]);

    if (sErr) throw sErr;
    if (fErr) throw fErr;
    if (dErr) throw dErr;

    const nodes = [];
    const edges = [];

    services.forEach((s, i) => {
      nodes.push({
        id: s.id,
        type: 'service',
        data: { label: s.name, status: s.status, criticality: s.criticality_score },
        position: { x: i * 200, y: 300 }
      });
    });

    features.forEach((f, i) => {
      nodes.push({
        id: f.id,
        type: 'feature',
        data: { label: f.name, status: f.status },
        position: { x: i * 200, y: 100 }
      });
    });

    const validServiceIds = new Set(services.map(s => s.id));
    const validFeatureIds = new Set(features.map(f => f.id));
    
    dependencies.forEach(d => {
      if (validFeatureIds.has(d.feature_id) && validServiceIds.has(d.service_id)) {
        edges.push({
          id: d.id,
          source: d.feature_id,
          target: d.service_id,
          animated: true,
          style: { stroke: '#475569', strokeWidth: 2 },
          type: 'smoothstep'
        });
      }
    });


    res.json({ nodes, edges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /api/simulate/:serviceId
app.post('/api/simulate/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    // Mark service as failed
    await supabase.from('services').update({ status: 'failed' }).eq('id', serviceId);

    // Breadth-First Search (BFS) to identify the full blast radius of a failure.
    // We traverse the dependency graph starting from the failed service to find all affected features.
    const affectedFeatureIds = new Set();
    const queue = [serviceId];
    
    // Fetch all dependencies to do traversal in memory
    const { data: deps } = await supabase.from('dependencies').select('*');
    
    while (queue.length > 0) {
      const currentServiceId = queue.shift();
      
      // Find features depending on this service
      const dependentFeatures = deps.filter(d => d.service_id === currentServiceId);
      
      for (const d of dependentFeatures) {
        if (!affectedFeatureIds.has(d.feature_id)) {
          affectedFeatureIds.add(d.feature_id);
          // In a deeper graph, we might add feature_id to queue if features depended on features,
          // but in this schema, only features depend on services.
        }
      }
    }

    const featureIdsArray = Array.from(affectedFeatureIds);
    if (featureIdsArray.length > 0) {
      // Fire and forget staggered cascade update
      await supabase.from('features').update({ status: 'failed' }).in('id', featureIdsArray);
    }

    const { count: totalFeatures } = await supabase.from('features').select('*', { count: 'exact', head: true });
    
    const severityScore = totalFeatures > 0 ? (featureIdsArray.length / totalFeatures) * 100 : 0;

    res.json({
      affected_features: featureIdsArray,
      severity_score: severityScore
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST /api/reset
app.post('/api/reset', async (req, res) => {
  try {
    await Promise.all([
      supabase.from('services').update({ status: 'healthy' }).neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('features').update({ status: 'healthy' }).neq('id', '00000000-0000-0000-0000-000000000000')
    ]);
    res.json({ message: 'Reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /api/trace/:serviceId
app.post('/api/trace/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;

    const { data: serviceData } = await supabase.from('services').select('name').eq('id', serviceId).single();
    const serviceName = serviceData ? serviceData.name : 'Unknown Service';

    const { data: deps } = await supabase.from('dependencies').select('features(name)').eq('service_id', serviceId);
    const affectedFeature = (deps && deps.length > 0 && deps[0].features) ? deps[0].features.name : 'System Background Job';

    const requestId = `req-${Date.now()}`;
    
    console.log(`[DEBUG] Generating trace logs for killed service: ${serviceName}`);
    let steps = [];
    switch (serviceName) {
      case 'AuthService':
        steps = [
          { step: `User initiated ${affectedFeature}`, status: 'pending' },
          { step: 'Validating OAuth payload', status: 'pending' },
          { step: `Contacting ${serviceName}`, status: 'pending' },
          { step: `${serviceName} connection refused (TCP reset)`, status: 'error' },
          { step: 'Falling back to cached session (FAILED)', status: 'error' },
          { step: `${affectedFeature} FAILED`, status: 'failed' }
        ];
        break;
      case 'PaymentService':
        steps = [
          { step: `User initiated ${affectedFeature}`, status: 'pending' },
          { step: 'Processing cart and calculating taxes', status: 'pending' },
          { step: `Calling payment gateway via ${serviceName}`, status: 'pending' },
          { step: `${serviceName} 504 Gateway Timeout`, status: 'error' },
          { step: 'Transaction rolled back', status: 'error' },
          { step: `${affectedFeature} FAILED`, status: 'failed' }
        ];
        break;
      case 'DBService':
        steps = [
          { step: `User initiated ${affectedFeature}`, status: 'pending' },
          { step: 'Building SQL query', status: 'pending' },
          { step: `Executing SELECT via ${serviceName}`, status: 'pending' },
          { step: `${serviceName} connection pool exhausted`, status: 'error' },
          { step: 'Query rejected', status: 'error' },
          { step: `${affectedFeature} FAILED`, status: 'failed' }
        ];
        break;
      case 'EmailService':
        steps = [
          { step: `User initiated ${affectedFeature}`, status: 'pending' },
          { step: 'Generating invoice PDF', status: 'pending' },
          { step: `Dispatching payload to ${serviceName}`, status: 'pending' },
          { step: `${serviceName} returned 429 Too Many Requests`, status: 'error' },
          { step: 'Message added to dead-letter queue', status: 'pending' },
          { step: `${affectedFeature} FAILED`, status: 'failed' }
        ];
        break;
      default:
        steps = [
          { step: `System Job targeting ${serviceName}`, status: 'pending' },
          { step: `Connection to ${serviceName} refused`, status: 'error' },
          { step: `Max retries exceeded`, status: 'error' },
          { step: `FAILED`, status: 'failed' }
        ];
    }
    const logs = steps.map((s, idx) => ({
      request_id: requestId,
      step: s.step,
      status: s.status,
      // Add a slight delay for each step's timestamp
      timestamp: new Date(Date.now() + idx * 1000).toISOString()
    }));

    const { error } = await supabase.from('trace_logs').insert(logs);
    if (error) throw error;

    res.json({ request_id: requestId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. GET /api/trace/:requestId
app.get('/api/trace/:requestId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trace_logs')
      .select('*')
      .eq('request_id', req.params.requestId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
