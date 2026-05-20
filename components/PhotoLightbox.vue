<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="visible"
        class="lightbox-overlay"
        fixed inset-0 z-50 fcc
        @click.self="$emit('close')"
      >
        <!-- Close button -->
        <button
          absolute top-4 right-4 z-10
          text-white text-2xl opacity-75 hover:opacity-100 cursor-pointer
          bg-transparent border-none
          @click="$emit('close')"
        >
          <span class="i-bi-x-lg"></span>
        </button>

        <!-- Prev button -->
        <button
          v-if="currentIndex > 0"
          class="lightbox-nav-btn lightbox-nav-prev"
          absolute left-4 z-10
          text-white text-3xl opacity-75 hover:opacity-100 cursor-pointer
          bg-transparent border-none
          @click.stop="prev"
        >
          <span class="i-bi-chevron-left"></span>
        </button>

        <!-- Next button -->
        <button
          v-if="currentIndex < photos.length - 1"
          class="lightbox-nav-btn lightbox-nav-next"
          absolute right-4 z-10
          text-white text-3xl opacity-75 hover:opacity-100 cursor-pointer
          bg-transparent border-none
          @click.stop="next"
        >
          <span class="i-bi-chevron-right"></span>
        </button>

        <!-- Photo content -->
        <div max-w="90vw" max-h="85vh" fcc @click.stop>
          <LivePhoto
            v-if="currentPhoto.isLive && currentPhoto.liveVideoUrl"
            :photo-url="currentPhoto.url"
            :video-url="currentPhoto.liveVideoUrl"
            max-w="90vw" max-h="85vh"
          />
          <img
            v-else
            :src="currentPhoto.url"
            :alt="currentPhoto.caption || ''"
            max-w="90vw" max-h="85vh" object-contain rounded-lg
          />
        </div>

        <!-- Caption -->
        <div
          v-if="currentPhoto.caption"
          class="lightbox-caption"
          absolute bottom-6
          text-white text-sm px-4 py-2 rounded-lg backdrop-blur-sm
        >
          {{ currentPhoto.caption }}
        </div>

        <!-- Counter -->
        <div
          absolute bottom-6 right-6
          text-white text-xs opacity-60
        >
          {{ currentIndex + 1 }} / {{ photos.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { Photo } from '~/types/Album'

interface Props {
  visible: boolean
  photos: Photo[]
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

const emit = defineEmits<{
  close: []
}>()

const currentIndex = ref(props.initialIndex)

watch(() => props.initialIndex, (val) => {
  currentIndex.value = val
})

const currentPhoto = computed(() => props.photos[currentIndex.value])

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < props.photos.length - 1) currentIndex.value++
}

function onKeydown(e: KeyboardEvent) {
  if (!props.visible) return
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

watch(() => props.visible, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.lightbox-overlay {
  background-color: rgba(0, 0, 0, 0.9);
}

.lightbox-nav-btn {
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-caption {
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
