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
const stem = ref('壬')
const branch = ref('子')
const base = ref('hex')
const codeInput = ref('')
const isDecoded = ref(false)

const energyInfo = ref({
  timestamp: '2026-03-12 21:40:00',
  anomaly: '高热 / 爆裂',
  wuxing: '火',
})

const logs = ref([
  '[系统] 时空共鸣预测模块已接入。',
  '[系统] UE降临规律已与干支历法模型建立映射。',
  '[任务] 请完成：参数收集 -> 干支推演 -> 代码解密。',
])

const targetGanzhi = computed(() => {
  // 当前异常属性为火，按照五行生克以水克火
  return '壬子'
})

const targetCode = computed(() => {
  return base.value === 'hex' ? '5850' : '130120'
})

onMounted(() => {
  if (!sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc')
    return
  }
  const raw = sessionStorage.getItem(DECIPHER_MISSION_STORAGE)
  if (raw) {
    mission.value = JSON.parse(raw)
  } else {
    // 非任务入口时回退
    router.replace('/ue-stc/ops')
  }
})

function submitDecode() {
  const selectedGanzhi = `${stem.value}${branch.value}`
  const code = codeInput.value.trim().toLowerCase()
  if (!code) return

  logs.value.push(`> 推演结果: ${selectedGanzhi} / 编码制式: ${base.value} / 代码: ${code}`)
  codeInput.value = ''

  if (selectedGanzhi !== targetGanzhi.value) {
    logs.value.push('[失败] 干支推演错误。提示：当前为火性异常，请选择可制火的水相干支。')
    return
  }

  if (code !== targetCode.value.toLowerCase()) {
    logs.value.push(`[失败] 代码映射错误。提示：${targetGanzhi.value} 在当前制式应映射为 ${targetCode.value}。`)
    return
  }

  const current = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
  sessionStorage.setItem(POINTS_STORAGE, String(current + (mission.value.rewardPoints || 10)))
  if (mission.value.taskId) {
    sessionStorage.setItem(DECIPHER_DONE_TASK_STORAGE, mission.value.taskId)
  }

  logs.value.push('[成功] 共振参数匹配，时空薄弱点已锁定。')
  logs.value.push('[坐标] 30.6776 N, 104.0986 E')
  logs.value.push('[时间窗] 2026-03-13 23:00-23:20（子时）')
  logs.value.push(`[任务完成] 时空共鸣预测 +${mission.value.rewardPoints || 10} 积分`)
  isDecoded.value = true
}
</script>

<template>
  <div class="command-decipher">
    <CommandHeader logo="DEC-SYS">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/ops')">返回行动页</button>
      </template>
    </CommandHeader>

    <main class="decipher-main">
      <div class="star-bg"></div>

      <div class="console">
        <section class="param-panel">
          <h2>参数收集</h2>
          <p>侦测时间戳：{{ energyInfo.timestamp }}</p>
          <p>异常能量：{{ energyInfo.anomaly }}（五行属{{ energyInfo.wuxing }}）</p>
          <p>推演原则：以五行生克制化，寻找可压制当前属性的干支窗口。</p>
        </section>

        <div class="logs">
          <div v-for="(line, idx) in logs" :key="idx" class="log-line">
            {{ line }}
          </div>
        </div>

        <div class="input-area" v-if="!isDecoded">
          <div class="pickers">
            <label>天干
              <select v-model="stem" class="picker">
                <option>甲</option><option>乙</option><option>丙</option><option>丁</option><option>戊</option>
                <option>己</option><option>庚</option><option>辛</option><option>壬</option><option>癸</option>
              </select>
            </label>
            <label>地支
              <select v-model="branch" class="picker">
                <option>子</option><option>丑</option><option>寅</option><option>卯</option><option>辰</option><option>巳</option>
                <option>午</option><option>未</option><option>申</option><option>酉</option><option>戌</option><option>亥</option>
              </select>
            </label>
            <label>编码制式
              <select v-model="base" class="picker">
                <option value="hex">十六进制</option>
                <option value="oct">八进制</option>
              </select>
            </label>
          </div>
          <div class="decode-line">
            <span class="blinking-cursor">_</span>
            <input
              v-model="codeInput"
              @keydown.enter="submitDecode"
              type="text"
              class="decipher-input"
              :placeholder="base === 'hex' ? '输入十六进制代码' : '输入八进制代码'"
              autocomplete="off"
            />
            <button @click="submitDecode" class="action-btn">解密坐标</button>
          </div>
        </div>

        <div v-if="isDecoded" class="victory">
          <h3>★★★ 破译成功 ★★★</h3>
          <p>下一次实体降临坐标已生成拦截任务。</p>
          <button @click="router.push('/ue-stc/ops')" class="action-btn">返回行动中心</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.command-decipher {
  min-height: 100vh;
  background: #03070f;
  color: #0ff;
  font-family: 'Fira Code', 'SimSun', monospace;
  position: relative;
  overflow: hidden;
}

.star-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 760px;
  height: 760px;
  transform: translate(-50%, -50%);
  border: 1px dashed rgba(0, 255, 255, 0.18);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: spin 70s linear infinite;
  background:
    radial-gradient(circle, rgba(0, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 65%),
    repeating-conic-gradient(from 0deg, rgba(0, 255, 255, 0.05) 0 8deg, rgba(0, 0, 0, 0) 8deg 16deg);
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.decipher-main {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 3rem auto;
  padding: 1rem;
}

.console {
  background: rgba(0, 20, 35, 0.78);
  border: 1px solid #0ff;
  box-shadow: 0 0 24px rgba(0, 255, 255, 0.25);
  padding: 2rem;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.param-panel {
  margin-bottom: 1.2rem;
  padding: 0.75rem;
  border: 1px solid rgba(0, 255, 255, 0.25);
  background: rgba(0, 12, 25, 0.55);
}

.param-panel h2 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
}

.param-panel p {
  margin: 0.25rem 0;
  font-size: 0.82rem;
}

.logs {
  margin-bottom: 1.2rem;
  min-height: 200px;
}

.log-line {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  text-shadow: 0 0 2px #0ff;
}

.input-area {
  display: grid;
  gap: 0.8rem;
  border-top: 1px solid rgba(0, 255, 255, 0.3);
  padding-top: 1rem;
}

.pickers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.pickers label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
}

.picker {
  background: rgba(0, 20, 30, 0.7);
  color: #9ff;
  border: 1px solid rgba(0, 255, 255, 0.4);
  padding: 0.2rem 0.35rem;
}

.decode-line {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.blinking-cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.decipher-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #0ff;
  color: #0ff;
  font-family: inherit;
  font-size: 1.1rem;
  padding: 0.25rem;
  width: 180px;
  outline: none;
  text-align: center;
}

.action-btn {
  background: transparent;
  border: 1px solid #0ff;
  color: #0ff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.action-btn:hover {
  background: #0ff;
  color: #000;
  box-shadow: 0 0 10px #0ff;
}

.victory {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px dashed #0ff;
}

.victory h3 {
  color: #fff;
  text-shadow: 0 0 10px #0ff;
  margin-bottom: 1rem;
}

.victory p {
  margin-bottom: 2rem;
}

@media (max-width: 640px) {
  .decipher-main {
    margin: 1rem auto;
    padding: 0.75rem;
  }

  .console {
    padding: 1rem;
  }

  .decode-line {
    flex-wrap: wrap;
  }
}
</style>
