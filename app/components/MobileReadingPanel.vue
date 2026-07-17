<template>
  <div v-if="hasContent || true" class="sm:hidden">
    <!-- FAB -->
    <button
      v-if="!modelValue"
      @pointerdown.prevent="$emit('update:modelValue', true)"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 bg-white/70 dark:bg-gray-800/70  border border-gray-300 dark:border-gray-600 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      style="touch-action: manipulation;"
      aria-label="Open reading navigation"
    >
      <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Bottom sheet -->
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex flex-col justify-end"
    >
      <div class="absolute inset-0 bg-black/30" @click="$emit('update:modelValue', false)" />
      <div class="relative bg-white dark:bg-gray-900 rounded-t-xl max-h-[80vh] flex flex-col">
        <div class="absolute top-4 right-4">
          <button
            @pointerdown.prevent="$emit('update:modelValue', false)"
            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-label="Close reading navigation"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-4 h-full flex flex-col">
          <ReadingPanelCore
            v-bind="coreProps"
            @close="$emit('update:modelValue', false)"
            @lore-open="(url) => loreOpenHandler(url)"
            @update:lore-chapter="(val) => $emit('update:loreChapter', val)"
          />
        </div>
        <!-- <div class="flex h-16 w-full shrink-0 border-t border-gray-600"></div> -->
      </div>
    </div>
  </div>
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

const loreSafe = computed(() => props.lore || [])
const hasContent = computed(() => props.chapters.length > 0 || loreSafe.value.length > 0 || props.skipTargets.length > 0)

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