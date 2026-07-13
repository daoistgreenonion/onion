<template>
  <div v-if="prevChapter || nextChapter" class="flex justify-between items-center gap-1 py-4 border-t border-b border-gray-200 dark:border-gray-700 my-4">
    <NuxtLink
      v-if="prevChapter"
      :to="`${chapterBasePath}/${prevChapter.slug}`"
      class="text-xs flex items-center sm:text-sm font-medium text-brand-lightest hover:underline"
      aria-label="Previous chapter"
      title="Previous chapter"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      PREV
    </NuxtLink>
    <span v-else class="p-1 w-4 h-4" /> <!-- empty spacer for alignment -->

    <!-- Current chapter number -->
    <span
      v-if="totalChapters > 1"
      class="text-xs text-gray-500 dark:text-gray-400 px-1"
    >
      Chapter {{ currentIndex + 1 }} / {{ totalChapters }}
    </span>

    <NuxtLink
      v-if="nextChapter"
      :to="`${chapterBasePath}/${nextChapter.slug}`"
      class="text-xs flex items-center sm:text-sm font-medium text-brand-lightest hover:underline"
      aria-label="Next chapter"
      title="Next chapter"
    >
      NEXT
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>
    <span v-else class="p-1 w-4 h-4" /> <!-- empty spacer for alignment -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  prevChapter: { type: Object, default: null },
  nextChapter: { type: Object, default: null },
  chapterBasePath: { type: String, required: true },
  chapters: { type: Array, default: () => [] },
  currentSlug: { type: String, default: '' },
})

const currentIndex = computed(() => {
  if (!props.currentSlug || !props.chapters.length) return 0
  return props.chapters.findIndex(ch => ch.slug === props.currentSlug)
})

const totalChapters = computed(() => props.chapters.length)
</script>