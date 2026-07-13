<template>
  <main class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8">Anthologies</h1>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <WorkCard
        v-for="anthology in anthologies"
        :key="anthology.slug"
        :work="anthology"
        :link="`/anthologies/${anthology.slug}`"
      />
    </div>
  </main>
</template>

<script setup>
const { data: anthologies } = await useFetch('/api/anthologies')
</script>