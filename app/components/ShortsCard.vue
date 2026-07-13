<template>
  <NuxtLink :to="link" class="block rounded p-6 hover:shadow-lg dark:hover:shadow-dark4 dark:hover:shadow-[0_0_30px_0px] transition-all bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800/70">
    <div class="flex justify-between">
      <h3 class="text-xl font-semibold">{{ work.title }}</h3>
      <p v-if="work.explicit" class="border border-red-500 text-red-500 text-[10px] w-min px-1 my-1">EXPLICIT</p>
    </div>
    <p class="text-xs text-gray-700 dark:text-gray-400">{{ new Date(work.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
    <div v-if="work.maintags && work.tags" class="py-3 flex flex-wrap gap-2">
      <div v-for="tag in work.maintags">
        <Tag 
          :tag = tag
        />
      </div>
      <div v-for="tag in work.tags">
        <Tag 
          :tag = tag
        />
      </div>
    </div>
    <p v-if="work.synopsis" class="text-gray-800 dark:text-gray-200 mt-2">{{ work.synopsis }}</p>
  </NuxtLink>
</template>

<script setup>
defineProps({
  work: { type: Object, required: true },
  link: { type: String, required: true },
})
</script>