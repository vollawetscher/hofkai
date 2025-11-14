// Extrahiert automatisch Stichwörter aus verschiedenen Quellen
export function extractKeywordsFromPath(filePath: string): string[] {
  const keywords: string[] = []
  
  // Zerlege Pfad in Teile
  const parts = filePath.split(/[\/\\]/).filter(p => p.length > 0)
  
  // Jeder Ordner ist ein Keyword
  parts.forEach(part => {
    // Entferne Zahlen und Sonderzeichen
    const cleaned = part
      .replace(/^\d+[-_\s]*/, '') // Führende Nummern entfernen
      .replace(/[_-]/g, ' ')       // Unterstriche/Bindestriche durch Leerzeichen
      .trim()
    
    if (cleaned.length > 2) {
      keywords.push(cleaned)
    }
  })
  
  return keywords
}

export function extractKeywordsFromFilename(filename: string): string[] {
  const keywords: string[] = []
  
  // Entferne Dateiendung
  const nameWithoutExt = filename.replace(/\.[^.]+$/, '')
  
  // Zerlege nach Trennzeichen
  const parts = nameWithoutExt.split(/[\s_-]+/)
  
  parts.forEach(part => {
    // Ignoriere sehr kurze Teile und reine Zahlen
    if (part.length > 2 && !/^\d+$/.test(part)) {
      keywords.push(part)
    }
  })
  
  return keywords
}

export function extractKeywordsFromText(text: string): string[] {
  const keywords: string[] = []
  
  // Häufige Bau-relevante Begriffe
  const bauKeywords = [
    'bauantrag', 'baugenehmigung', 'statik', 'brandschutz', 'schallschutz',
    'wärmeschutz', 'denkmalschutz', 'bebauungsplan', 'grundriss', 'schnitt',
    'ansicht', 'detail', 'konstruktion', 'fundament', 'decke', 'wand', 'dach',
    'fenster', 'tür', 'treppe', 'heizung', 'lüftung', 'sanitär', 'elektro',
    'kostenberechnung', 'leistungsverzeichnis', 'ausschreibung', 'vertrag',
    'abnahme', 'gewährleistung', 'din', 'vob', 'geg', 'energie', 'dämmung'
  ]
  
  const lowerText = text.toLowerCase()
  
  bauKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      keywords.push(keyword)
    }
  })
  
  return keywords
}

export function combineAndDeduplicateKeywords(...keywordArrays: string[][]): string[] {
  const allKeywords = keywordArrays.flat()
  
  // Dedupliziere und normalisiere
  const uniqueKeywords = new Set(
    allKeywords.map(k => k.toLowerCase().trim())
  )
  
  return Array.from(uniqueKeywords)
}
