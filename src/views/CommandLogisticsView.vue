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
  // 聚焦输入框
  if (inputRef.value) inputRef.value.focus()
})

function submitCode() {
  const code = inputCode.value.trim().toUpperCase()
  if (!code) return
  
  outputLines.value.push(`> ${code}`)
  inputCode.value = ''

  emergency.value = checkEmergencyTimeout() || readEmergency()
  if (emergency.value?.status === 'active') {
    if (code === emergency.value.sku) {
      inventory.value.push(code)
      sessionStorage.setItem(INVENTORY_STORAGE, JSON.stringify(inventory.value))
      emergency.value = approveEmergencyDispatch()
      outputLines.value.push(`紧急审批通过: [${code}] 已出库，等待通信终端交付。`)
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
          <div v-for="(line, idx) in outputLines" :key="idx" class="pos-line">
            {{ line }}
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
          
          <div class="success-action">
            <button @click="router.push('/ue-stc/ops')" class="return-btn">返回行动页交付物资</button>
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
