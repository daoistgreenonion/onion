<template>
  <ReaderContent
    v-if="data"
    v-bind="data"
    :current-slug="data.currentSlug"
  />
  <div v-else-if="error" class="max-w-3xl mx-auto py-12 px-4">
    <p class="text-red-500">Error loading chapter: {{ error }}</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'reader' })

const route = useRoute()
const { data, error } = await useFetch(
  `/api/novels/${route.params.slug}/${route.params.chapter}`
)



</script>