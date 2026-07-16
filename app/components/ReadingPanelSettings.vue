<template>
  <!-- Settings -->
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
    <button
      v-for="fontButton in fontsList"
      :key="fontButton.key"
      @pointerdown.prevent="setFontSize(fontButton.key)"
      class="rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      :class= "fontSize === fontButton.key 
        ? `text-brand-lightest font-bold underline`
        : 'text-gray-600 dark:text-gray-400',
      fontButton.size
      "
    >
      Aa
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFontSize } from '~/composables/useFontSize'
import { useExplicitPreference } from '~/composables/useExplicitPreference'


const { fontSize, setFontSize } = useFontSize()
const fontsList =  [
  {key: 'xs', size: 'text-xs'}, 
  {key: 'sm', size: 'text-sm'}, 
  {key: 'md', size: 'text-base'}, 
  {key: 'lg', size: 'text-lg'},
  {key: 'xl', size: 'text-xl'}, 
  {key: '2xl', size: 'text-2xl'},
]

const { explicitPreference, toggleExplicitPreference } = useExplicitPreference()
// ==================================================== THEME LOGIC ===============================================


const isDark = ref(false)

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