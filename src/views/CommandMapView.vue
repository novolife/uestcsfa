<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const QUEST_STORAGE = 'ue-stc-quest'
const POINTS_STORAGE = 'ue-stc-points'
const MAP_MISSION_STORAGE = 'ue-stc-map-mission'
const MAP_DONE_TASK_STORAGE = 'ue-stc-map-done-task'

const nodes = [
  { id: 0, x: 50, y: 50 },
  { id: 1, x: 50, y: 14 },
  { id: 2, x: 82, y: 32 },
  { id: 3, x: 82, y: 68 },
  { id: 4, x: 50, y: 86 },
  { id: 5, x: 18, y: 68 },
  { id: 6, x: 18, y: 32 },
]

const mission = ref({ mode: 'trainee', patternCount: 1, rewardPoints: 0 })
const phase = ref('idle') // idle/show/input/success
const targetIndex = ref(0)
const userInput = ref([])
const targets = ref([])
const terminalLines = ref(['> 测绘终端已连接。'])

function pushLine(msg) {
  terminalLines.value.push(msg)
}

function getEdges(seq) {
  const edges = []
  for (let i = 0; i < seq.length - 1; i++) {
    const a = seq[i]
    const b = seq[i + 1]
    const edge = Math.min(a, b) + '-' + Math.max(a, b)
    if (!edges.includes(edge)) edges.push(edge)
  }
  return edges
}

function randomSequence(length) {
  const seq = [Math.floor(Math.random() * 7)]
  while (seq.length < length) {
    const next = Math.floor(Math.random() * 7)
    if (next !== seq[seq.length - 1]) seq.push(next)
  }
  return seq
}

function buildTargets() {
  const list = []
  for (let i = 0; i < mission.value.patternCount; i++) {
    const isHard = mission.value.mode === 'containment'
    const len = isHard ? 6 + Math.floor(Math.random() * 2) : 5
    list.push(randomSequence(len))
  }
  targets.value = list
}

onMounted(() => {
  const saved = sessionStorage.getItem(MAP_MISSION_STORAGE)
  if (saved) {
    mission.value = JSON.parse(saved)
  }
  buildTargets()
  pushLine(`> 当前任务模式：${mission.value.mode}，图形数：${mission.value.patternCount}`)
  pushLine('> 规则：图形显示 3 秒后消失，请复原。')
})

function startRound() {
  phase.value = 'show'
  userInput.value = []
  pushLine(`> 正在显示第 ${targetIndex.value + 1}/${targets.value.length} 组图形...`)
  setTimeout(() => {
    phase.value = 'input'
    pushLine('> 图形已隐藏，请开始复原。')
  }, 3000)
}

function clickNode(nodeId) {
  if (phase.value !== 'input') return
  if (userInput.value.length > 0 && userInput.value[userInput.value.length - 1] === nodeId) return
  userInput.value.push(nodeId)

  const targetEdges = getEdges(targets.value[targetIndex.value])
  const inputEdges = getEdges(userInput.value)
  if (inputEdges.length !== targetEdges.length) return

  const ok = inputEdges.every((e) => targetEdges.includes(e))
  if (!ok) {
    pushLine('> 图形不匹配，当前轮次失败。')
    phase.value = 'idle'
    userInput.value = []
    return
  }

  pushLine(`> 第 ${targetIndex.value + 1} 组复原成功。`)
  targetIndex.value += 1
  if (targetIndex.value >= targets.value.length) {
    finishMission()
    return
  }
  phase.value = 'idle'
}

function finishMission() {
  phase.value = 'success'
  if (mission.value.taskId) {
    sessionStorage.setItem(MAP_DONE_TASK_STORAGE, mission.value.taskId)
  }
  if (mission.value.mode === 'trainee') {
    sessionStorage.setItem(QUEST_STORAGE, '1')
    pushLine('> 见习考核通过：你已转为正式调度员。')
  } else {
    const p = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
    const next = p + (mission.value.rewardPoints || 0)
    sessionStorage.setItem(POINTS_STORAGE, String(next))
    pushLine(`> 任务完成，积分 +${mission.value.rewardPoints}。`)
  }
  sessionStorage.removeItem(MAP_MISSION_STORAGE)
}

function resetInput() {
  userInput.value = []
}

function generatePolyline(seq) {
  if (!seq || seq.length === 0) return ''
  return seq.map((id) => {
    const n = nodes.find((x) => x.id === id)
    return `${n.x},${n.y}`
  }).join(' ')
}

