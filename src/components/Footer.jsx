import { Link } from 'react-router-dom'
import Logo from './Logo'
import { platforms, SITE_NAME, CONTACT_EMAIL } from '../data/platforms'

export default function Footer({ onPick }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Logo tone="light" />
          <p>Resize any image for any platform.</p>
        </div>
        <nav aria-label="Platforms">
          <h4>Platforms</h4>
          {platforms.map((pf, i) => (
            <button key={pf.id} onClick={() => onPick(i)}>{pf.name}</button>
          ))}
        </nav>
        <nav aria-label="Company">
          <h4>Company</h4>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {SITE_NAME}</span>
        <span>Your photos stay on your device.</span>
      </div>
      <p className="disclaimer">
        {SITE_NAME} is not affiliated with LinkedIn, Facebook, YouTube, Instagram or X. All names are trademarks of their owners.
      </p>
    </footer>
  )
}
