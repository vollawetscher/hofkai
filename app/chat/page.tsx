import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, ShieldCheck, Calculator, Users } from 'lucide-react'
import { ChatInterface } from "@/components/chat-interface"
import Image from "next/image"
import { Card } from "@/components/ui/card"

export default async function ChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  const tokens = profile?.is_admin ? "∞" : (profile?.tokens ?? 0)
  const isAdmin = profile?.is_admin ?? false

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
              {isAdmin && (
                <Button variant="outline" className="border-[#0B6E99] text-[#0B6E99] bg-transparent" asChild>
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              )}
              <div className="rounded-lg border-2 border-[#F7C948] bg-[#F7C948]/10 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#0B6E99]">{tokens}</span>
                  <span className="text-sm text-gray-600">🧱 Bauklötze</span>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/photo-2025-11-13-14-11-36.jpg"
                alt="Bauki - Dein Helfer"
                width={120}
                height={120}
                className="bg-white rounded-lg p-2 shadow-md"
              />
            </div>
            <h1 className="mb-2 text-balance text-3xl font-bold text-[#0B6E99] md:text-4xl">Frag Bauki</h1>
            <p className="text-pretty text-lg text-gray-600">
              Dein ehrlicher Helfer in allen Fragen zum Thema Wohnraum – immer für dich da
            </p>
          </div>

          {/* Main Chat Interface */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Chat Interface */}
            <div className="lg:col-span-2">
              <ChatInterface userId={user.id} tokens={typeof tokens === "string" ? 999999 : tokens} isAdmin={isAdmin} />

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  💡 <span className="font-semibold">Tipp:</span> Stelle präzise Fragen, um das Beste aus deinen
                  Bauklötzen zu machen!
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0B6E99]">Premium Features</h2>

              {/* Baufehler vermeiden */}
              <Card className="border-2 border-[#0B6E99]/20 p-4 transition-all hover:border-[#0B6E99]/40 hover:shadow-xl hover:scale-[1.02] cursor-default">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B6E99]/10">
                    <ShieldCheck className="h-5 w-5 text-[#0B6E99]" />
                  </div>
                  <h3 className="font-bold text-gray-900">Baufehler vermeiden</h3>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  Lerne aus den Fehlern anderer. Zugriff auf umfassende Fehler-Datenbank.
                </p>
                <div className="mb-3 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Beispiel:</span> "Die 10 häufigsten Fehler bei der Dämmung"
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#0B6E99]">Jetzt verfügbar</span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#0B6E99] hover:bg-[#0B6E99]/80 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Link href="/expertenwissen">Zum Expertenwissen</Link>
                  </Button>
                </div>
              </Card>

              {/* Checklisten & Kostenrechner */}
              <Card className="border-2 border-[#74A57F]/20 p-4 transition-all hover:border-[#74A57F]/40 hover:shadow-xl hover:scale-[1.02] cursor-default">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#74A57F]/10">
                    <Calculator className="h-5 w-5 text-[#74A57F]" />
                  </div>
                  <h3 className="font-bold text-gray-900">Checklisten & Rechner</h3>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  Professionelle Checklisten und interaktive Kostenrechner für dein Projekt.
                </p>
                <div className="mb-3 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Beispiel:</span> "Badezimmer-Sanierung Checkliste"
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#74A57F]">Jetzt verfügbar</span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#74A57F] hover:bg-[#74A57F]/80 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Link href="/checklisten">Zu Checklisten</Link>
                  </Button>
                </div>
              </Card>

              {/* Community */}
              <Card className="border-2 border-[#74A57F]/20 p-4 transition-all hover:border-[#74A57F]/40 hover:shadow-xl hover:scale-[1.02] cursor-default">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#74A57F]/10">
                    <Users className="h-5 w-5 text-[#74A57F]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">Community & Berichte</h3>
                    <span className="text-xs font-bold text-[#74A57F]">KOSTENLOS</span>
                  </div>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  Tausche dich mit anderen Bauherren aus und teile deine Erfahrungen.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-[#74A57F] hover:bg-[#74A57F]/80 hover:scale-105 transition-all cursor-pointer"
                >
                  <Link href="/community">Zur Community</Link>
                </Button>
              </Card>

              {/* Individualberatung */}
              <Card className="border-2 border-[#0B6E99]/20 p-4 transition-all hover:border-[#0B6E99]/40 hover:shadow-xl hover:scale-[1.02] cursor-default">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B6E99]/10">
                    <Users className="h-5 w-5 text-[#0B6E99]" />
                  </div>
                  <h3 className="font-bold text-gray-900">Individualberatung</h3>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  Persönliche Beratung für dein spezifisches Projekt – individuell auf deine Bedürfnisse zugeschnitten.
                </p>
                <div className="mb-3 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Auf Anfrage:</span> Wir vereinbaren einen individuellen Termin
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-[#0B6E99] hover:bg-[#0B6E99]/80 hover:scale-105 transition-all cursor-pointer"
                >
                  <Link href="/consultation">Anfrage senden</Link>
                </Button>
              </Card>

              <Card className="border-2 border-[#0B6E99] bg-[#0B6E99]/5 p-4">
                <h3 className="mb-2 font-bold text-[#0B6E99]">Bauklötze aufstocken</h3>
                <p className="mb-3 text-sm text-gray-600">Benötigst du mehr Bauklötze? Einfach nachkaufen!</p>
                <div className="mb-3 rounded-lg bg-white p-3 text-center">
                  <p className="text-2xl font-bold text-[#0B6E99]">1 🧱 = 1 €</p>
                </div>
                <Button className="w-full bg-[#F7C948] font-semibold text-gray-900 hover:bg-[#F7C948]/80 hover:scale-105 transition-all cursor-pointer">
                  Mit PayPal kaufen
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t-2 border-gray-100 bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#impressum" className="text-gray-600 transition-colors hover:text-[#0B6E99]">
                Impressum
              </a>
              <a href="#datenschutz" className="text-gray-600 transition-colors hover:text-[#0B6E99]">
                Datenschutz
              </a>
              <a href="#kontakt" className="text-gray-600 transition-colors hover:text-[#0B6E99]">
                Kontakt
              </a>
            </div>

            <div className="flex items-center gap-2 text-center">
              <Hammer className="h-5 w-5 text-[#0B6E99]" />
              <p className="text-sm font-semibold text-gray-700">Lieber zweimal messen als einmal fluchen!</p>
            </div>

            <p className="text-sm text-gray-500">© 2025 Bau kein Scheiss – Dein ehrlicher Helfer</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
