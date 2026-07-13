import { getNovelBySlug } from '../../utils/works.server'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
  }
  const novel = getNovelBySlug(slug)
  if (!novel) {
    throw createError({ statusCode: 404, statusMessage: 'Novel not found' })
  }
  return novel
})