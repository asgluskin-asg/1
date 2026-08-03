import { useHang } from '../state/store'
import { color, font, hairline, money, shadow } from '../theme'

export function Spaces() {
  const s = useHang()
  const tags = [
    ...s.studioStyles,
    `${money(s.budget)} per piece`,
    s.licensing ? 'Needs licensing' : 'Originals fine',
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '60px 20px 12px', flexShrink: 0 }}>
        <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 26, letterSpacing: '-0.015em' }}>
          My spaces
        </div>
        <div style={{ fontSize: 13.5, color: color.text2b, marginTop: 5 }}>
          This is what an artist sees when you say yes.
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 20px 110px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {/* ebony frame */}
        <div style={{ background: '#33291F', padding: 10, boxShadow: shadow.frame }}>
          <div
            style={{
              padding: 20,
              background: color.mat,
              boxShadow: shadow.matInset,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 22 }}>{s.studioName}</div>
            <div style={{ fontSize: 14, color: color.text2b }}>{s.studioCity}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {tags.map((t) => (
                <div
                  key={t}
                  style={{
                    padding: '6px 11px',
                    borderRadius: 14,
                    background: color.surfaceAlt,
                    color: color.chipText,
                    fontSize: 12,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* oak frame */}
        <div
          style={{
            background: '#C4AE8C',
            padding: 10,
            boxShadow: `0 8px 20px rgba(42,36,30,0.16), inset 0 0 0 1px ${hairline(0.28)}`,
          }}
        >
          <div
            style={{
              padding: 20,
              background: color.surface,
              boxShadow: shadow.matInset,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.14em', color: color.text3b }}
            >
              CURRENT BRIEF
            </div>
            <div style={{ fontSize: 15.5, lineHeight: 1.5, textWrap: 'pretty' }}>{s.brief}</div>
            <div style={{ height: 1, background: hairline(0.08) }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, color: color.text2b }}>Budget per piece</div>
              <div style={{ fontFamily: font.display, fontSize: 16, fontWeight: 500 }}>
                up to {money(s.budget)}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, color: color.text2b }}>Commercial licensing</div>
              <div style={{ fontFamily: font.display, fontSize: 16, fontWeight: 500 }}>
                {s.licensing ? 'Required' : 'Not needed'}
              </div>
            </div>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            s.setOnboarding(true)
            s.setStep(1)
          }}
          className="hang-press hang-outline"
          style={{
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 26,
            border: `1px solid ${hairline(0.16)}`,
            fontSize: 15,
            color: color.text2,
            cursor: 'pointer',
            marginTop: 6,
          }}
        >
          Edit brief
        </div>
      </div>
    </div>
  )
}
