<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found page">
    <h1 class="page-title">404</h1>
    <p class="message">页面不存在</p>
    <p class="back">
      <RouterLink to="/" class="link">返回首页</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.not-found.page {
  max-width: 640px;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.message {
  font-size: 1rem;
  color: var(--color-text-mute);
  margin-bottom: 1.5rem;
}

.back .link {
  color: var(--color-accent);
  text-decoration: none;
}

.back .link:hover {
  text-decoration: underline;
}
</style>
