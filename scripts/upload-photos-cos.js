#!/usr/bin/env node

const COS = require('cos-nodejs-sdk-v5')
const sharp = require('sharp')
const { readFileSync, readdirSync, writeFileSync, mkdirSync } = require('fs')
const { join, extname, parse: parsePath } = require('path')
const { parseArgs } = require('util')
const { config } = require('dotenv')

config()

const { values: args } = parseArgs({
  options: {
    album: { type: 'string' },
    dir: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string', default: '' },
    cover: { type: 'string', default: '' },
    prefix: { type: 'string', default: 'albums' },
  },
})

if (!args.album || !args.dir || !args.title) {
  console.error('Usage: node scripts/upload-photos-cos.js --album <slug> --dir <path> --title <title> [--description <desc>] [--cover <filename>] [--prefix <path>]')
  process.exit(1)
}

const {
  album,
  dir,
  title,
  description,
  cover,
  prefix,
} = args

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.webp'])
const VIDEO_EXTS = new Set(['.mov', '.mp4'])
const MAX_LONG_EDGE = 2400
const THUMB_LONG_EDGE = 600
const JPEG_QUALITY = 80

const requiredEnvNames = [
  'COS_SECRET_ID',
  'COS_SECRET_KEY',
  'COS_BUCKET',
  'COS_REGION',
]

const missingEnvNames = requiredEnvNames.filter(name => !process.env[name])
if (missingEnvNames.length > 0) {
  console.error(`Missing required COS environment variables: ${missingEnvNames.join(', ')}`)
  process.exit(1)
}

const publicBaseUrl = normalizePublicUrl(
  process.env.COS_PUBLIC_URL || `https://${process.env.COS_BUCKET}.cos.${process.env.COS_REGION}.myqcloud.com`,
)

const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
})

function normalizePublicUrl(url) {
  return String(url).replace(/\/+$/, '')
}

function sortFileNames(fileNames) {
  return [...fileNames].sort((left, right) => (
    left.localeCompare(right, 'en', { numeric: true, sensitivity: 'base' })
  ))
}

function getObjectKey(outputName, suffix) {
  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '')
  return normalizedPrefix
    ? `${normalizedPrefix}/${album}/${outputName}${suffix}`
    : `${album}/${outputName}${suffix}`
}

function yamlValue(value) {
  return JSON.stringify(String(value ?? ''))
}

function upload(key, body, contentType) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: process.env.COS_BUCKET,
      Region: process.env.COS_REGION,
      Key: key,
      Body: body,
      ContentLength: body.length,
      ContentType: contentType,
    }, (error) => {
      if (error) {
        reject(error)
        return
      }

      console.log(`  ✓ uploaded ${key}`)
      resolve(`${publicBaseUrl}/${key}`)
    })
  })
}

async function processImage(filePath, outputName) {
  const image = sharp(filePath, { failOn: 'none' })
  const metadata = await image.metadata()
  const { width, height } = metadata

  if (!width || !height) {
    throw new Error(`Unable to read image size: ${filePath}`)
  }

  const isPortrait = height > width
  const resizeFull = isPortrait
    ? { height: Math.min(height, MAX_LONG_EDGE) }
    : { width: Math.min(width, MAX_LONG_EDGE) }
  const resizeThumb = isPortrait
    ? { height: Math.min(height, THUMB_LONG_EDGE) }
    : { width: Math.min(width, THUMB_LONG_EDGE) }

  const fullBuffer = await image
    .clone()
    .rotate()
    .resize(resizeFull)
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer()

  const thumbBuffer = await sharp(filePath, { failOn: 'none' })
    .rotate()
    .resize(resizeThumb)
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer()

  const fullMeta = await sharp(fullBuffer).metadata()

  return {
    fullBuffer,
    thumbBuffer,
    width: fullMeta.width,
    height: fullMeta.height,
    fullKey: getObjectKey(outputName, '.jpg'),
    thumbKey: getObjectKey(outputName, '_thumb.jpg'),
  }
}

async function main() {
  const files = sortFileNames(readdirSync(dir))

  const imageFiles = files.filter(fileName => IMAGE_EXTS.has(extname(fileName).toLowerCase()))
  const videoFiles = files.filter(fileName => VIDEO_EXTS.has(extname(fileName).toLowerCase()))

  const videoMap = new Map()
  for (const videoFile of videoFiles) {
    videoMap.set(parsePath(videoFile).name.toLowerCase(), videoFile)
  }

  console.log(`Found ${imageFiles.length} images, ${videoFiles.length} videos`)

  const normalizedCover = cover.toLowerCase()
  const photos = []
  let coverUrl = ''

  for (let index = 0; index < imageFiles.length; index++) {
    const imageFile = imageFiles[index]
    const outputName = `photo_${String(index + 1).padStart(3, '0')}`

    console.log(`Processing ${imageFile}...`)

    const filePath = join(dir, imageFile)
    const result = await processImage(filePath, outputName)

    const fullUrl = await upload(result.fullKey, result.fullBuffer, 'image/jpeg')
    const thumbUrl = await upload(result.thumbKey, result.thumbBuffer, 'image/jpeg')

    const photo = {
      url: fullUrl,
      thumb: thumbUrl,
      width: result.width,
      height: result.height,
    }

    const matchedVideo = videoMap.get(parsePath(imageFile).name.toLowerCase())
    if (matchedVideo) {
      const videoPath = join(dir, matchedVideo)
      const videoBuffer = readFileSync(videoPath)
      const videoExt = extname(matchedVideo).toLowerCase()
      const videoKey = getObjectKey(outputName, videoExt)
      const videoType = videoExt === '.mp4' ? 'video/mp4' : 'video/quicktime'
      const videoUrl = await upload(videoKey, videoBuffer, videoType)

      photo.isLive = true
      photo.liveVideoUrl = videoUrl
      console.log(`  ↳ Live Photo pair detected: ${imageFile} + ${matchedVideo}`)
    }

    photos.push(photo)

    if (normalizedCover && imageFile.toLowerCase() === normalizedCover) {
      coverUrl = thumbUrl
    }
  }

  if (photos.length === 0) {
    throw new Error('No supported image files found in the input directory.')
  }

  if (!coverUrl) {
    coverUrl = photos[0].thumb
    if (cover) {
      console.warn(`Cover file "${cover}" not found, falling back to the first photo.`)
    }
  }

  const yamlLines = [
    `title: ${yamlValue(title)}`,
    `description: ${yamlValue(description)}`,
    `cover: ${yamlValue(coverUrl)}`,
    `date: ${new Date().toISOString().split('T')[0]}`,
    'photos:',
  ]

  for (const photo of photos) {
    yamlLines.push(`  - url: ${yamlValue(photo.url)}`)
    yamlLines.push(`    thumb: ${yamlValue(photo.thumb)}`)
    yamlLines.push(`    width: ${photo.width}`)
    yamlLines.push(`    height: ${photo.height}`)
    if (photo.isLive) {
      yamlLines.push('    isLive: true')
      yamlLines.push(`    liveVideoUrl: ${yamlValue(photo.liveVideoUrl)}`)
    }
  }

  const yamlPath = join(process.cwd(), 'content', 'albums', `${album}.yml`)
  mkdirSync(join(process.cwd(), 'content', 'albums'), { recursive: true })
  writeFileSync(yamlPath, `${yamlLines.join('\n')}\n`)

  console.log(`\n✓ Album YAML written to ${yamlPath}`)
  console.log(`✓ ${photos.length} photos uploaded, ${photos.filter(photo => photo.isLive).length} Live Photos`)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
