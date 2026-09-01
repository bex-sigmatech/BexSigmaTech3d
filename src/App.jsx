import React, { Suspense, lazy } from 'react'
import { useStore } from './store/useStore'
import BootScreen from './components/boot/BootScreen'
import AccessGranted from './components/boot/AccessGranted'
import WelcomeScreen from './components/boot/WelcomeScreen'
import LiveVoiceHUD from './components/ai/LiveVoiceHUD'
import './styles/app.css'
import './styles/lagfree.css'

// LAGFREE: heavy 3D + AI scenes lazy-split — initial boot bundle ~200KB vs 1.1MB
const AICore = lazy(() => import('./components/ai/AICore'))
const HQScene = lazy(() => import('./components/headquarters/HQScene'))
const MissionControl = lazy(() => import('./components/mission/MissionControl'))
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))

const WebDevStore = lazy(() => import('./components/webdev/WebDevStore'))
const AppsStore = lazy(() => import('./components/apps/AppsStore'))
const ClientProjectsShowcase = lazy(() => import('./components/clients/ClientProjectsShowcase'))

export default function App() {
  const { scene, skipIntro, bootStarted, isIntroSkipped, navigateToSector, submitIdentity, userName } = useStore()

  // Expose dynamic context for Gemini Live voice (10/10 per-scene instruction)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__BEX_SCENE__ = scene
      window.__BEX_USER__ = userName || ''
      try { localStorage.setItem('bex_userName', userName || ''); localStorage.setItem('bex_scene', scene) } catch { }
    }
  }, [scene, userName])

  // Show skip button once boot has started (user clicked ENTER), through all intro scenes
  const isIntroScene = ['boot', 'access_granted', 'welcome', 'ai_core'].includes(scene)
  const showSkip = isIntroScene && bootStarted && !isIntroSkipped

  return (
    <div className="app-container">
      {/* ── Real-Time Gemini 2.0 Live Voice HUD — hidden on mobile credential to avoid covering SYNC (user report) ── */}
      {bootStarted && !(typeof window !== 'undefined' && window.innerWidth <= 768 && (scene === 'ai_core' || scene === 'ai_response')) && (
        <LiveVoiceHUD
          onNavigateSector={(sector) => navigateToSector(sector)}
          onTriggerScan={(callsign) => submitIdentity(callsign || 'COMMANDER')}
        />
      )}
      {/* Scene 1: Boot Decrypt loader */}
      {scene === 'boot' && <BootScreen />}

      {/* Scene 2: Access Granted banner */}
      {scene === 'access_granted' && <AccessGranted />}

      {/* Scene 3: Welcome screen */}
      {scene === 'welcome' && <WelcomeScreen />}

      {/* Scene 4 & 5: Holographic AI Core — lazy */}
      {(scene === 'ai_core' || scene === 'ai_response') && (
        <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#000', color:'#00d4ff', fontFamily:'Orbitron', letterSpacing:'0.2em' }}>SYNCING NEURAL CORE...</div>}>
          <AICore />
        </Suspense>
      )}

      {/* Scene 6,7,8: HQ Jarvis orbs, briefings and analytics — lazy */}
      {(scene === 'headquarters' || scene === 'mission_briefing' || scene === 'dashboard') && (
        <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#020812', color:'#00d4ff', fontFamily:'Orbitron' }}>LOADING ORBITAL SYSTEMS...</div>}>
          <HQScene />
          {scene === 'mission_briefing' && <MissionControl />}
          {scene === 'dashboard' && <Dashboard />}
        </Suspense>
      )}

      {/* Scene 9: Web Development Products Store with Cashfree — lazy for 10/10 perf */}
      {scene === 'webdev_store' && (
        <Suspense fallback={<div style={{ color: '#8899a6', fontFamily: 'Orbitron', letterSpacing: '0.2em', fontSize: '0.8rem' }}>LOADING SECURE MATRIX...</div>}>
          <WebDevStore />
        </Suspense>
      )}

      {/* Scene 10: Apps Products Matrix (Future Path & UrDay + Custom App Build) */}
      {scene === 'apps_store' && (
        <Suspense fallback={<div style={{ color: '#00d4ff', fontFamily: 'Orbitron', letterSpacing: '0.2em', fontSize: '0.8rem' }}>INITIALIZING APPS MATRIX...</div>}>
          <AppsStore />
        </Suspense>
      )}

      {/* Scene 11: Our Client Projects Showcase (FinexHub & Enterprise Partnerships) */}
      {scene === 'client_projects_showcase' && (
        <Suspense fallback={<div style={{ color: '#f59e0b', fontFamily: 'Orbitron', letterSpacing: '0.2em', fontSize: '0.8rem' }}>LAUNCHING CLIENT SHOWCASE...</div>}>
          <ClientProjectsShowcase />
        </Suspense>
      )}

      {/* ── Skip Intro Button ── */}
      {showSkip && (
        <button
          className="skip-intro-btn interactive"
          onClick={(e) => {
            e.stopPropagation()
            skipIntro()
          }}
          title="Skip to credential input"
          aria-label="Skip intro to credential input"
        >
          SKIP ▸▸
        </button>
      )}
    </div>
  )
}
