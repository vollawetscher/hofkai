import { createClient } from '@/lib/supabase/server'
import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { 
  extractKeywordsFromPath, 
  extractKeywordsFromFilename, 
  extractKeywordsFromText,
  combineAndDeduplicateKeywords 
} from '@/lib/extract-keywords'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    // Admin check
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folderPath = formData.get('folder_path') as string
    const category = formData.get('category') as string || 'Allgemein'

    console.log(`[v0] Batch-Upload: ${files.length} Dateien aus ${folderPath}`)

    let processed = 0
    let failed = 0

    // Verarbeite alle Dateien parallel (bis zu 10 gleichzeitig)
    const batchSize = 10
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize)
      
      const results = await Promise.allSettled(
        batch.map(async (file) => {
          try {
            // Upload zu Blob
            const blob = await put(file.name, file, {
              access: 'public',
              addRandomSuffix: true
            })

            // Extrahiere Text (vereinfacht für Performance)
            let extractedText = ''
            const fileType = file.type.toLowerCase()
            
            if (fileType.includes('pdf')) {
              extractedText = '[PDF-Inhalt - Text wird nachträglich extrahiert]'
            } else if (fileType.includes('word') || file.name.endsWith('.docx')) {
              extractedText = '[Word-Dokument - Text wird nachträglich extrahiert]'
            } else if (file.name.endsWith('.msg') || file.name.endsWith('.eml')) {
              extractedText = '[E-Mail - Text wird nachträglich extrahiert]'
            } else if (file.name.endsWith('.tif') || file.name.endsWith('.tiff')) {
              extractedText = '[TIFF-Bild - OCR wird nachträglich durchgeführt]'
            }

            const pathKeywords = extractKeywordsFromPath(folderPath)
            const filenameKeywords = extractKeywordsFromFilename(file.name)
            const textKeywords = extractKeywordsFromText(extractedText)
            
            // Kombiniere alle Keywords und füge Kategorie hinzu
            const allTags = combineAndDeduplicateKeywords(
              [category],
              pathKeywords,
              filenameKeywords,
              textKeywords
            )

            console.log(`[v0] Extrahierte Tags für ${file.name}:`, allTags)

            // In Datenbank speichern
            const { error: dbError } = await supabase
              .from('documents')
              .insert({
                filename: file.name,
                original_filename: file.name,
                file_size: file.size,
                file_type: file.type || 'application/octet-stream',
                blob_url: blob.url,
                extracted_text: extractedText,
                title: file.name.replace(/\.[^.]+$/, ''), // Dateiname ohne Endung
                category,
                tags: allTags,
                elo_category: pathKeywords[0] || category, // Erster Ordnername als ELO-Kategorie
                uploaded_by: user.id
              })

            if (dbError) throw dbError
            return { success: true }
          } catch (error) {
            console.error('[v0] Fehler bei Datei:', file.name, error)
            return { success: false, error }
          }
        })
      )

      // Zähle Erfolge und Fehler
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.success) {
          processed++
        } else {
          failed++
        }
      })
    }

    console.log(`[v0] Batch abgeschlossen: ${processed} erfolgreich, ${failed} fehlgeschlagen`)

    return NextResponse.json({
      processed,
      failed,
      folderPath,
      category
    })

  } catch (error) {
    console.error('[v0] Batch-Upload Fehler:', error)
    return NextResponse.json(
      { error: 'Upload fehlgeschlagen', details: error instanceof Error ? error.message : 'Unbekannter Fehler' },
      { status: 500 }
    )
  }
}
