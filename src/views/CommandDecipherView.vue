<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const AUTH_STORAGE = 'ue-stc-auth'
const POINTS_STORAGE = 'ue-stc-points'
const DECIPHER_MISSION_STORAGE = 'ue-stc-decipher-mission'
const DECIPHER_DONE_TASK_STORAGE = 'ue-stc-decipher-done-task'

const mission = ref({ taskId: '', rewardPoints: 10 })
const currentStep = ref(1)
const isDecoded = ref(false)

const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const elements = ['木', '火', '土', '金', '水']
const counterMap = {
  木: '金',
  火: '水',
  土: '木',
  金: '火',
  水: '土',
}
const elementButtonLabel = {
  木: '绿 / 木',
  火: '红 / 火',
  土: '黄 / 土',
  金: '白 / 金',
  水: '黑 / 水',
}

const scenario = ref({
  element: '火',
  clue: '警报：目标区域温度异常升高，侦测到大量红色光谱。',
  virtualHour: 14,
  countdownHour: 2,
  targetBranch: '申',
  difficulty: 'simple',
})

const logs = ref([
  '[系统] 时空共鸣预测模块已启动。',
  '[系统] 任务流程：频率捕捉 -> 时空拨盘 -> 属性覆盖。',
])

const guessedElement = ref('')
const selectedBranchIndex = ref(0)
const selectedInject = ref('')

const virtualTimeLabel = computed(() => `${String(scenario.value.virtualHour).padStart(2, '0')}:00`)
const targetTimeLabel = computed(() => {
  const h = (scenario.value.virtualHour + scenario.value.countdownHour) % 24
  return `${String(h).padStart(2, '0')}:00`
})
const selectedBranch = computed(() => branches[selectedBranchIndex.value])
const counterElement = computed(() => counterMap[scenario.value.element])

