import { Chip } from '../components/Chip'
import { Wordmark } from '../components/Wordmark'
import { STYLES } from '../data/artists'
import { useHang } from '../state/store'
import { color, font, hairline, money } from '../theme'

const label = { fontFamily: font.mono, fontSize: 10, letterSpacing: '0.14em', color: color.text3b }
const stepLabel = { fontFamily: font.mono, fontSize: 11, letterSpacing: '0.16em', color: color.text3b }
const heading = {
  fontFamily: font.display,
  fontWeight: 500,
  fontSize: 30,
  lineHeight: 1.1,
  marginTop: 10,
  letterSpacing: '-0.015em',
}
const field = {
  height: 50,
  border: `1px solid ${hairline(0.14)}`,
  borderRadius: 14,
  background: color.surface,
  padding: '0 16px',
  fontSize: 16,
  color: color.ink,
  outline: 'none',
} as const

export function Onboarding() {
  const s = useHang()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.app,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        padding: '64px 26px 34px',
      }}
    >
      {s.step === 0 && <Welcome />}
      {s.step === 1 && <StepOne />}
      {s.step === 2 && <StepTwo />}
    </div>
  )
}

function Welcome() {
  const s = useHang()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
        <Wordmark />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            textWrap: 'pretty',
          }}
        >
          Art for the rooms you're building.
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.5, color: color.text2, maxWidth: 300, textWrap: 'pretty' }}>
          Swipe through original work from artists who take commissions. When you both say yes, you talk.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => s.setStep(1)}
          className="hang-press hang-btn-ink"
          style={{
            height: 56,
            borderRadius: 28,
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
          Set up your space
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => s.setOnboarding(false)}
          className="hang-press hang-ghost"
          style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: color.text3,
            cursor: 'pointer',
          }}
        >
          Just let me look first
        </div>
      </div>
    </div>
  )
}

function StepOne() {
  const s = useHang()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={stepLabel}>STEP 1 / 2</div>
      <div style={heading}>Who's sourcing?</div>
      <div style={{ fontSize: 14, color: color.text2b, marginTop: 8, lineHeight: 1.45 }}>
        Artists see this before they match with you.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 26 }}>
        <div style={label}>STUDIO</div>
        <input
          className="hang-input"
          value={s.studioName}
          onChange={(e) => s.setStudioName(e.target.value)}
          style={field}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        <div style={label}>BASED IN</div>
        <input
          className="hang-input"
          value={s.studioCity}
          onChange={(e) => s.setStudioCity(e.target.value)}
          style={field}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
        <div style={label}>YOUR WORK LEANS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STYLES.slice(0, 8).map((v) => (
            <Chip
              key={v}
              label={v}
              active={s.studioStyles.includes(v)}
              onClick={() => s.toggleStudioStyle(v)}
              style={{ padding: '0 16px' }}
            />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 24 }} />
      <div
        role="button"
        tabIndex={0}
        onClick={() => s.setStep(2)}
        className="hang-press hang-btn-ink"
        style={{
          height: 56,
          borderRadius: 28,
          background: color.ink,
          color: color.onInk,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 20,
          flexShrink: 0,
        }}
      >
        Next
      </div>
    </div>
  )
}

function StepTwo() {
  const s = useHang()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={stepLabel}>STEP 2 / 2</div>
      <div style={heading}>What's the project?</div>
      <div style={{ fontSize: 14, color: color.text2b, marginTop: 8, lineHeight: 1.45 }}>
        This travels with every like you send, so artists know what they'd be making.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 26 }}>
        <div style={label}>BRIEF</div>
        <textarea
          className="hang-input"
          value={s.brief}
          onChange={(e) => s.setBrief(e.target.value)}
          style={{
            minHeight: 104,
            border: `1px solid ${hairline(0.14)}`,
            borderRadius: 14,
            background: color.surface,
            padding: '14px 16px',
            fontSize: 15,
            lineHeight: 1.45,
            color: color.ink,
            outline: 'none',
            resize: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={label}>BUDGET PER PIECE</div>
          <div style={{ fontFamily: font.display, fontSize: 17, fontWeight: 500 }}>
            up to {money(s.budget)}
          </div>
        </div>
        <input
          type="range"
          min={500}
          max={15000}
          step={500}
          value={s.budget}
          onChange={(e) => s.setBudget(+e.target.value)}
          style={{ width: '100%', height: 44 }}
          aria-label="Budget per piece"
        />
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => s.setLicensing(!s.licensing)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginTop: 14,
          minHeight: 56,
          padding: '0 16px',
          borderRadius: 14,
          background: color.surface,
          border: `1px solid ${hairline(0.1)}`,
          cursor: 'pointer',
        }}
      >
        <Checkbox checked={s.licensing} />
        <div style={{ fontSize: 15, lineHeight: 1.35 }}>I need commercial licensing rights</div>
      </div>

      <div style={{ flex: 1, minHeight: 24 }} />
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          s.setOnboarding(false)
          s.setStep(0)
        }}
        className="hang-press hang-btn-accent"
        style={{
          height: 56,
          borderRadius: 28,
          background: color.accent,
          color: color.onAccent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 20,
          flexShrink: 0,
        }}
      >
        Start browsing
      </div>
    </div>
  )
}

export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 7,
        flexShrink: 0,
        border: `1px solid ${checked ? color.accent : hairline(0.28)}`,
        background: checked ? color.accent : 'transparent',
        color: color.onInk,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
      }}
    >
      {checked ? '✓' : ''}
    </div>
  )
}
