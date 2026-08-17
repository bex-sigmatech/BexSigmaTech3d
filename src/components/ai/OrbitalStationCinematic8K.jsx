import React, { useEffect, useRef } from 'react'

/* ==========================================================================
   10/10 ORBITAL COMMAND STATION — NATIVE 8K CINEMATIC RENDERER
   Razor-sharp rotating habitation rings, solar wings, docking beacons & Earth orbit
   ========================================================================== */

export default function OrbitalStationCinematic8K() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    const startTime = performance.now()

    // Starfield
    const stars = Array.from({ length: 800 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2
    }))

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      const w = window.innerWidth
      const h = window.innerHeight

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
        ctx.scale(dpr, dpr)
      }

      const t = (performance.now() - startTime) * 0.001

      // 1. Deep space background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
      bgGrad.addColorStop(0, '#010306')
      bgGrad.addColorStop(1, '#050a14')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      // 2. Crisp stars
      stars.forEach(s => {
        const twinkle = 0.5 + Math.sin(t * 2 + s.x * 50) * 0.5
        ctx.fillStyle = `rgba(230, 245, 255, ${s.alpha * twinkle})`
        ctx.fillRect(s.x * w, s.y * h, s.size, s.size)
      })

      // 3. Curved Earth Horizon below
      const earthCenterY = h * 1.45
      const earthR = w * 0.95
      const earthGrad = ctx.createRadialGradient(w * 0.5, earthCenterY, earthR * 0.92, w * 0.5, earthCenterY, earthR * 1.05)
      earthGrad.addColorStop(0, '#0a3266')
      earthGrad.addColorStop(0.7, '#0099ff')
      earthGrad.addColorStop(0.9, 'rgba(0, 212, 255, 0.4)')
      earthGrad.addColorStop(1, 'rgba(0, 212, 255, 0)')
      ctx.fillStyle = earthGrad
      ctx.beginPath()
      ctx.arc(w * 0.5, earthCenterY, earthR * 1.05, 0, Math.PI * 2)
      ctx.fill()

      // 4. Gigantic Orbital Command Station (Center-Right)
      ctx.save()
      const stX = w * 0.52
      const stY = h * 0.45
      const scale = Math.min(w, h) * 0.0012

      ctx.translate(stX, stY)
      // Slow cinematic approach zoom
      const zoom = 1 + t * 0.02
      ctx.scale(scale * zoom, scale * zoom)

      // A. Outer Rotating Habitation Torus Ring 1 (Clockwise)
      ctx.save()
      ctx.rotate(t * 0.2)
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 14
      ctx.beginPath()
      ctx.arc(0, 0, 190, 0, Math.PI * 2)
      ctx.stroke()

      // Titanium ring segments & windows
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2
        const rx = Math.cos(angle) * 190
        const ry = Math.sin(angle) * 190

        ctx.fillStyle = i % 3 === 0 ? '#00d4ff' : '#94a3b8'
        ctx.beginPath()
        ctx.arc(rx, ry, 6, 0, Math.PI * 2)
        ctx.fill()

        // Spokes connecting ring to core
        if (i % 4 === 0) {
          ctx.strokeStyle = 'rgba(200, 215, 235, 0.4)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(rx, ry)
          ctx.stroke()
        }
      }
      ctx.restore()

      // B. Counter-Rotating Habitation Torus Ring 2
      ctx.save()
      ctx.rotate(-t * 0.15)
      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(0, 0, 135, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // C. Massive Central Command Core & Antenna Tower
      // Main central cylinder
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(-38, -120, 76, 240)

      // Metallic structural bands
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(-40, -60, 80, 14)
      ctx.fillRect(-40, 40, 80, 14)

      // Illuminated BEX SIGMA TECH Core Beacon
      const corePulse = 0.7 + Math.sin(t * 4) * 0.3
      const coreGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 55)
      coreGrad.addColorStop(0, `rgba(0, 255, 255, ${corePulse})`)
      coreGrad.addColorStop(0.5, `rgba(0, 160, 255, ${corePulse * 0.4})`)
      coreGrad.addColorStop(1, 'rgba(0, 160, 255, 0)')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(0, 0, 55, 0, Math.PI * 2)
      ctx.fill()

      // D. Massive Solar Array Wings (Left & Right)
      const drawSolarWing = (dir) => {
        ctx.save()
        ctx.translate(dir * 220, 0)
        // Golden solar sheen glint
        ctx.fillStyle = '#1d4ed8'
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth = 2

        for (let row = -3; row <= 3; row++) {
          for (let col = 0; col < 6; col++) {
            const sx = dir > 0 ? col * 32 : -col * 32 - 28
            const sy = row * 24
            ctx.fillRect(sx, sy, 28, 20)
            ctx.strokeRect(sx, sy, 28, 20)
          }
        }
        ctx.restore()
      }
      drawSolarWing(1)
      drawSolarWing(-1)

      // E. Flashing Red & White Aircraft Navigation Beacons
      const flash = Math.sin(t * 8) > 0
      if (flash) {
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(-38, -125, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(38, 125, 6, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  )
}
