import { createElement } from 'react'
import { FaLinkedin, FaFacebook, FaYoutube, FaInstagram, FaXTwitter } from 'react-icons/fa6'
import PlatformIcon from '../components/PlatformIcon.jsx'
import { platformData } from './platformData.js'

export { SITE_NAME, SITE_URL, CONTACT_EMAIL, WAITLIST_URL } from './platformData.js'

const fallbacks = { linkedin: FaLinkedin, facebook: FaFacebook, youtube: FaYoutube, instagram: FaInstagram, x: FaXTwitter }

// Each platform's Icon is your custom icon when set in data/icons.js, or the default logo.
export const platforms = platformData.map((p) => ({
  ...p,
  Icon: (props) => createElement(PlatformIcon, { id: p.id, Fallback: fallbacks[p.id], ...props }),
}))
