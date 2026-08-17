import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'

/* ==========================================================================
   BEX SIGMA TECH — WEB DEVELOPMENT PRODUCTS STORE
   5 Premium SaaS Products + Cart Drawer + Sandbox Checkout + Portfolio
   ========================================================================== */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

const PRODUCTS = [
  {
    id: 'omnicoder-ai',
    badge: '🤖 RECOMMENDED',
    name: 'OmniCoder AI Agent',
    tagline: 'Autonomous Repository Developer Hub',
    price: 299,
    priceDisplay: '₹299',
    originalPrice: '₹599',
    currency: 'INR',
    color: '#7c3aed',
    glowColor: 'rgba(124, 58, 237, 0.25)',
    image: '/habit_tracker.png',
    features: [
      'Multi-Agent Collaborative Coding',
      'Automated Test & Build Integrity Guard',
      'Git Integration (GitHub/GitLab)',
      'Natural Language Code Manipulation',
      'Semantic Codebase Indexing',
      '1 Month Free Support',
    ],
    tech: ['Multi-Agent AI', 'Git Hooks', 'NodeJS', 'React'],
    deliveryDays: 7,
    popular: true,
  },
  {
    id: 'quantum-shield',
    badge: '🛡️ SECURITY 10/10',
    name: 'QuantumShield Crypt Vault',
    tagline: 'Post-Quantum Shield & Telemetry Armor',
    price: 291,
    priceDisplay: '₹291',
    originalPrice: '₹582',
    currency: 'INR',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    image: '/campaign_pro.jpg',
    imageFit: 'contain',
    imageBg: '#ffffff',
    features: [
      'NIST-Approved Post-Quantum Cryptography',
      'End-to-End Encrypted Telemetry',
      'Zero-Trust Biometric Access Controls',
      'Real-time Threat Sentinel Node',
      'Tamper-proof Observability Logs',
      '3 Months Priority Support',
    ],
    tech: ['Kyber / Dilithium', 'Zero-Trust', 'Rust Core'],
    deliveryDays: 12,
    popular: false,
  },
  {
    id: 'spacemesh-iot',
    badge: '🛰️ REAL-TIME DATA',
    name: 'SpaceMesh IoT Gateway',
    tagline: 'Planetary Device Telemetry Aggregator',
    price: 359,
    priceDisplay: '₹359',
    originalPrice: '₹718',
    currency: 'INR',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    image: '/net_worth_dashboard.jpg',
    imageFit: 'cover',
    imagePosition: 'center',
    features: [
      'Zero-Latency Planetary Sync',
      'High-Throughput Timescale Database',
      'MQTT / WebSockets Broker Protocol',
      'Automated Hardware Sensor Failover',
      'Interactive 3D Telemetry Canvas',
      '3 Months Tech Assistance',
    ],
    tech: ['IoT Mesh', 'WebSockets', 'Go', 'TimescaleDB'],
    deliveryDays: 10,
    popular: false,
  },
  {
    id: 'vision-spatial',
    badge: '🕶️ SPATIAL WEB',
    name: 'VisionSpatial Designer',
    tagline: 'Apple Vision Pro Web UI Canvas',
    price: 289,
    priceDisplay: '₹289',
    originalPrice: '₹578',
    currency: 'INR',
    color: '#e879f9',
    glowColor: 'rgba(232, 121, 249, 0.25)',
    image: '/project_scorecard.jpg',
    imageFit: 'contain',
    imageBg: '#ffffff',
    features: [
      'Interactive WebXR Sandbox Creator',
      'Depth-Based UI Layout Engines',
      'Framer Spatial Motion Core',
      'Optimized 3D Model Assets Loader',
      'Glassmorphic Style Tokens Exporter',
      '6 Months Premium Support',
    ],
    tech: ['Three.js', 'React Three Fiber', 'WebXR'],
    deliveryDays: 14,
    popular: false,
  },
  {
    id: 'biosync-health',
    badge: '🩺 HEALTHCARE NODE',
    name: 'BioSync Telehealth Engine',
    tagline: 'Decentralized Clinical Matrix Console',
    price: 291,
    priceDisplay: '₹291',
    originalPrice: '₹582',
    currency: 'INR',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    image: '/hr_roi.jpg',
    imageFit: 'contain',
    imageBg: '#ffffff',
    features: [
      'HIPAA Compliant Patient Telemetry',
      'Distributed Node Consultation Logs',
      'Real-Time Biosignals Streaming',
      'Automated Emergency Alert Triggers',
      'Integrative Diagnostic Interface',
      '1 Month Operational Sync',
    ],
    tech: ['React Native', 'WebRTC', 'HIPAA Shield'],
    deliveryDays: 5,
    popular: false,
  },
  {
    id: 'finance-trend',
    badge: '📈 FINANCE NODE',
    name: 'Financial Trend Analytic',
    tagline: 'Predictive Financial & Yield Analytics Engine',
    price: 319,
    priceDisplay: '₹319',
    originalPrice: '₹638',
    currency: 'INR',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    image: '/financial_trend.jpg',
    imageFit: 'contain',
    imageBg: '#ffffff',
    features: [
      'Real-Time Portfolio Yield Modeling',
      'Multi-Currency Trend Analytics',
      'Automated Risk Score Projections',
      'Interactive Financial Heatmaps',
      'Tamper-Proof Audit Logging',
      '1 Month Priority Analytics Support',
    ],
    tech: ['React', 'D3.js', 'Node.js', 'Financial ML'],
    deliveryDays: 7,
    popular: false,
  },
  {
    id: 'sales-dashboard',
    badge: '📊 SALES NODE',
    name: 'Sales Performance Dashboard',
    tagline: 'Real-Time Revenue & Conversion Optimization Engine',
    price: 281,
    priceDisplay: '₹281',
    originalPrice: '₹562',
    currency: 'INR',
    color: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.25)',
    image: '/sales_dashboard.jpg',
    imageFit: 'cover',
    imagePosition: 'center',
    features: [
      'Live Revenue & Deal Funnel Analytics',
      'Automated Conversion Rate Optimization',
      'Interactive Sales Forecasting Heatmaps',
      'Multi-Channel Performance Tracking',
      'Instant Lead & CRM Sync',
      '1 Month Operational Support',
    ],
    tech: ['React', 'Chart.js', 'Node.js', 'PostgreSQL'],
    deliveryDays: 5,
    popular: false,
  },
  {
    id: 'hr-kpi',
    badge: '👥 HR KPI NODE',
    name: 'HR KPI Performance Dashboard',
    tagline: 'Workforce Performance, Retention & KPI Analytics',
    price: 295,
    priceDisplay: '₹295',
    originalPrice: '₹590',
    currency: 'INR',
    color: '#2563eb',
    glowColor: 'rgba(37, 99, 235, 0.25)',
    image: '/hr_kpi.jpg',
    imageFit: 'cover',
    imagePosition: 'center',
    features: [
      'Workforce KPI & Productivity Tracking',
      'Employee Retention & Turnover Modeling',
      'Automated Performance Review Dashboards',
      'Attendance & Skill Matrix Metrics',
      'Real-Time Organizational Health Score',
      '1 Month Priority HR Sync Support',
    ],
    tech: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
    deliveryDays: 5,
    popular: false,
  },
  {
    id: 'dashboard-suite',
    badge: '📊 ALL-IN-ONE SUITE',
    name: 'One Dashboard BI Suite',
    tagline: 'Unified Business Intelligence & Executive Analytics',
    price: 256,
    priceDisplay: '₹256',
    originalPrice: '₹512',
    currency: 'INR',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    image: '/one_dashboard_suite.jpg',
    imageFit: 'contain',
    imageBg: '#ffffff',
    features: [
      'Centralized Multi-Dashboard Command Center',
      'Unified Sales, HR, Financial & Project Feeds',
      'Real-Time Cross-Module Executive Telemetry',
      'Interactive Data Drill-down Canvas',
      'Automated Multi-Channel Report Generator',
      '3 Months Premium Suite Support',
    ],
    tech: ['React', 'Next.js', 'D3.js', 'PostgreSQL', 'GraphQL'],
    deliveryDays: 7,
    popular: true,
  },
]

