<script setup>
</script>

<template>
  <div class="about page">
    <h1 class="page-title">关于我们</h1>

    <section class="block">
      <h2 class="block-title">协会简介</h2>
      <p>
        电子科技大学科幻协会（UESTC Science Fiction Association，UESTC-SFA）是电子科技大学校内
        以科幻、幻想文学与科学幻想文化为主题的社团。我们汇聚热爱科幻的成电学子，通过读书、观影、
        创作与交流，在校园内推广科幻文化，连接想象与现实。
      </p>
    </section>

    <section class="block">
      <h2 class="block-title">我们的宗旨</h2>
      <ul class="list">
        <li>推广科幻阅读与影视欣赏，营造校园科幻氛围</li>
        <li>鼓励科幻创作与评论，参与高校科幻平台与赛事</li>
        <li>搭建交流平台，让同好相识、互助与成长</li>
      </ul>
    </section>

    <section class="block">
      <h2 class="block-title">联系方式</h2>
      <p>
        欢迎对科幻感兴趣的同学加入我们。招新与日常动态请关注招新群或公众号（如有）。
        如有合作或咨询，可通过招新通道与我们取得联系。
      </p>
    </section>
  </div>
</template>

<style scoped>
.about.page {
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
