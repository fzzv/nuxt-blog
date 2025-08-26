<template>
  <div f-cb>
    <header fcb py-10>
      <NuxtLink fcb to="/">
        <img h15 mr-1 :src="`/images/logo${theme === 'dark' ? '-dark' : ''}.png`" alt="">
        <span text-2xl font-serif dark:text-gray-100 hidden md:inline-block>' Blog</span>
      </NuxtLink>
      <div fc text-base leading-5 dark:text-gray-100>
        <NuxtLink
          v-for="route in routes"
          :key="route.path"
          :to="route.external ? undefined : route.path"
          :href="route.external ? route.path : undefined"
          :target="route.external ? '_blank' : undefined"
          :title="route.name"
          ml-5
        >
          <span text-5 icon-btn :class="route.icon"></span>
        </NuxtLink>
        <div ml-5 @click="toggleDark()" :title="`${isDark ? 'Light' : 'Dark'}`">
          <span text-5 icon-btn class="dark:i-bi-moon-stars i-bi-brightness-high"></span>
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
import useTheme from '~/composables/useTheme'
const routes = reactive([
  { name: "文章", icon: "i-bi-book", path: "/posts"},
  { name: "标签", icon: "i-bi-tags", path: "/tags" },
  { name: "关于", icon: "i-bi-emoji-kiss", path: "/about" },
  { name: "RSS", icon: "i-bi-rss", path: "/rss.xml", external: true }
])

// 监听 useDark 的变化
const { isDark, theme } = useTheme()

const toggleDark =  useToggle(isDark)
</script>
