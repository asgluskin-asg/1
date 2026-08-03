import { IOSDevice } from './components/IOSDevice'
import { TabBar } from './components/TabBar'
import { ArtistProfile } from './screens/ArtistProfile'
import { Chat } from './screens/Chat'
import { Discover } from './screens/Discover'
import { HomeNews } from './screens/HomeNews'
import { MatchOverlay } from './screens/MatchOverlay'
import { Matches } from './screens/Matches'
import { NoteComposer } from './screens/NoteComposer'
import { Onboarding } from './screens/Onboarding'
import { Spaces } from './screens/Spaces'
import { HangProvider, useHang } from './state/store'
import { color, font } from './theme'

export default function App() {
  return (
    <HangProvider>
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '44px 20px',
          background: color.canvas,
          fontFamily: font.body,
        }}
      >
        <IOSDevice>
          <Screens />
        </IOSDevice>
      </div>
    </HangProvider>
  )
}

function Screens() {
  const s = useHang()
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        background: color.app,
        color: color.ink,
        fontFamily: font.body,
      }}
    >
      {s.onboarding && <Onboarding />}

      {!s.onboarding && s.tab === 'discover' && <Discover />}
      {!s.onboarding && s.tab === 'matches' && <Matches />}
      {!s.onboarding && s.tab === 'studio' && <Spaces />}

      {!s.onboarding && !s.chatWith && <TabBar />}

      {s.homeOpen && <HomeNews />}

      <ArtistProfile />
      <NoteComposer />

      {s.matchOverlay && <MatchOverlay />}
      {s.chatWith && <Chat />}
    </div>
  )
}
