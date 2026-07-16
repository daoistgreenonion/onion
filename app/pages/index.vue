<template>
  <main class="max-w-5xl mx-auto">
    <!-- Hero Section -->
    <div class="w-full">
      <img src="/images/floatingmist.png" class="w-full dark:hidden" alt="floatingmist">
      <img src="/images/floatingmistdark.png" class="w-full hidden dark:flex" alt="floatingmist">
    </div>

    <div class="w-full my-12">
      <!-- Novels Section -->
      <section v-if="homepageSections.novels?.length" class="px-4 md:px-2 lg:px-0">
        <div class="flex flex-col justify-center items-center mb-8">
          <h2 class="text-2xl font-bold">NOVELS</h2>
        </div>
        <div class="grid gap-6 sm:grid-cols-3">
          <WorkCard
          v-for="novel in homepageSections.novels"
          :key="novel.slug"
          :work="novel"
          :link="`/novels/${novel.slug}`"
          />
        </div>
        <div class="flex flex-col justify-center items-center my-8">
          <p class="block explicit:hidden text-center" >
            Explicit content is hidden. Toggle the eye icon in navigation bar at the top to show.
            <NuxtLink to="/about" class="text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 font-bold">Click here to learn more</NuxtLink>
          </p>
          <p class="text-center" >Homepage contains limited number of works, full list is on novels page</p>
          <NuxtLink v-if="novelsRaw?.length > 2" to="/novels" class="text-darkaccent dark:text-accent hover:text-accent hover:underline">See More Novels</NuxtLink>
        </div>
      </section>
  
      <!-- Short Stories Section -->
      <section v-if="homepageSections.shorts?.length" class="px-4 md:px-2 lg:px-4">
        <div class="flex justify-center items-baseline mb-8">
          <h2 class="text-2xl font-bold">SHORT STORIES</h2>
        </div>
        <div class="space-y-4">
          <ShortsCard
            v-for="story in homepageSections.shorts"
            :key="story.slug"
            :work="story"
            :link="`/short-stories/${story.slug}`"
          />
        </div>
        <div class="flex flex-col justify-center items-center my-8">
          <p class="block explicit:hidden text-center" >
            Explicit content is hidden. Toggle the eye icon in navigation bar at the top to show.
            <NuxtLink to="/about" class="text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 font-bold">Click here to learn more</NuxtLink>
          </p>
          <p class="text-center" >Homepage contains limited number of works, full list is on Short Stories page</p>
          <NuxtLink v-if="novelsRaw?.length > 2" to="/short-stories" class="text-darkaccent dark:text-accent hover:text-accent font-bold hover:underline">See More Short Stories</NuxtLink>
        </div>
      </section>
    </div>
    
    <!-- About Section -->
    <section className='flex flex-col-reverse sm:flex-row justify-between topo px-5 py-10 gap-5'>
      <article className='bg-gray-50 dark:bg-dark2 px-10 py-14 rounded w-full sm:w-1/2'>
        <div className="flex justify-between items-baseline mb-4">
          <NuxtLink to="/news" className="rounded px-1.5 text-darkaccent dark:text-accent hover:text-accent hover:underline">
            <h2 className="text-xl  font-bold">About</h2>
          </NuxtLink>
        </div>
        <div className="flex flex-col gap-4 justify-between space-y-4">
          <p>
          Welcome to my website! I'm DaoistGreenOnion. This is where I share my stories, novels, and worlds with you. 
        </p>
        <p>
          I built this site to share stories, not to collect data. There are no ads, no analytics, and no tracking of any kind. The only thing your browser remembers is your preferences (light or dark theme, explicit content, etc.) so the site looks the way you like it every time you open it.
        </p>
        <p>
          When making the site, I tried to include a few simple features that I believe to be helpful for good reading experience, I will include detailed explanation for them, as well as some other relevant or perhaps interesting information about the site on the <NuxtLink :to="`/about`" class="text-brand dark:text-brand-light hover:text-brand-light dark:hover:text-brand-lightest hover:underline" >About Page</NuxtLink>. You can treat the page as an instruction manual for the site.
        </p>
        </div>
      </article>
      <article className='bg-gray-50 dark:bg-dark2 p-3 py-6 rounded w-full sm:w-1/2'>
        <div className="flex justify-between items-baseline mb-4">
          <NuxtLink to="/news" className="rounded px-1.5 text-darkaccent dark:text-accent hover:text-accent hover:underline">
            <h2 className="text-xl font-bold">Latest News</h2>
          </NuxtLink>
        </div>
        <div className="space-y-4">
          <NuxtLink
            v-for="item in homepageSections.news"
            :key="item.slug"
            :to="`/news/${item.slug}`"
            class="block  rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-dark3 hover:shadow-lg dark:hover:shadow-dark4 dark:hover:shadow-[0_0_40px_2px] transition-shadow"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ item.title }}</h3>
              <time
                :datetime="item.date"
                class="text-xs text-gray-500 dark:text-gray-400 shrink-0"
              >
                {{ new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </time>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{{ item.summary }}</p>
          </NuxtLink>
        </div>
      </article>
    </section>

  </main>
</template>

<script setup>

definePageMeta({
  layout: 'home',
})

// ---- Fetch all data from API endpoints ----
const { data: novelsRaw }   = await useFetch('/api/novels')
const { data: anthologiesRaw } = await useFetch('/api/anthologies')
const { data: shortsRaw }   = await useFetch('/api/shorts')
const { data: newsRaw }     = await useFetch('/api/news')

// ---- Single computed property: slice everything here ----
const homepageSections = computed(() => ({
  novels: (novelsRaw.value ?? [])
    .filter(n => explicitPreference.value === 'expanded' || !n.explicit)
    .sort((a, b) => (a.date ? new Date(a.date).getTime() : 0) - (b.date ? new Date(b.date).getTime() : 0)).slice(0, 3),
  anthologies: (anthologiesRaw.value ?? [])
    .filter(a => explicitPreference.value === 'expanded' || !a.explicit)
    .slice(0, 3),
  shorts: (shortsRaw.value ?? [])
    .filter(s => explicitPreference.value === 'expanded' || !s.explicit)
    .sort((a, b) => (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0)).slice(0, 3),
  news: (newsRaw.value ?? []).slice(0, 5),
}))
</script>