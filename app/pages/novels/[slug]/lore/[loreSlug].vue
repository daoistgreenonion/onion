<template>
  <LoreReader
    v-if="novel && novel.lore?.length"
    :work-title="novel.title"
    :lore="novel.lore"
    :chapters="novel.chapters" 
    :back-link="`/novels/${slug}`"
    :work-slug="slug"
    work-type="novels"
    :initial-slug="loreSlug"
  />
  <div v-else class="max-w-3xl mx-auto py-12 px-4">
    <p class="text-gray-500 dark:text-gray-400">No lore available.</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const route = useRoute()
const { workType, slug, loreSlug } = route.params
const chapterSlug = route.query.chapter || ''
const explicitPref = route.query.explicit || 'collapsed'

const params = new URLSearchParams()
if (chapterSlug) params.set('chapter', chapterSlug)
if (explicitPref) params.set('explicit', explicitPref)

const apiUrl = `/api/lore/${workType}/${slug}/${loreSlug}?${params.toString()}`

const { data: lore, error } = await useFetch(apiUrl)

if (error.value) {
  console.error(error.value)
}
</script>
