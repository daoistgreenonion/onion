<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <button
      @click="expanded = !expanded"
      class="flex items-start gap-2 hover:bg-gray-400/20 dark:hover:bg-gray-100/40 w-full"
      :aria-expanded="expanded"
    >
      <div class="text-brand dark:text-brand-lightest">
        <svg v-if="expanded" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
        </svg>
      </div>
      <div class="flex flex-col items-baseline">
        <h2 class="text-lg font-semibold text-brand dark:text-brand-lightest h-min m-0 p-0">
          {{ title }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 h-min m-0 p-0" >
          {{ expanded ? ' (expanded, click to collapse)'  : ' (collapsed, click to expand)' }}
        </p>
      </div>
    </button>

    <div v-if="expanded" class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  open: { type: Boolean, default: false },   // optional: start expanded
})

const expanded = ref(props.open)
</script>