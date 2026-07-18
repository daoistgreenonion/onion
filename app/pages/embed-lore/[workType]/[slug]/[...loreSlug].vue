<template>
  <div v-if="lore" class="w-full h-full">
    <!-- Search toggle & input (only if searchable) -->
    <div v-if="lore.searchable" class="flex items-center fixed top-0 left-0">
      <svg class="w-5 h-5 m-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <!-- Search input (shown/hidden) -->
      <transition name="fade">
        <div class="w-full">
          <input
            id="lore-search-input"
            v-model="searchTerm"
            type="text"
            :placeholder="`Search by ${lore.searchMode || 'title'}…`"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand"
            @input="onSearchInput"
          />
        </div>
      </transition>
    </div>

    <!-- Content area -->
    <div class="h-full overflow-y-auto" dir="rtl">
      <div dir="ltr" class="p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <article class="prose prose-lg dark:prose-invert max-w-none">
          <h1 class="text-3xl font-bold mb-6 text-brand-lightest">{{ lore.title }}</h1>
          <div v-html="lore.content" id="lore-content"></div>
        </article>
      </div>
    </div>
  </div>
  <div v-else class="p-4 text-red-500">
    Lore not found or an error occurred.
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

definePageMeta({ layout: false })

const route = useRoute()
const { workType, slug } = route.params
const chapterSlug = route.query.chapter || ''
const explicitPref = route.query.explicit || 'collapsed'


const params = new URLSearchParams()
if (chapterSlug) params.set('chapter', chapterSlug)
if (explicitPref) params.set('explicit', explicitPref)

const loreSlug = (route.params.loreSlug || []).join('/')
const apiUrl = `/api/lore/${workType}/${slug}/${loreSlug}?${params.toString()}`
const { data: lore, error } = await useFetch(apiUrl)

if (error.value) {
  console.error(error.value)
}

// Search state
const showSearch = ref(false)
const searchTerm = ref('')

function onSearchInput() {
  nextTick(() => performSearch())
}

function performSearch() {
  const term = searchTerm.value.toLowerCase().trim()
  const container = document.getElementById('lore-content')
  if (!container) return

  const sections = container.querySelectorAll('.collapsible-section')
  sections.forEach(section => {
    let match = false
    if (term === '') {
      match = true
    } else {
      const toggleBtn = section.querySelector('.collapsible-toggle')
      const titleText = toggleBtn?.textContent?.toLowerCase() || ''

      if (lore.value?.searchMode === 'content') {
        const contentDiv = section.querySelector('.collapsible-content')
        const contentText = contentDiv?.textContent?.toLowerCase() || ''
        match = titleText.includes(term) || contentText.includes(term)
      } else {
        match = titleText.includes(term)
      }
    }
    section.style.display = match ? '' : 'none'
  })
}

// When lore content updates, re-run search
watch(() => lore.value?.content, () => {
  nextTick(() => performSearch())
})

// Intercept lore link clicks and send message to parent
onMounted(() => {
  document.addEventListener('click', (e) => {
    const link = (e.target).closest('.lore-link')
    if (!link) return
    e.preventDefault()
    const slug = link.dataset.loreSlug
    if (slug) {
      window.parent.postMessage({ type: 'navigate-lore', loreSlug: slug }, '*')
    }
  })
  // window.addEventListener('message', (event) => {
  //   console.log('Embed page received message:', event.data)
  //   if (event.data?.type === 'scroll-to' && event.data.hash) {
  //     console.log('scrollIframeToHash', event.data.hash)
  //     const tryScroll = (attempts = 0) => {
  //       const el = document.querySelector(event.data.hash)
  //       if (el) {
  //         el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  //       } else if (attempts < 5) {
  //         // Retry after a short delay if the element isn't found yet
  //         setTimeout(() => tryScroll(attempts + 1), 100)
  //       }
  //     }
  //     tryScroll()
  //   }
  // })
  console.log('Embed page: sending lore-iframe-ready')
  window.parent.postMessage({ type: 'lore-iframe-ready' }, '*')
})


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>