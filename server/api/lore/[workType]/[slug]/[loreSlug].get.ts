import { getNovelBySlug, getAnthologyBySlug, getLoreContent } from '../../../../utils/works.server'
import path from 'path'

export default defineEventHandler(async (event) => {
  const workType = getRouterParam(event, 'workType')
  const slug = getRouterParam(event, 'slug')
  const loreSlug = getRouterParam(event, 'loreSlug')

  if (!workType || !slug || !loreSlug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
  }

  let workDir = ''

  if (workType === 'novels') {
    const novel = getNovelBySlug(slug)
    if (!novel || !novel.lore?.length) throw createError({ statusCode: 404 })
    workDir = path.join(process.cwd(), 'content', 'novels', novel.type === 'long-novel' ? 'long-novels' : 'short-novels', slug)
  } else if (workType === 'anthologies') {
    const anthology = getAnthologyBySlug(slug)
    if (!anthology || !anthology.lore?.length) throw createError({ statusCode: 404 })
    workDir = path.join(process.cwd(), 'content', 'anthologies', slug)
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid work type' })
  }

  const lore = getLoreContent(workDir, loreSlug)
  if (!lore) {
    throw createError({ statusCode: 404, statusMessage: 'Lore not found' })
  }
  return lore
})