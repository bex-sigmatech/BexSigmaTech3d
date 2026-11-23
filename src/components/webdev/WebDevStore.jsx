import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import ServiceDetail from './ServiceDetail'
import '../../styles/missionControl.css'
import '../../styles/ainExcelStore.css'
import '../../styles/wallPosterGallery.css'

/* ==========================================================================
   BEX SIGMA TECH — EXCEL ALL-IN-ONE (aIn) & DIGITAL PRODUCTS STORE
   Flagship "aIn" Pack (₹199) + Excel Academy + Microsoft Verified Manager Hari
   ========================================================================== */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

const SERVICES_PILLARS = [
  {
    num: '01',
    badge: '01',
    title: '300+ Financial & Valuation Models',
    subtitle: '3-Statement Models, DCF Engines & Cash Runway',
    desc: 'Battle-tested corporate 3-statement financial models, automated DCF valuation, scenario & sensitivity tables, monthly balance sheet variance, and investor pitch deck metrics.',
    accent: '#ff4d29',
    specs: ['3-Statement Models', 'Cash Runway Forecasts', 'DCF Valuation Engine', 'Sensitivity Tables']
  },
  {
    num: '02',
    badge: '02',
    title: '10 Executive BI Dashboards',
    subtitle: 'Automated Sales Cockpits & Dynamic Slicers',
    desc: 'Automated executive cockpits with interactive regional slicers, dynamic win-rate calculations, customer acquisition cost (CAC) trackers, and board-ready KPI trendlines.',
    accent: '#10b981',
    specs: ['Interactive Slicers', 'Sales Funnel Math', 'CAC & LTV Matrix', 'Executive Board Views']
  },
  {
    num: '03',
    badge: '03',
    title: '250+ Operations & HR Systems',
    subtitle: 'Automated Payroll, Shift Rosters & Workload Roadmaps',
    desc: 'Full workforce management sheets. Calculates overtime, automated tax deductions, employee attrition metrics, 360 performance reviews, and monthly payroll summaries in one click.',
    accent: '#38bdf8',
    specs: ['Automated Leaves & OT', 'Shift Scheduling Grid', '9-Box Talent Matrix', '1-Click Payroll Generator']
  },
  {
    num: '04',
    badge: '04',
    title: '450+ Sales & Marketing Engines',
    subtitle: 'Pipeline Forecasters, Gantt Timelines & Ad ROI',
    desc: 'Full-funnel pipeline forecaster with automated conversion probabilities, rep quota leaderboards, sales commission tiered matrix, and multi-currency billing logs.',
    accent: '#f59e0b',
    specs: ['Cohort Retention Heatmap', 'MRR/ARR Waterfall', 'Sales Quota Pacing', 'Commission Calculator']
  }
]

const HABITO_REVIEWS = [
  {
    author: 'Vikram S.',
    company: 'Fintech Solutions',
    quote: 'The 3-statement financial models and DCF sheets saved us over 40 hours during our seed fundraising. Clean, error-free formulas that gave our investors instant confidence.',
    tag: 'Financial Modeling',
  },
  {
    author: 'Arun K.',
    company: 'Logix Supply Chain',
    quote: 'Managing 1,500+ SKUs used to be a weekly nightmare of manual reconciliations. The automated inventory turnover and reorder sheets completely transformed our warehouse.',
    tag: 'Inventory & Operations',
  },
  {
    author: 'Priya M.',
    company: 'SaaS Pulse Media',
    quote: 'The executive sales cockpit with regional slicers is boardroom gold. Our CEO now relies on this exact dashboard for Monday morning leadership reviews.',
    tag: 'Executive BI Dashboard',
  },
]

const HYPERFIT_STEPS = [
  {
    num: '01',
    title: '1,000+ PRE-BUILT BUSINESS TEMPLATES',
    tagline: 'Universal architectures for 100+ industries',
    desc: 'Eliminate manual spreadsheet busywork with battle-tested templates for finance, operations, marketing, and sales.',
    status: 'INCLUDED'
  },
  {
    num: '02',
    title: '10 EXECUTIVE BI INTERACTIVE DASHBOARDS',
    tagline: 'Dynamic regional slicers & board-ready visuals',
    desc: 'Present with absolute confidence. Pre-linked interactive charts, KPI cards, and trendlines that impress executive leadership.',
    status: 'INCLUDED'
  },
  {
    num: '03',
    title: '5 VIP BONUS PROFESSIONAL TOOLKITS',
    tagline: 'Shortcuts, resumes, daily trackers & habits',
    desc: 'Includes essential productivity boosters: Excel shortcut cheat sheets, executive resume templates, and daily trackers.',
    status: 'INCLUDED'
  },
  {
    num: '04',
    title: '100% MICROSOFT EXCEL & GOOGLE SHEETS READY',
    tagline: 'Universal cross-platform compatibility',
    desc: 'Fully unlocked .xlsx files with automated XLOOKUP and dynamic arrays. Works seamlessly on desktop Excel, Mac, and Google Sheets.',
    status: 'INCLUDED'
  },
  {
    num: '05',
    title: 'INSTANT EMAIL + LIFETIME GOOGLE DRIVE LINK',
    tagline: 'Zero waiting · 60-second automated delivery',
    desc: 'Instant delivery to your email upon checkout with permanent access to our master Google Drive cloud repository.',
    status: 'LIFETIME'
  }
]

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Choose the Master Suite',
    desc: '1-click encrypted checkout at just ₹199 / $2.49 with zero subscriptions or hidden fees.'
  },
  {
    step: '02',
    title: 'Instant 60s Delivery',
    desc: 'Receive master Google Drive link and email pack in under 60 seconds.'
  },
  {
    step: '03',
    title: 'Input Your Numbers',
    desc: 'Enter numbers and all automated formulas, KPIs, and charts calculate dynamically.'
  },
  {
    step: '04',
    title: 'Export Boardroom Visuals',
    desc: 'Share high-impact reports with investors, stakeholders, and executive leadership.'
  }
]

const FONTO_WORDS = [
  'ALL-IN-ONE MASTER SUITE',
  '1,000+ PRO TEMPLATES',
  '10 EXECUTIVE BI COCKPITS',
  '₹199 FLASH SALE DEAL'
]

