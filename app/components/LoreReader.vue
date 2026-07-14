<template>
  <div>
    <DesktopReadingPanel
      v-model="desktopPanelOpen"
      v-model:activeTab = "activeTab" 
      v-model:selectedChapter = "selectedChapter"
      :work-title="workTitle"
      :lore="filteredLore"
      :chapters= "chapters"
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      :back-link="backLink"
      chapter-base-path=""
      current-title="Lore"
      activeTab="lore"
      :loreOnly="true"
      @update:selectedChapter="(val) => selectedChapter = val"
    />

    <MobileReadingPanel
      v-model="mobileSheetOpen"
      v-model:activeTab = "activeTab" 
      v-model:selectedChapter = "selectedChapter"
      :work-title="workTitle"
      :lore="filteredLore"
      :chapters= "chapters"
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      :back-link="backLink"
      chapter-base-path=""
      current-title="Lore"
      activeTab="lore"
      :loreOnly="true"
      @update:selectedChapter="(val) => selectedChapter = val"
    />

    <main class="pt-2 sm:px-4">
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
const activeTab = ref('lore')

// If a specific lore slug is given (direct link), pre‑select it; otherwise default to first chapter.
const selectedChapter = ref(props.chapters?.[0]?.slug || '')
const selectedLoreSlug = ref(props.initialSlug || props.lore?.[0]?.slug || null)

const iframeSrc = computed(() => {
  if (!selectedLoreSlug.value) return ''
  const params = new URLSearchParams()
  if (selectedChapter.value) params.set('chapter', selectedChapter.value)
  if (explicitPreference.value) params.set('explicit', explicitPreference.value)
  let url = `/embed-lore/${props.workType}/${props.workSlug}/${selectedLoreSlug.value}`
  const qs = params.toString()
  if (qs) url += `?${qs}`
  return url
})

function handleLoreClick(url) {
  // url is like `/embed-lore/novels/slug/loreSlug`
  const parts = url.split('/')
  const slug = parts[parts.length - 1]
  selectedLoreSlug.value = slug
}

// computed property
const filteredLore = computed(() => {
  if (!props.lore) return []
  return props.lore.filter(entry => {
    if (!entry.loreChapter) return true
    const reqIndex = props.chapters.findIndex(ch => ch.slug === entry.loreChapter)
    const curIndex = props.chapters.findIndex(ch => ch.slug === selectedChapter.value)
    return reqIndex !== -1 && reqIndex <= curIndex
  })
})

</script>