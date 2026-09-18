const fs = require('fs');
let c = fs.readFileSync('frontend/src/pages/Dashboard.jsx', 'utf8');

c = c.replace(
  "const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nzaxjczpulglafajxkuk.supabase.co';",
  "const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;"
);
c = c.replace(
  "const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xXaKYHzDVT__SDWTkgE2gQ_DmuaNFnn';",
  "const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;"
);

fs.writeFileSync('frontend/src/pages/Dashboard.jsx', c, 'utf8');

// Ensure frontend/.env has the values
const envContent = "VITE_SUPABASE_URL=https://nzaxjczpulglafajxkuk.supabase.co\nVITE_SUPABASE_ANON_KEY=sb_publishable_xXaKYHzDVT__SDWTkgE2gQ_DmuaNFnn\n";
fs.writeFileSync('frontend/.env', envContent, 'utf8');

// Ensure frontend/.gitignore ignores .env
let gitignore = fs.readFileSync('frontend/.gitignore', 'utf8');
if (!gitignore.includes('.env')) {
  fs.writeFileSync('frontend/.gitignore', gitignore + "\n.env\n", 'utf8');
}
