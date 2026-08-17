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

  return (
    <div className="nolan-boot-screen">
      {!started ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <button className="nolan-start-btn interactive" onClick={handleStart}>
            ENTER CINEMATIC EXPERIENCE
          </button>

          {/* Lag prevention graphics quality toggle */}
          <div className="graphics-mode-selector">
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)' }}>GRAPHICS PRESET:</span>
            <div className="graphics-toggle-buttons">
              <button
                className={`graphics-toggle-btn interactive ${graphicsQuality === 'low' ? 'active' : ''}`}
                onClick={() => setGraphicsQuality('low')}
              >
                LOW (LAG FREE)
              </button>
              <button
                className={`graphics-toggle-btn interactive ${graphicsQuality === 'high' ? 'active' : ''}`}
                onClick={() => setGraphicsQuality('high')}
              >
                HIGH (CINEMATIC)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="nolan-boot-content">
          <div className="nolan-logo">BEX SIGMA TECH</div>

          {/* Circular HUD Loader drawing from 0 to 100 */}
          <div className="boot-circular-loader">
            <svg viewBox="0 0 150 150" width="150" height="150" className="boot-svg-ring">
              {/* Outer rotating target reticle */}
              <circle cx="75" cy="75" r="68" fill="none" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1.5" strokeDasharray="8 6" className="reticle-rotate-cw" />
              <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(0, 212, 255, 0.1)" strokeWidth="1" />
              
              {/* Inner progress circle drawing from 0 to 100 */}
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
              
              {/* Center crosshairs */}
              <path d="M 75,5 L 75,15 M 75,145 L 75,135 M 5,75 L 15,75 M 145,75 L 135,75" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
            </svg>
            
            {/* Center percentage or checkmark */}
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

          {/* Glowing Status Label */}
          <div className={`nolan-status-label ${loadingProgress >= 75 ? 'status-green' : 'status-cyan'}`}>
            {loadingProgress < 25 && "INITIALIZING SYSTEM NETWORK..."}
            {loadingProgress >= 25 && loadingProgress < 50 && "CORE MODULES ONLINE..."}
            {loadingProgress >= 50 && loadingProgress < 75 && "AI SYSTEMS OPERATIONAL..."}
            {loadingProgress >= 75 && loadingProgress < 100 && "SECURITY VERIFICATION COMPLETE"}
            {loadingProgress === 100 && "INITIALIZATION COMPLETE"}
          </div>

          {/* ── 100% COMPLETE RIPPLE RINGS ── */}
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
  )
}
