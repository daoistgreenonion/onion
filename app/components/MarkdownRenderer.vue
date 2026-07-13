<template>
  <div v-html="renderedContent" />
</template>

<script setup>
import { computed } from 'vue'
import { createMarkdownItInstance } from '~/utils/markdownRenderer'

const props = defineProps({
  content: { type: String, required: true },
})

const md = createMarkdownItInstance()
const renderedContent = computed(() => md.render(props.content))
</script>