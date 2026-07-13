import { getAllShortStories } from '../utils/works.server'

export default defineEventHandler(() => {
  return getAllShortStories()
})