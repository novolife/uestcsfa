<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import CommandHeader from '@/components/CommandHeader.vue'

const router = useRouter()
const AUTH_STORAGE = 'ue-stc-auth'

onMounted(() => {
  if (!sessionStorage.getItem(AUTH_STORAGE)) {
    router.replace('/ue-stc')
  }
})
</script>

<template>
  <div class="command-about">
    <CommandHeader logo="UE-STC · 关于">
      <template #right>
        <RouterLink to="/">协会页面</RouterLink>
      </template>
    </CommandHeader>
    <main class="about-main">
      <h1 class="about-title">关于指挥部</h1>
      <div class="about-prose">
        <p>
          不可见实体监视与战术指挥部（UE-STC）依托电子科技大学，成立于 1956 年。
        </p>
        <p>
          其后与四川省情报机构（对外伪装为「科幻世界杂志社」）建立合作，以科幻协会身份作为对外交流渠道，沿用至今。
        </p>
        <p>本页面及指挥部相关内容仅供娱乐，与任何真实机构无关。</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.command-about {
  min-height: 100vh;
  background: #0a0a0a;
  color: #999;
}

.about-main {
  max-width: 560px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem;
}

@media (max-width: 640px) {
  .about-main {
    padding: 1rem 0.75rem;
  }
}

.about-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #777;
  margin-bottom: 1rem;
}

.about-prose p {
  font-size: 0.85rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 1rem;
}
</style>
