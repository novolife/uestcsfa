# Vue 3 + Vite SPA 的 SEO 与 GitHub Pages 部署指南

## 1. 推荐方案：预渲染 + 动态 Meta + Sitemap

| 方案 | 优点 | 缺点 | 适用 |
|------|------|------|------|
| **预渲染 (Prerender)** | 不改 SPA 架构，构建时为每条路由生成静态 HTML，爬虫可见首屏；兼容 GitHub Pages | 需构建时跑一次爬取/渲染 | ✅ **推荐**：路由有限、内容以静态为主 |
| SSG (如 vite-ssg) | SEO 最佳，纯静态 | 需改入口与数据获取方式，学习成本高 | 新项目或可接受重构时 |
| 仅 SPA + Meta | 改造成本最低 | 爬虫仍可能只拿到空壳 HTML，依赖执行 JS | 仅作补充 |

**结论**：在不做 SSR、且部署在 GitHub Pages 的前提下，采用 **预渲染 + 统一 Head 管理 + Sitemap + robots.txt** 是最平衡的做法：对现有 Vue 3 + Vite 侵入小，又能让各路由有可抓取的 HTML 和正确 title/description。

---

## 2. 技术改造步骤总览

1. 安装依赖：`@unhead/vue`、预渲染与 sitemap 相关。
2. 在 `index.html` 留好默认 meta，用 `@unhead/vue` 在路由切换时动态写 `title` / `description`。
3. 在 `vite.config.js` 中配置 `base`、预渲染插件（或使用后处理脚本）。
4. 路由保持 `createWebHistory(import.meta.env.BASE_URL)`，保证与 GitHub Pages 子路径一致。
5. 构建后生成 `sitemap.xml`（可写脚本从路由表 + 活动 slug 生成）。
6. 在 `public` 或构建输出中提供 `robots.txt`。
7. 构建与部署：`npm run build` → 可选预渲染后处理 → 将 `dist` 部署到 GitHub Pages。

以下按「依赖 → 配置 → 代码 → 脚本 → 部署」给出可直接使用的实现。

---

## 3. 需要安装的依赖

```bash
# 动态 title / meta 管理（Vue 3）
npm i @unhead/vue

# 预渲染：构建后对 dist 做多路由 HTML 快照（可选）
npm i -D prerender-spa-plugin-next
# 或使用后文提供的 Node 脚本 + puppeteer（见第 9 节）
```

若采用本文提供的 **Node 预渲染脚本**（见第 9 节），只需安装：

```bash
npm i @unhead/vue
npm i -D puppeteer  # 仅当使用 scripts/prerender.mjs 时需要
```

---

## 4. vite.config.js 修改示例

保持现有 `base`，便于 GitHub Pages 子路径部署；如需预渲染插件可在此挂载（此处以占位示意，实际预渲染用后处理脚本更稳）。

```javascript
// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/uestcsfa/',  // GitHub Pages 仓库名子路径，勿改
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 便于排查部署路径问题
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
```

---

## 5. Router 配置（适配 GitHub Pages 子路径）

无需大改，只需保证 `createWebHistory(import.meta.env.BASE_URL)` 与 `vite.config.js` 的 `base: '/uestcsfa/'` 一致；404 回退到 `index.html` 由 GitHub Pages 或服务器配置（见第 9 节）。

```javascript
// src/router/index.js（保持现有，仅示意关键点）
import { createRouter, createWebHistory } from 'vue-router'

const BASE = import.meta.env.BASE_URL  // 开发为 /uestcsfa/，构建同理

const router = createRouter({
  history: createWebHistory(BASE),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: '首页' } },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: '关于我们' } },
    { path: '/about/history', name: 'about-history', component: () => import('@/views/AboutHistoryView.vue'), meta: { title: '历届社长与干事' } },
    { path: '/activities', name: 'activities', component: () => import('@/views/ActivitiesView.vue'), meta: { title: '活动报道' } },
    { path: '/activities/reports/:slug', name: 'activity-report', component: () => import('@/views/ActivityReportView.vue'), meta: { title: '活动详情' } },
    { path: '/join', name: 'join', component: () => import('@/views/JoinView.vue'), meta: { title: '加入我们' } },
    // ... 其余 ue-stc 等路由
  ],
})

export default router
```