const PRODUCTS = [
  {
    id: 'ain-excel-pack',
    badge: '🔥 1,000+ EXCEL TEMPLATES — ₹199 ONLY',
    name: 'aIn — Excel All-in-One Master Suite',
    category: 'BI & FINANCE',
    tagline: 'From Manual To Smart Work — Pro Dashboards, Auto Calculation & Business Templates (.xlsx)',
    shortDesc: '1,000+ ready-to-use business spreadsheets, 10 automated BI dashboards & 5 VIP bonus toolkits with lifetime Drive access.',
    price: 199,
    priceDisplay: '₹199',
    originalPrice: '₹999',
    currency: 'INR',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    image: '/ain_excel_pack.jpg',
    imageFit: 'cover',
    features: [
      '1,000+ Ready-to-Use Business Excel Templates for 100+ Industries',
      'Sales Dashboard, Financial Analysis & Expense Tracker',
      'Inventory Tracker, Project Tracker & HR KPI Dashboard',
      'Advanced Dynamic Charts, MIS Reports & Client Reporting Systems',
      'Free Bonus: Attendance Tracker, Habit Tracker & Daily Planner',
      'Free Bonus: Excel Keyboard Shortcuts & Professional Resume Templates',
      'Automated Formulas (XLOOKUP, Dynamic Arrays, Auto Calculation)',
      '100% Fully Editable Microsoft Excel (.xlsx) & Google Sheets Ready',
      'Delivered instantly to your email with Lifetime Google Drive Access',
    ],
    tech: ['Microsoft Excel .xlsx', 'Google Drive Master Folder', 'VBA & Dynamic Formulas', 'Microsoft Verified Standards'],
    deliveryDays: 0,
    popular: true,
  },
  {
    id: 'omnicoder-ai',
    badge: '🤖 RECOMMENDED',
    name: 'OmniCoder AI Agent',
    category: 'AI & DEV HUB',
    tagline: 'Autonomous Repository Developer Hub',
    shortDesc: 'Autonomous multi-agent repository developer hub with automated test guards and natural language code manipulation.',
    price: 299,
    priceDisplay: '₹299',
    originalPrice: '₹599',
    currency: 'INR',
    color: '#7c3aed',
    glowColor: 'rgba(124, 58, 237, 0.25)',
    image: '/omnicoder_ai.jpg',
    imageFit: 'cover',
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
    popular: false,
  },
  {
    id: 'quantum-shield',
    badge: '🛡️ SECURITY 10/10',
    name: 'QuantumShield Crypt Vault',
    category: 'POST-QUANTUM CRYPT',
    tagline: 'Post-Quantum Shield & Telemetry Armor',
    shortDesc: 'NIST-approved post-quantum encryption, zero-trust telemetry armor, and real-time threat sentinel node.',
    price: 291,
    priceDisplay: '₹291',
    originalPrice: '₹582',
    currency: 'INR',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    image: '/quantum_shield.jpg',
    imageFit: 'cover',
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
    category: 'PLANETARY TELEMETRY',
    tagline: 'Planetary Device Telemetry Aggregator',
    shortDesc: 'Planetary device telemetry aggregator with zero-latency Timescale database sync and WebSockets broker protocol.',
    price: 359,
    priceDisplay: '₹359',
    originalPrice: '₹718',
    currency: 'INR',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    image: '/spacemesh_iot.jpg',
    imageFit: 'cover',
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
    category: 'SPATIAL 3D',
    tagline: 'Apple Vision Pro Web UI Canvas',
    shortDesc: 'Interactive WebXR spatial canvas with depth-based UI layout engines and optimized 3D model asset loaders.',
    price: 289,
    priceDisplay: '₹289',
    originalPrice: '₹578',
    currency: 'INR',
    color: '#e879f9',
    glowColor: 'rgba(232, 121, 249, 0.25)',
    image: '/vision_spatial.jpg',
    imageFit: 'cover',
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
    category: 'CLINICAL MATRIX',
    tagline: 'Decentralized Clinical Matrix Console',
    shortDesc: 'HIPAA-compliant patient telemetry with distributed node consultation logs and real-time biosignals streaming.',
    price: 291,
    priceDisplay: '₹291',
    originalPrice: '₹582',
    currency: 'INR',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    image: '/biosync_health.jpg',
    imageFit: 'cover',
    features: [
      'HIPAA Compliant Patient Telemetry',
      'Distributed Node Consultation Logs',
      'Real-Time Biosignals Streaming',
      'Automated Emergency Alert Triggers',
      'Integrative Diagnostic Interface',
      '1 Month Operational Sync',
    ],
    tech: ['HL7 / FHIR API', 'Distributed Ledger', 'WebRTC Core'],
    deliveryDays: 10,
    popular: false,
  },
]

