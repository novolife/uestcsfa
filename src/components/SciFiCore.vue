<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null
let particles = []
let targetShape = 'sphere' 
let currentShapeIndex = 0
let lastTime = 0
let rotationX = 0
let rotationY = 0
let shapeIntervalId = null

// 配置参数
const config = {
  particleCount: 1200, 
  baseRadius: 180,     
  perspective: 800,    
  color: { r: 25, g: 5, b: 250 }, 
  rotationSpeed: 0.005, 
  shapeChangeInterval: 5000, 
}

// 形状定义生成器
const shapes = {
  // 球体
  sphere: (i, total) => {
    const phi = Math.acos(-1 + (2 * i) / total)
    const theta = Math.sqrt(total * Math.PI) * phi
    const r = config.baseRadius
    return {
      x: r * Math.cos(theta) * Math.sin(phi),
      y: r * Math.sin(theta) * Math.sin(phi),
      z: r * Math.cos(phi)
    }
  },
  
  // 立方体
  cube: (i, total) => {
    const size = config.baseRadius * 1.5 
    const faceIndex = Math.floor(i / (total / 6))
    const half = size / 2
    let x, y, z
    const a = (Math.random() - 0.5) * size
    const b = (Math.random() - 0.5) * size
    
    switch(faceIndex % 6) {
      case 0: x = half; y = a; z = b; break;
      case 1: x = -half; y = a; z = b; break;
      case 2: x = a; y = half; z = b; break;
      case 3: x = a; y = -half; z = b; break;
      case 4: x = a; y = b; z = half; break;
      case 5: x = a; y = b; z = -half; break;
      default: x = 0; y = 0; z = 0;
    }
    return { x, y, z }
  },
  
  // 四面体
  tetrahedron: (i, total) => {
    const size = config.baseRadius * 1.8
    const v = [
      { x: size, y: size, z: size },
      { x: -size, y: -size, z: size },
      { x: -size, y: size, z: -size },
      { x: size, y: -size, z: -size }
    ]
    const face = Math.floor(i / (total / 4)) % 4
    
    const v1 = v[face]
    const v2 = v[(face + 1) % 4]
    const v3 = v[(face + 2) % 4]
    
    let r1 = Math.random()
    let r2 = Math.random()
    if (r1 + r2 > 1) {
      r1 = 1 - r1
      r2 = 1 - r2
    }
    
    return {
      x: v1.x + r1 * (v2.x - v1.x) + r2 * (v3.x - v1.x),
      y: v1.y + r1 * (v2.y - v1.y) + r2 * (v3.y - v1.y),
      z: v1.z + r1 * (v2.z - v1.z) + r2 * (v3.z - v1.z)
    }
  },

  // 双螺旋 (DNA Double Helix)
  helix: (i, total) => {
    // 调整参数：直径减小，高度增加，圈数减少（即波长增加）
    const r = config.baseRadius * 0.5 // 直径更小
    const h = config.baseRadius * 3.0 // 高度拉长
    const loops = 2.5 // 圈数减少，波长变长
    
    // 将粒子分为三部分：链A，链B，以及中间的梯级
    // 40% 链A，40% 链B，20% 梯级
    const type = i % 10 // 0-3: A, 4-7: B, 8-9: Rung
    
    // 垂直位置 (-0.5 到 0.5)
    const y = ((i / total) - 0.5) * h
    // 螺旋角度
    const angle = (y / h) * Math.PI * 2 * loops
    
    if (type < 4) {
      // 链 A
      return {
        x: r * Math.cos(angle),
        y: y,
        z: r * Math.sin(angle)
      }
    } else if (type < 8) {
      // 链 B (相位差 PI)
      return {
        x: r * Math.cos(angle + Math.PI),
        y: y,
        z: r * Math.sin(angle + Math.PI)
      }
    } else {
      // 梯级 (连接 A 和 B 的横杠)
      // 使用线性插值连接两点
      // t 从 -1 到 1 分布
      const t = (Math.random() * 2 - 1)
      // A 点坐标
      const ax = r * Math.cos(angle)
      const az = r * Math.sin(angle)
      
      // 插值计算
      // 由于 B = -A (相位差180度)，中间点即原点
      // P = t * A (t=1为A, t=-1为B)
      return {
        x: ax * t,
        y: y,
        z: az * t
      }
    }
  },

  // 螺旋星系 (Spiral Galaxy)
  galaxy: (i, total) => {
    const arms = 2 // 旋臂数量
    const armOffset = (Math.PI * 2) / arms
    // 随机分配到某个旋臂，或者均匀分配
    const armIndex = i % arms
    const randomOffset = Math.random() * 0.5 // 随机偏移量
    
    // 距离中心的距离 (0 到 1)
    const dist = Math.random() 
    const r = config.baseRadius * dist * 1.5 // 星系半径稍大
    
    // 螺旋角度：随距离增加而增加
    // 基础角度 + 旋臂偏移 + 螺旋卷曲
    const angle = dist * Math.PI * 4 + (armIndex * armOffset) + randomOffset
    
    // 增加一点随机散布，中心厚，边缘薄
    const spread = (Math.random() - 0.5) * 30 * (1 - dist * 0.5)
    
    return {
      x: r * Math.cos(angle) + spread,
      y: (Math.random() - 0.5) * 20 * (1 - dist), // 扁平结构，中心稍厚
      z: r * Math.sin(angle) + spread
    }
  },

  // 黑洞 (Gargantua)：星际穿越风格
  blackhole: (i, total) => {
    const rBase = config.baseRadius
    const rEvent = rBase * 0.4 // 视界半径 (中心黑洞大小)
    
    // 70% 粒子构成水平吸积盘 (Accretion Disk)
    if (i % 10 < 7) {
      // 随机半径分布：外围稀疏，内部密集
      const rnd = Math.pow(Math.random(), 0.5) 
      const r = rEvent + (rBase * 1.5 - rEvent) * rnd
      const angle = Math.random() * Math.PI * 2
      
      return {
        x: r * Math.cos(angle),
        y: (Math.random() - 0.5) * (r * 0.02), // 极薄的盘
        z: r * Math.sin(angle)
      }
    } 
    // 30% 粒子构成引力透镜光晕 (Gravitational Lensing Halo)
    // 模拟被引力弯曲到黑洞上方和下方的光线，形成垂直包围结构
    else {
      const rnd = Math.random()
      // 光晕半径通常略小于吸积盘外径
      const r = rEvent + (rBase * 1.2 - rEvent) * rnd
      const angle = Math.random() * Math.PI * 2
      
      // 在 XY 平面构建垂直圆环
      return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle), 
        z: (Math.random() - 0.5) * (r * 0.02) // Z轴极薄
      }
    }
  },

  // TIE Fighter (TIE 战机)
  tiefighter: (i, total) => {
    const rBase = config.baseRadius
    const cockpitRadius = rBase * 0.25
    const wingDistance = rBase * 0.8 // 翼板距离中心的距离
    const wingSize = rBase * 1.2     // 翼板大小 (六边形半径)
    
    // 15% 粒子：驾驶舱 (中心球体)
    if (i < total * 0.15) {
      const subIndex = i
      const subTotal = total * 0.15
      const phi = Math.acos(-1 + (2 * subIndex) / subTotal)
      const theta = Math.sqrt(subTotal * Math.PI) * phi
      return {
        x: cockpitRadius * Math.cos(theta) * Math.sin(phi),
        y: cockpitRadius * Math.sin(theta) * Math.sin(phi),
        z: cockpitRadius * Math.cos(phi)
      }
    }
    // 5% 粒子：连接杆 (X轴上的圆柱体)
    else if (i < total * 0.20) {
      // 在 -wingDistance 到 +wingDistance 之间分布
      const x = (Math.random() - 0.5) * 2 * wingDistance
      const angle = Math.random() * Math.PI * 2
      const r = cockpitRadius * 0.3 // 杆很细
      return {
        x: x,
        y: r * Math.cos(angle),
        z: r * Math.sin(angle)
      }
    }
    // 80% 粒子：左右翼板 (垂直于X轴的六边形板)
    else {
      // 随机分配左翼或右翼
      const isLeft = Math.random() > 0.5
      const x = isLeft ? -wingDistance : wingDistance
      
      // 在六边形区域内随机撒点
      // 简单做法：在圆形内撒点，然后裁剪掉多余部分形成六边形，或者直接用极坐标生成六边形网格
      // 这里使用：在半径为 wingSize 的圆内随机，看起来也像 TIE 的面板
      // 为了更像六边形，可以限制角度或直接用几何算法，简单起见用圆形板代替也很像 TIE
      // 这里尝试做一个六边形分布
      
      // 随机半径和角度
      let r = Math.sqrt(Math.random()) * wingSize
      let angle = Math.random() * Math.PI * 2
      
      // 六边形裁切 (极坐标方程 r(theta))
      // r_max(theta) = R / cos(theta - k*PI/3)
      // 简化：为了视觉效果，圆形板其实辨识度也很高，且粒子分布更均匀。
      // 如果要严格六边形：
      // const sector = Math.floor(angle / (Math.PI / 3))
      // const sectorAngle = angle - sector * (Math.PI / 3) - (Math.PI / 6)
      // const hexR = wingSize * Math.cos(Math.PI / 6) / Math.cos(sectorAngle)
      // if (r > hexR) r = hexR * Math.random() // 裁剪
      
      // 增加纹理：TIE 翼板上有辐射状线条
      // 让粒子倾向于分布在辐条上
      if (Math.random() > 0.3) {
         // 强制对齐到 6 个辐条角度附近
         const spoke = Math.floor(Math.random() * 6)
         const spokeAngle = spoke * (Math.PI / 3)
         angle = spokeAngle + (Math.random() - 0.5) * 0.2
      }

      return {
        x: x + (Math.random() - 0.5) * 5, // 稍微有点厚度
        y: r * Math.cos(angle),
        z: r * Math.sin(angle)
      }
    }
  }
}

