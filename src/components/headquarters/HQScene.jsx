import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'

/* ==========================================================================
   BEX SIGMA TECH — JARVIS ORBITAL SPHERE INTERFACE
   No robot · No scroll walking · Camera zooms into department orbs
   Floating glowing spheres arranged in 3D space like JARVIS / Iron Man HUD
   ========================================================================== */

const DEPARTMENTS = [
  {
    id: 'mission_control',
    title: 'Mission Control',
    subtitle: 'Global Orbital Command & Telemetry Hub',
    desc: 'Real-time synchronization of planetary AI clusters, orbital satellites, and deep space exploration assets.',
    tech: ['Orbital Telemetry', 'Planetary Mesh', 'NASA Deep Space Net'],
    color: '#00d4ff', emissive: '#0088cc', pos: [0, 0, 0]
  },
  {
    id: 'web_dev',
    title: 'Web Development',
    subtitle: 'Quantum Spatial Web & Next-Gen Interfaces',
    desc: 'Ultra-low latency web architectures engineered for zero-gravity computing and spatial Apple Vision frameworks.',
    tech: ['Spatial Web', 'Zero-Latency Core', 'React Advanced'],
    color: '#7c3aed', emissive: '#4c1d95', pos: [5.5, 1.2, -3]
  },
  {
    id: 'ai_auto',
    title: 'AI Automation',
    subtitle: 'Autonomous Multimodal Agent Matrix',
    desc: 'Self-evolving cognitive systems automating planetary infrastructure and mission synthesis.',
    tech: ['Agentic Cognitive AI', 'Neural Synthesis', 'LLM Automation'],
    color: '#00ff88', emissive: '#00aa55', pos: [-5.2, 2.0, -4]
  },
  {
    id: 'cloud',
    title: 'Cloud Systems',
    subtitle: 'Orbital Distributed Quantum Cloud',
    desc: 'High-availability quantum cluster networks anchored across low Earth orbit server nodes.',
    tech: ['Orbital Cloud Mesh', 'Quantum Compute', 'Zero-Downtime Edge'],
    color: '#38bdf8', emissive: '#0369a1', pos: [4.0, -2.5, -6]
  },
  {
    id: 'cyber',
    title: 'Cyber Security',
    subtitle: 'Post-Quantum Cryptographic Defense Grid',
    desc: 'Impenetrable cryptographic shields securing interplanetary telemetry and mission-critical AI kernels.',
    tech: ['Post-Quantum Armor', 'Zero-Trust Matrix', 'AI Intrusion Sentinel'],
    color: '#f43f5e', emissive: '#9f1239', pos: [-4.5, -1.5, -7]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Planetary Intelligence & Real-Time Data Engine',
    desc: 'Billions of orbital sensors aggregated into predictive climate, economic, and aerospace simulations.',
    tech: ['Real-Time Telemetry', 'Predictive Synthesis', '8K Spatial Data'],
    color: '#f59e0b', emissive: '#b45309', pos: [7.0, 0.5, -9]
  },
  {
    id: 'ui_ux',
    title: 'UI / UX Design',
    subtitle: 'Spatial Industrial Design & Holographic UX',
    desc: 'Human-machine interfaces designed with Apple Park elegance and cinematic clarity.',
    tech: ['Spatial Holography', 'Apple Design System', 'Ergonomic Optics'],
    color: '#e879f9', emissive: '#a21caf', pos: [-6.5, 2.5, -10]
  },
  {
    id: 'marketing',
    title: 'Digital Marketing',
    subtitle: 'Global Neural Outreach & Brand Ascension',
    desc: 'High-precision communication frameworks connecting humanity with the next frontier.',
    tech: ['Planetary Outreach', 'Cinematic Media', 'Neural Targeting'],
    color: '#34d399', emissive: '#065f46', pos: [2.5, -3.5, -11]
  },
  {
    id: 'finance',
    title: 'Finance Engineering',
    subtitle: 'Algorithmic Asset Matrix & Orbital Economics',
    desc: 'Automated treasury and orbital resource allocation governed by deterministic financial protocols.',
    tech: ['Orbital Ledger', 'Algorithmic Capital', 'Real-Time Governance'],
    color: '#fbbf24', emissive: '#92400e', pos: [-3.0, -2.8, -13]
  },
  {
    id: 'innovation',
    title: 'Innovation Lab',
    subtitle: 'Advanced Aerospace & Experimental AI R&D',
    desc: 'Pioneering propulsion systems, synthetic materials, and artificial general intelligence laboratories.',
    tech: ['AGI Research', 'Advanced Materials', 'Deep Space R&D'],
    color: '#a78bfa', emissive: '#6d28d9', pos: [5.5, 3.0, -15]
  }
]

