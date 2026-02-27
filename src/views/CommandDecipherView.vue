<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const QUEST_STORAGE = 'ue-stc-quest'

const inputCode = ref('')
const logs = ref([
  '[系统] 时空频率破译模块已启动',
  '[系统] 正在捕捉高维能量波动...',
  '[警告] 检测到高维实体降临倒计时：14:59:59',
  '[情报] 屏障属性分析完成：【火】属性高维屏障',
  '-----------------------------------------',
  '【查阅机密档案：五行生克与干支映射】',
  '天干：甲乙(木) 丙丁(火) 戊己(土) 庚辛(金) 壬癸(水)',
  '地支：亥子(水) 寅卯(木) 巳午(火) 申酉(金) 辰戌丑未(土)',
  '破译原则：以水克火，寻找纯水属性坐标。',
  '-----------------------------------------',
  '请输入破译坐标 (格式: 天干地支，如"甲子"):'
])
const isDecoded = ref(false)

function submitDecode() {
  const val = inputCode.value.trim()
  if (!val) return
  
  logs.value.push(`> 注入频段：${val}`)
  inputCode.value = ''

  // 纯水属性：壬子 (Ren Zi) 或 癸亥 (Gui Hai)
  if (val === '壬子' || val === '癸亥') {
    logs.value.push('[成功] 频率共振匹配！屏障已溶解。')
    logs.value.push('[系统] 获得实体精准空间坐标：30.75 N, 103.93 E')
    logs.value.push('[任务完成] 调度员，世界安全暂时得以保全。')
    isDecoded.value = true
    sessionStorage.setItem(QUEST_STORAGE, '3')
  } else {
    logs.value.push('[失败] 频率不匹配，屏障发生反弹。请尝试注入【水】属性干支。')
  }
}
</script>

<template>
  <div class="command-decipher">
    <CommandHeader logo="DEC-SYS">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/dashboard')">返回面板</button>
      </template>
    </CommandHeader>

    <main class="decipher-main">
      <div class="bagua-bg"></div>
      
      <div class="console">
        <div class="logs">
          <div v-for="(line, idx) in logs" :key="idx" class="log-line">
            {{ line }}
          </div>
        </div>
        
        <div class="input-area" v-if="!isDecoded">
          <span class="blinking-cursor">_</span>
          <input 
            v-model="inputCode" 
            @keydown.enter="submitDecode"
            type="text" 
            class="decipher-input" 
            placeholder="输入干支..."
            autocomplete="off"
          />
          <button @click="submitDecode" class="action-btn">破译</button>
        </div>
        
        <div v-if="isDecoded" class="victory">
          <h3>★★★ 破译成功 ★★★</h3>
          <p>危机解除。</p>
          <button @click="router.push('/ue-stc/dashboard')" class="action-btn">返回控制台</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.command-decipher {
  min-height: 100vh;
  background: #020508;
  color: #0ff;
  font-family: 'Fira Code', 'SimSun', monospace;
  position: relative;
  overflow: hidden;
}

.bagua-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  border: 1px dashed rgba(0, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  animation: spin 60s linear infinite;
  background: radial-gradient(circle, transparent 40%, rgba(0, 255, 255, 0.05) 100%);
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
  background: rgba(0, 20, 30, 0.8);
  border: 1px solid #0ff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  padding: 2rem;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.logs {
  margin-bottom: 2rem;
  min-height: 200px;
}

.log-line {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  text-shadow: 0 0 2px #0ff;
}

.input-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid rgba(0, 255, 255, 0.3);
  padding-top: 1rem;
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
  width: 150px;
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
</style>
