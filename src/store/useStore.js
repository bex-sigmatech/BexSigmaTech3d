import { create } from 'zustand'
import { cinemaAudio } from '../audio/CinematicAudioEngine'
import { aiVoice, voiceEmitter } from '../audio/AIVoiceEngine'

const isMobileDevice = typeof window !== 'undefined' && (
  window.innerWidth <= 768 ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
)

const savedGraphics = typeof window !== 'undefined' ? localStorage.getItem('bex_graphics_quality') : null

export const useStore = create((set, get) => {
  return {
    scene: 'boot', // 'boot' | 'access_granted' | 'welcome' | 'ai_core' | 'ai_response' | 'headquarters' | 'mission_briefing' | 'dashboard' | 'webdev_store'
    loadingProgress: 0,
    userName: '',
    activeMission: null,
    scrollPosition: 0,
    audioContextUnlocked: false,
    graphicsQuality: savedGraphics || 'high', // High graphics preset as default preference
    isIntroSkipped: false,
    bootStarted: false, // true once user clicks ENTER CINEMATIC EXPERIENCE

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

    submitIdentity: (name) => {
      cinemaAudio.playAccessGrantedChime()
      cinemaAudio.setAmbientVolume(0.7, 0.8)
      cinemaAudio.setScene('ai_response')
      set({ userName: name, scene: 'ai_response' })

      const delay = isMobileDevice ? 2200 : 5000 // Faster responsive transition on mobile
      setTimeout(() => {
        cinemaAudio.setAmbientVolume(0.3, 2.5)
        cinemaAudio.setScene('headquarters')
        set({ scene: 'headquarters' })
      }, delay)
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

    skipIntro: () => {
      const { isIntroSkipped } = get()
      if (isIntroSkipped) return // guard against double-fire

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

    resetSession: () => {
      voiceEmitter.emit('LOGOUT')
      cinemaAudio.stopAll()
      set({
        scene: 'boot',
        loadingProgress: 0,
        userName: '',
        activeMission: null,
        scrollPosition: 0,
        isIntroSkipped: false
      })
    }
  }
})
