import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ARTISTS } from '../data/artists'
import { useHang } from '../state/store'
import { artworkFill, color, easeSheet, font, hairline, money, shadow } from '../theme'
import { Filters } from './Filters'

const SWIPE_COMMIT = 95
const PULL_UP = 100

export function Discover() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 82,
      }}
    >
      <Header />
      <FilterHandle />
      <Deck />
      <ActionRow />
      <Filters />
    </div>
  )
}

function Header() {
  const s = useHang()
  return (
    <div
      style={{
        padding: '60px 20px 0',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => s.setHomeOpen(true)}
        style={{ display: 'flex', alignItems: 'baseline', gap: 10, cursor: 'pointer', minHeight: 44 }}
      >
        <div
          style={{
            fontFamily: font.brand,
            fontWeight: 500,
            fontSize: 30,
            lineHeight: 0.9,
            color: color.ink,
          }}
        >
          hang
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '0.16em', color: color.accent }}>
          NEWS
        </div>
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 11, color: color.text3, paddingBottom: 4 }}>
        {s.available.length} of {ARTISTS.length} artists
      </div>
    </div>
  )
}

function FilterHandle() {
  const s = useHang()
  const startY = useRef<number | null>(null)

  return (
    <div
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          /* pointer capture is best-effort */
        }
        startY.current = e.clientY
      }}
      onPointerMove={(e) => {
        if (startY.current != null && e.clientY - startY.current > 34) {
          s.setFiltersOpen(true)
          startY.current = null
        }
      }}
      onPointerUp={() => {
        startY.current = null
      }}
      onClick={() => s.setFiltersOpen(!s.filtersOpen)}
      style={{
        height: 48,
        margin: '6px 20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        cursor: 'grab',
        flexShrink: 0,
        touchAction: 'none',
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.14em', color: color.text3b }}>
        {s.anyFilter ? 'PULL DOWN · FILTERS ON' : 'PULL DOWN FOR FILTERS'}
      </div>
      <div style={{ width: 52, height: 4, borderRadius: 2, background: hairline(0.18) }} />
    </div>
  )
}

function Deck() {
  const s = useHang()
  const deck = s.available.slice(0, 3)

  const onDown = (e: ReactPointerEvent) => {
    if (s.fly) return
    s.setDrag({ x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, moved: false })
  }

  const onMove = (e: ReactPointerEvent) => {
    const card = e.currentTarget
    s.setDrag((d) => {
      if (!d) return d
      const dx = e.clientX - d.x0
      const dy = e.clientY - d.y0
      const moved = d.moved || Math.abs(dx) > 7 || Math.abs(dy) > 7
      // Capture only once a real drag begins. Capturing on pointerdown would
      // retarget the gesture's trailing click to the card, so taps on the
      // artwork and the portfolio button inside it would never fire.
      if (moved && !d.moved) {
        try {
          card.setPointerCapture(e.pointerId)
        } catch {
          /* capture is best-effort; dragging still works without it */
        }
      }
      return { ...d, dx, dy, moved }
    })
  }

  const onUp = (e: ReactPointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    const d = s.drag
    s.setDrag(null)
    if (!d || !d.moved) return
    if (d.dy < -PULL_UP && Math.abs(d.dx) < 80) return s.openProfile()
    if (d.dx > SWIPE_COMMIT) return s.like()
    if (d.dx < -SWIPE_COMMIT) return s.pass()
  }

  return (
    <div style={{ flex: 1, position: 'relative', margin: '10px 20px 0' }}>
      {deck.map((a, i) => {
        const flying = s.fly?.id === a.id
        const d = i === 0 ? s.drag : null
        const dx = d?.dx ?? 0
        const dy = d?.dy ?? 0

        let transform: string
        let transition = `transform 300ms ${easeSheet}, opacity 240ms ease`
        let opacity = 1
        if (i === 0 && flying) {
          transform = `translate(${s.fly!.dir * 560}px, -40px) rotate(${s.fly!.dir * 20}deg)`
          transition = 'transform 250ms ease-out, opacity 250ms ease-out'
          opacity = 0
        } else if (i === 0) {
          transform = `translate(${dx}px, ${dy}px) rotate(${dx / 20}deg)`
          if (d?.moved) transition = 'none'
        } else {
          transform = `scale(${1 - i * 0.045}) translateY(${i * 15}px)`
        }

        const pi = (s.pieceIdx[a.id] || 0) % a.pieces.length
        const p = a.pieces[pi]

        return (
          <div
            key={a.id}
            data-testid={i === 0 ? 'top-card' : undefined}
            onPointerDown={i === 0 ? onDown : undefined}
            onPointerMove={i === 0 ? onMove : undefined}
            onPointerUp={i === 0 ? onUp : undefined}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 22,
              overflow: 'hidden',
              background: '#DDD5C7',
              boxShadow: shadow.card,
              transform,
              opacity,
              transition,
              zIndex: 10 - i,
              touchAction: 'none',
              cursor: 'grab',
              userSelect: 'none',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: artworkFill(p.tint, 38 + pi * 14) }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: 10.5,
                  letterSpacing: '0.12em',
                  color: 'rgba(42,36,30,0.42)',
                  textAlign: 'center',
                  lineHeight: 1.7,
                  padding: '0 30px',
                  whiteSpace: 'pre-line',
                }}
              >
                {`DROP ARTWORK · ${p.dimensions.toUpperCase()}\n${p.title.toUpperCase()}, ${p.year}`}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(24,20,16,0.62) 0%, rgba(24,20,16,0.14) 34%, rgba(24,20,16,0) 58%)',
              }}
            />

            <div
              onClick={() => {
                if (s.drag?.moved) return
                if (i === 0) s.cyclePiece(a.id)
              }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 120, cursor: 'pointer' }}
            />

            <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', gap: 5 }}>
              {a.pieces.map((_, k) => (
                <div
                  key={k}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: k === pi ? 'rgba(251,248,242,0.95)' : 'rgba(251,248,242,0.32)',
                  }}
                />
              ))}
            </div>

            <Stamp
              text="YES"
              side="right"
              rotate={9}
              border={color.likeBorder}
              fill={color.likeFill}
              fg={color.likeText}
              opacity={i === 0 ? Math.min(1, Math.max(0, dx / 90)) : 0}
            />
            <Stamp
              text="NOT NOW"
              side="left"
              rotate={-9}
              border={color.passBorder}
              fill={color.passFill}
              fg={color.passText}
              opacity={i === 0 ? Math.min(1, Math.max(0, -dx / 90)) : 0}
            />

            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '0 20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div
                  style={{
                    fontFamily: font.display,
                    fontWeight: 500,
                    fontSize: 25,
                    color: color.surface,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {a.name}
                </div>
                <div style={{ fontSize: 13.5, color: 'rgba(251,248,242,0.78)' }}>
                  {a.medium} · {money(a.min)}–{money(a.max)}
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => s.openProfile()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 44,
                  borderRadius: 22,
                  background: 'rgba(251,248,242,0.14)',
                  border: '1px solid rgba(251,248,242,0.22)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    fontFamily: font.mono,
                    fontSize: 10.5,
                    letterSpacing: '0.14em',
                    color: color.surface,
                  }}
                >
                  ↑ PULL UP FOR PORTFOLIO
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {s.available.length === 0 && <EmptyDeck />}
    </div>
  )
}

