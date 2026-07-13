import { getNewsBySlug } from '../../utils/works.server'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  const item = getNewsBySlug(slug)
  if (!item) throw createError({ statusCode: 404, statusMessage: 'News not found' })
  return item
})