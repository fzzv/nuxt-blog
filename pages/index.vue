<template>
  <div relative z-5 fc flex-col min-h="[calc(100vh-330px)]" ref="heightRef">
    <div my-30 w-40 h-40 border-rounded-4 v-motion-pop-visible>
      <img w-40 h-40 border-rounded-40 transition-all duration-500 ease-in-out hover:transition hover:duration-500 hover:scale-150 src="/images/me.png" alt="" />
    </div>
    <div ref="divRef" px-4 text-center text-3xl md:text-4xl dark:text-gray-100>
      <span
        v-for="(item, index) in titleChars"
        :key="`${item}-${index}`"
        op-0 transition-opacity font-mono
        :style="`transition-delay: ${0.2 * (index + 1)}s`"
      >
        {{ item }}
      </span>
    </div>
    <!-- <div nextAnimate @click="handleScorll"><span icon-btn text-10 :class="randomIcon()"></span></div> -->
  </div>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
// const title = ref("星河随风而至，落日踏霞而归")
// const title = ref("不是一个厉害的 FrontEnd Developer")
const title = ref("📖 记录是抵抗遗忘和丧失唯一的方式")
const titleChars = computed(() => Array.from(title.value))

const divRef: Ref<HTMLDivElement | null> = ref(null)
onMounted(() => {
  divRef.value?.classList.add('show')
})

const heightRef: Ref<HTMLDivElement | null> = ref(null)
const handleScorll = () => {
  const height = heightRef.value?.offsetHeight
  // 盒子高度 + 100vh所减去的高度
  document.documentElement.scrollTop = height! + 140
}

const iconArr = ['i-twemoji-carousel-horse', 'i-twemoji-carp-streamer', 'i-twemoji-bullseye', 'i-twemoji-clown-face', 'i-twemoji-confetti-ball', 'i-twemoji-cloud-with-snow']
const randomIcon = () => {
  return iconArr[Math.floor(Math.random() * iconArr.length)]
}
</script>

<style scoped>
.show > span {
  opacity: 1;
}
</style>
