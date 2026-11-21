import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export interface BagModelColors {
  body: string
  panel: string
  accent: string
}

export interface BagMeshProps {
  colors: BagModelColors
  /** Enable idle rotation and pointer parallax. */
  animated?: boolean
  /** Render backpack straps; disable for totes and pouches. */
  straps?: boolean
}

const METAL = {
  color: '#c9a962',
  metalness: 0.55,
  roughness: 0.32,
  emissive: new THREE.Color('#2b210b'),
  emissiveIntensity: 0.25,
}
const STITCH = '#f4efe6'
const FEET: Array<[number, number, number]> = [
  [-0.82, -0.86, 0.3],
  [0.82, -0.86, 0.3],
  [-0.82, -0.86, -0.3],
  [0.82, -0.86, -0.3],
]

/**
 * A procedurally built bag: no external .glb assets, no network requests,
 * so it renders instantly and recolors per product.
 */
export function BagMesh({ colors, animated = true, straps = true }: BagMeshProps) {
  const root = useRef<THREE.Group>(null)
  const flap = useRef<THREE.Group>(null)
  const handle = useRef<THREE.Group>(null)
  const pull = useRef<THREE.Mesh>(null)
  const targetScale = useRef(1)

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: colors.body,
        roughness: 0.62,
        metalness: 0.08,
      }),
      panel: new THREE.MeshStandardMaterial({
        color: colors.panel,
        roughness: 0.7,
        metalness: 0.05,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: colors.accent,
        roughness: 0.45,
        metalness: 0.2,
      }),
      metal: new THREE.MeshStandardMaterial(METAL),
      stitch: new THREE.MeshStandardMaterial({ color: STITCH, roughness: 0.9 }),
    }),
    [colors.body, colors.panel, colors.accent],
  )

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((material) => material.dispose())
    }
  }, [materials])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const group = root.current
    if (!group) return

    if (animated) {
      // Idle turn + gentle breathing bob, plus a soft pointer parallax.
      const idleYaw = Math.sin(t * 0.32) * 0.38
      const pointerYaw = state.pointer.x * 0.45
      const pointerPitch = -state.pointer.y * 0.16

      group.rotation.y = THREE.MathUtils.damp(group.rotation.y, idleYaw + pointerYaw, 3, delta)
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, pointerPitch, 4, delta)
      group.position.y = Math.sin(t * 0.8) * 0.045
    }

    const scale = THREE.MathUtils.damp(group.scale.x, targetScale.current, 6, delta)
    group.scale.setScalar(scale)

    if (flap.current) {
      flap.current.rotation.x = Math.sin(t * 0.9) * 0.015
    }
    if (handle.current) {
      handle.current.rotation.z = Math.sin(t * 1.1) * 0.035
    }
    if (pull.current) {
      pull.current.rotation.z = Math.sin(t * 2.2) * 0.18
    }
  })

  return (
    <group
      ref={root}
      onPointerOver={() => {
        targetScale.current = 1.045
      }}
      onPointerOut={() => {
        targetScale.current = 1
      }}
    >
      {/* Main body */}
      <RoundedBox args={[2.15, 1.65, 0.82]} radius={0.2} smoothness={5} material={materials.body} />

      {/* Front pocket */}
      <RoundedBox
        args={[1.5, 0.74, 0.2]}
        radius={0.12}
        smoothness={4}
        position={[0, -0.33, 0.44]}
        material={materials.panel}
      />

      {/* Stitched seam on the pocket */}
      <mesh position={[0, 0.02, 0.545]} material={materials.stitch}>
        <boxGeometry args={[1.24, 0.022, 0.012]} />
      </mesh>
      <mesh position={[0, -0.65, 0.545]} material={materials.stitch}>
        <boxGeometry args={[1.24, 0.022, 0.012]} />
      </mesh>

      {/* Flap */}
      <group ref={flap} position={[0, 0.6, 0.045]}>
        <RoundedBox
          args={[2.18, 0.58, 0.1]}
          radius={0.09}
          smoothness={4}
          position={[0, 0, 0.41]}
          material={materials.body}
        />
        <mesh position={[0, -0.2, 0.47]} material={materials.metal}>
          <boxGeometry args={[0.3, 0.13, 0.05]} />
        </mesh>
      </group>

      {/* Zipper */}
      <mesh position={[0, 0.16, 0.47]} material={materials.metal}>
        <boxGeometry args={[1.9, 0.05, 0.07]} />
      </mesh>
      <mesh ref={pull} position={[0.62, 0.03, 0.52]} material={materials.metal}>
        <torusGeometry args={[0.085, 0.024, 10, 20]} />
      </mesh>

      {/* Top handle */}
      <group ref={handle} position={[0, 0.92, 0]}>
        <mesh material={materials.panel}>
          <torusGeometry args={[0.42, 0.065, 14, 44, Math.PI]} />
        </mesh>
        <mesh position={[0.42, 0, 0]} material={materials.metal}>
          <boxGeometry args={[0.12, 0.09, 0.16]} />
        </mesh>
        <mesh position={[-0.42, 0, 0]} material={materials.metal}>
          <boxGeometry args={[0.12, 0.09, 0.16]} />
        </mesh>
      </group>

      {straps && (
        <group>
          {[-0.62, 0.62].map((x) => (
            <group key={x} position={[x, -0.05, -0.44]}>
              <RoundedBox
                args={[0.16, 1.62, 0.1]}
                radius={0.05}
                smoothness={3}
                material={materials.accent}
              />
              <mesh position={[0, -0.72, 0]} material={materials.metal}>
                <boxGeometry args={[0.2, 0.2, 0.14]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Brand plaque */}
      <mesh position={[-0.72, -0.6, 0.56]} material={materials.metal}>
        <boxGeometry args={[0.26, 0.14, 0.02]} />
      </mesh>

      {/* Metal feet */}
      {FEET.map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} material={materials.metal}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
      ))}
    </group>
  )
}
