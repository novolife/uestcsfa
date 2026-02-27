<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'
import { checkEmergencyTimeout, maybeTriggerEmergency, readEmergency } from '@/utils/emergencyComm'

const router = useRouter()
const AUTH_STORAGE = 'ue-stc-auth'
const QUEST_STORAGE = 'ue-stc-quest'
const POINTS_STORAGE = 'ue-stc-points'
const INVENTORY_STORAGE = 'ue-stc-inventory'
const AID_REQUESTS_STORAGE = 'ue-stc-aid-requests'
const MEMETIC_CLEANED_STORAGE = 'ue-stc-memetic-cleaned'
const MAP_MISSION_STORAGE = 'ue-stc-map-mission'
const MAP_DONE_TASK_STORAGE = 'ue-stc-map-done-task'
const DECIPHER_MISSION_STORAGE = 'ue-stc-decipher-mission'
const DECIPHER_DONE_TASK_STORAGE = 'ue-stc-decipher-done-task'
const AVAILABLE_TASKS_STORAGE = 'ue-stc-available-tasks'
const CLAIMED_TASKS_STORAGE = 'ue-stc-claimed-tasks'
const TASK_COUNTER_STORAGE = 'ue-stc-task-counter'

const questState = ref(0)
const points = ref(0)
const inventory = ref([])
const aidRequests = ref([])
const memeticCleaned = ref(false)
const latestLog = ref('系统待命。')
const emergency = ref(null)
const availableTasks = ref([])
const claimedTasks = ref([])
const taskCounter = ref(1000)

const isFormal = computed(() => questState.value > 0)
const activeAidRequest = computed(() => aidRequests.value.find((r) => !r.done) || null)
const canSubmitAid = computed(() => {
  if (!activeAidRequest.value) return false
  return inventory.value.includes(activeAidRequest.value.code)
})
const level = computed(() => {
  if (points.value >= 12) return 3
  if (points.value >= 5) return 2
  return 1
})

const SKU_NAME_MAP = {
  'EMP-01': '战术 EMP 模组',
  'MED-77': '应急医疗包',
  'KEY-99': '解密密钥组',
  'DMP-III-884': '三型阻尼器',
  'PAB-44X-12': '偏振锚栓',
  'LPC-9A-770': '局域相位笼',
}

const inventoryDisplay = computed(() => {
  if (!inventory.value.length) return []
  const bucket = {}
  inventory.value.forEach((sku) => {
    const name = SKU_NAME_MAP[sku] || '未识别物资'
    if (!bucket[name]) bucket[name] = 0
    bucket[name] += 1
  })
  return Object.entries(bucket).map(([name, count]) => ({ name, count }))
})

function seedFormalTasks() {
  return [
    { id: 'p-101', type: '巡逻任务', theater: '西南战区', location: '成都·清水河', status: '待领取', points: 1 },
    { id: 'p-102', type: '巡逻任务', theater: '华北战区', location: '天津', status: '待领取', points: 2 },
    { id: 'p-103', type: '巡逻任务', theater: '华东战区', location: '上海', status: '待领取', points: 3 },
    { id: 'p-104', type: '巡逻任务', theater: '华南战区', location: '深圳', status: '待领取', points: 2 },
    { id: 'c-201', type: '收容任务', theater: '西南战区', location: '成都·沙河', status: '待领取', points: 2 },
    { id: 'c-202', type: '收容任务', theater: '核心战区', location: '未定裂隙', status: '待领取', points: 5 },
    { id: 'a-301', type: '援助任务', theater: '外勤支援', location: '04号观察点', status: '待领取', points: 3 },
    { id: 'm-401', type: '模因污染清洗任务', theater: '信息战区', location: '协会官网文章系统', status: '待领取', points: 5 },
  ]
}

