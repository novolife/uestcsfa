<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()
const revealed = ref(false)

function reveal() {
  revealed.value = true
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="name">电子科技大学科幻协会</p>
      <p class="meta">
        <a href="https://www.uestc.edu.cn" target="_blank" rel="noopener">电子科技大学</a>
        <span> · </span>
        <span>© {{ year }}</span>
        <span v-if="!revealed" class="secret-hint" role="button" tabindex="0" @click="reveal" @keydown.enter="reveal">UESTC-SFA</span>
        <RouterLink v-else to="/ue-stc" class="secret-hint secret-link">ue-stc</RouterLink>
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

.meta a:hover {
  text-decoration: underline;
}

.secret-hint {
  display: inline-block;
  margin-left: 0.25em;
  color: inherit;
  cursor: pointer;
}

.secret-hint.secret-link {
  text-decoration: none;
  cursor: pointer;
}

.secret-hint.secret-link:hover {
  text-decoration: underline;
}
</style>
