import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function DepartmentPod({ position, rotation = [0,0,0], title, onClick }) {
  const holoRef = useRef()

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    if (holoRef.current) {
      holoRef.current.position.y = 1.35 + Math.sin(elapsed * 1.5 + position[0]) * 0.03
    }
  })

  return (
    <group position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick() }}>
      {/* ── DESK BASE — white composite ── */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.8, 0.8]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.3} roughness={0.18} />
      </mesh>
      
      {/* ── DESK SURFACE — polished aluminum ── */}
      <mesh position={[0, 0.82, -0.05]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#d0d4d8" metalness={0.5} roughness={0.12} />
      </mesh>

      {/* ── ACCENT STRIP — subtle blue ── */}
      <mesh position={[0, 0.8, 0.38]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.4, 0.015, 0.015]} />
        <meshBasicMaterial color="#88bbdd" />
      </mesh>

      {/* ── KEYBOARD / CONTROLS — subtle touch surface ── */}
      <mesh position={[0, 0.84, 0.15]} rotation={[-0.15, 0, 0]}>
        <planeGeometry args={[1.0, 0.3]} />
        <meshBasicMaterial color="#88bbdd" transparent opacity={0.12} />
      </mesh>

      {/* ── HOLOGRAPHIC DISPLAY — elegant, minimal ── */}
      <group ref={holoRef} position={[0, 1.35, -0.15]} rotation={[-0.1, 0, 0]}>
        <mesh>
          <planeGeometry args={[1.4, 0.8]} />
          <meshBasicMaterial
            color="#88bbdd"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        
        {/* Display label */}
        <Html transform distanceFactor={2.5} position={[0, 0, 0.02]} pointerEvents="none">
          <div style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '10px',
            fontWeight: 600,
            color: '#fff',
            textTransform: 'uppercase',
            textAlign: 'center',
            letterSpacing: '0.1em',
            cursor: 'pointer'
          }}>
            {title}<br/>
            <span style={{
              fontSize: '6px',
              opacity: 0.5,
              color: '#88bbdd',
              fontWeight: 400,
              letterSpacing: '0.12em'
            }}>
              [ ACCESS TERMINAL ]
            </span>
          </div>
        </Html>
      </group>
    </group>
  )
}
