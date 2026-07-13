// composables/useFontSize.js
const FONT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
export const fontSize = ref('md')

export function useFontSize() {
  if (import.meta.client && !fontSize._initialized) {
    fontSize._initialized = true
    const stored = localStorage.getItem('reader-font-size')
    if (FONT_SIZES.includes(stored)) {
      fontSize.value = stored
    }
  }

  function setFontSize(size) {
    if (!FONT_SIZES.includes(size)) return
    fontSize.value = size
    if (import.meta.client) {
      localStorage.setItem('reader-font-size', size)
    }
  }

  return { fontSize, setFontSize }
}