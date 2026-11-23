import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ==========================================================================
   BEX SIGMA TECH — MISSION CONTROL 3D ISOMETRIC CYBER-MECHANICAL APPARATUS
   Inspired by UPLINQ high-end industrial tech aesthetic:
   - Stepped matte dark pedestals & geometric enclosures
   - Brushed brass / copper cylinders & gold accents
   - High-gloss chrome mirror components
   - Articulated robotic arm with glowing dual-tone optical disc
   - Angled glowing cyan digital telemetry screens with animated data waves
   - Array of dark heatsink pins & floating status widgets
   ========================================================================== */

// Animated Canvas Texture for the glowing cyan waveform screen
function useWaveTexture() {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 256
    return c
  }, [])

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.wrapS = THREE.ClampToEdgeWrapping
    t.wrapT = THREE.ClampToEdgeWrapping
    return t
  }, [canvas])

  const stateRef = useRef({ time: 0 })

  useFrame((_, delta) => {
    stateRef.current.time += delta * 3
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear background (dark cyan/black)
    ctx.fillStyle = '#031215'
    ctx.fillRect(0, 0, 512, 256)

    // Grid lines
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.12)'
    ctx.lineWidth = 1
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 256)
      ctx.stroke()
    }
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(512, y)
      ctx.stroke()
    }

    // Dynamic wave
    ctx.strokeStyle = '#2dd4bf'
    ctx.lineWidth = 4
    ctx.shadowColor = '#2dd4bf'
    ctx.shadowBlur = 12
    ctx.beginPath()

    const t = stateRef.current.time
    for (let x = 0; x <= 512; x += 4) {
      const y =
        128 +
        Math.sin(x * 0.025 + t) * 36 +
        Math.sin(x * 0.06 - t * 1.5) * 18 +
        Math.cos(x * 0.012 + t * 0.8) * 12
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Secondary dashed wave
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 6])
    ctx.shadowBlur = 4
    ctx.beginPath()
    for (let x = 0; x <= 512; x += 6) {
      const y = 140 + Math.cos(x * 0.03 - t * 0.8) * 24
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Telemetry text
    ctx.font = 'bold 20px "JetBrains Mono", monospace'
    ctx.fillStyle = '#2dd4bf'
    ctx.shadowBlur = 0
    ctx.fillText('REALTIME PIPELINE · 99.98%', 24, 38)

    ctx.font = '14px monospace'
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('LATENCY: 12ms   FREQ: 4.8 GHz', 24, 62)

    texture.needsUpdate = true
  })

  return texture
}

