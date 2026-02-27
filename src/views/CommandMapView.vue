<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const QUEST_STORAGE = 'ue-stc-quest'
const POINTS_STORAGE = 'ue-stc-points'
const MAP_MISSION_STORAGE = 'ue-stc-map-mission'
const MAP_DONE_TASK_STORAGE = 'ue-stc-map-done-task'

const baseNodes = [
  { id: 0, x: 50, y: 50 },
  { id: 1, x: 50, y: 14 },
  { id: 2, x: 82, y: 32 },
  { id: 3, x: 82, y: 68 },
  { id: 4, x: 50, y: 86 },
  { id: 5, x: 18, y: 68 },
  { id: 6, x: 18, y: 32 },
]

const hardExtraNodes = [
  { id: 7, x: 66, y: 41 },
  { id: 8, x: 66, y: 59 },
  { id: 9, x: 34, y: 41 },
  { id: 10, x: 34, y: 59 },
]

const basicEdges = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]
]

const hardEdges = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
  [0, 1], [0, 4],
  [0, 7], [7, 2],
  [0, 8], [8, 3],
  [0, 9], [9, 6],
  [0, 10], [10, 5],
  [1, 7], [7, 8], [8, 4], [4, 10], [10, 9], [9, 1]
]

const mission = ref({ mode: 'trainee', patternCount: 1, patternPlan: ['simple'], rewardPoints: 0 })
const phase = ref('idle')
const targetIndex = ref(0)
const userInput = ref([])
const targets = ref([])
const targetModes = ref([])
const terminalLines = ref(['> 测绘终端已连接。'])

const currentPatternMode = computed(() => targetModes.value[targetIndex.value] || 'simple')
const isHardGraph = computed(() => currentPatternMode.value === 'hard')
const activeNodes = computed(() => (isHardGraph.value ? [...baseNodes, ...hardExtraNodes] : baseNodes))

const activeBgEdges = computed(() => {
  const edges = isHardGraph.value ? hardEdges : basicEdges
  return edges.map(([u, v]) => {
    const p1 = activeNodes.value.find((n) => n.id === u)
    const p2 = activeNodes.value.find((n) => n.id === v)
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y }
  })
})

function pushLine(msg) {
  terminalLines.value.push(msg)
}

function getEdgeStr(a, b) {
  return Math.min(a, b) + '-' + Math.max(a, b)
}

function getEdges(seq) {
  const edges = []
  for (let i = 0; i < seq.length - 1; i++) {
    edges.push(getEdgeStr(seq[i], seq[i + 1]))
  }
  return Array.from(new Set(edges))
}

function buildAdjacency(edges) {
  const adj = new Map()
  for (const [u, v] of edges) {
    if (!adj.has(u)) adj.set(u, [])
    if (!adj.has(v)) adj.set(v, [])
    adj.get(u).push(v)
    adj.get(v).push(u)
  }
  return adj
}

function generateValidPath(length, isHard) {
  const edges = isHard ? hardEdges : basicEdges
  const adj = buildAdjacency(edges)
  const nodeIds = Array.from(adj.keys())

  for (let attempt = 0; attempt < 500; attempt++) {
    const startNode = nodeIds[Math.floor(Math.random() * nodeIds.length)]
    const path = [startNode]
    const usedEdges = new Set()

    let current = startNode
    let stuck = false
    while (path.length < length) {
      const neighbors = adj.get(current) || []
      const validNeighbors = neighbors.filter((n) => !usedEdges.has(getEdgeStr(current, n)))

      if (validNeighbors.length === 0) {
        stuck = true
        break
      }

      const next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
      usedEdges.add(getEdgeStr(current, next))
      path.push(next)
      current = next
    }
    if (!stuck) return path
  }
  return [0, 1, 2, 3, 4].slice(0, length)
}

function buildTargets() {
  const plan = Array.isArray(mission.value.patternPlan) && mission.value.patternPlan.length > 0
    ? mission.value.patternPlan
    : Array(mission.value.patternCount || 1).fill(mission.value.mode === 'containment' ? 'hard' : 'simple')
  targetModes.value = plan

  const list = []
  for (let i = 0; i < plan.length; i++) {
    const isHard = plan[i] === 'hard'
    const len = isHard ? 6 + Math.floor(Math.random() * 3) : 5 + Math.floor(Math.random() * 2)
    list.push(generateValidPath(len, isHard))
  }
  targets.value = list
}

