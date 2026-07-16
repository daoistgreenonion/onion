<template>
  <div
    v-if="open && loreUrl"
    class="fixed inset-0 z-50 sm:pointer-events-none"
  >

    <!-- Mobile: full‑screen (pointer‑events‑auto, blocks background) -->
    <div class="sm:hidden w-full h-full relative pointer-events-auto">
      <button
        @pointerdown.prevent="$emit('close')"
        class="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Close lore panel"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <iframe
        :src="loreUrl"
        class="w-full h-full border-0 bg-white dark:bg-gray-900"
        title="Lore"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>

    <!-- Desktop: left‑side panel (pointer‑events‑auto on the panel only) -->
    <div class="fixed inset-0 z-50  top-11 hidden sm:flex w-full justify-start" style="height: calc(100vh - 3rem);">
      <div class="relative w-1/2 max-w-[50%] lg:max-w-[22%] 2xl:max-w-[24rem]  h-full bg-white dark:bg-gray-900 border-r border-t border-b border-gray-200 dark:border-gray-700 shadow-xl pointer-events-auto">
        <button
          @pointerdown.prevent="$emit('close')"
          class="absolute top-4 right-4 z-10 p-1 bg-white dark:bg-gray-800/50 rounded shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close lore panel"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div v-if="open && loreUrl" class="...">
          <!-- Back button (only on desktop panel, could also be on mobile) -->
          <div v-if="hasHistory" class="absolute top-4 left-4 z-10">
            <button @pointerdown.prevent="$emit('back')" class="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <!-- existing close button and iframe -->
        </div>
        <iframe
          :src="loreUrl"
          class="w-full h-full border-0 bg-white dark:bg-gray-900"
          title="Lore"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  loreUrl: String,
  open: Boolean,
})

const emit = defineEmits(['close'])
</script>