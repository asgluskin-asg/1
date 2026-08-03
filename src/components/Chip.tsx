import type { CSSProperties } from 'react'
import { color, hairline } from '../theme'

type ChipProps = {
  label: string
  active: boolean
  onClick: () => void
  style?: CSSProperties
  fontSize?: number
}

export function Chip({ label, active, onClick, style, fontSize = 14 }: ChipProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="hang-press"
      style={{
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        padding: '0 15px',
        borderRadius: 22,
        border: `1px solid ${active ? color.ink : hairline(0.18)}`,
        background: active ? color.ink : 'transparent',
        color: active ? color.onInk : color.chipText,
        fontSize,
        cursor: 'pointer',
        userSelect: 'none',
        ...style,
      }}
    >
      {label}
    </div>
  )
}
