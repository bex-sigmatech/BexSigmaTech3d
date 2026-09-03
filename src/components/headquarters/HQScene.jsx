import React, { useRef, useEffect, useState, Suspense, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
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
    color: '#7c3aed', emissive: '#4c1d95', pos: [3.4, 1.2, -2.5]
  },
  {
    id: 'cloud',
    title: 'Autonomous Applications',
    subtitle: 'Autonomous Application Matrix · Mobile & Desktop Software',
    desc: 'Flagship consumer & enterprise mobile apps engineered for speed, privacy, and seamless cross-platform performance.',
    tech: ['React Native', 'Flutter', 'Future Path AI', 'UrDay ESBI'],
    color: '#38bdf8', emissive: '#0369a1', pos: [2.5, -1.8, -4.0]
  },
  {
    id: 'client_projects',
    title: 'Our Client Projects',
    subtitle: 'Proven Case Studies, Enterprise Deployments & Client Success',
    desc: 'Explore real-world client platforms, AI workflow deployments, and high-impact digital solutions architected by BEX Sigma Tech.',
    tech: ['Enterprise Web', '3D WebGL', 'AI Agents', 'Cloud Systems'],
    color: '#f59e0b', emissive: '#b45309', pos: [-3.2, 1.6, -3.0]
  }
]

/* ─── Floating Particle Stars — LAGFREE: halved counts, GPU culled ─── */
function StarField() {
  const ref = useRef()
  const graphicsQuality = useStore(state => state.graphicsQuality)
  const count = graphicsQuality === 'low' ? 50 : 180

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
      ref.current.rotation.y = clock.getElapsedTime() * 0.006
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} color="#a8d8ff" transparent opacity={0.65} sizeAttenuation />
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
      ref.current.material.opacity = 0.18 + Math.sin(clock.getElapsedTime() * 0.8) * 0.08
    }
  })

  // Disable on low graphics to prevent lag
  if (graphicsQuality === 'low') return null

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.18} />
    </lineSegments>
  )
}

/* ─── Single Department Orb — Jarvis Style — LAGFREE ─── */
const _sharedVec3 = new THREE.Vector3()
const _freqCache = { data: null, t: 0 }
function _getVoiceEnergyCached(idx) {
  const now = performance.now()
  if (! _freqCache.data || now - _freqCache.t > 150) {
    _freqCache.data = liveVoiceClient.getFrequencyData()
    _freqCache.t = now
  }
  return (_freqCache.data[idx % _freqCache.data.length] || 0) / 255
}
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
    groupRef.current.position.y = dept.pos[1] + Math.sin(t * 0.7 + index * 1.2) * 0.14
    groupRef.current.position.x = dept.pos[0] + Math.sin(t * 0.5 + index * 0.9) * 0.05

    // Smooth continuous ring rotation
    if (outerRingRef.current) outerRingRef.current.rotation.z = t * (0.3 + index * 0.03)
    if (!isLow && innerRingRef.current) innerRingRef.current.rotation.z = -t * (0.45 + index * 0.02)

    // Audio-reactive voice modulation
    const voiceEnergy = (isActive || isHovered) ? _getVoiceEnergyCached(index) : 0

    // Sphere pulse — subtle, clean, elegant
    if (sphereRef.current && sphereRef.current.material) {
      const pulse = isActive
        ? 0.55 + Math.sin(t * 2.8) * 0.15 + voiceEnergy * 0.4
        : isHovered
          ? 0.38 + Math.sin(t * 2.2) * 0.1 + voiceEnergy * 0.25
          : 0.22 + Math.sin(t * 1.2 + index) * 0.05
      sphereRef.current.material.emissiveIntensity = pulse
    }

    // Scale on hover/active + voice reactivity
    const voiceScale = isActive ? voiceEnergy * 0.18 : 0
    const targetScale = (isActive ? 1.28 : isHovered ? 1.12 : 1.0) + voiceScale
    _sharedVec3.set(targetScale, targetScale, targetScale)
    groupRef.current.scale.lerp(_sharedVec3, 0.1)
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
      {/* Invisible hit sphere for easy clicks */}
      <mesh>
        <sphereGeometry args={[sphereSize * 1.8, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
      </mesh>

      {/* Main sleek planetary sphere body — FEATHERLIGHT Lambert shading (0ms PBR cost) */}
      <mesh ref={sphereRef} castShadow={false}>
        <sphereGeometry args={[
          sphereSize,
          index === 0 ? (isLow ? 20 : 32) : (isLow ? 16 : 24),
          index === 0 ? (isLow ? 20 : 32) : (isLow ? 16 : 24)
        ]} />
        <meshLambertMaterial
          color={dept.color}
          emissive={dept.emissive}
          emissiveIntensity={isActive ? 0.65 : 0.28}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Holographic sci-fi grid wireframe overlay */}
      {!isLow && (
        <mesh>
          <sphereGeometry args={[sphereSize * 1.015, 16, 16]} />
          <meshBasicMaterial color={dept.color} wireframe transparent opacity={isActive ? 0.25 : 0.08} />
        </mesh>
      )}

      {/* Ultra-smooth 3D Neon Orbit Ring 1 (Smooth, thin fiber-optic glowing ring) */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2.6, 0.25, 0]}>
        <torusGeometry args={[sphereSize * 1.38, 0.0055, 6, isLow ? 32 : 64]} />
        <meshBasicMaterial
          color={dept.color}
          transparent
          opacity={isActive ? 0.8 : 0.3}
        />
      </mesh>

      {/* Ultra-smooth Counter-Rotating Neon Ring 2 */}
      {!isLow && (
        <mesh ref={innerRingRef} rotation={[Math.PI / 3.2, -0.2, 0]}>
          <torusGeometry args={[sphereSize * 1.18, 0.004, 6, 48]} />
          <meshBasicMaterial
            color={dept.color}
            transparent
            opacity={isActive ? 0.55 : 0.15}
          />
        </mesh>
      )}
    </group>
  )
}

