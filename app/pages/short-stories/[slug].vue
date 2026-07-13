<template>
  <ReaderContent
    v-if="data"
    v-bind="data"
    :explicitSections="data.explicitSections"
/>
  <div v-else-if="error" class="max-w-3xl mx-auto py-12 px-4">
    <p class="text-red-500">Error loading story: {{ error }}</p>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'reader' })
// import { useExplicitPreference } from '~/composables/useExplicitPreference'
// const { explicitPreference } = useExplicitPreference()

const route = useRoute()
const { data, error } = await useFetch(`/api/shorts/${route.params.slug}`)

</script>