-- Seed Community Posts mit hochwertigen, realistischen Beiträgen
-- Alle Beiträge enthalten verlässliche Informationen und praktische Erfahrungen

-- Beitrag 1: Grundstückskauf
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Stefan K.',
  'Grundstückskauf - Worauf achten beim Bebauungsplan?',
  'Wir haben letztes Jahr ein Grundstück gekauft und dabei einige wichtige Lektionen gelernt. Der Bebauungsplan war zunächst schwer zu verstehen, aber ich rate jedem:

1. Bebauungsplan vom Bauamt holen (§ 30 BauGB) - kostet meist 20-30€
2. Genau prüfen: Bauweise (offen/geschlossen), Geschossflächenzahl (GFZ), Grundflächenzahl (GRZ)
3. Wir durften nur 2 Vollgeschosse bauen, obwohl Nachbarn 3 haben - Altbestand!
4. Dachform war vorgeschrieben: Satteldach 35-45° Neigung
5. Grenzabstände nach Landesbauordnung einhalten - bei uns 3m

Unser Tipp: Nehmt einen Architekten zur Grundstücksbesichtigung mit. Der sieht sofort, was baulich möglich ist. Hat uns 500€ gekostet, aber 20.000€ Fehlplanungen erspart.

Besonders wichtig: Altlasten-Auskunft beim Umweltamt einholen (§ 4 BBodSchG). Kostet nichts, kann aber böse Überraschungen vermeiden.',
  'Grundstück',
  true
);

-- Beitrag 2: Dämmung
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Martina W.',
  'Fassadendämmung - Mineralwolle vs. EPS-Hartschaum',
  'Nach 3 Angeboten haben wir uns für Mineralwolle entschieden. Hier unsere Erfahrungen:

**Unsere Ausgangslage:**
- Altbau von 1978, Zweischalenmauerwerk
- U-Wert vorher: 1,2 W/(m²K) - viel zu hoch
- Ziel: GEG 2024 erfüllen (max. 0,24 W/(m²K))

**Warum Mineralwolle?**
- Nicht brennbar (Baustoffklasse A1) - wichtig bei Holzverkleidung
- Diffusionsoffen - Feuchtigkeit kann entweichen
- Kosten: 85€/m² inkl. Montage bei 16cm Dämmstärke

**Alternative EPS-Hartschaum war 15€/m² günstiger, aber:**
- Brennbar (B1) - problematisch bei über 7m Gebäudehöhe
- Nicht recyclebar

**Ergebnis nach 1 Jahr:**
- Heizkosten von 2.400€ auf 900€ gesunken
- KfW-Förderung: 6.000€ (20% von 30.000€ Gesamtkosten)
- Blower-Door-Test nach DIN EN 13829: n50-Wert von 2,1 1/h - gut!

Einziger Nachteil: Bauzeit 4 Wochen wegen Gerüst. Aber absolut lohnenswert.',
  'Sanierung',
  true
);

-- Beitrag 3: Mängel
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Thomas B.',
  'Bauabnahme - So haben wir 15 Mängel dokumentiert',
  'Bei unserer Bauabnahme haben wir 15 Mängel gefunden. Hier wie wir vorgegangen sind:

**Vorbereitung (1 Woche vorher):**
- Sachverständigen beauftragt (450€) - beste Investition!
- Checkliste erstellt nach VOB/B § 12
- Zollstock, Wasserwaage, Feuchtemessgerät besorgt

**Gefundene Mängel:**
1. Risse in Wand (4mm) - über DIN 18202 Toleranz (max. 3mm)
2. Fenster schließt nicht dicht - Zugluft mit Kerze getestet
3. Steckdosen schief montiert - 5 Stück!
4. Fliesen uneben - 6mm Höhenunterschied
5. Heizung erreicht nicht Solltemperatur (nur 19°C statt 22°C)
6. Elektrik: 2 Steckdosen ohne Funktion
... und 9 weitere

**Wichtig:**
- Jeder Mangel fotografiert mit Maßband im Bild
- Mängelliste mit Bauleiter durchgegangen
- NICHT unterschrieben bis Mängel behoben
- Gewährleistung 5 Jahre nach § 634 BGB

**Nachbesserung:**
- Nach 4 Wochen alle Mängel behoben
- Dann erst Abnahme unterschrieben
- Gewährleistungsfrist startete offiziell

Mein Rat: Nehmt einen Sachverständigen mit. Wir hätten sonst 8 Mängel übersehen!',
  'Bauabnahme',
  true
);

