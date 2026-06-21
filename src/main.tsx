import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

type Scene = 'home' | 'country' | 'goodbadugly' | 'jazz' | 'ending'
type MusicMode = 'silent' | 'title' | 'gold' | 'trio'

const sceneOrder: Scene[] = ['home', 'country', 'goodbadugly', 'jazz', 'ending']
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`

const sceneLabels: Record<Scene, string> = {
  home: '导览',
  country: '01 / 信仰',
  goodbadugly: '02 / 类型',
  jazz: '03 / 表演',
  ending: '尾声',
}

class SoundEngine {
  context: AudioContext | null = null
  muted = true
  drone: { oscillator: OscillatorNode; gain: GainNode } | null = null

  unlock() {
    if (!this.context) this.context = new AudioContext()
    if (this.context.state === 'suspended') void this.context.resume()
    this.muted = false
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (muted) this.stopDrone()
  }

  tone(frequency: number, duration = 0.18, type: OscillatorType = 'sine', volume = 0.045) {
    if (this.muted || !this.context) return
    const now = this.context.currentTime
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, now)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain).connect(this.context.destination)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.04)
  }

  click(kind: 'metal' | 'stage' | 'soft' = 'soft') {
    if (kind === 'metal') {
      this.tone(720, 0.08, 'square', 0.035)
      window.setTimeout(() => this.tone(310, 0.22, 'sine', 0.028), 50)
    } else if (kind === 'stage') {
      this.tone(180, 0.18, 'triangle', 0.04)
      window.setTimeout(() => this.tone(260, 0.12, 'sine', 0.035), 72)
    } else this.tone(430, 0.09, 'sine', 0.025)
  }

  stopDrone() {
    if (!this.drone || !this.context) return
    const { oscillator, gain } = this.drone
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.4)
    window.setTimeout(() => oscillator.stop(), 450)
    this.drone = null
  }

  setAtmosphere(mode: MusicMode | 'desert' | 'jazz') {
    this.stopDrone()
    if (this.muted || !this.context || mode === 'silent') return
    const pitch = mode === 'desert' ? 52 : mode === 'jazz' ? 110 : mode === 'title' ? 128 : mode === 'gold' ? 164 : 76
    const now = this.context.currentTime
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = mode === 'jazz' ? 'triangle' : 'sine'
    oscillator.frequency.setValueAtTime(pitch, now)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.6)
    oscillator.connect(gain).connect(this.context.destination)
    oscillator.start()
    this.drone = { oscillator, gain }
  }
}

function App() {
  const audio = useRef(new SoundEngine())
  const [scene, setScene] = useState<Scene>('home')
  const [defense, setDefense] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [coinState, setCoinState] = useState<'ready' | 'spinning' | 'result'>('ready')
  const [explainClicks, setExplainClicks] = useState<string[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [musicMode, setMusicMode] = useState<MusicMode>('silent')
  const [aimed, setAimed] = useState<number | null>(null)
  const [standoff, setStandoff] = useState(false)
  const [day, setDay] = useState(0)
  const [applause, setApplause] = useState(0)

  const wakeSound = () => {
    if (!soundOn) {
      audio.current.unlock()
      setSoundOn(true)
    }
  }

  const go = (next: Scene) => {
    wakeSound()
    document.getElementById(next)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resetScene = () => {
    if (scene === 'country') {
      setCoinState('ready')
      setExplainClicks([])
    }
    if (scene === 'goodbadugly') {
      setSelectedCharacter(null)
      setSelectedLabel(null)
      setMusicMode('silent')
      setAimed(null)
      setStandoff(false)
    }
    if (scene === 'jazz') {
      setDay(0)
      setApplause(0)
    }
    audio.current.setAtmosphere('silent')
  }

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${(event.clientX / window.innerWidth) * 100}%`)
      document.documentElement.style.setProperty('--my', `${(event.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-scene]')]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setScene((visible.target as HTMLElement).dataset.scene as Scene)
      },
      { threshold: [0.35, 0.55, 0.75] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === '1') go('country')
      if (event.key === '2') go('goodbadugly')
      if (event.key === '3') go('jazz')
      if (event.key === 'Home') go('home')
      if (event.key.toLowerCase() === 'm') {
        wakeSound()
        const next = !soundOn
        setSoundOn(next)
        audio.current.setMuted(!next)
      }
      if (event.key.toLowerCase() === 'r') resetScene()
      if (event.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) void document.exitFullscreen()
        else void document.documentElement.requestFullscreen()
      }
      if (event.code === 'Space') {
        event.preventDefault()
        const index = sceneOrder.indexOf(scene)
        go(sceneOrder[Math.min(index + 1, sceneOrder.length - 1)])
      }
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [scene, soundOn])

  useEffect(() => {
    if (scene === 'country') audio.current.setAtmosphere('desert')
    if (scene === 'jazz') audio.current.setAtmosphere('jazz')
    if (scene !== 'country' && scene !== 'jazz' && scene !== 'goodbadugly') audio.current.setAtmosphere('silent')
  }, [scene, soundOn])

  const flipCoin = () => {
    wakeSound()
    setCoinState('spinning')
    audio.current.click('metal')
    window.setTimeout(() => {
      setCoinState('result')
      audio.current.tone(64, 0.7, 'sine', 0.045)
    }, 1700)
  }

  const chooseMusic = (mode: MusicMode) => {
    wakeSound()
    setMusicMode(mode)
    audio.current.setAtmosphere(mode)
    audio.current.click(mode === 'trio' ? 'metal' : 'soft')
  }

  const labelDetails = useMemo(() => {
    const all = [
      { title: 'THE GOOD', fact: '贪婪、投机，也会利用别人', question: '当“好人”也不纯粹，类型片还成立吗？' },
      { title: 'THE BAD', fact: '残忍，但稳定、清晰，像职业机器', question: '有时候“坏人”反而更符合类型预期。' },
      { title: 'THE UGLY', fact: '狼狈、贪婪、滑稽，却最有生命力', question: '边缘人物反而可能最像真实的人。' },
    ]
    return all.find((item) => item.title === selectedLabel)
  }, [selectedLabel])

  const dayActions = [
    ['眼药水', '他需要让自己看起来还能工作。'],
    ['药片', '他不是在恢复健康，而是在透支下一段表演。'],
    ['香烟', '自毁和风格，在他身上几乎分不开。'],
    ['排练', '生活不是生活，生活被他剪成舞台。'],
    ['掌声', '观众看到的是精彩，他付出的是身体。'],
    ['心电图', '表演越接近完成，身体越接近停机。'],
  ]

  return (
    <main className={defense ? 'app defense-mode' : 'app'}>
      <div className="film-grain" />
      <header className="topbar">
        <button className="wordmark" onClick={() => go('home')}>FILM / MECHANISMS</button>
        <div className="topbar-actions">
          <span className="scene-readout">{sceneLabels[scene]}</span>
          <button className={soundOn ? 'utility is-on' : 'utility'} onClick={() => { wakeSound(); const next = !soundOn; setSoundOn(next); audio.current.setMuted(!next) }}>
            {soundOn ? 'SOUND ON' : 'SOUND OFF'}
          </button>
          <button className={defense ? 'utility is-on' : 'utility'} onClick={() => setDefense(!defense)}>DEFENSE MODE</button>
        </div>
      </header>

      <aside className="progress-rail" aria-label="章节进度">
        {(['country', 'goodbadugly', 'jazz'] as Scene[]).map((item, index) => (
          <button key={item} className={scene === item ? 'rail-dot active' : 'rail-dot'} onClick={() => go(item)}>
            <span>0{index + 1}</span>
          </button>
        ))}
      </aside>

      <section id="home" data-scene="home" className="scene home-scene">
        <div className="scene-bg" style={{ backgroundImage: `url('${asset('home-cinema.png')}')` }} />
        <div className="vignette" />
        <div className="home-copy">
          <p className="eyebrow">INTERACTIVE FILM ESSAY / 2026</p>
          <h1>电影如何<br /><em>让世界运转</em></h1>
          <p className="lede">三部电影，三套机制：信仰、类型、表演。</p>
          <p className="intro">这不是电影资料站。<br />这是把电影课里的三个问题，做成三个可以操作的网页实验。</p>
          <button className="primary" onClick={() => go('country')}>进入放映 <i>↓</i></button>
        </div>
        <nav className="home-chapters" aria-label="章节入口">
          <button onClick={() => go('country')}>
            <span>01</span><b>一枚硬币</b><small>当上帝不再解释世界，人还能依靠什么？</small>
          </button>
          <button onClick={() => go('goodbadugly')}>
            <span>02</span><b>三角对峙</b><small>当标签不再可靠，类型片还如何成立？</small>
          </button>
          <button onClick={() => go('jazz')}>
            <span>03</span><b>一盏舞台灯</b><small>当人生将尽，表演为什么还要继续？</small>
          </button>
        </nav>
        <p className="scroll-cue">SCROLL TO ADVANCE <span>↓</span></p>
      </section>

      <section id="country" data-scene="country" className="scene chapter country-scene">
        <div className="scene-bg depth-bg" style={{ backgroundImage: `url('${asset('no-country-desert.png')}')` }} />
        <div className="chapter-shade country-shade" />
        <div className="chapter-intro">
          <p className="eyebrow">CHAPTER 01 / 信仰机制失效</p>
          <h2>《老无所依》<br /><em>世界不再解释自己</em></h2>
          <p className="lede">这不只是追杀片。它问的是：当世界不再被上帝、法律和经验解释，人还剩下什么？</p>
        </div>
        <aside className="knowledge-card">
          <span>你需要知道的三件事</span>
          <ol><li>一个男人捡到一箱钱，引来杀手。</li><li>一个老警长追查案件，却越来越无力。</li><li>电影没有给出传统正义结局。</li></ol>
        </aside>
        <div className="country-experiments">
          <article className="experiment coin-experiment">
            <div className="experiment-header"><span>实验一 / 选择</span><b>CALL IT.</b></div>
            <div className={coinState === 'spinning' ? 'coin spinning' : coinState === 'result' ? 'coin result' : 'coin'} aria-label="硬币"><span>◎</span></div>
            {coinState === 'ready' && <div className="choice-row"><button onClick={flipCoin}>正面</button><button onClick={flipCoin}>反面</button></div>}
            {coinState === 'spinning' && <p className="coin-prompt">选择正在离开你的手。</p>}
            {coinState === 'result' && <p className="result-copy">你做出了选择。<br /><strong>但这个选择没有让世界变得更公正。</strong></p>}
          </article>
          <article className={explainClicks.length >= 3 ? 'experiment explain-experiment complete' : 'experiment explain-experiment'}>
            <div className="experiment-header"><span>实验二 / 解释</span><b>让世界成立的三种说法</b></div>
            <div className="concepts">
              {['钱', '枪', '上帝'].map((word) => <button key={word} className={explainClicks.includes(word) ? 'selected' : ''} onClick={() => { wakeSound(); audio.current.click('metal'); setExplainClicks((now) => now.includes(word) ? now : [...now, word]) }}>{word}</button>)}
            </div>
            <div className="broken-lines"><i /><i /><i /></div>
            {explainClicks.length >= 3 ? <p className="result-copy"><strong>解释失败。</strong><br />警长真正失去的不是办案能力，而是他原本相信的那个世界。</p> : <p className="soft-copy">点击三个词，试着把它们连成一个能解释世界的闭环。</p>}
          </article>
        </div>
        <article className="lesson-card country-lesson"><span>我从课堂里理解到的东西</span><p>真正残酷的不是杀人，而是信仰的落空。警长面对的不是案件，而是一个无法再被上帝、法律、经验解释的世界。</p><button className="text-button" onClick={() => go('goodbadugly')}>继续：类型如何运转 <i>→</i></button></article>
      </section>

      <section id="goodbadugly" data-scene="goodbadugly" className={`scene chapter gbu-scene music-${musicMode}`}>
        <div className="scene-bg depth-bg" style={{ backgroundImage: `url('${asset('gbu-cemetery.png')}')` }} />
        <div className="chapter-shade gbu-shade" />
        <div className="chapter-intro">
          <p className="eyebrow">CHAPTER 02 / 类型机制运转</p>
          <h2>《黄金三镖客》<br /><em>规则被使用，也被弄脏</em></h2>
          <p className="lede">类型片让观众预先知道规则；这部电影则把那些规则摆上台面，再让它们失效。</p>
        </div>
        <aside className="knowledge-card gbu-knowledge"><span>西部片的预设</span><ol><li>荒野意味着法律缺席。</li><li>牛仔会决斗。</li><li>好人与坏人通常能被区分。</li></ol></aside>
        <div className="gbu-experiments">
          <article className="experiment label-experiment">
            <div className="experiment-header"><span>实验一 / 贴标签</span><b>标签够用吗？</b></div>
            <div className="character-row">
              {['A', 'B', 'C'].map((person, index) => <button key={person} onClick={() => { wakeSound(); audio.current.click('soft'); setSelectedCharacter(index); setSelectedLabel(null) }} className={selectedCharacter === index ? 'character selected' : 'character'}><i /><span>{person}</span></button>)}
            </div>
            {selectedCharacter !== null ? <div className="label-choices">{['THE GOOD', 'THE BAD', 'THE UGLY'].map((label) => <button key={label} onClick={() => { audio.current.click('metal'); setSelectedLabel(label) }}>{label}</button>)}</div> : <p className="soft-copy">选择一个剪影，再给他贴上熟悉的类型标签。</p>}
            {labelDetails && <div className="label-detail"><b>{labelDetails.title}</b><p>实际行为：{labelDetails.fact}</p><em>{labelDetails.question}</em></div>}
          </article>
          <article className="experiment music-experiment">
            <div className="experiment-header"><span>实验二 / 同画面，不同音乐</span><b>音乐正在改写叙事</b></div>
            <div className="music-console">
              {([
                ['silent', '无音乐', '只剩环境。事件没有被类型化。'],
                ['title', 'TITLE', '节奏建立一个迅速可辨的类型世界。'],
                ['gold', 'GOLD', '欲望被推进，命运感被放大。'],
                ['trio', 'THE TRIO', '音乐拖长时间，让等待成为事件。'],
              ] as [MusicMode, string, string][]).map(([mode, title, note]) => <button key={mode} className={musicMode === mode ? 'mode active' : 'mode'} onClick={() => chooseMusic(mode)}><span>{title}</span><small>{note}</small></button>)}
            </div>
            <div className="music-visual"><span className="music-line one" /><span className="music-line two" /><span className="music-line three" /><p>{musicMode === 'silent' ? '静下来，才会意识到：紧张感原来不是天然存在。' : musicMode === 'title' ? '音乐帮助类型世界被迅速建立。' : musicMode === 'gold' ? '它不改变事件，却让寻找与欲望变得宏大。' : '开枪之前的等待，被音乐拉长成了整个世界。'}</p></div>
            <p className="music-thesis">音乐不改变事件，<strong>却改变你理解事件的方式。</strong></p>
          </article>
          <article className="experiment standoff-experiment">
            <div className="experiment-header"><span>实验三 / 等待</span><b>对峙不在开枪</b></div>
            <div className="standoff-stage">
              {[0, 1, 2].map((figure) => <button key={figure} className={aimed === figure ? `target target-${figure} aimed` : `target target-${figure}`} onMouseEnter={() => { setAimed(figure); if (soundOn) audio.current.tone(190 + figure * 50, 0.09, 'sine', 0.018) }} onClick={() => { wakeSound(); setAimed(figure); setStandoff(true); audio.current.click('metal') }}><i /><span>{['他在等', '他在瞄准', '他还没动'][figure]}</span></button>)}
              <div className="reticle" />
            </div>
            {standoff ? <p className="result-copy">你瞄准了他。他瞄准了另一个人。<br /><strong>另一个人正在等你先动。</strong></p> : <p className="soft-copy">移动鼠标，选择一个人。这里没有真正的开枪。</p>}
          </article>
        </div>
        <article className="lesson-card gbu-lesson"><span>我从课堂里理解到的东西</span><p>类型不是低级套路，而是一套观众熟悉的规则。导演可以利用规则制造期待、反转和快感，再让好人、坏人、丑人这些标签变得根本不够用。</p><button className="text-button" onClick={() => go('jazz')}>继续：表演如何吞噬人生 <i>→</i></button></article>
      </section>

      <section id="jazz" data-scene="jazz" className="scene chapter jazz-scene" style={{ '--day': day, '--applause': applause } as CSSProperties}>
        <div className="scene-bg depth-bg" style={{ backgroundImage: `url('${asset('jazz-backstage.png')}')` }} />
        <div className="chapter-shade jazz-shade" />
        <div className="spotlight" />
        <div className="chapter-intro">
          <p className="eyebrow">CHAPTER 03 / 表演机制吞噬人生</p>
          <h2>《爵士春秋》<br /><em>把崩溃编进一次演出</em></h2>
          <p className="lede">这是一部歌舞片，但它把欲望、工作、崩溃与死亡都变成了表演的一部分。</p>
        </div>
        <aside className="knowledge-card jazz-knowledge"><span>你需要知道的三件事</span><ol><li>主角是一个近乎自毁的舞台导演。</li><li>工作、疾病与死亡都被他做成表演。</li><li>它的核心不是快乐，而是燃烧。</li></ol></aside>
        <div className="jazz-experiments">
          <article className="experiment day-experiment">
            <div className="experiment-header"><span>实验一 / 开始一天</span><b>再多一点，就能上台</b></div>
            <div className="mirror"><div className="mirror-copy">{day > 0 ? <><b>{dayActions[day - 1][0]}</b><p>{dayActions[day - 1][1]}</p></> : <p>镜子里的你，正在等待又一次开始。</p>}</div><div className="pulse-line"><i style={{ width: `${Math.max(18, 100 - day * 13)}%` }} /></div></div>
            <button className="primary stage-primary" onClick={() => { wakeSound(); const next = Math.min(day + 1, 6); setDay(next); audio.current.click('stage'); audio.current.tone(95 + next * 14, 0.24, 'triangle', 0.035) }}>{day < 6 ? '开始一天' : '灯还亮着'}</button>
          </article>
          <article className="experiment applause-experiment">
            <div className="experiment-header"><span>实验二 / 反馈回路</span><b>APPLAUSE</b></div>
            <button className="applause-button" onClick={() => { wakeSound(); const next = Math.min(applause + 1, 6); setApplause(next); audio.current.click('stage'); audio.current.tone(190 + next * 18, 0.16, 'triangle', 0.038) }}>APPLAUSE <span>× {applause}</span></button>
            <div className="applause-meter"><span style={{ height: `${25 + applause * 11}%` }} /><span style={{ height: `${40 + applause * 9}%` }} /><span style={{ height: `${18 + applause * 13}%` }} /><span style={{ height: `${35 + applause * 10}%` }} /><span style={{ height: `${22 + applause * 12}%` }} /></div>
            <p className={applause >= 5 ? 'result-copy applause-result' : 'soft-copy'}>{applause >= 5 ? <>观众越鼓掌，<br /><strong>表演者越接近献祭。</strong></> : '每一次掌声，舞台更亮；心电图也更弱。'}</p>
          </article>
        </div>
        <article className="lesson-card jazz-lesson"><span>我从课堂里理解到的东西</span><p>歌舞不一定只是热闹。它也可以是一种哲学：人明知道自己会崩溃，还是把崩溃编排成一次演出。爵士精神不是拒绝死亡，而是把死亡也编进最后一支舞。</p><button className="text-button" onClick={() => go('ending')}>进入尾声 <i>→</i></button></article>
      </section>

      <section id="ending" data-scene="ending" className="scene ending-scene">
        <div className="ending-glow" />
        <p className="eyebrow">END OF SCREENING</p>
        <h2>电影不是答案。<br /><em>电影是一种让世界运转的方式。</em></h2>
        <p className="ending-copy">有的世界靠信仰维持。有的世界靠类型规则维持。有的世界靠表演维持。厉害的电影，让我们看见这些机制如何运转，也如何崩塌。</p>
        <div className="final-lines"><p><b>《老无所依》</b> 当上帝沉默，人如何面对不可解释的恶。</p><p><b>《黄金三镖客》</b> 类型片是一套可以被操纵、污染、反讽的规则。</p><p><b>《爵士春秋》</b> 人生可以被排练、即兴，直到最后一秒。</p></div>
        <button className="primary replay" onClick={() => go('home')}>REPLAY THE WORLD <i>↑</i></button>
        <p className="key-help">快捷键：1 / 2 / 3 跳章 · Space 下一幕 · M 静音 · R 重置 · F 全屏</p>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
