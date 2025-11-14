import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, Users, Plus } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function CommunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch community posts
  const { data: posts } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Hammer className="h-6 w-6 text-[#0B6E99]" />
              <span className="text-xl font-bold text-[#0B6E99]">Bau kein Scheiss</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/chat">Chat</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-balance text-3xl font-bold text-[#0B6E99] md:text-4xl">
                Community & Erfahrungsberichte
              </h1>
              <p className="text-pretty text-lg text-gray-600">
                Tausche dich mit anderen Bauherren aus und profitiere von echten Erfahrungen
              </p>
            </div>
            <Button asChild className="bg-[#74A57F] hover:bg-[#74A57F]/90">
              <Link href="/community/new">
                <Plus className="mr-2 h-4 w-4" />
                Neuer Beitrag
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="border-2 border-gray-100 p-6 transition-all hover:border-[#74A57F]/30">
                  {post.image_url && (
                    <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg">
                      <img
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500">
                        von {post.username} • {new Date(post.created_at).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {post.category}
                    </Badge>
                  </div>
                  <p className="mb-4 text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-gray-100 p-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">Noch keine Beiträge</h3>
                <p className="mb-4 text-gray-600">Sei der Erste und teile deine Erfahrungen mit der Community!</p>
                <Button asChild className="bg-[#74A57F] hover:bg-[#74A57F]/90">
                  <Link href="/community/new">Ersten Beitrag erstellen</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t-2 border-gray-100 bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-center">
              <Hammer className="h-5 w-5 text-[#0B6E99]" />
              <p className="text-sm font-semibold text-gray-700">Lieber zweimal messen als einmal fluchen!</p>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Bau kein Scheiss – Dein ehrlicher Helfer in allen Fragen zum Thema Wohnraum
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
