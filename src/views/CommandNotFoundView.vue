<script setup>
import { RouterLink } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'
</script>

<template>
  <div class="command-not-found">
    <CommandHeader logo="UE-STC">
      <template #right>
        <RouterLink to="/">协会页面</RouterLink>
      </template>
    </CommandHeader>
    <main class="not-found-main">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-message">该路径不存在</p>
      <p class="not-found-back">
        <RouterLink to="/ue-stc/dashboard" class="link">返回指挥部首页</RouterLink>
        <span> · </span>
        <RouterLink to="/" class="link">协会页面</RouterLink>
      </p>
    </main>
  </div>
</template>

<style scoped>
.command-not-found {
  min-height: 100vh;
  background: #0a0a0a;
  color: #999;
}

.not-found-main {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
  text-align: center;
}

.not-found-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #666;
  margin-bottom: 0.5rem;
}

.not-found-message {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.not-found-back .link {
  color: #888;
  text-decoration: none;
}

.not-found-back .link:hover {
  color: #aaa;
  text-decoration: underline;
}
</style>