/* ─── JARVIS Camera Controller — smooth zoom into active orb ─── */
function JarvisCameraController({ activeIndex, departments, entryPhase = 1, isZooming }) {
  const { camera } = useThree()
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const isOverview = activeIndex === 0
  const dept = departments[activeIndex] || departments[0]
  const [px, py, pz] = dept.pos

  const baseDist = isMobile ? (isOverview ? 6.4 : 4.8) : (isOverview ? 5.6 : 5.0)
  const dist = isZooming ? baseDist * 0.75 : baseDist

  const targetRef = useRef({
    x: px * (isMobile ? 0.08 : 0.35),
    y: isMobile ? (isOverview ? 0.85 : py * 0.15 + 0.85) : (py * 0.25 + 0.25),
    z: pz + dist,
    lx: px,
    ly: isMobile ? (isOverview ? -0.3 : py - 0.45) : py,
    lz: pz,
  })

  useEffect(() => {
    const d = departments[activeIndex] || departments[0]
    const [dpx, dpy, dpz] = d.pos
    const dIsOverview = activeIndex === 0
    const dBaseDist = isMobile ? (dIsOverview ? 6.4 : 4.8) : (dIsOverview ? 5.6 : 5.0)
    const dDist = isZooming ? dBaseDist * 0.75 : dBaseDist

    targetRef.current = {
      x: dpx * (isMobile ? 0.08 : 0.35),
      y: isMobile ? (dIsOverview ? 0.85 : dpy * 0.15 + 0.85) : (dpy * 0.25 + 0.25),
      z: dpz + dDist,
      lx: dpx,
      ly: isMobile ? (dIsOverview ? -0.3 : dpy - 0.45) : dpy,
      lz: dpz,
    }
  }, [activeIndex, departments, isZooming, isMobile])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const tgt = targetRef.current

    let entryOffset = 0
    if (entryPhase < 1) {
      entryOffset = (1 - entryPhase) * 6
    }

    const lerpSpeed = isZooming ? 0.09 : 0.07
    camera.position.x += (tgt.x - camera.position.x) * lerpSpeed
    camera.position.y += (tgt.y - camera.position.y) * lerpSpeed
    camera.position.z += (tgt.z + entryOffset - camera.position.z) * lerpSpeed

    camera.position.x += Math.sin(t * 0.25) * 0.005
    camera.position.y += Math.cos(t * 0.18) * 0.004

    camera.lookAt(tgt.lx, tgt.ly, tgt.lz)
  })

  return null
}

