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

// 可领取的行动（未分配）
const availableOps = ref([
  { id: 1, theater: '西南战区', location: '绵阳', brief: '节点部署与初检', level: '中' },
  { id: 2, theater: '华北战区', location: '天津', brief: '例行巡逻', level: '低' },
  { id: 3, theater: '华南战区', location: '深圳', brief: '联络点确认', level: '低' },
])

// 已分配 / 进行中的行动
const assignedOps = ref([
  { id: 4, theater: '西南战区', location: '成都·清水河', brief: '校园节点例行巡检', level: '高', assignee: '当前用户', status: '进行中' },
  { id: 5, theater: '西南战区', location: '成都·沙河', brief: '与《科幻世界》杂志社联络通道维持', level: '高', assignee: '—', status: '待执行' },
  { id: 6, theater: '华东战区', location: '上海', brief: '情报收集中', level: '中', assignee: '—', status: '进行中' },
])

function claim(id) {
  const i = availableOps.value.findIndex((o) => o.id === id)
  if (i === -1) return
  const [op] = availableOps.value.splice(i, 1)
  assignedOps.value.push({ ...op, assignee: '当前用户', status: '待执行' })
}
</script>

<template>
  <div class="command-ops">
    <CommandHeader logo="UE-STC · 行动">
      <template #right>
        <RouterLink to="/">协会页面</RouterLink>
      </template>
    </CommandHeader>
    <main class="ops-main">
      <h1 class="ops-title">行动中心</h1>
      <p class="ops-desc">各战区地点当前行动。可领取未分配任务，或查看已分配任务。本内容仅供娱乐。</p>

      <section class="ops-section">
        <h2 class="ops-section-title">可领取的行动</h2>
        <div class="ops-table-wrap">
          <table class="ops-table">
            <thead>
              <tr>
                <th>战区</th>
                <th>地点</th>
                <th>概要</th>
                <th>优先级</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="op in availableOps" :key="op.id">
                <td>{{ op.theater }}</td>
                <td>{{ op.location }}</td>
                <td>{{ op.brief }}</td>
                <td><span class="level-tag" :class="op.level">{{ op.level }}</span></td>
                <td><button type="button" class="btn-claim" @click="claim(op.id)">领取</button></td>
              </tr>
              <tr v-if="availableOps.length === 0">
                <td colspan="5" class="empty">暂无可领取行动</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="ops-section">
        <h2 class="ops-section-title">已分配的行动</h2>
        <div class="ops-table-wrap">
          <table class="ops-table">
            <thead>
              <tr>
                <th>战区</th>
                <th>地点</th>
                <th>概要</th>
                <th>执行人</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="op in assignedOps" :key="op.id">
                <td>{{ op.theater }}</td>
                <td>{{ op.location }}</td>
                <td>{{ op.brief }}</td>
                <td>{{ op.assignee }}</td>
                <td><span class="status-tag">{{ op.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.command-ops {
  min-height: 100vh;
  background: #0a0a0a;
  color: #999;
}

.ops-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
}

.ops-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #777;
  margin-bottom: 0.35rem;
}

.ops-desc {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.ops-section {
  margin-bottom: 2rem;
}

.ops-section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.75rem;
}

.ops-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.ops-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.ops-table th,
.ops-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #222;
  color: #666;
}

.ops-table th {
  color: #555;
  font-weight: 600;
}

.level-tag {
  font-size: 0.8rem;
  color: #888;
}

.level-tag.高 {
  color: #a66;
}

.level-tag.中 {
  color: #996;
}

.level-tag.低 {
  color: #666;
}

.status-tag {
  font-size: 0.8rem;
  color: #888;
}

.btn-claim {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  background: #222;
  border: 1px solid #444;
  color: #888;
  cursor: pointer;
}

.btn-claim:hover {
  color: #aaa;
  border-color: #555;
}

.empty {
  color: #555;
  font-style: italic;
}

@media (max-width: 640px) {
  .ops-main {
    padding: 1rem 0.75rem;
  }

  .ops-table {
    min-width: 420px;
  }
}
</style>
