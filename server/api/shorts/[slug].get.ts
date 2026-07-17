import { getShortStoryContent } from '../../utils/works.server'
import { extractSkipTargets, extractExplicitSections } from '../../utils/markdown'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })

  const story = getShortStoryContent(slug)
  if (!story) throw createError({ statusCode: 404, statusMessage: 'Short story not found' })

  // 1. process skip targets
  const { processedContent: afterSkips, skipTargets } = extractSkipTargets(story.content)

  // 2. extract explicit sections (returns cleaned content + structured array)
  const { trueCleanedContent, explicitSections, collapsibleSections } = extractExplicitSections(afterSkips)

  return {
    workTitle: story.title,
    currentTitle: story.title,
    chapters: [],
    backLink: '/short-stories',
    chapterBasePath: '',
    content: trueCleanedContent,           
    lore: null,
    workSlug: slug,
    workType: 'short-stories',
    skipTargets,
    explicitSections, 
    collapsibleSections,                  
  }
})