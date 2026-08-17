import { cinemaAudio } from './CinematicAudioEngine'

/* ==========================================================================
   BEX SIGMA TECH — EVENT-DRIVEN AI VOICE SYSTEM
   
   Implements:
   1. EventEmitter: Central pub-sub message bus.
   2. VoiceLibrary: Declarative mapping of events to TTS patterns, priority, & cooldowns.
   3. VoicePlayer: Handles Web Speech API synthesis, ducing, and radio clicks.
   4. AudioQueue: Prioritized queueing system ensuring high-priority playbacks.
   5. VoiceManager: Main coordinator registering listeners and dispatching requests.
   ========================================================================== */

// 1. EventEmitter
class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }

  off(event, listener) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(l => l !== listener)
  }

  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(listener => listener(data))
  }
}

export const voiceEmitter = new EventEmitter()

// 2. VoiceLibrary
export const VoiceLibrary = {
  LOADING_STARTED: { text: "Initializing Sigma Systems.", priority: 2, cooldown: 0 },
  LOADING_25: { text: "Core modules online.", priority: 1, cooldown: 0 },
  LOADING_50: { text: "AI systems operational.", priority: 1, cooldown: 0 },
  LOADING_75: { text: "Security verification complete.", priority: 1, cooldown: 0 },
  LOADING_COMPLETE: {
    text: "Initialization complete. All systems operational. Network matrix online.",
    priority: 2,
    cooldown: 0
  },
  ACCESS_GRANTED: {
    text: (data) => {
      const name = data && data.userName && data.userName.trim() ? data.userName : 'Operator'
      return `Access granted. Identity confirmed. Welcome back, ${name}. Clearance level Sigma authorized. Initializing observation corridor. Preparing orbital approach vector.`
    },
    priority: 3,
    cooldown: 0
  },
  WELCOME_SCREEN_VISIBLE: { text: "Welcome aboard BEX SIGMA TECH.", priority: 2, cooldown: 0 },
  AI_ROBOT_VISIBLE: { text: "I will assist you throughout your journey.", priority: 2, cooldown: 0 },
  NAME_INPUT_VISIBLE: { text: "Please identify yourself. Enter your commander callsign to proceed.", priority: 2, cooldown: 0 },
  NAME_SUBMITTED: {
    text: (data) => `Identity confirmed. Welcome ${data.userName || 'Operator'}.`,
    priority: 3,
    cooldown: 0
  },
  CAMERA_START: { text: "Preparing command station.", priority: 2, cooldown: 0 },
  DOOR_OPENING: { text: "Opening docking corridor.", priority: 2, cooldown: 0 },
  DOOR_OPENED: { text: "Docking corridor ready.", priority: 2, cooldown: 0 },
  CAMERA_ENTER_STATION: { text: "You are now entering Sigma Command Station.", priority: 3, cooldown: 0 },
  MISSION_CONTROL_VISIBLE: { text: "Mission Control online.", priority: 2, cooldown: 0 },
  SERVICE_HOVER: {
    text: (data) => {
      const names = {
        'mission_control': 'Mission Control.',
        'web_dev': 'Web Development Division.',
        'ai_auto': 'AI Automation Division.',
        'cloud': 'Cloud Systems Division.',
        'cyber': 'Cyber Security Division.',
        'analytics': 'Analytics Division.',
        'ui_ux': 'Design Division.',
        'marketing': 'Digital Marketing Division.',
        'finance': 'Finance Division.',
        'innovation': 'Innovation Lab.'
      }
      return names[data.sectorId] || ''
    },
    priority: 1,
    cooldown: 2000
  },
  SERVICE_CLICK: {
    text: (data) => {
      const entries = {
        'mission_control': 'Entering Mission Control. Central command for all operations and project coordination.',
        'web_dev': 'Entering Web Development Division. We build premium websites, web applications, and e-commerce platforms.',
        'ai_auto': 'Entering AI Automation Division. We deploy intelligent agents and workflow automation systems.',
        'cloud': 'Entering Cloud Systems Division. We provide cloud hosting, server management, and infrastructure solutions.',
        'cyber': 'Entering Cyber Security Division. We offer security audits, data protection, and threat monitoring.',
        'analytics': 'Entering Analytics Division. We deliver data analytics, business intelligence, and performance reporting.',
        'ui_ux': 'Entering Design Division. We craft user interfaces, brand identities, and product design systems.',
        'marketing': 'Entering Digital Marketing Division. We manage ad campaigns, social media, and content strategy.',
        'finance': 'Entering Finance Division. We provide billing systems, payment integration, and financial automation.',
        'innovation': 'Entering Innovation Lab. We research emerging technologies and prototype next-generation solutions.'
      }
      return entries[data.sectorId] || ''
    },
    priority: 3,
    cooldown: 0
  },
  MISSION_BRIEF_VISIBLE: { text: "Mission briefing ready.", priority: 2, cooldown: 0 },
  MISSION_STARTED: { text: "Mission initiated.", priority: 3, cooldown: 0 },
  PRICING_VISIBLE: { text: "Commercial solutions available.", priority: 2, cooldown: 0 },
  PAYMENT_PAGE_VISIBLE: { text: "Preparing secure transaction.", priority: 2, cooldown: 0 },
  PAYMENT_SUCCESS: { text: "Transaction completed successfully.", priority: 3, cooldown: 0 },
  DASHBOARD_VISIBLE: { text: "Operator dashboard online.", priority: 2, cooldown: 0 },
  LOGOUT: { text: "Session terminated. Goodbye.", priority: 3, cooldown: 0 }
}

