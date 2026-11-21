import { useState } from 'react'
import { imgStyle } from '../utils/imgStyle'

// A background picture that fills its parent. Used for the hero and the platform section.
export default function HeroBg({ cfg, className = 'hero-bg' }) {
  const [broken, setBroken] = useState(false)
  if (!cfg?.src || broken) return null
  return (
    <img className={className} src={cfg.src} alt="" style={imgStyle(cfg)} onError={() => setBroken(true)} />
  )
}