class Particle {
  constructor(i) {
    this.index = i
    // 当前位置
    this.x = 0
    this.y = 0
    this.z = 0
    // 目标位置
    this.tx = 0
    this.ty = 0
    this.tz = 0
    // 随机偏移 (呼吸感)
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.vz = (Math.random() - 0.5) * 0.5
    
    this.setTarget('sphere')
    // 初始位置设为目标位置
    this.x = this.tx
    this.y = this.ty
    this.z = this.tz
  }

  setTarget(shapeName) {
    const generator = shapes[shapeName] || shapes.sphere
    const target = generator(this.index, config.particleCount)
    this.tx = target.x
    this.ty = target.y
    this.tz = target.z
  }

  update(dt) {
    // 简单的缓动：向目标位置移动
    // 使用 lerp 使得粒子像磁铁一样被吸过去
    const ease = 0.05 // 缓动系数
    this.x += (this.tx - this.x) * ease
    this.y += (this.ty - this.y) * ease
    this.z += (this.tz - this.z) * ease
    
    // 加上微小的噪点运动 (让它看起来活着)
    this.x += Math.sin(Date.now() * 0.001 + this.index) * 0.2
    this.y += Math.cos(Date.now() * 0.002 + this.index) * 0.2
  }
}

function initParticles() {
  particles = []
  for (let i = 0; i < config.particleCount; i++) {
    particles.push(new Particle(i))
  }
}