const WORKS = [
  {
    title: 'Solaris DEX Portal',
    meta: 'WEB3 / TRADING',
    desc: 'High-frequency decentralized liquidity exchange built on React, custom WebGL shader orbits, and full ledger synchronization.',
    tags: ['WebGL', 'Solidity', 'Tailwind', 'ChartJS']
  },
  {
    title: 'AeroSpace Telemetry Core',
    meta: 'AEROSPACE / DASHBOARD',
    desc: 'Real-time rocket launch tracking telemetry platform using Next.js server components and scalable high-performance WebSockets.',
    tags: ['Next.js', 'WebSockets', 'd3.js', 'Node.js']
  },
  {
    title: 'Nidus Spatial LMS',
    meta: 'VR EDUCATION',
    desc: 'Immersive spatial classroom dashboard rendering responsive HTML widgets directly inside WebXR Apple Vision structures.',
    tags: ['React Three Fiber', 'WebXR', 'Zustand']
  },
  {
    title: 'Veloce Headless Commerce',
    meta: 'E-COMMERCE',
    desc: 'Ultra-low latency storefront delivering zero-layout shifts and instant cart operations powered by GraphQL and edge nodes.',
    tags: ['Vite', 'GraphQL', 'Shopify Storefront']
  }
]

const CLIENTS = [
  {
    title: 'Atlas Global Logistics',
    meta: 'SLA: 99.99%',
    desc: 'Coordinating live operations of over 10,000 active freight nodes across land, sea, and atmospheric routes.',
    tags: ['Mapbox API', 'GeoJSON', 'Rust Server']
  },
  {
    title: 'Helix Genomic Nodes',
    meta: 'SLA: 99.9%',
    desc: 'High-availability DNA sequence mapping pipeline utilizing clustered GPU compute nodes for instantaneous analysis.',
    tags: ['Clustered GPU', 'AWS Lambda', 'Python Core']
  },
  {
    title: 'Elysium Virtual Reality',
    meta: 'SLA: 99.95%',
    desc: 'Serving interactive 3D virtual home walkthroughs rendering at 90fps directly inside desktop and mobile web browsers.',
    tags: ['Three.js', 'React UI', 'PBR Materials']
  },
  {
    title: 'Krypton Power Grid',
    meta: 'SLA: 99.99%',
    desc: 'Live telemetry processing dashboard tracking planetary electricity flow and trigger protection relays instantly.',
    tags: ['IoT Gateway', 'InfluxDB', 'Grafana API']
  }
]

