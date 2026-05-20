<template>
  <div class="waterfall" :style="{ columnCount: columns }">
    <div
      v-for="(photo, index) in photos"
      :key="index"
      class="waterfall-item"
      mb-4 break-inside-avoid cursor-pointer
      @click="$emit('select', index)"
    >
      <div relative overflow-hidden rounded-xl group>
        <img
          :src="photo.thumb"
          :alt="photo.caption || ''"
          w-full block rounded-xl
          transition-transform duration-300 group-hover:scale-105
          loading="lazy"
          :style="{ aspectRatio: `${photo.width}/${photo.height}` }"
        />
        <div
          v-if="photo.isLive"
          absolute top-2 left-2 px-2 py-1 rounded-lg
          text-xs text-white bg-black bg-opacity-50 backdrop-blur-sm
          fc gap-1
        >
          <span class="i-bi-circle-fill" text-3px text-yellow animate-pulse></span>
          实况
        </div>
        <div
          v-if="photo.caption"
          class="photo-caption"
          absolute bottom-0 left-0 right-0 p-3
          text-sm text-white
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        >
          {{ photo.caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Photo } from '~/types/Album'

interface Props {
  photos: Photo[]
}

defineProps<Props>()
defineEmits<{ select: [index: number] }>()

const { width } = useWindowSize()
const columns = computed(() => {
  if (width.value < 640) return 2
  if (width.value < 1024) return 3
  return 3
})
</script>

<style scoped>
.waterfall {
  column-gap: 1rem;
}

.photo-caption {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
}
</style>
