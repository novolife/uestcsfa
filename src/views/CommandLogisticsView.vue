<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'
import { approveEmergencyDispatch, checkEmergencyTimeout, failEmergency, readEmergency } from '@/utils/emergencyComm'

const router = useRouter()
const QUEST_STORAGE = 'ue-stc-quest'
const INVENTORY_STORAGE = 'ue-stc-inventory'
const POINTS_STORAGE = 'ue-stc-points'

const inputCode = ref('')
const outputLines = ref([
  'LOGISTICS TERMINAL v1.2.4',
  '=========================',
  '欢迎使用物资调配系统（兑换后进入库存）。',
  '',
  '请输入物资代码进行兑换:'
])
const inventory = ref([])
const points = ref(0)
const inputRef = ref(null)
const emergency = ref(null)
const showSuccessAction = ref(false)

const catalog = [
  { name: '三型阻尼器', sku: 'DMP-III-884' },
  { name: '偏振锚栓', sku: 'PAB-44X-12' },
  { name: '局域相位笼', sku: 'LPC-9A-770' },
  { name: '战术 EMP 模组', sku: 'EMP-01' },
  { name: '应急医疗包', sku: 'MED-77' },
]

onMounted(() => {
  const q = parseInt(sessionStorage.getItem(QUEST_STORAGE) || '0', 10)
  if (q === 0) {
    router.replace('/ue-stc/ops')
    return
  }
  inventory.value = JSON.parse(sessionStorage.getItem(INVENTORY_STORAGE) || '[]')
  points.value = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
  emergency.value = checkEmergencyTimeout() || readEmergency()
  outputLines.value.push(`当前积分: ${points.value}`)
  if (emergency.value?.status === 'active') {
    outputLines.value.push(`!!! 紧急审批中：${emergency.value.itemName} / SKU ${emergency.value.sku}`)
  }
  
  const claimedTasks = JSON.parse(sessionStorage.getItem('ue-stc-claimed-tasks') || '[]')
  if (claimedTasks.some(t => t.type === '【极秘指令】零号基站物资调配' && t.status !== '已完成')) {
    outputLines.value.push(`[系统提示] 接收到零号基站的极秘物资调配请求，需手动输入调度代码：DMP-X-000`)
  }

  // 聚焦输入框
  if (inputRef.value) inputRef.value.focus()
})

function playAlarm() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  for(let i=0; i<15; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = i % 2 === 0 ? 1200 : 800
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    gain.gain.value = 0.05
    
    osc.start(ctx.currentTime + i * 0.1)
    osc.stop(ctx.currentTime + i * 0.1 + 0.08)
  }
}

function submitCode() {
  const code = inputCode.value.trim().toUpperCase()
  if (!code) return
  
  outputLines.value.push(`> ${code}`)
  inputCode.value = ''

  if (code === 'DMP-X-000') {
    playAlarm()
    const receipt = [
      { text: '[ERROR] CONFLICT IN REQUISITION PROTOCOL', type: 'error' },
      '- - - - - - - - - - - - - - - -',
      'UPLOAD RECEIPT #99812',
      'TYPE: BIOMETRIC ANCHOR',
      'TARGET: ZERO-NODE',
      '- - - - - - - - - - - - - - - -',
      'SUBJECT: DISPATCHER-11',
      'BRAINWAVE_FREQ: 14.8Hz (BETA)',
      'RESONANCE_LVL: 98.7%',
      'MASS_EXCHANGE: IN PROGRESS...',
      '[=======>            ] 41%',
      '- - - - - - - - - - - - - - - -',
      { text: '//警告：质量置换不守恒。我们送出去的不是武器，他们在用武器的质量构建【坐标锚点】。去看看你的地图。校验码：[FRACTAL-7]', type: 'glitch-text error' }
    ]
    
    let i = 0
    inputRef.value.disabled = true // 临时禁用输入
    const printInterval = setInterval(() => {
      if (i < receipt.length) {
        outputLines.value.push(receipt[i])
        scrollToBottom()
        i++
      } else {
        clearInterval(printInterval)
        if (inputRef.value) inputRef.value.disabled = false
        // 更新极秘任务状态
        const claimed = JSON.parse(sessionStorage.getItem('ue-stc-claimed-tasks') || '[]')
        const specialTask = claimed.find(t => t.type === '【极秘指令】零号基站物资调配')
        if (specialTask) {
          specialTask.status = '已完成'
          sessionStorage.setItem('ue-stc-claimed-tasks', JSON.stringify(claimed))
        }
      }
    }, 200)
    return
  }

  emergency.value = checkEmergencyTimeout() || readEmergency()
  if (emergency.value?.status === 'active') {
    if (code === emergency.value.sku) {
      inventory.value.push(code)
      sessionStorage.setItem(INVENTORY_STORAGE, JSON.stringify(inventory.value))
      emergency.value = approveEmergencyDispatch()
      outputLines.value.push(`紧急审批通过: [${code}] 已出库，等待通信终端交付。`)
      showSuccessAction.value = true
      scrollToBottom()
      return
    }
    emergency.value = failEmergency('wrong_code')
    outputLines.value.push('警报：SKU 错误导致调拨失败，干员状态变为 MIA。')
    scrollToBottom()
    return
  }

  if (catalog.some((x) => x.sku === code)) {
    inventory.value.push(code)
    sessionStorage.setItem(INVENTORY_STORAGE, JSON.stringify(inventory.value))
    outputLines.value.push(`兑换成功: [${code}] 已加入库存`)
    showSuccessAction.value = true
  } else {
    outputLines.value.push(`未找到代码为 [${code}] 的物资记录。`)
  }
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    const term = document.querySelector('.pos-screen')
    if (term) term.scrollTop = term.scrollHeight
  })
}
</script>