/* ── Cashfree Single-item Payment Handler ── */
async function initiateCashfreePayment(product, userName, onSuccess, onError) {
  try {
    voiceEmitter.emit('PAYMENT_PAGE_VISIBLE')
    const res = await fetch(`${BACKEND_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, userName }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.error || 'Order creation failed')
    const { payment_session_id, order_id } = data

    // Initialize Cashfree JS SDK
    const cashfree = window.Cashfree({ mode: 'sandbox' }) // Change to 'production' for live

    const checkoutOptions = {
      paymentSessionId: payment_session_id,
      redirectTarget: '_modal', // Opens as popup modal (similar to Razorpay)
    }

    const result = await cashfree.checkout(checkoutOptions)

    if (result.error) {
      onError(result.error.message || 'Payment failed')
      return
    }

    if (result.paymentDetails) {
      // Payment completed — verify on backend
      try {
        const verifyRes = await fetch(`${BACKEND_URL}/api/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: order_id,
            productId: product.id,
            customerEmail: '',
            customerName: userName || 'Operator',
          }),
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          onSuccess(verifyData)
        } else {
          onError(verifyData.error || 'Payment verification failed')
        }
      } catch (e) {
        onError('Verification error: ' + e.message)
      }
    }
  } catch (err) {
    onError(err.message)
  }
}

