# Fan's Blog

A modern, responsive blog built with Nuxt 3, featuring dark/light theme support, smooth animations, and a clean design.

## 🌐 Language / 语言

- [English](README.md)
- [中文](README_zh.md)

## ✨ Features

- 🚀 **Modern Stack**: Built with Nuxt 3, Vue 3, and TypeScript
- 🎨 **Responsive Design**: Mobile-first approach with UnoCSS
- 🌙 **Dark/Light Theme**: Automatic theme switching with smooth transitions
- ✍️ **Content Management**: Markdown-based blog posts with Nuxt Content
- 🎭 **Animations**: Beautiful animations using VueUse Motion
- 📱 **Progressive**: Optimized for performance and SEO
- 🎯 **Type Safe**: Full TypeScript support throughout the project

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Frontend**: [Vue 3](https://vuejs.org/) with Composition API
- **Styling**: [UnoCSS](https://unocss.dev/) with custom shortcuts
- **Content**: [Nuxt Content](https://content.nuxtjs.org/) for markdown processing
- **Animations**: [VueUse Motion](https://motion.vueuse.org/)
- **Icons**: [Iconify](https://iconify.design/)
- **Theme**: [@nuxtjs/color-mode](https://color-mode.nuxtjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📦 Installation

### Prerequisites

- Node.js (version 16.x or higher)
- Yarn or npm package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/fzzv/nuxt-blog.git
   cd nuxt-blog
   ```

2. **Install dependencies**
   ```bash
   # Using yarn (recommended)
   yarn install

   # Or using npm
   npm install
   ```

3. **Start development server**
   ```bash
   # Using yarn
   yarn dev

   # Or using npm
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to see your blog in action!

## 🚀 Usage

### Development

```bash
# Start development server with hot reload
yarn dev

# Build for production
yarn build

# Generate static site
yarn generate

# Preview production build
yarn preview
```

### Adding Blog Posts

1. Create a new markdown file in the `content/posts/` directory
2. Add frontmatter with title, description, tags, and date:
   ```markdown
   ---
   title: "Your Post Title"
   description: "Brief description of your post"
   tags: [vue, nuxt, javascript]
   date: 2024-01-15
   ---

   # Your Post Content

   Write your blog post content here using markdown syntax.
   ```

3. The post will automatically appear on your blog homepage

## 📁 Project Structure

```
nuxt-blog/
├── components/           # Vue components
│   ├── content/         # Content-specific components
│   ├── ArticleCard.vue  # Blog post card component
│   ├── TheHeader.vue    # Site header
│   ├── TheFooter.vue    # Site footer
│   └── ...              # Other UI components
├── composables/         # Vue composables
│   ├── dark.ts          # Dark mode logic
│   ├── useTheme.ts      # Theme management
│   └── ...              # Other composables
├── content/             # Blog content
│   └── posts/           # Blog posts (markdown files)
├── layouts/             # Nuxt layouts
│   └── default.vue      # Default layout
├── pages/               # Nuxt pages
│   ├── index.vue        # Homepage
│   ├── about.vue        # About page
│   └── posts/           # Post pages
├── public/              # Static assets
│   └── images/          # Images and icons
├── styles/              # Global styles
│   ├── index.css        # Main stylesheet
│   └── markdown.css     # Markdown styling
├── types/               # TypeScript type definitions
├── nuxt.config.ts       # Nuxt configuration
├── unocss.config.ts     # UnoCSS configuration
└── package.json         # Project dependencies
```

## ⚙️ Configuration

### Theme Customization

The blog supports extensive customization through various configuration files:

#### UnoCSS Configuration (`unocss.config.ts`)
- Custom shortcuts for common styling patterns
- Responsive breakpoints
- Icon and typography presets
- Custom color schemes

#### Nuxt Configuration (`nuxt.config.ts`)
- SEO meta tags and site information
- Content highlighting themes
- Module configurations

### Content Configuration

Blog posts support the following frontmatter options:

```yaml
---
title: "Post Title"           # Required: Post title
description: "Post summary"   # Required: Brief description
tags: [tag1, tag2]           # Optional: Post tags
date: 2024-01-15             # Required: Publication date
---
```

## 🎨 Customization

### Styling

The project uses UnoCSS with custom shortcuts defined in `unocss.config.ts`:

- `fc` - Flex center items
- `fcc` - Flex center items and justify center
- `btn` - Button styling
- `icon-btn` - Icon button styling

### Theme Colors

Modify the color scheme by updating the UnoCSS configuration or CSS custom properties in the styles directory.

### Components

All components are located in the `components/` directory and can be customized:

- `TheHeader.vue` - Site navigation and branding
- `TheFooter.vue` - Footer content and links
- `ArticleCard.vue` - Blog post preview cards
- Theme components (`Sun.vue`, `Moon.vue`) - Theme toggle animations

## 🧪 Development

### Code Style

The project follows Vue 3 and TypeScript best practices:

- Composition API with `<script setup>`
- TypeScript for type safety
- Composables for reusable logic
- Component-based architecture

### Adding New Features

1. **Components**: Add new Vue components in the `components/` directory
2. **Pages**: Create new pages in the `pages/` directory (auto-routed)
3. **Composables**: Add reusable logic in the `composables/` directory
4. **Styles**: Add global styles in the `styles/` directory
5. **Types**: Define TypeScript types in the `types/` directory

### Environment Setup

For optimal development experience:

1. Use VS Code with Vue and TypeScript extensions
2. Enable format on save
3. Use the Vue DevTools browser extension

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build the application for production |
| `yarn generate` | Generate static site for deployment |
| `yarn preview` | Preview the production build locally |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Fan** - Blog author and developer

## 🙏 Acknowledgments

- [Nuxt.js](https://nuxt.com/) team for the amazing framework
- [Vue.js](https://vuejs.org/) team for the reactive framework
- [UnoCSS](https://unocss.dev/) for the atomic CSS engine
- [VueUse](https://vueuse.org/) for the collection of Vue composition utilities

---

**Happy blogging! 🎉**
