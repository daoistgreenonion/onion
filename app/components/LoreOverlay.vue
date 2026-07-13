<script setup>
const props = defineProps({
  loreUrl: String,
  open: Boolean,
})

const emit = defineEmits(['close'])
</script>

<template>
  <div
    v-if="open && loreUrl"
    class="fixed inset-0 z-50 sm:pointer-events-none"
  >
    <!-- Mobile: full‑screen -->
    <div class="sm:hidden w-full h-full relative pointer-events-auto">
      <button
        @pointerdown.prevent="emit('close')"
        class="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-dark rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close lore panel"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <iframe :src="loreUrl" class="w-full h-full border-0 bg-white dark:bg-gray-900" title="Lore" sandbox="allow-scripts allow-same-origin" />
    </div>

    <!-- Desktop: left‑side panel -->
    <div class="hidden sm:flex w-full h-full justify-start">
      <div class="relative w-full max-w-lg h-full bg-white dark:bg-dark border-r border-gray-200 dark:border-gray-700 shadow-xl pointer-events-auto">
        <button
          @pointerdown.prevent="emit('close')"
          class="absolute top-4 right-4 z-10 p-1 bg-white dark:bg-gray-800/50 rounded shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close lore panel"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <iframe :src="loreUrl" class="w-full h-full border-0 bg-white dark:bg-dark" title="Lore" sandbox="allow-scripts allow-same-origin" />
      </div>
    </div>
  </div>
</template>