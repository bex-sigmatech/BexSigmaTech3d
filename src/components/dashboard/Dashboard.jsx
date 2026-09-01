import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'

import { voiceEmitter } from '../../audio/AIVoiceEngine'

export default function Dashboard() {
  const { userName, activeMission, exitDashboard, resetSession } = useStore()
  const [logs, setLogs] = useState([
    'SYS: Decrypt handshake complete.',
    'SYS: Operator authorization credentials established.',
    'SYS: Initializing Mission Dashboard panel...'
  ])
  const logEndRef = useRef(null)

  useEffect(() => {
    // "Operator dashboard online."
    voiceEmitter.emit('DASHBOARD_VISIBLE')
  }, [activeMission])

  // Auto-scrolling terminal logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  // Periodic scrolling dashboard logs — LAGFREE: capped 120, pause on hidden, auto-scroll only when visible
  useEffect(() => {
    const diagnosticLines = [
      'NET: Firewall verification clean - SSL verified.',
      'SYS: CPU core load balanced at 12%.',
      'SYS: Cloud database synced with AWS.',
      'SYS: Decrypted mission telemetry incoming...',
      'AI: Neural sync core verified.',
      'SEC: Memory address clearance stable.'
    ]
    let index = 0
    const MAX_LOGS = 120
    const interval = setInterval(() => {
      if (document.hidden) return
      const timestamp = new Date().toLocaleTimeString()
      setLogs(prev => {
        const next = [...prev, `[${timestamp}] ${diagnosticLines[index % diagnosticLines.length]}`]
        index++
        return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const triggerDiagnostic = () => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => {
      const next = [
        ...prev,
        `[${timestamp}] CMD: Executing diagnostic sync check...`,
        `[${timestamp}] SYS: Ping latency: 8ms. Database healthy.`,
        `[${timestamp}] SYS: Diagnostic verification SUCCESS.`
      ]
      return next.length > 120 ? next.slice(-120) : next
    })
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
          <span>OPERATOR: {userName} (LEVEL 1)</span>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="dashboard-layout interactive">
        <div className="dashboard-main">
          {/* Diagnostic stats */}
          <div className="dashboard-grid-3col">
            <div className="dashboard-card">
              <div className="dashboard-card-title">Memory Allocation</div>
              <div className="dashboard-card-value">100%</div>
              <div className="dashboard-card-subtext">Core cache decrypted</div>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-card-title">Neural Links</div>
              <div className="dashboard-card-value">18 Active</div>
              <div className="dashboard-card-subtext">AWS cloud sync active</div>
            </div>
            <div className="dashboard-card">
              <div className="dashboard-card-title">CPU Telemetry</div>
              <div className="dashboard-card-value">12.4%</div>
              <div className="dashboard-card-subtext">Status: Normal/Stable</div>
            </div>
          </div>

          {/* Terminal Console log box */}
          <div className="dashboard-log-section">
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
