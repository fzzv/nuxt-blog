interface ContentNode {
  type?: string
  tag?: string
  value?: string
  props?: Record<string, unknown>
  children?: ContentNode[]
}

const VOID_TAGS = new Set(['br', 'hr', 'img'])

const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'a', 'strong', 'em', 'del', 'code', 'pre',
  'ul', 'ol', 'li', 'blockquote', 'br', 'hr', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
])

// 遇到这些标签直接丢弃整棵子树（不递归渲染 children）。
// @nuxt/content + shiki 会在每篇 post 末尾插入一个 <style>，里面是高亮颜色的 .ct-xxx{} 规则；
// RSS 阅读器既不会执行 <style>，把它降级渲染又会把 CSS 文本暴露成正文，必须整体丢弃。
const STRIPPED_TAGS = new Set(['style', 'script', 'template'])

const SAFE_PROPS: Record<string, string[]> = {
  a: ['href', 'title'],
  img: ['src', 'alt', 'title'],
  code: ['class'],
  pre: ['class'],
}

export function renderBodyToHtml(body?: ContentNode | null): string {
  if (!body?.children) return ''
  return body.children.map(renderNode).join('')
}

function renderNode(node: ContentNode): string {
  if (!node) return ''
  if (node.type === 'text') return escapeText(node.value || '')

  const tag = node.tag
  if (!tag) return renderChildren(node)
  if (STRIPPED_TAGS.has(tag)) return ''

  // @nuxt/content 用 ProseCode 包裹 fenced code block：外层 <code> 的 props.code 是原始代码文本，
  // 内部嵌套了 <pre><code>(shiki 高亮 span...)。直接用 props.code 还原干净的 <pre><code> 即可，
  // 既丢弃了对 RSS 阅读器无意义的高亮 span class，又避免了 <code><pre><code> 的错误嵌套。
  if (tag === 'code' && typeof node.props?.code === 'string') {
    const language = node.props.language ? String(node.props.language) : ''
    const langAttr = language ? ` class="language-${escapeAttr(language)}"` : ''
    return `<pre><code${langAttr}>${escapeText(String(node.props.code))}</code></pre>`
  }

  if (!ALLOWED_TAGS.has(tag)) return renderChildren(node)

  const attrs = renderAttrs(tag, node.props)
  if (VOID_TAGS.has(tag)) return `<${tag}${attrs}/>`
  return `<${tag}${attrs}>${renderChildren(node)}</${tag}>`
}

function renderChildren(node: ContentNode): string {
  return (node.children || []).map(renderNode).join('')
}

function renderAttrs(tag: string, props?: Record<string, unknown>): string {
  if (!props) return ''
  const safe = SAFE_PROPS[tag]
  if (!safe) return ''
  return safe
    .filter(k => props[k] != null)
    .map(k => ` ${k}="${escapeAttr(String(props[k]))}"`)
    .join('')
}

function escapeText(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function escapeAttr(s: string): string {
  return escapeText(s).replace(/"/g, '&quot;')
}
