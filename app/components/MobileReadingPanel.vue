<template>
  <!-- FAB -->
  <button
    v-if="!modelValue"
    @pointerdown.prevent="$emit('update:modelValue', true)"
    class="fixed bottom-6 right-6 z-40 w-12 h-12 bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors sm:hidden"
    style="touch-action: manipulation;"
    aria-label="Open reading navigation"
  >
    <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <!-- Bottom sheet -->
  <div v-if="modelValue" class="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
    <div class="absolute inset-0 bg-black/30" @click="$emit('update:modelValue', false)" />
    <div class="relative bg-white dark:bg-gray-900 rounded-t-xl flex flex-col" style="max-height: 70vh;">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div class="flex items-center justify-between">
          <NuxtLink :to="backLink" class="text-brand-lightest hover:underline mt-2 inline-block uppercase" @click="$emit('update:modelValue', false)">
            <h2 class="font-semibold text-lg truncate">{{ workTitle }}</h2>
          </NuxtLink>
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
        <p v-if="!loreOnly" class="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{{ currentTitle }}</p>

        


        <ChapterNavigation
          :prev-chapter="prevChapter"
          :next-chapter="nextChapter"
          :chapter-base-path="chapterBasePath"
          :chapters="chapters"
          :current-slug="currentSlug"
        />

        <!-- Tabs (unchanged) -->
        <div v-if="!loreOnly"  class="flex border-b border-gray-200 dark:border-gray-700 mt-3 mb-2">
          <button v-if="!loreOnly"
            @pointerdown.prevent="$emit('update:activeTab', 'settings')"
            :class="['flex-1 py-2 text-sm font-medium text-center', activeTab === 'settings' ? 'text-brand-lightest border-b-2 border-brand-lightest' : 'text-gray-500 dark:text-gray-400 border-b-2 border-transparent']"
          >
            Settings
          </button>
          <button v-if="skipTargets.length"
            @pointerdown.prevent="$emit('update:activeTab', 'navs')"
            :class="['flex-1 py-2 text-sm font-medium text-center', activeTab === 'navs' ? 'text-brand-lightest border-b-2 border-brand-lightest' : 'text-gray-500 dark:text-gray-400 border-b-2 border-transparent']"
          >
            Navs
          </button>
          <button v-if="hasChapters"
            @pointerdown.prevent="$emit('update:activeTab', 'chapters')"
            :class="['flex-1 py-2 text-sm font-medium text-center', activeTab === 'chapters' ? 'text-brand-lightest border-b-2 border-brand-lightest' : 'text-gray-500 dark:text-gray-400 border-b-2 border-transparent']"
          >
            Chapters
          </button>
          <button v-if="hasLore"
            @pointerdown.prevent="$emit('update:activeTab', 'lore')"
            :class="['flex-1 py-2 text-sm font-medium text-center', activeTab === 'lore' ? 'text-brand-lightest border-b-2 border-brand-lightest' : 'text-gray-500 dark:text-gray-400 border-b-2 border-transparent']"
          >
            Lore
          </button>
        </div>
      </div>

      <!-- Scrollable list area (fixed height) -->
      <div class="overflow-y-auto p-4 space-y-1" style="height: 16rem;">
        <template v-if="activeTab === 'settings'">
          <div class="w-full flex">
            <!-- Explicit toggle button -->
            <div class="w-1/2 flex justify-center border border-gray-100 dark:border-gray-600">
              <button
                @pointerdown.prevent="toggleExplicitPreference"
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                :aria-label="explicitPreference === 'expanded' ? 'Collapse explicit sections' : 'Expand explicit sections'"
                title="Toggle explicit content visibility"
              >
                <p v-if="explicitPreference === 'collapsed'" class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">SFW</p>
                <p v-else class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">
                  NSFW
                </p>
              </button>
            </div>
            <div class="w-1/2 flex justify-center border-t border-b border-r border-gray-100 dark:border-gray-600">
              <!-- Theme toggle -->
              <button @pointerdown.prevent="toggleTheme" class="p-2 rounded-md transition-colors" aria-label="Toggle theme">
                <!-- Moon icon (visible when dark) -->
                <svg v-if="isDark"  class="h-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <!-- Sun icon (visible when light) -->
                <svg v-else class="h-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-6 gap-0.5 border border-gray-100 dark:border-gray-600">
            <!-- Extra Small -->
            <button
              @pointerdown.prevent="setFontSize('xs')"
              class="px-1.5 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="fontSize === 'xs' ? 'text-brand-lightest font-bold underline' : 'text-gray-600 dark:text-gray-400'"
              aria-label="Small font size"
              title="Small"
            >
              Aa
            </button>
            <!-- Small -->
            <button
              @pointerdown.prevent="setFontSize('sm')"
              class="px-1.5 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="fontSize === 'sm' ? 'text-brand-lightest font-bold underline' : 'text-gray-600 dark:text-gray-400'"
              aria-label="Small font size"
              title="Small"
            >
              Aa
            </button>

            <!-- Medium -->
            <button
              @pointerdown.prevent="setFontSize('md')"
              class="px-1.5 py-1 text-md rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="fontSize === 'md' ? 'text-brand-lightest font-bold underline' : 'text-gray-600 dark:text-gray-400'"
              aria-label="Medium font size"
              title="Medium"
            >
              Aa
            </button>

            <!-- Large -->
            <button
              @pointerdown.prevent="setFontSize('lg')"
              class="px-1.5 py-1 text-lg rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="fontSize === 'lg' ? 'text-brand-lightest font-bold underline' : 'text-gray-600 dark:text-gray-400'"
              aria-label="Large font size"
              title="Large"
            >
              Aa
            </button>
            <!-- Extra Large -->
            <button
              @pointerdown.prevent="setFontSize('xl')"
              class="px-1.5 py-1 text-xl rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="fontSize === 'xl' ? 'text-brand-lightest font-bold underline' : 'text-gray-600 dark:text-gray-400'"
              aria-label="Large font size"
              title="Large"
            >
              Aa
            </button>
            <!-- EEExtra Large -->
            <button
              @pointerdown.prevent="setFontSize('2xl')"
              class="px-1.5 py-1 text-xl rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="fontSize === '2xl' ? 'text-brand-lightest font-bold underline' : 'text-gray-600 dark:text-gray-400'"
              aria-label="Large font size"
              title="Large"
            >
              Aa
            </button>
          </div>
        </template>

        <!-- Skip buttons -->
        <div v-if="skipTargets.length && activeTab === 'navs'" class="flex flex-col gap-2 mb-4">
          <a
            v-for="target in skipTargets"
            :key="target.id"
            :href="`#${target.id}`"
            class="px-3 py-1 text-sm rounded-md bg-brand hover:bg-brand-light text-white transition-colors"
          >
            {{ target.label }}
          </a>
        </div>

        <!-- Chapter list -->
        <template v-if="hasChapters && activeTab === 'chapters'">
          <NuxtLink
          v-for="ch in chapters"
          :key="ch.slug"
          :id="`chapter-${ch.slug}`"
          :to="`${chapterBasePath}/${ch.slug}`"
          @click="$emit('update:modelValue', false)"
          :class="['block px-2 py-1 rounded text-sm', ch.slug  === currentSlug  ? 'bg-brand-light/20 text-brand-light active-chapter' : 'hover:bg-gray-100 dark:hover:bg-gray-800']"
        >
          {{ ch.title }}
        </NuxtLink>
        </template>

        <!-- Lore list -->
        <template v-if="hasLore && activeTab === 'lore'">
          <button
            v-for="entry in lore"
            :key="entry.slug"
            @pointerdown.prevent="loreOpenHandler(`/embed-lore/${workType}/${workSlug}/${entry.slug}`); $emit('update:modelValue', false)"
            class="block w-full text-left px-2 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {{ entry.title }}
          </button>
        </template>
      </div>

      

      <!-- Empty spacer at the bottom -->
      <div class="h-16 shrink-0 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div v-if="loreOnly" class="">
        <label for="lore-chapter-select" class="text-sm text-gray-600 dark:text-gray-400">
          Lore as of chapter
        </label>
        <select
          id="lore-chapter-select"
          class="ml-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          @change="$emit('update:selectedChapter', ($event.target).value)"
        >
          <option v-for="ch in chapters" :key="ch.slug" :value="ch.slug">
            {{ ch.title }}
          </option>
        </select>
      </div>
      </div>
      <div class="h-16 shrink-0 border-t border-gray-200 dark:border-gray-700"></div>
    </div>
  </div>
