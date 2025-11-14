'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Loader2, CheckCircle, XCircle, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categories = [
  'Baurecht',
  'Normen & Standards',
  'Kostenplanung',
  'Bauphysik',
  'Statik',
  'Haustechnik',
  'Energetische Sanierung',
  'Brandschutz',
  'Schallschutz',
  'Mietrecht',
  'Immobilienbewertung',
  'Sonstiges'
]

export default function DocumentUploadForm() {
  const router = useRouter()
  const [files, setFiles] = useState<FileList | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [eloId, setEloId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!files || files.length === 0) {
      setStatus('error')
      setMessage('Bitte wähle mindestens eine Datei aus')
      return
    }

    setUploading(true)
    setStatus('idle')
    setMessage('')
    setProgress(0)

    try {
      const formData = new FormData()
      
      // Dateien hinzufügen
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      
      // Metadaten hinzufügen
      formData.append('title', title)
      formData.append('category', category)
      formData.append('tags', tags)
      formData.append('eloId', eloId)

      console.log('[v0] Starting upload of', files.length, 'file(s)')

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload fehlgeschlagen')
      }

      setStatus('success')
      let successMessage = `${data.uploaded} Dokument(e) erfolgreich hochgeladen!`
      if (data.failed > 0) {
        successMessage += ` (${data.failed} fehlgeschlagen)`
      }
      setMessage(successMessage)
      setProgress(100)
      
      console.log('[v0] Upload complete:', data)
      
      // Form zurücksetzen
      setFiles(null)
      setTitle('')
      setTags('')
      setEloId('')
      
      // Nach 2 Sekunden zur Übersicht
      setTimeout(() => {
        router.push('/admin/documents')
      }, 2000)
      
    } catch (error) {
      console.error('[v0] Upload error:', error)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datei-Upload */}
      <div>
        <Label htmlFor="files">Dateien auswählen *</Label>
        <Input
          id="files"
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt,.tif,.tiff,.msg,.eml,image/*"
          onChange={(e) => setFiles(e.target.files)}
          disabled={uploading}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Mehrere Dateien möglich. Unterstützt: PDF, DOCX, TXT, TIF/TIFF (mit OCR), MSG/EML (E-Mails)
        </p>
        {files && files.length > 0 && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <FileText className="w-4 h-4" />
              <span>
                {files.length} Datei(en) ausgewählt 
                {files.length > 0 && ` (${(Array.from(files).reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB)`}
              </span>
            </div>
            {files.length > 100 && (
              <p className="text-xs text-blue-700 mt-2">
                ⚠️ Großer Upload ({files.length} Dateien) - Dies kann mehrere Minuten dauern
              </p>
            )}
          </div>
        )}
      </div>

      {/* Titel */}
      <div>
        <Label htmlFor="title">Titel (optional)</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. DIN 18195 - Abdichtung von Bauwerken"
          disabled={uploading}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Leer lassen, um Dateinamen zu verwenden
        </p>
      </div>

      {/* Kategorie */}
      <div>
        <Label htmlFor="category">Kategorie *</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={uploading}
          required
          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Kategorie wählen...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags">Schlagwörter (optional)</Label>
        <Input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="z.B. Kellerabdichtung, Feuchtigkeitsschutz, DIN"
          disabled={uploading}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Mehrere Tags mit Komma trennen
        </p>
      </div>

      {/* ELO-ID */}
      <div>
        <Label htmlFor="eloId">ELO-ID (optional)</Label>
        <Input
          id="eloId"
          type="text"
          value={eloId}
          onChange={(e) => setEloId(e.target.value)}
          placeholder="z.B. ELO-2024-001234"
          disabled={uploading}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Original-ID aus der ELO-Datenbank zur Referenz
        </p>
      </div>

      {/* Fortschrittsanzeige */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Upload läuft...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Status-Meldung */}
      {status !== 'idle' && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {status === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={uploading || !files || !category}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Wird hochgeladen...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Dokumente hochladen
          </>
        )}
      </Button>
      
      {/* Hinweis für Bulk-Upload */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">💡 Tipp für Bulk-Upload aus ELO Office:</h4>
        <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
          <li>Exportieren Sie Dokumente aus ELO Office in einen Ordner</li>
          <li>Wählen Sie hier alle Dateien gleichzeitig aus (Strg+A oder Mehrfachauswahl)</li>
          <li>Kategorie und Tags gelten für alle ausgewählten Dateien</li>
          <li>TIF/TIFF werden per OCR durchsucht, PDF/DOCX/MSG/EML automatisch verarbeitet</li>
          <li>Bei tausenden Dateien empfehlen wir mehrere Uploads à 200-500 Dateien</li>
        </ol>
      </div>
    </form>
  )
}
