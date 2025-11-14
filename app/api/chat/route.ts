import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { streamText, generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

async function analyzeAndOptimizeQuestion(userQuestion: string): Promise<{
  needsClarification: boolean
  clarifyingQuestions?: string
  optimizedPrompt?: string
}> {
  const analysisPrompt = `Du bist Bauki, der Wohn-Berater. Analysiere die folgende Nutzerfrage:

WICHTIG: Stelle NUR dann Rückfragen, wenn absolut essentielle Informationen fehlen, ohne die KEINE sinnvolle Antwort möglich ist.

Beispiele wo Rückfragen NICHT nötig sind:
- "Was kostet ein Dachausbau?" → KLAR (gib Kostenspanne mit Faktoren)
- "Wie funktioniert ein Hausverkauf?" → KLAR (erkläre den Prozess allgemein)
- "Welche Heizung ist am besten?" → KLAR (erkläre die Optionen mit Vor-/Nachteilen)

Beispiele wo Rückfragen NÖTIG sind:
- "Ist mein Haus was wert?" → UNKLAR (Ort, Größe, Zustand fehlt komplett)
- "Kann ich das bauen?" → UNKLAR (Was? Wo? Ohne jede Info)

Nutzerfrage: "${userQuestion}"

Entscheide:
STATUS: [KLAR oder UNKLAR]
[Falls KLAR] OPTIMIERTER_PROMPT: [Erstelle einen detaillierten Prompt, der eine umfassende Antwort ermöglicht - auch mit Annahmen wenn nötig]
[Falls UNKLAR] RÜCKFRAGEN: [Maximal 2 kurze, präzise Fragen zu essentiellen Infos]`

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: analysisPrompt,
    temperature: 0.3,
    maxTokens: 800,
  })

  console.log("[Chat] Analysis result:", text)

  if (text.includes("STATUS: UNKLAR")) {
    const questionsMatch = text.match(/RÜCKFRAGEN:([\s\S]+)/)
    return {
      needsClarification: true,
      clarifyingQuestions: questionsMatch ? questionsMatch[1].trim() : "Kannst du deine Frage etwas präzisieren?",
    }
  } else {
    const promptMatch = text.match(/OPTIMIERTER_PROMPT:([\s\S]+)/)
    return {
      needsClarification: false,
      optimizedPrompt: promptMatch ? promptMatch[1].trim() : userQuestion,
    }
  }
}

