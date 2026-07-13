export function processLoreContent(
  rawContent: string,
  chapters: { slug: string }[],
  currentChapterSlug: string
): string {
  if (!chapters.length) return rawContent

  const currentIndex = chapters.findIndex(ch => ch.slug === currentChapterSlug)
  const lines = rawContent.split('\n')
  const resultLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line === undefined) continue      // safety, never really happens

    const startMatch = line.trim().match(/^\[\[lock\s+(.+?)\]\]\s*$/)

    if (startMatch) {
      const requiredChapterSlug = startMatch[1]
      const requiredIndex = chapters.findIndex(ch => ch.slug === requiredChapterSlug)

      // Locate the matching [[/lock]] – only look forward
      let endIndex = -1
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j]?.trim() === '[[/lock]]') {
          endIndex = j
          break
        }
      }

      if (requiredIndex === -1 || currentIndex < requiredIndex) {
        // 🔒 Locked → skip until end marker (or to the end of the file)
        if (endIndex !== -1) {
          i = endIndex   // loop will then do i++ to move past it
          continue
        } else {
          // no end marker → lock everything from here to the end
          break
        }
      } else {
        // 🔓 Unlocked → include the content between markers, skip the markers
        i++ // move past the start marker
        while (i < lines.length && lines[i]?.trim() !== '[[/lock]]') {
          resultLines.push(lines[i]!)
          i++
        }
        // now i points to [[/lock]] (or is at the end)
        // the loop will do i++ to move past it
        continue
      }
    }

    // normal line – keep it
    resultLines.push(line)
  }

  return resultLines.join('\n')
}