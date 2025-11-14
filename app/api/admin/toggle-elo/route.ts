import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { data: currentSetting } = await supabase
    .from("system_settings")
    .select("setting_value")
    .eq("setting_key", "elo_documents_enabled")
    .single()

  const newValue = currentSetting?.setting_value === "true" ? "false" : "true"

  const { error } = await supabase
    .from("system_settings")
    .update({
      setting_value: newValue,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("setting_key", "elo_documents_enabled")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ 
    success: true, 
    elo_enabled: newValue === "true" 
  })
}
