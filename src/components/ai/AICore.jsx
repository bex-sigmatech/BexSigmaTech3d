import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter, aiVoice } from '../../audio/AIVoiceEngine'

/* ==========================================================================
   BEX SIGMA TECH 2070 — CINEMATIC AI CORE SEQUENCE
   Biometric 3D Scanner · Typewriter AI Dialogue · Live Telemetry Matrix
   ========================================================================== */

/* ─── Typewriter text component — LAGFREE: rAF instead of setInterval churn ─── */
function TypewriterText({ text, speed = 35 }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    if (!text) return
    let idx = 0
    let last = performance.now()
    let raf = 0
    const tick = (now) => {
      if (now - last >= speed) {
        idx++
        setDisplayedText(text.slice(0, idx))
        last = now
        if (idx >= text.length) return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, speed])

  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayedText}</span>
}

/* ─── Procedural 3D Particle Field — LAGFREE: no scale-accumulate, pause on hidden ─── */
function ParticleField3D({ count = 70 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const effCount = window.innerWidth <= 768 ? Math.min(count, 25) : count

    const particles = Array.from({ length: effCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.00018,
      vy: -Math.random() * 0.00025 - 0.00008,
      size: Math.random() * 2.2 + 0.4,
      alpha: Math.random() * 0.55 + 0.12,
    }))

    let animId
    let isHidden = false
    const onVis = () => {
      isHidden = document.hidden
      if (!isHidden && !animId) animId = requestAnimationFrame(render)
    }
    document.addEventListener('visibilitychange', onVis)
    const render = () => {
      if (document.hidden) { animId = null; return }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = window.innerWidth
      const h = window.innerHeight
      const needResize = canvas.width !== w * dpr || canvas.height !== h * dpr
      if (needResize) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      } else {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      ctx.clearRect(0, 0, w, h)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < 0) { p.y = 1; p.x = Math.random() }
        if (p.x < 0 || p.x > 1) p.x = Math.random()

        const depth = 0.4 + p.z * 0.6
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, p.size * depth, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha * depth})`
        ctx.fill()
      })
      animId = requestAnimationFrame(render)
    }
    animId = requestAnimationFrame(render)
    return () => { document.removeEventListener('visibilitychange', onVis); if (animId) cancelAnimationFrame(animId); animId = null }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 6,
      }}
    />
  )
}

/* ─── Holographic Scan Lines ─── */
function HoloScanLines() {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(
          0deg, transparent, transparent 3px,
          rgba(0, 212, 255, 0.016) 3px, rgba(0, 212, 255, 0.016) 4px
        )`,
        pointerEvents: 'none', zIndex: 7,
        animation: 'holoScan 8s linear infinite',
      }}
    />
  )
}

/* ─── HUD Corner Brackets ─── */
function HUDCorners() {
  return (
    <>
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />
    </>
  )
}

