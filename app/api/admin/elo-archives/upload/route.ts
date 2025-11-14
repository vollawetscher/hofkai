import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { put } from '@vercel/blob'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!file || !name) {
      return NextResponse.json({ error: 'Datei und Name erforderlich' }, { status: 400 })
    }

    // Upload .mdb to Blob storage
    const blob = await put(`elo-archives/${file.name}`, file, {
      access: 'public',
    })

    // Create archive entry
    const { data: archive, error } = await supabase
      .from('elo_archives')
      .insert({
        name,
        description,
        mdb_filename: file.name,
        sync_status: 'pending'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // TODO: Trigger background job to parse .mdb and extract structure
    // This would need a separate worker/serverless function that:
    // 1. Downloads the .mdb from blob storage
    // 2. Uses mdb-tools or similar to read Access database
    // 3. Extracts OBJEKTE, AKTEN, STICHW tables
    // 4. Reconstructs the hierarchical structure
    // 5. Imports documents with correct metadata

    console.log('[v0] MDB uploaded:', blob.url, 'Archive ID:', archive.id)

    return NextResponse.json({ 
      success: true, 
      archiveId: archive.id,
      message: 'Archiv hochgeladen. Parser wird implementiert.'
    })

  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload fehlgeschlagen: ' + (error as Error).message 
    }, { status: 500 })
  }
}
