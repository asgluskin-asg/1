import { artistById } from '../data/artists'
import { useHang } from '../state/store'
import { color, easeSheet, font, hairline } from '../theme'

const SUGGESTIONS = [
  {
    label: 'The scale is right for our lobby',
    text: 'The scale of your recent work is right for our lobby wall — could you take a commission this autumn?',
  },
  {
    label: 'Twelve rooms, one series',
    text: 'We need twelve guest rooms to feel related but not identical. Could you do a series?',
  },
]

export function NoteComposer() {
  const s = useHang()
  const artist = artistById(s.noteFor)
  const open = !!s.noteFor

  return (
    <>
      <div
        onClick={s.dismissNote}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 70,
          background: 'rgba(24,20,16,0.42)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 220ms ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 72,
          background: color.surface,
          borderRadius: '26px 26px 0 0',
          boxShadow: '0 -14px 40px rgba(42,36,30,0.24)',
          transform: `translateY(${open ? '0%' : '104%'})`,
          transition: `transform 300ms ${easeSheet}`,
          padding: '22px 22px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ width: 44, height: 4, borderRadius: 2, background: hairline(0.16), alignSelf: 'center' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 23, lineHeight: 1.15 }}>
            {artist ? `Say something to ${artist.name.split(' ')[0]}` : 'Say something'}
          </div>
          <div style={{ fontSize: 14, color: color.text2b, lineHeight: 1.45 }}>
            Your brief and budget go with it automatically. A line about why their work fits the room helps a
            lot.
          </div>
        </div>
        <textarea
          className="hang-input"
          value={s.noteText}
          onChange={(e) => s.setNoteText(e.target.value)}
          placeholder="Something specific about the work…"
          style={{
            minHeight: 92,
            border: `1px solid ${hairline(0.14)}`,
            borderRadius: 14,
            background: color.app,
            padding: 14,
            fontSize: 15,
            lineHeight: 1.45,
            color: color.ink,
            outline: 'none',
            resize: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map((sug) => (
            <div
              key={sug.label}
              role="button"
              tabIndex={0}
              onClick={() => s.setNoteText(sug.text)}
              className="hang-press hang-dashed"
              style={{
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                padding: '0 13px',
                borderRadius: 20,
                border: `1px dashed ${hairline(0.22)}`,
                color: color.text2,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {sug.label}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => s.finishLike('')}
            style={{
              minHeight: 54,
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              borderRadius: 27,
              border: `1px solid ${hairline(0.16)}`,
              color: color.text2,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Just the like
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => s.finishLike(s.noteText)}
            className="hang-press hang-btn-ink"
            style={{
              flex: 1,
              minHeight: 54,
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
            Send
          </div>
        </div>
      </div>
    </>
  )
}
