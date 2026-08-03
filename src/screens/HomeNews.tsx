import { Wordmark } from '../components/Wordmark'
import { useHang } from '../state/store'
import { color, easeSheet, font, hairline } from '../theme'

const UPDATES = [
  {
    date: 'THIS WEEK',
    title: 'Six new artists joined',
    body: 'A ceramics and textile lean this round — two work at architectural scale.',
  },
  {
    date: 'JUL 2026',
    title: 'Briefs now travel with every like',
    body: 'Artists see your brief, budget, and licensing needs before they answer. Fewer dead-end matches.',
  },
  {
    date: 'COMING SOON',
    title: 'My studio — the artist side',
    body: 'Artists get their own home for portfolios, availability, and commission terms.',
  },
]

const INFO = [
  'How matching works',
  'Commissioning and licensing guide',
  'Suggest an artist',
  'Contact us',
]

export function HomeNews() {
  const s = useHang()
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 55,
        background: color.app,
        display: 'flex',
        flexDirection: 'column',
        animation: `hangRise 280ms ${easeSheet} both`,
      }}
    >
      <div style={{ padding: '58px 18px 0', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        <div
          role="button"
          aria-label="Close news"
          tabIndex={0}
          onClick={() => s.setHomeOpen(false)}
          className="hang-press hang-close"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: color.surfaceAlt2,
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
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '6px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
          <Wordmark width={230} size={48} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.14em', color: color.text3b }}>
            WHAT'S NEW
          </div>
          {UPDATES.map((u) => (
            <div
              key={u.title}
              style={{
                padding: '16px 18px',
                background: color.surface,
                border: `1px solid ${hairline(0.08)}`,
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div
                style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: '0.14em', color: color.accent }}
              >
                {u.date}
              </div>
              <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 16.5, lineHeight: 1.25 }}>
                {u.title}
              </div>
              <div style={{ fontSize: 14, color: color.text2b, lineHeight: 1.45, textWrap: 'pretty' }}>
                {u.body}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 10,
              letterSpacing: '0.14em',
              color: color.text3b,
              marginBottom: 8,
            }}
          >
            GOOD TO KNOW
          </div>
          {INFO.map((label) => (
            <div
              key={label}
              role="button"
              tabIndex={0}
              className="hang-press hang-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 52,
                borderBottom: `1px solid ${hairline(0.08)}`,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 15 }}>{label}</div>
              <div style={{ fontSize: 15, color: color.text3b }}>›</div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: font.mono,
            fontSize: 9,
            letterSpacing: '0.16em',
            color: '#B3A996',
            textAlign: 'center',
          }}
        >
          HANG · EST. 2026
        </div>
      </div>
    </div>
  )
}