function draw(ctx, width, height) {
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  const cx = width / 2
  const cy = height / 2

  // 排序：为了正确的 Z 轴遮挡（虽然是 additive blending，排序能让高光更自然）
  // 也可以不排序，直接画
  // particles.sort((a, b) => b.z - a.z)

  ctx.fillStyle = '#fff'
  
  for (let p of particles) {
    // 1. 旋转 (绕 Y 轴和 X 轴)
    // 简单的 3D 旋转矩阵
    let x = p.x
    let y = p.y
    let z = p.z
    
    // Rotate Y
    let cosY = Math.cos(rotationY)
    let sinY = Math.sin(rotationY)
    let x1 = x * cosY - z * sinY
    let z1 = z * cosY + x * sinY
    
    // Rotate X
    let cosX = Math.cos(rotationX)
    let sinX = Math.sin(rotationX)
    let y2 = y * cosX - z1 * sinX
    let z2 = z1 * cosX + y * sinX
    
    // 2. 透视投影 (Perspective Projection)
    // scale = perspective / (perspective + z)
    // z 越大（越远），scale 越小
    // 注意：z2 为正时在屏幕前？通常 z 轴正向是屏幕外。
    // 这里假设 z2 越大越远（需加偏移防止除零）
    const scale = config.perspective / (config.perspective + z2 + config.baseRadius) 
    
    const screenX = cx + x1 * scale
    const screenY = cy + y2 * scale
    
    // 3. 绘制
    // 根据深度调整透明度和大小
    // z2 范围大概在 -baseRadius 到 baseRadius
    const alpha = Math.max(0.1, Math.min(1, (scale * 0.8))) // 远的淡，近的亮
    const size = Math.max(0.5, 2.5 * scale) // 远的小，近的大
    
    ctx.beginPath()
    ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
    
    // 颜色混合：白色核心，蓝色光晕
    // 使用纯色填充，配合 globalAlpha
    ctx.globalAlpha = alpha
    // 偶尔闪烁的粒子
    if (Math.random() < 0.005) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.shadowBlur = 10
      ctx.shadowColor = '#fff'
    } else {
      // 默认颜色：偏蓝白
      // 可以在这里做渐变，或者直接用两种颜色的粒子
      ctx.fillStyle = `rgba(${200 + p.index % 55}, ${200 + p.index % 55}, 255, ${alpha})`
      ctx.shadowBlur = 0
    }
    
    ctx.fill()
  }
  // 重置
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp
  const dt = timestamp - lastTime
  lastTime = timestamp

  // 更新旋转
  rotationY += config.rotationSpeed
  rotationX += config.rotationSpeed * 0.5

  // 自动切换形状逻辑
  // 使用 setInterval 在外部控制更简单，这里只负责渲染循环
  
  // 更新粒子
  particles.forEach(p => p.update(dt))

  // 绘制
  if (canvasRef.value) {
    const canvas = canvasRef.value
    draw(canvas.getContext('2d'), canvas.width, canvas.height)
  }

  animationId = requestAnimationFrame(loop)
}

