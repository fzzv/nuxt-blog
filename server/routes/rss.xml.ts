import RSS from 'rss'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://blog.xyu.fan'
  const siteName = 'Fan\'s Blog'
  const siteDescription = 'study programs and record life'

  // Create RSS feed
  const feed = new RSS({
    title: siteName,
    description: siteDescription,
    feed_url: `${baseUrl}/rss.xml`,
    site_url: baseUrl,
    image_url: `${baseUrl}/images/favicon.ico`,
    language: 'zh-CN',
    pubDate: new Date(),
    ttl: 60,
  })

  try {
    // 查找全部文章
    const posts = await serverQueryContent(event, '/posts')
      .where({ _draft: { $ne: true } })
      .sort({ date: -1 })
      .find()

    // 将每篇文章都添加到 RSS 订阅列表中
    for (const post of posts) {
      const postUrl = `${baseUrl}/posts${post._path}`

      const content = post?.body ? convertContentToHtml(post.body) : post.description || ''
      
      feed.item({
        title: post.title || 'Untitled',
        description: post.description || post.excerpt || '',
        url: postUrl,
        guid: postUrl,
        date: new Date(post.date),
        categories: post.tags || [],
        custom_elements: [
          { 'content:encoded': content },
        ],
      })
    }

    // 设置响应头
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    
    return feed.xml()
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error generating RSS feed'
    })
  }
})

/**
 * 将 body 的内容转成 HTML string
 */
function convertContentToHtml(body: any): string {
  if (!body || !body.children) {
    return ''
  }

  return processNodes(body.children)
}

/**
 * 处理内容节点数组并将其转换为 HTML 格式
 */
function processNodes(nodes: any[]): string {
  if (!Array.isArray(nodes)) {
    return ''
  }

  return nodes.map(node => processNode(node)).join('')
}

/**
 * 处理一个内容节点并将其转换为 HTML 格式
 */
function processNode(node: any): string {
  if (!node) {
    return ''
  }

  if (node.type === 'text') {
    return escapeHtml(node.value || '')
  }

  switch (node.tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return `<${node.tag}>${processNodes(node.children || [])}</${node.tag}>`
    
    case 'p':
      return `<p>${processNodes(node.children || [])}</p>`
    
    case 'a':
      const href = node.props?.href || '#'
      return `<a href="${escapeHtml(href)}">${processNodes(node.children || [])}</a>`
    
    case 'strong':
      return `<strong>${processNodes(node.children || [])}</strong>`
    
    case 'em':
      return `<em>${processNodes(node.children || [])}</em>`
    
    case 'code':
      if (node.children && node.children.length > 0) {
        return `<code>${processNodes(node.children)}</code>`
      }
      return `<code>${escapeHtml(node.value || '')}</code>`
    
    case 'pre':
      // Handle code blocks
      return processCodeBlock(node)
    
    case 'ul':
      return `<ul>${processNodes(node.children || [])}</ul>`
    
    case 'ol':
      return `<ol>${processNodes(node.children || [])}</ol>`
    
    case 'li':
      return `<li>${processNodes(node.children || [])}</li>`
    
    case 'blockquote':
      return `<blockquote>${processNodes(node.children || [])}</blockquote>`
    
    case 'br':
      return '<br/>'
    
    case 'hr':
      return '<hr/>'
    
    case 'img':
      const src = node.props?.src || ''
      const alt = node.props?.alt || ''
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"/>`
    
    default:
      if (node.children && node.children.length > 0) {
        return processNodes(node.children)
      }
      return ''
  }
}

/**
 * 对代码块元素进行适当的格式化处理
 */
function processCodeBlock(node: any): string {
  try {
    if (!node.children || node.children.length === 0) {
      return '<pre><code></code></pre>'
    }

    // 找出位于 pre 标签内的 code 元素
    const codeNode = node.children.find((child: any) => child.tag === 'code')
    if (codeNode) {
      const language = codeNode.props?.class?.replace('language-', '') || ''
      const codeContent = processCodeContent(codeNode.children || [])
      
      if (language) {
        return `<pre><code class="language-${escapeHtml(language)}">${codeContent}</code></pre>`
      } else {
        return `<pre><code>${codeContent}</code></pre>`
      }
    }

    return `<pre>${processNodes(node.children)}</pre>`
  } catch (error) {
    console.warn('Error processing code block:', error)
    return `<pre><code>${extractTextContent(node)}</code></pre>`
  }
}

/**
 * 处理代码内容，保留格式并进行语法高亮显示
 */
function processCodeContent(nodes: any[]): string {
  if (!Array.isArray(nodes)) {
    return ''
  }

  return nodes.map(node => {
    if (node.type === 'text') {
      return escapeHtml(node.value || '')
    }
    
    if (node.tag === 'span' && node.children) {
      // 处理语法高亮显示区域
      const className = node.props?.class || ''
      const content = processCodeContent(node.children)
      if (className) {
        return `<span class="${escapeHtml(className)}">${content}</span>`
      }
      return content
    }
    
    if (node.children) {
      return processCodeContent(node.children)
    }
    
    return escapeHtml(node.value || '')
  }).join('')
}

/**
 * 从节点中提取纯文本内容 (fallback method)
 */
function extractTextContent(node: any): string {
  if (!node) {
    return ''
  }

  if (node.type === 'text') {
    return node.value || ''
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextContent).join('')
  }

  return node.value || ''
}

/**
 * 去除 HTML 特殊字符
 */
function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return ''
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
