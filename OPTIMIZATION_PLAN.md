# Scatch E-Commerce Website - Comprehensive Optimization & Enhancement Plan

## Project Overview

Scatch is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform for luxury bags with:
- **Backend**: Express.js 5, Mongoose, JWT auth, Cloudinary image upload, RESTful API
- **Frontend**: React 19 + Vite, TypeScript, Tailwind CSS 4, React Router 7, Context API state
- **Features**: Product catalog, cart, checkout, admin dashboard with analytics, role-based access

---

## 1. Advanced 3D Model Animations Integration

### 1.1 Current State
- Uses 2D images (PNG/SVG) for product display
- Simple CSS animations (float, pulse, fade-in)
- No WebGL/Three.js integration

### 1.2 Recommended 3D Stack
```
@react-three/fiber (React renderer for Three.js)
@react-three/drei (Useful helpers: Environment, OrbitControls, Html, etc.)
three (Core Three.js library)
@react-three/postprocessing (Post-processing effects)
maath (Math utilities for animations)
gsap (Advanced animation timeline)
```

### 1.3 Implementation Plan

#### A. Product 3D Viewer Component
```tsx
// src/components/3d/ProductViewer.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'

interface ProductViewerProps {
  modelUrl: string // .glb/.gltf model
  fallbackImage: string
  bgColor: string
  panelColor: string
  autoRotate?: boolean
  enableControls?: boolean
}

export function ProductViewer({ modelUrl, fallbackImage, bgColor, panelColor, autoRotate = true, enableControls = true }: ProductViewerProps) {
  const { scene } = useGLTF(modelUrl)
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ background: bgColor }}
      >
        <Environment preset="studio" />
        <ContactShadows opacity={0.3} scale={2} />
        
        <primitive
          object={scene}
          scale={1.5}
          dispose={null}
        />
        
        {enableControls && <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />}
        
        {/* Floating particles effect */}
        <FloatingParticles color={panelColor} count={50} />
      </Canvas>
      
      {/* Fallback for reduced motion / low-end devices */}
      <motion.img
        src={fallbackImage}
        alt="Product"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ display: 'none' }} // Show via media query
      />
    </div>
  )
}

// Particle system for ambient atmosphere
function FloatingParticles({ color, count }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      sizes[i] = Math.random() * 2 + 0.5
      
      const hex = color.replace('#', '')
      colors[i * 3] = parseInt(hex.slice(0, 2), 16) / 255
      colors[i * 3 + 1] = parseInt(hex.slice(2, 4), 16) / 255
      colors[i * 3 + 2] = parseInt(hex.slice(4, 6), 16) / 255
    }
    return { positions, colors, sizes }
  }, [color, count])
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={points.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={points.colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" array={points.sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        vertexColors 
        size={1} 
        sizeAttenuation 
        transparent 
        opacity={0.6}
        blending={AdditiveBlending}
      />
    </points>
  )
}
```

#### B. Hero Section 3D Scene
```tsx
// src/components/3d/HeroScene.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Environment, OrbitControls, ContactShadows } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'

export function HeroScene() {
  const bagModel = useGLTF('/models/bag-hero.glb')
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => { gl.setClearColor(0, 0) }}
    >
      <Environment preset="city" background={false} />
      <ContactShadows opacity={0.4} scale={3} blur={2} />
      
      <HeroBag model={bagModel} scrollY={scrollY} />
      <FloatingOrbs />
      <ParticleField />
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  )
}

function HeroBag({ model, scrollY }) {
  const group = useRef()
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
      group.current.rotation.x = scrollY * 0.0005
    }
  })
  
  return (
    <group ref={group} scale={2.5}>
      <primitive object={model.scene} dispose={null} />
    </group>
  )
}
```

