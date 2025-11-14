-- ELO Archive Management
-- Unterstützt mehrere ELO-Archive mit ihren .mdb-Dateien

CREATE TABLE IF NOT EXISTS elo_archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  mdb_filename TEXT NOT NULL,
  last_sync TIMESTAMPTZ,
  total_documents INTEGER DEFAULT 0,
  sync_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS elo_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archive_id UUID REFERENCES elo_archives(id) ON DELETE CASCADE,
  elo_object_id INTEGER NOT NULL,
  parent_id INTEGER,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'akte', 'vorgang', 'dokument'
  level INTEGER DEFAULT 0,
  path TEXT[], -- Vollständiger Pfad als Array
  keywords TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(archive_id, elo_object_id)
);

-- Verknüpfung zwischen ELO-Struktur und importierten Dokumenten
ALTER TABLE documents ADD COLUMN IF NOT EXISTS elo_archive_id UUID REFERENCES elo_archives(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS elo_object_id INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS elo_path TEXT[];

CREATE INDEX IF NOT EXISTS idx_elo_structure_archive ON elo_structure(archive_id);
CREATE INDEX IF NOT EXISTS idx_elo_structure_parent ON elo_structure(parent_id);
CREATE INDEX IF NOT EXISTS idx_elo_structure_path ON elo_structure USING gin(path);
CREATE INDEX IF NOT EXISTS idx_documents_elo_archive ON documents(elo_archive_id);
CREATE INDEX IF NOT EXISTS idx_documents_elo_path ON documents USING gin(elo_path);

-- RLS Policies
ALTER TABLE elo_archives ENABLE ROW LEVEL SECURITY;
ALTER TABLE elo_structure ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage archives"
  ON elo_archives FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can view structure"
  ON elo_structure FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Users can view structure"
  ON elo_structure FOR SELECT
  TO authenticated
  USING (true);
