export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4F8] via-white to-[#E8F4F8]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1E3A4C] mb-8">Datenschutzerklärung</h1>

        <div className="bg-white border-2 border-[#0B6E99]/20 rounded-lg p-8 shadow-md">
          <div className="text-[#4A6A7C] leading-relaxed space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-[#1E3A4C] mb-4">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-xl font-semibold text-[#1E3A4C] mb-2 mt-6">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
                persönlich identifiziert werden können.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-[#1E3A4C] mb-4">2. Datenerfassung auf dieser Website</h2>
              <h3 className="text-xl font-semibold text-[#1E3A4C] mb-2 mt-6">
                Wer ist verantwortlich für die Datenerfassung?
              </h3>
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können
                Sie dem Impressum dieser Website entnehmen.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-[#1E3A4C] mb-4">3. Registrierung und Login</h2>
              <p>
                Bei der Registrierung werden Ihre E-Mail-Adresse und ggf. weitere Daten erfasst. Diese Daten werden zur
                Bereitstellung unserer Dienste verwendet und nicht an Dritte weitergegeben.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-[#1E3A4C] mb-4">4. Verwendung von Supabase</h2>
              <p>
                Diese Website nutzt Supabase für Authentifizierung und Datenspeicherung. Ihre Daten werden verschlüsselt
                gespeichert und entsprechen den DSGVO-Richtlinien.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-[#1E3A4C] mb-4">5. Ihre Rechte</h2>
              <p>
                Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung
                Ihrer gespeicherten Daten, ein Widerspruchsrecht gegen die Verarbeitung sowie ein Recht auf
                Datenübertragbarkeit.
              </p>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-[#0B6E99] hover:underline font-medium">
            ← Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  )
}
