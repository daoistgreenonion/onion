// utils/markdownRenderer.js
import MarkdownIt from 'markdown-it'


// Helper to escape HTML (for image alt text, etc.)
function escapeHtml(text:string) :string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}


// Parse layout keyword and caption from alt text
function parseAltText(text:string) : {layout:string; caption:string;} {
  const parts = text.trim().split(' ')
  const firstWord = parts[0]?.toLowerCase()

  if (firstWord === 'left' || firstWord === 'right' || firstWord === 'full' ||
      firstWord === 'leftbig' || firstWord === 'rightbig' || firstWord === 'center' || 
      firstWord === 'centersmall' || firstWord === 'loreleft') {
    return {
      layout: firstWord,
      caption: parts.slice(1).join(' '),
    }
  }

  return { layout: 'full', caption: text.trim() }
}

// Factory that creates a markdown‑it instance with the custom image renderer
export function createMarkdownItInstance() {
  const md = new MarkdownIt({ html: true, breaks: true, typographer: true })

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
      ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="block text-xs text-center text-gray-500 dark:text-gray-400 mt-1 hover:underline">Source (external link)</a>`
      : ''

    let wrapperClass = 'illustration w-full'

    if (layout === 'left') {
      wrapperClass += ' my-4 sm:float-left sm:mr-4 sm:mb-2 sm:w-1/3 lg:w-1/4'
    } else if (layout === 'right') {
      wrapperClass += ' my-4 sm:float-right sm:ml-4 sm:mb-2 sm:w-1/3 lg:w-1/4'
    } else if (layout === 'leftbig') {
      wrapperClass += ' my-4 sm:float-left sm:mr-4 sm:mb-2 sm:w-1/2'
    } else if (layout === 'rightbig') {
      wrapperClass += ' my-4 sm:float-right sm:ml-4 sm:mb-2 sm:w-1/2'
    } else if (layout === 'center') {
      wrapperClass += ' my-4 sm:w-2/3 sm:mx-auto sm:block sm:clear-both'
    } else if (layout === 'centersmall') {
      wrapperClass += ' my-4 sm:w-1/2 sm:mx-auto sm:block sm:clear-both'
    } else if (layout === 'loreleft') {
      wrapperClass += ' loreleft sm:float-left sm:mr-4 sm:mb-1 sm:w-1/2'
    } else {
      wrapperClass += ' clear-both'   // full
    }

    return `<span class="${wrapperClass}">${imgTag}${captionHtml}${sourceHtml}</span>`
  }

  // Detect lore links and add inline onclick handler
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (!token) return self.renderToken(tokens, idx, options)

    const href = token.attrGet('href') || ''
    if (href.startsWith('/embed-lore/') || href.startsWith('/lore/')) {
      const parts = href.split('/')
      const loreSlug = parts[parts.length - 1]
      if (loreSlug) {
        // Inline onclick to send message to parent window
        token.attrSet('onclick', `window.parent.postMessage({type:'navigate-lore',loreSlug:'${loreSlug}'},'*'); return false;`)
        token.attrSet('style', 'cursor:pointer;')
        // Remove the href so it doesn't navigate anywhere
        token.attrSet('href', '#')
      }
    }

    return self.renderToken(tokens, idx, options)
  }

  return md
}