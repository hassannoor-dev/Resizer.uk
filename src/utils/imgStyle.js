// Turns { fit, zoom, x, y, opacity } into the CSS that places a picture inside its frame.
export const imgStyle = ({ fit = 'cover', zoom = 1, x = 50, y = 50, opacity = 1 }) => ({
  objectFit: fit,
  objectPosition: `${x}% ${y}%`,
  transform: `scale(${zoom})`,
  transformOrigin: `${x}% ${y}%`,
  opacity,
})
