<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()
const revealed = ref(false)
const coordinates = ref('30.75 N, 103.93 E') // 清水河坐标

function reveal() {
  revealed.value = true
}

// 模拟随机数据跳变
function updateData() {
  coordinates.value = `30.${Math.floor(Math.random() * 100)} N, 103.${Math.floor(Math.random() * 100)} E`
}

onMounted(() => {
  setInterval(updateData, 5000)
})
</script>

<template>
  <footer class="site-footer">
    <!-- 顶部装饰线 -->
    <div class="footer-line">
      <div class="line-segment"></div>
      <div class="line-dot"></div>
      <div class="line-segment long"></div>
    </div>

    <div class="footer-content">
      <div class="footer-left">
        <div class="copyright">
          <span class="copy-symbol">&copy;</span>
          <span class="copy-year">{{ year }} </span>
          
          <!-- 隐藏入口逻辑 -->
          <span v-if="!revealed" class="secret-hint" role="button" tabindex="0" @click="reveal" @keydown.enter="reveal">
            UESTC-SFA
          </span>
          <RouterLink v-else to="/ue-stc" class="secret-link glitch-text">
            [ ue-stc ]
          </RouterLink>
        </div>
        
        <div class="friendly-links">
          <a href="https://www.uestc.edu.cn/" target="_blank" rel="noopener noreferrer" class="link-item">
            电子科技大学
          </a>
          <span class="sep">|</span>
          <a href="https://www.sfw.com.cn/" target="_blank" rel="noopener noreferrer" class="link-item">
            科幻世界
          </a>
          <span class="sep">|</span>
          <a href="https://www.0gsf.com/" target="_blank" rel="noopener noreferrer" class="link-item">
            零重力科幻
          </a>
          <span class="sep">|</span>
          <a href="https://csfdb.cn/" target="_blank" rel="noopener noreferrer" class="link-item">
            中文科幻数据库
          </a>
          <span class="sep">|</span>
          <a href="https://sci.kpcswa.org.cn/" target="_blank" rel="noopener noreferrer" class="link-item">
            科普科幻青年之星
          </a>
          <span class="sep">|</span>
          <a href="https://khyjzx.crsp.org.cn/" target="_blank" rel="noopener noreferrer" class="link-item">
            中国科幻研究中心
          </a>
          <span class="sep">|</span>
          <a href="https://hubingsf.cn/" target="_blank" rel="noopener noreferrer" class="link-item">
            斛兵群星科幻协会
          </a>
          <span class="sep">|</span>
          <a href="https://www.sfjiulong.org/" target="_blank" rel="noopener noreferrer" class="link-item">
            久隆计划
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  width: 100%;
  background: rgba(5, 8, 28, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--color-text-mute);
  z-index: 100;
}

/* 顶部装饰线 */
.footer-line {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.5;
}

.line-segment {
  height: 1px;
  background: var(--color-highlight);
  width: 20px;
}

.line-segment.long {
  flex: 1;
  background: linear-gradient(90deg, var(--color-highlight) 0%, transparent 100%);
}

.line-dot {
  width: 3px;
  height: 3px;
  background: var(--color-highlight);
  border-radius: 50%;
  box-shadow: 0 0 5px var(--color-highlight);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
}

.copyright {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.friendly-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.link-item {
  color: var(--color-text-mute);
  text-decoration: none;
  transition: all 0.3s;
  opacity: 0.8;
}

.link-item:hover {
  color: var(--color-highlight);
  text-shadow: 0 0 8px var(--color-highlight);
  opacity: 1;
}

.sep {
  color: var(--color-text-mute);
  opacity: 0.3;
}

/* 中间 */
.footer-center {
  flex: 1;
  text-align: center;
  min-width: 200px;
}

.secret-hint {
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.3s;
  padding: 0.25rem 0.5rem;
  border: 1px solid transparent;
}

.secret-hint:hover {
  color: var(--color-highlight);
  border-color: var(--color-highlight);
  text-shadow: 0 0 8px var(--color-highlight);
  background: rgba(25, 5, 250, 0.1);
}

.secret-link {
  color: var(--color-highlight);
  text-decoration: none;
  font-weight: 700;
  animation: glitch 1s infinite;
}

@keyframes glitch {
  0% { opacity: 1; }
  50% { opacity: 0.8; text-shadow: 2px 0 red, -2px 0 blue; }
  100% { opacity: 1; }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }
}
</style>
