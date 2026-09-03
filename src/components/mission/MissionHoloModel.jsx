import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

/* ==========================================================================
   BEX SIGMA TECH — CINEMA-GRADE MARK 85 IRON MAN ENGINE
   High-Poly LatheGeometry cranium, organic spline faceplate,
   postprocessing bloom for repulsor eye glow, cinematic rim lighting.
   
   Reference: Endgame Mark LXXXV battle-worn helmet profile
   ========================================================================== */

const STARK_THEMES = {
  classic: {
    name: 'MARK LXXXV',
    primary: '#8b1117',       // Deep Stark red
    primaryHighlight: '#b81c23',
    secondary: '#c9952e',     // Aged gold
    secondaryDark: '#9a7420',
    accent: '#4de8ff',        // Repulsor cyan
    coreGlow: '#ffffff',
    darkMetal: '#12151b',     // Gunmetal black
    copper: '#a85a18',
    seamColor: '#0a0c10',
  },
  jarvis: {
    name: 'JARVIS HOLOGRAPHIC',
    primary: '#0077b6',
    primaryHighlight: '#00b4d8',
    secondary: '#48cae4',
    secondaryDark: '#0096c7',
    accent: '#90e0ef',
    coreGlow: '#ffffff',
    darkMetal: '#03045e',
    copper: '#00b4d8',
    seamColor: '#020330',
  },
  stealth: {
    name: 'STEALTH MARK VII',
    primary: '#181a20',
    primaryHighlight: '#2a2e39',
    secondary: '#d97706',
    secondaryDark: '#92400e',
    accent: '#ef4444',
    coreGlow: '#fca5a5',
    darkMetal: '#0d0e12',
    copper: '#b45309',
    seamColor: '#070809',
  },
  quantum: {
    name: 'QUANTUM AMETHYST',
    primary: '#581c87',
    primaryHighlight: '#7e22ce',
    secondary: '#c084fc',
    secondaryDark: '#9333ea',
    accent: '#00f5ff',
    coreGlow: '#ffffff',
    darkMetal: '#2e1065',
    copper: '#e879f9',
    seamColor: '#1a0a3a',
  },
  emerald: {
    name: 'NANO VIBRANIUM',
    primary: '#064e3b',
    primaryHighlight: '#047857',
    secondary: '#34d399',
    secondaryDark: '#059669',
    accent: '#6ee7b7',
    coreGlow: '#ffffff',
    darkMetal: '#022c22',
    copper: '#10b981',
    seamColor: '#011a14',
  },
}

/* ═══════════════════════════════════════════════════════════════════
   MARK 85 HELMET — Cinema Profile
   Uses LatheGeometry with a detailed profile curve matching
   the organic contours of the MCU Iron Man helmet
   ═══════════════════════════════════════════════════════════════════ */
