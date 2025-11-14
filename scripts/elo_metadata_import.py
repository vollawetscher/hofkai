import requests
import json
import time

# Konfiguration
LOCAL_SERVER_URL = "http://localhost:5000"
LOCAL_API_KEY = "your-secret-api-key-here"  # Muss mit Server übereinstimmen

VERCEL_API_URL = "https://baukeinscheiss.vercel.app"
VERCEL_API_KEY = "admin-api-key"  # Wird im Admin-Dashboard generiert

def import_metadata():
    """Importiert nur Metadaten, keine Dateien"""
    
    print("=" * 60)
    print("ELO Metadaten-Import")
    print("=" * 60)
    
    # Prüfe lokalen Server
    print("\n1. Prüfe lokalen ELO Server...")
    try:
        response = requests.get(
            f"{LOCAL_SERVER_URL}/api/health",
            timeout=5
        )
        if response.status_code == 200:
            print("   ✓ Lokaler Server erreichbar")
        else:
            print("   ✗ Lokaler Server antwortet nicht korrekt")
            return
    except Exception as e:
        print(f"   ✗ Lokaler Server nicht erreichbar: {e}")
        print("   Bitte starten Sie zuerst: python elo_hybrid_server.py")
        return
    
    # Hole Liste der Archive
    print("\n2. Lade Archive-Liste...")
    response = requests.get(
        f"{LOCAL_SERVER_URL}/api/archives",
        headers={"X-API-Key": LOCAL_API_KEY}
    )
    
    if response.status_code != 200:
        print(f"   ✗ Fehler: {response.text}")
        return
    
    archives = response.json()['archives']
    print(f"   ✓ {len(archives)} Archive gefunden")
    
    # Importiere Metadaten für jedes Archiv
    total_documents = 0
    
    for i, archive in enumerate(archives, 1):
        print(f"\n3.{i} Importiere Archiv: {archive['name']} ({archive['type'].upper()})")
        
        # Hole Metadaten vom lokalen Server
        response = requests.get(
            f"{LOCAL_SERVER_URL}/api/archives/{archive['name']}/metadata",
            headers={"X-API-Key": LOCAL_API_KEY}
        )
        
        if response.status_code != 200:
            print(f"     ✗ Fehler beim Laden: {response.text}")
            continue
        
        metadata = response.json()
        doc_count = metadata['document_count']
        print(f"     → {doc_count} Dokumente gefunden")
        
        # Sende Metadaten an Vercel API
        print(f"     → Sende Metadaten an Bauki...")
        
        try:
            vercel_response = requests.post(
                f"{VERCEL_API_URL}/api/admin/elo-archives/import",
                headers={"X-API-Key": VERCEL_API_KEY},
                json={
                    'archive_name': archive['name'],
                    'archive_type': archive['type'],
                    'metadata': metadata['metadata']
                },
                timeout=60
            )
            
            if vercel_response.status_code == 200:
                print(f"     ✓ Metadaten erfolgreich importiert")
                total_documents += doc_count
            else:
                print(f"     ✗ Fehler: {vercel_response.text}")
        except Exception as e:
            print(f"     ✗ Verbindungsfehler zu Bauki: {e}")
        
        time.sleep(1)  # Kurze Pause zwischen Archives
    
    print("\n" + "=" * 60)
    print(f"Import abgeschlossen!")
    print(f"Gesamt: {total_documents} Dokumente")
    print("=" * 60)

if __name__ == '__main__':
    import_metadata()
