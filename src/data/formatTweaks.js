// Make a format's panel taller or wider than its true shape.
//   w: width multiplier   h: height multiplier   (1 = true shape, 2 = twice as big)
// Key is "platformId:Format name".
export const formatTweaks = {
  'linkedin:Profile banner': { h: 1.8 },
  'youtube:Channel banner': { w: 1.5 },
    'facebook:Cover photo': { h: 1.3, w: 1.3 },
  'x:Header': { h: 1.5 },
}
