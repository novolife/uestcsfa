<script setup>
import { onMounted } from 'vue'
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

const intelList = [
  { theater: '西南战区', location: '成都·沙河', status: '监视中', action: '常规覆盖，无异常' },
  { theater: '西南战区', location: '成都·清水河', status: '监视中', action: '校园节点稳定' },
  { theater: '西南战区', location: '绵阳', status: '待命', action: '—' },
  { theater: '华北战区', location: '北京·海淀', status: '监视中', action: '友单位协同' },
  { theater: '华北战区', location: '天津', status: '待命', action: '—' },
  { theater: '华东战区', location: '上海', status: '监视中', action: '情报收集中' },
  { theater: '华南战区', location: '深圳', status: '待命', action: '—' },
]
</script>

<template>
  <div class="command-intel">
    <CommandHeader logo="UE-STC · 情报">
      <template #right>
        <RouterLink to="/">协会页面</RouterLink>
      </template>
    </CommandHeader>
    <main class="intel-main">
      <h1 class="intel-title">当前情报列表</h1>
      <p class="intel-desc">各战区各地点行动情况。本数据仅供娱乐，与任何真实机构无关。</p>
      <div class="intel-table-wrap">
        <table class="intel-table">
        <thead>
          <tr>
            <th>战区</th>
            <th>地点</th>
            <th>状态</th>
            <th>行动概要</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in intelList" :key="i">
            <td>{{ row.theater }}</td>
            <td>{{ row.location }}</td>
            <td><span class="status-tag" :class="row.status === '监视中' ? 'active' : ''">{{ row.status }}</span></td>
            <td>{{ row.action }}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </main>
  </div>
</template>

<style scoped>
.command-intel {
  min-height: 100vh;
  background: #0a0a0a;
  color: #999;
}

.intel-main {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
}

.intel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #777;
  margin-bottom: 0.35rem;
}

.intel-desc {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 1.25rem;
}

.intel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.intel-table th,
.intel-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #222;
  color: #666;
}

.intel-table th {
  color: #555;
  font-weight: 600;
}

.status-tag {
  color: #555;
}

.status-tag.active {
  color: #6a6;
}

@media (max-width: 640px) {
  .intel-main {
    padding: 1rem 0.75rem;
  }

  .intel-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -0.75rem;
    padding: 0 0.75rem;
  }

  .intel-table {
    min-width: 480px;
  }
}
</style>
