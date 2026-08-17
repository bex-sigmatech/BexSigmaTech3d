import React, { useEffect, useRef } from 'react'
import EarthBackground8K from '../headquarters/EarthBackground8K'

/* ==========================================================================
   10/10 WELCOME ADDRESS OBSERVATORY — NATIVE 8K CINEMATIC RENDERER
   Panoramic command observatory framing Earth + holographic telemetry
   ========================================================================== */

export default function WelcomeAddressCinematic8K() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId
    const startTime = performance.now()

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

      ctx.clearRect(0, 0, w, h)

      // 1. Curved Apple Park Architectural Rib Frames (Left & Right observatory ribs)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
      ctx.lineWidth = 3

      // Left curved rib
      ctx.beginPath()
      ctx.moveTo(w * 0.18, 0)
      ctx.quadraticCurveTo(w * 0.14, h * 0.5, w * 0.18, h)
      ctx.stroke()

      // Right curved rib
      ctx.beginPath()
      ctx.moveTo(w * 0.82, 0)
      ctx.quadraticCurveTo(w * 0.86, h * 0.5, w * 0.82, h)
      ctx.stroke()

      // 2. Center Rotating Holographic Concierge Radar Ring
      ctx.save()
      ctx.translate(w * 0.5, h * 0.48)

      // Outer data ring
      ctx.rotate(t * 0.3)
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, 260, 0, Math.PI * 1.6)
      ctx.stroke()

      // Inner tick ring
      ctx.rotate(-t * 0.6)
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.45)'
      ctx.setLineDash([8, 16])
      ctx.beginPath()
      ctx.arc(0, 0, 220, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.restore()

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {/* 1. Native Retina 8K Earth Disc Background */}
      <EarthBackground8K viewMode="command_deck" />

      {/* 2. Holographic Observatory Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />
    </div>
  )
}
