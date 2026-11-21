import { useEffect, useRef, useState } from 'react'
import { FaXmark, FaDownload, FaImage, FaWandMagicSparkles } from 'react-icons/fa6'
import { render, layout, clamp, download } from '../utils/resizeImage'
import { guides, fallbackGuide } from '../data/guides'

const FILLS = [
  { id: 'blur', label: 'Blur' },
  { id: 'edge', label: 'Edge stretch' },
  { id: 'mirror', label: 'Mirror' },
  { id: 'color', label: 'Solid color' },
]

export default function Editor({ target, onClose, onPro }) {
  const { pf, s } = target
    const g = guides[`${pf.id}:${s.name}`] ?? fallbackGuide
  const [img, setImg] = useState(null)
  const [mode, setMode] = useState('fit')
  const [fill, setFill] = useState('blur')
  const [color, setColor] = useState('#ffffff')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [format, setFormat] = useState('png')
  const canvasRef = useRef(null)
  const drag = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    if (img && canvasRef.current) {
      render(canvasRef.current, img, s.w, s.h, { mode, fill, color, zoom, pan, opaque: format === 'jpeg' })
    }
  }, [img, mode, fill, color, zoom, pan, format, s])

  const load = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const el = new Image()
    el.onload = () => {
      setImg(el)
      setPan({ x: 0, y: 0 })
      setZoom(1)
    }
    el.src = URL.createObjectURL(file)
  }

  const changeMode = (m) => {
    setMode(m)
    setPan({ x: 0, y: 0 })
  }

  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e) => {
    if (!drag.current || !img) return
    const k = s.w / e.currentTarget.getBoundingClientRect().width
    const dx = (e.clientX - drag.current.x) * k
    const dy = (e.clientY - drag.current.y) * k
    drag.current = { x: e.clientX, y: e.clientY }
    const L = layout(img, s.w, s.h, { mode, zoom, pan: { x: 0, y: 0 } })
    const mx = Math.abs(s.w - L.dw) / 2
    const my = Math.abs(s.h - L.dh) / 2
    setPan((p) => ({ x: clamp(p.x + dx, -mx, mx), y: clamp(p.y + dy, -my, my) }))
  }

  const save = () => {
    const ext = format === 'jpeg' ? 'jpg' : 'png'
    const name = `${pf.id}-${s.name.toLowerCase().replace(/\s+/g, '-')}-${s.w}x${s.h}.${ext}`
    download(canvasRef.current, name, `image/${format}`)
  }

  const picker = (id, label) => (
    <button key={id} aria-pressed={format === id} onClick={() => setFormat(id)}>{label}</button>
  )

  return (
    <div className="ed-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ed" role="dialog" aria-modal="true" aria-label={`${pf.name} ${s.name}`}>
        <button className="ed-close" onClick={onClose} aria-label="Close"><FaXmark /></button>
        <div className="ed-head">
          <pf.Icon style={{ color: pf.color }} aria-hidden="true" />
          <div>
            <h3>{pf.name} {s.name}</h3>
            <p>{s.w}×{s.h} px</p>
          </div>
        </div>

        <div className="ed-body">
          <div className="ed-stage">
            {img ? (
              <canvas
                ref={canvasRef}
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={() => (drag.current = null)}
                aria-label="Preview. Drag to reposition the photo."
              />
            ) : (
              <label
                className="drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  load(e.dataTransfer.files[0])
                }}
              >
                <FaImage />
                <strong>Choose a photo</strong>
                <span>or drop it here</span>
                <input className="sr" type="file" accept="image/*" onChange={(e) => load(e.target.files[0])} />
              </label>
            )}
          </div>

          <div className="ed-controls">
            {img ? (
              <>
                <div className="ctl">
                  <h4>Photo</h4>
                  <div className="seg">
                    <button aria-pressed={mode === 'fit'} onClick={() => changeMode('fit')}>Fit whole photo</button>
                    <button aria-pressed={mode === 'crop'} onClick={() => changeMode('crop')}>Fill frame</button>
                  </div>
                </div>
                {(mode === 'fit' || zoom < 1) && (
                  <div className="ctl">
                    <h4>Fill the empty space</h4>
                    <div className="seg">
                      {FILLS.map((f) => (
                        <button key={f.id} aria-pressed={fill === f.id} onClick={() => setFill(f.id)}>{f.label}</button>
                      ))}
                    </div>
                    {fill === 'color' && (
                      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Fill color" />
                    )}
                  </div>
                )}
                <div className="ctl zoom">
                  <h4>Zoom: {Math.round(zoom * 100)}%</h4>
                  <input type="range" min="0.25" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(+e.target.value)} />
                </div>
                <div className="ctl">
                  <h4>Format</h4>
                  <div className="seg">{picker('png', 'PNG')}{picker('jpeg', 'JPG')}</div>
                </div>
                <p className="hint">Drag the photo to reposition it.</p>
                <button className="btn" onClick={save}><FaDownload /> Download</button>
                <label className="btn ghost">
                  Change photo
                  <input className="sr" type="file" accept="image/*" onChange={(e) => load(e.target.files[0])} />
                </label>
                <button className="btn ai" onClick={onPro}><FaWandMagicSparkles /> AI fill <em>Pro</em></button>
              </>
            ) : (
                            <>
                <p className="hint">Free {pf.name} {s.name.toLowerCase()} resizer. Get exactly {s.w}×{s.h} px, ready to post. Your photo never leaves your device.</p>
                <div className="ed-tips">
                  <h4>Quick guide</h4>
                  <ul>{g.tips.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