#### C. 3D Model Pipeline & Optimization
```bash
# 1. Create/Source 3D Models
# - Use Blender to create optimized .glb models
# - Target: < 500KB per model, < 10k triangles
# - Use Draco compression: npx gltf-pipeline -i model.glb -o model-draco.glb -d

# 2. Model Structure for Bags
# - Mesh: bag_body, straps, zipper, buckles, logo
# - Materials: leather, fabric, metal, plastic
# - Morph targets for: open/close, color variations

# 3. Loading Strategy
# - Progressive loading: low-poly -> high-poly
# - Suspense boundaries for async model loading
# - Preload critical models (hero, featured products)
```

#### D. Integration with Existing Product Cards
```tsx
// Enhanced ProductCard with 3D viewer toggle
interface ProductCard3DProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard3D({ product, onAddToCart }: ProductCard3DProps) {
  const [show3D, setShow3D] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  
  return (
    <article className="group relative rounded-3xl overflow-hidden border border-gray-200/90 bg-white">
      {/* 2D Image (default) */}
      {!show3D && (
        <div className="h-[220px] flex items-center justify-center p-6 relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* 3D Viewer (on hover/click) */}
      {show3D && product.modelUrl && (
        <Suspense fallback={<ModelLoader />}>
          <ProductViewer
            modelUrl={product.modelUrl}
            fallbackImage={product.image}
            bgColor={product.bgColor}
            panelColor={product.panelColor}
            autoRotate={true}
            enableControls={false}
            onLoad={setModelLoaded}
          />
        </Suspense>
      )}
      
      {/* 3D Toggle Button */}
      {product.modelUrl && (
        <button
          onClick={() => setShow3D(!show3D)}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:shadow-xl transition"
          aria-label={show3D ? 'View 2D Image' : 'View 3D Model'}
        >
          {show3D ? <ImageIcon /> : <BoxIcon />}
        </button>
      )}
      
      {/* Product Details Panel */}
      <div className="p-4" style={{ backgroundColor: product.panelColor }}>
        {/* ... existing panel content ... */}
      </div>
    </article>
  )
}
```

### 1.4 Performance Optimizations for 3D
```tsx
// src/hooks/useReducedMotion.ts
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return reduced
}

// src/hooks/useDevicePerformance.ts
export function useDevicePerformance() {
  const [tier, setTier] = useState<'high' | 'medium' | 'low'>('high')
  
  useEffect(() => {
    // Detect GPU/CPU capabilities
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ''
    
    // Simple heuristic
    if (!gl) setTier('low')
    else if (navigator.hardwareConcurrency <= 4) setTier('medium')
    else setTier('high')
  }, [])
  
  return tier
}
```

---

## 2. Performance Optimizations

### 2.1 Frontend Bundle Optimization
```typescript
// vite.config.ts - Enhanced
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }],
        ]
      }
    }),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress' }),
    visualizer({ 
      open: false, 
      gzipSize: true, 
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', '@react-three/fiber', '@react-three/drei', 'three'],
          'vendor-state': ['zustand', '@tanstack/react-query'],
          'vendor-anim': ['framer-motion', 'gsap'],
        }
      }
    },
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    include: ['@react-three/fiber', '@react-three/drei', 'three', 'framer-motion', 'gsap']
  }
})
```

### 2.2 Image & Asset Optimization
```typescript
// vite.config.ts - Add image optimization
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      test: /\.(jpe?g|png|webp|avif|svg)$/i,
      includePublic: true,
      png: { quality: 80 },
      jpeg: { quality: 75 },
      webp: { quality: 80, lossless: false },
      avif: { quality: 70, lossless: false },
      svg: { multipass: true },
      cache: true,
      cacheLocation: 'node_modules/.cache/image-optimizer'
    })
  ]
})
```

