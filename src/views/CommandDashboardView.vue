<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const AUTH_STORAGE = 'ue-stc-auth'
const AVAILABLE_TASKS_STORAGE = 'ue-stc-available-tasks'
const CLAIMED_TASKS_STORAGE = 'ue-stc-claimed-tasks'

let clockTimer = null
let actionTimer = null
onMounted(() => {
  if (!sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc')
  }
})

function logout() {
  sessionStorage.removeItem(AUTH_STORAGE)
  router.replace('/ue-stc')
}

const status = ref('NOMINAL')
const time = ref('--:--:--')
const actionPreview = ref([])
const actionStats = ref({ available: 0, claimed: 0, inProgress: 0 })

function tick() {
  const d = new Date()
  time.value = d.toTimeString().slice(0, 8)
}

function readActionData() {
  const available = JSON.parse(sessionStorage.getItem(AVAILABLE_TASKS_STORAGE) || '[]')
  const claimed = JSON.parse(sessionStorage.getItem(CLAIMED_TASKS_STORAGE) || '[]')
  actionStats.value = {
    available: available.length,
    claimed: claimed.length,
    inProgress: claimed.filter((t) => t.status === '进行中').length,
  }
  actionPreview.value = [...available.slice(0, 2), ...claimed.filter((t) => t.status !== '已完成').slice(0, 2)]
}

onMounted(() => {
  tick()
  readActionData()
  clockTimer = setInterval(tick, 1000)
  actionTimer = setInterval(readActionData, 3000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
  if (actionTimer) clearInterval(actionTimer)
})

// 各战区巡逻覆盖率（首页简图，详情见情报页）
const coverageByTheater = [
  { name: '西南', pct: 75 },
  { name: '华北', pct: 65 },
  { name: '华东', pct: 85 },
  { name: '华南', pct: 38 },
]
</script>

<template>
  <div class="command-dash">
    <CommandHeader logo="UE-STC">
      <template #right>
        <span>{{ time }}</span>
        <RouterLink to="/">协会页面</RouterLink>
        <button type="button" @click="logout">断开</button>
      </template>
    </CommandHeader>
    <main class="dash-main">
      <section class="dash-section">
        <h2>系统状态</h2>
        <p class="status-line">主链路: <span class="status-value">{{ status }}</span></p>
        <p class="status-line">伪装界面: 在线</p>
        <p class="status-line">实体监视: 待命</p>
      </section>
      <section class="dash-section priority">
        <h2>行动栏</h2>
        <p class="status-line">待领取: {{ actionStats.available }} ｜ 已领取: {{ actionStats.claimed }} ｜ 进行中: {{ actionStats.inProgress }}</p>
        <div class="priority-list">
          <div v-for="a in actionPreview" :key="a.id" class="priority-item">
            <span class="priority-location">{{ a.location }}</span>
            <span class="priority-level">{{ a.type }}</span>
            <span class="priority-brief">{{ a.status }}</span>
          </div>
          <div v-if="actionPreview.length === 0" class="priority-item">
            <span class="priority-brief">暂无任务数据，前往行动页初始化。</span>
          </div>
        </div>
        <RouterLink to="/ue-stc/ops" class="link-more">前往行动页</RouterLink>
      </section>
      <section class="dash-section coverage">
        <h2>巡逻覆盖率</h2>
        <div class="coverage-strip">
          <RouterLink v-for="c in coverageByTheater" :key="c.name" to="/ue-stc/intel" class="coverage-item" :title="`${c.name} ${c.pct}%`">
            <span class="coverage-name">{{ c.name }}</span>
            <span class="coverage-bar-bg"><span class="coverage-bar-fill" :style="{ width: c.pct + '%' }" /></span>
            <span class="coverage-pct">{{ c.pct }}%</span>
          </RouterLink>
        </div>
        <RouterLink to="/ue-stc/intel" class="link-more">详情见情报页</RouterLink>
      </section>
      <section class="dash-section">
        <p><RouterLink to="/ue-stc/about" class="link-more">关于指挥部</RouterLink></p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.command-dash {
  min-height: 100vh;
  background: #0a0a0a;
  color: #999;
}

.dash-main {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
}

@media (max-width: 640px) {
  .dash-main {
    padding: 1rem 0.75rem;
  }

  .priority-item {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .priority-item .label {
    min-width: 5rem;
  }
}

.dash-section {
  margin-bottom: 2rem;
}

.dash-section h2 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #777;
  margin-bottom: 0.75rem;
}

.dash-section p {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 0.5rem;
}

.status-line {
  margin-bottom: 0.35rem;
}

.status-value {
  color: #6a6;
}

.priority-list {
  margin-bottom: 0.75rem;
}

.priority-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #666;
  padding: 0.35rem 0;
  border-bottom: 1px solid #1a1a1a;
}

.priority-item:last-child {
  border-bottom: 0;
}

.priority-location {
  min-width: 6em;
  color: #888;
}

.priority-level {
  color: #a66;
  font-size: 0.8rem;
}

.priority-brief {
  color: #666;
}

.link-more {
  font-size: 0.8rem;
  color: #555;
  text-decoration: none;
}

.link-more:hover {
  color: #777;
}

.coverage-strip {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.coverage-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #666;
  text-decoration: none;
}

.coverage-item:hover {
  color: #888;
}

.coverage-name {
  min-width: 2.5em;
  color: #777;
}

.coverage-bar-bg {
  flex: 1;
  max-width: 8rem;
  height: 6px;
  background: #1a1a1a;
  border-radius: 2px;
  overflow: hidden;
}

.coverage-bar-fill {
  display: block;
  height: 100%;
  background: #444;
  border-radius: 2px;
}

.coverage-pct {
  min-width: 2.5em;
  font-size: 0.75rem;
  color: #555;
}
</style>
