import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, CheckSquare, Download } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export default async function ChecklistenPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const checklists = [
    {
      title: "Grundstückskauf-Checkliste",
      description: "Alle wichtigen Prüfpunkte vor dem Grundstückskauf nach BauGB und BauNVO",
      items: [
        "Grundbuchauszug prüfen (§ 12 GBO) - Lasten, Beschränkungen, Vorkaufsrechte",
        "Bebauungsplan einsehen (§ 30 BauGB) - Bauweise, Geschossanzahl, Nutzungsart",
        "Altlasten-Auskunft einholen (§ 4 BBodSchG) beim Umweltamt",
        "Erschließung klären (§ 123 BauGB) - Wasser, Strom, Abwasser, Straße",
        "Bodengutachten erstellen lassen (DIN 4020) - Tragfähigkeit, Grundwasser",
        "Grenzvermessung (§ 1 VermKatG) - amtlich eingemessene Grundstücksgrenzen",
        "Baulasten prüfen - Leitungsrechte, Wegerechte, Überbaurechte",
        "Kaufvertrag notariell beurkunden (§ 311b BGB)",
      ],
      reference: "Quelle: BauGB, BauNVO, BBodSchG, DIN 4020",
    },
    {
      title: "Baugenehmigung beantragen",
      description: "Vollständige Unterlagen für den Bauantrag nach MBO (Musterbauordnung)",
      items: [
        "Bauantragsformular des zuständigen Bauamts vollständig ausfüllen",
        "Bauvorlagen nach § 67 MBO: Lageplan (1:500), Grundrisse, Schnitte, Ansichten",
        "Baubeschreibung mit Angaben nach § 68 MBO (Bauweise, Materialien, Brandschutz)",
        "Statische Berechnungen durch Tragwerksplaner (§ 66 MBO)",
        "Wärmeschutznachweis nach GEG 2024 (früher EnEV) - U-Werte, Primärenergie",
        "Schallschutznachweis nach DIN 4109 bei Mehrfamilienhäusern",
        "Nachweis Barrierefreiheit bei Mehrfamilienhäusern (DIN 18040-2)",
        "Stellplatznachweis nach Landesstellplatzverordnung",
        "Bei Bedarf: Brandschutzkonzept nach § 14 MBO",
        "Bauvorlageberechtigter (Architekt/Ingenieur) unterschreibt alle Pläne",
      ],
      reference: "Quelle: MBO (Musterbauordnung), GEG 2024, DIN 4109, DIN 18040-2",
    },
    {
      title: "Bauabnahme-Checkliste",
      description: "Systematische Abnahme nach VOB/B und BGB zur Mängelfeststellung",
      items: [
        "Abnahmebegehung mit Bauleiter durchführen (§ 12 VOB/B oder § 640 BGB)",
        "Mängelliste schriftlich erstellen - jeder Mangel fotografieren und nummerieren",
        "Türen und Fenster prüfen: Schließmechanismus, Dichtungen, Scharniere",
        "Wände auf Risse, Unebenheiten, Ausblühungen kontrollieren (max. 3mm Unebenheit nach DIN 18202)",
        "Elektroinstallationen prüfen: Alle Schalter, Steckdosen, FI-Schutzschalter testen",
        "Sanitär kontrollieren: Wasserdruck, Abflüsse, Dichtigkeit, Armaturen",
        "Heizung in Betrieb nehmen: Alle Heizkörper, Thermostate, Vorlauftemperatur",
        "Bodenbeläge auf Kratzer, Beschädigungen, Fugen kontrollieren",
        "Dämmung und Luftdichtheit: Blower-Door-Test (DIN EN 13829) durchführen lassen",
        "Abnahmeprotokoll unterschreiben - Gewährleistungsfristen starten (5 Jahre nach § 13 VOB/B)",
      ],
      reference: "Quelle: VOB/B § 12, BGB § 640, DIN 18202, DIN EN 13829",
    },
    {
      title: "Immobilienkauf-Checkliste",
      description: "Prüfpunkte beim Kauf einer Bestandsimmobilie nach BGB",
      items: [
        "Energieausweis prüfen (§ 80 GEG) - Verbrauchs- oder Bedarfsausweis, max. 10 Jahre alt",
        "Teilungserklärung bei Eigentumswohnungen lesen (§ 8 WEG) - Sondernutzungsrechte, Kostenverteilung",
        "Protokolle der letzten 3 Eigentümerversammlungen anfordern",
        "Wirtschaftsplan und Jahresabrechnungen (WEG) der letzten 3 Jahre prüfen",
        "Instandhaltungsrücklagen prüfen (§ 21 WEG) - Höhe und geplante Verwendung",
        "Modernisierungen erfragen: Heizung, Fenster, Dach, Fassade - mit Belegen",
        "Grundriss auf tragende Wände prüfen - spätere Umbauten bedenken",
        "Keller und Dach auf Feuchtigkeit, Schimmel kontrollieren",
        "Hausanschlüsse prüfen: Elektrik (mind. 400V), Wasserrohre (Kupfer oder Kunststoff?)",
        "Kaufvertragsentwurf vom eigenen Anwalt prüfen lassen vor Notartermin",
      ],
      reference: "Quelle: GEG § 80, WEG § 8 und § 21, BGB Kaufrecht",
    },
    {
      title: "Mietvertrag prüfen - Mieterrechte",
      description: "Wichtige Punkte im Mietvertrag nach BGB Mietrecht",
      items: [
        "Kaltmiete und Nebenkosten getrennt ausweisen (§ 556 BGB)",
        "Betriebskostenverordnung (BetrKV) prüfen - nur umlagefähige Kosten",
        "Kaution max. 3 Nettokaltmieten (§ 551 BGB) - Anlage auf Sparkonto",
        "Schönheitsreparaturen: Formulierungen unwirksam bei unrenovierter Übergabe (BGH-Rechtsprechung)",
        "Kleinreparaturklausel: Max. 100€ pro Reparatur, max. 200€/Jahr (§ 535 BGB)",
        "Mieterhöhung nur nach § 558 BGB (ortsübliche Vergleichsmiete) - max. 20% in 3 Jahren",
        "Kündigungsfristen prüfen: 3 Monate Grundfrist für Mieter (§ 573c BGB)",
        "Hausordnung auf unzulässige Klauseln prüfen (z.B. generelles Haustierverbot unwirksam)",
        "Bei Indexmiete (§ 557b BGB): Verbraucherpreisindex als Grundlage prüfen",
      ],
      reference: "Quelle: BGB Mietrecht §§ 535-580a, BetrKV, BGH-Rechtsprechung zu Schönheitsreparaturen",
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
            <CheckSquare className="mx-auto mb-4 h-16 w-16 text-[#0B6E99]" />
            <h1 className="mb-4 text-balance text-4xl font-bold text-[#0B6E99] md:text-5xl">
              Checklisten für dein Bauvorhaben
            </h1>
            <p className="text-pretty text-lg text-gray-600">
              Professionelle Checklisten basierend auf aktuellen Gesetzen, Normen und Bauvorschriften
            </p>
          </div>

          <div className="space-y-8">
            {checklists.map((checklist, index) => (
              <Card key={index} className="border-2 border-gray-100">
                <CardContent className="p-8">
                  <h2 className="mb-2 text-2xl font-bold text-[#1E3A4C]">{checklist.title}</h2>
                  <p className="mb-6 text-gray-600">{checklist.description}</p>
                  <ul className="mb-6 space-y-3">
                    {checklist.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-3">
                        <CheckSquare className="h-5 w-5 shrink-0 text-[#74A57F] mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-[#0B6E99]">{checklist.reference}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 border-2 border-[#F7C948] bg-gradient-to-br from-[#F7C948]/10 to-white">
            <CardContent className="p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-[#1E3A4C]">Individuelle Beratung gewünscht?</h3>
              <p className="mb-6 text-gray-600">
                Für komplexe Fragen oder projektspezifische Checklisten empfehlen wir eine persönliche Beratung.
              </p>
              <Button asChild className="bg-[#74A57F] hover:bg-[#74A57F]/90">
                <Link href="/consultation">Beratung buchen</Link>
              </Button>
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
