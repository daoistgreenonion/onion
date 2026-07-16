<template>
  <div>
    <DesktopReadingPanel
      v-model="desktopPanelOpen"
      :work-title="workTitle"
      :lore="filteredLore"
      :chapters= "chapters"
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      :back-link="backLink"
      chapter-base-path=""
      current-title="Lore"
      :loreOnly="true"
      @update:loreChapter="(val) => selectedChapter = val"
      :selectedLoreSlug = "selectedLoreSlug"
      :lore-chapter-slug="selectedChapter"
    />

    <MobileReadingPanel
      v-model="mobileSheetOpen"
      :work-title="workTitle"
      :lore="filteredLore"
      :chapters= "chapters"
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      :back-link="backLink"
      chapter-base-path=""
      current-title="Lore"
      :loreOnly="true"
      @update:loreChapter="(val) => selectedChapter = val"
      :selectedLoreSlug = "selectedLoreSlug"
      :lore-chapter-slug="selectedChapter"
    />

    <main class="pt-2 px-0 sm:px-4">
      <iframe
        v-if="iframeSrc"
        :src="iframeSrc"
        class="w-full h-[90vh] border-0 rounded-lg shadow-md bg-white dark:bg-gray-900"
        title="Lore"
        sandbox="allow-scripts allow-same-origin"
      />
      <div v-else class="text-center text-gray-500 dark:text-gray-400 py-20">
        Select a lore entry to begin reading.
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExplicitPreference } from '~/composables/useExplicitPreference'
const { explicitPreference } = useExplicitPreference()

const props = defineProps({
  workTitle: String,
  lore: Array,
  backLink: String,
  workSlug: String,
  workType: String,
  initialSlug: { type: String, default: '' },
  chapters: { type: Array, default: () => [] },
})

const desktopPanelOpen = ref(true)
const mobileSheetOpen = ref(false)

const defaultLoreSlug = computed(() => {
  if (!props.lore || props.lore.length === 0) return null
  const mainEntry = props.lore.find(entry => entry.slug === 'main')
  return mainEntry ? mainEntry.slug : props.lore[0].slug
})

const selectedChapter = ref('')   // was props.chapters?.[0]?.slug || ''
const selectedLoreSlug = ref(props.initialSlug || defaultLoreSlug.value)

// Lore navigation history
const loreHistory = ref([])

const iframeSrc = computed(() => {
  if (!selectedLoreSlug.value) return ''
  const params = new URLSearchParams()
  if (selectedChapter.value) params.set('chapter', selectedChapter.value)
  if (explicitPreference.value) params.set('explicit', explicitPreference.value)
  // Add theme
  if (typeof document !== 'undefined') {
    const dark = document.documentElement.classList.contains('dark')
    params.set('theme', dark ? 'dark' : 'light')
  }
  let url = `/embed-lore/${props.workType}/${props.workSlug}/${selectedLoreSlug.value}`
  const qs = params.toString()
  if (qs) url += `?${qs}`
  return url
})

// Handle lore navigation (from panels or internal links)
function handleLoreClick(url) {
  const basePath = `/embed-lore/${props.workType}/${props.workSlug}/`
  const fullSlug = url.startsWith(basePath) ? url.slice(basePath.length) : url.split('/').pop()
  if (selectedLoreSlug.value) {
    loreHistory.value.push(selectedLoreSlug.value)
  }
  selectedLoreSlug.value = fullSlug
}

function goBack() {
  if (loreHistory.value.length > 0) {
    const prev = loreHistory.value.pop()
    selectedLoreSlug.value = prev
  }
}

// Listen for messages from the iframe (lore links)
function onMessage(event) {
  if (event.data?.type === 'navigate-lore' && event.data.loreSlug) {
    if (event.data.loreSlug === ':back:') {
      goBack()
    } else {
      if (selectedLoreSlug.value) {
        loreHistory.value.push(selectedLoreSlug.value)
      }
      selectedLoreSlug.value = event.data.loreSlug
    }
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
})

// computed property
const filteredLore = computed(() => {
  if (!props.lore) return []
  return props.lore.filter(entry => {
    // existing chapter filter
    if (selectedChapter.value) {
      const chapterNum = parseInt(selectedChapter.value)
      if (!isNaN(chapterNum)) {
        if (entry.loreChapter) {
          const reqNum = parseInt(entry.loreChapter)
          if (!isNaN(reqNum) && reqNum > chapterNum) return false
        }
      }
    } else {
      if (entry.loreChapter) return false
    }
    // explicit filter
    if (entry.explicit && explicitPreference.value !== 'expanded') return false
    return true
  })
})

</script>