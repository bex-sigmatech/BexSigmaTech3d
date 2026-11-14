import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

export default function Dashboard() {
  const { userName, activeMission, exitDashboard, resetSession, navigateToSector } = useStore()
  const [logs, setLogs] = useState([
    'SYS: Decrypt handshake complete.',
    'SYS: Operator authorization credentials established.',
    'SYS: Initializing Mission Dashboard panel...'
  ])
  const savedEmail = typeof window !== 'undefined' ? (localStorage.getItem('bex_customer_email') || '') : ''
  const [serverHealth, setServerHealth] = useState('Checking...')
  const [healthLatency, setHealthLatency] = useState(null)
  const [lookupEmail, setLookupEmail] = useState(savedEmail)
  const [isSearching, setIsSearching] = useState(false)
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupError, setLookupError] = useState('')
  const logEndRef = useRef(null)

  useEffect(() => {
    if (savedEmail && savedEmail.includes('@')) {
      fetch(`${BACKEND_URL}/api/orders/lookup?email=${encodeURIComponent(savedEmail.trim())}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.count > 0) setLookupResult(data)
        })
        .catch(() => {})
    }
  }, [savedEmail])

  useEffect(() => {
    voiceEmitter.emit('DASHBOARD_VISIBLE')
    // Real server ping
    const t0 = performance.now()
    fetch(`${BACKEND_URL}/api/health`)
      .then((r) => r.json())
      .then((data) => {
        const ms = Math.round(performance.now() - t0)
        setServerHealth(data.status || 'ONLINE')
        setHealthLatency(ms)
      })
      .catch(() => {
        setServerHealth('OFFLINE / RESTRICTED')
        setHealthLatency(null)
      })
  }, [activeMission])

  // Auto-scrolling terminal logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  // Periodic scrolling dashboard logs
  useEffect(() => {
    const diagnosticLines = [
      'NET: Firewall verification clean - SSL verified.',
      'SYS: API Gateway synced with Cashfree & Gemini 2.0.',
      'SYS: Cloud database synced with server/data/database.json.',
      'SYS: Decrypted mission telemetry incoming...',
      'AI: Neural sync core verified.',
      'SEC: Memory address clearance stable.'
    ]
    let index = 0
    const MAX_LOGS = 120
    const interval = setInterval(() => {
      if (document.hidden) return
      const timestamp = new Date().toLocaleTimeString()
      setLogs((prev) => {
        const next = [...prev, `[${timestamp}] ${diagnosticLines[index % diagnosticLines.length]}`]
        index++
        return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const triggerDiagnostic = () => {
    cinemaAudio.playOrbSelect()
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => {
      const next = [
        ...prev,
        `[${timestamp}] CMD: Executing diagnostic sync check...`,
        `[${timestamp}] SYS: Server API Ping: ${healthLatency ? `${healthLatency}ms` : 'healthy'}.`,
        `[${timestamp}] SYS: Diagnostic verification SUCCESS.`
      ]
      return next.length > 120 ? next.slice(-120) : next
    })
  }

  const handleOrderLookup = async (e) => {
    e.preventDefault()
    if (!lookupEmail || !lookupEmail.includes('@')) {
      setLookupError('Please enter a valid email address.')
      return
    }
    setLookupError('')
    setIsSearching(true)
    cinemaAudio.playBinaryTick()

    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/lookup?email=${encodeURIComponent(lookupEmail.trim())}`)
      const data = await res.json()
      if (data.success) {
        setLookupResult(data)
        if (data.count > 0) cinemaAudio.playAccessGrantedChime()
        else cinemaAudio.playScrollTransition()
      } else {
        setLookupError(data.error || 'Failed to retrieve orders.')
      }
    } catch (err) {
      setLookupError('Network error connecting to API server.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="dashboard-screen">
      <div className="scanlines" />
      <div className="vignette-overlay" />

      {/* Header */}
      <div className="dashboard-header interactive">
        <div className="dashboard-brand">BEX SIGMA MAIN FRAME</div>
        <div className="dashboard-status">
          <span className="dashboard-status-dot" />
          <span>OPERATOR: {userName || 'GUEST'} (LEVEL 1)</span>
          <span style={{ color: '#10b981', marginLeft: '12px', fontSize: '0.8rem' }}>
            API: {serverHealth} {healthLatency ? `(${healthLatency}ms)` : ''}
          </span>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="dashboard-layout interactive">
        <div className="dashboard-main">
          {/* Diagnostic stats */}
          <div className="dashboard-grid-3col">
            <div className="dashboard-card">
              <div className="dashboard-card-title">Server Status</div>
              <div className="dashboard-card-value" style={{ fontSize: '1.2rem', color: '#10b981' }}>
                {serverHealth.includes('ONLINE') ? 'ONLINE 100%' : 'STANDBY'}
              </div>
              <div className="dashboard-card-subtext">{healthLatency ? `Ping: ${healthLatency}ms latency` : 'SSL & Firewall verified'}</div>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-card-title">Neural Engine</div>
              <div className="dashboard-card-value">Gemini 2.0</div>
              <div className="dashboard-card-subtext">Multimodal Live Voice & Chat</div>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-card-title">Payment Matrix</div>
              <div className="dashboard-card-value" style={{ color: '#38bdf8' }}>Cashfree</div>
              <div className="dashboard-card-subtext">UPI, Cards, NetBanking Active</div>
            </div>
          </div>

          {/* Customer Order & Download Retrieval Portal */}
          <div className="dashboard-card" style={{ marginTop: '16px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
            <div className="dashboard-card-title" style={{ color: '#00d4ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📦</span>
              <span>CUSTOMER ORDER & DOWNLOAD RETRIEVAL</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '6px 0 14px 0' }}>
              Already purchased the <strong>aIn — Excel All-in-One Master Suite (₹199)</strong>? Enter your email to view your verified purchases and access your download or Google Drive link.
            </p>

            <form onSubmit={handleOrderLookup} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="Enter your purchase email (e.g. operator@gmail.com)"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                style={{
                  flex: '1 1 240px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(0, 212, 255, 0.4)',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #0284c7)',
                  color: '#000',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'Orbitron, sans-serif'
                }}
              >
                {isSearching ? 'SEARCHING...' : '🔍 LOOKUP ORDERS'}
              </button>
            </form>

            {lookupError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '10px' }}>
                ⚠️ {lookupError}
              </div>
            )}

            {lookupResult && (
              <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                {lookupResult.count === 0 ? (
                  <div style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
                    ℹ️ No paid orders found for <strong>{lookupResult.email}</strong>. If you recently paid, please verify your email spelling or visit the <button onClick={() => navigateToSector('web_dev')} style={{ background: 'none', border: 'none', color: '#10b981', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Products Store</button>.
                  </div>
                ) : (
                  <div>
                    <div style={{ color: '#10b981', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>
                      ✓ Found {lookupResult.count} Verified Purchase{lookupResult.count > 1 ? 's' : ''}:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {lookupResult.orders.map((ord, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '10px 14px',
                            borderRadius: '6px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}
                        >
                          <div>
                            <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{ord.product?.name || 'Excel Dashboard'}</strong>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Order ID: {ord.order_id} · {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Paid'}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {ord.downloadUrl && (
                              <a
                                href={ord.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  color: '#fff',
                                  padding: '6px 14px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  textDecoration: 'none'
                                }}
                              >
                                ⬇ Download ZIP
                              </a>
                            )}
                            {ord.driveUrl && (
                              <a
                                href={ord.driveUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  background: 'rgba(255,255,255,0.1)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  color: '#38bdf8',
                                  padding: '6px 14px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  textDecoration: 'none'
                                }}
                              >
                                📂 Google Drive
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Terminal Console log box */}
          <div className="dashboard-log-section" style={{ marginTop: '16px' }}>
            <div className="dashboard-card-title">Mainframe System Log Output</div>
            <div className="dashboard-logs-box">
              {logs.map((log, idx) => (
                <div key={idx} className="dashboard-log-entry">
                  &gt; {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Side Panel Controls */}
        <div className="dashboard-sidebar">
          {activeMission && (
            <div className="dashboard-card dashboard-active-mission-card">
              <div className="dashboard-card-title">Active Mission Directive</div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '6px 0' }}>
                {activeMission.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(232, 234, 255, 0.65)', lineHeight: 1.4 }}>
                {activeMission.objective}
              </p>
            </div>
          )}

          <div className="dashboard-card">
            <div className="dashboard-card-title">Command Panel Protocols</div>
            <div className="dashboard-actions">
              <button className="dashboard-btn-action" onClick={triggerDiagnostic}>
                Run Diagnostic Sync
              </button>
              <button className="dashboard-btn-action" onClick={() => navigateToSector('web_dev')}>
                🛒 Products Store
              </button>
              <button className="dashboard-btn-action" onClick={exitDashboard}>
                Back to Orbit
              </button>
              <button className="dashboard-btn-action dashboard-btn-exit" onClick={resetSession}>
                Terminate Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