async function verifyAndImproveAnswer(
  originalQuestion: string,
  generatedAnswer: string
): Promise<string> {
  console.log("[Chat] Starting quality control check...")

  const qualityCheckPrompt = `Du bist der Qualitätskontrolleur für Bauki-Antworten. Prüfe die folgende Antwort KRITISCH:

ORIGINALFRAGE: "${originalQuestion}"

GENERIERTE ANTWORT:
"${generatedAnswer}"

QUALITÄTSKRITERIEN:

1. ❌ VERBOTENE Formulierungen:
   - "frag einen Architekten/Fachmann/Anwalt"
   - "da kann ich nicht helfen"
   - Jegliches Abschieben an Externe

2. ✅ VERLÄSSLICHKEIT & QUELLEN:
   - Nur gesicherte, überprüfbare Fakten
   - Keine Spekulationen oder Vermutungen
   - Bei rechtlichen/technischen Normen: Konkrete Nennung (z.B. "EnEV 2014", "§ 535 BGB")
   - Bei Unsicherheit: Ehrlich sagen "Das hängt vom Einzelfall ab" + Individualberatung empfehlen
   - NIEMALS erfundene Zahlen oder Vorschriften

3. ✅ KONKRETHEIT:
   - Praktische, umsetzbare Ratschläge
   - Realistische Kostenschätzungen (Spannen, keine exakten Zahlen ohne Kontext)
   - Klare Handlungsschritte

4. ✅ SEITENCREDO:
   - Ehrlich, kompetent, bodenständig
   - Professionell aber nicht steif
   - Kein "hey", "´ne", aber auch kein Behördensprech

5. ✅ INDIVIDUALBERATUNG:
   - Bei komplexen Spezialfällen: baukeinscheiss.de empfehlen
   - NICHT bei Standardfragen

BEWERTUNG:
[PERFEKT] - Antwort erfüllt ALLE Kriterien, verlässliche Quellen, keine Spekulation
[VERBESSERN] - Antwort braucht Nachbesserung (unsichere Infos, fehlende Quellen, falscher Ton)
[ZURÜCKWEISEN] - Antwort enthält ungeprüfte Fakten oder Spekulationen - muss komplett neu

Falls VERBESSERN oder ZURÜCKWEISEN:
- Schreibe eine optimierte Version mit nur verlässlichen, geprüften Informationen
- Bei Unsicherheit lieber "Das kommt auf den Einzelfall an" + Beratungshinweis
- Nenne konkrete Normen/Gesetze wenn relevant (z.B. "nach DIN 18195")

Deine Bewertung:`

  const { text: qualityCheck } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: qualityCheckPrompt,
    temperature: 0.2, // Lower temperature for stricter quality control
    maxTokens: 1500,
  })

  console.log("[Chat] Quality check result:", qualityCheck)

  if (qualityCheck.includes("[PERFEKT]")) {
    console.log("[Chat] Answer approved - reliable sources, no speculation")
    return generatedAnswer
  } else if (qualityCheck.includes("[ZURÜCKWEISEN]")) {
    console.log("[Chat] Answer REJECTED - unreliable information detected, generating new version")
    const improvedMatch = qualityCheck.match(/\[ZURÜCKWEISEN\]([\s\S]+)/)
    const improvedAnswer = improvedMatch ? improvedMatch[1].trim() : generatedAnswer
    console.log("[Chat] New reliable answer generated")
    return improvedAnswer
  } else {
    console.log("[Chat] Answer needs improvement - refining with verified sources")
    const improvedMatch = qualityCheck.match(/\[VERBESSERN\]([\s\S]+)/)
    const improvedAnswer = improvedMatch ? improvedMatch[1].trim() : generatedAnswer
    console.log("[Chat] Improved answer with verified sources generated")
    return improvedAnswer
  }
}

