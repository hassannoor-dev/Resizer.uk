import { useState } from 'react'
import { FaMagnifyingGlass, FaLayerGroup, FaArrowRight, FaCircleCheck } from 'react-icons/fa6'
import { platforms } from '../data/platforms'

const CHECKS = ['No signup', 'Photos stay on your device', 'Exact platform sizes']

export default function Hero({ onPick }) {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('all')
  const term = query.trim().toLowerCase()

  const matches = platforms.flatMap((pf, i) =>
    platform === 'all' || platform === pf.id
      ? pf.presets
          .filter((s) => !term || `${pf.name} ${s.name}`.toLowerCase().includes(term))
          .map((s) => ({ pf, i, s }))
      : []
  )
  const results = term ? matches.slice(0, 6) : []

  const find = (e) => {
    e.preventDefault()
    if (term && !matches.length) return
    onPick(matches.length ? matches[0].i : 0)
  }

  return (
    <section className="hero-main">
      <h1>
        Resize any image
        <br />
        for <span className="hl">any platform.</span>
      </h1>
      <p className="sub">Pick a platform and a format. Get the exact size in seconds.</p>

      <form className="search" onSubmit={find}>
        <div className="field">
          <label htmlFor="fmt">Format</label>
          <div className="row">
            <FaMagnifyingGlass aria-hidden="true" />
            <input
              id="fmt"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="YouTube thumbnail, banner..."
              autoComplete="off"
            />
          </div>

          {/* TIP: the results live inside the Format field so phones can place them right under the input */}
          {term && (
            <ul className="results">
              {results.length === 0 && <li className="empty">No format found. Try another name.</li>}
              {results.map(({ pf, i, s }) => (
                <li key={pf.id + s.name}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(i)
                      setQuery('')
                    }}
                  >
                    <pf.Icon style={{ color: pf.color }} aria-hidden="true" />
                    {pf.name} {s.name}
                    <span>{s.w}×{s.h}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="field">
          <label htmlFor="plat">Platform</label>
          <div className="row">
            <FaLayerGroup aria-hidden="true" />
            <select id="plat" value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="all">All platforms</option>
              {platforms.map((pf) => (
                <option key={pf.id} value={pf.id}>{pf.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="find" type="submit">
          Find a format <i><FaArrowRight /></i>
        </button>


      </form>

      <ul className="checks">
        {CHECKS.map((c) => (
          <li key={c}><FaCircleCheck aria-hidden="true" /> {c}</li>
        ))}
      </ul>
    </section>
  )
}