function hourToBranch(hour) {
  const idx = Math.floor(((hour + 1) % 24) / 2)
  return branches[idx]
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function randomPick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function initScenario() {
  const element = randomPick(elements)
  const difficulty = Math.random() < 0.45 ? 'simple' : 'advanced'
  const virtualHour = randomInt(0, 23)
  const countdownHour = randomPick([1, 2, 2, 3])
  const targetHour = (virtualHour + countdownHour) % 24
  const targetBranch = hourToBranch(targetHour)

  const cluePool = {
    木: [
      '侦测到藤蔓状干涉丝快速增殖，结构呈枝化扩散。',
      '目标点出现大面积绿色谱线，周边支撑结构被根系样纹理侵蚀。',
    ],
    火: [
      '警报：目标区域温度异常升高，侦测到大量红色光谱，引发周围植被迅速枯萎。',
      '观测到连续爆裂脉冲与灼蚀反应，空气离子化明显增强。',
    ],
    土: [
      '地层波形出现钝化回响，重压场导致地面缓慢塌陷。',
      '目标区域呈黄褐色固化反应，空间粘滞度显著上升。',
    ],
    金: [
      '金属构件发生高频共振并扭曲，边缘出现锐化裂纹。',
      '白色反射谱异常增强，切割型噪波持续攀升。',
    ],
    水: [
      '环境温度骤降并伴随黑色雾化潮汐，液态干涉层快速扩张。',
      '侦测到强渗透与回卷流，局部空间表现出深水般拖拽效应。',
    ],
  }

  scenario.value = {
    element,
    clue: difficulty === 'simple' ? `系统提示：目标属${element}。` : randomPick(cluePool[element]),
    virtualHour,
    countdownHour,
    targetBranch,
    difficulty,
  }
}

function rotateDial(delta) {
  selectedBranchIndex.value = (selectedBranchIndex.value + delta + 12) % 12
}

function confirmStep1() {
  if (!guessedElement.value) return
  if (guessedElement.value === scenario.value.element) {
    currentStep.value = 2
    logs.value.push(`[通过] 频率捕捉完成：目标属性判定为 ${scenario.value.element}。`)
  } else {
    logs.value.push('[失败] 频率判定错误，请重新根据线索判断实体属性。')
  }
}

function confirmStep2() {
  if (selectedBranch.value === scenario.value.targetBranch) {
    currentStep.value = 3
    logs.value.push(`[通过] 时空通道已锁定：${selectedBranch.value}时。`)
  } else {
    logs.value.push(`[失败] 拨盘错位，目标时间窗对应 ${scenario.value.targetBranch} 时。`)
  }
}

function confirmStep3(element) {
  selectedInject.value = element
  if (element !== counterElement.value) {
    logs.value.push(
      `[失败] 注入属性错误。当前实体为${scenario.value.element}，应使用${counterElement.value}进行中和。`,
    )
    return
  }

  const current = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
  sessionStorage.setItem(POINTS_STORAGE, String(current + (mission.value.rewardPoints || 10)))
  if (mission.value.taskId) {
    sessionStorage.setItem(DECIPHER_DONE_TASK_STORAGE, mission.value.taskId)
  }

  logs.value.push('[成功] 赛博罗盘对位完成，降临通道已被反制。')
  logs.value.push(`[任务完成] 时空共鸣预测 +${mission.value.rewardPoints || 10} 积分`)
  isDecoded.value = true
}

onMounted(() => {
  if (!sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc')
    return
  }
  const raw = sessionStorage.getItem(DECIPHER_MISSION_STORAGE)
  if (!raw) {
    router.replace('/ue-stc/ops')
    return
  }
  mission.value = JSON.parse(raw)
  initScenario()
})
</script>

<template>
  <div class="command-decipher">
    <CommandHeader logo="DEC-SYS">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/ops')">返回行动页</button>
      </template>
    </CommandHeader>

    <main class="decipher-main">
      <div class="console">
        <section class="scenario-card">
          <h2>频率警报</h2>
          <p>{{ scenario.clue }}</p>
          <p class="meta">虚拟时间：{{ virtualTimeLabel }} ｜ 降临倒计时：{{ scenario.countdownHour }} 小时</p>
          <p class="meta">难度：{{ scenario.difficulty === 'simple' ? '简单' : '进阶' }}</p>
        </section>

        <section class="step-card" :class="{ done: currentStep > 1 }">
          <h3>第一步：频率捕捉</h3>
          <p>根据线索判断实体五行属性。</p>
          <div class="btn-row">
            <button
              v-for="e in elements"
              :key="`guess-${e}`"
              type="button"
              class="small-btn"
              :class="{ active: guessedElement === e }"
              @click="guessedElement = e"
            >
              {{ elementButtonLabel[e] }}
            </button>
          </div>
          <button type="button" class="action-btn" @click="confirmStep1" :disabled="isDecoded">确认属性</button>
        </section>

        <section class="step-card" :class="{ locked: currentStep < 2, done: currentStep > 2 }">
          <h3>第二步：时空拨盘</h3>
          <p>将罗盘拨到目标降临时辰（{{ targetTimeLabel }}）。</p>
          <div class="dial">
            <button type="button" class="dial-btn" @click="rotateDial(-1)" :disabled="currentStep < 2 || isDecoded">◀</button>
            <div class="dial-window">{{ selectedBranch }}</div>
            <button type="button" class="dial-btn" @click="rotateDial(1)" :disabled="currentStep < 2 || isDecoded">▶</button>
          </div>
          <div class="branch-grid">
            <button
              v-for="(b, i) in branches"
              :key="`b-${b}`"
              type="button"
              class="branch-btn"
              :class="{ active: selectedBranchIndex === i }"
              @click="selectedBranchIndex = i"
              :disabled="currentStep < 2 || isDecoded"
            >
              {{ b }}
            </button>
          </div>
          <button type="button" class="action-btn" @click="confirmStep2" :disabled="currentStep < 2 || isDecoded">
            锁定时空通道
          </button>
        </section>

        <section class="step-card" :class="{ locked: currentStep < 3 }">
          <h3>第三步：属性覆盖</h3>
          <p>按五行相克注入中和能量。</p>
          <div class="btn-row">
            <button
              v-for="e in elements"
              :key="`inject-${e}`"
              type="button"
              class="inject-btn"
              :class="`el-${e}`"
              :disabled="currentStep < 3 || isDecoded"
              @click="confirmStep3(e)"
            >
              注入 {{ elementButtonLabel[e] }}
            </button>
          </div>
          <p v-if="selectedInject" class="meta">最近注入：{{ selectedInject }}</p>
        </section>

        <section class="log-card">
          <h3>终端日志</h3>
          <div class="logs">
            <div v-for="(line, idx) in logs" :key="idx" class="log-line">{{ line }}</div>
          </div>
        </section>

        <div v-if="isDecoded" class="victory">
          <h3>对位成功</h3>
          <p>时空共鸣预测任务完成。</p>
          <button @click="router.push('/ue-stc/ops')" class="action-btn">返回行动中心</button>
        </div>
      </div>

      <aside class="guide-panel">
        <h2>UE-STC 快速入门手册</h2>
        <p>
          新人，别被古文吓到。所谓“五行”只是高维能量的五种衰变态，“十二时辰”是地球磁场的十二段波动周期。
        </p>
        <p>你只需要记住：看线索判断属性，拨到正确时辰，再用克制属性覆盖即可。</p>

        <div class="memo-box">
          <h3>行动辅助备忘录（时辰对照）</h3>
          <p>23-01 子 ｜ 01-03 丑 ｜ 03-05 寅 ｜ 05-07 卯</p>
          <p>07-09 辰 ｜ 09-11 巳 ｜ 11-13 午 ｜ 13-15 未</p>
          <p>15-17 申 ｜ 17-19 酉 ｜ 19-21 戌 ｜ 21-23 亥</p>
        </div>

        <div class="memo-box">
          <h3>五行相克</h3>
          <p>金克木 ｜ 木克土 ｜ 土克水 ｜ 水克火 ｜ 火克金</p>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.command-decipher {
  min-height: 100vh;
  background: #03070f;
  color: #9de;
}

.decipher-main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
}

