// TIP: runs on Cloudflare, not in the browser. The secret key comes from environment variables (step 4).
export async function onRequestPost({ request, env }) {
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

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_SECRET_KEY, Prefer: 'return=minimal' },
    body: JSON.stringify({ email }),
  })

  // TIP: 409 means this email is already on the list, which counts as success
  if (res.ok || res.status === 409) return reply({ ok: true })
  return reply({ error: 'failed' }, 502)
}