-- Beitrag 4: Finanzierung
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Lisa M.',
  'Baufinanzierung mit wenig Eigenkapital - Unsere Erfahrung',
  'Wir haben mit nur 15% Eigenkapital gebaut. Hier unser ehrlicher Erfahrungsbericht:

**Unsere Zahlen:**
- Kaufpreis Grundstück + Haus: 420.000€
- Eigenkapital: 63.000€ (15%)
- Kaufnebenkosten (Notar, Steuer, Makler): 42.000€

**Die Finanzierung:**
- Hauptkredit: 357.000€ bei 3,8% Zinsen (15 Jahre Zinsbindung)
- 2% anfängliche Tilgung
- Sondertilgung: 5% pro Jahr möglich
- Monatliche Rate: 1.725€

**Was wir gelernt haben:**
1. Mehr Eigenkapital = besserer Zinssatz (hätten 0,3% gespart bei 20%)
2. KfW 124 genutzt: 50.000€ zu 2,1% - unbedingt mitnehmen!
3. Notarkosten aus Eigenkapital bezahlt (wichtig!)
4. Risikolebensversicherung abgeschlossen (250.000€ Summe, 35€/Monat)

**Nach 2 Jahren Tilgung:**
- Restschuld: 338.000€
- Haben 3 Sondertilgungen gemacht (je 10.000€)
- Zins bleibt noch 13 Jahre fix

**Unser Rat:**
- Mindestens 15% Eigenkapital haben
- Kaufnebenkosten separat einplanen
- 15-20 Jahre Zinsbindung bei aktuellen Zinsen
- Puffer für Unvorhergesehenes (wir: 15.000€)',
  'Finanzierung',
  true
);

-- Beitrag 5: Feuchtigkeit
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Michael R.',
  'Kellerfeuchtigkeit beseitigt - So haben wir es geschafft',
  'Unser Keller hatte massive Feuchtigkeitsprobleme. Nach 6 Monaten Sanierung ist es jetzt trocken.

**Ausgangslage:**
- Altbau 1965, Keller feucht
- Wände innen nass, muffiger Geruch
- Feuchtemessgerät zeigte 85% rel. Feuchte

**Ursachenforschung (wichtigster Schritt!):**
- Sachverständiger beauftragt (800€)
- Diagnose: Horizontalsperre defekt + Drainage verstopft
- Keine aufsteigende Feuchtigkeit durch Kapillarwirkung

**Unsere Sanierung nach DIN 18195:**
1. Außen: Kellerwände freigelegt (8.000€ Baggerarbeiten)
2. Horizontalsperre erneuert: Chromstahlbleche eingeschlagen (6.500€)
3. Bitumendickbeschichtung außen (DIN 18195-6): 4.200€
4. Drainage verlegt: 3.500€
5. Kiesschicht + Drainagerohre: 2.800€

**Gesamtkosten: 25.000€**

**Alternative wäre gewesen:**
- Innenabdichtung nur 8.000€, aber nicht nachhaltig
- Problem wäre geblieben

**Ergebnis nach 6 Monaten:**
- Wände komplett trocken
- Relative Feuchte: 55% (ideal)
- Können Keller jetzt nutzen

**Wichtig:**
- Ursache finden, nicht Symptome bekämpfen
- Drainage MUSS funktionieren
- Außenabdichtung ist nachhaltiger als Innenabdichtung',
  'Sanierung',
  true
);

-- Beitrag 6: Schallschutz
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Anna S.',
  'Schallschutz-Anforderungen im Mehrfamilienhaus - Messung nach DIN 4109',
  'Wir haben ein Mehrfamilienhaus gebaut und beim Schallschutz genau hingeschaut. Hier unsere Erfahrungen:

**Gesetzliche Anforderungen nach DIN 4109:**
- Luftschallschutz zwischen Wohnungen: mind. 53 dB
- Trittschallschutz: max. 53 dB
- Bei erhöhtem Schallschutz: 58 dB bzw. 48 dB

**Unsere Bauweise:**
- Geschossdecke: 24cm Stahlbeton
- Schwimmender Estrich auf Trittschalldämmung (25mm)
- Dämmung unter Estrich: Polystyrol-Hartschaum
- Wände zwischen Wohnungen: 24cm Kalksandstein

**Messung durch Sachverständigen:**
- Kosten: 1.200€ für alle 6 Wohnungen
- Ergebnis Luftschallschutz: 56 dB (gut!)
- Ergebnis Trittschallschutz: 49 dB (sehr gut!)

**Was wir zusätzlich gemacht haben:**
- Rohrleitungen entkoppelt (Schellen mit Gummi)
- Trockenbauwände mit doppelter Beplankung (2x 12,5mm)
- Türen mit Dichtungen

