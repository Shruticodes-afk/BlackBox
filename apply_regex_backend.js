const fs = require('fs');
let c = fs.readFileSync('backend/index.js', 'utf8');

c = c.replace(/const \[[\s\S]*?\] = await Promise.all\(\[[\s\S]*?\]\);/, `const filterProject = req.query.project || 'demo';
    
    let [
      { data: services, error: sErr },
      { data: features, error: fErr },
      { data: dependencies, error: dErr }
    ] = await Promise.all([
      supabase.from('services').select('*').eq('project', filterProject),
      supabase.from('features').select('*').eq('project', filterProject),
      supabase.from('dependencies').select('*')
    ]);

    // Fallback if the 'project' column hasn't been created yet to prevent breaking
    if (sErr && sErr.code === 'PGRST100') {
      console.warn("Project column not found, falling back to all data with in-memory filter");
      const fallback = await Promise.all([
        supabase.from('services').select('*'),
        supabase.from('features').select('*'),
        supabase.from('dependencies').select('*')
      ]);
      services = fallback[0].data;
      sErr = fallback[0].error;
      features = fallback[1].data;
      fErr = fallback[1].error;
      dependencies = fallback[2].data;
      dErr = fallback[2].error;
      
      // In-memory filter fallback
      if (filterProject === 'demo') {
        const demoServices = ['AuthService', 'PaymentService', 'DBService', 'EmailService'];
        const demoFeatures = ['UserLogin', 'Checkout', 'UserProfile', 'Search', 'Notifications'];
        services = services.filter(s => demoServices.includes(s.name));
        features = features.filter(f => demoFeatures.includes(f.name));
      } else if (filterProject === 'her-safety') {
        const herSafetyServices = ['SupabaseAuth', 'SupabaseDB', 'LeafletMaps', 'GeminiAI'];
        const herSafetyFeatures = ['UserLogin', 'UserSignup', 'SafeRouteNavigation', 'UnsafeLocationDetection', 'NearbyPoliceStations', 'StreetlightData', 'SavedLocations', 'SmartSafetySuggestions'];
        services = services.filter(s => herSafetyServices.includes(s.name));
        // Note UserLogin is in both, so it will match demo or her-safety depending on filterProject
        features = features.filter(f => herSafetyFeatures.includes(f.name));
      }
    }`);

c = c.replace(/dependencies\.forEach\([\s\S]*?\}\);/, `const validServiceIds = new Set(services.map(s => s.id));
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
    });`);

fs.writeFileSync('backend/index.js', c, 'utf8');
