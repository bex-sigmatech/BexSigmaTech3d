import React, { useEffect, useRef } from 'react'

/* ==========================================================================
   BEX SIGMA TECH — WEBGL PHOTOREALISTIC EARTH RENDERER
   Uses a real equirectangular Earth texture mapped onto a 3D sphere.
   GPU-accelerated rotation, lighting, and atmospheric effects at 60 FPS.
   ========================================================================== */

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_center;
  uniform float u_radius;
  uniform sampler2D u_earthTexture;

  // Pseudo-random hash for starfield
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  #define PI 3.14159265359

  void main() {
    vec2 pixelCoord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    vec2 diff = pixelCoord - u_center;
    float dist = length(diff);

    // ── Starfield Background ──
    float starVal = hash(floor(pixelCoord * 0.55));
    vec3 backColor = vec3(0.006, 0.01, 0.022);
    if (starVal > 0.9992) {
      float twinkle = 0.3 + 0.7 * sin(u_time * (1.5 + starVal * 3.5) + starVal * 100.0);
      float brightness = (starVal - 0.9992) * 1250.0; // brighter for rarer stars
      backColor += vec3(twinkle * brightness * 0.95, twinkle * brightness * 0.97, twinkle * brightness);
    }

    // ── Earth sphere ──
    if (dist < u_radius) {
      float normR = dist / u_radius;
      float z = sqrt(1.0 - normR * normR);
      vec3 N = vec3(diff.x / u_radius, diff.y / u_radius, z);

      // Spherical UV coordinates (latitude, longitude)
      float lat = asin(clamp(N.y, -1.0, 1.0));         // -PI/2 .. PI/2
      float lon = atan(N.x, N.z);                        // -PI .. PI

      // Rotate the planet around its polar axis
      float rotation = u_time * 0.04;
      lon += rotation;

      // Convert spherical coords to equirectangular UV
      float u = fract(lon / (2.0 * PI) + 0.5);
      float v = 0.5 - lat / PI;                          // flip so north is up

      // Clamp V inward to avoid sampling texture edge artifacts at the poles
      float vClamped = clamp(v, 0.04, 0.96);

      // Sample the Earth texture with safe V
      vec3 texColor = texture2D(u_earthTexture, vec2(u, vClamped)).rgb;

      // ── Polar ice cap blending ──
      // Smoothly blend to white ice at the north pole (v near 0) and south pole (v near 1)
      float northPole = smoothstep(0.10, 0.02, v);       // 1.0 at very top
      float southPole = smoothstep(0.90, 0.98, v);       // 1.0 at very bottom
      float polarMask = max(northPole, southPole);
      vec3 iceColor = vec3(0.88, 0.92, 0.97);            // crisp blue-white ice
      texColor = mix(texColor, iceColor, polarMask);

      // ── Directional sunlight (fixed in space) ──
      vec3 L = normalize(vec3(-0.55, -0.3, 0.78));
      float NdotL = dot(N, L);
      float diffuse = max(0.0, NdotL);

      // Smooth terminator (day/night boundary)
      float terminator = smoothstep(-0.08, 0.15, NdotL);

      // Night side: faint city glow & deep blue tint
      vec3 nightColor = texColor * 0.012 + vec3(0.003, 0.006, 0.018);

      // Day side: natural lit texture with slight warmth
      vec3 dayColor = texColor * (0.55 + diffuse * 0.65);

      // Specular highlight for oceans (blueish areas get a sun glint)
      float spec = pow(max(0.0, NdotL), 48.0) * 0.4;
      // Detect ocean by low brightness & blue dominance
      float isOcean = step(texColor.r + texColor.g, texColor.b * 2.4) * step(0.08, texColor.b);
      dayColor += spec * isOcean * vec3(1.0, 0.95, 0.85);

      // Blend day and night
      vec3 surfaceColor = mix(nightColor, dayColor, terminator);

      // ── Atmospheric Rayleigh limb scattering ──
      float rim = pow(normR, 3.5);
      vec3 atmosphereColor = vec3(0.22, 0.55, 1.0);
      // Stronger on the sunlit side
      float rimLight = max(0.3, smoothstep(-0.2, 0.5, NdotL));
      surfaceColor += rim * atmosphereColor * 0.7 * rimLight;

      // Subtle fresnel brightening at edges
      float fresnel = pow(1.0 - z, 3.0);
      surfaceColor += fresnel * vec3(0.05, 0.12, 0.28) * 0.5;

      gl_FragColor = vec4(surfaceColor, 1.0);

    } else if (dist < u_radius * 1.22) {
      // ── Atmospheric halo glow around the planet ──
      float normDist = dist / u_radius;
      float haloFade = (1.22 - normDist) / 0.22;
      float glowStrength = pow(haloFade, 3.0) * 0.5;
      vec3 haloColor = vec3(0.15, 0.45, 0.95);
      gl_FragColor = vec4(mix(backColor, haloColor, glowStrength), 1.0);

    } else {
      // ── Deep space ──
      gl_FragColor = vec4(backColor, 1.0);
    }
  }
