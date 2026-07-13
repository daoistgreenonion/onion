export default defineEventHandler((event) => {
  if (event.path.startsWith('/embed-lore/')) {
    setResponseHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
  }
})