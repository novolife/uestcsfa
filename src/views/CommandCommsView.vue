<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'
import { checkEmergencyTimeout, readEmergency, resolveEmergency } from '@/utils/emergencyComm'

const router = useRouter()
const INVENTORY_STORAGE = 'ue-stc-inventory'

const contacts = [
  { id: 'ops', name: '行动调度台' },
  { id: 'agent', name: '前线干员-Δ7' },
  { id: 'logi', name: '后勤审批机器人' },
]

const selectedContact = ref('agent')
const emergency = ref(null)
const inventory = ref([])
const now = ref(Date.now())
let timer = null

const countdownMs = computed(() => {
  if (!emergency.value || emergency.value.status !== 'active') return 0
  return Math.max(0, emergency.value.deadlineAt - now.value)
})

const countdownLabel = computed(() => {
  const total = Math.floor(countdownMs.value / 1000)
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')
  return `${mm}:${ss}`
})

const canDeliver = computed(() => {
  if (!emergency.value) return false
  return emergency.value.status === 'approved' && inventory.value.includes(emergency.value.sku)
})

const chatLines = computed(() => {
  if (selectedContact.value === 'ops') {
    return [
      { from: '系统', text: '这里是行动调度台。处理中的任务将同步在行动页。' },
      { from: '系统', text: '需要执行任务请返回行动中心。' },
    ]
  }
  if (selectedContact.value === 'logi') {
    return [
      { from: '后勤机器人', text: '请先在物资调配终端完成 SKU 录入。' },
      { from: '后勤机器人', text: '审批完成后，返回本终端执行交付调拨。' },
    ]
  }

  if (!emergency.value) {
    return [{ from: '前线干员-Δ7', text: '信道稳定。当前无紧急求援。' }]
  }

  if (emergency.value.status === 'failed') {
    return [
      { from: '前线干员-Δ7', text: emergency.value.text },
      { from: '系统', text: `通信失效，干员状态：${emergency.value.agentStatus}` },
    ]
  }

  if (emergency.value.status === 'resolved') {
    return [
      { from: '前线干员-Δ7', text: '已收到补给，侵入波次暂时被压制。' },
      { from: '系统', text: '紧急通信已闭环。' },
    ]
  }

  const lines = [
    { from: '前线干员-Δ7', text: emergency.value.text },
    { from: '系统', text: `目标物资：${emergency.value.itemName} / SKU: ${emergency.value.sku}` },
  ]
  if (emergency.value.status === 'approved') {
    lines.push({ from: '系统', text: '出库审批已通过，请立即执行交付调拨。' })
  } else {
    lines.push({ from: '系统', text: '等待后勤终端审批 SKU。' })
  }
  return lines
})

function syncState() {
  emergency.value = checkEmergencyTimeout() || readEmergency()
  inventory.value = JSON.parse(sessionStorage.getItem(INVENTORY_STORAGE) || '[]')
}

function deliverToAgent() {
  if (!canDeliver.value) return
  inventory.value = inventory.value.filter((x) => x !== emergency.value.sku)
  sessionStorage.setItem(INVENTORY_STORAGE, JSON.stringify(inventory.value))
  emergency.value = resolveEmergency()
}

onMounted(() => {
  syncState()
  timer = setInterval(() => {
    now.value = Date.now()
    syncState()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="command-comms">
    <CommandHeader logo="COMMS-TERM">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/ops')">返回行动页</button>
      </template>
    </CommandHeader>

    <main class="comms-main">
      <aside class="contacts">
        <button
          v-for="c in contacts"
          :key="c.id"
          type="button"
          class="contact-item"
          :class="{ active: selectedContact === c.id }"
          @click="selectedContact = c.id"
        >
          {{ c.name }}
        </button>
      </aside>

      <section class="chat-area">
        <div class="chat-head">
          <h2>{{ contacts.find((c) => c.id === selectedContact)?.name }}</h2>
          <span v-if="emergency && emergency.status === 'active'" class="danger-timer">生存倒计时 {{ countdownLabel }}</span>
        </div>
        <div class="chat-body">
          <div v-for="(line, idx) in chatLines" :key="idx" class="line">
            <span class="from">{{ line.from }}:</span>
            <span>{{ line.text }}</span>
          </div>
        </div>
        <div class="chat-actions" v-if="selectedContact === 'agent'">
          <button type="button" class="action-btn" @click="router.push('/ue-stc/logistics')">前往后勤终端审批</button>
          <button type="button" class="action-btn strong" :disabled="!canDeliver" @click="deliverToAgent">交付调拨</button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.command-comms { min-height: 100vh; background: #0a0a0a; color: #8b8b8b; }
.comms-main { max-width: 980px; margin: 0 auto; padding: 1rem; display: grid; grid-template-columns: 240px 1fr; gap: 1rem; }
.contacts { border: 1px solid #222; background: #0d0d0d; padding: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem; }
.contact-item { text-align: left; background: #141414; border: 1px solid #2e2e2e; color: #808080; padding: 0.55rem; cursor: pointer; }
.contact-item.active { border-color: #4a4; color: #a6c8a6; }
.chat-area { border: 1px solid #222; background: #101010; display: flex; flex-direction: column; min-height: 520px; }
.chat-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; padding: 0.75rem; }
.chat-head h2 { font-size: 0.9rem; color: #b6b6b6; }
.danger-timer { color: #f58888; font-size: 0.8rem; }
.chat-body { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.line { font-size: 0.82rem; line-height: 1.65; color: #7a7a7a; }
.from { color: #a7a7a7; margin-right: 0.3rem; }
.chat-actions { border-top: 1px solid #222; padding: 0.75rem; display: flex; gap: 0.5rem; }
.action-btn { background: #1a1a1a; border: 1px solid #333; color: #8b8b8b; padding: 0.4rem 0.75rem; cursor: pointer; }
.action-btn.strong { border-color: #4a4; color: #90c790; }
.action-btn:disabled { opacity: 0.45; cursor: not-allowed; }
@media (max-width: 800px) {
  .comms-main { grid-template-columns: 1fr; }
}
</style>
