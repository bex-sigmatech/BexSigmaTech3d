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
     LAYER 1: Sub-Bass Drone (Disabled per user request)
     ═══════════════════════════════════════════════════════════ */
  _startSubBass() {
    // Disabled: background vacuum/drone sound removed
    return
  }

  /* ═══════════════════════════════════════════════════════════
     LAYER 2: Binary Data Stream (Disabled per user request)
     ═══════════════════════════════════════════════════════════ */
  _getBinaryConfig() {
    return null
  }

  _startBinaryDataStream() {
    // Disabled: background droplet/chirp sounds removed
    this._stopBinaryDataStream()
    return
  }

  _stopBinaryDataStream() {
    if (this._binaryLoopTimer) {
      clearTimeout(this._binaryLoopTimer)
      this._binaryLoopTimer = null
    }
  }

  // Short high-frequency tick (used for discrete user feedback)
  _playDataTick(vol = 0.008) {
    return
  }

  // Ascending frequency chirp (droplet sound disabled)
  _playDataChirp(vol = 0.012) {
    return
  }

  // Low modem-like processing tone (disabled)
  _playModemTone(vol = 0.006) {
    return
  }

  /* ═══════════════════════════════════════════════════════════
     LAYER 3: Atmospheric Pad (Disabled per user request)
     ═══════════════════════════════════════════════════════════ */
  _startAtmosphericPad() {
    // Disabled: background vacuum/pad sound removed
    return
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN CONTROL: Start / Stop / Scene Changes
     ═══════════════════════════════════════════════════════════ */

  startCinematicScore() {
    if (this._isMuted) return
    this.unlock()
    if (!this.ctx || this.isPlayingScore) return
    if (document.hidden) return
    this.isPlayingScore = true
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
    // Disabled: carrier hum removed
    return
  }

  stopRadioTransmissionHum() {
    return
  }

  // Real-time synthesized walkie-talkie / radio squelch-in chime (disabled)
  playRadioSquelchIn() {
    return
  }

  // Real-time synthesized radio click-out chime (disabled)
  playRadioSquelchOut() {
    return
  }
}

export const cinemaAudio = new CinematicAudioEngine()
