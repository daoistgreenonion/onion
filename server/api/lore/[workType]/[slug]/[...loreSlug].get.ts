import { getNovelBySlug, getAnthologyBySlug, getLoreContent, getAnthologyStories } from '../../../../utils/works.server'
import { processLoreContent, processCollapsibleAndExplicitLore } from '../../../../utils/processLoreContent'
import { createMarkdownItInstance } from '../../../../utils/markdownRenderer'
import path from 'path'

function getChapterNumber(raw: string): number | null {
  const trimmed = raw.trim()
  const match = trimmed.match(/^chapter-(\d+)$/i) || trimmed.match(/^(\d+)$/)
  if (match) return parseInt(match[1] ?? '0', 10)
  return null
}

export default defineEventHandler((event) => {
  const workType = getRouterParam(event, 'workType')
  const slug = getRouterParam(event, 'slug')
  const rawLoreSlug = getRouterParam(event, 'loreSlug')
  const loreSlug = Array.isArray(rawLoreSlug) ? rawLoreSlug.join('/') : (rawLoreSlug || '')
  const chapterSlug = String(getQuery(event).chapter || '')

  if (!workType || !slug || !loreSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
  }

  let workDir = ''
  let chapters: { slug: string }[] = []
  let loreMeta: { title: string; loreChapter?: string; explicit?: boolean } | null = null

  if (workType === 'novels') {
    const novel = getNovelBySlug(slug)
    if (!novel) throw createError({ statusCode: 404, statusMessage: 'Novel not found' })
    workDir = path.join(process.cwd(), 'content', 'novels', novel.type === 'long-novel' ? 'long-novels' : 'short-novels', slug)
    chapters = novel.chapters

    const loreEntry = (novel.lore || []).find(l => l.slug === loreSlug || l.children?.some(c => c.parentPath === loreSlug))
    if (loreEntry) loreMeta = { title: loreEntry.title, loreChapter: loreEntry.loreChapter, explicit: loreEntry.explicit }
  } else if (workType === 'anthologies') {
    const anthology = getAnthologyBySlug(slug)
    if (!anthology) throw createError({ statusCode: 404, statusMessage: 'Anthology not found' })
    workDir = path.join(process.cwd(), 'content', 'anthologies', slug)
    chapters = getAnthologyStories(slug).map(s => ({ slug: s.slug }))
    const loreEntry = (anthology.lore || []).find(l => l.slug === loreSlug || l.children?.some(c => c.parentPath === loreSlug))
    if (loreEntry) loreMeta = { title: loreEntry.title, loreChapter: loreEntry.loreChapter, explicit: loreEntry.explicit }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid work type' })
  }

  // Full-lock check
  if (loreMeta?.loreChapter && chapterSlug) {
    const requiredIndex = chapters.findIndex(ch => ch.slug === loreMeta!.loreChapter)
    const currentIndex = chapters.findIndex(ch => ch.slug === chapterSlug)
    if (requiredIndex === -1 || currentIndex < requiredIndex) {
      return { title: loreMeta.title, content: `<p class="text-red-500">This lore is unlocked after chapter "${loreMeta.loreChapter}".</p>` }
    }
  }

  // Explicit content gate
  const explicitPref = String(getQuery(event).explicit || 'collapsed')
  if (loreMeta?.explicit && explicitPref !== 'expanded') {
    return {
      title: loreMeta.title,
      content: `<p class="text-red-500">This lore entry is explicit and is currently hidden.</p>`,
      searchable: false,
      searchMode: 'title',
    }
  }

  
  const lore = getLoreContent(workDir, loreSlug)
  if (!lore) throw createError({ statusCode: 404, statusMessage: 'Lore not found' })

  // Compute current chapter index for lock/sunset processing
  let currentChapterIndex = -1
  if (chapterSlug) {
    const chapterNum = getChapterNumber(chapterSlug)
    if (chapterNum !== null) {
      currentChapterIndex = chapters.findIndex(ch => getChapterNumber(ch.slug) === chapterNum)
    }
  }

  const finalContent = processLoreContent(lore.content, chapters.length, currentChapterIndex)

  const md = createMarkdownItInstance()
  
  const html = md.render(finalContent)
  const finalHtml = processCollapsibleAndExplicitLore(html, explicitPref)

  return {
    title: lore.title,
    content: finalHtml,
    searchable: lore.searchable ?? false,
    searchMode: lore.searchMode || 'title',
  }
})