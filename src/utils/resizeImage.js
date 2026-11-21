export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Where the photo sits inside the output frame for the current settings.
export function layout(img, w, h, { mode, zoom, pan }) {
  const base =
    mode === 'crop'
      ? Math.max(w / img.width, h / img.height)
      : Math.min(w / img.width, h / img.height)
  const dw = img.width * base * zoom
  const dh = img.height * base * zoom
  const place = (size, frame, offset) =>
    clamp((frame - size) / 2 + offset, Math.min(0, frame - size), Math.max(0, frame - size))
  return { dw, dh, x: place(dw, w, pan.x), y: place(dh, h, pan.y) }
}

// Blur: shrink the photo to a tiny canvas, then stretch it back up (works in every browser).
function blurFill(ctx, img, w, h) {
  const small = document.createElement('canvas')
  small.width = Math.max(8, Math.round(w / 24))
  small.height = Math.max(8, Math.round(h / 24))
  const sctx = small.getContext('2d')
  sctx.imageSmoothingQuality = 'high'
  const s = Math.max(small.width / img.width, small.height / img.height)
  sctx.drawImage(img, (small.width - img.width * s) / 2, (small.height - img.height * s) / 2, img.width * s, img.height * s)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(small, 0, 0, w, h)
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.fillRect(0, 0, w, h)
}

// Edge stretch: smear the outermost row or column of pixels into the empty space.
function edgeFill(ctx, img, { x, y, dw, dh }, w, h) {
  if (x > 0) ctx.drawImage(img, 0, 0, 1, img.height, 0, y, x, dh)
  if (x + dw < w) ctx.drawImage(img, img.width - 1, 0, 1, img.height, x + dw, y, w - x - dw, dh)
  if (y > 0) ctx.drawImage(img, 0, 0, img.width, 1, x, 0, dw, y)
  if (y + dh < h) ctx.drawImage(img, 0, img.height - 1, img.width, 1, x, y + dh, dw, h - y - dh)
  // Corners (needed when the photo is zoomed out): stretch the nearest corner pixel.
  const r = x + dw, b = y + dh
  if (x > 0 && y > 0) ctx.drawImage(img, 0, 0, 1, 1, 0, 0, x, y)
  if (r < w && y > 0) ctx.drawImage(img, img.width - 1, 0, 1, 1, r, 0, w - r, y)
  if (x > 0 && b < h) ctx.drawImage(img, 0, img.height - 1, 1, 1, 0, b, x, h - b)
  if (r < w && b < h) ctx.drawImage(img, img.width - 1, img.height - 1, 1, 1, r, b, w - r, h - b)
}

function tile(ctx, img, x, y, dw, dh, flipX, flipY) {
  ctx.save()
  ctx.translate(flipX ? x + dw : x, flipY ? y + dh : y)
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1)
  ctx.drawImage(img, 0, 0, dw, dh)
  ctx.restore()
}

// Mirror: repeat flipped copies of the photo until the gap is covered.
function mirrorFill(ctx, img, { x, y, dw, dh }, w, h) {
  const c0 = -Math.ceil(x / dw)
  const c1 = Math.ceil((w - x - dw) / dw)
  const r0 = -Math.ceil(y / dh)
  const r1 = Math.ceil((h - y - dh) / dh)
  if ((c1 - c0 + 1) * (r1 - r0 + 1) > 5000) return
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (c || r) tile(ctx, img, x + c * dw, y + r * dh, dw, dh, Math.abs(c) % 2 === 1, Math.abs(r) % 2 === 1)
    }
  }
}

export function render(canvas, img, w, h, o) {
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const L = layout(img, w, h, o)
  if (o.opaque) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
  }
  if (L.dw < w - 0.5 || L.dh < h - 0.5) {
    if (o.fill === 'blur') blurFill(ctx, img, w, h)
    else if (o.fill === 'edge') edgeFill(ctx, img, L, w, h)
    else if (o.fill === 'mirror') mirrorFill(ctx, img, L, w, h)
    else {
      ctx.fillStyle = o.color
      ctx.fillRect(0, 0, w, h)
    }
  }
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, L.x, L.y, L.dw, L.dh)
}

export function download(canvas, filename, type) {
  canvas.toBlob(
    (blob) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    },
    type,
    0.92
  )
}
