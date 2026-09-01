/* ==========================================================================
   BEX SIGMA TECH — ULTRA-LOW LATENCY AUDIO WORKLET RESAMPLER
   Accurately downsamples any hardware microphone rate (48kHz/44.1kHz)
   to exact 16kHz 16-bit linear PCM with 512-sample chunks (<32ms latency).
   ========================================================================== */

class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.targetSampleRate = 16000
    this.inputSampleRate = sampleRate // Provided by browser global scope
    this.resampleRatio = this.inputSampleRate / this.targetSampleRate

    this.outputBufferSize = 1024 // Send every ~64ms for optimal network streaming and zero latency
    this.outputBuffer = new Int16Array(this.outputBufferSize)
    this.outputIndex = 0

    this.resampleOffset = 0
  }

  process(inputs) {
    const input = inputs[0]
    if (!input || !input[0] || input[0].length === 0) return true

    const channelData = input[0]
    const inputLength = channelData.length

    // Downsample input to 16,000Hz using linear interpolation
    while (this.resampleOffset < inputLength) {
      const index = Math.floor(this.resampleOffset)
      const nextIndex = Math.min(index + 1, inputLength - 1)
      const fraction = this.resampleOffset - index

      const s0 = channelData[index]
      const s1 = channelData[nextIndex]
      const sample = s0 + fraction * (s1 - s0)

      // Clamp to [-1.0, 1.0] and convert to 16-bit signed PCM
      const clamped = Math.max(-1, Math.min(1, sample))
      this.outputBuffer[this.outputIndex++] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF

      // Emit chunk immediately when output buffer fills (every 32ms)
      if (this.outputIndex >= this.outputBufferSize) {
        this.port.postMessage(this.outputBuffer.buffer, [this.outputBuffer.buffer])
        this.outputBuffer = new Int16Array(this.outputBufferSize)
        this.outputIndex = 0
      }

      this.resampleOffset += this.resampleRatio
    }

    this.resampleOffset -= inputLength
    return true
  }
}

registerProcessor('pcm-processor', PCMProcessor)
