import { useState } from 'react'
import { customIcons } from '../data/icons'
import '../icons.css'

// Shows your own icon if one is set in src/data/icons.js, otherwise the default logo.
export default function PlatformIcon({ id, Fallback, className = '', style, ...rest }) {
  const [broken, setBroken] = useState(false)
  const src = customIcons[id]
  if (!src || broken) return <Fallback className={className} style={style} {...rest} />

  const cls = `picon ${className}`.trim()
  if (src.includes('#')) {
    return (
      <svg className={cls} style={style} aria-hidden="true" {...rest}>
        <use href={src} />
      </svg>
    )
  }
  return <img className={cls} style={style} src={src} alt="" aria-hidden="true" onError={() => setBroken(true)} {...rest} />
}
