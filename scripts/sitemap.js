/**
 * 构建后生成 sitemap.xml 到 dist 目录。
 * 运行：node scripts/sitemap.js（或由 npm run postbuild 调用）
 * 需与 src/content/reports/manifest.js 中的 slug 列表保持一致。
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const OUT_DIR = join(root, 'dist')
const BASE = 'https://novolife.github.io/uestcsfa'

const STATIC_ROUTES = ['', '/about', '/about/history', '/activities', '/join']

// 从 manifest 提取 slug（与 content/reports/manifest.js 同步）
function getReportSlugs() {
  try {
    const manifestPath = join(root, 'src', 'content', 'reports', 'manifest.js')
    const content = readFileSync(manifestPath, 'utf8')
    const slugs = []
    const re = /slug:\s*['"]([^'"]+)['"]/g
    let m
    while ((m = re.exec(content))) slugs.push(m[1])
    return slugs
  } catch {
    return [
      '2025-star-cloud-ceremony', '2025-sci-fi-city-forum', '2024-galaxy-award',
      '2024-dune2-joint-screening', '2023-worldcon-association-participation',
      '2023-oppenheimer-joint-screening', '2023-sci-fi-creative-writing',
      '2023-wandering-earth-2-farewell', '2022-sci-fi-writing-camp',
    ]
  }
}

const reportSlugs = getReportSlugs()
const paths = [
  ...STATIC_ROUTES.map((r) => (r || '/')),
  ...reportSlugs.map((slug) => `/activities/reports/${slug}`),
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

// GitHub Pages SPA 回退：复制 index.html 为 404.html
const indexPath = join(OUT_DIR, 'index.html')
try {
  const indexHtml = readFileSync(indexPath, 'utf8')
  writeFileSync(join(OUT_DIR, '404.html'), indexHtml, 'utf8')
  console.log('404.html written to dist/ (for GitHub Pages SPA fallback)')
} catch (e) {
  console.warn('Could not create 404.html (run after vite build):', e.message)
}
