<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const navItems = [
  { path: '/', name: '首页' },
  { path: '/about', name: '关于' },
  { path: '/activities', name: '活动' },
  { path: '/join', name: '加入' },
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
          alt=""
          width="40"
          height="30"
        />
        <span class="logo-text">UESTC 科幻协会</span>
        <span class="logo-hint">42</span>
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
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-heading);
  font-size: 1rem;
  font-weight: 600;
}

.logo:hover {
  color: var(--color-accent);
  text-decoration: none;
}

.logo-hint {
  font-size: 0.75rem;
  color: var(--color-text-mute);
  font-weight: 400;
  opacity: 0;
  margin-left: 0.25rem;
  transition: opacity 0.2s;
}

.logo:hover .logo-hint {
  opacity: 1;
}

.logo-flag {
  width: 36px;
  height: 27px;
  object-fit: cover;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.4rem 0.75rem;
  color: var(--color-text-mute);
  font-size: 0.9rem;
}

.nav-link:hover {
  color: var(--color-text);
  text-decoration: none;
}

.nav-link.active {
  color: var(--color-accent);
  font-weight: 500;
}

@media (max-width: 640px) {
  .header-inner {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .nav {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
