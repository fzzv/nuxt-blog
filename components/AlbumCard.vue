<template>
  <div grid grid-cols-1 md:grid-cols-2 gap-6>
    <NuxtLink
      v-for="album in list"
      :key="album._path"
      :to="album._path"
      block overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700
      shadow-sm hover:shadow-lg transition-all duration-300
      v-motion-pop-visible
    >
      <div relative overflow-hidden>
        <img
          :src="album.cover"
          :alt="album.title"
          w-full h-52 object-cover
          transition-transform duration-500 hover:scale-105
          loading="lazy"
        />
        <span
          absolute bottom-2 right-2 px-2 py-1 rounded-lg
          text-xs text-white bg-black bg-opacity-50 backdrop-blur-sm
        >
          {{ album.photos?.length || 0 }} 张
        </span>
      </div>
      <div p-4>
        <h3 text-lg font-bold dark:text-gray-100>{{ album.title }}</h3>
        <p v-if="album.description" text-sm text-gray-500 mt-1 line-clamp-2>{{ album.description }}</p>
        <time text-sm text-gray-400 mt-2 block>{{ useFormatDate(album.date) }}</time>
      </div>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { Album } from '~/types/Album'

interface Props {
  list: Album[]
}

withDefaults(defineProps<Props>(), {
  list: () => []
})
</script>
