<template>
  <main class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
      Terms of Service
    </h1>

    <div class="prose prose-gray dark:prose-invert max-w-none space-y-6">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Last updated: {{ today }}
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using this website (“the Site”), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the Site.
      </p>

      <h2>2. Adult Content Disclaimer</h2>
      <p>
        Some Content on the Site may contain explicit language, themes of violence, sexual situations, or other material intended for mature audiences only. By continuing to use the Site, you confirm that you are at least 18 years of age (or the legal age of majority in your jurisdiction) and that you wish to view such content.
      </p>
      <p>
        If you are under the legal age of majority, you must immediately discontinue use of the Site. The Author is not responsible for any exposure to mature content by minors. Reader discretion is strongly advised.
      </p>

      <h2>3. Intellectual Property & Content Ownership</h2>
      <p>
        Unless otherwise noted, all content published on this Site, including but not limited to novels, short stories, anthologies, lore articles, original images, and other creative works (“Content”), is the sole intellectual property of the author(s) (“the Author”). The Author retains all rights, title, and interest in and to the Content. Third‑party materials (including third‑party images) are excluded from “Content.”
      </p>
      <p>
        Some images displayed on the Site (for example, in‑chapter illustrations) may be obtained from third‑party sources and used solely to illustrate and enhance the Site’s original content. These images are used for non‑commercial purposes, and any third‑party images remain subject to the applicable licences and terms of the respective rights holders/platforms for the individual image. Where practicable, credit/attribution is provided via a link to the original source. The Author does not claim ownership of any third‑party images, and they are used in good faith. If you believe any image is used in a way that constitutes infringement or otherwise violates your rights, please contact the Author via the Discord Server so the matter can be promptly reviewed and resolved.
      </p>

      <p>
        Nothing in these Terms shall be interpreted as transferring any intellectual property rights to you or any third party. You are granted a limited, non-exclusive, non-transferable, revocable licence to access and enjoy the Content for personal, non-commercial purposes only.
      </p>

      <h2>4. Permitted Use</h2>
      <p>
        You may:
      </p>
      <ul>
        <li>Read and enjoy the Content for your personal entertainment.</li>
        <li>Download or save a copy of the Content (original works of the Author) to your personal device, strictly for your own offline, non‑commercial reading convenience.</li>
        <li>Share direct links to the Site or specific pages via social media or personal communication, provided you do not imply endorsement.</li>
      </ul>

      <h2>5. Prohibited Activities</h2>
      <p>
        You agree not to:
      </p>
      <ul>
        <li>Reproduce, distribute, publicly display, or transmit any Content (beyond the personal downloads permitted above) without the Author’s prior written consent.</li>
        <li>Use the Content for commercial purposes, including but not limited to selling, licensing, or incorporating it into paid products or services.</li>
        <li>Modify, adapt, translate, or create derivative works from the Content.</li>
        <li>Use the Content, in whole or in part, for training, fine‑tuning, or otherwise developing artificial intelligence models, machine learning algorithms, or any other automated systems, whether commercial or non‑commercial.</li>
        <li>
          Use any automated means (scraping, bots, data mining, or similar methods) to access, extract, or archive the Content, <strong>except</strong> that non‑commercial archival services (such as the Internet Archive’s Wayback Machine) may crawl and index the Site for the sole purpose of preservation and documentation, provided they do not engage in AI training, commercial exploitation, or redistribution of the Content beyond archived snapshots.
        </li>
        <li>
          <strong>Aggregator and piracy websites:</strong> You may not operate, contribute to, or support any website, service, or platform that automatically collects, republishes, or hosts the Content (or substantial portions of it) without the Author’s express permission. This includes, but is not limited to, pirate sites, content farms, and so‑called “aggregator” sites that scrape stories to display them as part of their own collection, whether for profit or not.
        </li>
        <li>Misrepresent your affiliation with the Author or the Site.</li>
        <li>Engage in any activity that disrupts or interferes with the Site’s functionality.</li>
      </ul>

      <h2>6. Donations & Support</h2>
      <p>
        The Site may offer voluntary support options (e.g., Ko‑fi). Any contributions are donations and do not grant the donor any rights over the Content, the Site, or the Author. Donations are non‑refundable unless otherwise required by law.
      </p>

      <h2>7. Third‑Party Links</h2>
      <p>
        The Site may contain links to third‑party websites (e.g., Discord, Ko‑fi). The Author is not responsible for the content, accuracy, or practices of these external sites. Your use of third‑party services is at your own risk and subject to their respective terms.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Site and its Content are provided “as is” without any warranties, express or implied. The Author does not guarantee that the Site will be uninterrupted, error‑free, or free of harmful components. You use the Site at your own risk.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, the Author shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Site or its Content, even if advised of the possibility of such damages.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the Author from any claims, losses, or damages arising from your violation of these Terms or misuse of the Site.
      </p>

      <h2>11. Changes to the Terms</h2>
      <p>
        The Author reserves the right to update these Terms at any time. Changes will be posted on this page with an updated “Last updated” date. Continued use of the Site after changes constitutes acceptance of the revised Terms.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Author is domiciled, without regard to its conflict of law provisions. Any disputes shall be brought in the competent courts of that jurisdiction.
      </p>
    </div>
  </main>
</template>

<script setup>
const today = new Date().toISOString().slice(0, 10)
</script>