### 2.3 Code Splitting & Lazy Loading
```tsx
// src/routes/AppRoutes.tsx - Enhanced with Suspense
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { LoadingSpinner } from '../components/UI/LoadingSpinner'

// Lazy load heavy pages
const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.default })))
const Shop = lazy(() => import('../pages/Shop').then(m => ({ default: m.default })))
const Cart = lazy(() => import('../pages/Cart').then(m => ({ default: m.default })))
const Admin = lazy(() => import('../pages/Admin').then(m => ({ default: m.default })))
const CreateProduct = lazy(() => import('../pages/CreateProduct').then(m => ({ default: m.default })))
const OwnerLogin = lazy(() => import('../pages/OwnerLogin').then(m => ({ default: m.default })))

// 3D Components - separate chunk
const ProductViewer3D = lazy(() => import('../components/3d/ProductViewer').then(m => ({ default: m.ProductViewer })))

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
        <Route path="/admin/create-product" element={<Layout><CreateProduct /></Layout>} />
      </Routes>
    </Suspense>
  )
}
```

### 2.4 Virtualized Lists for Large Catalogs
```tsx
// src/components/ProductGrid.tsx
import { FixedSizeGrid as Grid } from 'react-window'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ProductCard product={products[index]} onAddToCart={onAddToCart} />
    </div>
  )
  
  return (
    <Grid
      columnCount={4}
      columnWidth={320}
      rowCount={Math.ceil(products.length / 4)}
      rowHeight={480}
      width="100%"
      height={600}
      overscanCount={2}
    >
      {Row}
    </Grid>
  )
}
```

### 2.5 Backend Performance
```javascript
// Backend/src/utils/cache.js - Redis caching layer
import { createClient } from 'redis'

const redis = createClient({ url: process.env.REDIS_URL })
redis.connect()

export async function cacheProducts(key, data, ttl = 300) {
  await redis.setEx(key, ttl, JSON.stringify(data))
}

export async function getCachedProducts(key) {
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

// In product controller
const getAllProducts = asyncHandler(async (req, res) => {
  const cacheKey = `products:${JSON.stringify(req.query)}`
  
  const cached = await getCachedProducts(cacheKey)
  if (cached) {
    return res.json(new ApiResponse(200, cached, 'Products from cache'))
  }
  
  // ... existing query logic
  
  await cacheProducts(cacheKey, { products, total, page, totalPages })
  return res.json(new ApiResponse(200, { products, total, page, totalPages }))
})
```

---

## 3. Design System Enhancements

### 3.1 Extended Tailwind Config
```typescript
// tailwind.config.ts - Enhanced design tokens
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Scatch Brand Colors
        scatch: {
          50: '#F6F9FE',
          100: '#E7F1FD',
          200: '#D2E4F8',
          300: '#A8C8ED',
          400: '#7AAAE0',
          500: '#568FD2',  // Primary
          600: '#3D77C0',  // Hover
          700: '#2E5E9B',
          800: '#234673',
          900: '#1B3559',
        },
        // Semantic Colors
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#FAFAFA',
          sunken: '#F5F5F5',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          purple: '#A855F7',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter Variable', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(110, 155, 205, 0.15)',
        'medium': '0 10px 40px -8px rgba(110, 155, 205, 0.2)',
        'strong': '0 20px 60px -12px rgba(110, 155, 205, 0.25)',
        'glow': '0 0 40px -5px rgba(56, 189, 248, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

### 3.2 Component Library Structure
```typescript
// src/components/UI/index.ts - Atomic Design System
export * from './atoms/Button'
export * from './atoms/Input'
export * from './atoms/Badge'
export * from './atoms/Icon'
export * from './atoms/LoadingSpinner'
export * from './atoms/Avatar'

export * from './molecules/ProductCard'
export * from './molecules/ProductCard3D'
export * from './molecules/CategoryChip'
export * from './molecules/FilterPanel'
export * from './molecules/QuantitySelector'
export * from './molecules/PriceDisplay'
export * from './molecules/RatingStars'

