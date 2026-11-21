import { useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaUser, FaPlay, FaImage } from 'react-icons/fa6'
import { platforms } from '../data/platforms'
import { formatTweaks } from '../data/formatTweaks'
import HeroBg from './HeroBg'

// Which little picture hints at what this format is used for.
const kindOf = (name) => {
  if (/thumbnail/i.test(name)) return 'thumb'
  if (/profile picture|logo/i.test(name)) return 'avatar'
  if (/banner|cover photo|header/i.test(name)) return 'banner'
  if (/story|shorts|reel/i.test(name)) return 'story'
  return 'post'
}

function Cue({ kind }) {
  if (kind === 'avatar') return <span className="cue cue-avatar"><FaUser /></span>
  if (kind === 'banner') return <span className="cue cue-banner" />
  if (kind === 'thumb')
    return (
      <>
        <span className="cue cue-play"><FaPlay /></span>
        <span className="cue cue-time">12:34</span>
      </>
    )
  if (kind === 'story')
    return (
      <span className="cue cue-bars">
        <i /><i /><i />
      </span>
    )
  return <span className="cue cue-post"><FaImage /></span>
}

// Width and height in "units" (see --u in formats.css). Same visual weight for every shape.
function sizeFor(pf, s) {
  const base = Math.sqrt(s.w / s.h)
  const t = formatTweaks[`${pf.id}:${s.name}`]
  if (!t) return { width: `calc(var(--u) * ${base.toFixed(3)})`, aspectRatio: `${s.w} / ${s.h}` }
  return {
    width: `calc(var(--u) * ${(base * (t.w ?? 1)).toFixed(3)})`,
    height: `calc(var(--u) * ${((1 / base) * (t.h ?? 1)).toFixed(3)})`,
  }
}

// The big platform logo. Uses public/logos/<id>.png if it exists, otherwise the platform's normal icon.
function SectionLogo({ pf, cfg }) {
  const [broken, setBroken] = useState(false)
  const style = { left: `${cfg.x}%`, top: `${cfg.y}%`, '--logo-size': `${cfg.size}px`, transform: `rotate(${cfg.tilt ?? 0}deg)` }
  if (cfg.src && !broken) {
    return <img className="fmt-logo" src={cfg.src} alt={pf.name} style={style} onError={() => setBroken(true)} />
  }
  return (
    <span className="fmt-logo fmt-logo-icon" role="img" aria-label={pf.name} style={style}>
      <pf.Icon />
    </span>
  )
}

export default function Formats({ active, setActive, onOpen, bgs, logos }) {
  const total = platforms.length
  const pf = platforms[active]
  const go = (step) => setActive((active + step + total) % total)
    // TIP: swipe left/right on phones to change platform. Needs a clear sideways move, so normal page scrolling still works.
  const touch = useRef(null)
  const onTouchStart = (e) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
  }

  return (
       <section id="formats" className="fmt" data-pf={pf.id} style={{ '--c': pf.color }}>
      <HeroBg key={pf.id} cfg={bgs[pf.id]} className="fmt-bg" />
      <h2 className="sr">{pf.name} image formats</h2>

      <SectionLogo key={pf.id} pf={pf} cfg={logos[pf.id]} />

            <div className="fmt-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button className="fmt-arrow prev glass" onClick={() => go(-1)} aria-label="Previous platform">
          <FaArrowLeft />
        </button>
        <div className="fmt-panels" key={pf.id}>
          {pf.presets.map((s) => {
            const kind = kindOf(s.name)
            return (
              <button
                key={s.name}
                className={`fmt-tile glass k-${kind}`}
                onClick={() => onOpen(pf, s)}
                aria-label={`${pf.name} ${s.name}, ${s.w} by ${s.h}`}
                style={sizeFor(pf, s)}
              >
                <Cue kind={kind} />
                <span className="fmt-label">
                  <b>{s.name}</b>
                  <small>{s.w}×{s.h}</small>
                </span>
              </button>
            )
          })}
        </div>
        <button className="fmt-arrow next glass" onClick={() => go(1)} aria-label="Next platform">
          <FaArrowRight />
        </button>
      </div>
            {/* TIP: slider indicator. Hidden on desktop (see formats.css), tappable on phones. */}
      <div className="fmt-dots" role="tablist" aria-label="Choose platform">
        {platforms.map((p, i) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={i === active}
            aria-label={p.name}
            className={i === active ? 'on' : ''}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  )
}
