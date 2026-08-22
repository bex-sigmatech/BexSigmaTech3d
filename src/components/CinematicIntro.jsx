import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/cinematic.css'

/* ─── Audio Utilities ─── */
const AudioCtxClass = typeof window !== 'undefined'
  ? (window.AudioContext || window.webkitAudioContext)
  : null

function createAmbientSound(audioCtx) {
  const gain = audioCtx.createGain()
  gain.gain.value = 0
  gain.connect(audioCtx.destination)

  const osc1 = audioCtx.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.value = 55
  const g1 = audioCtx.createGain()
  g1.gain.value = 0.08
  osc1.connect(g1).connect(gain)
  osc1.start()

  const osc2 = audioCtx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = 110
  const g2 = audioCtx.createGain()
  g2.gain.value = 0.04
  osc2.connect(g2).connect(gain)
  osc2.start()

  const osc3 = audioCtx.createOscillator()
  osc3.type = 'sine'
  osc3.frequency.value = 220
  const g3 = audioCtx.createGain()
  g3.gain.value = 0.02
  osc3.connect(g3).connect(gain)
  osc3.start()

  const lfo = audioCtx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.15
  const lfoGain = audioCtx.createGain()
  lfoGain.gain.value = 5
  lfo.connect(lfoGain).connect(osc2.frequency)
  lfo.start()

  gain.gain.setValueAtTime(0, audioCtx.currentTime)
  gain.gain.linearRampToValueAtTime(0.6, audioCtx.currentTime + 3)

  return { gain, oscillators: [osc1, osc2, osc3, lfo] }
}

function createLoadingSound(audioCtx) {
  const gain = audioCtx.createGain()
  gain.gain.value = 0.05
  gain.connect(audioCtx.destination)

  const osc = audioCtx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = 80
  const filter = audioCtx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 200
  filter.Q.value = 10
  osc.connect(filter).connect(gain)
  osc.start()

  return { gain, osc, filter }
}

function playSuccessSound(audioCtx) {
  const gain = audioCtx.createGain()
  gain.gain.value = 0.15
  gain.connect(audioCtx.destination)

  const times = [0, 0.15, 0.3]
  const freqs = [523.25, 659.25, 783.99]

  times.forEach((t, i) => {
    const osc = audioCtx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freqs[i]
    const g = audioCtx.createGain()
    g.gain.setValueAtTime(0, audioCtx.currentTime + t)
    g.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + t + 0.5)
    osc.connect(g).connect(gain)
    osc.start(audioCtx.currentTime + t)
    osc.stop(audioCtx.currentTime + t + 0.5)
  })
}

function speakAIVoice() {
  if (!window.speechSynthesis) return
  const synth = window.speechSynthesis
  // Cancel any pending speech
  synth.cancel()

  const text = 'Welcome to Bex Sigma Tech. Initializing next-generation digital experiences. Please wait while we prepare your journey.'
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 0.9
  utter.pitch = 1.1
  utter.volume = 1

  const setVoice = () => {
    const voices = synth.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Google UK English Female') ||
      v.name.includes('Microsoft Zira') ||
      (v.lang.startsWith('en') && v.name.toLowerCase().includes('female'))
    ) || voices.find(v => v.lang.startsWith('en'))
    if (preferred) utter.voice = preferred
  }

  const voices = synth.getVoices()
  if (voices.length) {
    setVoice()
    synth.speak(utter)
  } else {
    synth.addEventListener('voiceschanged', () => {
      setVoice()
      synth.speak(utter)
    }, { once: true })
  }
}

/* ─── Particle Canvas ─── */
function ParticleField({ count = 120, active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const actualCount = window.innerWidth < 768 ? Math.min(count, 40) : count
    particles = Array.from({ length: actualCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: 0,
      targetOpacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.5 ? 195 : 270,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        if (active) {
          p.opacity += (p.targetOpacity - p.opacity) * 0.02
        }
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity * 0.15})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count, active])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

