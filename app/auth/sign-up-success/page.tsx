import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Vielen Dank für deine Registrierung!</CardTitle>
            <CardDescription>Bestätige deine E-Mail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Du hast dich erfolgreich bei Bauki registriert! Bitte überprüfe deine E-Mail und bestätige deinen Account.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Hinweis:</strong> Die Bestätigungs-E-Mail kommt von unserem E-Mail-Service-Provider und kann
              "Supabase" im Absender enthalten. Dies ist unser technischer Dienstleister für sichere Authentifizierung.
            </p>
            <p className="text-sm font-medium text-primary">
              🧱 Nach der Bestätigung erhältst du 10 kostenlose Bauklötze!
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Zur Anmeldung</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
