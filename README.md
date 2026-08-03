# hang

Designer-side mobile app for **hang** — pairing interior/spatial designers with physical-media
artists who take commissions. Designers swipe through original work; a right-swipe sends their
project brief with a note; the artist has to like back before chat unlocks.

Built from the "Gallery Wall" design handoff as a React + Vite mobile-web app, rendered inside an
iPhone frame.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static bundle in dist/
npm run preview  # serve the built bundle
```

`dist/` is a plain static site — it can be dropped on any static host.

## Screens

Onboarding (3 steps) · Discover (swipe deck) · Filters (top sheet) · Artist profile · Note composer ·
Match overlay · Matches · Chat · Home/News · My spaces.

## Layout

```
src/
  theme.ts            design tokens: colours, type, frame palette, shadows
  data/artists.ts     artist dataset + style/medium vocabularies
  state/store.tsx     all app state and actions, via context
  components/         Frame, Chip, Wordmark, TabBar, IOSDevice
  screens/            one file per screen
public/fonts*         self-hosted Space Grotesk, Instrument Sans, Space Mono, Cormorant Garamond
```

Styling is inline, mirroring how the handoff expressed it, so values map 1:1 to the spec. Shared
values live in `theme.ts` rather than being repeated.

### The frame motif

Framed elements are square-cornered: a frame rail with an inset dark ring, an optional mat with an
inset top shadow, artwork inside. `components/Frame.tsx` implements both the full-size frame and the
58px thumbnail (frame only, no mat). The frame palette rotates per artist through oak, ebony, gilt,
whitewash and walnut.

## What is still prototype

The deck is driven by a local dataset, and artist behaviour is scripted — `likesBack` decides
whether a like is returned after 1.4s, and chat replies cycle through a fixed list. Artwork is a
CSS stripe placeholder labelled "DROP ARTWORK"; production replaces it with artist uploads.

Wiring this to a backend means replacing `state/store.tsx` and `data/artists.ts` with real artist
accept/decline, real-time chat, and push on match and message. The screens do not need to change.

## Fonts

The four Google Fonts families are vendored under `public/fonts/` (latin + latin-ext) and declared
in `public/fonts.css`, so the app has no runtime CDN dependency and renders identically offline.

## Design reference

`design/` holds the handoff and the canonical prototype the app was built from. The `.dc.html`
prototype needs the Claude Design runtime to be interactive, but its markup and the `Component`
class at the bottom read as the specification.
