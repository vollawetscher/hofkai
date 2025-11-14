import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, FileText, Coins, ShieldCheck, Settings } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  const { data: eloSetting } = await supabase
    .from("system_settings")
    .select("setting_value")
    .eq("setting_key", "elo_documents_enabled")
    .single()

  const eloEnabled = eloSetting?.setting_value === "true"

  // Get all users
  const { data: allUsers } = await supabase.from("user_profiles").select("*")

  // Get all posts
  const { data: allPosts } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })

  // Get all token usage
  const { data: allTokenUsage } = await supabase
    .from("token_usage")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  // Get all consultation requests
  const { data: consultationRequests } = await supabase
    .from("consultation_requests")
    .select("*")
    .order("created_at", { ascending: false })

  const userEmailMap = new Map(allUsers?.map(u => [u.id, u.email]) || [])

  const totalUsers = allUsers?.length || 0
  const totalPosts = allPosts?.length || 0
  const totalTokensUsed = allTokenUsage?.reduce((sum, usage) => sum + (usage.tokens_used || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#0B6E99]" />
              <span className="text-xl font-bold text-[#0B6E99]">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/setup">Setup</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/documents">ELO Dokumente</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/elo-import">Massen-Import</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Zurück zum Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Willkommen, Admin</h1>
          <p className="text-gray-600">Hier siehst du alle wichtigen Statistiken und Daten</p>
        </div>

        <Card className="mb-8 p-6 border-2 border-[#0B6E99]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B6E99]/10">
                <Settings className="h-6 w-6 text-[#0B6E99]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">ELO-Dokumentensuche</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Steuere, ob Bauki auf hochgeladene ELO-Dokumente zugreift
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      eloEnabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Status: {eloEnabled ? "AKTIV ✓" : "INAKTIV"}
                  </div>
                  <form action="/api/admin/toggle-elo" method="POST">
                    <Button
                      type="submit"
                      variant={eloEnabled ? "outline" : "default"}
                      className={eloEnabled ? "" : "bg-[#0B6E99] hover:bg-[#0B6E99]/90"}
                    >
                      {eloEnabled ? "ELO deaktivieren" : "ELO aktivieren"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Hinweis:</strong> Mit dieser Einstellung kannst du die Antwortqualität vergleichen:
            </p>
            <ul className="mt-2 ml-4 text-sm text-gray-700 list-disc space-y-1">
              <li><strong>ELO AKTIV:</strong> Bauki durchsucht hochgeladene Dokumente und nutzt diese als verlässliche Quellen</li>
              <li><strong>ELO INAKTIV:</strong> Bauki antwortet nur mit allgemeinem KI-Wissen</li>
            </ul>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B6E99]/10">
                <Users className="h-6 w-6 text-[#0B6E99]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gesamte Nutzer</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#74A57F]/10">
                <FileText className="h-6 w-6 text-[#74A57F]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Community Posts</p>
                <p className="text-3xl font-bold text-gray-900">{totalPosts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7C948]/10">
                <Coins className="h-6 w-6 text-[#F7C948]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bauklötze verwendet</p>
                <p className="text-3xl font-bold text-gray-900">{totalTokensUsed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* All Users */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Alle Nutzer</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">E-Mail</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">Bauklötze</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">Erstellt am</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">Admin</th>
                </tr>
              </thead>
              <tbody>
                {allUsers?.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 text-sm">{user.email}</td>
                    <td className="py-3 text-sm">{user.tokens} 🧱</td>
                    <td className="py-3 text-sm">{new Date(user.created_at).toLocaleDateString("de-DE")}</td>
                    <td className="py-3 text-sm">{user.is_admin ? "✓" : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Token Usage */}
        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Token-Verlauf (letzte 50)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">Nutzer</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">Aktion</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">Bauklötze</th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-600">Datum</th>
                </tr>
              </thead>
              <tbody>
                {allTokenUsage?.map((usage) => (
                  <tr key={usage.id} className="border-b">
                    <td className="py-3 text-sm">{userEmailMap.get(usage.user_id) || 'Unbekannt'}</td>
                    <td className="py-3 text-sm">{usage.action}</td>
                    <td className="py-3 text-sm">-{usage.tokens_used} 🧱</td>
                    <td className="py-3 text-sm">{new Date(usage.created_at).toLocaleString("de-DE")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Consultation Requests */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Beratungsanfragen</h2>
          <div className="space-y-4">
            {consultationRequests?.map((request) => (
              <div key={request.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{request.name}</p>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    {request.phone && <p className="text-sm text-gray-600">{request.phone}</p>}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">Projekttyp:</span> {request.project_type}
                </p>
                <p className="mt-1 text-sm text-gray-700">{request.description}</p>
                <p className="mt-2 text-xs text-gray-500">{new Date(request.created_at).toLocaleString("de-DE")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
