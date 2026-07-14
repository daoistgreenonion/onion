<template>
  <Navbar :readingPage="true" :lorePage="true"  />
  <div class="h-8 block"></div>
  <Breadcrumbs :lorePage="true" />
  <main>
    <slot />
  </main>
</template>