/* ─── Floating Particle Stars ─── */
function StarField() {
  const ref = useRef()
  const graphicsQuality = useStore(state => state.graphicsQuality)
  const count = graphicsQuality === 'low' ? 150 : 1200

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 80
      arr[i * 3 + 1] = (Math.random() - 0.5) * 45
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.008
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#a8d8ff" transparent opacity={0.65} sizeAttenuation />
    </points>
  )
}

/* ─── Energy Connection Lines between orbs ─── */
function ConnectionLines({ departments, activeIndex }) {
  const ref = useRef()
  const graphicsQuality = useStore(state => state.graphicsQuality)

  const linePositions = useMemo(() => {
    const pts = []
    const center = departments[0].pos
    departments.forEach((dept, i) => {
      if (i === 0) return
      pts.push(...center, ...dept.pos)
    })
    return new Float32Array(pts)
  }, [departments])

  useFrame(({ clock }) => {
    if (ref.current && ref.current.material) {
      ref.current.material.opacity = 0.08 + Math.sin(clock.getElapsedTime() * 0.8) * 0.04
    }
  })

  // Disable on low graphics to prevent lag
  if (graphicsQuality === 'low') return null

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.1} />
    </lineSegments>
  )
}

/* ─── Single Department Orb — Jarvis Style ─── */
function DepartmentOrb({ dept, index, isActive, isHovered, onHover, onLeave, onSelect }) {
  const groupRef = useRef()
  const sphereRef = useRef()
  const outerRingRef = useRef()
  const innerRingRef = useRef()
  const graphicsQuality = useStore(state => state.graphicsQuality)
  const isLow = graphicsQuality === 'low'

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    // Gentle floating idle animation
    groupRef.current.position.y = dept.pos[1] + Math.sin(t * 0.7 + index * 1.2) * 0.18
    groupRef.current.position.x = dept.pos[0] + Math.sin(t * 0.5 + index * 0.9) * 0.08

    // Rings spin (if rendered)
    if (outerRingRef.current) outerRingRef.current.rotation.z = t * (0.4 + index * 0.05)
    if (!isLow && innerRingRef.current) innerRingRef.current.rotation.z = -t * (0.7 + index * 0.03)

    // Sphere pulse
    if (sphereRef.current && sphereRef.current.material) {
      const pulse = isActive
        ? 1.8 + Math.sin(t * 3) * 0.6
        : isHovered
          ? 1.2 + Math.sin(t * 2.5) * 0.3
          : 0.5 + Math.sin(t * 1.5 + index) * 0.2
      sphereRef.current.material.emissiveIntensity = pulse
    }

    // Scale on hover/active
    const targetScale = isActive ? 1.35 : isHovered ? 1.15 : 1.0
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  const sphereSize = index === 0 ? 0.85 : 0.52

  return (
    <group
      ref={groupRef}
      position={[dept.pos[0], dept.pos[1], dept.pos[2]]}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onPointerOver={() => {
        onHover(index)
        cinemaAudio.playOrbHover() // sound effect on hover
      }}
      onPointerOut={() => onLeave()}
    >
      {/* Outer glow aura — disable on low-end */}
      {!isLow && (
        <mesh>
          <sphereGeometry args={[sphereSize * 1.9, 16, 16]} />
          <meshBasicMaterial color={dept.color} transparent opacity={isActive ? 0.06 : 0.025} />
        </mesh>
      )}

      {/* Main sphere body — lower resolution if low-graphics */}
      <mesh ref={sphereRef} castShadow>
        <sphereGeometry args={[sphereSize, isLow ? 16 : 48, isLow ? 16 : 48]} />
        <meshStandardMaterial
          color={dept.color}
          emissive={dept.emissive}
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.15}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Wireframe overlay — Jarvis holographic effect — disable on low-end */}
      {!isLow && (
        <mesh>
          <sphereGeometry args={[sphereSize * 1.02, 12, 12]} />
          <meshBasicMaterial color={dept.color} wireframe transparent opacity={isActive ? 0.25 : 0.08} />
        </mesh>
      )}

      {/* Outer orbit ring — simplified segments if low-graphics */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <ringGeometry args={[sphereSize * 1.5, sphereSize * 1.55, isLow ? 24 : 64]} />
        <meshBasicMaterial color={dept.color} transparent opacity={isActive ? 0.7 : 0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner orbit ring — counter-rotating — disable on low-graphics */}
      {!isLow && (
        <mesh ref={innerRingRef} rotation={[Math.PI / 3, -0.2, 0]}>
          <ringGeometry args={[sphereSize * 1.2, sphereSize * 1.24, 48]} />
          <meshBasicMaterial color={dept.color} transparent opacity={isActive ? 0.5 : 0.12} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Point light emanating from orb */}
      <pointLight
        color={dept.color}
        intensity={isActive ? 3.5 : isHovered ? 1.8 : 0.6}
        distance={isActive ? 7 : 4}
      />
    </group>
  )
}

