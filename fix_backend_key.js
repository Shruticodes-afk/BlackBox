const fs = require('fs');
let c = fs.readFileSync('backend/index.js', 'utf8');

c = c.replace(
  "const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;",
  "const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;"
);

// Fallback logic check if I replaced it correctly earlier:
// Wait, let's just check the exact file content first.
console.log(c.substring(0, 300));