// 形状切换计时器
const shapeKeys = ['sphere', 'cube', 'tetrahedron', 'helix', 'galaxy', 'blackhole', 'tiefighter']

function nextShape() {
  currentShapeIndex = (currentShapeIndex + 1) % shapeKeys.length
  const next = shapeKeys[currentShapeIndex]
  particles.forEach(p => p.setTarget(next))
}

function resizeCanvas() {
  if (canvasRef.value && canvasRef.value.parentElement) {
    const parent = canvasRef.value.parentElement
    const rect = parent.getBoundingClientRect()
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.height
    
    let targetRadius = 180
    let targetCount = 1200

    // 响应式调整目标参数
    if (window.innerWidth < 768) {
        targetRadius = 120 // 手机端
        targetCount = 600
    } 
    
    // 更新配置
    config.baseRadius = targetRadius
    
    // 平滑调整粒子数量 (增量更新，而非销毁重建)
    if (particles.length !== targetCount) {
        if (particles.length < targetCount) {
            // 需要增加粒子
            const startIdx = particles.length
            const currentShape = shapeKeys[currentShapeIndex]
            
            // 临时更新 config.particleCount 以便 setTarget 正确计算分布
            config.particleCount = targetCount 
            
            for (let i = startIdx; i < targetCount; i++) {
                const p = new Particle(i)
                // 新粒子继承当前形态
                p.setTarget(currentShape)
                // 初始位置设为目标位置，避免从零点炸开的突兀感，看起来像是在空隙中生成
                p.x = p.tx
                p.y = p.ty
                p.z = p.tz
                particles.push(p)
            }
        } else {
            // 需要减少粒子：直接截断
            particles.splice(targetCount)
            config.particleCount = targetCount
        }
    }
    
    // 关键：所有粒子的目标位置都需要根据新的 baseRadius 和 particleCount 重新计算
    // 这样现有粒子会“飞”向新的位置，产生平滑的缩放/重组动画，而不是瞬间重置
    const currentShape = shapeKeys[currentShapeIndex]
    particles.forEach(p => {
        p.setTarget(currentShape)
        // 不重置 p.x/y/z，保留缓动效果
    })
  }
}

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()
  initParticles()
  animationId = requestAnimationFrame(loop)
  
  shapeIntervalId = setInterval(nextShape, config.shapeChangeInterval)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationId)
  clearInterval(shapeIntervalId)
})
</script>