// 3. VoicePlayer
class VoicePlayer {
  constructor() {
    this.synth = null
    this.isSupported = false
    this.preferredVoice = null
    this.voicesLoaded = false
    this._voiceLoadPromise = null
  }

  init() {
    if (typeof window === 'undefined') return
    this.synth = window.speechSynthesis
    this.isSupported = !!this.synth
    if (this.isSupported) {
      this._voiceLoadPromise = this._loadVoices()
    }
  }

  _loadVoices() {
    return new Promise((resolve) => {
      const tryLoad = () => {
        const voices = this.synth.getVoices()
        if (voices.length > 0) {
          this._selectBestVoice(voices)
          this.voicesLoaded = true
          resolve()
          return true
        }
        return false
      }

      if (!tryLoad()) {
        this.synth.addEventListener('voiceschanged', () => {
          tryLoad()
          resolve()
        }, { once: true })
        setTimeout(resolve, 2000)
      }
    })
  }

  _selectBestVoice(voices) {
    const preferred = [
      'Google UK English Male',
      'Microsoft David Desktop',
      'Microsoft Mark',
      'Alex',
      'Daniel',
      'Google US English',
      'en-US',
      'en-GB',
    ]

    for (const name of preferred) {
      const found = voices.find(v =>
        v.name.toLowerCase().includes(name.toLowerCase()) ||
        (v.lang && v.lang.toLowerCase().startsWith(name.toLowerCase()))
      )
      if (found) {
        this.preferredVoice = found
        return
      }
    }
    this.preferredVoice = voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0]
  }

  play(text, { pitch = 0.85, rate = 0.88, volume = 1.0, onStart, onEnd, onError } = {}) {
    if (!this.isSupported || !this.synth) {
      if (onEnd) onEnd()
      return
    }

    const execute = () => {
      try {
        // Cancel stuck utterances & resume browser speech engine
        this.synth.cancel()
        this.synth.resume()

        const voices = this.synth.getVoices()
        if (voices.length > 0 && !this.preferredVoice) {
          this._selectBestVoice(voices)
        }

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.pitch = pitch
        utterance.rate = rate
        utterance.volume = volume

        if (this.preferredVoice) {
          utterance.voice = this.preferredVoice
        }

        let hasFinished = false
        const finish = (cb) => {
          if (hasFinished) return
          hasFinished = true
          if (safetyTimer) clearTimeout(safetyTimer)
          if (cb) cb()
        }

        // Safety fallback timer for Chrome TTS bug (guarantees queue never hangs)
        const fallbackMs = Math.max(text.length * 80 + 1500, 2500)
        const safetyTimer = setTimeout(() => {
          console.warn('[VoicePlayer] Speech utterance timed out, resuming queue.')
          finish(onEnd)
        }, fallbackMs)

        utterance.onstart = () => {
          if (onStart) onStart()
        }
        utterance.onend = () => {
          finish(onEnd)
        }
        utterance.onerror = (e) => {
          finish(() => {
            if (onError) onError(e)
            else if (onEnd) onEnd()
          })
        }

        this.synth.speak(utterance)
      } catch (e) {
        console.warn('[VoicePlayer] Speech execution failed:', e)
        if (onEnd) onEnd()
      }
    }

    if (this.voicesLoaded) {
      execute()
    } else if (this._voiceLoadPromise) {
      this._voiceLoadPromise.then(execute)
    } else {
      execute()
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel()
      } catch (e) {}
    }
  }

  pause() {
    if (this.synth) {
      try {
        this.synth.pause()
      } catch (e) {}
    }
  }

  resume() {
    if (this.synth) {
      try {
        this.synth.resume()
      } catch (e) {}
    }
  }
}

// 4. AudioQueue
class AudioQueue {
  constructor(player) {
    this.player = player
    this.queue = []
    this.currentPlaying = null
    this.cooldowns = {}
  }

