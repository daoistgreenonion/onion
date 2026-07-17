<template>
  <div class="h-screen min-h-screen flex flex-col max-w-4xl mx-auto">
    <!-- Toolbar -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Markdown Editor</h1>
        <!-- Save indicator -->
        <span
          v-if="saveStatus"
          class="text-xs text-gray-500 dark:text-gray-400 transition-opacity duration-300"
          :class="{ 'opacity-0': !saveStatus }"
        >
          {{ saveStatus }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="clearDraft"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Clear Draft
        </button>
        <button
          @click="openPreview"
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Open Preview Window
        </button>
      </div>
    </div>

    <!-- Editor -->
    <textarea
      v-model="source"
      @input="onInputWithPreview"
      class="flex-1 w-full p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none outline-none font-mono text-sm leading-relaxed"
      placeholder="Write your Markdown here…"
    ></textarea>
  </div>
</template>

<script setup>
const STORAGE_KEY = 'markdown-draft'

const source = ref('')
const saveStatus = ref('')
let saveTimer = null
let previewWindow = null

// Load draft on mount
onMounted(() => {
  const draft = localStorage.getItem(STORAGE_KEY)
  if (draft) {
    source.value = draft
  }
})

// Debounced auto‑save
function onInput() {
  // Show "Saving…" briefly
  saveStatus.value = 'Saving…'
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, source.value)
    saveStatus.value = 'Saved'
    // Hide "Saved" after 2 seconds
    setTimeout(() => {
      saveStatus.value = ''
    }, 2000)
  }, 800)   // 0.8s after you stop typing
}

// Clear the draft from storage and the editor
function clearDraft() {
  localStorage.removeItem(STORAGE_KEY)
  source.value = ''
  saveStatus.value = ''
}

// Open preview window – send both title and body
function openPreview() {
  previewWindow = window.open('/writing/preview', 'markdown-preview')
  if (previewWindow) {
    previewWindow.addEventListener('load', () => {
      sendToPreview()
    })
  }
}

// Send the first line as title, the rest as body
function sendToPreview() {
  if (!previewWindow || previewWindow.closed) return
  const lines = source.value.split('\n')
  const title = lines[0] || 'Untitled'
  const body = lines.slice(1).join('\n')
  console.log(title)
  console.log(body)
  previewWindow.postMessage({ type: 'update-content', title, body }, '*')
}

// Combine with auto‑save
function onInputWithPreview() {
  onInput()
  sendToPreview()
}
</script>