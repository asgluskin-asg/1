# Handoff: Hang — designer × artist pairing app (designer side)

## Overview
Hang pairs interior/spatial designers with physical-media artists (painting, photography, print, ceramics, textile). Designers swipe through artwork; a right-swipe sends their project brief with a note; the artist must like back before chat unlocks. This handoff covers the complete designer-side mobile app.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing intended look and behavior, not production code to ship. The task is to **recreate these designs in the target codebase's environment** (React Native, SwiftUI, Flutter, etc.) using its established patterns. If no codebase exists yet, choose the most appropriate mobile framework (React Native + Expo is a reasonable default for a two-sided marketplace needing chat and push) and implement there.

Two prototype files:
- `Hang Prototype v2 Gallery Wall.dc.html` — **the canonical design.** Framed "gallery wall" treatment everywhere except the swipe deck.
- `Hang Prototype.dc.html` — earlier version, flat cards; reference only.
- `Hang Wordmark.dc.html` — wordmark and app-icon explorations. The chosen mark is **3b** (oak frame, Cormorant Garamond lowercase "hang"); app icon is **4a**.

Open the `.dc.html` files in a browser to interact. The template markup is inside `<x-dc>`; behavior is in the `Component` class in the same file.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interactions are final intent. Recreate pixel-perfectly. The only placeholders are the artwork images (striped gradients labeled "DROP ARTWORK") and the artist dataset — both get replaced by real data.

## Design Tokens

Colors:
- Background (app): `#F4F0E8` · Canvas/desk: `#E7E1D6`
- Surface (cards, sheets): `#FBF8F2` · Surface alt: `#F0EADF`, `#EBE4D8`, `#F4EFE6`
- Ink (primary text): `#2A241E` · Ink hover: `#443B32`
- Text secondary: `#6E645A`, `#7A7064` · Text tertiary: `#8B8175`, `#9A9084`
- Accent (terracotta): `#B45A3C` · Accent hover: `#9C4A2E`
- Like green (stamp): border `#6E9A78` on `rgba(40,80,52,0.42)` · Pass rust: border `#C98B76` on `rgba(110,50,32,0.42)`
- Hairlines: `rgba(42,36,30,0.08–0.18)`
- Frame palette (rotates per artist, [frame, mat]): oak `#C4AE8C`/`#FBF8F2`, ebony `#33291F`/`#F4EFE6`, gilt `#B08D57`/`#FBF8F2`, whitewash `#E9E2D4`/`#FFFFFF`, walnut `#6B4E37`/`#F4EFE6`

Typography:
- Display/headings: **Space Grotesk** 500 (screen titles 26px, onboarding hero 44px, card name 25px, profile name 34px)
- Body/UI: **Instrument Sans** 400–600 (body 14–16px)
- Labels/micro: **Space Mono** 400, uppercase, letter-spacing 0.10–0.22em, 8–11px
- Brand wordmark only: **Cormorant Garamond** 500 lowercase

Shape & depth:
- Radii: pills/buttons fully rounded (half height), cards 16–22px, inputs 14px. **Framed elements are square-cornered** (frames have no radius).
- Primary button: 56px tall, ink bg, cream text. Circular actions: pass/like 60px, undo 48px.
- Minimum hit target 44px everywhere.
- Card shadow: `0 10px 30px rgba(42,36,30,0.16)`. Frame shadow: `0 8px 20px rgba(42,36,30,0.16)` + `inset 0 0 0 1px rgba(42,36,30,0.26)`; mat gets `inset 0 1px 4px rgba(42,36,30,0.16)`.

Frame construction (the signature motif): outer div = frame color with 9–16px padding + inset 1px dark ring; inner div = mat color with inset top shadow; artwork inside. Small thumbnails (58px) use 4px frame, no mat.

## Screens

