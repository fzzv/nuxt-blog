export interface Photo {
  url: string
  thumb: string
  caption?: string
  isLive?: boolean
  liveVideoUrl?: string
  width: number
  height: number
}

export interface Album {
  _path: string
  title: string
  description?: string
  cover: string
  date: string
  photos: Photo[]
}
