import { FrameThumb } from '../components/Frame'
import { artistById, artistIndex } from '../data/artists'
import { useHang } from '../state/store'
import { FRAMES, artworkFill, color, font, hairline } from '../theme'

const sectionLabel = {
  fontFamily: font.mono,
  fontSize: 10,
  letterSpacing: '0.14em',
  color: color.text3b,
}

const frameFor = (id: string) => FRAMES[artistIndex(id) % FRAMES.length][0]

export function Matches() {
  const s = useHang()
  const empty = s.matches.length === 0 && s.pendingIds.length === 0

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '60px 20px 12px', flexShrink: 0 }}>
        <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 26, letterSpacing: '-0.015em' }}>
          Matches
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '0 20px 110px',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        {s.matches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={sectionLabel}>TALKING</div>
            {s.matches.map((id) => {
              const a = artistById(id)!
              const thread = s.threads[id] || []
              return (
                <div
                  key={id}
                  role="button"
                  tabIndex={0}
                  onClick={() => s.openChat(id)}
                  className="hang-press hang-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 12,
                    borderRadius: 18,
                    background: color.surface,
                    border: `1px solid ${hairline(0.08)}`,
                    cursor: 'pointer',
                  }}
                >
                  <FrameThumb
                    frame={frameFor(id)}
                    fill={artworkFill(a.pieces[0].tint, 38)}
                    size={58}
                  />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 17 }}>{a.name}</div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: color.text2b,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {thread.length ? thread[thread.length - 1].text : ''}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: s.unread[id] ? color.accent : 'transparent',
                      flexShrink: 0,
                    }}
                  />
                </div>
              )
            })}
          </div>
        )}

        {s.pendingIds.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={sectionLabel}>WAITING ON THEM</div>
            {s.pendingIds.map((id) => {
              const a = artistById(id)!
              return (
                <div
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 12,
                    borderRadius: 18,
                    background: 'transparent',
                    border: `1px dashed ${hairline(0.16)}`,
                  }}
                >
                  <FrameThumb
                    frame={frameFor(id)}
                    fill={artworkFill(a.pieces[0].tint, 38)}
                    size={58}
                    opacity={0.55}
                  />
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div
                      style={{ fontFamily: font.display, fontWeight: 500, fontSize: 17, color: color.text2 }}
                    >
                      {a.name}
                    </div>
                    <div style={{ fontSize: 13, color: color.text3b }}>Liked · they have your brief</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {empty && (
          <div
            style={{
              marginTop: 70,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              textAlign: 'center',
              padding: '0 24px',
            }}
          >
            <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 23, lineHeight: 1.2 }}>
              Nothing here yet
            </div>
            <div style={{ fontSize: 14.5, color: color.text2b, lineHeight: 1.5, textWrap: 'pretty' }}>
              Say yes to work you'd hang, and send a note with it. Artists read your brief before they answer.
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => s.setTab('discover')}
              style={{
                minHeight: 48,
                display: 'flex',
                alignItems: 'center',
                padding: '0 22px',
                borderRadius: 24,
                border: `1px solid ${hairline(0.2)}`,
                fontSize: 15,
                cursor: 'pointer',
                marginTop: 6,
              }}
            >
              Back to discover
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
