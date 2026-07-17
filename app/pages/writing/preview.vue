<template>
  <div class="h-max overflow-y-auto p-6 mx-auto max-w-3xl">
    <p v-if="wordCount" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
      {{ wordCount.toLocaleString() }} words · ~{{ readingTime }} min read
    </p>
    <div v-if="content || title" class="prose prose-lg dark:prose-invert max-w-none">
      <h1 v-if="title" class="text-4xl font-bold mb-10 drop-cap">{{ title }}</h1>
      <MarkdownRenderer v-if="content" :content="content" :collapse="true"/>
    </div>
    <div v-else class="text-gray-400 dark:text-gray-600 italic mt-8 text-center">
      Waiting for content from the editor…
    </div>
  </div>
</template>

<script setup>
const title = ref('')
const content = ref('')
const wordCount = ref('')
const readingTime = ref('')


const contentParts = computed((content) => {
  const parts = []
  const placeholderRegex = /<!--\s*explicit-placeholder-explicit-(\d+)\s*-->/g
  let lastIndex = 0
  let match

  while ((match = placeholderRegex.exec(content)) !== null) {
    // Add markdown before placeholder
    if (match.index > lastIndex) {
      parts.push({ type: 'markdown', html: md.render(content.slice(lastIndex, match.index)) })
    }

    // Add explicit section
    const id = parseInt(match[1])
    const section = props.explicitSections[id]
    if (section) {
      parts.push({ type: 'explicit', title: "Title", html: section.html })
    }
    lastIndex = match.index + match[0].length
  }
  
  // Remaining markdown
  if (lastIndex < content.length) {
    parts.push({ type: 'markdown', html: md.render(content.slice(lastIndex)) })
  }
  
  return parts
})

onMounted(() => {
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'update-content') {
      title.value = event.data.title || ''
      content.value = event.data.body || ''

      const text = typeof event.data.body === 'string' ? event.data.body : String(event.data.body ?? '')
      console.log('body:', event.data.body, 'typeof:', typeof event.data.body)

      const words = text.trim().split(/\s+/).filter(Boolean).length

      wordCount.value = words
      readingTime.value = Math.max(1, Math.ceil(words / 200))
      console.log(wordCount)
    }

  })
})
</script>