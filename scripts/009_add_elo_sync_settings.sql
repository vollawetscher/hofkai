-- Erweitere system_settings für ELO-SQL-Verbindung
ALTER TABLE system_settings 
ADD COLUMN IF NOT EXISTS elo_db_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS elo_db_host VARCHAR(255),
ADD COLUMN IF NOT EXISTS elo_db_port INTEGER,
ADD COLUMN IF NOT EXISTS elo_db_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS elo_db_user VARCHAR(255),
ADD COLUMN IF NOT EXISTS elo_db_password_encrypted TEXT,
ADD COLUMN IF NOT EXISTS last_sync_timestamp TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sync_status VARCHAR(50) DEFAULT 'idle';

-- Tabelle für Sync-Logs
CREATE TABLE IF NOT EXISTS elo_sync_logs (
  id SERIAL PRIMARY KEY,
  sync_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sync_completed_at TIMESTAMP WITH TIME ZONE,
  documents_synced INTEGER DEFAULT 0,
  documents_updated INTEGER DEFAULT 0,
  documents_failed INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'running',
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id)
);

-- RLS für sync_logs
ALTER TABLE elo_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sync logs"
  ON elo_sync_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- Erweitere documents Tabelle für ELO-Referenzen
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS elo_object_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS elo_guid VARCHAR(255),
ADD COLUMN IF NOT EXISTS elo_last_modified TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS elo_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_documents_elo_object_id ON documents(elo_object_id);
CREATE INDEX IF NOT EXISTS idx_documents_elo_guid ON documents(elo_guid);
