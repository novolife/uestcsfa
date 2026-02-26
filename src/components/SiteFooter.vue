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
      <!-- 左侧：版权信息与入口 -->
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
        
        <a href="https://www.uestc.edu.cn/" target="_blank" rel="noopener noreferrer" class="school-link">
          &lt; 电子科技大学 &gt;
        </a>

        <div class="system-status">
          <span class="status-dot"></span>
          <span class="status-text">SYSTEM ONLINE</span>
        </div>
      </div>

      <!-- 右侧：数据装饰 -->
      <div class="footer-right">
        <div class="data-block">
          <span class="data-label">COORD:</span>
          <span class="data-value">{{ coordinates }}</span>
        </div>
        <div class="data-block">
          <span class="data-label">VER:</span>
          <span class="data-value">2.0.99</span>
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* 左侧 */
.footer-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.copyright {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: #0f0; /* 绿色状态 */
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #0f0;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.school-link {
  color: var(--color-text-mute);
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.3s;
  width: fit-content;
  opacity: 0.8;
  letter-spacing: 0.05em;
}

.school-link:hover {
  color: var(--color-highlight);
  text-shadow: 0 0 8px var(--color-highlight);
  opacity: 1;
}

@keyframes pulse {
  0% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.4; transform: scale(0.8); }
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

/* 右侧 */
.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  text-align: right;
}

.data-block {
  display: flex;
  gap: 0.5rem;
}

.data-label {
  color: var(--color-text-mute);
  opacity: 0.7;
}

.data-value {
  color: var(--color-text);
  font-family: monospace;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-right {
    align-items: center;
  }
  
  .footer-center {
    order: -1; /* 把入口放最上面方便点击 */
    margin-bottom: 0.5rem;
  }
}
</style>
