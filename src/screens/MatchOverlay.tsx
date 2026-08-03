import { artistById } from '../data/artists'
import { useHang } from '../state/store'
import { artworkFill, color, easeSheet, font } from '../theme'

export function MatchOverlay() {
  const s = useHang()
  const artist = artistById(s.matchOverlay)
  if (!artist) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        background: color.accent,
        color: color.onAccent,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        padding: '0 34px',
        textAlign: 'center',
        animation: `hangPop 320ms ${easeSheet} both`,
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.2em', opacity: 0.8 }}>
        IT'S MUTUAL
      </div>
      <div style={{ background: color.mat, padding: 8, boxShadow: '0 14px 34px rgba(60,22,10,0.3)' }}>
        <div
          style={{
            width: 120,
            height: 150,
            background: artworkFill(artist.pieces[0].tint, 38),
            boxShadow: 'inset 0 1px 3px rgba(42,36,30,0.3)',
          }}
        />
      </div>
      <div
        style={{
          fontFamily: font.display,
          fontWeight: 500,
          fontSize: 32,
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
          animation: 'hangRise 420ms 120ms both',
        }}
      >
        {artist.name.split(' ')[0]} wants to talk
      </div>
      <div style={{ fontSize: 15.5, lineHeight: 1.5, opacity: 0.88, maxWidth: 270, textWrap: 'pretty' }}>
        They read your brief and said yes. Chat is open — theirs to lose now.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 6 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={s.openMatchChat}
          style={{
            height: 56,
            borderRadius: 28,
            background: color.onAccent,
            color: color.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Open the conversation
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={s.dismissMatch}
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            color: 'rgba(253,248,243,0.82)',
            cursor: 'pointer',
          }}
        >
          Keep looking
        </div>
      </div>
    </div>
  )
}
