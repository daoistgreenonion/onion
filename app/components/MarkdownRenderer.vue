<template>
  <div v-html="renderedContent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

// Helper to escape HTML (for image alt text, etc.)
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const props = defineProps({
  content: { type: String, required: true },
})

const md = new MarkdownIt({ html: true, breaks: true, typographer: true })

// ---- custom image renderer ----
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx]
    if (!token) return ''

    const src = token.attrGet('src') || ''
    const alt = token.content || ''

    let sourceUrl = ''
    let textToParse = alt

    // Extract optional source URL from alt text
    if (alt) {
      const sourceMatch = alt.match(/<(https?:\/\/[^>]+)>\s*$/)
      if (sourceMatch && sourceMatch[1]) {
        sourceUrl = sourceMatch[1]
        textToParse = alt.slice(0, sourceMatch.index).trim()
      }
    }

  // Parse layout and caption from remaining text
    const { layout, caption } = parseAltText(textToParse)

    const safeCaption = escapeHtml(caption || alt)
    const imgTag = `<img src="${src}" alt="${safeCaption}" loading="lazy" class="rounded-lg shadow-md w-full h-auto" />`

    const captionHtml = caption
      ? `<span class="block text-sm italic text-center text-gray-600 dark:text-gray-400 mt-1">${safeCaption}</span>`
      : ''
    const sourceHtml = sourceUrl
      ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="block text-xs text-center text-gray-500 dark:text-gray-400 mt-1 hover:underline">Source</a>`
      : ''

  let wrapperClass = 'illustration w-full my-4'

  switch (layout) {
    case 'left':
      wrapperClass += ' sm:float-left sm:mr-4 sm:mb-2 sm:w-1/3 lg:w-1/4'
      break
    case 'right':
      wrapperClass += ' sm:float-right sm:ml-4 sm:mb-2 sm:w-1/3 lg:w-1/4'
      break
    case 'leftbig':
      wrapperClass += ' sm:float-left sm:mr-4 sm:mb-2 sm:w-1/2'
      break
    case 'rightbig':
      wrapperClass += ' sm:float-right sm:ml-4 sm:mb-2 sm:w-1/2'
      break
    case 'center':
      wrapperClass += ' sm:w-2/3 sm:mx-auto sm:block sm:clear-both'
      break
    default: // 'full'
      wrapperClass += ' clear-both'
  }

  return `<span class="${wrapperClass}">${imgTag}${captionHtml}${sourceHtml}</span>`
}


function parseAltText(text: string): { layout: 'full' | 'left' | 'right' | 'leftbig' | 'rightbig' | 'center'; caption: string } {
  const parts = text.trim().split(' ')
  const firstWord = parts[0]?.toLowerCase()

  if (firstWord === 'left' || firstWord === 'right' || firstWord === 'full' ||
      firstWord === 'leftbig' || firstWord === 'rightbig' || firstWord === 'center') {
    return {
      layout: firstWord,
      caption: parts.slice(1).join(' '),
    }
  }

  return { layout: 'full', caption: text.trim() }
}


const renderedContent = computed(() => md.render(props.content))
</script>