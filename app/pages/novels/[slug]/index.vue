<template>
  <div v-if="novel">
    <WorkDetail
      :work="novel"
      back-link="/novels"
      back-label="Back to Novels"
      :chapter-base-path="`/novels/${novel.slug}`"
      :lore-base-path="`/novels/${novel.slug}/lore`"
    />
  </div>
  <div v-else-if="error" class="max-w-3xl mx-auto py-12 px-4">
    <p class="text-red-500">An error occurred: {{ error }}</p>
  </div>
  <div v-else class="max-w-3xl mx-auto py-12 px-4">
    <p>Loading...</p>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: novel, error } = await useFetch(`/api/novels/${route.params.slug}`)
</script>