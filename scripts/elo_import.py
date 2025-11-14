"""
ELO Office 10.5 Import Script für Windows
Liest .mdb Archive aus C:\Program Files (x86)\ELOoffice und importiert sie in Bauki
"""

import pyodbc
import requests
import json
import os
from pathlib import Path
from datetime import datetime

# Konfiguration
ELO_PATH = r"C:\Program Files (x86)\ELOoffice"
API_BASE_URL = "https://ihre-bauki-domain.vercel.app"  # Anpassen!
API_KEY = "ihr-api-key"  # Wird später gesetzt

class ELOImporter:
    def __init__(self, elo_path, api_url, api_key):
        self.elo_path = Path(elo_path)
        self.api_url = api_url
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def find_mdb_files(self):
        """Findet alle .mdb Dateien im ELO-Verzeichnis"""
        mdb_files = list(self.elo_path.rglob("*.mdb"))
        print(f"✓ {len(mdb_files)} Archive gefunden:")
        for mdb in mdb_files:
            print(f"  - {mdb.name}")
        return mdb_files
    
    def connect_to_mdb(self, mdb_path):
        """Verbindet zur Access-Datenbank"""
        try:
            conn_str = (
                r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};'
                f'DBQ={mdb_path};'
            )
            conn = pyodbc.connect(conn_str)
            print(f"✓ Verbunden mit {mdb_path.name}")
            return conn
        except Exception as e:
            print(f"✗ Fehler bei {mdb_path.name}: {e}")
            return None
    
    def extract_archive_info(self, conn, mdb_path):
        """Liest Archiv-Metadaten"""
        cursor = conn.cursor()
        
        # Zähle Dokumente
        cursor.execute("SELECT COUNT(*) FROM OBJEKTE")
        doc_count = cursor.fetchone()[0]
        
        # Zähle Akten
        try:
            cursor.execute("SELECT COUNT(*) FROM AKTEN")
            akte_count = cursor.fetchone()[0]
        except:
            akte_count = 0
        
        return {
            'name': mdb_path.stem,
            'path': str(mdb_path),
            'document_count': doc_count,
            'akte_count': akte_count,
            'last_sync': datetime.now().isoformat()
        }
    
    def extract_akten_structure(self, conn):
        """Extrahiert Aktenstruktur aus ELO"""
        cursor = conn.cursor()
        akten = []
        
        try:
            # ELO 10.5 Aktenstruktur
            cursor.execute("""
                SELECT 
                    ID, 
                    BEZEICHNUNG, 
                    OBERID,
                    PFAD
                FROM AKTEN
                ORDER BY PFAD
            """)
            
            for row in cursor.fetchall():
                akten.append({
                    'elo_id': row.ID,
                    'name': row.BEZEICHNUNG or 'Unbenannt',
                    'parent_id': row.OBERID,
                    'path': row.PFAD or ''
                })
            
            print(f"  ✓ {len(akten)} Akten gefunden")
        except Exception as e:
            print(f"  ! Keine Aktenstruktur: {e}")
        
        return akten
    
    def extract_documents(self, conn, archive_name):
        """Extrahiert Dokumente mit Metadaten"""
        cursor = conn.cursor()
        documents = []
        
        try:
            # ELO 10.5 Dokumentenstruktur
            cursor.execute("""
                SELECT 
                    O.ID,
                    O.BEZEICHNUNG,
                    O.DATEINAME,
                    O.AKTENID,
                    O.DATUM,
                    O.BEMERKUNG,
                    O.PFAD
                FROM OBJEKTE O
                WHERE O.DATEINAME IS NOT NULL
                ORDER BY O.ID
            """)
            
            for row in cursor.fetchall():
                # Extrahiere Stichworte für dieses Dokument
                keywords = self.extract_keywords(conn, row.ID)
                
                # Baue Dateipfad
                file_path = self.find_document_file(row.DATEINAME, row.PFAD)
                
                documents.append({
                    'elo_id': row.ID,
                    'title': row.BEZEICHNUNG or row.DATEINAME or 'Unbenannt',
                    'filename': row.DATEINAME,
                    'akte_id': row.AKTENID,
                    'date': row.DATUM.isoformat() if row.DATUM else None,
                    'description': row.BEMERKUNG or '',
                    'keywords': keywords,
                    'file_path': file_path,
                    'archive': archive_name
                })
                
                if len(documents) % 100 == 0:
                    print(f"  {len(documents)} Dokumente verarbeitet...")
            
            print(f"  ✓ {len(documents)} Dokumente gefunden")
        except Exception as e:
            print(f"  ! Fehler beim Dokumenten-Import: {e}")
        
        return documents
    
    def extract_keywords(self, conn, objekt_id):
        """Extrahiert Stichworte für ein Dokument"""
        cursor = conn.cursor()
        keywords = []
        
        try:
            cursor.execute("""
                SELECT STICHWORT
                FROM STICHW
                WHERE OBJEKTID = ?
            """, objekt_id)
            
            for row in cursor.fetchall():
                if row.STICHWORT:
                    keywords.append(row.STICHWORT.strip())
        except:
            pass
        
        return keywords
    
    def find_document_file(self, filename, pfad):
        """Findet die tatsächliche Datei auf der Festplatte"""
        if not filename:
            return None
        
        # Suche in typischen ELO-Pfaden
        search_paths = [
            self.elo_path / "Archive" / "Dateien",
            self.elo_path / "Dateien",
            Path(pfad) if pfad else None
        ]
        
        for search_path in search_paths:
            if search_path and search_path.exists():
                file_path = search_path / filename
                if file_path.exists():
                    return str(file_path)
        
        return None
    
    def upload_archive_info(self, archive_info):
        """Sendet Archiv-Info an API"""
        try:
            response = self.session.post(
                f"{self.api_url}/api/admin/elo-archives/import",
                json={'archive': archive_info}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"✗ API-Fehler: {e}")
            return None
    
    def upload_documents_batch(self, documents, batch_size=50):
        """Lädt Dokumente in Batches zur API hoch"""
        total = len(documents)
        
        for i in range(0, total, batch_size):
            batch = documents[i:i+batch_size]
            
            try:
                response = self.session.post(
                    f"{self.api_url}/api/admin/elo-archives/import-documents",
                    json={'documents': batch}
                )
                response.raise_for_status()
                
                print(f"  ✓ Batch {i//batch_size + 1}/{(total + batch_size - 1)//batch_size} hochgeladen ({len(batch)} Dokumente)")
            except Exception as e:
                print(f"  ✗ Batch-Fehler: {e}")
    
    def import_archive(self, mdb_path):
        """Importiert ein komplettes Archiv"""
        print(f"\n{'='*60}")
        print(f"Importiere: {mdb_path.name}")
        print(f"{'='*60}")
        
        conn = self.connect_to_mdb(mdb_path)
        if not conn:
            return
        
        try:
            # 1. Archiv-Info
            archive_info = self.extract_archive_info(conn, mdb_path)
            print(f"  Dokumente: {archive_info['document_count']}")
            print(f"  Akten: {archive_info['akte_count']}")
            
            # 2. Aktenstruktur
            akten = self.extract_akten_structure(conn)
            archive_info['akten'] = akten
            
            # 3. Dokumente
            documents = self.extract_documents(conn, mdb_path.stem)
            
            # 4. Upload zur API
            print("\n  Lade zur API hoch...")
            result = self.upload_archive_info(archive_info)
            
            if result and documents:
                self.upload_documents_batch(documents)
            
            print(f"\n✓ Import von {mdb_path.name} abgeschlossen!")
            
        finally:
            conn.close()
    
    def run(self):
        """Hauptprozess"""
        print("="*60)
        print("ELO Office 10.5 Import für Bauki")
        print("="*60)
        
        # Finde alle Archive
        mdb_files = self.find_mdb_files()
        
        if not mdb_files:
            print("✗ Keine .mdb Dateien gefunden!")
            return
        
        print(f"\nStarte Import von {len(mdb_files)} Archiven...")
        
        # Importiere jedes Archiv
        for mdb in mdb_files:
            try:
                self.import_archive(mdb)
            except Exception as e:
                print(f"✗ Fehler bei {mdb.name}: {e}")
        
        print("\n" + "="*60)
        print("✓ Import abgeschlossen!")
        print("="*60)

if __name__ == "__main__":
    # Konfiguration aus Umgebungsvariablen oder direkt
    elo_path = os.getenv('ELO_PATH', r"C:\Program Files (x86)\ELOoffice")
    api_url = os.getenv('BAUKI_API_URL', 'https://ihre-domain.vercel.app')
    api_key = os.getenv('BAUKI_API_KEY', 'ihr-api-key')
    
    importer = ELOImporter(elo_path, api_url, api_key)
    importer.run()