.console,
.guide-panel {
  background: rgba(0, 16, 30, 0.74);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  padding: 1rem;
}

.scenario-card,
.step-card,
.log-card {
  border: 1px solid rgba(0, 255, 255, 0.2);
  background: rgba(0, 10, 20, 0.55);
  padding: 0.8rem;
  margin-bottom: 0.8rem;
}

.step-card.locked {
  opacity: 0.55;
}

.step-card.done {
  border-color: rgba(120, 255, 120, 0.4);
}

h2,
h3 {
  margin: 0 0 0.5rem;
  color: #bff;
}

p {
  margin: 0 0 0.45rem;
  line-height: 1.6;
  font-size: 0.82rem;
}

.meta {
  color: #8fb;
  font-size: 0.78rem;
}

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.55rem;
}

.small-btn,
.action-btn,
.dial-btn,
.branch-btn,
.inject-btn {
  border: 1px solid #3a7;
  background: #0d2230;
  color: #9de;
  padding: 0.3rem 0.55rem;
  cursor: pointer;
  font-size: 0.78rem;
}

.small-btn.active,
.branch-btn.active {
  border-color: #7ff;
  color: #cff;
}

.action-btn:disabled,
.dial-btn:disabled,
.branch-btn:disabled,
.inject-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dial {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0.45rem 0;
}

.dial-window {
  min-width: 3.2rem;
  text-align: center;
  font-size: 1.1rem;
  color: #fff;
  border: 1px solid rgba(0, 255, 255, 0.4);
  background: #06111b;
  padding: 0.25rem 0.6rem;
}

.branch-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.35rem;
  margin: 0.55rem 0;
}

.inject-btn.el-木 {
  border-color: #49a85f;
}

.inject-btn.el-火 {
  border-color: #c74b4b;
}

.inject-btn.el-土 {
  border-color: #c7a34b;
}

.inject-btn.el-金 {
  border-color: #bfc6cf;
}

.inject-btn.el-水 {
  border-color: #3f6bb8;
}

.logs {
  max-height: 150px;
  overflow-y: auto;
}

.log-line {
  font-size: 0.78rem;
  color: #9cc;
  margin-bottom: 0.3rem;
}

.victory {
  border: 1px solid rgba(120, 255, 120, 0.45);
  background: rgba(8, 30, 12, 0.45);
  padding: 0.8rem;
}

.memo-box {
  margin-top: 0.7rem;
  border: 1px dashed rgba(0, 255, 255, 0.3);
  background: rgba(0, 8, 16, 0.55);
  padding: 0.55rem;
}

@media (max-width: 900px) {
  .decipher-main {
    grid-template-columns: 1fr;
  }

  .branch-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
