<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)

const navItems = [
  { path: '/', name: 'CORE' },
  { path: '/about', name: '关于' },
  { path: '/activities', name: '活动' },
  { path: '/join', name: '联系' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

watch(() => route.path, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="site-header">
    <!-- 顶部装饰线 -->
    <div class="header-line"></div>
    
    <div class="header-inner">
      <!-- 左侧 LOGO 区域 -->
      <RouterLink to="/" class="logo-area">
        <div class="logo-box">
          <img src="/uestcsfa/icon-white.png" alt="电子科技大学科幻协会" class="logo-img" width="40" height="40" />
          <span class="logo-text">UESTC-SFA</span>
          <span class="logo-hint">42</span>
        </div>
        <div class="logo-deco">
          <span class="deco-dot"></span>
          <span class="deco-line"></span>
        </div>
      </RouterLink>

      <!-- 右侧导航区域 -->
      <nav class="nav-area" aria-label="主导航">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-bracket">[</span>
          <span class="nav-text">{{ item.name }}</span>
          <span class="nav-bracket">]</span>
          <div class="nav-glitch"></div>
        </RouterLink>
      </nav>

      <!-- 移动端菜单按钮 -->
      <button
        type="button"
        class="menu-toggle"
        aria-label="Toggle Menu"
        :aria-expanded="menuOpen"
        @click="toggleMenu"
      >
        <div class="toggle-icon">
          <span></span><span></span><span></span>
        </div>
      </button>
    </div>

    <!-- 移动端下拉菜单 -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <nav class="mobile-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-item"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* 容器 */
.site-header {
  position: relative;
  width: 100%;
  z-index: 100;
  padding-top: 1rem;
  background: transparent;
  border: none;
  backdrop-filter: none;
}

/* 顶部动态装饰线 */
.header-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--color-highlight) 50%, transparent 100%);
  opacity: 0.5;
  box-shadow: 0 0 10px var(--color-highlight);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

/* Logo 区域 */
.logo-area {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-decoration: none;
  position: relative;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: rgba(16, 26, 86, 0.6);
  border: 1px solid var(--color-border);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  transition: all 0.3s ease;
}

.logo-area:hover .logo-box {
  background: rgba(25, 5, 250, 0.2);
  border-color: var(--color-highlight);
  box-shadow: 0 0 15px rgba(25, 5, 250, 0.4);
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.logo-hint {
  font-size: 0.75rem;
  color: var(--color-text-mute);
  font-weight: 400;
  opacity: 0;
  margin-left: 0.5rem;
  transition: opacity 0.3s;
  font-family: 'Fira Code', monospace;
}

.logo-area:hover .logo-hint {
  opacity: 1;
  color: var(--color-highlight);
  text-shadow: 0 0 5px var(--color-highlight);
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  color: var(--color-heading);
}

.logo-deco {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.7;
}

.deco-dot {
  width: 4px;
  height: 4px;
  background: var(--color-highlight);
  border-radius: 50%;
  box-shadow: 0 0 5px var(--color-highlight);
}

.deco-line {
  height: 1px;
  width: 30px;
  background: var(--color-border);
}

/* 导航区域 */
.nav-area {
  display: flex;
  gap: 1.5rem;
  background: rgba(16, 26, 86, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-mute);
  text-decoration: none;
  transition: all 0.3s;
  letter-spacing: 0.05em;
}

.nav-bracket {
  opacity: 0;
  color: var(--color-highlight);
  transition: all 0.3s;
  transform: translateX(0);
}

.nav-item:hover,
.nav-item.active {
  color: var(--color-text);
  text-shadow: 0 0 8px var(--color-highlight);
}

.nav-item:hover .nav-bracket,
.nav-item.active .nav-bracket {
  opacity: 1;
}

.nav-item:hover .nav-bracket:first-child {
  transform: translateX(-3px);
}

.nav-item:hover .nav-bracket:last-child {
  transform: translateX(3px);
}

/* 移动端菜单按钮 */
.menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--color-border);
  width: 40px;
  height: 40px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--color-highlight);
}

.toggle-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-icon span {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
  box-shadow: 0 0 5px currentColor;
}

/* 移动端下拉 */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: rgba(5, 8, 28, 0.95);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  overflow: hidden;
  height: 0;
  transition: height 0.3s ease;
}

.mobile-menu.open {
  display: block;
  height: auto;
  padding-bottom: 1rem;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.mobile-nav-item {
  padding: 0.75rem 1rem;
  border-left: 2px solid transparent;
  color: var(--color-text-mute);
  text-decoration: none;
}

.mobile-nav-item.active,
.mobile-nav-item:hover {
  border-left-color: var(--color-highlight);
  background: rgba(25, 5, 250, 0.1);
  color: var(--color-text);
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-area {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
  .header-inner {
    padding: 0 1rem;
  }
}
</style>
