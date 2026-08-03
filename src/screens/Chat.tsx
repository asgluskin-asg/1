import { useEffect, useRef } from 'react'
import { ARTISTS, artistById, artistIndex } from '../data/artists'
import { useHang } from '../state/store'
import { FRAMES, artworkFill, color, font, hairline } from '../theme'

const SUGGESTIONS = ['Can you hold autumn?', 'What does framing add?', 'Sending the moodboard']

export function Chat() {
  const s = useHang()
  const a = artistById(s.chatWith) ?? ARTISTS[0]
  const thread = (s.chatWith && s.threads[s.chatWith]) || []
  const frame = FRAMES[artistIndex(a.id) % FRAMES.length][0]
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [thread.length, s.chatTyping])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        background: color.app,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '58px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(244,240,232,0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${hairline(0.08)}`,
          flexShrink: 0,
        }}
      >
        <div
          role="button"
          aria-label="Back"
          tabIndex={0}
          onClick={s.closeChat}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: color.chipText,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ‹
        </div>
        <div style={{ width: 38, height: 38, background: frame, padding: 3, flexShrink: 0 }}>
          <div style={{ width: '100%', height: '100%', background: artworkFill(a.pieces[0].tint, 38) }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 17 }}>{a.name}</div>
          <div style={{ fontSize: 12, color: color.text3 }}>{a.medium}</div>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            alignSelf: 'center',
            padding: '8px 14px',
            borderRadius: 14,
            background: color.surfaceAlt2,
            fontFamily: font.mono,
            fontSize: 10,
            letterSpacing: '0.1em',
            color: color.text3,
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 280,
            whiteSpace: 'pre-line',
          }}
        >
          {`You matched with ${a.name.split(' ')[0]}\nyour brief and budget were shared`}
        </div>
        {thread.map((m, i) => (
          <div
            key={i}
            style={{
              maxWidth: '78%',
              alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
              padding: '12px 15px',
              borderRadius: m.from === 'me' ? '18px 18px 5px 18px' : '18px 18px 18px 5px',
              background: m.from === 'me' ? color.ink : color.surface,
              color: m.from === 'me' ? color.onInk : color.ink,
              fontSize: 15,
              lineHeight: 1.45,
            }}
          >
            {m.text}
          </div>
        ))}
        {s.chatTyping && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 5px',
              background: color.surface,
              color: color.text3b,
              fontSize: 15,
            }}
          >
            typing…
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, padding: '0 16px 8px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {SUGGESTIONS.map((label) => (
          <div
            key={label}
            role="button"
            tabIndex={0}
            onClick={() => s.pushChat(label)}
            className="hang-press hang-dashed"
            style={{
              minHeight: 40,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              padding: '0 14px',
              borderRadius: 20,
              border: `1px dashed ${hairline(0.22)}`,
              color: color.text2,
              fontSize: 13,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: '8px 16px 30px',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          background: 'rgba(244,240,232,0.94)',
          borderTop: `1px solid ${hairline(0.06)}`,
        }}
      >
        <input
          className="hang-input"
          value={s.chatInput}
          onChange={(e) => s.setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') s.sendChat()
          }}
          placeholder="Message"
          style={{
            flex: 1,
            height: 48,
            border: `1px solid ${hairline(0.14)}`,
            borderRadius: 24,
            background: color.surface,
            padding: '0 18px',
            fontSize: 15,
            color: color.ink,
            outline: 'none',
          }}
        />
        <div
          role="button"
          aria-label="Send"
          tabIndex={0}
          onClick={s.sendChat}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: color.accent,
            color: color.onAccent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 19,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ↑
        </div>
      </div>
    </div>
  )
}
