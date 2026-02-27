<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { marked } from 'marked'
import manifest from '@/content/reports/manifest.js'
import { addMemeticFragment } from '@/utils/clipboardStore'

const route = useRoute()
const slug = computed(() => route.params.slug)
const reportMeta = ref(null)
const reportHtml = ref('')
const loadError = ref(false)
const hasMemeticTask = ref(false)

const reportModules = import.meta.glob('../content/reports/*.md', { query: '?raw', import: 'default' })

function checkMemeticTask() {
  const claimed = JSON.parse(sessionStorage.getItem('ue-stc-claimed-tasks') || '[]')
  hasMemeticTask.value = claimed.some(t => t.type === '模因污染清洗任务' && t.status !== '已完成')
}

const ARTICLES = [
  {
    title: '第十六届华语科幻星云奖青少年征文大赛（大学组）颁奖典礼举行',
    slug: '2025-star-cloud-ceremony'
  },
  {
    title: '外国语学院举办 2025 成都科幻城市与文学高端论坛',
    slug: '2025-sci-fi-city-forum'
  },
  {
    title: '电子科技大学科幻协会获第 35 届银河奖最佳科幻团体奖',
    slug: '2024-galaxy-award'
  },
  {
    title: '《沙丘 2》成都高校联合观影活动举行',
    slug: '2024-dune2-joint-screening'
  },
  {
    title: '电子科技大学科幻协会参与第 81 届世界科幻大会交流活动',
    slug: '2023-worldcon-association-participation'
  },
  {
    title: '《奥本海默》成都高校联合观影活动举行',
    slug: '2023-oppenheimer-joint-screening'
  },
  {
    title: '学校开展首届“成电 97 文学奖”科幻小说创作营',
    slug: '2023-sci-fi-creative-writing'
  },
  {
    title: '《流浪地球 2》成都高校告别包场观影活动举行',
    slug: '2023-wandering-earth-2-farewell'
  },
  {
    title: '学校联合《科幻世界》主办首届科幻写作训练营',
    slug: '2022-sci-fi-writing-camp'
  }
]

const MEMETIC_TARGET_STORAGE = 'ue-stc-memetic-target'
const isTargetArticle = computed(() => {
  if (!hasMemeticTask.value) return false
  const targetIndexStr = sessionStorage.getItem(MEMETIC_TARGET_STORAGE)
  if (!targetIndexStr) return false
  const targetSlug = ARTICLES[parseInt(targetIndexStr)]?.slug
  return slug.value === targetSlug
})

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

onMounted(() => {
  loadReport()
  checkMemeticTask()
})

function handleArticleInteraction(e) {
  if (!isTargetArticle.value) return
  const target = e.target
  if (target.classList.contains('invisible-ink')) {
    const code = target.getAttribute('data-code')
    const label = target.getAttribute('title') || '未知残影'
    if (code) {
      addMemeticFragment(code, label)
    }
  } else if (target.classList.contains('trigger-word')) {
    const code = target.getAttribute('data-code')
    const label = `变异词汇[${target.getAttribute('data-word') || target.textContent}]`
    if (code) {
      addMemeticFragment(code, label)
    }
  }
}
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
      <div class="report-body prose" :class="{ 'memetic-active': isTargetArticle }" v-html="reportHtml" @click="handleArticleInteraction"></div>
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

/* 模因污染玩法样式 - 只有当包含 memetic-active 类时才生效 */
.report-body:not(.memetic-active) :deep(.invisible-ink) {
  display: none;
}

.report-body:not(.memetic-active) :deep(.trigger-word) {
  cursor: auto;
  border-bottom: none;
}

.report-body.memetic-active :deep(.invisible-ink) {
  color: var(--color-bg); /* 与背景色相同，使其不可见 */
  background-color: var(--color-bg);
  cursor: pointer;
  user-select: all;
}
.report-body.memetic-active :deep(.invisible-ink::selection) {
  background-color: #333;
  color: #ff0000;
  text-shadow: 0 0 5px #ff0000;
}

.report-body.memetic-active :deep(.trigger-word) {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-bottom: 1px dotted var(--color-text-mute);
  transition: all 0.3s;
}

.report-body.memetic-active :deep(.trigger-word:hover) {
  color: #0f0;
  text-shadow: 0 0 8px #0f0;
  animation: glitch 0.3s infinite;
  border-bottom-color: transparent;
}

@keyframes glitch {
  0% { transform: translate(0) skew(0deg); }
  20% { transform: translate(-2px, 1px) skew(-5deg); }
  40% { transform: translate(2px, -1px) skew(5deg); }
  60% { transform: translate(-1px, 2px) skew(-2deg); }
  80% { transform: translate(1px, -2px) skew(2deg); }
  100% { transform: translate(0) skew(0deg); }
}
</style>
