import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter, aiVoice } from '../../audio/AIVoiceEngine'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { SECTOR_ARTICLES } from '../../data/sectorArticles'
import '../../styles/missionControl.css'

/* ==========================================================================
   BEX SIGMA TECH — MISSION CONTROL & SIGMA COMMAND HUB
   Lightweight HQ headquarters view — no heavy 3D models
   ========================================================================== */

const ALL_SECTORS = [
  { id: 'mission_control', name: 'Mission Control', icon: '⚡', badge: 'SIGMA CORE', theme: 'classic' },
  { id: 'web_dev', name: 'Web Development', icon: '🌐', badge: 'SIGMA 3D', theme: 'jarvis' },
  { id: 'cloud', name: 'Autonomous Applications', icon: '📱', badge: 'APP MATRIX', theme: 'jarvis' },
  { id: 'client_projects', name: 'Our Client Projects', icon: '🚀', badge: 'CLIENT SUCCESS', theme: 'quantum' },
  { id: 'ai_auto', name: 'AI Automation', icon: '🤖', badge: 'NANO AGENTS', theme: 'emerald' },
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
  const [selectedCategory, setSelectedCategory] = useState('all')



  // Current active sector article
  const currentSectorId = activeMission?.id || 'mission_control'
  const article = SECTOR_ARTICLES[currentSectorId] || SECTOR_ARTICLES['mission_control']

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



  // Sector Switching
  const handleSelectSector = (secId) => {
    cinemaAudio.playSectorTransition()
    if (secId === 'web_dev') {
      navigateToSector('web_dev')
      return
    }
    if (secId === 'cloud' || secId === 'apps') {
      navigateToSector('apps')
      return
    }
    if (secId === 'client_projects') {
      navigateToSector('client_projects')
      return
    }
    if (SECTOR_ARTICLES[secId]) {
      setActiveMission({ id: secId, title: SECTOR_ARTICLES[secId].title })
    }
  }

  // Start Mission / Launch
  const handleStartMission = () => {
    cinemaAudio.playAccessGrantedChime()
    voiceEmitter.emit('MISSION_STARTED')
    if (article.id === 'cloud' || article.id === 'apps') {
      navigateToSector('apps')
      return
    }
    if (article.id === 'client_projects') {
      navigateToSector('client_projects')
      return
    }
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
              title="Narrate Department Briefing with AI Voice"
            >
              <div className="mc-audio-wave">
                <span className="mc-audio-bar" />
                <span className="mc-audio-bar" />
                <span className="mc-audio-bar" />
              </div>
              <span>{isNarrating ? 'NARRATING...' : 'SIGMA VOICE BRIEF'}</span>
            </button>

            <div className="mc-clock-badge">
              <span className="mc-clock-time">{currentTime || '12:00:00 UTC'}</span>
              <span className="mc-clock-zone">SIGMA SYNC ACTIVE</span>
            </div>
          </div>
        </header>

        {/* ── 10 Orbital Sector Directory Switcher ── */}
        <nav className="mc-sector-nav" aria-label="Orbital Sector Directory">
          <div className="mc-sector-nav-label">SIGMA PROTOCOL DIRECTORY:</div>
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

        {/* ── Main Command Body (Linear Flow) ── */}
        <main className="mc-body-grid mc-linear-flow">
          {/* 1. FOUNDER & CEO PROFILE CONTAINER */}
          <section className="mc-ceo-card mc-ceo-card-fullwidth">
            <div className="mc-ceo-glow-ring" />
            <div className="mc-ceo-top-header">
              <div className="mc-section-eyebrow">
                <span className="mc-eyebrow-dot" />
                FOUNDER & LEADERSHIP
              </div>
              <div className="mc-live-status-pill">
                <span className="mc-live-dot" />
                <span>ONLINE · DIRECT LINE ACTIVE</span>
              </div>
            </div>

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
                <h2 className="mc-ceo-name">Hariharan.D</h2>
                <p className="mc-ceo-tagline">Visionary Architect & Founder · BEX Sigma Tech</p>
                <a
                  href="mailto:bexsigmatech@gmail.com"
                  className="mc-ceo-email interactive"
                >
                  <span className="mc-ceo-email-icon">✉</span>
                  <span>bexsigmatech@gmail.com</span>
                </a>
              </div>

              {article.stats && (
                <div className="mc-stats-grid mc-ceo-stats">
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
            </div>

            <div className="mc-ceo-quote">
              "We don't just build software — we architect digital experiences that redefine what's possible."
            </div>
          </section>

          {/* 2. OUR MISSION & VISION CONTAINER */}
          <section className="mc-overview-box">
            <div className="mc-section-eyebrow" style={{ marginBottom: 10 }}>
              <span className="mc-eyebrow-dot" />
              OUR MISSION & VISION
            </div>
            <h3 className="mc-mission-title">{article.title} — {article.subtitle}</h3>
            <p className="mc-overview-text">{article.overview}</p>
          </section>

          {/* 3. SIGMA TECHNOLOGY ESSENTIALS / ARSENAL */}
          <section className="mc-tech-card">
            <div className="mc-section-eyebrow">
              <span className="mc-eyebrow-dot" />
              SIGMA TECHNOLOGY ESSENTIALS
            </div>
            <h3 className="mc-tech-heading">Advanced Engineering Stack & Core Frameworks</h3>
            <div className="mc-tech-tags-cloud">
              {(article.tech || activeMission.tech || []).map((t, idx) => (
                <span key={idx} className="mc-tech-pill interactive">
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* 4. SPECIALIZED CAPABILITIES / AI AUTOMATION ACTIVE LABS */}
          {article.id === 'ai_auto' ? (
            <section className="mc-ai-lab-section">
              {/* Central Holographic Neural Loading Stage */}
              <div className="mc-ai-loader-card">
                <div className="mc-ai-loader-gyro">
                  <div className="gyro-ring ring-1" />
                  <div className="gyro-ring ring-2" />
                  <div className="gyro-ring ring-3" />
                  <div className="gyro-core">
                    <span className="gyro-icon">🤖</span>
                    <span className="gyro-pulse-dot" />
                  </div>
                </div>

                <div className="mc-ai-loader-text-block">
                  <div className="mc-ai-loader-status-pill">
                    <span className="ai-status-pulse" />
                    <span>ACTIVE R&D WORKSPACE · ACTIVE PIPELINE IN PROGRESS</span>
                  </div>
                  <h3 className="mc-ai-loader-title">Engineering Custom AI Agent Swarms & Autonomous Pipelines</h3>
                  <p className="mc-ai-loader-desc">
                    Our AI Automation division is actively building bespoke neural workflows, voice intelligence gateways, and custom knowledge synthesizers. We engineer tailor-made AI solutions specifically for your business infrastructure rather than generic off-the-shelf templates.
                  </p>

                  {/* Dynamic Progress Bar */}
                  <div className="mc-ai-progress-container">
                    <div className="mc-ai-progress-labels">
                      <span>Neural Pipeline Calibration & Model Fine-Tuning</span>
                      <span className="mc-ai-progress-pct">88.4% COMPILING</span>
                    </div>
                    <div className="mc-ai-progress-track">
                      <div className="mc-ai-progress-fill" />
                      <div className="mc-ai-progress-glow" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Projects In Development Matrix */}
              <div className="mc-ai-projects-header">
                <div className="mc-section-eyebrow">
                  <span className="mc-eyebrow-dot" />
                  CONFIDENTIAL CLIENT PODS & ACTIVE WORKSTREAMS
                </div>
                <h3 className="mc-section-title">Current AI Projects Under Active Development</h3>
              </div>

              <div className="mc-ai-projects-grid">
                {[
                  {
                    code: 'PROJECT #01',
                    title: 'Autonomous Multi-Agent Workflow Swarms',
                    status: '⚡ PIPELINE COMPILING',
                    pct: 88,
                    color: '#00ff88',
                    desc: 'Autonomous agent network handling multi-stage approvals, CRM synchronization, automated handoffs, and notification routing across enterprise tools.',
                    tags: ['LangGraph', 'CrewAI', 'Node Core', 'REST Webhooks'],
                  },
                  {
                    code: 'PROJECT #02',
                    title: 'Intelligent Knowledge Synthesis & Note Generation',
                    status: '🧠 NEURAL TRAINING',
                    pct: 94,
                    color: '#38bdf8',
                    desc: 'Real-time audio/text transcription engine that classifies, summarizes, and automatically structures meeting minutes into searchable company wikis.',
                    tags: ['Gemini 2.0', 'Vector DB', 'Semantic Index', 'Whisper'],
                  },
                  {
                    code: 'PROJECT #03',
                    title: 'Sub-500ms Voice Multimodal Customer Agents',
                    status: '🎙️ LATENCY TUNING',
                    pct: 82,
                    color: '#a78bfa',
                    desc: 'Low-latency natural conversational voice and chat agents for 24/7 customer booking, lead triage, and direct client support.',
                    tags: ['WebRTC', 'Gemini Live', 'Voice HUD', 'Zero-Downtime'],
                  },
                  {
                    code: 'PROJECT #04',
                    title: 'Predictive Business Intelligence & Data Pipelines',
                    status: '📊 MODEL EVALUATION',
                    pct: 74,
                    color: '#f59e0b',
                    desc: 'Automated data extraction and neural forecasting models predicting customer demand, preventing churn, and drafting executive insight sheets.',
                    tags: ['Python Core', 'PyTorch', 'TimescaleDB', 'Encrypted'],
                  },
                ].map((proj, idx) => (
                  <div
                    key={idx}
                    className="mc-ai-project-card interactive"
                    style={{
                      '--proj-color': proj.color,
                    }}
                  >
                    <div className="mc-ai-proj-top">
                      <span className="mc-ai-proj-code">{proj.code}</span>
                      <span
                        className="mc-ai-proj-status"
                        style={{ color: proj.color, borderColor: proj.color + '55' }}
                      >
                        <span className="proj-status-dot" style={{ background: proj.color }} />
                        {proj.status}
                      </span>
                    </div>

                    <h4 className="mc-ai-proj-title">{proj.title}</h4>
                    <p className="mc-ai-proj-desc">{proj.desc}</p>

                    {/* Mini animated loading bar */}
                    <div className="mc-ai-mini-progress">
                      <div className="mc-ai-mini-track">
                        <div
                          className="mc-ai-mini-fill"
                          style={{
                            width: `${proj.pct}%`,
                            background: proj.color,
                            boxShadow: `0 0 10px ${proj.color}`,
                          }}
                        />
                      </div>
                      <span className="mc-ai-mini-pct">{proj.pct}%</span>
                    </div>

                    <div className="mc-ai-proj-tags">
                      {proj.tags.map((t, i) => (
                        <span key={i} className="mc-ai-proj-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Commission Custom AI Project Callout */}
              <div className="mc-ai-custom-banner">
                <div className="mc-ai-banner-icon">⚡</div>
                <div className="mc-ai-banner-content">
                  <h4>Have a Specific Workflow You Want Automated?</h4>
                  <p>
                    We don't sell generic templates. Tell us your manual bottlenecks and our AI engineering team will architect a dedicated autonomous agent system tailored to your tech stack.
                  </p>
                </div>
                <a
                  href="mailto:bexsigmatech@gmail.com?subject=Custom%20AI%20Automation%20Inquiry%20-%20Bex%20Sigma%20Tech"
                  className="mc-ai-banner-btn interactive"
                >
                  ✉ COMMISSION CUSTOM AI PROJECT
                </a>
              </div>
            </section>
          ) : (
            <section className="mc-capabilities-section">
              <div className="mc-section-header-row">
                <div className="mc-section-title-wrap">
                  <div className="mc-section-eyebrow">
                    <span className="mc-eyebrow-dot" />
                    SIGMA DELIVERABLES & CORE DISCIPLINES
                  </div>
                  <h3 className="mc-section-title">Specialized Capabilities ({article.services.length} Pillars)</h3>
                </div>
              </div>

              {/* Smooth Pillar Category Filter Chips */}
              <div className="mc-pillar-filter-bar" role="tablist">
                {[
                  { id: 'all', label: 'All 8 Pillars', icon: '✦' },
                  { id: 'engineering', label: 'Software & Apps', icon: '⚡' },
                  { id: 'web', label: 'Web & 3D Spatial', icon: '🌐' },
                  { id: 'growth', label: 'Marketing & Content', icon: '🚀' },
                  { id: 'ai', label: 'AI & Knowledge', icon: '🤖' },
                ].map((filter) => {
                  const isActive = (selectedCategory || 'all') === filter.id
                  return (
                    <button
                      key={filter.id}
                      className={`mc-pillar-chip interactive ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        cinemaAudio.playOrbSelect()
                        setSelectedCategory(filter.id)
                      }}
                      role="tab"
                      aria-selected={isActive}
                    >
                      <span className="mc-chip-filter-icon">{filter.icon}</span>
                      <span>{filter.label}</span>
                      {filter.id === 'all' && <span className="mc-chip-count">8</span>}
                    </button>
                  )
                })}
              </div>

              {/* Smooth Horizontal Bento Capabilities Grid */}
              <div className="mc-smooth-grid">
                {article.services
                  .filter((svc) => {
                    const cat = selectedCategory || 'all'
                    if (cat === 'all') return true
                    if (cat === 'engineering') return svc.title === 'Software' || svc.title === 'Application'
                    if (cat === 'web') return svc.title === 'Website' || svc.title === '3D Website'
                    if (cat === 'growth') return svc.title === 'Digital Marketing' || svc.title === 'Content'
                    if (cat === 'ai') return svc.title === 'AI Automation' || svc.title === 'Generate Notes'
                    return true
                  })
                  .map((svc, idx) => {
                    const originalIndex = article.services.findIndex((s) => s.title === svc.title)
                    const palette = ACCENT_PALETTES[originalIndex % ACCENT_PALETTES.length]
                    return (
                      <div
                        key={svc.title}
                        className="mc-smooth-card interactive"
                        style={{
                          '--card-accent': palette.color,
                          '--card-glow': palette.glow,
                          '--card-border': palette.border,
                        }}
                        onClick={() => {
                          cinemaAudio.playOrbSelect()
                          setSelectedServiceDetail({ ...svc, index: originalIndex, palette })
                        }}
                      >
                        {/* Left Side: Sleek Holographic Thumbnail */}
                        <div className="mc-smooth-img-wrap">
                          {svc.image ? (
                            <img
                              src={svc.image}
                              alt={svc.title}
                              className="mc-smooth-img"
                              loading="lazy"
                            />
                          ) : (
                            <div className="mc-smooth-img-placeholder">
                              {SERVICE_ICONS[originalIndex % SERVICE_ICONS.length]}
                            </div>
                          )}
                          <div className="mc-smooth-img-overlay" />
                          <div className="mc-smooth-img-scanline" />
                          
                          <div className="mc-smooth-img-top">
                            <span className="mc-smooth-index">0{originalIndex + 1}</span>
                            {svc.badge && (
                              <span
                                className="mc-smooth-badge"
                                style={{
                                  color: palette.color,
                                  borderColor: palette.border,
                                }}
                              >
                                {svc.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Side: Smooth Info & Action Flow */}
                        <div className="mc-smooth-content">
                          <div>
                            <div className="mc-smooth-title-row">
                              <h4 className="mc-smooth-title">{svc.title}</h4>
                              <div className="mc-smooth-icon" style={{ color: palette.color }}>
                                {SERVICE_ICONS[originalIndex % SERVICE_ICONS.length]}
                              </div>
                            </div>
                            {svc.subtitle && (
                              <div className="mc-smooth-subtitle" style={{ color: palette.color }}>
                                {svc.subtitle}
                              </div>
                            )}
                            <p className="mc-smooth-desc">{svc.desc}</p>
                          </div>

                          <div className="mc-smooth-footer">
                            <div className="mc-smooth-specs">
                              <span className="mc-smooth-spec-pill">
                                {svc.specs?.latency || '< 48h Sprint'}
                              </span>
                              <span className="mc-smooth-spec-pill">
                                {svc.specs?.integrity || '100% QA'}
                              </span>
                            </div>
                            <div className="mc-smooth-cta-btn">
                              <span>Blueprint</span>
                              <span className="mc-smooth-arrow">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </section>
          )}

          {/* 5. READY TO CONTACT US */}
          <section className="mc-bottom-cta">
            <div className="mc-section-eyebrow" style={{ justifyContent: 'center', marginBottom: 12 }}>
              <span className="mc-eyebrow-dot" />
              READY TO CONTACT US
            </div>
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
              {article.id === 'web_dev' && (
                <button className="mc-btn-primary interactive" onClick={handleStartMission}>
                  🚀 ENTER WEB STORE
                </button>
              )}
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
        </main>
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
                {selectedServiceDetail.badge || article.badge} · TECHNICAL BLUEPRINT
              </span>
              <button
                className="mc-blueprint-close interactive"
                onClick={() => setSelectedServiceDetail(null)}
              >
                ×
              </button>
            </div>

            <div className="mc-blueprint-body">
              {selectedServiceDetail.image && (
                <div className="mc-blueprint-hero-wrap">
                  <img
                    src={selectedServiceDetail.image}
                    alt={selectedServiceDetail.title}
                    className="mc-blueprint-hero-img"
                  />
                  <div className="mc-blueprint-hero-overlay" />
                  <div className="mc-blueprint-hero-tag">
                    <span className="mc-live-dot" />
                    <span>SYSTEM NODE: {selectedServiceDetail.title.toUpperCase()}</span>
                  </div>
                </div>
              )}

              <h3 className="mc-blueprint-title">{selectedServiceDetail.title}</h3>
              {selectedServiceDetail.subtitle && (
                <h4 className="mc-blueprint-subtitle" style={{ color: selectedServiceDetail.palette?.color }}>
                  {selectedServiceDetail.subtitle}
                </h4>
              )}
              <p className="mc-blueprint-desc">{selectedServiceDetail.desc}</p>

              <div className="mc-blueprint-specs-grid">
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">PROVISIONING LATENCY</div>
                  <div className="mc-spec-val">{selectedServiceDetail.specs?.latency || '< 48h Sprint Ready'}</div>
                </div>
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">CODE INTEGRITY</div>
                  <div className="mc-spec-val">{selectedServiceDetail.specs?.integrity || '100% Automated CI/CD + QA'}</div>
                </div>
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">SECURITY POSTURE</div>
                  <div className="mc-spec-val">{selectedServiceDetail.specs?.security || 'Post-Quantum Cryptography'}</div>
                </div>
                <div className="mc-blueprint-spec-item">
                  <div className="mc-spec-lbl">MAINTENANCE SLA</div>
                  <div className="mc-spec-val">{selectedServiceDetail.specs?.sla || '24/7 Continuous Monitoring'}</div>
                </div>
              </div>

              <div className="mc-blueprint-actions">
                <button
                  className="mc-btn-primary interactive"
                  onClick={() => {
                    const target = selectedServiceDetail.targetSector
                    setSelectedServiceDetail(null)
                    if (target) {
                      handleSelectSector(target)
                    } else {
                      handleStartMission()
                    }
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
