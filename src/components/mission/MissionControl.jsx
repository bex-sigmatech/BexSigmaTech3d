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
]

const SERVICE_ICONS = ['⬡', '◈', '⬢', '✦', '⚡', '🦾', '🛡️', '⚙️']

const PILLAR_MONOGRAMS = {
  'Software': { letter: 'S', label: 'SOFTWARE', color: '#00d4ff', glow: 'rgba(0,212,255,0.3)', border: 'rgba(0,212,255,0.5)' },
  'Application': { letter: 'A', label: 'APPLICATION', color: '#38bdf8', glow: 'rgba(56,189,248,0.3)', border: 'rgba(56,189,248,0.5)' },
  'Website': { letter: 'W', label: 'WEBSITE', color: '#7c3aed', glow: 'rgba(124,58,237,0.3)', border: 'rgba(124,58,237,0.5)' },
  '3D Website': { letter: '3D', label: '3D WEBSITE', color: '#e879f9', glow: 'rgba(232,121,249,0.3)', border: 'rgba(232,121,249,0.5)' },
  'Digital Marketing': { letter: 'M', label: 'MARKETING', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', border: 'rgba(245,158,11,0.5)' },
  'Content': { letter: 'C', label: 'CONTENT', color: '#ef4444', glow: 'rgba(239,68,68,0.3)', border: 'rgba(239,68,68,0.5)' },
  'AI Automation': { letter: 'AI', label: 'AI AGENTS', color: '#00ff88', glow: 'rgba(0,255,136,0.3)', border: 'rgba(0,255,136,0.5)' },
  'Generate Notes': { letter: 'N', label: 'GENERATE NOTES', color: '#a78bfa', glow: 'rgba(167,139,250,0.3)', border: 'rgba(167,139,250,0.5)' },
}

function getPillarInfo(title = '', originalIndex = 0) {
  if (PILLAR_MONOGRAMS[title]) return PILLAR_MONOGRAMS[title]
  for (const [key, val] of Object.entries(PILLAR_MONOGRAMS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return val
  }
  const defaultPalette = ACCENT_PALETTES[originalIndex % ACCENT_PALETTES.length]
  return {
    letter: title.slice(0, 1).toUpperCase() || '✦',
    label: title.toUpperCase(),
    color: defaultPalette.color,
    glow: defaultPalette.glow,
    border: defaultPalette.border,
  }
}

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
  const [mobileTab, setMobileTab] = useState('all')

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
              <span className="mc-back-btn-arrow">‹</span>
              <span className="mc-back-btn-text">HQ</span>
            </button>

            <div className="mc-header-titles">
              <div className="mc-dept-label">
                <span className="mc-badge-pill">SECTOR {String((ALL_SECTORS.findIndex(s => s.id === currentSectorId) + 1) || 1).padStart(2, '0')}</span>
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
              <span>{isNarrating ? 'NARRATING…' : 'VOICE BRIEF'}</span>
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

        {/* ── Mobile Tactical View Switcher (Mobile Only) ── */}
        <div className="mc-mobile-tab-bar" role="tablist">
          {[
            { id: 'all', label: '✦ ALL INTEL' },
            { id: 'capabilities', label: '⚡ 8 PILLARS' },
            { id: 'leadership', label: '🎖️ LEADERSHIP' },
            { id: 'vision', label: '🌐 VISION & TECH' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`mc-mobile-tab-btn interactive ${mobileTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                cinemaAudio.playOrbSelect()
                setMobileTab(tab.id)
              }}
              role="tab"
              aria-selected={mobileTab === tab.id}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main Command Body ── */}
        {article.id === 'ai_auto' ? (
          <main className="mc-ai-solo-loading-wrap">
            <div className="mc-ai-solo-card">
              {/* Pulsing Emerald Live Status Badge */}
              <div className="mc-ai-solo-badge">
                <span className="mc-ai-solo-dot" />
                <span>AI AUTOMATION DIVISION</span>
              </div>

              {/* 3-Ring Futuristic Gyro Loading Spinner */}
              <div className="mc-ai-solo-spinner-box">
                <div className="mc-ai-solo-ring r1" />
                <div className="mc-ai-solo-ring r2" />
                <div className="mc-ai-solo-ring r3" />
                <div className="mc-ai-solo-core">⚡</div>
              </div>

              {/* Minimalist Project Headline */}
              <h2 className="mc-ai-solo-title">Working on Projects...</h2>
              <p className="mc-ai-solo-subtitle">
                Autonomous AI agents, neural pipelines, and workflow automation suites are currently under active synthesis.
              </p>

              {/* Animated Neural Pulse Progress Indicator */}
              <div className="mc-ai-solo-progress-box">
                <div className="mc-ai-solo-progress-bar">
                  <div className="mc-ai-solo-progress-fill" />
                </div>
                <div className="mc-ai-solo-progress-info">
                  <span>Neural Pipeline Calibration</span>
                  <span className="mc-ai-solo-pct">IN PROGRESS</span>
                </div>
              </div>

              {/* Direct Action */}
              <div className="mc-ai-solo-action">
                <button
                  className="mc-ai-solo-back-btn interactive"
                  onClick={() => handleSelectSector('mission_control')}
                >
                  ← RETURN TO MISSION CONTROL
                </button>
              </div>
            </div>
          </main>
        ) : (
          <main className="mc-body-grid mc-linear-flow">
            {/* 1. FOUNDER & CEO PROFILE CONTAINER */}
            {(mobileTab === 'all' || mobileTab === 'leadership') && (
              <section className="mc-ceo-card mc-ceo-card-fullwidth">
                <div className="mc-ceo-glow-ring" />
                
                {/* Top HUD Security & Protocol Header */}
                <div className="mc-ceo-top-header">
                  <div className="mc-section-eyebrow">
                    <span className="mc-eyebrow-dot" />
                    <span className="mc-eyebrow-tag">LVL-9 ARCHITECT</span>
                    <span>FOUNDER & LEADERSHIP</span>
                  </div>
                  <div className="mc-live-status-pill">
                    <span className="mc-live-dot" />
                    <span>DIRECT LINE ACTIVE</span>
                  </div>
                </div>

                <div className="mc-ceo-content">
                  {/* Holographic Cyber Avatar Chamber */}
                  <div className="mc-ceo-avatar-wrap">
                    <div className="mc-avatar-chamber-frame">
                      <img
                        src="/ceo_hariharan.jpg"
                        alt="Hariharan.D — Founder & CEO of Bex Sigma Tech"
                        className="mc-ceo-avatar"
                      />
                      <div className="mc-avatar-scanline" />
                      <div className="mc-avatar-crosshair tl" />
                      <div className="mc-avatar-crosshair tr" />
                      <div className="mc-avatar-crosshair bl" />
                      <div className="mc-avatar-crosshair br" />
                    </div>
                    <div className="mc-ceo-avatar-ring" />
                    <div className="mc-ceo-status-dot" title="Online" />
                    <div className="mc-ceo-verified-badge">
                      <span className="mc-verified-icon">✓</span>
                      <span>VERIFIED</span>
                    </div>
                  </div>

                  {/* Identity & Cyber Bio */}
                  <div className="mc-ceo-info">
                    <div className="mc-ceo-badge-row">
                      <span className="mc-ceo-badge">FOUNDER & CEO</span>
                      <span className="mc-ceo-sub-badge">CHIEF ARCHITECT</span>
                    </div>
                    <h2 className="mc-ceo-name">Hariharan.D</h2>
                    <p className="mc-ceo-tagline">Visionary Architect & Full-Stack Pioneer · BEx Sigma Tech</p>

                    {/* Direct Contact Action Button */}
                    <div className="mc-ceo-action-row">
                      <a
                        href="mailto:bexsigmatech@gmail.com?subject=Project%20Inquiry%20-%20BEx%20Sigma%20Tech"
                        className="mc-ceo-email interactive"
                        title="Contact BEx Sigma Tech"
                      >
                        <span className="mc-ceo-email-icon">✉</span>
                        <span>CONTACT BEX SIGMA TECH · bexsigmatech@gmail.com</span>
                        <span className="mc-ceo-email-arrow">⚡</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Specialization Pills — Full Width Row */}
                <div className="mc-ceo-skills-row">
                  <span className="mc-ceo-skill-pill">⚡ 3D Spatial Engines</span>
                  <span className="mc-ceo-skill-pill">🧠 Autonomous AI</span>
                  <span className="mc-ceo-skill-pill">🛡️ Core Architecture</span>
                </div>

                {/* 3-Segment KPI Metrics — Full Width Grid */}
                {article.stats && (
                  <div className="mc-stats-grid mc-ceo-stats">
                    {article.stats.map((s, i) => (
                      <div key={i} className="mc-stat-item">
                        <div className="mc-stat-item-bar" />
                        <div className="mc-stat-item-val">
                          <AnimatedCounter value={s.value} duration={1200 + i * 200} />
                        </div>
                        <div className="mc-stat-item-lbl">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Holographic Manifesto Transmission */}
                <div className="mc-ceo-quote">
                  <div className="mc-quote-header">
                    <span className="mc-quote-prefix">// ARCHITECT TRANSMISSION #001</span>
                    <span className="mc-quote-wave">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                  <div className="mc-quote-body">
                    "We don't just build software — we architect digital experiences that redefine what's possible."
                  </div>
                </div>
              </section>
            )}

            {/* 2. OUR MISSION & VISION CONTAINER */}
            {(mobileTab === 'all' || mobileTab === 'vision') && (
              <section className="mc-overview-box">
                <div className="mc-section-eyebrow" style={{ marginBottom: 10 }}>
                  <span className="mc-eyebrow-dot" />
                  OUR MISSION & VISION
                </div>
                <h3 className="mc-mission-title">{article.title} — {article.subtitle}</h3>
                <p className="mc-overview-text">{article.overview}</p>
              </section>
            )}

            {/* 3. SIGMA TECHNOLOGY ESSENTIALS / ARSENAL */}
            {(mobileTab === 'all' || mobileTab === 'vision') && (
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
            )}

            {/* 4. SPECIALIZED CAPABILITIES */}
            {(mobileTab === 'all' || mobileTab === 'capabilities') && (
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
                      const pillarInfo = getPillarInfo(svc.title, originalIndex)
                      return (
                        <div
                          key={svc.title}
                          className="mc-smooth-card interactive"
                          style={{
                            '--card-accent': pillarInfo.color,
                            '--card-glow': pillarInfo.glow,
                            '--card-border': pillarInfo.border,
                          }}
                          onClick={() => {
                            cinemaAudio.playOrbSelect()
                            setSelectedServiceDetail({ ...svc, index: originalIndex, pillarInfo })
                          }}
                        >
                        {/* Left Side: Minimalist Glowing Letter Monogram (e.g. S for Software) */}
                        <div
                          className="mc-smooth-letter-wrap"
                          style={{
                            '--pillar-color': pillarInfo.color,
                            '--pillar-glow': pillarInfo.glow,
                            '--pillar-border': pillarInfo.border,
                          }}
                        >
                          <div className="mc-letter-box">
                            <span className="mc-pillar-letter">{pillarInfo.letter}</span>
                            <span className="mc-pillar-label">{svc.title}</span>
                            <div className="mc-letter-corner tl" />
                            <div className="mc-letter-corner tr" />
                            <div className="mc-letter-corner bl" />
                            <div className="mc-letter-corner br" />
                          </div>
                          <div className="mc-letter-overlay" />
                          <div className="mc-letter-scanline" />
                          
                          <div className="mc-smooth-img-top">
                            <span className="mc-smooth-index">0{originalIndex + 1}</span>
                            {svc.badge && (
                              <span
                                className="mc-smooth-badge"
                                style={{
                                  color: pillarInfo.color,
                                  borderColor: pillarInfo.border,
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
                              <div className="mc-smooth-icon" style={{ color: pillarInfo.color }}>
                                {SERVICE_ICONS[originalIndex % SERVICE_ICONS.length]}
                              </div>
                            </div>
                            {svc.subtitle && (
                              <div className="mc-smooth-subtitle" style={{ color: pillarInfo.color }}>
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
                  ? 'Ready to Launch Your Digital Future with BEx Sigma Tech?'
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
                  href="mailto:bexsigmatech@gmail.com?subject=Project%20Inquiry%20-%20BEx%20Sigma%20Tech"
                  className="mc-btn-ceo-contact interactive"
                >
                  ✉ CONTACT BEX SIGMA TECH
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
        )}
      </div>

      {/* ── Interactive Capability Detail Blueprint Modal ── */}
      {selectedServiceDetail && (() => {
        const modalPillar = selectedServiceDetail.pillarInfo || getPillarInfo(selectedServiceDetail.title, selectedServiceDetail.index || 0)
        return (
          <div className="mc-blueprint-overlay" onClick={() => setSelectedServiceDetail(null)}>
            <div
              className="mc-blueprint-box interactive"
              onClick={(e) => e.stopPropagation()}
              style={{
                '--modal-border': modalPillar.border,
                '--modal-glow': modalPillar.glow,
              }}
            >
              <div className="mc-blueprint-header">
                <span
                  className="mc-blueprint-badge"
                  style={{ color: modalPillar.color }}
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
                {/* Minimalist Glowing Letter Hero Monogram */}
                <div
                  className="mc-blueprint-letter-hero"
                  style={{
                    '--pillar-color': modalPillar.color,
                    '--pillar-glow': modalPillar.glow,
                    '--pillar-border': modalPillar.border,
                  }}
                >
                  <div className="mc-blueprint-letter-box">
                    <span className="mc-blueprint-big-letter">{modalPillar.letter}</span>
                    <span className="mc-blueprint-letter-title">{selectedServiceDetail.title}</span>
                    <div className="mc-letter-corner tl" />
                    <div className="mc-letter-corner tr" />
                    <div className="mc-letter-corner bl" />
                    <div className="mc-letter-corner br" />
                  </div>
                  <div className="mc-blueprint-hero-overlay" />
                  <div className="mc-blueprint-hero-tag">
                    <span className="mc-live-dot" style={{ background: modalPillar.color }} />
                    <span>SYSTEM NODE: {selectedServiceDetail.title.toUpperCase()}</span>
                  </div>
                </div>
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
      )
    })()}
    </div>
  )
}
