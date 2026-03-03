<script setup>
import { ref } from 'vue'

const links = [
  { name: '电子科技大学', url: 'https://www.uestc.edu.cn/', domain: 'uestc.edu.cn' },
  { name: '科幻世界', url: 'https://www.sfw.com.cn/', domain: 'sfw.com.cn' },
  { name: '零重力科幻', url: 'https://www.0gsf.com/', domain: '0gsf.com' },
  { name: '中文科幻数据库', url: 'https://csfdb.cn/', domain: 'csfdb.cn' },
  { name: '科普科幻青年之星', url: 'https://sci.kpcswa.org.cn/', domain: 'sci.kpcswa.org.cn' },
  { name: '中国科幻研究中心', url: 'https://khyjzx.crsp.org.cn/', domain: 'khyjzx.crsp.org.cn' },
  { name: '斛兵群星科幻协会', url: 'https://hubingsf.cn/', domain: 'hubingsf.cn' },
  { name: '久隆计划', url: 'https://www.sfjiulong.org/', domain: 'sfjiulong.org' },
]

function faviconUrl(domain) {
  return `https://${domain}/favicon.ico`
}

const logoFailed = ref({})
function setLogoFailed(url) {
  logoFailed.value[url] = true
}

function fallbackText(name) {
  return name.length > 4 ? name.slice(0, 2) : name.slice(0, 1)
}
</script>

<template>
  <div class="join page">
    <h1 class="page-title">加入我们</h1>

    <div class="prose">
      <p>
        协会成立于 2017 年，现有成员约 300 人，2024 年获第 35 届银河奖「最佳科幻团体奖」。
        无论你是喜欢科幻小说、影视，还是写作与桌游，都欢迎加入。
      </p>
      <h2 class="subhead">如何加入</h2>
      <p>
        招新在每学年开学季进行，届时会有招新摊位和招新群。请关注
        <a href="https://xgb.uestc.edu.cn" target="_blank" rel="noopener">党委学生工作部</a>及校内社团联合招新通知，
        或向已加入的同学问招新群号。招新群号与公众号在招新季更新；非招新季可先关注后续动态。
      </p>
      <h2 class="subhead">你能获得</h2>
      <p>
        与同好一起参与征文、观影、桌游与讨论的圈子；银河奖、星云奖及高校科幻征文与创作机会；
        参观《科幻世界》编辑部、友校交流、科幻大会志愿等经历；
        以及学校科幻写作训练营、征文大赛与数字文化与传媒研究基地等资源。
      </p>

      <h2 class="subhead">友情链接</h2>
      <div class="friend-cards">
        <a
          v-for="item in links"
          :key="item.url"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="friend-card"
        >
          <div class="card-logo">
            <img
              v-show="!logoFailed[item.url]"
              :src="faviconUrl(item.domain)"
              :alt="item.name"
              @error="setLogoFailed(item.url)"
            />
            <span v-show="logoFailed[item.url]" class="logo-fallback">{{ fallbackText(item.name) }}</span>
          </div>
          <span class="card-name">{{ item.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.join.page {
  max-width: 640px;
}

.join.page .friend-cards {
  max-width: 100%;
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
  margin: 1.25rem 0 0.5rem;
}

.prose a:hover {
  text-decoration: underline;
}

.friend-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.friend-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-text);
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
}

.friend-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--color-highlight);
  color: var(--color-highlight);
  transform: translateY(-2px);
}

.card-logo {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.card-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.card-logo .logo-fallback {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-highlight);
  letter-spacing: 0.02em;
}

.card-name {
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.3;
}
</style>
