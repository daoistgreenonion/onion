<template>
  <header
  id="navbar"
  class="fixed top-0 left-0 w-full z-50 border-b transition-all duration-300 text-nowrap"
  :class="
    isHomePage
      ? isAtTop
        ? 'bg-transparent border-transparent'
        : 'bg-white/90 dark:bg-dark/80 backdrop-blur-sm border-gray-200 dark:border-gray-700'
      : 'bg-white/90 dark:bg-dark/90 border-gray-200 dark:border-gray-700'
  "
>
    <nav class="px-4 flex items-center justify-between transition-all" :class= "readingPage  ? 'h-10' : 'py-1', lorePage ? 'max-w-none' : 'max-w-5xl mx-auto'">
      <!-- Logo -->
      <NuxtLink to="/" class="flex shrink-0 transition-all flex items-center" :class="isHomePage ? isAtTop ? 'opacity-60 hover:opacity-100 text-brand-lightest dark:text-brand' : 'opacity-80 hover:opacity-100 text-brand' : 'opacity-80 hover:opacity-100 text-brand' , lorePage ? 'lg:mr-[15%] lg:ml-2' : 'lg:mr-12'">
        <img src="/images/seal.png" alt="Site logo" class="w-auto" :class= "readingPage  ? 'h-10' : 'h-16'"/>
        <p class="hidden sm:flex font-bold text-md">DaoistGreenOnion</p>
        <p class="flex sm:hidden font-bold text-xl">DGO</p>
      </NuxtLink>



      <div class="flex w-full justify-end md:justify-between gap-1 lg:gap-2">
        <div class="flex gap-0.5 lg:gap-2">
  
          <!-- Desktop links -->
          <div class="hidden md:flex gap-0.5 lg:gap-2 items-center" 
            :class="
              isHomePage
                ? isAtTop
                  ? 'text-gray-800 dark:text-gray-300'
                  : 'text-gray-800 dark:text-gray-300'
                : 'text-gray-800 dark:text-gray-300'
            ">
            <NuxtLink
              v-for="item in navItems"
              :key="item.label"
              :to="item.href"
              class="text-sm font-medium transition-colors p-2 rounded"
              :class="
              isHomePage
                ? isAtTop
                  ? 'hover:bg-gray-300/50 hover:text-brand'
                  : 'hover:text-brand-light'
                : 'hover:text-brand-light'
            "
            >
              {{ item.label }}
            </NuxtLink>
          </div>
  
          
        </div>
        <!-- Theme toggle -->
        <button @pointerdown.prevent="toggleTheme" class="p-2 rounded-md hover:text-brand dark:hover:text-brand-light transition-colors" aria-label="Toggle theme">
          <!-- Moon icon (visible when dark) -->
          <svg v-if="isDark"  class="h-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <!-- Sun icon (visible when light) -->
          <svg v-else class="h-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
        
        <!-- Right side: Work Links and Explicit, -->
        <div class="flex items-center gap-2">
          <!-- Works links -->
          <div class="hidden md:flex gap-0.5 lg:gap-2 items-center" 
            :class="
              isHomePage
                ? isAtTop
                  ? 'text-gray-800 dark:text-gray-300'
                  : 'text-gray-800 dark:text-gray-300'
                : 'text-gray-800 dark:text-gray-300'
            ">
            <NuxtLink
              v-for="item in navWorks"
              :key="item.label"
              :to="item.href"
              class="text-sm font-medium transition-colors p-2 rounded"
              :class="
              isHomePage
                ? isAtTop
                  ? 'hover:bg-gray-300/50 hover:text-brand'
                  : 'hover:text-brand-light'
                : 'hover:text-brand-light'
            "
            >
              {{ item.label }}
            </NuxtLink>
          </div>
  
  
  
          <!-- Explicit Preference Button -->
          <button
            @pointerdown.prevent="toggleExplicitPreference"
            class="p-2 rounded-md hover:text-brand dark:hover:text-brand-light font-bold w-[55px] sm:w-[70px]"
            :aria-label="explicitPreference === 'expanded' ? 'Hide explicit content' : 'Show explicit content'"
            title="Toggle explicit content visibility"
          >
            <p v-if="explicitPreference === 'collapsed'" class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">SFW</p>
            <p v-else class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">
              NSFW
            </p>
          </button>
        </div>
  
  
        <!-- Support button -->
        <a href="/support" class="p-2 text-sm font-medium rounded-md transition-colors text-gray-900 dark:text-gray-300 sm:bg-gray-100/20 sm:hover:bg-gray-100/50" :class="isHomePage ? isAtTop ? 'opacity-60 hover:opacity-100 text-brand-lightest dark:text-brand' : 'opacity-80 hover:opacity-100 text-brand' : readingPage ? 'opacity-50 hover:opacity-100' : 'opacity-80 hover:opacity-100 text-brand' ">
          <span class="hidden md:flex items-center gap-2">
            <span class="h-5">Support me</span>
            <span class="">
              <svg class="w-7 h-7 text-brand" fill="currentColor" viewBox="0 0 24 24" aria-label="Support me" >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
          </span>
          <span class="md:hidden" aria-label="Support me">
            <svg class="w-7 h-7 text-brand" fill="currentColor" viewBox="0 0 24 24" aria-label="Support me">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </span>
        </a>
      
        <!-- Burger button -->
        <button
          @pointerdown.prevent="mobileOpen = !mobileOpen"
          class="md:hidden p-2 rounded-md bg-gray-100/20 hover:bg-gray-100/50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Central links -->
      </div>

    </nav>

    <!-- Mobile dropdown -->
    <div v-if="mobileOpen" class="md:hidden border-t bg-transparent border-transparent"
    
    >
      <div class="px-4 py-3 space-y-2 bg-transparent">
        <NuxtLink v-for="item in navItems" :key="item.label" :to="item.href" class="flex bg-none text-sm font-medium py-2 hover:text-brand-lightest transition-colors" @click="mobileOpen = false">
          <span class="rounded px-2" :class=" isHomePage ? isAtTop ? 'bg-gray-200/60 dark:bg-dark' : 'bg-none' : 'bg-none' ">
            {{ item.label }}
          </span>
        </NuxtLink>
        <NuxtLink v-for="item in navWorks" :key="item.label" :to="item.href" class="flex bg-none text-sm font-medium py-2 hover:text-brand-lightest transition-colors" @click="mobileOpen = false">
          <span class="rounded px-2" :class=" isHomePage ? isAtTop ? 'bg-gray-200/60 dark:bg-dark' : 'bg-none' : 'bg-none' ">
            {{ item.label }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const props =  defineProps ({
  readingPage : Boolean,
  lorePage : Boolean,
})


import { useExplicitPreference } from '~/composables/useExplicitPreference'

const { explicitPreference, toggleExplicitPreference } = useExplicitPreference()


const navItems = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
]
const navWorks = [
  { label: 'Novels', href: '/novels' },
  // { label: 'Anthologies', href: '/anthologies' },
  { label: 'Short Stories', href: '/short-stories' },
]

const mobileOpen = ref(false)
const isDark = ref(false)

// Apply theme on mount and listen to changes
onMounted(() => {
  const stored = localStorage.getItem('theme')
  isDark.value = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
  applyTheme()
})

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
}

// navbar transparency

const route = useRoute()
const isAtTop = ref(true)

const isHomePage = computed(() => route.path === '/')

let scrollHandler = null

onMounted(() => {
  if (!isHomePage.value) return

  scrollHandler = () => {
    isAtTop.value = window.scrollY < 80
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  // initial check
  scrollHandler()
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})


</script>