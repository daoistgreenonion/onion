import { getNovelBySlug, getAnthologyBySlug, getLoreContent, getAnthologyStories } from '../../../../utils/works.server'
import { processLoreContent } from '../../../../utils/processLoreContent'
import MarkdownIt from 'markdown-it'
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

  if (workType === 'novels') {
    const novel = getNovelBySlug(slug)
    if (!novel) throw createError({ statusCode: 404, statusMessage: 'Novel not found' })
    workDir = path.join(process.cwd(), 'content', 'novels', novel.type === 'long-novel' ? 'long-novels' : 'short-novels', slug)
    chapters = novel.chapters
  } else if (workType === 'anthologies') {
    const anthology = getAnthologyBySlug(slug)
    if (!anthology) throw createError({ statusCode: 404, statusMessage: 'Anthology not found' })
    workDir = path.join(process.cwd(), 'content', 'anthologies', slug)
    // For anthologies, treat stories as "chapters" for progression
    chapters = getAnthologyStories(slug).map(s => ({ slug: s.slug }))
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid work type' })
  }

  const lore = getLoreContent(workDir, loreSlug)
  if (!lore) throw createError({ statusCode: 404, statusMessage: 'Lore not found' })

  // Process partial locks
  const finalContent = chapterSlug
    ? processLoreContent(lore.content, chapters, chapterSlug)
    : lore.content

  const md = new MarkdownIt({ html: true, breaks: true, typographer: true })
  const html = md.render(finalContent)

  return { title: lore.title, content: html }
})