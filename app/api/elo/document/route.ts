import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const LOCAL_ELO_SERVER = process.env.LOCAL_ELO_SERVER_URL || 'http://localhost:5000'
const LOCAL_ELO_API_KEY = process.env.LOCAL_ELO_API_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const archive = searchParams.get('archive')
    const filename = searchParams.get('filename')
    
    if (!archive || !filename) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const response = await fetch(
      `${LOCAL_ELO_SERVER}/api/archives/${archive}/document/${filename}`,
      {
        headers: {
          'X-API-Key': LOCAL_ELO_API_KEY
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const documentData = await response.json()

    // This can be implemented later for performance optimization

    return NextResponse.json(documentData)

  } catch (error) {
    console.error('[v0] Error fetching ELO document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
