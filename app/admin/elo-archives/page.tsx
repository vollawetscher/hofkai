'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Database, Upload, RefreshCw, FolderTree, FileText } from 'lucide-react'

interface Archive {
  id: string
  name: string
  description: string
  mdb_filename: string
  last_sync: string | null
  total_documents: number
  sync_status: string
}

export default function ELOArchivesPage() {
  const [archives, setArchives] = useState<Archive[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newArchive, setNewArchive] = useState({
    name: '',
    description: '',
    mdb_file: null as File | null
  })

  const supabase = createClient()

  useEffect(() => {
    loadArchives()
  }, [])

  async function loadArchives() {
    const { data, error } = await supabase
      .from('elo_archives')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setArchives(data)
    }
    setLoading(false)
  }

  async function handleArchiveUpload() {
    if (!newArchive.name || !newArchive.mdb_file) {
      alert('Bitte Name und .mdb-Datei auswählen')
      return
    }

    setUploading(true)

    try {
      // 1. Upload .mdb file to Blob storage
      const formData = new FormData()
      formData.append('file', newArchive.mdb_file)
      formData.append('name', newArchive.name)
      formData.append('description', newArchive.description)

      const response = await fetch('/api/admin/elo-archives/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        alert('Archiv erfolgreich hochgeladen! Synchronisation läuft im Hintergrund.')
        setNewArchive({ name: '', description: '', mdb_file: null })
        loadArchives()
      } else {
        const error = await response.text()
        alert('Fehler beim Upload: ' + error)
      }
    } catch (error) {
      alert('Fehler: ' + error)
    } finally {
      setUploading(false)
    }
  }

  async function syncArchive(archiveId: string) {
    const response = await fetch('/api/admin/elo-archives/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archiveId })
    })

    if (response.ok) {
      alert('Synchronisation gestartet')
      loadArchives()
    } else {
      alert('Fehler bei der Synchronisation')
    }
  }

  if (loading) {
    return <div className="p-8">Lädt Archive...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">ELO Archive verwalten</h1>
          <p className="text-muted-foreground">
            Importieren Sie Ihre ELO Office .mdb-Datenbanken mit der kompletten Aktenstruktur
          </p>
        </div>

        {/* Upload neue Archive */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Neues ELO-Archiv hinzufügen
            </CardTitle>
            <CardDescription>
              .mdb-Datei aus C:\Program Files (x86)\ELOoffice\Archive hochladen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="archive-name">Archiv-Name</Label>
              <Input
                id="archive-name"
                placeholder="z.B. Hauptarchiv 2024"
                value={newArchive.name}
                onChange={(e) => setNewArchive({ ...newArchive, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="archive-description">Beschreibung (optional)</Label>
              <Textarea
                id="archive-description"
                placeholder="z.B. Bauakten und Projektdokumentation"
                value={newArchive.description}
                onChange={(e) => setNewArchive({ ...newArchive, description: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="mdb-file">.mdb-Datei auswählen</Label>
              <Input
                id="mdb-file"
                type="file"
                accept=".mdb"
                onChange={(e) => setNewArchive({ ...newArchive, mdb_file: e.target.files?.[0] || null })}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Typischerweise unter: C:\Program Files (x86)\ELOoffice\Archive\*.mdb
              </p>
            </div>

            <Button 
              onClick={handleArchiveUpload} 
              disabled={uploading || !newArchive.name || !newArchive.mdb_file}
              className="w-full"
            >
              {uploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Lädt hoch und analysiert...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Archiv hochladen und importieren
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Vorhandene Archive */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Vorhandene Archive ({archives.length})</h2>
          <div className="grid gap-4">
            {archives.map((archive) => (
              <Card key={archive.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      {archive.name}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {archive.sync_status === 'completed' ? '✓ Synchronisiert' : 
                       archive.sync_status === 'syncing' ? '⟳ Läuft...' : 
                       '○ Ausstehend'}
                    </span>
                  </CardTitle>
                  <CardDescription>{archive.description || 'Keine Beschreibung'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Datei:</p>
                      <p className="font-medium">{archive.mdb_filename}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dokumente:</p>
                      <p className="font-medium">{archive.total_documents.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Letzte Sync:</p>
                      <p className="font-medium">
                        {archive.last_sync ? new Date(archive.last_sync).toLocaleDateString('de-DE') : 'Nie'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => syncArchive(archive.id)}
                      className="flex-1"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Neu synchronisieren
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = `/admin/elo-archives/${archive.id}/structure`}
                      className="flex-1"
                    >
                      <FolderTree className="mr-2 h-4 w-4" />
                      Struktur anzeigen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {archives.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Noch keine Archive importiert</p>
                  <p className="text-sm mt-2">Laden Sie Ihre erste .mdb-Datei hoch</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
