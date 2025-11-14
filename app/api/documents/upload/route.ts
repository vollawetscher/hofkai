import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { createClient } from '@/lib/supabase/server'

async function extractTextFromImage(buffer: ArrayBuffer): Promise<string> {
  // Für TIF-Dateien - in Produktion würde man eine OCR-API nutzen
  // z.B. Google Cloud Vision, AWS Textract, oder Azure Computer Vision
  // Hier ein Platzhalter für die OCR-Integration
  
  try {
    // TODO: OCR-API Integration hier
    // Beispiel mit Google Cloud Vision:
    // const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {...})
    
    return '[OCR-Texterkennung wird in Kürze hinzugefügt - Datei wurde erfolgreich hochgeladen]'
  } catch (error) {
    console.error('[v0] OCR error:', error)
    return '[Texterkennung fehlgeschlagen - Datei manuell prüfen]'
  }
}

async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  // Vereinfachte PDF-Extraktion
  // In Produktion würde man pdf-parse oder ähnliches nutzen
  const text = new TextDecoder().decode(buffer)
  return text
}

async function extractTextFromEmail(buffer: ArrayBuffer, extension: string): Promise<string> {
  try {
    // MSG und EML sind meist Text-basiert oder MIME-Format
    const text = new TextDecoder('utf-8').decode(buffer)
    // Extrahiere Betreff, Von, An, Body aus E-Mail
    const subjectMatch = text.match(/Subject: ([^\n\r]+)/i)
    const fromMatch = text.match(/From: ([^\n\r]+)/i)
    const dateMatch = text.match(/Date: ([^\n\r]+)/i)
    
    let extracted = ''
    if (subjectMatch) extracted += `Betreff: ${subjectMatch[1]}\n`
    if (fromMatch) extracted += `Von: ${fromMatch[1]}\n`
    if (dateMatch) extracted += `Datum: ${dateMatch[1]}\n\n`
    
    // Versuche Body zu extrahieren (vereinfacht)
    const bodyMatch = text.match(/\n\n([\s\S]+)$/m)
    if (bodyMatch) extracted += bodyMatch[1]
    
    return extracted || '[E-Mail-Inhalt konnte nicht extrahiert werden]'
  } catch (error) {
    console.error('[v0] Email extraction error:', error)
    return '[E-Mail-Extraktion fehlgeschlagen]'
  }
}

async function extractTextFromDOCX(buffer: ArrayBuffer): Promise<string> {
  try {
    // DOCX ist ein ZIP-Archiv mit XML-Dateien
    // In Produktion würde man mammoth.js oder docx-parser nutzen
    // Hier vereinfachte Text-Extraktion
    const text = new TextDecoder().decode(buffer)
    // Suche nach XML-Content zwischen Tags
    const matches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g)
    if (matches) {
      return matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ')
    }
    return '[DOCX-Text verfügbar - OCR/Parser in Entwicklung]'
  } catch (error) {
    console.error('[v0] DOCX extraction error:', error)
    return '[DOCX-Extraktion fehlgeschlagen]'
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Auth-Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin-Check
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const tagsString = formData.get('tags') as string
    const eloId = formData.get('eloId') as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const tags = tagsString ? tagsString.split(',').map(t => t.trim()).filter(Boolean) : []
    
    const uploadedDocuments = []
    const errors = []

    console.log(`[v0] Starting batch upload of ${files.length} file(s)`)

    const BATCH_SIZE = 50

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)
      console.log(`[v0] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(files.length / BATCH_SIZE)}`)
      
      const batchPromises = batch.map(async (file) => {
        try {
          console.log(`[v0] Processing: ${file.name}`)
          
          // Zu Vercel Blob hochladen
          const blob = await put(`documents/${Date.now()}-${file.name}`, file, {
            access: 'public',
          })

          const buffer = await file.arrayBuffer()
          let extractedText = ''
          
          const fileExtension = file.name.toLowerCase().split('.').pop()
          
          if (fileExtension === 'tif' || fileExtension === 'tiff' || file.type.includes('image')) {
            extractedText = await extractTextFromImage(buffer)
          } else if (fileExtension === 'pdf' || file.type === 'application/pdf') {
            extractedText = await extractTextFromPDF(buffer)
          } else if (fileExtension === 'msg' || fileExtension === 'eml') {
            extractedText = await extractTextFromEmail(buffer, fileExtension)
          } else if (fileExtension === 'docx') {
            extractedText = await extractTextFromDOCX(buffer)
          } else if (fileExtension === 'txt' || file.type.includes('text')) {
            extractedText = new TextDecoder().decode(buffer)
          } else {
            extractedText = '[Unbekanntes Dateiformat - Datei gespeichert, kein Text extrahiert]'
          }
          
          // In Datenbank speichern
          const { data: document, error } = await supabase
            .from('documents')
            .insert({
              filename: blob.pathname,
              original_filename: file.name,
              file_size: file.size,
              file_type: file.type || 'application/octet-stream',
              blob_url: blob.url,
              extracted_text: extractedText.substring(0, 50000), // Max 50k Zeichen für Suche
              title: title || file.name.replace(/\.[^/.]+$/, ''), // Dateiname ohne Extension
              category,
              tags,
              elo_id: eloId || null,
              uploaded_by: user.id,
              is_active: true
            })
            .select()
            .single()

          if (error) {
            console.error('[v0] Database error for', file.name, ':', error)
            return { success: false, file: file.name, error: error.message }
          }

          console.log(`[v0] ✓ Uploaded: ${file.name}`)
          return { success: true, document }
          
        } catch (error) {
          console.error('[v0] Error with', file.name, ':', error)
          return { 
            success: false, 
            file: file.name, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      
      batchResults.forEach(result => {
        if (result.success) {
          uploadedDocuments.push(result.document)
        } else {
          errors.push({ file: result.file, error: result.error })
        }
      })
    }

    console.log(`[v0] Batch upload complete: ${uploadedDocuments.length} successful, ${errors.length} errors`)

    return NextResponse.json({ 
      success: true, 
      uploaded: uploadedDocuments.length,
      failed: errors.length,
      documents: uploadedDocuments,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
