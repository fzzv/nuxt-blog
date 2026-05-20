<template>
  <div font-mono dark:text-gray-300 my-0 mx-auto v-motion-slide-visible-bottom>
    <h1 text-center>相册</h1>
    <div v-if="!albums?.length" text-2xl text-gray-400 text-center mt-20>
      暂无相册
    </div>
    <AlbumCard v-else :list="albums" />
  </div>
</template>

<script lang="ts" setup>
import type { Album } from '~/types/Album'

const { data } = await useAsyncData('albums', () =>
  queryContent().where({ _path: { $regex: '^/albums/' } }).sort({ date: -1 }).find()
)

const albums = data.value as unknown as Album[]
</script>
