import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ChapterMeta {
  slug: string
  title: string
  loreChapter?: string   // the slug of the chapter that unlocks this lore
}

export type WorkType = 'long-novel' | 'short-novel' | 'anthology' | 'short-story'

export interface NovelMeta {
  slug: string
  title: string
  status?: string
  synopsis: string
  cover?: string
  maintags?: string[]
  tags?: string[]
  chapters: ChapterMeta[]
  externalLink?: string
  type: WorkType
  lore?: ChapterMeta[]
  date?: string
  explicit?: boolean
  // loreChapter?: string   // the slug of the chapter that unlocks this lore
}

export interface AnthologyStory {
  slug: string
  title: string
  synopsis: string
  parts: ChapterMeta[]
  isSingleFile: boolean
}

// ---- directory paths ----
const contentRoot = path.join(process.cwd(), 'content')
const longNovelsDir = path.join(contentRoot, 'novels', 'long-novels')
const shortNovelsDir = path.join(contentRoot, 'novels', 'short-novels')
const anthologiesDir = path.join(contentRoot, 'anthologies')
const shortStoriesDir = path.join(contentRoot, 'short-stories')
const newsDir = path.join(contentRoot, 'news')

// ---- generic helpers ----
function getAllWorks(directory: string, type: WorkType): NovelMeta[] {
  if (!fs.existsSync(directory)) return []
  const entries = fs.readdirSync(directory, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
  return entries
    .map(slug => getWorkBySlug(directory, slug, type))
    .filter((w): w is NovelMeta => w !== null)
}

function getWorkBySlug(directory: string, slug: string, type: WorkType): NovelMeta | null {
  const workDir = path.join(directory, slug)
  if (!fs.existsSync(workDir)) return null
  const metaPath = path.join(workDir, 'meta.md')
  if (!fs.existsSync(metaPath)) return null
  const fileContent = fs.readFileSync(metaPath, 'utf8')
  const { data } = matter(fileContent)

  const chapterFiles = fs.readdirSync(workDir)
    .filter(f => f.endsWith('.md') && f !== 'meta.md' && f !== 'chapters.md')
    .sort()



  let chapters: ChapterMeta[] = chapterFiles.map(file => {
    const chapPath = path.join(workDir, file)
    const chapContent = fs.readFileSync(chapPath, 'utf8')
    const { data: chapData } = matter(chapContent)
    return {
      slug: file.replace(/\.md$/, ''),
      title: chapData.title || file.replace(/\.md$/, ''),
    }
  })

  // If no chapter files were found, look for chapters.md (used for external‑link novels)
  if (chapters.length === 0) {
    const chaptersMetaPath = path.join(workDir, 'chapters.md')
    if (fs.existsSync(chaptersMetaPath)) {
      const rawList = fs.readFileSync(chaptersMetaPath, 'utf8')
      const lines = rawList.split(/\r?\n/)
      const chapterItems: ChapterMeta[] = []

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        // Match a leading number, optionally followed by a title
        const match = trimmed.match(/^(\d+)(?:\s+(.*))?$/)
        if (match) {
          const slug = match[1] || ""   // e.g. "1", "345"
          const title = match[2]?.trim() || `Chapter ${slug}`
          chapterItems.push({ slug, title })
        }
      }

      if (chapterItems.length > 0) {
        chapters = chapterItems
      }
    }
  }

  

  // lore
  const loreDir = path.join(workDir, 'lore')
  let lore: ChapterMeta[] = []
  if (fs.existsSync(loreDir)) {
    lore = fs.readdirSync(loreDir)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        const lorePath = path.join(loreDir, f)
        const loreContent = fs.readFileSync(lorePath, 'utf8')
        const { data: lData } = matter(loreContent)
        return {
          slug: f.replace(/\.md$/, ''),
          title: lData.title || f.replace(/\.md$/, ''),
          loreChapter: lData.chapter || undefined,   // ← new field
        }
      })
  }

  console.log('lore_order from meta:', data.lore_order)
  console.log('lore slugs before sort:', lore.map(e => e.slug))

  // Apply custom lore order if provided in meta.md
  if (data.lore_order && Array.isArray(data.lore_order)) {
    const orderMap = new Map<string, number>()
    data.lore_order.forEach((slug: string, index: number) => {
      orderMap.set(slug, index)
    })

    lore.sort((a, b) => {
      const orderA = orderMap.has(a.slug) ? orderMap.get(a.slug)! : Infinity
      const orderB = orderMap.has(b.slug) ? orderMap.get(b.slug)! : Infinity
      return orderA - orderB
    })
  }

  console.log('lore_order from meta:', data.lore_order)
  console.log('lore slugs after sort:', lore.map(e => e.slug))

  return {
    slug,
    title: data.title,
    status: data.status,
    synopsis: data.synopsis,
    cover: data.cover || null,
    maintags: data.maintags || [],
    tags: data.tags || [],
    chapters,
    externalLink: data.externalLink || null,
    type,
    lore: lore.length ? lore : undefined,
    explicit: data.explicit ?? false,
    date: data.date || null,
  }
}

export function getChapterContent(directory: string, workSlug: string, chapterSlug: string) {
  const chapterPath = path.join(directory, workSlug, `${chapterSlug}.md`)
  if (!fs.existsSync(chapterPath)) return null
  const fileContent = fs.readFileSync(chapterPath, 'utf8')
  const { data, content } = matter(fileContent)
  return { title: data.title || chapterSlug, content }
}

// ---- novels (long + short) ----
export function getAllNovels(): NovelMeta[] {
  return [
    ...getAllWorks(longNovelsDir, 'long-novel'),
    ...getAllWorks(shortNovelsDir, 'short-novel'),
  ]
}

