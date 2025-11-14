"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

export function TokenDisplay() {
  const [tokens, setTokens] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase.from("user_profiles").select("tokens").eq("id", user.id).single()

        if (data) {
          setTokens(data.tokens)
        }
      }
      setIsLoading(false)
    }

    fetchTokens()

    // Set up real-time subscription for token updates
    const supabase = createClient()
    const channel = supabase
      .channel("token-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_profiles",
        },
        (payload) => {
          setTokens(payload.new.tokens)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (isLoading) {
    return null
  }

  if (tokens === null) {
    return null
  }

  return (
    <Badge variant="secondary" className="gap-1">
      🧱 {tokens} Bauklötze
    </Badge>
  )
}
