import { create } from 'zustand'
import { cinemaAudio } from '../audio/CinematicAudioEngine'
import { aiVoice, voiceEmitter } from '../audio/AIVoiceEngine'
import { liveVoiceClient } from '../audio/GeminiLiveClient'

const isMobileDevice = typeof window !== 'undefined' && (
  window.innerWidth <= 768 ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
)

const savedGraphics = typeof window !== 'undefined' ? localStorage.getItem('bex_graphics_quality') : null

function getInitialRouteState() {
  if (typeof window === 'undefined') return { scene: 'boot', bootStarted: false, isIntroSkipped: false, activeMission: null }
  const path = window.location.pathname
  if (path === '/store' || path === '/products') {
    return { scene: 'webdev_store', bootStarted: true, isIntroSkipped: true, activeMission: { id: 'web_dev', name: 'Our Products Store' } }
  }
  if (path === '/apps') {
    return { scene: 'apps_store', bootStarted: true, isIntroSkipped: true, activeMission: { id: 'cloud', name: 'Apps Division' } }
  }
  if (path === '/clients' || path === '/projects' || path === '/portfolio') {
    return { scene: 'client_projects_showcase', bootStarted: true, isIntroSkipped: true, activeMission: { id: 'client_projects', name: 'Our Client Projects' } }
  }
  if (path === '/dashboard') {
    return { scene: 'dashboard', bootStarted: true, isIntroSkipped: true, activeMission: null }
  }
  if (path === '/mission') {
    return { scene: 'mission_briefing', bootStarted: true, isIntroSkipped: true, activeMission: { id: 'mission_control', title: 'Mission Control', name: 'Mission Control Hub' } }
  }
  return { scene: 'boot', bootStarted: false, isIntroSkipped: false, activeMission: null }
}

const initialRoute = getInitialRouteState()