/* ─── JARVIS Camera Controller — smooth zoom into active orb ─── */
function JarvisCameraController({ activeIndex, departments, entryPhase, isZooming }) {
  const { camera } = useThree()
  const targetRef = useRef({ x: 0, y: 0, z: 20, lx: 0, ly: 0, lz: 0 })

  useEffect(() => {
    const dept = departments[activeIndex]
    const [px, py, pz] = dept.pos

    // Camera zooms in to be 3.5 units away from orb normally, or 0.35 when engaging
    const dist = isZooming ? 0.35 : 3.5
    targetRef.current = {
      x: px * 0.35,
      y: py * 0.25 + 0.5,
      z: pz + dist,
      lx: px,
      ly: py,
      lz: pz,
    }
  }, [activeIndex, departments, isZooming])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const tgt = targetRef.current

    // Cinematic entry: start far back, ease forward
    let entryOffset = 0
    if (entryPhase < 1) {
      entryOffset = (1 - entryPhase) * 8
    }

    // Smooth camera lerp - speed up slightly during engaging zoom
    const lerpSpeed = isZooming ? 0.085 : 0.055
    camera.position.x += (tgt.x - camera.position.x) * lerpSpeed
    camera.position.y += (tgt.y - camera.position.y) * lerpSpeed
    camera.position.z += (tgt.z + entryOffset - camera.position.z) * lerpSpeed

    // Gentle camera drift for life
    camera.position.x += Math.sin(t * 0.25) * 0.006
    camera.position.y += Math.cos(t * 0.18) * 0.005

    camera.lookAt(tgt.lx, tgt.ly, tgt.lz)
  })

  return null
}

