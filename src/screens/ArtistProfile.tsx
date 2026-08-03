import { Frame } from '../components/Frame'
import { ARTISTS, artistById, artistIndex } from '../data/artists'
import { useHang } from '../state/store'
import { FRAMES, artworkFill, color, easeSheet, font, hairline, money } from '../theme'

export function ArtistProfile() {
  const s = useHang()
  const prof = artistById(s.profileFor) ?? ARTISTS[0]
  const base = artistIndex(prof.id)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: color.surface,
        transform: `translateY(${s.profileOpen ? '0%' : '101%'})`,
        transition: `transform 340ms ${easeSheet}`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -14px 40px rgba(42,36,30,0.2)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          zIndex: 5,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 18px 12px',
          background: 'linear-gradient(to bottom,rgba(251,248,242,0.96),rgba(251,248,242,0))',
        }}
      >
        <div
          role="button"
          aria-label="Close portfolio"
          tabIndex={0}
          onClick={s.closeProfile}
          className="hang-press hang-close"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: color.surfaceAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
            color: color.chipText,
            cursor: 'pointer',
          }}
        >
          ✕
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.14em', color: color.text3b }}>
          {prof.medium.toUpperCase()}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '96px 22px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 500,
              fontSize: 34,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {prof.name}
          </div>
          <div style={{ fontSize: 14.5, color: color.text2b }}>{prof.location}</div>
        </div>

        <div style={{ fontSize: 16, lineHeight: 1.55, textWrap: 'pretty' }}>{prof.bio}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.14em', color: color.text3b }}>
            RECENT WORK
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {prof.pieces.map((p, i) => {
              const [frame, mat] = FRAMES[(base + i) % FRAMES.length]
              return (
                <div
                  key={p.title}
                  style={{
                    gridColumn: i === 0 ? 'span 2' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <Frame frame={frame} mat={mat}>
                    <div style={{ aspectRatio: '4 / 5', background: artworkFill(p.tint, 38 + i * 14) }} />
                  </Frame>
                  <div
                    style={{
                      fontFamily: font.mono,
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      color: color.text3,
                      lineHeight: 1.5,
                    }}
                  >
                    {p.title}, {p.year} · {p.dimensions}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 10,
              letterSpacing: '0.14em',
              color: color.text3b,
              marginBottom: 10,
            }}
          >
            THE PRACTICAL PART
          </div>
          {[
            { label: 'Commission range', value: `${money(prof.min)} – ${money(prof.max)}` },
            { label: 'Lead time', value: `${prof.lead} weeks` },
            { label: 'Largest work', value: prof.scale },
            { label: 'Commercial licensing', value: prof.licensing ? 'Available' : 'Originals only' },
          ].map((f) => (
            <div
              key={f.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 18,
                padding: '13px 0',
                borderBottom: `1px solid ${hairline(0.08)}`,
              }}
            >
              <div style={{ fontSize: 14, color: color.text2b, flexShrink: 0 }}>{f.label}</div>
              <div style={{ fontSize: 15, textAlign: 'right' }}>{f.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[...prof.styles, prof.mediumKey].map((t) => (
            <div
              key={t}
              style={{
                padding: '7px 12px',
                borderRadius: 16,
                background: color.surfaceAlt,
                color: color.chipText,
                fontSize: 12.5,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 22px 26px',
          background: 'linear-gradient(to top,rgba(251,248,242,0.98) 40%,rgba(251,248,242,0))',
          display: 'flex',
          gap: 12,
        }}
      >
        <div
          role="button"
          aria-label="Not now"
          tabIndex={0}
          onClick={s.pass}
          className="hang-press hang-pass"
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            border: `1px solid ${hairline(0.14)}`,
            background: color.app,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: color.text3,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ✕
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={s.like}
          className="hang-press hang-btn-accent"
          style={{
            flex: 1,
            height: 58,
            borderRadius: 29,
            background: color.accent,
            color: color.onAccent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Yes — reach out
        </div>
      </div>
    </div>
  )
}
