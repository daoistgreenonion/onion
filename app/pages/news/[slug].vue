<template>
  <div v-if="item">
    <main class="max-w-2xl mx-auto py-12 px-4">
      <NuxtLink to="/news" class="text-brand-lightest hover:underline mb-6 inline-block">
        ← Back to News
      </NuxtLink>
      <article class="prose prose-lg dark:prose-invert max-w-none">
        <h1>{{ item.title }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
        <div v-html="renderedContent"></div>
      </article>
    </main>
  </div>
  <div v-else-if="error" class="max-w-3xl mx-auto py-12 px-4">
    <p class="text-red-500">Error: {{ error }}</p>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const route = useRoute()
const { data: item, error } = await useFetch(`/api/news/${route.params.slug}`)

const md = new MarkdownIt({ html: true, breaks: true, typographer: true })
const renderedContent = computed(() => md.render(item.value?.content || ''))
</script>