</template>


<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  selectedChapter: { type: String, default: ''},
  workTitle: String,
  currentTitle: String,
  chapters: Array,
  lore: { type: Array, default: () => [] },
  backLink: String,
  chapterBasePath: String,
  workSlug: String,
  workType: String,
  activeTab: { type: String, required: true },
  loreOpenHandler: { type: Function, required: true },
  skipTargets: {type: Array, default: () => []},
  showNavigation: Boolean,
  prevChapter: {type: Object, default: null},
  nextChapter: {type: Object, default: null},
  currentSlug: { type: String, default: '' },
  loreOnly: Boolean
})


import { useFontSize } from '~/composables/useFontSize'
import { useExplicitPreference } from '~/composables/useExplicitPreference'
import { watch, nextTick, ref } from 'vue'

const { fontSize, setFontSize } = useFontSize()
const { explicitPreference, toggleExplicitPreference } = useExplicitPreference()

const emit = defineEmits(['update:modelValue', 'update:activeTab', 'update:selectedChapter', 'toggleExplicit'])

const hasChapters = computed(() => props.chapters?.length > 0)
const hasLore = computed(() => props.lore?.length > 0)

const isDark = ref(false)

// Apply theme on mount and listen to changes
onMounted(() => {
  const stored = localStorage.getItem('theme')
  isDark.value = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
  applyTheme()
})

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
}




function scrollToCurrentChapter() {
  if (props.currentSlug) {
    nextTick(() => {
      const el = document.getElementById(`chapter-${props.currentSlug}`)
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    })
  }
}

// When the panel opens (mobile sheet / desktop panel)
watch(() => props.modelValue, (newVal) => {
  if (newVal && props.activeTab === 'chapters') {
    scrollToCurrentChapter()
  }
})

// When the user switches to the Chapters tab
watch(() => props.activeTab, (newTab) => {
  if (newTab === 'chapters' && props.modelValue) {
    scrollToCurrentChapter()
  }
})

</script>