const showPolyline = computed(() => {
  if (phase.value === 'show') return generatePolyline(targets.value[targetIndex.value])
  if (phase.value === 'input' || phase.value === 'success') return generatePolyline(userInput.value)
  return ''
})
</script>

<template>
  <div class="command-map">
    <CommandHeader logo="MAP-SYS">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/dashboard')">返回面板</button>
      </template>
    </CommandHeader>

    <main class="map-main">
      <div class="terminal-panel">
        <div v-for="(line, idx) in terminalLines" :key="idx" class="term-line">{{ line }}</div>
        
        <div class="action-row" v-if="phase === 'idle'">
          <button class="action-btn" @click="startRound">
            开始第 {{ targetIndex + 1 }}/{{ targets.length }} 组
          </button>
        </div>
        
        <div class="action-row" v-if="phase === 'input'">
          <button class="action-btn" @click="resetInput">重置输入</button>
        </div>

        <div v-if="phase === 'success'" class="success-box">
          >> 当前测绘任务已完成
          <button @click="router.push('/ue-stc/ops')" class="return-btn">返回行动页</button>
        </div>
      </div>

      <div class="radar-container">
        <svg viewBox="0 0 100 100" class="radar-svg">
          <!-- 背景连接线 (暗色) -->
          <g class="bg-edges">
            <line v-for="i in 6" :key="'outer'+i"
                  :x1="nodes[i].x" :y1="nodes[i].y"
                  :x2="nodes[i===6 ? 1 : i+1].x" :y2="nodes[i===6 ? 1 : i+1].y" />
            <line v-for="i in 6" :key="'inner'+i"
                  :x1="nodes[0].x" :y1="nodes[0].y"
                  :x2="nodes[i].x" :y2="nodes[i].y" />
          </g>
          
          <!-- 绘制的线 -->
          <polyline 
            :points="showPolyline" 
            class="connect-line" 
            :class="{ 'show-mode': phase === 'show', 'done-mode': phase === 'success' }"
          />

          <!-- 节点 -->
          <g v-for="node in nodes" :key="node.id" 
             @click="clickNode(node.id)" 
             class="node-group"
             :class="{ 
               active: userInput.includes(node.id) || (phase==='show' && targets[targetIndex]?.includes(node.id)),
               clickable: phase === 'input'
             }">
            <circle :cx="node.x" :cy="node.y" r="4" class="node-touch-area" />
            <circle :cx="node.x" :cy="node.y" r="1.5" class="node-circle" />
          </g>
        </svg>
      </div>
    </main>
  </div>
</template>

<style scoped>
.command-map {
  min-height: 100vh;
  background: #0a0a0a;
  color: #6a6;
  font-family: 'Fira Code', monospace;
}

.map-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.terminal-panel {
  background: rgba(10, 30, 10, 0.5);
  border: 1px solid #131;
  padding: 1rem;
  min-height: 140px;
  border-radius: 4px;
}

.term-line {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #8c8;
}

.action-row {
  margin-top: 1rem;
}

.action-btn {
  background: #131;
  border: 1px solid #4a4;
  color: #6a6;
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #4a4;
  color: #000;
}

.success-box {
  margin-top: 1rem;
  color: #0f0;
  font-weight: bold;
}

.return-btn {
  margin-left: 1rem;
  background: #131;
  border: 1px solid #4a4;
  color: #6a6;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.return-btn:hover {
  background: #4a4;
  color: #000;
}

.radar-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  aspect-ratio: 1;
  background: #050a05;
  border: 2px solid #131;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1) inset;
}

.radar-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.bg-edges line {
  stroke: rgba(0, 255, 0, 0.1);
  stroke-width: 0.5;
}

.connect-line {
  fill: none;
  stroke: #4a4;
  stroke-width: 1.5;
  stroke-linejoin: round;
  stroke-linecap: round;
  transition: stroke 0.3s;
}

.connect-line.show-mode {
  stroke: #ffaa00;
  filter: drop-shadow(0 0 2px #ffaa00);
}

.connect-line.done-mode {
  stroke: #0f0;
  filter: drop-shadow(0 0 3px #0f0);
}

.node-group {
  outline: none;
}

.node-group.clickable {
  cursor: pointer;
}

.node-touch-area {
  fill: transparent;
}

.node-circle {
  fill: #131;
  stroke: #4a4;
  stroke-width: 0.5;
  transition: all 0.3s;
}

.node-group.clickable:hover .node-circle {
  fill: #4a4;
  r: 2.5;
}

.node-group.active .node-circle {
  fill: #0f0;
  stroke: #fff;
  r: 2;
  filter: drop-shadow(0 0 2px #0f0);
}
</style>
