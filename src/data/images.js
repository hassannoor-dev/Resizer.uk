// Pictures for the hero background and the five cards.
// Put the files in the "public" folder (public/hero-bg.png, public/cards/linkedin.png, ...).
//
//   src   the file path, starting with /
//   fit   'cover' fills the frame (may crop), 'contain' shows the whole picture
//   zoom  1 is normal, 1.5 is 50% bigger (zooms toward the x/y point)
//   x, y  the focus point from 0 to 100 (50 is the center, y: 0 is the top)
//
// Tip: run the site with `npm run dev`, click "Tune images" at the bottom left,
// adjust with sliders, then "Copy settings" and paste over this file.

// See the notes in the old file for what each setting does.
export const defaultImages = {
  "showLetters": false,
  "hero": {
    "src": "/hero-bg.png",
    "fit": "cover",
    "zoom": 1,
    "x": 50,
    "y": 50
  },
  "cards": {
    "linkedin": {
      "src": "/cards/linkedin.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50
    },
    "facebook": {
      "src": "/cards/facebook.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50
    },
    "youtube": {
      "src": "/cards/youtube.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50
    },
    "instagram": {
      "src": "/cards/instagram.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50
    },
    "x": {
      "src": "/cards/x.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50
    }
  },
  "formatsBg": {
    "linkedin": {
      "src": "/formats/linkedin.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50,
      "opacity": 1
    },
    "facebook": {
      "src": "/formats/facebook.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50,
      "opacity": 1
    },
    "youtube": {
      "src": "/formats/youtube.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50,
      "opacity": 1
    },
    "instagram": {
      "src": "/formats/instagram.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50,
      "opacity": 1
    },
    "x": {
      "src": "/formats/x.png",
      "fit": "cover",
      "zoom": 1,
      "x": 50,
      "y": 50,
      "opacity": 1
    }
  },
  "formatsLogo": {
    "linkedin": {
      "src": "/logos/linkedin.png",
      "size": 114,
      "x": 5,
      "y": 7,
      "tilt": 0
    },
    "facebook": {
      "src": "/logos/facebook.png",
      "size": 120,
      "x": 5,
      "y": 7,
      "tilt": 0
    },
    "youtube": {
      "src": "/logos/youtube.png",
      "size": 120,
      "x": 5,
      "y": 7,
      "tilt": 0
    },
    "instagram": {
      "src": "/logos/instagram.png",
      "size": 108,
      "x": 5,
      "y": 7,
      "tilt": 0
    },
    "x": {
      "src": "/logos/x.png",
      "size": 96,
      "x": 5,
      "y": 7,
      "tilt": 0
    }
  }
}