/* ─── HUD Ring ─── */
function LoadingRing({ progress, glowing }) {
  const circumference = 2 * Math.PI * 90

  return (
    <div className={`loading-ring-container ${glowing ? 'ring-glow' : ''}`}>
      <svg viewBox="0 0 200 200" className="loading-ring-svg">
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0, 212, 255, 0.08)" strokeWidth="2" />
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i * 6 - 90) * Math.PI / 180
          const isMajor = i % 5 === 0
          const inner = isMajor ? 78 : 82
          const outer = 86
          return (
            <line
              key={i}
              x1={100 + inner * Math.cos(angle)}
              y1={100 + inner * Math.sin(angle)}
              x2={100 + outer * Math.cos(angle)}
              y2={100 + outer * Math.sin(angle)}
              stroke={i <= (progress / 100) * 60 ? 'rgba(0, 212, 255, 0.6)' : 'rgba(0, 212, 255, 0.1)'}
              strokeWidth={isMajor ? 1.5 : 0.5}
            />
          )
        })}
        <circle
          cx="100" cy="100" r="90"
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
        <circle
          cx="100" cy="100" r="92"
          fill="none"
          stroke="rgba(0, 212, 255, 0.15)"
          strokeWidth="6"
          strokeDasharray={circumference * (92 / 90)}
          strokeDashoffset={circumference * (92 / 90) - (progress / 100) * circumference * (92 / 90)}
          transform="rotate(-90 100 100)"
          style={{ filter: 'blur(4px)' }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="loading-ring-outer" />
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />
    </div>
  )
}

/* ─── Main Component ─── */
const LOADING_MESSAGES = [
  'Initializing System...',
  'Loading Assets...',
  'Building Experience...',
  'Activating AI...',
  'Connecting Modules...',
  'Finalizing...',
]

