import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter, aiVoice } from '../../audio/AIVoiceEngine'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { SECTOR_ARTICLES } from '../../data/sectorArticles'

/* ==========================================================================
   BEX SIGMA TECH — ULTRA MISSION CONTROL & COMMAND HUB (V2)
   Features:
   - 4 Dynamic Template Styles: SPATIAL MATRIX, 3D CYLINDER, CYBER TELEMETRY, EXECUTIVE ROADMAP
   - Global Sector Switcher (10 Orbital Divisions)
   - Interactive Capability Detail Drawer
   - Real-time Velocity & Timeline Estimator
   - Audio Feedback & AI Briefing Narrator
   ========================================================================== */

const TEMPLATE_MODES = [
  { id: 'matrix', label: 'SPATIAL MATRIX', icon: '⬡', desc: 'Interactive Bento & Holographic Canvas' },
  { id: 'cylinder', label: '3D CYLINDER', icon: '🌀', desc: '3D Orbital Perspective Carousel' },
  { id: 'telemetry', label: 'CYBER TELEMETRY', icon: '💻', desc: 'Live Diagnostics & Command Terminal' },
  { id: 'roadmap', label: 'BLUEPRINT ROADMAP', icon: '📊', desc: 'Milestone Execution & ROI Estimator' },
]

const ALL_SECTORS = [
  { id: 'mission_control', name: 'Mission Control', icon: '⚡', badge: 'CORE HUB' },
  { id: 'web_dev', name: 'Web Development', icon: '🌐', badge: 'WEB 3D' },
  { id: 'ai_auto', name: 'AI Automation', icon: '🤖', badge: 'AGENTS' },
  { id: 'cloud', name: 'Cloud Systems', icon: '☁️', badge: 'ORBITAL' },
  { id: 'cyber', name: 'Cyber Security', icon: '🛡️', badge: 'QUANTUM' },
  { id: 'analytics', name: 'Analytics & BI', icon: '📈', badge: '8K DATA' },
  { id: 'ui_ux', name: 'UI / UX Spatial', icon: '🎨', badge: 'HOLO DESIGN' },
  { id: 'marketing', name: 'Digital Growth', icon: '🎯', badge: 'NEURAL ADS' },
  { id: 'finance', name: 'Finance Matrix', icon: '💳', badge: 'LEDGER' },
  { id: 'innovation', name: 'Innovation Lab', icon: '🔬', badge: 'R&D LAB' },
]

const SERVICE_ICONS = ['⬡', '◈', '⬢', '✦', '🛰️', '⚡', '🛡️', '⚙️']

