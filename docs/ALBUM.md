# 相册功能使用说明

本博客的相册功能基于 `@nuxt/content` 的 YAML 数据集合，配合 `scripts/upload-photos.js` 一键将本地照片处理、上传至 Cloudflare R2，并生成相册元数据文件。

## 目录结构

```
content/albums/         # 相册元数据 YAML（每个文件 = 一个相册）
  └─ <slug>.yml
pages/albums/
  ├─ index.vue          # 相册列表 /albums
  └─ [...slug].vue      # 相册详情 /albums/<slug>
components/
  ├─ AlbumCard.vue      # 相册卡片
  ├─ PhotoWaterfall.vue # 详情页瀑布流
  ├─ PhotoLightbox.vue  # 大图查看器
  └─ LivePhoto.vue      # 实况照片播放器
scripts/upload-photos.js
types/Album.ts          # Album / Photo 类型定义
```

## 一、准备工作

### 1. 配置 Cloudflare R2

复制 `.env.example` 为 `.env`，填入 R2 凭据：

```bash
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=xxx
R2_PUBLIC_URL=https://cdn.xyu.fan
```

`R2_PUBLIC_URL` 是 R2 bucket 绑定的公开访问域名，上传后的 URL 形如 `${R2_PUBLIC_URL}/albums/<slug>/photo_001.jpg`。

### 2. 安装上传脚本依赖

脚本用到 `@aws-sdk/client-s3`、`sharp`、`dotenv`，如未安装：

```bash
npm i -D @aws-sdk/client-s3 sharp dotenv
```

## 二、上传新相册

### 命令格式

```bash
node scripts/upload-photos.js \
  --album <slug> \
  --dir <本地照片目录> \
  --title "<相册标题>" \
  [--description "<相册描述>"] \
  [--cover <封面原文件名>]
```

### 参数说明

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--album` | ✅ | 相册 slug，作为 URL 路径与 YAML 文件名（如 `kyoto-2024`，最终生成 `content/albums/kyoto-2024.yml`，访问 `/albums/kyoto-2024`） |
| `--dir` | ✅ | 本地待上传照片所在目录，脚本会扫描该目录下的所有图片与视频 |
| `--title` | ✅ | 相册显示标题（中英文均可） |
| `--description` | ❌ | 相册描述，显示在详情页标题下方 |
| `--cover` | ❌ | 封面原文件名（如 `IMG_0123.JPG`）；未指定时取第一张照片的缩略图 |

### 示例

```bash
node scripts/upload-photos.js \
  --album kyoto-2024 \
  --dir "D:/Photos/京都" \
  --title "京都漫游" \
  --description "2024 秋季京都之行" \
  --cover IMG_2046.JPG
```

### 脚本行为

1. **扫描文件**
   - 图片扩展名：`.jpg` / `.jpeg` / `.png` / `.heic` / `.webp`
   - 视频扩展名：`.mov` / `.mp4`（仅用于 Live Photo 配对）
2. **压缩处理**（用 sharp）
   - 原图：最长边缩到 `2400px`，JPEG 质量 80
   - 缩略图：最长边缩到 `600px`，JPEG 质量 80
3. **重命名**：按扫描顺序统一改名为 `photo_001` / `photo_002` …
4. **上传到 R2** 的路径：
   ```
   albums/<slug>/photo_001.jpg          # 原图
   albums/<slug>/photo_001_thumb.jpg    # 缩略图
   albums/<slug>/photo_001.mov          # （若有配对视频）
   ```
5. **生成 YAML**：写入 `content/albums/<slug>.yml`，`date` 自动取脚本运行当天日期。

## 三、实况照片（Live Photo）支持

只要把 iPhone 导出的 `IMG_xxxx.HEIC` 和同名 `IMG_xxxx.MOV` **放在同一个 `--dir` 目录里**，脚本就会按"去扩展名后小写"的文件名 stem 自动配对，并在 YAML 里写入：

```yaml
- url: https://cdn.xyu.fan/albums/foo/photo_006.jpg
  thumb: https://cdn.xyu.fan/albums/foo/photo_006_thumb.jpg
  width: 2400
  height: 3200
  isLive: true
  liveVideoUrl: https://cdn.xyu.fan/albums/foo/photo_006.mov
```

前端逻辑：
- 瀑布流中带 Live 标签
- Lightbox 打开时优先使用 Apple `LivePhotosKit`（已在 `nuxt.config.ts` 引入 CDN）；不支持时降级为悬停/长按播放视频的自定义播放器

## 四、手动编辑 / 不走脚本

如果照片已经托管在别处（如 picsum、其他 CDN），可以直接手写 `content/albums/<slug>.yml`，字段参考 `types/Album.ts`：

```yaml
title: 示例相册
description: 可选描述
cover: https://cdn.example.com/cover.jpg
date: 2024-03-15
photos:
  - url: https://cdn.example.com/p1.jpg     # 原图（lightbox 显示）
    thumb: https://cdn.example.com/p1_t.jpg # 缩略图（瀑布流显示）
    caption: 可选说明                        # 鼠标悬停 / lightbox 底部显示
    width: 2400                              # 必填，用于占位避免抖动
    height: 3200                             # 必填
    isLive: true                             # 可选，实况照片
    liveVideoUrl: https://...mov             # isLive=true 时必填
```

字段对应类型：

```ts
// types/Album.ts
interface Photo {
  url: string;          thumb: string;
  caption?: string;
  isLive?: boolean;
  liveVideoUrl?: string;
  width: number;        height: number;
}
interface Album {
  title: string;
  description?: string;
  cover: string;
  date: string;         photos: Photo[];
}
```

## 五、本地预览

```bash
npm run dev
```

访问 `http://localhost:3000/albums` 查看列表，点击进入详情页。

### ⚠️ 已知坑：新增相册后详情页空白

`@nuxt/content` v2 会把 `_path → _id` 索引缓存到 `.nuxt/content-cache/content-index.json`。如果新增 YAML 时 dev server 没有正在监听文件变更（例如 dev 还没启动 / 用脚本写入的时机），首次加载详情页会读到过期索引——**列表页能看到相册（走 `$regex` 绕过索引），但详情页显示标题为空、"0 张照片"**。

解决：

```bash
rm -rf .nuxt/content-cache
```

重启 dev server 即可。生产环境（`npm run build`）每次构建会重新生成索引，不受影响。

## 六、典型工作流

```bash
# 1. 选好本地照片，整理到一个目录
# 2. 上传 + 生成 YAML
node scripts/upload-photos.js \
  --album <slug> --dir <path> --title "<标题>"

# 3. （可选）手工微调 content/albums/<slug>.yml（加 caption、改 cover 等）

# 4. 本地确认
npm run dev
# 如发现详情页空白：rm -rf .nuxt/content-cache 后重启

# 5. 提交并部署
git add content/albums/<slug>.yml
git commit -m "feat(album): add <slug>"
git push
```
