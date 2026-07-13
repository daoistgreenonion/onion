import { getAnthologyBySlug, getAnthologyStories } from '../../../utils/works.server'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400 })

  const anthology = getAnthologyBySlug(slug)
  if (!anthology) throw createError({ statusCode: 404 })

  const stories = getAnthologyStories(slug)
  return { ...anthology, stories }
})