import React from 'react'
import { useStore } from './store/useStore'
import BootScreen from './components/boot/BootScreen'
import AccessGranted from './components/boot/AccessGranted'
import WelcomeScreen from './components/boot/WelcomeScreen'
import AICore from './components/ai/AICore'
import HQScene from './components/headquarters/HQScene'
import MissionBriefing from './components/mission/MissionBriefing'
import Dashboard from './components/dashboard/Dashboard'
import WebDevStore from './components/webdev/WebDevStore'
import './styles/app.css'

export default function App() {
  const { scene, skipIntro, audioContextUnlocked } = useStore()

  // Show skip button during cinematic intro scenes (not on the initial boot start button)
  const isIntroScene = ['boot', 'access_granted', 'welcome'].includes(scene)
    || (scene === 'ai_core')
  const showSkip = isIntroScene && audioContextUnlocked

  return (
    <div className="app-container">
      {/* Scene 1: Boot Decrypt loader */}
      {scene === 'boot' && <BootScreen />}

      {/* Scene 2: Access Granted banner */}
      {scene === 'access_granted' && <AccessGranted />}

      {/* Scene 3: Welcome screen */}
      {scene === 'welcome' && <WelcomeScreen />}

      {/* Scene 4 & 5: Holographic AI Core console interface */}
      {(scene === 'ai_core' || scene === 'ai_response') && <AICore />}

      {/* Scene 6, 7 & 8: HQ Jarvis orbs, briefings and analytics dashboard */}
      {(scene === 'headquarters' || scene === 'mission_briefing' || scene === 'dashboard') && (
        <>
          <HQScene />
          {scene === 'mission_briefing' && <MissionBriefing />}
          {scene === 'dashboard' && <Dashboard />}
        </>
      )}

      {/* Scene 9: Web Development Products Store with Cashfree */}
      {scene === 'webdev_store' && <WebDevStore />}

      {/* ── Skip Intro Button ── */}
      {showSkip && (
        <button
          className="skip-intro-btn interactive"
          onClick={skipIntro}
          title="Skip to credential input"
        >
          SKIP ▸▸
        </button>
      )}
    </div>
  )
}
