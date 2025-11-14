-- Tabelle für hochgeladene Baudokumente
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Dokumenten-Metadaten
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- in Bytes
  file_type TEXT NOT NULL, -- pdf, docx, txt, etc.
  blob_url TEXT NOT NULL,
  
  -- Inhalt und Indexierung
  extracted_text TEXT, -- Extrahierter Text aus dem Dokument
  title TEXT,
  category TEXT, -- z.B. "Baurecht", "Normen", "Kostenplanung", "Bauphysik"
  tags TEXT[], -- Schlagwörter für bessere Suche
  
  -- ELO-Metadaten (falls relevant)
  elo_id TEXT,
  elo_category TEXT,
  
  -- Verwaltung
  uploaded_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  search_vector tsvector -- Für Volltextsuche
);

-- Index für schnelle Suche
CREATE INDEX IF NOT EXISTS idx_documents_search_vector ON documents USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_documents_active ON documents(is_active);

-- Funktion zum automatischen Update des search_vector
CREATE OR REPLACE FUNCTION documents_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('german', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('german', COALESCE(NEW.extracted_text, '')), 'B') ||
    setweight(to_tsvector('german', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_search_vector_trigger
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION documents_search_vector_update();

-- RLS Policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Admins können alles sehen und verwalten
CREATE POLICY "Admins can manage all documents"
  ON documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Alle authentifizierten Nutzer können aktive Dokumente lesen
CREATE POLICY "Authenticated users can view active documents"
  ON documents
  FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);

-- Kommentar zur Nutzung
COMMENT ON TABLE documents IS 'Speichert hochgeladene Baudokumente aus der ELO-Datenbank für RAG-basierte Antworten';
