<template>
  <footer class="mt-[90px] border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-dark2">
    <div class="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
      <!-- Logo -->
      <NuxtLink to="/" class="shrink-0">
        <img src="/images/seal.png" alt="Site logo" class="h-40 w-auto hover:scale-110 transition-all" />
      </NuxtLink>

      <!-- Links -->
      <nav class="flex flex-row sm:flex-col justify-center sm:justify-end gap-x-6 gap-y-2">
        <h3 class="hidden sm:block mb-2 text-sm text-gray-600 dark:text-gray-400">Site:</h3>
        <NuxtLink
          v-for="item in footerLinks"
          :key="item.label"
          :to="item.href"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
          {{ item.label }}
        </NuxtLink>
      </nav>
    
      <!-- NavLinks -->
      <nav class="flex flex-row sm:flex-col justify-center sm:justify-end gap-x-6 gap-y-2">
        <h3 class="hidden sm:block mb-2 text-sm text-gray-600 dark:text-gray-400">Content:</h3>
        <NuxtLink
          v-for="item in contentLinks"
          :key="item.label"
          :to="item.href"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
      <!-- Community Links -->
      <div class="flex flex-col items-center sm:items-start">
        <nav class="flex flex-row sm:flex-col justify-center sm:justify-end gap-x-6 gap-y-2">
          <h3 class="hidden sm:block text-sm text-gray-600 dark:text-gray-400 mb-2">Community:</h3>
          <NuxtLink
            v-for="item in communityLinks"
            :key="item.label"
            :to="item.href"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
      <div class="flex flex-col items-center sm:items-start">
        <h3 class="hidden sm:block mb-3 text-sm text-gray-600 dark:text-gray-400">My Socials:</h3>
        <div class="flex items-center mb-4">
          <!-- Webnovel -->
          <a
            href="https://www.webnovel.com/profile/4324841567" target="_blank" rel="noopener noreferrer" class="mr-2 my-2" aria-label="My Webnovel Profile">
            <img src="/images/WN-APPICON.svg" alt="Webnovel" class="h-5 w-5"/>
          </a>
          <!-- Ko-fi -->
          <a
            href="https://ko-fi.com/daoistgreenonion" target="_blank" rel="noopener noreferrer" class="m-2" aria-label="Support me on Ko-fi">
            <img src="/images/kofi_symbol.svg" alt="Ko-fi" class="h-5 w-5"/>
          </a>
          <!-- Discord -->
          <a
            href="https://discord.gg/JfSRtJVXTd" target="_blank" rel="noopener noreferrer" class="m-2" aria-label="Join Discord Server">
            <img src="/images/Discord-Symbol-Blurple.svg" alt="Discord" class="h-5 w-5"/>
          </a>
          <!-- Substack -->
          <a
            href="https://daoistgreenonion.substack.com/" target="_blank" rel="noopener noreferrer" class="m-1" aria-label="My Subtstack Page">
            <img src="/images/substack.png" alt="Substack" class="h-6 w-6"/>
          </a>
        </div>

        <!-- Legal Links -->
        <nav class="flex flex-row sm:flex-col justify-center sm:justify-end gap-x-6 gap-y-2">
          <h3 class="hidden sm:block mb-2 text-sm text-gray-600 dark:text-gray-400">Legal:</h3>
          <NuxtLink
            v-for="item in legalLinks"
            :key="item.label"
            :to="item.href"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-gray-200 dark:border-gray-800 py-4">
      <p class="text-center text-xs text-gray-500 dark:text-gray-500">
        © {{ new Date().getFullYear() }} Daoist Green Onion. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>
const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
]

const contentLinks = [
  { label: 'Novels', href: '/novels' },
  // { label: 'Anthologies', href: '/anthologies' },
  { label: 'Short Stories', href: '/short-stories' },
]

const communityLinks = [
  { label: 'Support me', href: '/support' },
  { label: 'Links & Resources', href: '/resources' },
]

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
]
</script>