<template>
  <div class="scifi-core-container">
    <div class="core-scene">
      <!-- 外部轨道环（保留作为装饰，但可以调淡） -->
      <div class="orbit-ring ring-x"></div>
      <div class="orbit-ring ring-y"></div>
      
      <!-- Canvas 粒子层 -->
      <canvas ref="canvasRef" class="particle-canvas"></canvas>
      
      <!-- 核心能量团（保留作为内部发光核心，增强层次感） -->
      <div class="inner-fire"></div>
    </div>
  </div>
</template>

<style scoped>
/* 根容器 */
.scifi-core-container {
  position: fixed;
  top: 40%;
  left: 50%;
  width: 600px;
  height: 600px;
  margin-left: -300px;
  margin-top: -300px;
  z-index: 0;
  pointer-events: none;
  /* Canvas 不需要 CSS perspective，因为它自己计算投影 */
  /* perspective: 1200px; */ 
}

.core-scene {
  position: relative;
  width: 100%;
  height: 100%;
  /* 保留 preserve-3d 给轨道环使用 */
  transform-style: preserve-3d;
  /* 场景整体微旋转，配合内部粒子旋转 */
  animation: scene-float 10s ease-in-out infinite alternate;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  /* mix-blend-mode: screen; */ /* 移除混合模式，避免移动端兼容问题 */
}

/* 轨道环 - 调淡一点，作为背景装饰 */
.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-style: preserve-3d;
  border: 1px dashed rgba(25, 5, 250, 0.2); /* 变淡 */
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(25, 5, 250, 0.1);
  pointer-events: none;
}

.ring-x {
  width: 120%; /* 稍微缩小 */
  height: 120%;
  margin-left: -60%;
  margin-top: -60%;
  animation: ring-rotate-x 20s linear infinite;
  border-color: rgba(255, 255, 255, 0.1);
}

.ring-y {
  width: 100%;
  height: 100%;
  margin-left: -50%;
  margin-top: -50%;
  animation: ring-rotate-y 25s linear infinite reverse;
  border-color: rgba(25, 5, 250, 0.2);
}

/* 内部能量团 - 作为粒子球内部的“核” */
.inner-fire {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px; /* 小一点 */
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  background: radial-gradient(circle, #fff, var(--color-highlight) 80%, transparent 100%);
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(20px);
  animation: fire-pulse 4s ease-in-out infinite alternate;
  z-index: 5;
}

@keyframes scene-float {
  0% { transform: translateY(-10px); }
  100% { transform: translateY(10px); }
}

@keyframes ring-rotate-x {
  0% { transform: rotateX(70deg) rotateZ(0deg); }
  100% { transform: rotateX(70deg) rotateZ(360deg); }
}

@keyframes ring-rotate-y {
  0% { transform: rotateY(60deg) rotateX(0deg); }
  100% { transform: rotateY(60deg) rotateX(360deg); }
}

@keyframes fire-pulse {
  0% { transform: scale(0.8); opacity: 0.2; }
  100% { transform: scale(1.2); opacity: 0.4; }
}

@media (max-width: 768px) {
  .scifi-core-container {
    width: 100vw; /* 这里的尺寸主要是容器大小，canvas 会自适应 */
    height: 100vw;
    margin-left: -50vw;
    margin-top: -50vw;
    top: 40%;
  }
}
</style>
