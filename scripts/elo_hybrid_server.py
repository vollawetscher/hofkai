import os
import pyodbc
import json
from flask import Flask, request, jsonify
from pathlib import Path
import mimetypes
import base64

app = Flask(__name__)

# Konfiguration
ELO_BASE_PATH = r"C:\Program Files (x86)\ELOoffice"
ARCHIVES_PATH = os.path.join(ELO_BASE_PATH, "Archive")
API_KEY = "your-secret-api-key-here"  # WICHTIG: Ändern Sie diesen Wert!

def detect_archive_type(archive_path):
    """Erkennt ob ELO Office oder ELO Viewer Archiv"""
    mdb_files = list(Path(archive_path).glob("*.mdb"))
    if not mdb_files:
        return None
    
    # Prüfe Tabellen in MDB um Typ zu bestimmen
    try:
        conn_str = f"DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={mdb_files[0]}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        # ELO Office hat mehr Tabellen als Viewer
        tables = [row.table_name for row in cursor.tables(tableType='TABLE')]
        conn.close()
        
        if 'AKTEN' in tables and 'OBJEKTE' in tables:
            return 'office'
        else:
            return 'viewer'
    except Exception as e:
        print(f"Fehler bei Typ-Erkennung: {e}")
        return 'unknown'

def get_all_archives():
    """Findet alle Archive und deren Typen"""
    archives = []
    
    for item in os.listdir(ARCHIVES_PATH):
        archive_path = os.path.join(ARCHIVES_PATH, item)
        if os.path.isdir(archive_path):
            archive_type = detect_archive_type(archive_path)
            mdb_files = list(Path(archive_path).glob("*.mdb"))
            
            if mdb_files and archive_type:
                archives.append({
                    'name': item,
                    'path': archive_path,
                    'type': archive_type,
                    'mdb_file': str(mdb_files[0])
                })
    
    return archives

def read_mdb_metadata(mdb_file, archive_type):
    """Liest Metadaten aus MDB je nach Archiv-Typ"""
    try:
        conn_str = f"DRIVER={{Microsoft Access Driver (*.mdb, *.accdb)}};DBQ={mdb_file}"
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        documents = []
        
        if archive_type == 'office':
            # ELO Office 10.5 Schema
            query = """
                SELECT 
                    o.OBJEKTID, o.OBJEKT, o.KURZBEZ, o.REFERENZ,
                    o.DATEINAME, o.AKTENID, o.ANGELEGT, o.GEAENDERT,
                    a.AKTENZEICHEN, a.AKTENNAME
                FROM OBJEKTE o
                LEFT JOIN AKTEN a ON o.AKTENID = a.AKTENID
            """
        else:
            # ELO Viewer 8.0 - vereinfachtes Schema
            query = """
                SELECT 
                    OBJEKTID, OBJEKT, KURZBEZ, DATEINAME, ANGELEGT
                FROM OBJEKTE
            """
        
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        
        for row in cursor.fetchall():
            doc = dict(zip(columns, row))
            documents.append(doc)
        
        # Lade Stichworte
        cursor.execute("SELECT OBJEKTID, STICHWORT FROM STICHW")
        keywords = {}
        for row in cursor.fetchall():
            obj_id = row[0]
            if obj_id not in keywords:
                keywords[obj_id] = []
            keywords[obj_id].append(row[1])
        
        conn.close()
        
        return {
            'documents': documents,
            'keywords': keywords
        }
        
    except Exception as e:
        print(f"Fehler beim Lesen der MDB: {e}")
        return None

def get_document_file(archive_path, filename):
    """Holt Dokumentdatei aus Archiv"""
    try:
        # ELO speichert Dateien meist in Unterordnern nach Jahr/Monat
        possible_paths = [
            os.path.join(archive_path, filename),
            os.path.join(archive_path, "Dokumente", filename),
            os.path.join(archive_path, "Files", filename),
        ]
        
        # Suche in allen Unterordnern
        for root, dirs, files in os.walk(archive_path):
            if filename in files:
                file_path = os.path.join(root, filename)
                with open(file_path, 'rb') as f:
                    file_data = f.read()
                
                mime_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
                
                return {
                    'filename': filename,
                    'mime_type': mime_type,
                    'data': base64.b64encode(file_data).decode('utf-8'),
                    'size': len(file_data)
                }
        
        return None
        
    except Exception as e:
        print(f"Fehler beim Laden der Datei {filename}: {e}")
        return None

# API Endpoints

@app.route('/api/health', methods=['GET'])
def health_check():
    """Prüft ob Server läuft"""
    return jsonify({'status': 'ok', 'message': 'ELO Hybrid Server läuft'})

@app.route('/api/archives', methods=['GET'])
def list_archives():
    """Liste aller verfügbaren Archive"""
    api_key = request.headers.get('X-API-Key')
    if api_key != API_KEY:
        return jsonify({'error': 'Unauthorized'}), 401
    
    archives = get_all_archives()
    return jsonify({'archives': archives, 'count': len(archives)})

@app.route('/api/archives/<archive_name>/metadata', methods=['GET'])
def get_archive_metadata(archive_name):
    """Lädt Metadaten eines Archives"""
    api_key = request.headers.get('X-API-Key')
    if api_key != API_KEY:
        return jsonify({'error': 'Unauthorized'}), 401
    
    archives = get_all_archives()
    archive = next((a for a in archives if a['name'] == archive_name), None)
    
    if not archive:
        return jsonify({'error': 'Archiv nicht gefunden'}), 404
    
    metadata = read_mdb_metadata(archive['mdb_file'], archive['type'])
    
    if metadata:
        return jsonify({
            'archive': archive_name,
            'type': archive['type'],
            'document_count': len(metadata['documents']),
            'metadata': metadata
        })
    else:
        return jsonify({'error': 'Fehler beim Lesen der Metadaten'}), 500

@app.route('/api/archives/<archive_name>/document/<filename>', methods=['GET'])
def get_document(archive_name, filename):
    """Holt einzelnes Dokument"""
    api_key = request.headers.get('X-API-Key')
    if api_key != API_KEY:
        return jsonify({'error': 'Unauthorized'}), 401
    
    archives = get_all_archives()
    archive = next((a for a in archives if a['name'] == archive_name), None)
    
    if not archive:
        return jsonify({'error': 'Archiv nicht gefunden'}), 404
    
    file_data = get_document_file(archive['path'], filename)
    
    if file_data:
        return jsonify(file_data)
    else:
        return jsonify({'error': 'Dokument nicht gefunden'}), 404

if __name__ == '__main__':
    print("=" * 60)
    print("ELO Hybrid Server")
    print("=" * 60)
    print(f"ELO Base Path: {ELO_BASE_PATH}")
    print(f"Archives Path: {ARCHIVES_PATH}")
    print("\nSuche nach Archiven...")
    
    archives = get_all_archives()
    print(f"\n{len(archives)} Archive gefunden:")
    for archive in archives:
        print(f"  - {archive['name']} ({archive['type'].upper()})")
    
    print("\n" + "=" * 60)
    print("Server startet auf http://localhost:5000")
    print("WICHTIG: Ändern Sie den API_KEY in dieser Datei!")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