const WORKS = [
  {
    id: 'normal',
    code: 'HUB-01',
    coord: '37.77° N, 122.41° W',
    region: 'Silicon Valley, USA',
    mapX: 20,
    mapY: 38,
    title: 'Normal Business Website',
    subtitle: 'High-Performance Corporate & Conversion Portals',
    meta: '01 / 04 · ESSENTIAL WEB',
    desc: 'Clean, fast, and mobile-ready websites for businesses and personal brands. SEO-optimized, easy to manage, and engineered to convert — landing pages, portfolios, and corporate hubs that load in under a second.',
    image: '/pathway_normal_website.jpg',
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
    code: 'HUB-02',
    coord: '51.50° N, 0.12° W',
    region: 'London, UK',
    mapX: 47,
    mapY: 28,
    title: '3D Interactive Website',
    subtitle: 'Spatial WebGL & Cinematic Storytelling',
    meta: '02 / 04 · 3D SPATIAL WEB',
    desc: 'Immersive 3D spatial web experiences with Three.js, WebGL, and cinematic scroll. Premium interactive visual journeys — 3D product visualizers and Apple Vision-style interfaces that make your brand unforgettable.',
    image: '/pathway_3d_website.jpg',
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
    code: 'HUB-03',
    coord: '35.67° N, 139.65° E',
    region: 'Tokyo, Japan',
    mapX: 84,
    mapY: 36,
    title: 'Custom Software Application',
    subtitle: 'Enterprise SaaS, Dashboards & Microservices',
    meta: '03 / 04 · SAAS & SOFTWARE',
    desc: 'Tailored web applications, administrative dashboards, portals, and SaaS tools. From initial concept to cloud deployment — secure, scalable, and engineered around your exact workflow.',
    image: '/pathway_software.jpg',
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
    code: 'HUB-04',
    coord: '12.97° N, 77.59° E',
    region: 'Bengaluru, India (HQ)',
    mapX: 68,
    mapY: 56,
    title: 'Your Unique Idea — We Build It',
    subtitle: 'Bespoke R&D, AI Agents & First-of-Kind Products',
    meta: '04 / 04 · BESPOKE INNOVATION',
    desc: 'Have a breakthrough vision or unique concept? Share your idea and our engineering pod architects it into reality. Experimental builds, custom AI pipelines, and uncharted digital platforms.',
    image: '/pathway_bespoke_idea.jpg',
    models: 'Concept Prototype to Full Production',
    timeline: 'Bespoke Engineering Sprint',
    specs: ['Dedicated Engineering Pod', 'Weekly Milestone Demos', '100% Custom IP', 'Direct Architecture Line'],
    tags: ['Custom Build', 'AI Pipelines', 'Rapid Prototype', 'Direct Line'],
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    icon: '✦',
    num: '04'
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
      onError('Payment gateway is currently simulated. Please try again with live payment credentials.')
      return
    }
    if (data._cashfreeError) {
      console.warn('Cashfree order warning (proceeding):', data._cashfreeError)
    }

    if (typeof window.Cashfree !== 'function') {
      onError('Cashfree payment SDK is still loading or blocked by a browser extension. Please refresh the page and try again.')
      return
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
      const msg = result.error.message || ''
      if (msg.toLowerCase().includes('temporary') || msg.toLowerCase().includes('try again') || msg.toLowerCase().includes('bank')) {
        onError(`${msg} — Note: In Sandbox mode, use Cashfree test card 4111 1111 1111 1111, expiry 12/30, CVV 123.`)
        return
      }
      onError(result.error.message || 'Payment was not completed. Please try again.')
      return
    }

    if (result.paymentDetails) {
      await runVerification()
    } else {
      onError('Payment checkout window was closed before completing payment.')
    }
  } catch (err) {
    onError(err.message)
  }
}