---

## 6. 动态设置 title 和 meta（@unhead/vue）

### 6.1 在 main.js 中安装并注册

```javascript
// src/main.js
import './assets/main.css'
import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faBookOpen, faPenFancy, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'

library.add(faArrowLeft, faBookOpen, faPenFancy, faUsers)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(createHead())
app.use(router)
app.mount('#app')
```

### 6.2 在 router 的 beforeEach 中根据 meta 写 title/description

```javascript
// 在 src/router/index.js 的 router.beforeEach 中增加
const DEFAULT_TITLE = '电子科技大学科幻协会'
const TITLE_SUFFIX = ' | 成电幻协'
const DEFAULT_DESC = '电子科技大学科幻协会（成电幻协）官方站点。科幻观影、书评沙龙、世界科幻大会参展。探索想象边界，共筑科幻梦想。'

router.beforeEach((to, _from, next) => {
  const title = to.meta?.title
  const desc = to.meta?.description ?? DEFAULT_DESC
  const fullTitle = title ? `${title}${TITLE_SUFFIX}` : `${DEFAULT_TITLE}${TITLE_SUFFIX}`

  document.title = fullTitle

  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', desc)

  // 若已使用 @unhead/vue，也可在此调用 useHead({ title: fullTitle, meta: [{ name: 'description', content: desc }] })
  next()
})
```

若希望用 `@unhead/vue` 的 `useHead` 在组件里按页覆盖，可在各页面 `setup` 中：

```javascript
import { useHead } from '@unhead/vue'

useHead({
  title: '历届社长与干事 | 成电幻协',
  meta: [
    { name: 'description', content: '电子科技大学科幻协会历年社长及干事名单。' },
  ],
})
```

---

## 7. 自动生成 sitemap.xml 的方案

构建后从「路由表 + 活动报道 manifest」生成 `sitemap.xml`，放到 `dist` 根（与 `index.html` 同级），这样 GitHub Pages 下会落在 `https://<user>.github.io/uestcsfa/sitemap.xml`。

```javascript
// scripts/sitemap.js（运行：node scripts/sitemap.js，建议在 build 之后）
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://novolife.github.io/uestcsfa'  // 替换为你的 GitHub Pages 根 URL
const OUT_DIR = join(__dirname, '..', 'dist')
const STATIC_ROUTES = ['', '/about', '/about/history', '/activities', '/join']

// 从 manifest 拿活动报道 slug（与 src/content/reports/manifest.js 保持一致）
const manifest = [
  '2025-star-cloud-ceremony', '2025-sci-fi-city-forum', '2024-galaxy-award',
  '2024-dune2-joint-screening', '2023-worldcon-association-participation',
  '2023-oppenheimer-joint-screening', '2023-sci-fi-creative-writing',
  '2023-wandering-earth-2-farewell', '2022-sci-fi-writing-camp',
]

const paths = [
  ...STATIC_ROUTES.map((r) => (r || '/')),
  ...manifest.map((slug) => `/activities/reports/${slug}`),
]

const urls = paths
  .map((path) => `${BASE}${path === '/' ? '' : path}`)
  .map((loc) => `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, 'sitemap.xml'), sitemap, 'utf8')
console.log('sitemap.xml written to dist/')
```

在 `package.json` 的 `scripts` 里增加：

```json
"scripts": {
  "build": "vite build",
  "postbuild": "node scripts/sitemap.js"
}
```

这样每次 `npm run build` 结束后会自动生成 `dist/sitemap.xml`。

---

## 8. robots.txt 示例

放在 `public/robots.txt`，Vite 会原样复制到 `dist` 根；注意 `Sitemap` 的 URL 要带子路径。

```txt
# public/robots.txt
User-agent: *
Allow: /

# 若不想被索引指挥部等动态后台，可加：
# Disallow: /ue-stc/

Sitemap: https://novolife.github.io/uestcsfa/sitemap.xml
```

将 `https://novolife.github.io/uestcsfa/` 换成你的实际 GitHub Pages 地址。

