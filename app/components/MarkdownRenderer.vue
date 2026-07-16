<template>
  <div v-html="renderedContent" />
</template>

<script setup>
import { computed } from 'vue'
import { createMarkdownItInstance } from '~/utils/markdownRenderer'
import { processCollapsibleAndExplicit } from '~/utils/processCollapsibleAndExplicit'

const props = defineProps({
  content: { type: String, required: true },
  collapse: {Boolean, default: false, required: false },
})

const md = createMarkdownItInstance()
const renderedContent = computed(() => {
  const temp = md.render(props.content)
  if (props.collapse) return processCollapsibleAndExplicit(temp)
  else return temp
})

</script>