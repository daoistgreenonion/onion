<template>
  <DesktopReadingPanel
    v-model="desktopPanelOpen"
    :work-title="workTitle"
    :current-title="currentTitle"
    :chapters="chapters"
    :lore="lore"
    :back-link="backLink"
    :chapter-base-path="chapterBasePath"
    :work-slug="workSlug"
    :work-type="workType"
    :lore-open-handler="openLoreOverlay"
    :skipTargets="skipTargets"
    :showNavigation="showNavigation"
    :prevChapter="prevChapter"
    :nextChapter="nextChapter"
    :current-slug="currentSlug"
    :selectedLoreSlug = "selectedLoreSlug"
    :lore-chapter-slug="currentSlug"
  />
    
    <MobileReadingPanel
    v-model="mobileSheetOpen"
    :work-title="workTitle"
    :current-title="currentTitle"
    :chapters="chapters"
    :lore="lore"
    :back-link="backLink"
    :chapter-base-path="chapterBasePath"
    :work-slug="workSlug"
    :work-type="workType"
    :lore-open-handler="openLoreOverlay"
    :skipTargets="skipTargets"
    :showNavigation="showNavigation"
    :prevChapter="prevChapter"
    :nextChapter="nextChapter"
    :current-slug="currentSlug"
    :selectedLoreSlug = "selectedLoreSlug"
    :lore-chapter-slug="currentSlug"
  />

  <main class="max-w-2xl lg:max-w-[50%] 2xl:max-w-3xl mx-auto px-4">
    <!-- Prev/Next navigation (top) -->
    <nav v-if="showNavigation">
      <ChapterNavigation
        :prev-chapter="prevChapter"
        :next-chapter="nextChapter"
        :chapter-base-path="chapterBasePath"
        :chapters="chapters"
        :current-slug="currentSlug"
      />
    </nav>
    <div v-else class="h-10"></div>

    <article
      :class="['prose prose-lg dark:prose-invert max-w-none [&_p]:my-4 [&_p]:leading-relaxed', fontSizeClass]"
      @click="onArticleClick"
    >
      <h1 class="mb-10 text-4xl drop-cap">{{ currentTitle }}</h1>
      <template v-for="(part, index) in contentParts" :key="index">
      <div v-if="part.type === 'markdown'" v-html="part.html" />
      <Collapsible
        v-else-if="part.type === 'explicit'"
        :title="part.title"
        :open="explicitPreference === 'expanded'"
        type="explicit"
      >
        <div v-html="part.html" />
      </Collapsible>
      <Collapsible
        v-else-if="part.type === 'collapsible'"
        :title="part.title"
      >
        <div v-html="part.html" />
      </Collapsible>
    </template>
    </article>

    <!-- Prev/Next navigation (bottom) -->
    <nav v-if="showNavigation">
      <ChapterNavigation
        :prev-chapter="prevChapter"
        :next-chapter="nextChapter"
        :chapter-base-path="chapterBasePath"
        :chapters="chapters"
        :current-slug="currentSlug"
      />
    </nav>
  </main>

  

  <LoreOverlay
    :lore-url="loreUrl"
    :open="loreOpen"
    @close="closeLoreOverlay"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useExplicitPreference } from '~/composables/useExplicitPreference'
import Collapsible from '~/components/Collapsible.vue'
import { createMarkdownItInstance } from '~/utils/markdownRenderer'
const md = createMarkdownItInstance()

import { useRouter } from 'vue-router'
const router = useRouter()


const explicitPreference = useExplicitPreference().explicitPreference

const props = defineProps({
  workTitle: String,
  currentTitle: String,
  currentSlug: { type: String, default: '' },
  chapters: Array,
  backLink: String,
  chapterBasePath: String,
  content: String,
  lore: Array,
  workSlug: String,
  workType: String,
  skipTargets: { type: Array, default: () => [] },
  explicitSections: { type: Array, default: () => [] },
  collapsibleSections: { type: Array, default: () => [] },
})


