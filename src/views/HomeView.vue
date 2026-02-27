<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <!-- 核心视觉区（留空给背景的核心组件） -->
    <div class="core-viewport"></div>

    <!-- 底部控制台区域 -->
    <section class="console-deck">
      <div class="deck-header">
        <h1 class="hero-title">电子科技大学科幻协会</h1>
        <p class="hero-meta">EST. 2017 · GALAXY AWARD WINNER</p>
        <p class="hero-desc">
          [ 征文 / 观影 / 桌游 / 创作 / 交流 ]
          <br>
          成电校园里的科幻同好聚集地
        </p>
        <RouterLink to="/join" class="btn-activate">
          <span class="btn-text">JOIN US</span>
          <span class="btn-deco"></span>
        </RouterLink>
      </div>

      <div class="deck-modules">
        <div class="module-box">
          <h3 class="module-title">CREATION</h3>
          <p class="module-desc">征文比赛 / 剧情创作</p>
        </div>
        <div class="module-box">
          <h3 class="module-title">EVENT</h3>
          <p class="module-desc">观影 / 桌游 / 沙龙</p>
        </div>
        <div class="module-box">
          <h3 class="module-title">CONTACT</h3>
          <p class="module-desc">参访 / 交流 / 志愿</p>
        </div>
      </div>
    </section>

    <!-- 底部次级导航/介绍（可选） -->
    <section class="sub-deck">
      <p>
        UESTC-SFA 致力于构建校园幻想文化节点
        <RouterLink to="/about" class="deck-link">关于</RouterLink>
        <span class="sep">/</span>
        <RouterLink to="/activities" class="deck-link">活动</RouterLink>
      </p>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 80vh; /* 撑开高度 */
  position: relative;
}

/* 核心视口占位，把内容推到下方 */
.core-viewport {
  flex: 1;
  min-height: 40vh;
  /* 这一区域留白给背景的 3D 核心 */
}

/* 底部控制台 */
.console-deck {
  background: rgba(5, 8, 28, 0.6);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-border);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 20;
  clip-path: polygon(
    0 20px, 20px 0, 
    100% 0, 100% 100%, 
    0 100%
  );
  margin-top: -2rem; /* 稍微向上一点，覆盖部分核心下部 */
}

.deck-header {
  text-align: center;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  letter-spacing: 0.15em;
  position: relative;
  /* 基础光晕，保持常亮 */
  text-shadow: 
    0 0 10px rgba(25, 5, 250, 0.8),
    0 0 20px rgba(25, 5, 250, 0.4);
}

/* 伪元素做高频故障放电 */
.hero-title::before,
.hero-title::after {
  content: "电子科技大学科幻协会"; /* 内容必须同步 */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent; /* 背景透明 */
  overflow: hidden;
  opacity: 0.8;
}

/* 第一层故障：红色偏移 */
.hero-title::before {
  left: 2px;
  text-shadow: -1px 0 red;
  clip-path: inset(0 0 0 0);
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

/* 第二层故障：蓝色偏移 */
.hero-title::after {
  left: -2px;
  text-shadow: 1px 0 blue;
  clip-path: inset(0 0 0 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

/* 随机切割动画 */
@keyframes glitch-anim-1 {
  0% { clip-path: inset(20% 0 80% 0); }
  20% { clip-path: inset(60% 0 10% 0); }
  40% { clip-path: inset(40% 0 50% 0); }
  60% { clip-path: inset(80% 0 5% 0); }
  80% { clip-path: inset(10% 0 60% 0); }
  100% { clip-path: inset(30% 0 30% 0); }
}

@keyframes glitch-anim-2 {
  0% { clip-path: inset(10% 0 60% 0); }
  20% { clip-path: inset(30% 0 20% 0); }
  40% { clip-path: inset(10% 0 80% 0); }
  60% { clip-path: inset(70% 0 10% 0); }
  80% { clip-path: inset(50% 0 30% 0); }
  100% { clip-path: inset(0% 0 90% 0); }
}

.hero-meta {
  font-size: 0.8rem;
  color: var(--color-accent);
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.hero-desc {
  font-size: 1rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* 激活按钮 */
.btn-activate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0.75rem 2rem;
  background: rgba(25, 5, 250, 0.2);
  border: 1px solid var(--color-highlight);
  color: var(--color-highlight);
  font-weight: 700;
  letter-spacing: 0.1em;
  overflow: hidden;
  transition: all 0.3s;
}

.btn-activate:hover {
  background: var(--color-highlight);
  color: #fff;
  box-shadow: 0 0 20px var(--color-highlight);
}

.btn-deco {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, transparent 50%, #fff 50%);
}

/* 模块卡片 */
.deck-modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.module-box {
  background: rgba(16, 26, 86, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  text-align: center;
  transition: all 0.3s;
}

.module-box:hover {
  background: rgba(25, 5, 250, 0.1);
  border-color: var(--color-highlight);
  transform: translateY(-2px);
}

.module-title {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.module-desc {
  font-size: 0.9rem;
  color: var(--color-text);
}

/* 次级甲板 */
.sub-deck {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-mute);
}

.deck-link {
  color: var(--color-accent);
  margin: 0 0.25rem;
}

.deck-link:hover {
  text-decoration: underline;
  text-shadow: 0 0 5px var(--color-highlight);
}

.sep {
  opacity: 0.3;
}

@media (min-width: 768px) {
  .console-deck {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: 2rem 3rem;
  }

  .deck-header {
    flex: 1;
    text-align: left;
    border-bottom: none;
    border-right: 1px dashed rgba(255, 255, 255, 0.1);
    padding-bottom: 0;
    padding-right: 2rem;
  }

  .deck-modules {
    flex: 1;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .module-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    text-align: left;
  }

  .module-title {
    margin-bottom: 0;
    min-width: 80px;
  }
}
</style>
