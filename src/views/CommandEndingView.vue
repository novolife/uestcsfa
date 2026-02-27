<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const AUTH_STORAGE = 'ue-stc-auth'

const lines = [
  '致接替我的调度员：',
  '如果你看到了这张完整的星图，说明你已经帮他们把门建好了。',
  '根本没有什么外星入侵。UE-STC 骗了我们所有人。',
  '那些不可见的实体，是数万年后的人类。他们在更高维度遭遇了熵增危机，正在尝试将意识逆向锚定回低维度的过去。',
  '所谓的‘科幻协会’，只是一个筛选器。只有拥有极致想象力的‘科幻迷’，其脑波频率才能与高维通道产生共鸣。',
  '你在后勤终端发配的每一次物资，都是在为降临提供物质载体；你在地图上画下的每一个收容圈，都是在完善他们的降临法阵。',
  '我们不是在驱逐怪物，我们是在上传我们自己。',
  '物理法则已经开始崩塌，系统最高控制权已移交给你。选吧，是作为人类死去，还是作为神明重生？'
]

const visibleLines = ref([])
const showChoices = ref(false)

const formatInput = ref('')
const ascendInput = ref('')
const glitchActive = ref(false)

const isAscending = ref(false)
const ascenderName = ref('')
const finalCursorVisible = ref(false)

onMounted(() => {
  if (!sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc')
    return
  }

  let i = 0
  const printInterval = setInterval(() => {
    if (i < lines.length) {
      visibleLines.value.push(lines[i])
      i++
    } else {
      clearInterval(printInterval)
      setTimeout(() => {
        glitchActive.value = true
        showChoices.value = true
        playGlitchSound()
      }, 1000)
    }
  }, 1500)
})

function playGlitchSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(50, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(10, ctx.currentTime + 3)
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  
  osc.start()
  osc.stop(ctx.currentTime + 3)
}

function handleFormat() {
  if (formatInput.value.trim() === 'FORMAT_REALITY /FORCE') {
    // 选项A：物理隔断
    sessionStorage.clear()
    localStorage.setItem('ue-stc-formatted', 'true')
    window.location.href = '/' // 强制硬刷新跳转首页
  }
}

function handleAscend() {
  if (ascendInput.value.trim() !== '') {
    // 选项B：协议飞升
    ascenderName.value = ascendInput.value.trim()
    isAscending.value = true
    setTimeout(() => {
      finalCursorVisible.value = true
    }, 4000)
  }
}

function preventAnyInput(e) {
  e.preventDefault()
}
</script>

<template>
  <div class="ending-view" :class="{ 'glitch-bg': glitchActive, 'ascension-void': isAscending }">
    <template v-if="!isAscending">
      <div class="document-container">
        <h1 class="doc-title">[Project_Ascension.md]</h1>
        <div class="doc-content">
          <p v-for="(line, idx) in visibleLines" :key="idx" class="typewriter-line">{{ line }}</p>
        </div>
      </div>

      <div class="choices-container" v-if="showChoices">
        <div class="alert-banner">高维降临倒计时开始。请调度员下达最终指令。</div>
        
        <div class="split-terminals">
          <div class="terminal left-term">
            <h3>选项 A：执行【物理隔断】 (拒绝进化)</h3>
            <p class="term-desc">切断锚点。代价：彻底格式化 UE-STC 系统。</p>
            <p class="term-prompt">请输入自毁协议：FORMAT_REALITY /FORCE</p>
            <input v-model="formatInput" @keydown.enter="handleFormat" type="text" class="term-input red-input" spellcheck="false" autocomplete="off" />
          </div>

          <div class="terminal right-term">
            <h3>选项 B：执行【协议：飞升】 (拥抱未知)</h3>
            <p class="term-desc">放弃低维肉体，拥抱超维意识。</p>
            <p class="term-prompt">请输入你的干员注册ID以完成最后融合。</p>
            <input v-model="ascendInput" @keydown.enter="handleAscend" type="text" class="term-input green-input" spellcheck="false" autocomplete="off" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="ascension-fx">
        <!-- 满屏代码雨动画 (用CSS简单实现或在此处只做背景过渡) -->
        <div class="code-rain"></div>
        <div class="ascension-message" :class="{ 'fade-out': finalCursorVisible }">
          欢迎来到新世界，{{ ascenderName }}。
        </div>
        <div class="final-cursor" v-if="finalCursorVisible">
          <input type="text" @keydown="preventAnyInput" class="god-input" spellcheck="false" autocomplete="off" autofocus />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ending-view {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Courier New', Courier, monospace;
  padding: 2rem;
  transition: all 1s;
  position: relative;
  overflow: hidden;
  z-index: 9999;
}

.glitch-bg {
  animation: bg-glitch 0.2s linear infinite;
  background: #050000;
}

@keyframes bg-glitch {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 1px) }
  40% { transform: translate(2px, -1px) }
  60% { transform: translate(-1px, 2px) }
  80% { transform: translate(1px, -2px) }
  100% { transform: translate(0) }
}

.document-container {
  max-width: 800px;
  margin: 0 auto;
}

.doc-title {
  color: #f00;
  border-bottom: 1px solid #f00;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

.typewriter-line {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-size: 1.1rem;
  color: #ccc;
  animation: typing 0.5s steps(40, end);
}

@keyframes typing {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

.choices-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.9);
  border-top: 2px solid #f00;
}

.alert-banner {
  text-align: center;
  color: #f00;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  animation: pulse-alert 1s infinite alternate;
}

@keyframes pulse-alert {
  from { text-shadow: 0 0 10px #f00; }
  to { text-shadow: 0 0 30px #f00, 0 0 50px #f00; }
}

.split-terminals {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.terminal {
  flex: 1;
  padding: 1.5rem;
  border: 1px solid #333;
  background: #0a0a0a;
}

.left-term {
  border-color: #511;
}

.right-term {
  border-color: #151;
}

.terminal h3 {
  margin-top: 0;
  font-size: 1.2rem;
}

.left-term h3 { color: #f55; }
.right-term h3 { color: #5f5; }

.term-desc {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.term-prompt {
  color: #aaa;
  margin-bottom: 0.5rem;
}

.term-input {
  width: 100%;
  background: #000;
  border: 1px solid #444;
  padding: 0.8rem;
  font-family: inherit;
  font-size: 1.1rem;
  outline: none;
}

.red-input { color: #f00; border-color: #f00; }
.green-input { color: #0f0; border-color: #0f0; }

.term-input:focus {
  box-shadow: inset 0 0 10px currentColor;
}

/* Ascension Styles */
.ascension-void {
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ascension-fx {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 255, 0, 0) 50%, rgba(0, 255, 0, 0.25) 50%), 
    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 2px, 3px 100%;
  z-index: 1;
  opacity: 0;
  animation: show-rain 4s forwards;
}

@keyframes show-rain {
  0% { opacity: 0; transform: translateY(100%); }
  50% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-100%); }
}

.ascension-message {
  font-size: 2rem;
  color: #fff;
  text-shadow: 0 0 20px #fff;
  z-index: 2;
  opacity: 0;
  animation: fade-in 2s forwards;
}

.ascension-message.fade-out {
  animation: fade-out 2s forwards;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

.final-cursor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.god-input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  width: 2rem;
  outline: none;
  animation: god-blink 1s steps(2, start) infinite;
  caret-color: transparent;
  cursor: default;
}

@keyframes god-blink {
  to {
    background-color: #fff;
  }
}
</style>