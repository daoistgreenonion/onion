<template>
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
    class="hidden sm:block fixed top-11 right-0 w-full bg-white dark:bg-gray-900 border-l border-t border-b border-gray-200 dark:border-gray-700 shadow-xl z-50"
    :class=" loreOnly ? 'max-w-[28%] xl:max-w-sm' : 'max-w-[50%] lg:max-w-[22%] 2xl:max-w-[24rem]'"
    style="height: calc(100vh - 3rem);"
  >
    <div class="p-4 h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <NuxtLink :to="backLink" class="text-brand-lightest hover:underline mt-2 inline-block uppercase" @click="$emit('update:modelValue', false)">
          <h2 class="font-semibold text-lg truncate">{{ workTitle }}</h2>
        </NuxtLink>
        <button v-if="!loreOnly"
          @pointerdown.prevent="$emit('update:modelValue', false)"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          aria-label="Close panel"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p v-if=" (workType != 'short-stories' ) && !loreOnly " class="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{{ currentTitle }}</p>


      <div v-if="loreOnly" class="border-b border-gray-600 darl:border-gray-300 pb-1">
        <!-- Desktop panel – inside the Lore tab area -->
        <div v-if="activeTab === 'lore' && chapters.length > 0" class="mt-2">
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <label :for="`${panelId}-lore-chapter`" class="whitespace-nowrap">Chapter</label>
            <input
              :id="`${panelId}-lore-chapter`"
              type="text"
              inputmode="numeric"
              v-model="localChapterInput"
              class="w-16 border border-gray-300 dark:border-gray-600 rounded-md px-1.5 py-0.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span v-if="currentChapterTitle" class="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
              {{ currentChapterTitle }}
            </span>
            <span v-else class="text-xs text-red-500">Chapter not found</span>
          </div>
        </div>
      </div>


      <ChapterNavigation
        :prev-chapter="prevChapter"
        :next-chapter="nextChapter"
        :chapter-base-path="chapterBasePath"
        :chapters="chapters"
        :current-slug="currentSlug"
      />

      <!-- Tabs -->
      <div v-if="!loreOnly"  class="flex border-b border-gray-200 dark:border-gray-700 mb-3">
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

      <!-- Settings -->
      <div v-if="activeTab === 'settings'" class="flex-1 overflow-y-auto space-y-1">
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
      </div>

      <!-- Skip buttons -->
      <div v-if="skipTargets.length && activeTab === 'navs'" class="flex flex-wrap gap-2 mb-4">
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
      <div v-if="hasChapters && activeTab === 'chapters'" class="flex-1 overflow-y-auto space-y-1">
        <NuxtLink
          v-for="(ch, index) in chapters"
          :key="ch.slug"
          :id="`chapter-${ch.slug}`"
          :to="`${chapterBasePath}/${ch.slug}`"
          @click="$emit('update:modelValue', false)"
          :class="['block px-2 py-1 rounded text-sm', ch.slug  === currentSlug  ? 'bg-brand-light/20 text-brand-light active-chapter' : 'hover:bg-gray-100 dark:hover:bg-gray-800']"
        >
          {{ index + 1 }}. {{ ch.title }}
        </NuxtLink>
      </div>

      <!-- Lore list -->
      <div v-if="hasLore && activeTab === 'lore'" class="flex-1 overflow-y-auto space-y-1">
        <button
          v-for="entry in lore"
          :key="entry.slug"
          @pointerdown.prevent="loreOpenHandler(`/embed-lore/${workType}/${workSlug}/${entry.slug}`)"
          class="block w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
          :class="entry.slug === selectedLoreSlug ? 'bg-gray-100 dark:bg-gray-800' : ''"
        >
          {{ entry.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  selectedChapter: { type: String, default: ''},
  workTitle: String,
  currentTitle: String,
  chapters: { type: Array, default: () => [] },
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
  loreOnly: Boolean,
  selectedLoreSlug: { type: String, default: '' },
  loreChapterSlug: { type: String, default: '' },
})



import { useFontSize } from '~/composables/useFontSize'
import { useExplicitPreference } from '~/composables/useExplicitPreference'
import { watch, nextTick, ref } from 'vue'

const { fontSize, setFontSize } = useFontSize()
const emit = defineEmits(['update:modelValue', 'update:activeTab', 'toggleExplicit', 'update:loreChapter'])


const { explicitPreference, toggleExplicitPreference } = useExplicitPreference()

const hasChapters = computed(() => props.chapters?.length > 0)
const hasLore = computed(() => props.lore?.length > 0)

const isDark = ref(false)

// Local input state – initialised from the prop once
const localChapterInput = ref(props.loreChapterSlug || '')

// Keep local input in sync when the parent changes the slug
watch(() => props.loreChapterSlug, (newVal) => {
  if (newVal !== localChapterInput.value) {
    localChapterInput.value = newVal
  }
})

// Find the chapter title for the currently typed slug
const currentChapterTitle = computed(() => {
  if (!localChapterInput.value) return ''
  const found = props.chapters.find(ch => ch.slug === localChapterInput.value)
  return found ? found.title : ''
})

// Emit a valid slug whenever the local input changes
watch(localChapterInput, (val) => {
  // Try to match the typed value as a 1‑based number first
  const num = parseInt(val)
  if (!isNaN(num)) {
    const idx = num - 1
    if (idx >= 0 && idx < props.chapters.length) {
      emit('update:loreChapter', props.chapters[idx].slug)
      return
    }
  }
  // If not a number, try matching the raw input as a slug
  const foundBySlug = props.chapters.find(ch => ch.slug === val)
  if (foundBySlug) {
    emit('update:loreChapter', foundBySlug.slug)
  } else {
    emit('update:loreChapter', '')   // invalid
  }
})

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