/* ─── Biometric Scanner overlay — LAGFREE: rAF throttled 300ms ─── */
function BiometricScannerOverlay({ zoomPhase }) {
  const [matchPercent, setMatchPercent] = useState(94.2)

  useEffect(() => {
    if (zoomPhase < 2) return
    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      if (now - last >= 300) {
        setMatchPercent((prev) => {
          const next = prev + (Math.random() - 0.48) * 0.5
          return Math.min(Math.max(next, 97.5), 99.8)
        })
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [zoomPhase])

  if (zoomPhase < 2) return null

  return (
    <div className="biometric-scan-overlay">
      <div className="scanner-line-bar" />
      <div className="biometric-corner-box top-left" />
      <div className="biometric-corner-box top-right" />
      <div className="biometric-corner-box bottom-left" />
      <div className="biometric-corner-box bottom-right" />

      <div className="scanner-hud-label">
        <span className="blink-dot" /> RETICLE LOCK: NEURAL SYNCHRONIZATION
      </div>

      <div className="scanner-hud-stats">
        <div>SYS_MODEL: JARVIS MK-LXXXV</div>
        <div>MATCH RATIO: <span style={{ color: '#00ff88', fontWeight: 700 }}>{matchPercent.toFixed(2)}%</span></div>
        <div>DECIBEL LEVEL: 42dB</div>
        <div>STATUS: CALIBRATING SYSTEMS</div>
      </div>
    </div>
  )
}

/* ─── Futuristic Jarvis Iron Man HUD Portal ─── */
function JarvisSuitHUD({ active, zoomPhase, isSpeaking, scene }) {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    if (!active) return
    const logPool = [
      'SYS_BOOT: ENGAGING SUIT BOOTSTRAP PROTOCOL...',
      'PORT_CONN: ESTABLISHING SECURE QUANTUM TUNNELS...',
      'HUD_INIT: HUD SIGHT LOCK CONFIGURED.',
      'REACTOR_ENG: ARC CORE SPIN RATE NOMINAL.',
      'BIO_METRIC: CORRELATING OPERATOR RETINA SCAN...',
      'SYS_CALIBRATE: REPULSORS & THRUSTERS ACTIVE.',
      'AI_JARVIS: COGNITIVE NEURAL INTERFACE ONLINE.',
      'SSL_CONNECT: SECURE OBSERVATION NODE ESTABLISHED.',
    ]

    let idx = 0
    const addLog = () => {
      if (idx < logPool.length) {
        setLogs(prev => [logPool[idx], ...prev])
        idx++
        setTimeout(addLog, 1000 + Math.random() * 800)
      }
    }
    const timer = setTimeout(addLog, 500)
    return () => clearTimeout(timer)
  }, [active])

  useEffect(() => {
    if (scene === 'ai_response') {
      setLogs(prev => [
        'ACCESS_GRANTED: CLEARANCE LEVEL SIGMA CONFIRMED.',
        'REACTOR_ENG: POWER BARS SYNCED AT 100%.',
        'DECRYPT: REDIRECTING ENCRYPTED ROUTE TO HQ...',
        ...prev
      ])
    }
  }, [scene])

  const getDiagValues = () => {
    if (scene === 'ai_response') {
      return { repulsor: 100, thruster: 100, integrity: 100, helm: 'SEALED', link: 100, reactor: 100 }
    }
    switch (zoomPhase) {
      case 0:
        return { repulsor: 42, thruster: 35, integrity: 92, helm: 'OPEN', link: 28, reactor: 60 }
      case 1:
        return { repulsor: 78, thruster: 68, integrity: 98, helm: 'SEALING', link: 67, reactor: 85 }
      case 2:
      default:
        return { repulsor: 98, thruster: 95, integrity: 100, helm: 'SEALED', link: 98, reactor: 98 }
    }
  }

  const diags = getDiagValues()

  return (
    <div className={`jarvis-hud-container ${active ? 'hud-visible' : ''} jarvis-hud-glitch`}>
      <div className="jarvis-hud-grid" />
      <div className="jarvis-helmet-contour" />

      {/* HUD Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 5, fontFamily: 'Orbitron', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#00d4ff' }}>
        <span>MARK LXXXV SUIT: ACTIVE</span>
        <span className="blink">● DIAGNOSTIC MONITOR</span>
      </div>

      {/* Target Reticle Lock */}
      <div className="jarvis-hud-reticle" style={{ top: '35%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div className="jarvis-hud-reticle-ticks" />
      </div>

      {/* Arc Reactor Centerpiece */}
      <div className={`jarvis-reactor-wrapper ${scene === 'ai_response' ? 'success' : ''}`}>
        <div className="jarvis-arc-reactor">
          <div className="arc-ring-outer" />
          <div className="arc-ring-middle" />
          <div className="arc-ring-inner" />
          <div className="arc-petals-container">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="arc-petal" style={{ transform: `rotate(${i * 36}deg)` }} />
            ))}
          </div>
          <div className="arc-core-pulse" />
        </div>
      </div>

      {/* Suit Diagnostics Metrics */}
      <div className="jarvis-diagnostics-panel">
        <div className="jarvis-diag-title">
          <span>SUIT DIAGNOSTICS CONTROL</span>
          <span style={{ color: scene === 'ai_response' ? '#00ff88' : '#00d4ff' }}>
            {scene === 'ai_response' ? 'CALIBRATION COMPLETE' : 'SYSTEM STANDBY'}
          </span>
        </div>

        <div className="jarvis-diag-grid">
          <div className="jarvis-diag-item">
            <div className="jarvis-diag-label-row">
              <span>REPULSORS</span>
              <span className="val">{diags.repulsor}%</span>
            </div>
            <div className="jarvis-diag-bar">
              <div className={`jarvis-diag-fill ${scene === 'ai_response' ? 'success' : ''}`} style={{ width: `${diags.repulsor}%` }} />
            </div>
          </div>

          <div className="jarvis-diag-item">
            <div className="jarvis-diag-label-row">
              <span>THRUSTERS</span>
              <span className="val">{diags.thruster}%</span>
            </div>
            <div className="jarvis-diag-bar">
              <div className={`jarvis-diag-fill ${scene === 'ai_response' ? 'success' : ''}`} style={{ width: `${diags.thruster}%` }} />
            </div>
          </div>

          <div className="jarvis-diag-item">
            <div className="jarvis-diag-label-row">
              <span>ARMOR INTEGRITY</span>
              <span className="val">{diags.integrity}%</span>
            </div>
            <div className="jarvis-diag-bar">
              <div className={`jarvis-diag-fill ${scene === 'ai_response' ? 'success' : ''}`} style={{ width: `${diags.integrity}%` }} />
            </div>
          </div>

          <div className="jarvis-diag-item">
            <div className="jarvis-diag-label-row">
              <span>HELMET LOCK</span>
              <span className="val" style={{ color: diags.helm === 'SEALED' ? '#00ff88' : '#00d4ff' }}>{diags.helm}</span>
            </div>
            <div className="jarvis-diag-bar">
              <div className={`jarvis-diag-fill ${scene === 'ai_response' ? 'success' : ''}`} style={{ width: diags.helm === 'SEALED' ? '100%' : diags.helm === 'SEALING' ? '70%' : '20%' }} />
            </div>
          </div>
        </div>

        {/* Vocal Waveform Visualizer */}
        <div className="jarvis-voice-waveform">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className={`voice-wave-bar ${isSpeaking ? 'speaking' : ''}`}
              style={{
                '--i': i,
                height: isSpeaking ? undefined : `${4 + Math.sin(i * 0.4) * 8}px`
              }}
            />
          ))}
        </div>

        {/* Live log stream */}
        <div className="jarvis-log-stream">
          {logs.slice(0, 4).map((log, i) => (
            <div key={i} className="jarvis-log-line">{log}</div>
          ))}
        </div>
      </div>

      {/* ── Biometric Overlay ── */}
      <BiometricScannerOverlay zoomPhase={zoomPhase} />
    </div>
  )
}

