import { useState } from 'react'
import { platforms } from '../data/platforms'
import { imgStyle } from '../utils/imgStyle'

// Left to right. The middle one sits on top. Use platform ids from platformData.js.
const CARD_ORDER = ['linkedin', 'facebook', 'youtube', 'instagram', 'x']

function Card({ pf, i, pos, mid, pic, showLetters, onPick }) {
  const [broken, setBroken] = useState(false)
  const hasPic = Boolean(pic?.src) && !broken
  const k = Math.abs(pos - mid)

  return (
    <button
      className={`card${hasPic ? ' has-pic' : ''}`}
      onClick={() => onPick(i)}
      aria-label={`${pf.name} formats`}
      style={{ '--c': pf.color, '--r': `${(pos - mid) * 3.4}deg`, '--k': k, '--z': 10 - Math.round(k) }}
    >
      {hasPic && <img className="card-img" src={pic.src} alt="" style={imgStyle(pic)} onError={() => setBroken(true)} />}
      {(!hasPic || showLetters) && <span className="idx top">{pf.short}</span>}
      {!hasPic && <pf.Icon className="logo" aria-hidden="true" />}
      {(!hasPic || showLetters) && <span className="idx bottom">{pf.short}</span>}
    </button>
  )
}

export default function PlatformCards({ onPick, images }) {
  const mid = (CARD_ORDER.length - 1) / 2

  return (
    <section className="cards" aria-label="Platforms">
      {CARD_ORDER.map((id, pos) => {
        const i = platforms.findIndex((p) => p.id === id)
        const pf = platforms[i]
        return (
          <Card
            key={id + (images.cards[id]?.src ?? '')}
            pf={pf}
            i={i}
            pos={pos}
            mid={mid}
            pic={images.cards[id]}
            showLetters={images.showLetters}
            onPick={onPick}
          />
        )
      })}
    </section>
  )
}
