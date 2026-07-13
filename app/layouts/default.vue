<template>
  <main>
    <Navbar />
    <div class="pt-20 sm:pt-16"></div>
    <Breadcrumbs /> 
    <main class="min-h-screen">
      <slot />
    </main>
    <Footer />
  </main>
</template>