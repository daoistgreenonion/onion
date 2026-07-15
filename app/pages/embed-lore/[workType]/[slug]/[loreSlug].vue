<template>
  <div v-if="lore" class="max-w-none sm:max-w-[70%] lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full h-full">
    <div class="h-full overflow-y-auto" dir="rtl">
      <div dir="ltr" class="p-4 sm:p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <article class="prose prose-lg dark:prose-invert max-w-none">
          <h1 class="text-3xl font-bold mb-6 text-brand-lightest">{{ lore.title }}</h1>
          <div v-html="lore?.content"></div>
        </article>
      </div>
    </div>
  </div>
  <div v-else class="p-4 text-red-500">
    Lore not found or an error occurred.
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