export default function WebDevStore() {
  const { userName, exitWebDevStore } = useStore()

  // Cart & Sidebar States
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)


  const [currency, setCurrency] = useState('INR') // 'INR' | 'USD'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL') // 'ALL' | 'AI' | 'BI' | 'SECURITY' | 'IOT'

  // Checkout States
  const [checkoutMode, setCheckoutMode] = useState(null) // 'cashfree' | 'sandbox' | null
  const [sandboxStep, setSandboxStep] = useState(0) // 0: inactive, 1: generating order, 2: processing payload, 3: success
  const [sandboxMsg, setSandboxMsg] = useState('')
  const [checkoutProduct, setCheckoutProduct] = useState(null)

  // 3D Cylinder Carousel States
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [radius, setRadius] = useState(400)

  // Track the active modulo index
  const activeModuloIndex = ((currentIndex % PRODUCTS.length) + PRODUCTS.length) % PRODUCTS.length

  // 3D Auto-slide trigger
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 4500) // Spin every 4.5s

    return () => clearInterval(interval)
  }, [isPaused])

  // Responsive 3D radius adjustment
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(200)
      } else if (window.innerWidth < 1024) {
        setRadius(290)
      } else {
        setRadius(370)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextSlide = () => {
    cinemaAudio.playScrollTransition()
    setCurrentIndex(prev => prev + 1)
  }

  const prevSlide = () => {
    cinemaAudio.playScrollTransition()
    setCurrentIndex(prev => prev - 1)
  }



  useEffect(() => {
    voiceEmitter.emit('PRICING_VISIBLE')
  }, [userName])

  // 10/10 Canvas Particle Animation Loop
  useEffect(() => {
    const canvas = document.getElementById('store-particle-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const particles = []
    const count = 75

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.45 + 0.15
      })
    }

    let mouse = { x: null, y: null }
    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Fine holographic matrix grid lines
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.025)'
      ctx.lineWidth = 1
      const gridSize = 70
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Mouse push-back logic
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            const force = (140 - dist) / 140
            p.x -= dx * force * 0.03
            p.y -= dy * force * 0.03
          }
        }

        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw links between close nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 110) {
            ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - dist / 110) * 0.1})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])


  const addToCart = (product) => {
    cinemaAudio.playOrbSelect()
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId) => {
    cinemaAudio.playScrollTransition()
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId, delta) => {
    cinemaAudio.playScrollTransition()
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta
            return { ...item, quantity: nextQty }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    )
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  const handleCheckoutSandbox = () => {
    cinemaAudio.playOrbSelect()
    setCheckoutMode('sandbox')
    setSandboxStep(1)
    setSandboxMsg('DECRYPTING MATRIX PAYMENT TUNNEL...')
    voiceEmitter.emit('PAYMENT_PAGE_VISIBLE')

    setTimeout(() => {
      setSandboxStep(2)
      setSandboxMsg('VERIFYING OPERATOR SIGNATURE AND SYNCING NODES...')
      cinemaAudio.playScrollTransition()
    }, 1500)

    setTimeout(() => {
      setSandboxStep(3)
      setSandboxMsg('TRANSACTION SUCCESSFUL! ACCREDITATION GRANTED.')
      cinemaAudio.playAccessGrantedChime()
      voiceEmitter.emit('PAYMENT_SUCCESS')
      setCart([]) // Clear cart
    }, 3200)
  }

  const handleSingleCashfreeCheckout = (product) => {
    if (!window.Cashfree) {
      alert('Cashfree SDK not loaded. Check internet or check script tag.')
      return
    }
    setCheckoutMode('cashfree')
    setCheckoutProduct(product)
    setSandboxStep(1)
    setSandboxMsg('Connecting with Secure Cashfree Gateway...')

    initiateCashfreePayment(
      product,
      userName,
      (data) => {
        setSandboxStep(3)
        setSandboxMsg(`Payment Verified! ID: ${data.payment_id}. Access Granted.`)
        cinemaAudio.playAccessGrantedChime()
        voiceEmitter.emit('PAYMENT_SUCCESS')
      },
      (err) => {
        setCheckoutMode(null)
        alert(`Payment error: ${err}`)
      }
    )
  }

  return (
    <div className="webdev-store-container">
      {/* Cashfree SDK is loaded via index.html */}

      {/* Dark holographic background grids */}
      <div className="webdev-store-bg" />

      {/* 10/10 Interactive Particle Field */}
      <canvas id="store-particle-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />


      {/* Header */}
      <header className="webdev-store-header">
        <div className="webdev-header-left">
          <button className="webdev-back-btn interactive" onClick={exitWebDevStore}>
            ← BACK TO HQ
          </button>
          <div className="webdev-header-titles">
            <span className="webdev-dept-label">WEB DEVELOPMENT DEPARTMENT</span>
            <h1 className="webdev-store-title">Secure Product Matrix</h1>
            <p className="webdev-store-sub">
              Operator: <strong style={{ color: '#a78bfa' }}>{userName || 'COMMANDER'}</strong> · 10/10 SaaS Blueprints
            </p>
          </div>
        </div>

        <div className="webdev-header-right" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Currency Switcher */}
          <button
            className="interactive"
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            style={{
              background: 'rgba(0, 212, 255, 0.12)',
              border: '1px solid rgba(0, 212, 255, 0.4)',
              color: '#00d4ff',
              padding: '6px 14px',
              borderRadius: '4px',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            💱 CURRENCY: {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>

          {/* Cart trigger button */}
          <div className="webdev-cart-trigger interactive" onClick={() => setIsCartOpen(true)}>
            <span>🛒 OBSERVATORY CART</span>
            {cart.length > 0 && <span className="webdev-cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
          </div>

          <div className="webdev-secure-badge">
            <span>🔒</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>100% Encrypted</div>
              <div style={{ fontSize: '0.62rem', opacity: 0.65 }}>Powered by Cashfree & Sandbox</div>
            </div>
          </div>
        </div>
      </header>



      {/* Slider controls row */}
      <div className="webdev-slider-controls-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '15px auto 5px auto', padding: '0 20px', zIndex: 10, position: 'relative' }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em' }}>
          SELECT DEPLOYMENT LAYER (Active Node: {activeModuloIndex + 1} / {PRODUCTS.length})
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="webdev-slider-btn interactive"
            onClick={prevSlide}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#00d4ff',
              padding: '8px 18px',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.85rem',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.15)'
            }}
          >
            ◀ PREV
          </button>
          <button
            className="webdev-slider-btn interactive"
            onClick={nextSlide}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#a78bfa',
              padding: '8px 18px',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '0.85rem',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(167, 139, 250, 0.15)'
            }}
          >
            NEXT ▶
          </button>
        </div>
      </div>

      {/* 3D Round Tunnel Slider */}
      <div
        className="webdev-slider-viewport"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="webdev-slider-track"
          style={{
            transform: `rotateY(${-currentIndex * (360 / PRODUCTS.length)}deg)`
          }}
        >
          {PRODUCTS.map((product, idx) => {
            const stepAngle = 360 / PRODUCTS.length
            const angle = idx * stepAngle
            const diff = Math.abs(activeModuloIndex - idx)
            const minDiff = Math.min(diff, PRODUCTS.length - diff)

            // Highlight active nodes, dim others for holographic look
            let opacity = 0.12
            let pointerEvents = 'none'
            let scale = 0.55
            if (minDiff === 0) {
              opacity = 1.0
              pointerEvents = 'auto'
              scale = 0.82
            } else if (minDiff === 1) {
              opacity = 0.55
              pointerEvents = 'none'
              scale = 0.70
            }

            return (
              <div
                key={product.id}
                className={`webdev-product-card ${product.popular ? 'popular' : ''}`}
                style={{
                  '--card-color': product.color,
                  '--card-glow': product.glowColor,
                  borderColor: product.popular ? product.color : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) scale(${scale})`,
                  opacity,
                  pointerEvents
                }}
              >
                {product.image ? (
                  /* ── Image-based card — FULL FILL model ── */
                  <div
                    className="ht-image-container"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = (e.clientX - rect.left) / rect.width - 0.5
                      const y = (e.clientY - rect.top) / rect.height - 0.5
                      const img = e.currentTarget.querySelector('.ht-product-img')
                      if (img) {
                        img.style.transform = `scale(1.08) translate(${x * 12}px, ${y * 12}px)`
                      }
                      const shine = e.currentTarget.querySelector('.ht-shine-overlay')
                      if (shine) {
                        shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.22) 0%, transparent 55%)`
                        shine.style.opacity = '1'
                      }
                    }}
                    onMouseLeave={(e) => {
                      const img = e.currentTarget.querySelector('.ht-product-img')
                      if (img) img.style.transform = 'scale(1.02) translate(0, 0)'
                      const shine = e.currentTarget.querySelector('.ht-shine-overlay')
                      if (shine) shine.style.opacity = '0'
                    }}
                  >
                    {/* Full-bleed image layer */}
                    <img
                      className="ht-product-img"
                      src={product.image}
                      alt={product.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '74%',
                        objectFit: product.imageFit || 'cover',
                        objectPosition: product.imagePosition || "80% 20%",
                        backgroundColor: product.imageBg || 'transparent',
                        transition: 'transform 0.25s ease-out',
                        willChange: 'transform',
                        transform: 'scale(1.02)',
                        zIndex: 1,
                      }}
                    />

                    {/* Pulsing glow ring overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: '6px',
                      borderRadius: '14px',
                      border: `1.5px solid ${product.color}44`,
                      boxShadow: `inset 0 0 30px ${product.color}15, 0 0 20px ${product.color}20`,
                      animation: 'htGlowRing 3s ease-in-out infinite',
                      pointerEvents: 'none',
                      zIndex: 5,
                    }} />

                    {/* Shine overlay that follows mouse */}
                    <div className="ht-shine-overlay" style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                      zIndex: 6,
                    }} />

                    {/* Shimmer sweep */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      overflow: 'hidden',
                      pointerEvents: 'none',
                      zIndex: 7,
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                        animation: 'htShimmerSweep 3.5s ease-in-out infinite',
                      }} />
                    </div>

                    {/* Bottom gradient overlay for price + buttons */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)',
                      padding: '40px 14px 14px 14px',
                      zIndex: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                      {/* Price row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          textDecoration: 'line-through',
                          color: 'rgba(255,255,255,0.45)',
                          fontSize: '0.85rem',
                          fontFamily: 'Orbitron, sans-serif',
                        }}>{product.originalPrice}</span>
                        <span style={{
                          color: '#fff',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          fontFamily: 'Orbitron, sans-serif',
                          textShadow: `0 0 25px ${product.color}88`,
                        }}>{product.priceDisplay}</span>
                        <span style={{
                          background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                          color: '#fff',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '10px',
                          letterSpacing: '0.06em',
                          boxShadow: '0 2px 10px rgba(255, 65, 108, 0.4)',
                        }}>50% OFF</span>
                      </div>

                      {/* Buttons row */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="product-buy-btn interactive"
                          style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${product.color}66`,
                            color: '#fff',
                            fontSize: '0.68rem',
                            padding: '7px 4px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: 600,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = `${product.color}33`
                            e.target.style.transform = 'scale(1.04)'
                            e.target.style.boxShadow = `0 0 18px ${product.color}44`
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.08)'
                            e.target.style.transform = 'scale(1)'
                            e.target.style.boxShadow = 'none'
                          }}
                          onClick={() => addToCart(product)}
                        >
                          🛒 CART
                        </button>

                        <button
                          className="product-buy-btn interactive"
                          style={{
                            flex: 1.1,
                            background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)`,
                            border: 'none',
                            color: '#fff',
                            fontSize: '0.68rem',
                            padding: '7px 4px',
                            fontWeight: 700,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: `0 4px 15px ${product.color}44`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.04)'
                            e.target.style.boxShadow = `0 6px 25px ${product.color}77`
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)'
                            e.target.style.boxShadow = `0 4px 15px ${product.color}44`
                          }}
                          onClick={() => handleSingleCashfreeCheckout(product)}
                        >
                          🔐 PAY {currency === 'USD' ? `$${(product.price / 85).toFixed(2)}` : `₹${product.price}`}
                        </button>
                      </div>
                    </div>

                    {/* 50% OFF corner badge */}
                    <div className="ht-off-badge" style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                      color: '#fff',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '5px 12px',
                      borderRadius: '16px',
                      zIndex: 15,
                      boxShadow: '0 4px 20px rgba(255, 65, 108, 0.5)',
                      animation: 'htBadgePulse 2s ease-in-out infinite',
                      letterSpacing: '0.08em',
                    }}>
                      50% OFF
                    </div>

                    {/* SAVE badge top-left */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: '#fff',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '0.55rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      zIndex: 15,
                      boxShadow: '0 3px 12px rgba(34, 197, 94, 0.4)',
                      letterSpacing: '0.06em',
                    }}>
                      SAVE ₹300
                    </div>
                  </div>
                ) : (
                  /* ── Standard text-based product card ── */
                  <>
                    <div>
                      {/* Product Badge */}
                      <div className="product-card-header" style={{ marginBottom: '8px' }}>
                        <span className="product-badge" style={{ borderColor: product.color, color: product.color }}>{product.badge}</span>
                        <div className="product-orb" style={{ background: product.color, boxShadow: `0 0 25px ${product.color}` }} />
                      </div>

                      <h2 className="product-name" style={{ color: product.color, fontSize: '1.1rem', fontFamily: 'Orbitron, sans-serif' }}>{product.name}</h2>
                      <p className="product-tagline" style={{ opacity: 0.7, fontSize: '0.75rem', marginBottom: '8px' }}>{product.tagline}</p>

                      {/* Price */}
                      <div className="product-price-block" style={{ marginBottom: '8px' }}>
                        <span className="product-original-price" style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: '10px', fontSize: '0.75rem' }}>{product.originalPrice}</span>
                        <span className="product-price" style={{ color: product.color, fontSize: '1.2rem', fontWeight: 700 }}>{product.priceDisplay}</span>
                        <span className="product-price-note" style={{ fontSize: '0.72rem', opacity: 0.5 }}>/ blueprints</span>
                      </div>

                      <div className="product-delivery" style={{ borderColor: `${product.color}22`, fontSize: '0.72rem', padding: '5px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', marginBottom: '8px' }}>
                        ⏱ Delivery: <strong>{product.deliveryDays} cycles</strong>
                      </div>

                      {/* Features */}
                      <ul className="product-features-list" style={{ listStyle: 'none', padding: 0, margin: '0 0 10px 0', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {product.features.slice(0, 4).map((f, i) => (
                          <li key={i} style={{ display: 'flex', gap: '6px', opacity: 0.85 }}>
                            <span style={{ color: product.color }}>✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      {/* Tech Row */}
                      <div className="product-tech-row" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {product.tech.map((t, i) => (
                          <span key={i} className="product-tech-tag" style={{ borderColor: `${product.color}33`, color: product.color, fontSize: '0.62rem', padding: '1px 6px', borderRadius: '3px' }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Actions row */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="product-buy-btn interactive"
                          style={{
                            flex: 1,
                            background: 'transparent',
                            borderColor: product.color,
                            color: product.color,
                            fontSize: '0.72rem',
                            padding: '6px 4px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          onClick={() => addToCart(product)}
                        >
                          🛒 ADD TO CART
                        </button>
                        <button
                          className="product-buy-btn interactive"
                          style={{
                            flex: 1.1,
                            background: product.color,
                            borderColor: product.color,
                            color: '#000',
                            fontSize: '0.72rem',
                            padding: '6px 4px',
                            fontWeight: 700,
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleSingleCashfreeCheckout(product)}
                        >
                          🔐 PAY {product.priceDisplay}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Slider indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '15px auto 20px auto', zIndex: 10, position: 'relative' }}>
        {PRODUCTS.map((_, i) => {
          const isActive = i === activeModuloIndex
          return (
            <div
              key={i}
              className="interactive"
              onClick={() => {
                cinemaAudio.playScrollTransition()
                let diff = i - activeModuloIndex
                const halfLen = Math.floor(PRODUCTS.length / 2)
                if (diff > halfLen) diff -= PRODUCTS.length
                if (diff < -halfLen) diff += PRODUCTS.length
                setCurrentIndex((prev) => prev + diff)
              }}
              style={{
                width: isActive ? '30px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: isActive ? '#a78bfa' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isActive ? '0 0 8px #a78bfa' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          )
        })}
      </div>



      {/* ── 5 SaaS Logos section ── */}
      <section className="webdev-logos-section">
        <div className="webdev-logos-title">SECURE CLOUD INTEGRATION WITH PROVEN PLATFORMS</div>
        <div className="webdev-logos-row">
          <div className="webdev-logo-item">
            <svg className="webdev-logo-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            <span>AETHER.io</span>
          </div>
          <div className="webdev-logo-item">
            <svg className="webdev-logo-svg" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z" /></svg>
            <span>VERTEX</span>
          </div>
          <div className="webdev-logo-item">
            <svg className="webdev-logo-svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
            <span>NEBULA.DB</span>
          </div>
          <div className="webdev-logo-item">
            <svg className="webdev-logo-svg" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
            <span>APEX.CO</span>
          </div>
          <div className="webdev-logo-item">
            <svg className="webdev-logo-svg" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6z" /></svg>
            <span>SPECTER.NET</span>
          </div>
        </div>
      </section>

      {/* ── Works & Clients split section ── */}
      <section className="webdev-portfolio-section">
        {/* Column 1: Our Works */}
        <div>
          <h2 className="webdev-portfolio-col-title">
            <span className="webdev-portfolio-title-dot" style={{ background: '#00d4ff', boxShadow: '0 0 10px #00d4ff' }} />
            OUR WORKS (PORTFOLIO blueprints)
          </h2>
          <div className="webdev-portfolio-list">
            {WORKS.map((work, idx) => (
              <div key={idx} className="webdev-portfolio-card work">
                <div className="webdev-portfolio-card-header">
                  <h3 className="webdev-portfolio-card-title">{work.title}</h3>
                  <span className="webdev-portfolio-card-meta">{work.meta}</span>
                </div>
                <p className="webdev-portfolio-card-desc">{work.desc}</p>
                <div className="webdev-portfolio-tags">
                  {work.tags.map((t, i) => (
                    <span key={i} className="webdev-portfolio-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Our Clients */}
        <div>
          <h2 className="webdev-portfolio-col-title">
            <span className="webdev-portfolio-title-dot" style={{ background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
            OUR CLIENT CONSOLE (ACTIVE SYSTEM MAINTENANCE)
          </h2>
          <div className="webdev-portfolio-list">
            {CLIENTS.map((client, idx) => (
              <div key={idx} className="webdev-portfolio-card client">
                <div className="webdev-portfolio-card-header">
                  <h3 className="webdev-portfolio-card-title">{client.title}</h3>
                  <span className="webdev-portfolio-card-meta" style={{ color: '#34d399' }}>{client.meta}</span>
                </div>
                <p className="webdev-portfolio-card-desc">{client.desc}</p>
                <div className="webdev-portfolio-tags">
                  {client.tags.map((t, i) => (
                    <span key={i} className="webdev-portfolio-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar Drawer */}
      <div className={`webdev-cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`webdev-cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="webdev-cart-header">
          <h2 className="webdev-cart-title">
            <span>🛒 OBSERVATORY CART</span>
          </h2>
          <button className="webdev-cart-close" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        <div className="webdev-cart-items">
          {cart.length === 0 ? (
            <div className="webdev-cart-empty">
              <div className="webdev-cart-empty-icon">📭</div>
              <div>No blueprints in database cart.</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="webdev-cart-item">
                <div className="webdev-cart-item-dot" style={{ color: item.product.color }} />
                <div className="webdev-cart-item-info">
                  <h4 className="webdev-cart-item-name">{item.product.name}</h4>
                  <div className="webdev-cart-item-price" style={{ color: item.product.color }}>
                    {item.product.priceDisplay}
                  </div>
                  <div className="webdev-cart-item-qty-row">
                    <button className="webdev-cart-qty-btn" onClick={() => updateQuantity(item.product.id, -1)}>-</button>
                    <span className="webdev-cart-qty-val">{item.quantity}</span>
                    <button className="webdev-cart-qty-btn" onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                  </div>
                </div>
                <button className="webdev-cart-item-remove" onClick={() => removeFromCart(item.product.id)}>REMOVE</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="webdev-cart-footer">
            <div className="webdev-cart-total-row">
              <span className="webdev-cart-total-lbl">ESTIMATED TOTAL</span>
              <span className="webdev-cart-total-val">₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>

            <button
              className="webdev-cart-checkout-btn primary interactive"
              onClick={handleCheckoutSandbox}
            >
              ⚙️ INITIATE SANDBOX TRANSACTION
            </button>
          </div>
        )}
      </div>

      {/* Sandbox Transaction Modal */}
      <div className={`webdev-modal-overlay ${checkoutMode !== null ? 'open' : ''}`}>
        <div className="webdev-modal-box">
          {sandboxStep < 3 ? (
            <>
              <div className="webdev-pulse-loader">
                <div />
                <div />
              </div>
              <h2 className="webdev-modal-title">{checkoutMode === 'cashfree' ? 'Secure Gateway Active' : 'Sandbox Mainframe Processing'}</h2>
              <p className="webdev-modal-desc" style={{ color: '#a78bfa', fontFamily: 'monospace' }}>{sandboxMsg}</p>
            </>
          ) : (
            <>
              <div className="webdev-modal-icon">✅</div>
              <h2 className="webdev-modal-title">DECRYPT ACCREDITED</h2>
              <p className="webdev-modal-desc">{sandboxMsg}</p>
              <button
                className="webdev-modal-btn interactive"
                onClick={() => {
                  setCheckoutMode(null)
                  setSandboxStep(0)
                  setIsCartOpen(false)
                }}
              >
                DISMISS SYSTEM CONSOLE
              </button>
            </>
          )}
        </div>
      </div>



      <div className="webdev-trust-row" style={{ marginTop: '20px' }}>
        {['🔒 SSL Encrypted', '💳 All Cards Accepted', '🏦 UPI Supported', '📲 Net Banking', '↩️ Easy Refunds', '⭐ 500+ Clients'].map((badge, i) => (
          <span key={i} className="webdev-trust-badge">{badge}</span>
        ))}
      </div>

      <div className="webdev-api-note">
        Backend API: <code>{BACKEND_URL}</code> · Preloaded with 5 secure SaaS routes
      </div>
    </div>
  )
}
