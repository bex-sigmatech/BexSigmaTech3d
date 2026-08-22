import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter, aiVoice } from '../../audio/AIVoiceEngine'

/* ==========================================================================
   BEX SIGMA TECH 2070 — CINEMATIC AI CORE SEQUENCE
   Biometric 3D Scanner · Typewriter AI Dialogue · Live Telemetry Matrix
   ========================================================================== */

/* ─── Typewriter text component ─── */
function TypewriterText({ text, speed = 35 }) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    let idx = 0
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(idx))
      idx++
      if (idx >= text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayedText}</span>
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
  const { scene, userName, submitIdentity, graphicsQuality, isIntroSkipped } = useStore()
  const [shotPhase, setShotPhase] = useState(isIntroSkipped ? 2 : 0)
  const [inputName, setInputName] = useState('')
  const [robotVisible, setRobotVisible] = useState(isIntroSkipped)
  const [zoomPhase, setZoomPhase] = useState(isIntroSkipped ? 2 : 0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [aiCustomReply, setAiCustomReply] = useState('')

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
      const timeoutId = setTimeout(() => controller.abort(), 3000)

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
          <div className="cl-topbar">
            <div className="cl-topbar-left">
              <span className="cl-topbar-pipe">|</span>
              <span className="cl-topbar-os">NEURAL LINK ACTIVE</span>
            </div>
            <div className="mobile-status-pill">
              <span className="pill-dot" /> ENCRYPTED
            </div>
          </div>

          {/* ── CENTER: 3D Realistic AI Robot Background + Credential Card ── */}
          <div className="cl-hero-section" style={{ margin: '0', width: '100%', maxWidth: '420px' }}>

            {/* ── 3D CSS Robot Head — preserve-3d multi-face ── */}
            <div className="cl-3d-robot-bg">
              {/* Ambient depth glow */}
              <div className="cl-robot-depth-far" />

              {/* 3D scene container */}
              <div className="cl-robot-scene">
                <div className="cl-robot-head">
                  {/* Front face — the main visage */}
                  <div className="cl-rh-face front">
                    {/* Forehead ridge */}
                    <div className="cl-rh-brow-ridge" />
                    {/* Nose ridge */}
                    <div className="cl-rh-nose-ridge" />
                    {/* Ear pods */}
                    <div className="cl-rh-ear left">
                      <div className="cl-rh-ear-inner" />
                    </div>
                    <div className="cl-rh-ear right">
                      <div className="cl-rh-ear-inner" />
                    </div>
                    {/* Visor with eyes */}
                    <div className="cl-rh-visor">
                      <div className="cl-rh-eye left">
                        <div className="cl-rh-iris" />
                        <div className="cl-rh-pupil" />
                        <div className="cl-rh-eye-reflection" />
                      </div>
                      <div className="cl-rh-eye right">
                        <div className="cl-rh-iris" />
                        <div className="cl-rh-pupil" />
                        <div className="cl-rh-eye-reflection" />
                      </div>
                      <div className="cl-rh-visor-scan" />
                    </div>
                    {/* Cheek panels with seams */}
                    <div className="cl-rh-cheek left">
                      <div className="cl-rh-rivet" />
                      <div className="cl-rh-rivet r2" />
                    </div>
                    <div className="cl-rh-cheek right">
                      <div className="cl-rh-rivet" />
                      <div className="cl-rh-rivet r2" />
                    </div>
                    {/* Mouth / jaw area */}
                    <div className="cl-rh-jaw">
                      <div className="cl-rh-mouth">
                        {Array.from({length: 6}).map((_, i) => (
                          <div key={i} className="cl-rh-tooth" style={{'--d': i}} />
                        ))}
                      </div>
                    </div>
                    <div className="cl-rh-stamp">XΣ</div>
                    {/* Panel seam lines */}
                    <div className="cl-rh-seam left-seam" />
                    <div className="cl-rh-seam right-seam" />
                    <div className="cl-rh-seam chin-seam" />
                  </div>
                  {/* Back face */}
                  <div className="cl-rh-face back">
                    <div className="cl-rh-back-plate" />
                    <div className="cl-rh-panel-lines">
                      {Array.from({length: 5}).map((_, i) => <div key={i} className="cl-rh-line" style={{top: `${15 + i * 16}%`}} />)}
                    </div>
                    <div className="cl-rh-vent">
                      {Array.from({length: 8}).map((_, i) => <div key={i} className="cl-rh-vent-slot" />)}
                    </div>
                    <div className="cl-rh-back-label">MK·LXXXV</div>
                  </div>
                  {/* Right face */}
                  <div className="cl-rh-face right">
                    <div className="cl-rh-side-light" />
                    <div className="cl-rh-side-light s2" />
                    <div className="cl-rh-circuit">
                      <svg viewBox="0 0 100 100" fill="none" strokeWidth="1">
                        <path d="M10 15 L35 15 L35 40 L55 40 L55 25 L80 25" stroke="rgba(0,212,255,0.3)" />
                        <path d="M15 45 L40 45 L40 70 L65 70 L65 85" stroke="rgba(0,212,255,0.25)" />
                        <path d="M50 10 L50 30 L75 30 L75 55" stroke="rgba(0,255,136,0.2)" />
                        <path d="M25 75 L25 90 L55 90" stroke="rgba(0,255,136,0.15)" />
                        <circle cx="35" cy="15" r="2.5" fill="rgba(0,212,255,0.6)" />
                        <circle cx="55" cy="40" r="2" fill="rgba(0,255,136,0.5)" />
                        <circle cx="80" cy="25" r="2.5" fill="rgba(0,212,255,0.4)" />
                        <circle cx="65" cy="70" r="2" fill="rgba(0,255,136,0.6)" />
                        <rect x="20" y="55" width="8" height="4" rx="1" fill="rgba(0,212,255,0.2)" />
                        <rect x="58" y="48" width="12" height="3" rx="1" fill="rgba(0,212,255,0.15)" />
                      </svg>
                    </div>
                    <div className="cl-rh-side-rivets">
                      {Array.from({length: 3}).map((_, i) => <div key={i} className="cl-rh-rivet" style={{top: `${25 + i * 25}%`}} />)}
                    </div>
                  </div>
                  {/* Left face */}
                  <div className="cl-rh-face left">
                    <div className="cl-rh-side-light" />
                    <div className="cl-rh-side-light s2" />
                    <div className="cl-rh-circuit">
                      <svg viewBox="0 0 100 100" fill="none" strokeWidth="1">
                        <path d="M90 20 L65 20 L65 45 L45 45 L45 30 L20 30" stroke="rgba(0,212,255,0.3)" />
                        <path d="M85 50 L60 50 L60 75 L35 75 L35 90" stroke="rgba(0,212,255,0.25)" />
                        <path d="M50 15 L50 35 L25 35 L25 60" stroke="rgba(0,255,136,0.2)" />
                        <circle cx="65" cy="20" r="2.5" fill="rgba(0,212,255,0.6)" />
                        <circle cx="45" cy="45" r="2" fill="rgba(0,255,136,0.5)" />
                        <circle cx="20" cy="30" r="2.5" fill="rgba(0,212,255,0.4)" />
                        <rect x="40" y="60" width="10" height="3" rx="1" fill="rgba(0,212,255,0.2)" />
                      </svg>
                    </div>
                    <div className="cl-rh-side-rivets">
                      {Array.from({length: 3}).map((_, i) => <div key={i} className="cl-rh-rivet" style={{top: `${25 + i * 25}%`}} />)}
                    </div>
                  </div>
                  {/* Top face */}
                  <div className="cl-rh-face top">
                    <div className="cl-rh-antenna">
                      <div className="cl-rh-antenna-pole" />
                      <div className="cl-rh-antenna-tip" />
                    </div>
                    <div className="cl-rh-top-ring" />
                    <div className="cl-rh-top-seam" />
                  </div>
                  {/* Bottom face */}
                  <div className="cl-rh-face bottom">
                    <div className="cl-rh-neck">
                      <div className="cl-rh-neck-ring" />
                      <div className="cl-rh-neck-ring r2" />
                      <div className="cl-rh-neck-ring r3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Scanning beam overlay */}
              <div className="cl-robot-scan-beam" />
              {/* Neural core pulsing orb */}
              <div className="cl-robot-neural-core">
                <div className="cl-neural-pulse-ring r1" />
                <div className="cl-neural-pulse-ring r2" />
                <div className="cl-neural-pulse-ring r3" />
                <div className="cl-neural-center">
                  <span className="cl-orb-sigil">XΣ</span>
                </div>
              </div>
            </div>

            <div className="cl-signal-tag">
              <span className="cl-signal-dot" />
              <span>{isSpeaking ? 'AI VOICE TRANSMITTING' : 'AI SENTINEL ONLINE · BIOMETRIC READY'}</span>
            </div>

            {/* Credential Verification Card */}
            <div className="cl-card">
              <div className="cl-card-corner tl" />
              <div className="cl-card-corner tr" />
              <div className="cl-card-corner bl" />
              <div className="cl-card-corner br" />

              <div className="cl-card-header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,212,255,0.15)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'Orbitron', fontWeight: '900', fontSize: '1.2rem', color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>XΣ</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: 'Orbitron', fontSize: '0.62rem', fontWeight: '700', color: '#fff', letterSpacing: '0.12em' }}>BEX SIGMA TECH</span>
                  </div>
                </div>
                <span className="cl-card-title" style={{ fontSize: '0.85rem', letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>AI COMMAND CENTER</span>
              </div>

              <div style={{ width: '100%', marginTop: '6px' }}>
                <div style={{ fontSize: '0.68rem', fontFamily: 'Orbitron', fontWeight: '700', letterSpacing: '0.14em', color: '#fff', textAlign: 'center', marginBottom: '8px' }}>
                  VERIFY CREDENTIALS
                </div>
                {/* Fingerprint Target */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.18)', borderRadius: '10px', padding: '8px 14px' }}>
                  <div className="cl-fingerprint" style={{ width: '36px', height: '36px' }}>
                    <div className="cl-fp-ring" />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4 M14 13.12c0 2.38 0 3.38-.4 4.88 M18 11a6 6 0 0 0-11.8 1.48 C6.08 14 6 15 5.5 17 M12 6a10 10 0 0 0-9.35 6.4 M20 15c-.46 2.05-.8 3.08-1.5 4.5 M21.8 11.5a14 14 0 0 0-2.5-6" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.62rem', fontFamily: 'Orbitron', fontWeight: '700', color: '#fff', letterSpacing: '0.1em' }}>PLACE THUMB</span>
                    <span style={{ fontSize: '0.52rem', fontFamily: 'Orbitron', color: '#00ff88', letterSpacing: '0.08em' }}>94% MATCH</span>
                  </div>
                </div>
              </div>

              <div className="id-dialogue-block cl-dialogue" style={{ margin: '4px 0' }}>
                {scene !== 'ai_response' ? (
                  <>
                    <p className="cl-dialogue-main" style={{ fontSize: '0.85rem' }}>
                      "<TypewriterText text="BEX SIGMA TECH is a premium SaaS building software company." speed={35} />"
                    </p>
                    <p className="cl-dialogue-sub" style={{ fontSize: '0.7rem' }}>
                      "<TypewriterText text="We provide digital marketing, Meta Ads, and financial systems support. Sync callsign to enter." speed={20} />"
                    </p>
                  </>
                ) : (
                  <>
                    <p className="cl-dialogue-main cl-granted">
                      "<TypewriterText text={`Welcome, ${userName}.`} speed={35} />"
                    </p>
                    <p className="cl-dialogue-sub">
                      "<TypewriterText text="Operator credentials verified. Synchronizing observatory database..." speed={20} />"
                    </p>
                  </>
                )}
              </div>

              {scene !== 'ai_response' ? (
                <form onSubmit={handleSubmit} className="cl-form">
                  <label className="cl-dialogue-label" style={{ textAlign: 'left' }}>
                    Enter Access Key
                    {isListening && <span className="m-listening-tag" style={{ marginLeft: '6px', color: '#00d4ff' }}>🎙️ LISTENING</span>}
                  </label>
                  <div className="cl-input-row">
                    <input
                      type="text"
                      className="cl-input interactive"
                      placeholder="Enter unique callsign"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleMicClick}
                      className={`cl-mic interactive ${isListening ? 'listening' : ''}`}
                      title="Speak via Microphone"
                    >
                      🎙️
                    </button>
                  </div>
                  <button type="submit" className="cl-sync-btn interactive">
                    <span className="m-sync-btn-text">SYNC CREDENTIALS</span>
                    <span className="m-sync-btn-arrow">→</span>
                  </button>
                </form>
              ) : (
                <div className="cl-access-banner">
                  <span className="cl-access-icon">✓</span>
                  <span className="cl-access-text">CLEARANCE VERIFIED · SYNCING HQ...</span>
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
                <div className="caption-title">BEX SIGMA TECH COMMAND STATION</div>
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
                  <span className="id-badge-label">BEX SIGMA TECH · AI NODE S7 · ACCESS: PENDING</span>
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

                {/* AI Dialogue with typewriter effect */}
                <div className="id-dialogue-block">
                  {scene !== 'ai_response' ? (
                    <>
                      <p className="id-line-main" style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.3rem)' }}>
                        “<TypewriterText text="BEX SIGMA TECH is a premium SaaS building software company." speed={35} />”
                      </p>
                      <p className="id-line-sub" style={{ fontSize: 'clamp(0.72rem, 1.3vw, 0.85rem)', color: 'rgba(0, 212, 255, 0.75)' }}>
                        “<TypewriterText text="We provide digital marketing, run Meta Ads campaigns, create content, and offer financial systems support. Sync callsign to enter." speed={20} />”
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="id-line-main id-granted">
                        “<TypewriterText text={`Welcome, ${userName}.`} speed={35} />”
                      </p>
                      <p className="id-line-sub" style={{ fontSize: 'clamp(0.72rem, 1.3vw, 0.85rem)' }}>
                        “<TypewriterText text="Operator credentials verified. Synchronizing observatory database..." speed={20} />”
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
