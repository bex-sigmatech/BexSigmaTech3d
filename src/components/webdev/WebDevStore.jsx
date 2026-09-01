import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import ServiceDetail from './ServiceDetail'

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
    id: 'marketing-dashboard',
    badge: '🎯 MARKETING EXCEL NODE',
    name: 'Marketing Performance Excel Dashboard',
    tagline: 'Automated Campaign ROI, Lead Funnel & Marketing Analytics Sheet',
    price: 299,
    priceDisplay: '₹299',
    originalPrice: '₹599',
    currency: 'INR',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    image: '/campaign_pro.jpg',
    imageFit: 'contain',
    imageBg: '#ffffff',
    features: [
      'Automated Campaign ROI & Ad Spend Tracker',
      'Multi-Channel Lead Funnel & Conversion Analytics',
      'Interactive Marketing Attribution Heatmaps',
      'Delivered directly to Customer Email via Google Drive',
      'Fully Editable Microsoft Excel (.xlsx) Format',
      'Lifetime Drive Access & Template Updates',
    ],
    tech: ['Excel .xlsx', 'Google Drive', 'ROI Analytics', 'Marketing ML'],
    deliveryDays: 0,
    popular: true,
  },
  {
    id: 'business-dashboard',
    badge: '💼 BUSINESS EXCEL NODE',
    name: 'Business Executive Analytics Excel Dashboard',
    tagline: 'Unified Business Operations, Revenue & Strategy Sheet',
    price: 349,
    priceDisplay: '₹349',
    originalPrice: '₹699',
    currency: 'INR',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    image: '/net_worth_dashboard.jpg',
    imageFit: 'cover',
    imagePosition: 'center',
    features: [
      'Executive KPI & Business Operations Telemetry',
      'Revenue Projections & Cashflow Modeling Sheets',
      'Interactive Strategy & Performance Dashboards',
      'Delivered directly to Customer Email via Google Drive',
      'Fully Editable Microsoft Excel (.xlsx) Format',
      'Commercial Use License Included',
    ],
    tech: ['Excel .xlsx', 'Google Drive', 'Business KPI'],
    deliveryDays: 0,
    popular: true,
  },
  {
    id: 'finance-trend',
    badge: '📈 EXCEL FINANCIAL NODE',
    name: 'Financial Trend Analytic Excel Dashboard',
    tagline: 'Predictive Financial & Yield Analytics Excel Template',
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
      'Real-Time Portfolio Yield & Revenue Modeling',
      'Multi-Currency Trend Analytics & Pivot Tables',
      'Automated Financial Heatmaps & Risk Projections',
      'Instant Access via Google Drive Email Link',
      'Fully Editable Microsoft Excel (.xlsx) Format',
      'Lifetime Drive Access & Template Updates',
    ],
    tech: ['Excel .xlsx', 'Google Drive', 'Pivot Tables', 'Financial ML'],
    deliveryDays: 0,
    popular: false,
  },
  {
    id: 'sales-dashboard',
    badge: '📊 EXCEL SALES NODE',
    name: 'Sales Performance Excel Dashboard',
    tagline: 'Real-Time Revenue & Conversion Optimization Excel Engine',
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
      'Live Revenue & Deal Funnel Analytics Sheets',
      'Automated Conversion Rate Optimization Charts',
      'Interactive Sales Forecasting Heatmaps',
      'Instant Email Delivery with Google Drive Link',
      'Fully Editable Excel (.xlsx) & Google Sheets Ready',
      '1 Month Priority Assistance Support',
    ],
    tech: ['Excel .xlsx', 'Google Drive', 'Charts & Formulas'],
    deliveryDays: 0,
    popular: false,
  },
  {
    id: 'hr-kpi',
    badge: '👥 EXCEL HR NODE',
    name: 'HR KPI Performance Excel Dashboard',
    tagline: 'Workforce Performance, Retention & KPI Analytics Sheet',
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
      'Sent Directly to Customer Email via Google Drive',
      'Editable Microsoft Excel (.xlsx) Format',
      'Real-Time Organizational Health Metrics',
    ],
    tech: ['Excel .xlsx', 'Google Drive', 'KPI Metrics'],
    deliveryDays: 0,
    popular: false,
  },
  {
    id: 'dashboard-suite',
    badge: '📊 EXCEL ALL-IN-ONE BUNDLE',
    name: 'One Dashboard BI Suite (Excel Bundle)',
    tagline: 'Unified Business Intelligence & Executive Analytics Master Drive',
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
      'Master Access to All Excel Dashboard Templates',
      'Sales, HR, Financial & Project Management Sheets',
      'Instant Automated Email Delivery with Drive Folder',
      'Interactive Data Drill-down & Pivot Tables',
      'Lifetime Google Drive Folder Sync & Free Updates',
      'Commercial License Included',
    ],
    tech: ['Excel .xlsx', 'Google Drive Master Folder', 'Financial ML'],
    deliveryDays: 0,
    popular: true,
  },
  {
    id: 'kpi-dashboard',
    badge: '📈 KPI EXCEL NODE',
    name: 'KPI Performance Excel Dashboard',
    tagline: 'Dedicated KPI Metrics & Performance Analytics Sheet',
    price: 295,
    priceDisplay: '₹295',
    originalPrice: '₹590',
    currency: 'INR',
    color: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    image: '/hr_kpi.jpg',
    imageFit: 'cover',
    imagePosition: 'center',
    features: [
      'Dedicated KPI Tracking & Benchmark Sheets',
      'Automated Performance Scoring & Heatmaps',
      'Interactive Drill-down & Trend Analytics',
      'Instant Email Delivery with Google Drive Link',
      'Fully Editable Excel (.xlsx) Format',
      'Real-Time KPI Health Metrics',
    ],
    tech: ['Excel .xlsx', 'Google Drive', 'KPI Metrics'],
    deliveryDays: 0,
    popular: false,
  },
]

