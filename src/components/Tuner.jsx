import { useState } from 'react'
import { platforms } from '../data/platforms'
import { clearTuned } from '../utils/tunerStore'
import '../tuner.css'

// Development helper: live sliders for every picture. Not included in the production build.
// Targets look like "hero", "card:linkedin", "fmt:linkedin" or "logo:linkedin".
const GROUPS = { card: 'cards', fmt: 'formatsBg', logo: 'formatsLogo' }

export default function Tuner({ cfg, setCfg }) {
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState('hero')
  const [copied, setCopied] = useState(false)

  const [kind, id] = target.split(':')
  const group = GROUPS[kind] ?? null
  const cur = group ? cfg[group][id] : cfg.hero
  const isLogo = kind === 'logo'

  const set = (patch) =>
    setCfg((c) =>
      group
        ? { ...c, [group]: { ...c[group], [id]: { ...c[group][id], ...patch } } }
        : { ...c, hero: { ...c.hero, ...patch } }
    )

  const copy = async () => {
    await navigator.clipboard.writeText(`// See the notes in the old file for what each setting does.\nexport const defaultImages = ${JSON.stringify(cfg, null, 2)}\n`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const slider = (key, label, min, max, step, def) => (
    <label>
      <span className="tuner-row">{label}<b>{cur[key] ?? def}</b></span>
      <input type="range" min={min} max={max} step={step} value={cur[key] ?? def} onChange={(e) => set({ [key]: +e.target.value })} />
    </label>
  )

  return (
    <div className="tuner">
      {open && (
        <div className="tuner-panel">
          <label>
            Picture
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="hero">Hero background</option>
              <optgroup label="Cards">
                {platforms.map((p) => (
                  <option key={p.id} value={`card:${p.id}`}>{p.name} card</option>
                ))}
              </optgroup>
              <optgroup label="Platform section background">
                {platforms.map((p) => (
                  <option key={p.id} value={`fmt:${p.id}`}>{p.name}</option>
                ))}
              </optgroup>
              <optgroup label="Platform section logo">
                {platforms.map((p) => (
                  <option key={p.id} value={`logo:${p.id}`}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          </label>

          {isLogo ? (
            <>
              {slider('size', 'Size (px)', 30, 400, 2, 96)}
              {slider('x', 'Position X (%)', 0, 100, 0.5, 5)}
              {slider('y', 'Position Y (%)', 0, 100, 0.5, 7)}
              {slider('tilt', 'Tilt (degrees)', -45, 45, 1, 0)}
            </>
          ) : (
            <>
              <label>
                Fit
                <select value={cur.fit} onChange={(e) => set({ fit: e.target.value })}>
                  <option value="cover">Cover (fills the frame)</option>
                  <option value="contain">Contain (whole picture)</option>
                </select>
              </label>
              {slider('zoom', 'Zoom', 1, 3, 0.05, 1)}
              {slider('x', 'Position X', 0, 100, 1, 50)}
              {slider('y', 'Position Y', 0, 100, 1, 50)}
              {slider('opacity', 'Opacity', 0, 1, 0.05, 1)}
            </>
          )}

          <label className="tuner-row">
            <span>Letters on cards</span>
            <input type="checkbox" checked={cfg.showLetters} onChange={(e) => setCfg((c) => ({ ...c, showLetters: e.target.checked }))} />
          </label>
          <button className="btn" onClick={copy}>{copied ? 'Copied!' : 'Copy settings'}</button>
          <button className="btn ghost" onClick={() => { clearTuned(); window.location.reload() }}>Reset to saved file</button>
          <p className="tuner-note">Your tweaks are remembered in this browser while you work. To put them on the real site, click Copy settings and paste over src/data/images.js.</p>
        </div>
      )}
      <button className="tuner-toggle" onClick={() => setOpen(!open)}>{open ? 'Close tuner' : 'Tune images'}</button>
    </div>
  )
}
