import { getNovelBySlug, getAnthologyBySlug, getLoreContent, getAnthologyStories } from '../../../../utils/works.server'
import { processLoreContent } from '../../../../utils/processLoreContent'
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

  
  // Full-lock check: if a loreChapter is set and chapterSlug is provided, verify access
  if (loreMeta?.loreChapter && chapterSlug) {
    const requiredIndex = chapters.findIndex(ch => ch.slug === loreMeta.loreChapter)
    const currentIndex = chapters.findIndex(ch => ch.slug === chapterSlug)
    if (requiredIndex === -1 || currentIndex < requiredIndex) {
      // Not yet unlocked – return a locked response
      return { title: loreMeta.title, content: `<p class="text-red-500">This lore is unlocked after chapter "${loreMeta.loreChapter}".</p>` }
    }
  }

  const lore = getLoreContent(workDir, loreSlug)
  if (!lore) throw createError({ statusCode: 404, statusMessage: 'Lore not found' })

  const finalContent = chapterSlug
    ? processLoreContent(lore.content, chapters, chapterSlug)
    : lore.content

  const md = createMarkdownItInstance()

  // Force internal links to open outside the iframe and external links in new tab
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (!token) return ''
    const href = token.attrGet('href') || ''
    if (href.startsWith('http')) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    } else {
      token.attrSet('target', '_parent')
    }
    return self.renderToken(tokens, idx, options)
  }

  const html = md.render(finalContent)
  const explicitPref = String(getQuery(event).explicit || 'collapsed')
  const finalHtml = processCollapsibleAndExplicitLore(html, explicitPref)

  return { title: lore.title, content: finalHtml  }
})