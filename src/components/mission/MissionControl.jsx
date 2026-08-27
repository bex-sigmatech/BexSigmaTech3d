import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter, aiVoice } from '../../audio/AIVoiceEngine'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { SECTOR_ARTICLES } from '../../data/sectorArticles'
import MissionHoloModel from './MissionHoloModel'
import '../../styles/missionControl.css'

/* ==========================================================================
   BEX SIGMA TECH — IRON MAN MISSION CONTROL & JARVIS COMMAND HUB
   ========================================================================== */

const ALL_SECTORS = [
  { id: 'mission_control', name: 'Mission Control', icon: '⚡', badge: 'STARK CORE', theme: 'classic' },
  { id: 'web_dev', name: 'Web Development', icon: '🌐', badge: 'JARVIS 3D', theme: 'jarvis' },
  { id: 'ai_auto', name: 'AI Automation', icon: '🤖', badge: 'NANO AGENTS', theme: 'emerald' },
  { id: 'cloud', name: 'Cloud Systems', icon: '☁️', badge: 'ORBITAL MESH', theme: 'jarvis' },
  { id: 'cyber', name: 'Cyber Security', icon: '🛡️', badge: 'MARK SHIELD', theme: 'stealth' },
  { id: 'analytics', name: 'Analytics & BI', icon: '📈', badge: 'STARK HUD', theme: 'classic' },
  { id: 'ui_ux', name: 'UI / UX Spatial', icon: '🎨', badge: 'HOLO VISION', theme: 'quantum' },
  { id: 'marketing', name: 'Digital Growth', icon: '🎯', badge: 'NEURAL ADS', theme: 'emerald' },
  { id: 'finance', name: 'Finance Matrix', icon: '💳', badge: 'STARK LEDGER', theme: 'classic' },
  { id: 'innovation', name: 'Innovation Lab', icon: '🔬', badge: 'R&D ARMORY', theme: 'quantum' },
]

const SERVICE_ICONS = ['⬡', '◈', '⬢', '✦', '⚡', '🦾', '🛡️', '⚙️']

