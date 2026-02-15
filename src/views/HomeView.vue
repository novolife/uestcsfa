<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <section class="hero">
      <img
        class="hero-flag"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_SFA_of_UESTC.jpg/320px-Flag_of_SFA_of_UESTC.jpg"
        alt="电子科技大学科幻协会旗帜（死星与鸽子）"
        width="240"
        height="180"
      />
      <h1 class="hero-title">
        <span class="line1">电子科技大学</span>
        <span class="line2">科幻协会</span>
      </h1>
      <p class="hero-desc">探索想象边界，共筑科幻梦想 · 第 35 届银河奖最佳科幻团体</p>
      <div class="hero-actions">
        <RouterLink to="/join" class="btn btn-primary">加入我们</RouterLink>
        <RouterLink to="/activities" class="btn btn-outline">近期活动</RouterLink>
      </div>
    </section>

    <section class="intro section">
      <h2 class="section-title">关于协会</h2>
      <p class="intro-text">
        电子科技大学科幻协会（UESTC-SFA）成立于 2018 年，现有成员约 300 人，是成电校园内热爱科幻、幻想文学与科普的同学们共同的家园。
        我们开展征文、观影、桌游、创作与交流，参与中国国际科幻大会等志愿服务，2024 年荣获第 35 届银河奖「最佳科幻团体奖」，让想象力在现实与未来之间自由驰骋。
      </p>
      <RouterLink to="/about" class="link-more">了解更多 →</RouterLink>
    </section>

    <section class="features section">
      <h2 class="section-title">我们在做什么</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <FontAwesomeIcon :icon="['fas', 'book-open']" class="feature-icon" aria-hidden="true" />
          <h3>征文与创作</h3>
          <p>科幻征文比赛、电影剧情创作，参与高校科幻赛事与《科幻世界》等平台。</p>
        </div>
        <div class="feature-card">
          <FontAwesomeIcon :icon="['fas', 'pen-fancy']" class="feature-icon" aria-hidden="true" />
          <h3>桌游与观影</h3>
          <p>科幻桌游大赛、观影交流，在游戏与影像中体验科幻世界。</p>
        </div>
        <div class="feature-card">
          <FontAwesomeIcon :icon="['fas', 'users']" class="feature-icon" aria-hidden="true" />
          <h3>交流与志愿</h3>
          <p>友校交流、参观编辑部、中国国际科幻大会等志愿服务。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.hero {
  text-align: center;
  padding: 2rem 0 4rem;
}

.hero-flag {
  width: 160px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.hero-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: var(--color-heading);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hero-title .line2 {
  color: var(--color-accent);
}

.hero-desc {
  margin-top: 1.25rem;
  font-size: 1.15rem;
  color: var(--color-text-mute);
}

.hero-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-bg);
}

.btn-primary:hover {
  background: var(--color-accent-dim);
  color: var(--color-bg);
}

.btn-outline {
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-outline:hover {
  border-color: var(--color-accent);
  background: rgba(99, 102, 241, 0.12);
  color: var(--color-accent);
}

.section {
  padding: 0 0.5rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.intro-text {
  color: var(--color-text);
  max-width: 720px;
  line-height: 1.8;
}

.link-more {
  display: inline-block;
  margin-top: 1rem;
  font-weight: 500;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 0 24px rgba(99, 102, 241, 0.1);
}

.feature-icon {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 1.75rem;
  color: var(--color-accent);
}

.feature-icon.svg-inline-line-fa {
  height: 1.75rem;
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.95rem;
  color: var(--color-text-mute);
  line-height: 1.6;
}
</style>
