import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

type Chapter = 'home' | 'country' | 'gbu' | 'jazz' | 'ending'
type Cue = 'silence' | 'wind' | 'coin' | 'dream' | 'main-title' | 'soldier' | 'gold' | 'trio' | 'backstage' | 'showtime' | 'applause' | 'white'

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`

type Frame = {
  id: string
  chapter: Chapter
  chapterName?: string
  number?: string
  image: string
  kicker?: string
  line: string
  subline?: string
  cue: Cue
  variant: string
}

const frames: Frame[] = [
  { id: 'home', chapter: 'home', image: asset('home-cinema.png'), kicker: 'AN AUDIOVISUAL FILM EXPERIENCE', line: '电影如何\n让世界运转', subline: 'Push the world forward.', cue: 'silence', variant: 'home' },
  { id: 'country-01', chapter: 'country', chapterName: '《老无所依》', number: '01 / 05', image: asset('no-country-desert.png'), kicker: 'NO COUNTRY FOR OLD MEN', line: '这片土地很残酷。', subline: 'And it does not explain itself.', cue: 'wind', variant: 'country-horizon' },
  { id: 'country-02', chapter: 'country', number: '02 / 05', image: asset('country-coin-night.png'), kicker: 'A SMALL DECISION', line: 'CALL IT.', subline: 'The coin is already listening.', cue: 'coin', variant: 'country-coin' },
  { id: 'country-03', chapter: 'country', number: '03 / 05', image: asset('country-door-fire.png'), kicker: 'AFTER THE DOOR', line: '有些房间，\n不再给出答案。', cue: 'dream', variant: 'country-door' },
  { id: 'country-04', chapter: 'country', number: '04 / 05', image: asset('no-country-desert.png'), kicker: 'THE OLD WORLD', line: '老的不是人。', subline: '是一种理解世界的方式。', cue: 'wind', variant: 'country-sheriff' },
  { id: 'country-05', chapter: 'country', number: '05 / 05', image: asset('country-door-fire.png'), kicker: 'A DREAM OF FIRE', line: '远处有火。', subline: '然后什么也没有发生。', cue: 'dream', variant: 'country-fire' },
  { id: 'gbu-01', chapter: 'gbu', chapterName: '《黄金三镖客》', number: '01 / 06', image: asset('gbu-rider.png'), kicker: 'THE GOOD, THE BAD AND THE UGLY', line: '荒野就是规则。', subline: 'MAIN TITLE', cue: 'main-title', variant: 'gbu-rider' },
  { id: 'gbu-02', chapter: 'gbu', number: '02 / 06', image: asset('gbu-eye-hand.png'), kicker: 'ONE LOOK / ONE MOVE', line: 'Every eye\nis a horizon.', cue: 'main-title', variant: 'gbu-eye' },
  { id: 'gbu-03', chapter: 'gbu', number: '03 / 06', image: asset('gbu-cemetery.png'), kicker: 'THE STORY OF A SOLDIER', line: '屋外，音乐还在继续。', subline: 'The waiting gets louder.', cue: 'soldier', variant: 'gbu-soldier' },
  { id: 'gbu-04', chapter: 'gbu', number: '04 / 06', image: asset('gbu-rider.png'), kicker: 'THE DESERT', line: 'Heat turns distance\ninto a promise.', cue: 'soldier', variant: 'gbu-desert' },
  { id: 'gbu-05', chapter: 'gbu', number: '05 / 06', image: asset('gbu-gold-run.png'), kicker: 'THE ECSTASY OF GOLD', line: '欲望开始奔跑。', subline: 'The whole horizon is on fire.', cue: 'gold', variant: 'gbu-gold' },
  { id: 'gbu-06', chapter: 'gbu', number: '06 / 06', image: asset('gbu-cemetery.png'), kicker: 'THE TRIO', line: '真正的事件，\n是等待。', cue: 'trio', variant: 'gbu-trio' },
  { id: 'jazz-01', chapter: 'jazz', chapterName: '《爵士春秋》', number: '01 / 06', image: asset('jazz-backstage.png'), kicker: 'ALL THAT JAZZ', line: 'It’s showtime, folks.', cue: 'backstage', variant: 'jazz-mirror' },
  { id: 'jazz-02', chapter: 'jazz', number: '02 / 06', image: asset('jazz-backstage.png'), kicker: 'THE BODY GETS READY', line: 'One more thing.\nOne more night.', cue: 'backstage', variant: 'jazz-body' },
  { id: 'jazz-03', chapter: 'jazz', number: '03 / 06', image: asset('jazz-stage.png'), kicker: 'REHEARSAL', line: '生活被剪成了演出。', cue: 'showtime', variant: 'jazz-rehearsal' },
  { id: 'jazz-04', chapter: 'jazz', number: '04 / 06', image: asset('jazz-stage.png'), kicker: 'TAKE OFF WITH US', line: 'Brighter. Faster.\nAgain.', cue: 'showtime', variant: 'jazz-showtime' },
  { id: 'jazz-05', chapter: 'jazz', number: '05 / 06', image: asset('jazz-stage.png'), kicker: 'APPLAUSE', line: '观众鼓掌。\n身体熄灭。', cue: 'applause', variant: 'jazz-applause' },
  { id: 'jazz-06', chapter: 'jazz', number: '06 / 06', image: asset('jazz-stage.png'), kicker: 'ONE LAST LINE', line: 'Then the line\nbecomes light.', cue: 'white', variant: 'jazz-white' },
  { id: 'ending', chapter: 'ending', image: asset('home-cinema.png'), kicker: 'END OF SCREENING', line: '电影没有结束。', subline: '它只是重新开始运转。', cue: 'silence', variant: 'ending' },
]

const track = (name: string) => `${import.meta.env.BASE_URL}audio/${name}.mp3`

// Music is bound to the chapter (film), not the scroll position: one playlist per film that keeps
// playing while you stay in that film, advancing track-to-track on its own and only crossfading
// when you cross into the next film. 老无所依 has no licensed track — it uses a wind bed instead.
const chapterPlaylists: Record<Chapter, string[]> = {
  home: [],
  country: [],
  gbu: ['gbu-main-title', 'gbu-story-of-a-soldier', 'gbu-ecstasy-of-gold', 'gbu-trio'].map(track),
  jazz: ['jazz-on-broadway', 'jazz-take-off-with-us', 'jazz-everything-old-is-new-again', 'jazz-bye-bye-life'].map(track),
  ending: [],
}

class AudioDirector {
  context: AudioContext | null = null
  ambientNodes: AudioScheduledSourceNode[] = []
  gain: GainNode | null = null
  muted = true
  currentAudio: HTMLAudioElement | null = null
  available = new Set<string>()
  probed = false
  currentChapter: Chapter | null = null
  lastChapter: Chapter | null = null
  playlist: string[] = []
  playlistIndex = 0

  unlock() {
    if (!this.context) this.context = new AudioContext()
    if (this.context.state === 'suspended') void this.context.resume()
    this.muted = false
    void this.probeSources()
  }

  // Probe public/audio once on first unlock. HTTP HEAD keeps the console clean: a missing file
  // is a quiet 404 response (not a thrown resource error), so absent tracks just stay on texture.
  async probeSources() {
    if (this.probed) return
    this.probed = true
    const sources = [...new Set(Object.values(chapterPlaylists).flat())]
    await Promise.all(sources.map(async (src) => {
      try {
        const res = await fetch(src, { method: 'HEAD' })
        const type = res.headers.get('content-type') || ''
        // Require a real audio response. Dev servers answer missing files with an index.html
        // SPA fallback (200 text/html); only audio/* (or octet-stream) is a genuine track.
        if (res.ok && /audio|octet-stream/i.test(type)) this.available.add(src)
      } catch {
        /* offline or blocked — keep the quiet wind bed */
      }
    }))
    // Tracks were unknown when sound first switched on; now replay the current film for real.
    if (!this.muted && this.lastChapter) { this.currentChapter = null; this.playChapter(this.lastChapter) }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (muted) { this.stop(); this.currentChapter = null }
  }

  stop() {
    const ctx = this.context
    const gain = this.gain
    const ambient = this.ambientNodes
    const currentAudio = this.currentAudio
    this.ambientNodes = []
    this.gain = null
    this.currentAudio = null
    if (gain && ctx) gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
    if (ambient.length) window.setTimeout(() => {
      ambient.forEach((node) => {
        try { node.stop() } catch { /* already stopped */ }
        try { node.disconnect() } catch { /* noop */ }
      })
      try { gain?.disconnect() } catch { /* noop */ }
    }, 560)
    if (currentAudio) this.fade(currentAudio, 0, 500, () => currentAudio.pause())
  }

  fade(audio: HTMLAudioElement, target: number, duration: number, done?: () => void) {
    const start = audio.volume
    const started = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - started) / duration, 1)
      audio.volume = start + (target - start) * p
      if (p < 1) requestAnimationFrame(tick)
      else done?.()
    }
    requestAnimationFrame(tick)
  }

  // Switch music only when the film changes — never on scroll within the same film.
  playChapter(chapter: Chapter) {
    this.lastChapter = chapter
    if (this.muted || !this.context) return
    if (chapter === this.currentChapter) return
    this.currentChapter = chapter
    this.stop()
    const tracks = chapterPlaylists[chapter].filter((src) => this.available.has(src))
    if (tracks.length) {
      this.playlist = tracks
      this.playlistIndex = 0
      this.playTrack()
    } else if (chapter === 'country') {
      this.windBed()
    }
    // home / ending (or a film with no local tracks) stay silent
  }

  playTrack() {
    if (this.muted || !this.context) return
    const src = this.playlist[this.playlistIndex]
    const next = new Audio(src)
    next.volume = 0
    this.currentAudio = next
    // When a track ends, advance through the film's playlist and loop — no scroll involved.
    next.addEventListener('ended', () => {
      if (this.currentAudio !== next) return
      this.playlistIndex = (this.playlistIndex + 1) % this.playlist.length
      this.playTrack()
    })
    void next.play().then(() => this.fade(next, 0.62, 850)).catch(() => {})
  }

  // 老无所依 has no licensed track — synthesize a desert sound bed: filtered-noise wind that
  // gusts over a low drone, swelling in on entrance so the opening feels immersive, not bare.
  windBed() {
    const ctx = this.context!
    const now = ctx.currentTime

    // Master envelope: a slow swell-in as you arrive in the chapter.
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(1, now + 2.6)
    master.connect(ctx.destination)
    this.gain = master

    // Wind = looped white noise through a bandpass whose centre drifts (gusts) with an LFO.
    const noise = ctx.createBufferSource()
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    noise.buffer = buffer
    noise.loop = true
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.setValueAtTime(470, now)
    band.Q.setValueAtTime(0.85, now)
    const windGain = ctx.createGain()
    windGain.gain.setValueAtTime(0.07, now)
    noise.connect(band).connect(windGain).connect(master)

    // Gust LFO sweeps the band centre (the whistle rising and falling); swell LFO breathes volume.
    const gust = ctx.createOscillator()
    gust.frequency.setValueAtTime(0.06, now)
    const gustDepth = ctx.createGain()
    gustDepth.gain.setValueAtTime(330, now)
    gust.connect(gustDepth).connect(band.frequency)
    const swell = ctx.createOscillator()
    swell.frequency.setValueAtTime(0.1, now)
    const swellDepth = ctx.createGain()
    swellDepth.gain.setValueAtTime(0.04, now)
    swell.connect(swellDepth).connect(windGain.gain)

    // A low desolation drone underneath the wind — emptiness, dread.
    const drone = ctx.createOscillator()
    drone.type = 'sine'
    drone.frequency.setValueAtTime(44, now)
    const droneGain = ctx.createGain()
    droneGain.gain.setValueAtTime(0.05, now)
    drone.connect(droneGain).connect(master)

    noise.start(now)
    gust.start(now)
    swell.start(now)
    drone.start(now)
    this.ambientNodes = [noise, gust, swell, drone]
  }

  accent(kind: 'metal' | 'light' | 'beat' = 'light') {
    if (this.muted || !this.context) return
    const values = kind === 'metal' ? [740, 330] : kind === 'beat' ? [118, 168] : [430, 540]
    values.forEach((pitch, index) => {
      window.setTimeout(() => {
        if (!this.context || this.muted) return
        const osc = this.context.createOscillator()
        const gain = this.context.createGain()
        const now = this.context.currentTime
        osc.type = kind === 'metal' ? 'square' : 'sine'
        osc.frequency.setValueAtTime(pitch, now)
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
        osc.connect(gain).connect(this.context.destination)
        osc.start(now); osc.stop(now + .23)
      }, index * 75)
    })
  }
}

function App() {
  const audio = useRef(new AudioDirector())
  const [activeIndex, setActiveIndex] = useState(0)
  const [soundOn, setSoundOn] = useState(false)
  const [defense, setDefense] = useState(false)
  const [called, setCalled] = useState(false)
  const [flash, setFlash] = useState(false)
  const active = frames[activeIndex]
  const chapterIndex = frames.filter((frame) => frame.chapter === active.chapter).findIndex((frame) => frame.id === active.id) + 1
  const chapterCount = frames.filter((frame) => frame.chapter === active.chapter).length

  const wake = () => {
    if (!soundOn) {
      audio.current.unlock()
      setSoundOn(true)
    }
  }

  const go = (index: number) => {
    wake()
    document.getElementById(frames[index].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const firstFrame = (chapter: Chapter) => frames.findIndex((frame) => frame.chapter === chapter)

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${(event.clientX / window.innerWidth) * 100}%`)
      document.documentElement.style.setProperty('--my', `${(event.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const targets = [...document.querySelectorAll<HTMLElement>('[data-frame]')]
    const observer = new IntersectionObserver((entries) => {
      const strongest = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (strongest) setActiveIndex(Number((strongest.target as HTMLElement).dataset.index))
    }, { threshold: [0.48, 0.64, 0.82] })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (soundOn) audio.current.playChapter(active.chapter)
  }, [active.chapter, soundOn])

  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (event.key === '1') go(firstFrame('country'))
      if (event.key === '2') go(firstFrame('gbu'))
      if (event.key === '3') go(firstFrame('jazz'))
      if (event.key === 'Home') go(0)
      if (event.code === 'Space') { event.preventDefault(); go(Math.min(activeIndex + 1, frames.length - 1)) }
      if (event.key.toLowerCase() === 'm') {
        const next = !soundOn
        if (next) wake()
        setSoundOn(next)
        audio.current.setMuted(!next)
      }
      if (event.key.toLowerCase() === 'r') go(activeIndex)
      if (event.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen()
      }
    }
    window.addEventListener('keydown', keys)
    return () => window.removeEventListener('keydown', keys)
  }, [activeIndex, soundOn])

  const currentScene = useMemo(() => `${active.chapter} ${active.variant}`, [active])

  const callIt = () => {
    wake()
    setCalled(true)
    setFlash(true)
    audio.current.accent('metal')
    window.setTimeout(() => setFlash(false), 480)
  }

  return (
    <main className={defense ? `app defense ${currentScene}` : `app ${currentScene}`}>
      <div className={flash ? 'flash active' : 'flash'} />
      <div className="grain" />
      <div className={`pointer-world pointer-${active.chapter}`}><i /></div>
      <header className="masthead">
        <button className="masthead-mark" onClick={() => go(0)}>FILM / 03</button>
        <div className="masthead-meta">
          {active.number && <span>{active.number}</span>}
          <button onClick={() => { const next = !soundOn; if (next) wake(); setSoundOn(next); audio.current.setMuted(!next) }}>{soundOn ? 'SOUND / ON' : 'SOUND / OFF'}</button>
          <button className={defense ? 'active' : ''} onClick={() => setDefense(!defense)}>DEFENSE</button>
        </div>
      </header>

      {frames.map((frame, index) => (
        <section
          key={frame.id}
          id={frame.id}
          data-frame
          data-index={index}
          className={`journey-frame ${frame.chapter} ${frame.variant} ${index === activeIndex ? 'is-active' : ''}`}
          onClick={() => { if (index !== 0) { wake(); audio.current.accent(frame.chapter === 'jazz' ? 'beat' : 'light') } }}
        >
          <img className="image-plane" src={frame.image} alt="" aria-hidden="true" draggable={false} />
          <img className="far-plane" src={frame.image} alt="" aria-hidden="true" draggable={false} />
          <div className="frame-shade" />
          <div className="dust-layer" />
          <div className="foreground-layer" aria-hidden="true"><i /><i /><i /></div>
          <div className="frame-copy">
            {frame.chapterName && <p className="chapter-name">{frame.chapterName}</p>}
            {frame.kicker && <p className="kicker">{frame.kicker}</p>}
            <h1>{frame.line.split('\n').map((part, idx) => <span key={part}>{part}{idx < frame.line.split('\n').length - 1 && <br />}</span>)}</h1>
            {frame.subline && <p className="subline">{frame.id === 'country-02' && called ? 'It was never yours to decide.' : frame.subline}</p>}
          </div>
          {frame.id === 'home' && <button className="enter" onClick={(event) => { event.stopPropagation(); go(1) }}>ENTER THE SCREEN <i>↓</i></button>}
          {frame.id === 'country-02' && <button className={called ? 'coin-trigger called' : 'coin-trigger'} onClick={(event) => { event.stopPropagation(); callIt() }}><span>◎</span><b>{called ? 'IT HAS SPOKEN' : 'CALL IT'}</b></button>}
          {frame.id === 'gbu-06' && <div className="trio-points" aria-hidden="true"><i /><i /><i /></div>}
          {frame.id === 'jazz-06' && <div className="white-line" aria-hidden="true" />}
          {frame.chapter !== 'home' && frame.chapter !== 'ending' && <p className="scroll-whisper">SCROLL / LET THE SHOT BREATHE</p>}
          {frame.id === 'ending' && <button className="enter replay" onClick={() => go(0)}>REPLAY THE WORLD <i>↑</i></button>}
        </section>
      ))}

      {active.chapter !== 'home' && active.chapter !== 'ending' && <nav className="chapter-nav" aria-label="chapter navigation">
        {(['country', 'gbu', 'jazz'] as Chapter[]).map((chapter, index) => <button key={chapter} className={active.chapter === chapter ? 'active' : ''} onClick={() => go(firstFrame(chapter))}>0{index + 1}</button>)}
      </nav>}
      <p className="progress-readout">{active.chapter === 'home' ? '00 / 03' : active.chapter === 'ending' ? 'END' : `${String(chapterIndex).padStart(2, '0')} / ${String(chapterCount).padStart(2, '0')}`}</p>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