### 1. Onboarding (3 steps)
- **Step 0 (welcome):** framed 3b wordmark (250px wide, oak frame, "hang" 52px Cormorant, "ARTISTS × DESIGNERS" mono caption) centered top; hero "Art for the rooms you're building." 44px; sub-copy; primary CTA "Set up your space"; ghost link "Just let me look first" (skips setup).
- **Step 1 (who's sourcing):** studio name + city text inputs; multi-select style chips ("YOUR WORK LEANS"). Chips: 44px min-height pills, active = ink bg/cream text, inactive = outlined.
- **Step 2 (project):** brief textarea; budget slider $500–$15,000 (step 500, label "up to $Xk"); licensing checkbox row (24px square, terracotta when checked). CTA "Start browsing" in terracotta.
- The brief, budget, and licensing travel with every like — copy explains this.

### 2. Discover (home)
- Header: tappable "hang" logotype (Cormorant 30px) + small terracotta "NEWS" tag → opens Home/News screen. Right: "N of M artists" mono counter.
- Filter handle below header: mono hint "PULL DOWN FOR FILTERS" (or "PULL DOWN · FILTERS ON" when any filter active) + 52×4px grab bar. Tap or drag-down ≥34px opens the filter sheet.
- **Card stack:** top 3 cards rendered; behind-cards scale 0.955/0.91 and translate down 15px/30px. Card: full-bleed artwork, 22px radius, bottom gradient scrim; progress dots top (artwork cycling); name 25px + medium·price subline; "↑ PULL UP FOR PORTFOLIO" frosted pill button.
- **Gestures:** drag with rotation `dx/20` deg; release beyond ±95px commits like/pass; drag up ≥100px opens profile; tap artwork cycles portfolio pieces (dots update). "YES" / "NOT NOW" stamps fade in proportionally to drag (rotated ±9°, green/rust). Commit animation: fly out 560px with 20° rotation, 250ms ease-out.
- Action row: pass ✕ (60px, cream, rust on hover), undo ↺ (48px, outlined; restores last swiped card), like ♥ (60px, terracotta).
- Empty deck state: dashed-border card, different copy depending on whether filters caused it ("Nothing left under these filters" / reset CTA) or the deck is exhausted ("That's everyone, for now" / start over).

### 3. Filters (top sheet)
Slides down from top (300ms cubic-bezier(0.22,0.9,0.28,1)), scrim behind, rounded bottom corners 26px, max-height 84%. Contents: budget slider ("UP TO", "any" at max); STYLE chips (10 options, multi); MEDIUM chips (7, multi); WHERE segmented (Anywhere / Ships to me / US only); licensing checkbox row. Footer button shows live result count: "Show N artists". "CLEAR ALL" resets. Filters apply to the deck immediately.
Filter logic: `artist.min ≤ budget`, any style overlap, medium in set, licensing flag, location.

### 4. Artist profile (full-screen sheet)
Slides up over the deck (340ms). Close ✕ top-left; medium as mono label top-right; gradient header fade. Name 34px, location, bio paragraph 16px/1.55. **RECENT WORK:** 2-col grid (first piece spans both), each piece in its own frame+mat (frame rotates through palette starting at the artist's index), gallery-label caption below in 10px mono ("Title, Year · Dimensions"). **THE PRACTICAL PART:** key–value hairline rows — commission range, lead time, largest work, licensing. Style tags. Sticky footer: ✕ pass (58px) + "Yes — reach out" terracotta pill (fills width).

### 5. Note composer (bottom sheet)
Opens on any like (button, swipe, or profile). Title "Say something to {first name}"; helper copy noting the brief/budget attach automatically; textarea; two dashed suggestion chips that fill the textarea; "Just the like" ghost + "Send" primary. Dismissing via scrim cancels the like entirely.

### 6. Match overlay
When an artist likes back (simulated 1.4s after the like): full-screen terracotta takeover, "IT'S MUTUAL" mono; artist's artwork in a cream frame (120×150 + 8px frame); "{First name} wants to talk" 32px; body copy; "Open the conversation" (cream button) / "Keep looking" (ghost). Entry: scale 0.92→1 pop 320ms; title rises 420ms delayed 120ms.

### 7. Matches
Two sections: **TALKING** (matched) — rows with 58px framed thumbnail, name, last-message preview (ellipsis), terracotta unread dot; tap → chat. **WAITING ON THEM** (liked, no response) — dashed-border rows, 55% opacity thumbnail, "Liked · they have your brief". Empty state with CTA back to Discover.

### 8. Chat
Full-screen over tabs. Header: back ‹, framed 38px thumbnail, name + medium. System stamp centered: "You matched with {name} / your brief and budget were shared". Bubbles: mine = ink bg/cream text, radius 18/18/5/18, right-aligned, max 78%; theirs = cream card, radius 18/18/18/5. Typing indicator ("typing…" bubble) 1.1s before each scripted reply. Suggestion chips row above input. Input: 48px pill + terracotta send ↑; Enter sends.

### 9. Home / News (from header logotype)
Full-screen: close ✕; framed wordmark (230px); **WHAT'S NEW** cards (mono date tag in terracotta, title, body); **GOOD TO KNOW** hairline link rows (How matching works, Commissioning and licensing guide, Suggest an artist, Contact us); "HANG · EST. 2026" footer.

### 10. My spaces (tab)
Screen title "My spaces", subtitle "This is what an artist sees when you say yes." Profile card in **ebony frame**: studio name, city, tag chips (styles + budget + licensing). Brief card in **oak frame**: CURRENT BRIEF label, brief text, hairline rows for budget and licensing. "Edit brief" outlined button re-enters onboarding at step 1.

### Tab bar
3 tabs: Discover / Matches / Spaces. 82px, blurred translucent bg, top hairline. Active: ink text weight 500 + 5px terracotta dot below. Matches shows terracotta unread-count badge. Hidden during onboarding and inside chat.

## State Management
- User profile: studioName, studioCity, styles[], brief, budget, licensing
- Deck: seen[], lastAction (for single-step undo), pieceIdx per artist, drag state, filters {budget, styles[], mediums[], loc, licensing}
- Relationship funnel: likesSent[{artistId, note}] → matches[] (artist accepted) → threads{artistId: messages[]}, unread{artistId}
- The prototype scripts artist behavior (likesBack flag, opener + cycled replies); production replaces this with real backend: artist accept/decline, real-time chat, push on match/message.

## Data Model (per artist)
name, location, medium (display) + mediumKey (filter), styles[], min/max commission, licensing (bool), ships, lead weeks, max scale, bio, portfolio pieces [{title, year, dimensions, image}]. Prototype dataset: 8 artists in `ARTISTS` array — realistic tone reference for copy voice.

## Copy Voice
Warm, human, art-world but plain-spoken. No exclamation marks, lowercase brand. Examples: "Not now" instead of "Nope"; "That's everyone, for now"; "theirs to lose now."

## Assets
- Google Fonts: Space Grotesk (400/500/700), Instrument Sans (400/500/600), Space Mono (400), Cormorant Garamond (500)
- No image assets — artwork placeholders are CSS stripes; production uses artist uploads
- Wordmark/app icon: rebuild from spec in `Hang Wordmark.dc.html` (3b + 4a)

## Screenshots
`screenshots/` — captured from the v2 prototype, in flow order:
01 welcome · 02 onboarding step 1 · 03 step 2 · 04 discover deck · 05 filters sheet · 06 artist profile · 07 note composer · 08 match overlay · 09 chat (opener) · 10 chat (reply) · 11 matches list · 12 home/news · 13 my spaces

## Files
- `Hang Prototype v2 Gallery Wall.dc.html` — canonical interactive design
- `Hang Prototype.dc.html` — v1, flat treatment (reference)
- `Hang Wordmark.dc.html` — brand marks
- `ios-frame.jsx`, `support.js` — prototype scaffolding only; ignore for implementation