`;

export default function EarthBackground8K({ viewMode = 'orbit' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { antialias: true }) || canvas.getContext('experimental-webgl')
    if (!gl) {
      console.warn('[EarthBackground8K] WebGL not supported.')
      return
    }

    // ── Compile Shader Helper ──
    const compileShader = (src, type) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[Shader Error]:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compileShader(VERTEX_SHADER_SRC, gl.VERTEX_SHADER)
    const fs = compileShader(FRAGMENT_SHADER_SRC, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[WebGL Link Error]:', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    // ── Full-screen Quad ──
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // ── Uniform Locations ──
    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const centerLoc = gl.getUniformLocation(program, 'u_center')
    const radiusLoc = gl.getUniformLocation(program, 'u_radius')
    const texLoc = gl.getUniformLocation(program, 'u_earthTexture')

    // ── Load Earth Texture ──
    const texture = gl.createTexture()
    // Initialize with a 1x1 deep-blue pixel while texture loads
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([8, 20, 50, 255]))

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

      // Enable seamless horizontal wrapping for continuous rotation
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    }
    img.src = '/earth_map.png'

    let animId
    let isVisible = true
    let lastW = 0, lastH = 0, lastDpr = 0
    const startTime = performance.now()

    const onVis = () => {
      isVisible = !document.hidden
      if (isVisible && !animId) animId = requestAnimationFrame(render)
    }
    document.addEventListener('visibilitychange', onVis)
    const onResize = () => { /* handled in render loop */ }

    // ── Render Loop — LAGFREE: DPR capped 1.5, pause on hidden, throttle resize ──
    const render = () => {
      if (document.hidden) { animId = null; return }
      const isLow = window.innerWidth <= 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
      const dpr = Math.min(window.devicePixelRatio || 1, isLow ? 1.25 : 1.5)
      const width = window.innerWidth
      const height = window.innerHeight
      const dw = Math.floor(width * dpr)
      const dh = Math.floor(height * dpr)

      if (canvas.width !== dw || canvas.height !== dh || dpr !== lastDpr) {
        // throttle: only resize if diff > 1px or dpr changed
        if (Math.abs(width - lastW) > 1 || Math.abs(height - lastH) > 1 || dpr !== lastDpr) {
          canvas.width = dw
          canvas.height = dh
          gl.viewport(0, 0, dw, dh)
          lastW = width; lastH = height; lastDpr = dpr
        }
      }

      const elapsed = (performance.now() - startTime) * 0.001

      // ── Zoom / Position based on viewMode ──
      let zoomFactor = 1.0
      if (viewMode === 'orbit') {
        const progress = Math.min(elapsed / 4.5, 1.0)
        const ease = 1 - Math.pow(1 - progress, 4)
        zoomFactor = 0.35 + 0.50 * ease
      } else if (viewMode === 'command_deck') {
        zoomFactor = 1.0 + Math.sin(elapsed * 0.12) * 0.02
      }

      const cx = width * 0.5
      const cy = viewMode === 'command_deck' ? height * 0.58 : height * 0.52
      const baseRadius = Math.min(width, height) * (viewMode === 'command_deck' ? 0.62 : 0.44)
      const earthRadius = baseRadius * zoomFactor

      // ── Bind texture & uniforms ──
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(texLoc, 0)

      gl.uniform2f(resLoc, dw, dh)
      gl.uniform1f(timeLoc, elapsed)
      gl.uniform2f(centerLoc, cx * dpr, cy * dpr)
      gl.uniform1f(radiusLoc, earthRadius * dpr)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      document.removeEventListener('visibilitychange', onVis)
      if (animId) cancelAnimationFrame(animId)
      animId = null
      gl.deleteBuffer(buffer)
      gl.deleteTexture(texture)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [viewMode])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}
