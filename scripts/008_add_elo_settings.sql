-- Tabelle für System-Einstellungen
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- ELO-Einstellung hinzufügen
INSERT INTO system_settings (setting_key, setting_value)
VALUES ('elo_documents_enabled', 'false')
ON CONFLICT (setting_key) DO NOTHING;

-- RLS Policies
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Admins können Einstellungen lesen und ändern
CREATE POLICY "Admins can manage system settings"
ON system_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Alle angemeldeten Nutzer können Einstellungen lesen
CREATE POLICY "Users can read system settings"
ON system_settings
FOR SELECT
USING (auth.uid() IS NOT NULL);
