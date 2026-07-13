<template>
  <div>
    <DesktopReadingPanel
      v-model="desktopPanelOpen"
      :work-title="workTitle"
      current-title="Lore"
      :chapters="[]"
      :lore="lore"
      :back-link="backLink"
      chapter-base-path=""
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      :active-tab="'lore'"
      @update:active-tab="() => {}"
    />

    <MobileReadingPanel
      v-model="mobileSheetOpen"
      :work-title="workTitle"
      current-title="Lore"
      :chapters="[]"
      :lore="lore"
      :back-link="backLink"
      chapter-base-path=""
      :work-slug="workSlug"
      :work-type="workType"
      :lore-open-handler="handleLoreClick"
      :active-tab="'lore'"
      @update:active-tab="() => {}"
    />

    <main class="max-w-5xl mx-auto py-12 px-4">
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
  lore: Array,        // { slug, title }[]
  backLink: String,   // e.g. /novels/slug
  workSlug: String,
  workType: String,   // 'novels' or 'anthologies'
  initialSlug: { type: String, default: '' },
})

const desktopPanelOpen = ref(false)
const mobileSheetOpen = ref(false)

const selectedLoreSlug = ref(props.initialSlug || props.lore?.[0]?.slug || null)

const iframeSrc = computed(() => {
  if (!selectedLoreSlug.value) return ''
  return `/embed-lore/${props.workType}/${props.workSlug}/${selectedLoreSlug.value}`
})

function handleLoreClick(url) {
  // url: /embed-lore/novels/slug/loreSlug
  const parts = url.split('/')
  const slug = parts[parts.length - 1]
  selectedLoreSlug.value = slug
}
</script>