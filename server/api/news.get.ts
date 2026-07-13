import { getAllNews } from '../utils/works.server'

export default defineEventHandler(() => {
  return getAllNews()
})