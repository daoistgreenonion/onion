<template>
  <div class="flex flex-col h-full">
    <!-- Header: work title, current chapter, back link, chapter navigation arrows -->
    <div class="flex items-center justify-between mb-4">
      <NuxtLink
        v-if="backLink"
        :to="backLink"
        class="text-brand dark:text-brand-lightest hover:underline inline-block"
        :class="loreOnly ? 'mb-2' : 'mb-0'"
        @click="$emit('close')"
      >
        <h2 class="font-semibold text-lg truncate">{{ workTitle }}</h2>
      </NuxtLink>
    </div>

    <div v-if="loreOnly" class=" hidden sm:flex items-center py-2 border-t border-gray-600 dark:border-gray-400 mb-2"></div>

    <ChapterNavigation
      v-if="!loreOnly && showNavigation"
      :prev-chapter="prevChapter"
      :next-chapter="nextChapter"
      :chapter-base-path="chapterBasePath"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">Ch. {{ currentChapterIndex + 1 }} - {{ currentTitle }}</p>
    </ChapterNavigation>

    <!-- Tabs (only when not loreOnly) -->
    <div
      v-if="!loreOnly && tabs.length > 1"
      class="flex border-b border-gray-200 dark:border-gray-700 mb-3"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @pointerdown.prevent="activeTab = tab.key"
        :class="tabClass(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Settings -->
    <div
      v-if="activeTab === 'settings' && !loreOnly"
      ref="chapterListRef"
      class="flex-1 overflow-y-auto space-y-1 max-h-[50vh] min-h-[50vh] sm:max-h-none sm:min-h-none"
    >
      <ReadingPanelSettings />
    </div>

    <!-- Chapter list -->
    <div
      v-if="activeTab === 'chapters' && hasChapters && !loreOnly"
      ref="chapterListRef"
      class="flex-1 overflow-y-auto space-y-1 max-h-[50vh] min-h-[50vh] sm:max-h-none sm:min-h-none"
    >
      <NuxtLink
        v-for="(ch, index) in chapters"
        :key="ch.slug"
        :id="`chapter-${ch.slug}`"
        :to="`${chapterBasePath}/${ch.slug}`"
        :class="[
          'block px-2 py-1 rounded text-sm',
          ch.slug === currentSlug
            ? 'bg-brand-light/20 text-brand-light'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
        @click="$emit('close')"
      >
        {{ index + 1 }}. {{ ch.title }}
      </NuxtLink>
    </div>

    <!-- Lore list -->
    <div
  v-if="(activeTab === 'lore' || loreOnly) && hasLore"
  class="flex-1 overflow-y-auto space-y-1"