function MarkLXXXVHelmet({ theme, wireframeMode, faceplateOpen }) {
  const groupRef = useRef()
  const faceplateRef = useRef()
  const jawRef = useRef()
  const leftEyeRef = useRef()
  const rightEyeRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Faceplate hinge animation
    if (faceplateRef.current) {
      const targetRot = faceplateOpen ? -0.5 : 0
      const targetY = faceplateOpen ? 0.3 : 0
      faceplateRef.current.rotation.x += (targetRot - faceplateRef.current.rotation.x) * 0.06
      faceplateRef.current.position.y += (targetY - faceplateRef.current.position.y) * 0.06
    }

    // Jaw opens slightly with faceplate
    if (jawRef.current) {
      const targetJaw = faceplateOpen ? 0.2 : 0
      jawRef.current.rotation.x += (targetJaw - jawRef.current.rotation.x) * 0.06
    }

    // Eye energy pulse — cinematic
    const pulse = 1.0 + Math.sin(t * 3.5) * 0.08
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.set(1, pulse, 1)
      leftEyeRef.current.material.emissiveIntensity = 3.0 + Math.sin(t * 5) * 0.8
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.set(1, pulse, 1)
      rightEyeRef.current.material.emissiveIntensity = 3.0 + Math.sin(t * 5) * 0.8
    }
  })

  // ─── Materials with MeshPhysicalMaterial for cinema-grade rendering ───
  const redMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: theme.primary,
    emissive: theme.primaryHighlight,
    emissiveIntensity: wireframeMode ? 0.1 : 0.12,
    metalness: 0.96,
    roughness: 0.18,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
    wireframe: wireframeMode,
  }), [theme, wireframeMode])

  const goldMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: theme.secondary,
    emissive: theme.secondaryDark,
    emissiveIntensity: wireframeMode ? 0.1 : 0.18,
    metalness: 0.97,
    roughness: 0.12,
    clearcoat: 0.7,
    clearcoatRoughness: 0.08,
    wireframe: wireframeMode,
  }), [theme, wireframeMode])

  const darkMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: theme.darkMetal,
    metalness: 0.94,
    roughness: 0.3,
    clearcoat: 0.2,
    wireframe: wireframeMode,
  }), [theme, wireframeMode])

  const seamMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: theme.seamColor,
    metalness: 0.6,
    roughness: 0.8,
  }), [theme])

  const eyeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: theme.accent,
    emissive: theme.accent,
    emissiveIntensity: 3.5,
    toneMapped: false,
  }), [theme])

  const eyeCoreMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#ffffff',
    emissiveIntensity: 5.0,
    toneMapped: false,
  }), [theme])

  // ─── CRANIUM: High-poly LatheGeometry ───
  // Profile curve matches the MCU Mark 85 silhouette from the side
  const craniumGeo = useMemo(() => {
    const pts = [
      // Bottom → neck opening
      new THREE.Vector2(0.00, -0.72),
      new THREE.Vector2(0.42, -0.70),
      new THREE.Vector2(0.55, -0.65),
      new THREE.Vector2(0.65, -0.56),
      new THREE.Vector2(0.73, -0.44),
      new THREE.Vector2(0.78, -0.32),
      // Jaw line
      new THREE.Vector2(0.82, -0.18),
      new THREE.Vector2(0.85, -0.04),
      // Ear level - widest point
      new THREE.Vector2(0.87, 0.08),
      new THREE.Vector2(0.88, 0.18),
      // Temple
      new THREE.Vector2(0.87, 0.30),
      new THREE.Vector2(0.85, 0.40),
      // Forehead curve - starts to taper
      new THREE.Vector2(0.82, 0.50),
      new THREE.Vector2(0.77, 0.58),
      new THREE.Vector2(0.70, 0.66),
      // Crown
      new THREE.Vector2(0.60, 0.74),
      new THREE.Vector2(0.48, 0.80),
      new THREE.Vector2(0.35, 0.85),
      new THREE.Vector2(0.20, 0.88),
      // Top of head
      new THREE.Vector2(0.08, 0.90),
      new THREE.Vector2(0.00, 0.91),
    ]
    return new THREE.LatheGeometry(pts, 64, 0, Math.PI * 2)
  }, [])

  // ─── FACEPLATE SHAPE: Organic spline-based extruded mask ───
  const faceplateGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-0.38, 0.46),
      new THREE.Vector2(-0.48, 0.28),
      new THREE.Vector2(-0.52, 0.08),
      new THREE.Vector2(-0.50, -0.08),
      new THREE.Vector2(-0.46, -0.20),
      new THREE.Vector2(-0.38, -0.32),
      new THREE.Vector2(-0.25, -0.42),
      new THREE.Vector2(-0.10, -0.47),
      new THREE.Vector2(0.0, -0.48),
      new THREE.Vector2(0.10, -0.47),
      new THREE.Vector2(0.25, -0.42),
      new THREE.Vector2(0.38, -0.32),
      new THREE.Vector2(0.46, -0.20),
      new THREE.Vector2(0.50, -0.08),
      new THREE.Vector2(0.52, 0.08),
      new THREE.Vector2(0.48, 0.28),
      new THREE.Vector2(0.38, 0.46),
      new THREE.Vector2(0.22, 0.52),
      new THREE.Vector2(0.0, 0.54),
      new THREE.Vector2(-0.22, 0.52),
    ])
    const points = curve.getPoints(80)
    shape.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i].x, points[i].y)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.025,
      bevelSegments: 8,
    })
  }, [])

  // ─── EYE SHAPE: Angular triangular Iron Man eye slit ───
  const eyeGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-0.12, 0.0),
      new THREE.Vector2(-0.08, 0.032),
      new THREE.Vector2(-0.02, 0.042),
      new THREE.Vector2(0.04, 0.038),
      new THREE.Vector2(0.09, 0.025),
      new THREE.Vector2(0.13, 0.008),
      new THREE.Vector2(0.14, 0.0),
      new THREE.Vector2(0.13, -0.008),
      new THREE.Vector2(0.09, -0.022),
      new THREE.Vector2(0.04, -0.034),
      new THREE.Vector2(-0.02, -0.038),
      new THREE.Vector2(-0.08, -0.028),
    ])
    const points = curve.getPoints(48)
    shape.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i].x, points[i].y)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.004,
      bevelSegments: 4,
    })
  }, [])

  // ─── NOSE RIDGE ───
  const noseGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-0.055, 0.16),
      new THREE.Vector2(-0.065, 0.08),
      new THREE.Vector2(-0.06, -0.02),
      new THREE.Vector2(-0.048, -0.10),
      new THREE.Vector2(-0.03, -0.14),
      new THREE.Vector2(0.0, -0.16),
      new THREE.Vector2(0.03, -0.14),
      new THREE.Vector2(0.048, -0.10),
      new THREE.Vector2(0.06, -0.02),
      new THREE.Vector2(0.065, 0.08),
      new THREE.Vector2(0.055, 0.16),
    ])
    const points = curve.getPoints(40)
    shape.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i].x, points[i].y)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.01,
      bevelSegments: 4,
    })
  }, [])

  // ─── CHIN / MANDIBLE ───
  const chinGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-0.20, 0.06),
      new THREE.Vector2(-0.24, 0.0),
      new THREE.Vector2(-0.22, -0.08),
      new THREE.Vector2(-0.16, -0.14),
      new THREE.Vector2(-0.08, -0.18),
      new THREE.Vector2(0.0, -0.19),
      new THREE.Vector2(0.08, -0.18),
      new THREE.Vector2(0.16, -0.14),
      new THREE.Vector2(0.22, -0.08),
      new THREE.Vector2(0.24, 0.0),
      new THREE.Vector2(0.20, 0.06),
    ])
    const points = curve.getPoints(40)
    shape.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i].x, points[i].y)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.018,
      bevelSegments: 5,
    })
  }, [])

  // ─── BROW RIDGE ───
  const browGeo = useMemo(() => {
    const shape = new THREE.Shape()
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-0.42, -0.025),
      new THREE.Vector2(-0.28, 0.04),
      new THREE.Vector2(-0.12, 0.07),
      new THREE.Vector2(0.0, 0.08),
      new THREE.Vector2(0.12, 0.07),
      new THREE.Vector2(0.28, 0.04),
      new THREE.Vector2(0.42, -0.025),
      new THREE.Vector2(0.38, -0.06),
      new THREE.Vector2(0.0, -0.02),
      new THREE.Vector2(-0.38, -0.06),
    ])
    const points = curve.getPoints(48)
    shape.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) shape.lineTo(points[i].x, points[i].y)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.10,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.008,
      bevelSegments: 3,
    })
  }, [])

  return (
    <group ref={groupRef}>
      {/* ═══════════════════════════════════════════════
          CRANIUM — Smooth high-poly dome
         ═══════════════════════════════════════════════ */}
      <mesh geometry={craniumGeo} material={redMat} />

      {/* Sagittal (center-top) crest ridge */}
      <mesh position={[0, 0.65, 0.12]} rotation={[-0.25, 0, 0]} material={redMat}>
        <boxGeometry args={[0.10, 0.45, 0.12]} />
      </mesh>
      <mesh position={[0, 0.85, -0.06]} rotation={[0.12, 0, 0]} material={redMat}>
        <boxGeometry args={[0.06, 0.18, 0.30]} />
      </mesh>

      {/* Panel seam lines across cranium */}
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={`cseam-${i}`}
          position={[x, 0.40, 0.50]}
          rotation={[-0.18, i === 0 ? 0.22 : -0.22, i === 0 ? -0.08 : 0.08]}
          material={seamMat}
        >
          <boxGeometry args={[0.012, 0.55, 0.008]} />
        </mesh>
      ))}
      {/* Horizontal seam above brow */}
      <mesh position={[0, 0.50, 0.55]} rotation={[-0.3, 0, 0]} material={seamMat}>
        <boxGeometry args={[0.65, 0.01, 0.008]} />
      </mesh>
      {/* Side panel seams */}
      {[-0.75, 0.75].map((x, i) => (
        <mesh key={`sseam-${i}`}
          position={[x, 0.12, 0.25]}
          rotation={[0, i === 0 ? 0.4 : -0.4, 0.05]}
          material={seamMat}
        >
          <boxGeometry args={[0.008, 0.70, 0.012]} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════════════════
          EAR PODS — Iconic cylindrical discs
         ═══════════════════════════════════════════════ */}
      {[-1, 1].map((side, idx) => (
        <group key={`ear-${idx}`} position={[side * 0.90, 0.10, -0.06]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={goldMat}>
            <cylinderGeometry args={[0.16, 0.19, 0.05, 36]} />
          </mesh>
          <mesh position={[0, side === -1 ? -0.035 : 0.035, 0]} material={redMat}>
            <cylinderGeometry args={[0.12, 0.12, 0.03, 28]} />
          </mesh>
          <mesh position={[0, side === -1 ? -0.06 : 0.06, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.015, 6]} />
            <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
          <pointLight color={theme.accent} intensity={0.5} distance={1.0} position={[0, side === -1 ? -0.07 : 0.07, 0]} />
        </group>
      ))}

      {/* ═══════════════════════════════════════════════
          TEMPLE & JAW — Red armor panels
         ═══════════════════════════════════════════════ */}
      {[-1, 1].map((side, i) => (
        <group key={`temple-${i}`}>
          {/* Upper temple panel */}
          <mesh position={[side * 0.66, 0.22, 0.24]} rotation={[0, side * 0.32, 0]} material={redMat}>
            <boxGeometry args={[0.28, 0.40, 0.38]} />
          </mesh>
          {/* Lower jaw wing */}
          <mesh position={[side * 0.55, -0.22, 0.32]} rotation={[0.15, side * 0.38, 0]} material={redMat}>
            <boxGeometry args={[0.24, 0.38, 0.28]} />
          </mesh>
          {/* Heat exhaust slats (3 horizontal) */}
          {[-0.06, 0, 0.06].map((vy, vi) => (
            <mesh key={vi}
              position={[side * (side === -1 ? 0.42 : 0.68), -0.22 + vy, 0.34]}
              rotation={[0, side * 0.38, 0]}
              material={seamMat}
            >
              <boxGeometry args={[0.015, 0.018, 0.15]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ═══════════════════════════════════════════════
          NECK — Cervical assembly
         ═══════════════════════════════════════════════ */}
      <mesh position={[0, -0.55, -0.12]} material={darkMat}>
        <cylinderGeometry args={[0.48, 0.58, 0.22, 36]} />
      </mesh>
      {[0, 1, 2].map(i => (
        <mesh key={`nv-${i}`} position={[0, -0.44 - i * 0.05, -0.30]} material={darkMat}>
          <boxGeometry args={[0.30, 0.03, 0.12]} />
        </mesh>
      ))}
      {[-0.38, 0.38].map((x, i) => (
        <group key={`piston-${i}`} position={[x, -0.44, -0.22]}>
          <mesh material={darkMat}>
            <cylinderGeometry args={[0.04, 0.04, 0.28, 14]} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.24, 10]} />
            <meshStandardMaterial color="#8a95a5" metalness={0.98} roughness={0.06} />
          </mesh>
        </group>
      ))}

      {/* ═══════════════════════════════════════════════
          FACEPLATE — Gold organic mask (smooth extruded)
         ═══════════════════════════════════════════════ */}
      <group ref={faceplateRef}>
        <mesh geometry={faceplateGeo} material={goldMat} position={[0, 0.02, 0.54]} />

        {/* Brow ridge overhang */}
        <mesh geometry={browGeo} material={goldMat} position={[0, 0.38, 0.58]} rotation={[-0.10, 0, 0]} />

        {/* ─── GLOWING EYES (with bloom-compatible emissive materials) ─── */}
        {/* Left Eye */}
        <group position={[-0.20, 0.19, 0.77]} rotation={[0.04, 0.16, -0.10]}>
          {/* Dark recessed socket */}
          <mesh geometry={eyeGeo} position={[0, 0, -0.015]} material={darkMat} scale={[1.2, 1.2, 1.8]} />
          {/* Glowing eye — high emissive for bloom */}
          <mesh ref={leftEyeRef} geometry={eyeGeo} material={eyeMat} />
          {/* White-hot center core */}
          <mesh geometry={eyeGeo} scale={[0.6, 0.5, 0.4]} position={[0.01, 0, 0.02]} material={eyeCoreMat} />
          <pointLight color={theme.accent} intensity={3.0} distance={3.0} />
        </group>

        {/* Right Eye */}
        <group position={[0.20, 0.19, 0.77]} rotation={[0.04, -0.16, 0.10]}>
          <mesh geometry={eyeGeo} position={[0, 0, -0.015]} material={darkMat} scale={[1.2, 1.2, 1.8]} />
          <mesh ref={rightEyeRef} geometry={eyeGeo} material={eyeMat} />
          <mesh geometry={eyeGeo} scale={[0.6, 0.5, 0.4]} position={[-0.01, 0, 0.02]} material={eyeCoreMat} />
          <pointLight color={theme.accent} intensity={3.0} distance={3.0} />
        </group>

        {/* ─── NOSE BRIDGE ─── */}
        <mesh geometry={noseGeo} material={goldMat} position={[0, 0.02, 0.66]} />

        {/* ─── CHEEKBONE PLATES ─── */}
        {[-1, 1].map((side, i) => (
          <mesh key={`cheek-${i}`}
            position={[side * 0.30, 0.04, 0.68]}
            rotation={[-0.06, side * 0.22, 0]}
            material={goldMat}
          >
            <boxGeometry args={[0.26, 0.18, 0.16]} />
          </mesh>
        ))}

        {/* ─── MOUTH AREA ─── */}
        <mesh position={[0, -0.10, 0.72]} rotation={[-0.04, 0, 0]} material={goldMat}>
          <boxGeometry args={[0.38, 0.08, 0.15]} />
        </mesh>
        {/* Dark mouth slit */}
        <mesh position={[0, -0.14, 0.79]} material={seamMat}>
          <boxGeometry args={[0.34, 0.015, 0.03]} />
        </mesh>
        <mesh position={[0, -0.19, 0.72]} rotation={[0.04, 0, 0]} material={goldMat}>
          <boxGeometry args={[0.34, 0.05, 0.14]} />
        </mesh>

        {/* Faceplate vertical seam (center) */}
        <mesh position={[0, 0.10, 0.80]} material={seamMat}>
          <boxGeometry args={[0.008, 0.30, 0.008]} />
        </mesh>
        {/* Faceplate horizontal seams */}
        <mesh position={[0, 0.30, 0.74]} rotation={[-0.08, 0, 0]} material={seamMat}>
          <boxGeometry args={[0.55, 0.008, 0.008]} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════
          CHIN / MANDIBLE — Organic jaw plate
         ═══════════════════════════════════════════════ */}
      <group ref={jawRef} position={[0, -0.26, 0.32]}>
        <mesh geometry={chinGeo} material={goldMat} position={[0, -0.06, 0.30]} rotation={[0.18, 0, 0]} />
        {/* Chin accent pad */}
        <mesh position={[0, -0.12, 0.50]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.08, 0.10, 0.025]} />
          <meshPhysicalMaterial color={theme.primary} metalness={0.96} roughness={0.12} clearcoat={0.5} />
        </mesh>
        {/* Side chin accents */}
        {[-0.12, 0.12].map((x, i) => (
          <mesh key={i} position={[x, -0.10, 0.48]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.04, 0.08, 0.018]} />
            <meshPhysicalMaterial color={theme.primary} metalness={0.96} roughness={0.12} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ARC REACTOR — Cinema-Grade Unibeam
   ═══════════════════════════════════════════════════════════════════ */
function CinemaArcReactor({ theme, wireframeMode, exploded }) {
  const coreRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const coilsRef = useRef()
  const exp = exploded ? 1.4 : 1.0

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (coreRef.current) {
      const p = 1.0 + Math.sin(t * 6) * 0.06
      coreRef.current.scale.set(p, p, p)
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.35
    if (coilsRef.current) coilsRef.current.rotation.z = t * 0.25
  })

  const coils = useMemo(() => {
    const arr = []
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2) / 10
      arr.push({ a, x: Math.cos(a) * 1.02, y: Math.sin(a) * 1.02 })
    }
    return arr
  }, [])

  return (
    <group>
      <mesh position={[0, 0, -0.2]}>
        <cylinderGeometry args={[1.5, 1.6, 0.35, 36]} />
        <meshPhysicalMaterial color={theme.darkMetal} metalness={0.95} roughness={0.15} clearcoat={0.4} wireframe={wireframeMode} />
      </mesh>
      <mesh position={[0, 0, 0.02]} scale={exp}>
        <torusGeometry args={[1.35, 0.07, 16, 64]} />
        <meshPhysicalMaterial color={theme.secondary} emissive={theme.secondaryDark} emissiveIntensity={0.8} metalness={0.98} roughness={0.08} clearcoat={0.8} />
      </mesh>
      <group ref={coilsRef} scale={exp}>
        {coils.map((c, i) => (
          <group key={i} position={[c.x, c.y, 0]} rotation={[0, 0, c.a + Math.PI / 2]}>
            <mesh>
              <boxGeometry args={[0.2, 0.32, 0.18]} />
              <meshPhysicalMaterial color={theme.copper} emissive={theme.copper} emissiveIntensity={0.5} metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, 0.09]}>
              <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
              <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={1.5} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={ring1Ref}>
        <mesh position={[0, 0, 0.06]}>
          <torusGeometry args={[0.68, 0.08, 16, 48]} />
          <meshStandardMaterial color={theme.accent} emissive={theme.accent} emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      </group>
      <group ref={ring2Ref} scale={exp * 1.1}>
        <mesh position={[0, 0, 0.12]}>
          <ringGeometry args={[0.32, 0.48, 3]} />
          <meshBasicMaterial color={theme.secondary} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={coreRef} position={[0, 0, 0.15]}>
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4.0} toneMapped={false} />
        </mesh>
        <pointLight color={theme.accent} intensity={5.0} distance={6} />
      </group>
    </group>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FULL ARMOR TORSO + HELMET
   ═══════════════════════════════════════════════════════════════════ */
function CinemaIronManTorso({ theme, wireframeMode, faceplateOpen, exploded }) {
  const exp = exploded ? 1.3 : 1.0
  const redMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: theme.primary, emissive: theme.primaryHighlight, emissiveIntensity: 0.15,
    metalness: 0.96, roughness: 0.15, clearcoat: 0.5, wireframe: wireframeMode,
  }), [theme, wireframeMode])
  const goldMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: theme.secondary, emissive: theme.secondaryDark, emissiveIntensity: 0.2,
    metalness: 0.97, roughness: 0.1, clearcoat: 0.7, wireframe: wireframeMode,
  }), [theme, wireframeMode])
  const darkMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: theme.darkMetal, metalness: 0.94, roughness: 0.25, clearcoat: 0.2, wireframe: wireframeMode,
  }), [theme, wireframeMode])

  return (
    <group position={[0, -0.45, 0]}>
      <group position={[0, 1.35, 0]} scale={0.76}>
        <MarkLXXXVHelmet theme={theme} wireframeMode={wireframeMode} faceplateOpen={faceplateOpen} />
      </group>
      <mesh position={[0, 0.65, -0.05]} material={darkMat}>
        <cylinderGeometry args={[0.38, 0.52, 0.35, 24]} />
      </mesh>
      <mesh position={[0, 0.52, 0.25]} rotation={[-0.35, 0, 0]} material={goldMat}>
        <boxGeometry args={[1.15, 0.22, 0.3]} />
      </mesh>
      <group position={[0, 0.12, 0]}>
        <mesh position={[0, 0, -0.12]} material={redMat}>
          <boxGeometry args={[1.95, 1.15, 0.75]} />
        </mesh>
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.18, 0.34]} rotation={[0.12, i === 0 ? 0.24 : -0.24, 0]} material={goldMat}>
            <boxGeometry args={[0.72, 0.48, 0.14]} />
          </mesh>
        ))}
        {[-0.88, 0.88].map((x, i) => (
          <group key={i} position={[x, -0.22, 0.15]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]}>
            {[-0.12, 0, 0.12].map((sy, si) => (
              <mesh key={si} position={[0, sy, 0]} material={goldMat}>
                <boxGeometry args={[0.22, 0.08, 0.35]} />
              </mesh>
            ))}
          </group>
        ))}
        <group position={[0, 0.08, 0.34]} scale={0.38}>
          <CinemaArcReactor theme={theme} wireframeMode={wireframeMode} exploded={false} />
        </group>
      </group>
      {[-1.42, 1.42].map((x, i) => (
        <group key={i} position={[x * exp, 0.42, -0.06]} rotation={[0, 0, i === 0 ? 0.28 : -0.28]}>
          <mesh material={redMat}>
            <sphereGeometry args={[0.58, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          </mesh>
          <mesh position={[0, -0.18, 0]} material={goldMat}>
            <cylinderGeometry args={[0.54, 0.58, 0.12, 24]} />
          </mesh>
          <mesh position={[0, -0.26, 0]} material={darkMat}>
            <cylinderGeometry args={[0.25, 0.32, 0.08, 16]} />
          </mesh>
        </group>
      ))}
      <group position={[0, -0.65, 0.08]}>
        {[-0.15, 0, 0.15].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} material={idx % 2 === 0 ? redMat : darkMat}>
            <boxGeometry args={[1.3 - idx * 0.1, 0.12, 0.45]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ─── Unibeam Repulsor Discharge ─── */
function UnibeamDischarge({ active, color }) {
  const beamRef = useRef()
  const flareRef = useRef()

  useFrame((_, delta) => {
    if (!beamRef.current) return
    if (active) {
      beamRef.current.visible = true
      beamRef.current.scale.z += delta * 15
      beamRef.current.scale.x = 1 + Math.sin(Date.now() * 0.03) * 0.4
      beamRef.current.scale.y = 1 + Math.sin(Date.now() * 0.03) * 0.4
      if (flareRef.current) {
        flareRef.current.rotation.z += delta * 8
        const s = 1.2 + Math.sin(Date.now() * 0.04) * 0.5
        flareRef.current.scale.set(s, s, s)
      }
      if (beamRef.current.scale.z > 9) beamRef.current.scale.set(1, 1, 0.1)
    } else {
      beamRef.current.visible = false
      beamRef.current.scale.set(1, 1, 0.1)
    }
  })

  return (
    <group position={[0, 0, 0.3]}>
      <mesh ref={beamRef} position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <cylinderGeometry args={[0.22, 0.75, 4.2, 32, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      {active && (
        <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.25, 4.2, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      )}
      <mesh ref={flareRef} visible={active}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* ─── Ambient nano-particles ─── */
function NanoParticles({ count = 60, color }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 7
      a[i * 3 + 1] = (Math.random() - 0.5) * 7
      a[i * 3 + 2] = (Math.random() - 0.5) * 7
    }
    return a
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.015
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.025} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ─── HUD Targeting Ring ─── */
function HUDRing({ radius, color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.12
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.04
    }
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN CANVAS — with Bloom postprocessing for eye glow
   ═══════════════════════════════════════════════════════════════════ */
export default function MissionHoloModel({
  modelType = 'helmet',
  colorTheme = 'classic',
  wireframe = false,
  exploded = false,
  scanTrigger = false,
  autoRotate = true,
}) {
  const theme = STARK_THEMES[colorTheme] || STARK_THEMES.classic

  return (
    <div className="mc-holo-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0.2, 3.5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
      >
        {/* ─── CINEMA LIGHTING RIG ─── */}
        <ambientLight intensity={0.35} />
        {/* Key light — warm front-right */}
        <directionalLight position={[4, 5, 7]} intensity={2.5} color="#fff5e6" />
        {/* Fill — left side gold tint */}
        <directionalLight position={[-5, 3, -3]} intensity={1.0} color={theme.secondary} />
        {/* Rim — behind for edge silhouette (like the reference image) */}
        <directionalLight position={[0, 2, -7]} intensity={1.8} color="#8cb4ff" />
        {/* Bottom repulsor uplighting */}
        <pointLight position={[0, -3, 2]} intensity={0.8} color={theme.accent} />
        {/* Top specular crown highlight */}
        <spotLight position={[0, 5, 1.5]} intensity={1.2} angle={0.25} penumbra={0.6} color="#ffffff" />
        {/* Side-fill warm to simulate fire/embers from reference */}
        <pointLight position={[-2, 0, 1]} intensity={0.6} color="#ff6b35" />

        {/* Environment map for realistic metallic reflections */}
        <Environment preset="city" />

        {/* Camera controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={7.0}
          autoRotate={autoRotate}
          autoRotateSpeed={0.7}
          dampingFactor={0.04}
        />

        {/* Particles & HUD */}
        <NanoParticles count={50} color={theme.accent} />
        <HUDRing radius={1.8} color={theme.accent} />
        <HUDRing radius={2.3} color={theme.secondary} />

        {/* Model */}
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.18}>
          {modelType === 'helmet' && (
            <MarkLXXXVHelmet theme={theme} wireframeMode={wireframe} faceplateOpen={exploded} />
          )}
          {modelType === 'reactor' && (
            <CinemaArcReactor theme={theme} wireframeMode={wireframe} exploded={exploded} />
          )}
          {modelType === 'armor' && (
            <CinemaIronManTorso theme={theme} wireframeMode={wireframe} faceplateOpen={exploded} exploded={exploded} />
          )}
          <UnibeamDischarge active={scanTrigger} color={theme.accent} />
        </Float>
      </Canvas>
    </div>
  )
}
