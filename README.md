# 电子科技大学科幻协会官网

[电子科技大学](https://www.uestc.edu.cn)科幻协会（UESTC-SFA）官方网站。探索想象边界，共筑科幻梦想。

- **在线地址**：[https://novolife.github.io/uestcsfa/](https://novolife.github.io/uestcsfa/)（由 [GitHub Actions](.github/workflows/deploy.yml) 自动部署）

## 技术栈

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)（SVG 图标）

## 开发

### 安装依赖

```sh
npm install
```

### 本地开发（热更新）

```sh
npm run dev
```

### 生产构建

```sh
npm run build
```

### 预览构建结果

本地预览会使用与线上一致的 base 路径 `/uestcsfa/`：

```sh
npm run preview
```

### 代码检查与格式化

```sh
npm run lint
npm run format
```

## 部署

项目配置为发布到 **GitHub Pages**（仓库 [novolife/uestcsfa](https://github.com/novolife/uestcsfa)）。在仓库 **Settings → Pages** 中将 Source 选为 **GitHub Actions** 后，推送到 `master` 分支或手动运行 workflow 即可更新站点。

## 许可证

本项目采用 [MIT License](LICENSE)。

协会旗帜图片来自 [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Flag_of_SFA_of_UESTC.jpg)，作者 MspreilsCN，采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可。