onMounted(() => {
  const saved = sessionStorage.getItem(MAP_MISSION_STORAGE)
  if (saved) {
    mission.value = JSON.parse(saved)
  }
  buildTargets()
  pushLine(`> 当前任务模式：${mission.value.mode}，图形数：${targets.value.length}`)
  const hardCount = targetModes.value.filter((m) => m === 'hard').length
  if (hardCount > 0) {
    pushLine(`> 本次包含困难测绘 ${hardCount} 组（扩展顶点已启用）。`)
  }
  pushLine('> 规则：图形显示 3 秒后消失，请复原。')
})

function startRound() {
  phase.value = 'show'
  userInput.value = []
  const label = currentPatternMode.value === 'hard' ? '困难测绘' : '简单测绘'
  pushLine(`> 正在显示第 ${targetIndex.value + 1}/${targets.value.length} 组（${label}）...`)
  setTimeout(() => {
    phase.value = 'input'
    pushLine('> 图形已隐藏，请开始复原。')
  }, 3000)
}

function clickNode(nodeId) {
  if (phase.value !== 'input') return

  const len = userInput.value.length
  if (len > 0 && userInput.value[len - 1] === nodeId) return

  if (len > 0) {
    const lastNode = userInput.value[len - 1]
    const edgeKey = getEdgeStr(lastNode, nodeId)
    const validEdges = isHardGraph.value ? hardEdges : basicEdges
    const isValidAdjacency = validEdges.some((e) => getEdgeStr(e[0], e[1]) === edgeKey)
    if (!isValidAdjacency) return 

    const currentEdges = getEdges(userInput.value)
    if (currentEdges.includes(edgeKey)) return 
  }

  userInput.value.push(nodeId)

  if (userInput.value.length === 1) return

  const targetEdgeSet = new Set(getEdges(targets.value[targetIndex.value]))
  const inputEdges = getEdges(userInput.value)

  const lastEdge = inputEdges[inputEdges.length - 1]
  if (!targetEdgeSet.has(lastEdge)) {
    pushLine('> 错误：检测到偏离目标轨迹的连接。当前轮次崩溃。')
    phase.value = 'idle'
    userInput.value = []
    return
  }

  if (inputEdges.length === targetEdgeSet.size) {
    pushLine(`> 第 ${targetIndex.value + 1} 组复原成功。`)
    targetIndex.value += 1
    if (targetIndex.value >= targets.value.length) {
      finishMission()
    } else {
      phase.value = 'idle'
    }
  }
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
    const n = activeNodes.value.find((x) => x.id === id)
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
            开始第 {{ targetIndex + 1 }}/{{ targets.length }} 组（{{ currentPatternMode === 'hard' ? '困难' : '简单' }}）
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
                  :x1="baseNodes[i].x" :y1="baseNodes[i].y"
                  :x2="baseNodes[i===6 ? 1 : i+1].x" :y2="baseNodes[i===6 ? 1 : i+1].y" />
            <line v-for="i in 6" :key="'inner'+i"
                  :x1="baseNodes[0].x" :y1="baseNodes[0].y"
                  :x2="baseNodes[i].x" :y2="baseNodes[i].y" />
            <line v-if="isHardGraph" x1="50" y1="50" x2="66" y2="41" />
            <line v-if="isHardGraph" x1="50" y1="50" x2="66" y2="59" />
            <line v-if="isHardGraph" x1="50" y1="50" x2="34" y2="41" />
            <line v-if="isHardGraph" x1="50" y1="50" x2="34" y2="59" />
          </g>
          
          <!-- 绘制的线 -->
          <polyline 
            :points="showPolyline" 
            class="connect-line" 
            :class="{ 'show-mode': phase === 'show', 'done-mode': phase === 'success' }"
          />

          <!-- 节点 -->
          <g v-for="node in activeNodes" :key="node.id"
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
