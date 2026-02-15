<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

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
    <header class="dash-header">
      <span class="dash-logo">UE-STC · 情报</span>
      <nav class="dash-nav">
        <RouterLink to="/ue-stc/dashboard" class="dash-nav-link">首页</RouterLink>
        <RouterLink to="/ue-stc/intel" class="dash-nav-link active">情报</RouterLink>
      </nav>
      <RouterLink to="/ue-stc/dashboard" class="dash-back">返回</RouterLink>
    </header>
    <main class="intel-main">
      <h1 class="intel-title">当前情报列表</h1>
      <p class="intel-desc">各战区各地点行动情况。本数据仅供娱乐，与任何真实机构无关。</p>
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
    </main>
  </div>
</template>

<style scoped>
.command-intel {
  min-height: 100vh;
  background: #0a0a0a;
  color: #999;
}

.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #222;
}

.dash-logo {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.1em;
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

.dash-back {
  font-size: 0.8rem;
  color: #555;
  text-decoration: none;
}

.dash-back:hover {
  color: #888;
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
</style>
