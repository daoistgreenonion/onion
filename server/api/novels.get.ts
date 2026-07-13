import { getAllNovels } from '../utils/works.server'

export default defineEventHandler(() => {
  return getAllNovels()
})