// State
const desktopPanelOpen = ref(false)
const mobileSheetOpen = ref(false)
const loreOpen = ref(false)
const loreUrl = ref(null)

// Chapter navigation
const currentIndex = computed(() => {
  // prefer matching by slug if provided
  if (props.currentSlug) {
    return props.chapters.findIndex(ch => ch.slug === props.currentSlug)
  }
  // fallback to title (legacy behaviour)
  return props.chapters.findIndex(ch => ch.title === props.currentTitle)
})
const prevChapter = computed(() => currentIndex.value > 0 ? props.chapters[currentIndex.value - 1] : null)
const nextChapter = computed(() => currentIndex.value < props.chapters.length - 1 ? props.chapters[currentIndex.value + 1] : null)
const showNavigation = computed(() => props.chapters.length > 1)

const selectedLoreSlug = ref('')

// function onLoreLinkClick(event) {
//   const link = event.target.closest('.lore-link')
//   if (!link) return
//   event.preventDefault()
//   event.stopImmediatePropagation()
//   // Use the absolute URL including the hash
//   const fullUrl = link.href   // this is the full http://... URL, browser will include the hash
//   openLoreOverlay(fullUrl)
// }

function openLoreOverlay(url) {
  let cleanPath, hash
  const workSlug = props.workSlug || route.params.slug
  const workType = props.workType || 'novels'
  // then use these instead of props.xxx

  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Absolute URL – from lore link click
    const u = new URL(url)
    cleanPath = u.pathname
    hash = u.hash
  } else {
    // Relative path – from reading panel or other internal use
    const [pathPart, hashPart] = url.split('#')
    cleanPath = pathPart
    hash = hashPart ? '#' + hashPart : ''
  }

  const basePath = `/embed-lore/${workType}/${workSlug}/`
  const fullSlug = cleanPath.startsWith(basePath)
    ? cleanPath.slice(basePath.length)
    : cleanPath.split('/').pop()

  const params = new URLSearchParams({
    chapter: props.currentSlug || '',
    explicit: explicitPreference.value,
  })
  const overlayUrl = `${cleanPath}?${params.toString()}${hash}`

  // Update history
  if (selectedLoreSlug.value) {
    loreHistory.value.push(selectedLoreSlug.value)
  }
  selectedLoreSlug.value = fullSlug + (hash || '')

  loreUrl.value = overlayUrl
  loreOpen.value = true
}

function closeLoreOverlay() {
  loreOpen.value = false
  loreUrl.value = null
}

import { useFontSize } from '~/composables/useFontSize'
const { fontSize } = useFontSize()

// Map size to a Tailwind text class (if not using custom CSS)
const fontSizeClass = computed(() => {
  switch (fontSize.value) {
    case 'xs': return 'text-xs'
    case 'sm': return 'text-sm'
    case 'md': return 'text-base'
    case 'lg': return 'text-lg'
    case 'xl': return 'text-xl'
    case '2xl': return 'text-2xl'
  }
})



const contentParts = computed(() => {
  const parts = []
  // Collect all matches (both explicit and collapsible)
  const matches = []

  // Explicit placeholders
  const explicitRegex = /<!--\s*explicit-placeholder-explicit-(\d+)\s*-->/g
  let m
  while ((m = explicitRegex.exec(props.content)) !== null) {
    matches.push({
      index: m.index,
      end: m.index + m[0].length,
      type: 'explicit',
      id: parseInt(m[1]),
    })
  }

  // Collapsible placeholders
  const collapsibleRegex = /<!--\s*collapsible-placeholder-collapsible-(\d+)\s*-->/g
  while ((m = collapsibleRegex.exec(props.content)) !== null) {
    matches.push({
      index: m.index,
      end: m.index + m[0].length,
      type: 'collapsible',
      id: parseInt(m[1]),
    })
  }

  // Sort by position in the content
  matches.sort((a, b) => a.index - b.index)

  let lastIndex = 0
  for (const match of matches) {
    // Markdown before this placeholder
    if (match.index > lastIndex) {
      parts.push({
        type: 'markdown',
        html: md.render(props.content.slice(lastIndex, match.index)),
      })
    }

    // The section itself
    if (match.type === 'explicit') {
      const section = props.explicitSections[match.id]
      if (section) {
        parts.push({ type: 'explicit', title: section.title, html: section.html })
      }
    } else if (match.type === 'collapsible') {
      const section = props.collapsibleSections[match.id]
      if (section) {
        parts.push({ type: 'collapsible', title: section.title, html: section.html })
      }
    }

    lastIndex = match.end
  }

  // Remaining markdown after the last placeholder
  if (lastIndex < props.content.length) {
    parts.push({
      type: 'markdown',
      html: md.render(props.content.slice(lastIndex)),
    })
  }

  return parts
})