export function getNovelBySlug(slug: string): NovelMeta | null {
  return getWorkBySlug(longNovelsDir, slug, 'long-novel') ??
         getWorkBySlug(shortNovelsDir, slug, 'short-novel')
}

export function getNovelChapterContent(novelSlug: string, chapterSlug: string) {
  const novel = getNovelBySlug(novelSlug)
  if (!novel) return null
  const dir = novel.type === 'long-novel' ? longNovelsDir : shortNovelsDir
  return getChapterContent(dir, novelSlug, chapterSlug)
}

// ---- anthologies ----
export function getAllAnthologies(): NovelMeta[] {
  return getAllWorks(anthologiesDir, 'anthology')
}

export function getAnthologyBySlug(slug: string): NovelMeta | null {
  return getWorkBySlug(anthologiesDir, slug, 'anthology')
}

export function getAnthologyStories(anthologySlug: string): AnthologyStory[] {
  const anthDir = path.join(anthologiesDir, anthologySlug)
  if (!fs.existsSync(anthDir)) return []

  const storyFolders = fs.readdirSync(anthDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'lore')
    .map(d => d.name)

  return storyFolders.map(folder => {
    const storyDir = path.join(anthDir, folder)
    const storyMd = path.join(storyDir, 'story.md')
    const metaMd = path.join(storyDir, 'meta.md')

    if (fs.existsSync(storyMd)) {
      const raw = fs.readFileSync(storyMd, 'utf8')
      const { data } = matter(raw)
      return {
        slug: folder,
        title: data.title || folder,
        synopsis: data.synopsis || '',
        parts: [],
        isSingleFile: true,
        explicit: data.explicit ?? false,
        date: data.date || null,
      }
    }

    if (fs.existsSync(metaMd)) {
      const raw = fs.readFileSync(metaMd, 'utf8')
      const { data } = matter(raw)
      const chapterFiles = fs.readdirSync(storyDir)
        .filter(f => f.endsWith('.md') && f !== 'meta.md')
        .sort()
      const parts = chapterFiles.map(f => {
        const partPath = path.join(storyDir, f)
        const partRaw = fs.readFileSync(partPath, 'utf8')
        const { data: pData } = matter(partRaw)
        return {
          slug: f.replace(/\.md$/, ''),
          title: pData.title || f.replace(/\.md$/, ''),
        }
      })
      return {
        slug: folder,
        title: data.title || folder,
        synopsis: data.synopsis || '',
        parts,
        isSingleFile: false,
        explicit: data.explicit ?? false,
        date: data.date || null,
      }
    }

    return null
  }).filter(Boolean) as AnthologyStory[]
}

export function getAnthologyStoryContent(anthSlug: string, storySlug: string) {
  const storyPath = path.join(anthologiesDir, anthSlug, storySlug, 'story.md')
  if (!fs.existsSync(storyPath)) return null
  const raw = fs.readFileSync(storyPath, 'utf8')
  const { data, content } = matter(raw)
  return { title: data.title || storySlug, content }
}

export function getAnthologyPartContent(anthSlug: string, storySlug: string, partSlug: string) {
  const partPath = path.join(anthologiesDir, anthSlug, storySlug, `${partSlug}.md`)
  if (!fs.existsSync(partPath)) return null
  const raw = fs.readFileSync(partPath, 'utf8')
  const { data, content } = matter(raw)
  return { title: data.title || partSlug, content }
}

// ---- short stories (one-shots) ----
export function getAllShortStories(): NovelMeta[] {
  if (!fs.existsSync(shortStoriesDir)) return []
  const files = fs.readdirSync(shortStoriesDir).filter(f => f.endsWith('.md'))
  return files.map(f => {
    const slug = f.replace(/\.md$/, '')
    const filePath = path.join(shortStoriesDir, f)
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(raw)
    return {
      slug,
      title: data.title,
      synopsis: data.synopsis,
      cover: data.cover || null,
      maintags: data.maintags || [],
      tags: data.tags || [],
      chapters: [],
      externalLink: data.externalLink || null,
      type: 'short-story' as const,
      date: data.date || null,
      explicit: data.explicit ?? false,
    }
  })
}

export function getShortStoryContent(slug: string) {
  const filePath = path.join(shortStoriesDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { title: data.title, content }
}

// ---- news ----
export interface NewsItem {
  slug: string
  title: string
  date: string
  summary: string
  content: string
}

export function getAllNews(): NewsItem[] {
  if (!fs.existsSync(newsDir)) return []
  const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.md'))
  return files
    .map(f => {
      const slug = f.replace(/\.md$/, '')
      const filePath = path.join(newsDir, f)
      const raw = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        summary: data.summary || content.slice(0, 150).replace(/\n/g, ' ') + '…',
        content,
      }
    })
    .filter(item => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const filePath = path.join(newsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    summary: data.summary || content.slice(0, 150).replace(/\n/g, ' ') + '…',
    content,
  }
}

// ---- lore ----
export function getLoreContent(workDir: string, loreSlug: string) {
  const lorePath = path.join(workDir, 'lore', `${loreSlug}.md`)
  if (!fs.existsSync(lorePath)) return null
  const fileContent = fs.readFileSync(lorePath, 'utf8')
  const { data, content } = matter(fileContent)
  return { title: data.title || loreSlug, content }
}

export function getLoreContentBySlug(workDir: string, loreSlug: string): string | null {
  const lorePath = path.join(workDir, 'lore', `${loreSlug}.md`)
  if (!fs.existsSync(lorePath)) return null
  const raw = fs.readFileSync(lorePath, 'utf8')
  const { content } = matter(raw)
  return content
}