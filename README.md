Resizer

Resize any image for any platform. Pick a platform, pick a format, and get a photo at the exact size, in seconds. No signup, no watermark, and your photos never leave your device.

Live: https://resizer.uk

<!-- Add a screenshot or a short GIF here: ![Resizer](docs/screenshot.png) -->

Show Image Show Image Show Image Show Image

Why I built it

Resizing a photo for a LinkedIn banner or a YouTube thumbnail usually means opening a design suite, signing up, or uploading a personal photo to a stranger's server. I wanted the opposite: one fast page where every common size is a click away and the image is processed entirely in the browser.

Features
19 ready-made formats across LinkedIn, Facebook, YouTube, Instagram and X: profile pictures, banners and covers, thumbnails, posts, stories.
Smart resizing. Fit the whole photo or fill the frame, zoom from 25% to 300%, drag to reposition, export as PNG or JPG.
Four ways to fill empty space: blur, edge stretch, mirror, or a solid color.
Private by design. Everything runs on the Canvas API in the browser. Nothing is uploaded.
Search and browse. Search any format by name, or flip through platforms in a visual gallery where each panel is drawn in the real shape of its format.
Share with a friend dialog: WhatsApp, X, LinkedIn, Facebook, copy link, and the native share sheet on supported devices.
Responsive, with a nav that stays on screen while scrolling and reduced-motion support.
Tech stack
Area	Choice
UI	React, JSX, plain CSS with design tokens (no UI framework)
Build	Vite
Routing	React Router
Image processing	Canvas API (no image libraries)
Icons	react-icons
Hosting	Cloudflare Pages
Engineering highlights

1. Image processing with no libraries and no server. The resizer is a small pure module (src/utils/resizeImage.js). One layout() function works out where the photo sits for any mode, zoom and pan, and a render() function paints it to a canvas at the exact target resolution.

2. Fill algorithms that work at any zoom.

Blur shrinks the photo onto a tiny canvas and scales it back up. This avoids ctx.filter, which is not supported in every browser, so it looks the same everywhere.
Mirror tiles flipped copies in a full grid, so gaps on all four sides and the corners are covered when the photo is zoomed out.
Edge stretch smears the outermost pixels and fills the corners from the nearest corner pixel.

3. SEO for a single-page app, without a framework. Every format has its own URL, such as /linkedin-profile-banner-resizer/, which opens that format's popup on the same page. A build script (scripts/prerender.mjs) writes one HTML file per route with its own title, description, canonical link and Open Graph tags, and generates sitemap.xml and robots.txt. A small hook keeps the same metadata in sync during client-side navigation.

4. Data-driven UI. Platforms, sizes, icons, picture placement and per-format panel proportions live in plain config files (src/data/), so adding a platform or tweaking a layout does not touch components.

5. A development-only image tuner. A "Tune images" panel (stripped from production builds) gives live sliders for the size, position, zoom, opacity and tilt of every picture, remembers the values locally, and copies them out as code. Saved values never override the picture file paths in the config.

6. Details that matter. Dialogs close with Escape and labelled controls are used throughout. Custom logo and platform icons fall back to defaults if a file is missing, and the pictures degrade gracefully to gradients while loading.

Project structure
public/                 favicon, hero and card pictures, platform logos and icons
scripts/prerender.mjs   per-route HTML, sitemap and robots at build time
src/
  components/           Nav, Hero, PlatformCards, Formats, Editor, ShareDialog, Pro, Footer, Legal ...
  data/                 platformData, meta (routes and SEO), images, icons, formatTweaks
  utils/                resizeImage (canvas engine), imgStyle, usePageMeta, tunerStore
  *.css                 theme tokens, layout, glass and clean panel styles
Getting started
bash
git clone <this-repo-url>
cd resizer
npm install
npm run dev        # http://localhost:5173
bash
npm run build      # vite build, then the prerender step
npm run preview    # check the production build locally
Configuration

Site name, URL, contact email and the waitlist endpoint are set in src/data/platformData.js. Formats are defined in the same file. Picture settings are in src/data/images.js, custom icons in src/data/icons.js, and panel size tweaks in src/data/formatTweaks.js.

Deployment

Hosted on Cloudflare Pages: connect the repository, set the build command to npm run build and the output directory to dist. Every push to the main branch deploys automatically.

Status and roadmap

Live at https://resizer.uk. In its first 24 hours on Cloudflare's free plan, Cloudflare analytics reported roughly 1.4k visits and 2.2k requests.

Planned:

Pro: AI fill. Generate new scenery for the empty edges, behind a serverless function that holds the API key, with accounts, credits and payments through a merchant of record. A Pro waitlist is already live in the site.
End-to-end tests with Playwright.
A social share image, WebP export, HEIC support and more platforms.
Credits and legal

Built by Muhammad Hassan. GitHub: https://github.com/<your-username> · LinkedIn: https://www.linkedin.com/in/<your-handle> · Email: you@example.com

LinkedIn, Facebook, YouTube, Instagram, X and other names are trademarks of their owners. Resizer is not affiliated with or endorsed by them.
