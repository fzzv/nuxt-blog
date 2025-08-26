import { defineNuxtConfig } from 'nuxt/config'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Fan\' Bolg',
      meta: [
        { name: 'description', content: 'study programs and record life' },
        { name: 'keywords', content: 'fan, blog, record, notes, frontend' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/rss.xml' },
      ],
      viewport: 'width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0',
    }
  },
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
  ],
  content: {
    highlight: {
      theme: 'vitesse-dark',  // All theme 可以进入 https://github.com/shikijs/shiki/blob/main/docs/themes.md 查看
    },
    markdown: {
      toc: {
        depth: 3, // 侧边栏 文章标题深度
      },
    },
    documentDriven: true,
  },
})
