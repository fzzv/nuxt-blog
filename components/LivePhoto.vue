<template>
  <div ref="containerRef" relative inline-block>
    <!-- LivePhotosKit player (primary) -->
    <div
      v-if="useLPK"
      ref="lpkRef"
      data-live-photo
      :data-photo-src="photoUrl"
      :data-video-src="videoUrl"
      :style="containerStyle"
    ></div>

    <!-- Custom fallback player -->
    <div
      v-else
      relative
      :style="containerStyle"
      @mouseenter="playVideo"
      @mouseleave="pauseVideo"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <img
        :src="photoUrl"
        w-full h-full object-contain rounded-lg
        :class="{ 'opacity-0': isPlaying }"
        transition-opacity duration-200
      />
      <video
        ref="videoRef"
        :src="videoUrl"
        absolute inset-0 w-full h-full object-contain rounded-lg
        :class="{ 'opacity-0': !isPlaying }"
        transition-opacity duration-200
        loop muted playsinline
      ></video>
      <div
        absolute top-2 left-2 px-2 py-1 rounded-lg
        text-xs text-white bg-black bg-opacity-50 backdrop-blur-sm
        fc gap-1
      >
        <span class="i-bi-circle-fill" text-3px text-yellow animate-pulse></span>
        LIVE
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  photoUrl: string
  videoUrl: string
}

const props = defineProps<Props>()

const containerRef = ref<HTMLElement>()
const lpkRef = ref<HTMLElement>()
const videoRef = ref<HTMLVideoElement>()

const useLPK = ref(false)
const isPlaying = ref(false)
let touchTimer: ReturnType<typeof setTimeout> | null = null

const containerStyle = {
  maxWidth: '90vw',
  maxHeight: '85vh',
}

onMounted(() => {
  if (typeof window !== 'undefined' && (window as any).LivePhotosKit) {
    useLPK.value = true
    nextTick(() => {
      if (lpkRef.value) {
        (window as any).LivePhotosKit.augmentElementAsPlayer(lpkRef.value)
      }
    })
  }
})

function playVideo() {
  if (videoRef.value) {
    videoRef.value.currentTime = 0
    videoRef.value.play()
    isPlaying.value = true
  }
}

function pauseVideo() {
  if (videoRef.value) {
    videoRef.value.pause()
    isPlaying.value = false
  }
}

function onTouchStart() {
  touchTimer = setTimeout(() => {
    playVideo()
  }, 200)
}

function onTouchEnd() {
  if (touchTimer) {
    clearTimeout(touchTimer)
    touchTimer = null
  }
  pauseVideo()
}
</script>
