import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, BookOpen, AlertCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export default async function ExpertenwissenPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const articles = [
    {
      title: "Wärmedämmung nach GEG 2024",
      category: "Energieeffizienz",
      content: `Das Gebäudeenergiegesetz (GEG 2024) ist seit 01.01.2024 in Kraft und verschärft die Anforderungen an die Energieeffizienz von Gebäuden erheblich.

**Wichtigste Änderungen:**
- Ab 2024 müssen neue Heizungen mindestens 65% erneuerbare Energien nutzen (§ 71 GEG)
- U-Werte für Außenwände: max. 0,24 W/(m²K) nach § 48 GEG
- U-Werte für Dächer: max. 0,14 W/(m²K)
- U-Werte für Fenster: max. 1,3 W/(m²K)

**Dämmmaterialien im Vergleich:**
- Mineralwolle (Lambda 0,035-0,040): Klassiker, nicht brennbar (A1), günstig
- EPS-Hartschaum (Lambda 0,032-0,035): Gutes Preis-Leistungs-Verhältnis, brennbar (B1)
- Holzfaser (Lambda 0,040-0,045): Ökologisch, diffusionsoffen, teurer
- PUR/PIR (Lambda 0,023-0,025): Beste Dämmwirkung, teuer, brennbar

**Förderung über KfW:**
- KfW 261: Zinsgünstiger Kredit + Tilgungszuschuss bis 45.000€ bei EH40-Standard
- BEG EM: Einzelmaßnahmen mit 15-20% Förderung

**Wichtig:** Luftdichtheit nach DIN 4108-7 beachten, sonst drohen Feuchteschäden durch Tauwasser.`,
      reference: "Quelle: GEG 2024, DIN 4108-7, KfW-Förderprogramme",
    },
    {
      title: "Mängelrechte nach VOB/B und BGB",
      category: "Baurecht",
      content: `Nach Bauabnahme haben Sie umfassende Gewährleistungsansprüche - die Regelungen unterscheiden sich jedoch.

**BGB-Werkvertrag (§ 634 BGB):**
- Gewährleistung: 5 Jahre ab Abnahme für Bauwerke
- Nacherfüllung (Mängelbeseitigung) steht Ihnen zu
- Bei Verweigerung: Selbstvornahme oder Minderung
- Wichtig: Mängelanzeige unverzüglich nach Entdeckung (§ 377 HGB bei Unternehmern)

**VOB/B-Vertrag (§ 13 VOB/B):**
- Gewährleistung: 4 Jahre ab Abnahme
- Vorteil: Kürzere Verjährung für Unternehmer
- Nachteil für Bauherr: Kürzere Anspruchsdauer

**Typische Mängel und Fristen:**
- Risse in Wänden: Prüfen nach DIN 18202 (max. 3mm Unebenheit)
- Feuchtigkeit im Keller: § 4 DIN 18195 Abdichtung prüfen
- Schallschutz: Messung nach DIN 4109 erforderlich
- Wärmebrücken: Blower-Door-Test nach DIN EN 13829

**Bagatellgrenze:** Kosten unter 100-150€ müssen oft nicht sofort behoben werden, aber dokumentiert.

**Tipp:** Abnahmeprotokoll penibel erstellen und alle Mängel fotografieren - Beweislast liegt sonst bei Ihnen!`,
      reference: "Quelle: BGB § 634, VOB/B § 13, DIN 18202, DIN 4109",
    },
    {
      title: "Baufinanzierung richtig planen",
      category: "Finanzierung",
      content: `Eine solide Baufinanzierung ist das Fundament Ihres Bauvorhabens. Hier die wichtigsten Regeln.

**Eigenkapitalquote:**
- Mindestens 20-30% der Gesamtkosten als Eigenkapital
- Kaufnebenkosten (10-15%) sollten aus Eigenkapital gezahlt werden
- Faustregel: Je mehr Eigenkapital, desto besserer Zinssatz

**Kaufnebenkosten berechnen:**
- Grunderwerbsteuer: 3,5-6,5% je nach Bundesland
- Notar- und Grundbuchkosten: ca. 2%
- Maklercourtage: bis 7,14% (regional unterschiedlich)
- Gesamt: ca. 10-15% vom Kaufpreis

**Zinsbindung wählen:**
- 10 Jahre: Standard, flexibel
- 15-20 Jahre: Planungssicherheit bei aktuell niedrigen Zinsen
- 30 Jahre: Maximale Sicherheit, oft höherer Zinssatz

**Tilgungsrate:**
- Mindestens 2-3% anfängliche Tilgung empfohlen
- Bei 1% Tilgung dauert Abbezahlung über 50 Jahre
- Sondertilgungen vereinbaren (5-10% jährlich)

**Förderungen nutzen:**
- KfW 124 Wohneigentumsprogramm: Bis 100.000€ Kredit
- Wohn-Riester: Bei selbstgenutztem Eigentum
- Baukindergeld: Prüfen ob noch verfügbar

**Absicherung:**
- Risikolebensversicherung für Hauptverdiener
- Berufsunfähigkeitsversicherung
- Restschuldversicherung nur in Ausnahmefällen (teuer)`,
      reference: "Quelle: Verbraucherzentrale, KfW-Bankengruppe, Stiftung Warentest",
    },
    {
      title: "Schimmelprävention und Lüftungskonzept",
      category: "Bauphysik",
      content: `Schimmel entsteht durch zu hohe Luftfeuchtigkeit und Wärmebrücken. So vermeiden Sie Schimmelbefall.

**Ursachen nach DIN 4108-3:**
- Relative Luftfeuchtigkeit über 80% an Bauteiloberflächen
- Wärmebrücken (z.B. Balkonanschlüsse, Fensterlaibungen)
- Unzureichende Lüftung nach DIN 1946-6
- Baumängel (undichte Dächer, defekte Abdichtungen)

**Richtig lüften:**
- Stoßlüften: 4-5 mal täglich für 5-10 Minuten
- Querlüften: Gegenüberliegende Fenster öffnen für Durchzug
- Luftfeuchtigkeit: Ideal 40-60% (Hygrometer verwenden)
- Nach Duschen/Kochen: Sofort lüften

**Heizen bei Neubauten:**
- Erste 2 Jahre: Besonders wichtig - Baufeuchte muss raus
- Nie unter 16°C in Wohnräumen
- Heizkörper nicht mit Möbeln zustellen

**Lüftungskonzept nach DIN 1946-6:**
- Bei Neubauten und Sanierungen ist Lüftungskonzept Pflicht
- Zentrale Lüftungsanlage mit Wärmerückgewinnung (WRG) spart Energie
- Fenster-Lüftung: Muss dann aktiv sichergestellt werden

**Bei Schimmelbefall:**
- Ursache finden (Wärmebrücke, Leckage, Nutzerverhalten?)
- Kleine Flächen (<0,5m²): Selbst mit Brennspiritus reinigen
- Große Flächen: Fachfirma beauftragen (Gesundheitsgefahr)
- Nicht überstreichen - Schimmel kommt wieder!`,
      reference: "Quelle: DIN 4108-3, DIN 1946-6, Umweltbundesamt Schimmelleitfaden",
    },
  ]

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
          <div className="mb-12 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-[#0B6E99]" />
            <h1 className="mb-4 text-balance text-4xl font-bold text-[#0B6E99] md:text-5xl">Expertenwissen</h1>
            <p className="text-pretty text-lg text-gray-600">
              Fundiertes Fachwissen basierend auf aktuellen Normen, Gesetzen und Bauvorschriften
            </p>
          </div>

          <div className="mb-8 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 shrink-0 text-yellow-600" />
              <div>
                <h3 className="mb-2 font-bold text-yellow-900">Wichtiger Hinweis</h3>
                <p className="text-sm text-yellow-800">
                  Alle Angaben basieren auf aktuellen Normen und Gesetzen (Stand 2024/2025). Bei konkreten
                  Bauprojekten empfehlen wir eine individuelle Beratung, da Bauvorschriften regional unterschiedlich
                  sein können.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {articles.map((article, index) => (
              <Card key={index} className="border-2 border-gray-100">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-[#74A57F] px-3 py-1 text-sm font-semibold text-white">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-[#1E3A4C]">{article.title}</h2>
                  <div className="prose prose-lg max-w-none">
                    {article.content.split("\n\n").map((paragraph, pIndex) => {
                      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                        return (
                          <h3 key={pIndex} className="mt-6 mb-3 text-xl font-bold text-[#0B6E99]">
                            {paragraph.replace(/\*\*/g, "")}
                          </h3>
                        )
                      }
                      return (
                        <p key={pIndex} className="mb-4 whitespace-pre-line text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    })}
                  </div>
                  <div className="mt-6 rounded-lg bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-[#0B6E99]">{article.reference}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 border-2 border-[#F7C948] bg-gradient-to-br from-[#F7C948]/10 to-white">
            <CardContent className="p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-[#1E3A4C]">Noch Fragen?</h3>
              <p className="mb-6 text-gray-600">
                Nutze den Bauki-Chat für spezifische Fragen oder buche eine Individualberatung für komplexe Themen.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild className="bg-[#0B6E99] hover:bg-[#0B6E99]/90">
                  <Link href="/chat">Zum Chat</Link>
                </Button>
                <Button asChild variant="outline" className="border-[#74A57F] text-[#74A57F] hover:bg-[#74A57F]/10">
                  <Link href="/consultation">Beratung buchen</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="mt-12 border-t-2 border-gray-100 bg-gray-50 py-12">
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
