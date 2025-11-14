import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if setup is already done
  const { data: existingTables } = await supabase
    .from('user_profiles')
    .select('id')
    .limit(1)

  const isSetupComplete = !!existingTables

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="h-8 w-8 text-[#0B6E99]" />
            Datenbank Setup
          </h1>
          <p className="text-gray-600 mt-2">
            Initialisiere die Bauki-Datenbank mit allen benötigten Tabellen
          </p>
        </div>

        {isSetupComplete ? (
          <Card className="p-6 border-2 border-green-500 bg-green-50">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-green-900">Setup bereits abgeschlossen</h2>
                <p className="text-green-700 mt-2">
                  Die Datenbank ist bereits eingerichtet und einsatzbereit.
                </p>
                <Button asChild className="mt-4 bg-[#0B6E99] hover:bg-[#0B6E99]/90">
                  <a href="/admin">Zum Admin-Dashboard</a>
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6 border-2 border-yellow-500 bg-yellow-50 mb-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-yellow-900">Setup erforderlich</h2>
                  <p className="text-yellow-700 mt-2">
                    Die Datenbank muss noch eingerichtet werden. Dies erstellt alle benötigten Tabellen und Daten.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Was wird erstellt?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0B6E99] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Benutzerprofile:</strong> Verwaltung von Nutzern mit Admin-Rechten und Bauklötzen
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0B6E99] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Token-System:</strong> Tracking von Bauklötzen-Nutzung
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0B6E99] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Community:</strong> Posts, Kommentare und Bilder
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0B6E99] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Beratungsanfragen:</strong> Verwaltung von Individualberatungen
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0B6E99] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>ELO-Integration:</strong> Dokumentenverwaltung und Aktenstruktur
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0B6E99] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>8 Beispiel-Posts:</strong> Hochwertige Community-Beiträge zum Start
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0B6E99] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Admin-Account:</strong> hofkai@googlemail.com erhält Admin-Rechte und unbegrenzte Bauklötze
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Wichtig:</h3>
              <p className="text-blue-800 text-sm">
                Das Setup dauert nur wenige Sekunden. Nach erfolgreichem Abschluss wird die Seite automatisch neu geladen.
              </p>
            </Card>

            <div className="mt-8 flex gap-4">
              <form action="/api/admin/run-setup" method="POST" className="flex-1">
                <Button
                  type="submit"
                  className="w-full bg-[#0B6E99] hover:bg-[#0B6E99]/90 h-14 text-lg font-semibold"
                >
                  Setup jetzt starten
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
