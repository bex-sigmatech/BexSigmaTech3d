import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { liveVoiceClient } from '../../audio/GeminiLiveClient'

export default function BootScreen() {
  const {
    loadingProgress,
    setLoadingProgress,
    unlockAudioContext,
    startLoading,
    triggerAccessGranted,
    graphicsQuality,
    setGraphicsQuality,
    navigateToSector
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
    // LAGFREE INSTANT TRANSITION: Skip multi-stage 20-second artificial wait directly to HQ
    useStore.setState({
      scene: 'headquarters',
      loadingProgress: 100,
      audioContextUnlocked: true,
      isIntroSkipped: true,
      userName: useStore.getState().userName || 'Guest'
    })
    cinemaAudio.setScene('headquarters')
    voiceEmitter.emit('HQ_SCENE_ACTIVE')
  }

  useEffect(() => {
    if (!started) return

    let current = 0
    let milestone25 = false
    let milestone75 = false
    let accessTimeout = null
    const interval = setInterval(() => {
      // If user hit SKIP, abort boot sequencing immediately
      if (useStore.getState().isIntroSkipped) {
        clearInterval(interval)
        if (accessTimeout) clearTimeout(accessTimeout)
        return
      }

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
        accessTimeout = setTimeout(() => {
          if (useStore.getState().isIntroSkipped) return
          triggerAccessGranted()
        }, 2500) // 2.5s timeout so the complete voice line plays fully before transition
      }
      setLoadingProgress(Math.min(Math.floor(current), 100))
    }, 45)

    return () => {
      clearInterval(interval)
      if (accessTimeout) clearTimeout(accessTimeout)
    }
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
        /* ── MOBILE-DEDICATED LANDING SCREEN (PURE BLACK & APPLE GLASSMORPHISM) ── */
        <div className="mobile-boot-wrapper">
          <div className="mb-pure-black-bg" />
          <div className="mb-ambient-core-glow" />

          {!started ? (
            <div className="mb-minimal-hero">
              {/* Center Hero: 3D Chrome/Cyan Monogram + Brand Typography */}
              <div className="mb-hero-center">
                <div className="mb-chrome-emblem-container">
                  <div className="mb-emblem-glint" />
                  <div className="mb-chrome-symbol">
                    <span className="symbol-x">X</span>
                    <span className="symbol-sigma">Σ</span>
                  </div>
                </div>

                <div className="mb-brand-typography">
                  <h1 className="mb-brand-title">BEx Sigma Tech</h1>
                  <p className="mb-brand-subtitle">NEXT-GENERATION DIGITAL EXPERIENCES</p>
                </div>
              </div>

              {/* Lower Controls: Apple VisionOS Spatial Glassmorphism */}
              <div className="mb-controls-group">
                <button
                  className="interactive"
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))',
                    color: '#ffffff',
                    border: '1px solid rgba(16, 185, 129, 0.6)',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    fontFamily: 'Orbitron, sans-serif',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onClick={() => {
                    setStarted(true)
                    useStore.setState({ bootStarted: true, isIntroSkipped: true })
                    navigateToSector('web_dev')
                  }}
                >
                  <span>🛒</span>
                  <span>GO TO EXCEL TEMPLATE</span>
                </button>

                <button className="mb-apple-glass-cta interactive" onClick={handleStart}>
                  <span className="cta-glass-sheen" />
                  <span className="cta-glass-text">NEXT</span>
                  <span className="cta-glass-arrow">→</span>
                </button>

                <button
                  className="boot-quickview-btn mb-quickview-btn interactive"
                  onClick={() => {
                    setStarted(true)
                    useStore.setState({ bootStarted: true })
                    unlockAudioContext()
                    useStore.setState({
                      scene: 'headquarters',
                      loadingProgress: 100,
                      audioContextUnlocked: true,
                      isIntroSkipped: true,
                      userName: 'Guest'
                    })
                  }}
                >
                  QUICK EXPLORE →
                </button>

                <div className="mb-apple-segmented-toggle">
                  <button
                    className={`mb-segment-pill interactive ${graphicsQuality === 'high' ? 'active' : ''}`}
                    onClick={() => setGraphicsQuality('high')}
                  >
                    HIGH GRAPHICS
                  </button>
                  <button
                    className={`mb-segment-pill interactive ${graphicsQuality === 'low' ? 'active' : ''}`}
                    onClick={() => setGraphicsQuality('low')}
                  >
                    LOW GRAPHICS
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="nolan-boot-content mobile-boot-loading">
              <div className="nolan-logo">BEx Sigma Tech</div>

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
              <div className="nolan-logo" style={{ marginBottom: '6px' }}>BEx Sigma Tech</div>

              <button
                className="interactive"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))',
                  color: '#ffffff',
                  border: '1px solid rgba(16, 185, 129, 0.7)',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 25px rgba(16, 185, 129, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onClick={() => {
                  setStarted(true)
                  useStore.setState({ bootStarted: true, isIntroSkipped: true })
                  navigateToSector('web_dev')
                }}
              >
                <span>🛒</span>
                <span>GO TO EXCEL TEMPLATE</span>
              </button>

              <button className="nolan-start-btn interactive" onClick={handleStart}>
                NEXT →
              </button>

              <button
                className="boot-quickview-btn interactive"
                onClick={() => {
                  setStarted(true)
                  useStore.setState({ bootStarted: true })
                  unlockAudioContext()
                  // Skip directly to HQ
                  useStore.setState({
                    scene: 'headquarters',
                    loadingProgress: 100,
                    audioContextUnlocked: true,
                    isIntroSkipped: true,
                    userName: 'Guest'
                  })
                }}
              >
                QUICK EXPLORE →
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
              <div className="nolan-logo">BEx Sigma Tech</div>

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
