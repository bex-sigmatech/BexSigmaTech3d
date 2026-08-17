import React, { useEffect, useRef } from 'react'

/* ==========================================================================
   10/10 AIRLOCK ENGINE & DOCKING BAY — NATIVE 8K CINEMATIC RENDERER
   Hydraulic blast doors parting, steam jets, docking beacons & Earth outside
   ========================================================================== */

export default function AirlockEngineCinematic8K() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    const startTime = performance.now()

    // Steam particles
    const steam = Array.from({ length: 65 }, () => ({
      x: Math.random(),
      y: 0.75 + Math.random() * 0.25,
      vx: (Math.random() - 0.5) * 0.04,
      vy: -0.05 - Math.random() * 0.08,
      size: Math.random() * 80 + 30,
      alpha: Math.random() * 0.35 + 0.1
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

      // 1. Clear background
      ctx.fillStyle = '#03060a'
      ctx.fillRect(0, 0, w, h)

      // 2. Space & Earth visible outside the massive opening hangar doors (Center)
      const doorOpenWidth = Math.min(w * 0.48, (t / 2.8) * w * 0.48)
      const stX = w * 0.5 - doorOpenWidth * 0.5
      const stW = doorOpenWidth

      if (stW > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(stX, h * 0.15, stW, h * 0.68)
        ctx.clip()

        // Space black inside door
        ctx.fillStyle = '#010204'
        ctx.fillRect(stX, h * 0.15, stW, h * 0.68)

        // Earth curve shining through the docking bay doorway
        const eGrad = ctx.createRadialGradient(w * 0.5, h * 0.9, w * 0.1, w * 0.5, h * 0.9, w * 0.45)
        eGrad.addColorStop(0, '#00b9ff')
        eGrad.addColorStop(0.5, '#04428c')
        eGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = eGrad
        ctx.beginPath()
        ctx.arc(w * 0.5, h * 0.9, w * 0.45, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 3. Hydraulic Airlock Blast Doors (Left & Right framing the opening)
      // Left Door
      const leftDoorEdge = w * 0.5 - doorOpenWidth * 0.5
      ctx.fillStyle = '#111823'
      ctx.fillRect(0, 0, leftDoorEdge, h)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 4
      ctx.strokeRect(leftDoorEdge - 12, 0, 12, h)

      // Right Door
      const rightDoorEdge = w * 0.5 + doorOpenWidth * 0.5
      ctx.fillStyle = '#111823'
      ctx.fillRect(rightDoorEdge, 0, w - rightDoorEdge, h)
      ctx.strokeRect(rightDoorEdge, 0, 12, h)

      // 4. Hangar Bay Architecture (Top Ceiling & Bottom Floor Runway)
      // Ceiling trusses
      ctx.fillStyle = '#0b0f17'
      ctx.fillRect(0, 0, w, h * 0.15)
      // Floor docking runway
      ctx.fillStyle = '#0a0d14'
      ctx.fillRect(0, h * 0.83, w, h * 0.17)

      // 5. Docking Runway Guidance Strobes (Red & White converging perspective lines)
      const strobeOn = Math.sin(t * 10) > 0
      for (let i = 0; i < 12; i++) {
        const progress = i / 12
        const lx = w * 0.5 - doorOpenWidth * 0.5 * (1 - progress * 0.5) - 30
        const rx = w * 0.5 + doorOpenWidth * 0.5 * (1 - progress * 0.5) + 30
        const ly = h * 0.84 + progress * (h * 0.15)

        ctx.fillStyle = i % 2 === 0 && strobeOn ? '#ef4444' : '#00d4ff'
        ctx.beginPath()
        ctx.arc(lx, ly, 4 + progress * 4, 0, Math.PI * 2)
        ctx.arc(rx, ly, 4 + progress * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // 6. Volumetric Hydraulic Airlock Steam
      steam.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < 0.2) {
          p.y = 0.85
          p.x = Math.random()
        }

        const sx = p.x * w
        const sy = p.y * h

        const sGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, p.size)
        sGrad.addColorStop(0, `rgba(200, 225, 255, ${p.alpha})`)
        sGrad.addColorStop(1, 'rgba(200, 225, 255, 0)')
        ctx.fillStyle = sGrad
        ctx.beginPath()
        ctx.arc(sx, sy, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

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
