<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const AUTH_STORAGE = 'ue-stc-auth'
const POINTS_STORAGE = 'ue-stc-points'
const UNLOCKED_INTEL_STORAGE = 'ue-stc-unlocked-intel'
const AVAILABLE_TASKS_STORAGE = 'ue-stc-available-tasks'
const CLAIMED_TASKS_STORAGE = 'ue-stc-claimed-tasks'

const points = ref(0)
const unlockedIntelIds = ref([])
const selectedIntelId = ref('')

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

const intelShop = [
  {
    id: 'director-log',
    title: '前任日志片段',
    cost: 10,
    content:
      '【日志片段】玩家发现实体降临并非随机，而是遵循复杂时空周期。要预测下一次出现，必须破解基于天干地支与五行生克的高维时间密码，并据此推算能量薄弱点。',
  },
  {
    id: 'higher-map',
    title: '高维地图图层',
    cost: 10,
    content:
      '【高维图层摘要】常规地理坐标无法独立描述异常活动，需叠加时间相位轴。三处热点在投影后会汇聚为同一条相位走廊。',
  },
  {
    id: 'entity-truth',
    title: '实体真相档案',
    cost: 20,
    content:
      '【真相档案】实体并非单一生物体，而是观测-反馈系统。观察者行为会改变其下一次出现方式，任务记录本身即为干预的一部分。',
  },
]

const unlockedIntel = computed(() => intelShop.filter((item) => unlockedIntelIds.value.includes(item.id)))
const selectedIntel = computed(() => unlockedIntel.value.find((item) => item.id === selectedIntelId.value) || null)

onMounted(() => {
  if (!sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc')
    return
  }
  points.value = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
  unlockedIntelIds.value = JSON.parse(sessionStorage.getItem(UNLOCKED_INTEL_STORAGE) || '[]')
  if (unlockedIntelIds.value.length > 0) selectedIntelId.value = unlockedIntelIds.value[0]
})

function canBuy(item) {
  return !unlockedIntelIds.value.includes(item.id) && points.value >= item.cost
}

function buyIntel(item) {
  if (!canBuy(item)) return
  points.value -= item.cost
  unlockedIntelIds.value.push(item.id)
  sessionStorage.setItem(POINTS_STORAGE, String(points.value))
  sessionStorage.setItem(UNLOCKED_INTEL_STORAGE, JSON.stringify(unlockedIntelIds.value))
  if (item.id === 'director-log') unlockDecipherTask()
  if (!selectedIntelId.value) selectedIntelId.value = item.id
}

function selectIntel(id) {
  selectedIntelId.value = id
}

function unlockDecipherTask() {
  const available = JSON.parse(sessionStorage.getItem(AVAILABLE_TASKS_STORAGE) || '[]')
  const claimed = JSON.parse(sessionStorage.getItem(CLAIMED_TASKS_STORAGE) || '[]')
  const exists = [...available, ...claimed].some((t) => t.id === 'd-901')
  if (exists) return

  available.push({
    id: 'd-901',
    type: '时空共鸣预测',
    theater: '核心战区',
    location: '时空干涉井',
    status: '待领取',
    points: 10,
  })
  sessionStorage.setItem(AVAILABLE_TASKS_STORAGE, JSON.stringify(available))
}
</script>

<template>
  <div class="command-intel">
    <CommandHeader logo="UE-STC · 情报">
      <template #right>
        <RouterLink to="/">协会页面</RouterLink>
      </template>
    </CommandHeader>
    <main class="intel-main">
      <h1 class="intel-title">情报中心</h1>
      <p class="intel-desc">各战区地点不可见实体活跃情况与巡逻覆盖率。</p>
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
      <section class="intel-section">
        <h2 class="section-title">情报商店</h2>
        <p class="intel-desc">当前积分：{{ points }}</p>
        <div class="shop-list">
          <div class="shop-item" v-for="item in intelShop" :key="item.id">
            <div>
              <p class="shop-title">{{ item.title }}</p>
              <p class="shop-cost">价格：{{ item.cost }} 积分</p>
            </div>
            <button class="buy-btn" type="button" :disabled="!canBuy(item)" @click="buyIntel(item)">
              {{ unlockedIntelIds.includes(item.id) ? '已解锁' : '购买' }}
            </button>
          </div>
        </div>
      </section>
      <section class="intel-section">
        <h2 class="section-title">已解锁情报</h2>
        <p v-if="unlockedIntel.length === 0" class="intel-desc">暂无已解锁情报，请先在情报商店购买。</p>
        <div v-else class="unlocked-wrap">
          <div class="unlocked-tabs">
            <button
              v-for="item in unlockedIntel"
              :key="item.id"
              type="button"
              class="tab-btn"
              :class="{ active: selectedIntelId === item.id }"
              @click="selectIntel(item.id)"
            >
              {{ item.title }}
            </button>
          </div>
          <div class="intel-detail" v-if="selectedIntel">
            <h3>{{ selectedIntel.title }}</h3>
            <p>{{ selectedIntel.content }}</p>
          </div>
        </div>
      </section>
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

.intel-section {
  margin-top: 1.5rem;
}

.section-title {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.75rem;
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

.shop-list {
  display: grid;
  gap: 0.65rem;
}

.shop-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #1f1f1f;
  background: #0d0d0d;
  padding: 0.65rem 0.75rem;
}

.shop-title {
  margin: 0 0 0.25rem;
  font-size: 0.85rem;
  color: #8d8d8d;
}

.shop-cost {
  margin: 0;
  font-size: 0.78rem;
  color: #6b6b6b;
}

.buy-btn {
  font-size: 0.78rem;
  background: #202020;
  border: 1px solid #3a3a3a;
  color: #8f8f8f;
  padding: 0.2rem 0.6rem;
  cursor: pointer;
}

.buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.unlocked-wrap {
  border: 1px solid #1f1f1f;
  background: #0d0d0d;
}

.unlocked-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.65rem;
  border-bottom: 1px solid #1f1f1f;
}

.tab-btn {
  font-size: 0.78rem;
  background: #1a1a1a;
  border: 1px solid #303030;
  color: #808080;
  padding: 0.25rem 0.55rem;
  cursor: pointer;
}

.tab-btn.active {
  border-color: #4a4;
  color: #9ac79a;
}

.intel-detail {
  padding: 0.8rem;
}

.intel-detail h3 {
  margin: 0 0 0.55rem;
  font-size: 0.88rem;
  color: #9a9a9a;
}

.intel-detail p {
  margin: 0;
  font-size: 0.82rem;
  color: #767676;
  line-height: 1.7;
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
