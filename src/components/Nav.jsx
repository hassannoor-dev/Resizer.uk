import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaXmark, FaShareNodes } from 'react-icons/fa6'
import Logo from './Logo'
import ShareDialog from './ShareDialog'
import { CONTACT_EMAIL, SITE_NAME } from '../data/platforms'

const LINKS = [
  { id: 'top', label: 'Home' },
  { id: 'formats', label: 'Platforms' },
  { id: 'pro', label: 'AI fill' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const closeShare = useCallback(() => setShareOpen(false), [])
  const [current, setCurrent] = useState('top')
  const [stuck, setStuck] = useState(false)
  const onLegal = pathname.startsWith('/privacy') || pathname.startsWith('/terms')

  // Highlight the link for the section in the middle of the screen.
  useEffect(() => {
    if (onLegal) return
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onLegal])

  // Adds a shadow once the page has scrolled, so the bar reads as floating.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    const scroll = () =>
      id === 'top'
        ? window.scrollTo({ top: 0, behavior: 'smooth' })
        : document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    if (onLegal) {
      navigate('/')
      setTimeout(scroll, 120)
    } else {
      scroll()
    }
  }

  return (
    <>
    <nav className={`topbar${stuck ? ' stuck' : ''}`} aria-label="Main">
        <a href="/" className="brand" onClick={go('top')} aria-label={`${SITE_NAME} home`}>
          <Logo />
        </a>
        <span className="divider" aria-hidden="true" />
        <ul className={`links${open ? ' open' : ''}`}>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={l.id === 'top' ? '/' : `/#${l.id}`}
                onClick={go(l.id)}
                aria-current={!onLegal && current === l.id ? 'true' : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li><a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a></li>
        </ul>
        <button className="cta" onClick={() => { setOpen(false); setShareOpen(true) }} aria-haspopup="dialog">
          <span className="cta-long">Share with a friend</span>
          <span className="cta-short">Share</span>
          <i><FaShareNodes /></i>
        </button>
        <button className="menu" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <FaXmark /> : <FaBars />}
        </button>
    </nav>
    {shareOpen && <ShareDialog onClose={closeShare} />}
    </>
  )
}
