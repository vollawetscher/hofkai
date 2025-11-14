import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Admin-Check
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

  const settings = await request.json()

  // Speichere Einstellungen (Passwort sollte verschlüsselt werden)
  const { error } = await supabase
    .from('system_settings')
    .update({
      elo_db_type: settings.elo_db_type,
      elo_db_host: settings.elo_db_host,
      elo_db_port: settings.elo_db_port,
      elo_db_name: settings.elo_db_name,
      elo_db_user: settings.elo_db_user,
      // TODO: Passwort verschlüsseln bevor es gespeichert wird
      elo_db_password_encrypted: settings.elo_db_password,
    })
    .eq('id', 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