>
  <template v-for="entry in loreSafe" :key="entry.slug">
    <!-- Parent entry (with children) -->
    <div v-if="entry.children && entry.children.length">
      <button
        v-if="isLoreUnlocked(entry)"
        @pointerdown.prevent="openEntry(entry)"
        :class="[
          'block w-full text-left px-2 py-1 rounded text-sm',
          entry.slug === selectedLoreSlug
            ? 'bg-brand-light/20 text-brand-light'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
      >
        {{ entry.title }}
      </button>
      <div v-else class="px-2 py-1 rounded text-sm text-gray-400 dark:text-gray-600">
        <span class="line-through">{{ entry.title }}</span>
        <p v-if="entry.lockedMessage" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Unlocked after {{ unlockChapterTitle(entry) }}
        </p>
      </div>

      <!-- Children (visible when expanded) -->
      <div v-if="expandedSlug === entry.slug" class="ml-6 space-y-1">
        <div v-for="(child, index) in entry.children" :key="child.slug" class="flex items-start gap-0.5">
          <!-- Tree line SVG (only if parent is expanded) -->
          <svg
            v-if="expandedSlug === entry.slug"
            class="w-4 h-5 mt-0.5 flex-shrink-0 text-gray-400 dark:text-gray-600"
            viewBox="0 0 16 20"
            fill="none"
            stroke="currentColor"
          >
            <!-- Vertical stem (from top to mid) -->
            <line x1="2" y1="0" x2="2" y2="10" />
            <!-- Horizontal branch -->
            <line x1="2" y1="10" x2="10" y2="10" />
            <!-- Vertical continuation (only if not last child) -->
            <line v-if="index !== entry.children.length - 1" x1="2" y1="10" x2="2" y2="20" />
          </svg>

          <!-- Child entry button (unchanged) -->
          <button
            v-if="isLoreUnlocked(child)"
            @pointerdown.prevent="openEntry(child)"
            :class="[
              'flex-1 text-left px-2 py-1 rounded text-sm',
              child.slug === selectedLoreSlug
                ? 'bg-brand-light/20 text-brand-light'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            {{ child.title }}
          </button>
          <!-- Locked child (unchanged) -->
          <div v-else class="flex-1 px-2 py-1 rounded text-sm text-gray-400 dark:text-gray-600">
            <span class="line-through">{{ child.title }}</span>
            <p v-if="child.lockedMessage" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Unlocked after {{ unlockChapterTitle(child) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Flat entry (no children) -->
    <template v-else>
      <button
        v-if="isLoreUnlocked(entry)"
        @pointerdown.prevent="openEntry(entry)"
        :class="[
          'block w-full text-left px-2 py-1 rounded text-sm',
          entry.slug === selectedLoreSlug
            ? 'bg-brand-light/20 text-brand-light'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
      >
        {{ entry.title }}
      </button>
      <div v-else class="px-2 py-1 rounded text-sm text-gray-400 dark:text-gray-600">
        <span class="line-through">{{ entry.title }}</span>
        <p v-if="entry.lockedMessage" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Unlocked after {{ unlockChapterTitle(entry) }}
        </p>
      </div>
    </template>
  </template>
</div>

    <!-- Skip targets list -->
    <div
      v-if="activeTab === 'skips' && skipTargets.length && !loreOnly"
      class="flex-1 overflow-y-auto space-y-1 max-h-[50vh] min-h-[50vh] sm:max-h-none sm:min-h-none"
    >
      <a
        v-for="target in skipTargets"
        :key="target.id"
        :href="`#${target.id}`"
        class="block px-2 py-1 rounded text-sm text-brand-lightest hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="$emit('close')"
      >
        {{ target.label }}
      </a>
    </div>

    <!-- Lore chapter input -->
    <div v-if="loreOnly && chapters.length > 0" class="flex items-center py-2 border-t border-b border-gray-600 dark:border-gray-400 sm:mb-20 lg:mb-0">
      <LoreChapterInput
        v-if="loreOnly && chapters.length > 0"
        :chapters="chapters"
        :model-value="loreChapterSlug"
        @update:model-value="(val) => $emit('update:loreChapter', val)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import ChapterNavigation from '~/components/ChapterNavigation.vue'
import LoreChapterInput from '~/components/LoreChapterInput.vue'

function getChapterNum(raw) {
  if (!raw) return null
  // Try to extract a number from "chapter-0005", "chapter-5", or just "5"
  const match = raw.match(/^chapter-(\d+)$/i) || raw.match(/^(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

const props = defineProps({
  workTitle: String,
  currentTitle: String,
  chapters: { type: Array, default: () => [] },
  lore: { type: Array, default: () => [] },
  backLink: String,
  chapterBasePath: String,
  workSlug: String,
  workType: String,
  prevChapter: { type: Object, default: null },
  nextChapter: { type: Object, default: null },
  currentSlug: { type: String, default: '' },
  showNavigation: Boolean,
  loreOnly: Boolean,
  selectedLoreSlug: { type: String, default: '' },
  loreChapterSlug: { type: String, default: '' },
  skipTargets: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'close',
  'loreOpen',
  'update:loreChapter',
])

const activeTab = ref('settings')

const hasChapters = computed(() => props.chapters.length > 0)
const loreSafe = computed(() => props.lore || [])
const hasLore = computed(() => loreSafe.value.length > 0)

// Tab definitions – automatically include only available tabs
const tabs = computed(() => {
  const list = []
  list.push({ key: 'settings', label: 'Settings' })
  if (hasChapters.value) list.push({ key: 'chapters', label: 'Chapters' })
  if (hasLore.value) list.push({ key: 'lore', label: 'Lore' })
  if (props.skipTargets.length) list.push({ key: 'skips', label: 'Skip' })
  return list
})

function tabClass(tab) {
  let finalCLass = ''
  finalCLass += 'flex-1 py-2 text-sm font-medium text-center '
  if(activeTab.value === tab) finalCLass += 'text-brand dark:text-brand-lightest font-semibold border-b-2 border-brand dark:border-brand-lightest '
  else finalCLass += 'text-gray-500 dark:text-gray-400 border-transparent border-b-2 '
  if(tab === 'settings') finalCLass += ''
  return finalCLass
}

const currentChapterIndex = computed(() => {
  if (!props.loreChapterSlug) return -1
  const num = getChapterNum(props.loreChapterSlug)
  if (num !== null && num >= 1) {
    const idx = props.chapters.findIndex(ch => getChapterNum(ch.slug) === num)
    if (idx !== -1) return idx
    // If not found by number, fall back to direct slug match
  }
  // Direct slug match
  const idx = props.chapters.findIndex(ch => ch.slug === props.loreChapterSlug)
  return idx !== -1 ? idx : -1
})

const isLoreUnlocked = (entry) => {
  if (!entry.loreChapter) return true
  if (!props.loreChapterSlug) return false
  const requiredNum = getChapterNum(entry.loreChapter)
  if (requiredNum === null) return false
  return requiredNum - 1 <= currentChapterIndex.value
}

const filteredLore = computed(() => {
  if (!props.lore) return []
  return props.lore.filter(entry => {
    if (entry.explicit && explicitPreference.value !== 'expanded') return false
    // also respect chapter locking (already handled by isLoreUnlocked, but we keep both)
    return true
  })
})

// Scroll to active chapter when panel opens on chapters tab
const chapterListRef = ref(null)
watch(activeTab, (tab) => {
  if (tab === 'chapters') scrollToActiveChapter()
})
watch(() => props.currentSlug, () => {
  if (activeTab.value === 'chapters') scrollToActiveChapter()
})

function scrollToActiveChapter() {
  nextTick(() => {
    if (activeTab.value !== 'chapters') return
    const el = document.getElementById(`chapter-${props.currentSlug}`)
    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' })
  })
}

const expandedSlug = ref(null)

// function handleParentClick(entry, event) {
//   // Toggle children visibility
//   if (expandedSlug.value === entry.slug) {
//     expandedSlug.value = null
//   } else {
//     expandedSlug.value = entry.slug
//   }
//   // Open the parent entry itself
//   $emit('loreOpen', `/embed-lore/${workType}/${workSlug}/${entry.slug}`)
// }


function openEntry(entry) {
  // Determine which parent's children to show
  if (entry.children && entry.children.length > 0) {
    // Parent entry – show its children
    expandedSlug.value = entry.slug
  } else if (entry.parentPath) {
    // Child entry – keep parent's children visible
    expandedSlug.value = entry.parentPath.split('/')[0]
  } else {
    // Flat entry – hide any open children
    expandedSlug.value = null
  }

  // Emit lore-open with the correct path
  const path = entry.parentPath || entry.slug
  emit('loreOpen', `/embed-lore/${props.workType}/${props.workSlug}/${path}`)
}

</script>