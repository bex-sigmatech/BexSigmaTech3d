import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

export default function NotFound() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#030508',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Orbitron', monospace",
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* Import Orbitron */}
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />

      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6 }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
        {/* Glowing 404 */}
        <div style={{
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 40px rgba(0,212,255,0.5))',
          letterSpacing: '-0.02em',
          marginBottom: '0.2em',
          animation: 'pulse404 3s ease-in-out infinite',
        }}>
          404
        </div>

        <div style={{
          fontSize: 'clamp(0.7rem, 2vw, 1rem)',
          color: 'rgba(0, 212, 255, 0.8)',
          letterSpacing: '0.35em',
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
        }}>
          SECTOR NOT FOUND
        </div>

        <p style={{
          color: 'rgba(248, 249, 252, 0.55)',
          fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
          maxWidth: '480px',
          lineHeight: 1.7,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          marginBottom: '2.5rem',
        }}>
          The orbital sector you requested doesn't exist in the BEX Sigma matrix. 
          This node may have been decommissioned or the coordinates were invalid.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0284c7)',
              color: '#000',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontFamily: "'Orbitron', monospace",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0, 212, 255, 0.35)',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(0,212,255,0.5)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(0,212,255,0.35)' }}
          >
            ← RETURN TO BASE
          </button>
          <button
            onClick={() => navigate('/store')}
            style={{
              background: 'transparent',
              color: '#a855f7',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              padding: '14px 32px',
              borderRadius: '8px',
              fontFamily: "'Orbitron', monospace",
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(168,85,247,0.12)'; e.target.style.borderColor = '#a855f7' }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(168,85,247,0.5)' }}
          >
            VISIT STORE
          </button>
        </div>

        {/* Error code */}
        <div style={{
          marginTop: '3rem',
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.2em',
          fontFamily: 'monospace',
        }}>
          ERR: ORBITAL_NODE_MISSING · BEX_MATRIX_404 · {new Date().toISOString().split('T')[0]}
        </div>
      </div>

      <style>{`
        @keyframes pulse404 {
          0%, 100% { filter: drop-shadow(0 0 40px rgba(0,212,255,0.4)); }
          50% { filter: drop-shadow(0 0 70px rgba(168,85,247,0.7)); }
        }
      `}</style>
    </div>
  )
}
