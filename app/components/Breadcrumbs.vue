<template>
  <nav v-if="crumbs.length > 1" aria-label="Breadcrumb" class="py-0" :class="smallSize ? 'pt-0 max-w-xl lg:max-w-2xl 2xl:max-w-3xl' : 'pt-4 max-w-5xl', lorePage ? 'px-4 sm:px-10' : 'px-4 mx-auto'">
    <ol class="flex flex-wrap items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      <li v-for="(crumb, i) in crumbs" :key="crumb.href" class="flex items-center sm:gap-1">
        <span v-if="i > 0" aria-hidden="true" class="sm:mx-1 text-gray-400 dark:text-gray-600">/</span>
        <span
          v-if="i === crumbs.length - 1"
          class="font-medium text-gray-900 dark:text-gray-200"
          aria-current="page"
        >
          {{ crumb.label }}
        </span>
        <NuxtLink v-else :to="crumb.href" class="hover:text-brand-light hover:underline transition-colors">
          {{ crumb.label }}
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  smallSize : Boolean,
  lorePage : Boolean,
})

const route = useRoute()

const ROUTE_LABELS = {
  '': 'Home',
  novels: 'Novels',
  anthologies: 'Anthologies',
  'short-stories': 'Short Stories',
  news: 'News',
  support: 'Support',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
}

function formatSlug(slug) {
  // Match chapter‑like patterns: chapter‑01, ch‑01, chapter-01, etc.
  const chapterMatch = slug.match(/^(?:chapter|ch)[-_](\d+)$/i)
  if (chapterMatch) {
    return `Chapter ${parseInt(chapterMatch[1], 10)}`
  }

  // Match part‑like patterns: part‑01, part-1, etc.
  const partMatch = slug.match(/^part[-_](\d+)$/i)
  if (partMatch) {
    return `Part ${parseInt(partMatch[1], 10)}`
  }

  // Default: capitalize and replace hyphens/underscores with spaces
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const crumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathSegments.map((seg, i) => {
      const href = '/' + pathSegments.slice(0, i + 1).join('/')
      const label = ROUTE_LABELS[seg] || formatSlug(seg)
      return { label, href }
    }),
  ]
  return breadcrumbs
})
</script>