<script setup>
</script>

<template>
  <div class="join page">
    <h1 class="page-title">加入我们</h1>

    <section class="block highlight">
      <p>
        电子科技大学科幻协会成立于 2018 年，现有成员约 300 人，2024 年荣获第 35 届银河奖「最佳科幻团体奖」。
        无论你是科幻小说爱好者、科幻影视迷，还是对写作、桌游与想象感兴趣的同学，都欢迎加入我们，一起探索星辰与未知。
      </p>
    </section>

    <section class="block">
      <h2 class="block-title">如何加入</h2>
      <p>
        招新一般在每学年开学季进行，届时会在校园内设置招新摊位，并开放招新群。
        请关注校内社团联合招新信息及
        <a href="https://xgb.uestc.edu.cn" target="_blank" rel="noopener">党委学生工作部</a>相关通知，
        或向身边已加入协会的同学咨询招新群号。
      </p>
    </section>

    <section class="block">
      <h2 class="block-title">招新群 / 联系方式</h2>
      <p class="muted">
        招新群号与公众号等具体联系方式将在招新季更新。若你看到本页面时尚未到招新季，
        可先关注协会后续动态，我们期待在新学期与你相遇。
      </p>
    </section>

    <section class="block">
      <h2 class="block-title">你能获得什么</h2>
      <ul class="list">
        <li>与约 300 名同好一起参与征文、观影、桌游、讨论的校园科幻圈子</li>
        <li>参与银河奖、星云奖及高校科幻征文与创作活动的机会</li>
        <li>参观《科幻世界》编辑部、友校交流、中国国际科幻大会志愿服务等经历</li>
        <li>学校科幻写作训练营、征文大赛及数字文化与传媒研究基地等资源支持</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.join.page {
  max-width: 720px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 2rem;
}

.block {
  margin-bottom: 2.5rem;
}

.block.highlight {
  padding: 1.5rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.block.highlight p {
  color: var(--color-text);
  line-height: 1.8;
  margin: 0;
}

.block-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
}

.block p {
  color: var(--color-text);
  line-height: 1.8;
}

.block p.muted {
  color: var(--color-text-mute);
}

.list {
  list-style: none;
  padding: 0;
}

.list li {
  position: relative;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  line-height: 1.7;
}

.list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  border-radius: 50%;
}
</style>
