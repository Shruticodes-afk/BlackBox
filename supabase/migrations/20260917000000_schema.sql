-- Create tables
CREATE TABLE services (
    id uuid primary key default gen_random_uuid(),
    name text,
    status text default 'healthy',
    criticality_score int default 0
);

CREATE TABLE features (
    id uuid primary key default gen_random_uuid(),
    name text,
    status text default 'healthy'
);

CREATE TABLE dependencies (
    id uuid primary key default gen_random_uuid(),
    feature_id uuid references features(id),
    service_id uuid references services(id)
);

CREATE TABLE trace_logs (
    id uuid primary key default gen_random_uuid(),
    request_id text,
    step text,
    timestamp timestamptz default now(),
    status text
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE trace_logs ENABLE ROW LEVEL SECURITY;

-- Permissive policies (public read/write)
CREATE POLICY "Enable read/write for all users on services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users on features" ON features FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users on dependencies" ON dependencies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable read/write for all users on trace_logs" ON trace_logs FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime replication
alter publication supabase_realtime add table services;
alter publication supabase_realtime add table features;
alter publication supabase_realtime add table dependencies;
alter publication supabase_realtime add table trace_logs;
