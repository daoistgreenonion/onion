import { getAllAnthologies } from '../utils/works.server'

export default defineEventHandler(() => {
  return getAllAnthologies()
})