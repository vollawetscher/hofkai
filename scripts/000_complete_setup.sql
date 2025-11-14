-- Komplette Datenbank-Setup für Bauki AI Assistant
-- Dieses Script erstellt alle notwendigen Tabellen und Funktionen

-- 1. User Profiles Tabelle
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  baukloetze INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies für user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Admin-Funktion (vermeidet infinite recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies für user_profiles
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON user_profiles;
CREATE POLICY "Users can view own profile or admins can view all" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Users can update own profile or admins can update all" ON user_profiles;
CREATE POLICY "Users can update own profile or admins can update all" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Admin-User setzen
INSERT INTO user_profiles (id, email, baukloetze, is_admin)
SELECT id, 'hofkai@googlemail.com', 999999, TRUE
FROM auth.users
WHERE email = 'hofkai@googlemail.com'
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE, baukloetze = 999999;

-- 2. Token Usage Tabelle
CREATE TABLE IF NOT EXISTS token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used INTEGER NOT NULL,
  action TEXT NOT NULL,
  elo_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own usage or admins can view all" ON token_usage;
CREATE POLICY "Users can view own usage or admins can view all" 
  ON token_usage FOR SELECT 
  USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can insert own usage" ON token_usage;
CREATE POLICY "Users can insert own usage" 
  ON token_usage FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 3. Community Posts Tabelle
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  image_rights_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
CREATE POLICY "Anyone can view posts" 
  ON community_posts FOR SELECT 
  USING (TRUE);

DROP POLICY IF EXISTS "Users can create own posts" ON community_posts;
CREATE POLICY "Users can create own posts" 
  ON community_posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts or admins can update all" ON community_posts;
CREATE POLICY "Users can update own posts or admins can update all" 
  ON community_posts FOR UPDATE 
  USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can delete own posts or admins can delete all" ON community_posts;
CREATE POLICY "Users can delete own posts or admins can delete all" 
  ON community_posts FOR DELETE 
  USING (auth.uid() = user_id OR is_admin());

-- 4. Community Comments Tabelle
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments" ON community_comments;
CREATE POLICY "Anyone can view comments" 
  ON community_comments FOR SELECT 
  USING (TRUE);

DROP POLICY IF EXISTS "Users can create comments" ON community_comments;
CREATE POLICY "Users can create comments" 
  ON community_comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 5. Consultation Requests Tabelle
CREATE TABLE IF NOT EXISTS consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own requests or admins can view all" ON consultation_requests;
CREATE POLICY "Users can view own requests or admins can view all" 
  ON consultation_requests FOR SELECT 
  USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Users can create own requests" ON consultation_requests;
CREATE POLICY "Users can create own requests" 
  ON consultation_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 6. Documents Tabelle (für ELO-Import)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  category TEXT,
  tags TEXT[],
  content_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volltextsuche für deutsche Dokumente
ALTER TABLE documents ADD COLUMN IF NOT EXISTS content_search tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('german', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('german', coalesce(content_text, '')), 'B') ||
    setweight(to_tsvector('german', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS documents_search_idx ON documents USING GIN(content_search);
CREATE INDEX IF NOT EXISTS documents_tags_idx ON documents USING GIN(tags);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view documents" ON documents;
CREATE POLICY "Authenticated users can view documents" 
  ON documents FOR SELECT 
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage documents" ON documents;
CREATE POLICY "Admins can manage documents" 
  ON documents FOR ALL 
  USING (is_admin());

-- 7. System Settings (für ELO ein/aus)
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage settings" ON system_settings;
CREATE POLICY "Admins can manage settings" 
  ON system_settings FOR ALL 
  USING (is_admin());

-- ELO-Setting initialisieren
INSERT INTO system_settings (key, value)
VALUES ('elo_enabled', 'false'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 8. ELO Archives Tabelle
CREATE TABLE IF NOT EXISTS elo_archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mdb_filename TEXT NOT NULL,
  total_documents INTEGER DEFAULT 0,
  imported_documents INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE elo_archives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage archives" ON elo_archives;
CREATE POLICY "Admins can manage archives" 
  ON elo_archives FOR ALL 
  USING (is_admin());

-- 9. ELO Akten Tabelle (Ordnerstruktur)
CREATE TABLE IF NOT EXISTS elo_akten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archive_id UUID REFERENCES elo_archives(id) ON DELETE CASCADE,
  elo_id TEXT NOT NULL,
  parent_id UUID REFERENCES elo_akten(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  level INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS elo_akten_archive_idx ON elo_akten(archive_id);
CREATE INDEX IF NOT EXISTS elo_akten_parent_idx ON elo_akten(parent_id);

ALTER TABLE elo_akten ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view akten" ON elo_akten;
CREATE POLICY "Authenticated users can view akten" 
  ON elo_akten FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- 10. Import Queue Tabelle
CREATE TABLE IF NOT EXISTS import_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archive_id UUID REFERENCES elo_archives(id) ON DELETE CASCADE,
  batch_number INTEGER NOT NULL,
  total_files INTEGER NOT NULL,
  processed_files INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE import_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view queue" ON import_queue;
CREATE POLICY "Admins can view queue" 
  ON import_queue FOR ALL 
  USING (is_admin());

-- 11. Sample Community Posts
INSERT INTO community_posts (user_id, title, content, created_at)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  title,
  content,
  created_at
FROM (VALUES
  ('Grundstückskauf – Was muss ich beachten?', E'Ich stehe kurz vor dem Kauf eines Grundstücks für unser Einfamilienhaus. Der Preis liegt bei 180.000 € für 600 m².\n\nWorauf sollte ich im Kaufvertrag besonders achten? Welche versteckten Kosten kommen auf mich zu?\n\nGibt es Fallstricke beim Grundstückskauf, die man als Laie leicht übersieht?', NOW() - INTERVAL '5 days'),
  ('Erfahrungen mit Wärmedämmung WDVS', E'Wir haben letztes Jahr unser Haus (Baujahr 1985) mit einem WDVS-System gedämmt. Kosten: ca. 28.000 € für 180 m² Fassadenfläche.\n\nDie Heizkosten sind um etwa 30% gesunken! Die Investition hat sich schneller gelohnt als gedacht.\n\nWichtig: Unbedingt auf zertifizierte Fachbetriebe achten und mehrere Angebote einholen.', NOW() - INTERVAL '12 days'),
  ('Bauabnahme – Diese Mängel habe ich gefunden', E'Bei unserer Bauabnahme letzte Woche haben wir 23 Mängel dokumentiert:\n- Risse im Estrich\n- Fenster schließen nicht richtig\n- Fliesen teilweise hohl\n\nTipp: Unbedingt einen Sachverständigen mitnehmen! Die 500 € haben sich mehr als gelohnt.\n\nJetzt läuft die Mängelbehebung nach VOB/B § 13.', NOW() - INTERVAL '3 days'),
  ('KfW-Förderung erfolgreich beantragt', E'Ich habe für unseren Neubau die KfW-Förderung "Klimafreundlicher Neubau" (297/298) beantragt und bewilligt bekommen.\n\n25.000 € Tilgungszuschuss für KfW 40 Standard!\n\nWichtig: Antrag VOR Baubeginn stellen. Energieberater ist Pflicht, kostet ca. 2.000 €, aber lohnt sich.', NOW() - INTERVAL '8 days'),
  ('Kellersanierung – Feuchtigkeit beseitigt', E'Unser Keller hatte massive Feuchtigkeitsprobleme. Nach Sanierung mit Horizontalsperre und Drainage jetzt komplett trocken.\n\nKosten: 18.000 € für 80 m²\nDauer: 3 Wochen\n\nDas Raumklima hat sich deutlich verbessert. Schimmelgeruch ist weg!', NOW() - INTERVAL '15 days'),
  ('Schallschutz nachträglich verbessern', E'Wir hören jeden Schritt der Nachbarn über uns. Welche Möglichkeiten gibt es für nachträglichen Trittschallschutz?\n\nIst eine abgehängte Decke sinnvoll? Was kostet das ungefähr?\n\nHat jemand Erfahrungen mit Schallschutzdämmung gemacht?', NOW() - INTERVAL '2 days'),
  ('Wohnungskauf – Gutachten war Gold wert', E'Wir wollten eine 90m² Wohnung für 320.000 € kaufen. Das Baugutachten (650 €) hat gravierende Mängel aufgedeckt:\n\n- Feuchte Außenwände\n- Elektrische Anlage veraltet\n- Asbest in Bodenbelägen\n\nVerhandlungsergebnis: 285.000 € statt 320.000 €!', NOW() - INTERVAL '20 days'),
  ('Nebenkostenabrechnung zu hoch?', E'Unsere Nebenkostenabrechnung ist von 180 € auf 285 € gestiegen. Der Vermieter rechnet jetzt "Instandhaltungsrücklage" ab.\n\nIst das rechtens? Nach meinem Wissen darf die Instandhaltungsrücklage nicht auf Mieter umgelegt werden (§ 556 Abs. 3 BGB).\n\nHat jemand Erfahrung mit Widerspruch gegen NK-Abrechnung?', NOW() - INTERVAL '1 day')
) AS posts(title, content, created_at)
WHERE NOT EXISTS (SELECT 1 FROM community_posts LIMIT 1);

-- Fertig!
SELECT 'Datenbank-Setup abgeschlossen! Sie können nun die Bauki-App nutzen.' AS status;
