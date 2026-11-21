import fs from 'node:fs'
import path from 'node:path'
import { SITE_URL } from '../src/data/platformData.js'
import { pages } from '../src/data/meta.js'

const dist = path.resolve('dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// TIP: replaces a tag that already exists in index.html. If it's missing, adds it before </head>. This is what stops duplicate tags.
// The () => tag form stops characters like $ in a title from being treated as special.
const setTag = (html, pattern, tag) =>
  pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', () => `    ${tag}\n  </head>`)

for (const p of pages) {
  const url = SITE_URL + p.path
  const title = esc(p.title)
  const desc = esc(p.description)

  let html = template
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${desc}" />`)
  html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}" />`)
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
  html = setTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
  html = setTag(html, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}" />`)
  // TIP: text for crawlers that don't run JavaScript, now different on every page
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, () => `<noscript><h1>${title}</h1><p>${desc}</p></noscript>`)

  const out = p.path === '/' ? path.join(dist, 'index.html') : path.join(dist, p.path, 'index.html')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, html)
}

const urls = pages.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`).join('\n')
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`)
console.log(`Prerendered ${pages.length} pages, sitemap.xml and robots.txt`)