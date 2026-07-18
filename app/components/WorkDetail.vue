<template>
  <main class="max-w-5xl mx-auto py-12 px-4">
    <NuxtLink :to="backLink" class="text-brand dark:text-brand-light hover:underline mb-4 inline-block">
      ← {{ backLabel || 'Back' }}
    </NuxtLink>

    <section class="grid grid-cols-1 sm:grid-cols-[4fr,5fr]">
      <!-- Right-Side Cover Image (full on mobile) -->
      <div class="w-full">
        <NuxtImg 
          :src="work.cover" 
          :alt="work.title" 
          class="w-full"
          />
      </div>

      <!-- Left-Side Info (below on mobile) -->
      <div class="flex flex-col justify-between">
        <div class="pt-3 sm:p-3 flex flex-col justify-between">
          <div>
            <!-- Title -->
            <h1 class="text-xl sm:text-2xl font-bold mb-2">{{ work.title }}</h1>
    
            <!-- Explicit -->
            <p v-if="work.explicit" class="border border-red-500 text-red-500 text-sm w-min px-2 mb-1">EXPLICIT</p>
          </div>
  
          <!-- Tags -->
          <div class="gap-y-4 my-3 text-[12px] lg:text-[16px]">
            <p class="mr-2 items-start font-bold text-gray-500 dark:text-gray-500 mb-2 mt-1">Status:</p>
            <p class="text-[18px] sm:text-[12px] lg:text-[18px] capitalize">
              {{work.status}} 
            </p>
            <p class="mr-2 items-start font-bold text-gray-500 dark:text-gray-500 mb-2 mt-1">Chapters: </p>
            <p class="text-[18px] sm:text-[12px] lg:text-[18px] capitalize">
              {{ work.chapters.length }}
            </p>
            <p class="mr-2 items-start font-bold text-gray-500 dark:text-gray-500 mb-2 mt-1">Genre:</p>
            <ul v-if="work.maintags" class="flex gap-2 text-[18px] sm:text-[12px] lg:text-[18px]">
              <li v-for="tag in work.maintags" :key="tag.slug">
                <Tag 
                  :tag = tag
                />
              </li>
            </ul>
            <p class="mr-2 items-start font-bold text-gray-500 dark:text-gray-500 mb-2 mt-1">Tags:</p>
            <ul v-if="work.tags" class="flex flex-wrap gap-2 text-[18px] sm:text-[12px] lg:text-[18px]">
              <li v-for="tag in work.tags" :key="tag.slug">
                <Tag 
                  :tag = tag
                />
              </li>
            </ul>
          </div>
        </div>
        
        
        <div class="flex sm:bg-gray-100 sm:dark:bg-dark2 py-3 sm:p-3 lg:p-6 justify-between items-center">
          <!-- Lore link -->
          <div v-if="loreBasePath && work.lore?.length">
            <NuxtLink :to="loreBasePath" class="flex items-center gap-2 text-white w-full p-2 sm:p-2 lg:px-7 lg:py-4 lg:text-xl bg-brand text-gray-100 hover:bg-brand-light">
              <svg class='w-5 h-5 sm:w-7 sm:h-7'  viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor">
                <path d="M60.711 52.708h-.013V11.3h.013c.712 0 1.289-.581 1.289-1.298c0-.717-.577-1.298-1.289-1.298h-.99c.193-.393.313-.83.313-1.298a2.928 2.928 0 0 0-2.918-2.938H56.03v-1.3c0-.641-.517-1.161-1.154-1.161c-.635 0-1.151.52-1.151 1.161v1.299h-1.086a2.929 2.929 0 0 0-2.919 2.938c0 .469.119.905.313 1.298h-.99a1.3 1.3 0 0 0-1.079 2.006c-2.93.49-9.125 1.347-16.631 1.347c-5.428 0-10.548-.47-15.297-1.347c.135-.205.214-.45.214-.714c0-.718-.578-1.298-1.289-1.298h-.992c.194-.394.313-.831.313-1.299a2.927 2.927 0 0 0-2.917-2.938h-1.086V3.162A1.159 1.159 0 0 0 9.125 2c-.638 0-1.154.52-1.154 1.162V4.46H6.885c-1.611 0-2.916 1.315-2.916 2.938c0 .469.119.906.313 1.299h-.993C2.577 8.697 2 9.277 2 9.995c0 .716.577 1.298 1.289 1.298h.013V52.7h-.013C2.577 52.7 2 53.281 2 53.997c0 .719.577 1.299 1.289 1.299h.991a2.95 2.95 0 0 0-.312 1.299c0 1.623 1.305 2.938 2.916 2.938H7.97v1.299c0 .642.517 1.162 1.154 1.162c.637 0 1.153-.521 1.153-1.162v-1.299h1.084a2.928 2.928 0 0 0 2.919-2.938c0-.469-.119-.905-.313-1.299h.992c.69 0 1.252-.55 1.284-1.239c3.187.52 9.226 1.312 16.421 1.312c5.329 0 10.392-.432 15.097-1.277a1.289 1.289 0 0 0 1.28 1.213h.99c-.194.393-.313.83-.313 1.299a2.93 2.93 0 0 0 2.919 2.938h1.086v1.299c0 .641.517 1.161 1.151 1.161c.638 0 1.154-.521 1.154-1.161V59.54h1.086c1.611 0 2.916-1.315 2.916-2.938c0-.469-.119-.906-.312-1.299h.991c.712 0 1.289-.581 1.289-1.299a1.29 1.29 0 0 0-1.287-1.296m-9.783-.937V12.237h7.896V51.77h-7.896zm-37.856-.008H5.177V12.231h7.896v39.532zm1.875.166V12.441c5.062.989 10.567 1.49 16.385 1.49c8.328 0 15.122-1.045 17.717-1.506v39.514c-5.041 1.032-10.549 1.554-16.384 1.554c-8.597 0-15.513-1.15-17.718-1.564" fill="currentColor"></path><path d="M31.998 17.816c-8.457 0-13.089-1.373-13.135-1.386l-.273.897c.192.058 4.795 1.427 13.408 1.427c9.195 0 13.639-1.37 13.822-1.428l-.281-.894c-.044.013-4.489 1.384-13.541 1.384" fill="currentColor"></path><path d="M31.998 22.098c-8.457 0-13.089-1.373-13.135-1.386l-.273.897c.192.058 4.795 1.426 13.408 1.426c9.195 0 13.639-1.37 13.822-1.428l-.281-.894c-.044.014-4.489 1.385-13.541 1.385" fill="currentColor"></path><path d="M31.998 26.379c-8.457 0-13.089-1.372-13.135-1.386l-.273.897c.192.058 4.795 1.426 13.408 1.426v-.937" fill="currentColor"></path><path d="M31.998 34.941c-2.291 0-4.509-.1-6.592-.297l-.088.934c2.111.199 4.359.301 6.68.301c9.195 0 13.638-1.369 13.822-1.428l-.281-.895c-.044.015-4.489 1.385-13.541 1.385" fill="currentColor"></path><path d="M31.998 39.224c-8.457 0-13.089-1.372-13.135-1.386l-.273.896c.192.059 4.795 1.427 13.408 1.427c9.195 0 13.639-1.37 13.822-1.429l-.281-.893c-.044.015-4.489 1.385-13.541 1.385" fill="currentColor"></path><path d="M31.998 43.506c-8.457 0-13.089-1.373-13.135-1.387l-.273.897c.192.058 4.795 1.427 13.408 1.427c9.195 0 13.639-1.37 13.822-1.429l-.281-.894c-.044.015-4.489 1.386-13.541 1.386" fill="currentColor"></path><path d="M18.59 47.298c.192.058 4.795 1.426 13.408 1.426v-.938c-8.457 0-13.089-1.372-13.135-1.386l-.273.898" fill="currentColor"></path>
              </svg>
              Explore Lore
            </NuxtLink>
          </div>

          <!-- Start Reading button (only if no external link and chapters exist) -->
          <div v-if="!work.externalLink && firstChapter">
            <NuxtLink
              :to="`${chapterBasePath}/${firstChapter.slug}`" class="flex items-center gap-2 w-full p-2 sm:p-2 lg:px-7 lg:py-4 lg:text-xl bg-brand hover:bg-brand-light transition-colors text-gray-100">
              <svg class="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read First Chapter
            </NuxtLink>
          </div>
  
          <!-- External link -->
          <div v-else-if="work.externalLink">
            <a
              :href="work.externalLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 w-full p-2 sm:p-2 lg:px-7 lg:py-4 lg:text-xl bg-brand hover:bg-brand-light transition-colors text-gray-100"
            >
              <img src="/images/wn-w.svg" alt="WN" className='w-5 h-5 sm:w-7 sm:h-7'/>
              Read on Webnovel
            </a>
          </div>
  
          
        </div>
      </div>
    </section>

    <section class="my-6">
      <p class="text-lg text-gray-700 dark:text-gray-200 mb-8">{{ work.synopsis }}</p>
    </section>

    <section v-if="aboutFile && !work.externalLink">
      <div class="w-full flex border-b border-gray-200 dark:border-gray-700 mb-10">
        <button 
          v-if="aboutFile" 
          @pointerdown.prevent="activeTab = 'about'"
          class="flex-1 py-2 text-sm font-medium text-center hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="activeTab === 'about' 
            ? 'text-brand dark:text-brand-lightest font-semibold border-b-2 border-brand dark:border-brand-lightest '
            : 'text-gray-500 dark:text-gray-400 border-transparent border-b-2'
          "
        >
          About
        </button>
        <button 
          v-if="!work.externalLink" 
          @pointerdown.prevent="activeTab = 'chapters'"
          class="flex-1 py-2 text-sm font-medium text-center hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="activeTab === 'chapters' 
            ? 'text-brand dark:text-brand-lightest font-semibold border-b-2 border-brand dark:border-brand-lightest '
            : 'text-gray-500 dark:text-gray-400 border-transparent border-b-2'
          "
        >
          Chapters
        </button>
      </div>
    </section>

    <section v-if="aboutFile && activeTab === 'about'">
      <MarkdownRenderer :content="aboutFile.content" :collapse="true" />
    </section>

    <!-- Chapters list (if no external link) -->
    <section v-if="activeTab === 'chapters' && !work.externalLink">
      <ul class="space-y-2">
        <li v-for="(chapter, index) in work.chapters" :key="chapter.slug">
          <NuxtLink
          :to="`${chapterBasePath}/${chapter.slug}`"
          class="text-brand hover:underline flex gap-2"
          >
            <p class="text-nowrap hidden sm:inline">Chapter {{ index + 1 }}.</p>
            <p class="text-nowrap sm:hidden">{{ index + 1 }}.</p>
            <p class="text-wrap">{{ chapter.title }}</p> 
          </NuxtLink>
        </li>
      </ul>
    </section>

  </main>
</template>

<script setup>
import { ref, computed } from 'vue'


const props = defineProps({
  work: { type: Object, required: true },
  backLink: { type: String, required: true },
  backLabel: { type: String, default: 'Back' },
  chapterBasePath: { type: String, required: true },
  loreBasePath: { type: String, default: '' },
})

const activeTab = ref('about')
const firstChapter= computed(() => props.work.chapters?.[0] || null)
const aboutFile = computed(() => props.work.extraFiles?.find(f => f.slug === 'about') || null)


</script>