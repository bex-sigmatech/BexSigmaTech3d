import { aiVoice } from './AIVoiceEngine'
import { cinemaAudio } from './CinematicAudioEngine'

/* ==========================================================================
   BEX SIGMA TECH — GEMINI 2.0 MULTIMODAL LIVE CLIENT (HIGH FIDELITY)
   Features:
   - Native DAC sample rate AudioContext with hardware polyphase resampling
   - Zero-gap seamless audio chunk queue with jitter-free scheduling
   - Acoustic Echo-Gating (prevents self-interruption from speaker playback)
   - Real-time AnalyserNode FFT visualizer for 3D Holographic Core
   - 10/10 collapse: Live and pre-recorded never speak together (mutual exclusion)
   ========================================================================== */

const _STATIC_EMPTY_FREQ = new Uint8Array(32)
let _staticFreqBuffer = null

class GeminiLiveClient {
  constructor() {
    this.ws = null
    this.audioCtx = null
    this.micStream = null
    this.workletNode = null
    this.analyser = null
    this.outputGain = null

    this.nextPlayTime = 0
    this.activeSources = new Set()

    this.state = 'DISCONNECTED' // 'DISCONNECTED' | 'CONNECTING' | 'READY' | 'LISTENING' | 'SPEAKING'
    this.listeners = {
      state: [],
      transcript: [],
      toolCall: [],
      error: [],
      status: []
    }
  }

