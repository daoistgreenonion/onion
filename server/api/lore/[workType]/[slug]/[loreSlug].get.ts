import { getNovelBySlug, getAnthologyBySlug, getLoreContent, getAnthologyStories } from '../../../../utils/works.server'
import { processLoreContent, processCollapsibleAndExplicitLore } from '../../../../utils/processLoreContent'
import { createMarkdownItInstance } from '../../../../utils/markdownRenderer'
import path from 'path'

export default defineEventHandler((event) => {
  const workType = getRouterParam(event, 'workType')
  const slug = getRouterParam(event, 'slug')
  const loreSlug = getRouterParam(event, 'loreSlug')
  const chapterSlug = String(getQuery(event).chapter || '')

  if (!workType || !slug || !loreSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
  }

  let workDir = ''
  let chapters: { slug: string }[] = []
  let loreMeta: { title: string; loreChapter?: string } | null = null

  if (workType === 'novels') {
    const novel = getNovelBySlug(slug)
    if (!novel) throw createError({ statusCode: 404, statusMessage: 'Novel not found' })
    workDir = path.join(process.cwd(), 'content', 'novels', novel.type === 'long-novel' ? 'long-novels' : 'short-novels', slug)
    chapters = novel.chapters

    const loreEntry = (novel.lore || []).find(l => l.slug === loreSlug)
    if (loreEntry) loreMeta = { title: loreEntry.title, loreChapter: loreEntry.loreChapter }
  } else if (workType === 'anthologies') {
    const anthology = getAnthologyBySlug(slug)
    if (!anthology) throw createError({ statusCode: 404, statusMessage: 'Anthology not found' })
    workDir = path.join(process.cwd(), 'content', 'anthologies', slug)
    // For anthologies, treat stories as "chapters" for progression
    chapters = getAnthologyStories(slug).map(s => ({ slug: s.slug }))

    const loreEntry = (anthology.lore || []).find(l => l.slug === loreSlug)
    if (loreEntry) loreMeta = { title: loreEntry.title, loreChapter: loreEntry.loreChapter }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid work type' })
  }

  
  // Full‑lock check: compare numeric chapter IDs, not slugs
if (loreMeta?.loreChapter && chapterSlug) {
  const requiredNum = parseInt(loreMeta.loreChapter, 10)       // e.g., 3
  const currentNum = getChapterNumber(chapterSlug)              // parse "chapter-0003" or "3" → 3

  if (!isNaN(requiredNum) && currentNum !== null) {
    // Find the required chapter index (0‑based) by numeric ID
    const requiredIndex = chapters.findIndex(ch => getChapterNumber(ch.slug) === requiredNum)
    const currentIndex = chapters.findIndex(ch => getChapterNumber(ch.slug) === currentNum)

    if (requiredIndex !== -1 && currentIndex < requiredIndex) {
      return { title: loreMeta.title, content: `<p class="text-red-500">This lore is unlocked after chapter "${loreMeta.loreChapter}".</p>` }
    }
  }
}

  const lore = getLoreContent(workDir, loreSlug)
  if (!lore) throw createError({ statusCode: 404, statusMessage: 'Lore not found' })


  function getChapterNumber(raw: string): number | null {
    const trimmed = raw.trim()
    const match = trimmed.match(/^chapter-(\d+)$/i) || trimmed.match(/^(\d+)$/)
    if (match) return parseInt(match[1] ?? '0', 10)
    return null
  }
  
  // Determine the current chapter index
  let currentIndex = -1
  if (chapterSlug) {
    // Find the index by comparing numeric chapter IDs (to handle both "5" and "chapter-0005")
    const chapterNum = getChapterNumber(chapterSlug)
    if (chapterNum !== null) {
      currentIndex = chapters.findIndex(ch => getChapterNumber(ch.slug) === chapterNum)
    }
  }

  const finalContent = processLoreContent(lore.content, chapters.length, currentIndex)

  const md = createMarkdownItInstance()



  const html = md.render(finalContent)
  const explicitPref = String(getQuery(event).explicit || 'collapsed')
  const finalHtml = processCollapsibleAndExplicitLore(html, explicitPref)

  return { title: lore.title, content: finalHtml, searchable: lore.searchable ?? false,
  searchMode: lore.searchMode || 'title', }
})