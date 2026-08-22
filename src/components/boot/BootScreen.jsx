import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'

export default function BootScreen() {
  const {
    loadingProgress,
    setLoadingProgress,
    unlockAudioContext,
    startLoading,
    triggerAccessGranted,
    graphicsQuality,
    setGraphicsQuality
  } = useStore()
  const [started, setStarted] = useState(false)
  const voice25Ref = useRef(false)
  const voice50Ref = useRef(false)
  const voice75Ref = useRef(false)
  const voice100Ref = useRef(false)

  const handleStart = () => {
    setStarted(true)
    useStore.setState({ bootStarted: true })
    unlockAudioContext()
    startLoading()
    // Event-driven trigger
    voiceEmitter.emit('LOADING_STARTED')
  }

  useEffect(() => {
    if (!started) return

    let current = 0
    let milestone25 = false
    let milestone75 = false
    const interval = setInterval(() => {
      let increment = 1 + Math.random() * 2.2
      if (current >= 35 && current < 38) increment = 0.4
      if (current >= 75 && current < 78) increment = 0.3

      current += increment

      // 25% — Core modules online
      if (current >= 25 && !milestone25) {
        milestone25 = true
        cinemaAudio.playBinaryTick()
        if (!voice25Ref.current) {
          voice25Ref.current = true
          voiceEmitter.emit('LOADING_25')
        }
      }

      // 50% — AI systems operational
      if (current >= 50 && !voice50Ref.current) {
        voice50Ref.current = true
        cinemaAudio.playBinaryTick()
        voiceEmitter.emit('LOADING_50')
      }

      // 75% — Security verification complete
      if (current >= 75 && !milestone75) {
        milestone75 = true
        cinemaAudio.playBinaryTick()
        if (!voice75Ref.current) {
          voice75Ref.current = true
          voiceEmitter.emit('LOADING_75')
        }
      }

      if (current >= 100) {
        current = 100
        clearInterval(interval)
        cinemaAudio.playBinaryTick()
        if (!voice100Ref.current) {
          voice100Ref.current = true
          voiceEmitter.emit('LOADING_COMPLETE')
        }
        setTimeout(() => {
          triggerAccessGranted()
        }, 2500) // 2.5s timeout so the complete voice line plays fully before transition
      }
      setLoadingProgress(Math.min(Math.floor(current), 100))
    }, 45)

    return () => clearInterval(interval)
  }, [started, setLoadingProgress, triggerAccessGranted])

  const [isMobileScreen, setIsMobileScreen] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)

  useEffect(() => {
    const checkMobile = () => setIsMobileScreen(window.innerWidth <= 768)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="nolan-boot-screen">
      {isMobileScreen ? (
        /* ── MOBILE-DEDICATED LANDING SCREEN ── */
        <div className="mobile-boot-wrapper">
          {!started ? (
            <div className="mobile-boot-hero">
              {/* Top Brand Bar */}
              <div className="mobile-brand-bar">
                <div className="mobile-brand-logo">
                  <span className="logo-symbol">XΣ</span>
                  <span className="logo-text">BEX SIGMA <strong>TECH</strong></span>
                </div>
                <div className="mobile-status-pill">
                  <span className="pill-dot" /> SYSTEM READY
                </div>
              </div>

              {/* 3D Holographic Scanner Reticle */}
              <div className="mobile-scanner-container">
                <div className="mobile-reticle-ring ring-outer" />
                <div className="mobile-reticle-ring ring-middle" />
                <div className="mobile-emblem-core">
                  <div className="emblem-sig">XΣ</div>
                  <div className="emblem-glow-orbit" />
                </div>
                <div className="mobile-scan-readout">
                  <span className="blink-cyan">SCANNING:</span> VERIFYING PROTOCOLS...
                </div>
              </div>

              {/* Hero Headlines */}
              <div className="mobile-hero-text">
                <h1 className="mobile-title">BEX SIGMA TECH</h1>
                <p className="mobile-subtitle">PIONEERING AEROSPACE AI &amp; WEB DEVELOPMENT</p>
              </div>

              {/* Telemetry Micro-Badges */}
              <div className="mobile-telemetry-grid">
                <div className="mobile-badge-item">
                  <span className="badge-label">AI SYSTEMS:</span>
                  <span className="badge-value green">ACTIVE (98.4%)</span>
                </div>
                <div className="mobile-badge-item">
                  <span className="badge-label">NETWORKS:</span>
                  <span className="badge-value cyan">SECURE (ALPHA)</span>
                </div>
                <div className="mobile-badge-item">
                  <span className="badge-label">WEB PROTOCOLS:</span>
                  <span className="badge-value cyan">OPTIMIZED</span>
                </div>
                <div className="mobile-badge-item">
                  <span className="badge-label">PROJECT STATUS:</span>
                  <span className="badge-value green">LIVE</span>
                </div>
              </div>

              {/* Main CTA Button */}
              <button className="mobile-cta-btn interactive" onClick={handleStart}>
                <span>ENTER CINEMATIC EXPERIENCE</span>
                <span className="cta-arrow">→</span>
              </button>

              <p className="mobile-tagline">UNLOCK THE FUTURE OF AEROSPACE. BEYOND IMAGINATION.</p>

              {/* Graphics Preset selector */}
              <div className="graphics-mode-selector mobile-gfx-mode">
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.45)' }}>GRAPHICS PRESET:</span>
                <div className="graphics-toggle-buttons">
                  <button
                    className={`graphics-toggle-btn interactive ${graphicsQuality === 'high' ? 'active' : ''}`}
                    onClick={() => setGraphicsQuality('high')}
                  >
                    HIGH (CINEMATIC)
                  </button>
                  <button
                    className={`graphics-toggle-btn interactive ${graphicsQuality === 'low' ? 'active' : ''}`}
                    onClick={() => setGraphicsQuality('low')}
                  >
                    LOW (LAG FREE)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="nolan-boot-content mobile-boot-loading">
              <div className="nolan-logo">BEX SIGMA TECH</div>

              {/* Circular HUD Loader */}
              <div className="boot-circular-loader">
                <svg viewBox="0 0 150 150" width="140" height="140" className="boot-svg-ring">
                  <circle cx="75" cy="75" r="68" fill="none" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1.5" strokeDasharray="8 6" className="reticle-rotate-cw" />
                  <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1" />
                  <circle
                    cx="75"
                    cy="75"
                    r="56"
                    fill="none"
                    stroke={loadingProgress >= 75 ? "#00ff88" : "#00d4ff"}
                    strokeWidth="3.5"
                    strokeDasharray="351.8"
                    strokeDashoffset={351.8 - (loadingProgress / 100) * 351.8}
                    strokeLinecap="round"
                    className="boot-progress-circle"
                  />
                  <path d="M 75,5 L 75,15 M 75,145 L 75,135 M 5,75 L 15,75 M 145,75 L 135,75" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                </svg>

                <div className="circular-percentage-box">
                  {loadingProgress === 100 ? (
                    <span className="milestone-check milestone-check-blue" style={{ fontSize: '2.2rem', marginTop: '-4px' }}>▶</span>
                  ) : loadingProgress >= 75 ? (
                    <span className="milestone-check milestone-green" style={{ fontSize: '2.2rem', marginTop: '-4px', color: '#00ff88' }}>✓</span>
                  ) : (
                    <>
                      <span className="percent-num">{loadingProgress}</span>
                      <span className="percent-symbol">%</span>
                    </>
                  )}
                </div>
              </div>

              <div className={`nolan-status-label ${loadingProgress >= 75 ? 'status-green' : 'status-cyan'}`}>
                {loadingProgress < 25 && "INITIALIZING SYSTEM NETWORK..."}
                {loadingProgress >= 25 && loadingProgress < 50 && "CORE MODULES ONLINE..."}
                {loadingProgress >= 50 && loadingProgress < 75 && "AI SYSTEMS OPERATIONAL..."}
                {loadingProgress >= 75 && loadingProgress < 100 && "SECURITY VERIFICATION COMPLETE"}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ── DESKTOP LANDING SCREEN (UNCHANGED) ── */
        <div className="desktop-boot-wrapper">
          {!started ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <button className="nolan-start-btn interactive" onClick={handleStart}>
                ENTER CINEMATIC EXPERIENCE
              </button>

              <div className="graphics-mode-selector">
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)' }}>GRAPHICS PRESET:</span>
                <div className="graphics-toggle-buttons">
                  <button
                    className={`graphics-toggle-btn interactive ${graphicsQuality === 'high' ? 'active' : ''}`}
                    onClick={() => setGraphicsQuality('high')}
                  >
                    HIGH (CINEMATIC)
                  </button>
                  <button
                    className={`graphics-toggle-btn interactive ${graphicsQuality === 'low' ? 'active' : ''}`}
                    onClick={() => setGraphicsQuality('low')}
                  >
                    LOW (LAG FREE)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="nolan-boot-content">
              <div className="nolan-logo">BEX SIGMA TECH</div>

              <div className="boot-circular-loader">
                <svg viewBox="0 0 150 150" width="150" height="150" className="boot-svg-ring">
                  <circle cx="75" cy="75" r="68" fill="none" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1.5" strokeDasharray="8 6" className="reticle-rotate-cw" />
                  <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1" />
                  <circle
                    cx="75"
                    cy="75"
                    r="56"
                    fill="none"
                    stroke={loadingProgress >= 75 ? "#00ff88" : "#00d4ff"}
                    strokeWidth="3.5"
                    strokeDasharray="351.8"
                    strokeDashoffset={351.8 - (loadingProgress / 100) * 351.8}
                    strokeLinecap="round"
                    className="boot-progress-circle"
                  />
                  <path d="M 75,5 L 75,15 M 75,145 L 75,135 M 5,75 L 15,75 M 145,75 L 135,75" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                </svg>

                <div className="circular-percentage-box">
                  {loadingProgress === 100 ? (
                    <span className="milestone-check milestone-check-blue" style={{ fontSize: '2.2rem', marginTop: '-4px' }}>▶</span>
                  ) : loadingProgress >= 75 ? (
                    <span className="milestone-check milestone-green" style={{ fontSize: '2.2rem', marginTop: '-4px', color: '#00ff88' }}>✓</span>
                  ) : (
                    <>
                      <span className="percent-num">{loadingProgress}</span>
                      <span className="percent-symbol">%</span>
                    </>
                  )}
                </div>
              </div>

              <div className={`nolan-status-label ${loadingProgress >= 75 ? 'status-green' : 'status-cyan'}`}>
                {loadingProgress < 25 && "INITIALIZING SYSTEM NETWORK..."}
                {loadingProgress >= 25 && loadingProgress < 50 && "CORE MODULES ONLINE..."}
                {loadingProgress >= 50 && loadingProgress < 75 && "AI SYSTEMS OPERATIONAL..."}
                {loadingProgress >= 75 && loadingProgress < 100 && "SECURITY VERIFICATION COMPLETE"}
                {loadingProgress === 100 && "INITIALIZATION COMPLETE"}
              </div>

              {loadingProgress === 100 && (
                <div className="boot-milestone-overlay" style={{ pointerEvents: 'none' }}>
                  <div className="milestone-ring-burst">
                    <div className="ring-burst-1" />
                    <div className="ring-burst-2" />
                    <div className="ring-burst-3" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
