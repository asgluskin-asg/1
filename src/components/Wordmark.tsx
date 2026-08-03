import { color, font, hairline } from '../theme'

/** Mark 3b: oak frame, Cormorant Garamond lowercase "hang", mono caption. */
export function Wordmark({ width = 250, size = 52 }: { width?: number; size?: number }) {
  return (
    <div
      style={{
        width,
        background: '#C4AE8C',
        padding: 9,
        boxShadow: `0 6px 16px rgba(42,36,30,0.12), inset 0 0 0 1px ${hairline(0.28)}`,
      }}
    >
      <div
        style={{
          background: color.surface,
          padding: size >= 52 ? '26px 20px 18px' : '24px 20px 16px',
          boxShadow: 'inset 0 1px 5px rgba(42,36,30,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: size >= 52 ? 12 : 11,
        }}
      >
        <div
          style={{
            fontFamily: font.brand,
            fontWeight: 500,
            fontSize: size,
            lineHeight: 0.85,
            color: color.ink,
          }}
        >
          hang
        </div>
        <div
          style={{
            borderTop: `1px solid ${hairline(0.16)}`,
            paddingTop: size >= 52 ? 9 : 8,
            width: '70%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '0.22em', color: color.text3 }}>
            ARTISTS × DESIGNERS
          </div>
        </div>
      </div>
    </div>
  )
}
