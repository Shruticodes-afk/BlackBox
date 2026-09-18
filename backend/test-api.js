const http = require('http');

const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function test() {
  console.log("1. GET /api/graph");
  const graphRes = await request('GET', '/api/graph');
  console.log(`Status: ${graphRes.status}, Nodes: ${graphRes.data.nodes?.length}, Edges: ${graphRes.data.edges?.length}`);
  
  const serviceNode = graphRes.data.nodes?.find(n => n.type === 'service');
  if (!serviceNode) return console.log("No services found");
  
  console.log(`\n2. POST /api/simulate/${serviceNode.id} (${serviceNode.data.label})`);
  const simRes = await request('POST', `/api/simulate/${serviceNode.id}`);
  console.log(`Status: ${simRes.status}, Data:`, simRes.data);
  
  console.log("\n3. POST /api/reset");
  const resetRes = await request('POST', '/api/reset');
  console.log(`Status: ${resetRes.status}, Data:`, resetRes.data);
  
  console.log(`\n4. POST /api/trace/${serviceNode.id}`);
  const traceRes = await request('POST', `/api/trace/${serviceNode.id}`);
  console.log(`Status: ${traceRes.status}, Data:`, traceRes.data);
  
  const reqId = traceRes.data.request_id;
  console.log(`\n5. GET /api/trace/${reqId}`);
  const getTraceRes = await request('GET', `/api/trace/${reqId}`);
  console.log(`Status: ${getTraceRes.status}, Data:`, getTraceRes.data);
}

test().catch(console.error);
