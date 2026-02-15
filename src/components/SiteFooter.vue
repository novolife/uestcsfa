<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="brand">
        <span class="footer-logo">电子科技大学科幻协会</span>
        <p class="tagline">探索想象边界，共筑科幻梦想</p>
      </div>
      <div class="footer-right">
        <div class="links">
          <a href="https://www.uestc.edu.cn" target="_blank" rel="noopener">电子科技大学</a>
          <span class="sep">·</span>
          <span class="copy">© {{ year }} UESTC-SFA</span>
        </div>
        <p class="attribution">
          协会旗帜图片：<a href="https://commons.wikimedia.org/wiki/File:Flag_of_SFA_of_UESTC.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>，作者 MspreilsCN，CC BY 4.0
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 2rem 1.5rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-soft);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-logo {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-heading);
}

.tagline {
  font-size: 0.875rem;
  color: var(--color-text-mute);
}

.links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-mute);
}

.sep {
  color: var(--color-border);
}

.copy {
  color: var(--color-text-mute);
}

.attribution {
  font-size: 0.75rem;
  color: var(--color-text-mute);
  opacity: 0.9;
}

.attribution a {
  color: var(--color-text-mute);
}

.attribution a:hover {
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .footer-right {
    align-items: flex-start;
  }
}
</style>
