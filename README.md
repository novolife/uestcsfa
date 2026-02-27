# 电子科技大学科幻协会官网

[电子科技大学](https://www.uestc.edu.cn)科幻协会（UESTC-SFA）官方网站。探索想象边界，共筑科幻梦想。

- **在线地址**：[https://novolife.github.io/uestcsfa/](https://novolife.github.io/uestcsfa/)（由 [GitHub Actions](.github/workflows/deploy.yml) 自动部署）

## 技术栈

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)（SVG 图标）

## 开发

### 环境配置

本项目需要 Node.js 环境。

- **Node.js**: 推荐使用 LTS 版本 (`^20.19.0` 或 `>=22.12.0`)。
- **包管理器**: 推荐使用 `npm` (自带) 或 `pnpm`。
- **IDE**: 推荐使用 [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (即 Volar) 插件。

推荐使用 `nvm` (Node Version Manager) 或 `fnm` 来管理 Node.js 版本。

#### 使用 nvm 配置 Node.js（推荐）

1. 安装 `nvm`：
   - Windows：安装 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)
   - macOS / Linux：安装 [nvm-sh](https://github.com/nvm-sh/nvm)
2. 安装并切换到项目推荐版本（以 Node.js 20 为例）：

```sh
nvm install latest
nvm use 2x.xx.x (以实际安装版本为准)
node -v
npm -v
```

3. 验证输出版本符合要求后，再执行下方依赖安装步骤。

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

