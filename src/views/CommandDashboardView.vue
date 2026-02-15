<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

const router = useRouter()
const AUTH_STORAGE = 'ue-stc-auth'

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
function tick() {
  const d = new Date()
  time.value = d.toTimeString().slice(0, 8)
}
onMounted(() => {
  tick()
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
})

const priorityActions = [
  { location: '成都·清水河', level: '高', brief: '校园节点例行巡检' },
  { location: '成都·沙河', level: '高', brief: '与《科幻世界》杂志社联络通道维持' },
]
</script>

<template>
  <div class="command-dash">
    <header class="dash-header">
      <span class="dash-logo">UE-STC</span>
      <nav class="dash-nav">
        <RouterLink to="/ue-stc/dashboard" class="dash-nav-link active">首页</RouterLink>
        <RouterLink to="/ue-stc/intel" class="dash-nav-link">情报</RouterLink>
      </nav>
      <span class="dash-time">{{ time }}</span>
      <button type="button" class="dash-logout" @click="logout">断开</button>
    </header>
    <main class="dash-main">
      <section class="dash-section">
        <h2>系统状态</h2>
        <p class="status-line">主链路: <span class="status-value">{{ status }}</span></p>
        <p class="status-line">伪装界面: 在线</p>
        <p class="status-line">实体监视: 待命</p>
      </section>
      <section class="dash-section priority">
        <h2>当前行动</h2>
        <div class="priority-list">
          <div v-for="(a, i) in priorityActions" :key="i" class="priority-item">
            <span class="priority-location">{{ a.location }}</span>
            <span class="priority-level">{{ a.level }}</span>
            <span class="priority-brief">{{ a.brief }}</span>
          </div>
        </div>
        <RouterLink to="/ue-stc/intel" class="link-more">查看完整情报列表</RouterLink>
      </section>
      <section class="dash-section">
        <h2>关于指挥部</h2>
        <p>
          不可见实体监视与战术指挥部（UE-STC）依托电子科技大学，成立于 1956 年。
          其后与四川省情报机构（对外伪装为「科幻世界杂志社」）建立合作，以科幻协会身份作为对外交流渠道，沿用至今。
        </p>
        <p>本页面及情报内容仅供娱乐，与任何真实机构无关。</p>
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

.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #222;
}

.dash-logo {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #666;
}

.dash-nav {
  display: flex;
  gap: 1rem;
}

.dash-nav-link {
  font-size: 0.85rem;
  color: #555;
  text-decoration: none;
}

.dash-nav-link:hover,
.dash-nav-link.active {
  color: #888;
}

.dash-time {
  font-size: 0.85rem;
  color: #555;
  font-variant-numeric: tabular-nums;
}

.dash-logout {
  background: none;
  border: 1px solid #333;
  color: #666;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.dash-logout:hover {
  color: #888;
  border-color: #444;
}

.dash-main {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
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
</style>
