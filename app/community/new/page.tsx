import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, ArrowLeft } from "lucide-react"
import { NewPostForm } from "@/components/community/new-post-form"

export default async function NewCommunityPostPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Get user profile for username
  const { data: profile } = await supabase.from("user_profiles").select("email").eq("id", user.id).single()

  const username = profile?.email?.split("@")[0] || "Unbekannt"

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
                <Link href="/community">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-balance text-3xl font-bold text-[#0B6E99] md:text-4xl">Neuer Beitrag erstellen</h1>
            <p className="text-pretty text-lg text-gray-600">Teile deine Erfahrungen mit der Community</p>
          </div>

          <NewPostForm userId={user.id} username={username} />
        </div>
      </div>
    </div>
  )
}
