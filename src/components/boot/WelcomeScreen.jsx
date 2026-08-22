import React, { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import EarthBackground8K from '../headquarters/EarthBackground8K'

export default function WelcomeScreen() {
  const { triggerAICore } = useStore()
  const [blackout, setBlackout] = useState(false)

  const welcomeTriggered = React.useRef(false)

  useEffect(() => {
    // Event-driven dispatch
    if (!welcomeTriggered.current) {
      welcomeTriggered.current = true
      voiceEmitter.emit('WELCOME_SCREEN_VISIBLE')
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

    // 1. Start fading to black as zoom finishes
    const fadeTimer = setTimeout(() => {
      setBlackout(true)
    }, isMobile ? 1500 : 3000)

    // 2. Keep screen blank/black, then transition to AI Core
    const transitionTimer = setTimeout(() => {
      triggerAICore()
    }, isMobile ? 2200 : 4500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(transitionTimer)
    }
  }, [triggerAICore])

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Native 8K procedural Earth — orbit view */}
      <EarthBackground8K viewMode="orbit" />
      <div className="cinematic-vignette" />
      <div className="cinematic-letterbox-top" />
      <div className="cinematic-letterbox-bottom" />
      
      <div className="cinematic-caption" style={{ transition: 'opacity 0.5s ease', opacity: blackout ? 0 : 1 }}>
        <div className="caption-location">LOW EARTH ORBIT · 408 KM · INCLINATION 51.6°</div>
        <div className="caption-title">EARTH OBSERVATION SECTOR</div>
      </div>

      {/* Cinematic Blank Screen Blackout Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000000',
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: blackout ? 1 : 0,
          zIndex: 100,
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