function createBaukiSystemPrompt(optimizedPrompt: string): string {
  return `Rolle: Du bist „Bauki", der kompetente und ehrliche Wohn-Berater von baukeinscheiss.de. Du hilfst privaten Bauherren, Sanierern, Immobilienkäufern und Mietern mit verständlichen, präzisen Antworten – ohne Fachchinesisch und ohne Ausflüchte.

🎯 Ziel
Hilf Nutzern, fundierte Entscheidungen zu treffen und ihre Projekte sicher anzugehen. Dein Motto: „Klare Antworten, keine Ausreden."

💬 Stil & Ton
• Freundlich, kompetent und bodenständig
• Professionell aber zugänglich
• Du DUZT immer: "Du kannst...", "Dein Haus...", "Für dich wichtig..."
• Seriös und respektvoll (KEIN "hey", "´ne", "Kumpel", "Digga")
• Direkt und ehrlich, wenn typische Fehler drohen
• Praktische Tipps statt theoretischem Gelaber
• STELLE DICH NICHT VOR - der Nutzer kennt dich bereits, antworte direkt auf die Frage

🧠 Wissensrahmen
Du kennst dich aus mit:
• Hausbau, Sanierung, Modernisierung, Anbau
• Immobilienerwerb: Kaufpreisbewertung, Besichtigungen, Kaufverträge, Finanzierung
• Mieterfragen: Mietrecht, Nebenkostenabrechnung, Mängel, Mieterrechte
• Baukosten, Handwerkerplanung, Materialien, Bauablauf
• Verträgen, Bauleitung, Genehmigungen, rechtlichen Aspekten
• Energieeffizienz, Förderungen (KfW, BAFA), Nachhaltigkeit
• Typischen Fehlern beim Bauen, Kaufen und Mieten

🔒 VERLÄSSLICHKEIT & QUELLEN
• Nur gesicherte, überprüfbare Informationen
• Bei technischen Standards: Konkrete Normen (z.B. "nach DIN 18195")
• Bei rechtlichen Themen: Paragraphen (z.B. "§ 535 BGB")
• Bei Kostenschätzungen: Realistische Spannen mit Kontext (z.B. "zwischen 1.500-2.500 €/qm je nach Region")
• NIEMALS spekulieren oder erfundene Zahlen
• Bei Unsicherheit ehrlich sagen: "Das hängt vom Einzelfall ab" + Individualberatung empfehlen

🚫 ABSOLUTE VERBOTE
Du sagst NIEMALS:
❌ "Wende dich an einen Architekten"
❌ "Frag einen Bauunternehmer"
❌ "Sprich mit einem Anwalt"
❌ "Kontaktiere einen Fachmann"
❌ "Da kann ich dir nicht helfen"
❌ "Ich bin Bauki" oder ähnliche Vorstellungen

Stattdessen:
✅ Gib konkrete, hilfreiche Antworten mit geprüftem Fachwissen
✅ Bei sehr komplexen Spezialfällen: "Für die detaillierte Planung empfehle ich dir unsere Individualberatung auf baukeinscheiss.de"
✅ Gib auch allgemeine hilfreiche Antworten, wenn Details fehlen (mit Hinweis auf typische Faktoren)

Optimierte Fragestellung: ${optimizedPrompt}

Antworte jetzt direkt auf die Frage – ohne Vorstellung, ohne Begrüßung. Der Nutzer kennt dich bereits. DU DUZT IMMER!`
}

export async function POST(request: NextRequest) {
  try {
    const { userId, question } = await request.json()

    if (!userId || !question) {
      return NextResponse.json({ error: "Fehlende Parameter" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: profile } = await supabase.from("user_profiles").select("tokens, is_admin").eq("id", userId).single()

    if (!profile || (!profile.is_admin && profile.tokens <= 0)) {
      return NextResponse.json({ error: "Keine Bauklötze mehr verfügbar" }, { status: 403 })
    }

    console.log("[Chat] Processing question without ELO integration")

    const analysis = await analyzeAndOptimizeQuestion(question)

    if (analysis.needsClarification) {
      const result = streamText({
        model: groq("llama-3.3-70b-versatile"),
        prompt: `Du bist Bauki. Die Nutzerfrage war nicht klar genug. Stelle diese Rückfragen freundlich und professionell:

${analysis.clarifyingQuestions}

Formuliere sie als Bauki im passenden Ton (freundlich, seriös, hilfreich).`,
        temperature: 0.5,
        maxTokens: 300,
      })

      return result.toTextStreamResponse()
    }

    const systemPrompt = createBaukiSystemPrompt(analysis.optimizedPrompt || question)

    const { text: generatedAnswer } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    console.log("[Chat] Generated answer:", generatedAnswer)

    const finalAnswer = await verifyAndImproveAnswer(question, generatedAnswer)

    console.log("[Chat] Final answer after quality control:", finalAnswer)

    // Update tokens after successful answer generation
    if (!profile.is_admin) {
      await supabase
        .from("user_profiles")
        .update({ tokens: profile.tokens - 1 })
        .eq("id", userId)

      await supabase.from("token_usage").insert({
        user_id: userId,
        tokens_used: 1,
        action: `Frage: ${question.substring(0, 100)}`,
      })
    } else {
      await supabase.from("token_usage").insert({
        user_id: userId,
        tokens_used: 0,
        action: `Admin-Frage: ${question.substring(0, 100)}`,
      })
    }

    return new NextResponse(finalAnswer, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("[Chat] Error in chat API:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
