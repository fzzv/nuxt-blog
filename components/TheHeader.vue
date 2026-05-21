<template>
  <header fcb py-10>
    <NuxtLink fcb to="/">
      <img h15 mr-1 src="/images/logo.png" alt="Fan Blog" class="dark:hidden">
      <img h15 mr-1 src="/images/logo-dark.png" alt="Fan Blog" class="hidden dark:block">
      <span text-2xl font-serif dark:text-gray-100 hidden md:inline-block>' Blog</span>
    </NuxtLink>
    <nav fc text-base leading-5 dark:text-gray-100>
      <template v-for="navRoute in routes" :key="navRoute.path">
        <NuxtLink
          v-if="!navRoute.external"
          :to="navRoute.path"
          :title="navRoute.name"
          :class="getRouteLinkClass(navRoute.path)"
        >
          <span text-5 icon-btn :class="navRoute.icon"></span>
        </NuxtLink>
        <a
          v-else
          :href="navRoute.path"
          :title="navRoute.name"
          target="_blank"
          rel="noreferrer"
          ml-5
        >
          <span text-5 icon-btn :class="navRoute.icon"></span>
        </a>
      </template>
      <button
        ml-5 p-0 border-0 bg-transparent cursor-pointer
        type="button"
        title="切换主题"
        aria-label="切换主题"
        @click="toggleDark()"
      >
        <span text-5 icon-btn dark:text-gray-100 dark:hover:icon-btn class="dark:i-bi-moon-stars i-bi-brightness-high"></span>
      </button>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import useTheme from '~/composables/useTheme'

interface NavRoute {
  name: string
  icon: string
  path: string
  external?: boolean
}

const routes: NavRoute[] = [
  { name: '文章', icon: 'i-bi-book', path: '/posts' },
  { name: '相册', icon: 'i-bi-images', path: '/albums' },
  { name: '标签', icon: 'i-bi-tags', path: '/tags' },
  { name: '关于', icon: 'i-bi-emoji-kiss', path: '/about' },
  { name: 'RSS', icon: 'i-bi-rss', path: '/rss.xml', external: true },
]

const route = useRoute()
const { toggleDark } = useTheme()

const currentPath = computed(() => route.path.replace(/\/+$/, '') || '/')

function isRouteActive(path: string) {
  const target = path.replace(/\/+$/, '') || '/'
  return currentPath.value === target || currentPath.value.startsWith(`${target}/`)
}

function getRouteLinkClass(path: string) {
  return [
    'ml-5 inline-flex items-center pb-1 border-b-2 transition duration-200 ease-in-out',
    isRouteActive(path)
      ? 'border-current text-teal-600'
      : 'border-transparent hover:border-current hover:text-teal-600',
  ]
}
</script>