// Lock background when lore overlay is open on mobile
watch(loreOpen, (isOpen) => {
  if (!import.meta.client) return
  if (window.innerWidth >= 720) return   // desktop – do nothing

  if (isOpen) {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
  } else {
    const scrollY = document.body.style.top
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }
})



const loreHistory = ref([])

function onLoreMessage(event) {
  if (event.data && event.data.type === 'navigate-lore' && event.data.loreSlug) {
    const workType = props.workType || 'novels'
    const workSlug = props.workSlug || ''
    const params = new URLSearchParams({
      chapter: props.currentSlug || '',
      explicit: explicitPreference.value,
    })
    if (event.data.loreSlug === ':back:') {
      if (loreHistory.value.length > 0) {
        const prevUrl = loreHistory.value.pop()
        loreUrl.value = prevUrl
      }
    } else {
      const [slugPart, hashPart] = event.data.loreSlug.split('#')
      const hash = hashPart ? '#' + hashPart : ''
      const newUrl = `/embed-lore/${workType}/${workSlug}/${slugPart}?${params.toString()}${hash}`
      if (loreUrl.value) {
        loreHistory.value.push(loreUrl.value)
      }
      loreUrl.value = newUrl
    }
  }
}

// Smooth scroll skip targets to center
function onSkipClick(event) {
  const link = event.target.closest('a[href^="#"]')
  if (!link) return
  const id = link.getAttribute('href')?.slice(1)
  if (!id) return
  const target = document.getElementById(id)
  if (target) {
    event.preventDefault()
    target.scrollIntoView({ block: 'center', behavior: 'instant' })
  }
}

onMounted(() => {
  window.addEventListener('message', onLoreMessage)
  window.addEventListener('keydown', onKeyDown)
  document.addEventListener('click', onSkipClick)
  // document.addEventListener('click', onLoreLinkClick)
})

onUnmounted(() => {
  window.removeEventListener('message', onLoreMessage)
  window.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('click', onSkipClick)
  // document.removeEventListener('click', onLoreLinkClick)
})

function goBackLore() {
  if (loreHistory.value.length > 0) {
    const prevUrl = loreHistory.value.pop()
    loreUrl.value = prevUrl
  }
}

function onKeyDown(event) {
  // Ignore if the user is typing in an input, textarea, or contenteditable element
  const tag = event.target.tagName
  const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable
  if (isEditable) return

  if (event.key === 'ArrowLeft' && prevChapter.value) {
    event.preventDefault()
    router.push(`${props.chapterBasePath}/${prevChapter.value.slug}`)
  } else if (event.key === 'ArrowRight' && nextChapter.value) {
    event.preventDefault()
    router.push(`${props.chapterBasePath}/${nextChapter.value.slug}`)
  }
}

// Intercept lore link clicks in chapter content
// function onLoreLinkClick(event) {
//   const link = event.target.closest('.lore-link')
//   if (!link) return
//   event.preventDefault()
//   openLoreOverlay(link.href)
//   console.log('Link pressed, opening Lore Overlay', link)
// }

function onArticleClick(event) {
  const link = event.target.closest('.lore-link')
  if (link) {
    event.preventDefault()
    openLoreOverlay(link.href)
  }
}


</script>