// Site settings: update these before launch.
export const SITE_NAME = 'Resizer'
export const SITE_URL = 'https://resizer.uk' // your real domain, no trailing slash
export const CONTACT_EMAIL = 'hello@resizer.uk'
// Paste your free Formspree (or similar) form URL to collect waitlist emails.
export const WAITLIST_URL = ''

// Double-check every size against each platform's help page before launch. They change.
export const platformData = [
  {
    id: 'linkedin', name: 'LinkedIn', short: 'In', color: '#0A66C2',
    presets: [
      { name: 'Profile picture', w: 400, h: 400 },
      { name: 'Profile banner', w: 1584, h: 396 },
      { name: 'Company logo', w: 300, h: 300 },
      { name: 'Post image', w: 1200, h: 627 },
    ],
  },
  {
    id: 'facebook', name: 'Facebook', short: 'Fb', color: '#1877F2',
    presets: [
      { name: 'Profile picture', w: 320, h: 320 },
      { name: 'Cover photo', w: 851, h: 315 },
      { name: 'Post image', w: 1200, h: 630 },
      { name: 'Story', w: 1080, h: 1920 },
    ],
  },
  {
    id: 'youtube', name: 'YouTube', short: 'Yt', color: '#E62117',
    presets: [
      { name: 'Thumbnail', w: 1280, h: 720 },
      { name: 'Channel banner', w: 2560, h: 1440 },
      { name: 'Profile picture', w: 800, h: 800 },
      { name: 'Shorts cover', w: 1080, h: 1920 },
    ],
  },
  {
    id: 'instagram', name: 'Instagram', short: 'Ig', color: '#D62976',
    presets: [
      { name: 'Profile picture', w: 320, h: 320 },
      { name: 'Square post', w: 1080, h: 1080 },
      { name: 'Portrait post', w: 1080, h: 1350 },
      { name: 'Story or Reel', w: 1080, h: 1920 },
    ],
  },
  {
    id: 'x', name: 'X', short: 'X', color: '#14171A',
    presets: [
      { name: 'Profile picture', w: 400, h: 400 },
      { name: 'Header', w: 1500, h: 500 },
      { name: 'Post image', w: 1600, h: 900 },
    ],
  },
]