<template>
  <div class="command-logistics">
    <CommandHeader logo="LOG-SYS">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/ops')">返回行动页</button>
      </template>
    </CommandHeader>

    <main class="logistics-main">
      <div class="catalog-panel">
        <h3>战术装备名录</h3>
        <div class="catalog-row" v-for="item in catalog" :key="item.sku">
          <span>{{ item.name }}</span>
          <span>{{ item.sku }}</span>
        </div>
      </div>
      <div class="pos-machine">
        <div class="pos-screen">
          <div v-for="(line, idx) in outputLines" :key="idx" class="pos-line" :class="typeof line === 'object' ? line.type : ''">
            {{ typeof line === 'object' ? line.text : line }}
          </div>
          
          <div class="input-line">
            <span class="prompt">></span>
            <input 
              ref="inputRef"
              v-model="inputCode" 
              @keydown.enter="submitCode"
              class="pos-input" 
              type="text" 
              autocomplete="off" 
              spellcheck="false"
            />
          </div>
          
          <div class="success-action" v-if="showSuccessAction">
            <button @click="router.push('/ue-stc/comms')" class="return-btn">前往通信终端</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.command-logistics {
  min-height: 100vh;
  background: #111;
  color: #ffaa00;
  font-family: 'Courier New', Courier, monospace;
}

.logistics-main {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}

.catalog-panel {
  margin-bottom: 1rem;
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 0.75rem;
}

.catalog-panel h3 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: #ffcb73;
}

.catalog-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: #b89554;
  padding: 0.15rem 0;
}

.pos-machine {
  background: #222;
  padding: 2rem;
  border-radius: 8px;
  border: 4px solid #333;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,1);
}

.pos-screen {
  background: #050500;
  border: 2px solid #ffaa00;
  padding: 1rem;
  height: 400px;
  overflow-y: auto;
  text-shadow: 0 0 5px rgba(255, 170, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.pos-screen::-webkit-scrollbar {
  width: 8px;
}
.pos-screen::-webkit-scrollbar-thumb {
  background: #ffaa00;
}

.pos-line {
  margin-bottom: 0.5rem;
  word-wrap: break-word;
}

.input-line {
  display: flex;
  margin-top: 1rem;
}

.prompt {
  margin-right: 0.5rem;
}

.pos-input {
  background: transparent;
  border: none;
  color: #ffaa00;
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  outline: none;
  text-shadow: inherit;
}

.pos-input:focus {
  outline: none;
}

.error {
  color: #ff3333;
  font-weight: bold;
}

.glitch-text {
  animation: log-glitch 0.2s linear infinite;
  text-shadow: 2px 0 red, -2px 0 blue;
}

@keyframes log-glitch {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 1px) }
  40% { transform: translate(2px, -1px) }
  60% { transform: translate(-1px, 2px) }
  80% { transform: translate(1px, -2px) }
  100% { transform: translate(0) }
}

.success-action {
  margin-top: 2rem;
  color: #0f0;
  text-shadow: 0 0 5px rgba(0,255,0,0.5);
}

.return-btn {
  margin-left: 1rem;
  background: #0f0;
  color: #000;
  border: none;
  padding: 0.25rem 0.5rem;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
}
.return-btn:hover {
  background: #fff;
}
</style>
