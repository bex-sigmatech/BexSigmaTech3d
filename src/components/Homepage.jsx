import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useStore } from '../store/useStore'
import '../styles/homepage.css'

/* ─── Cyber Tower Mainframe Block ─── */
function CyberTower({ pos, height, width, color }) {
  const ref = useRef()
  const y = pos[1] + height / 2

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = y + Math.sin(clock.elapsedTime * 0.3 + pos[0]) * 0.06
    }
  })

  return (
    <group ref={ref} position={[pos[0], y, pos[2]]}>
      {/* Tower Mesh */}
      <mesh>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.12}
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Cyber Edge Outlines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, width)]} />
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.4} />
      </lineSegments>

      {/* Neon Bands */}
      <mesh position={[0, height * 0.22, 0]}>
        <boxGeometry args={[width * 1.02, 0.04, width * 1.02]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -height * 0.22, 0]}>
        <boxGeometry args={[width * 1.02, 0.04, width * 1.02]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

/* ─── Glowing Agent Core Component ─── */
function AgentCore() {
  const coreRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const particleCoreRef = useRef()

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    
    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.4
      coreRef.current.rotation.x = elapsed * 0.2
      const scale = 1 + Math.sin(elapsed * 4.5) * 0.04
      coreRef.current.scale.set(scale, scale, scale)
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = elapsed * 0.75
      ring1Ref.current.rotation.z = elapsed * 0.25
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = elapsed * 0.55
      ring2Ref.current.rotation.y = -elapsed * 0.35
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = -elapsed * 0.45
      ring3Ref.current.rotation.x = elapsed * 0.65
    }

    if (particleCoreRef.current) {
      particleCoreRef.current.rotation.y = -elapsed * 0.18
    }
  })

  // Generate Neural Core Particles
  const points = useMemo(() => {
    const arr = []
    const count = 450
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = 0.45 + Math.random() * 0.2
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      arr.push(x, y, z)
    }
    return new Float32Array(arr)
  }, [])

  return (
    <group position={[0, 0.5, 0]}>
      {/* Geodesic holographic brain/core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={1.5} 
          wireframe
        />
      </mesh>

      {/* Solid Core Light */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Neural Link Particles */}
      <points ref={particleCoreRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            args={[points, 3]} 
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.035} 
          color="#a855f7" 
          transparent 
          opacity={0.8}
        />
      </points>

      {/* Rotating Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.7, 0.016, 8, 48]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={1.3} 
        />
      </mesh>

      {/* Rotating Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.85, 0.012, 6, 40]} />
        <meshStandardMaterial 
          color="#a855f7" 
          emissive="#a855f7" 
          emissiveIntensity={1.1} 
        />
      </mesh>

      {/* Rotating Ring 3 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.0, 0.009, 4, 32]} />
        <meshStandardMaterial 
          color="#ec4899" 
          emissive="#ec4899" 
          emissiveIntensity={0.9} 
        />
      </mesh>

      {/* Core Base Cylinder Grid */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.55, 0.85, 0.22, 32, 1, true]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#00d4ff" 
          emissiveIntensity={0.6} 
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

/* ─── Jarvis Blue laser links ─── */
function JarvisRays() {
  const ref = useRef()
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.4
    }
  })

  // Lines coordinates from core to target screens + environment
  const points = useMemo(() => {
    const pts = []
    const corePos = new THREE.Vector3(0, 0.5, 0)
    
    // Core anchors to Left/Right HUD screens
    pts.push(corePos, new THREE.Vector3(-2.8, 0.7, 2))
    pts.push(corePos, new THREE.Vector3(2.8, 0.7, 2))

    // Scanning lasers scattered in workspace grid
    const count = 16
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const target = new THREE.Vector3(
        Math.cos(angle) * 3.5,
        Math.sin(angle * 1.5) * 1.8,
        -2
      )
      pts.push(corePos, target)
    }

    return pts
  }, [])

  return (
    <group ref={ref}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]} 
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.25} 
          blending={THREE.AdditiveBlending} 
        />
      </lineSegments>
    </group>
  )
}

