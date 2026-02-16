<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)

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

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

watch(() => route.path, () => {
  menuOpen.value = false
})
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
      <nav class="nav" aria-label="主导航">
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
      <button
        type="button"
        class="menu-toggle"
        aria-label="打开菜单"
        :aria-expanded="menuOpen"
        @click="toggleMenu"
      >
        <span class="menu-toggle-bar" />
        <span class="menu-toggle-bar" />
        <span class="menu-toggle-bar" />
      </button>
    </div>
    <div class="nav-dropdown" :class="{ open: menuOpen }" :aria-hidden="!menuOpen">
      <nav class="nav-dropdown-inner" aria-label="折叠菜单">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-dropdown-link"
          :class="{ active: isActive(item.path) }"
          @click="menuOpen = false"
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

.menu-toggle {
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
  color: var(--color-text-mute);
}

.menu-toggle-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
  transition: transform 0.2s, opacity 0.2s;
}

.nav-dropdown {
  display: none;
  overflow: hidden;
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
}

.nav-dropdown.open {
  display: block;
}

.nav-dropdown-inner {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1.25rem 0.75rem;
  gap: 0.25rem;
}

.nav-dropdown-link {
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 4px;
}

.nav-dropdown-link:hover {
  background: var(--color-bg-mute);
  color: var(--color-accent);
}

.nav-dropdown-link.active {
  color: var(--color-accent);
  font-weight: 500;
}

@media (max-width: 640px) {
  .nav {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }
}

@media (min-width: 641px) {
  .nav-dropdown {
    display: none !important;
  }
}
</style>
