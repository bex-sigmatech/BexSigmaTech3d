import React, { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import { SECTOR_ARTICLES } from '../../data/sectorArticles'

export default function MissionBriefing() {
  const { activeMission, closeMissionBriefing, startMission } = useStore()

  useEffect(() => {
    if (activeMission) {
      voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    }
  }, [activeMission])

  if (!activeMission) return null

  const article = SECTOR_ARTICLES[activeMission.id]

  const handleStartMission = () => {
    voiceEmitter.emit('MISSION_STARTED')
    startMission()
  }

  const handleClose = () => {
    closeMissionBriefing()
  }

  // ── Fallback: no article data, render legacy compact view ──
  if (!article) {
    return (
      <div className="nolan-briefing-modal-overlay" onClick={handleClose}>
        <div className="nolan-briefing-box interactive" onClick={(e) => e.stopPropagation()}>
          <div className="nolan-briefing-header">
            <span className="nolan-briefing-code">ORBITAL ACCESS CODE: {activeMission.id.toUpperCase()}</span>
            <span className="nolan-status-dot" />
          </div>
          <h1 className="nolan-briefing-title">{activeMission.title}</h1>
          {activeMission.subtitle && <h3 className="nolan-briefing-subtitle">{activeMission.subtitle}</h3>}
          <div className="nolan-briefing-section">
            <label className="nolan-briefing-label">MISSION OBJECTIVE & SYNTHESIS</label>
            <p className="nolan-briefing-desc">{activeMission.objective || activeMission.desc}</p>
          </div>
          {activeMission.tech && (
            <div className="nolan-briefing-section">
              <label className="nolan-briefing-label">AEROSPACE TECHNOLOGY STACK</label>
              <div className="nolan-briefing-tech-row">
                {activeMission.tech.map((t, idx) => (
                  <span key={idx} className="nolan-tech-tag">{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="nolan-briefing-actions">
            <button className="nolan-btn-primary interactive" onClick={handleStartMission}>INITIATE DEPARTMENT MAINFRAME</button>
            <button className="nolan-btn-secondary interactive" onClick={handleClose}>RETURN TO OBSERVATORY WALK</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Full article view ──
  return (
    <div className="nolan-briefing-modal-overlay" onClick={handleClose}>
      <div className="nolan-briefing-box nolan-briefing-box--article interactive" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="nolan-briefing-header">
          <span className="nolan-briefing-code" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', padding: '3px 8px', borderRadius: 4, fontSize: '0.62rem' }}>{article.badge}</span>
            {article.id.toUpperCase()}
          </span>
          <span className="nolan-status-dot" />
        </div>

        <h1 className="nolan-briefing-title">{article.title}</h1>
        <h3 className="nolan-briefing-subtitle">{article.subtitle}</h3>

        {/* Stats */}
        {article.stats && (
          <div className="sector-article-stats">
            {article.stats.map((s, i) => (
              <div key={i} className="sector-stat">
                <div className="sector-stat-value">{s.value}</div>
                <div className="sector-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="sector-article-scroll">
          {/* Overview */}
          <div className="nolan-briefing-section">
            <label className="nolan-briefing-label">OVERVIEW</label>
            <p className="nolan-briefing-desc">{article.overview}</p>
          </div>

          {/* Services */}
          <div className="nolan-briefing-section">
            <label className="nolan-briefing-label">WHAT WE DO & CORE DISCIPLINES</label>
            <div className="sector-article-grid">
              {article.services.map((svc, idx) => (
                <div key={idx} className={`sector-service-card ${svc.image ? 'sector-service-card--has-img' : ''}`}>
                  {svc.image && (
                    <div className="sector-service-img-wrap">
                      <img src={svc.image} alt={svc.title} className="sector-service-img" loading="lazy" />
                      <div className="sector-service-img-overlay" />
                      {svc.badge && <span className="sector-service-badge">{svc.badge}</span>}
                    </div>
                  )}
                  <div className="sector-service-content">
                    <div className="sector-service-title">{svc.title}</div>
                    {svc.subtitle && <div className="sector-service-subtitle">{svc.subtitle}</div>}
                    <div className="sector-service-desc">{svc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits + Process */}
          <div className="sector-article-twoCol">
            <div className="nolan-briefing-section">
              <label className="nolan-briefing-label">KEY BENEFITS</label>
              <ul className="sector-article-list">
                {article.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="nolan-briefing-section">
              <label className="nolan-briefing-label">HOW IT WORKS</label>
              <ul className="sector-article-list sector-article-list--steps">
                {article.process.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Why Choose */}
          <div className="nolan-briefing-section" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px' }}>
            <label className="nolan-briefing-label">WHY BEX SIGMA TECH</label>
            <p className="nolan-briefing-desc" style={{ marginTop: 6 }}>{article.whyChoose}</p>
          </div>

          {/* Tech */}
          <div className="nolan-briefing-section">
            <label className="nolan-briefing-label">TECHNOLOGY STACK</label>
            <div className="nolan-briefing-tech-row">
              {(article.tech || activeMission.tech || []).map((t, idx) => (
                <span key={idx} className="nolan-tech-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="nolan-briefing-actions">
          <button className="nolan-btn-primary interactive" onClick={handleStartMission}>
            {article.id === 'web_dev' ? 'ENTER WEB STORE' : 'INITIATE DEPARTMENT MAINFRAME'}
          </button>
          <button className="nolan-btn-secondary interactive" onClick={handleClose}>
            RETURN TO OBSERVATORY
          </button>
        </div>
      </div>
    </div>
  )
}
