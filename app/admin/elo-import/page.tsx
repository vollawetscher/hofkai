'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, FolderOpen, Upload, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default function EloImportPage() {
  const [importing, setImporting] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<string>('')
  const [stats, setStats] = useState({
    totalFolders: 0,
    completedFolders: 0,
    totalFiles: 0,
    processedFiles: 0,
    failedFiles: 0,
    currentBatch: 0
  })
  const [importLog, setImportLog] = useState<Array<{folder: string, status: string, files: number}>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Gruppiere Dateien nach Ordnern
    const folderMap = new Map<string, File[]>()
    
    files.forEach(file => {
      const path = file.webkitRelativePath || file.name
      const folderPath = path.substring(0, path.lastIndexOf('/')) || 'root'
      
      if (!folderMap.has(folderPath)) {
        folderMap.set(folderPath, [])
      }
      folderMap.get(folderPath)!.push(file)
    })

    console.log('[v0] Gefundene Ordner:', folderMap.size)
    console.log('[v0] Gesamtdateien:', files.length)

    // Starte Import
    await startBatchImport(folderMap)
  }

  const startBatchImport = async (folderMap: Map<string, File[]>) => {
    setImporting(true)
    setStats({
      totalFolders: folderMap.size,
      completedFolders: 0,
      totalFiles: Array.from(folderMap.values()).reduce((sum, files) => sum + files.length, 0),
      processedFiles: 0,
      failedFiles: 0,
      currentBatch: 1
    })

    let completedFolders = 0
    let processedFiles = 0
    let failedFiles = 0

    // Verarbeite Ordner sequentiell
    for (const [folderPath, files] of folderMap.entries()) {
      setCurrentFolder(folderPath)
      console.log(`[v0] Verarbeite Ordner: ${folderPath} (${files.length} Dateien)`)

      try {
        // Verarbeite in Batches von 50 Dateien
        const batchSize = 50
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize)
          
          const formData = new FormData()
          batch.forEach(file => formData.append('files', file))
          formData.append('folder_path', folderPath)
          formData.append('category', extractCategory(folderPath))

          const response = await fetch('/api/documents/batch-upload', {
            method: 'POST',
            body: formData
          })

          if (response.ok) {
            const result = await response.json()
            processedFiles += result.processed || batch.length
            failedFiles += result.failed || 0
          } else {
            failedFiles += batch.length
          }

          // Update Fortschritt
          setStats(prev => ({
            ...prev,
            processedFiles: processedFiles,
            failedFiles: failedFiles
          }))

          // Kleine Pause zwischen Batches
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        completedFolders++
        setImportLog(prev => [...prev, {
          folder: folderPath,
          status: 'success',
          files: files.length
        }])

      } catch (error) {
        console.error(`[v0] Fehler bei Ordner ${folderPath}:`, error)
        failedFiles += files.length
        setImportLog(prev => [...prev, {
          folder: folderPath,
          status: 'error',
          files: files.length
        }])
      }

      setStats(prev => ({
        ...prev,
        completedFolders: completedFolders
      }))
    }

    setImporting(false)
    setCurrentFolder('')
    console.log('[v0] Import abgeschlossen')
  }

  const extractCategory = (folderPath: string): string => {
    // Extrahiere Kategorie aus Ordnername
    const parts = folderPath.split('/')
    // Nimm den ersten Ordner als Hauptkategorie
    return parts[0] || 'Allgemein'
  }

  const overallProgress = stats.totalFiles > 0 
    ? Math.round((stats.processedFiles / stats.totalFiles) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Admin-Dashboard
        </Link>

        <h1 className="text-4xl font-bold mb-2">ELO Office Massen-Import</h1>
        <p className="text-gray-600 mb-8">
          Importiere hunderte Ordner mit tausenden Dokumenten automatisch
        </p>

        {/* Upload-Bereich */}
        <Card className="p-8 mb-6">
          <div className="text-center">
            <FolderOpen className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ordner-Struktur importieren</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">So funktioniert's:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Klicke auf "Ordner auswählen"</li>
                <li>Navigiere zu deinem ELO Office Hauptordner</li>
                <li>Wähle den obersten Ordner aus (enthält alle Unterordner)</li>
                <li>Das System verarbeitet automatisch alle Unterordner</li>
                <li>Die Ordnerstruktur wird als Kategorien übernommen</li>
                <li className="font-semibold text-blue-700">Verschlagwortung wird automatisch aus Ordner- und Dateinamen extrahiert</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2 text-green-800">Automatische Verschlagwortung:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-900">
                <li>Ordnernamen werden als Hauptkategorien verwendet</li>
                <li>Dateinamen werden in Stichwörter zerlegt</li>
                <li>Bau-relevante Begriffe werden automatisch erkannt</li>
                <li>Alle Tags sind später durchsuchbar</li>
              </ul>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              // @ts-ignore - webkitdirectory ist eine Browser-spezifische Eigenschaft
              webkitdirectory="true"
              directory="true"
              onChange={handleFolderSelect}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="mr-2 h-5 w-5" />
              {importing ? 'Import läuft...' : 'Ordner auswählen'}
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              Unterstützte Formate: PDF, DOCX, TIF, TIFF, MSG, EML
            </p>
          </div>
        </Card>

        {/* Fortschrittsanzeige */}
        {importing && (
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Import-Fortschritt</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Gesamtfortschritt</span>
                  <span className="text-sm text-gray-600">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Ordner</p>
                  <p className="text-2xl font-bold">{stats.completedFolders}/{stats.totalFolders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dateien</p>
                  <p className="text-2xl font-bold">{stats.processedFiles}/{stats.totalFiles}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Erfolgreich</p>
                  <p className="text-2xl font-bold text-green-600">{stats.processedFiles - stats.failedFiles}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fehler</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failedFiles}</p>
                </div>
              </div>

              {currentFolder && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Aktueller Ordner:</p>
                  <p className="text-sm text-gray-700 truncate">{currentFolder}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Import-Log */}
        {importLog.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Import-Protokoll</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {importLog.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {entry.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : entry.status === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className="text-sm font-medium truncate max-w-md">{entry.folder}</span>
                  </div>
                  <span className="text-sm text-gray-600">{entry.files} Dateien</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
