<style>
@import '~/styles/markdown.css';
</style>

<template>
  <Progress />
  <div class="article" dark:text-gray-300 my-0 mx-auto>
    <Toc />
    <ContentDoc class="content-doc">
      <template #empty>
        <h1>404</h1>
        <p>真遗憾，你所访问的页面我没写~~~~</p>
        <h2>/(ㄒoㄒ)/~~</h2>
      </template>
      <template #not-found>
        <h1>404</h1>
        <p>很可惜，你所访问的页面没有找到~~~~</p>
        <h2>😥</h2>
      </template>
    </ContentDoc>
    <TopDownAndBack />
  </div>
  <PrevNext :prev="prev" :next="next" />
  <!-- <div mt-10> 返回
    <a font-mono opacity-50 hover:opacity-75 text-lg border-gray border-b dark:text-gray-300 hover:cursor-pointer @click="router.back()">cd ..</a>
  </div> -->
</template>

<script lang="ts" setup>
// const router = useRouter()
const { path } = useRoute()

const { data } = await useAsyncData(`content-${path}`, async () => {
  // 根据当前 path 找寻本文的位置
  const article = queryContent().where({ _path: path }).findOne()
  // 查找文章，通过时间进行排序，利用 findSurround 查询本文环绕信息，哪个是位于本文的前面，哪个是位于本文的后面
  const surround = queryContent().only(["_path", "title", "description", "date"]).sort({ date: 1 }).findSurround(path)
  return {
    article: await article,
    surround: await surround
  }
})

const [prev, next] = (data?.value!).surround
</script>
