import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import Hero from './components/Hero'
import PlatformCards from './components/PlatformCards'
import Formats from './components/Formats'
import Pro from './components/Pro'
import Footer from './components/Footer'
import Editor from './components/Editor'
import Legal from './components/Legal'
import Nav from './components/Nav'
import HeroBg from './components/HeroBg'
import Tuner from './components/Tuner'
import { defaultImages } from './data/images'
import { loadTuned, saveTuned } from './utils/tunerStore'
import usePageMeta from './utils/usePageMeta'
import { platforms } from './data/platforms'
import { slugFor, findBySlug, homePage } from './data/meta.js'
import './extra.css'
import './legal.css'
import './nav.css'
import './images.css'
import './formats.css'
import './theme.css'

// Keeps older saved settings working when new picture slots are added.
const IDS = ['linkedin', 'facebook', 'youtube', 'instagram', 'x']
const bgSlot = (id) => ({ src: `/formats/${id}.png`, fit: 'cover', zoom: 1, x: 50, y: 50, opacity: 1 })
const logoSlot = (id) => ({ src: `/logos/${id}.png`, size: 96, x: 5, y: 7, tilt: 0 })
const withDefaults = (c) => ({
  ...c,
  // Merge each platform one by one, so a saved entry without a picture path can never erase the default path.
  formatsBg: Object.fromEntries(IDS.map((id) => [id, { ...bgSlot(id), ...c.formatsBg?.[id] }])),
  formatsLogo: Object.fromEntries(IDS.map((id) => [id, { ...logoSlot(id), ...c.formatsLogo?.[id] }])),
})

function Home() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [images, setImages] = useState(() => loadTuned(withDefaults(defaultImages)))

  useEffect(() => {
    saveTuned(images)
  }, [images])
  const found = slug ? findBySlug(slug) : null

  usePageMeta(found || homePage)

  // Unknown address: go back to the home page.
  useEffect(() => {
    if (slug && !found) navigate('/', { replace: true })
  }, [slug, found, navigate])

  // Opening a preset address shows that platform behind the popup.
  useEffect(() => {
    if (found) setActive(found.i)
  }, [found])

  const close = useCallback(() => navigate('/'), [navigate])
  const open = (pf, s) => navigate(`/${slugFor(pf, s)}/`)

  const pick = (i) => {
    setActive(i)
    document.getElementById('formats')?.scrollIntoView({ behavior: 'smooth' })
  }

  const goPro = () => {
    close()
    setTimeout(() => document.getElementById('pro')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <>
      <Nav />
      <div className="shell">
        <div className="hero" id="top">
          <HeroBg cfg={images.hero} />
          <Hero onPick={pick} />
          <PlatformCards onPick={pick} images={images} />
        </div>
      </div>
      <Formats active={active} setActive={setActive} onOpen={open} bgs={images.formatsBg} logos={images.formatsLogo} />
      <Pro />
      <Footer onPick={pick} />
      {found && <Editor key={found.path} target={{ pf: platforms[found.i], s: found.s }} onClose={close} onPro={goPro} />}
      {import.meta.env.DEV && <Tuner cfg={images} setCfg={setImages} />}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<Legal kind="privacy" />} />
      <Route path="/terms" element={<Legal kind="terms" />} />
      <Route path="/:slug" element={<Home />} />
    </Routes>
  )
}
