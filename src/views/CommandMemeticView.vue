<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const QUEST_STORAGE = 'ue-stc-quest'
const MEMETIC_CLEANED_STORAGE = 'ue-stc-memetic-cleaned'
const POINTS_STORAGE = 'ue-stc-points'

const codeInput = ref('')
const logs = ref([
  '[模因清洗模块] 任务已加载',
  '异常文章：点击量异动，疑似被实体污染',
  '请从表世界文章提取异常字符并组装反向清除代码',
  '提示：本次模拟异常字符为 "VUJfQ0xFQU5fT0s="',
])
const done = ref(false)

onMounted(() => {
  const q = parseInt(sessionStorage.getItem(QUEST_STORAGE) || '0', 10)
  if (q === 0) router.replace('/ue-stc/ops')
  done.value = sessionStorage.getItem(MEMETIC_CLEANED_STORAGE) === '1'
})

function runClean() {
  const val = codeInput.value.trim()
  if (!val) return
  logs.value.push(`> 注入代码: ${val}`)
  if (val === 'VUJfQ0xFQU5fT0s=') {
    if (!done.value) {
      const p = parseInt(sessionStorage.getItem(POINTS_STORAGE) || '0', 10)
      sessionStorage.setItem(POINTS_STORAGE, String(p + 5))
      sessionStorage.setItem(MEMETIC_CLEANED_STORAGE, '1')
      done.value = true
    }
    logs.value.push('净化成功：网页污染被清除，获得 5 积分。')
    logs.value.push('线索：实体行为与未来人类干预高度相关。')
  } else {
    logs.value.push('净化失败：代码哈希不匹配。')
  }
  codeInput.value = ''
}
</script>

<template>
  <div class="memetic">
    <CommandHeader logo="MEM-CLEAN">
      <template #right>
        <button type="button" @click="router.push('/ue-stc/ops')">返回行动页</button>
      </template>
    </CommandHeader>

    <main class="wrap">
      <section class="panel">
        <h2>文本比对器</h2>
        <p>《深空回声》正文片段（模拟）：</p>
        <p class="article">
          “他们在天穹下举起望远镜，低声说出那句古老誓言：未来仍属于人类。
          但下一行却出现无意义字符串：<span>VUJfQ0xFQU5fT0s=</span>。”
        </p>
      </section>
      <section class="panel">
        <h2>代码注入窗口</h2>
        <div class="injector">
          <input v-model="codeInput" placeholder="输入反向清除代码" />
          <button type="button" @click="runClean">执行净化</button>
        </div>
        <div class="log">
          <div v-for="(line, idx) in logs" :key="idx">{{ line }}</div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.memetic { min-height: 100vh; background: #090909; color: #9aa; }
.wrap { max-width: 860px; margin: 0 auto; padding: 1.25rem; display: grid; gap: 1rem; }
.panel { border: 1px solid #232323; background: #111; padding: 1rem; }
.panel h2 { color: #7a7; font-size: 0.95rem; margin-bottom: 0.5rem; }
.article { color: #888; line-height: 1.7; }
.article span { color: #ffb14a; }
.injector { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
.injector input { flex: 1; background: #0b0b0b; border: 1px solid #333; color: #bbb; padding: 0.45rem; }
.injector button { background: #1b1b1b; border: 1px solid #444; color: #aaa; padding: 0.45rem 0.8rem; cursor: pointer; }
.injector button:hover { color: #ddd; border-color: #666; }
.log { font-size: 0.82rem; color: #777; line-height: 1.6; }
</style>
