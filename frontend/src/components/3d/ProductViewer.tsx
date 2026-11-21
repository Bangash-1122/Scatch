import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { BagMesh, type BagModelColors } from './BagMesh'
import { useDevicePerformance } from '@/hooks/useDevicePerformance'
import { cn } from '@/lib/cn'

export interface ProductViewerProps {
  colors?: Partial<BagModelColors>
  straps?: boolean
  className?: string
  controls?: boolean
  autoRotate?: boolean
  onReady?: () => void
}

const DEFAULT_COLORS: BagModelColors = {
  body: '#D1B1A3',
  panel: '#B08F80',
  accent: '#E9D3CB',
}

export default function ProductViewer({
  colors,
  straps = true,
  className,
  controls = true,
  autoRotate = true,
  onReady,
}: ProductViewerProps) {
  const tier = useDevicePerformance()
  const resolved: BagModelColors = {
    body: colors?.body ?? DEFAULT_COLORS.body,
    panel: colors?.panel ?? DEFAULT_COLORS.panel,
    accent: colors?.accent ?? DEFAULT_COLORS.accent,
  }
  const high = tier === 'high'
  const medium = tier === 'medium'

  return (
    <div className={cn('relative h-full w-full touch-none', className)}>
      <Canvas
        dpr={high ? [1, 2] : [1, 1.5]}
        shadows={high}
        camera={{ position: [0, 0.45, 5.2], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.12
          onReady?.()
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={2.1}
          castShadow={high}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-5, 2, -4]} intensity={0.55} color="#9ec5ff" />
        <pointLight position={[0, -1.5, 3]} intensity={0.5} color="#ffe0c4" />

        {high && (
          <Environment resolution={96}>
            <Lightformer intensity={2.4} position={[0, 4, -4]} scale={[8, 3, 1]} />
            <Lightformer intensity={1.2} position={[-4, 1.5, 2]} scale={[3, 5, 1]} color="#cfe2ff" />
            <Lightformer intensity={0.9} position={[4, 0.5, 2]} scale={[3, 4, 1]} color="#ffe6cf" />
          </Environment>
        )}

        <group position={[0, -0.05, 0]} scale={1.05}>
          <BagMesh colors={resolved} straps={straps} />
        </group>

        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.32}
          scale={6}
          blur={2.6}
          far={2.4}
          frames={high ? Infinity : 1}
        />

        <Sparkles count={high ? 46 : medium ? 24 : 12} scale={[4.6, 3, 3]} size={2.2} speed={0.28} color="#a9ccf2" />

        {controls && (
          <OrbitControls
            makeDefault
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.7}
            minDistance={3.4}
            maxDistance={7}
            minPolarAngle={Math.PI / 3.2}
            maxPolarAngle={Math.PI / 1.85}
          />
        )}
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <span className="rounded-full bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 shadow-sm backdrop-blur">
          Drag to rotate
        </span>
      </div>
    </div>
  )
}
