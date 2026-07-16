<template>
  <div v-if="lore" class="w-full h-full">
    <!-- Search toggle & input (only if searchable) -->
    <div v-if="lore.searchable" class="relative flex items-center">
      <!-- Search icon button (mobile: absolute; desktop: inline) -->
      <!-- <button
        @click="showSearch = !showSearch"
        class="sm:static sm:ml-auto p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :aria-label="showSearch ? 'Close search' : 'Open search'"
      >
      </button> -->
      <svg class="w-5 h-5 m-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <!-- Search input (shown/hidden) -->
      <transition name="fade">
        <div class="w-full">
          <input
            id="lore-search-input"
            v-model="searchTerm"
            type="text"
            :placeholder="`Search by ${lore.searchMode || 'title'}…`"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
            @input="onSearchInput"
          />
        </div>
      </transition>
    </div>

    <!-- Content area -->
    <div class="h-full overflow-y-auto" dir="rtl">
      <div dir="ltr" class="p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <article class="prose prose-lg dark:prose-invert max-w-none">
          <h1 class="text-3xl font-bold mb-6 text-brand-lightest">{{ lore.title }}</h1>
          <div v-html="lore.content" id="lore-content"></div>
        </article>
      </div>
    </div>
  </div>
  <div v-else class="p-4 text-red-500">
    Lore not found or an error occurred.
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

definePageMeta({ layout: false })

const route = useRoute()
const { workType, slug, loreSlug } = route.params
const chapterSlug = route.query.chapter || ''
const explicitPref = route.query.explicit || 'collapsed'


const params = new URLSearchParams()
if (chapterSlug) params.set('chapter', chapterSlug)
if (explicitPref) params.set('explicit', explicitPref)

const apiUrl = `/api/lore/${workType}/${slug}/${loreSlug}?${params.toString()}`
const { data: lore, error } = await useFetch(apiUrl)

if (error.value) {
  console.error(error.value)
}

// Search state
const showSearch = ref(false)
const searchTerm = ref('')

function onSearchInput() {
  nextTick(() => performSearch())
}

function performSearch() {
  const term = searchTerm.value.toLowerCase().trim()
  const container = document.getElementById('lore-content')
  if (!container) return

  const sections = container.querySelectorAll('.collapsible-section')
  sections.forEach(section => {
    let match = false
    if (term === '') {
      match = true
    } else {
      const toggleBtn = section.querySelector('.collapsible-toggle')
      const titleText = toggleBtn?.textContent?.toLowerCase() || ''

      if (lore.value?.searchMode === 'content') {
        const contentDiv = section.querySelector('.collapsible-content')
        const contentText = contentDiv?.textContent?.toLowerCase() || ''
        match = titleText.includes(term) || contentText.includes(term)
      } else {
        match = titleText.includes(term)
      }
    }
    section.style.display = match ? '' : 'none'
  })
}

// When lore content updates, re-run search
watch(() => lore.value?.content, () => {
  nextTick(() => performSearch())
})


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>