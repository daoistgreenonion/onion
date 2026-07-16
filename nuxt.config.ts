// https://nuxt.com/docs/api/configuration/nuxt-config
import fs, { link } from 'node:fs'
import path from 'node:path'

// // Helper: get slugs from a directory of folders (each with meta.md)
// function getWorkSlugs(dir: string): string[] {
//   if (!fs.existsSync(dir)) return []
//   return fs.readdirSync(dir, { withFileTypes: true })
//     .filter(d => d.isDirectory())
//     .map(d => d.name)
// }

// // Helper: get all chapter slugs for a given work directory
// function getChapterSlugs(workDir: string): string[] {
//   const chaptersFolder = path.join(workDir, 'chapters')
//   const dir = fs.existsSync(chaptersFolder) ? chaptersFolder : workDir
//   if (!fs.existsSync(dir)) return []
//   return fs.readdirSync(dir)
//     .filter(f => f.endsWith('.md') && f !== 'meta.md')
//     .map(f => f.replace(/\.md$/, ''))
// }

// // Helper: get lore slugs
// function getLoreSlugs(workDir: string): string[] {
//   const loreDir = path.join(workDir, 'lore')
//   if (!fs.existsSync(loreDir)) return []
//   return fs.readdirSync(loreDir)
//     .filter(f => f.endsWith('.md'))
//     .map(f => f.replace(/\.md$/, ''))
// }

export default defineNuxtConfig({
  // Remove the compatibilityDate line – it's not needed and causes type issues
  devtools: { enabled: true },
  debug: true,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  tailwindcss: {
    config: {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            'dark': '#061015',
            'dark2': '#0B1D26',
            'dark3': '#12222D',
            'dark4': '#132424',
            'accent': '#FBD784',
            'darkaccent': '#D7B86F',
            'brand': '#708122',
            'brand-light': '#B4CD43',
            'brand-lightest': '#CFDF86',
            'brand-glowing': '#CDE77F',
          },
        },
      },
      plugins: [
        ({ addVariant }: { addVariant: (name: string, selector: string) => void }) => {
          addVariant('explicit', ':where(.explicit) &')
        },
        require('@tailwindcss/typography'),
      ],
    },
  },
  alias: {
    '~utils': './utils',
  },
  routeRules: {
    '/embed-lore/**': {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
      },
    },
  },

  // nitro: {
  //   prerender: {
  //     routes: (() => {
  //       const contentRoot = path.resolve(process.cwd(), 'content')
  //       const routes: string[] = []

  //       // --- Novels ---
  //       const novelDirs = [
  //         path.join(contentRoot, 'novels', 'long-novels'),
  //         path.join(contentRoot, 'novels', 'short-novels'),
  //       ]
  //       for (const dir of novelDirs) {
  //         for (const slug of getWorkSlugs(dir)) {
  //           const workDir = path.join(dir, slug)
  //           routes.push(`/novels/${slug}`)
  //           for (const chSlug of getChapterSlugs(workDir)) {
  //             routes.push(`/novels/${slug}/${chSlug}`)
  //           }
  //           for (const loreSlug of getLoreSlugs(workDir)) {
  //             routes.push(`/embed-lore/novels/${slug}/${loreSlug}`)
  //           }
  //         }
  //       }

  //       // --- Anthologies ---
  //       const anthDir = path.join(contentRoot, 'anthologies')
  //       for (const slug of getWorkSlugs(anthDir)) {
  //         const workDir = path.join(anthDir, slug)
  //         routes.push(`/anthologies/${slug}`)
  //         const storiesDir = workDir
  //         const stories = fs.readdirSync(storiesDir, { withFileTypes: true })
  //           .filter((d) => d.isDirectory() && d.name !== 'lore')
  //           .map((d) => d.name)
  //         for (const storySlug of stories) {
  //           routes.push(`/anthologies/${slug}/${storySlug}`)
  //           const partDir = path.join(storiesDir, storySlug)
  //           for (const partSlug of getChapterSlugs(partDir)) {
  //             routes.push(`/anthologies/${slug}/${storySlug}/${partSlug}`)
  //           }
  //         }
  //         for (const loreSlug of getLoreSlugs(workDir)) {
  //           routes.push(`/embed-lore/anthologies/${slug}/${loreSlug}`)
  //         }
  //       }

  //       // --- Short stories ---
  //       const shortsDir = path.join(contentRoot, 'short-stories')
  //       if (fs.existsSync(shortsDir)) {
  //         for (const file of fs.readdirSync(shortsDir).filter((f) => f.endsWith('.md'))) {
  //           const slug = file.replace(/\.md$/, '')
  //           routes.push(`/short-stories/${slug}`)
  //         }
  //       }

  //       // --- News ---
  //       const newsDir = path.join(contentRoot, 'news')
  //       if (fs.existsSync(newsDir)) {
  //         for (const file of fs.readdirSync(newsDir).filter((f) => f.endsWith('.md'))) {
  //           const slug = file.replace(/\.md$/, '')
  //           routes.push(`/news/${slug}`)
  //         }
  //       }

  //       return routes
  //     })(), // <-- immediately call the function
  //   },
  // },


  app: {
    head: {
      script: [
        {
          innerHTML: `(function() {
            try {
              const theme = localStorage.getItem('theme')
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
              } else {
                document.documentElement.classList.remove('dark')
              }
            } catch(e) {}
          })()`,
          // Run immediately, not deferred
          type: 'text/javascript',
        },
      ],
    },
  },
})