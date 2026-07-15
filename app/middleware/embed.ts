export default defineEventHandler((event) => {
  if (event.path.startsWith('/embed-lore/')) {
    setResponseHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
    // Optionally also remove any other restrictive headers
    removeResponseHeader(event, 'X-Frame-Options') // no-op, but we set above
  }
})