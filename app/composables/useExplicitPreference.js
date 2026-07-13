// composables/useExplicitPreference.js
const EXPLICIT_KEY = 'explicit-preference'

export const explicitPreference = ref('collapsed')

export function useExplicitPreference() {
  // ---------- client‑only ----------
  if (import.meta.client) {
    // 1. initialise once on first call
    if (!explicitPreference._initialized) {
      explicitPreference._initialized = true
      const stored = localStorage.getItem(EXPLICIT_KEY)
      if (stored === 'expanded') {
        explicitPreference.value = 'expanded'
      }
      syncHtmlClass()
    }
  }

  // 2. toggle function (always defined)
  function toggleExplicitPreference() {
    explicitPreference.value =
      explicitPreference.value === 'expanded' ? 'collapsed' : 'expanded'

    if (import.meta.client) {
      localStorage.setItem(EXPLICIT_KEY, explicitPreference.value)
      syncHtmlClass()
    }
  }

  // 3. helper to keep the <html> class in sync
  function syncHtmlClass() {
    if (import.meta.client) {
      document.documentElement.classList.toggle(
        'explicit',
        explicitPreference.value === 'expanded'
      )
    }
  }

  return { explicitPreference, toggleExplicitPreference }
}