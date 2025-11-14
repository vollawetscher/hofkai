import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, Trash2, Download } from 'lucide-react'

export default async function AdminDocumentsPage() {
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

  // Dokumente laden
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  // Statistiken
  const totalDocs = documents?.length || 0
  const totalSize = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0
  const categories = [...new Set(documents?.map(d => d.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="outline" className="mb-4">
              ← Zurück zum Admin-Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dokumenten-Verwaltung</h1>
          <p className="text-gray-600">Verwalte deine ELO-Baudokumente für Baukis Wissensdatenbank</p>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{totalDocs}</CardTitle>
              <CardDescription>Dokumente gesamt</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{(totalSize / 1024 / 1024).toFixed(2)} MB</CardTitle>
              <CardDescription>Gesamtgröße</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{categories.length}</CardTitle>
              <CardDescription>Kategorien</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Upload-Bereich */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Dokumente hochladen
            </CardTitle>
            <CardDescription>
              Lade Dokumente aus deiner ELO-Datenbank hoch. Unterstützt: PDF, DOCX, TXT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/documents/upload">
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                <Upload className="w-4 h-4 mr-2" />
                Neue Dokumente hochladen
              </Button>
            </Link>
            <Link href="/admin/elo-import" className="ml-4">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Massen-Import (hunderte Ordner)
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Dokumenten-Liste */}
        <Card>
          <CardHeader>
            <CardTitle>Hochgeladene Dokumente</CardTitle>
            <CardDescription>
              {totalDocs > 0 ? `${totalDocs} Dokumente verfügbar` : 'Noch keine Dokumente hochgeladen'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{doc.title || doc.original_filename}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>{doc.category || 'Unkategorisiert'}</span>
                          <span>•</span>
                          <span>{(doc.file_size / 1024).toFixed(2)} KB</span>
                          <span>•</span>
                          <span>{new Date(doc.created_at).toLocaleDateString('de-DE')}</span>
                        </div>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {doc.tags.map((tag, i) => (
                              <span key={i} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.blob_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                      <form action={`/api/documents/${doc.id}/delete`} method="POST">
                        <Button variant="outline" size="sm" type="submit">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Noch keine Dokumente hochgeladen.</p>
                <p className="text-sm mt-2">Lade deine ersten ELO-Dokumente hoch, um Bauki mit Fachwissen zu versorgen.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
