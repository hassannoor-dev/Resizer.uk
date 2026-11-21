// TIP: runs on Cloudflare, not in the browser. The secret key comes from environment variables, never from your code.
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/waitlist') {
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } })
      }
      return joinWaitlist(request, env)
    }

    // TIP: everything else (your pages, images, CSS) is served as normal
    return env.ASSETS.fetch(request)
  },
}

async function joinWaitlist(request, env) {
  const reply = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

  let data
  try {
    data = await request.json()
  } catch {
    return reply({ error: 'bad request' }, 400)
  }

  const email = String(data.email || '').trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply({ error: 'invalid email' }, 400)
  }

  // TIP: temporary debugging. Says whether the two settings reached the Worker (true/false only, never the values).
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    return reply({ error: 'missing settings', hasUrl: Boolean(env.SUPABASE_URL), hasKey: Boolean(env.SUPABASE_SECRET_KEY) }, 500)
  }

  let res
  try {
    res = await fetch(`${env.SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_SECRET_KEY, Prefer: 'return=minimal' },
      body: JSON.stringify({ email }),
    })
  } catch (e) {
    return reply({ error: 'could not reach supabase', detail: String(e).slice(0, 200) }, 502)
  }

  // TIP: 409 means this email is already on the list, which counts as success
  if (res.ok || res.status === 409) return reply({ ok: true })

  // TIP: temporary debugging. Supabase's own error message. Delete the status/detail part once it works.
  return reply({ error: 'failed', status: res.status, detail: (await res.text()).slice(0, 300) }, 502)
}