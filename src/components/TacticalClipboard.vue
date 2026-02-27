<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { memeticClipboard } from '@/utils/clipboardStore'

const router = useRouter()
const isVisible = ref(false)

function checkVisibility() {
  const claimed = JSON.parse(sessionStorage.getItem('ue-stc-claimed-tasks') || '[]')
  // 只有在任务被接取且未完成时，才显示战术剪贴板
  const hasMemeticTask = claimed.some(t => t.type === '模因污染清洗任务' && t.status !== '已完成')
  
  // 还要检查是否在目标文章页面，如果不是，也不显示
  const targetIndexStr = sessionStorage.getItem('ue-stc-memetic-target')
  let isTargetPage = true
  if (targetIndexStr && window.location.pathname.startsWith('/activities/')) {
    const slugs = [
      '2025-star-cloud-ceremony',
      '2025-sci-fi-city-forum',
      '2024-galaxy-award',
      '2024-dune2-joint-screening',
      '2023-worldcon-association-participation',
      '2023-oppenheimer-joint-screening',
      '2023-sci-fi-creative-writing',
      '2023-wandering-earth-2-farewell',
      '2022-sci-fi-writing-camp'
    ]
    const targetSlug = slugs[parseInt(targetIndexStr)]
    if (targetSlug && !window.location.pathname.includes(targetSlug)) {
      isTargetPage = false
    }
  }

  isVisible.value = hasMemeticTask && isTargetPage
}

let timer
onMounted(() => {
  checkVisibility()
  timer = setInterval(checkVisibility, 2000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const clipboardLabel = computed(() => {
  if (memeticClipboard.value.length === 0) return '空'
  return memeticClipboard.value.map((c) => c.code).join(' | ')
})

function goToMemetic() {
  router.push('/ue-stc/memetic')
}
</script>

<template>
  <div class="tactical-clipboard" v-if="isVisible">
    <div class="cb-header">UE-STC 战术剪贴板</div>
    <div class="cb-body">
      <p class="cb-status">已提取：{{ clipboardLabel }}</p>
      <p class="cb-hint">（点击文章中的异常波动词汇进行采集）</p>
      <button class="cb-btn" type="button" @click="goToMemetic">返回清洗终端</button>
    </div>
  </div>
</template>

<style scoped>
.tactical-clipboard {
  position: fixed;
  right: 20px;
  top: 80px;
  width: 250px;
  background: rgba(10, 10, 10, 0.95);
  border: 1px solid #555;
  border-radius: 4px;
  color: #0f0;
  font-family: 'Courier New', Courier, monospace;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.cb-header {
  background: #333;
  color: #fff;
  padding: 5px 10px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.cb-body {
  padding: 10px;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
}

.cb-status {
  margin: 0 0 10px 0;
  word-break: break-all;
  color: #0f0;
}

.cb-hint {
  margin: 0 0 10px 0;
  color: #888;
  font-size: 0.75rem;
}

.cb-btn {
  background: #111;
  border: 1px solid #4a4;
  color: #5d5;
  padding: 0.4rem;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.cb-btn:hover {
  background: #4a4;
  color: #000;
}

@media (max-width: 768px) {
  .tactical-clipboard {
    right: 10px;
    top: auto;
    bottom: 20px;
    width: 200px;
  }
}
</style>