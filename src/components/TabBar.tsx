import { useHang, type Tab } from '../state/store'
import { color, font, hairline } from '../theme'

const TABS: { key: Tab; label: string }[] = [
  { key: 'discover', label: 'Discover' },
  { key: 'matches', label: 'Matches' },
  { key: 'studio', label: 'Spaces' },
]

export function TabBar() {
  const s = useHang()

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 82,
        zIndex: 30,
        background: 'rgba(244,240,232,0.92)',
        backdropFilter: 'blur(14px)',
        borderTop: `1px solid ${hairline(0.08)}`,
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: 12,
      }}
    >
      {TABS.map((t) => {
        const active = s.tab === t.key
        const badge = t.key === 'matches' ? s.unreadCount : 0
        return (
          <div
            key={t.key}
            role="button"
            tabIndex={0}
            onClick={() => s.setTab(t.key)}
            style={{
              flex: 1,
              minHeight: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                fontFamily: font.display,
                fontSize: 14.5,
                fontWeight: active ? 500 : 400,
                color: active ? color.ink : color.text3b,
                position: 'relative',
              }}
            >
              {t.label}
              {badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -13,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    background: color.accent,
                    color: color.onAccent,
                    fontFamily: font.mono,
                    fontSize: 9.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                background: active ? color.accent : 'transparent',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