/* ─── Floating orbit ring particles around central orb — Clean & Light ─── */
function OrbParticleRing({ color, radius, count = 24, speed = 0.4, tiltX = Math.PI / 2 }) {
  const ref = useRef()
  const graphicsQuality = useStore(state => state.graphicsQuality)
  const effCount = graphicsQuality === 'low' ? Math.floor(count * 0.5) : count

  const positions = useMemo(() => {
    const arr = new Float32Array(effCount * 3)
    for (let i = 0; i < effCount; i++) {
      const angle = (i / effCount) * Math.PI * 2
      arr[i * 3 + 0] = Math.cos(angle) * radius
      arr[i * 3 + 1] = Math.sin(angle) * radius
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [effCount, radius])

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
      <pointsMaterial size={0.035} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

/* ─── Central JARVIS Core — Smooth, Light, and Clean 3D Neon Torus Matrix ─── */
function JarvisCentralCore() {
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ring1.current) ring1.current.rotation.z = t * 0.25
    if (ring2.current) ring2.current.rotation.z = -t * 0.35
    if (ring3.current) ring3.current.rotation.x = t * 0.15
  })

  const isLow = useStore(state => state.graphicsQuality) === 'low'
  return (
    <group position={[0, 0, 0]}>
      {/* Clean glowing 3D neon fiber rings — perfectly smooth, zero clipping */}
      <mesh ref={ring1} rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[1.65, 0.005, 6, isLow ? 36 : 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3.2, -0.25, 0]}>
        <torusGeometry args={[2.15, 0.004, 6, isLow ? 36 : 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.2} />
      </mesh>
      {!isLow && (
        <mesh ref={ring3} rotation={[Math.PI / 5.5, 0.15, 0]}>
          <torusGeometry args={[2.65, 0.0035, 6, 48]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.12} />
        </mesh>
      )}

      {/* Gentle micro-dust orbit trails */}
      <OrbParticleRing color="#00d4ff" radius={1.85} count={20} speed={0.35} tiltX={Math.PI / 2.2} />
      <OrbParticleRing color="#38bdf8" radius={2.35} count={14} speed={-0.25} tiltX={Math.PI / 3.2} />
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HQ SCENE EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function HQScene() {
  const { userName, openMissionBriefing, graphicsQuality, setGraphicsQuality, scene } = useStore()
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [entryPhase] = useState(1)
  const [isZooming, setIsZooming] = useState(false)
  const [isTabVisible, setIsTabVisible] = useState(typeof document !== 'undefined' ? document.visibilityState === 'visible' : true)
  const hqVoiceSpokenRef = useRef(false)

  // Listen to tab visibility — pauses 3D loop completely when user switches tabs (saves 100% CPU/battery)
  useEffect(() => {
    const handleVis = () => setIsTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVis)
    return () => document.removeEventListener('visibilitychange', handleVis)
  }, [])

  // Ref mirror to avoid stale closure in listeners (fixes "sometimes not working")
  const isZoomingRef = useRef(false)
  const activeIndexRef = useRef(0)
  useEffect(() => { isZoomingRef.current = isZooming }, [isZooming])
  useEffect(() => { activeIndexRef.current = activeIndex }, [activeIndex])

  const handleEngage = useCallback((dept) => {
    if (!dept) return
    if (isZoomingRef.current) return
    isZoomingRef.current = true
    setIsZooming(true)
    try { cinemaAudio.playOrbSelect() } catch (e) {}
    try { voiceEmitter.emit('SERVICE_CLICK', { sectorId: dept.id }) } catch {}

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
        setTimeout(() => {
          isZoomingRef.current = false
          setIsZooming(false)
        }, 150)
      }
    }, 220)
  }, [openMissionBriefing])

  // Immediately reset zoom when returning to headquarters from briefing/dashboard
  useEffect(() => {
    isZoomingRef.current = false
    setIsZooming(false)
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

  // Auto welcome audio on HQ entrance — once per session
  useEffect(() => {
    if (scene === 'headquarters' && !hqVoiceSpokenRef.current) {
      hqVoiceSpokenRef.current = true
      const timer = setTimeout(() => {
        try {
          voiceEmitter.emit('HQ_SCENE_ACTIVE')
          aiVoice.speak(
            `Welcome to BEx Sigma Tech Headquarters. Core orbital systems are nominal. Select an active division to initiate protocol.`
          )
        } catch {}
      }, 900)
      return () => clearTimeout(timer)
    }
  }, [scene])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveIndex((prev) => (prev + 1) % DEPARTMENTS.length)
        cinemaAudio.playSectorTransition()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveIndex((prev) => (prev - 1 + DEPARTMENTS.length) % DEPARTMENTS.length)
        cinemaAudio.playSectorTransition()
      } else if (e.key === 'Enter') {
        handleEngage(DEPARTMENTS[activeIndexRef.current])
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleEngage])

  const currentDept = DEPARTMENTS[activeIndex] || DEPARTMENTS[0]
  const activeDept = currentDept

  return (
    <div className="hq-fullscreen-container">
      {/* ── TOP SCI-FI STATUS BAR ── */}
      <header className="nolan-hq-header">
        <div className="hq-header-left">
          <div className="hq-brand-title">BEx Sigma Tech</div>
          <div className="hq-brand-sub">ORBITAL RESEARCH HEADQUARTERS</div>
        </div>

        <div className="hq-header-right">
          <div className="hq-operator-pill">
            <span className="hq-operator-dot" />
            <span className="hq-operator-label">OPERATOR:</span>
            <span className="hq-operator-name">{userName || 'GUEST'}</span>
          </div>

          <div className="hq-sector-counter">
            0{activeIndex + 1} / 0{DEPARTMENTS.length}
          </div>
        </div>
      </header>

      {/* ── 3D JARVIS ORBS CANVAS — ULTRA-SMOOTH: capped DPR, zero MSAA ── */}
      <div className="hq-3d-canvas-wrapper">
        <Canvas
          camera={{ position: [0, 0.5, 6], fov: 55 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          dpr={graphicsQuality === 'low' ? [1, 1] : [1, 1.25]}
          performance={{ min: 0.5 }}
          frameloop="always"
        >
          <color attach="background" args={['#020812']} />
          <fog attach="fog" args={['#020812', 22, 55]} />

          {/* Featherlight Sci-Fi Lighting: Zero-Overhead Ambient + Directional */}
          <ambientLight intensity={0.45} color="#0c1e3a" />
          <directionalLight position={[5, 8, 8]} intensity={0.65} color="#00d4ff" />
          <directionalLight position={[-6, -4, -4]} intensity={0.35} color="#7c3aed" />

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
          </Suspense>
        </Canvas>
        {/* Hardware-accelerated CSS Vignette Overlay (0ms GPU, 0 WebGL crash risk) */}
        <div className="hq-vignette-overlay" />
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
