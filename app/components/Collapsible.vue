<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    :class="{ 'open': expanded, 'explicit-section': type === 'explicit' }"
  >
    <button
      @click="expanded = !expanded"
      class="flex items-start justify-between gap-2 font-semibold text-brand dark:text-brand-lightest w-full hover:bg-gray-200/50 dark:hover:bg-gray-600/50 p-4"
      :aria-expanded="expanded"
    >
      <div class="text-start">
        <p class="text-md sm:text-lg text-brand dark:text-brand-lightest !m-0">
          {{ title }}
        </p>
        <p class="text-sm text-gray-500 !m-0">{{ expanded ? '(Expanded, click to collapse)' : '(Collapsed, click to expand)' }}</p>
      </div>

      <!-- Regular collapsible icon (+/−) -->
      <span v-if="type === 'collapsible'" class="collapsible-icon">{{ expanded ? '−' : '+' }}</span>

      <!-- Explicit icons (eye closed / eye open) -->
      <template v-if="type === 'explicit'">
        <span v-show="!expanded" class="explicit-icon-closed inline-flex items-center">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
          </svg>
        </span>
        <span v-show="expanded" class="explicit-icon-open inline-flex items-center">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </span>
      </template>
    </button>

    <div v-if="expanded" class="px-2">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  open: { type: Boolean, default: false },
  type: { type: String, default: 'collapsible' },   // 'collapsible' | 'explicit'
})

const expanded = ref(props.open)
</script>