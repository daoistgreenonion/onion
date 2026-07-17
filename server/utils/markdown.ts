import MarkdownIt from 'markdown-it'

// Helper to escape HTML (for image alt text, etc.)
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Creates a markdown‑it instance with the custom image renderer
export function createMarkdownIt(): MarkdownIt {
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

  return md
}

/** Helper: parse layout keyword and caption from alt text */
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

export interface SkipTarget {
  id: string
  label: string
}

export function extractSkipTargets(content: string): {
  processedContent: string
  skipTargets: SkipTarget[]
} {
  const skipTargets: SkipTarget[] = []
  let counter = 0

  // Replace [[skip:Label]] with an anchor and record the label
  const processedContent = content.replace(
    /\[\[skip:(.+?)\]\]/g,
    (_match, label) => {
      const id = `skip-${counter++}`
      skipTargets.push({ id, label: label.trim() })
      return `<a id="${id}" class="skip-anchor"></a>`
    }
  )

  return { processedContent, skipTargets }
}


/**
 * Extract explicit sections from raw markdown.
 * Returns cleaned content with placeholders and an array of structured sections.
 */
export function extractExplicitSections(content: string): {
  trueCleanedContent: string
  explicitSections: { title: string; html: string } []
  collapsibleSections: { title: string; html: string } []
} {
  const explicitSections: { title: string; html: string }[] = []
  const regex = /\[\[explicit:(.+?)\]\]\s*([\s\S]*?)\[\[\/explicit\]\]/g
  let counter = 0
  const collapsibleSections: { title: string; html: string }[] = []
  const regexCol = /\[\[collapsible:(.+?)\]\]\s*([\s\S]*?)\[\[\/collapsible\]\]/g
  let counterCol = 0

  const cleanedContent = content.replace(regex, (_match, title, innerContent) => {
    const id = `explicit-${counter++}`
    // Render inner markdown with proper image handling
    const md = createMarkdownIt()
    const renderedHtml = md.render(innerContent.trim())
    explicitSections.push({ title: title.trim(), html: renderedHtml })
    return `<!-- explicit-placeholder-${id} -->` // placeholder to keep position
  })
  const trueCleanedContent = cleanedContent.replace(regexCol, (_match, title, innerContent) => {
    const id = `collapsible-${counterCol++}`
    // Render inner markdown with proper image handling
    const md = createMarkdownIt()
    const renderedHtml = md.render(innerContent.trim())
    collapsibleSections.push({ title: title.trim(), html: renderedHtml })
    return `<!-- collapsible-placeholder-${id} -->` // placeholder to keep position
  })

  return { trueCleanedContent, explicitSections, collapsibleSections }
}

