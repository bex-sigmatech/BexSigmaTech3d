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

  // Waveform Visualizer Loop
  useEffect(() => {
    let animId
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const render = () => {
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

    render()
    return () => cancelAnimationFrame(animId)
  }, [voiceState])

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
      {/* Floating Orbital Voice Toggle Button (Always visible on bottom right) */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
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
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '1px',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isOpen ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: voiceState === 'SPEAKING' ? '#38bdf8' : voiceState === 'LISTENING' ? '#10b981' : '#64748b',
              boxShadow: voiceState !== 'DISCONNECTED' ? '0 0 10px currentColor' : 'none',
              animation: voiceState !== 'DISCONNECTED' ? 'pulse 1.5s infinite' : 'none',
            }}
          />
          <FaBroadcastTower style={{ fontSize: '15px' }} />
          <span>{voiceState !== 'DISCONNECTED' ? 'LIVE COMS ACTIVE' : 'TALK TO SIGMA'}</span>
        </button>
      </div>

      {/* Expanded Cyberpunk Voice Matrix Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '28px',
            width: '360px',
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
              <FaTimes />
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

          {/* Live Transcript / Subtitles */}
          {transcript && (
            <div
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
                'Initiate biometric scan for Commander Alex',
                'Status report on Sigma systems'
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
        </div>
      )}
    </>
  )
}
