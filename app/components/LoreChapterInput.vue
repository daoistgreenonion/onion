<template>
  <div v-if="chapters.length > 0" class="mt-2">
    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <label for="lore-chapter-input" class="whitespace-nowrap">Chapter</label>
      <input
        id="lore-chapter-input"
        type="text"
        inputmode="numeric"
        :value="displayText"
        @input="onInput"
        class="w-16 border border-gray-300 dark:border-gray-600 rounded-md px-1.5 py-0.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span v-if="selectedTitle" class="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
        {{ selectedTitle }}
      </span>
      <span v-else-if="displayText !== ''" class="text-xs text-red-500">Chapter not found</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  chapters: { type: Array, required: true },
  modelValue: { type: String, default: '' },   // the currently selected chapter slug (from parent)
})

const emit = defineEmits(['update:modelValue'])

const inputText = ref('')

// When the parent changes the selected slug (e.g., from a direct link), update the input
watch(() => props.modelValue, (slug) => {
  if (!slug) {
    inputText.value = ''
    return
  }
  const idx = props.chapters.findIndex(ch => ch.slug === slug)
  inputText.value = idx !== -1 ? String(idx + 1) : ''
}, { immediate: true })

// The title of the currently selected chapter (by slug)
const selectedTitle = computed(() => {
  if (!props.modelValue) return ''
  const idx = props.chapters.findIndex(ch => ch.slug === props.modelValue)
  return idx !== -1 ? props.chapters[idx].title : ''
})

// Display a 1‑based number if we have a valid slug, otherwise show whatever the user typed
const displayText = computed(() => {
  if (props.modelValue) {
    const idx = props.chapters.findIndex(ch => ch.slug === props.modelValue)
    return idx !== -1 ? String(idx + 1) : inputText.value
  }
  return inputText.value
})

function onInput(event) {
  const val = event.target.value.trim()
  inputText.value = val

  if (val === '') {
    emit('update:modelValue', '')
    return
  }

  const num = parseInt(val)
  if (!isNaN(num) && num >= 1 && num <= props.chapters.length) {
    // Valid index → emit the slug of that chapter
    const slug = props.chapters[num - 1].slug
    emit('update:modelValue', slug)
  } else {
    // Invalid – keep the raw input but emit empty (no valid chapter)
    emit('update:modelValue', '')
  }
}
</script>