/* ─── Hologram Screen Backing ─── */
function HologramScreen({ position, rotation, children }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Outline edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2.2)]} />
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.4} />
      </lineSegments>
      
      {/* HUD background panel */}
      <mesh>
        <planeGeometry args={[3.2, 2.2]} />
        <meshBasicMaterial color="#001830" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Cybernetic Tech Corners */}
      <mesh position={[-1.6, 1.1, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.015]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[1.6, 1.1, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.015]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[-1.6, -1.1, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.015]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[1.6, -1.1, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.015]} />
        <meshBasicMaterial color="#00d4ff" />
      </mesh>

      {/* Projected HTML */}
      <Html transform distanceFactor={3} pointerEvents="auto">
        {children}
      </Html>
    </group>
  )
}

/* ─── HTML HUD Diagnostic Panels ─── */
function LeftHUD() {
  const [logs, setLogs] = useState([
    'SYS: Initializing neural array... OK',
    'SYS: Syncing with deep space array... OK',
    'SYS: Loading holographic modules... OK',
  ])

  useEffect(() => {
    const lines = [
      'SEC: Firewall integrity at 100%',
      'SYS: Cloud connection nodes synced',
      'SYS: Matrix decrypt engine ACTIVE',
      'AI: Agent memory loading... OK',
      'AI: Natural speech engine ONLINE',
      'SYS: Bex Sigma ready to interface',
      'SYS: Scanning local client matrix...',
      'NET: SSL connection secured: IPv6'
    ]
    let counter = 0
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, lines[counter % lines.length]]
        if (next.length > 5) next.shift()
        return next
      })
      counter++
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hologram-screen-content">
      <div className="hud-title-bar">
        <span className="hud-title">[SYS_DIAGNOSTICS]</span>
        <div className="hud-status-indicator">
          <span className="hud-pulse-dot" />
          <span>LIVE</span>
        </div>
      </div>
      <div className="hud-stats-grid">
        <div className="hud-stat-box">
          <div className="hud-stat-label">AI Engine</div>
          <div className="hud-stat-value">98.4%</div>
        </div>
        <div className="hud-stat-box">
          <div className="hud-stat-label">Response</div>
          <div className="hud-stat-value">8ms</div>
        </div>
      </div>
      <div className="hud-log-window">
        {logs.map((log, idx) => (
          <div key={idx} className={`hud-log-line ${log.startsWith('SEC:') || log.includes('OK') ? 'hud-log-line-success' : ''}`}>
            &gt; {log}
          </div>
        ))}
      </div>
    </div>
  )
}

function RightHUD() {
  const services = [
    '01. AI & NEURAL MODELS',
    '02. IMMERSIVE 3D GRAPHICS',
    '03. ENTERPRISE CYBER DEFENSE',
    '04. SCALE CLOUD ARCHITECTURE'
  ]
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % services.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hologram-screen-content">
      <div className="hud-title-bar">
        <span className="hud-title">[PROJECTED_SOLUTIONS]</span>
        <span className="hud-status-indicator" style={{ color: '#a855f7' }}>INDEX_V9</span>
      </div>
      <div className="hud-menu-list">
        {services.map((service, idx) => (
          <div 
            key={idx} 
            className="hud-menu-item" 
            style={{ 
              borderColor: activeIdx === idx ? 'rgba(0, 212, 255, 0.8)' : 'rgba(0, 212, 255, 0.1)',
              background: activeIdx === idx ? 'rgba(0, 212, 255, 0.15)' : 'rgba(0, 212, 255, 0.04)',
              color: activeIdx === idx ? '#fff' : '#00d4ff'
            }}
          >
            <span>{service}</span>
            <span className="hud-menu-bullet">▶</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Particles Environment ─── */
function Particles({ count = 800 }) {
  const ref = useRef()

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const p = new Float32Array(count * 3)
    const c = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 35
      p[i * 3 + 1] = (Math.random() - 0.5) * 22
      p[i * 3 + 2] = (Math.random() - 0.5) * 35
      const t = Math.random()
      const col = new THREE.Color().setHSL(0.55 + t * 0.18, 0.8, 0.6)
      c[i * 3] = col.r
      c[i * 3 + 1] = col.g
      c[i * 3 + 2] = col.b
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3))
    return g
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.015
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.04) * 0.08
    }
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Cyberplatform floor grid ─── */
function CyberPlatform() {
  const groupRef = useRef()
  const grid = useMemo(() => new THREE.GridHelper(60, 60, new THREE.Color('#00d4ff'), new THREE.Color('#1a1a3a')), [])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.z = (clock.elapsedTime * 0.4) % 2
    }
  })

  return (
    <group>
      {/* Concentric Base Rings */}
      <mesh position={[0, -2.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.55, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -2.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 3.85, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Shifting Grid */}
      <group ref={groupRef} position={[0, -3, 0]}>
        <primitive object={grid} />
      </group>
    </group>
  )
}

