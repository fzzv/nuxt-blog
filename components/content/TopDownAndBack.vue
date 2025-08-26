<template>
  <div fixed right-8 bottom-8 hidden flex-col gap-3 md:flex md:block>
    <button dark:text-gray-100 hover:cursor-pointer @click="goToTop" v-show="showTop">
      <span text-5 icon-btn class="i-twemoji:top-arrow"></span>
    </button>
    <button dark:text-gray-100 hover:cursor-pointer @click="goToDown" v-show="showDown">
      <span text-5 icon-btn class="i-twemoji:end-arrow"></span>
    </button>
    <button dark:text-gray-100 hover:cursor-pointer @click="router.back()">
      <span text-5 icon-btn class="i-twemoji:back-arrow"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const showTop = ref(false)
const showDown = ref(false)
onMounted(() => {
  const handleWindowScroll = () => {
    // 判断离顶部的距离
    if (window.scrollY > 80) showTop.value = true
    else showTop.value = false
    // 判断是否到达页面底部
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    console.log(scrollTop, clientHeight, scrollHeight)
    if (scrollTop + clientHeight >= scrollHeight) showDown.value = false
    else showDown.value = true
  }
  // 首次进入页面执行一次
  handleWindowScroll()
  // 监听滚动事件
  useEventListener(window, 'scroll', handleWindowScroll)
})

const goToTop = () => {
  document.documentElement.scrollTop = 0
}
const goToDown = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  })
}
</script>
