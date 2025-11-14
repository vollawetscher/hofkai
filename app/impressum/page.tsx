export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4F8] via-white to-[#E8F4F8]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1E3A4C] mb-8">Impressum</h1>

        <div className="bg-white border-2 border-[#0B6E99]/20 rounded-lg p-8 shadow-md">
          <p className="text-[#4A6A7C] leading-relaxed text-lg whitespace-pre-line">
            Angaben gemäß § 5 TMG
            <br />
            Ulf Hofmann
            <br />
            Ludwig-Richter-Straße 17
            <br />
            08058 Zwickau
            <br />
            <br />
            Telefon: 0177/3032914
            <br />
            E-Mail: hofmann.btb@gmail.com
            <br />
            <br />
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            <br />
            Ulf Hofmann
            <br />
            Ludwig-Richter-Straße 17
            <br />
            08058 Zwickau
            <br />
            <br />
            Haftungsausschluss
            <br />- Haftung für Inhalte
            <br />
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
            Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>
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
