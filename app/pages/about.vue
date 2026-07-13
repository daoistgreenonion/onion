<template>
  <main class="max-w-5xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
      About...
    </h1>

    <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
      <p>
        Welcome to my website! I'm DaoistGreenOnion. This is where I share my stories, novels, and worlds with you.
      </p>

      <Collapsible title="...Explicit Content" :open="true">
        <div class="flex flex-col gap-4">
          <p>
            To ensure best experience for everyone, explicit content (not appropriate for minors to view, and not appropriate for work) can be hidden site-wide with a simple button in the navigation bar at the top of the page. By choosing to display the explicit content you confirm that you are of legal age.
          </p>
          <p>
            The site uses your browser LocalStorage to store this preference.
          </p>
          <p>
            The button has two states:
          </p>
    
          <div class="grid grid-cols-[1fr,2fr,3fr] gap-y-2">
            <p>
              <span class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">SFW</span>
            </p>
            <p> Safe For Work</p>
            <p>When this is displayed, explicit content is hidden sitewide.</p>
            <p>
              <span class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">NSFW</span>
            </p>
            <p>Not Safe For Work</p>
            <p>When this is displayed, explicit content is .</p>
          </div>
    
          <p>Sometimes, even when you are an adult, and not at work, you may not feel like reading a NSFW scene at the moment, (the plot is just too good and you can't wait to read it lol), anyway, all explicit content on the reading pages is nested inside collapsible sections. They are all collapsed by default when the site-wide NSFW content is disabled, (when this icon is displayed: (<span class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">SFW</span>)), and expanded by default if the NSFW content is enabled. You can expand and collapse them individually by clicking on the "Expand"/"Collapse" WITHOUT affecting the global NSFW setting. </p>
    
          <div class="grid grid-cols-[1fr,2fr,3fr] gap-y-2">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
            </svg>
            <p>Collapsed</p>
            <p>The in-chapter explicit content is hidden, you can expand it by clicking on the icon.</p>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p>Expanded</p>
            <p>The in-chapter explicit content is expanded, you can collapse it in case you want to skip it.</p>
          </div>
        </div>
      </Collapsible>
      
      <Collapsible title="...Lore" :open="true">
        <p>
          If you are interested in looking up lore, it can be accessed through the novel page or in reading pages (through)
        </p>
      </Collapsible>

      <Collapsible title="...Me" :open="true">
        <p>When I'm not writing, I'm probably sipping tea and reading old books.</p>
      </Collapsible>


    </div>
  </main>
</template>

<script setup>
const today = new Date().toISOString().slice(0, 10)

import { ref } from 'vue'
import Collapsible from '~/components/Collapsible.vue';

const expanded = ref(true)

</script>