/* ─── Camera flythrough + parallax ─── */
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const introCompleteRef = useRef(false)

  useEffect(() => {
    // Initial camera position (High Orbit)
    camera.position.set(0, 25, 18)
    camera.lookAt(0, 0.5, 0)

    // Cinematic entry fly-in
    gsap.to(camera.position, {
      x: 0,
      y: 0.8,
      z: 7.2,
      duration: 4.5,
      ease: "power2.inOut",
      onComplete: () => {
        introCompleteRef.current = true
      }
    })

    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [camera])

  useFrame(() => {
    if (introCompleteRef.current) {
      // Parallax effect after intro completes
      const targetX = mouse.current.x * 2.5
      const targetY = 0.8 + -mouse.current.y * 1.5
      const targetZ = 7.2 + mouse.current.y * 0.8
      camera.position.x += (targetX - camera.position.x) * 0.05
      camera.position.y += (targetY - camera.position.y) * 0.05
      camera.position.z += (targetZ - camera.position.z) * 0.05
    }
    // Always look at the agent core
    camera.lookAt(0, 0.5, 0)
  })

  return null
}

/* ─── Scene ─── */
function SceneContent() {
  const graphicsQuality = useStore(state => state.graphicsQuality)
  const particleCount = graphicsQuality === 'low' ? 250 : 1000
  const starCount = graphicsQuality === 'low' ? 800 : 3000

  return (
    <>
      <fog attach="fog" args={['#0a0a1a', 8, 35]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#00d4ff" intensity={2} distance={20} />
      <pointLight position={[-5, 3, -5]} color="#a855f7" intensity={1.5} distance={15} />
      <pointLight position={[0, -2, 3]} color="#ec4899" intensity={1.2} distance={10} />
      
      <CameraRig />
      
      {/* Central Holographic Agent */}
      <AgentCore />
      <JarvisRays />

      {/* Floating Hologram HUD Panels */}
      <HologramScreen position={[-2.8, 0.7, 2]} rotation={[0, 0.45, 0]}>
        <LeftHUD />
      </HologramScreen>

      <HologramScreen position={[2.8, 0.7, 2]} rotation={[0, -0.45, 0]}>
        <RightHUD />
      </HologramScreen>

      {/* Cybertower blocks representing Headquarters server grid */}
      <CyberTower pos={[-6, -3, -8]} height={4} width={1.2} color="#0a1628" />
      <CyberTower pos={[-4, -3, -10]} height={6} width={1.5} color="#0d1b2a" />
      <CyberTower pos={[-2, -3, -7]} height={3} width={1} color="#1b2838" />
      <CyberTower pos={[0, -3, -12]} height={8} width={2} color="#0a1628" />
      <CyberTower pos={[2, -3, -9]} height={5} width={1.3} color="#0d1b2a" />
      <CyberTower pos={[4, -3, -11]} height={7} width={1.8} color="#1b2838" />
      <CyberTower pos={[6, -3, -8]} height={3.5} width={1.1} color="#0a1628" />
      <CyberTower pos={[-3, -3, -14]} height={5.5} width={1.4} color="#0d1b2a" />
      <CyberTower pos={[3, -3, -15]} height={9} width={2} color="#1b2838" />

      <Particles count={particleCount} />
      <CyberPlatform />
      <Stars radius={100} depth={50} count={starCount} factor={3} saturation={0.5} fade speed={1} />
    </>
  )
}

function Scene3D() {
  const graphicsQuality = useStore(state => state.graphicsQuality)
  return (
    <Canvas
      camera={{ position: [0, 25, 18], fov: 60 }}
      gl={{ antialias: graphicsQuality !== 'low', alpha: true, powerPreference: 'high-performance' }}
      dpr={graphicsQuality === 'low' ? [1, 1.25] : [1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color('#0a0a1a'), 1)
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}

/* ─── Glass Card ─── */
function GlassCard({ children, delay = 0 }) {
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Navigation ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <div className="nav-logo">
        <span className="nav-logo-bex">BEX</span>
        <span className="nav-logo-sigma">SIGMA</span>
      </div>
      <div className="nav-links">
        <a href="#solutions" className="nav-link">Solutions</a>
        <a href="#tech" className="nav-link">Technology</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link nav-link-cta">Connect</a>
      </div>
    </motion.nav>
  )
}

/* ─── Hero ─── */
function HeroSection() {
  const { enterCinematic } = useStore()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero-section" id="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <motion.div className="hero-badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.6 }}>
          <span className="badge-dot" />
          AI-POWERED SOLUTIONS
        </motion.div>

        <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
          Building the<br />
          <span className="hero-gradient">Digital Future</span>
        </motion.h1>

        <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }}>
          We architect next-generation experiences that push the boundaries of what’s possible with AI, immersive design, and cutting-edge technology.
        </motion.p>

        <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}>
          <button className="btn-primary" id="explore-btn" onClick={() => scrollTo('solutions')}>
            <span>Explore Our Work</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10H14M14 10L10 6M14 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="btn-secondary" id="demo-btn" onClick={enterCinematic}>Enter Cinematic Experience ▸▸</button>
        </motion.div>

        <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}>
          <div className="stat-item"><span className="stat-value">150+</span><span className="stat-label">Projects Delivered</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-value">98%</span><span className="stat-label">Client Satisfaction</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><span className="stat-value">24/7</span><span className="stat-label">AI Support</span></div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ─── Solutions ─── */
