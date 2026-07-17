<template>
  <template v-if="hasChapters || hasLore || skipTargets.length || true">
    <!-- Toggle button -->
    <button
      v-if="!modelValue"
      @pointerdown.prevent="$emit('update:modelValue', true)"
      class="hidden sm:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg shadow-md items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Open reading navigation"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Side panel -->
    <div
      v-if="modelValue"
      class="hidden sm:block fixed top-11 right-0 w-72 2xl:w-80 bg-white dark:bg-gray-900 border-l border-t border-b border-gray-200 dark:border-gray-700 shadow-xl z-50"
      style="height: calc(100vh - 3rem);"
    >
      <div class="p-4 h-full flex flex-col">
        <div class="absolute top-2 right-2">
          <button
          v-if="!loreOnly"
            @pointerdown.prevent="$emit('update:modelValue', false)"
            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-label="Close panel"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ReadingPanelCore
          v-bind="coreProps"
          @close="$emit('update:modelValue', false)"
          @lore-open="(url) => loreOpenHandler(url)"
          @update:lore-chapter="(val) => $emit('update:loreChapter', val)"
        />
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import ReadingPanelCore from '~/components/ReadingPanelCore.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  workTitle: String,
  currentTitle: String,
  chapters: { type: Array, default: () => [] },
  lore: { type: Array, default: () => [] },
  backLink: String,
  chapterBasePath: String,
  workSlug: String,
  workType: String,
  loreOpenHandler: { type: Function, required: true },
  prevChapter: { type: Object, default: null },
  nextChapter: { type: Object, default: null },
  currentSlug: { type: String, default: '' },
  showNavigation: Boolean,
  loreOnly: Boolean,
  selectedLoreSlug: { type: String, default: '' },
  loreChapterSlug: { type: String, default: '' },
  skipTargets: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue', 'update:loreChapter'])

const hasChapters = computed(() => props.chapters.length > 0)
const skipTargets = computed(() => props.skipTargets || [])

const loreSafe = computed(() => props.lore || [])
const hasLore = computed(() => loreSafe.value.length > 0)



const coreProps = computed(() => ({
  workTitle: props.workTitle,
  currentTitle: props.currentTitle,
  chapters: props.chapters,
  lore: props.lore,
  backLink: props.backLink,
  chapterBasePath: props.chapterBasePath,
  workSlug: props.workSlug,
  workType: props.workType,
  prevChapter: props.prevChapter,
  nextChapter: props.nextChapter,
  currentSlug: props.currentSlug,
  showNavigation: props.showNavigation,
  loreOnly: props.loreOnly,
  selectedLoreSlug: props.selectedLoreSlug,
  loreChapterSlug: props.loreChapterSlug,
  skipTargets: props.skipTargets,
}))
</script>