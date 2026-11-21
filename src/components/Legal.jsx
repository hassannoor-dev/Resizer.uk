import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa6'
import Footer from './Footer'
import Nav from './Nav'
import usePageMeta from '../utils/usePageMeta'
import { legalPages } from '../data/meta.js'
import { SITE_NAME, CONTACT_EMAIL } from '../data/platforms'

function Privacy() {
  return (
    <>
      <h2>The short version</h2>
      <p>The photos you resize never leave your device. They are processed inside your browser and are not uploaded to our servers.</p>
      <h2>Information we collect</h2>
      <p>We have no user accounts. If you join the Pro waitlist, we collect the email address you enter and use it only to tell you about Pro. Our hosting provider may keep standard server logs, such as IP address and browser type, for security and performance.</p>
      <h2>Cookies and advertising</h2>
      <p>We may show ads from third-party networks such as Google AdSense. These partners may use cookies or similar technologies to show ads based on your visits to this and other websites. You can manage personalised advertising in your Google ad settings. If our practices change, we will update this page.</p>
      <h2>Your choices</h2>
      <p>To be removed from the waitlist or to ask about your data, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      <h2>Children</h2>
      <p>{SITE_NAME} is not directed at children under 13.</p>
      <h2>Changes</h2>
      <p>When we launch Pro, with accounts, AI processing and payments, we will update this policy to cover them.</p>
    </>
  )
}

function Terms() {
  return (
    <>
      <h2>Using the service</h2>
      <p>{SITE_NAME} is a free tool that resizes images in your browser. By using it you agree to these terms.</p>
      <h2>Your photos</h2>
      <p>You are responsible for the photos you use and must have the right to edit and share them. Do not use the service for anything unlawful.</p>
      <h2>Recommended sizes</h2>
      <p>Sizes come from public platform guidance and change over time. We try to keep them accurate but cannot guarantee that a platform will accept or display your image as expected.</p>
      <h2>No warranty</h2>
      <p>The service is provided as is, without warranties of any kind. To the extent the law allows, we are not liable for any loss that arises from its use.</p>
      <h2>Trademarks</h2>
      <p>LinkedIn, Facebook, YouTube, Instagram, X and other names are trademarks of their owners. {SITE_NAME} is not affiliated with or endorsed by them.</p>
      <h2>Changes and contact</h2>
      <p>We may update these terms, and continued use means you accept the updated terms. Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </>
  )
}

export default function Legal({ kind }) {
  const navigate = useNavigate()
  const page = legalPages.find((p) => p.path === `/${kind}/`)
  usePageMeta(page)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Nav />
      <div className="shell slim" />
      <main className="legal">
        <Link to="/" className="back"><FaArrowLeft /> Back to {SITE_NAME}</Link>
        <h1>{kind === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}</h1>
        <p className="muted">Last updated November 2026</p>
        {kind === 'privacy' ? <Privacy /> : <Terms />}
      </main>
      <Footer onPick={() => navigate('/')} />
    </>
  )
}
