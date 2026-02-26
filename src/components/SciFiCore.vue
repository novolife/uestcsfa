<script setup>
</script>

<template>
  <div class="scifi-core-container">
    <div class="core-scene">
      <!-- 外部轨道环（保持稳定参照） -->
      <div class="orbit-ring ring-x"></div>
      <div class="orbit-ring ring-y"></div>
      
      <!-- 变换的核心结构 -->
      <div class="shaping-core">
        <!-- 核心能量团（火焰感） -->
        <div class="inner-fire"></div>
        
        <!-- 变换的多面体面片 -->
        <div class="face face-1"></div>
        <div class="face face-2"></div>
        <div class="face face-3"></div>
        <div class="face face-4"></div>
        <div class="face face-5"></div>
        <div class="face face-6"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 根容器：提供 透视 (Perspective) */
.scifi-core-container {
  position: fixed;
  top: 40%;
  left: 50%;
  width: 60vh;
  height: 60vh;
  /* 移除 transform，因为在 fixed 容器上有时会干扰 perspective */
  /* transform: translate(-50%, -50%); */
  /* 使用 margin 替代 translate 居中，或者直接 left/top 计算好 */
  margin-left: -30vh;
  margin-top: -30vh;
  z-index: 0;
  pointer-events: none;
  perspective: 1200px;
  overflow: visible;
}

/* 场景：提供 3D 空间 */
.core-scene {
  position: absolute; /* 改为 absolute 撑满 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  /* 初始角度 */
  transform: rotateX(20deg) rotateY(20deg);
  animation: scene-rotate 30s linear infinite;
}


/* 轨道环 */
.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  /* 关键：防止环自身的变换 flatten */
  transform-style: preserve-3d;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(25, 5, 250, 0.3);
}

.ring-x {
  width: 140%;
  height: 140%;
  /* 确保 translate 和 rotate 顺序正确 */
  transform: translate(-50%, -50%) rotateX(80deg);
  border-color: rgba(25, 5, 250, 0.4);
  border-width: 2px;
}

.ring-y {
  width: 110%;
  height: 110%;
  transform: translate(-50%, -50%) rotateY(70deg);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 核心变形容器 */
.shaping-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350px; /* 加大 1.75x */
  height: 350px;
  /* 关键：这一层绝对不能漏 */
  transform-style: preserve-3d;
  transform: translate(-50%, -50%);
}

/* 内部火焰/能量团 */
.inner-fire {
  position: absolute;
  top: 10%; /* 调整火焰填充比例 */
  left: 10%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, #fff, var(--color-highlight) 40%, transparent 70%);
  filter: blur(20px); /* 加大模糊范围 */
  mix-blend-mode: screen;
  animation: fire-pulse 2s ease-in-out infinite alternate, shape-shift-core 20s ease-in-out infinite;
  opacity: 0.9;
  /* 尝试让它稍微 translateZ 一点点以防 z-fighting */
  transform: translateZ(0); 
}

/* 面片通用样式 */
.face {
  position: absolute;
  top: 0;
  left: 0;
  width: 350px; /* 同步加大 */
  height: 350px;
  
  background: rgba(10, 20, 80, 0.4);
  border: 2px solid rgba(100, 200, 255, 0.8);
  box-shadow: 
    0 0 25px var(--color-highlight) inset, /* 加大发光 */
    0 0 10px rgba(255, 255, 255, 0.5);
  
  /* 确保双面可见 */
  backface-visibility: visible;
  /* 移除 backdrop-filter，避免 3D 扁平化 */
  /* backdrop-filter: blur(2px); REMOVED */
  transform-style: preserve-3d;
  
  /* 纹理：网格线 */
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
  
  /* 关键动画：控制形态变换 */
  animation-duration: 20s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

/* 
  形态变换时间轴 (总长 20s)
  0% - 20%: 立方体 (Cube)
  25% - 45%: 展开卫星 (Satellite)
  50% - 70%: 金字塔/四面体 (Pyramid)
  75% - 95%: 混沌球体 (Chaos Sphere)
  100%: 回归立方体
*/

.face-1 { animation-name: transform-face-1; }
.face-2 { animation-name: transform-face-2; }
.face-3 { animation-name: transform-face-3; }
.face-4 { animation-name: transform-face-4; }
.face-5 { animation-name: transform-face-5; }
.face-6 { animation-name: transform-face-6; }

/* 动画定义区 */

@keyframes scene-rotate {
  0% { transform: rotateX(20deg) rotateY(20deg); }
  100% { transform: rotateX(380deg) rotateY(380deg); }
}

@keyframes fire-pulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.2); opacity: 0.9; }
}

