import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { BagMesh, type BagModelColors } from './BagMesh'
import { cn } from '@/lib/cn'

export interface HeroSceneProps {
  colors?: Partial<BagModelColors>
  className?: string
}

const DEFAULT_COLORS: BagModelColors = {
  body: '#e6cfc4',
  panel: '#c9a294',
  accent: '#f3e3dc',
}

function Ring({
  radius,
  tilt,
  speed,
  color,
  opacity,
}: {
  radius: number
  tilt: [number, number, number]
  speed: number
  color: string
  opacity: number
}) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.z += delta * speed
  })

  return (
    <mesh ref={mesh} rotation={tilt}>
      <torusGeometry args={[radius, 0.01, 8, 140]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

/**
 * Ambient hero scene: a soft-lit bag, orbiting rings and dust.
 * Purely decorative, so it never blocks pointer events.
 */
export default function HeroScene({ colors, className }: HeroSceneProps) {
  const resolved: BagModelColors = {
    body: colors?.body ?? DEFAULT_COLORS.body,
    panel: colors?.panel ?? DEFAULT_COLORS.panel,
    accent: colors?.accent ?? DEFAULT_COLORS.accent,
  }

  return (
    <div className={cn('pointer-events-none h-full w-full select-none', className)} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.35, 6.1], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-5, 1, -3]} intensity={0.8} color="#9ec5ff" />
        <pointLight position={[0, -2, 3]} intensity={0.45} color="#ffdad0" />

        <group position={[0, -0.1, 0]} scale={1.02}>
          <BagMesh colors={resolved} />
        </group>

        <Ring radius={2.35} tilt={[Math.PI / 2.3, 0.18, 0]} speed={0.12} color="#8bb8ea" opacity={0.5} />
        <Ring radius={2.9} tilt={[Math.PI / 1.9, -0.28, 0.2]} speed={-0.08} color="#c3a6ff" opacity={0.38} />
        <Ring radius={3.4} tilt={[Math.PI / 2.6, 0.1, -0.2]} speed={0.05} color="#9fd8c8" opacity={0.22} />

        <Sparkles count={70} scale={[6.5, 4.2, 4]} size={2.6} speed={0.22} color="#b9d7f8" />

        <ContactShadows position={[0, -1.3, 0]} opacity={0.26} scale={7} blur={3} far={2.5} frames={Infinity} />
      </Canvas>
    </div>
  )
}
