# ELO Hybrid System - Setup Anleitung

## Schritt-für-Schritt Installation

### 1. Python installieren (falls noch nicht vorhanden)
- Download: https://www.python.org/downloads/
- Version 3.8 oder höher
- **WICHTIG:** Bei Installation "Add Python to PATH" anhaken

### 2. ZIP herunterladen und entpacken
- In v0: Drei Punkte (•••) → "Download ZIP"
- ZIP entpacken, z.B. nach `C:\Bauki\`

### 3. Python-Pakete installieren
Öffnen Sie die Kommandozeile (cmd) und navigieren Sie zum scripts Ordner:

\`\`\`bash
cd C:\Bauki\bauki-ai-assistant\scripts
pip install -r requirements_hybrid.txt
\`\`\`

### 4. API-Key generieren
Nach dem Deploy:
1. Gehen Sie zu: https://baukeinscheiss.vercel.app/admin/setup
2. Führen Sie das Setup aus
3. Generieren Sie einen API-Key im Admin-Dashboard
4. Kopieren Sie den Key

### 5. Scripts konfigurieren

**elo_hybrid_server.py** (Zeile 13):
\`\`\`python
API_KEY = "ihr-generierter-api-key-hier"
\`\`\`

**elo_metadata_import.py** (Zeile 6 und 10):
\`\`\`python
LOCAL_API_KEY = "ihr-generierter-api-key-hier"  # Gleicher Key wie oben
VERCEL_API_KEY = "ihr-generierter-api-key-hier"  # Gleicher Key
\`\`\`

### 6. Lokalen Server starten
\`\`\`bash
python elo_hybrid_server.py
\`\`\`

Sie sollten sehen:
\`\`\`
============================================================
ELO Hybrid Server
============================================================
ELO Base Path: C:\Program Files (x86)\ELOoffice
Archives Path: C:\Program Files (x86)\ELOoffice\Archive

Suche nach Archiven...

3 Archive gefunden:
  - Archiv2024 (OFFICE)
  - ArchivAlt (VIEWER)
  - Projekte (OFFICE)

============================================================
Server startet auf http://localhost:5000
============================================================
\`\`\`

**Lassen Sie dieses Fenster offen!**

### 7. Metadaten importieren (neues Fenster)
Öffnen Sie ein **zweites** Kommandozeilen-Fenster:

\`\`\`bash
cd C:\Bauki\bauki-ai-assistant\scripts
python elo_metadata_import.py
\`\`\`

Der Import läuft automatisch durch alle Archive (1-2 Stunden).

### 8. Fertig!
- Bauki ist jetzt einsatzbereit
- Gehen Sie zu: https://baukeinscheiss.vercel.app
- Chatten Sie mit Bauki
- Er kann auf alle ELO-Dokumente zugreifen

## Troubleshooting

**"Lokaler Server nicht erreichbar"**
→ Prüfen Sie ob `elo_hybrid_server.py` läuft

**"Unauthorized"**
→ API-Keys in beiden Scripts müssen identisch sein

**"Keine Archive gefunden"**
→ Prüfen Sie den Pfad in `ELO_BASE_PATH`

**"Microsoft Access Driver nicht gefunden"**
→ Installieren Sie: Microsoft Access Database Engine 2016 Redistributable