function nextTaskId(prefix) {
  taskCounter.value += 1
  sessionStorage.setItem(TASK_COUNTER_STORAGE, String(taskCounter.value))
  return `${prefix}-${taskCounter.value}`
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function generateDynamicTask() {
  // 低分任务刷新概率更高
  const roll = Math.random()
  if (roll < 0.55) {
    const patrolPool = [
      { theater: '西南战区', location: '成都·清水河' },
      { theater: '华北战区', location: '天津' },
      { theater: '华东战区', location: '上海' },
      { theater: '华南战区', location: '深圳' },
      { theater: '西南战区', location: '绵阳' },
    ]
    const p = randomFrom(patrolPool)
    const pointRoll = Math.random()
    const patrolPoints = pointRoll < 0.55 ? 1 : pointRoll < 0.85 ? 2 : 3
    return { id: nextTaskId('p'), type: '巡逻任务', theater: p.theater, location: p.location, status: '待领取', points: patrolPoints }
  }
  if (roll < 0.8) {
    const containmentPool = [
      { theater: '西南战区', location: '成都·沙河', points: 2 },
      { theater: '核心战区', location: '未定裂隙', points: 3 },
      { theater: '华东战区', location: '海上节点', points: 2 },
    ]
    const c = randomFrom(containmentPool)
    const pointRoll = Math.random()
    const containmentPoints = pointRoll < 0.4 ? 2 : pointRoll < 0.7 ? 3 : pointRoll < 0.9 ? 4 : 5
    return { id: nextTaskId('c'), type: '收容任务', theater: c.theater, location: c.location, status: '待领取', points: containmentPoints }
  }
  if (roll < 0.92) {
    return { id: nextTaskId('a'), type: '援助任务', theater: '外勤支援', location: '联合观察点', status: '待领取', points: 3 }
  }
  return { id: nextTaskId('m'), type: '模因污染清洗任务', theater: '信息战区', location: '协会官网文章系统', status: '待领取', points: 5 }
}

function refillAvailableTasks() {
  if (!isFormal.value) return
  const targetCount = 8
  while (availableTasks.value.length < targetCount) {
    availableTasks.value.push(generateDynamicTask())
  }
}

function persistTasks() {
  sessionStorage.setItem(AVAILABLE_TASKS_STORAGE, JSON.stringify(availableTasks.value))
  sessionStorage.setItem(CLAIMED_TASKS_STORAGE, JSON.stringify(claimedTasks.value))
}

function persistAidRequests() {
  sessionStorage.setItem(AID_REQUESTS_STORAGE, JSON.stringify(aidRequests.value))
}

function markClaimedTaskDone(taskId, message) {
  const task = claimedTasks.value.find((t) => t.id === taskId)
  if (!task || task.status === '已完成') return
  task.status = '已完成'
  latestLog.value = message
  persistTasks()
}

function claimTask(taskId) {
  const idx = availableTasks.value.findIndex((t) => t.id === taskId)
  if (idx === -1) return
  const [task] = availableTasks.value.splice(idx, 1)
  claimedTasks.value.push({ ...task, status: '待执行' })
  refillAvailableTasks()
  persistTasks()
}

function buildContainmentPatternPlan(totalPoints) {
  const plans = []
  for (let hard = 1; hard <= Math.floor(totalPoints / 2); hard++) {
    const simple = totalPoints - hard * 2
    if (simple < 0) continue
    const plan = []
    for (let i = 0; i < simple; i++) plan.push('simple')
    for (let i = 0; i < hard; i++) plan.push('hard')
    plans.push(plan)
  }
  if (plans.length === 0) return ['hard']
  return randomFrom(plans).sort(() => Math.random() - 0.5)
}

function launchMapTask(task, mode, patternCount, patternPlan = []) {
  task.status = '进行中'
  persistTasks()
  sessionStorage.setItem(
    MAP_MISSION_STORAGE,
    JSON.stringify({
      mode,
      patternCount,
      patternPlan,
      rewardPoints: task.points,
      taskId: task.id,
    }),
  )
  router.push('/ue-stc/map')
}

function executeTask(task) {
  if (task.status === '已完成') return

  if (task.id === 'trainee-001') {
    launchMapTask(task, 'trainee', 1, ['simple'])
    return
  }

  if (task.type === '巡逻任务') {
    const patternCount = Math.max(1, Math.min(3, task.points))
    latestLog.value = `巡逻任务启动：${patternCount} 组简单测绘。`
    launchMapTask(task, 'patrol', patternCount, Array(patternCount).fill('simple'))
    return
  }

  if (task.type === '收容任务') {
    const patternPlan = buildContainmentPatternPlan(task.points)
    const simpleCount = patternPlan.filter((x) => x === 'simple').length
    const hardCount = patternPlan.filter((x) => x === 'hard').length
    latestLog.value = `收容任务启动：简单 ${simpleCount} 组 + 困难 ${hardCount} 组。`
    launchMapTask(task, 'containment', patternPlan.length, patternPlan)
    return
  }

  if (task.type === '援助任务') {
    if (canSubmitAid.value && activeAidRequest.value) {
      inventory.value = inventory.value.filter((c) => c !== activeAidRequest.value.code)
      activeAidRequest.value.done = true
      sessionStorage.setItem(INVENTORY_STORAGE, JSON.stringify(inventory.value))
      persistAidRequests()
      points.value += task.points
      sessionStorage.setItem(POINTS_STORAGE, String(points.value))
      task.status = '已完成'
      latestLog.value = `援助交付完成：+${task.points} 分`
      emergency.value = maybeTriggerEmergency(points.value)
      if (emergency.value?.status === 'active') latestLog.value = '紧急通信触发：请立即进入通信终端。'
      refillAvailableTasks()
      persistTasks()
    } else {
      router.push('/ue-stc/logistics')
    }
    return
  }

  if (task.type === '模因污染清洗任务') {
    router.push('/ue-stc/memetic')
    return
  }

  if (task.type === '时空共鸣预测') {
    task.status = '进行中'
    persistTasks()
    sessionStorage.setItem(
      DECIPHER_MISSION_STORAGE,
      JSON.stringify({
        taskId: task.id,
        rewardPoints: task.points,
      }),
    )
    router.push('/ue-stc/decipher')
  }
}

function taskActionText(task) {
  if (task.status === '已完成') return '已完成'
  if (task.type === '援助任务') {
    return canSubmitAid.value ? '交付物资' : '进入物资终端'
  }
  if (task.type === '模因污染清洗任务') return '进入清洗模块'
  if (task.type === '时空共鸣预测') return '进入推演终端'
  return '进入玩法'
}

function devAddPoints() {
  if (questState.value === 0) {
    questState.value = 1
    sessionStorage.setItem(QUEST_STORAGE, '1')
    availableTasks.value = seedFormalTasks()
    claimedTasks.value = claimedTasks.value.filter((t) => t.id !== 'trainee-001')
    refillAvailableTasks()
    persistTasks()
  }
  points.value += 10
  sessionStorage.setItem(POINTS_STORAGE, String(points.value))
  emergency.value = checkEmergencyTimeout() || maybeTriggerEmergency(points.value) || readEmergency()
  latestLog.value = `[DEV] 测试：当前积分 ${points.value}`
}

onMounted(() => {
  if (!sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc')
    return
  }

  questState.value = parseInt(sessionStorage.getItem(QUEST_STORAGE) || '0', 10)
  points.value = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
  taskCounter.value = parseInt(sessionStorage.getItem(TASK_COUNTER_STORAGE) || '1000', 10)
  inventory.value = JSON.parse(sessionStorage.getItem(INVENTORY_STORAGE) || '[]')
  memeticCleaned.value = sessionStorage.getItem(MEMETIC_CLEANED_STORAGE) === '1'
  emergency.value = checkEmergencyTimeout() || readEmergency()

  const savedRequests = sessionStorage.getItem(AID_REQUESTS_STORAGE)
  if (savedRequests) {
    aidRequests.value = JSON.parse(savedRequests)
  } else {
    aidRequests.value = [{ id: 'aid-04', from: '04号观察员', code: 'EMP-01', done: false }]
    persistAidRequests()
  }

  const savedAvailable = sessionStorage.getItem(AVAILABLE_TASKS_STORAGE)
  const savedClaimed = sessionStorage.getItem(CLAIMED_TASKS_STORAGE)

  if (questState.value === 0) {
    availableTasks.value = [
      { id: 'trainee-001', type: '见习考核', theater: '西南战区', location: '成都·清水河', status: '待领取', points: 0 },
    ]
    claimedTasks.value = []
    persistTasks()
  } else {
    availableTasks.value = savedAvailable ? JSON.parse(savedAvailable) : seedFormalTasks()
    claimedTasks.value = savedClaimed ? JSON.parse(savedClaimed) : []
    refillAvailableTasks()
    persistTasks()
  }

  const doneTaskId = sessionStorage.getItem(MAP_DONE_TASK_STORAGE)
  if (doneTaskId) {
    if (doneTaskId === 'trainee-001') {
      markClaimedTaskDone(doneTaskId, '见习考核通过，转正完成。')
      questState.value = 1
      if (availableTasks.value.length <= 1 && availableTasks.value[0]?.id === 'trainee-001') {
        availableTasks.value = seedFormalTasks()
        claimedTasks.value = claimedTasks.value.filter((t) => t.id !== 'trainee-001')
      }
      refillAvailableTasks()
      persistTasks()
    } else {
      markClaimedTaskDone(doneTaskId, '测绘任务完成，积分已结算。')
      refillAvailableTasks()
    }
    sessionStorage.removeItem(MAP_DONE_TASK_STORAGE)
  }

  const decipherDoneTaskId = sessionStorage.getItem(DECIPHER_DONE_TASK_STORAGE)
  if (decipherDoneTaskId) {
    markClaimedTaskDone(decipherDoneTaskId, '时空共鸣预测完成，已锁定下一次实体降临坐标。')
    refillAvailableTasks()
    persistTasks()
    sessionStorage.removeItem(DECIPHER_DONE_TASK_STORAGE)
    sessionStorage.removeItem(DECIPHER_MISSION_STORAGE)
  }

  if (memeticCleaned.value) {
    const memeticTask = claimedTasks.value.find((t) => t.type === '模因污染清洗任务' && t.status !== '已完成')
    if (memeticTask) {
      memeticTask.status = '已完成'
      latestLog.value = '模因污染清洗完成：+5 分'
      emergency.value = maybeTriggerEmergency(points.value)
      if (emergency.value?.status === 'active') latestLog.value = '紧急通信触发：请立即进入通信终端。'
      persistTasks()
    }
  }
  emergency.value = checkEmergencyTimeout() || maybeTriggerEmergency(points.value) || readEmergency()
})
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

      <div class="dev-panel">
        <button class="btn-action-special dev-btn" type="button" @click="devAddPoints">
          [测试开关] 快速转正 & 获得 10 积分
        </button>
      </div>

      <p class="ops-desc" v-if="!isFormal">见习调度员：仅开放考核任务。</p>
      <p class="ops-desc" v-else>当前积分：{{ points }} / 层级：L{{ level }}</p>

      <section class="ops-section top-panels" v-if="isFormal">
        <div class="panel">
          <h2 class="ops-section-title">行动日志</h2>
          <p class="panel-line">最新日志：{{ latestLog }}</p>
          <p class="panel-line" v-if="emergency && emergency.status === 'active' && activeAidRequest">
            紧急请求：{{ activeAidRequest.from }} 需要 {{ activeAidRequest.code }}
          </p>
          <p class="panel-line" v-else>当前无待处理紧急通信请求。</p>
          <p class="panel-line" v-if="emergency && emergency.status === 'active'">紧急通信：{{ emergency.agentStatus }}（需立即调拨）</p>
        </div>
        <div class="panel">
          <h2 class="ops-section-title">物资调配终端</h2>
          <button class="btn-claim" type="button" @click="router.push('/ue-stc/logistics')">进入终端</button>
        </div>
        <div class="panel">
          <h2 class="ops-section-title">库存物资</h2>
          <p v-if="inventoryDisplay.length === 0" class="panel-line">暂无已兑换物资。</p>
          <ul v-else class="inventory-list">
            <li v-for="item in inventoryDisplay" :key="item.name" class="inventory-item">
              <span>{{ item.name }}</span>
              <span>x{{ item.count }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section class="ops-section">
        <h2 class="ops-section-title">可领取任务</h2>
        <div class="ops-table-wrap">
          <table class="ops-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>战区</th>
                <th>地点</th>
                <th>状态</th>
                <th>积分</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in availableTasks" :key="task.id">
                <td>{{ task.type }}</td>
                <td>{{ task.theater }}</td>
                <td>{{ task.location }}</td>
                <td>{{ task.status }}</td>
                <td>{{ task.points }}</td>
                <td>
                  <button class="btn-claim" type="button" @click="claimTask(task.id)">领取</button>
                </td>
              </tr>
              <tr v-if="availableTasks.length === 0">
                <td colspan="6" class="empty">暂无可领取任务</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="ops-section">
        <h2 class="ops-section-title">已领取任务</h2>
        <div class="ops-table-wrap">
          <table class="ops-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>战区</th>
                <th>地点</th>
                <th>状态</th>
                <th>积分</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in claimedTasks" :key="task.id">
                <td>{{ task.type }}</td>
                <td>{{ task.theater }}</td>
                <td>{{ task.location }}</td>
                <td>{{ task.status }}</td>
                <td>{{ task.points }}</td>
                <td>
                  <button class="btn-action-special" type="button" :disabled="task.status === '已完成'" @click="executeTask(task)">
                    {{ taskActionText(task) }}
                  </button>
                </td>
              </tr>
              <tr v-if="claimedTasks.length === 0">
                <td colspan="6" class="empty">暂无已领取任务</td>
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
  max-width: 900px;
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

.dev-panel {
  margin-bottom: 1rem;
}

.dev-btn {
  border-color: #a44;
  color: #f66;
}

.dev-btn:hover {
  background: #a44;
  color: #fff;
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

.btn-action-special {
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  background: #131;
  border: 1px solid #4a4;
  color: #6a6;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action-special:hover {
  background: #4a4;
  color: #000;
}

.btn-action-special:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.top-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.panel {
  border: 1px solid #1f1f1f;
  background: #0d0d0d;
  padding: 0.75rem;
}

.panel-line {
  margin-bottom: 0.45rem;
  font-size: 0.82rem;
  color: #727272;
}

.inventory-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.inventory-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: #7a7a7a;
  padding: 0.2rem 0;
  border-bottom: 1px solid #1a1a1a;
}

.inventory-item:last-child {
  border-bottom: 0;
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
    min-width: 560px;
  }

  .top-panels {
    grid-template-columns: 1fr;
  }
}
</style>
