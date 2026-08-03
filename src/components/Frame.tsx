import type { CSSProperties, ReactNode } from 'react'
import { shadow } from '../theme'

type FrameProps = {
  frame: string
  mat?: string
  /** Frame width in px. 9–16 on full-size frames, 3–4 on thumbnails. */
  pad?: number
  matPad?: number
  children?: ReactNode
  style?: CSSProperties
}

/**
 * The signature motif: a frame rail with an inset dark ring, an optional mat
 * with an inset top shadow, and the artwork inside. Square corners always.
 */
export function Frame({ frame, mat, pad = 9, matPad = 10, children, style }: FrameProps) {
  const art = (
    <div style={{ display: 'flex', width: '100%', height: mat ? undefined : '100%' }}>{children}</div>
  )
  return (
    <div style={{ background: frame, padding: pad, boxShadow: shadow.frame, ...style }}>
      {mat ? (
        <div style={{ background: mat, padding: matPad, boxShadow: shadow.matInset }}>{children}</div>
      ) : (
        art
      )}
    </div>
  )
}

type ThumbProps = { frame: string; fill: string; size: number; pad?: number; opacity?: number }

/** Small framed thumbnail — no mat, per spec. */
export function FrameThumb({ frame, fill, size, pad = 4, opacity }: ThumbProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: frame,
        padding: pad,
        opacity,
        boxShadow: 'inset 0 0 0 0.5px rgba(42,36,30,0.3)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: fill,
          boxShadow: 'inset 0 0.5px 2px rgba(42,36,30,0.25)',
        }}
      />
    </div>
  )
}
