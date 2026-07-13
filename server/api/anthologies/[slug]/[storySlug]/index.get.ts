import { getAnthologyBySlug, getAnthologyStories, getAnthologyStoryContent } from '../../../../utils/works.server'
import { extractSkipTargets, extractExplicitSections } from '../../../../utils/markdown'

// …

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const storySlug = getRouterParam(event, 'storySlug')
  if (!slug || !storySlug) throw createError({ statusCode: 400 })
    
  const anthology = getAnthologyBySlug(slug)
  if (!anthology) throw createError({ statusCode: 404 })
    
  const stories = getAnthologyStories(slug)
  const story = stories.find(s => s.slug === storySlug)
  if (!story || !story.isSingleFile) throw createError({ statusCode: 404 })

  const content = getAnthologyStoryContent(slug, storySlug)
  if (!content) throw createError({ statusCode: 404 })

  // 1. process skip targets
  const { processedContent: afterSkips, skipTargets } = extractSkipTargets(content.content)
  
  // 2. process explicit sections (using a MarkdownIt instance)
  const { cleanedContent, explicitSections } = extractExplicitSections(afterSkips)

  return {
    workTitle: anthology.title,
    currentTitle: content.title,
    chapters: stories.map(s => ({ slug: s.slug, title: s.title })),
    backLink: `/anthologies/${slug}`,
    chapterBasePath: `/anthologies/${slug}`,
    content: cleanedContent,
    lore: anthology.lore || null,
    workSlug: slug,
    workType: 'anthologies',
    skipTargets,
    explicitSections,
  }
})