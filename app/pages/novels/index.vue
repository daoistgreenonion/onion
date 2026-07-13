<template>
  <main class="max-w-5xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8">Novels</h1>

    <div class="mb-8">
      <p class="block explicit:hidden" >
        Explicit content is currently hidden, so some works may be missing from display. If you are an adult, and wish to view it, toggle the eye icon in navigation bar at the top of the screen to show explicit content.
        <NuxtLink to="/about" class="text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 hover:underline font-bold">Click here to learn more</NuxtLink>
      </p>
    </div>


    <!-- Long Novels -->
    <section v-if="longNovels.length" class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Novels</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <WorkCard
          v-for="novel in longNovels"
          :key="novel.slug"
          :work="novel"
          :link="`/novels/${novel.slug}`"
        />
      </div>
    </section>

    <!-- Short Novels -->
    <section v-if="shortNovels.length">
      <h2 class="text-2xl font-semibold mb-4">Short Novels</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <WorkCard
          v-for="novel in shortNovels"
          :key="novel.slug"
          :work="novel"
          :link="`/novels/${novel.slug}`"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { useExplicitPreference } from '~/composables/useExplicitPreference'
const { explicitPreference } = useExplicitPreference()

const { data: novels } = await useFetch('/api/novels')

const longNovels = computed(() =>
  (novels.value || [])
    .filter(n => n.type === 'long-novel')
    .filter(n => explicitPreference.value === 'expanded' || !n.explicit)
)

const shortNovels = computed(() =>
  (novels.value || [])
    .filter(n => n.type === 'short-novel')
    .filter(n => explicitPreference.value === 'expanded' || !n.explicit)
)
</script>

