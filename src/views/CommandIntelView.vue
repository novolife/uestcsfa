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

// 各战区地点：不可见实体活跃度 + 巡逻覆盖率
const intelList = [
  { theater: '西南战区', location: '成都·沙河', activity: '低', coverage: 92 },
  { theater: '西南战区', location: '成都·清水河', activity: '中', coverage: 88 },
  { theater: '西南战区', location: '绵阳', activity: '低', coverage: 45 },
  { theater: '华北战区', location: '北京·石景山', activity: '中', coverage: 78 },
  { theater: '华北战区', location: '天津', activity: '低', coverage: 52 },
  { theater: '华东战区', location: '上海', activity: '高', coverage: 85 },
  { theater: '华南战区', location: '深圳', activity: '低', coverage: 38 },
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
      <h1 class="intel-title">实体与巡逻情报</h1>
      <p class="intel-desc">各战区地点不可见实体活跃情况与巡逻覆盖率。本数据仅供娱乐，与任何真实机构无关。</p>
      <div class="intel-table-wrap">
        <table class="intel-table">
          <thead>
            <tr>
              <th>战区</th>
              <th>地点</th>
              <th>实体活跃度</th>
              <th>巡逻覆盖率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in intelList" :key="i">
              <td>{{ row.theater }}</td>
              <td>{{ row.location }}</td>
              <td><span class="activity-tag" :class="row.activity">{{ row.activity }}</span></td>
              <td>
                <span class="coverage-bar-wrap" :title="`${row.coverage}%`">
                  <span class="coverage-bar" :style="{ width: row.coverage + '%' }" />
                  <span class="coverage-num">{{ row.coverage }}%</span>
                </span>
              </td>
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

.activity-tag {
  font-size: 0.8rem;
  color: #888;
}

.activity-tag.低 {
  color: #6a6;
}

.activity-tag.中 {
  color: #996;
}

.activity-tag.高 {
  color: #a66;
}

.coverage-bar-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 6rem;
}

.coverage-bar {
  display: inline-block;
  height: 6px;
  min-width: 2px;
  background: #444;
  border-radius: 1px;
}

.coverage-num {
  font-size: 0.8rem;
  color: #777;
  min-width: 2.5em;
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
    min-width: 380px;
  }
}
</style>
