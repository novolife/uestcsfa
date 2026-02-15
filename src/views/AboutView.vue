<script setup>
</script>

<template>
  <div class="about page">
    <h1 class="page-title">关于我们</h1>

    <section class="block">
      <h2 class="block-title">协会简介</h2>
      <p>
        电子科技大学科幻协会（UESTC Science Fiction Association，UESTC-SFA）成立于 2017 年，
        是校内以科幻、幻想文学与科学幻想文化为主题的学生社团。我们汇聚热爱科幻的成电学子，目前成员约 300 人，
        通过征文、观影、桌游、创作与交流，在校园内推广科幻文化，并参与中国国际科幻大会等大型活动的志愿服务，
        连接想象与现实。
      </p>
    </section>

    <section class="block">
      <h2 class="block-title">荣誉</h2>
      <p>
        2024 年 9 月，协会荣获第 35 届中国科幻银河奖「最佳科幻团体奖」，为电子科技大学学生社团首次获得该奖项。
        银河奖被誉为「中国科幻最高奖」。协会曾参与中国国际科幻大会等大型科幻盛会的志愿服务活动，并在此基础上继续推动校园科幻文化发展。
      </p>
    </section>

    <section class="block">
      <h2 class="block-title">学校支持</h2>
      <p>
        学校在科幻文化建设方面提供多层次支持：曾联合《科幻世界》主办科幻写作训练营（实验室参访、写作课程、电影鉴赏、文学沙龙等），
        举办「科学、幻想与未来」征文大赛，并设有数字文化与传媒研究基地，支持科幻相关研究与活动。
      </p>
    </section>

    <section class="block">
      <h2 class="block-title">我们的宗旨</h2>
      <ul class="list">
        <li>推广科幻阅读与影视欣赏，营造校园科幻氛围</li>
        <li>鼓励科幻创作与评论，参与高校科幻平台与赛事</li>
        <li>搭建交流平台，与友校科幻协会及《科幻世界》等机构互动、互助与成长</li>
      </ul>
    </section>

    <section class="block">
      <h2 class="block-title">联系方式</h2>
      <p>
        欢迎对科幻感兴趣的同学加入我们。招新一般在每学年开学季进行，请关注校内社团联合招新信息及
        <a href="https://xgb.uestc.edu.cn" target="_blank" rel="noopener">党委学生工作部</a>相关通知，
        或向已加入协会的同学咨询招新群号。如有合作或咨询，可通过招新通道与我们取得联系。
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
