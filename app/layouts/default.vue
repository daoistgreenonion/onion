<template>
  <main>
    <Navbar />
    <div class="pt-16"></div>
    <Breadcrumbs /> 
    <main class="min-h-screen">
      <slot />
    </main>
    <Footer />
  </main>
</template>