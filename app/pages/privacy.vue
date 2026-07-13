<template>
  <main class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
      Privacy Policy
    </h1>

    <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Last updated: {{ today }}
      </p>

      <h2>1. Our Commitment to Privacy</h2>
      <p>
        Your privacy is important. This site is designed to share stories without
        collecting, storing, or selling any personal information. This policy
        explains what little data might be involved simply by visiting the site.
      </p>

      <h2>2. Information We Do NOT Collect</h2>
      <p>
        We do not use analytics, tracking scripts, or advertising/personalization services.
        We do not collect personal information such as your name or email address, and we do not intentionally collect browsing history.
        However, like most websites, independent of the site owner (Author), the hosting and technical services that deliver the Site may process basic technical data (for example, IP addresses and request logs) to operate, secure, and provide the Site.
      </p>


      <h2>3. Local Storage – Theme Preference</h2>
      <p>
        The site offers a light/dark theme toggle. Your choice is stored locally in your browser’s <strong>localStorage</strong> and is not transmitted to any server as part of the theme setting. This is purely for convenience so your preference is remembered across visits. You can clear this data at any time via your browser’s settings.
      </p>


      <h2>4. Cookies</h2>
      <p>
        We do not set cookies for tracking, advertising, or profiling.
        You may still receive cookies from third-party services involved in hosting, security, or content delivery (e.g., Cloudflare or other infrastructure providers). Those cookies are controlled by the respective third parties, and you should review their privacy/cookie policies if you want more detail.
      </p>


      <h2>5. Third‑Party Links</h2>
      <p>
        The Site may contain links to third-party websites (e.g., Ko‑fi, Discord). Those services have their own privacy policies and may collect data according to their terms.
        In addition, the Site may use third-party infrastructure services (such as hosting and content delivery/security providers) to operate and secure the Site. Those providers may collect technical data necessary to provide the service. We are not responsible for their practices.
      </p>


      <h2>6. Children’s Privacy</h2>
      <p>
        This site does not knowingly collect any information from children.
        All content is intended for general audiences and does not involve
        any registration or submission of personal data.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated date. Your continued use of the Site
        after changes indicates your acceptance of the revised policy.
      </p>
    </div>
  </main>
</template>

<script setup>
const today = new Date().toISOString().slice(0, 10)
</script>