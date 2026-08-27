/* ==========================================================================
   BEX SIGMA TECH — SCI-FI BINARY CODE INTERFACE AUDIO ENGINE
   Web Audio API Synthesizer generating immersive sci-fi computer beeps,
   binary data processing sounds, and telemetry ambience.
   Inspired by: Binary Code - Interface Sound Effects
   
   SCENE-AWARE LAYERS:
   Layer 1: Deep sub-bass drone (always on, very subtle)
   Layer 2: Binary data stream — rhythmic beeps & ticks (scene-controlled)
   Layer 3: Atmospheric pad (quiet background texture)
   Layer 4: One-shot SFX (UI clicks, chimes, transitions)
   ========================================================================== */

class CinematicAudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.ambientNodes = []
    this.isPlayingScore = false
    this._binaryLoopTimer = null
    this._binaryIntensity = 'low'   // 'off' | 'low' | 'medium' | 'high'
    this._currentScene = 'boot'
    // ── Heat / battery optimization ──
    this._isMuted = typeof window !== 'undefined' ? localStorage.getItem('bex_audio_muted') === 'true' : false
    this._isSuspendedByVisibility = false
    this._visibilityHandlerAttached = false
    // lighter on mobile / low-power
    this._isLowPower = typeof window !== 'undefined' && (
      window.innerWidth <= 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    )
  }

  _attachVisibilityHandler() {
    if (this._visibilityHandlerAttached || typeof document === 'undefined') return
    this._visibilityHandlerAttached = true
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return
      if (document.hidden) {
        if (this.ctx.state === 'running') {
          this.ctx.suspend().then(() => { this._isSuspendedByVisibility = true }).catch(() => {})
        }
      } else if (this._isSuspendedByVisibility && this.isPlayingScore && !this._isMuted) {
        this.ctx.resume().catch(() => {})
        this._isSuspendedByVisibility = false
      }
    })
    // also suspend when page is backgrounded via pagehide
    window.addEventListener('pagehide', () => {
      try { this.suspend() } catch {}
    })
  }

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    this.ctx = new AudioCtx()

    this.masterGain = this.ctx.createGain()
    // lower default on low-power to reduce amp heat
    const defaultGain = this._isMuted ? 0 : (this._isLowPower ? 0.22 : 0.32)
    this.masterGain.gain.setValueAtTime(defaultGain, this.ctx.currentTime)
    this.masterGain.connect(this.ctx.destination)
    this._attachVisibilityHandler()
  }

  unlock() {
    if (this._isMuted) return
    this.init()
    if (this.ctx && this.ctx.state === 'suspended' && !document.hidden) {
      this.ctx.resume()
    }
  }

  // Public: toggle mute (persists)
  setMuted(muted) {
    this._isMuted = !!muted
    try { localStorage.setItem('bex_audio_muted', String(this._isMuted)) } catch {}
    if (this._isMuted) {
      this.suspend()
    } else {
      this.init()
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
      if (this.isPlayingScore) this.setAmbientVolume(this._isLowPower ? 0.22 : 0.3, 0.6)
    }
    return this._isMuted
  }

  toggleMute() { return this.setMuted(!this._isMuted) }
  get isMuted() { return this._isMuted }

  suspend() {
    this._stopBinaryDataStream()
    if (this.ctx && this.ctx.state === 'running') {
      try { this.ctx.suspend() } catch {}
    }
  }

  /* ═══════════════════════════════════════════════════════════
     LAYER 1: Deep Sub-Bass Drone — always-on foundation
     On low-power (mobile) skip this layer — biggest heat saver
     ═══════════════════════════════════════════════════════════ */
  _startSubBass() {
    if (this._isLowPower) return // skip heavy sub-bass on mobile to reduce heat/CPU
    const now = this.ctx.currentTime

    // Very low frequency sine wave (C2 = 65.4Hz)
    const osc = this.ctx.createOscillator()
    const filter = this.ctx.createBiquadFilter()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(55, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(80, now)

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.10, now + 5) // lowered from 0.18

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    this.ambientNodes.push({ osc, gain })
  }

  /* ═══════════════════════════════════════════════════════════
     LAYER 2: Binary Data Stream — sci-fi beeps, ticks, chirps
     Intensity changes per scene for contextual audio.
     ═══════════════════════════════════════════════════════════ */

  _getBinaryConfig() {
    // Returns timing and density config per intensity level
    // Low-power doubles interval + halves volume to cut CPU/amp heat
    const lp = this._isLowPower
    switch (this._binaryIntensity) {
      case 'off':
        return null
      case 'low':
        return { interval: lp ? 3800 : 2200, burstMin: 1, burstMax: lp ? 1 : 2, volume: lp ? 0.003 : 0.006 }
      case 'medium':
        return { interval: lp ? 2400 : 1200, burstMin: 1, burstMax: lp ? 2 : 4, volume: lp ? 0.005 : 0.010 }
      case 'high':
        return { interval: lp ? 1400 : 600, burstMin: 2, burstMax: lp ? 3 : 6, volume: lp ? 0.007 : 0.015 }
      default:
        return { interval: lp ? 3800 : 2200, burstMin: 1, burstMax: 1, volume: lp ? 0.003 : 0.006 }
    }
  }

  _startBinaryDataStream() {
    this._stopBinaryDataStream()
    if (this._isMuted) return

    const loop = () => {
      const config = this._getBinaryConfig()
      if (!config || !this.isPlayingScore || !this.ctx) return
      if (this._isMuted || document.hidden || this.ctx.state !== 'running') {
        // reschedule without playing while hidden/muted
        const retryDelay = 1200
        this._binaryLoopTimer = setTimeout(loop, retryDelay)
        return
      }

      // Random burst of binary ticks
      const count = config.burstMin + Math.floor(Math.random() * (config.burstMax - config.burstMin + 1))
      for (let i = 0; i < count; i++) {
        setTimeout(() => this._playDataTick(config.volume), i * (40 + Math.random() * 60))
      }

      // Occasional data chirp (ascending beep)
      if (Math.random() > 0.65) {
        setTimeout(() => this._playDataChirp(config.volume * 1.5), count * 80 + Math.random() * 200)
      }

      // Occasional low modem-like tone
      if (Math.random() > 0.82) {
        setTimeout(() => this._playModemTone(config.volume * 0.8), Math.random() * 400)
      }

      // Schedule next burst
      const jitter = config.interval * 0.3
      const nextDelay = config.interval + (Math.random() * jitter * 2 - jitter)
      this._binaryLoopTimer = setTimeout(loop, nextDelay)
    }

    this._binaryLoopTimer = setTimeout(loop, 800)
  }

  _stopBinaryDataStream() {
    if (this._binaryLoopTimer) {
      clearTimeout(this._binaryLoopTimer)
      this._binaryLoopTimer = null
    }
  }

  // Short high-frequency tick (the core "binary" sound)
  _playDataTick(vol = 0.008) {
    if (!this.ctx || this._isMuted || document.hidden || this.ctx.state !== 'running') return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const filter = this.ctx.createBiquadFilter()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    const baseFreq = 2400 + Math.random() * 2000
    osc.frequency.setValueAtTime(baseFreq, now)

    filter.type = 'highpass'
    filter.frequency.setValueAtTime(3500, now)

    gain.gain.setValueAtTime(vol, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    osc.stop(now + 0.025)
  }

  // Ascending frequency chirp (data processing sound)
  _playDataChirp(vol = 0.012) {
    if (!this.ctx || this._isMuted || document.hidden || this.ctx.state !== 'running') return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    const startFreq = 800 + Math.random() * 600
    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(startFreq * (1.8 + Math.random()), now + 0.06)

    gain.gain.setValueAtTime(vol, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    osc.stop(now + 0.1)
  }

  // Low modem-like processing tone
  _playModemTone(vol = 0.006) {
    if (!this.ctx || this._isMuted || document.hidden || this.ctx.state !== 'running') return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const filter = this.ctx.createBiquadFilter()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(180 + Math.random() * 120, now)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(400, now)
    filter.Q.setValueAtTime(6, now)

    gain.gain.setValueAtTime(vol, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    osc.stop(now + 0.18)
  }

  /* ═══════════════════════════════════════════════════════════
     LAYER 3: Atmospheric Pad — thin dark texture
     Low-power: use single osc, no LFO modulation (LFOs keep Audio thread awake)
     ═══════════════════════════════════════════════════════════ */
  _startAtmosphericPad() {
    const now = this.ctx.currentTime

    if (this._isLowPower) {
      // Lightweight single pad, no LFO
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(110, now)
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(180, now)
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.018, now + 6)
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)
      osc.start()
      this.ambientNodes.push({ osc, gain })
      return
    }

    // Desktop: thin filtered pad using 2 detuned triangle oscillators
    const freqs = [110, 165] // A2, E3 — dark fifth
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)
      osc.detune.setValueAtTime(idx * 3, now)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, now)

      // Slow breathing LFO
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.value = 0.08 + idx * 0.04
      lfoGain.gain.value = 60
      lfo.connect(lfoGain)
      lfoGain.connect(filter.frequency)
      lfo.start()
      this.ambientNodes.push({ osc: lfo })

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.035, now + 6 + idx * 2)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)
      osc.start()
      this.ambientNodes.push({ osc, gain })
    })
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN CONTROL: Start / Stop / Scene Changes
     ═══════════════════════════════════════════════════════════ */

  startCinematicScore() {
    if (this._isMuted) return
    this.unlock()
    if (!this.ctx || this.isPlayingScore) return
    if (document.hidden) return // don't start while tab hidden — saves heat
    this.isPlayingScore = true

    this._startSubBass()
    this._startAtmosphericPad()
    this._startBinaryDataStream()
  }

  // Change binary data intensity based on what's happening on screen
  setScene(sceneName) {
    this._currentScene = sceneName

    const sceneIntensity = {
      'boot':             'medium',   // Loading — active data processing
      'access_granted':   'high',     // Identity confirmed — burst of activity
      'welcome':          'low',      // Earth orbit — calm observation
      'ai_core':          'high',     // Docking + HUD — heavy data
      'ai_response':      'high',     // Identity confirmed — peak
      'headquarters':     'low',      // Observatory — ambient hum
      'mission_briefing': 'medium',   // Briefing — moderate activity
      'dashboard':        'medium',   // Terminal — data processing
      'webdev_store':     'low',      // Store — minimal
    }

    this._binaryIntensity = sceneIntensity[sceneName] || 'low'

    // Restart the binary loop with new intensity
    if (this.isPlayingScore) {
      this._startBinaryDataStream()
    }
  }

  setAmbientVolume(level, duration = 1.5) {
    if (this._isMuted) level = 0
    // cap volume on low-power to reduce amp heat
    if (this._isLowPower && level > 0.35) level = 0.35
    this.unlock()
    if (!this.ctx || !this.masterGain) return
    if (this.ctx.state === 'suspended') return
    const now = this.ctx.currentTime
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
    this.masterGain.gain.linearRampToValueAtTime(level, now + duration)
  }

  stopAll() {
    const now = this.ctx ? this.ctx.currentTime : 0
    this._stopBinaryDataStream()
    this.ambientNodes.forEach(item => {
      try {
        if (item.gain) {
          item.gain.gain.linearRampToValueAtTime(0, now + 0.6)
          setTimeout(() => { try { item.osc.stop() } catch {} }, 700)
        } else {
          try { item.osc.stop() } catch {}
        }
      } catch (e) {}
    })
    this.ambientNodes = []
    this.isPlayingScore = false
    // suspend context to release hardware / stop CPU wakeups (main heat fix)
    if (this.ctx && this.ctx.state === 'running') {
      try { this.ctx.suspend() } catch {}
    }
  }

  /* ═══════════════════════════════════════════════════════════
     LAYER 4: One-Shot UI Sound Effects
     ═══════════════════════════════════════════════════════════ */

  // Rapid mechanical/digital binary code click (used for loading milestones)
  playBinaryTick() {
    this.unlock()
    if (!this.ctx) return
    this._playDataTick(0.012)
  }

  // Hovering over items or floating orbs
  playOrbHover() {
    this.unlock()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(950, now)
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08)

    gain.gain.setValueAtTime(0.025, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)

    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    osc.stop(now + 0.12)
  }

  // Clicking/Selecting a holographic orb
  playOrbSelect() {
    this.unlock()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // Digital chirping sweeping up
    const osc1 = this.ctx.createOscillator()
    const gain1 = this.ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(800, now)
    osc1.frequency.exponentialRampToValueAtTime(3200, now + 0.18)

    gain1.gain.setValueAtTime(0.06, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)

    osc1.connect(gain1)
    gain1.connect(this.masterGain)
    osc1.start()
    osc1.stop(now + 0.22)

    // Sub confirmation thump
    const subOsc = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    subOsc.type = 'sine'
    subOsc.frequency.setValueAtTime(120, now)
    subOsc.frequency.linearRampToValueAtTime(40, now + 0.25)

    subGain.gain.setValueAtTime(0.18, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    subOsc.connect(subGain)
    subGain.connect(this.masterGain)
    subOsc.start()
    subOsc.stop(now + 0.32)
  }

  // Scrolling sound effect (digital camera repositioning sweep)
  playScrollTransition() {
    this.unlock()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc = this.ctx.createOscillator()
    const filter = this.ctx.createBiquadFilter()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.18)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(850, now)
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.18)
    filter.Q.setValueAtTime(8, now)

    gain.gain.setValueAtTime(0.055, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    osc.start()
    osc.stop(now + 0.22)
  }

  playBootBeep() {
    this.playBinaryTick()
    setTimeout(() => this.playOrbHover(), 60)
  }

  playAccessGrantedChime() {
    this.unlock()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25] // C4-E4-G4-C5-E5 chord
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.06)

      gain.gain.setValueAtTime(0, now + idx * 0.06)
      gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.06 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.6)

      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(now + idx * 0.06)
      osc.stop(now + idx * 0.06 + 1.7)
    })
  }

  playSectorTransition() {
    this.playScrollTransition()
  }

  /* ═══════════════════════════════════════════════════════════
     Robotic Intercom Carrier/Radio Transmission Hum
     (plays while AI voice is speaking)
     ═══════════════════════════════════════════════════════════ */
  startRadioTransmissionHum() {
    this.unlock()
    if (!this.ctx) return
    if (this.radioGainNode) return

    const now = this.ctx.currentTime
    this.radioGainNode = this.ctx.createGain()
    this.radioGainNode.gain.setValueAtTime(0, now)
    this.radioGainNode.gain.linearRampToValueAtTime(0.032, now + 0.04)
    this.radioGainNode.connect(this.masterGain)

    // Dual carrier oscillations for metallic modular hum
    this.radioOsc1 = this.ctx.createOscillator()
    this.radioOsc1.type = 'sine'
    this.radioOsc1.frequency.setValueAtTime(90, now)

    this.radioOsc2 = this.ctx.createOscillator()
    this.radioOsc2.type = 'triangle'
    this.radioOsc2.frequency.setValueAtTime(320, now)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(380, now)
    filter.Q.setValueAtTime(3, now)

    this.radioOsc1.connect(filter)
    this.radioOsc2.connect(filter)
    filter.connect(this.radioGainNode)

    this.radioOsc1.start()
    this.radioOsc2.start()
  }

  stopRadioTransmissionHum() {
    if (!this.ctx || !this.radioGainNode) return
    const now = this.ctx.currentTime
    try {
      this.radioGainNode.gain.cancelScheduledValues(now)
      this.radioGainNode.gain.setValueAtTime(this.radioGainNode.gain.value, now)
      this.radioGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
      
      const osc1 = this.radioOsc1
      const osc2 = this.radioOsc2
      setTimeout(() => {
        try {
          osc1.stop()
          osc2.stop()
        } catch (e) {}
      }, 150)
    } catch (e) {}

    this.radioGainNode = null
    this.radioOsc1 = null
    this.radioOsc2 = null
  }

  // Real-time synthesized walkie-talkie / radio squelch-in chime
  playRadioSquelchIn() {
    this.unlock()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // 80ms bandpass filtered white noise burst
    const bufferSize = this.ctx.sampleRate * 0.08
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const noiseFilter = this.ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(1000, now)
    noiseFilter.Q.setValueAtTime(4, now)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(0.05, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075)

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.masterGain)
    noise.start()

    // Radio pop sweep (low frequency chime click)
    const osc = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)

    oscGain.gain.setValueAtTime(0.03, now)
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

    osc.connect(oscGain)
    oscGain.connect(this.masterGain)
    osc.start()
    osc.stop(now + 0.05)
  }

  // Real-time synthesized radio click-out chime
  playRadioSquelchOut() {
    this.unlock()
    if (!this.ctx) return
    const now = this.ctx.currentTime

    // 50ms triangle pop sweep up
    const osc = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.05)

    oscGain.gain.setValueAtTime(0.02, now)
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055)

    osc.connect(oscGain)
    oscGain.connect(this.masterGain)
    osc.start()
    osc.stop(now + 0.06)

    // Short static discharge (40ms)
    const bufferSize = this.ctx.sampleRate * 0.04
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const noiseFilter = this.ctx.createBiquadFilter()
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.setValueAtTime(2200, now)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(0.03, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038)

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.masterGain)
    noise.start()
  }
}

export const cinemaAudio = new CinematicAudioEngine()