/* ─── Live Diagnostics Readout Panel ─── */
function SystemTelemetryBox({ active }) {
  const [telemetry, setTelemetry] = useState({
    repulsor: 98.2,
    arcReactor: 100.0,
    thrusters: 99.4,
    neuralLink: 98.8
  })

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      setTelemetry({
        repulsor: 97 + Math.random() * 3,
        arcReactor: 100.0,
        thrusters: 98 + Math.random() * 2,
        neuralLink: 98 + Math.random() * 1.8
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [active])

  if (!active) return null

  return (
    <div className="jarvis-telemetry-box">
      <div className="telemetry-row">
        <span>ARC TEMPERATURE:</span>
        <span className="value">38.2°C</span>
      </div>
      <div className="telemetry-row">
        <span>REPULSOR OUTPUT:</span>
        <span className="value">{telemetry.repulsor.toFixed(1)}%</span>
      </div>
      <div className="telemetry-row">
        <span>THRUSTER STEERING:</span>
        <span className="value">{telemetry.thrusters.toFixed(1)}%</span>
      </div>
      <div className="telemetry-row">
        <span>NEURAL LINK:</span>
        <span className="value">{telemetry.neuralLink.toFixed(2)}%</span>
      </div>
      <div className="telemetry-encryption" style={{ color: '#00ff88' }}>SECURE NODE VERIFIED</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
export default function AICore() {
  const { scene, userName, submitIdentity, graphicsQuality, isIntroSkipped, skipIntro } = useStore()
  const [shotPhase, setShotPhase] = useState(isIntroSkipped ? 2 : 0)
  const [inputName, setInputName] = useState('')
  const [robotVisible, setRobotVisible] = useState(isIntroSkipped)
  const [zoomPhase, setZoomPhase] = useState(isIntroSkipped ? 2 : 0)

  // ── Fix SKIP: sync local cinematic state when skip is triggered while AICore is already mounted ──
  useEffect(() => {
    if (isIntroSkipped) {
      setShotPhase(2)
      setRobotVisible(true)
      setZoomPhase(2)
    }
  }, [isIntroSkipped])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [aiCustomReply, setAiCustomReply] = useState('')
  const [fpMatch, setFpMatch] = useState(94.2)

  // Live biometric match ticker — LAGFREE: pause when hidden
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now) => {
      if (document.hidden) { raf = requestAnimationFrame(tick); return }
      if (now - last >= 900) {
        setFpMatch((p) => Math.min(Math.max(p + (Math.random() - 0.45) * 0.4, 94), 99.6))
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // 3D Parallax Tilt state — LAGFREE throttled
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const tiltRef = useRef({ x: 0, y: 0 })
  const tiltRaf = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const check = () => {
      if (!document.hidden && window.speechSynthesis) setIsSpeaking(window.speechSynthesis.speaking)
      raf = requestAnimationFrame(() => setTimeout(check, 250))
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [])

  const cameraStartTriggered = useRef(false)

  useEffect(() => {
    // If user clicked SKIP, jump directly to credential input with voice
    if (isIntroSkipped) {
      // Small delay so speech synthesis is ready after unlock
      const voiceDelay = setTimeout(() => {
        voiceEmitter.emit('NAME_INPUT_VISIBLE')
      }, 300)
      return () => clearTimeout(voiceDelay)
    }

    // Shot 0: Camera starts moving
    if (!cameraStartTriggered.current) {
      cameraStartTriggered.current = true
      voiceEmitter.emit('CAMERA_START')
    }

    // Phase 0 → 1: Docking doors opening (2s)
    const t1 = setTimeout(() => {
      setShotPhase(1)
      voiceEmitter.emit('DOOR_OPENING')
    }, 2000)

    // Phase 1 → 2: Welcome Panel + Scan (4s)
    const t2 = setTimeout(() => {
      setShotPhase(2)
      voiceEmitter.emit('DOOR_OPENED')
      setTimeout(() => {
        setRobotVisible(true)
        setZoomPhase(0)
        // Robot appears
        voiceEmitter.emit('AI_ROBOT_VISIBLE')
      }, 400)
      setTimeout(() => {
        setZoomPhase(1)
      }, 1500)
      setTimeout(() => {
        setZoomPhase(2)
        // Input ready
        voiceEmitter.emit('NAME_INPUT_VISIBLE')
      }, 3000)
    }, 4000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isIntroSkipped])

  // Real-time Voice Trigger Scan listener
  useEffect(() => {
    const handleTriggerScan = (e) => {
      const callsign = e.detail || 'Guest'
      setInputName(callsign)
      setTimeout(() => {
        voiceEmitter.emit('NAME_SUBMITTED', { userName: callsign })
        submitIdentity(callsign)
      }, 600)
    }
    window.addEventListener('TRIGGER_SCAN', handleTriggerScan)
    return () => window.removeEventListener('TRIGGER_SCAN', handleTriggerScan)
  }, [submitIdentity])

  const handleMicClick = () => {
    setIsListening(true)
    aiVoice.startSpeechRecognition(
      (transcript) => {
        setIsListening(false)
        if (transcript) {
          setInputName(transcript)
        }
      },
      (err) => {
        setIsListening(false)
        console.warn('Speech error:', err)
      },
      () => {
        setIsListening(false)
      }
    )
  }

  const handleQuickSelect = (roleName) => {
    setInputName(roleName)
    voiceEmitter.emit('NAME_SUBMITTED', { userName: roleName })
    submitIdentity(roleName)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const callsign = inputName.trim() || 'Guest'

    // Immediate transition trigger
    voiceEmitter.emit('NAME_SUBMITTED', { userName: callsign })
    submitIdentity(callsign)

    // 10/10: non-blocking background fetch with 4.5s timeout — matches server parallel race (3.2s)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
        || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:5001'
          : 'https://bexsigmatech3d.onrender.com')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4500)

      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `User callsign: ${callsign}`, userName: callsign }),
        signal: controller.signal,
        keepalive: true
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (data && data.response) {
          setAiCustomReply(data.response)
          // 10/10: queue with high priority, but don't interrupt initial NAME_SUBMITTED voice that is already playing
          setTimeout(() => aiVoice.speakCustomText(data.response), 800)
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('AI API response pending or offline:', err.message)
    }
  }

  // 3D Card Hover Tilt — LAGFREE: rAF throttled, no per-pixel setState
  const handleMouseMove = (e) => {
    if (tiltRaf.current) return
    tiltRaf.current = requestAnimationFrame(() => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
      tiltRef.current = { x, y }
      setTilt({ x, y })
      tiltRaf.current = 0
    })
  }

  const handleMouseLeave = () => {
    if (tiltRaf.current) { cancelAnimationFrame(tiltRaf.current); tiltRaf.current = 0 }
    tiltRef.current = { x: 0, y: 0 }
    setTilt({ x: 0, y: 0 })
  }

  const [isMobileScreen, setIsMobileScreen] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)

  useEffect(() => {
    const checkMobile = () => setIsMobileScreen(window.innerWidth <= 768)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
      {isMobileScreen ? (
        /* ── MOBILE CLEAN MINIMALIST ENTRY PORTAL ── */
        <div className="mobile-clean-portal-wrapper">
          {/* Subtle Ambient Cosmic Glow */}
          <div className="mcp-ambient-glow" />

          {/* Top Skip Pill */}
          {!isIntroSkipped && (
            <button type="button" className="mcp-skip-btn interactive" onClick={skipIntro}>
              SKIP ▸▸
            </button>
          )}

          {/* Centered Minimalist Card */}
          <div className="mcp-card">
            {/* Top Brand Logo: Atom/Orbital Icon + BEx Sigma Tech */}
            <div className="mcp-brand">
              <div className="mcp-brand-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2.8" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(90 12 12)" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(150 12 12)" />
                </svg>
              </div>
              <span className="mcp-brand-text">BEx Sigma Tech</span>
            </div>

            {/* Heading & Subtitle */}
            <div className="mcp-headings">
              <h1 className="mcp-title">Welcome</h1>
              <p className="mcp-subtitle">Please enter your name to continue</p>
            </div>

            {/* Input Form & Action */}
            {scene !== 'ai_response' ? (
              <form onSubmit={handleSubmit} className="mcp-form">
                <div className="mcp-input-wrap">
                  <input
                    type="text"
                    className="mcp-input interactive"
                    placeholder="Enter your name..."
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    aria-label="Enter your name"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`mcp-mic-btn interactive ${isListening ? 'listening' : ''}`}
                    title="Speak via Microphone"
                    aria-label={isListening ? 'Listening for voice' : 'Speak name via microphone'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </button>
                </div>

                <button type="submit" className="mcp-submit-btn interactive" aria-label="Enter station">
                  <span>{isListening ? 'LISTENING...' : 'ENTER'}</span>
                  <span className="mcp-btn-arrow">→</span>
                </button>
              </form>
            ) : (
              <div className="mcp-access-granted">
                <div className="mcp-granted-icon">✓</div>
                <div className="mcp-granted-title">
                  Welcome, {userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'Guest'}.
                </div>
                <div className="mcp-granted-sub">Entering orbital station...</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── DESKTOP AI CORE INTERFACE (UNCHANGED) ── */
        <div className="desktop-aicore-wrapper">
          {/* ══ SHOT 0: Orbital Command Station ══ */}
          {shotPhase === 0 && (
            <div className="cinematic-shot-container fade-in">
              <div
                className="cinematic-fullbg"
                style={{
                  backgroundImage: "url('/station.png')",
                  transform: 'perspective(1400px) translateZ(-70px) scale(1.15)',
                  filter: 'brightness(0.4) saturate(0.65) blur(3px)',
                }}
              />
              <div
                className="cinematic-fullbg shot-3d-approach"
                style={{ backgroundImage: "url('/station.png')", filter: 'brightness(0.88) saturate(1.2)' }}
              />
              <div className="cinematic-depth-glow" />
              <ParticleField3D count={graphicsQuality === 'low' ? 0 : 60} />
              <HoloScanLines />
              <div className="cinematic-vignette" />
              <div className="cinematic-letterbox-top" />
              <div className="cinematic-letterbox-bottom" />
              <div className="cinematic-caption">
                <div className="caption-location">ORBITAL RESEARCH HEADQUARTERS · 408 KM ALTITUDE</div>
                <div className="caption-title">BEx Sigma Tech Command Station</div>
              </div>
              <HUDCorners />
            </div>
          )}

          {/* ══ SHOT 1: Airlock / Docking Bay ══ */}
          {shotPhase === 1 && (
            <div className="cinematic-shot-container fade-in">
              <div
                className="cinematic-fullbg"
                style={{
                  backgroundImage: "url('/docking.png')",
                  transform: 'perspective(1200px) translateZ(-90px) scale(1.20)',
                  filter: 'brightness(0.38) saturate(0.6) blur(3.5px)',
                }}
              />
              <div
                className="cinematic-fullbg shot-3d-dolly"
                style={{ backgroundImage: "url('/docking.png')", filter: 'brightness(0.84) saturate(1.1)' }}
              />
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse 60% 55% at 52% 48%, rgba(0,180,255,0.18) 0%, transparent 70%)',
                  pointerEvents: 'none', zIndex: 5,
                  animation: 'airlock-pulse 2.5s ease-in-out infinite',
                }}
              />
              <ParticleField3D count={graphicsQuality === 'low' ? 0 : 45} />
              <HoloScanLines />
              <div className="cinematic-vignette" />
              <div className="cinematic-letterbox-top" />
              <div className="cinematic-letterbox-bottom" />
              <div className="cinematic-caption">
                <div className="caption-location">DOCKING BAY 04 · HYDRAULIC AIRLOCK SEQUENCE</div>
                <div className="caption-title">AUTOMATED APPROACH ENGAGED</div>
              </div>
              <HUDCorners />
            </div>
          )}

          {/* ══ SHOT 2: Welcome / ID Scan Panel ══ */}
          {shotPhase === 2 && (
            <div className="cinematic-shot-container fade-in">
              <div
                className="cinematic-fullbg"
                style={{
                  backgroundImage: "url('/welcome_bg.png')",
                  transform: 'perspective(1600px) translateZ(-110px) scale(1.24)',
                  filter: 'brightness(0.32) saturate(0.55) blur(5px)',
                }}
              />
              <div
                className="cinematic-fullbg shot-breathe"
                style={{
                  backgroundImage: "url('/welcome_bg.png')",
                  transform: 'perspective(1400px) translateZ(-22px) scale(1.07)',
                  filter: 'brightness(0.68) saturate(1.1)',
                }}
              />
              <div className="cinematic-depth-atmosphere" />
              <ParticleField3D count={graphicsQuality === 'low' ? 0 : 35} />
              <HoloScanLines />
              <div className="cinematic-vignette" />
              <div className="cinematic-letterbox-top" />
              <div className="cinematic-letterbox-bottom" />

              {/* Futuristic Jarvis / Iron Man HUD Portal */}
              <JarvisSuitHUD
                active={robotVisible}
                zoomPhase={zoomPhase}
                isSpeaking={isSpeaking}
                scene={scene}
              />

              {/* Mobile-only ambient background pulse (Jarvis HUD is hidden on mobile) */}
              <div className="ai-core-mobile-ambient" />

              {/* ── Holographic 3D Tilting ID Panel ── */}
              <div
                className={`identification-panel tilted-3d ${robotVisible ? 'panel-visible' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-50%)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Holographic scanner line overlay */}
                <div className="panel-cyber-scanner" />

                <div className="id-panel-badge-row">
                  <div className="id-badge-dot" />
                  <span className="id-badge-label">BEx Sigma Tech · AI NODE S7 · ACCESS: PENDING</span>
                </div>

                {/* Zoom phase progress dots */}
                {robotVisible && (
                  <div className="robot-scan-status">
                    <div className={`scan-phase-dot ${zoomPhase >= 0 ? 'done' : ''}`} />
                    <div className={`scan-phase-line ${zoomPhase >= 1 ? 'active' : ''}`} />
                    <div className={`scan-phase-dot ${zoomPhase >= 1 ? 'done' : ''}`} />
                    <div className={`scan-phase-line ${zoomPhase >= 2 ? 'active' : ''}`} />
                    <div className={`scan-phase-dot ${zoomPhase >= 2 ? 'done' : ''}`} />
                    <span className="scan-phase-label">
                      {zoomPhase === 0 && 'INITIALIZING CORE...'}
                      {zoomPhase === 1 && 'BIOMETRIC VERIFICATION...'}
                      {zoomPhase === 2 && 'IDENTITY VERIFIED ✓'}
                    </span>
                  </div>
                )}

                {/* AI Voice Indicator */}
                {robotVisible && (
                  <div className="ai-voice-indicator">
                    <div className="voice-wave-bar" style={{ '--i': 1 }} />
                    <div className="voice-wave-bar" style={{ '--i': 2 }} />
                    <div className="voice-wave-bar" style={{ '--i': 3 }} />
                    <div className="voice-wave-bar" style={{ '--i': 4 }} />
                    <div className="voice-wave-bar" style={{ '--i': 5 }} />
                    <span className="voice-label">AI ASSISTANT TRANSMITTING</span>
                  </div>
                )}

                {/* AI Dialogue with typewriter effect */}
                <div className="id-dialogue-block">
                  {scene !== 'ai_response' ? (
                    <>
                      <p className="id-line-main" style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.3rem)' }}>
                        “<TypewriterText text="Welcome to BEx Sigma Tech · Your Digital Partner" speed={35} />”
                      </p>
                      <p className="id-line-sub" style={{ fontSize: 'clamp(0.72rem, 1.3vw, 0.85rem)', color: 'rgba(0, 212, 255, 0.75)' }}>
                        “<TypewriterText text="Please enter your name below to personalize your station access, or type 'Guest' to explore." speed={20} />”
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="id-line-main id-granted">
                        “<TypewriterText text={`Welcome aboard, ${userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'Guest'}.`} speed={35} />”
                      </p>
                      <p className="id-line-sub" style={{ fontSize: 'clamp(0.72rem, 1.3vw, 0.85rem)' }}>
                        “<TypewriterText text="Identity verified. Synchronizing observatory database..." speed={20} />”
                      </p>
                      <div className="access-granted-bars">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div key={i} className="access-bar" style={{ animationDelay: `${i * 0.04}s` }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Name Input Form */}
                {scene !== 'ai_response' && (
                  <form onSubmit={handleSubmit} className="id-form-block">
                    <label className="id-form-label">
                      ENTER YOUR NAME
                      {isListening && <span style={{ color: '#00d4ff', marginLeft: '10px' }}>🎙️ LISTENING...</span>}
                    </label>
                    <div className="id-form-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="id-form-input interactive"
                        placeholder="Enter your name (or type Guest)..."
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        autoFocus
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={handleMicClick}
                        className={`id-form-btn interactive ${isListening ? 'listening-pulse' : ''}`}
                        title="Speak name via Microphone"
                        style={{ background: isListening ? '#00d4ff' : 'rgba(0, 212, 255, 0.15)', color: isListening ? '#000' : '#00d4ff', width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        🎙️
                      </button>
                      <button type="submit" className="id-form-btn interactive">CONTINUE →</button>
                    </div>

                    {/* Quick Role Selection Chips on Desktop */}
                    <div className="cl-quick-options" style={{ marginTop: '12px', alignItems: 'flex-start' }}>
                      <span className="cl-quick-hint">Or click to quick-enter:</span>
                      <div className="cl-quick-chips">
                        <button
                          type="button"
                          className="cl-quick-chip interactive"
                          onClick={() => handleQuickSelect('Guest')}
                          title="Enter directly as Guest"
                        >
                          🚀 Guest Explorer
                        </button>
                        <button
                          type="button"
                          className="cl-quick-chip interactive"
                          onClick={() => handleQuickSelect('Client')}
                          title="Enter as Client"
                        >
                          💼 Business / Client
                        </button>
                        <button
                          type="button"
                          className="cl-quick-chip interactive"
                          onClick={() => handleQuickSelect('Partner')}
                          title="Enter as Partner"
                        >
                          🤝 Partner
                        </button>
                      </div>
                      <p className="cl-quick-note">✨ No password required · Instant access</p>
                    </div>
                  </form>
                )}

                {/* Live Telemetry Matrix */}
                <SystemTelemetryBox active={robotVisible} />
              </div>

              <HUDCorners />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
