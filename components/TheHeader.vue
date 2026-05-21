<template>
  <div f-cb>
    <header fcb py-10>
      <NuxtLink fcb to="/">
        <img h15 mr-1 src="/images/logo.png" alt="Fan Blog" class="dark:hidden">
        <img h15 mr-1 src="/images/logo-dark.png" alt="Fan Blog" class="hidden dark:block">
        <span text-2xl font-serif dark:text-gray-100 hidden md:inline-block>' Blog</span>
      </NuxtLink>
      <div fc text-base leading-5 dark:text-gray-100>
        <template
          v-for="route in routes"
          :key="route.path"
        >
          <NuxtLink
            v-if="!route.external"
            :to="route.path"
            :title="route.name"
            ml-5
          >
            <span text-5 icon-btn :class="route.icon"></span>
          </NuxtLink>
          <a
            v-else
            :href="route.path"
            :title="route.name"
            target="_blank"
            rel="noreferrer"
            ml-5
          >
            <span text-5 icon-btn :class="route.icon"></span>
          </a>
        </template>
        <button ml-5 p-0 border-0 bg-transparent cursor-pointer type="button" title="切换主题" aria-label="切换主题" @click="toggleDark()">
          <span text-5 icon-btn dark:text-gray-100 class="dark:i-bi-moon-stars i-bi-brightness-high"></span>
        </button>
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
import useTheme from '~/composables/useTheme'

const routes = [
  { name: '文章', icon: 'i-bi-book', path: '/posts' },
  { name: '相册', icon: 'i-bi-images', path: '/albums' },
  { name: '标签', icon: 'i-bi-tags', path: '/tags' },
  { name: '关于', icon: 'i-bi-emoji-kiss', path: '/about' },
  { name: 'RSS', icon: 'i-bi-rss', path: '/rss.xml', external: true }
]

const { toggleDark } = useTheme()
</script>