const WORKS = [
  {
    id: 'normal',
    title: 'Normal Business Website',
    subtitle: 'High-Performance Corporate & Conversion Portals',
    meta: '01 / 04 · ESSENTIAL WEB',
    desc: 'Clean, fast, and mobile-ready websites for businesses and personal brands. SEO-optimized, easy to manage, and engineered to convert — landing pages, portfolios, and corporate hubs that load in under a second.',
    image: '/sector_website.jpg',
    models: 'Frontend Static vs Full Stack Dynamic CMS',
    timeline: '3-5 Days Delivery',
    specs: ['< 1.2s Page Load', '100% Mobile & Tablet Responsive', 'SEO Core Integrated', 'Custom CMS & Lead Capture'],
    tags: ['Corporate', 'Landing Page', 'Portfolio', 'Next.js', 'Tailwind'],
    accent: '#38bdf8',
    glow: 'rgba(56,189,248,0.35)',
    icon: '◈',
    num: '01'
  },
  {
    id: 'threed',
    title: '3D Interactive Website',
    subtitle: 'Spatial WebGL & Cinematic Storytelling',
    meta: '02 / 04 · 3D SPATIAL WEB',
    desc: 'Immersive 3D spatial web experiences with Three.js, WebGL, and cinematic scroll. Premium interactive visual journeys — 3D product visualizers and Apple Vision-style interfaces that make your brand unforgettable.',
    image: '/sector_3d_website.jpg',
    models: 'Normal 3D Showcase vs Full Stack 3D',
    timeline: '7-14 Days Delivery',
    specs: ['60 FPS WebGL Engine', 'Draco 3D Mesh Compression', 'Spatial Camera Rigs', 'Hardware Accelerated'],
    tags: ['Three.js', 'WebGL', 'R3F', 'Shader Motion', 'Blender'],
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    icon: '⬢',
    num: '02'
  },
  {
    id: 'software',
    title: 'Custom Software Application',
    subtitle: 'Enterprise SaaS, Dashboards & Microservices',
    meta: '03 / 04 · SAAS & SOFTWARE',
    desc: 'Tailored web applications, administrative dashboards, portals, and SaaS tools. From initial concept to cloud deployment — secure, scalable, and engineered around your exact workflow.',
    image: '/sector_software.jpg',
    models: 'Custom Portal vs Multi-Tenant SaaS',
    timeline: '1-3 Weeks Sprint',
    specs: ['REST / GraphQL APIs', 'Post-Quantum Auth & Storage', 'Real-Time WebSockets', 'Automated CI/CD Pipelines'],
    tags: ['Web App', 'Admin Dashboard', 'SaaS Architecture', 'Node / Express', 'Cloud DB'],
    accent: '#34d399',
    glow: 'rgba(52,211,153,0.35)',
    icon: '⬣',
    num: '03'
  },
  {
    id: 'custom',
    title: 'Your Unique Idea — We Build It',
    subtitle: 'Bespoke R&D, AI Agents & First-of-Kind Products',
    meta: '04 / 04 · BESPOKE INNOVATION',
    desc: 'Have a breakthrough vision or unique concept? Share your idea and our engineering pod architects it into reality. Experimental builds, custom AI pipelines, and uncharted digital platforms.',
    image: '/sector_ai_automation.jpg',
    models: 'Concept Prototype to Full Production',
    timeline: 'Bespoke Engineering Sprint',
    specs: ['Dedicated Engineering Pod', 'Weekly Milestone Demos', '100% Custom IP', 'Direct CEO Architecture'],
    tags: ['Custom Build', 'AI Pipelines', 'Rapid Prototype', 'Direct CEO Line'],
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    icon: '✦',
    num: '04'
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

/* ── Cashfree Payment Handler — supports single product OR cart bundle ── */
async function initiateCashfreePayment(product, customerName, customerEmail, customerPhone, onSuccess, onError) {
  try {
    voiceEmitter.emit('PAYMENT_PAGE_VISIBLE')
    const isCartBundle = Array.isArray(product.cartItems) && product.cartItems.length > 0
    const orderPayload = isCartBundle
      ? { cartItems: product.cartItems, userName: customerName, customerEmail, customerPhone }
      : { productId: product.id, userName: customerName, customerEmail, customerPhone }
    const res = await fetch(`${BACKEND_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.error || 'Order creation failed')
    const { payment_session_id, order_id } = data

    const runVerification = async () => {
      try {
        const verifyPayload = isCartBundle
          ? { order_id: order_id, cartItems: product.cartItems, customerEmail: customerEmail, customerName: customerName || 'Operator' }
          : { order_id: order_id, productId: product.id, customerEmail: customerEmail, customerName: customerName || 'Operator' }
        const verifyRes = await fetch(`${BACKEND_URL}/api/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verifyPayload),
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

    if (data.simulated) {
      if (data._cashfreeError) console.warn('Order was simulated due to Cashfree error:', data._cashfreeError)
      await runVerification()
      return
    }
    if (data._cashfreeError) {
      console.warn('Cashfree order warning (proceeding):', data._cashfreeError)
    }

    // Initialize Cashfree JS SDK — env-driven (VITE_CASHFREE_ENV=PRODUCTION for live)
    const cfMode = (import.meta.env.VITE_CASHFREE_ENV || 'SANDBOX') === 'PRODUCTION' ? 'production' : 'sandbox'
    const cashfree = window.Cashfree({ mode: cfMode })

    const checkoutOptions = {
      paymentSessionId: payment_session_id,
      redirectTarget: '_modal', // Opens as popup modal (similar to Razorpay)
    }

    const result = await cashfree.checkout(checkoutOptions)

    if (result.error) {
      console.error('Cashfree checkout error:', result.error)
      // Common sandbox fallbacks: simulated session or expired session
      if (result.error.code === 'payment_session_id_invalid' || result.error.message?.includes('payment_session_id')) {
        console.warn('⚠️ Cashfree Sandbox session invalid — completing as test order:', result.error)
        await runVerification()
        return
      }
      // Cashfree sandbox shows "temporary issue" when using real cards — guide user to test cards
      const msg = result.error.message || ''
      if (msg.toLowerCase().includes('temporary') || msg.toLowerCase().includes('try again') || msg.toLowerCase().includes('bank')) {
        onError(`${msg} — Note: You are in SANDBOX (TEST) mode. Use Cashfree test card 4111 1111 1111 1111, expiry 12/30, CVV 123. Real cards only work in PRODUCTION (VITE_CASHFREE_ENV=PRODUCTION + live keys).`)
        return
      }
      onError(result.error.message || 'Payment failed. If this is Sandbox, use test card 4111 1111 1111 1111.')
      return
    }

    if (result.paymentDetails) {
      await runVerification()
    } else if (!result.error) {
      // No error but no paymentDetails — could be user closed modal
      console.warn('Cashfree checkout closed without paymentDetails', result)
      onError('Payment not completed — checkout closed. For Sandbox testing, it will auto-verify on next retry.')
    }
  } catch (err) {
    onError(err.message)
  }
}

export default function WebDevStore() {
  const { userName, exitWebDevStore } = useStore()

  // Service detail modal & Active Pathway
  const [selectedService, setSelectedService] = useState(null)
  const [activePathwayIndex, setActivePathwayIndex] = useState(0)

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

  // Customer Info Checkout Form States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [targetProduct, setTargetProduct] = useState(null)
  const [custName, setCustName] = useState(userName || '')
  const [custEmail, setCustEmail] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [toast, setToast] = useState(null) // {msg, type} for 10/10 no-alert UI
  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000) }

  // 3D Cylinder Carousel States
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [radius, setRadius] = useState(400)

  // Track the active modulo index
  const activeModuloIndex = ((currentIndex % PRODUCTS.length) + PRODUCTS.length) % PRODUCTS.length

  // 3D Auto-slide trigger (paused during modal or payment)
  useEffect(() => {
    if (isPaused || isCustomerModalOpen || isPaying || checkoutMode !== null) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 4500) // Spin every 4.5s

    return () => clearInterval(interval)
  }, [isPaused, isCustomerModalOpen, isPaying, checkoutMode])

  // Responsive 3D radius adjustment
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(230)
      } else if (window.innerWidth < 1024) {
        setRadius(300)
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

  // 10/10 voice commerce: handle Sigma tool calls addToCart / openCheckout / showProductDetails
  useEffect(() => {
    const onAdd = (e) => {
      const { productId, quantity } = e.detail || {}
      const p = PRODUCTS.find((x) => x.id === productId)
      if (p) {
        for (let i = 0; i < (quantity || 1); i++) addToCart(p)
        setCurrentIndex(PRODUCTS.findIndex((x) => x.id === productId))
      }
    }
    const onOpen = (e) => {
      const pid = typeof e.detail === 'string' ? e.detail : e.detail?.productId
      const p = PRODUCTS.find((x) => x.id === pid)
      if (p) handleOpenCheckoutModal(p)
    }
    const onShow = (e) => {
      const pid = e.detail
      const idx = PRODUCTS.findIndex((x) => x.id === pid)
      if (idx >= 0) setCurrentIndex(idx)
    }
    window.addEventListener('ADD_TO_CART', onAdd)
    window.addEventListener('OPEN_CHECKOUT', onOpen)
    window.addEventListener('SHOW_PRODUCT', onShow)
    window.addEventListener('SHOW_PRICING', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
    return () => {
      window.removeEventListener('ADD_TO_CART', onAdd)
      window.removeEventListener('OPEN_CHECKOUT', onOpen)
      window.removeEventListener('SHOW_PRODUCT', onShow)
    }
  }, [])

  // LAGFREE Canvas Particle — capped 30/12, no grid, O(n) links via spatial hash, throttled mousemove, pause on hidden
  useEffect(() => {
    if (isCustomerModalOpen || isPaying || checkoutMode !== null) return
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = document.getElementById('store-particle-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let isHidden = false

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const particles = []
    const count = window.innerWidth < 768 ? 12 : 30

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.4 + 0.15
      })
    }

    let mouse = { x: null, y: null }
    let mouseRaf = 0
    const handleMouseMove = (e) => {
      if (mouseRaf) return
      mouseRaf = requestAnimationFrame(() => {
        mouse.x = e.clientX
        mouse.y = e.clientY
        mouseRaf = 0
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    const onVis = () => {
      isHidden = document.hidden
      if (!isHidden && !animationFrameId) animationFrameId = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVis)

    let lastDraw = 0
    const draw = (now = performance.now()) => {
      if (document.hidden) { animationFrameId = null; return }
      // throttle to ~45fps max
      if (now - lastDraw < 22) { animationFrameId = requestAnimationFrame(draw); return }
      lastDraw = now
      ctx.clearRect(0, 0, width, height)

      // LAGFREE: no grid lines (saves ~20 strokes/frame)

      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Mouse push-back — throttled already
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const distSq = dx * dx + dy * dy
          if (distSq < 14400) {
            const dist = Math.sqrt(distSq)
            const force = (120 - dist) / 120
            p.x -= dx * force * 0.02
            p.y -= dy * force * 0.02
          }
        }

        ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // LAGFREE: only link to next 4 neighbours, not O(n²) full — 120 vs 1225 checks
        for (let j = idx + 1; j < Math.min(particles.length, idx + 5); j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distSq = dx * dx + dy * dy
          if (distSq < 8100) {
            const dist = Math.sqrt(distSq)
            ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - dist / 90) * 0.06})`
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

    animationFrameId = requestAnimationFrame(draw)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (mouseRaf) cancelAnimationFrame(mouseRaf)
      animationFrameId = null
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [isCustomerModalOpen, isPaying, checkoutMode])


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

  const handleOpenCheckoutModal = (product) => {
    cinemaAudio.playOrbSelect()
    setTargetProduct(product)
    setIsCustomerModalOpen(true)
  }

  const handleStartPayment = (e) => {
    e.preventDefault()
    if (!custEmail || !custEmail.includes('@')) {
      showToast('Please enter a valid email — your selected folder ZIP will be sent there (single-use link).')
      return
    }
    if (!custName) {
      showToast('Please enter your name.')
      return
    }

    setIsCustomerModalOpen(false)
    setIsPaying(true)
    setCheckoutProduct(targetProduct)

    initiateCashfreePayment(
      targetProduct,
      custName,
      custEmail,
      custPhone,
      (data) => {
        setIsPaying(false)
        setCheckoutMode('cashfree')
        setSandboxStep(3)
        setSandboxMsg(`🎉 Payment Verified! Your Excel Dashboard access link has been sent to ${custEmail}`)
        cinemaAudio.playAccessGrantedChime()
        voiceEmitter.emit('PAYMENT_SUCCESS')
        if (cart.length > 0) setCart([])
      },
      (err) => {
        setIsPaying(false)
        setCheckoutMode(null)
        showToast(`Payment error: ${err} — In Sandbox use test card 4111 1111 1111 1111`, 'error')
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
          {/* Currency Switcher — 10/10: shows USD estimate but charges INR via Cashfree */}
          <button
            aria-label={`Switch currency, currently ${currency}`}
            className="interactive"
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            title={currency === 'INR' ? 'Show USD estimate (charge is still INR via Cashfree)' : 'Show INR (actual charge)'}
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
            💱 CURRENCY: {currency === 'INR' ? '₹ INR (charged)' : '$ USD (est.)'}
          </button>

          {/* Cart trigger button */}
          <div role="button" tabIndex={0} aria-label={`Open cart, ${cart.reduce((s, i) => s + i.quantity, 0)} items`} className="webdev-cart-trigger interactive" onClick={() => setIsCartOpen(true)} onKeyDown={(e) => e.key === 'Enter' && setIsCartOpen(true)}>
            <span>🛒 OBSERVATORY CART</span>
            {cart.length > 0 && <span className="webdev-cart-badge" aria-live="polite">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
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
            const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

            // On mobile, skip distant cards to drastically boost GPU FPS
            if (isMobile && minDiff > 1) {
              return null
            }

            // Highlight active nodes, dim others for holographic look
            let opacity = 0.12
            let pointerEvents = 'none'
            let scale = 0.55
            let zOffset = -40
            let zIndex = 1

            if (minDiff === 0) {
              opacity = 1.0
              pointerEvents = 'auto'
              scale = isMobile ? 0.88 : 0.82
              zOffset = isMobile ? 65 : 45 // Float active card 65px forward in 3D space
              zIndex = 100
            } else if (minDiff === 1) {
              opacity = isMobile ? 0.32 : 0.45
              pointerEvents = 'none'
              scale = isMobile ? 0.56 : 0.68
              zOffset = isMobile ? -30 : -10
              zIndex = 10
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
                  transform: `rotateY(${angle}deg) translateZ(${radius + zOffset}px) scale(${scale})`,
                  zIndex,
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
                      loading="lazy"
                      decoding="async"
                      fetchPriority={idx === activeModuloIndex ? "high" : "low"}
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
                          onClick={() => handleOpenCheckoutModal(product)}
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
                          onClick={() => handleOpenCheckoutModal(product)}
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

      {/* ── What We Build — Dynamic 4-Way Architecture Matrix ── */}
      <section className="webdev-bento-section">
        <div className="webdev-bento-header">
          <div className="webdev-bento-eyebrow">
            <span className="bento-eyebrow-dot" />
            WHAT WE BUILD · 4 CORE PATHWAYS
            <span className="bento-eyebrow-line" />
          </div>
          <h2 className="webdev-bento-title">Four ways we bring your idea to life</h2>
          <p className="webdev-bento-sub">From essential corporate web to spatial 3D and enterprise SaaS — select a pathway below to inspect architecture models.</p>
        </div>

        {/* Pathway Tabs Selector */}
        <div className="webdev-pathway-tabs" role="tablist">
          {WORKS.map((work, idx) => {
            const isSelected = activePathwayIndex === idx
            return (
              <button
                key={work.id}
                className={`webdev-pathway-tab interactive ${isSelected ? 'active' : ''}`}
                style={{
                  '--tab-accent': work.accent,
                  '--tab-glow': work.glow,
                }}
                onClick={() => {
                  cinemaAudio.playOrbSelect()
                  setActivePathwayIndex(idx)
                }}
                role="tab"
                aria-selected={isSelected}
              >
                <span className="pathway-tab-num">{work.num}</span>
                <span className="pathway-tab-icon">{work.icon}</span>
                <span className="pathway-tab-title">{work.title}</span>
              </button>
            )
          })}
        </div>

        {/* Active Pathway Hero Stage (Split Showcase) */}
        {(() => {
          const activeWork = WORKS[activePathwayIndex] || WORKS[0]
          return (
            <div
              className="webdev-pathway-stage"
              style={{
                '--stage-accent': activeWork.accent,
                '--stage-glow': activeWork.glow,
              }}
            >
              {/* Left Stage: Visualizer Preview */}
              <div className="pathway-stage-visual">
                <img src={activeWork.image} alt={activeWork.title} className="pathway-stage-img" loading="lazy" />
                <div className="pathway-stage-overlay" />
                <div className="pathway-stage-scanline" />
                
                <div className="pathway-stage-badge-bar">
                  <span className="pathway-stage-badge" style={{ color: activeWork.accent, borderColor: activeWork.accent }}>
                    {activeWork.meta}
                  </span>
                  <span className="pathway-stage-timeline">⏱ {activeWork.timeline}</span>
                </div>

                <div className="pathway-stage-corners tl" style={{ borderColor: activeWork.accent }} />
                <div className="pathway-stage-corners tr" style={{ borderColor: activeWork.accent }} />
                <div className="pathway-stage-corners bl" style={{ borderColor: activeWork.accent }} />
                <div className="pathway-stage-corners br" style={{ borderColor: activeWork.accent }} />
              </div>

              {/* Right Stage: Architecture Specs & Actions */}
              <div className="pathway-stage-info">
                <div>
                  <div className="pathway-stage-header">
                    <span className="pathway-stage-num">{activeWork.num}</span>
                    <span className="pathway-stage-model-pill" style={{ color: activeWork.accent }}>
                      {activeWork.models}
                    </span>
                  </div>
                  <h3 className="pathway-stage-title">{activeWork.title}</h3>
                  <div className="pathway-stage-subtitle" style={{ color: activeWork.accent }}>
                    {activeWork.subtitle}
                  </div>
                  <p className="pathway-stage-desc">{activeWork.desc}</p>
                </div>

                {/* Specs Grid */}
                <div className="pathway-stage-specs">
                  {activeWork.specs?.map((spec, i) => (
                    <div key={i} className="pathway-spec-chip">
                      <span className="pathway-spec-dot" style={{ background: activeWork.accent }} />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Tags */}
                <div className="pathway-stage-tags">
                  {activeWork.tags.map((t, i) => (
                    <span key={i} className="pathway-tech-tag">{t}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pathway-stage-actions">
                  <button
                    className="pathway-btn-primary interactive"
                    style={{ background: activeWork.accent }}
                    onClick={() => {
                      cinemaAudio.playOrbSelect()
                      setSelectedService(activeWork.id)
                    }}
                  >
                    <span>🔍 EXPLORE DEEP ARCHITECTURE & QUOTE</span>
                    <span>→</span>
                  </button>
                  <a
                    href="mailto:bexsigmatech@gmail.com?subject=Project%20Inquiry%20-%20Bex%20Sigma%20Tech"
                    className="pathway-btn-secondary interactive"
                  >
                    ✉ CONTACT CEO
                  </a>
                </div>
              </div>
            </div>
          )
        })()}

        {/* 4-Card Pathway Interactive Strip */}
        <div className="webdev-pathway-grid">
          {WORKS.map((work, idx) => {
            const isSelected = activePathwayIndex === idx
            return (
              <div
                key={idx}
                className={`webdev-pathway-mini-card interactive ${isSelected ? 'active' : ''}`}
                style={{
                  '--accent': work.accent,
                  '--glow': work.glow,
                }}
                onClick={() => {
                  cinemaAudio.playOrbSelect()
                  setActivePathwayIndex(idx)
                }}
              >
                <div className="pathway-mini-img-wrap">
                  <img src={work.image} alt={work.title} className="pathway-mini-img" loading="lazy" />
                  <div className="pathway-mini-img-overlay" />
                  <span className="pathway-mini-num">{work.num}</span>
                </div>
                <div className="pathway-mini-content">
                  <div className="pathway-mini-top">
                    <span className="pathway-mini-icon">{work.icon}</span>
                    <span className="pathway-mini-meta" style={{ color: work.accent }}>{work.meta.split('·')[1]?.trim() || work.meta}</span>
                  </div>
                  <h4 className="pathway-mini-title">{work.title}</h4>
                  <div className="pathway-mini-cta" style={{ color: work.accent }}>
                    <span>{isSelected ? '● Active' : 'Select'}</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            )
          })}
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
              onClick={() => {
                const cartItems = cart.map((item) => ({ productId: item.product.id, quantity: item.quantity }))
                const cartProduct = cart.length === 1
                  ? cart[0].product
                  : {
                    cartItems,
                    name: `Cart Bundle (${cart.length} Excel Dashboards)`,
                    price: getCartTotal(), // rupees for display, server calculates paise
                    priceDisplay: `₹${getCartTotal().toLocaleString('en-IN')}`,
                    id: `bundle_${Date.now()}`,
                  }
                setIsCartOpen(false)
                handleOpenCheckoutModal(cartProduct)
              }}
            >
              ⚙️ INITIATE SECURE CHECKOUT (₹{getCartTotal().toLocaleString('en-IN')})
            </button>
          </div>
        )}
      </div>

      {/* ── Customer Details Checkout Form Modal ── */}
      {isCustomerModalOpen && targetProduct && (
        <div className="webdev-modal-overlay open" style={{ zIndex: 10000 }}>
          <div className="webdev-modal-box" style={{ maxWidth: '480px', padding: '30px', textAlign: 'left', background: 'rgba(11, 17, 32, 0.95)', border: '1px solid rgba(0, 212, 255, 0.3)', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', color: '#00d4ff', margin: 0 }}>
                🔐 Customer Checkout & Delivery
              </h2>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#8899a6', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Product Summary */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px 15px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>Selected Item</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#ffffff', marginTop: '2px' }}>{targetProduct.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>
                Total Amount: {targetProduct.priceDisplay}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                📁 <span>Deliverable: Instant Google Drive link sent to your email after payment</span>
              </div>
            </div>

            {/* Customer Inputs Form */}
            <form onSubmit={handleStartPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#8899a6', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  👤 FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Kandavel"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  ✉️ EMAIL ADDRESS * (Google Drive link sent here)
                </label>
                <input
                  type="email"
                  required
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: '#8899a6', display: 'block', marginTop: '4px' }}>
                  Double check your email address to ensure prompt delivery!
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#8899a6', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  📱 PHONE NUMBER (Optional)
                </label>
                <input
                  type="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#8899a6',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #10b981, #0284c7)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                    fontFamily: 'Orbitron, sans-serif'
                  }}
                >
                  💳 PROCEED TO PAY {targetProduct.priceDisplay}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {/* 10/10 Toast — replaces alert(), respects single-product ZIP */}
      {toast && (
        <div role="alert" aria-live="assertive" style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: toast.type === 'error' ? 'linear-gradient(135deg,#ef4444,#b91c1c)' : 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', padding: '14px 22px', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', zIndex: 10001, fontSize: '13px', fontWeight: 600, maxWidth: '90vw', textAlign: 'center' }}>
          {toast.msg}
        </div>
      )}

      {/* Service Detail Article Modal */}
      {selectedService && (
        <ServiceDetail serviceId={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  )
}
