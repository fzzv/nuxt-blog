<template>
  <div font-mono dark:text-gray-300>
    <h1 text-center>标签</h1>
    <div mt-10 flex flex-wrap justify-center gap-5>
      <span
        v-for="item in sortedTags"
        :key="item"
        v-motion-pop
        inline-flex w-fit shrink-0 items-center rounded-2xl border-2 px-4 py-2 shadow-lg shadow-gray-900 dark:shadow-gray-300
      >
        <NuxtLink :to="`/tags/${item}`" capitalize whitespace-nowrap font-bold>
          <span text-blue-600>{{ item }}</span>&nbsp;({{ tagCount[item] }})
        </NuxtLink>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface TagDoc {
  tags?: string[]
}

type TagCountMap = Record<string, number>

// 获取所有文章的标签
const { data } = await useAsyncData<TagDoc[]>('tags', () =>
  queryContent('posts').only(['tags']).find(),
)

// 统计每个标签的数量
const tagCount = computed<TagCountMap>(() => {
  return (data.value ?? []).reduce<TagCountMap>((countMap, { tags = [] }) => {
    tags.forEach((tag) => {
      countMap[tag] = (countMap[tag] ?? 0) + 1
    })
    return countMap
  }, {})
})

// 标签排序
const sortedTags = computed(() => {
  return Object.keys(tagCount.value).sort((a, b) => tagCount.value[b] - tagCount.value[a])
})
</script>
