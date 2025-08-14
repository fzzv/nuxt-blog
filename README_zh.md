# Fan 的博客

一个使用 Nuxt 3 构建的现代化响应式博客，支持深色/浅色主题切换、流畅动画和简洁设计。

## 🌐 语言版本

- [English](README.md)
- [中文](README_zh.md)

## ✨ 特性

- 🚀 **现代化技术栈**：基于 Nuxt 3、Vue 3 和 TypeScript 构建
- 🎨 **响应式设计**：采用移动优先的设计理念，使用 UnoCSS
- 🌙 **深色/浅色主题**：自动主题切换，支持流畅过渡动画
- ✍️ **内容管理**：基于 Markdown 的博客文章，使用 Nuxt Content
- 🎭 **动画效果**：使用 VueUse Motion 实现精美动画
- 📱 **渐进式**：针对性能和 SEO 进行优化
- 🎯 **类型安全**：全项目 TypeScript 支持

## 🛠️ 技术栈

- **框架**：[Nuxt 3](https://nuxt.com/)
- **前端**：[Vue 3](https://vuejs.org/) 组合式 API
- **样式**：[UnoCSS](https://unocss.dev/) 原子化 CSS 引擎
- **内容**：[Nuxt Content](https://content.nuxtjs.org/) Markdown 处理
- **动画**：[VueUse Motion](https://motion.vueuse.org/)
- **图标**：[Iconify](https://iconify.design/)
- **主题**：[@nuxtjs/color-mode](https://color-mode.nuxtjs.org/)
- **语言**：[TypeScript](https://www.typescriptlang.org/)

## 📦 安装

### 环境要求

- Node.js（版本 16.x 或更高）
- Yarn 或 npm 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/fzzv/nuxt-blog.git
   cd nuxt-blog
   ```

2. **安装依赖**
   ```bash
   # 使用 yarn（推荐）
   yarn install
   
   # 或使用 npm
   npm install
   ```

3. **启动开发服务器**
   ```bash
   # 使用 yarn
   yarn dev
   
   # 或使用 npm
   npm run dev
   ```

4. **打开浏览器**
   访问 `http://localhost:3000` 查看你的博客！

## 🚀 使用方法

### 开发

```bash
# 启动带热重载的开发服务器
yarn dev

# 构建生产版本
yarn build

# 生成静态站点
yarn generate

# 预览生产构建
yarn preview
```

### 添加博客文章

1. 在 `content/posts/` 目录下创建新的 Markdown 文件
2. 添加包含标题、描述、标签和日期的 frontmatter：
   ```markdown
   ---
   title: "你的文章标题"
   description: "文章简要描述"
   tags: [vue, nuxt, javascript]
   date: 2024-01-15
   ---
   
   # 你的文章内容
   
   在这里使用 Markdown 语法编写你的博客文章内容。
   ```

3. 文章将自动出现在博客首页

## 📁 项目结构

```
nuxt-blog/
├── components/           # Vue 组件
│   ├── content/         # 内容相关组件
│   ├── ArticleCard.vue  # 博客文章卡片组件
│   ├── TheHeader.vue    # 网站头部
│   ├── TheFooter.vue    # 网站底部
│   └── ...              # 其他 UI 组件
├── composables/         # Vue 组合式函数
│   ├── dark.ts          # 深色模式逻辑
│   ├── useTheme.ts      # 主题管理
│   └── ...              # 其他组合式函数
├── content/             # 博客内容
│   └── posts/           # 博客文章（Markdown 文件）
├── layouts/             # Nuxt 布局
│   └── default.vue      # 默认布局
├── pages/               # Nuxt 页面
│   ├── index.vue        # 首页
│   ├── about.vue        # 关于页面
│   └── posts/           # 文章页面
├── public/              # 静态资源
│   └── images/          # 图片和图标
├── styles/              # 全局样式
│   ├── index.css        # 主样式表
│   └── markdown.css     # Markdown 样式
├── types/               # TypeScript 类型定义
├── nuxt.config.ts       # Nuxt 配置
├── unocss.config.ts     # UnoCSS 配置
└── package.json         # 项目依赖
```

## ⚙️ 配置

### 主题自定义

博客支持通过各种配置文件进行广泛的自定义：

#### UnoCSS 配置（`unocss.config.ts`）
- 常用样式模式的自定义快捷方式
- 响应式断点设置
- 图标和排版预设
- 自定义颜色方案

#### Nuxt 配置（`nuxt.config.ts`）
- SEO 元标签和网站信息
- 内容高亮主题
- 模块配置

### 内容配置

博客文章支持以下 frontmatter 选项：

```yaml
---
title: "文章标题"              # 必需：文章标题
description: "文章摘要"        # 必需：简要描述
tags: [标签1, 标签2]          # 可选：文章标签
date: 2024-01-15             # 必需：发布日期
---
```

## 🎨 自定义

### 样式

项目使用 UnoCSS，在 `unocss.config.ts` 中定义了自定义快捷方式：

- `fc` - 弹性布局居中对齐
- `fcc` - 弹性布局水平垂直居中
- `btn` - 按钮样式
- `icon-btn` - 图标按钮样式

### 主题颜色

通过更新 UnoCSS 配置或样式目录中的 CSS 自定义属性来修改配色方案。

### 组件

所有组件位于 `components/` 目录中，可以自定义：

- `TheHeader.vue` - 网站导航和品牌
- `TheFooter.vue` - 底部内容和链接
- `ArticleCard.vue` - 博客文章预览卡片
- 主题组件（`Sun.vue`、`Moon.vue`）- 主题切换动画

## 🧪 开发

### 代码风格

项目遵循 Vue 3 和 TypeScript 最佳实践：

- 使用 `<script setup>` 的组合式 API
- TypeScript 类型安全
- 可复用逻辑的组合式函数
- 基于组件的架构

### 添加新功能

1. **组件**：在 `components/` 目录中添加新的 Vue 组件
2. **页面**：在 `pages/` 目录中创建新页面（自动路由）
3. **组合式函数**：在 `composables/` 目录中添加可复用逻辑
4. **样式**：在 `styles/` 目录中添加全局样式
5. **类型**：在 `types/` 目录中定义 TypeScript 类型

### 开发环境设置

为获得最佳开发体验：

1. 使用 VS Code 配合 Vue 和 TypeScript 扩展
2. 启用保存时格式化
3. 使用 Vue DevTools 浏览器扩展

## 📝 可用脚本

| 脚本 | 描述 |
|------|------|
| `yarn dev` | 启动带热重载的开发服务器 |
| `yarn build` | 构建生产环境应用 |
| `yarn generate` | 生成静态站点用于部署 |
| `yarn preview` | 本地预览生产构建 |

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。对于重大更改，请先开启 issue 讨论您想要更改的内容。

### 开发工作流

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'Add some amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👤 作者

**Fan** - 博客作者和开发者

## 🙏 致谢

- [Nuxt.js](https://nuxt.com/) 团队提供的出色框架
- [Vue.js](https://vuejs.org/) 团队提供的响应式框架
- [UnoCSS](https://unocss.dev/) 原子化 CSS 引擎
- [VueUse](https://vueuse.org/) Vue 组合式工具集合

---

**愉快地写博客！🎉**