**Kosten für erhöhten Schallschutz:**
- Plus ca. 8.000€ für das gesamte Haus
- Absolut jeden Euro wert!

**Wichtig:**
- DIN 4109 ist Mindeststandard
- Erhöhter Schallschutz unbedingt empfohlen
- Nachrüsten ist 10x teurer als gleich richtig bauen',
  'Neubau',
  true
);

-- Beitrag 7: Wohnungskauf
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Peter H.',
  'Eigentumswohnung gekauft - Diese Unterlagen haben wir geprüft',
  'Vor 6 Monaten haben wir eine Eigentumswohnung gekauft. Hier die wichtigsten Dokumente, die wir geprüft haben:

**1. Teilungserklärung (§ 8 WEG):**
- Wer zahlt was? (Kostenverteilung nach Miteigentumsanteilen)
- Sondernutzungsrechte: Wir haben Terrasse, zahlen aber Instandhaltung
- Gemeinschaftseigentum: Dach, Fassade, Heizung

**2. Protokolle der letzten 3 Eigentümerversammlungen:**
- Geplante Sanierungen? Bei uns: Dach in 2 Jahren (15.000€ pro Wohnung)
- Streitigkeiten in der Gemeinschaft? (wichtig für späteres Zusammenleben)
- Beschlüsse zu Sonderumlagen

**3. Wirtschaftsplan und Jahresabrechnung:**
- Hausgeld: 250€/Monat bei 85m² Wohnung
- Instandhaltungsrücklage: 0,85€/m² (gut gefüllt mit 78.000€ gesamt)
- Nebenkosten nachvollziehbar nach BetrKV

**4. Energieausweis (§ 80 GEG):**
- Bedarfsausweis von 2022 (max. 10 Jahre alt)
- Energieklasse C - ok für Baujahr 1995
- Keine Sanierungspflicht erkennbar

**5. Grundbuchauszug (§ 12 GBO):**
- Lasten? Bei uns: Wegerecht für Nachbar (unproblematisch)
- Grundschulden? (werden beim Kauf gelöscht)

**Unser Tipp:**
- Alle Unterlagen VOR Kaufvertrag vom Verkäufer anfordern
- Anwalt drüberschauen lassen (350€)
- WEG-Verwalter kontaktieren und Fragen stellen

Hat uns viel Sicherheit gegeben!',
  'Immobilienkauf',
  true
);

-- Beitrag 8: Mietrecht
INSERT INTO community_posts (
  user_id,
  username,
  title,
  content,
  category,
  image_rights_confirmed
) VALUES (
  (SELECT id FROM user_profiles WHERE email = 'hofkai@googlemail.com' LIMIT 1),
  'Julia F.',
  'Nebenkostenabrechnung zu hoch - So haben wir widersprochen',
  'Unsere Nebenkostenabrechnung war viel zu hoch. Hier wie wir vorgegangen sind und 420€ zurückbekommen haben:

**Ausgangslage:**
- Nachzahlung: 680€ für 2023
- Vorjahr: nur 180€
- Uns kam das komisch vor

**Prüfung nach Betriebskostenverordnung (BetrKV):**
1. Abrechnungsfrist: 12 Monate nach Abrechnungszeitraum (§ 556 BGB) - ok
2. Umlagefähige Kosten: Nur die in § 2 BetrKV genannten
3. Verteilerschlüssel: Nach Wohnfläche (m²) korrekt

**Was wir gefunden haben:**
- Hausmeister: 1.200€ für Schneeräumen - es hat aber kaum geschneit!
- Gartenpflege: 800€ obwohl wir keinen Garten haben
- Verwaltungskosten: 450€ - NICHT umlagefähig nach BGH-Urteil!
- Instandhaltung Dach: 300€ - ebenfalls NICHT umlagefähig

**Unser Vorgehen:**
1. Schriftlicher Widerspruch innerhalb 12 Monate (§ 556 Abs. 3 BGB)
2. Belegeneinsicht verlangt (Rechnungen, Verträge)
3. Mieterverein konsultiert (60€ Jahresbeitrag, lohnt sich!)
4. Detaillierte Aufstellung der Fehler geschickt

**Ergebnis:**
- Vermieter hat 420€ erstattet
- Neue Abrechnung mit Erläuterungen erhalten
- Hausmeistervertrag wurde neu verhandelt

**Wichtig:**
- Innerhalb 12 Monate widersprechen (Ausschlussfrist!)
- Belegeneinsicht ist Ihr Recht (§ 259 BGB)
- Mieterverein hilft bei Prüfung',
  'Mietrecht',
  true
);
