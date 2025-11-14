import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DocumentUploadForm from '@/components/admin/document-upload-form'

export default async function DocumentUploadPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Admin-Check
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/documents">
            <Button variant="outline" className="mb-4">
              ← Zurück zur Übersicht
            </Button>
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle>Dokumente hochladen</CardTitle>
              <CardDescription>
                Lade Dokumente aus deiner ELO-Datenbank hoch und kategorisiere sie für Baukis Wissensdatenbank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploadForm />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Hinweise zum Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div>
                <strong>Unterstützte Formate:</strong> PDF, DOCX, TXT
              </div>
              <div>
                <strong>Kategorien:</strong> Wähle eine passende Kategorie für bessere Suche
              </div>
              <div>
                <strong>Tags:</strong> Füge Schlagwörter hinzu, um Dokumente leichter zu finden
              </div>
              <div>
                <strong>Textextraktion:</strong> Der Text wird automatisch extrahiert und durchsuchbar gemacht
              </div>
              <div>
                <strong>ELO-Export:</strong> Exportiere Dokumente aus ELO als PDF oder DOCX und lade sie hier hoch
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
