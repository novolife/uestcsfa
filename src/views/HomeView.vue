<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <section class="hero">
      <img
        class="hero-flag"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_SFA_of_UESTC.jpg/320px-Flag_of_SFA_of_UESTC.jpg"
        alt=""
        width="200"
        height="150"
      />
      <h1 class="hero-title">电子科技大学科幻协会</h1>
      <p class="hero-meta">2017 年成立 · 第 35 届银河奖最佳科幻团体</p>
      <p class="hero-desc">征文、观影、桌游、创作与交流<br />成电校园里的科幻同好聚集地</p>
      <RouterLink to="/join" class="btn">加入我们</RouterLink>
    </section>

    <section class="intro">
      <p>
        UESTC-SFA 是校内以科幻与幻想文化为主题的学生社团。我们参与校内外征文与赛事、
        科幻桌游、观影与剧本创作，组织参观《科幻世界》编辑部，并与友校科幻协会交流；
        曾参与中国国际科幻大会等志愿服务。
      </p>
      <p>
        <RouterLink to="/about">关于协会</RouterLink>
        <span class="sep"> · </span>
        <RouterLink to="/activities">活动一览</RouterLink>
      </p>
    </section>

    <section class="doing">
      <h2 class="doing-title">我们在做什么</h2>
      <div class="doing-grid">
        <div class="doing-box">
          <FontAwesomeIcon :icon="['fas', 'pen-fancy']" class="doing-icon" aria-hidden="true" />
          <h3 class="doing-box-title">征文与创作</h3>
          <p class="doing-box-desc">科幻征文比赛、电影剧情创作。</p>
        </div>
        <div class="doing-box">
          <FontAwesomeIcon :icon="['fas', 'book-open']" class="doing-icon" aria-hidden="true" />
          <h3 class="doing-box-title">桌游与观影</h3>
          <p class="doing-box-desc">科幻桌游大赛、观影交流。</p>
        </div>
        <div class="doing-box">
          <FontAwesomeIcon :icon="['fas', 'users']" class="doing-icon" aria-hidden="true" />
          <h3 class="doing-box-title">交流与志愿</h3>
          <p class="doing-box-desc">参观《科幻世界》编辑部、友校交流、科幻大会志愿。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.hero {
  text-align: center;
  padding: 1rem 0 2rem;
}

.hero-flag {
  width: 120px;
  height: 90px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
}

.hero-meta {
  font-size: 0.85rem;
  color: var(--color-text-mute);
  margin-bottom: 0.5rem;
}

.hero-desc {
  font-size: 1rem;
  color: var(--color-text);
  max-width: 28em;
  margin: 0 auto 1.25rem;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn:hover {
  background: var(--color-accent-hover);
  color: #fff;
  text-decoration: none;
}

.intro {
  padding: 0 0.25rem;
}

.intro p {
  color: var(--color-text);
  line-height: 1.75;
  margin-bottom: 0.75rem;
}

.intro .sep {
  color: var(--color-border);
}

.doing {
  padding: 0 0.25rem;
}

.doing-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.doing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.doing-box {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg-soft);
}

.doing-icon {
  display: block;
  font-size: 1.5rem;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.doing-box-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.35rem;
}

.doing-box-desc {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  line-height: 1.5;
  margin: 0;
}
</style>
