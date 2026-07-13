import { getLoreContentBySlug, ChapterMeta } from './works.server'
import { createMarkdownIt } from './markdown'

function escapeHtml(text: string): string {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function processInlineLore(
  content: string,
  lore: ChapterMeta[],
  chapters: { slug: string }[],
  currentChapterSlug: string,
  workDir: string
): string {
  if (!lore || lore.length === 0) return content

  const currentIndex = chapters.findIndex(ch => ch.slug === currentChapterSlug)

  return content.replace(/\[\[lore:(.+?)\]\]/g, (match, slug) => {
    const entry = lore.find(l => l.slug === slug)
    if (!entry) return ''

    const isUnlocked = !entry.loreChapter || (() => {
      const reqIndex = chapters.findIndex(ch => ch.slug === entry.loreChapter)
      return reqIndex !== -1 && reqIndex <= currentIndex
    })()

    if (!isUnlocked) return ''

    const rawContent = getLoreContentBySlug(workDir, slug)
    if (!rawContent) return ''

    const md = createMarkdownIt()
    const rendered = md.render(rawContent)

    return `<div class="inline-lore-box my-4 p-4 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
      <h3 class="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">${escapeHtml(entry.title || slug)}</h3>
      ${rendered}
    </div>`
  })
}