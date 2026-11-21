import { useState } from 'react'


export default function Pro() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
        try {
      // TIP: this talks to our own function (functions/api/waitlist.js), no keys in the browser
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="pro" className="pro">
      <div>
        <span className="pill">Pro, coming soon</span>
        <h2>
          AI fill for
          <br />
          perfect edges.
        </h2>
        <p>
          Instead of blur or stretch, Pro generates new scenery that continues your photo, so a square portrait
          becomes a banner that looks shot that way. Join the waitlist for early access.
        </p>
      </div>
      <form onSubmit={submit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
        />
        <button className="btn ai" disabled={status === 'sending' || status === 'done'}>
          {status === 'done' ? 'You are on the list' : 'Join the waitlist'}
        </button>
        <p className="note" aria-live="polite">
          {status === 'done' && 'Thanks! We will email you when Pro opens.'}
          {status === 'error' && 'Something went wrong. Please try again.'}
        </p>
      </form>
    </section>
  )
}