function ApparatusModel() {
  const groupRef = useRef()
  const armRef = useRef()
  const discRef = useRef()
  const copperCylinderRef = useRef()
  const chromeCylinderRef = useRef()

  const waveTex = useWaveTexture()

  // Materials
  const materials = useMemo(() => {
    return {
      matteBlack: new THREE.MeshStandardMaterial({
        color: '#121417',
        roughness: 0.65,
        metalness: 0.2,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: '#1a1f26',
        roughness: 0.35,
        metalness: 0.75,
      }),
      brushedCopper: new THREE.MeshStandardMaterial({
        color: '#c97d50',
        roughness: 0.28,
        metalness: 0.85,
      }),
      brassGold: new THREE.MeshStandardMaterial({
        color: '#d4a373',
        roughness: 0.22,
        metalness: 0.9,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: '#f1f5f9',
        roughness: 0.08,
        metalness: 0.98,
      }),
      glowCyan: new THREE.MeshStandardMaterial({
        color: '#0d9488',
        emissive: '#14b8a6',
        emissiveIntensity: 1.8,
        roughness: 0.2,
      }),
      screenMat: new THREE.MeshBasicMaterial({
        map: waveTex,
      }),
      cyanGlass: new THREE.MeshPhysicalMaterial({
        color: '#2dd4bf',
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        emissive: '#0d9488',
        emissiveIntensity: 0.4,
      }),
    }
  }, [waveTex])

  // Mouse interaction & kinetic float
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    // Smooth subtle floating breathing motion
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.08

    // Mouse tilt tracking
    const targetRotY = (state.pointer.x * Math.PI) / 10 + 0.35
    const targetRotX = (-state.pointer.y * Math.PI) / 14 + 0.22
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05)

    // Rotating elements
    if (discRef.current) {
      discRef.current.rotation.y = t * 0.6
    }
    if (copperCylinderRef.current) {
      copperCylinderRef.current.rotation.y = t * 0.4
    }
    if (chromeCylinderRef.current) {
      chromeCylinderRef.current.rotation.y = -t * 0.3
    }
    if (armRef.current) {
      armRef.current.rotation.z = Math.sin(t * 0.8) * 0.06 - 0.15
    }
  })

  // Array of heatsink pins (the dense pin array visible on middle-left)
  const pinPositions = useMemo(() => {
    const pins = []
    const rows = 8
    const cols = 8
    const spacing = 0.09
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pins.push([
          (c - cols / 2) * spacing,
          0.3 + (Math.sin(r * 0.5) + Math.cos(c * 0.5)) * 0.04,
          (r - rows / 2) * spacing,
        ])
      }
    }
    return pins
  }, [])

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.2}>
      {/* ── GROUND CONTACT SHADOW DISC ── */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      {/* ── STEPPED MATTE BLACK BASE PEDESTALS ── */}
      {/* Main Base Block */}
      <mesh position={[0.2, -1.1, 0]} material={materials.matteBlack}>
        <boxGeometry args={[2.2, 0.4, 2.0]} />
      </mesh>

      {/* Raised Left Block */}
      <mesh position={[-0.7, -0.7, -0.1]} material={materials.matteBlack}>
        <boxGeometry args={[1.1, 0.6, 1.2]} />
      </mesh>

      {/* Raised Rear Tower Block */}
      <mesh position={[0.4, -0.3, -0.5]} material={materials.darkMetal}>
        <boxGeometry args={[1.2, 1.4, 0.9]} />
      </mesh>

      {/* Front Step Platform */}
      <mesh position={[-0.4, -1.0, 0.7]} material={materials.darkMetal}>
        <boxGeometry args={[1.0, 0.25, 0.7]} />
      </mesh>

      {/* ── PIN HEATSINK ARRAY (Middle-Left) ── */}
      <group position={[-0.7, -0.38, -0.1]}>
        {pinPositions.map((pos, idx) => (
          <mesh key={idx} position={pos} material={materials.darkMetal}>
            <cylinderGeometry args={[0.018, 0.018, 0.45, 8]} />
          </mesh>
        ))}
      </group>

      {/* ── BRUSHED COPPER / BRONZE CYLINDER (Middle Center) ── */}
      <group position={[-0.15, -0.55, 0.4]} ref={copperCylinderRef}>
        <mesh material={materials.brushedCopper}>
          <cylinderGeometry args={[0.38, 0.38, 0.45, 32]} />
        </mesh>
        {/* Gold Accent Ring */}
        <mesh position={[0, 0.23, 0]} material={materials.brassGold}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        </mesh>
      </group>

      {/* ── CHROME HIGH-GLOSS CYLINDER (Front Right) ── */}
      <group position={[0.65, -0.85, 0.7]} ref={chromeCylinderRef}>
        <mesh material={materials.chrome}>
          <cylinderGeometry args={[0.3, 0.3, 0.42, 32]} />
        </mesh>
        <mesh position={[0, 0.22, 0]} material={materials.darkMetal}>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
        </mesh>
      </group>

      {/* ── ROBOTIC ARTICULATED ARM (Upper Right to Center) ── */}
      <group position={[0.45, 0.35, -0.4]} ref={armRef}>
        {/* Base Joint */}
        <mesh material={materials.darkMetal}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        </mesh>
        {/* Arm Segment 1 */}
        <mesh position={[-0.2, 0.35, 0.15]} rotation={[0.4, 0, 0.5]} material={materials.darkMetal}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 12]} />
        </mesh>
        {/* Elbow Joint */}
        <mesh position={[-0.42, 0.65, 0.28]} material={materials.brassGold}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        {/* Arm Segment 2 extending forward */}
        <mesh position={[-0.52, 0.48, 0.42]} rotation={[-0.6, 0, -0.3]} material={materials.darkMetal}>
          <cylinderGeometry args={[0.035, 0.035, 0.5, 12]} />
        </mesh>

        {/* ── DUAL-TONE LENS / ORB DISC (Split half Cyan, half Brass) ── */}
        <group position={[-0.62, 0.32, 0.55]} ref={discRef}>
          {/* Top Half Glowing Cyan */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.06, 32, 1, false, 0, Math.PI]} />
            <meshStandardMaterial
              color="#2dd4bf"
              emissive="#2dd4bf"
              emissiveIntensity={1.2}
              roughness={0.15}
            />
          </mesh>
          {/* Bottom Half Brass / Gold */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.06, 32, 1, false, Math.PI, Math.PI]} />
            <meshStandardMaterial
              color="#d4a373"
              roughness={0.25}
              metalness={0.88}
            />
          </mesh>
          {/* Outer Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.29, 0.025, 16, 32]} />
            <meshStandardMaterial color="#1a1f26" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ── ANGLED TELEMETRY SCREEN (Main Live Waveform) ── */}
      <group position={[0.72, -0.3, 0.3]} rotation={[-0.2, -0.4, 0.08]}>
        {/* Screen Frame */}
        <mesh material={materials.darkMetal}>
          <boxGeometry args={[0.84, 0.48, 0.05]} />
        </mesh>
        {/* Display Canvas Face */}
        <mesh position={[0, 0, 0.028]} material={materials.screenMat}>
          <planeGeometry args={[0.8, 0.44]} />
        </mesh>
      </group>

      {/* ── SECONDARY MINI STATUS SCREEN (Front Left) ── */}
      <group position={[-0.68, -0.45, 0.8]} rotation={[-0.1, 0.35, 0]}>
        <mesh material={materials.darkMetal}>
          <boxGeometry args={[0.42, 0.28, 0.04]} />
        </mesh>
        {/* Cyan Glowing Mini Face */}
        <mesh position={[0, 0, 0.024]} material={materials.glowCyan}>
          <planeGeometry args={[0.38, 0.24]} />
        </mesh>
      </group>

      {/* ── FLOATING CYAN DATA PILL (Bottom Left Accent) ── */}
      <group position={[-0.95, -0.92, 0.65]}>
        <mesh material={materials.glowCyan}>
          <boxGeometry args={[0.45, 0.06, 0.18]} />
        </mesh>
      </group>

      {/* ── METALLIC SPHERE ON PEDESTAL ── */}
      <mesh position={[0.15, -0.68, 0.15]} material={materials.chrome}>
        <sphereGeometry args={[0.14, 32, 32]} />
      </mesh>

      {/* ── CONNECTING ARCHITECTURAL TUBING / WIRES ── */}
      <mesh position={[-0.1, -0.85, 0.2]} rotation={[0, 0.8, 1.2]} material={materials.glowCyan}>
        <torusGeometry args={[0.3, 0.015, 12, 24, Math.PI]} />
      </mesh>
    </group>
  )
}

export default function MissionHero3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '440px', position: 'relative' }}>
      <Canvas
        camera={{ position: [2.8, 2.2, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lighting matching high-end industrial dark studio */}
        <ambientLight intensity={0.4} />
        {/* Key Light from top-left */}
        <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
        {/* Subtle Warm Brass Fill */}
        <pointLight position={[-3, 2, 2]} intensity={1.2} color="#f59e0b" distance={8} />
        {/* Cyan Neon Accent Rim Light */}
        <pointLight position={[2, 1, -2]} intensity={2.5} color="#2dd4bf" distance={6} />
        <pointLight position={[-1, -0.5, 3]} intensity={1.5} color="#06b6d4" distance={5} />

        <ApparatusModel />
      </Canvas>
    </div>
  )
}