export * from './organisms/Header'
export * from './organisms/Footer'
export * from './organisms/ProductGrid'
export * from './organisms/ProductGrid3D'
export * from './organisms/HeroSection'
export * from './organisms/HeroSection3D'
export * from './organisms/CartSidebar'
export * from './organisms/CheckoutForm'
export * from './organisms/AdminSidebar'
export * from './organisms/AnalyticsDashboard'
```

### 3.3 Design Token System (CSS Variables)
```css
/* src/styles/design-tokens.css */
:root {
  /* Color Primitives */
  --color-blue-50: #EFF6FF;
  --color-blue-100: #DBEAFE;
  --color-blue-500: #3B82F6;
  --color-blue-600: #2563EB;
  --color-emerald-500: #10B981;
  --color-amber-500: #F59E0B;
  
  /* Semantic Colors */
  --color-primary: var(--color-blue-600);
  --color-primary-hover: var(--color-blue-700);
  --color-primary-light: var(--color-blue-50);
  --color-success: var(--color-emerald-500);
  --color-warning: var(--color-amber-500);
  --color-error: #EF4444;
  
  /* Surface Colors */
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FAFAFA;
  --color-surface-sunken: #F5F5F5;
  --color-border: #E5E7EB;
  --color-border-strong: #D1D5DB;
  
  /* Text Colors */
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-tertiary: #9CA3AF;
  --color-text-inverse: #FFFFFF;
  
  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-glow: 0 0 40px -5px rgb(56 189 248 / 0.4);
  
  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-normal: 250ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-slow: 350ms cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
}
```

---

## 4. Architecture Enhancements

### 4.1 State Management Migration (Context -> Zustand)
```typescript
// src/store/useStore.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Product, CartItem, Order, User } from '../types/products'

interface StoreState {
  // Auth
  user: User | null
  login: (email: string, password: string, asOwner?: boolean) => Promise<boolean>
  register: (fullName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  
  // Products
  products: Product[]
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => void
  removeProduct: (id: string | number) => void
  
  // Cart
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  updateQuantity: (id: string | number, quantity: number) => void
  removeFromCart: (id: string | number) => void
  clearCart: () => void
  
  // Orders
  orders: Order[]
  placeOrder: (address: string, paymentMethod: string) => Promise<{ success: boolean; orderId?: string }>
  updateOrderStatus: (id: string, status: Order['status']) => void
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // ... implementation with Immer for immutable updates
      }),
      {
        name: 'scatch-store',
        partialize: (state) => ({
          user: state.user,
          cartItems: state.cartItems,
          // Don't persist products/orders - fetch from server
        })
      }
    )
  )
)
```

### 4.2 API Layer with TanStack Query
```typescript
// src/api/products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    }
  })
}
```

### 4.3 Backend Architecture Improvements
```javascript
// Backend/src/middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 login attempts per hour
  message: { error: 'Too many login attempts, please try again later' },
})

// Backend/src/utils/validation.js
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.enum(['Backpack', 'Duffel', 'Tote', 'Pouch']),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  panelColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
})

// Backend/src/controllers/product.controller.js - With validation
const createProduct = asyncHandler(async (req, res) => {
  const validatedData = productSchema.parse(req.body)
  // ... rest of implementation
})
```

### 4.4 Database Optimization
```javascript
// Backend/src/models/product.model.js - Enhanced indexes
productSchema.index({ name: 'text', description: 'text', category: 'text' })
productSchema.index({ category: 1, price: 1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ stock: 1 })
productSchema.index({ discountPercent: -1 })
productSchema.index({ isAvailable: 1, stock: 1 })

// Compound index for common queries
productSchema.index({ category: 1, isAvailable: 1, createdAt: -1 })

// Backend/src/db/index.js - Connection pooling
import mongoose from 'mongoose'

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  console.log(`MongoDB Connected: ${conn.connection.host}`)
}
```

---

## 5. Developer Experience Improvements

### 5.1 TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@store/*": ["src/store/*"],
      "@api/*": ["src/api/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

### 5.2 Testing Setup
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      }
    }
  }
})

// src/test/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
}))

vi.mock('@react-three/drei', () => ({
  Environment: () => null,
  OrbitControls: () => null,
  ContactShadows: () => null,
  Html: ({ children }) => <div>{children}</div>,
  useGLTF: () => ({ scene: new THREE.Group() }),
}))
```

