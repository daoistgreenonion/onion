<template>
  <main class="max-w-5xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
      About...
    </h1>

    <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
      <div class="flex flex-col gap-4 p-6 sm:p-12">
        <p>
          Welcome to my website! I'm DaoistGreenOnion. This is where I share my stories, novels, and worlds with you. 
        </p>
        <p>
          When making the site, I tried to include a few simple features that I believe to be helpful for good reading experience, I will include an explanation for them on this page first:
        </p>
      </div>
      <Collapsible title="...Explicit Content Access and Visibility" :open="true">
        <div class="flex flex-col gap-4">
          <p>
            To ensure best experience for everyone, explicit content (not appropriate for minors to view, and not appropriate for work) can be hidden site-wide (this includes listing of works that contain explicit content) with a simple button in the navigation bar at the top of the page. Click on the icon to change the content filtering mode. By choosing to display the explicit content you confirm that you are of legal age.
          </p>
          <p>
            The button has two states:
          </p>
    
          <div class="grid grid-cols-[1fr,2fr,3fr] gap-y-2">
            <p>
              <span class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">SFW</span>
            </p>
            <p> Safe For Work</p>
            <p>When this is displayed, explicit content is hidden sitewide. (Novels and Short Stories containing explicit content are also hidden from listing on Home Page and their corresponding listing pages)</p>
            <p>
              <span class="border rounded border-2 border-dark dark:border-gray-100 px-1 text-[10px] sm:text-sm">NSFW</span>
            </p>
            <p>Not Safe For Work</p>
            <p>When this is displayed, all explicit content is shown sitewide.</p>
          </div>

          <p>
            If you are already on the novel page that contains explicit content, this feature will not automatically reroute you to another page, it only works as a means of restricting access to getting to the page containing explicit content to begin with.
          </p>
    
          <p>Sometimes, even when you are an adult, and not at work, you may not feel like reading a NSFW scene at the moment, (the plot is just too good and you can't wait to read ahead lol), anyway, jokes aside, all in-chapter/in-story explicit content on the reading pages is nested inside collapsible sections just like the ones on this About Page. Those containing Explicit Content are clearly labeled as such (i.e. Explicit Content) They are all collapsed by default when the site-wide NSFW content is disabled, and expanded by default if the NSFW content is enabled. You can expand and collapse them individually by clicking on the "Expand"/"Collapse" WITHOUT affecting the global NSFW setting if you feel like skipping a particular scene.</p>
    
          <div class="grid grid-cols-[1fr,2fr,3fr] gap-y-2">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
            </svg>
            <p>Collapsed</p>
            <p>The in-chapter explicit content is hidden, you can expand it by clicking on the icon (this will only affect this specific section). </p>
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p>Expanded</p>
            <p>The in-chapter explicit content is expanded, you can collapse it in case you want to skip it (this will only affect this specific section).</p>
          </div>

          <p>To be clear, these eye icons are used on all collapsible sections site-wide, those containing Explicit Content are clearly labeled so by the words next to the icon. Collapsible sections NOT containing explicit content (like this one, and on this About page) are also NOT affected by the NSFW/SFW setting, only those for Explicit Content are.</p>
        </div>
      </Collapsible>
      
      
      <Collapsible title="...Reading Page Functionality" :open="true">
        <div class="flex flex-col gap-4">
          <p>
            On every novel and short story reading page (actual story text page) you’ll find a handy reading panel that gives you quick access to everything you need to enhance reading experience without leaving the story. Everything stays out of the way while you read, but it’s always just a tap or click away when you need it.
          </p>
          
          <p>
            Desktop – A small button on the right edge of the screen opens a side panel. 
          </p>
          
          <p>
            Mobile – A round floating button at the bottom‑right opens a bottom sheet.
          </p>
          
          <p>
            Inside the panel you can adjust the text size, toggle light/dark theme, toggle explicit content, jump between chapters (for novels) - prev/next chapter arrows let you move through the story instantly and for a specific chapter jump there's a full chapter list, browse lore entries (also mostly for novels) without leaving the page.
          </p>
          <p>
            Lore – If a story has world‑building notes, the Lore tab shows them in a separate overlay (a panel displayed on the same page) so you can explore background details without losing your reading spot (clicking on a lore entry will display another panel, not take you to another page, so when you finish looking up what you wanted you can return to reading the chapter that you were reading before, the sheet remembers your scroll position so you can pick up right where you left off).
          </p>
          
          <p>
            Explicit Content – some works contain mature scenes. As mentioned in the previous section (...Explicit Content), they are nested in collapsible sections. You can expand and/or collapse individual explicit scenes by clicking on the eye icon or use the global NSFW/SFW icon to reveal or hide all explicit content across the entire site including the explicit scenes.
          </p>
        </div>

      </Collapsible>

      <Collapsible title="...Lore" :open="true">
        <div class="flex flex-col gap-4">
          <p>
            Some novels and anthologies include optional lore entries — extra notes about the world, characters, or magic systems. Because lore is always tied to a specific story, there's no separate lore link in navigation. Instead, you'll find the link to the lore of the specific novel in that novel's description.
          </p>
          
          <p>
            And as I already explained above in "...Reading Page Functionality", it's also available directly on reading pages of that novel.
          </p>
          
          <p>
            On desktop, open the side panel and switch to the Lore tab to browse entries while the chapter stays visible beside you. On mobile, tap the floating button at the bottom‑right to bring up the bottom sheet and select the Lore tab. Tapping an entry opens it in a full‑screen overlay, keeping your reading spot safely preserved behind it.
          </p>
        </div>
      </Collapsible>

      <div class="flex flex-col gap-4 p-6 sm:p-12">
        <p>
          We're done with going over the functions for now, perhaps later there will be more there. 
        </p>
        <p>
          lol, after those collapsible sections above, this text might feel like the unskippable dialogue or cut scene in a game hahaha. Anyway, there's still a few things I wanted to go over on this page.
        </p>
      </div>
      
      <Collapsible title="...Why I built this Website" :open="true">
        <div class="flex flex-col gap-4">
          <p>
            I made this website purely for your entertainment, there's really not much more to it. I first had the idea when I asked my readers on the Discord Server if I should move away from Discord because of their changes in terms and services in regards to their data collection, content policy, as well as identity verification. I grew increasigly frustrated as after looking for possible alternatives, that all possible platforms I could move the server to had similar terms of service in regards to privacy and data collection. I am of the generation of older internet where data collection wasn't normal, and privacy was more of a guarantee than a suggestion ^^. 
          </p>
    
          <p>
            So I had the idea that, since I am originally a software developer, perhaps it was easier to just build my own replacement for the server. The specific point of concern for Discord (at least the sharpest one) was later proven not to be that big of a deal, so I decided that there was currently no need for such functionality, but the idea remained in my head. Not to mention, that after their policy change I did not feel like posting any of my content on the server since that would implicitly transfer some of the intellectual property rights for it which I did not want to do.
          </p>
          <p>
            I also remembered the feeling of uncertainty of having no fallback platform through which I could freely deliver content, news and announcements, and interact with my readers, in case I really had to or wanted to leave Discord. And so, the initial idea for this website was born. Eventually the idea became a fixation I couldn't get rid of so I made this first very light and simplistic version of what I initially envisioned. It's just a static website for now to share my works and updaates (you can call them news or announcements I guess, I chose "News" for the website since its the shortes word lol) with my readers. But perhaps with time it could grow into something more if need arises.
          </p>
        </div>
      </Collapsible>
      
      <div class="flex flex-col gap-4 p-6 sm:p-12">
        <p>
          With that in mind, I guess I should touch on the Terms and Services as well as Privacy Policy, just briefly and in general terms, there are dedicated pages for them (links in the footer at the very bottom of every page):
        </p>
      </div>


      <Collapsible title="...Privacy and Terms" :open="true">
        <div class="flex flex-col gap-4">
          <p>
            I built this site to share stories, not to collect data. There are no ads, no analytics, and no tracking of any kind built into it. I wanted to create this website out of frustration with the stats and data-collection obsessed internet to begin with, so naturally I didn't add any function that would contradict my vision for the site. The only thing your browser remembers is your preferences (light or dark theme, explicit content, etc.) so the site looks the way you like it every time you open it (across different visits). It is not a cookie, but what is called localStorage (included in site data), used by all sites and browsers automatically. That's stored entirely on your device and never sent anywhere, nor does it track your actions like a cookie. You can erase this data anytime by clearing site.data for this site. If your browser is set to automatically delete site data after you close the tab/window, this data will be erased automatically and your preferences would not be remembered, so you'll have to configure them every time you visit the site (not that big of a deal really either, but you also could set up an exception for this site if you don't feel like setting preferences on every visit). However, as much as I'd like to be idealistic, I still have to use modern internet infrastructure to host and deliver this website to you, which means that I use third-party services in between the site which is free of tracking and you, and I can't do much about what happens in that space in between the site and your device. That is just an unavoidable part of operating a website in this day and age that I can't do anything about. If you'd like the full, more formal version, you can read <NuxtLink :to="`/privacy`" class="text-brand dark:text-brand-light hover:text-brand-light dark:hover:text-brand-lightest hover:underline" >Privacy Policy</NuxtLink>.
          </p>
          <p>
            All the stories, art, and lore on this site are my original work, and I retain full rights to them. You're welcome to read, download copies for your personal enjoyment (when I set up that funcionality in the future, downloads are not available yet), and share links to the site, that's what I made this site for to begin with after all. What I ask is that you don't republish, redistribute, or use my work for commercial purposes or AI training without my permission. There's also a note about mature content — some stories are intended for adult readers, and you'll see a clear warning labes on the work containing them, as well as before those sections within the content itself. The website is set to start out in SFW mode by default, so you take full responsibility for viewing the content when you switch the viewing mode to show explicit content. The full legal text lives on the <NuxtLink :to="`/terms`" class="text-brand dark:text-brand-light hover:text-brand-light dark:hover:text-brand-lightest hover:underline" >Terms of Service</NuxtLink> page, but the short version is: just enjoy the stories, that's all I ask and all I intended by creating this website for you all.
          </p>
        </div>

      </Collapsible>

      <div class="flex flex-col gap-4 p-6 sm:p-12">
        <p></p>
      </div>




    </div>
  </main>
</template>

<script setup>
const today = new Date().toISOString().slice(0, 10)

import { ref } from 'vue'
import Collapsible from '~/components/Collapsible.vue';

const expanded = ref(true)

</script>