import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, FileStack, AlertCircle } from 'lucide-react'

export default async function ELOBulkUploadPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/documents" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Dokumentenverwaltung
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ELO Office Bulk-Upload
          </h1>
          <p className="text-gray-600">
            Importieren Sie tausende Dokumente aus Ihrer ELO-Datenbank
          </p>
        </div>

        {/* Anleitung */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <FileStack className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                So funktioniert der Bulk-Import aus ELO Office
              </h2>
              <ol className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-amber-600 min-w-[24px]">1.</span>
                  <span>Öffnen Sie ELO Office (elo32.exe) auf Ihrem Windows-PC</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-amber-600 min-w-[24px]">2.</span>
                  <span>Wählen Sie die gewünschten Dokumente aus (TIF, PDF, MSG, EML, DOCX)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-amber-600 min-w-[24px]">3.</span>
                  <span>Exportieren Sie die Dokumente in einen lokalen Ordner</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-amber-600 min-w-[24px]">4.</span>
                  <span>Nutzen Sie das Upload-Formular unten - für tausende Dateien: mehrere Uploads à 200-500 Dateien</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-amber-600 min-w-[24px]">5.</span>
                  <span>Das System verarbeitet automatisch: TIF (OCR), PDF (Text), MSG/EML (E-Mail), DOCX (Text)</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* OCR-Hinweis */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Automatische Texterkennung für alle Formate</p>
              <p>
                <strong>TIF/TIFF:</strong> OCR-Texterkennung für gescannte Dokumente<br />
                <strong>PDF:</strong> Textextraktion aus digitalen PDFs<br />
                <strong>DOCX:</strong> Microsoft Word Dokumente<br />
                <strong>MSG/EML:</strong> E-Mail-Inhalte (Betreff, Von, Datum, Text)<br />
                <em>Die Verarbeitung bei tausenden Dateien kann einige Minuten dauern.</em>
              </p>
            </div>
          </div>
        </div>

        {/* Upload-Bereich */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dokumente hochladen
          </h2>
          
          {/* Importiere die vorhandene Upload-Form */}
          <div className="space-y-4">
            <p className="text-gray-600">
              Verwenden Sie das Standard-Upload-Formular mit Mehrfachauswahl für Bulk-Uploads.
            </p>
            <Link 
              href="/admin/documents/upload"
              className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Zum Upload-Formular →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
