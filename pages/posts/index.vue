<template>
  <div article font-mono dark:text-gray-300 my-0 mx-auto v-motion-slide-visible-bottom>
    <h1 text-center>全部文章</h1>
    <div relative mt-5>
      <input
        aria-label="搜索 blog 里的文章"
        type="text"
        placeholder="搜索 blog 里的文章"
        @input="(e) => searchValue = (e.target as HTMLInputElement).value"
        block box-border w-full h-12 rounded-2xl border border-gray-300 px-4 py-2 text-gray focus:border-gray focus:ring-gray-500 dark:bg-transparent
      />
      <svg
        absolute right-5 top-3 h-6 w-6 text-gray-400 dark:text-gray
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <ContentList path="/posts">
      <template #default="{ list }">
        <template v-for="posts in [sortArticles(filteredBlogPosts(list))]" :key="posts.length">
          <div v-if="!posts.length" text-2xl text-red text-center mt-50>
            暂无数据
          </div>
          <ArticleCard v-else :list="posts" />
        </template>
      </template>
    </ContentList>
  </div>
</template>

<script lang="ts" setup>
import type { Article } from '~/types/Article'
import ArticleCard from '~/components/ArticleCard.vue'

// 通过时间排序
function sortArticles(list: Article[]) {
  return [...list].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

const searchValue = ref('')

// 通过标题、描述、标签等搜索过滤博客文章
const filteredBlogPosts = (list: Article[]) => {
  const keyword = searchValue.value.trim().toLowerCase()

  if (!keyword) {
    return list
  }

  return list.filter(({ title = '', description = '', tags = [] }) => {
    const searchContent = `${title} ${description} ${tags.join(' ')}`.toLowerCase()
    return searchContent.includes(keyword)
  })
}
</script>
