import { SITE_NAME, platformData } from './platformData.js'

export const slugFor = (pf, s) => `${pf.id}-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-resizer`

export const homePage = {
  path: '/',
  title: `Resize any image for any platform | ${SITE_NAME}`,
  description:
    'Free image resizer with ready-made sizes for LinkedIn, Facebook, YouTube, Instagram and X. No signup, and your photos never leave your device.',
}

const presetPages = platformData.flatMap((pf, i) =>
  pf.presets.map((s) => ({
    path: `/${slugFor(pf, s)}/`,
    i,
    s,
    title: `${pf.name} ${s.name} Resizer (${s.w}×${s.h}) | ${SITE_NAME}`,
    description: `Resize any photo to the ${pf.name} ${s.name.toLowerCase()} size of ${s.w}×${s.h} px. Free, no signup, and your photo never leaves your device.`,
  }))
)

export const legalPages = [
  { path: '/privacy/', title: `Privacy Policy | ${SITE_NAME}`, description: `How ${SITE_NAME} handles your photos and data.` },
  { path: '/terms/', title: `Terms of Use | ${SITE_NAME}`, description: `The terms for using ${SITE_NAME}.` },
]

export const pages = [homePage, ...presetPages, ...legalPages]
export const findBySlug = (slug) => presetPages.find((p) => p.path === `/${slug}/`)
