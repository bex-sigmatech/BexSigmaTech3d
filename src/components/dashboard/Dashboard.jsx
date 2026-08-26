import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(target, duration = 1800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return value
}

/* ─── Mini Line Chart (canvas) ─── */
function MiniChart({ color = '#00d4ff', label }) {
  const canvasRef = useRef(null)
  const pointsRef = useRef(Array.from({ length: 20 }, () => 40 + Math.random() * 40))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const draw = () => {
      // Drift points
      const pts = pointsRef.current
      pts.push(pts[pts.length - 1] + (Math.random() - 0.42) * 8)
      if (pts[pts.length - 1] > 90) pts[pts.length - 1] = 90
      if (pts[pts.length - 1] < 10) pts[pts.length - 1] = 10
      pts.shift()

      const w = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      const h = canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      const step = w / (pts.length - 1)

      // Fill gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, color.replace(')', ', 0.25)').replace('rgb', 'rgba'))
      grad.addColorStop(1, 'transparent')
      ctx.beginPath()
      pts.forEach((p, i) => {
        const x = i * step
        const y = h - (p / 100) * h
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()

      // Line
      ctx.beginPath()
      pts.forEach((p, i) => {
        const x = i * step
        const y = h - (p / 100) * h
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      })
      ctx.strokeStyle = color
      ctx.lineWidth = 2 * window.devicePixelRatio
      ctx.lineJoin = 'round'
      ctx.stroke()

      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [color])

  return (
    <div style={{ position: 'relative', width: '100%', height: '64px', marginTop: '8px' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', borderRadius: '6px' }} />
      <span style={{ position: 'absolute', bottom: 4, right: 8, fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{label}</span>
    </div>
  )
}

export default function Dashboard() {
  const { userName, activeMission, exitDashboard, resetSession } = useStore()
  const [logs, setLogs] = useState([
    'SYS: Decrypt handshake complete.',
    'SYS: Operator authorization credentials established.',
    'SYS: Initializing Mission Dashboard panel...'
  ])
  const logEndRef = useRef(null)

  // Animated counters
  const ordersToday = useAnimatedCounter(47)
  const uptime = useAnimatedCounter(9999, 2400)
  const revenue = useAnimatedCounter(183420, 2200)
  const clients = useAnimatedCounter(512)

  useEffect(() => {
    voiceEmitter.emit('DASHBOARD_VISIBLE')
  }, [activeMission])

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  useEffect(() => {
    const diagnosticLines = [
      'NET: Firewall verification clean — SSL verified.',
      'SYS: CPU core load balanced at 12%.',
      'SYS: Cloud database synced with AWS.',
      'SYS: Decrypted mission telemetry incoming...',
      'AI: Neural sync core verified.',
      'SEC: Memory address clearance stable.',
      'NET: WebSocket latency: 4ms.',
      'AI: Gemini Live gateway: CONNECTED.',
      'SYS: Cashfree payment nodes: ONLINE.',
      'SEC: Biometric session: ACTIVE.',
    ]
    let index = 0
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString()
      setLogs(prev => [...prev.slice(-12), `[${timestamp}] ${diagnosticLines[index % diagnosticLines.length]}`])
      index++
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  const triggerDiagnostic = () => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [
      ...prev,
      `[${timestamp}] CMD: Executing diagnostic sync check...`,
      `[${timestamp}] SYS: Ping latency: 4ms. Database healthy.`,
      `[${timestamp}] SYS: Diagnostic verification SUCCESS ✓`
    ])
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
          <span>OPERATOR: {userName || 'COMMANDER'} (LEVEL 1)</span>
        </div>
      </div>

      {/* KPI metric row */}
      <div className="dashboard-layout interactive">
        <div className="dashboard-main">
          <div className="dashboard-grid-3col" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {/* Orders Today */}
            <div className="dashboard-card" style={{ borderColor: 'rgba(0,212,255,0.3)' }}>
              <div className="dashboard-card-title">Orders Today</div>
              <div className="dashboard-card-value" style={{ color: '#00d4ff', fontSize: '2rem' }}>{ordersToday}</div>
              <div className="dashboard-card-subtext">↑ 12% vs yesterday</div>
              <MiniChart color="#00d4ff" label="24h trend" />
            </div>

            {/* Revenue */}
            <div className="dashboard-card" style={{ borderColor: 'rgba(16,185,129,0.3)' }}>
              <div className="dashboard-card-title">Revenue (₹)</div>
              <div className="dashboard-card-value" style={{ color: '#10b981', fontSize: '1.6rem' }}>
                {revenue.toLocaleString('en-IN')}
              </div>
              <div className="dashboard-card-subtext">↑ 8.4% this week</div>
              <MiniChart color="#10b981" label="revenue curve" />
            </div>

            {/* Uptime */}
            <div className="dashboard-card" style={{ borderColor: 'rgba(168,85,247,0.3)' }}>
              <div className="dashboard-card-title">System Uptime</div>
              <div className="dashboard-card-value" style={{ color: '#a855f7', fontSize: '1.6rem' }}>
                {(uptime / 100).toFixed(2)}%
              </div>
              <div className="dashboard-card-subtext">SLA: 99.99% guaranteed</div>
              <MiniChart color="#a855f7" label="uptime pulse" />
            </div>

            {/* Clients */}
            <div className="dashboard-card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
              <div className="dashboard-card-title">Active Clients</div>
              <div className="dashboard-card-value" style={{ color: '#f59e0b', fontSize: '2rem' }}>{clients}</div>
              <div className="dashboard-card-subtext">Across 12 countries</div>
              <MiniChart color="#f59e0b" label="client growth" />
            </div>
          </div>

          {/* Terminal Console */}
          <div className="dashboard-log-section">
            <div className="dashboard-card-title">Mainframe System Log Output</div>
            <div className="dashboard-logs-box">
              {logs.map((log, idx) => (
                <div key={idx} className="dashboard-log-entry" style={{
                  color: log.includes('SUCCESS') ? '#10b981' : log.includes('CONNECTED') || log.includes('ONLINE') ? '#00d4ff' : 'rgba(232,234,255,0.75)'
                }}>
                  &gt; {log}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
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

          {/* Live status */}
          <div className="dashboard-card" style={{ borderColor: 'rgba(0,212,255,0.2)' }}>
            <div className="dashboard-card-title">System Status</div>
            {[
              { label: 'API Gateway', status: 'ONLINE', color: '#10b981' },
              { label: 'Cashfree Payments', status: 'LIVE', color: '#10b981' },
              { label: 'Gemini AI Core', status: 'ACTIVE', color: '#00d4ff' },
              { label: 'Email Delivery', status: 'READY', color: '#10b981' },
              { label: 'Database', status: 'SYNCED', color: '#a855f7' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.72rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</span>
                <span style={{ color: s.color, fontFamily: 'monospace', fontWeight: 600 }}>● {s.status}</span>
              </div>
            ))}
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-title">Command Panel Protocols</div>
            <div className="dashboard-actions">
              <button className="dashboard-btn-action" onClick={triggerDiagnostic}>
                Run Diagnostic Sync
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
