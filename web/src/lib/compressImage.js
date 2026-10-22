/**
 * Resize & recompress images in the browser before CMS upload (web-safe sizes).
 * Keeps high-res originals offline; site only gets smaller files.
 */

const MAX_EDGE = 1600
const JPEG_QUALITY = 0.72

export async function compressImageForWeb(file, options = {}) {
  if (!file || !file.type?.startsWith('image/')) return file
  if (file.type === 'image/gif') return file // keep animated gifs as-is
  if (file.type === 'image/svg+xml') return file

  const maxEdge = options.maxEdge || MAX_EDGE
  const quality = options.quality ?? JPEG_QUALITY

  const bitmap = await loadBitmap(file)
  if (!bitmap) return file

  const { width, height } = bitmap
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  const w = Math.max(1, Math.round(width * scale))
  const h = Math.max(1, Math.round(height * scale))

  // Already small enough and under ~400KB — skip recompress for PNG icons etc.
  if (scale === 1 && file.size < 400 * 1024 && file.type === 'image/png') {
    bitmap.close?.()
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) {
    bitmap.close?.()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()

  const preferJpeg = file.type === 'image/jpeg' || file.type === 'image/webp' || scale < 1
  const mime = preferJpeg ? 'image/jpeg' : file.type === 'image/png' ? 'image/png' : 'image/jpeg'

  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, mime === 'image/jpeg' ? quality : undefined)
  })

  if (!blob || blob.size >= file.size && scale === 1) return file

  const base = String(file.name || 'image').replace(/\.[^.]+$/, '')
  const ext = mime === 'image/png' ? 'png' : 'jpg'
  return new File([blob], `${base}.${ext}`, { type: mime, lastModified: Date.now() })
}

async function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file)
    } catch {
      /* fall through */
    }
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}