---

## 9. 构建与部署流程（含可选预渲染）

### 9.1 仅构建 + Sitemap（无预渲染）

```bash
npm run build
# postbuild 自动执行 node scripts/sitemap.js
# 将 dist 目录部署到 GitHub Pages（gh-pages 分支或 docs 目录）
```

### 9.2 带预渲染的构建（可选）

思路：先 `vite build`，再对 `dist` 里的一条条路由用 Puppeteer 打开并保存快照 HTML，覆盖对应路径的 `index.html`（或生成多份 HTML）。这样爬虫访问 `/about` 等会得到已渲染好的 HTML。

下面是一个**后处理预渲染脚本**示例（需先 `npm i -D puppeteer`）：

```javascript
// scripts/prerender.mjs（构建后执行：node scripts/prerender.mjs）
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const BASE = '/uestcsfa/'
const BASE_URL = `http://localhost:${process.env.PORT || 4173}`  // 需先 npm run preview

const ROUTES = ['/', '/about', '/about/history', '/activities', '/join']

async function main() {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf8')

  for (const route of ROUTES) {
    const path = route === '/' ? '' : route
    const url = `${BASE_URL}${BASE}${path}`
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
    const html = await page.content()
    const outPath = path ? join(DIST, path, 'index.html') : join(DIST, 'index.html')
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, html, 'utf8')
    console.log('Prerendered:', url)
  }

  await browser.close()
}
main().catch(console.error)
```

使用方式：先 `npm run build`，再 `npm run preview` 在后台跑起来，然后另开终端执行 `node scripts/prerender.mjs`；或写一个脚本用 `vite preview --port 4173` 起一个临时服务器再跑预渲染。预渲染完成后，把 `dist` 推送到 GitHub Pages 即可。

---

## 10. 最终项目目录结构示例

```
uestcsfa/
├── public/
│   ├── logo.png
│   ├── logo-white.png
│   ├── og-image.png
│   ├── robots.txt          # 新增
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   └── reports/
│   │       └── manifest.js
│   ├── router/
│   │   └── index.js        # 含 beforeEach title/meta
│   ├── views/
│   ├── App.vue
│   ├── main.js             # 使用 createHead()
│   └── ...
├── scripts/
│   ├── sitemap.js          # 新增：构建后生成 sitemap
│   ├── prerender.mjs       # 可选：预渲染
│   ├── logo_to_png.py
│   └── logo_white_outline.py
├── dist/                   # 构建输出
│   ├── index.html
│   ├── sitemap.xml         # 由 scripts/sitemap.js 生成
│   ├── assets/
│   └── uestcsfa/           # 若 base 为 /uestcsfa/，可能无此层，依 Vite 输出为准
├── docs/
│   └── SEO-GUIDE.md        # 本指南
├── index.html
├── vite.config.js
├── package.json
└── ...
```

---

## 11. GitHub Pages 配置要点

- **仓库 Settings → Pages**：Source 选 “Deploy from a branch”，Branch 选 `gh-pages` 或 `main`，目录选 `/ (root)` 或 `/docs`（若站点在 docs 下）。
- 若站点根 URL 为 `https://<user>.github.io/uestcsfa/`，则：
  - `vite.config.js` 中 `base: '/uestcsfa/'` 必须一致。
  - `index.html` 及所有资源引用使用相对路径或 `import.meta.env.BASE_URL`。
- **404**：GitHub Pages 不支持 SPA 回退，需用 404.html 技巧：复制 `index.html` 为 `404.html`，这样任意子路径会返回同一 HTML，由 Vue Router 做前端路由。

在构建后复制一份即可：

```bash
cp dist/index.html dist/404.html
```

部署前执行一次，或写入 `postbuild`：`"postbuild": "node scripts/sitemap.js && cp dist/index.html dist/404.html"`（Windows 用 `copy` 或 cross-platform 脚本）。

以上步骤完成后，你的 Vue 3 + Vite SPA 将具备：每页可变的 title/description、sitemap、robots、可选预渲染，并完整兼容 GitHub Pages 子路径部署。
