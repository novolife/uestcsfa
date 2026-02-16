<script setup>
import { RouterLink } from 'vue-router'
import manifest from '@/content/reports/manifest.js'
</script>

<template>
  <div class="activities page">
    <h1 class="page-title">活动</h1>
    <div class="prose">
      <p>
        我们开展科幻征文比赛（按赛事安排）、科幻电影剧情创作与科幻桌游大赛（定期），
        并不定期组织参观《科幻世界》编辑部、与友校科幻协会交流；另按大会安排参与中国国际科幻大会志愿服务。
      </p>
      <p>
        具体时间与报名以招新群或校内通知为准。学校曾联合《科幻世界》主办科幻写作训练营（实验室参访、写作课、电影鉴赏、文学沙龙等），协会成员可关注相关机会。
      </p>
    </div>

    <section class="reports-section">
      <h2 class="reports-title">活动报道</h2>
      <ul class="reports-list">
        <li v-for="r in manifest" :key="r.slug" class="reports-item">
          <RouterLink :to="`/activities/reports/${r.slug}`" class="reports-link">
            <span class="reports-item-title">{{ r.title }}</span>
            <span class="reports-item-meta">{{ r.date }}</span>
          </RouterLink>
          <p class="reports-item-summary">{{ r.summary }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.activities.page {
  max-width: 640px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.prose p {
  color: var(--color-text);
  line-height: 1.75;
  margin-bottom: 1rem;
}

.reports-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.reports-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.reports-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reports-item {
  margin-bottom: 1.25rem;
}

.reports-item:last-child {
  margin-bottom: 0;
}

.reports-link {
  display: block;
  margin-bottom: 0.25rem;
}

.reports-item-title {
  font-weight: 500;
  color: var(--color-heading);
}

.reports-link:hover .reports-item-title {
  color: var(--color-accent);
}

.reports-item-meta {
  font-size: 0.85rem;
  color: var(--color-text-mute);
  margin-left: 0.5rem;
}

.reports-item-summary {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  line-height: 1.5;
  margin: 0;
}
</style>
