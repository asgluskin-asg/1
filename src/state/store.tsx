import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ARTISTS, artistById, type Artist } from '../data/artists'

export type Tab = 'discover' | 'matches' | 'studio'
export type Loc = 'any' | 'ships' | 'us'
export type Message = { from: 'me' | 'them'; text: string }
export type Drag = { x0: number; y0: number; dx: number; dy: number; moved: boolean }

export type Filters = {
  budget: number
  styles: string[]
  mediums: string[]
  loc: Loc
  licensing: boolean
}

export const MAX_BUDGET = 15000

const emptyFilters = (): Filters => ({
  budget: MAX_BUDGET,
  styles: [],
  mediums: [],
  loc: 'any',
  licensing: false,
})

const toggleIn = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : arr.concat([v])

function useHangStore() {
  const [onboarding, setOnboarding] = useState(true)
  const [step, setStep] = useState(0)
  const [tab, setTab] = useState<Tab>('discover')

  const [seen, setSeen] = useState<string[]>([])
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [pieceIdx, setPieceIdx] = useState<Record<string, number>>({})
  const [drag, setDrag] = useState<Drag | null>(null)
  const [fly, setFly] = useState<{ id: string; dir: number } | null>(null)

  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [homeOpen, setHomeOpen] = useState(false)

  const [studioName, setStudioName] = useState('Studio Verity')
  const [studioCity, setStudioCity] = useState('Oakland, California')
  const [studioStyles, setStudioStyles] = useState<string[]>(['Minimal', 'Textural'])
  const [brief, setBrief] = useState(
    'Boutique hotel in Sausalito — lobby plus twelve guest rooms. Warm, coastal, quiet. Looking for one anchor piece and a series that can repeat without feeling repeated.',
  )
  const [budget, setBudget] = useState(6000)
  const [licensing, setLicensing] = useState(true)

  const [profileOpen, setProfileOpen] = useState(false)
  const [profileFor, setProfileFor] = useState<string | null>(null)

  const [noteFor, setNoteFor] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  const [likesSent, setLikesSent] = useState<{ id: string; note: string }[]>([])
  const [matches, setMatches] = useState<string[]>([])
  const [threads, setThreads] = useState<Record<string, Message[]>>({})
  const [unread, setUnread] = useState<Record<string, boolean>>({})
  const [matchOverlay, setMatchOverlay] = useState<string | null>(null)

  const [chatWith, setChatWith] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [chatTyping, setChatTyping] = useState(false)

  const filtered = useMemo(
    () =>
      ARTISTS.filter((a) => {
        if (a.min > filters.budget) return false
        if (filters.styles.length && !a.styles.some((s) => filters.styles.includes(s))) return false
        if (filters.mediums.length && !filters.mediums.includes(a.mediumKey)) return false
        if (filters.licensing && !a.licensing) return false
        if (filters.loc === 'ships' && !a.ships) return false
        if (filters.loc === 'us' && !/TX|California|Oakland/.test(a.location)) return false
        return true
      }),
    [filters],
  )

  const available = useMemo(() => filtered.filter((a) => !seen.includes(a.id)), [filtered, seen])
  const availableRef = useRef(available)
  availableRef.current = available

  const anyFilter =
    filters.budget < MAX_BUDGET ||
    filters.styles.length > 0 ||
    filters.mediums.length > 0 ||
    filters.licensing ||
    filters.loc !== 'any'

  const commit = useCallback((dir: number, id: string) => {
    setFly({ id, dir })
    setTimeout(() => {
      setFly(null)
      setDrag(null)
      setSeen((s) => s.concat([id]))
      setLastAction(id)
    }, 250)
  }, [])

  const flyRef = useRef(fly)
  flyRef.current = fly

  const pass = useCallback(() => {
    const a = availableRef.current[0]
    if (!a || flyRef.current) return
    setProfileOpen(false)
    commit(-1, a.id)
  }, [commit])

  const like = useCallback(() => {
    const a = availableRef.current[0]
    if (!a || flyRef.current) return
    setProfileOpen(false)
    setNoteFor(a.id)
    setNoteText('')
  }, [])

  const undo = useCallback(() => {
    setLastAction((la) => {
      if (la) setSeen((s) => s.filter((x) => x !== la))
      return null
    })
  }, [])

  const resetDeck = useCallback(() => {
    if (anyFilter) {
      setFilters(emptyFilters())
      setFiltersOpen(false)
    } else {
      setSeen([])
      setLastAction(null)
    }
  }, [anyFilter])

  const openProfile = useCallback(() => {
    const a = availableRef.current[0]
    if (a) {
      setProfileFor(a.id)
      setProfileOpen(true)
    }
  }, [])

  const cyclePiece = useCallback((id: string) => {
    setPieceIdx((p) => ({ ...p, [id]: (p[id] || 0) + 1 }))
  }, [])

  const finishLike = useCallback(
    (note: string) => {
      const id = noteFor
      if (!id) return
      const a = artistById(id) as Artist
      setNoteFor(null)
      setNoteText('')
      setLikesSent((l) => l.concat([{ id, note }]))
      commit(1, id)
      if (a.likesBack) {
        setTimeout(() => {
          setMatchOverlay(id)
          setMatches((m) => m.concat([id]))
          setUnread((u) => ({ ...u, [id]: true }))
          setThreads((t) => ({ ...t, [id]: [{ from: 'them', text: a.opener }] }))
        }, 1400)
      }
    },
    [noteFor, commit],
  )

  const openMatchChat = useCallback(() => {
    setMatchOverlay((id) => {
      if (id) {
        setChatWith(id)
        setTab('matches')
        setUnread((u) => ({ ...u, [id]: false }))
      }
      return null
    })
  }, [])

  const openChat = useCallback((id: string) => {
    setChatWith(id)
    setUnread((u) => ({ ...u, [id]: false }))
  }, [])

  const closeChat = useCallback(() => {
    setChatWith(null)
    setChatInput('')
  }, [])

  const pushChat = useCallback(
    (text: string) => {
      const id = chatWith
      if (!id) return
      const a = artistById(id) as Artist
      setChatInput('')
      setChatTyping(true)
      let sentCount = 0
      setThreads((t) => {
        const next = (t[id] || []).concat([{ from: 'me' as const, text }])
        sentCount = next.filter((m) => m.from === 'me').length - 1
        return { ...t, [id]: next }
      })
      setTimeout(() => {
        setChatTyping(false)
        const reply = a.replies[sentCount % a.replies.length]
        setThreads((t) => ({ ...t, [id]: (t[id] || []).concat([{ from: 'them', text: reply }]) }))
      }, 1100)
    },
    [chatWith],
  )

  const sendChat = useCallback(() => {
    const t = chatInput.trim()
    if (t) pushChat(t)
  }, [chatInput, pushChat])

  const pendingIds = useMemo(
    () => likesSent.map((l) => l.id).filter((id) => !matches.includes(id)),
    [likesSent, matches],
  )

  const unreadCount = useMemo(() => Object.values(unread).filter(Boolean).length, [unread])

  return {
    onboarding,
    setOnboarding,
    step,
    setStep,
    tab,
    setTab,
    seen,
    lastAction,
    pieceIdx,
    cyclePiece: cyclePiece,
    drag,
    setDrag,
    fly,
    filters,
    setFilters,
    clearFilters: () => setFilters(emptyFilters()),
    filtersOpen,
    setFiltersOpen,
    homeOpen,
    setHomeOpen,
    anyFilter,
    filtered,
    available,
    studioName,
    setStudioName,
    studioCity,
    setStudioCity,
    studioStyles,
    toggleStudioStyle: (v: string) => setStudioStyles((s) => toggleIn(s, v)),
    brief,
    setBrief,
    budget,
    setBudget,
    licensing,
    setLicensing,
    profileOpen,
    profileFor,
    openProfile,
    closeProfile: () => setProfileOpen(false),
    noteFor,
    noteText,
    setNoteText,
    dismissNote: () => setNoteFor(null),
    finishLike,
    pass,
    like,
    undo,
    resetDeck,
    likesSent,
    matches,
    pendingIds,
    threads,
    unread,
    unreadCount,
    matchOverlay,
    dismissMatch: () => setMatchOverlay(null),
    openMatchChat,
    chatWith,
    openChat,
    closeChat,
    chatInput,
    setChatInput,
    chatTyping,
    pushChat,
    sendChat,
    toggleFilterStyle: (v: string) => setFilters((f) => ({ ...f, styles: toggleIn(f.styles, v) })),
    toggleFilterMedium: (v: string) => setFilters((f) => ({ ...f, mediums: toggleIn(f.mediums, v) })),
  }
}

export type HangStore = ReturnType<typeof useHangStore>

const HangContext = createContext<HangStore | null>(null)

export function HangProvider({ children }: { children: ReactNode }) {
  const store = useHangStore()
  return <HangContext.Provider value={store}>{children}</HangContext.Provider>
}

export function useHang(): HangStore {
  const ctx = useContext(HangContext)
  if (!ctx) throw new Error('useHang must be used inside HangProvider')
  return ctx
}
