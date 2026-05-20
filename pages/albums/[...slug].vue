<template>
  <div font-mono dark:text-gray-300 my-0 mx-auto v-motion-slide-visible-bottom>
    <h1 text-center>{{ album?.title }}</h1>
    <p v-if="album?.description" text-center text-gray-500 mt-2>{{ album.description }}</p>
    <p text-center text-sm text-gray-400 mt-1>
      {{ album?.date ? useFormatDate(album.date) : '' }} · {{ album?.photos?.length || 0 }} 张照片
    </p>

    <div mt-8>
      <PhotoWaterfall
        v-if="album?.photos?.length"
        :photos="album.photos"
        @select="openLightbox"
      />
    </div>

    <PhotoLightbox
      :visible="lightboxVisible"
      :photos="album?.photos || []"
      :initial-index="lightboxIndex"
      @close="lightboxVisible = false"
    />

    <div mt-10 text-center>
      <NuxtLink to="/albums" font-mono opacity-50 hover:opacity-75 text-lg border-gray border-b dark:text-gray-300>
        ← 返回相册列表
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const slug = (route.params.slug as string[])?.[0] || route.params.slug

const { data: album } = await useAsyncData(`album-${slug}`, () =>
  queryContent('albums')
    .where({ _path: `/albums/${slug}` })
    .findOne()
)
console.log(album, 'album')

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}
</script>
