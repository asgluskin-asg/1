export type Piece = {
  title: string
  year: string
  dimensions: string
  tint: readonly [string, string]
}

export type Artist = {
  id: string
  name: string
  location: string
  medium: string
  mediumKey: string
  styles: string[]
  min: number
  max: number
  licensing: boolean
  ships: boolean
  /** Prototype-only: scripts whether the artist accepts. Production reads this from the backend. */
  likesBack: boolean
  lead: number
  scale: string
  bio: string
  tint: readonly [string, string]
  pieces: Piece[]
  opener: string
  replies: string[]
}

export const STYLES = [
  'Abstract',
  'Figurative',
  'Minimal',
  'Botanical',
  'Textural',
  'Sculptural',
  'Geometric',
  'Textile',
  'Landscape',
  'Pattern',
]

export const MEDIUMS = ['Painting', 'Photography', 'Print', 'Paper', 'Ceramic', 'Textile', 'Mixed']

export const ARTISTS: Artist[] = [
  {
    id: 'ilse',
    name: 'Ilse Bräuer',
    location: 'Berlin · ships worldwide',
    medium: 'Cyanotype on cotton rag',
    mediumKey: 'Paper',
    styles: ['Abstract', 'Minimal'],
    min: 1200,
    max: 3000,
    licensing: true,
    ships: true,
    likesBack: true,
    lead: 8,
    scale: 'Up to 60 × 90 in',
    bio: 'I print with sunlight, so no two pieces land the same way. Most of my commissions are for spaces that get flat afternoon light and need something to hold the wall without shouting.',
    tint: ['#8FA3B8', '#7D93AB'],
    pieces: [
      { title: 'Tidal Register No. 4', year: '2025', dimensions: '48 × 66 in', tint: ['#8FA3B8', '#7C92AA'] },
      { title: 'Shore Grid', year: '2024', dimensions: '30 × 40 in', tint: ['#A8B6C4', '#93A4B5'] },
      { title: 'Nine Days of Cloud', year: '2025', dimensions: '60 × 90 in', tint: ['#7A8CA0', '#6B7D91'] },
    ],
    opener:
      "Thanks for the note — a Sausalito lobby with afternoon light is close to ideal for cyanotype. What's the wall height?",
    replies: [
      'Eight weeks is comfortable if we lock the size by the end of the month.',
      'I can do a set of three that reads as one piece across the wall.',
      "I'll send dye samples on the cotton rag so you can hold them against your finishes.",
    ],
  },
  {
    id: 'hollis',
    name: 'Hollis Beam',
    location: 'Marfa, TX · ships worldwide',
    medium: 'Large-format photography',
    mediumKey: 'Photography',
    styles: ['Minimal', 'Landscape'],
    min: 2000,
    max: 6000,
    licensing: true,
    ships: true,
    likesBack: true,
    lead: 5,
    scale: 'Up to 40 × 50 in',
    bio: "Field cameras, long exposures, mostly high desert. I print archival pigment in editions of seven and I'm happy to shoot something new for a project if the site earns it.",
    tint: ['#C4B49E', '#B5A48D'],
    pieces: [
      { title: 'Presidio, 5:40am', year: '2025', dimensions: '40 × 50 in', tint: ['#C9BAA4', '#B9A992'] },
      { title: 'Two Fences', year: '2024', dimensions: '30 × 38 in', tint: ['#D2C5B1', '#C0B29C'] },
      { title: 'Dust Column', year: '2023', dimensions: '24 × 30 in', tint: ['#B3A48F', '#A3947F'] },
    ],
    opener:
      'Read your brief — twelve rooms plus a lobby is a real project. Are you after one series repeated, or something different per room?',
    replies: [
      'Editions of seven, so twelve rooms works if we mix two series.',
      'I could shoot the coastline north of you and keep it in the same register.',
      "Licensing for print and web is included; I'd want a credit line.",
    ],
  },
  {
    id: 'nadia',
    name: 'Nadia Okonjo',
    location: 'Lagos · ships worldwide',
    medium: 'Ink and gouache on paper',
    mediumKey: 'Paper',
    styles: ['Botanical', 'Pattern'],
    min: 800,
    max: 2500,
    licensing: true,
    ships: true,
    likesBack: true,
    lead: 4,
    scale: 'Up to 22 × 30 in',
    bio: 'Plants I grew up around, drawn at a scale they never actually reach. Small works, framed close, meant to be looked at from two feet away rather than across a room.',
    tint: ['#A8B79A', '#95A788'],
    pieces: [
      { title: 'Ixora, Fourteen Ways', year: '2025', dimensions: '22 × 30 in', tint: ['#A9B89B', '#96A889'] },
      { title: 'Night Garden II', year: '2024', dimensions: '18 × 24 in', tint: ['#8D9C81', '#7C8C71'] },
      { title: 'Cassava Study', year: '2025', dimensions: '16 × 20 in', tint: ['#B7C4A9', '#A4B296'] },
    ],
    opener:
      'Guest rooms are where small work earns its keep. Happy to do a suite of twelve variations so no two rooms repeat.',
    replies: [
      'Twelve variations on one plant — same palette, different composition.',
      'Four weeks per batch of six, framed or unframed.',
      "I'd want to see your finish samples before I commit to the greens.",
    ],
  },
  {
    id: 'junko',
    name: 'Junko Arai',
    location: 'Kyoto · ships worldwide',
    medium: 'Hand-thrown ceramic wall relief',
    mediumKey: 'Ceramic',
    styles: ['Sculptural', 'Textural'],
    min: 3000,
    max: 7000,
    licensing: false,
    ships: true,
    likesBack: false,
    lead: 14,
    scale: 'Modular, up to 8 ft wide',
    bio: 'Unglazed stoneware, thrown and cut, hung as modules. The pieces change with the light through the day, which is either the whole point or a problem, depending on the room.',
    tint: ['#C9BCA9', '#B8AA96'],
    pieces: [
      { title: 'Kiln Notes, Set of 9', year: '2025', dimensions: '72 × 40 in', tint: ['#CABDAA', '#B9AB97'] },
      { title: 'Slip Wall', year: '2024', dimensions: '40 × 40 in', tint: ['#D6CBBA', '#C3B7A4'] },
      { title: 'Unglazed III', year: '2023', dimensions: '30 × 60 in', tint: ['#BCAE9A', '#AA9C88'] },
    ],
    opener: '',
    replies: [],
  },
  {
    id: 'tomas',
    name: 'Tomás Quiroga',
    location: 'Mexico City · ships worldwide',
    medium: 'Oil on linen',
    mediumKey: 'Painting',
    styles: ['Figurative', 'Abstract'],
    min: 4000,
    max: 9000,
    licensing: false,
    ships: true,
    likesBack: false,
    lead: 12,
    scale: 'Up to 78 × 96 in',
    bio: 'Large figures, thin paint, a lot of scraping back. I take two or three commissions a year and I like knowing the room before I start.',
    tint: ['#B08272', '#9E7160'],
    pieces: [
      { title: 'Bañistas', year: '2025', dimensions: '78 × 96 in', tint: ['#B18373', '#9F7261'] },
      { title: 'Sobremesa', year: '2024', dimensions: '54 × 60 in', tint: ['#C09584', '#AC8271'] },
      { title: 'Study for a Door', year: '2024', dimensions: '36 × 48 in', tint: ['#9C6F5E', '#8B604F'] },
    ],
    opener: '',
    replies: [],
  },
  {
    id: 'marguerite',
    name: 'Marguerite Sowa',
    location: 'Lisbon · ships in EU + US',
    medium: 'Plaster relief and encaustic',
    mediumKey: 'Mixed',
    styles: ['Textural', 'Minimal'],
    min: 2500,
    max: 5000,
    licensing: true,
    ships: true,
    likesBack: true,
    lead: 9,
    scale: 'Up to 48 × 72 in',
    bio: 'Lime plaster, pigment, beeswax — surfaces that look like walls that have been somewhere. Tonal work, almost no colour, built up over weeks.',
    tint: ['#CFC6B7', '#BEB4A4'],
    pieces: [
      { title: 'Rendered No. 12', year: '2025', dimensions: '48 × 72 in', tint: ['#D0C7B8', '#BFB5A5'] },
      { title: 'Wax Field', year: '2024', dimensions: '36 × 36 in', tint: ['#C4B9A8', '#B2A796'] },
      { title: 'Two Repairs', year: '2025', dimensions: '24 × 48 in', tint: ['#DAD2C4', '#C7BEAF'] },
    ],
    opener:
      "A calm coastal palette is basically what I already work in. Tell me about the plaster or paint you're specifying and I'll pitch tones against it.",
    replies: [
      'Nine weeks for a 48 × 72, less if we go smaller.',
      "I'd keep it tonal — one warm grey, one bone.",
      "Encaustic doesn't love direct sun. Where does the light come from?",
    ],
  },
  {
    id: 'dev',
    name: 'Dev Raghunathan',
    location: 'Chennai · ships worldwide',
    medium: 'Screenprint editions',
    mediumKey: 'Print',
    styles: ['Geometric', 'Pattern'],
    min: 400,
    max: 1200,
    licensing: true,
    ships: true,
    likesBack: true,
    lead: 3,
    scale: 'Up to 28 × 40 in',
    bio: 'Hand-pulled prints, four to six colours, mostly built from temple floor patterns. Editions are large enough that a whole floor of rooms is easy to fill.',
    tint: ['#C79A6E', '#B4885D'],
    pieces: [
      { title: 'Kolam Set A', year: '2025', dimensions: '28 × 40 in', tint: ['#C89B6F', '#B5895E'] },
      { title: 'Six Colour Repeat', year: '2024', dimensions: '20 × 28 in', tint: ['#D5AC83', '#C29A71'] },
      { title: 'Threshold', year: '2025', dimensions: '24 × 24 in', tint: ['#B58A62', '#A37851'] },
    ],
    opener:
      'Twelve rooms is a nice run — I can do three designs, four rooms each, all in the same ink set. Three weeks.',
    replies: [
      'Three weeks for the full run, framed adds two.',
      "Commercial licensing is fine, I'll send the agreement.",
      'Want me to pull a test in your colourway first?',
    ],
  },
  {
    id: 'elsie',
    name: 'Elsie Warr',
    location: 'Glasgow · ships worldwide',
    medium: 'Woven tapestry, natural dye',
    mediumKey: 'Textile',
    styles: ['Textile', 'Textural'],
    min: 5000,
    max: 12000,
    licensing: false,
    ships: true,
    likesBack: false,
    lead: 20,
    scale: 'Up to 9 × 12 ft',
    bio: "Floor loom, wool and linen, dyed with what grows near the studio. A large piece takes months, and it will absorb a room's noise as much as decorate it.",
    tint: ['#A9A08C', '#98907C'],
    pieces: [
      { title: 'Long Weather', year: '2024', dimensions: '108 × 144 in', tint: ['#AAA18D', '#99917D'] },
      { title: 'Madder Ground', year: '2025', dimensions: '60 × 84 in', tint: ['#B8A895', '#A69682'] },
      { title: 'Small Fell', year: '2023', dimensions: '36 × 48 in', tint: ['#9A9280', '#89816F'] },
    ],
    opener: '',
    replies: [],
  },
]

export const artistById = (id: string | null) => ARTISTS.find((a) => a.id === id)

export const artistIndex = (id: string) => Math.max(0, ARTISTS.findIndex((a) => a.id === id))
