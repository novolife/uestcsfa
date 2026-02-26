<template>
  <div class="scifi-overlay">
    <div class="scanlines"></div>
    <div class="vignette"></div>
    <div class="grain"></div>
  </div>
</template>

<style scoped>
.scifi-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none; /* 点击穿透，不影响操作 */
  overflow: hidden;
}

/* 扫描线效果 */
.scanlines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 50%
  );
  background-size: 100% 4px;
  opacity: 0.15;
  animation: scanlines-move 20s linear infinite;
}

@keyframes scanlines-move {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}

/* 暗角效果 */
.vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.6) 100%);
}

/* 噪点效果 */
.grain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: 0.05;
  mix-blend-mode: overlay;
  animation: grain-shift 0.5s infinite steps(2);
}

@keyframes grain-shift {
  0% { transform: translate(0, 0); }
  50% { transform: translate(1px, 1px); }
  100% { transform: translate(-1px, -1px); }
}

/* 移动端减弱扫描线，防止闪烁 */
@media (max-width: 768px) {
  .scanlines {
    background-size: 100% 2px;
    opacity: 0.1;
  }
}
</style>
