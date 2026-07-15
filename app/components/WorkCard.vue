<template>
  <NuxtLink :to="link" class="block">

    <!-- Cover Image Section -->
    <div class="w-full">
      <!-- Cover image with zoom on hover -->
      <div v-if="work.cover" class="w-full overflow-hidden hover:shadow-lg dark:hover:shadow-dark4 dark:hover:shadow-[0_0_40px_2px] transition-shadow">
        <img
          :src="work.cover"
          :alt="work.title"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
  
      <!-- Placeholder (unchanged) -->
      <div v-else class="w-full h-60 bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-green-600 dark:text-green-300">
        <div class="text-center">
          <svg class="w-8 h-8 mx-auto opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p class="text-xs font-medium px-2 line-clamp-2 opacity-70">{{ work.title }}</p>
        </div>
      </div>
    </div>
    
    <!-- Description -->
    <div class="p-2">
      <div class="flex flex-col items-center">
        <!-- Title -->
        <h3 class="text-lg font-semibold text-center">{{ work.title }}</h3>
        <!-- Explicit -->
        <p v-if="work.explicit" class="border border-red-500 text-red-500 text-[10px] w-min px-1 my-1">EXPLICIT</p>
      </div>
      
      <!-- Tags -->
      <!-- <div class="grid grid-cols-[1fr,6fr] gap-y-2 my-3 text-sm sm:text-md">
        <p class="mr-2 items-start font-bold">Status:</p>
        <Tag :tag= work.status />
        <p class="mr-2 items-start font-bold">Genre:</p>
        <ul v-if="work.maintags" class="flex gap-2 ">
          <li v-for="tag in work.maintags" :key="tag.slug">
            <Tag 
            :tag = tag
            />
          </li>
        </ul>
      </div> -->
    </div>
    
  </NuxtLink>
</template>

<script setup>
defineProps({
  work: { type: Object, required: true },
  link: { type: String, required: true },
})
</script>