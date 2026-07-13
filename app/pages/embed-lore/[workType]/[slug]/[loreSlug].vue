<template>
  <div v-if="lore" class="p-4 max-w-none">
    <article class="prose prose-base dark:prose-invert max-w-none">
      <h1 class="text-2xl">{{ lore.title }}</h1>
      <div v-html="renderedContent"></div>
    </article>
  </div>
  <div v-else class="p-4 text-red-500">
    Lore not found or an error occurred.
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

definePageMeta({ layout: false })

const route = useRoute()
const { workType, slug, loreSlug } = route.params
const chapterSlug = route.query.chapter || ''

const apiUrl = `/api/lore/${workType}/${slug}/${loreSlug}` + (chapterSlug ? `?chapter=${chapterSlug}` : '')

const { data: lore, error } = await useFetch(apiUrl)

if (error.value) {
  console.error(error.value)
}

const md = new MarkdownIt({ html: true, breaks: true, typographer: true })
const renderedContent = computed(() => md.render(lore.value?.content || ''))
</script>