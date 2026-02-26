<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { marked } from 'marked'
import manifest from '@/content/reports/manifest.js'

const route = useRoute()
const slug = computed(() => route.params.slug)
const reportMeta = ref(null)
const reportHtml = ref('')
const loadError = ref(false)

const reportModules = import.meta.glob('../content/reports/*.md', { query: '?raw', import: 'default' })

async function loadReport() {
  const s = slug.value
  const meta = manifest.find((r) => r.slug === s)
  if (!meta) {
    loadError.value = true
    return
  }
  reportMeta.value = meta
  const key = Object.keys(reportModules).find((k) => k.endsWith(`${s}.md`))
  if (!key) {
    loadError.value = true
    return
  }
  try {
    const raw = await reportModules[key]()
    reportHtml.value = marked.parse(raw)
  } catch {
    loadError.value = true
  }
}

onMounted(loadReport)
</script>

<template>
  <div class="activity-report page">
    <p class="back">
      <RouterLink to="/activities">← 返回活动</RouterLink>
    </p>
    <template v-if="loadError || (!reportMeta && !reportHtml)">
      <p v-if="loadError" class="error">报道不存在或无法加载。</p>
    </template>
    <template v-else>
      <header class="report-header">
        <h1 class="report-title">{{ reportMeta?.title }}</h1>
        <p class="report-meta">{{ reportMeta?.date }}</p>
      </header>
      <div class="report-body prose" v-html="reportHtml"></div>
    </template>
  </div>
</template>

<style scoped>
.activity-report.page {
  max-width: 640px;
}

.back {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.back a {
  color: var(--color-text-mute);
}

.back a:hover {
  color: var(--color-accent);
}

.error {
  color: var(--color-text-mute);
}

.report-header {
  margin-bottom: 1.5rem;
}

.report-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
  line-height: 1.3;
}

.report-meta {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  margin: 0;
}

.report-body {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--color-text);
}

.report-body :deep(p) {
  margin-bottom: 1rem;
}

.report-body :deep(strong) {
  font-weight: 600;
}

.report-body :deep(h2) {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem;
}

.report-body :deep(ul) {
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}

.report-body :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1rem auto;
  border: 1px solid var(--color-border);
}
</style>