function SolutionsSection() {
  const items = [
    { icon: '🧠', title: 'AI & Machine Learning', desc: 'Custom AI models, neural networks, and intelligent automation systems tailored to your business needs.' },
    { icon: '🌐', title: 'Immersive Web Experiences', desc: 'Award-winning web applications with 3D graphics, WebGL, and cinematic interactions.' },
    { icon: '⚡', title: 'Cloud Architecture', desc: 'Scalable, secure cloud infrastructure that grows with your business.' },
    { icon: '🔒', title: 'Cybersecurity', desc: 'Enterprise-grade security solutions with AI-powered threat detection and real-time monitoring.' },
    { icon: '📱', title: 'Mobile Innovation', desc: 'Native and cross-platform mobile apps with beautiful UIs and seamless performance.' },
    { icon: '🎮', title: 'Interactive Experiences', desc: 'Gamified platforms, AR/VR solutions, and interactive digital experiences that captivate users.' },
  ]

  return (
    <section className="section solutions-section" id="solutions">
      <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <span className="section-label">WHAT WE DO</span>
        <h2 className="section-title">Our Solutions</h2>
        <p className="section-desc">Pioneering technology solutions that transform industries and redefine digital experiences.</p>
      </motion.div>
      <div className="solutions-grid">
        {items.map((s, i) => (
          <GlassCard key={i} delay={0.1 * i}>
            <div className="solution-icon">{s.icon}</div>
            <h3 className="solution-title">{s.title}</h3>
            <p className="solution-desc">{s.desc}</p>
            <div className="solution-link">
              Learn more
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8H12M12 8L8 4M12 8L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

/* ─── Tech Stack ─── */
function TechSection() {
  const techs = ['TensorFlow', 'PyTorch', 'React', 'Three.js', 'Node.js', 'Kubernetes', 'Rust', 'WebGL']

  return (
    <section className="section tech-section" id="tech">
      <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <span className="section-label">TECHNOLOGY</span>
        <h2 className="section-title">Our Tech Stack</h2>
        <p className="section-desc">Built on a foundation of cutting-edge technologies and frameworks.</p>
      </motion.div>
      <div className="tech-grid">
        {techs.map((t, i) => (
          <motion.div key={i} className="tech-chip" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.05 * i }} viewport={{ once: true }} whileHover={{ scale: 1.08, y: -3 }}>
            <span className="tech-name">{t}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── About Section ─── */
function AboutSection() {
  const values = [
    { icon: '🛡️', title: 'Security First', desc: 'Post-quantum cryptography and zero-trust architectures built into every layer.' },
    { icon: '🧠', title: 'AI Native', desc: 'Every product is powered by large language models and autonomous AI agents.' },
    { icon: '🚀', title: 'Mission Driven', desc: 'We build technology that moves humanity toward a more connected, intelligent future.' },
    { icon: '⚡', title: 'Zero Latency', desc: 'Engineered for speed — sub-10ms response times across all systems.' },
  ]
  return (
    <section className="section" id="about" style={{ padding: '100px 0', background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.03) 50%, transparent)' }}>
      <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <span className="section-label">WHO WE ARE</span>
        <h2 className="section-title">About BEX Sigma Tech</h2>
        <p className="section-desc" style={{ maxWidth: '640px' }}>
          Founded in 2024, BEX Sigma Tech is a next-generation technology studio specialising in AI systems, immersive 3D web experiences, and enterprise-grade cloud architecture. We build products that redefine what’s possible.
        </p>
      </motion.div>
      <div className="solutions-grid" style={{ marginTop: '48px' }}>
        {values.map((v, i) => (
          <GlassCard key={i} delay={0.1 * i}>
            <div className="solution-icon">{v.icon}</div>
            <h3 className="solution-title">{v.title}</h3>
            <p className="solution-desc">{v.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CTASection() {
  const { enterCinematic } = useStore()
  return (
    <section className="section cta-section" id="contact">
      <motion.div className="cta-content" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <h2 className="cta-title">Ready to Build the<span className="cta-gradient"> Future</span>?</h2>
        <p className="cta-desc">Let’s create something extraordinary together. Our team is ready to transform your vision into reality.</p>
        <div className="cta-actions">
          <button className="btn-primary btn-large" id="start-project-btn" onClick={enterCinematic}>
            <span>Enter the Experience</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10H14M14 10L10 6M14 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <a href="mailto:contact@bexsigmatech.io" className="btn-secondary btn-large" id="schedule-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Schedule a Call</a>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="nav-logo-bex">BEX</span>
            <span className="nav-logo-sigma">SIGMA</span>
            <span className="footer-tech">TECH</span>
          </div>
          <p className="footer-tagline">Next-generation digital experiences</p>
        </div>
        <div className="footer-links-group">
          <div className="footer-column">
            <h4 className="footer-heading">Solutions</h4>
            <button onClick={() => scrollTo('solutions')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>AI &amp; ML</button>
            <button onClick={() => scrollTo('solutions')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Web Experiences</button>
            <button onClick={() => scrollTo('tech')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Cloud</button>
            <button onClick={() => scrollTo('tech')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Security</button>
          </div>
          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <button onClick={() => scrollTo('about')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>About</button>
            <button onClick={() => scrollTo('contact')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Careers</button>
            <button onClick={() => scrollTo('contact')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Blog</button>
            <button onClick={() => scrollTo('contact')} className="footer-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Contact</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Bex Sigma Tech. All rights reserved.</span>
        <span className="footer-status"><span className="status-dot" /> All systems operational</span>
      </div>
    </footer>
  )
}

/* ─── Homepage ─── */
export default function Homepage() {
  return (
    <motion.div className="homepage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
      <div className="canvas-container">
        <Scene3D />
      </div>
      <div className="ui-layer">
        <Navbar />
        <HeroSection />
        <SolutionsSection />
        <TechSection />
        <AboutSection />
        <CTASection />
        <Footer />
      </div>
    </motion.div>
  )
}
