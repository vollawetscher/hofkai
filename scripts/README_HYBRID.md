# ELO Hybrid-System Setup

Dieses System importiert Metadaten aus Ihren ELO-Archiven und ermöglicht On-Demand-Zugriff auf Dokumente ohne vollständigen Upload.

## Vorteile

✅ **Schneller Start**: Metadaten-Import dauert 1-2 Stunden statt Wochen
✅ **Kein 1 TB Upload**: Dokumente bleiben lokal
✅ **Voller Zugriff**: Bauki kann trotzdem alle Dokumente nutzen
✅ **Beide ELO-Typen**: Unterstützt ELO Office 10.5 und ELO Viewer 8.0

## Installation

### 1. Python-Abhängigkeiten installieren

\`\`\`bash
cd scripts
pip install -r requirements_hybrid.txt
\`\`\`

### 2. Lokalen ELO-Server konfigurieren

Öffnen Sie `elo_hybrid_server.py` und ändern Sie:

\`\`\`python
API_KEY = "ihr-sicheres-passwort-hier"  # Ändern Sie dies!
\`\`\`

### 3. Metadaten-Import konfigurieren

Öffnen Sie `elo_metadata_import.py` und setzen Sie:

\`\`\`python
LOCAL_API_KEY = "ihr-sicheres-passwort-hier"  # Muss mit Server übereinstimmen
VERCEL_API_URL = "https://ihre-bauki-url.vercel.app"
\`\`\`

## Nutzung

### Schritt 1: Lokalen Server starten

\`\`\`bash
python elo_hybrid_server.py
\`\`\`

Der Server läuft dann auf `http://localhost:5000` und wartet auf Anfragen.

**WICHTIG**: Dieser Server muss dauerhaft laufen, damit Bauki auf Dokumente zugreifen kann.

### Schritt 2: Metadaten importieren

In einem neuen Terminal-Fenster:

\`\`\`bash
python elo_metadata_import.py
\`\`\`

Dies importiert:
- Alle Archive (ELO Office + ELO Viewer)
- Aktenstruktur
- Dokumenten-Metadaten
- Verschlagwortung

**Dauer**: 1-2 Stunden für alle Archive

### Schritt 3: Fertig!

Bauki kennt jetzt alle Ihre Dokumente und kann:
- Nach Dokumenten suchen
- Metadaten anzeigen
- Bei Bedarf Dokumente vom lokalen Server holen

## Wie es funktioniert

1. **Metadaten in Cloud**: Alle Infos über Dokumente sind in Bauki
2. **Dokumente lokal**: Die Dateien bleiben auf Ihrem Server
3. **On-Demand-Zugriff**: Wenn ein Dokument gebraucht wird, holt Bauki es vom lokalen Server
4. **Intelligentes Caching**: Häufig genutzte Dokumente werden in Cloud gecacht

## Als Windows-Dienst einrichten

Damit der Server automatisch startet:

1. Suchen Sie nach "Task Scheduler" (Aufgabenplanung)
2. Erstellen Sie neue Aufgabe
3. Trigger: Bei Anmeldung
4. Aktion: `python C:\Pfad\zu\elo_hybrid_server.py`
5. Bedingungen: Nur im Netzwerk starten

## Troubleshooting

**Server startet nicht:**
- Prüfen Sie ob Port 5000 frei ist
- Prüfen Sie ODBC-Treiber Installation

**Metadaten-Import schlägt fehl:**
- Prüfen Sie API_KEY in beiden Dateien
- Prüfen Sie Vercel-URL

**Dokumente nicht verfügbar:**
- Prüfen Sie ob lokaler Server läuft
- Prüfen Sie Firewall-Einstellungen
