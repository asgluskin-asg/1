export const color = {
  canvas: '#E7E1D6',
  app: '#F4F0E8',
  surface: '#FBF8F2',
  surfaceAlt: '#F0EADF',
  surfaceAlt2: '#EBE4D8',
  mat: '#F4EFE6',
  ink: '#2A241E',
  inkHover: '#443B32',
  onInk: '#F7F3EB',
  text2: '#6E645A',
  text2b: '#7A7064',
  text3: '#8B8175',
  text3b: '#9A9084',
  chipText: '#5D544B',
  accent: '#B45A3C',
  accentHover: '#9C4A2E',
  onAccent: '#FDF8F3',
  likeBorder: '#6E9A78',
  likeFill: 'rgba(40,80,52,0.42)',
  likeText: '#DFF0E2',
  passBorder: '#C98B76',
  passFill: 'rgba(110,50,32,0.42)',
  passText: '#FBEAE3',
} as const

export const hairline = (a: number) => `rgba(42,36,30,${a})`

export const font = {
  display: "'Space Grotesk', sans-serif",
  body: "'Instrument Sans', system-ui, sans-serif",
  mono: "'Space Mono', monospace",
  brand: "'Cormorant Garamond', serif",
} as const

/** [frame, mat] — rotates per artist. */
export const FRAMES: ReadonlyArray<readonly [string, string]> = [
  ['#C4AE8C', '#FBF8F2'],
  ['#33291F', '#F4EFE6'],
  ['#B08D57', '#FBF8F2'],
  ['#E9E2D4', '#FFFFFF'],
  ['#6B4E37', '#F4EFE6'],
]

export const shadow = {
  card: '0 10px 30px rgba(42,36,30,0.16)',
  frame: '0 8px 20px rgba(42,36,30,0.16), inset 0 0 0 1px rgba(42,36,30,0.26)',
  matInset: 'inset 0 1px 4px rgba(42,36,30,0.16)',
} as const

export const easeSheet = 'cubic-bezier(0.22,0.9,0.28,1)'

export const money = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`

/** Placeholder artwork fill. Replaced by real uploads in production. */
export const artworkFill = (tint: readonly [string, string], angle: number) =>
  `repeating-linear-gradient(${angle}deg, ${tint[0]} 0 9px, ${tint[1]} 9px 18px)`
