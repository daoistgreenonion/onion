<template>
  <Navbar :class="{ '-translate-y-full': hidden }" :readingPage="true" />
  <div class="h-12"></div>
  <Breadcrumbs :smallSize="true" /> 
  <main class="">
    <slot />
  </main>
  <Footer />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hidden = ref(false)
let lastScroll = 0
const threshold = 80

function onScroll() {
  const currentScroll = window.scrollY
  if (currentScroll > lastScroll && currentScroll > threshold) {
    hidden.value = true
  } else {
    hidden.value = false
  }
  lastScroll = currentScroll
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* Only hide on mobile; desktop always shows */
@media (min-width: 640px) {
  .-translate-y-full {
    transform: translateY(0) !important;
  }
}
</style>