// Remembers your "Tune images" settings in this browser while you develop,
// so a refresh doesn't lose them. Only the tuning numbers are saved, never the picture paths.
// The live site always uses src/data/images.js, so paste your settings there to keep them for real.
const KEY = 'resizer-tuner-v1'

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
const merge = (a, b) => {
  if (!isObj(a) || !isObj(b)) return b ?? a
  const out = { ...a }
  for (const k of Object.keys(b)) out[k] = merge(a[k], b[k])
  return out
}
const withoutSrc = (v) => {
  if (!isObj(v)) return v
  const out = {}
  for (const k of Object.keys(v)) if (k !== 'src') out[k] = withoutSrc(v[k])
  return out
}

export function loadTuned(base) {
  if (!import.meta.env.DEV) return base
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? merge(base, JSON.parse(raw)) : base
  } catch {
    return base
  }
}

export function saveTuned(cfg) {
  if (!import.meta.env.DEV) return
  try {
    localStorage.setItem(KEY, JSON.stringify(withoutSrc(cfg)))
  } catch {
    /* storage unavailable, ignore */
  }
}

export function clearTuned() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
