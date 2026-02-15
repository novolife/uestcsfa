<script setup>
const activities = [
  {
    title: '科幻征文比赛',
    desc: '组织与参与校内外科幻征文、创意写作，在高校科幻平台发出成电声音。',
    time: '按赛事与计划安排',
  },
  {
    title: '科幻电影 / 剧情创作',
    desc: '科幻电影剧情创作、观影交流与剧本讨论，从创意到作品。',
    time: '定期举办',
  },
  {
    title: '科幻桌游大赛',
    desc: '举办科幻主题桌游赛事，在游戏中体验科幻设定与策略。',
    time: '定期举办',
  },
  {
    title: '参观《科幻世界》编辑部',
    desc: '组织成员参观《科幻世界》杂志社，近距离了解中国科幻出版与创作生态。',
    time: '不定期',
  },
  {
    title: '友校科幻协会交流',
    desc: '与国内其他高校科幻协会交流分享，拓展视野、共建科幻社群。',
    time: '不定期',
  },
  {
    title: '中国国际科幻大会等志愿服务',
    desc: '参与中国国际科幻大会等大型科幻盛会的志愿服务与活动。',
    time: '按大会安排',
  },
]
</script>

<template>
  <div class="activities page">
    <h1 class="page-title">活动</h1>
    <p class="page-desc">协会日常与特色活动一览，具体时间与报名方式以招新群或校内通知为准。学校亦曾联合《科幻世界》主办科幻写作训练营（实验室参访、写作课程、电影鉴赏、文学沙龙等），协会成员可关注相关机会。</p>

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