export default function WebDevStore() {
  const { userName, exitWebDevStore } = useStore()

  // Service detail modal
  const [selectedService, setSelectedService] = useState(null)
  const [expandedExcelDivision, setExpandedExcelDivision] = useState('01')

  // Cart & Sidebar States
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)


  const [currency, setCurrency] = useState('INR') // 'INR' | 'USD'
  const [fontoIndex, setFontoIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFontoIndex((prev) => (prev + 1) % FONTO_WORDS.length)
    }, 2400)
    return () => clearInterval(timer)
  }, [])

  // Lumos Editorial Products Section Scroll Observer
  const productsSectionRef = React.useRef(null)
  const [isProductsInView, setIsProductsInView] = useState(false)

  useEffect(() => {
    const el = productsSectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsProductsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Checkout States
  const [checkoutMode, setCheckoutMode] = useState(null) // 'cashfree' | 'sandbox' | null
  const [sandboxStep, setSandboxStep] = useState(0) // 0: inactive, 1: generating order, 2: processing payload, 3: success
  const [sandboxMsg, setSandboxMsg] = useState('')
  const [checkoutProduct, setCheckoutProduct] = useState(null)

  // Customer Info Checkout Form States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [targetProduct, setTargetProduct] = useState(null)
  const [custName, setCustName] = useState(userName || '')
  const [custEmail, setCustEmail] = useState(() => {
    try { return localStorage.getItem('bex_customer_email') || '' } catch { return '' }
  })
  const [custPhone, setCustPhone] = useState(() => {
    try { return localStorage.getItem('bex_customer_phone') || '' } catch { return '' }
  })
  const [isPaying, setIsPaying] = useState(false)
  const [toast, setToast] = useState(null) // {msg, type} for 10/10 no-alert UI
  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000) }

  // Lightbox & Dock States
  const [activeLightboxPoster, setActiveLightboxPoster] = useState(null)
  const [isDockVisible, setIsDockVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsDockVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])




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
        // product activated
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
      // product shown
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

        ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`
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
            ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - dist / 90) * 0.08})`
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
        try { localStorage.setItem('bex_customer_email', custEmail) } catch { }
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
    <div className="webdev-store-container store-editorial-theme">
      {/* Cashfree SDK is loaded via index.html */}

      {/* Dark holographic background grids */}
      <div className="webdev-store-bg" />

      {/* 10/10 Interactive Particle Field */}
      <canvas id="store-particle-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      {/* ── TOP CAPSULE FLOATING NAVIGATION (NOIR BRUTALIST HYBRID) ── */}
      <header className="habito-navbar store-capsule-navbar">
        <div className="habito-brand-wrap" onClick={() => document.getElementById('noir-about')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="habito-brand-title">BEx EXCEL ARCHITECTURE</span>
          <span className="habito-brand-dot" />
        </div>

        <nav className="habito-nav-links mc-capsule-links">
          <button
            className="habito-nav-link"
            onClick={() => document.getElementById('our-products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Products
          </button>
          <button
            className="habito-nav-link"
            onClick={() => document.getElementById('ad-comparison')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Why Us
          </button>
          <button
            className="habito-nav-link"
            onClick={() => document.getElementById('noir-system')?.scrollIntoView({ behavior: 'smooth' })}
          >
            System
          </button>
          <button
            className="habito-nav-link"
            onClick={() => document.getElementById('noir-process')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Process
          </button>
          <button
            className="habito-nav-link"
            onClick={() => document.getElementById('noir-pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Pricing
          </button>
        </nav>

        <div className="habito-nav-actions">
          {/* Currency Switcher */}
          <button
            aria-label={`Switch currency, currently ${currency}`}
            className="habito-currency-pill interactive"
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            title={currency === 'INR' ? 'Show USD estimate' : 'Show INR (actual charge)'}
          >
            💱 {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>

          {/* Cart Trigger Button */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Open cart, ${cart.reduce((s, i) => s + i.quantity, 0)} items`}
            className="habito-cart-pill interactive"
            onClick={() => setIsCartOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsCartOpen(true)}
          >
            <span>🛒 CART</span>
            {cart.length > 0 && (
              <span className="habito-cart-counter">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            )}
          </div>

          {/* Direct Buy Button */}
          <button
            className="habito-nav-btn-primary interactive"
            style={{ background: '#ff5722', borderColor: '#ff5722', boxShadow: '0 4px 18px rgba(255, 87, 34, 0.45)' }}
            onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
          >
            <span>BUY {currency === 'INR' ? '₹199' : '$2.49'}</span>
            <span>→</span>
          </button>

          {/* Exit / Return to HQ */}
          <button
            className="habito-nav-btn-close interactive"
            onClick={exitWebDevStore}
            title="Return to Headquarters"
          >
            ✕
          </button>
        </div>
      </header>

      {/* ── MAIN NOIR BRUTALIST PAGE FLOW ── */}
      <main className="habito-page-content">

        {/* ══ SECTION 1: NOIR HERO (EXCEL SALE ADVERTISEMENT CLIMAX) ══ */}
        <section id="noir-about" className="noir-hero-section">
          {/* Flash Sale Pill */}
          <div className="ad-flash-pill">
            <span className="ad-flash-dot" />
            <span>🔥 MEGA SALE · 80% OFF · ₹199 LIFETIME ACCESS</span>
          </div>

          {/* Creator Micro Badge */}
          <div className="noir-hero-avatar-wrap">
            <div className="noir-hero-avatar-ring">
              <img
                src="/ceo_hariharan.jpg"
                alt="Hariharan.D — Microsoft Verified Excel Architect"
                className="noir-hero-avatar-img"
              />
              <span className="noir-hero-verified-dot" title="Microsoft Verified">✓</span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '8px', display: 'block', fontWeight: 700, letterSpacing: '0.04em' }}>
              CURATED BY MICROSOFT VERIFIED ARCHITECT
            </span>
          </div>

          {/* Giant Hero Title with Fonto 3D Slide Cube Effect */}
          <h1 className="noir-hero-title">
            <span>1,000+ PRO EXCEL TEMPLATES</span>
            <span className="fonto-slide-container">
              <span key={fontoIndex} className="fonto-slide-active-word">
                {FONTO_WORDS[fontoIndex]}
              </span>
            </span>
          </h1>

          {/* High-Converting Ad Copy */}
          <p className="noir-hero-sub">
            Stop wasting 40+ hours wrestling with formulas or paying ₹15,000+ to freelancers. Download 1,000+ battle-tested business spreadsheets, 10 automated executive BI dashboards, and 5 VIP bonus toolkits. 100% editable in Microsoft Excel (.xlsx) & Google Sheets with instant lifetime Google Drive access.
          </p>

          {/* Hero CTAs (Radiant Orange Button) */}
          <div className="noir-hero-actions">
            <button
              className="noir-btn-primary interactive"
              onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
            >
              <span>⚡ GET 1,000+ TEMPLATES · {currency === 'INR' ? '₹199' : '$2.49'}</span>
            </button>
            <button
              className="noir-btn-secondary interactive"
              onClick={() => document.getElementById('our-products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Explore Products</span>
              <span>↓</span>
            </button>
          </div>

          {/* 3D Product Box Advertisement Showcase */}
          <div className="ad-hero-product-showcase">
            <span className="ad-float-badge-left">🔥 1,000+ TEMPLATES INCLUDED</span>
            <span className="ad-float-badge-right">📁 INSTANT GOOGLE DRIVE LINK</span>
            <div
              className="ad-product-card-3d interactive"
              onClick={() => setActiveLightboxPoster({
                title: 'aIn — Excel All-in-One Master Suite',
                image: '/ain_excel_pack.jpg',
                tag: 'Master Pack'
              })}
              title="Click to inspect Master Suite preview"
            >
              <img
                src="/ain_excel_pack.jpg"
                alt="aIn Excel Master Pack 3D Preview"
                className="ad-product-img"
              />
              <div className="ad-product-card-bar">
                <div className="ad-product-card-info">
                  <span className="ad-product-card-tag">★ FLAGSHIP SPREADSHEET VAULT</span>
                  <span className="ad-product-card-title">1,000+ Formulas & 10 Executive Dashboards</span>
                </div>
                <button
                  className="ad-product-card-btn interactive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenCheckoutModal(PRODUCTS[0])
                  }}
                >
                  Quick Buy ({currency === 'INR' ? '₹199' : '$2.49'})
                </button>
              </div>
            </div>
          </div>

          {/* Hero Credibility Chips */}
          <div className="noir-hero-chips">
            <span className="noir-hero-chip">⭐ 4.9/5 Rating (12,400+ Downloads)</span>
            <span className="noir-hero-chip">💳 One-Time ₹199 · Zero Subscriptions</span>
            <span className="noir-hero-chip">⚡ 60-Sec Automated Drive Delivery</span>
          </div>
        </section>

        {/* ══ LUMOS INFINITE SLIDING MARQUEE TICKER 1 (FORWARD) ══ */}
        <div className="lumos-marquee-wrap">
          <div className="lumos-marquee-track">
            <div className="lumos-marquee-content">
              <span>★ 1,000+ READY-TO-USE BUSINESS TEMPLATES</span>
              <span>★ 10 EXECUTIVE BI COCKPITS</span>
              <span>★ 3-STATEMENT GAAP MODELS</span>
              <span>★ ZERO MANUAL FORMULAS</span>
              <span>★ 100% UNLOCKED .XLSX</span>
              <span>★ INSTANT GOOGLE DRIVE ACCESS</span>
              <span>★ ₹199 FLASH SALE ENDING TODAY</span>
              <span>★ MICROSOFT AUDITED ARCHITECTURE</span>
            </div>
            <div className="lumos-marquee-content" aria-hidden="true">
              <span>★ 1,000+ READY-TO-USE BUSINESS TEMPLATES</span>
              <span>★ 10 EXECUTIVE BI COCKPITS</span>
              <span>★ 3-STATEMENT GAAP MODELS</span>
              <span>★ ZERO MANUAL FORMULAS</span>
              <span>★ 100% UNLOCKED .XLSX</span>
              <span>★ INSTANT GOOGLE DRIVE ACCESS</span>
              <span>★ ₹199 FLASH SALE ENDING TODAY</span>
              <span>★ MICROSOFT AUDITED ARCHITECTURE</span>
            </div>
          </div>
        </div>

        {/* ══ SECTION 2: NOIR CLIENT STRIP (IMAGE 2 TRUST BAR) ══ */}
        <div className="noir-client-strip">
          <span className="noir-client-label">Used by founders & operators at world-class companies</span>
          <div className="noir-client-logos">
            <span className="noir-client-logo">DELOITTE</span>
            <span className="noir-client-logo">MCKINSEY</span>
            <span className="noir-client-logo">PWC</span>
            <span className="noir-client-logo">GOLDMAN SACHS</span>
            <span className="noir-client-logo">AMAZON</span>
            <span className="noir-client-logo">STARTUPS</span>
          </div>
        </div>

        {/* ══ SECTION 3: EDITORIAL PRODUCTS SHOWCASE (LUMOS MARKETING INSPIRATION) ══ */}
        <section
          id="our-products"
          ref={productsSectionRef}
          className={`our-products lumos-editorial-section ${isProductsInView ? 'in-view' : ''}`}
        >
          {/* Paper Texture Overlay (Subtle Noise) */}
          <div className="lumos-paper-texture" aria-hidden="true" />

          {/* Anchor preserving backward compatibility for navbar and hero 'See What's Inside' buttons */}
          <div id="noir-vault" style={{ position: 'absolute', top: '-80px', pointerEvents: 'none' }} />

          <div className="lumos-container">
            {/* ── SECTION HEADER: OVERSIZED CONDENSED TYPOGRAPHY ── */}
            <header className="lumos-section-header">
              <div className="lumos-header-meta">
                <span className="lumos-index-badge">[ 01 — 06 ]</span>
                <span className="lumos-section-tag">SELECTED COMMERCIAL RELEASES</span>
                <span className="lumos-curation-pill">ARCHITECT VERIFIED</span>
              </div>

              {/* Massive Oversized Condensed Headline */}
              <div className="lumos-title-wrap">
                <h2 className="lumos-giant-headline">
                  <span className="lumos-headline-row">
                    <span className="lumos-headline-word">PROVEN</span>
                    <span className="lumos-headline-word lumos-text-outline">DIGITAL</span>
                  </span>
                  <span className="lumos-headline-row">
                    <span className="lumos-headline-word lumos-text-accent">ARCHITECTURES</span>
                    <span className="lumos-headline-word">& ENGINES</span>
                  </span>
                </h2>
              </div>

              <div className="lumos-header-desc-row">
                <p className="lumos-header-desc">
                  Curated business spreadsheets, autonomous AI developers, post-quantum telemetry, and spatial WebXR engines.
                  Engineered with zero technical debt and turnkey executive execution.
                </p>
                <div className="lumos-header-aside">
                  <span className="lumos-aside-number">06</span>
                  <span className="lumos-aside-label">PRODUCTION PRODUCTS</span>
                </div>
              </div>

              {/* Animated Thin Dividing Line */}
              <div className="lumos-hairline-divider" />
            </header>

            {/* ── EDITORIAL PRODUCTS STORYTELLING SHOWCASE (UNCONVENTIONAL ASYMMETRICAL LAYOUT) ── */}
            <div className="lumos-showcase-list">
              {PRODUCTS.map((prod, idx) => {
                const productNumber = String(idx + 1).padStart(2, '0')
                const isEven = idx % 2 === 1
                return (
                  <article
                    key={prod.id}
                    id={`editorial-product-${prod.id}`}
                    className={`lumos-product-item ${isEven ? 'is--inverted' : ''} ${prod.popular ? 'is--flagship' : ''}`}
                    style={{ '--item-delay': `${idx * 0.1}s` }}
                  >
                    {/* Top Index & Classification Bar */}
                    <div className="lumos-item-topbar">
                      <div className="lumos-item-top-left">
                        <span className="lumos-item-num">[{productNumber} / 06]</span>
                        <span className="lumos-item-category">{prod.category || 'ARCHITECTURE'}</span>
                        {prod.popular && <span className="lumos-flagship-tag">FLAGSHIP SUITE</span>}
                      </div>
                      <div className="lumos-item-top-right">
                        <span className="lumos-item-price-chip">
                          {currency === 'INR' ? prod.priceDisplay : `$${(prod.price * 0.0125).toFixed(2)}`}
                        </span>
                        <span className="lumos-item-status">VERIFIED PROD</span>
                      </div>
                    </div>

                    {/* Product Main Editorial Lockup */}
                    <div className="lumos-item-body">
                      {/* Visual Frame */}
                      <div className="lumos-item-visual-wrap">
                        <div
                          className="lumos-visual-frame interactive"
                          onClick={() => handleOpenCheckoutModal(prod)}
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="lumos-visual-img"
                            loading="lazy"
                          />
                          <div className="lumos-visual-overlay">
                            <span className="lumos-visual-pill">INSPECT & ACQUIRE →</span>
                          </div>
                          {/* Corner Editorial Crosshairs */}
                          <span className="lumos-crosshair tl">+</span>
                          <span className="lumos-crosshair tr">+</span>
                          <span className="lumos-crosshair bl">+</span>
                          <span className="lumos-crosshair br">+</span>
                        </div>
                        <div className="lumos-visual-caption">
                          <span>{prod.tech?.[0] || 'VERIFIED ARTIFACT'}</span>
                          <span>STABLE // V2.4</span>
                        </div>
                      </div>

                      {/* Content & Typography Column */}
                      <div className="lumos-item-content">
                        {/* Oversized Product Title */}
                        <h3 className="lumos-item-title">
                          <span className="lumos-title-inner">{prod.name}</span>
                        </h3>

                        {/* Tagline */}
                        <div className="lumos-item-tagline">{prod.tagline}</div>

                        {/* Descriptive Storytelling Text */}
                        <p className="lumos-item-desc">{prod.shortDesc || prod.tagline}</p>

                        {/* Technical Specs / Features Breakdown */}
                        <div className="lumos-item-specs">
                          <span className="lumos-specs-title">VERIFIED CAPABILITIES</span>
                          <div className="lumos-specs-grid">
                            {(prod.features?.slice(0, 4) || []).map((feat, fIdx) => (
                              <div key={fIdx} className="lumos-spec-item">
                                <span className="lumos-spec-bullet">✦</span>
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack Chips */}
                        {prod.tech && prod.tech.length > 0 && (
                          <div className="lumos-tech-strip">
                            {prod.tech.map((t, tIdx) => (
                              <span key={tIdx} className="lumos-tech-chip">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Editorial Action Row */}
                        <div className="lumos-item-action-row">
                          <button
                            type="button"
                            className="lumos-action-btn interactive"
                            onClick={() => handleOpenCheckoutModal(prod)}
                          >
                            <span className="lumos-btn-text">
                              {prod.id === 'ain-excel-pack'
                                ? `ACQUIRE MASTER SUITE · ${currency === 'INR' ? '₹199' : '$2.49'}`
                                : `ACQUIRE LICENSE · ${currency === 'INR' ? prod.priceDisplay : `$${(prod.price * 0.0125).toFixed(2)}`}`}
                            </span>
                            <span className="lumos-btn-arrow">→</span>
                          </button>

                          <div className="lumos-action-guarantee">
                            <span>LIFETIME UPDATES</span>
                            <span>·</span>
                            <span>ZERO SUBSCRIPTIONS</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thin Animated Dividing Line between Products */}
                    <div className="lumos-hairline-divider" />
                  </article>
                )
              })}
            </div>

            {/* ── SECTION CLOSING FOOTER STATEMENT ── */}
            <div className="lumos-section-bottom">
              <div className="lumos-bottom-left">
                <span className="lumos-bottom-mark">BEx ARCHITECTURES</span>
                <span className="lumos-bottom-meta">ALL 6 PRODUCTS READY FOR TURNKEY DEPLOYMENT</span>
              </div>
              <div className="lumos-bottom-right">
                <button
                  type="button"
                  className="lumos-bottom-all-btn interactive"
                  onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
                >
                  <span>GET FLAGSHIP aIn EXCEL SUITE ({currency === 'INR' ? '₹199' : '$2.49'})</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 4: THE HARD WAY VS THE aIn WAY (AD COMPARISON) ══ */}
        <section id="ad-comparison" className="ad-comparison-section">
          <div className="noir-section-header">
            <div className="noir-section-kicker">
              <span>● WHY GET THE MASTER SUITE</span>
            </div>
            <h2 className="noir-section-heading">STOP REINVENTING THE SPREADSHEET WHEEL</h2>
            <p className="noir-section-subtitle">
              Building formulas from scratch wastes valuable hours and thousands in freelancer bills.
            </p>
          </div>

          <div className="ad-comparison-grid">
            <div className="ad-comparison-card is--bad">
              <span className="ad-comparison-tag">❌ THE HARD & EXPENSIVE WAY</span>
              <h3 className="ad-comparison-title">Building From Scratch</h3>
              <div className="ad-comparison-list">
                <div className="ad-comparison-item is--bad-item">
                  <span>✗</span>
                  <span>40+ hours wasted typing formulas and troubleshooting #REF! and circular errors</span>
                </div>
                <div className="ad-comparison-item is--bad-item">
                  <span>✗</span>
                  <span>₹15,000+ spent hiring disjointed freelancers on Upwork & Fiverr</span>
                </div>
                <div className="ad-comparison-item is--bad-item">
                  <span>✗</span>
                  <span>₹2,500/month recurring fees for clunky enterprise SaaS subscriptions</span>
                </div>
                <div className="ad-comparison-item is--bad-item">
                  <span>✗</span>
                  <span>Amateur-looking charts that fail to inspire confidence in leadership</span>
                </div>
              </div>
            </div>

            <div className="ad-comparison-card is--good">
              <span className="ad-comparison-tag">✅ THE aIn MASTER SUITE WAY</span>
              <h3 className="ad-comparison-title">1,000+ Pro Templates (₹199 Once)</h3>
              <div className="ad-comparison-list">
                <div className="ad-comparison-item">
                  <span>✓</span>
                  <span>Open battle-tested .xlsx sheets and start at 90% completion in 60 seconds</span>
                </div>
                <div className="ad-comparison-item">
                  <span>✓</span>
                  <span>Curated by Microsoft Verified Architect — 100% automated formulas</span>
                </div>
                <div className="ad-comparison-item">
                  <span>✓</span>
                  <span>₹199 one-time payment with lifetime Google Drive updates · No subscriptions</span>
                </div>
                <div className="ad-comparison-item">
                  <span>✓</span>
                  <span>Boardroom-ready interactive BI slicers & presentation visuals</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 4: BRUTALIST EDITORIAL STATEMENT (IMAGE 1 CENTER: JASON MILLER STYLE) ══ */}
        <section id="noir-manifesto" className="noir-statement-section">
          <div className="noir-statement-tabs">
            <span className="noir-statement-tab active">Financial Models</span>
            <span className="noir-statement-tab">BI Cockpits</span>
            <span className="noir-statement-tab">Workforce Matrix</span>
            <span className="noir-statement-tab">Revenue Engines</span>
          </div>

          <h2 className="noir-statement-giant-heading">
            BUILD ACCURACY<br />
            SCALE YOUR BUSINESS<br />
            TODAY
          </h2>

          <div className="noir-statement-lead-block">
            <p className="noir-statement-lead-text">
              HELPING YOU BUILD FINANCIAL CONFIDENCE AND BOARD-READY DISCIPLINE THROUGH AUTOMATED SPREADSHEETS AND EXECUTIVE INTELLIGENCE.
            </p>

            <div className="noir-statement-meta-col">
              <div className="noir-statement-scroll-indicator">
                <span className="noir-statement-scroll-dot" />
                <span>.SCROLL TO EXPLORE</span>
              </div>

              <div className="noir-statement-creator-card">
                <img
                  src="/ceo_hariharan.jpg"
                  alt="Hariharan.D"
                  className="noir-statement-avatar"
                />
                <div>
                  <div className="noir-statement-creator-name">HARIHARAN.D</div>
                  <div className="noir-statement-creator-role">Lead Excel Architect & Founder</div>
                </div>
              </div>
            </div>
          </div>

          {/* FONTO SLIDE TEXTURED GIANT (IMAGE 1 "FOUR PATHS TO TRANSFORMATION" STYLE) */}
          <div className="fonto-textured-giant-wrap">
            <span className="fonto-textured-giant">FOUR PATHS TO AUTOMATION</span>
          </div>
        </section>

        {/* ══ SECTION 5: HYPERFIT NUMBERED SYSTEM (IMAGE 1 LEFT STYLE) ══ */}
        <section id="noir-system" className="noir-hyperfit-section">
          <div className="noir-section-header">
            <div className="noir-section-kicker">
              <span>● THE COMPLETE SYSTEM</span>
            </div>
            <h2 className="noir-section-heading">NOT JUST SPREADSHEETS — A FULL BUSINESS ARSENAL</h2>
            <p className="noir-section-subtitle">
              Every formula, dynamic array, and executive chart is structured for turnkey execution with zero setup.
            </p>
          </div>

          <div className="noir-hyperfit-list">
            {HYPERFIT_STEPS.map((step) => (
              <div key={step.num} className="noir-hyperfit-row">
                <div className="noir-hyperfit-num">{step.num}</div>
                <div>
                  <h3 className="noir-hyperfit-title">{step.title}</h3>
                  <div className="noir-hyperfit-tagline">{step.tagline}</div>
                </div>
                <p className="noir-hyperfit-desc">{step.desc}</p>
                <div className="noir-hyperfit-status">{step.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SECTION 7: COURSEKIT STEP PROCESS (IMAGE 1 RIGHT STYLE) ══ */}
        <section id="noir-process" className="noir-process-section">
          <div className="noir-section-header">
            <div className="noir-section-kicker">
              <span>● HOW IT WORKS</span>
            </div>
            <h2 className="noir-section-heading">STOP PAYING FOR DISJOINTED FREELANCERS</h2>
            <p className="noir-section-subtitle">
              One master architecture replaces dozens of expensive freelancer gigs. Simple, automated 4-stage process.
            </p>
          </div>

          <div className="noir-process-grid">
            {PROCESS_STEPS.map((st) => (
              <div key={st.step} className="noir-process-card">
                <span className="noir-process-step">[{st.step}]</span>
                <div>
                  <h3 className="noir-process-title">{st.title}</h3>
                  <p className="noir-process-desc">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ LUMOS INFINITE SLIDING MARQUEE TICKER 2 (REVERSE) ══ */}
        <div className="lumos-marquee-wrap is--reverse">
          <div className="lumos-marquee-track is--reverse">
            <div className="lumos-marquee-content is--outline">
              <span>✦ PUT SPREADSHEETS ON AUTOPILOT</span>
              <span>✦ SAVE 15+ HOURS WEEKLY</span>
              <span>✦ 5 VIP BONUS TOOLKITS</span>
              <span>✦ 100% EDITABLE IN EXCEL & GOOGLE SHEETS</span>
              <span>✦ ZERO RECURRING SUBSCRIPTIONS</span>
              <span>✦ LIFETIME ACCESS GUARANTEE</span>
            </div>
            <div className="lumos-marquee-content is--outline" aria-hidden="true">
              <span>✦ PUT SPREADSHEETS ON AUTOPILOT</span>
              <span>✦ SAVE 15+ HOURS WEEKLY</span>
              <span>✦ 5 VIP BONUS TOOLKITS</span>
              <span>✦ 100% EDITABLE IN EXCEL & GOOGLE SHEETS</span>
              <span>✦ ZERO RECURRING SUBSCRIPTIONS</span>
              <span>✦ LIFETIME ACCESS GUARANTEE</span>
            </div>
          </div>
        </div>

        {/* ══ SECTION 8: CLIMAX PRICING (SELLING ONLY THE ₹199 ALL-IN-ONE MASTER SUITE) ══ */}
        <section id="noir-pricing" className="noir-pricing-section">
          <div className="noir-pricing-card">
            {/* Left Column: Feature Highlights */}
            <div>
              <span className="noir-pricing-kicker">🔥 1,000+ EXCEL TEMPLATES — ₹199 ONLY</span>
              <h2 className="noir-pricing-title">{PRODUCTS[0].name}</h2>
              <p className="noir-pricing-tagline">{PRODUCTS[0].tagline}</p>

              <div className="noir-pricing-features">
                {PRODUCTS[0].features.map((feat, fIdx) => (
                  <div key={fIdx} className="noir-feature-item">
                    <span className="noir-feature-check">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: High-Impact Price Box */}
            <div className="noir-pricing-box">
              <div className="noir-price-row">
                <span className="noir-price-val">{currency === 'INR' ? '₹199' : '$2.49'}</span>
                <span className="noir-price-original">{currency === 'INR' ? '₹999' : '$12.99'}</span>
              </div>
              <span className="noir-price-savings">80% OFF TODAY · ZERO SUBSCRIPTION FEES</span>

              <button
                className="noir-checkout-cta interactive"
                onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
              >
                <span>🛒 GET ALL-IN-ONE MASTER SUITE</span>
                <span>→</span>
              </button>

              <div className="noir-pricing-secondary-row">
                <button
                  className="noir-pricing-cart-btn interactive"
                  onClick={() => addToCart(PRODUCTS[0])}
                >
                  + Add to Cart
                </button>
                <a
                  href="https://wa.me/919361657929?text=Hi%20Hariharan,%20I%20have%20a%20query%20about%20the%20aIn%20Excel%20Master%20Suite."
                  target="_blank"
                  rel="noreferrer"
                  className="noir-pricing-wa-btn interactive"
                >
                  💬 WhatsApp Line
                </a>
              </div>

              <div className="noir-pricing-trust-list">
                <span>🔒 100% Encrypted Checkout via Cashfree</span>
                <span>⚡ Instant Email Delivery within 60 Seconds</span>
                <span>📁 Lifetime Google Drive Access Guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 9: REVIEWS & TESTIMONIALS ══ */}
        <section className="noir-reviews-section">
          <div className="noir-section-header">
            <div className="noir-section-kicker">
              <span>● TESTIMONIALS</span>
            </div>
            <h2 className="noir-section-heading">WHAT OUR PARTNERS SAY</h2>
            <p className="noir-section-subtitle">
              ⭐ 4.9/5 Rating across 500+ corporate professionals and startup operators.
            </p>
          </div>

          <div className="noir-reviews-grid">
            {HABITO_REVIEWS.map((rev, rIdx) => (
              <div key={rIdx} className="noir-review-card">
                <p className="noir-review-quote">"{rev.quote}"</p>
                <div className="noir-review-bottom">
                  <div>
                    <div className="noir-review-author">{rev.author}</div>
                    <div className="noir-review-company">{rev.company}</div>
                  </div>
                  <span className="noir-review-tag">[{rev.tag}]</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SECTION 10: NOIR BRUTALIST FOOTER ══ */}
        <footer className="noir-footer">
          <div>
            <span className="noir-footer-brand">BEx SIGMA TECH · EXCEL ARCHITECTURE</span>
            <span style={{ marginLeft: '12px' }}>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div>
            <button
              className="noir-footer-btn-top interactive"
              onClick={() => document.getElementById('noir-about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Back to Top ↑
            </button>
          </div>
        </footer>

      </main>

      {/* Cart Sidebar Drawer */}
      <div className={`webdev-cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`webdev-cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="webdev-cart-header">
          <h2 className="webdev-cart-title">
            <span>🛒 Your Cart</span>
          </h2>
          <button className="webdev-cart-close" onClick={() => setIsCartOpen(false)}>×</button>
        </div>

        <div className="webdev-cart-items">
          {cart.length === 0 ? (
            <div className="webdev-cart-empty">
              <div className="webdev-cart-empty-icon">📭</div>
              <div>Your cart is empty. Add the aIn Pack to get started!</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="webdev-cart-item">
                <img src={item.product.image} alt={item.product.name} className="webdev-cart-item-thumb" />
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
                const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
                const cartProduct = (cart.length === 1 && cart[0].quantity === 1)
                  ? cart[0].product
                  : {
                    cartItems,
                    name: cart.length === 1
                      ? `${cart[0].product.name} (x${cart[0].quantity})`
                      : `Cart Bundle (${totalQuantity} Items)`,
                    price: getCartTotal(), // rupees for display, server calculates paise
                    priceDisplay: `₹${getCartTotal().toLocaleString('en-IN')}`,
                    id: `bundle_${Date.now()}`,
                  }
                setIsCartOpen(false)
                handleOpenCheckoutModal(cartProduct)
              }}
            >
              🔒 Proceed to Checkout · ₹{getCartTotal().toLocaleString('en-IN')}
            </button>
          </div>
        )}
      </div>

      {/* ── Customer Details Checkout Form Modal ── */}
      {isCustomerModalOpen && targetProduct && (
        <div className="ain-checkout-overlay" onClick={(e) => e.target === e.currentTarget && setIsCustomerModalOpen(false)}>
          <div className="ain-checkout-modal" role="dialog" aria-modal="true" aria-label="Checkout">

            {/* Top gradient bar */}
            <div className="ain-checkout-bar" />

            {/* Modal Header */}
            <div className="ain-checkout-header">
              <div className="ain-checkout-header-left">
                <div className="ain-checkout-lock-icon">🔐</div>
                <div>
                  <div className="ain-checkout-title">Secure Checkout</div>
                  <div className="ain-checkout-subtitle">Your info is encrypted end-to-end</div>
                </div>
              </div>
              <button className="ain-checkout-close" aria-label="Close checkout" onClick={() => setIsCustomerModalOpen(false)}>✕</button>
            </div>

            {/* Product Summary */}
            <div className="ain-checkout-product">
              <img src={targetProduct.image || '/ain_excel_pack.jpg'} alt={targetProduct.name} className="ain-checkout-product-img" />
              <div className="ain-checkout-product-info">
                <div className="ain-checkout-product-label">Selected Product</div>
                <div className="ain-checkout-product-name">{targetProduct.name}</div>
                <div className="ain-checkout-product-price">{targetProduct.priceDisplay}</div>
                <div className="ain-checkout-product-delivery">📁 Instant Google Drive link delivered to your email</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleStartPayment} className="ain-checkout-form">
              <div className="ain-checkout-field">
                <label className="ain-checkout-label" htmlFor="checkout-name">👤 Full Name *</label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Kandavel"
                  className="ain-checkout-input"
                />
              </div>

              <div className="ain-checkout-field">
                <label className="ain-checkout-label ain-checkout-label-primary" htmlFor="checkout-email">✉️ Email Address * — Drive link sent here</label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="ain-checkout-input ain-checkout-input-primary"
                />
                <span className="ain-checkout-hint">Double-check your email — your download link goes here</span>
              </div>

              <div className="ain-checkout-field">
                <label className="ain-checkout-label" htmlFor="checkout-phone">📱 Phone Number (Optional)</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  autoComplete="tel"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="ain-checkout-input"
                />
              </div>

              <div className="ain-checkout-actions">
                <button
                  type="button"
                  className="ain-checkout-cancel"
                  onClick={() => setIsCustomerModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={isPaying ? 'ain-checkout-pay loading' : 'ain-checkout-pay'}
                  disabled={isPaying}
                >
                  {isPaying ? (
                    <><span className="ain-checkout-spinner" />Processing...</>
                  ) : (
                    <>💳 Pay {targetProduct.priceDisplay}</>
                  )}
                </button>
              </div>

              {/* Trust row */}
              <div className="ain-checkout-trust">
                <span>🔒 SSL Encrypted</span>
                <span>💳 Cards + UPI</span>
                <span>⚡ Instant Delivery</span>
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

      {import.meta.env.DEV && (
        <div className="webdev-api-note">
          Backend API: <code>{BACKEND_URL}</code> · Live System Active
        </div>
      )}

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

      {/* 4K Fullscreen Poster Lightbox */}
      {activeLightboxPoster && (
        <div className="poster-lightbox-overlay" onClick={() => setActiveLightboxPoster(null)}>
          <div className="poster-lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <span className="poster-lightbox-title">🖼️ {activeLightboxPoster.title}</span>
            <button className="poster-lightbox-close" onClick={() => setActiveLightboxPoster(null)}>✕</button>
          </div>
          <div className="poster-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={activeLightboxPoster.image} alt={activeLightboxPoster.title} className="poster-lightbox-img" />
          </div>
          <div className="poster-lightbox-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="plaque-btn-primary interactive"
              onClick={() => {
                setActiveLightboxPoster(null)
                handleOpenCheckoutModal(PRODUCTS[0])
              }}
            >
              ⚡ Get All-in-One Master Suite & 1,000+ Templates ({currency === 'INR' ? '₹199' : '$2.49'})
            </button>
          </div>
        </div>
      )}

      {/* Sticky Floating Gallery Dock */}
      {isDockVisible && (
        <div className="poster-floating-dock">
          <div className="poster-dock-info">
            <img src="/ain_excel_pack.jpg" alt="Poster" className="poster-dock-thumb" />
            <div className="poster-dock-text">
              <span className="poster-dock-name">aIn — Excel All-in-One Suite</span>
              <span className="poster-dock-price">{currency === 'INR' ? '₹199' : '$2.49'} · 1,000+ Templates</span>
            </div>
          </div>
          <div className="poster-dock-actions">
            <button
              className="poster-dock-buy-btn interactive"
              onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
            >
              ⚡ Quick Buy ({currency === 'INR' ? '₹199' : '$2.49'})
            </button>
            <button
              className="poster-dock-cart-btn interactive"
              onClick={() => addToCart(PRODUCTS[0])}
            >
              🛒 Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
