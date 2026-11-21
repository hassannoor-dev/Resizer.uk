import { SITE_NAME } from '../data/platforms'

// The mark is your public/favicon.svg, so changing that one file updates the tab icon,
// the nav and the footer together.
export function LogoMark({ size = 36 }) {
  return <img className="logo-mark" src="/favicon.svg" width={size} height={size} alt="" aria-hidden="true" />
}

export default function Logo({ tone = 'dark' }) {
  return (
    <span className={`logo-lockup ${tone}`}>
      <LogoMark />
      <span className="logo-word">{SITE_NAME}</span>
    </span>
  )
}
