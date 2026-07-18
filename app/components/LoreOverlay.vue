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
        @load="onIframeLoad"
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
          <!-- existing close button and iframe -->
        </div>
        <iframe
          :src="loreUrl"
          class="w-full h-full border-0 bg-white dark:bg-gray-900"
          title="Lore"
          sandbox="allow-scripts allow-same-origin"
          @load="onIframeLoad"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, nextTick } from 'vue'

const props = defineProps({
  loreUrl: String,
  open: Boolean,
})

const emit = defineEmits(['close'])


// Scroll the iframe to the anchor
function scrollIframeToHash() {
  if (!props.loreUrl) return
  const hash = new URL(props.loreUrl, 'http://localhost').hash
  if (!hash) return
  const iframe = document.querySelector('.lore-iframe') || document.querySelector('iframe[title="Lore"]')
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ type: 'scroll-to', hash }, '*')
  }
}

function onIframeReady(event) {
  if (event.data?.type === 'lore-iframe-ready') {
    scrollIframeToHash()
  }
}

onMounted(() => {
  window.addEventListener('message', onIframeReady)
})

onUnmounted(() => {
  window.removeEventListener('message', onIframeReady)
})
</script>