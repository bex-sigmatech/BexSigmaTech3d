import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CyberTower({ pos, height, width, color }) {
  const ref = useRef()
  const y = pos[1] + height / 2

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = y + Math.sin(clock.elapsedTime * 0.35 + pos[0]) * 0.05
    }
  })

  return (
    <group ref={ref} position={[pos[0], y, pos[2]]}>
      {/* Core Block */}
      <mesh>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Wireframe Outline */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, width)]} />
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.4} />
      </lineSegments>

      {/* Pulsing neon bands */}
      <mesh position={[0, height * 0.25, 0]}>
        <boxGeometry args={[width * 1.02, 0.04, width * 1.02]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -height * 0.25, 0]}>
        <boxGeometry args={[width * 1.02, 0.04, width * 1.02]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}
