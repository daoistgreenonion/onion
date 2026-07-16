import { getNovelBySlug, getNovelChapterContent } from '../../../utils/works.server'
import { extractSkipTargets, extractExplicitSections } from '../../../utils/markdown'
import { processInlineLore } from '../../../utils/processInlineLore'
import path from 'path'


export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const chapter = getRouterParam(event, 'chapter')

  if (!slug || !chapter) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug or chapter' })
  }

  const novel = getNovelBySlug(slug)
  if (!novel) {
    throw createError({ statusCode: 404, statusMessage: 'Novel not found' })
  }

  const chapterData = getNovelChapterContent(slug, chapter)
  if (!chapterData) {
    throw createError({ statusCode: 404, statusMessage: 'Chapter not found' })
  }

  // 1. process skip targets
  const { processedContent: afterSkips, skipTargets } = extractSkipTargets(chapterData.content)

  // 2. process explicit sections (using a MarkdownIt instance)
  const { cleanedContent, explicitSections }  = extractExplicitSections(afterSkips)

  // 3. Process inline lore
  // … inside event handler, after explicitSections:
  const workDir = path.join(
    process.cwd(),
    'content',
    'novels',
    novel.type === 'long-novel' ? 'long-novels' : 'short-novels',
    slug
  )

  
  const contentWithLore = processInlineLore(
    cleanedContent,            // content already processed for explicit/skips
    novel.lore || [],
    novel.chapters,
    chapter,
    workDir
  )



  return {
    workTitle: novel.title,
    currentTitle: chapterData.title,
    currentSlug: chapter,  
    chapters: novel.chapters,
    backLink: `/novels/${slug}`,
    chapterBasePath: `/novels/${slug}`,
    content: contentWithLore,
    lore: novel.lore  || null,
    workSlug: slug,
    workType: 'novels',
    skipTargets,
    explicitSections,
  }
})