const ACCENT_PALETTES = [
  { color: '#00d4ff', glow: 'rgba(0,212,255,0.25)', border: 'rgba(0,212,255,0.45)' },
  { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)', border: 'rgba(245,158,11,0.45)' },
  { color: '#ef4444', glow: 'rgba(239,68,68,0.25)', border: 'rgba(239,68,68,0.45)' },
  { color: '#34d399', glow: 'rgba(52,211,153,0.25)', border: 'rgba(52,211,153,0.45)' },
  { color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', border: 'rgba(167,139,250,0.45)' },
]

function AnimatedCounter({ value, duration = 1400 }) {
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    const numMatch = value.match(/[\d.]+/)
    if (!numMatch) {
      setDisplay(value)
      return
    }
    const end = parseFloat(numMatch[0])
    const prefix = value.slice(0, value.indexOf(numMatch[0]))
    const suffix = value.slice(value.indexOf(numMatch[0]) + numMatch[0].length)
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      const formatted = Number.isInteger(end) ? Math.round(start) : start.toFixed(1)
      setDisplay(`${prefix}${formatted}${suffix}`)
      if (start >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [value, duration])
  return <span>{display}</span>
}

export default function MissionControl() {
  const { activeMission, setActiveMission, closeMissionBriefing, startMission, userName, navigateToSector } = useStore()
  const [mounted, setMounted] = useState(false)
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null)
  const [isNarrating, setIsNarrating] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  // 3D Iron Man Viewport Interactive States
  const [modelType, setModelType] = useState('helmet') // 'helmet' | 'reactor' | 'armor'
  const [colorTheme, setColorTheme] = useState('classic') // 'classic' | 'jarvis' | 'stealth' | 'quantum' | 'emerald'
  const [wireframe, setWireframe] = useState(false)
  const [exploded, setExploded] = useState(false)
  const [scanTrigger, setScanTrigger] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  // Estimator Slider State
  const [projectScale, setProjectScale] = useState(3) // 1 to 5 scale

  // Terminal Console State
  const [terminalLogs, setTerminalLogs] = useState([
    'JARVIS PROTOCOL v8.5 [MARK LXXXV ONLINE]',
    'ARC REACTOR OUTPUT: 100% NOMINAL · 3 GJ/s',
    'NANOTECH ARMOR INTEGRITY: OPTIMAL ZERO-DEFECT',
    'HUD DIAGNOSTICS: STARK SATELLITE LINK SYNCED',
    'READY FOR COMMANDER DIRECTIVES...',
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [diagnosticRunning, setDiagnosticRunning] = useState(false)
  const termBodyRef = useRef(null)

  // Current active sector article
  const currentSectorId = activeMission?.id || 'mission_control'
  const article = SECTOR_ARTICLES[currentSectorId] || SECTOR_ARTICLES['mission_control']

  // Sync color theme with current sector
  useEffect(() => {
    const matched = ALL_SECTORS.find((s) => s.id === currentSectorId)
    if (matched) {
      setColorTheme(matched.theme)
    }
  }, [currentSectorId])

  useEffect(() => {
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [currentSectorId])

  // Real-time UTC Timecode Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC')
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-scroll terminal on new output
  useEffect(() => {
    if (termBodyRef.current) {
      termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight
    }
  }, [terminalLogs])

  // Sector Switching
  const handleSelectSector = (secId) => {
    cinemaAudio.playSectorTransition()
    if (secId === 'web_dev') {
      navigateToSector('web_dev')
      return
    }
    if (SECTOR_ARTICLES[secId]) {
      setActiveMission({ id: secId, title: SECTOR_ARTICLES[secId].title })
    }
    setTerminalLogs((prev) => [
      ...prev.slice(-16),
      `[JARVIS] RE-CONFIGURING PROTOCOLS FOR SECTOR -> ${secId.toUpperCase()}`,
    ])
  }

  // Trigger Unibeam / Repulsor Pulse
  const handleUnibeamPulse = () => {
    cinemaAudio.playAccessGrantedChime()
    setScanTrigger(true)
    setTimeout(() => setScanTrigger(false), 2400)
    setTerminalLogs((prev) => [
      ...prev.slice(-16),
      `[REPULSOR] UNIBEAM PLASMA DISCHARGE EXECUTED · TARGETING CALIBRATED`,
    ])
  }

  // Start Mission / Launch
  const handleStartMission = () => {
    cinemaAudio.playAccessGrantedChime()
    voiceEmitter.emit('MISSION_STARTED')
    startMission()
  }

  const handleClose = () => {
    cinemaAudio.playSectorTransition()
    closeMissionBriefing()
  }

  // AI Speech narration for briefing
  const toggleNarration = () => {
    cinemaAudio.playOrbSelect()
    if (isNarrating) {
      aiVoice.stop()
      setIsNarrating(false)
    } else {
      setIsNarrating(true)
      const textToSpeak = `${article.title}. ${article.subtitle}. ${article.overview}`
      aiVoice.speak(textToSpeak, () => setIsNarrating(false))
    }
  }

  // Diagnostic Audit
  const runDiagnostics = () => {
    setDiagnosticRunning(true)
    cinemaAudio.playBootBeep()
    setTerminalLogs((prev) => [...prev, '⚡ RUNNING JARVIS MARK LXXXV SUIT & SECTOR AUDIT...'])

    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, '✓ SYNCHRONIZING 10 GLOBAL STARK NODES: 0.4ms'])
      cinemaAudio.playScrollTransition()
    }, 500)

    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, '✓ ARC REACTOR UNIBEAM CONFINEMENT: 100% STABLE'])
      cinemaAudio.playScrollTransition()
    }, 1100)

    setTimeout(() => {
      setTerminalLogs((prev) => [...prev, '✓ AUDIT COMPLETE: SUIT LOCKED & ARMED. ZERO ANOMALIES.'])
      cinemaAudio.playAccessGrantedChime()
      setDiagnosticRunning(false)
    }, 1800)
  }

  // Terminal command executor
  const handleTerminalSubmit = (e) => {
    e.preventDefault()
    if (!terminalInput.trim()) return
    const cmd = terminalInput.trim().toLowerCase()
    const log = `> ${terminalInput}`
    let resp = `Command unrecognized: "${cmd}". Try: help, status, unibeam, test, helmet, clear`

    if (cmd === 'help') resp = 'JARVIS COMMANDS: status | ceo | unibeam | test | helmet | reactor | armor | deploy | clear'
    else if (cmd === 'status') resp = 'STATUS: MARK 85 NANOTECH ONLINE. LATENCY: 0.4ms. POWER: 100%'
    else if (cmd === 'ceo' || cmd === 'founder' || cmd === 'hariharan' || cmd === 'contact') {
      resp = 'BEX SIGMA TECH FOUNDER & CEO: Hariharan.D · Email: bexsigmatech@gmail.com · DIRECT LINE CONNECTED.'
    } else if (cmd === 'unibeam' || cmd === 'fire' || cmd === 'scan') {
      handleUnibeamPulse()
      resp = 'FIRING CHEST UNIBEAM REPULSOR EMITTER...'
    } else if (cmd === 'helmet') {
      setModelType('helmet')
      resp = 'SWITCHED 3D VIEWPORT TO MARK LXXXV HELMET'
    } else if (cmd === 'reactor') {
      setModelType('reactor')
      resp = 'SWITCHED 3D VIEWPORT TO ARC REACTOR CORE'
    } else if (cmd === 'armor') {
      setModelType('armor')
      resp = 'SWITCHED 3D VIEWPORT TO FULL NANOTECH ARMOR'
    } else if (cmd === 'test' || cmd === 'audit') {
      runDiagnostics()
      resp = 'LAUNCHING JARVIS SYSTEM AUDIT...'
    } else if (cmd === 'sectors') resp = ALL_SECTORS.map((s) => s.id).join(' | ')
    else if (cmd === 'deploy' || cmd === 'launch') {
      handleStartMission()
      resp = 'INITIALIZING DEPLOYMENT MAINFRAME!'
    } else if (cmd === 'clear') {
      setTerminalLogs([])
      setTerminalInput('')
      return
    } else if (SECTOR_ARTICLES[cmd]) {
      handleSelectSector(cmd)
      resp = `ROUTING TO ${cmd.toUpperCase()} SECTOR...`
    }

    setTerminalLogs((prev) => [...prev.slice(-16), log, `[JARVIS] ${resp}`])
    setTerminalInput('')
  }

  // Estimator Calculations
  const estimateData = useMemo(() => {
    const scaleMap = [
      {
        name: 'Sprint Pilot (Mark I MVP)',
        weeks: 1.5,
        speedBoost: '4x',
        support: '1 Month Free SLA',
        deliverables: 'Full Source Code + Live High-Speed Web Deployment + Mobile QA',
      },
      {
        name: 'Standard Business Core (Mark VII)',
        weeks: 3,
        speedBoost: '6x',
        support: '3 Months Priority SLA',
        deliverables: 'Custom Software + Interactive 3D Canvas + SEO Engine + Database Sync',
      },
      {
        name: 'Advanced Architecture (Mark 50 Nano)',
        weeks: 5,
        speedBoost: '8x',
        support: '6 Months Architecture SLA',
        deliverables: 'Autonomous AI Agents + High-Availability Cloud + Quantum Encryption',
      },
      {
        name: 'Enterprise Matrix (Mark 85 Titanium)',
        weeks: 8,
        speedBoost: '12x',
        support: '12 Months Dedicated Pod',
        deliverables: 'Full Digital Ecosystem: Web + Mobile App + AI Hub + 24/7 Security Sentinels',
      },
      {
        name: 'Custom Frontier Blueprint (Stark Lab)',
        weeks: 12,
        speedBoost: '15x+',
        support: 'Lifetime Partnership SLA',
        deliverables: 'Ground-up Experimental R&D + Dedicated Engineering Pod + Custom Proprietary LLMs',
      },
    ]
    return scaleMap[projectScale - 1] || scaleMap[2]
  }, [projectScale])

  return (
    <div className={`mc-page-overlay ${mounted ? 'mc-mounted' : ''}`}>
      <div className="mc-ambient-bg" />
      <div className="mc-grid-pattern" />

      <div className="mc-page-scroll">
        {/* ── Top Header Navigation Bar ── */}
        <header className="mc-header">
          <div className="mc-header-left">
            <button className="mc-back-btn interactive" onClick={handleClose} title="Return to 3D Observatory">
              <span className="mc-back-btn-arrow">←</span>
              <span className="mc-back-btn-text">HQ OBSERVATORY</span>
            </button>

            <div className="mc-header-titles">
              <div className="mc-dept-label">
                <span className="mc-badge-pill">{article.badge}</span>
                <span>CODE: {article.id.toUpperCase()}</span>
                <span className="mc-user-tag">OPERATOR: {userName || 'STARK'}</span>
              </div>
              <h1 className="mc-page-title">{article.title}</h1>
              <p className="mc-page-subtitle">{article.subtitle}</p>
            </div>
          </div>

          <div className="mc-header-right">
            <button
              className={`mc-audio-btn interactive ${isNarrating ? 'narrating' : ''}`}
              onClick={toggleNarration}
              title="Narrate Department Briefing with AI Voice"
            >
              <div className="mc-audio-wave">
                <span className="mc-audio-bar" />
                <span className="mc-audio-bar" />
                <span className="mc-audio-bar" />
              </div>
              <span>{isNarrating ? 'NARRATING...' : 'JARVIS VOICE BRIEF'}</span>
            </button>

            <div className="mc-clock-badge">
              <span className="mc-clock-time">{currentTime || '12:00:00 UTC'}</span>
              <span className="mc-clock-zone">JARVIS SYNC ACTIVE</span>
            </div>
          </div>
        </header>

        {/* ── 10 Orbital Sector Directory Switcher ── */}
        <nav className="mc-sector-nav" aria-label="Orbital Sector Directory">
          <div className="mc-sector-nav-label">STARK PROTOCOL DIRECTORY:</div>
          <div className="mc-sector-nav-track">
            {ALL_SECTORS.map((sec) => {
              const isActive = sec.id === currentSectorId
              return (
                <button
                  key={sec.id}
                  className={`mc-sector-chip interactive ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectSector(sec.id)}
                >
                  <span className="mc-chip-icon">{sec.icon}</span>
                  <span className="mc-chip-name">{sec.name}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* ── Main Command Body Grid ── */}
        <main className="mc-body-grid">
          {/* ════════════════════════════════════════════════════════════════════
              LEFT COLUMN: 3D Iron Man Stage + Capabilities Grid
             ════════════════════════════════════════════════════════════════════ */}
          <div className="mc-left-col">
            {/* 3D Iron Man Viewport Card */}
            <div className="mc-hero-3d-card">
              <div className="mc-card-header-bar">
                <div className="mc-card-title-group">
                  <span className="mc-live-dot" />
                  <h2 className="mc-card-heading">3D IRON MAN HOLOGRAPHIC SUIT ENGINE</h2>
                </div>
                <div className="mc-holo-meta">MARK LXXXV · ARC REACTOR ACTIVE</div>
              </div>

              {/* 3D Canvas Stage */}
              <div className="mc-holo-stage">
                <MissionHoloModel
                  modelType={modelType}
                  colorTheme={colorTheme}
                  wireframe={wireframe}
                  exploded={exploded}
                  scanTrigger={scanTrigger}
                  autoRotate={autoRotate}
                />

                {/* Cyber HUD Overlays on 3D Stage */}
                <div className="mc-stage-overlay-hud">
                  <div className="mc-hud-top-data">
                    <span>JARVIS_HUD: 142.8MHz</span>
                    <span>SUIT: MARK_LXXXV</span>
                    <span>BEARING: 042° // 18'</span>
                  </div>

                  <div className="mc-hud-reticle-center" />

                  <div className="mc-hud-bottom-hint">
                    DRAG TO ORBIT · SCROLL TO ZOOM · CLICK CONTROLS BELOW
                  </div>
                </div>
              </div>

              {/* 3D Model Controls Toolbar */}
              <div className="mc-model-toolbar">
                {/* Model Selector */}
                <div className="mc-toolbar-section">
                  <span className="mc-tool-label">IRON MAN ARMOR:</span>
                  <div className="mc-pill-btn-group">
                    <button
                      className={`mc-pill-btn interactive ${modelType === 'helmet' ? 'active' : ''}`}
                      onClick={() => {
                        cinemaAudio.playOrbSelect()
                        setModelType('helmet')
                      }}
                    >
                      HELMET HUD
                    </button>
                    <button
                      className={`mc-pill-btn interactive ${modelType === 'reactor' ? 'active' : ''}`}
                      onClick={() => {
                        cinemaAudio.playOrbSelect()
                        setModelType('reactor')
                      }}
                    >
                      ARC REACTOR
                    </button>
                    <button
                      className={`mc-pill-btn interactive ${modelType === 'armor' ? 'active' : ''}`}
                      onClick={() => {
                        cinemaAudio.playOrbSelect()
                        setModelType('armor')
                      }}
                    >
                      NANOTECH SUIT
                    </button>
                  </div>
                </div>

                {/* Shading & Action Controls */}
                <div className="mc-toolbar-section">
                  <button
                    className={`mc-action-icon-btn interactive ${wireframe ? 'toggled' : ''}`}
                    onClick={() => {
                      cinemaAudio.playScrollTransition()
                      setWireframe(!wireframe)
                    }}
                    title="Toggle Stark Wireframe Diagnostic Shading"
                  >
                    <span>🕸️</span>
                    <span>{wireframe ? 'SOLID' : 'WIREFRAME'}</span>
                  </button>

                  <button
                    className={`mc-action-icon-btn interactive ${exploded ? 'toggled' : ''}`}
                    onClick={() => {
                      cinemaAudio.playScrollTransition()
                      setExploded(!exploded)
                    }}
                    title="Deploy / Open Faceplate & Nanotech"
                  >
                    <span>🦾</span>
                    <span>{exploded ? 'CLOSE VISOR' : 'OPEN VISOR'}</span>
                  </button>

                  <button
                    className="mc-action-icon-btn interactive"
                    onClick={handleUnibeamPulse}
                    title="Fire Chest Unibeam Laser Blast"
                  >
                    <span>🔥</span>
                    <span>UNIBEAM</span>
                  </button>

                  <button
                    className={`mc-action-icon-btn interactive ${!autoRotate ? 'toggled' : ''}`}
                    onClick={() => {
                      cinemaAudio.playScrollTransition()
                      setAutoRotate(!autoRotate)
                    }}
                    title="Toggle Auto Rotation"
                  >
                    <span>{autoRotate ? '⏸ PAUSE' : '▶ ROTATE'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Department Overview Bento Box */}
            <div className="mc-overview-box">
              <div className="mc-section-eyebrow" style={{ marginBottom: 10 }}>
                <span className="mc-eyebrow-dot" />
                MISSION SYNTHESIS & OBJECTIVE
              </div>
              <p className="mc-overview-text">{article.overview}</p>
              <div className="mc-overview-actions">
                <button className="mc-btn-primary interactive" onClick={handleStartMission}>
                  {article.id === 'web_dev' ? '🚀 LAUNCH WEB STORE' : '⚡ INITIALIZE SECTOR MAINFRAME'}
                </button>
                <button className="mc-btn-secondary interactive" onClick={runDiagnostics}>
                  🔍 RUN JARVIS AUDIT
                </button>
              </div>
            </div>

            {/* Core Specialized Capabilities Grid */}
            <section className="mc-capabilities-section">
              <div className="mc-section-header-row">
                <div className="mc-section-title-wrap">
                  <div className="mc-section-eyebrow">
                    <span className="mc-eyebrow-dot" />
                    STARK DELIVERABLES
                  </div>
                  <h3 className="mc-section-title">Specialized Capabilities</h3>
                </div>
              </div>

              <div className="mc-capabilities-grid">
                {article.services.map((svc, idx) => {
                  const palette = ACCENT_PALETTES[idx % ACCENT_PALETTES.length]
                  return (
                    <div
                      key={idx}
                      className="mc-cap-card interactive"
                      style={{
                        '--card-accent': palette.color,
                        '--card-glow': palette.glow,
                      }}
                      onClick={() => {
                        cinemaAudio.playOrbSelect()
                        setSelectedServiceDetail({ ...svc, index: idx, palette })
                      }}
                    >
                      <div className="mc-cap-top-row">
                        <div className="mc-cap-icon-box">
                          {SERVICE_ICONS[idx % SERVICE_ICONS.length]}
                        </div>
                        <span className="mc-cap-num">0{idx + 1}</span>
                      </div>

                      <div>
                        <h4 className="mc-cap-title">{svc.title}</h4>
                        <p className="mc-cap-desc">{svc.desc}</p>
                      </div>

                      <div className="mc-cap-footer">
                        <span>Inspect Stark Blueprint</span>
                        <span>→</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ════════════════════════════════════════════════════════════════════
              RIGHT COLUMN: Telemetry Stats, Terminal, ROI Estimator & Tech
             ════════════════════════════════════════════════════════════════════ */}
          <div className="mc-right-col">
            {/* Key Stats Row */}
            {article.stats && (
              <div className="mc-stats-grid">
                {article.stats.map((s, i) => (
                  <div key={i} className="mc-stat-item">
                    <div className="mc-stat-item-val">
                      <AnimatedCounter value={s.value} duration={1200 + i * 200} />
                    </div>
                    <div className="mc-stat-item-lbl">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Terminal Console Card */}
            <div className="mc-terminal-card">
              <div className="mc-terminal-top-bar">
                <div className="mc-term-dots">
                  <span className="mc-dot red" />
                  <span className="mc-dot yellow" />
                  <span className="mc-dot green" />
                </div>
                <span className="mc-term-title">JARVIS://STARK_MAINFRAME</span>
                <button
                  className="mc-term-audit-btn interactive"
                  onClick={runDiagnostics}
                  disabled={diagnosticRunning}
                >
                  {diagnosticRunning ? 'AUDITING...' : '⚡ RUN AUDIT'}
                </button>
              </div>

              <div className="mc-term-body" ref={termBodyRef}>
                {terminalLogs.map((line, idx) => (
                  <div key={idx} className="mc-term-line">
                    <span className="mc-term-time">[{currentTime || 'UTC'}]</span> {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleTerminalSubmit} className="mc-term-input-row">
                <span className="mc-term-prompt">jarvis@{article.id}:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type 'unibeam', 'helmet', 'status', 'test'..."
                  className="mc-term-input"
                />
                <button type="submit" className="mc-term-send interactive">
                  SEND
                </button>
              </form>
            </div>

            {/* Interactive Timeline & Velocity Blueprint Estimator */}
            <div className="mc-estimator-card">
              <div className="mc-section-eyebrow" style={{ color: '#f59e0b' }}>
                <span className="mc-eyebrow-dot" style={{ background: '#f59e0b' }} />
                INTERACTIVE PROJECT ESTIMATOR
              </div>
              <h3 className="mc-estimator-title">Configure Scope Scale & Delivery Velocity</h3>

              <div className="mc-range-wrap">
                <div className="mc-range-labels">
                  <span>SCALE 1: MARK I MVP</span>
                  <span>SCALE 3: MARK 50 NANO</span>
                  <span>SCALE 5: STARK LAB</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={projectScale}
                  onChange={(e) => {
                    cinemaAudio.playScrollTransition()
                    setProjectScale(parseInt(e.target.value))
                  }}
                  className="mc-range-slider"
                />
              </div>

              <div className="mc-est-grid">
                <div className="mc-est-mini-box">
                  <div className="mc-est-mini-label">TARGET ARCHITECTURE</div>
                  <div className="mc-est-mini-val">{estimateData.name}</div>
                </div>
                <div className="mc-est-mini-box">
                  <div className="mc-est-mini-label">DELIVERY SPEED</div>
                  <div className="mc-est-mini-val">⏱ ~{estimateData.weeks} WEEKS</div>
                </div>
                <div className="mc-est-mini-box">
                  <div className="mc-est-mini-label">VELOCITY MULTIPLIER</div>
                  <div className="mc-est-mini-val" style={{ color: '#00ff88' }}>
                    ⚡ {estimateData.speedBoost} FASTER
                  </div>
                </div>
                <div className="mc-est-mini-box">
                  <div className="mc-est-mini-label">SUPPORT SLA</div>
                  <div className="mc-est-mini-val">{estimateData.support}</div>
                </div>
              </div>

              <div className="mc-est-deliverable-tag">
                <strong>INCLUDED:</strong> {estimateData.deliverables}
              </div>
            </div>

            {/* Proven Advantages & Benefits */}
            <div className="mc-benefits-card">
              <div className="mc-section-eyebrow" style={{ color: '#34d399' }}>
                <span className="mc-eyebrow-dot" style={{ background: '#34d399' }} />
                KEY SECTOR ADVANTAGES
              </div>
              <ul className="mc-benefits-list">
                {article.benefits.map((b, i) => (
                  <li key={i} className="mc-benefit-item">
                    <span className="mc-benefit-check">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aerospace Technology Stack Arsenal */}
            <div className="mc-tech-card">
              <div className="mc-section-eyebrow">
                <span className="mc-eyebrow-dot" />
                STARK TECHNOLOGY ARSENAL
              </div>
              <div className="mc-tech-tags-cloud">
                {(article.tech || activeMission.tech || []).map((t, idx) => (
                  <span key={idx} className="mc-tech-pill interactive">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── CEO / Founder Profile Card ── */}
            <div className="mc-ceo-card">
              <div className="mc-ceo-glow-ring" />
              <div className="mc-ceo-content">
                <div className="mc-ceo-avatar-wrap">
                  <img
                    src="/ceo_hariharan.jpg"
                    alt="Hariharan.D — Founder & CEO of Bex Sigma Tech"
                    className="mc-ceo-avatar"
                  />
                  <div className="mc-ceo-avatar-ring" />
                  <div className="mc-ceo-status-dot" title="Online" />
                </div>
                <div className="mc-ceo-info">
                  <div className="mc-ceo-badge">FOUNDER & CEO</div>
                  <h3 className="mc-ceo-name">Hariharan.D</h3>
                  <p className="mc-ceo-tagline">Visionary Architect · Bex Sigma Tech</p>
                  <a
                    href="mailto:bexsigmatech@gmail.com"
                    className="mc-ceo-email interactive"
                  >
                    <span className="mc-ceo-email-icon">✉</span>
                    <span>bexsigmatech@gmail.com</span>
                  </a>
                </div>
              </div>
              <div className="mc-ceo-quote">
                "We don't just build software — we architect digital experiences that redefine what's possible."
              </div>
            </div>
          </div>
        </main>

        {/* ── High-Impact Bottom Call to Action ── */}
        <section className="mc-bottom-cta">
          <h2 className="mc-bottom-cta-title">
            {article.id === 'mission_control'
              ? 'Ready to Launch Your Digital Future with BEX Sigma Tech?'
              : `Ready to Initialize the ${article.title} Sector?`}
          </h2>
          <p className="mc-bottom-cta-desc">
            {article.id === 'mission_control'
              ? 'Step into our command mainframe and access software, websites, AI automation and custom tools.'
              : `Connect with our engineering pod to architect and scale your ${article.title} solution.`}
          </p>

          <div className="mc-bottom-cta-actions">
            <button className="mc-btn-primary interactive" onClick={handleStartMission}>
              {article.id === 'web_dev' ? '🚀 ENTER WEB STORE' : '⚡ INITIATE DEPARTMENT MAINFRAME'}
            </button>
            <a
              href="mailto:bexsigmatech@gmail.com?subject=Project%20Inquiry%20-%20Bex%20Sigma%20Tech"
              className="mc-btn-ceo-contact interactive"
            >
              ✉ CONTACT CEO HARIHARAN.D
            </a>
            <button className="mc-btn-secondary interactive" onClick={handleClose}>
              ← RETURN TO HQ OBSERVATORY
            </button>
          </div>

          <div className="mc-trust-badges-row">
            <span>🔒 Post-Quantum Encryption</span>
            <span>⚡ Zero-Downtime SLA</span>
            <span>🛡️ SOC2 / GDPR Ready</span>
            <span>🌐 24/7 Dedicated Pod</span>
          </div>
        </section>
      </div>

      {/* ── Interactive Capability Detail Blueprint Modal ── */}
      {selectedServiceDetail && (
        <div className="mc-blueprint-overlay" onClick={() => setSelectedServiceDetail(null)}>
          <div
            className="mc-blueprint-box interactive"
            onClick={(e) => e.stopPropagation()}
            style={{
              '--modal-border': selectedServiceDetail.palette?.border,
              '--modal-glow': selectedServiceDetail.palette?.glow,
            }}
          >
            <div className="mc-blueprint-header">
              <span
                className="mc-blueprint-badge"
                style={{ color: selectedServiceDetail.palette?.color }}
              >
                {article.badge} · TECHNICAL BLUEPRINT
              </span>
              <button
                className="mc-blueprint-close interactive"
                onClick={() => setSelectedServiceDetail(null)}
              >
                ×
              </button>
            </div>

            <div className="mc-blueprint-body">
              <h3 className="mc-blueprint-title">{selectedServiceDetail.title}</h3>
              <p className="mc-blueprint-desc">{selectedServiceDetail.desc}</p>

              <div className="mc-blueprint-specs-grid">
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">PROVISIONING LATENCY</div>
                  <div className="mc-spec-val">&lt; 48h Sprint Ready</div>
                </div>
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">CODE INTEGRITY</div>
                  <div className="mc-spec-val">100% Automated CI/CD + QA</div>
                </div>
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">SECURITY POSTURE</div>
                  <div className="mc-spec-val">Post-Quantum Cryptography</div>
                </div>
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">MAINTENANCE SLA</div>
                  <div className="mc-spec-val">24/7 Continuous Monitoring</div>
                </div>
              </div>

              <div className="mc-blueprint-actions">
                <button
                  className="mc-btn-primary interactive"
                  onClick={() => {
                    setSelectedServiceDetail(null)
                    handleStartMission()
                  }}
                >
                  PROVISION THIS SERVICE NOW
                </button>
                <button
                  className="mc-btn-secondary interactive"
                  onClick={() => setSelectedServiceDetail(null)}
                >
                  CLOSE BLUEPRINT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