export default function CinematicIntro({ onComplete }) {
  const [scene, setScene] = useState(0)
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [showLogo, setShowLogo] = useState(false)
  const [systemOnline, setSystemOnline] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)

  const audioCtxRef = useRef(null)
  const ambientRef = useRef(null)
  const loadingSoundRef = useRef(null)
  const voicePlayedRef = useRef(false)

  // Entire timeline driven from a single effect to prevent StrictMode double-fires
  useEffect(() => {
    const timers = []
    const addTimer = (fn, ms) => {
      const id = setTimeout(fn, ms)
      timers.push(id)
      return id
    }

    // Scene 1: particles
    addTimer(() => setScene(1), 500)

    // Logo appears
    addTimer(() => setShowLogo(true), 1500)

    // Init audio + voice
    addTimer(() => {
      if (!voicePlayedRef.current) {
        voicePlayedRef.current = true
        // Try to create AudioContext (needs user gesture on some browsers, but we try anyway)
        try {
          if (AudioCtxClass) {
            audioCtxRef.current = new AudioCtxClass()
            ambientRef.current = createAmbientSound(audioCtxRef.current)
          }
        } catch (e) {
          // Audio blocked - continue silently
        }
        speakAIVoice()
      }
    }, 2000)

    // Scene 2: start loading
    addTimer(() => setScene(2), 3000)

    return () => timers.forEach(clearTimeout)
  }, [])

  // Loading progress
  useEffect(() => {
    if (scene !== 2) return

    // Start loading sound
    try {
      if (audioCtxRef.current && !loadingSoundRef.current) {
        loadingSoundRef.current = createLoadingSound(audioCtxRef.current)
      }
    } catch (e) { /* audio blocked */ }

    let currentProgress = 0
    let pauseTicks = 0
    let hasPaused25 = false
    let hasPaused55 = false
    let hasPaused80 = false
    const totalDuration = 6000
    const interval = 30
    const increment = 100 / (totalDuration / interval)

    const timer = setInterval(() => {
      if (pauseTicks > 0) {
        pauseTicks--
        return
      }

      // Check for simulated pauses
      if (currentProgress >= 25 && !hasPaused25) {
        hasPaused25 = true
        currentProgress = 25
        pauseTicks = 35 // Pause for ~1 second
        setProgress(25)
        return
      }
      if (currentProgress >= 55 && !hasPaused55) {
        hasPaused55 = true
        currentProgress = 55
        pauseTicks = 35 // Pause for ~1 second
        setProgress(55)
        return
      }
      if (currentProgress >= 80 && !hasPaused80) {
        hasPaused80 = true
        currentProgress = 80
        pauseTicks = 25 // Pause for ~750ms
        setProgress(80)
        return
      }

      currentProgress += increment + (Math.random() * 0.3)

      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(timer)

        // Stop loading sound
        try {
          if (loadingSoundRef.current && audioCtxRef.current) {
            loadingSoundRef.current.gain.gain.linearRampToValueAtTime(
              0, audioCtxRef.current.currentTime + 0.5
            )
          }
        } catch (e) {}

        // System Online
        setTimeout(() => {
          setSystemOnline(true)
          try {
            if (audioCtxRef.current) playSuccessSound(audioCtxRef.current)
          } catch (e) {}

          // Transition out
          setTimeout(() => {
            setScene(4)
            try {
              if (ambientRef.current && audioCtxRef.current) {
                ambientRef.current.gain.gain.linearRampToValueAtTime(
                  0, audioCtxRef.current.currentTime + 2
                )
              }
            } catch (e) {}
            setTimeout(() => {
              // Clean up audio
              try {
                ambientRef.current?.oscillators.forEach(o => { try { o.stop() } catch(e) {} })
                loadingSoundRef.current?.osc?.stop()
                audioCtxRef.current?.close()
              } catch (e) {}
              onComplete()
            }, 2000)
          }, 2000)
        }, 400)
      }

      setProgress(Math.min(currentProgress, 100))
      setMessageIndex(Math.min(
        Math.floor((currentProgress / 100) * LOADING_MESSAGES.length),
        LOADING_MESSAGES.length - 1
      ))
    }, interval)

    return () => clearInterval(timer)
  }, [scene, onComplete])

  // Glitch effect
  useEffect(() => {
    if (scene < 2 || scene > 3) return
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 100 + Math.random() * 150)
    }, 2000 + Math.random() * 3000)
    return () => clearInterval(glitchInterval)
  }, [scene])

  // Loading sound filter sweep
  useEffect(() => {
    try {
      if (loadingSoundRef.current?.filter && audioCtxRef.current) {
        loadingSoundRef.current.filter.frequency.linearRampToValueAtTime(
          200 + (progress / 100) * 800,
          audioCtxRef.current.currentTime + 0.1
        )
      }
    } catch (e) {}
  }, [progress])

  return (
    <motion.div
      className={`cinematic-intro ${glitchActive ? 'glitch' : ''}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: scene === 4 ? 0 : 1 }}
      transition={{ duration: 1.8, ease: 'easeInOut' }}
    >
      <ParticleField count={150} active={scene >= 1} />
      <div className="scanline-overlay" />

      {/* Logo */}
      <AnimatePresence>
        {showLogo && scene < 4 && (
          <motion.div
            className="logo-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="logo-glow" />
            <h1 className="logo-text">
              <span className="logo-bex">BEX</span>
              <span className="logo-sigma">SIGMA</span>
              <span className="logo-tech">TECH</span>
            </h1>
            <div className="logo-tagline">NEXT-GENERATION DIGITAL EXPERIENCES</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      <AnimatePresence>
        {scene >= 2 && scene < 4 && (
          <motion.div
            className="loading-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LoadingRing progress={progress} glowing={systemOnline} />

            <div className="loading-info">
              <div className="loading-percentage">
                {Math.floor(progress)}
                <span className="percentage-symbol">%</span>
              </div>

              <div className="loading-message-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageIndex}
                    className="loading-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {LOADING_MESSAGES[messageIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="loading-bar-track">
                <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* HUD Data */}
            <div className="hud-data">
              <div className="hud-item">
                <span className="hud-label">CPU</span>
                <span className="hud-value">{Math.floor(30 + progress * 0.6)}%</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">MEM</span>
                <span className="hud-value">{(progress * 0.085).toFixed(1)}GB</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">NET</span>
                <span className="hud-value">{Math.floor(100 + progress * 8)}MB/s</span>
              </div>
            </div>

            {/* System Online */}
            <AnimatePresence>
              {systemOnline && (
                <motion.div
                  className="system-online"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="online-check">
                    <span className="check-icon">✔</span> SYSTEM ONLINE
                  </div>
                  <div className="online-check ready">
                    <span className="check-icon">✔</span> EXPERIENCE READY
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="vignette" />
    </motion.div>
  )
}
