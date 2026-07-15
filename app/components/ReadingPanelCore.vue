<template>
  <div class="flex flex-col h-full">
    <!-- Header: work title, current chapter, back link, chapter navigation arrows -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-lg truncate">{{ workTitle }}</h2>
      <div class="flex items-center gap-1">
        <ChapterNavigation
          v-if="!loreOnly && showNavigation"
          :prev-chapter="prevChapter"
          :next-chapter="nextChapter"
          :chapter-base-path="chapterBasePath"
        />
      </div>
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">{{ currentTitle }}</p>

    <NuxtLink
      v-if="backLink"
      :to="backLink"
      class="text-sm text-brand-lightest hover:underline mb-4 inline-block"
      @click="$emit('close')"
    >
      ← Table of Contents
    </NuxtLink>

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

    <!-- Chapter list -->
    <div
      v-if="activeTab === 'settings' && !loreOnly"
      ref="chapterListRef"
      class="flex-1 overflow-y-auto space-y-1"
    >
      <ReadingPanelSettings />
    </div>

    <!-- Chapter list -->
    <div
      v-if="activeTab === 'chapters' && hasChapters && !loreOnly"
      ref="chapterListRef"
      class="flex-1 overflow-y-auto space-y-1"
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
      <div v-for="entry in lore" :key="entry.slug">
        <!-- Unlocked lore entry -->
        <button
          v-if="isLoreUnlocked(entry)"
          @pointerdown.prevent="$emit('loreOpen', `/embed-lore/${workType}/${workSlug}/${entry.slug}`)"
          :class="[
            'block w-full text-left px-2 py-1 rounded text-sm',
            entry.slug === selectedLoreSlug
              ? 'bg-brand-light/20 text-brand-light'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          ]"
        >
          {{ entry.title }}
        </button>

        <!-- Locked lore entry -->
        <div v-else class="px-2 py-1 rounded text-sm text-gray-400 dark:text-gray-600">
          <span class="line-through">{{ entry.title }}</span>
          <p v-if="entry.lockedMessage" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Unlocked after {{ unlockChapterTitle(entry) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Skip targets list -->
    <div
      v-if="activeTab === 'skips' && skipTargets.length && !loreOnly"
      class="flex-1 overflow-y-auto space-y-1"
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
    <LoreChapterInput
      v-if="loreOnly && chapters.length > 0"
      :chapters="chapters"
      :model-value="loreChapterSlug"
      @update:model-value="(val) => $emit('update:loreChapter', val)"
    />
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
const hasLore = computed(() => props.lore.length > 0)

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
  return [
    'flex-1 py-2 text-sm font-medium text-center',
    activeTab.value === tab
      ? 'text-brand-lightest border-b-2 border-brand-lightest'
      : 'text-gray-500 dark:text-gray-400 border-b-2 border-transparent',
  ]
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
  const requiredNum = getChapterNum(entry.loreChapter)
  if (requiredNum === null) return false
  return requiredNum - 1 <= currentChapterIndex.value
}

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
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}
</script>