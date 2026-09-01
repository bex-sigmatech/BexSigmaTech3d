import React, { useState, useEffect, useRef } from 'react'
import { liveVoiceClient } from '../../audio/GeminiLiveClient'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import { FaMicrophone, FaMicrophoneSlash, FaBroadcastTower, FaTimes } from 'react-icons/fa'

/* ==========================================================================
   BEX SIGMA TECH — LIVE VOICE COMMAND HUD
   Futuristic floating HUD with real-time waveform visualizer,
   status telemetry, and Gemini 2.0 Live voice communication.
   ========================================================================== */

export default function LiveVoiceHUD({ onNavigateSector, onTriggerScan }) {
  const [isOpen, setIsOpen] = useState(false)
  const [voiceState, setVoiceState] = useState('DISCONNECTED')
  const [transcript, setTranscript] = useState('')
  const [statusNotice, setStatusNotice] = useState('Standby — Click Connect to link Sigma Core')
  const [isMuted, setIsMuted] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const handleStateChange = (state) => {
      setVoiceState(state)
      if (state === 'LISTENING') setStatusNotice('🎙️ SIGMA CORE: LISTENING (Speak freely)...')
      if (state === 'SPEAKING') setStatusNotice('🔊 SIGMA CORE: TRANSMITTING...')
      if (state === 'CONNECTING') setStatusNotice('⚡ ESTABLISHING SECURE ORBITAL LINK...')
      if (state === 'DISCONNECTED') setStatusNotice('Standby — Offline')
    }

    const handleTranscript = (text) => {
      setTranscript((prev) => (prev + ' ' + text).slice(-200))
    }

    const handleToolCall = ({ name, args }) => {
      console.log('⚡ Received Tool Call in HUD:', name, args)
      if (name === 'navigateSector' && args?.sector) {
        setStatusNotice(`🚀 Vector Set: Sector ${args.sector.toUpperCase()}`)
        if (onNavigateSector) onNavigateSector(args.sector)
        window.dispatchEvent(new CustomEvent('NAVIGATE_SECTOR', { detail: args.sector }))
      } else if (name === 'triggerBiometricScan') {
        setStatusNotice('🔒 Initiating Biometric Scan Sequence...')
        if (onTriggerScan) onTriggerScan(args?.callsign)
        window.dispatchEvent(new CustomEvent('TRIGGER_SCAN', { detail: args?.callsign }))
      } else if (name === 'showProductDetails' && args?.productId) {
        setStatusNotice(`📊 Showing ${args.productId}`)
        window.dispatchEvent(new CustomEvent('SHOW_PRODUCT', { detail: args.productId }))
      } else if (name === 'addToCart' && args?.productId) {
        setStatusNotice(`🛒 Adding ${args.productId} to cart`)
        window.dispatchEvent(new CustomEvent('ADD_TO_CART', { detail: { productId: args.productId, quantity: args.quantity || 1 } }))
      } else if (name === 'openCheckout' && args?.productId) {
        setStatusNotice(`🔐 Opening checkout for ${args.productId}`)
        window.dispatchEvent(new CustomEvent('OPEN_CHECKOUT', { detail: args.productId }))
      } else if (name === 'showPricing') {
        setStatusNotice('💰 Pricing overview requested')
        window.dispatchEvent(new CustomEvent('SHOW_PRICING'))
        if (onNavigateSector) onNavigateSector('web_dev')
      }
    }

    const handleStatus = (statusMsg) => {
      if (statusMsg?.message) {
        setStatusNotice(statusMsg.message)
      }
    }

    liveVoiceClient.on('state', handleStateChange)
    liveVoiceClient.on('transcript', handleTranscript)
    liveVoiceClient.on('toolCall', handleToolCall)
    liveVoiceClient.on('status', handleStatus)

    return () => {
      liveVoiceClient.off('state', handleStateChange)
      liveVoiceClient.off('transcript', handleTranscript)
      liveVoiceClient.off('toolCall', handleToolCall)
      liveVoiceClient.off('status', handleStatus)
    }
  }, [onNavigateSector, onTriggerScan])

  // Waveform Visualizer — LAGFREE: only when panel open + connected, throttled 30fps
  useEffect(() => {
    if (!isOpen) return
    if (voiceState === 'DISCONNECTED') return
    let animId
    let last = 0
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const render = (now) => {
      if (now - last < 33) { animId = requestAnimationFrame(render); return }
      last = now
      if (document.hidden) { animId = requestAnimationFrame(render); return }
      const freq = liveVoiceClient.getFrequencyData()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const numBars = 24
      const barWidth = canvas.width / numBars - 2

      for (let i = 0; i < numBars; i++) {
        const val = freq[i % freq.length] || 0
        const barHeight = Math.max(3, (val / 255) * canvas.height * 0.9)

        const x = i * (barWidth + 2)
        const y = (canvas.height - barHeight) / 2

        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
        if (voiceState === 'SPEAKING') {
          grad.addColorStop(0, '#00d4ff')
          grad.addColorStop(1, '#a855f7')
        } else if (voiceState === 'LISTENING') {
          grad.addColorStop(0, '#10b981')
          grad.addColorStop(1, '#06b6d4')
        } else {
          grad.addColorStop(0, 'rgba(100, 116, 139, 0.4)')
          grad.addColorStop(1, 'rgba(51, 65, 85, 0.4)')
        }

        ctx.fillStyle = grad
        ctx.fillRect(x, y, barWidth, barHeight)
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [voiceState, isOpen])

  const toggleConnection = async () => {
    if (voiceState === 'DISCONNECTED') {
      setTranscript('')
      await liveVoiceClient.connect()
    } else {
      liveVoiceClient.disconnect()
    }
  }

  return (
    <>
      {/* Floating Orbital Voice Toggle Button */}
      <div className="live-voice-hud-wrap">
        <button
          className="live-voice-hud-btn"
          aria-label={voiceState !== 'DISCONNECTED' ? 'Close Sigma voice panel, live comms active' : 'Open and connect to Sigma voice assistant'}
          aria-pressed={isOpen}
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen && voiceState === 'DISCONNECTED') {
              toggleConnection()
            }
          }}
          style={{
            background: voiceState === 'SPEAKING'
              ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.9), rgba(168, 85, 247, 0.9))'
              : voiceState === 'LISTENING'
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(6, 182, 212, 0.9))'
              : 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85))',
            color: '#ffffff',
            border: '1px solid rgba(0, 212, 255, 0.5)',
            boxShadow: voiceState !== 'DISCONNECTED'
              ? '0 0 25px rgba(0, 212, 255, 0.5), inset 0 0 15px rgba(0, 212, 255, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.6)',
            borderRadius: '50px',
            transform: isOpen ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <span
            aria-hidden="true"
            className="live-voice-status-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: voiceState === 'SPEAKING' ? '#38bdf8' : voiceState === 'LISTENING' ? '#10b981' : '#64748b',
              boxShadow: voiceState !== 'DISCONNECTED' ? '0 0 10px currentColor' : 'none',
              animation: voiceState !== 'DISCONNECTED' ? 'pulse 1.5s infinite' : 'none',
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
          <span>{voiceState !== 'DISCONNECTED' ? 'LIVE COMS ACTIVE' : 'TALK TO SIGMA'}</span>
        </button>
      </div>

      {/* Expanded Cyberpunk Voice Matrix Panel */}
      {isOpen && (
        <div
          className="live-voice-matrix-panel"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 14, 26, 0.95), rgba(4, 8, 15, 0.98))',
            border: '1px solid rgba(0, 212, 255, 0.4)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 212, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            padding: '20px',
            zIndex: 9998,
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: voiceState === 'SPEAKING' ? '#00d4ff' : voiceState === 'LISTENING' ? '#10b981' : '#ef4444',
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', color: '#00d4ff' }}>
                SIGMA CORE 2070 · LIVE COMS
              </span>
            </div>
            <button
              aria-label="Close voice panel"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '4px',
              }}
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          {/* Real-time Spectrum Waveform */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px',
              marginBottom: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <canvas ref={canvasRef} width={300} height={50} style={{ width: '100%', height: '50px' }} />
            <span
              style={{
                fontSize: '11px',
                marginTop: '6px',
                color: voiceState === 'SPEAKING' ? '#38bdf8' : voiceState === 'LISTENING' ? '#34d399' : '#94a3b8',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {statusNotice}
            </span>
          </div>

          {/* Live Transcript / Subtitles — aria-live for 10/10 a11y */}
          {transcript && (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="false"
              style={{
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px dashed rgba(0, 212, 255, 0.25)',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '12px',
                color: '#e2e8f0',
                maxHeight: '70px',
                overflowY: 'auto',
                marginBottom: '14px',
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: '#00d4ff', fontWeight: 700 }}>Telemetry: </span>
              {transcript}
            </div>
          )}

          {/* Quick Voice Commands Cheat Sheet */}
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '14px' }}>
            <span style={{ color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>⚡ Quick Voice Commands:</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                'Navigate to Web Development Store',
                'Show me Marketing dashboard pricing',
                'Add Sales Dashboard to cart',
                'Initiate biometric scan for Commander Alex',
                'Open checkout for HR KPI Dashboard'
              ].map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (voiceState !== 'DISCONNECTED') {
                      liveVoiceClient.sendTextMessage(cmd)
                    }
                  }}
                  style={{
                    textAlign: 'left',
                    background: 'rgba(0, 212, 255, 0.08)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    color: '#38bdf8',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)'
                    e.currentTarget.style.borderColor = '#00d4ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.08)'
                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)'
                  }}
                >
                  ▸ "{cmd}"
                </button>
              ))}
            </div>
          </div>

          {/* Main Action Connect Button */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              aria-label={voiceState !== 'DISCONNECTED' ? 'Disconnect Sigma voice' : 'Initialize Sigma voice link'}
              onClick={toggleConnection}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: voiceState !== 'DISCONNECTED'
                  ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                  : 'linear-gradient(135deg, #00d4ff, #0284c7)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                boxShadow: voiceState !== 'DISCONNECTED'
                  ? '0 0 15px rgba(239, 68, 68, 0.4)'
                  : '0 0 15px rgba(0, 212, 255, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              {voiceState !== 'DISCONNECTED' ? 'DISCONNECT COMMS' : 'INITIALIZE LINK'}
            </button>
          </div>
          <p style={{fontSize:'10px',color:'#475569',marginTop:'10px',textAlign:'center'}} aria-hidden="true">Secure link is single-use • Voice is local when offline</p>
        </div>
      )}
    </>
  )
}
