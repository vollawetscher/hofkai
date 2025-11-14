import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json()

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user has tokens
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("tokens")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (profile.tokens <= 0) {
      return NextResponse.json({ error: "No tokens available" }, { status: 403 })
    }

    // Deduct token
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ tokens: profile.tokens - 1 })
      .eq("id", userId)

    if (updateError) {
      return NextResponse.json({ error: "Failed to deduct token" }, { status: 500 })
    }

    // Log token usage
    const { error: logError } = await supabase.from("token_usage").insert({
      user_id: userId,
      action,
      tokens_used: 1,
    })

    if (logError) {
      console.error("Failed to log token usage:", logError)
    }

    return NextResponse.json({ success: true, remainingTokens: profile.tokens - 1 })
  } catch (error) {
    console.error("Error in use-token API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