/* ─── Floating orbit ring particles around central orb ─── */
function OrbParticleRing({ color, radius, count = 32, speed = 0.5, tiltX = Math.PI / 2 }) {
  const ref = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr[i * 3 + 0] = Math.cos(angle) * radius
      arr[i * 3 + 1] = Math.sin(angle) * radius
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [count, radius])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * speed
      ref.current.rotation.x = tiltX
    }
  })

  return (
    <points ref={ref} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={color} transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

/* ─── Central JARVIS Core — the main mission control orb decorations ─── */
function JarvisCentralCore() {
  const ref = useRef()
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ring1.current) ring1.current.rotation.z = t * 0.3
    if (ring2.current) ring2.current.rotation.z = -t * 0.5
    if (ring3.current) ring3.current.rotation.x = t * 0.2
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Outer glowing orbit rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.65, 128]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.1, 2.14, 128]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 6, 0, 0]}>
        <ringGeometry args={[2.7, 2.73, 128]} />
        <meshBasicMaterial color="#00aaff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Particle orbit rings */}
      <OrbParticleRing color="#00d4ff" radius={1.85} count={48} speed={0.4} tiltX={Math.PI / 2.2} />
      <OrbParticleRing color="#00ffcc" radius={2.4} count={32} speed={-0.3} tiltX={Math.PI / 3.5} />
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HQ SCENE EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function HQScene() {
  const { userName, openMissionBriefing, graphicsQuality } = useStore()
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [entryPhase, setEntryPhase] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const hqVoiceSpokenRef = useRef(false)

  const handleEngage = (dept) => {
    if (isZooming) return
    setIsZooming(true)
    cinemaAudio.playOrbSelect()
    voiceEmitter.emit('SERVICE_CLICK', { sectorId: dept.id })
    setTimeout(() => {
      if (dept.id === 'web_dev') {
        useStore.setState({ scene: 'webdev_store', activeMission: dept })
      } else {
        openMissionBriefing(dept)
      }
    }, 900)
  }

  // Keydown Enter listener to trigger engage
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const dept = DEPARTMENTS[activeIndex]
        handleEngage(dept)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, isZooming])


  // Cinematic entry — camera flies in from far
  useEffect(() => {
    let start = null
    const duration = 2800
    const tick = (now) => {
      if (!start) start = now
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setEntryPhase(ease)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  // "You are now entering Sigma Command Station."
  useEffect(() => {
    if (!hqVoiceSpokenRef.current) {
      hqVoiceSpokenRef.current = true
      voiceEmitter.emit('CAMERA_ENTER_STATION')
      // Trigger Mission Control online since it's the first visible sector
      setTimeout(() => {
        voiceEmitter.emit('MISSION_CONTROL_VISIBLE')
      }, 3500)
    }
  }, [userName])

  // Sector name announcement on scroll/navigate
  useEffect(() => {
    if (activeIndex === 0) return

    const timer = setTimeout(() => {
      voiceEmitter.emit('SERVICE_HOVER', { sectorId: DEPARTMENTS[activeIndex].id })
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeIndex])

  // Scroll → cycle through departments
  useEffect(() => {
    let lastScroll = 0
    const handleWheel = (e) => {
      const now = Date.now()
      if (now - lastScroll < 350) return // throttle
      lastScroll = now
      if (Math.abs(e.deltaY) > 15) {
        if (e.deltaY > 0) {
          setActiveIndex(prev => {
            const next = Math.min(prev + 1, DEPARTMENTS.length - 1)
            if (next !== prev) cinemaAudio.playScrollTransition()
            return next
          })
        } else {
          setActiveIndex(prev => {
            const next = Math.max(prev - 1, 0)
            if (next !== prev) cinemaAudio.playScrollTransition()
            return next
          })
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])


  const currentDept = DEPARTMENTS[activeIndex]

  return (
    <div className="hq-cinematic-container">
      {/* Deep space background */}
      <div className="jarvis-space-bg" />

      {/* Header */}
      <header className="nolan-hq-header">
        <div className="nolan-hq-brand">
          <span className="nolan-brand-title">BEX SIGMA TECH</span>
          <span className="nolan-brand-sub">ORBITAL RESEARCH HEADQUARTERS</span>
        </div>
        <div className="nolan-hq-operator">
          <span className="nolan-status-dot" />
          <span>OPERATOR: {userName || 'COMMANDER'}</span>
          <span className="nolan-sector-badge">{String(activeIndex + 1).padStart(2, '0')} / {DEPARTMENTS.length}</span>
        </div>
      </header>

      {/* ── 3D JARVIS ORBS CANVAS ── */}
      <div className="hq-3d-canvas-wrapper">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 55 }}
          gl={{ antialias: graphicsQuality !== 'low', alpha: true, powerPreference: 'high-performance' }}
          dpr={graphicsQuality === 'low' ? [1, 1.25] : [1, 1.5]}
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#020812']} />
          <fog attach="fog" args={['#020812', 22, 55]} />

          {/* Ambient + key lighting */}
          <ambientLight intensity={0.15} color="#0a1530" />
          <pointLight position={[0, 8, 5]} color="#00d4ff" intensity={2.5} distance={30} />
          <pointLight position={[-10, -5, -5]} color="#7c3aed" intensity={1.5} distance={25} />
          <pointLight position={[10, 5, -8]} color="#00ff88" intensity={1.2} distance={20} />

          <Suspense fallback={null}>
            <JarvisCameraController
              activeIndex={activeIndex}
              departments={DEPARTMENTS}
              entryPhase={entryPhase}
              isZooming={isZooming}
            />

            <StarField />
            <ConnectionLines departments={DEPARTMENTS} activeIndex={activeIndex} />

            {/* Central decorative rings around mission control orb */}
            <JarvisCentralCore />

            {/* All department orbs */}
            {DEPARTMENTS.map((dept, idx) => (
              <DepartmentOrb
                key={dept.id}
                dept={dept}
                index={idx}
                isActive={idx === activeIndex}
                isHovered={hoveredIndex === idx}
                onHover={setHoveredIndex}
                onLeave={() => setHoveredIndex(null)}
                onSelect={() => {
                  setActiveIndex(idx)
                  handleEngage(dept)
                }}
              />
            ))}

            {/* Sci-Fi Post-Processing Pipeline */}
            {graphicsQuality !== 'low' && (
              <EffectComposer disableNormalPass>
                <Bloom
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  intensity={1.1}
                  mipmapBlur
                />
                <Vignette eskil={false} offset={0.1} darkness={0.6} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* ── RESPONSIVE DOCK: Department Minimap & Info Panel ── */}
      <div className="hq-bottom-dock">
        {/* ── ORBS MINI-MAP — right side (desktop) / top dock row (responsive) ── */}
        <div className="jarvis-orb-minimap">
          {DEPARTMENTS.map((dept, idx) => (
            <div
              key={dept.id}
              className={`jarvis-minimap-item interactive ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                if (idx !== activeIndex) cinemaAudio.playSectorTransition()
                setActiveIndex(idx)
              }}
            >
              <span
                className="jarvis-minimap-dot"
                style={{
                  background: idx === activeIndex ? dept.color : 'rgba(255,255,255,0.2)',
                  boxShadow: idx === activeIndex ? `0 0 10px ${dept.color}` : 'none',
                }}
              />
              <span className="jarvis-minimap-label">{dept.title}</span>
            </div>
          ))}
        </div>

        {/* ── DEPARTMENT INFO PANEL — bottom left (desktop) / bottom card (responsive) ── */}
        <div className="jarvis-dept-panel" key={currentDept.id}>
          <div className="jarvis-dept-orb-dot" style={{ background: currentDept.color, boxShadow: `0 0 18px ${currentDept.color}` }} />
          <div className="jarvis-dept-content">
            <div className="jarvis-dept-index">
              DEPT {String(activeIndex + 1).padStart(2, '0')} · {currentDept.id.toUpperCase()}
            </div>
            <h1 className="jarvis-dept-title" style={{ color: currentDept.color }}>{currentDept.title}</h1>
            <h2 className="jarvis-dept-subtitle">{currentDept.subtitle}</h2>
            <p className="jarvis-dept-desc">{currentDept.desc}</p>
            <div className="nolan-dept-tech-row">
              {currentDept.tech.map((t, i) => (
                <span key={i} className="nolan-tech-tag" style={{ borderColor: `${currentDept.color}44` }}>{t}</span>
              ))}
            </div>
            <div className="nolan-dept-actions">
              <button
                className="nolan-btn-primary interactive jarvis-engage-btn"
                style={{ background: currentDept.color, color: '#000' }}
                onClick={() => {
                  handleEngage(currentDept)
                }}
              >
                ENGAGE DEPARTMENT TERMINAL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLL HINT ── */}
      <div className="jarvis-scroll-hint">
        <div className="jarvis-scroll-icon">
          <div className="jarvis-scroll-wheel" />
        </div>
        <span>SCROLL TO NAVIGATE ORBITAL SYSTEMS</span>
      </div>
    </div>
  )
}
