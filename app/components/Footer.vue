<template>
  <footer class="mt-[90px] border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-dark2">
    <div class="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
      <!-- Logo -->
      <NuxtLink to="/" class="shrink-0">
        <img src="/images/seal.png" alt="Site logo" class="h-40 w-auto hover:scale-110 transition-all" />
      </NuxtLink>

      <!-- Links -->
      <nav class="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
        <NuxtLink
          v-for="item in footerLinks"
          :key="item.label"
          :to="item.href"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Discord -->
        <a
          href="https://discord.gg/your-invite-code"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 rounded-md  transition-colors text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 visible"
          aria-label="Join Discord Server"
          >
          <img src="/images/Discord-Symbol-Black.svg" alt="Discord" class="h-5 w-5 dark:hidden"/>
          <img src="/images/Discord-Symbol-White.svg" alt="Discord" class="h-5 w-5 hidden dark:block"/>
        </a>
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
  { label: 'Novels', href: '/novels' },
  { label: 'Anthologies', href: '/anthologies' },
  { label: 'Short Stories', href: '/short-stories' },
  { label: 'News', href: '/news' },
  { label: 'Support', href: '/support' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
]
</script>