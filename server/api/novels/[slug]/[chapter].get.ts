import { getNovelBySlug, getNovelChapterContent } from '../../../utils/works.server'
import { extractSkipTargets, extractExplicitSections } from '../../../utils/markdown'


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

  return {
    workTitle: novel.title,
    currentTitle: chapterData.title,
    chapters: novel.chapters,
    backLink: `/novels/${slug}`,
    chapterBasePath: `/novels/${slug}`,
    content: cleanedContent,
    lore: novel.lore || null,
    workSlug: slug,
    workType: 'novels',
    skipTargets,
    explicitSections,
  }
})