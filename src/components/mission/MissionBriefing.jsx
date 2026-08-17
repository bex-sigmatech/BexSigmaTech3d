import React, { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { voiceEmitter } from '../../audio/AIVoiceEngine'

export default function MissionBriefing() {
  const { activeMission, closeMissionBriefing, startMission } = useStore()

  // "Mission briefing ready."
  useEffect(() => {
    if (activeMission) {
      voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    }
  }, [activeMission])

  if (!activeMission) return null

  const handleStartMission = () => {
    voiceEmitter.emit('MISSION_STARTED')
    startMission()
  }

  const handleClose = () => {
    closeMissionBriefing()
  }

  return (
    <div className="nolan-briefing-modal-overlay">
      <div className="nolan-briefing-box interactive">
        <div className="nolan-briefing-header">
          <span className="nolan-briefing-code">ORBITAL ACCESS CODE: {activeMission.id.toUpperCase()}</span>
          <span className="nolan-status-dot" />
        </div>

        <h1 className="nolan-briefing-title">{activeMission.title}</h1>
        {activeMission.subtitle && (
          <h3 className="nolan-briefing-subtitle">{activeMission.subtitle}</h3>
        )}

        <div className="nolan-briefing-section">
          <label className="nolan-briefing-label">MISSION OBJECTIVE & SYNTHESIS</label>
          <p className="nolan-briefing-desc">
            {activeMission.objective || activeMission.desc}
          </p>
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
          <button className="nolan-btn-primary interactive" onClick={handleStartMission}>
            INITIATE DEPARTMENT MAINFRAME
          </button>
          <button className="nolan-btn-secondary interactive" onClick={handleClose}>
            RETURN TO OBSERVATORY WALK
          </button>
        </div>
      </div>
    </div>
  )
}
