import { Feed } from 'feed'
import { serverQueryContent } from '#content/server'
import { renderBodyToHtml } from '../utils/render-content'

const SITE = {
  url: 'https://blog.xyu.fan',
  title: "Fan's Blog",
  description: 'study programs and record life',
  author: 'Fan',
  language: 'zh-CN',
}

export default defineEventHandler(async (event) => {
  const posts = await serverQueryContent(event, '/posts')
    .where({ _draft: { $ne: true } })
    .sort({ date: -1 })
    .find()

  const feed = new Feed({
    id: SITE.url,
    link: SITE.url,
    title: SITE.title,
    description: SITE.description,
    language: SITE.language,
    favicon: `${SITE.url}/images/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${SITE.author}`,
    updated: posts[0]?.date ? parseDate(posts[0].date) : new Date(),
    feedLinks: { rss: `${SITE.url}/rss.xml` },
    author: { name: SITE.author },
  })

  for (const post of posts) {
    const url = `${SITE.url}${post._path}`
    feed.addItem({
      id: url,
      link: url,
      title: post.title || 'Untitled',
      description: post.description,
      content: renderBodyToHtml(post.body),
      date: parseDate(post.date),
      category: (post.tags || []).map((name: string) => ({ name })),
    })
  }

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return feed.rss2()
})

// 兼容 frontmatter 里 '2022-2-8' / '2022-02-08' / ISO 字符串 / 已解析为 Date 对象的多种情况
function parseDate(d: unknown): Date {
  if (d instanceof Date) return d
  if (typeof d === 'string') {
    const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(d)
    if (match) {
      return new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]))
    }
    const parsed = new Date(d)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return new Date()
}
