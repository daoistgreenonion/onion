
function escapeHtml(text: string): string {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Process collapsible and explicit blocks in already‑rendered HTML.
 * Supports both separate‑paragraph and same‑paragraph markers.
 */
export function processCollapsibleAndExplicit(html: string, explicitPref: string): string {
  // Tokenise the raw HTML into text and markers
  const tokenPattern = /\[\[\/?(?:collapsible|explicit)(?::(.*?))?\]\]/g
  const tokens: { type: 'text' | 'open' | 'close'; value: string; blockType?: string; title?: string }[] = []
  let lastIndex = 0
  let match

  while ((match = tokenPattern.exec(html)) !== null) {
    // text before this marker
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: html.slice(lastIndex, match.index) })
    }
    const fullMatch = match[0]
    if (fullMatch.startsWith('[[/')) {
      // closing tag
      tokens.push({ type: 'close', value: fullMatch })
    } else {
      // opening tag – extract type and title
      const parts = fullMatch.slice(2, -2).split(':')
      const blockType = parts[0] as 'collapsible' | 'explicit'
      const title = parts.slice(1).join(':') // title may contain colons
      tokens.push({ type: 'open', value: fullMatch, blockType, title })
    }
    lastIndex = match.index + fullMatch.length
  }
  // remaining text
  if (lastIndex < html.length) {
    tokens.push({ type: 'text', value: html.slice(lastIndex) })
  }

  // Stack-based builder – each entry holds the buffer, the blockType, and the title
  interface StackEntry {
    type: 'collapsible' | 'explicit'
    title: string
    buffer: string   // inner HTML accumulated so far
  }
  const stack: StackEntry[] = [] 
  let output = ''

  for (const token of tokens) {
    if (token.type === 'text') {
      if (stack.length > 0) {
        const top = stack[stack.length - 1]
        if (top) top.buffer += token.value
      } else {
        output += token.value
      }
    } else if (token.type === 'open' && token.blockType && token.title !== undefined) {
      stack.push({ type: token.blockType as 'collapsible' | 'explicit', title: token.title, buffer: '' })
    } else if (token.type === 'close') {
      if (stack.length === 0) continue // stray close tag, ignore
      const entry = stack.pop()!
      // Build the collapsible HTML for this entry
      const safeTitle = escapeHtml(entry.title.trim())
      const isExplicit = entry.type === 'explicit'
      const initiallyOpen = isExplicit && explicitPref === 'expanded'
      const sectionClass = isExplicit ? 'explicit-section' : ''

      let iconHtml = ''
      if (isExplicit) {
        iconHtml = `
          <span class="explicit-icon-closed inline-flex items-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
            </svg>
          </span>
          <span class="explicit-icon-open hidden">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </span>
        `
      } else {
        iconHtml = `<span class="collapsible-icon">${initiallyOpen ? '−' : '+'}</span>`
      }

      const blockHtml = `<div class="collapsible-section ${sectionClass} ${initiallyOpen ? 'open' : ''} border border-gray-200 dark:border-gray-700 rounded-lg my-4">
        <button class="collapsible-toggle flex items-start justify-between gap-2 text-lg font-semibold text-brand-lightest w-full hover:bg-gray-200/50 dark:hover:bg-gray-600/50 p-4"
                aria-expanded="${initiallyOpen ? 'true' : 'false'}"
                onclick="const section=this.closest('.collapsible-section');section.classList.toggle('open');this.setAttribute('aria-expanded',section.classList.contains('open'))">
          <div class="text-start">
            <p class="text-md sm:text-lg text-brand dark:text-brand-lightest !m-0">
              ${safeTitle}
            </p>
            <p class="text-sm text-gray-500 !m-0">${initiallyOpen ? '(Expanded, click to collapse)' : '(Collapsed, click to expand)'}</p>
          </div>
          ${iconHtml} 
        </button>
        <div class="collapsible-content p-2 pt-0 hidden !m-0">
          ${entry.buffer}
        </div>
      </div>`

      // Append to parent stack if any, otherwise to output
      // Append to parent stack if any, otherwise to output
      if (stack.length > 0) {
        const parent = stack[stack.length - 1]
        if (parent) parent.buffer += blockHtml
      } else {
        output += blockHtml
      }
    }
  }

  // Any unclosed open tags (shouldn't happen) – dump their buffer as-is
  while (stack.length > 0) {
    const entry = stack.pop()!
    if (stack.length > 0) {
      const parent = stack[stack.length - 1]
      if (parent) parent.buffer += entry.buffer
    } else {
      output += entry.buffer
    }
  }

  return output
}