/* Face 1: 前面 */
@keyframes transform-face-1 {
  0%, 20% { transform: translateZ(175px); } /* 立方体：175px */
  25%, 45% { transform: translateZ(260px) rotateZ(45deg); } /* 展开：加大推移 */
  50%, 70% { transform: rotateY(0deg) translateZ(140px) translateY(-80px) rotateX(30deg); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); border-radius: 0; } /* 金字塔侧面：按比例放大 */
  75%, 95% { transform: rotateX(0deg) rotateY(0deg) translateZ(80px) scale(0.6); border-radius: 50%; } /* 球体：稍微放大 */
  100% { transform: translateZ(175px); }
}

/* Face 2: 后面 */
@keyframes transform-face-2 {
  0%, 20% { transform: rotateY(180deg) translateZ(175px); }
  25%, 45% { transform: rotateY(180deg) translateZ(260px) rotateZ(45deg); }
  50%, 70% { transform: rotateY(120deg) translateZ(140px) translateY(-80px) rotateX(30deg); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); border-radius: 0; }
  75%, 95% { transform: rotateX(60deg) rotateY(60deg) translateZ(80px) scale(0.6); border-radius: 50%; }
  100% { transform: rotateY(180deg) translateZ(175px); }
}

/* Face 3: 左面 */
@keyframes transform-face-3 {
  0%, 20% { transform: rotateY(-90deg) translateZ(175px); }
  25%, 45% { transform: rotateY(-90deg) translateZ(260px) rotateZ(45deg); }
  50%, 70% { transform: rotateY(240deg) translateZ(140px) translateY(-80px) rotateX(30deg); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); border-radius: 0; }
  75%, 95% { transform: rotateX(120deg) rotateY(120deg) translateZ(80px) scale(0.6); border-radius: 50%; }
  100% { transform: rotateY(-90deg) translateZ(175px); }
}

/* Face 4: 右面 */
@keyframes transform-face-4 {
  0%, 20% { transform: rotateY(90deg) translateZ(175px); }
  25%, 45% { transform: rotateY(90deg) translateZ(260px) rotateZ(45deg); }
  50%, 70% { transform: rotateX(90deg) translateZ(140px); clip-path: none; opacity: 0; }
  75%, 95% { transform: rotateX(180deg) rotateY(180deg) translateZ(80px) scale(0.6); border-radius: 50%; opacity: 0.7; }
  100% { transform: rotateY(90deg) translateZ(175px); opacity: 0.7; }
}

/* Face 5: 上面 */
@keyframes transform-face-5 {
  0%, 20% { transform: rotateX(90deg) translateZ(175px); }
  25%, 45% { transform: rotateX(90deg) translateZ(260px) rotateZ(45deg); }
  50%, 70% { transform: rotateX(-90deg) translateZ(140px); opacity: 0; }
  75%, 95% { transform: rotateX(240deg) rotateY(240deg) translateZ(80px) scale(0.6); border-radius: 50%; opacity: 0.7; }
  100% { transform: rotateX(90deg) translateZ(175px); opacity: 0.7; }
}

/* Face 6: 下面 */
@keyframes transform-face-6 {
  0%, 20% { transform: rotateX(-90deg) translateZ(175px); }
  25%, 45% { transform: rotateX(-90deg) translateZ(260px) rotateZ(45deg); }
  50%, 70% { transform: rotateY(0deg) translateZ(0) translateY(80px) rotateX(90deg) scale(0.6); border-radius: 50%; opacity: 0.5; }
  75%, 95% { transform: rotateX(300deg) rotateY(300deg) translateZ(80px) scale(0.6); border-radius: 50%; opacity: 0.7; }
  100% { transform: rotateX(-90deg) translateZ(175px); opacity: 0.7; }
}

@media (max-width: 768px) {
  .scifi-core-container {
    width: 80vw;
    height: 80vw;
  }
}
</style>
