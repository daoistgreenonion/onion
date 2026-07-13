<template>
  <main class="max-w-5xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8">News</h1>

    <div v-if="news?.length" class="space-y-6">
      <NuxtLink
        v-for="item in news"
        :key="item.slug"
        :to="`/news/${item.slug}`"
        class="block border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
          <time :datetime="item.date" class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
            {{ new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
          </time>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{{ item.summary }}</p>
      </NuxtLink>
    </div>
    <p v-else class="text-gray-500 dark:text-gray-400">No announcements yet.</p>
  </main>
</template>

<script setup>
const { data: news } = await useFetch('/api/news')
</script>