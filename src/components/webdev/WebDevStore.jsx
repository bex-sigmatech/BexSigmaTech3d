import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import ServiceDetail from './ServiceDetail'
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

const PRODUCTS = [
  {
    id: 'ain-excel-pack',
    badge: '🔥 1,000+ EXCEL TEMPLATES — ₹199 ONLY',
    name: 'aIn — Excel All-in-One Master Suite',
    category: 'BI',
    tagline: 'From Manual To Smart Work — Pro Dashboards, Auto Calculation & Business Templates (.xlsx)',
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

  // Cart & Sidebar States
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)


  const [currency, setCurrency] = useState('INR') // 'INR' | 'USD'

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
        try { localStorage.setItem('bex_customer_email', custEmail) } catch {}
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
            <span className="webdev-dept-label">OUR PRODUCTS · EXCEL ECOSYSTEM</span>
            <h1 className="webdev-store-title">Excel Master Hub & Store</h1>
            <p className="webdev-store-sub">
              Operator: <strong style={{ color: '#10b981' }}>{userName || 'Guest'}</strong> · Flagship "aIn" Pack & Live Excel Academy
            </p>
          </div>
        </div>

        <div className="webdev-store-header-right webdev-header-right">
          {/* Currency Switcher */}
          <button
            aria-label={`Switch currency, currently ${currency}`}
            className="webdev-currency-btn interactive"
            onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
            title={currency === 'INR' ? 'Show USD estimate (charge is still INR via Cashfree)' : 'Show INR (actual charge)'}
          >
            💱 {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>

          {/* Cart trigger button */}
          <div role="button" tabIndex={0} aria-label={`Open cart, ${cart.reduce((s, i) => s + i.quantity, 0)} items`} className="webdev-cart-trigger interactive" onClick={() => setIsCartOpen(true)} onKeyDown={(e) => e.key === 'Enter' && setIsCartOpen(true)}>
            <span>🛒 CART</span>
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



      {/* ── WALL POSTER EXHIBITION GALLERY ── */}
      <section className="poster-gallery-container">
        
        {/* Gallery Exhibition Marquee */}
        <div className="poster-gallery-marquee">
          <div className="poster-gallery-badge">
            <span className="pulse-dot" />
            <span>EXHIBITION · OFFICIAL VISUAL BLUEPRINTS</span>
          </div>
          <h1 className="poster-gallery-headline">
            From Manual To Smart Work — <span>Excel Master</span> Suite
          </h1>
          <p className="poster-gallery-subline">
            Experience our flagship Excel systems as framed high-definition blueprints. Designed for high-impact decision making, automated reporting, and executive clarity.
          </p>
        </div>

        {/* ═══ FLAGSHIP EXHIBITION WALL (Framed Centerpiece + Museum Plaque) ═══ */}
        <div className="poster-exhibition-wall">
          
          {/* Left: The Grand Framed Wall Poster */}
          <div className="poster-frame-stage">
            {/* Overhead Gallery Picture Lamp Fixture */}
            <div className="poster-wall-lamp">
              <div className="poster-lamp-mount" />
              <div className="poster-lamp-arms">
                <div className="poster-lamp-arm" />
                <div className="poster-lamp-arm" />
              </div>
              <div className="poster-lamp-bar" />
              <div className="poster-light-cone" />
            </div>

            {/* The Framed Poster */}
            <div
              className="poster-picture-frame interactive"
              onClick={() => setActiveLightboxPoster({
                title: 'BEx Sigma Tech — Learn Practice Excel: From Manual To Smart Work',
                image: '/ain_excel_pack.jpg',
                tag: 'Master Flagship Roadmap'
              })}
              title="Click to inspect poster in 4K Fullscreen"
            >
              {/* Corner Frame Brackets */}
              <div className="poster-frame-corner tl" />
              <div className="poster-frame-corner tr" />
              <div className="poster-frame-corner bl" />
              <div className="poster-frame-corner br" />

              {/* Deal Ribbon */}
              <div className="poster-deal-ribbon">₹199 Deal</div>

              {/* Inner Matting */}
              <div className="poster-frame-matting">
                <div className="poster-canvas-wrap">
                  <img
                    src="/ain_excel_pack.jpg"
                    alt="BEx Sigma Tech — Learn Practice Excel From Manual To Smart Work"
                    className="poster-canvas-img"
                    loading="lazy"
                  />
                  <div className="poster-glass-sheen" />
                  
                  {/* Hover Inspect Overlay (Desktop) */}
                  <div className="poster-hover-inspect">
                    <button className="poster-inspect-btn interactive">
                      <span>🔍</span>
                      <span>Inspect Blueprint Fullscreen</span>
                    </button>
                    <span className="poster-inspect-hint">Click for ultra-sharp HD zoom</span>
                  </div>

                  {/* Touch Zoom Pill (Mobile) */}
                  <div className="poster-mobile-zoom-pill">
                    <span>🔍 Tap to Zoom in 4K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Museum Exhibition Wall Plaque */}
          <div className="poster-wall-plaque">
            {/* Plaque Screws */}
            <div className="plaque-screw tl" />
            <div className="plaque-screw tr" />
            <div className="plaque-screw bl" />
            <div className="plaque-screw br" />

            <div className="plaque-catalog-num">
              <span className="plaque-catalog-tag">🏛️ EXHIBIT #01 · MASTER ROADMAP</span>
              <span className="plaque-rating-tag">⭐ 4.9/5 (500+ BUYERS)</span>
            </div>

            <h2 className="plaque-artwork-title">
              From Manual To Smart Work
            </h2>
            <div className="plaque-artwork-subtitle">
              aIn — Excel All-in-One Master Suite · 1,000+ Business Templates (.xlsx)
            </div>

            <div className="plaque-curator-line">
              <span className="plaque-ms-tag">✓ MICROSOFT VERIFIED ARCHITECT</span>
              <span>Curated by <strong>Hariharan.D</strong></span>
            </div>

            <p className="plaque-description">
              The definitive master blueprint transforming spreadsheets into automated executive command centers. Master Step 1 through Step 5 — featuring 10 enterprise dashboards and 5 bonus daily productivity suites.
            </p>

            {/* Price Tag Plaque */}
            <div className="plaque-price-row">
              <div className="plaque-price-left">
                <span className="plaque-price-main">{currency === 'INR' ? '₹199' : '$2.49'}</span>
                <span className="plaque-price-orig">{currency === 'INR' ? '₹999' : '$12.99'}</span>
              </div>
              <span className="plaque-price-deal">80% OFF · INSTANT ACCESS</span>
            </div>

            {/* Action Buttons */}
            <div className="plaque-actions">
              <button
                className="plaque-btn-primary interactive"
                onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
              >
                <span>⚡</span>
                <span>Get All-in-One Master Suite · {currency === 'INR' ? '₹199' : '$2.49'}</span>
              </button>
              <button
                className="plaque-btn-secondary interactive"
                onClick={() => addToCart(PRODUCTS[0])}
              >
                <span>🛒</span>
                <span>Add to Cart</span>
              </button>
            </div>

            {/* 4 Structured Value Cards */}
            <div className="plaque-value-grid">
              <div className="plaque-value-card">
                <span className="plaque-value-icon">📊</span>
                <div className="plaque-value-text">
                  <strong>1,000+ Ready Templates</strong>
                  <span>100+ business sectors</span>
                </div>
              </div>
              <div className="plaque-value-card">
                <span className="plaque-value-icon">📈</span>
                <div className="plaque-value-text">
                  <strong>10 Business Dashboards</strong>
                  <span>Sales, Finance, HR & MIS</span>
                </div>
              </div>
              <div className="plaque-value-card">
                <span className="plaque-value-icon">⚡</span>
                <div className="plaque-value-text">
                  <strong>Instant Email Access</strong>
                  <span>Lifetime Google Drive Link</span>
                </div>
              </div>
              <div className="plaque-value-card">
                <span className="plaque-value-icon">💻</span>
                <div className="plaque-value-text">
                  <strong>100% Fully Editable</strong>
                  <span>Excel (.xlsx) & Sheets Ready</span>
                </div>
              </div>
            </div>

            {/* 🎁 5 Free Bonus Toolkits Badges (Structured Vault) */}
            <div className="plaque-bonus-vault">
              <div className="plaque-bonus-vault-header">
                <div className="plaque-bonus-vault-header-left">
                  <span className="plaque-bonus-vault-icon">🎁</span>
                  <span className="plaque-bonus-vault-title">5 FREE BONUS TOOLKITS INCLUDED</span>
                </div>
                <span className="plaque-bonus-vault-badge">₹0 TODAY · WORTH ₹2,499</span>
              </div>
              <div className="plaque-bonus-grid">
                <div className="plaque-bonus-card">
                  <span className="plaque-bonus-icon">📋</span>
                  <div className="plaque-bonus-text">
                    <strong>Attendance Tracker</strong>
                    <span>Leaves, OT & shift logs</span>
                  </div>
                </div>
                <div className="plaque-bonus-card">
                  <span className="plaque-bonus-icon">🌱</span>
                  <div className="plaque-bonus-text">
                    <strong>Habit Tracker</strong>
                    <span>Daily streaks & progress</span>
                  </div>
                </div>
                <div className="plaque-bonus-card">
                  <span className="plaque-bonus-icon">📅</span>
                  <div className="plaque-bonus-text">
                    <strong>Daily Planner</strong>
                    <span>Time-blocked task matrix</span>
                  </div>
                </div>
                <div className="plaque-bonus-card">
                  <span className="plaque-bonus-icon">⌨️</span>
                  <div className="plaque-bonus-text">
                    <strong>120+ Shortcuts</strong>
                    <span>Cheat sheet for Excel speed</span>
                  </div>
                </div>
                <div className="plaque-bonus-card full-span">
                  <span className="plaque-bonus-icon">📄</span>
                  <div className="plaque-bonus-text">
                    <strong>Executive Resume Templates</strong>
                    <span>ATS-friendly corporate CV formats</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Trust Row */}
            <div className="plaque-trust-grid">
              <div className="plaque-trust-card">
                <span className="plaque-trust-icon">🔒</span>
                <span>100% Encrypted Checkout</span>
              </div>
              <div className="plaque-trust-card">
                <span className="plaque-trust-icon">⚡</span>
                <span>Instant Email Access</span>
              </div>
              <div className="plaque-trust-card">
                <span className="plaque-trust-icon">⭐</span>
                <span>4.9/5 Rating (500+ Buyers)</span>
              </div>
              <div className="plaque-trust-card">
                <span className="plaque-trust-icon">🇮🇳</span>
                <span>Made with Pride in India</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MANAGER HARI — MICROSOFT ENTERPRISE ACCURACY GUARANTEE ═══ */}
        <div className="ain-manager-section">
          <div className="ain-manager-photo-wrap">
            <img
              src="/ceo_hariharan.jpg"
              alt="Hariharan.D — Microsoft Verified Professional & General Manager"
              className="ain-manager-photo"
            />
            <div className="ain-manager-verified-dot">✓</div>
          </div>

          <div className="ain-manager-info">
            <div className="ain-manager-tags">
              <a
                href="https://www.linkedin.com/in/hariharan-d"
                target="_blank"
                rel="noreferrer"
                className="ain-ms-badge ain-ms-badge-link"
                title="View Microsoft Verified Profile"
              >
                <span>✓</span>
                <span>MICROSOFT VERIFIED</span>
              </a>
              <span className="ain-role-tag">MANAGER & FOUNDER</span>
              <span className="ain-role-tag">LEAD EXCEL ARCHITECT</span>
            </div>

            <h3 className="ain-manager-name">Hariharan.D</h3>
            <p className="ain-manager-quote">
              "Every template in the <strong>aIn Pack</strong> is engineered under official Microsoft enterprise accuracy guidelines. Clean formula architectures, zero broken links, and presentation-ready executive visual layouts."
            </p>

            <div className="ain-manager-bottom">
              <div className="ain-manager-stats">
                <span className="ain-stat-item"><strong>100+</strong> Dashboards</span>
                <span className="ain-stat-item"><strong>500+</strong> Students</span>
                <span className="ain-stat-item"><strong>100%</strong> Verified</span>
              </div>

              <a
                href="mailto:bexsigmatech@gmail.com?subject=Excel%20Training%20%26%20aIn%20Inquiry%20-%20Manager%20Hari"
                className="ain-manager-contact interactive"
              >
                <span>✉</span>
                <span>Contact Manager Hari</span>
              </a>
            </div>
          </div>
        </div>

        {/* ═══ LIVE EXCEL MASTERCLASS — COMMERCIAL POSTER ADVERTISEMENT ═══ */}
        <div className="excel-poster-ad-wrap">
          {/* Picture Lamp / Overhead Gallery Fixture */}
          <div className="ad-poster-lamp" aria-hidden="true">
            <div className="ad-poster-lamp-stem-left" />
            <div className="ad-poster-lamp-stem-right" />
            <div className="ad-poster-lamp-bar">
              <div className="ad-poster-lamp-bulb" />
            </div>
            <div className="ad-poster-lamp-beam" />
          </div>

          <div className="excel-poster-ad">
            {/* Metallic Corner Mounting Brackets */}
            <div className="ad-bracket ad-bracket-tl" aria-hidden="true"><span className="ad-screw" /></div>
            <div className="ad-bracket ad-bracket-tr" aria-hidden="true"><span className="ad-screw" /></div>
            <div className="ad-bracket ad-bracket-bl" aria-hidden="true"><span className="ad-screw" /></div>
            <div className="ad-bracket ad-bracket-br" aria-hidden="true"><span className="ad-screw" /></div>

            {/* Diagonal Gold Ribbon: ★ EXCLUSIVE ★ */}
            <div className="ad-ribbon-exclusive">
              <span>★ EXCLUSIVE ★</span>
            </div>

            {/* Marquee Banner Bar */}
            <div className="ad-poster-marquee-bar">
              <div className="ad-poster-marquee-pill-live">
                <span className="ad-live-beacon" />
                <span className="ad-marquee-pill-text">🔴 ADMISSION OPEN</span>
                <span className="ad-marquee-pill-cohort">BATCH 2026</span>
              </div>
              <div className="ad-poster-marquee-center">
                <span className="ad-star">★</span>
                <span>OFFICIAL LIVE SPREADSHEET & BI ACADEMY</span>
                <span className="ad-star">★</span>
              </div>
              <div className="ad-poster-marquee-badge">
                <span>⚡ 10 SEATS ONLY · WEEKEND & WEEKDAY</span>
              </div>
            </div>

            {/* Poster Inner Content Grid */}
            <div className="excel-poster-ad-body">
              {/* Left Column: Commercial Poster Pitch, Badges, Modules */}
              <div className="excel-poster-ad-left">
                <div className="ad-poster-eyebrow">
                  <span className="ad-gold-tag">★ LIVE MASTERCLASS</span>
                  <span className="ad-sep">·</span>
                  <span>1-ON-1 & COHORT SPRINT</span>
                </div>

                <h2 className="ad-poster-headline">
                  Stop Struggling With Formulas. <br />
                  <span className="ad-gradient-gold">Master Advanced Excel Live.</span>
                </h2>

                <p className="ad-poster-sub">
                  Transform from manual spreadsheet headaches into automated executive BI dashboards. Learn live, hands-on, directly from <strong>Hariharan.D</strong> (Microsoft Verified Professional & Lead Architect) in intensive weekend masterclass cohorts.
                </p>

                {/* 4 Poster Feature Stamps */}
                <div className="ad-poster-stamps">
                  <div className="ad-poster-stamp">
                    <span className="ad-stamp-icon">🔴</span>
                    <div className="ad-stamp-text">
                      <strong>Live 1-on-1 & Cohorts</strong>
                      <span>Interactive screen-share practice</span>
                    </div>
                  </div>
                  <div className="ad-poster-stamp">
                    <span className="ad-stamp-icon">📜</span>
                    <div className="ad-stamp-text">
                      <strong>Microsoft Credential</strong>
                      <span>Official verified completion certificate</span>
                    </div>
                  </div>
                  <div className="ad-poster-stamp">
                    <span className="ad-stamp-icon">⚡</span>
                    <div className="ad-stamp-text">
                      <strong>Solve Real Office Sheets</strong>
                      <span>Bring your company sheets to class</span>
                    </div>
                  </div>
                  <div className="ad-poster-stamp">
                    <span className="ad-stamp-icon">🎥</span>
                    <div className="ad-stamp-text">
                      <strong>Lifetime 4K Vault</strong>
                      <span>All recordings + master workbooks</span>
                    </div>
                  </div>
                </div>

                {/* 3 Core Curriculum Modules */}
                <div className="ad-poster-curriculum">
                  <div className="ad-curriculum-header">
                    <span className="ad-curriculum-label">CORE SYLLABUS BREAKDOWN</span>
                    <span className="ad-curriculum-badge">3 WEEKS SPRINT</span>
                  </div>
                  <div className="ad-curriculum-items">
                    <div className="ad-curriculum-item">
                      <span className="ad-mod-pill">01</span>
                      <div>
                        <strong>Dynamic Formulas & Nested Logic</strong>
                        <span>XLOOKUP, INDEX/MATCH, LAMBDA, LET, Nested Logic</span>
                      </div>
                    </div>
                    <div className="ad-curriculum-item">
                      <span className="ad-mod-pill">02</span>
                      <div>
                        <strong>Executive BI & Dynamic Slicers</strong>
                        <span>KPI Slicers, Interactive Heatmaps & Executive Views</span>
                      </div>
                    </div>
                    <div className="ad-curriculum-item">
                      <span className="ad-mod-pill">03</span>
                      <div>
                        <strong>Power Query & Data Pipelines</strong>
                        <span>1-Click ETL, Multi-Sheet Sync & Automated Pipelines</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Commercial VIP Admission Pass / Ticket */}
              <div className="excel-poster-ad-right">
                <div className="ad-vip-ticket">
                  {/* Decorative Ticket Cutouts */}
                  <div className="ad-ticket-notch ad-ticket-notch-left" aria-hidden="true" />
                  <div className="ad-ticket-notch ad-ticket-notch-right" aria-hidden="true" />

                  {/* Ticket Header */}
                  <div className="ad-ticket-header">
                    <div className="ad-ticket-head-left">
                      <span className="ad-ticket-seal">★ EXCLUSIVE ★</span>
                      <span className="ad-ticket-title">VIP ADMISSION PASS</span>
                    </div>
                    <span className="ad-ticket-id">#BEX-LIVE-2026</span>
                  </div>

                  {/* Instructor Spotlight */}
                  <div className="ad-ticket-instructor">
                    <div className="ad-instructor-avatar-wrap">
                      <img
                        src="/ceo_hariharan.jpg"
                        alt="Hariharan.D"
                        className="ad-instructor-avatar"
                      />
                      <div className="ad-avatar-badge" title="Microsoft Verified">✓</div>
                    </div>
                    <div className="ad-instructor-meta">
                      <a
                        href="https://www.linkedin.com/in/hariharan-d"
                        target="_blank"
                        rel="noreferrer"
                        className="ad-ms-link"
                        title="View Microsoft Verified Profile"
                      >
                        <span>✓ MICROSOFT VERIFIED ARCHITECT</span>
                      </a>
                      <h3 className="ad-instructor-title">Hariharan.D</h3>
                      <p className="ad-instructor-desc">Lead Excel Architect · Founder</p>
                    </div>
                  </div>

                  {/* Dashed Perforation Divider */}
                  <div className="ad-ticket-divider">
                    <span className="ad-divider-line" />
                    <span className="ad-divider-badge">ADMIT ONE · FREE DEMO</span>
                    <span className="ad-divider-line" />
                  </div>

                  {/* Ticket Perks */}
                  <div className="ad-ticket-perks">
                    <div className="ad-ticket-perk">
                      <span className="ad-perk-check">✔</span>
                      <span>Free 1-Hour Live Interactive Demo Session</span>
                    </div>
                    <div className="ad-ticket-perk">
                      <span className="ad-perk-check">✔</span>
                      <span>1-on-1 Skill Diagnosis & Real-time Q&A</span>
                    </div>
                    <div className="ad-ticket-perk">
                      <span className="ad-perk-check">✔</span>
                      <span>Custom Learning Roadmap for Your Job Role</span>
                    </div>
                  </div>

                  {/* Barcode Graphic */}
                  <div className="ad-ticket-barcode">
                    <div className="ad-barcode-bars" aria-hidden="true">
                      <span className="b-w2" /><span className="b-w1" /><span className="b-w3" /><span className="b-w1" />
                      <span className="b-w2" /><span className="b-w4" /><span className="b-w1" /><span className="b-w2" />
                      <span className="b-w3" /><span className="b-w1" /><span className="b-w2" /><span className="b-w1" />
                      <span className="b-w4" /><span className="b-w2" /><span className="b-w1" /><span className="b-w3" />
                      <span className="b-w2" /><span className="b-w1" /><span className="b-w3" /><span className="b-w2" />
                    </div>
                    <span className="ad-barcode-number">9874 0123 2026 LIVE</span>
                  </div>

                  {/* CTA Button */}
                  <div className="ad-ticket-cta-wrap">
                    <a
                      href="mailto:bexsigmatech@gmail.com?subject=Excel%20Live%20Masterclass%20%26%20Demo%20Session%20Booking&body=Hi%20Manager%20Hari,%0A%0AI%20am%20interested%20in%20joining%20the%20Excel%20Live%20Masterclass%20/%201-on-1%20Training.%20Please%20reserve%20a%20seat%20for%20the%20upcoming%20batch%20and%20share%20the%20free%20demo%20class%20details."
                      className="ad-ticket-btn-primary interactive"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>🎟️ Book Free Demo Pass & Talk to Hari</span>
                      <span>→</span>
                    </a>
                    <div className="ad-ticket-urgency">
                      <span className="ad-urgency-fire">🔥</span>
                      <span>Limited to 10 Seats · Weekend & Weekday Cohorts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Poster Commercial Guarantee Strip */}
            <div className="ad-poster-guarantee-bar">
              <span>🛡️ 100% Practical Corporate Training · Zero Theory Fluff · Direct Screen-Share Guidance · Official Certificate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Services — Framed Blueprints Exhibition Wall ── */}
      <section className="services-poster-wall-section">
        {/* Header */}
        <div className="services-wall-header">
          <div className="services-wall-eyebrow">
            <span className="services-wall-dot" />
            <span>EXHIBITION · 4 CORE DISCIPLINES</span>
          </div>
          <h2 className="services-wall-title">
            Our Services · <span>Visual Blueprints</span>
          </h2>
          <p className="services-wall-sub">
            Four ways we engineer digital products into reality. Browse each service as a framed exhibition blueprint — click any poster to inspect architecture, delivery timelines, and technology stacks.
          </p>
        </div>

        {/* Gallery Wall Surface */}
        <div className="services-wall-surface">
          {/* Top Museum Wall Rail */}
          <div className="services-wall-rail" />

          {/* 4-Column Poster Wall Grid */}
          <div className="services-wall-grid">
            {WORKS.map((work) => (
              <div
                key={work.id}
                className="services-poster-item"
                style={{
                  '--service-accent': work.accent,
                  '--service-glow': work.glow,
                }}
              >
                {/* Authentic Hanging Wire & Brass Wall Hook */}
                <div className="services-hanging-wire">
                  <div className="services-wire-hook" />
                  <div className="services-wire-line left" />
                  <div className="services-wire-line right" />
                </div>

                {/* The Framed Picture */}
                <div
                  className="services-picture-frame interactive"
                  onClick={() => {
                    cinemaAudio.playOrbSelect()
                    setSelectedService(work.id)
                  }}
                  title={`Inspect ${work.title} specifications`}
                >
                  {/* Corner Frame Accents */}
                  <div className="services-frame-corner tl" />
                  <div className="services-frame-corner tr" />
                  <div className="services-frame-corner bl" />
                  <div className="services-frame-corner br" />

                  {/* Poster Artwork Canvas */}
                  <div className="services-poster-canvas">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="services-poster-img"
                      loading="lazy"
                    />
                    {/* Badge */}
                    <span className="services-poster-badge">
                      {work.meta}
                    </span>
                    {/* Hover Inspect Pill */}
                    <div className="services-poster-hover-overlay">
                      <span className="services-hover-pill">🔍 Click to Inspect</span>
                    </div>
                  </div>

                  {/* Museum Plaque Mounted Below Poster */}
                  <div className="services-plaque">
                    <div className="services-plaque-top">
                      <span className="services-plaque-num">{work.num} · {work.id.toUpperCase()}</span>
                      <span className="services-plaque-timeline">⏱ {work.timeline}</span>
                    </div>
                    <h3 className="services-plaque-title">{work.title}</h3>
                    <p className="services-plaque-sub">{work.subtitle}</p>

                    {/* Specs Chips */}
                    <div className="services-plaque-chips">
                      {work.specs?.slice(0, 3).map((spec, sIdx) => (
                        <div key={sIdx} className="services-plaque-chip">
                          <span className="services-chip-dot" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Plaque Action Buttons */}
                    <div className="services-plaque-actions">
                      <button
                        type="button"
                        className="services-btn-inspect interactive"
                        onClick={(e) => {
                          e.stopPropagation()
                          cinemaAudio.playOrbSelect()
                          setSelectedService(work.id)
                        }}
                      >
                        <span>Explore Scope</span>
                        <span>→</span>
                      </button>
                      <button
                        type="button"
                        className="services-btn-lightbox interactive"
                        onClick={(e) => {
                          e.stopPropagation()
                          cinemaAudio.playOrbSelect()
                          setActiveLightboxPoster({
                            title: work.title,
                            image: work.image,
                            tag: work.meta,
                          })
                        }}
                        title="Inspect poster in 4K Fullscreen"
                      >
                        🔍
                      </button>
                    </div>
                  </div>
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