const ACCENT_PALETTES = [
  { color: '#00d4ff', glow: 'rgba(0,212,255,0.25)', border: 'rgba(0,212,255,0.35)' },
  { color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', border: 'rgba(167,139,250,0.35)' },
  { color: '#34d399', glow: 'rgba(52,211,153,0.25)', border: 'rgba(52,211,153,0.35)' },
  { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)', border: 'rgba(245,158,11,0.35)' },
  { color: '#f43f5e', glow: 'rgba(244,63,94,0.25)', border: 'rgba(244,63,94,0.35)' },
  { color: '#38bdf8', glow: 'rgba(56,189,248,0.25)', border: 'rgba(56,189,248,0.35)' },
]

function AnimatedCounter({ value, duration = 1600 }) {
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    const numMatch = value.match(/[\d.]+/)
    if (!numMatch) { setDisplay(value); return }
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
  const canvasRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [templateMode, setTemplateMode] = useState('matrix') // 'matrix' | 'cylinder' | 'telemetry' | 'roadmap'
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null)
  const [isNarrating, setIsNarrating] = useState(false)

  // 3D Cylinder Slider state
  const [cylinderIndex, setCylinderIndex] = useState(0)
  const [isCylinderPaused, setIsCylinderPaused] = useState(false)

  // Telemetry Terminal State
  const [terminalLogs, setTerminalLogs] = useState([
    'BEX SIGMA OS v2.070 [ORBITAL SHELL INIT]',
    'SECTOR MATRIX: ALL 10 ORBITAL NODES ONLINE',
    'SECURITY LEVEL: POST-QUANTUM ZERO-TRUST',
    'AI ASSISTANT: SIGMA AGENT READY ON FREQ 142.8MHz',
    'READY FOR OPERATOR COMMAND...'
  ])
  const [terminalInput, setTerminalInput] = useState('')
  const [diagnosticRunning, setDiagnosticRunning] = useState(false)

  // Estimator slider state
  const [projectScale, setProjectScale] = useState(3) // 1 to 5 scale

  // Current active sector article
  const currentSectorId = activeMission?.id || 'mission_control'
  const article = SECTOR_ARTICLES[currentSectorId] || SECTOR_ARTICLES['mission_control']

  useEffect(() => {
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [currentSectorId])

  // Sound and audio particle canvas setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const particles = []
    const count = window.innerWidth < 768 ? 25 : 60

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.45 + 0.15,
        hue: Math.random() > 0.6 ? 275 : 195, // purple & cyan
      })
    }

    let mouse = { x: null, y: null }
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    window.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      if (width > 768) {
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.015)'
        ctx.lineWidth = 1
        const gs = 80
        for (let x = 0; x < width; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
        for (let y = 0; y < height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke() }
      }

      particles.forEach((p, idx) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        if (mouse.x !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const f = (120 - dist) / 120
            p.x -= dx * f * 0.03
            p.y -= dy * f * 0.03
          }
        }

        ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${p.alpha})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill()

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x, dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / 90) * 0.07})`
            ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke()
          }
        }
      })
      animationFrameId = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Auto rotation for cylinder mode
  useEffect(() => {
    if (templateMode !== 'cylinder' || isCylinderPaused || selectedServiceDetail) return
    const interval = setInterval(() => {
      setCylinderIndex((prev) => prev + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [templateMode, isCylinderPaused, selectedServiceDetail])

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
    // Log in telemetry
    setTerminalLogs((prev) => [
      ...prev.slice(-15),
      `[TRANSITION] SWAPPED ACTIVE SECTOR MATRIX TO -> ${secId.toUpperCase()}`
    ])
  }

  // Template Mode Change
  const handleSwitchTemplate = (modeId) => {
    cinemaAudio.playOrbSelect()
    setTemplateMode(modeId)
    setTerminalLogs((prev) => [
      ...prev.slice(-15),
      `[TEMPLATE] SWITCHED VIEWPORT MODE -> ${modeId.toUpperCase()}`
    ])
  }

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

  // Terminal command executor
  const handleTerminalSubmit = (e) => {
    e.preventDefault()
    if (!terminalInput.trim()) return
    const cmd = terminalInput.trim().toLowerCase()
    const log = `> ${terminalInput}`
    let resp = `Command unrecognized: "${cmd}". Try: help, status, deploy, test, sectors, clear`
    if (cmd === 'help') resp = 'AVAILABLE: status | deploy | test | sectors | clear | webdev | ai | cyber'
    else if (cmd === 'status') resp = 'ALL SYSTEMS NOMINAL. Quantum core latency < 0.4ms. Encryption 100% active.'
    else if (cmd === 'test') {
      runDiagnostics()
      resp = 'INITIATING COMPREHENSIVE ORBITAL DIAGNOSTICS...'
    }
    else if (cmd === 'sectors') resp = ALL_SECTORS.map(s => s.id).join(' | ')
    else if (cmd === 'deploy' || cmd === 'launch') {
      handleStartMission()
      resp = 'MAINFRAME INITIALIZATION TRIGGERED!'
    }
    else if (cmd === 'clear') {
      setTerminalLogs([])
      setTerminalInput('')
      return
    } else if (SECTOR_ARTICLES[cmd]) {
      handleSelectSector(cmd)
      resp = `ROUTING TO ${cmd.toUpperCase()} SECTOR...`
    }

    setTerminalLogs(prev => [...prev.slice(-14), log, `[SYS] ${resp}`])
    setTerminalInput('')
  }

  const runDiagnostics = () => {
    setDiagnosticRunning(true)
    cinemaAudio.playBootBeep()
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '✓ SYNCHRONIZING GLOBAL HIGH-SPEED NODES... 100%'])
      cinemaAudio.playScrollTransition()
    }, 600)
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '✓ VERIFYING NEURAL PIPELINES & DATA RESILIENCE... OK'])
      cinemaAudio.playScrollTransition()
    }, 1200)
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, '✓ AUDIT COMPLETE: 0 ANOMALIES. ALL PROTOCOLS VERIFIED.'])
      cinemaAudio.playAccessGrantedChime()
      setDiagnosticRunning(false)
    }, 1900)
  }

  // Estimator Calculations
  const estimateData = useMemo(() => {
    const scaleMap = [
      { name: 'Sprint Pilot (MVP)', weeks: 1.5, speedBoost: '4x', support: '1 Month Free Support', deliverables: 'Full Source Code + Live Web Deployment + Responsive Mobile QA' },
      { name: 'Standard Business Core', weeks: 3, speedBoost: '6x', support: '3 Months Priority SLA', deliverables: 'Custom Software + Interactive 3D Canvas + SEO Engine + Database Sync' },
      { name: 'Advanced Scale Architecture', weeks: 5, speedBoost: '8x', support: '6 Months Architecture SLA', deliverables: 'Autonomous Multi-Agent AI + High-Availability Cloud + Quantum Encryption' },
      { name: 'Enterprise Planetary Matrix', weeks: 8, speedBoost: '12x', support: '12 Months Dedicated Pod', deliverables: 'Full Digital Ecosystem: Web + App + AI Hub + 24/7 Security Sentinels' },
      { name: 'Custom Frontier Blueprint', weeks: 12, speedBoost: '15x+', support: 'Lifetime Partnership SLA', deliverables: 'Ground-up Experimental R&D + Dedicated Engineering Pod + Custom Proprietary LLMs' },
    ]
    return scaleMap[projectScale - 1] || scaleMap[2]
  }, [projectScale])

  const numServices = article.services?.length || 4
  const activeModuloIndex = ((cylinderIndex % numServices) + numServices) % numServices

  return (
    <div className={`mc-page-overlay ${mounted ? 'mc-mounted' : ''}`}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
      <div className="mc-bg" />

      <div className="mc-page-scroll">
        {/* ── Top Header ── */}
        <header className="mc-header">
          <div className="mc-header-left">
            <button className="mc-back-btn interactive" onClick={handleClose}>
              ← BACK TO HQ
            </button>
            <div className="mc-header-titles">
              <div className="mc-dept-label">
                <span className="mc-badge-pill">{article.badge}</span>
                <span>CODE: {article.id.toUpperCase()}</span>
                <span className="mc-user-tag">OPERATOR: {userName || 'COMMANDER'}</span>
              </div>
              <h1 className="mc-page-title">{article.title}</h1>
              <p className="mc-page-subtitle">{article.subtitle}</p>
            </div>
          </div>

          <div className="mc-header-right">
            <button
              className={`mc-audio-btn interactive ${isNarrating ? 'narrating' : ''}`}
              onClick={toggleNarration}
              title="Narrate Department Brief with AI Voice"
            >
              <span>{isNarrating ? '🔊 NARRATING...' : '🎙️ AUDIO BRIEF'}</span>
            </button>

            <div className="mc-secure-badge">
              <span>🛡️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.76rem' }}>ORBITAL SECURE</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.65 }}>Zero-Trust Telemetry</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── 10 Orbital Sector Switcher ── */}
        <nav className="mc-sector-nav" aria-label="Orbital Sector Selection">
          <div className="mc-sector-nav-label">ORBITAL SECTOR DIRECTORY:</div>
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
                  {isActive && <span className="mc-chip-indicator" />}
                </button>
              )
            })}
          </div>
        </nav>

        {/* ── Template Viewport Switcher Toolbar ── */}
        <div className="mc-template-bar">
          <div className="mc-template-bar-left">
            <span className="mc-template-label">SELECT INTERACTION TEMPLATE:</span>
          </div>
          <div className="mc-template-options">
            {TEMPLATE_MODES.map((tmpl) => {
              const isSelected = templateMode === tmpl.id
              return (
                <button
                  key={tmpl.id}
                  className={`mc-template-btn interactive ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSwitchTemplate(tmpl.id)}
                  title={tmpl.desc}
                >
                  <span className="mc-tmpl-icon">{tmpl.icon}</span>
                  <span className="mc-tmpl-title">{tmpl.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Key Performance Stats Row ── */}
        {article.stats && (
          <section className="mc-stats-section">
            {article.stats.map((s, i) => {
              const palette = ACCENT_PALETTES[i % ACCENT_PALETTES.length]
              return (
                <div
                  key={i}
                  className="mc-stat-card interactive"
                  style={{ '--card-accent': palette.color, '--card-glow': palette.glow }}
                >
                  <div className="mc-stat-value" style={{ color: palette.color }}>
                    <AnimatedCounter value={s.value} duration={1400 + i * 200} />
                  </div>
                  <div className="mc-stat-label">{s.label}</div>
                  <div className="mc-stat-glow" style={{ background: palette.glow }} />
                </div>
              )
            })}
          </section>
        )}

        {/* ── Dynamic Template Viewports ── */}

        {/* ================================================================
            VIEWPORT 1: SPATIAL MATRIX (Interactive Bento Layout)
           ================================================================ */}
        {templateMode === 'matrix' && (
          <div className="mc-viewport-view mc-view-matrix">
            {/* Overview Bento Card */}
            <div className="mc-bento-hero">
              <div className="mc-bento-hero-left">
                <div className="mc-section-eyebrow">
                  <span className="mc-eyebrow-dot" />MISSION SYNTHESIS & OBJECTIVE
                </div>
                <p className="mc-overview-text">{article.overview}</p>
                <div className="mc-hero-action-row">
                  <button className="mc-btn-primary interactive" onClick={handleStartMission}>
                    {article.id === 'web_dev' ? '🚀 LAUNCH WEB STORE' : '⚡ INITIALIZE SECTOR MAINFRAME'}
                  </button>
                  <button className="mc-btn-secondary interactive" onClick={runDiagnostics}>
                    🔍 RUN SYSTEM HEALTH AUDIT
                  </button>
                </div>
              </div>
              <div className="mc-bento-hero-right">
                <div className="mc-radar-visual">
                  <div className="mc-radar-circle mc-radar-c1" />
                  <div className="mc-radar-circle mc-radar-c2" />
                  <div className="mc-radar-circle mc-radar-c3" />
                  <div className="mc-radar-sweep" />
                  <div className="mc-radar-point p1" />
                  <div className="mc-radar-point p2" />
                  <div className="mc-radar-point p3" />
                  <div className="mc-radar-label">{article.title} NODE ACTIVE</div>
                </div>
              </div>
            </div>

            {/* Core Capabilities Interactive Grid */}
            <div className="mc-services-container">
              <div className="mc-section-eyebrow">
                <span className="mc-eyebrow-dot" />WHAT WE ENGINEER & DELIVER
              </div>
              <h2 className="mc-section-title">Core Specialized Capabilities</h2>
              <div className="mc-services-grid">
                {article.services.map((svc, idx) => {
                  const palette = ACCENT_PALETTES[idx % ACCENT_PALETTES.length]
                  return (
                    <div
                      key={idx}
                      className="mc-service-card interactive"
                      style={{
                        '--mc-accent': palette.color,
                        '--mc-glow': palette.glow,
                        '--mc-border': palette.border,
                      }}
                      onClick={() => {
                        cinemaAudio.playOrbSelect()
                        setSelectedServiceDetail({ ...svc, index: idx, palette })
                      }}
                    >
                      <div className="mc-card-top-row">
                        <div className="mc-service-icon" style={{ color: palette.color, borderColor: palette.border, background: palette.glow }}>
                          {SERVICE_ICONS[idx % SERVICE_ICONS.length]}
                        </div>
                        <span className="mc-card-num">0{idx + 1}</span>
                      </div>
                      <h3 className="mc-service-title">{svc.title}</h3>
                      <p className="mc-service-desc">{svc.desc}</p>
                      <div className="mc-service-glow" style={{ background: palette.glow }} />
                      <div className="mc-service-shine" />
                      <div className="mc-service-cta" style={{ color: palette.color }}>
                        <span>Inspect Architecture Blueprint</span>
                        <span className="mc-cta-arrow">→</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            VIEWPORT 2: 3D CYLINDER CAROUSEL (Cylindrical 3D Slider)
           ================================================================ */}
        {templateMode === 'cylinder' && (
          <div
            className="mc-viewport-view mc-view-cylinder"
            onMouseEnter={() => setIsCylinderPaused(true)}
            onMouseLeave={() => setIsCylinderPaused(false)}
          >
            <div className="mc-cylinder-controls-row">
              <div className="mc-cylinder-hint">
                <span>3D PERSPECTIVE SLIDER — ACTIVE LAYER: {activeModuloIndex + 1} / {numServices}</span>
              </div>
              <div className="mc-cylinder-nav-btns">
                <button
                  className="mc-btn-cyl-prev interactive"
                  onClick={() => {
                    cinemaAudio.playScrollTransition()
                    setCylinderIndex(prev => prev - 1)
                  }}
                >
                  ◀ PREV LAYER
                </button>
                <button
                  className="mc-btn-cyl-next interactive"
                  onClick={() => {
                    cinemaAudio.playScrollTransition()
                    setCylinderIndex(prev => prev + 1)
                  }}
                >
                  NEXT LAYER ▶
                </button>
              </div>
            </div>

            <div className="mc-cylinder-viewport">
              <div
                className="mc-cylinder-track"
                style={{
                  transform: `rotateY(${-cylinderIndex * (360 / numServices)}deg)`
                }}
              >
                {article.services.map((svc, idx) => {
                  const stepAngle = 360 / numServices
                  const angle = idx * stepAngle
                  const diff = Math.abs(activeModuloIndex - idx)
                  const minDiff = Math.min(diff, numServices - diff)
                  const palette = ACCENT_PALETTES[idx % ACCENT_PALETTES.length]

                  let opacity = 0.2
                  let pointerEvents = 'none'
                  let scale = 0.72
                  let zOffset = -40

                  if (minDiff === 0) {
                    opacity = 1.0
                    pointerEvents = 'auto'
                    scale = 1.0
                    zOffset = 50
                  } else if (minDiff === 1) {
                    opacity = 0.5
                    pointerEvents = 'none'
                    scale = 0.8
                    zOffset = -10
                  }

                  const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 220 : 340

                  return (
                    <div
                      key={idx}
                      className="mc-cylinder-card interactive"
                      style={{
                        '--mc-accent': palette.color,
                        '--mc-glow': palette.glow,
                        transform: `rotateY(${angle}deg) translateZ(${radius + zOffset}px) scale(${scale})`,
                        opacity,
                        pointerEvents,
                        borderColor: minDiff === 0 ? palette.color : 'rgba(255,255,255,0.1)',
                      }}
                      onClick={() => {
                        cinemaAudio.playOrbSelect()
                        setSelectedServiceDetail({ ...svc, index: idx, palette })
                      }}
                    >
                      <div className="mc-cyl-header">
                        <span className="mc-cyl-badge" style={{ color: palette.color, borderColor: palette.border }}>
                          SERVICE NODE 0{idx + 1}
                        </span>
                        <div className="mc-cyl-icon" style={{ color: palette.color }}>{SERVICE_ICONS[idx % SERVICE_ICONS.length]}</div>
                      </div>

                      <h3 className="mc-cyl-title">{svc.title}</h3>
                      <p className="mc-cyl-desc">{svc.desc}</p>

                      <div className="mc-cyl-features">
                        <div className="mc-cyl-feat-item">✓ Zero-Latency Architecture</div>
                        <div className="mc-cyl-feat-item">✓ 100% Tailored Build</div>
                        <div className="mc-cyl-feat-item">✓ 24/7 SLA Observability</div>
                      </div>

                      <button className="mc-cyl-inspect-btn interactive" style={{ background: palette.color }}>
                        VIEW ARCHITECTURE SPEC
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Cylinder Dots */}
            <div className="mc-cylinder-dots">
              {article.services.map((_, i) => (
                <div
                  key={i}
                  className={`mc-cyl-dot interactive ${i === activeModuloIndex ? 'active' : ''}`}
                  onClick={() => {
                    cinemaAudio.playScrollTransition()
                    let diff = i - activeModuloIndex
                    const halfLen = Math.floor(numServices / 2)
                    if (diff > halfLen) diff -= numServices
                    if (diff < -halfLen) diff += numServices
                    setCylinderIndex(prev => prev + diff)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================================================================
            VIEWPORT 3: CYBER TELEMETRY & COMMAND TERMINAL
           ================================================================ */}
        {templateMode === 'telemetry' && (
          <div className="mc-viewport-view mc-view-telemetry">
            <div className="mc-telemetry-grid">
              {/* Left: Terminal Console */}
              <div className="mc-terminal-box">
                <div className="mc-terminal-header">
                  <div className="mc-term-dots">
                    <span className="mc-dot red" />
                    <span className="mc-dot yellow" />
                    <span className="mc-dot green" />
                  </div>
                  <span className="mc-term-title">BEX-SIGMA://ORBITAL_MAINFRAME_CONSOLE</span>
                  <button className="mc-term-action interactive" onClick={runDiagnostics} disabled={diagnosticRunning}>
                    {diagnosticRunning ? 'DIAGNOSTICS RUNNING...' : '⚡ RUN DIAGNOSTIC AUDIT'}
                  </button>
                </div>

                <div className="mc-terminal-body">
                  {terminalLogs.map((line, idx) => (
                    <div key={idx} className="mc-term-line">
                      <span className="mc-term-time">[{new Date().toLocaleTimeString()}]</span> {line}
                    </div>
                  ))}
                  {diagnosticRunning && (
                    <div className="mc-term-loader">
                      <span className="mc-pulse-dot" /> EXECUTING REAL-TIME SPECTRAL AUDIT...
                    </div>
                  )}
                </div>

                <form onSubmit={handleTerminalSubmit} className="mc-terminal-input-row">
                  <span className="mc-term-prompt">operator@{article.id}:~$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="type 'help', 'status', 'test', 'deploy' or any sector name..."
                    className="mc-term-input"
                  />
                  <button type="submit" className="mc-term-send-btn interactive">SEND</button>
                </form>
              </div>

              {/* Right: Live Telemetry Gauges */}
              <div className="mc-telemetry-metrics">
                <div className="mc-telemetry-metric-card">
                  <div className="mc-metric-title">GLOBAL LATENCY</div>
                  <div className="mc-metric-val">1.2ms <span className="mc-metric-sub">P99 SLA</span></div>
                  <div className="mc-metric-bar"><div className="mc-bar-fill" style={{ width: '92%', background: '#00d4ff' }} /></div>
                </div>

                <div className="mc-telemetry-metric-card">
                  <div className="mc-metric-title">COMPLIANCE & ENCRYPTION</div>
                  <div className="mc-metric-val">100% <span className="mc-metric-sub">Kyber/Dilithium</span></div>
                  <div className="mc-metric-bar"><div className="mc-bar-fill" style={{ width: '100%', background: '#34d399' }} /></div>
                </div>

                <div className="mc-telemetry-metric-card">
                  <div className="mc-metric-title">UPTIME RELIABILITY</div>
                  <div className="mc-metric-val">99.99% <span className="mc-metric-sub">Zero-Downtime</span></div>
                  <div className="mc-metric-bar"><div className="mc-bar-fill" style={{ width: '99%', background: '#a78bfa' }} /></div>
                </div>

                <div className="mc-telemetry-metric-card">
                  <div className="mc-metric-title">PROVISIONING VELOCITY</div>
                  <div className="mc-metric-val">&lt; 24h <span className="mc-metric-sub">Deployment</span></div>
                  <div className="mc-metric-bar"><div className="mc-bar-fill" style={{ width: '88%', background: '#f59e0b' }} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            VIEWPORT 4: BLUEPRINT ROADMAP & ESTIMATOR
           ================================================================ */}
        {templateMode === 'roadmap' && (
          <div className="mc-viewport-view mc-view-roadmap">
            {/* 4-Phase Delivery Roadmap */}
            <div className="mc-roadmap-container">
              <div className="mc-section-eyebrow">
                <span className="mc-eyebrow-dot" />STANDARDIZED RAPID DELIVERY LIFECYCLE
              </div>
              <h2 className="mc-section-title">End-to-End Execution Protocol</h2>

              <div className="mc-roadmap-steps">
                {article.process.map((step, idx) => {
                  const palette = ACCENT_PALETTES[idx % ACCENT_PALETTES.length]
                  return (
                    <div key={idx} className="mc-roadmap-card interactive" style={{ '--card-accent': palette.color }}>
                      <div className="mc-roadmap-phase" style={{ color: palette.color, borderColor: palette.border }}>
                        PHASE 0{idx + 1}
                      </div>
                      <div className="mc-roadmap-circle" style={{ background: palette.color }}>{idx + 1}</div>
                      <h4 className="mc-roadmap-step-title">{step.replace(/^\d+\.\s*/, '')}</h4>
                      <p className="mc-roadmap-step-desc">
                        {idx === 0 && 'Requirement mapping, architecture blueprinting & SLA definition.'}
                        {idx === 1 && 'Precision UI/UX design, wireframes and interactive client preview.'}
                        {idx === 2 && 'Iterative agile sprints with real-time test guards and clean modular code.'}
                        {idx === 3 && 'Zero-downtime production deployment, SEO indexation and ongoing 24/7 care.'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Interactive Timeline & Velocity Estimator */}
            <div className="mc-estimator-box">
              <div className="mc-section-eyebrow">
                <span className="mc-eyebrow-dot" style={{ background: '#f59e0b' }} />
                INTERACTIVE PROJECT ESTIMATOR
              </div>
              <h3 className="mc-estimator-title">Configure Scope Scale & Calculate Delivery Velocity</h3>

              <div className="mc-slider-control">
                <div className="mc-slider-labels">
                  <span>SCALE 1: MVP SPRINT</span>
                  <span>SCALE 3: ADVANCED</span>
                  <span>SCALE 5: FRONTIER LAB</span>
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
                  className="mc-range-input"
                />
              </div>

              <div className="mc-estimator-results">
                <div className="mc-est-card">
                  <span className="mc-est-label">TARGET ARCHITECTURE</span>
                  <span className="mc-est-value highlight">{estimateData.name}</span>
                </div>
                <div className="mc-est-card">
                  <span className="mc-est-label">DELIVERY SPEED</span>
                  <span className="mc-est-value">⏱ ~{estimateData.weeks} WEEKS</span>
                </div>
                <div className="mc-est-card">
                  <span className="mc-est-label">VELOCITY MULTIPLIER</span>
                  <span className="mc-est-value green">⚡ {estimateData.speedBoost} FASTER</span>
                </div>
                <div className="mc-est-card">
                  <span className="mc-est-label">WARRANTY & SUPPORT</span>
                  <span className="mc-est-value">{estimateData.support}</span>
                </div>
              </div>

              <div className="mc-est-deliverables">
                <strong>INCLUDED BLUEPRINT DELIVERABLES:</strong> {estimateData.deliverables}
              </div>
            </div>
          </div>
        )}

        {/* ── Two Column (Benefits & Why Choose) ── */}
        <section className="mc-two-col-section">
          <div className="mc-two-col-card mc-benefits-card">
            <div className="mc-section-eyebrow">
              <span className="mc-eyebrow-dot" style={{ background: '#34d399' }} />
              PROVEN ADVANTAGES & KEY BENEFITS
              <span className="mc-eyebrow-line" style={{ background: 'rgba(52,211,153,0.3)' }} />
            </div>
            <ul className="mc-list">
              {article.benefits.map((b, i) => (
                <li key={i} className="mc-list-item">
                  <span className="mc-list-bullet" style={{ color: '#34d399' }}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mc-two-col-card mc-why-card">
            <div className="mc-section-eyebrow">
              <span className="mc-eyebrow-dot" style={{ background: '#f59e0b' }} />
              WHY CHOOSE BEX SIGMA TECH
              <span className="mc-eyebrow-line" style={{ background: 'rgba(245,158,11,0.3)' }} />
            </div>
            <p className="mc-why-text">{article.whyChoose}</p>
          </div>
        </section>

        {/* ── Technology Stack Tags ── */}
        <section className="mc-tech-section">
          <div className="mc-section-eyebrow">
            <span className="mc-eyebrow-dot" />ORBITAL AEROSPACE TECHNOLOGY STACK
            <span className="mc-eyebrow-line" />
          </div>
          <div className="mc-tech-row">
            {(article.tech || activeMission.tech || []).map((t, idx) => (
              <span
                key={idx}
                className="mc-tech-tag interactive"
                style={{
                  '--tag-color': ACCENT_PALETTES[idx % ACCENT_PALETTES.length].color,
                  animationDelay: `${idx * 0.05}s`
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* ── Bottom Call To Action ── */}
        <section className="mc-cta-section">
          <div className="mc-cta-glow-orb mc-cta-glow-orb--left" />
          <div className="mc-cta-glow-orb mc-cta-glow-orb--right" />
          <h2 className="mc-cta-heading">
            {article.id === 'mission_control'
              ? 'Ready to Launch Your Digital Future with BEX Sigma Tech?'
              : `Ready to Initialize the ${article.title} Department?`}
          </h2>
          <p className="mc-cta-sub">
            {article.id === 'mission_control'
              ? 'Step into our command mainframe and access software, websites, AI automation and custom tools.'
              : `Connect with our engineering pod to architect and scale your ${article.title} solution.`}
          </p>
          <div className="mc-actions">
            <button className="mc-btn-primary interactive" onClick={handleStartMission}>
              {article.id === 'web_dev' ? '🚀 ENTER WEB STORE' : '⚡ INITIATE DEPARTMENT MAINFRAME'}
            </button>
            <button className="mc-btn-secondary interactive" onClick={handleClose}>
              ← RETURN TO OBSERVATORY WALK
            </button>
          </div>
        </section>

        {/* ── Trust Row & Footer ── */}
        <div className="mc-trust-row">
          {['🔒 End-to-End Quantum Encryption', '⚡ High-Throughput Delivery', '🛡️ Enterprise SLA Standards', '✅ 100% Custom Tailored', '🌐 24/7 Priority Assistance'].map((b, i) => (
            <span key={i} className="mc-trust-badge">{b}</span>
          ))}
        </div>

        <div className="mc-footer-code">
          ORBITAL CLEARANCE GRANTED · DEPT ID: {article.id.toUpperCase()} · BEX SIGMA TECH 2070 PROPRIETARY
        </div>
      </div>

      {/* ── Interactive Capability Detail Modal / Drawer ── */}
      {selectedServiceDetail && (
        <div className="mc-modal-overlay" onClick={() => setSelectedServiceDetail(null)}>
          <div className="mc-modal-box interactive" onClick={(e) => e.stopPropagation()}>
            <div className="mc-modal-header">
              <div className="mc-modal-badge" style={{ color: selectedServiceDetail.palette?.color }}>
                {article.badge} · SPECIFICATION
              </div>
              <button className="mc-modal-close" onClick={() => setSelectedServiceDetail(null)}>×</button>
            </div>

            <div className="mc-modal-body">
              <div className="mc-modal-icon-wrap" style={{ color: selectedServiceDetail.palette?.color, borderColor: selectedServiceDetail.palette?.border, background: selectedServiceDetail.palette?.glow }}>
                {SERVICE_ICONS[selectedServiceDetail.index % SERVICE_ICONS.length]}
              </div>
              <h2 className="mc-modal-title">{selectedServiceDetail.title}</h2>
              <p className="mc-modal-desc">{selectedServiceDetail.desc}</p>

              <div className="mc-modal-spec-grid">
                <div className="mc-modal-spec-item">
                  <div className="mc-spec-label">DEPLOYMENT LATENCY</div>
                  <div className="mc-spec-val">&lt; 48 Hours Rapid Setup</div>
                </div>
                <div className="mc-modal-spec-item">
                  <div className="mc-spec-label">CODE INTEGRITY</div>
                  <div className="mc-spec-val">100% Tested + Automated CI/CD</div>
                </div>
                <div className="mc-modal-spec-item">
                  <div className="mc-spec-label">SECURITY POSTURE</div>
                  <div className="mc-spec-val">SOC2 / GDPR / Post-Quantum Ready</div>
                </div>
                <div className="mc-modal-spec-item">
                  <div className="mc-spec-label">SUPPORT SLA</div>
                  <div className="mc-spec-val">Continuous Node Monitoring</div>
                </div>
              </div>

              <div className="mc-modal-actions">
                <button className="mc-btn-primary interactive" onClick={() => { setSelectedServiceDetail(null); handleStartMission() }}>
                  PROVISION THIS SERVICE NOW
                </button>
                <button className="mc-btn-secondary interactive" onClick={() => setSelectedServiceDetail(null)}>
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
