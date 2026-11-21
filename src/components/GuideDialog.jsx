import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaXmark, FaArrowRight, FaArrowsLeftRight, FaUser, FaPlay, FaImage } from 'react-icons/fa6'
import { SITE_URL, CONTACT_EMAIL } from '../data/platforms'
import { guides, fallbackGuide } from '../data/guides'
import '../guide.css'

// TIP: size of ONE page in pixels. The whole book is scaled up or down to fit the screen.
const PW = 240
const PH = 330
const NARROW_BELOW = 560 // TIP: under this width (phones) the book shows one page at a time
const N = 3 // TIP: number of leaves: [cover | page 2], [page 3 | page 4], [page 5 | back cover]


// "https://resizer.uk" -> "Resizer.uk" (comes from SITE_URL in platformData.js)
const domain = SITE_URL.replace(/^https?:\/\//, '')
const brand = domain.charAt(0).toUpperCase() + domain.slice(1)

const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const ratioOf = (w, h) => {
  const g = gcd(w, h)
  const a = w / g
  const b = h / g
  return a <= 21 && b <= 21 ? `${a}:${b}` : `${(w / h).toFixed(2)}:1`
}
const shapeOf = (w, h) => (w === h ? 'Square' : w > h ? 'Wide' : 'Tall')

// TIP: turns the single "v" number into how far the pages are turned (p) and how far the book slides sideways (shift).
//   WIDE screens: v = p. Stops at 0 (closed), 1 (pages 2-3), 2 (pages 4-5), 3 (closed at the back).
//   PHONES: v goes 0..5, one page per step: cover, p2, p3, p4, p5, back cover.
const pose = (v, narrow) => {
  if (!narrow) {
    const shift = PW * (0.5 * Math.min(v, 1) + 0.5 * Math.max(0, v - (N - 1)))
    return { p: v, shift }
  }
  const m = Math.min(N - 1, Math.floor(v / 2))
  const r = v - 2 * m
  if (r <= 1) return { p: m + r, shift: PW * r }
  return { p: m + 1, shift: PW * (2 - r) }
}

// Thin line drawing of the format on the cover.
function Art({ kind, w, h }) {
  const k = Math.min(150 / w, 100 / h)
  return (
    <span className="bk-art" style={{ width: w * k, height: h * k }}>
      {kind === 'avatar' && <span className="bk-art-circle"><FaUser /></span>}
      {kind === 'banner' && <span className="bk-art-dot" />}
      {kind === 'thumb' && <span className="bk-art-play"><FaPlay /></span>}
      {kind === 'story' && <span className="bk-art-bars"><i /><i /><i /></span>}
      {kind === 'post' && <FaImage />}
    </span>
  )
}

export default function GuideDialog({ pf, s, kind, onClose, onUse }) {
  const g = guides[`${pf.id}:${s.name}`] ?? fallbackGuide
  const others = pf.presets.filter((o) => o.name !== s.name)
  const stageRef = useRef(null)
  const closeBtn = useRef(null)
  const timer = useRef(null)
  const drag = useRef(null)
  const [box, setBox] = useState({ w: 360, h: 800 })
  const [dragging, setDragging] = useState(false)
  const [v, setV] = useState(0) // TIP: turns the pages. Your finger or cursor moving SIDEWAYS changes it.
  const [spin, setSpin] = useState(0) // TIP: spins the whole book, in half turns (1 = shows the other side). Moving UP / DOWN changes it.

  const narrow = box.w < NARROW_BELOW
  const vMax = narrow ? 2 * N - 1 : N
  const clampV = (x) => Math.max(0, Math.min(vMax, x))
  const snap = (x) => clampV(Math.round(x))

  // TIP: scale so the book fits the width and the screen height. Raise 1.35 / 1.5 for a bigger book.
  const byWidth = narrow ? (box.w - 24) / PW : (box.w - 40) / (PW * 2)
  const scale = Math.max(0.5, Math.min(narrow ? 1.5 : 1.35, byWidth, (box.h - 300) / PH))

  // TIP: how many pixels of sideways dragging = one page. Raise 1.15 to make page turning less sensitive.
  const pxPerStep = PW * scale * 1.15
  // TIP: dragging up/down by the height of the book = half a turn. Change 1 to 0.7 for a faster spin.
  const pxPerHalfTurn = PH * scale * 1

  // ----- The pose of the book -----
  const { p, shift } = pose(v, narrow)
  const turned = (i) => Math.min(1, Math.max(0, p - i)) // 0 = leaf i lies on the right, 1 = turned over to the left
  const leafStyle = (i) => {
    const t = turned(i)
    // TIP: tiny z-offsets keep the leaves stacked in the right order on both sides
    const z = 1.5 * ((N - i) * (1 - t) + (i + 1) * t)
    return { transform: `translateZ(${z}px) rotateY(${-180 * t}deg)` }
  }
  const turn = -24 * (1 - Math.min(1, p)) + 24 * Math.max(0, p - (N - 1)) // closed books sit at a slight angle
  const lean = 6 + 2 * Math.max(0, Math.min(1, p, N - p))

  const labels = narrow
    ? ['Cover', 'Page 2', 'Page 3', 'Page 4', 'Page 5', 'Back cover']
    : ['Cover', 'Pages 2 and 3', 'Pages 4 and 5', 'Back cover']
  const idx = Math.round(v)

  // If the screen switches between phone and wide (for example, turning the phone), keep the same page.
  const vRef = useRef(v)
  vRef.current = v
  const prevNarrow = useRef(narrow)
  useEffect(() => {
    if (prevNarrow.current === narrow) return
    const stop = Math.round(pose(vRef.current, prevNarrow.current).p)
    setV(narrow ? (stop === 0 ? 0 : 2 * stop - 1) : stop)
    prevNarrow.current = narrow
  }, [narrow])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return undefined
    const measure = () => setBox({ w: el.clientWidth, h: window.innerHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // The book spins in, then opens by itself once (unless you grab it first).
  useEffect(() => {
    timer.current = setTimeout(() => setV((x) => (drag.current?.active ? x : 1)), 1100)
    return () => clearTimeout(timer.current)
  }, [])

  useEffect(() => {
    const opener = document.activeElement
    closeBtn.current?.focus()
    return () => opener?.focus?.()
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // TIP: arrow keys also turn the pages (left/right) and spin the book (up/down), for keyboard users
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        clearTimeout(timer.current)
        setSpin((x) => Math.round(x) + (e.key === 'ArrowDown' ? 1 : -1))
        return
      }
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      clearTimeout(timer.current)
      const step = e.key === 'ArrowRight' ? 1 : -1
      setV((x) => Math.max(0, Math.min(vMax, Math.round(x) + step)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [vMax])

  // ----- Drag: mouse or finger. SIDEWAYS = turn the pages. UP / DOWN = spin the whole book. -----
  const onDown = (e) => {
    clearTimeout(timer.current)
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      v0: v,
      s0: spin,
      // TIP: seen from behind, the pages turn the other way, so the sideways drag is flipped to follow your finger
      dir: Math.cos(spin * Math.PI) >= 0 ? 1 : -1,
      mode: null,
      active: false,
      trail: [],
    }
  }

  const onMove = (e) => {
    const d = drag.current
    if (d && d.id === e.pointerId) {
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      // TIP: it only counts as a drag after 6px, so simply tapping the email link on the back still works
      if (!d.active && Math.hypot(dx, dy) > 6) {
        d.active = true
        d.mode = Math.abs(dy) > Math.abs(dx) ? 'spin' : 'page' // the first move decides which one this gesture is
        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId)
      }
      if (d.active) {
        const next = d.mode === 'spin' ? d.s0 - dy / pxPerHalfTurn : clampV(d.v0 - (d.dir * dx) / pxPerStep)
        d.trail.push({ x: next, t: performance.now() })
        if (d.trail.length > 6) d.trail.shift()
        if (d.mode === 'spin') setSpin(next)
        else setV(next)
        return
      }
    }
    // Mouse hover (not dragging): the book tilts a little towards the cursor
    if (e.pointerType === 'mouse') {
      const r = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.setProperty('--rx', `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`)
      e.currentTarget.style.setProperty('--ry', `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`)
    }
  }

  const onUp = () => {
    const d = drag.current
    drag.current = null
    if (!d || !d.active) return
    setDragging(false)
    const tr = d.trail
    const last = tr.length ? tr[tr.length - 1].x : d.mode === 'spin' ? spin : v
    let vel = 0
    if (tr.length > 1) {
      const a = tr[0]
      const b = tr[tr.length - 1]
      vel = (b.x - a.x) / Math.max(1, b.t - a.t) // steps per millisecond
    }
    // TIP: a quick flick carries on a bit further. Raise 220 for more "throw".
    if (d.mode === 'spin') setSpin(Math.round(last + vel * 220)) // settles on the front or the back
    else setV(snap(last + vel * 220))
  }

  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  return createPortal(
    <div className="gd-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gd" role="dialog" aria-modal="true" aria-label={`${pf.name} ${s.name} guide`}>
        <button ref={closeBtn} className="gd-close" onClick={onClose} aria-label="Close"><FaXmark /></button>

        <div className="gd-head">
          <pf.Icon aria-hidden="true" />
          <div>
            <h3>{pf.name} {s.name}</h3>
            <p>Quick guide · {s.w}×{s.h} px</p>
          </div>
        </div>

        <div
          ref={stageRef}
          className={`gd-stage${dragging ? ' is-drag' : ''}`}
          style={{ height: PH * scale + 70 }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onLeave}
        >
          <div
            className={`bk-scale${dragging ? ' is-drag' : ''}`}
            style={{ width: PW, height: PH, transform: `translate(-50%, -50%) scale(${scale})` }}
          >
            <div className="bk-intro"><div className="bk-float"><div className="bk-tilt">
              {/* TIP: the book turns around the page that is in view, so closed books don't swing sideways */}
              <div
                className="bk"
                style={{
                  transform: `translateX(${shift}px) rotateX(${lean}deg) rotateY(${turn + spin * 180}deg)`,
                  transformOrigin: `${PW / 2 - shift}px 50%`,
                }}
              >

                {/* Leaf 3: page 5 on its front, the back cover on its back */}
                <div className="bk-leaf" style={leafStyle(2)}>
                  <div className="bk-face bk-page bk-inside-more">
                    <h4 className="bk-bar tip">More {pf.name} sizes</h4>
                    <ul className="bk-more">
                      {others.map((o) => (
                        <li key={o.name}><span>{o.name}</span><b>{o.w}×{o.h}</b></li>
                      ))}
                    </ul>
                    <p className="bk-free">Every size is free. No signup, and your photo never leaves your device.</p>
                    <span className="bk-num">5</span>
                  </div>

                  <div className="bk-face bk-back">
                    <span className="bk-frame" />
                    <strong>{brand}</strong>
                    <span className="bk-rule" />
                    <small>Questions or ideas?</small>
                    <a href={`mailto:${CONTACT_EMAIL}`} draggable={false}>{CONTACT_EMAIL}</a>
                    <span className="bk-bars" aria-hidden="true" />
                  </div>
                </div>

                {/* Leaf 2: page 3 on its front, page 4 on its back */}
                <div className="bk-leaf" style={leafStyle(1)}>
                  <div className="bk-face bk-page bk-inside-right">
                    <h4 className="bk-bar warn">Avoid</h4>
                    <p>{g.avoid}</p>
                    <h4 className="bk-bar tip">Resizer tip</h4>
                    <p>{g.editor}</p>
                    <h4 className="bk-bar">Specs</h4>
                    <dl className="bk-specs">
                      <div><dt>Size</dt><dd>{s.w}×{s.h} px</dd></div>
                      <div><dt>Ratio</dt><dd>{ratioOf(s.w, s.h)}</dd></div>
                      <div><dt>Shape</dt><dd>{shapeOf(s.w, s.h)}</dd></div>
                    </dl>
                    <span className="bk-num">3</span>
                  </div>

                  <div className="bk-face bk-page bk-inside-back">
                    <h4 className="bk-bar">Before you post</h4>
                    <p className="bk-hook">A 10-second check.</p>
                    <ul className="bk-check">
                      <li>Right size and shape?</li>
                      <li>Subject in the middle?</li>
                      <li>Text readable on a phone?</li>
                      <li>Still clear when it is tiny?</li>
                    </ul>
                    <span className="bk-num">4</span>
                  </div>
                </div>

                {/* Leaf 1: the cover on its front, page 2 on its back */}
                <div className="bk-leaf" style={leafStyle(0)}>
                  <div className="bk-face bk-front">
                    <div className="bk-mark">{brand}</div>
                    <div className="bk-art-box"><Art kind={kind} w={s.w} h={s.h} /></div>
                    <div className="bk-size">{s.w}<em>×</em>{s.h}</div>
                    <div className="bk-name">{pf.name}<span>·</span>{s.name}</div>
                  </div>

                  <div className="bk-face bk-page bk-inside-left">
                    <h4 className="bk-bar">Quick guide</h4>
                    <p className="bk-hook">{g.hook}</p>
                    <ol className="bk-tips">
                      {g.tips.map((t, i) => (
                        <li key={t}><b>{i + 1}</b><span>{t}</span></li>
                      ))}
                    </ol>
                    <span className="bk-num">2</span>
                  </div>
                </div>

              </div>
            </div></div></div>
          </div>
        </div>

        <div className="gd-hint" aria-hidden="true">
          <FaArrowsLeftRight />
          <span className="hint-mouse">Drag sideways to turn pages · drag up or down to spin the book</span>
          <span className="hint-touch">Swipe sideways to turn pages · swipe up or down to spin the book</span>
        </div>
        <div className="gd-dots" aria-hidden="true">
          {labels.map((l, i) => (
            <i key={l} className={i === idx ? 'on' : ''} />
          ))}
        </div>
        <span className="sr" aria-live="polite">{labels[idx]}</span>

        <button className="btn ai" onClick={onUse}>Resize to {s.w}×{s.h} <FaArrowRight /></button>
      </div>
    </div>,
    document.body
  )
}