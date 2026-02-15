<script setup>
const activities = [
  {
    title: '科幻读书会',
    desc: '共读经典科幻小说，定期讨论与分享。',
    time: '定期举办',
  },
  {
    title: '科幻观影',
    desc: '一起观看科幻电影与剧集，交流观后感与细节解读。',
    time: '定期举办',
  },
  {
    title: '征文与创作',
    desc: '参与高校科幻征文、社团内部练笔与作品互评。',
    time: '按赛事与计划安排',
  },
  {
    title: '主题沙龙与嘉宾分享',
    desc: '邀请创作者或爱好者进行主题分享，拓展视野。',
    time: '不定期',
  },
]
</script>

<template>
  <div class="activities page">
    <h1 class="page-title">活动</h1>
    <p class="page-desc">协会日常与特色活动一览，具体时间与报名方式以招新群或公众号通知为准。</p>

    <div class="activity-list">
      <article
        v-for="(item, index) in activities"
        :key="index"
        class="activity-card"
      >
        <span class="activity-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="activity-body">
          <h2 class="activity-title">{{ item.title }}</h2>
          <p class="activity-desc">{{ item.desc }}</p>
          <span class="activity-time">{{ item.time }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.activities.page {
  max-width: 720px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.page-desc {
  color: var(--color-text-mute);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s;
}

.activity-card:hover {
  border-color: var(--color-border-hover);
}

.activity-index {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent);
  flex-shrink: 0;
}

.activity-body {
  flex: 1;
}

.activity-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
}

.activity-desc {
  font-size: 0.95rem;
  color: var(--color-text-mute);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.activity-time {
  font-size: 0.85rem;
  color: var(--color-text-mute);
  opacity: 0.9;
}
</style>