### 5.3 Component Testing Example
```tsx
// src/components/UI/atoms/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
```

### 5.4 Storybook for Component Documentation
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
}

export default config
```

```tsx
// src/components/UI/atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: 'Primary Button', variant: 'primary' } }
export const Secondary: Story = { args: { children: 'Secondary Button', variant: 'secondary' } }
export const Loading: Story = { args: { children: 'Loading...', loading: true } }
```

### 5.5 CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --run --coverage
      - uses: codecov/codecov-action@v4

  build-frontend:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: frontend/dist

  build-backend:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build:backend
```

---

## 6. Implementation Priority Roadmap

### Phase 1: Foundation (Week 1-2)
| Task | Priority | Effort |
|------|----------|--------|
| Set up TypeScript strict mode | High | Low |
| Add ESLint + Prettier + Husky | High | Low |
| Configure Vite bundle analyzer | High | Low |
| Set up testing infrastructure (Vitest + RTL) | High | Medium |
| Add Storybook for component docs | Medium | Medium |
| Implement design token system | High | Low |

### Phase 2: 3D Integration (Week 3-5)
| Task | Priority | Effort |
|------|----------|--------|
| Add @react-three/fiber + drei dependencies | High | Low |
| Create ProductViewer 3D component | High | High |
| Create HeroScene 3D component | High | High |
| Build 3D model pipeline (Blender -> GLB -> Draco) | High | High |
| Integrate 3D viewer into ProductCard | High | Medium |
| Add reduced motion / device performance detection | Medium | Medium |
| Implement progressive model loading | Medium | Medium |

### Phase 3: Performance (Week 4-5)
| Task | Priority | Effort |
|------|----------|--------|
| Implement code splitting with lazy routes | High | Low |
| Add virtualized product grid | High | Medium |
| Set up Redis caching on backend | High | Medium |
| Add database indexes | High | Low |
| Implement image optimization pipeline | Medium | Low |
| Add compression (gzip + brotli) | Medium | Low |

### Phase 4: Architecture (Week 5-7)
| Task | Priority | Effort |
|------|----------|--------|
| Migrate Context -> Zustand + Immer | High | High |
| Add TanStack Query for server state | High | Medium |
| Add Zod validation schemas | High | Medium |
| Implement rate limiting | High | Low |
| Add API versioning | Medium | Low |
| Set up CI/CD pipeline | High | Medium |

### Phase 5: Polish (Week 7-8)
| Task | Priority | Effort |
|------|----------|--------|
| Enhance design system components | Medium | Medium |
| Add micro-interactions & transitions | Medium | Low |
| Implement skeleton loaders | Medium | Low |
| Add error boundaries | High | Low |
| Accessibility audit (WCAG 2.1 AA) | High | Medium |
| Performance audit (Lighthouse > 90) | High | Medium |

---

## 7. 3D Model Creation Guide

### 7.1 Blender Workflow for Bag Models
```
1. Reference Setup
   - Import product photos as reference planes
   - Set up orthographic views (front, side, top)

2. Modeling
   - Base mesh: Box -> Subdivision Surface
   - Separate objects: body, straps, pockets, zippers, buckles
   - Use modifiers: Bevel (edges), Solidify (thickness), Mirror (symmetry)

3. UV Unwrapping
   - Mark seams on hidden edges
   - Use Smart UV Project or manual unwrap
   - Pack islands with margin: 0.01

4. Materials (PBR)
   - Leather: Base Color + Normal + Roughness + AO
   - Metal: Base Color (gold/silver) + Metalness: 1.0 + Roughness: 0.1
   - Fabric: Base Color + Normal + Roughness: 0.8
   - Plastic: Base Color + Roughness: 0.3

5. Optimization
   - Decimate modifier for LODs
   - Target: <10k tris (high), <3k tris (medium), <1k tris (low)
   - Bake high-poly details to normal maps

6. Export
   - File -> Export -> glTF 2.0 (.glb)
   - Settings: Selected Objects, Apply Modifiers, Tangents
   - Draco compression: npx gltf-pipeline -i model.glb -o model-draco.glb -d
```

