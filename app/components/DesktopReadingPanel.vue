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
    class="hidden sm:block fixed top-0 right-0 h-full w-xl lg:w-1/4 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50"
  >
    <div class="p-4 h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-lg truncate">{{ workTitle }}</h2>
        <button
          @pointerdown.prevent="$emit('update:modelValue', false)"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          aria-label="Close panel"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p v-if=" workType != 'short-stories'  " class="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{{ currentTitle }}</p>
      <NuxtLink :to="backLink" class="text-sm text-brand-lightest hover:underline mb-4 uppercase inline-block" @click="$emit('update:modelValue', false)">
        ← {{ workType }} Page
      </NuxtLink>

      <!-- Tabs -->
      <div  class="flex border-b border-gray-200 dark:border-gray-700 mb-3">
        <button
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
          v-for="ch in chapters"
          :key="ch.slug"
          :to="`${chapterBasePath}/${ch.slug}`"
          @click="$emit('update:modelValue', false)"
          :class="['block px-2 py-1 rounded text-sm', ch.title === currentTitle ? 'bg-brand-light/20 text-brand-light' : 'hover:bg-gray-100 dark:hover:bg-gray-800']"
        >
          {{ ch.title }}
        </NuxtLink>
      </div>

      <!-- Lore list -->
      <div v-if="hasLore && activeTab === 'lore'" class="flex-1 overflow-y-auto space-y-1">
        <button
          v-for="entry in lore"
          :key="entry.slug"
          @pointerdown.prevent="loreOpenHandler(`/embed-lore/${workType}/${workSlug}/${entry.slug}`)"
          class="block w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
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
})



import { useFontSize } from '~/composables/useFontSize'
const { fontSize, setFontSize } = useFontSize()

const emit = defineEmits(['update:modelValue', 'update:activeTab', 'toggleExplicit'])

import { useExplicitPreference } from '~/composables/useExplicitPreference'

const { explicitPreference, toggleExplicitPreference } = useExplicitPreference()

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

</script>