function Stamp({
  text,
  side,
  rotate,
  border,
  fill,
  fg,
  opacity,
}: {
  text: string
  side: 'left' | 'right'
  rotate: number
  border: string
  fill: string
  fg: string
  opacity: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 18,
        [side]: 16,
        padding: '7px 12px',
        borderRadius: 6,
        border: `2px solid ${border}`,
        color: fg,
        fontFamily: font.display,
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: '0.1em',
        transform: `rotate(${rotate}deg)`,
        opacity,
        background: fill,
      }}
    >
      {text}
    </div>
  )
}

function EmptyDeck() {
  const s = useHang()
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 22,
        border: `1px dashed ${hairline(0.2)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '0 34px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 24, lineHeight: 1.15 }}>
        {s.anyFilter ? 'Nothing left under these filters' : "That's everyone, for now"}
      </div>
      <div style={{ fontSize: 14.5, color: color.text2b, lineHeight: 1.5, textWrap: 'pretty' }}>
        {s.anyFilter
          ? 'Widen the budget or drop a style and there will be more to look at.'
          : 'New artists join weekly. Meanwhile, the ones you liked are in Matches.'}
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={s.resetDeck}
        style={{
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px',
          borderRadius: 24,
          background: color.ink,
          color: color.onInk,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 4,
        }}
      >
        {s.anyFilter ? 'Reset filters' : 'Start over'}
      </div>
    </div>
  )
}

function ActionRow() {
  const s = useHang()
  return (
    <div
      style={{
        height: 104,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        flexShrink: 0,
      }}
    >
      <div
        role="button"
        aria-label="Not now"
        tabIndex={0}
        onClick={s.pass}
        className="hang-press hang-pass"
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          background: color.surface,
          border: `1px solid ${hairline(0.12)}`,
          boxShadow: '0 3px 12px rgba(42,36,30,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          color: color.text3,
          cursor: 'pointer',
        }}
      >
        ✕
      </div>
      <div
        role="button"
        aria-label="Undo"
        tabIndex={0}
        onClick={s.undo}
        className="hang-press hang-outline"
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          background: 'transparent',
          border: `1px solid ${hairline(0.14)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          color: color.text3b,
          cursor: 'pointer',
        }}
      >
        ↺
      </div>
      <div
        role="button"
        aria-label="Yes"
        tabIndex={0}
        onClick={s.like}
        className="hang-press hang-btn-accent"
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          background: color.accent,
          boxShadow: '0 4px 16px rgba(180,90,60,0.34)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          color: color.onAccent,
          cursor: 'pointer',
        }}
      >
        ♥
      </div>
    </div>
  )
}
