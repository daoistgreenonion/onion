<template>
  <div class="max-w-4xl mx-auto py-12 px-4 space-y-16 animate-pulse">
    <!-- Hero placeholder -->
    <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>

    <!-- Novels section -->
    <section>
      <div class="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 3" :key="n" class="border rounded-lg p-6 bg-gray-100 dark:bg-gray-800">
          <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </section>

    <!-- Anthologies section -->
    <section>
      <div class="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 3" :key="n" class="border rounded-lg p-6 bg-gray-100 dark:bg-gray-800">
          <div class="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </section>

    <!-- Short stories section -->
    <section>
      <div class="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
      <div class="space-y-4">
        <div v-for="n in 3" :key="n" class="border rounded-lg p-6 bg-gray-100 dark:bg-gray-800">
          <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </section>

    <!-- News section -->
    <section>
      <div class="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
      <div class="space-y-4">
        <div v-for="n in 3" :key="n" class="border rounded-lg p-4 bg-gray-100 dark:bg-gray-800">
          <div class="flex justify-between items-center mb-2">
            <div class="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </section>
  </div>
</template>