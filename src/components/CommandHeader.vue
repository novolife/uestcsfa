<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { checkEmergencyTimeout, readEmergency } from '@/utils/emergencyComm'

defineProps({
  logo: { type: String, default: 'UE-STC' },
})

const route = useRoute()
const menuOpen = ref(false)

const isFormal = ref(false)
const hasCommsAlert = ref(false)
let commsTimer = null

function checkComms() {
  const q = parseInt(sessionStorage.getItem('ue-stc-quest') || '0', 10)
  isFormal.value = q > 0

  if (!isFormal.value) {
    hasCommsAlert.value = false
    return
  }

  const emg = checkEmergencyTimeout() || readEmergency()
  if (emg && emg.status === 'active') {
    hasCommsAlert.value = true
    return
  }

  hasCommsAlert.value = false
}

onMounted(() => {
  checkComms()
  commsTimer = setInterval(checkComms, 2000)
})

onUnmounted(() => {
  if (commsTimer) clearInterval(commsTimer)
})

function isActive(path) {
  return route.path === path
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

watch(() => route.path, closeMenu)
</script>

<template>
  <header class="command-header">
    <span class="command-header-logo">{{ logo }}</span>
    <nav class="command-header-nav" aria-label="主导航">
      <RouterLink to="/ue-stc/dashboard" class="command-header-link" :class="{ active: isActive('/ue-stc/dashboard') }">首页</RouterLink>
      <RouterLink to="/ue-stc/ops" class="command-header-link" :class="{ active: isActive('/ue-stc/ops') }">行动</RouterLink>
      <RouterLink v-if="isFormal" to="/ue-stc/comms" class="command-header-link" :class="{ active: isActive('/ue-stc/comms'), alert: hasCommsAlert }">通信</RouterLink>
      <RouterLink to="/ue-stc/intel" class="command-header-link" :class="{ active: isActive('/ue-stc/intel') }">情报</RouterLink>
      <RouterLink to="/ue-stc/about" class="command-header-link" :class="{ active: isActive('/ue-stc/about') }">关于</RouterLink>
    </nav>
    <div class="command-header-right">
      <slot name="right" />
    </div>
    <button
      type="button"
      class="command-header-toggle"
      aria-label="打开菜单"
      :aria-expanded="menuOpen"
      @click="toggleMenu"
    >
      <span class="command-header-toggle-bar" />
      <span class="command-header-toggle-bar" />
      <span class="command-header-toggle-bar" />
    </button>
  </header>
  <div class="command-header-dropdown" :class="{ open: menuOpen }" :aria-hidden="!menuOpen">
    <nav class="command-header-dropdown-inner" aria-label="折叠菜单">
      <RouterLink to="/ue-stc/dashboard" class="command-header-dropdown-link" :class="{ active: isActive('/ue-stc/dashboard') }" @click="closeMenu">首页</RouterLink>
      <RouterLink to="/ue-stc/ops" class="command-header-dropdown-link" :class="{ active: isActive('/ue-stc/ops') }" @click="closeMenu">行动</RouterLink>
      <RouterLink v-if="isFormal" to="/ue-stc/comms" class="command-header-dropdown-link" :class="{ active: isActive('/ue-stc/comms'), alert: hasCommsAlert }" @click="closeMenu">通信</RouterLink>
      <RouterLink to="/ue-stc/intel" class="command-header-dropdown-link" :class="{ active: isActive('/ue-stc/intel') }" @click="closeMenu">情报</RouterLink>
      <RouterLink to="/ue-stc/about" class="command-header-dropdown-link" :class="{ active: isActive('/ue-stc/about') }" @click="closeMenu">关于</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.command-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 0 1.25rem;
  border-bottom: 1px solid #222;
  background: #0a0a0a;
  flex-wrap: nowrap;
  gap: 1rem;
}

.command-header-logo {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #666;
  flex-shrink: 0;
}

.command-header-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.command-header-link {
  font-size: 0.85rem;
  color: #555;
  text-decoration: none;
}

.command-header-link:hover,
.command-header-link.active {
  color: #888;
}

.command-header-link.alert {
  color: #ff4444;
  animation: pulse-alert 2s infinite;
}

@keyframes pulse-alert {
  0% { color: #ff4444; text-shadow: 0 0 5px rgba(255, 68, 68, 0.2); }
  50% { color: #ff8888; text-shadow: 0 0 15px rgba(255, 68, 68, 0.6); }
  100% { color: #ff4444; text-shadow: 0 0 5px rgba(255, 68, 68, 0.2); }
}

.command-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* 覆盖插槽内容的样式：强制改为灰色，避免全局 accent 干扰 */
.command-header-right :deep(span) {
  font-size: 0.85rem;
  color: #666;
}

.command-header-right :deep(a) {
  font-size: 0.85rem;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.command-header-right :deep(a):hover {
  color: #ccc;
}

.command-header-right :deep(button) {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  color: #888;
  background: transparent;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.2s;
}

.command-header-right :deep(button):hover {
  color: #ccc;
  border-color: #555;
  background: #222;
}

.command-header-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
}

.command-header-toggle-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
}

.command-header-dropdown {
  display: none;
  overflow: hidden;
  background: #0a0a0a;
  border-bottom: 1px solid #222;
}

.command-header-dropdown.open {
  display: block;
}

.command-header-dropdown-inner {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.25rem 0.75rem;
  gap: 0.25rem;
}

.command-header-dropdown-link {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #888;
  text-decoration: none;
}

.command-header-dropdown-link:hover,
.command-header-dropdown-link.active {
  color: #aaa;
}

.command-header-dropdown-link.alert {
  color: #ff4444;
  animation: pulse-alert 2s infinite;
}

@media (max-width: 640px) {
  .command-header-nav {
    display: none;
  }

  .command-header-toggle {
    display: flex;
  }

  /* 移动端调整插槽内容 */
  .command-header-right :deep(span),
  .command-header-right :deep(a),
  .command-header-right :deep(button) {
    font-size: 0.75rem;
  }
}

@media (min-width: 641px) {
  .command-header-dropdown {
    display: none !important;
  }
}
</style>
