import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Get user profile with token count
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  // Get token usage history
  const { data: tokenHistory } = await supabase
    .from("token_usage")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const handleLogout = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dein Bauki Dashboard</h1>
          <form action={handleLogout}>
            <Button variant="outline" type="submit">
              Abmelden
            </Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deine Bauklötze 🧱</CardTitle>
            <CardDescription>Nutze deine Bauklötze für Fragen und Beratung</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-primary">{profile?.tokens ?? 0}</div>
              <div className="text-sm text-muted-foreground">verfügbare Bauklötze</div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">E-Mail: {user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutzungsverlauf</CardTitle>
            <CardDescription>Deine letzten Aktivitäten</CardDescription>
          </CardHeader>
          <CardContent>
            {tokenHistory && tokenHistory.length > 0 ? (
              <div className="space-y-3">
                {tokenHistory.map((usage) => (
                  <div key={usage.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{usage.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(usage.created_at).toLocaleString("de-DE")}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-red-500">-{usage.tokens_used} 🧱</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Noch keine Aktivitäten</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bauki nutzen</CardTitle>
            <CardDescription>Stelle deine ersten Fragen</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/chat">Zum Chat mit Bauki</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
