<template>
  <div class="p-4 max-w-none">
    <article class="prose prose-base dark:prose-invert max-w-none">
      <h1>{{ lore.title }}</h1>
      <div v-html="renderedContent"></div>
    </article>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

definePageMeta({ layout: false })

const route = useRoute()
const { workType, slug, loreSlug } = route.params

// Fetch lore content from API
const { data: lore, error } = await useFetch(`/api/lore/${workType}/${slug}/${loreSlug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Lore not found' })
}

const md = new MarkdownIt({ html: true, breaks: true, typographer: true })
const renderedContent = computed(() => md.render(lore.value?.content || ''))
</script>