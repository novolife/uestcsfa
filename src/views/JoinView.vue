<script setup>
import { ref } from 'vue'

const base = import.meta.env.BASE_URL
const qqGroupId = '852163253'
const qqQrcode = base + 'uestcsfa-qrcode.png'
const wechatQrcode = base + 'sfa-wechat-qrcode.jpg'

const links = [
  { name: '电子科技大学', url: 'https://www.uestc.edu.cn/', logo: 'uestc.svg' },
  { name: '元科幻UESTC', logo: 'meta-uestc.png', qrcode: 'meta-uestc-qrcode.png' },
  { name: '科幻世界', url: 'https://www.sfw.com.cn/', logo: 'sfw-com-cn.png' },
  { name: '零重力科幻', url: 'https://www.0gsf.com/', logo: '0gsf-com.png' },
  { name: '中文科幻数据库', url: 'https://csfdb.cn/', logo: 'csfdb-cn.png' },
  { name: '科普科幻青年之星', url: 'https://sci.kpcswa.org.cn/', logo: 'sci-kpcswa.png' },
  { name: '中国科幻研究中心', url: 'https://khyjzx.crsp.org.cn/', logo: 'khyjzx-crsp.png' },
  { name: '斛兵群星科幻协会', url: 'https://hubingsf.cn/', logo: 'hubingsf-cn.png' },
  { name: '久隆计划', url: 'https://www.sfjiulong.org/', logo: 'sfjiulong-org.png' },
]

function logoSrc(logo) {
  return base + 'friend-links/' + logo
}

const logoFailed = ref({})
function itemKey(item) {
  return item.url || item.qrcode || item.name
}
function setLogoFailed(key) {
  logoFailed.value[key] = true
}

const qrcodeVisible = ref(null)
function showQrcode(qrcode) {
  qrcodeVisible.value = qrcode
}
function hideQrcode() {
  qrcodeVisible.value = null
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
        招新在每学年开学季进行，届时会有招新摊位和招新群，请关注校内社团联合招新通知。
      </p>
      <h2 class="subhead">你能获得</h2>
      <p>
        与同好一起参与征文、观影、桌游与讨论的圈子；银河奖、星云奖及高校科幻征文与创作机会；
        参观《科幻世界》编辑部、友校交流、科幻大会志愿等经历；
        以及学校科幻写作训练营、征文大赛与数字文化与传媒研究基地等资源。
      </p>

      <h2 class="subhead">联系方式</h2>
      <div class="contact-grid">
        <section class="contact-card qq-card">
          <header class="contact-header">
            <FontAwesomeIcon icon="fa-brands fa-qq" class="qq-icon" />
            <div class="contact-text">
              <div class="contact-title">协会 QQ 群</div>
              <div class="contact-id">群号：{{ qqGroupId }}</div>
            </div>
          </header>
          <img
            :src="qqQrcode"
            :alt="`协会 QQ 群二维码 ${qqGroupId}`"
            class="contact-qr"
          />
        </section>

        <section class="contact-card wechat-card">
          <header class="contact-header">
            <FontAwesomeIcon icon="fa-brands fa-weixin" class="wechat-icon" />
            <div class="contact-text">
              <div class="contact-title">协会公众号</div>
              <div class="contact-id">UESTC科幻社</div>
            </div>
          </header>
          <img
            :src="wechatQrcode"
            alt="协会公众号二维码 UESTC科幻社"
            class="contact-qr"
          />
        </section>
      </div>

      <h2 class="subhead">友情链接</h2>
      <div class="friend-cards">
        <template v-for="item in links" :key="itemKey(item)">
          <a
            v-if="item.url"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            class="friend-card"
          >
            <div class="card-logo">
              <img
                v-show="!logoFailed[itemKey(item)]"
                :src="logoSrc(item.logo)"
                :alt="item.name"
                @error="setLogoFailed(itemKey(item))"
              />
              <span v-show="logoFailed[itemKey(item)]" class="logo-fallback">{{ fallbackText(item.name) }}</span>
            </div>
            <span class="card-name">{{ item.name }}</span>
          </a>
          <button
            v-else
            type="button"
            class="friend-card friend-card-button"
            @click="showQrcode(item.qrcode)"
          >
            <div class="card-logo">
              <img
                v-show="!logoFailed[itemKey(item)]"
                :src="logoSrc(item.logo)"
                :alt="item.name"
                @error="setLogoFailed(itemKey(item))"
              />
              <span v-show="logoFailed[itemKey(item)]" class="logo-fallback">{{ fallbackText(item.name) }}</span>
            </div>
            <span class="card-name">{{ item.name }}</span>
          </button>
        </template>
      </div>
    </div>

    <!-- 公众号二维码弹层：点击任意处关闭 -->
    <Teleport to="body">
      <div
        v-if="qrcodeVisible"
        class="qrcode-overlay"
        role="button"
        tabindex="0"
        aria-label="关闭"
        @click="hideQrcode"
        @keydown.enter="hideQrcode"
        @keydown.escape="hideQrcode"
      >
        <img
          :src="logoSrc(qrcodeVisible)"
          alt="公众号二维码"
          class="qrcode-image"
        />
      </div>
    </Teleport>
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

.contact-grid {
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.contact-card {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.contact-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.qq-icon {
  font-size: 1.4rem;
  color: #00a1d6;
}

.contact-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.contact-id {
  font-size: 0.85rem;
  color: var(--color-text-mute);
}

.contact-qr {
  display: block;
  width: 160px;
  max-width: 100%;
  border-radius: 8px;
}

.wechat-icon {
  font-size: 1.4rem;
  color: #1aad19;
}

@media (min-width: 640px) {
  .contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: flex-start;
  }

  .contact-card {
    height: 100%;
  }
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
  transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}

.friend-card:hover,
.prose a.friend-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 0 0 2px var(--color-accent-hover);
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

.friend-card-button {
  cursor: pointer;
  border: none;
  font: inherit;
  width: 100%;
  text-align: inherit;
}

.qrcode-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  cursor: pointer;
}

.qrcode-image {
  max-width: 85vw;
  max-height: 85vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  pointer-events: none;
}
</style>