### 7.2 Model Variants for Products
```
/public/models/
├── backpack/
│   ├── backpack-high.glb      (10k tris, full detail)
│   ├── backpack-medium.glb    (4k tris, simplified)
│   ├── backpack-low.glb       (1k tris, basic shape)
│   └── backpack-draco.glb     (compressed)
├── duffel/
├── tote/
└── pouch/
```

---

## 8. Monitoring & Analytics

### 8.1 Frontend Monitoring
```typescript
// src/utils/analytics.ts
import * as Sentry from '@sentry/react'
import { browserTracingIntegration } from '@sentry/browser'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  Sentry.addBreadcrumb({ category: 'ui', message: name, data: properties })
}

// Web Vitals
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

onCLS(metric => trackEvent('web_vitals_cls', { value: metric.value }))
onFID(metric => trackEvent('web_vitals_fid', { value: metric.value }))
onFCP(metric => trackEvent('web_vitals_fcp', { value: metric.value }))
onLCP(metric => trackEvent('web_vitals_lcp', { value: metric.value }))
onTTFB(metric => trackEvent('web_vitals_ttfb', { value: metric.value }))
```

### 8.2 Backend Monitoring
```javascript
// Backend/src/utils/metrics.js
import promClient from 'prom-client'

const collectDefaultMetrics = promClient.collectDefaultMetrics
collectDefaultMetrics({ timeout: 5000 })

export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
})

export const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
})

// Middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path || req.path, status_code: res.statusCode },
      (Date.now() - start) / 1000
    )
  })
  next()
})
```

---

## 9. Accessibility Checklist

- [ ] Semantic HTML structure (header, main, footer, nav, section, article)
- [ ] ARIA labels on all interactive elements
- [ ] Focus indicators (visible outline on :focus-visible)
- [ ] Color contrast ratios (WCAG AA: 4.5:1 normal, 3:1 large)
- [ ] Keyboard navigation for all components
- [ ] Screen reader announcements for dynamic content
- [ ] Reduced motion support (prefers-reduced-motion)
- [ ] Alt text for all images (including 3D model fallbacks)
- [ ] Form labels and error messages
- [ ] Language declaration (lang="en")
- [ ] Skip to main content link

---

## 10. Security Enhancements

```javascript
// Backend/src/middlewares/security.js
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    }
  }
}))

app.use(mongoSanitize()) // Prevent NoSQL injection
app.use(xss()) // Prevent XSS
app.use(hpp()) // Prevent HTTP Parameter Pollution

// CSRF Protection for state-changing operations
import csrf from 'csurf'
app.use('/api/v1', csrf({ cookie: true }))
```

---

## Summary

This comprehensive plan transforms Scatch from a solid MERN e-commerce site into a **cutting-edge, 3D-enabled, performant, and maintainable platform**. The phased approach ensures incremental value delivery while managing technical risk.

**Key differentiators after implementation:**
1. **Immersive 3D shopping experience** - WebGL product viewers with progressive enhancement
2. **Sub-100ms interactions** - Optimized bundle, caching, virtualized lists
3. **Design system maturity** - Consistent, accessible, themeable components
4. **Developer velocity** - Type-safe, tested, documented, CI/CD ready
5. **Scalable architecture** - Zustand + TanStack Query + validated APIs

**Estimated timeline: 8 weeks for full implementation**
- Phases 1-2 can run in parallel (foundation + 3D)
- Phase 3-4 are sequential (performance -> architecture)
- Phase 5 is polish throughout