export const useStore = create((set, get) => {
  return {
    scene: initialRoute.scene, // 'boot' | 'access_granted' | 'welcome' | 'ai_core' | 'ai_response' | 'headquarters' | 'mission_briefing' | 'dashboard' | 'webdev_store'
    loadingProgress: initialRoute.bootStarted ? 100 : 0,
    userName: typeof window !== 'undefined' ? (localStorage.getItem('bex_userName') || '') : '',
    activeMission: initialRoute.activeMission,
    scrollPosition: 0,
    audioContextUnlocked: false,
    graphicsQuality: savedGraphics || 'high', // High graphics preset as default preference
    isIntroSkipped: initialRoute.isIntroSkipped,
    bootStarted: initialRoute.bootStarted, // true once user clicks ENTER or lands directly on deep link

    setGraphicsQuality: (quality) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bex_graphics_quality', quality)
      }
      set({ graphicsQuality: quality })
    },

    unlockAudioContext: () => {
      cinemaAudio.unlock()
      aiVoice.unlock()
      cinemaAudio.playBootBeep()
      cinemaAudio.startCinematicScore()
      cinemaAudio.setScene('boot')
      set({ audioContextUnlocked: true })
    },

    setLoadingProgress: (val) => set({ loadingProgress: val }),
    setUserName: (name) => set({ userName: name }),
    setActiveMission: (mission) => set({ activeMission: mission }),
    setScrollPosition: (pos) => set({ scrollPosition: pos }),

    // Transition Functions
    startLoading: () => {
      cinemaAudio.unlock()
      cinemaAudio.startCinematicScore()
      cinemaAudio.setAmbientVolume(0.35, 3)
      cinemaAudio.setScene('boot')
      set({ scene: 'boot' })
    },

    triggerAccessGranted: () => {
      cinemaAudio.playAccessGrantedChime()
      cinemaAudio.setAmbientVolume(0.55, 1)
      cinemaAudio.setScene('access_granted')
      set({ scene: 'access_granted' })
    },

    triggerWelcome: () => {
      cinemaAudio.setAmbientVolume(0.5, 2)
      cinemaAudio.setScene('welcome')
      set({ scene: 'welcome' })
    },

    triggerAICore: () => {
      cinemaAudio.setAmbientVolume(0.65, 2)
      cinemaAudio.setScene('ai_core')
      set({ scene: 'ai_core' })
    },

    _identityTimer: null,
    submitIdentity: (name) => {
      // LAGFREE: clear previous timer to prevent stale race on double submit/skip
      if (get()._identityTimer) { clearTimeout(get()._identityTimer) }
      cinemaAudio.playAccessGrantedChime()
      cinemaAudio.setAmbientVolume(0.7, 0.8)
      cinemaAudio.setScene('ai_response')
      set({ userName: name, scene: 'ai_response' })

      const delay = isMobileDevice ? 3800 : 5000
      const t = setTimeout(() => {
        // guard: only transition if still in ai_response (not skipped/reset)
        if (get().scene !== 'ai_response') return
        cinemaAudio.setAmbientVolume(0.3, 2.5)
        cinemaAudio.setScene('headquarters')
        set({ scene: 'headquarters' })
      }, delay)
      set({ _identityTimer: t })
    },

    openMissionBriefing: (mission) => {
      cinemaAudio.playBootBeep()
      cinemaAudio.setAmbientVolume(0.4, 1)
      cinemaAudio.setScene('mission_briefing')
      set({ activeMission: mission, scene: 'mission_briefing' })
    },

    closeMissionBriefing: () => {
      cinemaAudio.playSectorTransition()
      cinemaAudio.setAmbientVolume(0.3, 1.5)
      cinemaAudio.setScene('headquarters')
      set({ activeMission: null, scene: 'headquarters' })
    },

    startMission: () => {
      cinemaAudio.playSectorTransition()
      cinemaAudio.setAmbientVolume(0.25, 1.5)
      const { activeMission } = get()
      if (activeMission && activeMission.id === 'web_dev') {
        cinemaAudio.setScene('webdev_store')
        set({ scene: 'webdev_store' })
      } else if (activeMission && (activeMission.id === 'cloud' || activeMission.id === 'apps')) {
        cinemaAudio.setScene('headquarters')
        set({ scene: 'apps_store' })
      } else if (activeMission && activeMission.id === 'client_projects') {
        cinemaAudio.setScene('headquarters')
        set({ scene: 'client_projects_showcase' })
      } else {
        cinemaAudio.setScene('dashboard')
        set({ scene: 'dashboard' })
      }
    },

    exitDashboard: () => {
      cinemaAudio.playSectorTransition()
      cinemaAudio.setAmbientVolume(0.3, 1.5)
      cinemaAudio.setScene('headquarters')
      set({ scene: 'headquarters', activeMission: null })
    },

    exitWebDevStore: () => {
      cinemaAudio.playSectorTransition()
      cinemaAudio.setAmbientVolume(0.3, 1.5)
      cinemaAudio.setScene('headquarters')
      set({ scene: 'headquarters', activeMission: null })
    },

    exitAppsStore: () => {
      cinemaAudio.playSectorTransition()
      cinemaAudio.setAmbientVolume(0.3, 1.5)
      cinemaAudio.setScene('headquarters')
      set({ scene: 'headquarters', activeMission: null })
    },

    exitClientProjects: () => {
      cinemaAudio.playSectorTransition()
      cinemaAudio.setAmbientVolume(0.3, 1.5)
      cinemaAudio.setScene('headquarters')
      set({ scene: 'headquarters', activeMission: null })
    },

    skipIntro: () => {
      const { isIntroSkipped, _identityTimer } = get()
      if (isIntroSkipped) return
      if (_identityTimer) { clearTimeout(_identityTimer); set({ _identityTimer: null }) }

      // Stop any in-progress voice/audio
      aiVoice.stop()

      // Ensure audio is unlocked (works because this is triggered by a user click/tap gesture)
      try {
        cinemaAudio.unlock()
        aiVoice.unlock()
        cinemaAudio.startCinematicScore()
        cinemaAudio.setAmbientVolume(0.65, 0.5)
        cinemaAudio.setScene('ai_core')
      } catch (e) {
        // Audio unlock may fail on some browsers — proceed anyway
        console.warn('Audio unlock during skip:', e)
      }

      set({
        scene: 'ai_core',
        loadingProgress: 100,
        audioContextUnlocked: true,
        isIntroSkipped: true,
        bootStarted: true
      })
    },

    navigateToSector: (sectorId) => {
      cinemaAudio.playSectorTransition()
      if (sectorId === 'web_dev' || sectorId === 'store' || sectorId === 'products') {
        cinemaAudio.setScene('webdev_store')
        set({ scene: 'webdev_store', activeMission: { id: 'web_dev', name: 'Our Products Store' } })
      } else if (sectorId === 'cloud' || sectorId === 'apps' || sectorId === 'apps_store') {
        cinemaAudio.setScene('headquarters')
        set({ scene: 'apps_store', activeMission: { id: 'cloud', name: 'Apps Division' } })
      } else if (sectorId === 'client_projects' || sectorId === 'clients') {
        cinemaAudio.setScene('headquarters')
        set({ scene: 'client_projects_showcase', activeMission: { id: 'client_projects', name: 'Our Client Projects' } })
      } else if (sectorId === 'dashboard' || sectorId === 'analytics' || sectorId === 'finance') {
        cinemaAudio.setScene('dashboard')
        set({ scene: 'dashboard' })
      } else if (sectorId === 'ai_core') {
        cinemaAudio.setScene('ai_core')
        set({ scene: 'ai_core' })
      } else if (sectorId === 'mission_control' || sectorId === 'mission') {
        cinemaAudio.setScene('mission_briefing')
        set({ scene: 'mission_briefing', activeMission: { id: 'mission_control', title: 'Mission Control', name: 'Mission Control Hub' } })
      } else {
        cinemaAudio.setScene('headquarters')
        set({ scene: 'headquarters' })
      }
    },

    resetSession: () => {
      const t = get()._identityTimer
      if (t) clearTimeout(t)
      voiceEmitter.emit('LOGOUT')
      cinemaAudio.stopAll()
      liveVoiceClient.disconnect()
      set({
        scene: 'boot',
        loadingProgress: 0,
        userName: '',
        activeMission: null,
        scrollPosition: 0,
        isIntroSkipped: false,
        _identityTimer: null
      })
    }
  }
})
