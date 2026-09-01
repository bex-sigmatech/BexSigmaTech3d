import React, { useRef, useEffect, useState, Suspense, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import { liveVoiceClient } from '../../audio/GeminiLiveClient'

/* ==========================================================================
   BEX SIGMA TECH — JARVIS ORBITAL SPHERE INTERFACE
   No robot · No scroll walking · Camera zooms into department orbs
   Floating glowing spheres arranged in 3D space like JARVIS / Iron Man HUD
   ========================================================================== */

const DEPARTMENTS = [
  {
    id: 'mission_control',
    title: 'Mission Control',
    subtitle: 'BEx Sigma Tech — Core Command & Company Hub',
    desc: 'Central hub of BEx Sigma Tech — we build software, websites, 3D websites, applications, digital marketing, content creation, AI automation and custom generated notes. Your idea, our end-to-end execution.',
    tech: ['Software', 'Websites', '3D Web', 'AI Automation', 'Digital Marketing', 'Content'],
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
    id: 'cloud',
    title: 'Autonomous Applications',
    subtitle: 'Autonomous Application Matrix · Mobile & Desktop Software',
    desc: 'Flagship consumer & enterprise mobile apps engineered for speed, privacy, and seamless cross-platform performance.',
    tech: ['React Native', 'Flutter', 'Future Path AI', 'UrDay ESBI'],
    color: '#38bdf8', emissive: '#0369a1', pos: [4.0, -2.5, -6]
  },
  {
    id: 'client_projects',
    title: 'Our Client Projects',
    subtitle: 'Proven Case Studies, Enterprise Deployments & Client Success',
    desc: 'Explore real-world client platforms, AI workflow deployments, and high-impact digital solutions architected by BEX Sigma Tech.',
    tech: ['Enterprise Web', '3D WebGL', 'AI Agents', 'Cloud Systems'],
    color: '#f59e0b', emissive: '#b45309', pos: [-5.2, 2.0, -4]
  },
  {
    id: 'ai_auto',
    title: 'AI Automation',
    subtitle: 'Autonomous Multimodal Agent Matrix',
    desc: 'Self-evolving cognitive systems automating planetary infrastructure and mission synthesis.',
    tech: ['Agentic Cognitive AI', 'Neural Synthesis', 'LLM Automation'],
    color: '#00ff88', emissive: '#00aa55', pos: [-4.2, -1.8, -7]
  },
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

    // Audio-reactive voice modulation
    const freq = liveVoiceClient.getFrequencyData()
    const voiceEnergy = (freq[index % freq.length] || 0) / 255

    // Sphere pulse
    if (sphereRef.current && sphereRef.current.material) {
      const pulse = isActive
        ? 0.75 + Math.sin(t * 3) * 0.25 + voiceEnergy * 0.8
        : isHovered
          ? 0.5 + Math.sin(t * 2.5) * 0.15 + voiceEnergy * 0.5
          : 0.25 + Math.sin(t * 1.5 + index) * 0.1 + voiceEnergy * 0.2
      sphereRef.current.material.emissiveIntensity = pulse
    }

    // Scale on hover/active + voice reactivity
    const voiceScale = isActive ? voiceEnergy * 0.25 : 0
    const targetScale = (isActive ? 1.35 : isHovered ? 1.15 : 1.0) + voiceScale
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  const sphereSize = index === 0 ? 0.85 : 0.52

  return (
    <group
      ref={groupRef}
      position={[dept.pos[0], dept.pos[1], dept.pos[2]]}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
      onPointerDown={(e) => { e.stopPropagation() }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        onHover(index)
        try { cinemaAudio.playOrbHover() } catch {}
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
        onLeave()
      }}
      onPointerMissed={() => onLeave()}
    >
      {/* Invisible larger hit sphere — makes orb click reliable even while floating/camera lerps */}
      <mesh>
        <sphereGeometry args={[sphereSize * 1.9, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
      </mesh>
      {/* Outer glow aura — smooth high-subdivision spherical aura */}
      {!isLow && (
        <mesh>
          <sphereGeometry args={[sphereSize * 1.45, 48, 48]} />
          <meshBasicMaterial color={dept.color} transparent opacity={isActive ? 0.035 : 0.012} />
        </mesh>
      )}

      {/* Main sphere body — glossy spatial 3D glass */}
      <mesh ref={sphereRef} castShadow>
        <sphereGeometry args={[sphereSize, isLow ? 24 : 64, isLow ? 24 : 64]} />
        <meshPhysicalMaterial
          color={dept.color}
          emissive={dept.emissive}
          emissiveIntensity={isActive ? 0.6 : 0.2}
          roughness={0.12}
          metalness={0.25}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          transmission={0.25}
          transparent
          opacity={0.94}
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

    // Desktop: 5.6 units distance gives deep perspective with full orbital visibility; Mobile: 3.6
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const dist = isZooming ? 0.35 : (isMobile ? 3.6 : 5.6)
    targetRef.current = {
      x: px * (isMobile ? 0.15 : 0.35),
      y: py * 0.25 + (isMobile ? -0.2 : 0.25),
      z: pz + dist,
      lx: px,
      ly: py + (isMobile ? 0.4 : 0),
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
  const { userName, openMissionBriefing, graphicsQuality, scene } = useStore()
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [entryPhase, setEntryPhase] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const hqVoiceSpokenRef = useRef(false)
  // Ref mirror to avoid stale closure in listeners (fixes "sometimes not working")
  const isZoomingRef = useRef(false)
  const activeIndexRef = useRef(0)
  useEffect(() => { isZoomingRef.current = isZooming }, [isZooming])
  useEffect(() => { activeIndexRef.current = activeIndex }, [activeIndex])

  const handleEngage = useCallback((dept) => {
    if (!dept) return
    if (isZoomingRef.current) {
      console.debug('[HQScene] engage blocked — still zooming', dept.id)
      return
    }
    isZoomingRef.current = true
    setIsZooming(true)
    try { cinemaAudio.playOrbSelect() } catch (e) { console.warn('playOrbSelect failed', e) }
    try { voiceEmitter.emit('SERVICE_CLICK', { sectorId: dept.id }) } catch {}
    const delay = 700 // reduced from 900 for snappier feel
    setTimeout(() => {
      try {
        if (dept.id === 'web_dev') {
          cinemaAudio.setScene('webdev_store')
          useStore.setState({ scene: 'webdev_store', activeMission: { id: 'web_dev', title: 'Web Development' } })
        } else if (dept.id === 'cloud' || dept.id === 'apps') {
          cinemaAudio.setScene('apps_store')
          useStore.setState({ scene: 'apps_store', activeMission: { id: 'cloud', title: 'Autonomous Applications' } })
        } else if (dept.id === 'client_projects') {
          cinemaAudio.setScene('headquarters')
          useStore.setState({ scene: 'client_projects_showcase', activeMission: { id: 'client_projects', title: 'Our Client Projects' } })
        } else {
          openMissionBriefing(dept)
        }
      } finally {
        // keep zoom lock until transition finishes, but release ref after scene settles
        setTimeout(() => {
          isZoomingRef.current = false
          setIsZooming(false)
        }, 400)
      }
    }, delay)
  }, [openMissionBriefing])

  // Reset zoom when returning to headquarters from briefing/dashboard
  useEffect(() => {
    if (scene === 'headquarters') {
      const t = setTimeout(() => {
        isZoomingRef.current = false
        setIsZooming(false)
      }, 300)
      return () => clearTimeout(t)
    } else {
      // when leaving HQ (e.g. mission_briefing) immediately release lock so reopen is not blocked
      isZoomingRef.current = false
      setIsZooming(false)
    }
  }, [scene])

  // Voice Navigation listener — stable, no stale isZooming
  useEffect(() => {
    const handleVoiceNav = (e) => {
      const sectorId = e.detail
      if (!sectorId) return
      const idx = DEPARTMENTS.findIndex(d => d.id === sectorId || (sectorId === 'store' && d.id === 'web_dev'))
      if (idx !== -1) {
        setActiveIndex(idx)
        setTimeout(() => {
          handleEngage(DEPARTMENTS[idx])
        }, 450)
      }
    }
    window.addEventListener('NAVIGATE_SECTOR', handleVoiceNav)
    return () => window.removeEventListener('NAVIGATE_SECTOR', handleVoiceNav)
  }, [handleEngage])

  // Keydown Enter listener to trigger engage — use ref to avoid re-registering
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const dept = DEPARTMENTS[activeIndexRef.current]
        handleEngage(dept)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleEngage])


  // Cinematic entry — camera flies in from far smoothly
  useEffect(() => {
    let start = null
    const duration = 1200
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

  // Scroll → cycle through departments — ignore when hovering interactive panel/canvas button
  useEffect(() => {
    let lastScroll = 0
    const handleWheel = (e) => {
      // Don't hijack scroll when user is interacting with panel/minimap/modal
      const target = e.target
      if (target && target.closest && target.closest('.jarvis-dept-panel, .jarvis-orb-minimap, .mc-page-overlay, .webdev-store-container')) return
      // Don't cycle while zooming into a sector
      if (isZoomingRef.current) return
      const now = Date.now()
      if (now - lastScroll < 320) return // throttle slightly reduced
      lastScroll = now
      if (Math.abs(e.deltaY) > 12) {
        if (e.deltaY > 0) {
          setActiveIndex(prev => {
            const next = Math.min(prev + 1, DEPARTMENTS.length - 1)
            if (next !== prev) try { cinemaAudio.playScrollTransition() } catch {}
            return next
          })
        } else {
          setActiveIndex(prev => {
            const next = Math.max(prev - 1, 0)
            if (next !== prev) try { cinemaAudio.playScrollTransition() } catch {}
            return next
          })
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // Touch swipe → cycle through departments on mobile — ignore touches that start on interactive panel
  useEffect(() => {
    let touchStartY = 0
    let touchStartX = 0
    let lastSwipe = 0
    let ignoreSwipe = false

    const handleTouchStart = (e) => {
      const target = e.target
      if (target && target.closest && target.closest('.jarvis-dept-panel, .jarvis-orb-minimap, .mc-page-overlay, .webdev-store-container, .jarvis-engage-btn')) {
        ignoreSwipe = true
        return
      }
      ignoreSwipe = false
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
      if (ignoreSwipe) return
      if (isZoomingRef.current) return
      const now = Date.now()
      if (now - lastSwipe < 400) return // throttle

      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY - touchEndY
      const deltaX = touchStartX - touchEndX

      // Use the axis with larger movement
      const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX
      const threshold = 42 // minimum px swipe distance

      if (Math.abs(delta) > threshold) {
        lastSwipe = now
        if (delta > 0) {
          // Swipe up or left → next department
          setActiveIndex(prev => {
            const next = Math.min(prev + 1, DEPARTMENTS.length - 1)
            if (next !== prev) try { cinemaAudio.playScrollTransition() } catch {}
            return next
          })
        } else {
          // Swipe down or right → previous department
          setActiveIndex(prev => {
            const next = Math.max(prev - 1, 0)
            if (next !== prev) try { cinemaAudio.playScrollTransition() } catch {}
            return next
          })
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])


  const currentDept = DEPARTMENTS[activeIndex]

  return (
    <div className="hq-cinematic-container">
      {/* Deep space background */}
      <div className="jarvis-space-bg" />

      {/* Header */}
      <header className="nolan-hq-header">
        <div className="nolan-hq-brand">
          <span className="nolan-brand-title">BEx Sigma Tech</span>
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
          camera={{ position: [0, 0.5, 14], fov: 55 }}
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

            {/* All department orbs — click selects then engages; debounce prevents double fire */}
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
                  // if already active, engage immediately; otherwise select then engage after camera settles
                  if (idx === activeIndexRef.current) {
                    handleEngage(dept)
                  } else {
                    setActiveIndex(idx)
                    setTimeout(() => handleEngage(dept), 220)
                  }
                }}
              />
            ))}

            {/* Sci-Fi Post-Processing Pipeline — 10/10 mobile keeps soft bloom (0.35) instead of off */}
            <EffectComposer disableNormalPass>
              <Bloom
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                intensity={graphicsQuality === 'low' ? 0.35 : 1.1}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.1} darkness={graphicsQuality === 'low' ? 0.45 : 0.6} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* ── RESPONSIVE CYBER HUD CAPSULE DOCK ── */}
      <div className="hq-bottom-dock">
        {/* ── 1. ORBIT SECTOR MINI-MAP ── */}
        <div className="jarvis-orb-minimap">
          {DEPARTMENTS.map((dept, idx) => (
            <button
              key={dept.id}
              className={`jarvis-minimap-item interactive ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                if (idx !== activeIndex) cinemaAudio.playSectorTransition()
                setActiveIndex(idx)
              }}
              title={`Switch to ${dept.title}`}
            >
              <span
                className="jarvis-minimap-dot"
                style={{
                  background: idx === activeIndex ? dept.color : 'rgba(255,255,255,0.2)',
                  boxShadow: idx === activeIndex ? `0 0 10px ${dept.color}` : 'none',
                }}
              />
              <span className="jarvis-minimap-num">{String(idx + 1).padStart(2, '0')}</span>
              <span className="jarvis-minimap-label">{dept.title}</span>
            </button>
          ))}
        </div>

        {/* ── 2. CYBER HUD DEPARTMENT CAPSULE ── */}
        <div
          className="jarvis-dept-panel jarvis-capsule-pattern"
          key={currentDept.id}
          style={{ '--dept-color': currentDept.color }}
        >
          {/* Previous Sector Button */}
          <button
            className="jarvis-capsule-nav-btn prev interactive"
            onClick={(e) => {
              e.stopPropagation()
              cinemaAudio.playScrollTransition()
              setActiveIndex((prev) => (prev > 0 ? prev - 1 : DEPARTMENTS.length - 1))
            }}
            title="Previous Sector"
            aria-label="Previous Sector"
          >
            ‹
          </button>

          {/* Holographic Glowing Orb Badge */}
          <div className="jarvis-capsule-orb-wrap">
            <div
              className="jarvis-capsule-orb"
              style={{
                background: `radial-gradient(circle, ${currentDept.color}33 0%, rgba(2,6,16,0.9) 70%)`,
                borderColor: currentDept.color,
                boxShadow: `0 0 16px ${currentDept.color}66`,
              }}
            >
              <span className="jarvis-capsule-orb-icon">✦</span>
            </div>
            <span className="jarvis-capsule-pulse-ring" style={{ borderColor: currentDept.color }} />
          </div>

          {/* Department Meta & Title */}
          <div className="jarvis-capsule-info">
            <div className="jarvis-capsule-eyebrow">
              <span className="jarvis-capsule-tag" style={{ color: currentDept.color }}>
                SECTOR {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="jarvis-capsule-status-dot" style={{ background: currentDept.color }} />
              <span className="jarvis-capsule-protocol">ONLINE</span>
            </div>
            <h2 className="jarvis-capsule-title" style={{ color: currentDept.color }}>
              {currentDept.title}
            </h2>
            <div className="jarvis-capsule-subtitle">{currentDept.subtitle}</div>
          </div>

          {/* Quick Engage Button */}
          <button
            className="jarvis-capsule-engage-btn interactive"
            style={{
              background: currentDept.color,
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleEngage(currentDept)
            }}
            disabled={isZooming}
            title={isZooming ? 'Initializing…' : `Enter ${currentDept.title}`}
          >
            <span className="jarvis-capsule-btn-text">
              {isZooming ? 'INITIALIZING…' : 'ENTER'}
            </span>
            <span className="jarvis-capsule-btn-arrow">⚡</span>
          </button>

          {/* Next Sector Button */}
          <button
            className="jarvis-capsule-nav-btn next interactive"
            onClick={(e) => {
              e.stopPropagation()
              cinemaAudio.playScrollTransition()
              setActiveIndex((prev) => (prev < DEPARTMENTS.length - 1 ? prev + 1 : 0))
            }}
            title="Next Sector"
            aria-label="Next Sector"
          >
            ›
          </button>
        </div>
      </div>

      {/* ── SCROLL / SWIPE HINT ── */}
      <div className="jarvis-scroll-hint">
        <div className="jarvis-scroll-icon">
          <div className="jarvis-scroll-wheel" />
        </div>
        <span className="scroll-hint-desktop">SCROLL TO NAVIGATE ORBITAL SYSTEMS</span>
        <span className="scroll-hint-mobile">SWIPE TO NAVIGATE ORBITAL SYSTEMS</span>
      </div>
    </div>
  )
}
