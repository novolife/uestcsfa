<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const navItems = [
  { path: '/', name: '首页' },
  { path: '/about', name: '关于我们' },
  { path: '/activities', name: '活动' },
  { path: '/join', name: '加入我们' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <img
          class="logo-flag"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_SFA_of_UESTC.jpg/80px-Flag_of_SFA_of_UESTC.jpg"
          alt="电子科技大学科幻协会旗帜"
          width="40"
          height="30"
        />
        <span class="logo-text">UESTC</span>
        <span class="logo-divider">|</span>
        <span class="logo-sfa">科幻协会</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-heading);
  letter-spacing: 0.05em;
}

.logo-flag {
  width: 40px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.logo:hover {
  color: var(--color-accent);
}

.logo-divider {
  color: var(--color-accent);
  font-weight: 500;
}

.nav {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: var(--color-text-mute);
  font-size: 0.95rem;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover {
  color: var(--color-text);
  background: rgba(99, 102, 241, 0.12);
}

.nav-link.active {
  color: var(--color-accent);
  background: rgba(99, 102, 241, 0.18);
}

@media (max-width: 640px) {
  .header-inner {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
