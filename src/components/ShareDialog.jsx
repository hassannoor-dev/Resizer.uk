import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaWhatsapp, FaXTwitter, FaLinkedin, FaFacebook, FaTiktok, FaLink, FaEllipsis, FaXmark } from 'react-icons/fa6'
import { SITE_NAME, SITE_URL } from '../data/platforms'
import '../share.css'

// Until you set your real domain in platformData.js, share the address the site is running on.
const siteUrl = () => (SITE_URL.includes('example.com') ? window.location.origin : SITE_URL) + '/'
const enc = encodeURIComponent

export default function ShareDialog({ onClose }) {
  const url = siteUrl()
  const text = `${SITE_NAME}: a free image resizer for LinkedIn, Facebook, YouTube, Instagram and X. No signup, and your photos stay on your device.`
  const [note, setNote] = useState('')
  const closeRef = useRef(null)
  const inputRef = useRef(null)
  const canShare = typeof navigator !== 'undefined' && Boolean(navigator.share)

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus()
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

  const say = (msg) => {
    setNote(msg)
    setTimeout(() => setNote(''), 3500)
  }

  const copy = async (msg) => {
    try {
      await navigator.clipboard.writeText(url)
      say(msg)
    } catch {
      inputRef.current?.select()
      say('Press Ctrl+C (or Cmd+C) to copy the link.')
    }
  }

  const links = [
    { name: 'WhatsApp', Icon: FaWhatsapp, color: '#25D366', href: `https://wa.me/?text=${enc(`${text} ${url}`)}` },
    { name: 'X', Icon: FaXTwitter, color: '#14171A', href: `https://x.com/intent/post?text=${enc(text)}&url=${enc(url)}` },
    { name: 'LinkedIn', Icon: FaLinkedin, color: '#0A66C2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: 'Facebook', Icon: FaFacebook, color: '#1877F2', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ]

  return createPortal(
    <div className="share-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="share" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <button ref={closeRef} className="share-close" onClick={onClose} aria-label="Close"><FaXmark /></button>
        <h3 id="share-title">Share {SITE_NAME} with a friend</h3>
        <p className="share-sub">Know someone who resizes photos for social media? Send them the link.</p>

        <div className="share-link">
          <input ref={inputRef} readOnly value={url} aria-label="Site link" onFocus={(e) => e.target.select()} />
          <button className="btn" onClick={() => copy('Link copied.')}><FaLink /> Copy</button>
        </div>

        <div className="share-grid">
          {links.map((l) => (
            <a key={l.name} className="share-item" href={l.href} target="_blank" rel="noopener noreferrer">
              <span className="share-ic" style={{ color: l.color }}><l.Icon /></span>
              {l.name}
            </a>
          ))}
          {/* TikTok has no web share link, so we copy the link for the person to paste. */}
          <button className="share-item" onClick={() => copy('Link copied. Paste it into a TikTok post, message or your bio.')}>
            <span className="share-ic" style={{ color: '#111' }}><FaTiktok /></span>
            TikTok
          </button>
          {canShare && (
            <button className="share-item" onClick={() => navigator.share({ title: SITE_NAME, text, url }).catch(() => {})}>
              <span className="share-ic"><FaEllipsis /></span>
              More
            </button>
          )}
        </div>
        <p className="share-note" aria-live="polite">{note}</p>
      </div>
    </div>,
    document.body
  )
}
