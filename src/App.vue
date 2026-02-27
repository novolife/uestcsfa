<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import SciFiCore from './components/SciFiCore.vue'
import SciFiOverlay from './components/SciFiOverlay.vue'
import TacticalClipboard from './components/TacticalClipboard.vue'
import { RouterView } from 'vue-router'

const route = useRoute()
const isCommandRoute = computed(() => route.path.startsWith('/ue-stc'))
const isFormatted = ref(false)

onMounted(() => {
  if (localStorage.getItem('ue-stc-formatted') === 'true') {
    isFormatted.value = true
  }
})
</script>

<template>
  <div v-if="isFormatted" class="formatted-reality">
    <div class="static-content">
      <h1>电子科技大学科幻协会</h1>
      <p>欢迎加入科幻协会，我们的征途是星辰大海。</p>
    </div>
  </div>
  <div v-else class="app-root">
    <TacticalClipboard />
    <!-- 
      关键修改：
      将 3D 核心和 Overlay 移到 .app-layout 之外，
      避免受到 .app-layout 样式（如 overflow, filter）的影响导致 3D 扁平化 
    -->
    <template v-if="!isCommandRoute">
      <SciFiOverlay />
      <SciFiCore />
    </template>

    <div class="app-layout" :class="{ 'is-command-route': isCommandRoute }">
      <template v-if="!isCommandRoute">
        <!-- 内容层 -->
        <div class="glass-content">
          <SiteHeader />
          <main class="main-content">
            <RouterView />
          </main>
          <SiteFooter />
        </div>
      </template>
      
      <template v-else>
        <RouterView />
      </template>
    </div>
  </div>
</template>

<style scoped>
.app-root {
  width: 100%;
  min-height: 100vh;
  position: relative;
  /* 确保根容器有深邃背景，因为 SciFiCore 是 fixed 定位，这里作为兜底 */
  background: radial-gradient(circle, #0e1a4d 0%, #05081c 100%);
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10; /* 确保内容在核心之上 */
}

.app-layout:not(.is-command-route) {
  --color-bg: #090f3a;
  --color-bg-soft: #101a56;
  --color-bg-mute: #14216b;
  --color-border: #2e3b8f;
  --color-border-hover: #1905fa;
  --color-accent: #ffffff;
  --color-accent-hover: #d86500;
  --color-highlight: #1905fa;
  --color-text: #ffffff;
  --color-text-mute: #b8c3ff;
  --color-heading: #ffffff;
  /* 背景色已移至 app-root，这里只需处理变量 */
}

.glass-content {
  position: relative;
  /* 这里的 backdrop-filter 可能会影响性能，但不会影响 fixed 的 SciFiCore */
  /* 如果还有问题，可以尝试移除这里的 backdrop-filter */
  backdrop-filter: blur(5px);
  background: rgba(9, 15, 58, 0.4);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

.formatted-reality {
  min-height: 100vh;
  background: #fff;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  text-align: center;
}

.static-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: normal;
  letter-spacing: 2px;
}

.static-content p {
  font-size: 1rem;
  color: #666;
}
</style>
