<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

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
</style>
