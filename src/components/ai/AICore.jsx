import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter, aiVoice } from '../../audio/AIVoiceEngine'

/* ==========================================================================
   BEX SIGMA TECH 2070 — CINEMATIC AI CORE SEQUENCE
   Biometric 3D Scanner · Typewriter AI Dialogue · Live Telemetry Matrix
   ========================================================================== */

/* ─── Typewriter text component — fixed for clipped chars (BX/elccme) ─── */
function TypewriterText({ text, speed = 35 }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let idx = 0
    const timer = setInterval(() => {
      // Slice ensures no char is skipped even if interval drifts
      idx++
      setDisplayedText(text.slice(0, idx))
      if (idx >= text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{displayedText}</span>
}

/* ─── Procedural 3D Particle Field ─── */
function ParticleField3D({ count = 70 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.00018,
      vy: -Math.random() * 0.00025 - 0.00008,
      size: Math.random() * 2.2 + 0.4,
      alpha: Math.random() * 0.55 + 0.12,
    }))

    let animId
    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        ctx.scale(dpr, dpr)
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
    return () => cancelAnimationFrame(animId)
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

/* ─── Biometric Scanner overlay ─── */
function BiometricScannerOverlay({ zoomPhase }) {
  const [matchPercent, setMatchPercent] = useState(94.2)

  useEffect(() => {
    if (zoomPhase < 2) return
    const interval = setInterval(() => {
      setMatchPercent((prev) => {
        const next = prev + (Math.random() - 0.48) * 0.5
        return Math.min(Math.max(next, 97.5), 99.8)
      })
    }, 150)
    return () => clearInterval(interval)
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

  // Live biometric match ticker (mobile credential card)
  useEffect(() => {
    const t = setInterval(() => {
      setFpMatch((p) => Math.min(Math.max(p + (Math.random() - 0.45) * 0.4, 94), 99.6))
    }, 900)
    return () => clearInterval(t)
  }, [])

  // 3D Parallax Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const interval = setInterval(() => {
      if (window.speechSynthesis) {
        setIsSpeaking(window.speechSynthesis.speaking)
      }
    }, 100)
    return () => clearInterval(interval)
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
      const callsign = e.detail || 'COMMANDER'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const callsign = inputName.trim() || 'COMMANDER'

    // Immediate transition trigger
    voiceEmitter.emit('NAME_SUBMITTED', { userName: callsign })
    submitIdentity(callsign)

    // Non-blocking background fetch for AI audio/text response
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
        || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:5001'
          : 'https://bexsigmatech3d.onrender.com')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 12000)

      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `User callsign: ${callsign}`, userName: callsign }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (data && data.response) {
          setAiCustomReply(data.response)
          aiVoice.speakCustomText(data.response)
        }
      }
    } catch (err) {
      console.warn('AI API response pending or offline:', err.message)
    }
  }

  // 3D Card Hover Tilt logic
  const handleMouseMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16 // degrees
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const [isMobileScreen, setIsMobileScreen] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)

  useEffect(() => {
    const checkMobile = () => setIsMobileScreen(window.innerWidth <= 768)
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {isMobileScreen ? (
        /* ── MOBILE 10/10 AI SENTINEL ROBOT CORE INTERFACE ── */
        <div className="mobile-aicore-wrapper">

          {/* Ambient Background Effects */}
          <div className="cl-bg-mesh" />
          <div className="cl-scanlines" />

          {/* ── TOP: Status Bar ── */}
          <header className="cl-topbar">
            <div className="cl-topbar-left">
              <span className="cl-live-dot" />
              <span className="cl-topbar-os">NEURAL LINK ACTIVE</span>
            </div>
            {!isIntroSkipped && (
              <button type="button" className="cl-skip-pill interactive" onClick={skipIntro}>
                SKIP ▸▸
              </button>
            )}
          </header>

          {/* ── CENTER: 3D Realistic AI Robot Background + Credential Card ── */}
          <div className="cl-hero-section" style={{ margin: '0', width: '100%', maxWidth: '420px' }}>

            {/* ── Cinematic Robot Stage — IDEA A: Biometric Arc + Bottom Sheet ── */}
            <div className="cl-3d-robot-bg cl-idea-a-hero">
              <div className="cl-robot-glowfield" />

              <img
                src="/robot_face.png"
                alt="AI Sentinel"
                draggable={false}
                className="cl-robot-img"
              />
              <div className="cl-robot-fade" />

              {/* Orbital rings */}
              <div className="cl-orbit r1" />
              <div className="cl-orbit r2" />

              {/* IDEA A: Biometric Arc Scanner — 180° sweep */}
              <svg className="cl-arc-scanner" viewBox="0 0 200 110" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="45%" stopColor="rgba(34,211,238,0)" />
                    <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
                    <stop offset="55%" stopColor="rgba(34,211,238,0)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="url(#arcGrad)" strokeWidth="2.5" strokeLinecap="round" className="cl-arc-path" />
                <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="1" strokeDasharray="3 6" />
              </svg>
              <div className="cl-arc-glow" />

              {/* Scanning beam */}
              <div className="cl-robot-scan-beam" />

              {/* Floating HUD chips */}
              <div className="cl-chip chip-tl"><b>SYS</b><span>87.4%</span></div>
              <div className="cl-chip chip-tr"><b>NEURAL</b><span>SYNC OK</span></div>
              <div className="cl-chip chip-bl"><b>CORE</b><span>STABLE</span></div>
              <div className="cl-chip chip-br"><b>MATCH</b><span>{fpMatch.toFixed(1)}%</span></div>
            </div>

            <div className="cl-signal-tag">
              <span className="cl-signal-dot" />
              <span>{isSpeaking ? 'AI VOICE TRANSMITTING' : 'AI SENTINEL ONLINE · BIOMETRIC READY'}</span>
            </div>

            {/* IDEA A: Bottom Sheet Credential Card — clean impressive */}
            <div className="cl-card cl-bottom-sheet">
              <div className="cl-sheet-handle" aria-hidden="true" />
              <div className="cl-glass-sheen" />
              {/* Stepper 01—02—03 */}
              <div className="cl-stepper" aria-label="Progress: biometric, callsign, sync">
                <div className={`cl-step ${fpMatch > 96 ? 'done' : 'active'}`}><span>01</span><b>BIOMETRIC</b></div>
                <div className="cl-step-line" />
                <div className={`cl-step ${inputName.length > 0 ? 'done' : ''} ${fpMatch > 96 && inputName.length === 0 ? 'active' : ''}`}><span>02</span><b>CALLSIGN</b></div>
                <div className="cl-step-line" />
                <div className={`cl-step ${scene === 'ai_response' ? 'done' : ''}`}><span>03</span><b>SYNC</b></div>
              </div>

              <div className="cl-card-header">
                <div className="cl-logo-tile">XΣ</div>
                <div className="cl-title-stack">
                  <span className="cl-title-brand">BEx Sigma Tech</span>
                  <span className="cl-card-title">AI COMMAND PORTAL</span>
                </div>
                <span className={`cl-header-status ${scene === 'ai_response' ? 'ok' : ''}`}>
                  <span className="status-dot" />
                  {scene === 'ai_response' ? '100% MATCH' : `${fpMatch.toFixed(1)}% MATCH`}
                </span>
              </div>

              {/* AI Transmission Block — clean typography */}
              <div className="id-dialogue-block cl-dialogue">
                {scene !== 'ai_response' ? (
                  <>
                    <p className="cl-dialogue-main">
                      <TypewriterText text="BEx Sigma Tech · Aerospace AI Infrastructure" speed={35} />
                    </p>
                    <p className="cl-dialogue-sub">
                      <TypewriterText text="Operator authorisation required. Please synchronise your unique callsign to proceed." speed={20} />
                    </p>
                  </>
                ) : (
                  <>
                    <p className="cl-dialogue-main cl-granted">
                      <TypewriterText text={`Welcome, ${userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'Operator'}.`} speed={35} />
                    </p>
                    <p className="cl-dialogue-sub">
                      <TypewriterText text="Operator credentials verified. Synchronising observatory database..." speed={20} />
                    </p>
                  </>
                )}
              </div>

              {/* Input Form & Action — IDEA A: mic inside input, clean */}
              {scene !== 'ai_response' ? (
                <form onSubmit={handleSubmit} className="cl-form">
                  <div className="cl-input-row cl-idea-a-input-row">
                    <input
                      type="text"
                      className="cl-input interactive"
                      placeholder="Enter operator callsign..."
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      aria-label="Operator callsign"
                      autoComplete="off"
                      autoCorrect="off"
                    />
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className={`cl-mic cl-mic-inside interactive ${isListening ? 'listening' : ''}`}
                      title="Speak via Microphone"
                      aria-label={isListening ? 'Listening for voice' : 'Speak callsign via microphone'}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cl-mic-svg">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    </button>
                  </div>
                  <button type="submit" className="cl-sync-btn interactive" aria-label="Sync credentials and enter station">
                    {isListening ? (
                      <span className="cl-sync-spinner" aria-hidden="true" />
                    ) : null}
                    <span className="m-sync-btn-text">{isListening ? 'LISTENING...' : 'SYNC CREDENTIALS'}</span>
                    <span className="m-sync-btn-arrow">{isListening ? '●' : '→'}</span>
                  </button>
                </form>
              ) : (
                <div className="cl-access-banner">
                  <span className="cl-access-icon">✓</span>
                  <span className="cl-access-text">CLEARANCE VERIFIED · ACCESS GRANTED</span>
                </div>
              )}
            </div>
          </div>

          {/* ── BOTTOM: Diagnostics Strip ── */}
          <div className="cl-hud-footer">
            <div className="cl-hud-cell">
              <span className="cl-hud-key">AI SYNC</span>
              <span className="cl-hud-val green">97.4%</span>
            </div>
            <div className="cl-hud-cell">
              <span className="cl-hud-key">BIOMETRIC</span>
              <span className="cl-hud-val green">99.8%</span>
            </div>
            <div className="cl-hud-cell">
              <span className="cl-hud-key">NETWORK</span>
              <span className="cl-hud-val cyan">82.1ms</span>
            </div>
            <div className="cl-hud-cell">
              <span className="cl-hud-key">POWER</span>
              <span className="cl-hud-val cyan">99.2%</span>
            </div>
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
                      {zoomPhase === 2 && 'CREDENTIAL CHECK COMPLETE ✓'}
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

                {/* AI Dialogue with typewriter effect — spelling corrected */}
                <div className="id-dialogue-block">
                  {scene !== 'ai_response' ? (
                    <>
                      <p className="id-line-main" style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.3rem)' }}>
                        “<TypewriterText text="BEx Sigma Tech is a premium SaaS software company." speed={35} />”
                      </p>
                      <p className="id-line-sub" style={{ fontSize: 'clamp(0.72rem, 1.3vw, 0.85rem)', color: 'rgba(0, 212, 255, 0.75)' }}>
                        “<TypewriterText text="We provide digital marketing, run Meta Ads campaigns, create content, and offer financial systems support. Please synchronise your callsign to enter." speed={20} />”
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="id-line-main id-granted">
                        “<TypewriterText text={`Welcome, ${userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'Operator'}.`} speed={35} />”
                      </p>
                      <p className="id-line-sub" style={{ fontSize: 'clamp(0.72rem, 1.3vw, 0.85rem)' }}>
                        “<TypewriterText text="Operator credentials verified. Synchronising observatory database..." speed={20} />”
                      </p>
                      <div className="access-granted-bars">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div key={i} className="access-bar" style={{ animationDelay: `${i * 0.04}s` }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Callsign Input Form */}
                {scene !== 'ai_response' && (
                  <form onSubmit={handleSubmit} className="id-form-block">
                    <label className="id-form-label">
                      ENTER CREDENTIAL CALLSIGN / VOICE COMMAND
                      {isListening && <span style={{ color: '#00d4ff', marginLeft: '10px' }}>🎙️ LISTENING...</span>}
                    </label>
                    <div className="id-form-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="id-form-input interactive"
                        placeholder="e.g. COMMANDER"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        autoFocus
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={handleMicClick}
                        className={`id-form-btn interactive ${isListening ? 'listening-pulse' : ''}`}
                        title="Speak credential via Microphone"
                        style={{ background: isListening ? '#00d4ff' : 'rgba(0, 212, 255, 0.15)', color: isListening ? '#000' : '#00d4ff', width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        🎙️
                      </button>
                      <button type="submit" className="id-form-btn interactive">SYNC</button>
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
