<script setup>
import { RouterLink } from 'vue-router'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="name">电子科技大学科幻协会</p>
      <p class="meta">
        <a href="https://www.uestc.edu.cn" target="_blank" rel="noopener">电子科技大学</a>
        <span> · </span>
        <span>© {{ year }} </span><RouterLink to="/ue-stc" class="secret-link"> UESTC-SFA</RouterLink>
        <span class="hidden-clue"> /ue-stc</span>
        <span> · </span>
        <a href="https://commons.wikimedia.org/wiki/File:Flag_of_SFA_of_UESTC.jpg" target="_blank" rel="noopener">旗帜图片来源</a> (CC BY 4.0)
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 1.5rem 1.25rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-soft);
}

.footer-inner {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
}

.name {
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
}

.meta {
  font-size: 0.8rem;
  color: var(--color-text-mute);
}

.meta a:hover,
.meta .secret-link:hover {
  text-decoration: underline;
}

.secret-link {
  color: inherit;
}

.meta .hidden-clue {
  color: var(--color-bg-soft);
}
</style>
