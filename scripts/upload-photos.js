import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, basename, extname, parse as parsePath } from 'path'
import { parseArgs } from 'util'
import { config } from 'dotenv'

config()

const { values: args } = parseArgs({
  options: {
    album: { type: 'string' },
    dir: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string', default: '' },
    cover: { type: 'string', default: '' },
  },
})

if (!args.album || !args.dir || !args.title) {
  console.error('Usage: node scripts/upload-photos.js --album <slug> --dir <path> --title <title> [--description <desc>] [--cover <filename>]')
  process.exit(1)
}

const { album, dir, title, description, cover } = args

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.webp'])
const VIDEO_EXTS = new Set(['.mov', '.mp4'])
const MAX_LONG_EDGE = 2400
const THUMB_LONG_EDGE = 600
const JPEG_QUALITY = 80

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME
const PUBLIC_URL = process.env.R2_PUBLIC_URL

async function upload(key, body, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
  console.log(`  ✓ uploaded ${key}`)
  return `${PUBLIC_URL}/${key}`
}

async function processImage(filePath, outputName) {
  const image = sharp(filePath)
  const metadata = await image.metadata()
  const { width, height } = metadata

  const isPortrait = height > width
  const resizeFull = isPortrait
    ? { height: Math.min(height, MAX_LONG_EDGE) }
    : { width: Math.min(width, MAX_LONG_EDGE) }
  const resizeThumb = isPortrait
    ? { height: Math.min(height, THUMB_LONG_EDGE) }
    : { width: Math.min(width, THUMB_LONG_EDGE) }

  const fullBuffer = await image
    .clone()
    .resize(resizeFull)
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer()

  const thumbBuffer = await sharp(filePath)
    .resize(resizeThumb)
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer()

  const fullMeta = await sharp(fullBuffer).metadata()

  return {
    fullBuffer,
    thumbBuffer,
    width: fullMeta.width,
    height: fullMeta.height,
    fullKey: `albums/${album}/${outputName}.jpg`,
    thumbKey: `albums/${album}/${outputName}_thumb.jpg`,
  }
}

async function main() {
  const files = readdirSync(dir)

  const imageFiles = files.filter(f => IMAGE_EXTS.has(extname(f).toLowerCase()))
  const videoFiles = files.filter(f => VIDEO_EXTS.has(extname(f).toLowerCase()))

  const videoMap = new Map()
  for (const v of videoFiles) {
    const stem = parsePath(v).name.toLowerCase()
    videoMap.set(stem, v)
  }

  console.log(`Found ${imageFiles.length} images, ${videoFiles.length} videos`)

  const photos = []
  let coverUrl = ''

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    const stem = parsePath(file).name
    const outputName = `photo_${String(i + 1).padStart(3, '0')}`

    console.log(`Processing ${file}...`)

    const filePath = join(dir, file)
    const result = await processImage(filePath, outputName)

    const fullUrl = await upload(result.fullKey, result.fullBuffer, 'image/jpeg')
    const thumbUrl = await upload(result.thumbKey, result.thumbBuffer, 'image/jpeg')

    const photo = {
      url: fullUrl,
      thumb: thumbUrl,
      width: result.width,
      height: result.height,
    }

    const matchedVideo = videoMap.get(stem.toLowerCase())
    if (matchedVideo) {
      const videoPath = join(dir, matchedVideo)
      const videoBuffer = readFileSync(videoPath)
      const videoKey = `albums/${album}/${outputName}.mov`
      const videoUrl = await upload(videoKey, videoBuffer, 'video/quicktime')
      photo.isLive = true
      photo.liveVideoUrl = videoUrl
      console.log(`  ↳ Live Photo pair detected: ${file} + ${matchedVideo}`)
    }

    photos.push(photo)

    if (cover && file === cover) {
      coverUrl = thumbUrl
    }
  }

  if (!coverUrl && photos.length > 0) {
    coverUrl = photos[0].thumb
  }

  const yamlLines = [
    `title: "${title}"`,
    `description: "${description}"`,
    `cover: ${coverUrl}`,
    `date: ${new Date().toISOString().split('T')[0]}`,
    `photos:`,
  ]

  for (const p of photos) {
    yamlLines.push(`  - url: ${p.url}`)
    yamlLines.push(`    thumb: ${p.thumb}`)
    yamlLines.push(`    width: ${p.width}`)
    yamlLines.push(`    height: ${p.height}`)
    if (p.isLive) {
      yamlLines.push(`    isLive: true`)
      yamlLines.push(`    liveVideoUrl: ${p.liveVideoUrl}`)
    }
  }

  const yamlPath = join(process.cwd(), 'content', 'albums', `${album}.yml`)
  writeFileSync(yamlPath, yamlLines.join('\n') + '\n')
  console.log(`\n✓ Album YAML written to ${yamlPath}`)
  console.log(`✓ ${photos.length} photos uploaded, ${photos.filter(p => p.isLive).length} Live Photos`)
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
