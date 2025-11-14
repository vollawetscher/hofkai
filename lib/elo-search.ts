import { createClient } from "@/lib/supabase/server"

export async function isEloEnabled(): Promise<boolean> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from("system_settings")
    .select("setting_value")
    .eq("setting_key", "elo_documents_enabled")
    .single()

  return data?.setting_value === "true"
}

export async function searchEloDocuments(query: string): Promise<string[]> {
  const supabase = await createClient()

  // Suche in deutschen Volltexten mit Ranking
  const { data: documents } = await supabase
    .from("documents")
    .select("title, content, category, tags")
    .textSearch("content", query, {
      type: "websearch",
      config: "german",
    })
    .limit(5)

  if (!documents || documents.length === 0) {
    return []
  }

  // Formatiere gefundene Dokumente als Kontext
  return documents.map(
    (doc) =>
      `[DOKUMENT: ${doc.title} | Kategorie: ${doc.category}]
${doc.content.substring(0, 800)}...
[Tags: ${doc.tags?.join(", ") || "keine"}]`
  )
}
