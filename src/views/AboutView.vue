<script setup>
</script>

<template>
  <div class="about page">
    <h1 class="page-title">关于我们</h1>

    <div class="prose">
      <p>
        电子科技大学科幻协会（UESTC-SFA）成立于 2017 年，是校内以科幻、幻想文学与科学幻想文化为主题的学生社团，
        目前成员约 300 人。日常开展征文、观影、桌游、创作与交流，参与中国国际科幻大会等志愿服务。
      </p>
      <p>
        2024 年 9 月获第 35 届中国科幻银河奖「最佳科幻团体奖」，为学校学生社团首次获得该奖。银河奖被誉为「中国科幻最高奖」。
      </p>
      <p>
        学校在科幻文化建设上提供不少支持：举办「科学、幻想与未来」征文大赛，并设有数字文化与传媒研究基地。
      </p>
      <p>
        我们希望能营造校园科幻氛围、鼓励创作与评论、参与高校科幻平台与赛事，并与友校科幻协会及《科幻世界》等机构保持交流。
      </p>

      <h2 class="subhead">社团形象：星璃</h2>
      <p>
        星璃是电子科技大学科幻协会的看板娘与虚拟形象，活跃在社团的各类宣传与周边中。以下是星璃的表情包系列：
      </p>
      <div class="mascot-grid">
        <div v-for="i in 9" :key="i" class="mascot-item">
          <img :src="`/uestcsfa/images/mascot/xingli${i}.png`" :alt="`星璃表情包 ${i}`" loading="lazy">
        </div>
      </div>

      <h2 class="subhead">联系方式</h2>
      <p>
        招新一般在每学年开学季进行。请关注校内社团联合招新（百团大战）及学生社团联合会通知，
        或向已加入协会的同学咨询招新群号。合作与咨询可通过招新通道联系。
      </p>
    </div>
  </div>
</template>

<style scoped>
.about.page {
  max-width: 640px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.prose {
  font-size: 0.95rem;
}

.prose p {
  color: var(--color-text);
  line-height: 1.75;
  margin-bottom: 1rem;
}

.prose .subhead {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 1.5rem 0 0.5rem;
}

.prose a:hover {
  text-decoration: underline;
}

.mascot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

@media (min-width: 640px) {
  .mascot-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.mascot-item {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  aspect-ratio: 1;
}

.mascot-item:hover {
  transform: translateY(-5px);
  border-color: var(--color-highlight);
  box-shadow: 0 5px 15px rgba(25, 5, 250, 0.3);
  background: rgba(25, 5, 250, 0.1);
}

.mascot-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
}

</style>
