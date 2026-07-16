<template>
  <p class="bg-gray-200 dark:bg-dark3 w-min h-min px-2 rounded text-nowrap text-gray-900 dark:text-gray-200">
    {{ tag }}
  </p>
</template>

<script setup>
  defineProps ({
    tag: String,
  })
</script>
