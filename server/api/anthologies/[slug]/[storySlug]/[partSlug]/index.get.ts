import { getAnthologyBySlug, getAnthologyStories, getAnthologyPartContent } from '../../../../../utils/works.server'
import { extractSkipTargets, extractExplicitSections } from '../../../../../utils/markdown'



export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  const storySlug = getRouterParam(event, 'storySlug')
  const partSlug = getRouterParam(event, 'partSlug')
  if (!slug || !storySlug || !partSlug) throw createError({ statusCode: 400 })

  const anthology = getAnthologyBySlug(slug)
  if (!anthology) throw createError({ statusCode: 404 })

  const stories = getAnthologyStories(slug)
  const story = stories.find(s => s.slug === storySlug)
  if (!story || story.isSingleFile) throw createError({ statusCode: 404 })

  const part = getAnthologyPartContent(slug, storySlug, partSlug)
  if (!part) throw createError({ statusCode: 404 })

  // 1. process skip targets
  const { processedContent: afterSkips, skipTargets } = extractSkipTargets(part.content)
  
  // 2. process explicit sections (using a MarkdownIt instance)
  const {cleanedContent, explicitSections} = extractExplicitSections(afterSkips)

  return {
    workTitle: `${anthology.title} – ${story.title}`,
    currentTitle: part.title,
    chapters: story.parts.map(p => ({ slug: p.slug, title: p.title })),
    backLink: `/anthologies/${slug}`,
    chapterBasePath: `/anthologies/${slug}/${storySlug}`,
    content: cleanedContent,
    lore: anthology.lore || null,
    workSlug: slug,
    workType: 'anthologies',
    skipTargets,
    explicitSections,
  }
})