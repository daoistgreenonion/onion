<template>
  <ReaderContent
    v-if="data"
    :work-title="data.workTitle"
    :current-title="data.currentTitle"
    :chapters="data.chapters"
    :back-link="data.backLink"
    :chapter-base-path="data.chapterBasePath"
    :content="data.content"
    :lore="data.lore"
    :work-slug="data.workSlug"
    :work-type="data.workType"
    :skip-targets="data.skipTargets"
    :explicitSections="data.explicitSections"
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