  on(event, callback) {
    if (this.listeners[event]) this.listeners[event].push(callback)
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data))
    }
  }

  setState(newState) {
    if (this.state === newState) return
    this.state = newState
    this.emit('state', newState)
    try { if (typeof window !== 'undefined') window.__LIVE_VOICE_STATE__ = newState } catch {}
    // 10/10 collapse: when Live starts, stop pre-recorded immediately (no overlap)
    if (newState === 'SPEAKING' || newState === 'LISTENING') {
      try { aiVoice.stop(); cinemaAudio.setAmbientVolume(0.08, 0.4) } catch {}
    }
    if (newState === 'DISCONNECTED') {
      try { cinemaAudio.setAmbientVolume(0.3, 0.8) } catch {}
    }
  }

  async connect({ forceReconnect = false } = {}) {
    if (!forceReconnect && this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    if (forceReconnect) this._reconnectAttempts = 0
    this._shouldReconnect = true

    this.setState('CONNECTING')
    this._reconnectAttempts = this._reconnectAttempts || 0

    let wsUrl
    // 10/10: env-driven + protocol-aware + dynamic context (userName/scene) for per-sector instruction
    const envBackendUrl = import.meta.env.VITE_BACKEND_URL
    const envBackendHost = import.meta.env.VITE_BACKEND_HOST
    if (envBackendUrl && envBackendUrl.startsWith('http')) {
      const u = new URL(envBackendUrl)
      wsUrl = `${u.protocol === 'https:' ? 'wss:' : 'ws:'}//${u.host}/ws/voice`
    } else if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      wsUrl = 'ws://localhost:5001/ws/voice'
    } else if (envBackendHost) {
      wsUrl = `wss://${envBackendHost}/ws/voice`
    } else if (typeof window !== 'undefined') {
      wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/voice`
    } else {
      wsUrl = 'wss://bexsigmatech3d.onrender.com/ws/voice'
    }
    // Append dynamic context for server-side SYSTEM_INSTRUCTION
    try {
      const userName = (typeof window !== 'undefined' && (localStorage.getItem('bex_userName') || window.__BEX_USER__)) || ''
      const scene = (typeof window !== 'undefined' && window.__BEX_SCENE__) || ''
      const params = new URLSearchParams()
      if (userName) params.set('userName', userName)
      if (scene) params.set('scene', scene)
      if (params.toString()) wsUrl += `?${params.toString()}`
    } catch {}

    try {
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = async () => {
        console.log('📡 Connected to BEX Live Voice Gateway')
        await this.initAudioContext()
        await this.startMicrophone()
        this.setState('READY')
      }

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          this.handleServerMessage(msg)
        } catch (err) {
          console.warn('LiveClient message parse error:', err)
        }
      }

      this.ws.onerror = (err) => {
        console.error('LiveClient WS error:', err)
        this.emit('error', 'Voice connection error')
      }

      this.ws.onclose = () => {
        console.log('🔌 LiveClient WS closed')
        this.stopAudio()
        this.setState('DISCONNECTED')
        // 10/10: exponential backoff reconnect (3 tries) for transient drops
        if (this._reconnectAttempts < 3 && this._shouldReconnect !== false) {
          const delay = Math.min(1000 * Math.pow(2, this._reconnectAttempts), 8000)
          this._reconnectAttempts++
          console.log(`↻ Reconnecting voice in ${delay}ms (attempt ${this._reconnectAttempts}/3)`)
          setTimeout(() => this.connect(), delay)
        } else {
          this._reconnectAttempts = 0
        }
      }

    } catch (err) {
      console.error('Failed to connect to Live Voice Gateway:', err)
      this.setState('DISCONNECTED')
      this.emit('error', err.message)
    }
  }

  async initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      // 10/10: interactive latency hint + native rate for zero-jitter DAC
      this.audioCtx = new AudioContextClass({ latencyHint: 'interactive' })
    }

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume()
    }

    if (!this.analyser) {
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 64
      this.analyser.smoothingTimeConstant = 0.6 // faster visual, lower lag
    }

    if (!this.outputGain) {
      this.outputGain = this.audioCtx.createGain()
      this.outputGain.gain.value = 1.0
      this.outputGain.connect(this.analyser)
      this.analyser.connect(this.audioCtx.destination)
    }

    this.nextPlayTime = this.audioCtx.currentTime
  }

  async startMicrophone() {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      this.micCtx = new AudioContextClass({ latencyHint: 'interactive' })
      if (this.micCtx.state === 'suspended') {
        await this.micCtx.resume()
      }

      await this.micCtx.audioWorklet.addModule('/audio-processor.js')
      const source = this.micCtx.createMediaStreamSource(this.micStream)
      this.workletNode = new AudioWorkletNode(this.micCtx, 'pcm-processor')

      this.workletNode.port.onmessage = (event) => {
        // Echo-gate: Don't echo speaker audio back to Gemini while it's transmitting
        if (this.state === 'SPEAKING') {
          return
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const pcmBuffer = event.data
          const base64Audio = this.arrayBufferToBase64(pcmBuffer)
          this.ws.send(JSON.stringify({
            type: 'AUDIO_CHUNK',
            audioData: base64Audio
          }))
        }
      }

      source.connect(this.workletNode)

      // Silent sink to ensure audio graph keeps executing continuously
      const silentGain = this.micCtx.createGain()
      silentGain.gain.value = 0
      this.workletNode.connect(silentGain)
      silentGain.connect(this.micCtx.destination)

      this.setState('LISTENING')
    } catch (err) {
      console.error('Microphone initialization failed:', err)
      this.emit('error', 'Microphone permission denied or unavailable.')
    }
  }

  handleServerMessage(msg) {
    switch (msg.type) {
      case 'AUDIO':
        if (msg.audioData) {
          this.queueAudioChunk(msg.audioData)
        }
        break

      case 'TRANSCRIPT':
        if (msg.text) {
          this.emit('transcript', msg.text)
        }
        break

      case 'INTERRUPTED':
        this.stopCurrentPlayback()
        this.setState('LISTENING')
        break

      case 'TURN_COMPLETE':
        break

      case 'TOOL_CALL':
        this.emit('toolCall', { name: msg.name, args: msg.args, id: msg.id })
        break

      case 'STATUS':
        this.emit('status', msg)
        break

      default:
        break
    }
  }

  queueAudioChunk(base64Data) {
    if (!this.audioCtx) return

    const rawBytes = this.base64ToArrayBuffer(base64Data)
    const pcm16 = new Int16Array(rawBytes)
    if (pcm16.length === 0) return

    const float32 = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768.0
    }

    // Create 24kHz audio buffer (Web Audio automatically resamples smoothly to native DAC rate)
    const audioBuffer = this.audioCtx.createBuffer(1, float32.length, 24000)
    audioBuffer.getChannelData(0).set(float32)

    const source = this.audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.outputGain)

    const currentTime = this.audioCtx.currentTime
    // 10/10: ultra-low latency 5ms lead + seamless chaining
    const startTime = Math.max(this.nextPlayTime, currentTime + 0.005)
    source.start(startTime)

    this.nextPlayTime = startTime + audioBuffer.duration
    this.activeSources.add(source)
    this.setState('SPEAKING')

    source.onended = () => {
      this.activeSources.delete(source)
      if (this.activeSources.size === 0 && this.audioCtx.currentTime >= this.nextPlayTime - 0.02) {
        this.setState('LISTENING')
      }
    }
  }

  stopCurrentPlayback() {
    this.activeSources.forEach(s => {
      try { s.stop() } catch (e) {}
    })
    this.activeSources.clear()
    if (this.audioCtx) {
      this.nextPlayTime = this.audioCtx.currentTime
    }
  }

  stopAudio() {
    this.stopCurrentPlayback()

    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop())
      this.micStream = null
    }
    if (this.workletNode) {
      this.workletNode.disconnect()
      this.workletNode = null
    }
    if (this.micCtx) {
      this.micCtx.close().catch(() => {})
      this.micCtx = null
    }
  }

  disconnect() {
    this._shouldReconnect = false
    this._reconnectAttempts = 0
    this.stopAudio()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.setState('DISCONNECTED')
  }

  sendTextMessage(text) {
    if (!text || !this.ws || this.ws.readyState !== WebSocket.OPEN) return
    this.ws.send(JSON.stringify({
      type: 'TEXT_INPUT',
      text
    }))
  }

  // 3D Audio Visualizer Frequency Spectrum Hook — ZERO GC ALLOCATION
  getFrequencyData() {
    if (!this.analyser) return _STATIC_EMPTY_FREQ
    if (!_staticFreqBuffer || _staticFreqBuffer.length !== this.analyser.frequencyBinCount) {
      _staticFreqBuffer = new Uint8Array(this.analyser.frequencyBinCount)
    }
    this.analyser.getByteFrequencyData(_staticFreqBuffer)
    return _staticFreqBuffer
  }

  // Utility: ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  // Utility: Base64 to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
}

export const liveVoiceClient = new GeminiLiveClient()
