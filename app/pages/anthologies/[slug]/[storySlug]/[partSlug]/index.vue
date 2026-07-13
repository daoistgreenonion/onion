<template>
  <ReaderContent
    v-if="data"
    v-bind="data"
    :explicitSections="data.explicitSections"
  />
  <div v-else-if="error" class="max-w-3xl mx-auto py-12 px-4">
    <p class="text-red-500">Error loading part: {{ error }}</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'reader' })
const route = useRoute()
const { data, error } = await useFetch(
  `/api/anthologies/${route.params.slug}/${route.params.storySlug}/${route.params.partSlug}`
)
</script>