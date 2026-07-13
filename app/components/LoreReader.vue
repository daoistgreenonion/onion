<template>
  <div>
    <!-- Chapter selector – always shown, defaults to first chapter -->
    <div class="max-w-4xl mx-auto px-4 pt-4">
      <label for="lore-chapter-select" class="text-sm text-gray-600 dark:text-gray-400">
        Show lore as of chapter
      </label>
      <select
        id="lore-chapter-select"
        v-model="selectedChapter"
        class="ml-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option v-for="ch in chapters" :key="ch.slug" :value="ch.slug">
          {{ ch.title }}
        </option>
      </select>
    </div>

    <DesktopReadingPanel
      v-model="desktopPanelOpen"
      :work-title="workTitle"
      :lore="lore"
      :chapters="chapters"
      :lore-chapter-slug="selectedChapter"
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      active-tab="lore"
      :back-link="backLink"
      chapter-base-path=""
      current-title="Lore"
      :skip-targets="[]"
      :explicit-sections="[]"
    />

    <MobileReadingPanel
      v-model="mobileSheetOpen"
      :work-title="workTitle"
      :lore="lore"
      :chapters="chapters"
      :lore-chapter-slug="selectedChapter"
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      active-tab="lore"
      :back-link="backLink"
      chapter-base-path=""
      current-title="Lore"
    />

    <main class="max-w-4xl mx-auto py-12 px-4">
      <iframe
        v-if="iframeSrc"
        :src="iframeSrc"
        class="w-full h-[80vh] border-0 rounded-lg shadow-md bg-white dark:bg-gray-900"
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

const props = defineProps({
  workTitle: String,
  lore: Array,
  backLink: String,
  workSlug: String,
  workType: String,
  initialSlug: { type: String, default: '' },
  chapters: { type: Array, default: () => [] },
})

const desktopPanelOpen = ref(false)
const mobileSheetOpen = ref(false)

// If a specific lore slug is given (direct link), pre‑select it; otherwise default to first chapter.
const selectedChapter = ref(props.chapters?.[0]?.slug || '')
const selectedLoreSlug = ref(props.initialSlug || props.lore?.[0]?.slug || null)

const iframeSrc = computed(() => {
  if (!selectedLoreSlug.value) return ''
  let url = `/embed-lore/${props.workType}/${props.workSlug}/${selectedLoreSlug.value}`
  if (selectedChapter.value) {
    url += `?chapter=${selectedChapter.value}`
  }
  return url
})

function handleLoreClick(url) {
  // url is like `/embed-lore/novels/slug/loreSlug`
  const parts = url.split('/')
  const slug = parts[parts.length - 1]
  selectedLoreSlug.value = slug
}
</script>