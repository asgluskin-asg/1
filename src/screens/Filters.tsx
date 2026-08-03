import { Chip } from '../components/Chip'
import { Checkbox } from './Onboarding'
import { MEDIUMS, STYLES } from '../data/artists'
import { MAX_BUDGET, useHang, type Loc } from '../state/store'
import { color, easeSheet, font, hairline, money } from '../theme'

const label = { fontFamily: font.mono, fontSize: 10, letterSpacing: '0.14em', color: color.text3b }

const LOCATIONS: { key: Loc; label: string }[] = [
  { key: 'any', label: 'Anywhere' },
  { key: 'ships', label: 'Ships to me' },
  { key: 'us', label: 'US only' },
]

export function Filters() {
  const s = useHang()
  const f = s.filters

  return (
    <>
      <div
        onClick={() => s.setFiltersOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(24,20,16,0.34)',
          zIndex: 38,
          opacity: s.filtersOpen ? 1 : 0,
          pointerEvents: s.filtersOpen ? 'auto' : 'none',
          transition: 'opacity 240ms ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          zIndex: 40,
          background: color.surface,
          borderRadius: '0 0 26px 26px',
          boxShadow: '0 16px 40px rgba(42,36,30,0.22)',
          transform: `translateY(${s.filtersOpen ? '0%' : '-102%'})`,
          transition: `transform 300ms ${easeSheet}`,
          maxHeight: '84%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '58px 22px 0',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 22 }}>Filters</div>
          <div
            role="button"
            tabIndex={0}
            onClick={s.clearFilters}
            style={{
              fontFamily: font.mono,
              fontSize: 10.5,
              letterSpacing: '0.12em',
              color: color.accent,
              cursor: 'pointer',
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            CLEAR ALL
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '6px 22px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={label}>BUDGET PER PIECE · UP TO</div>
              <div style={{ fontFamily: font.display, fontSize: 16, fontWeight: 500 }}>
                {f.budget >= MAX_BUDGET ? 'any' : money(f.budget)}
              </div>
            </div>
            <input
              type="range"
              min={500}
              max={MAX_BUDGET}
              step={500}
              value={f.budget}
              onChange={(e) => s.setFilters({ ...f, budget: +e.target.value })}
              style={{ width: '100%', height: 44 }}
              aria-label="Maximum budget per piece"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={label}>STYLE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STYLES.map((v) => (
                <Chip
                  key={v}
                  label={v}
                  active={f.styles.includes(v)}
                  onClick={() => s.toggleFilterStyle(v)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={label}>MEDIUM</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MEDIUMS.map((v) => (
                <Chip
                  key={v}
                  label={v}
                  active={f.mediums.includes(v)}
                  onClick={() => s.toggleFilterMedium(v)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={label}>WHERE</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {LOCATIONS.map((o) => (
                <Chip
                  key={o.key}
                  label={o.label}
                  active={f.loc === o.key}
                  onClick={() => s.setFilters({ ...f, loc: o.key })}
                  fontSize={13.5}
                  style={{
                    flex: 1,
                    minHeight: 46,
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '0 10px',
                    borderRadius: 14,
                  }}
                />
              ))}
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => s.setFilters({ ...f, licensing: !f.licensing })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              minHeight: 58,
              padding: '0 16px',
              borderRadius: 14,
              background: color.app,
              border: `1px solid ${hairline(0.1)}`,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Checkbox checked={f.licensing} />
            <div style={{ fontSize: 15 }}>Offers commercial licensing</div>
          </div>
        </div>

        <div style={{ padding: '14px 22px 22px', flexShrink: 0 }}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => s.setFiltersOpen(false)}
            className="hang-press hang-btn-ink"
            style={{
              height: 54,
              borderRadius: 27,
              background: color.ink,
              color: color.onInk,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Show {s.available.length} artists
          </div>
        </div>
      </div>
    </>
  )
}
