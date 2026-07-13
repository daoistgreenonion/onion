<template>
  <LoreReader
    v-if="novel && novel.lore?.length"
    :work-title="novel.title"
    :lore="novel.lore"
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
definePageMeta({ layout: 'reader' })

const route = useRoute()
const { slug, loreSlug } = route.params
const { data: novel } = await useFetch(`/api/novels/${slug}`)
</script>

