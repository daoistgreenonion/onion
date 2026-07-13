<template>
  <main class="max-w-4xl mx-auto py-12 px-4">
    <NuxtLink :to="`/novels/${slug}`" class="text-brand-lightest hover:underline mb-4 inline-block">
      ← Back to novel
    </NuxtLink>
    <h1 class="text-3xl font-bold mb-4">Lore</h1>
    <LoreReader
      v-if="novel && novel.lore?.length"
      :work-title="novel.title"
      :lore="novel.lore"
      :back-link="`/novels/${slug}`"
      :work-slug="slug"
      work-type="novels"
    />
    <div v-else class="max-w-3xl mx-auto py-12 px-4">
      <p class="text-gray-500 dark:text-gray-400">No lore available for this novel.</p>
    </div>
  </main>
</template>

<script setup>
definePageMeta({ layout: 'reader' })

const route = useRoute()
const slug = route.params.slug
const { data: novel } = await useFetch(`/api/novels/${slug}`)
// const lore = computed(() => novel.value?.lore || [])
</script>