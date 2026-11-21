// TIP: one entry per preset. The key is "platformId:Preset name", same style as formatTweaks.js.
//   hook   = one catchy line      tips   = exactly 3 short tips
//   avoid  = one thing not to do  editor = which Resizer setting helps
// Keep every line short, the book pages are small.
export const guides = {
  // ---------- LinkedIn ----------
  'linkedin:Profile picture': {
    hook: 'Your first handshake, in a circle.',
    tips: [
      'It shows as a circle, so keep your face in the middle.',
      'Pick a bright close-up where your face fills the frame.',
      'Plain backgrounds stay sharp at tiny sizes.',
    ],
    avoid: 'Full-body shots and busy backgrounds. They turn into a smudge.',
    editor: 'Use "Fill frame" so your photo is cropped to the exact square.',
  },
  'linkedin:Profile banner': {
    hook: 'A wide billboard above your name.',
    tips: [
      'Your profile photo covers the lower left, so keep that spot clear.',
      'Phones crop the edges, so keep the important bits central.',
      'Big, short text only. The banner is 4 times wider than tall.',
    ],
    avoid: 'Small print. It is unreadable once the banner shrinks.',
    editor: 'Try "Fit whole photo" with Blur to fill the sides without cropping.',
  },
  'linkedin:Company logo': {
    hook: 'Small square, big first impression.',
    tips: [
      'Centre the logo and leave breathing room around it.',
      'Use a clean background that contrasts with your logo.',
      'It appears tiny in search, so skip thin lines and small text.',
    ],
    avoid: 'Logos jammed against the edge. Give them padding.',
    editor: 'Use "Fit whole photo" with Solid color to pad your logo.',
  },
  'linkedin:Post image': {
    hook: 'Stop the scroll.',
    tips: [
      'One clear subject beats a busy collage.',
      'Big, short text reads well on phones.',
      'Bright, contrasting colours stand out in the feed.',
    ],
    avoid: 'Tiny text. Most people scroll on their phone.',
    editor: 'Use "Fill frame" to get exactly this size.',
  },

  // ---------- Facebook ----------
  'facebook:Profile picture': {
    hook: 'A tiny circle with a big job.',
    tips: [
      'It shows as a circle, so keep your face centred.',
      'Close-ups beat group shots.',
      'Good light matters more than fancy edits.',
    ],
    avoid: 'Text or logos near the edges. The circle trims the corners.',
    editor: 'Use "Fill frame" for a clean square crop.',
  },
  'facebook:Cover photo': {
    hook: 'Your page\'s front door.',
    tips: [
      'Phones show it taller than computers, so edges get cut. Keep key items central.',
      'Your profile picture sits at the lower left, so leave it clear.',
      'A wide, simple image works best.',
    ],
    avoid: 'Text close to the edges.',
    editor: 'Try "Fit whole photo" with Blur if your photo is not wide enough.',
  },
  'facebook:Post image': {
    hook: 'Link previews love this shape.',
    tips: [
      'It is the shape Facebook uses for link previews.',
      'Keep text short and in the middle.',
      'Bright, high-contrast images get noticed.',
    ],
    avoid: 'Cramming in text. Less reads faster.',
    editor: 'Use "Fill frame" to get exactly this size.',
  },
  'facebook:Story': {
    hook: 'Full-screen and thumb-sized.',
    tips: [
      'Keep faces and text away from the top and bottom, where buttons sit.',
      'Shoot tall. The frame is 9:16.',
      'Bold, simple designs read fastest.',
    ],
    avoid: 'Key text in the very top or bottom strip.',
    editor: 'Wide photo? Use "Fit whole photo" with Blur to fill the tall frame.',
  },

  // ---------- YouTube ----------
  'youtube:Thumbnail': {
    hook: 'You have a split second to win the click.',
    tips: [
      'The video length badge covers the bottom-right corner, so keep it clear.',
      'Use big, bold text of three words or fewer.',
      'Expressive faces and high contrast get clicks.',
    ],
    avoid: 'Small details. Thumbnails are tiny in lists.',
    editor: 'Use "Fill frame", and pick JPG if the file is too big.',
  },
  'youtube:Channel banner': {
    hook: 'One banner, every screen.',
    tips: [
      'Keep the important content in the centre. Phones and computers show only a middle strip.',
      'The safe area is about 1546×423 px, centred.',
      'Use the wide edges for background only.',
    ],
    avoid: 'Your name or logo near the edges. It will get cut.',
    editor: 'Use "Fill frame", then drag the photo to centre your subject.',
  },
  'youtube:Profile picture': {
    hook: 'Small circle, instant recognition.',
    tips: [
      'It shows as a circle, so keep everything central.',
      'Simple logos or faces work best.',
      'Match your banner colours so the channel feels like one brand.',
    ],
    avoid: 'Detailed images. They blur at small sizes.',
    editor: 'Use "Fill frame" for a clean square.',
  },
  'youtube:Shorts cover': {
    hook: 'Tall, fast and thumb-friendly.',
    tips: [
      'Keep the main action in the middle.',
      'Titles and buttons cover the bottom, so keep text higher up.',
      'Bold, simple frames are easiest to read.',
    ],
    avoid: 'Small text near the bottom edge.',
    editor: 'Use "Fill frame" to get the full 9:16 shape.',
  },

  // ---------- Instagram ----------
  'instagram:Profile picture': {
    hook: 'Your face, your brand, one circle.',
    tips: [
      'It shows as a circle, so keep your face in the middle.',
      'A bright, simple background makes you pop.',
      'Use the same picture on every platform so people recognise you.',
    ],
    avoid: 'Anything important near the corners. The circle cuts them.',
    editor: 'Use "Fill frame" for a clean square.',
  },
  'instagram:Square post': {
    hook: 'The classic feed shape.',
    tips: [
      'Keep your subject central. The profile grid can crop the edges.',
      'Bright, clear photos win the feed.',
      'Add text only if it is big and short.',
    ],
    avoid: 'Important details in the corners.',
    editor: '"Fit whole photo" with Blur gives a clean square without cropping.',
  },
  'instagram:Portrait post': {
    hook: 'Take up more of the screen.',
    tips: [
      'The 4:5 shape fills more of the feed than a square.',
      'Keep your subject central. Grid previews trim the sides.',
      'Leave a little room around faces.',
    ],
    avoid: 'Key text right at the top or bottom edge.',
    editor: 'Use "Fill frame" to get exactly 4:5.',
  },
  'instagram:Story or Reel': {
    hook: 'Full-screen and fast.',
    tips: [
      'Buttons and captions cover the top and bottom, so keep key items central.',
      'Shoot tall. The frame is 9:16.',
      'Short, bold text reads best.',
    ],
    avoid: 'Text at the very bottom. Captions will cover it.',
    editor: 'Wide photo? Use "Fit whole photo" with Blur to fill the frame.',
  },

  // ---------- X ----------
  'x:Profile picture': {
    hook: 'Small circle, big presence.',
    tips: [
      'It shows as a circle, so keep your face central.',
      'Simple and high-contrast reads best when tiny.',
      'Pick a shot with good light.',
    ],
    avoid: 'Logos with thin lines or small text.',
    editor: 'Use "Fill frame" for a clean square.',
  },
  'x:Header': {
    hook: 'A wide stage for your brand.',
    tips: [
      'The shape is three times wider than tall.',
      'Your profile picture overlaps the lower left, so keep it clear.',
      'Screens crop the header differently, so centre what matters.',
    ],
    avoid: 'Small text. It gets cropped or shrunk.',
    editor: '"Fit whole photo" with Blur works well for photos that are not wide.',
  },
  'x:Post image': {
    hook: 'A 16:9 view that fills the timeline.',
    tips: [
      'Keep your subject central. Timelines can crop the edges.',
      'Bold, simple visuals work best.',
      'Use sharp, high-quality photos.',
    ],
    avoid: 'Tiny text.',
    editor: 'Use "Fill frame" to get exactly this size.',
  },
}

// TIP: shown for any preset you add later that has no entry above
export const fallbackGuide = {
  hook: 'Get the size right the first time.',
  tips: [
    'Keep your subject in the middle of the frame.',
    'Keep important text away from the edges.',
    'Use a sharp, bright photo.',
  ],
  avoid: 'Tiny text and details near the edges.',
  editor: 'Use "Fill frame" for an exact crop.',
}