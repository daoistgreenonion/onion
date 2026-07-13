<template>
  <main class="max-w-3xl mx-auto py-12 px-4">
    <NuxtLink :to="`/anthologies/${slug}`" class="text-brand-lightest hover:underline mb-4 inline-block">
      ← Back to anthology
    </NuxtLink>
      <LoreReader
        v-if="anthology && anthology.lore?.length"
        :work-title="anthology.title"
        :lore="anthology.lore"
        :back-link="`/anthologies/${slug}`"
        :work-slug="slug"
        work-type="anthologies"
      />
      <div v-else class="max-w-3xl mx-auto py-12 px-4">
        <p class="text-gray-500 dark:text-gray-400">No lore available for this anthology.</p>
      </div>
  </main>
</template>

<script setup>
definePageMeta({ layout: 'lore' })

const route = useRoute()
const slug = route.params.slug
const { data: anthology } = await useFetch(`/api/anthologies/${slug}`)
</script>