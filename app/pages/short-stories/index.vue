<template>
  <main class="max-w-5xl mx-auto py-12 px-4">
    <div class="flex justify-between sm:mb-8">
      <h1 class="text-4xl font-bold">Short Stories</h1>
  
      <!-- Mobile toggle icons (unchanged) -->
      <div class="sm:hidden flex items-center gap-2 mb-4">
        <button
          @pointerdown.prevent="showControls = !showControls"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2"
          aria-label="Toggle sort and filter"
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>
  
      <!-- Desktop controls (always visible) -->
      <div class="hidden sm:flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label for="sort-desktop" class="text-sm text-gray-600 dark:text-gray-400">Sort</label>
          <select
            id="sort-desktop"
            v-model="currentSort"
            class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Title A‑Z</option>
          </select>
        </div>
  
        <div class="flex items-center gap-2">
          <label for="maintag-desktop" class="text-sm text-gray-600 dark:text-gray-400">Genre</label>
          <select
            id="maintag-desktop"
            v-model="selectedMaintag"
            class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option v-for="tag in allMaintags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
        </div>
      </div>
  
    </div>
    
    <!-- Mobile controls (shown/hidden via Vue) -->
    <div v-if="showControls" class="sm:hidden flex flex-wrap items-center gap-4 mb-8 bg-gray-200 dark:bg-gray-200/20">
      <div class="flex items-center gap-2">
        <label for="sort-mobile" class="text-sm text-gray-600 dark:text-gray-400">Sort</label>
        <select
          id="sort-mobile"
          v-model="currentSort"
          class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Title A‑Z</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label for="maintag-mobile" class="text-sm text-gray-600 dark:text-gray-400">Genre</label>
        <select
          id="maintag-mobile"
          v-model="selectedMaintag"
          class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option v-for="tag in allMaintags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </div>
    </div>

    <div class="mb-8">
        <p class="block explicit:hidden" >
          Explicit content is currently hidden, so some works may be missing from display. If you are an adult, and wish to view it, toggle the "SFW" icon in navigation bar at the top of the screen to show explicit content.
          <NuxtLink to="/about" class="text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 hover:underline font-bold">Click here to learn more</NuxtLink>
        </p>
      </div>

    <!-- Story list -->
    <div class="space-y-6">
      <ShortsCard
        v-for="story in sortedStories"
        :key="story.slug"
        :work="story"
        :link="`/short-stories/${story.slug}`"
      />
    </div>
  </main>
</template>

<script setup>
import { useExplicitPreference } from '~/composables/useExplicitPreference'
const { explicitPreference } = useExplicitPreference()

import { ref, computed, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const currentSort = ref(route.query.sort || 'newest')
const selectedMaintag = ref(route.query.maintag || 'all')
const showControls = ref(false)

const { data: stories } = await useFetch('/api/shorts')

const filteredStories = computed(() =>
  (stories.value || [])
    .filter(n => explicitPreference.value === 'expanded' || !n.explicit)
)

// Collect all unique maintags across stories
const allMaintags = computed(() => {
  const tags = new Set()
  ;(filteredStories.value || []).forEach(s => {
    (s.maintags || []).forEach(t => tags.add(t))
  })
  return [...tags].sort()
})

const sortedStories = computed(() => {
  let list = filteredStories.value || []

  // Filter by selected maintag
  if (selectedMaintag.value !== 'all') {
    list = list.filter(s => (s.maintags || []).includes(selectedMaintag.value))
  }

  // Sort
  const sorted = [...list]
  if (currentSort.value === 'oldest') {
    sorted.sort((a, b) => (a.date ? new Date(a.date).getTime() : 0) - (b.date ? new Date(b.date).getTime() : 0))
  } else if (currentSort.value === 'az') {
    sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  } else {
    sorted.sort((a, b) => (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0))
  }
  return sorted
})

// Sync state to URL without reload
watch([currentSort, selectedMaintag], ([sort, maintags]) => {
  router.replace({ query: { sort, maintags } })
})
</script>