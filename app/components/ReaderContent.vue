<template>
  <DesktopReadingPanel
    v-model="desktopPanelOpen"
    v-model:active-tab="activeTab"
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
  />

  <MobileReadingPanel
    v-model="mobileSheetOpen"
    v-model:active-tab="activeTab"
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
  />

  <main class="max-w-3xl mx-auto px-4">
    <!-- Prev/Next navigation (top) -->
    <nav v-if="showNavigation" class="flex justify-between items-center py-4 border-t border-b border-gray-200 dark:border-gray-700 my-4">
      <div>
        <NuxtLink v-if="prevChapter" :to="`${chapterBasePath}/${prevChapter.slug}`" class="text-xs sm:text-sm font-medium text-brand-lightest hover:underline">
          ← Previous Chapter
        </NuxtLink>
        <span v-else class="text-sm text-gray-400 dark:text-gray-600">Start</span>
      </div>
      <!-- <div class="text-sm text-gray-500 dark:text-gray-400">Chapter {{ currentNumber }}</div> -->
      <div>
        <NuxtLink v-if="nextChapter" :to="`${chapterBasePath}/${nextChapter.slug}`" class="text-xs sm:text-sm font-medium text-brand-lightest hover:underline">
          Next Chapter →
        </NuxtLink>
        <span v-else class="text-sm text-gray-400 dark:text-gray-600">End</span>
      </div>
    </nav>
    <div v-else class="h-10"></div>

    <article :class="['prose prose-lg dark:prose-invert max-w-none [&_p]:my-4 [&_p]:leading-relaxed',  fontSizeClass]">
      <h1 class="mb-10 text-4xl drop-cap">{{ currentTitle }}</h1>
      <template v-for="(part, index) in contentParts" :key="index">
        <div v-if="part.type === 'markdown'" v-html="part.html"></div>
        <Collapsible
          v-else-if="part.type === 'explicit'"
          :title="part.title"
          :open="explicitPreference === 'expanded'"
        >
          <div v-html="part.html" />
        </Collapsible>
      </template>
    </article>

    <!-- Prev/Next navigation (bottom) -->
    <nav v-if="showNavigation" class="flex justify-between items-center py-4 border-t border-b border-gray-200 dark:border-gray-700 my-4">
      <div>
        <NuxtLink v-if="prevChapter" :to="`${chapterBasePath}/${prevChapter.slug}`" class="text-xs sm:text-sm font-medium text-brand-lightest hover:underline">
          ← Previous Chapter
        </NuxtLink>
        <span v-else class="text-sm text-gray-400 dark:text-gray-600">Start</span>
      </div>
      <!-- <div class="text-sm text-gray-500 dark:text-gray-400">Chapter {{ currentNumber }}</div> -->
      <div>
        <NuxtLink v-if="nextChapter" :to="`${chapterBasePath}/${nextChapter.slug}`" class="text-xs sm:text-sm font-medium text-brand-lightest hover:underline">
          Next Chapter →
        </NuxtLink>
        <span v-else class="text-sm text-gray-400 dark:text-gray-600">End</span>
      </div>
    </nav>
  </main>

  

  <LoreOverlay
    :lore-url="loreUrl"
    :open="loreOpen"
    @close="closeLoreOverlay"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
// ---- explicit content global preference ----
import { useExplicitPreference } from '~/composables/useExplicitPreference'

import MarkdownIt from 'markdown-it'
import Collapsible from '~/components/Collapsible.vue'

const md = new MarkdownIt({ html: true, breaks: true, typographer: true })


const explicitPreference = useExplicitPreference().explicitPreference

const props = defineProps({
  workTitle: String,
  currentTitle: String,
  chapters: Array,
  backLink: String,
  chapterBasePath: String,
  content: String,
  lore: Array,
  workSlug: String,
  workType: String,
  skipTargets: { type: Array, default: () => [] },
  explicitSections: { type: Array, default: () => [] },
})


// State
const desktopPanelOpen = ref(false)
const mobileSheetOpen = ref(false)
const activeTab = ref('settings')
const loreOpen = ref(false)
const loreUrl = ref(null)

// Chapter navigation
const currentIndex = computed(() => props.chapters.findIndex(ch => ch.title === props.currentTitle))
const prevChapter = computed(() => currentIndex.value > 0 ? props.chapters[currentIndex.value - 1] : null)
const nextChapter = computed(() => currentIndex.value < props.chapters.length - 1 ? props.chapters[currentIndex.value + 1] : null)
const showNavigation = computed(() => props.chapters.length > 1)
const currentNumber = computed(() => currentIndex.value + 1)


function openLoreOverlay(url) {
  loreUrl.value = url
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
    case 'md': return 'text-md'
    case 'lg': return 'text-lg'
    case 'xl': return 'text-xl'
    case '2xl': return 'text-2xl'
  }
})



const contentParts = computed(() => {
  const parts = []
  const placeholderRegex = /<!--\s*explicit-placeholder-explicit-(\d+)\s*-->/g
  let lastIndex = 0
  let match

  while ((match = placeholderRegex.exec(props.content)) !== null) {
    // Add markdown before placeholder
    if (match.index > lastIndex) {
      parts.push({ type: 'markdown', html: md.render(props.content.slice(lastIndex, match.index)) })
    }

    // Add explicit section
    const id = parseInt(match[1])
    const section = props.explicitSections[id]
    if (section) {
      parts.push({ type: 'explicit', title: "Title", html: section.html })
    }
    lastIndex = match.index + match[0].length
  }
  
  // Remaining markdown
  if (lastIndex < props.content.length) {
    parts.push({ type: 'markdown', html: md.render(props.content.slice(lastIndex)) })
  }
  
  return parts
})



</script>