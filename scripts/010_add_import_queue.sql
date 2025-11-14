-- Import-Queue für große ELO-Importe
CREATE TABLE IF NOT EXISTS import_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_path TEXT NOT NULL,
  total_files INTEGER DEFAULT 0,
  processed_files INTEGER DEFAULT 0,
  failed_files INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_log JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Import-Statistiken
CREATE TABLE IF NOT EXISTS import_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_folders INTEGER DEFAULT 0,
  completed_folders INTEGER DEFAULT 0,
  total_documents INTEGER DEFAULT 0,
  processed_documents INTEGER DEFAULT 0,
  failed_documents INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE import_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_stats ENABLE ROW LEVEL SECURITY;

-- Admins können alles sehen und verwalten
CREATE POLICY "Admins can manage import queue"
  ON import_queue FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

CREATE POLICY "Admins can view import stats"
  ON import_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND is_admin = true
    )
  );

-- Ordner-Pfad zu documents hinzufügen
ALTER TABLE documents ADD COLUMN IF NOT EXISTS folder_path TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS import_batch_id UUID;

-- Index für schnellere Suche nach Ordnern
CREATE INDEX IF NOT EXISTS idx_documents_folder_path ON documents(folder_path);
CREATE INDEX IF NOT EXISTS idx_documents_import_batch ON documents(import_batch_id);
