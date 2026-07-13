<template>
  <main class="max-w-3xl mx-auto py-12 px-4">
    <NuxtLink to="/anthologies" class="text-brand-lightest hover:underline mb-4 inline-block">
      ← Back to Anthologies
    </NuxtLink>

    <h1 class="text-4xl font-bold mb-2">{{ anthology?.title }}</h1>
    <p class="text-gray-500 mb-6">by {{ anthology?.author }}</p>
    <p class="text-lg text-gray-700 dark:text-gray-200 mb-8">{{ anthology?.synopsis }}</p>

    <!-- Start Reading button – first story -->
    <div v-if="firstStory" class="mb-8">
      <NuxtLink
        :to="`/anthologies/${anthology.slug}/${firstStory.slug}`"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        Start Reading
      </NuxtLink>
    </div>

    <!-- Stories list -->
    <h2 class="text-2xl font-semibold mb-4">Stories</h2>
    <div class="space-y-6">
      <div v-for="story in stories" :key="story.slug">
        <h3 class="text-xl font-semibold">{{ story.title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 italic mt-1">{{ story.synopsis }}</p>

        <template v-if="story.isSingleFile">
          <NuxtLink
            :to="`/anthologies/${anthology.slug}/${story.slug}`"
            class="text-brand-lightest hover:underline block mt-2"
          >
            Read story →
          </NuxtLink>
        </template>
        <ul v-else class="mt-2 space-y-1 list-disc list-inside">
          <li v-for="part in story.parts" :key="part.slug">
            <NuxtLink
              :to="`/anthologies/${anthology.slug}/${story.slug}/${part.slug}`"
              class="text-brand-lightest hover:underline"
            >
              {{ part.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Lore link -->
    <div v-if="anthology?.lore?.length" class="mt-8">
      <NuxtLink :to="`/anthologies/${anthology.slug}/lore`" class="text-brand-lightest hover:underline">
        📖 Explore Lore
      </NuxtLink>
    </div>
  </main>
</template>

<script setup>
const route = useRoute()
const { data: anthology } = await useFetch(`/api/anthologies/${route.params.slug}`)

const stories = computed(() => anthology.value?.stories || [])
const firstStory = computed(() => stories.value[0] || null)
</script>