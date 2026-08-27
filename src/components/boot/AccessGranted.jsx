import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'

const TARGET_CODE = ['B', 'E', 'X', '—', 'S', 'I', 'G', 'M', 'A']
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@*&%'

export default function AccessGranted() {
  const { triggerWelcome, userName } = useStore()
  const [currentCode, setCurrentCode] = useState(Array(TARGET_CODE.length).fill(''))
  const [lockedSlots, setLockedSlots] = useState(Array(TARGET_CODE.length).fill(false))
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [shuttersOpen, setShuttersOpen] = useState(false)

  useEffect(() => {
    // If already skipped, do not run intro sequence at all
    const skipCheck = () => {
      try { return useStore.getState().isIntroSkipped } catch { return false }
    }
    if (skipCheck()) return

    // Dispatch event-driven ACCESS_GRANTED voice track
    voiceEmitter.emit('ACCESS_GRANTED', { userName })

    // Staggered combination lock solver (completes at ~1.2s)
    const intervals = TARGET_CODE.map((char, index) => {
      const lockDelay = index * 130 // Stagger lock every 130ms
      let localFrame = 0

      const timer = setInterval(() => {
        localFrame += 16
        
        if (localFrame >= lockDelay) {
          setLockedSlots(prev => {
            const next = [...prev]
            next[index] = true
            return next
          })
          setCurrentCode(prev => {
            const next = [...prev]
            next[index] = char
            return next
          })
          clearInterval(timer)
        } else {
          setCurrentCode(prev => {
            const next = [...prev]
            next[index] = CHARS[Math.floor(Math.random() * CHARS.length)]
            return next
          })
        }
      }, 50)

      return timer
    })

    // Trigger door shutters sliding open at 2.2s
    const shutterTimer = setTimeout(() => {
      if (skipCheck()) return
      setShuttersOpen(true)
    }, 2200)

    // Transition to Welcome screen at 2.8s
    const transitionTimer = setTimeout(() => {
      if (skipCheck()) return
      triggerWelcome()
    }, 2800)

    return () => {
      clearTimeout(shutterTimer)
      clearTimeout(transitionTimer)
      intervals.forEach(clearInterval)
    }
  }, [triggerWelcome, userName])

  useEffect(() => {
    if (lockedSlots.every(Boolean)) {
      setIsUnlocked(true)
    }
  }, [lockedSlots])

  return (
    <div className={`nolan-access-screen code-decoupler-screen ${shuttersOpen ? 'shutter-active' : ''}`}>
      {/* 3D perspective cyber grid vector background */}
      <div className="decoupler-grid-perspective" />

      {/* Slide Shutter Overlays (top and bottom blast doors) */}
      <div className="shutter-door shutter-top" />
      <div className="shutter-door shutter-bottom" />

      {/* Main Decoupler UI console */}
      <div className={`decoupler-console-box ${isUnlocked ? 'unlocked' : ''}`}>
        <div className="console-hud-bar">DECRYPTING SECURITY DECOUPLER CHANNELS</div>

        {/* Horizontal Tumbler Rack */}
        <div className="tumbler-rack">
          {currentCode.map((char, idx) => (
            <div 
              key={idx} 
              className={`tumbler-slot ${lockedSlots[idx] ? 'locked' : 'spinning'}`}
            >
              <div className="tumbler-border-glow" />
              <div className="tumbler-char">{char || '*'}</div>
              <div className="tumbler-index">{String(idx + 1).padStart(2, '0')}</div>
            </div>
          ))}
        </div>

        {/* Decryption Status details */}
        <div className="decoupler-status-panel">
          <div className="status-label">SYS ACCESS MATRIX:</div>
          <div className="status-value">
            {isUnlocked ? (
              <span className="text-green-flash">DECOUPLER SECURE · COMBINATION VERIFIED</span>
            ) : (
              <span className="text-cyan-pulse">RESOLVING SECURITY LOCK COMBINATION...</span>
            )}
          </div>
        </div>

        {/* Diagonal Tech lines */}
        <div className="decoupler-tech-footer">
          <span className="footer-code">BEX_CODE_LINK: ONLINE</span>
          <span className="footer-bar-grow" style={{ width: `${(lockedSlots.filter(Boolean).length / TARGET_CODE.length) * 100}%` }} />
        </div>
      </div>

      {/* Bottom progress indicator percentage */}
      <div className="hw-access-text-container">
        <div className="percent-indicator">
          {isUnlocked ? 100 : Math.floor((lockedSlots.filter(Boolean).length / TARGET_CODE.length) * 100)}%
        </div>
      </div>
    </div>
  )
}