  add(eventKey, config, resolvedText) {
    const now = Date.now()

    // 1. Prevent duplicate playback (ignore if already playing)
    if (this.currentPlaying && this.currentPlaying.eventKey === eventKey) {
      return
    }

    // 2. Cooldown check
    if (this.cooldowns[eventKey] && now < this.cooldowns[eventKey]) {
      return
    }
    if (config.cooldown > 0) {
      this.cooldowns[eventKey] = now + config.cooldown
    }

    const queueItem = {
      eventKey,
      config,
      text: resolvedText,
      priority: config.priority || 1,
      timestamp: now
    }

    // 3. Check Priority for Preemption / Interrupt
    // If priority >= 3 (e.g. ACCESS_GRANTED, SERVICE_CLICK, MISSION_STARTED, PAYMENT_SUCCESS)
    // Interrupt whatever is playing and run immediately.
    if (queueItem.priority >= 3) {
      this.interruptAndPlay(queueItem)
      return
    }

    // 4. Normal Priority Queueing
    // Remove items of lower priority from queue
    this.queue = this.queue.filter(item => item.priority >= queueItem.priority)
    this.queue.push(queueItem)
    // Sort queue: Priority desc, timestamp asc
    this.queue.sort((a, b) => b.priority - a.priority || a.timestamp - b.timestamp)

    this.process()
  }

  process() {
    if (this.currentPlaying || this.queue.length === 0) return

    const nextItem = this.queue.shift()
    this.playItem(nextItem)
  }

  playItem(item) {
    this.currentPlaying = item
    
    // Save current gain node value to duck music
    const preDuckVol = cinemaAudio.masterGain ? cinemaAudio.masterGain.gain.value : 0.3

    this.player.play(item.text, {
      onStart: () => {
        cinemaAudio.setAmbientVolume(0.12, 0.4)
        cinemaAudio.playRadioSquelchIn()
        cinemaAudio.startRadioTransmissionHum()
      },
      onEnd: () => {
        cinemaAudio.stopRadioTransmissionHum()
        cinemaAudio.playRadioSquelchOut()
        cinemaAudio.setAmbientVolume(preDuckVol, 0.8)
        this.currentPlaying = null
        this.process()
      },
      onError: () => {
        cinemaAudio.stopRadioTransmissionHum()
        cinemaAudio.playRadioSquelchOut()
        cinemaAudio.setAmbientVolume(preDuckVol, 0.8)
        this.currentPlaying = null
        this.process()
      }
    })
  }

  interruptAndPlay(item) {
    // Stop current speech
    this.player.stop()
    cinemaAudio.stopRadioTransmissionHum()
    
    // Clear queue of any lower-priority items
    this.queue = this.queue.filter(q => q.priority >= item.priority)
    
    this.currentPlaying = null
    this.playItem(item)
  }

  clear() {
    this.queue = []
    this.player.stop()
    cinemaAudio.stopRadioTransmissionHum()
    this.currentPlaying = null
  }
}

// 5. VoiceManager
class VoiceManager {
  constructor() {
    this.player = new VoicePlayer()
    this.queue = new AudioQueue(this.player)
  }

  init() {
    this.player.init()
    this.setupListeners()
  }

  unlock() {
    if (typeof window === 'undefined') return
    if (this.player && this.player.synth) {
      try {
        this.player.synth.cancel()
        this.player.synth.resume()
        const u = new SpeechSynthesisUtterance('')
        u.volume = 0
        this.player.synth.speak(u)
      } catch (e) {}
    }
  }

  setupListeners() {
    // Listen to every event defined in VoiceLibrary
    Object.keys(VoiceLibrary).forEach(eventKey => {
      voiceEmitter.on(eventKey, (data) => {
        const config = VoiceLibrary[eventKey]
        if (!config) return

        let resolvedText = ""
        if (typeof config.text === 'function') {
          resolvedText = config.text(data)
        } else {
          resolvedText = config.text
        }

        if (resolvedText) {
          this.queue.add(eventKey, config, resolvedText)
        }
      })
    })
  }

  stop() {
    this.queue.clear()
  }

  pause() {
    this.player.pause()
  }

  resume() {
    this.player.resume()
  }

  speakCustomText(text) {
    if (!text) return
    this.queue.add('CUSTOM_SPEECH', { priority: 3, cooldown: 0 }, text)
  }

  startSpeechRecognition(onResult, onError, onEnd) {
    if (typeof window === 'undefined') return null
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser.')
      return null
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (onResult) onResult(transcript)
      }

      recognition.onerror = (err) => {
        if (onError) onError(err.error || 'Speech input failed.')
      }

      if (onEnd) recognition.onend = onEnd

      recognition.start()
      return recognition
    } catch (e) {
      if (onError) onError(e.message)
      return null
    }
  }
}

export const aiVoice = new VoiceManager()
if (typeof window !== 'undefined') {
  aiVoice.init()
}
