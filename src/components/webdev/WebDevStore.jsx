import React, { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import '../../styles/lumosStoreScroll.css'
import '../../styles/ainExcelStore.css'

gsap.registerPlugin(ScrollTrigger)

/* ==========================================================================
   BEX SIGMA TECH — LUMOS STORE SCROLL EXPERIENCE
   Strictly scoped to Store Page. Unmounts cleanly to protect all other pages.
   ========================================================================== */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

// Flagship master product for Cashfree & Cart
const PRODUCTS = [
  {
    id: 'ain-excel-pack',
    badge: '🔥 1,000+ EXCEL TEMPLATES — ₹199 ONLY',
    name: 'aIn — Excel All-in-One Master Suite',
    category: 'BI & FINANCE',
    tagline: 'From Manual To Smart Work — Pro Dashboards, Auto Calculation & Business Templates (.xlsx)',
    shortDesc: '1,000+ ready-to-use business spreadsheets, 10 automated BI dashboards & 5 VIP bonus toolkits with lifetime Drive access.',
    price: 199,
    priceDisplay: 'Rs 199',
    originalPrice: 'Rs 9,999',
    currency: 'INR',
    color: '#10b981',
    image: '/ain_excel_pack.jpg',
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

// Lumos 4 Linear Rows for All Products Section
const LUMOS_PRODUCTS = [
  {
    id: 'sales-dashboard',
    index: '01',
    name: 'Sales Dashboard',
    tagline: 'Automated Regional Slicers, Win-Rates, Quotas & Revenue Velocity',
    category: 'EXECUTIVE BI',
    price: 199,
    priceDisplay: 'Rs 199',
    originalPrice: 'Rs 1,999',
    image: '/sales_dashboard.jpg',
  },
  {
    id: 'finance-tracker',
    index: '02',
    name: 'Finance Tracker',
    tagline: 'Linked 3-Statement GAAP Models, Cash Runway & Investor DCF',
    category: 'FINANCIAL ARCHITECTURE',
    price: 199,
    priceDisplay: 'Rs 199',
    originalPrice: 'Rs 2,499',
    image: '/financial_trend.jpg',
  },
  {
    id: 'inventory-manager',
    index: '03',
    name: 'Inventory Manager',
    tagline: 'Automated SKU Reorder Points, Turnover Math & Stock Matrix',
    category: 'OPERATIONS',
    price: 199,
    priceDisplay: 'Rs 199',
    originalPrice: 'Rs 1,499',
    image: '/one_dashboard_suite.jpg',
  },
  {
    id: 'kpi-report',
    index: '04',
    name: 'KPI Report',
    tagline: 'HR Payroll Runs, 9-Box Grid, Project Gantt Timelines & Exec Metrics',
    category: 'ENTERPRISE METRICS',
    price: 199,
    priceDisplay: 'Rs 199',
    originalPrice: 'Rs 1,999',
    image: '/project_scorecard.jpg',
  },
]

/* ── Cashfree Payment Handler ── */
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
      await new Promise((resolve, reject) => {
        if (document.getElementById('cashfree-sdk-script')) {
          const check = setInterval(() => {
            if (typeof window.Cashfree === 'function') { clearInterval(check); resolve() }
          }, 100)
          setTimeout(() => { clearInterval(check); reject(new Error('Cashfree SDK timeout')) }, 5000)
          return
        }
        const s = document.createElement('script')
        s.id = 'cashfree-sdk-script'
        s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load Cashfree SDK'))
        document.head.appendChild(s)
      })
    }

    const cashfree = window.Cashfree({ mode: 'production' })
    cashfree.checkout({
      paymentSessionId: payment_session_id,
      redirectTarget: '_modal',
    }).then(async (result) => {
      if (result.error) {
        onError(result.error.message || 'Payment closed or failed')
      } else if (result.paymentDetails) {
        await runVerification()
      } else {
        await runVerification()
      }
    }).catch(async () => {
      await runVerification()
    })

  } catch (err) {
    onError(err.message || 'Network error initiating payment')
  }
}

export default function WebDevStore() {
  const { userName, exitWebDevStore } = useStore()

  // Currency & Cart
  const [currency, setCurrency] = useState('INR') // 'INR' | 'USD'
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Pink Flash on Scroll Transition
  const [isPinkFlash, setIsPinkFlash] = useState(false)
  const triggerPinkFlash = () => {
    setIsPinkFlash(true)
    setTimeout(() => setIsPinkFlash(false), 300)
  }

  // 0. Lumos Hot-Pink Intro Curtain State & Auto-Dismiss
  const [isIntroActive, setIsIntroActive] = useState(true)
  const [isIntroTearing, setIsIntroTearing] = useState(false)
  const dismissIntro = () => {
    setIsIntroTearing(true)
    setTimeout(() => {
      setIsIntroActive(false)
    }, 850)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissIntro()
    }, 2400)
    return () => clearTimeout(timer)
  }, [])

  // Draggable Sticker Cards State (Scroll 2 "Why We Are Loved")
  const [cardOffsets, setCardOffsets] = useState({
    card1: { x: 0, y: 0 },
    card2: { x: 0, y: 0 },
    card3: { x: 0, y: 0 },
  })
  const activeDragRef = useRef(null)

  const handlePointerDown = (cardKey, e) => {
    activeDragRef.current = {
      cardKey,
      startX: e.clientX,
      startY: e.clientY,
      initX: cardOffsets[cardKey].x,
      initY: cardOffsets[cardKey].y,
    }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!activeDragRef.current) return
    const { cardKey, startX, startY, initX, initY } = activeDragRef.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    setCardOffsets((prev) => ({
      ...prev,
      [cardKey]: { x: initX + dx, y: initY + dy },
    }))
  }

  const handlePointerUp = () => {
    activeDragRef.current = null
  }

  // Active Product for Side Preview Pane (Scroll 3)
  const [activePreviewProd, setActivePreviewProd] = useState(LUMOS_PRODUCTS[0])

  // 3D Tilt for Expert Photo Card (Scroll 4)
  const [expertTilt, setExpertTilt] = useState({ x: 0, y: 0 })
  const handleExpertMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setExpertTilt({ x: -y * 16, y: x * 16 })
  }
  const handleExpertMouseLeave = () => {
    setExpertTilt({ x: 0, y: 0 })
  }

  // Refs for Sections
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const tornRef = useRef(null)
  const lovedRef = useRef(null)
  const productsRef = useRef(null)
  const expertRef = useRef(null)

  // Checkout States
  const [checkoutMode, setCheckoutMode] = useState(null)
  const [sandboxStep, setSandboxStep] = useState(0)
  const [sandboxMsg, setSandboxMsg] = useState('')
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
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000) }

  // Ensure page always starts at top on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    }
  }, [])

  // ── GSAP + Lenis Smooth Scroll Setup (Strictly Scoped) ──
  useEffect(() => {
    // Only init if in browser
    if (typeof window === 'undefined') return

    const scrollContainer = containerRef.current
    if (scrollContainer) {
      scrollContainer.scrollTop = 0
    }

    const lenis = new Lenis({
      wrapper: scrollContainer || window,
      content: scrollContainer || document.body,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    })

    if (scrollContainer) {
      ScrollTrigger.defaults({ scroller: scrollContainer })
      scrollContainer.addEventListener('scroll', () => ScrollTrigger.update())
    }

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCb = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    lenis.scrollTo(0, { immediate: true })

    // 1. Hero Melt / Drip on Scroll
    if (heroRef.current) {
      const dripTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom center',
          scrub: 1,
        }
      })
      dripTl.to('.lumos-drip-neck', { scaleY: 2.5, transformOrigin: 'top center', ease: 'none' }, 0)
      dripTl.to('.lumos-drip-drop-1', { y: 130, opacity: 0, ease: 'power1.in' }, 0.05)
      dripTl.to('.lumos-drip-drop-2', { y: 160, opacity: 0, ease: 'power1.in' }, 0.15)
      dripTl.to('.lumos-drip-drop-3', { y: 125, opacity: 0, ease: 'power1.in' }, 0.1)
    }

    // 2. Torn Paper Reveal & Pink Flash
    if (tornRef.current) {
      ScrollTrigger.create({
        trigger: tornRef.current,
        start: 'top 85%',
        onEnter: () => triggerPinkFlash(),
        onEnterBack: () => triggerPinkFlash(),
      })
    }

    // 3. Why We Are Loved — 3 Tilted Cards Fly-In
    if (lovedRef.current) {
      gsap.from('.lumos-tilt-card', {
        y: 110,
        opacity: 0,
        stagger: 0.18,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: lovedRef.current,
          start: 'top 75%',
        }
      })
    }

    // 4. All Products List Stagger Rows
    if (productsRef.current) {
      gsap.from('.lumos-product-row', {
        x: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.65,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: productsRef.current,
          start: 'top 75%',
        }
      })
    }

    // 5. Expert Section Entrance
    if (expertRef.current) {
      gsap.from('.lumos-expert-photo-wrap', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: expertRef.current,
          start: 'top 75%',
        }
      })
      gsap.from('.lumos-expert-info', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: expertRef.current,
          start: 'top 75%',
        }
      })
    }

    // CLEANUP ON UNMOUNT: Guarantee zero bleed to other pages
    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerCb)
      ScrollTrigger.getAll().forEach((t) => t.kill())
      ScrollTrigger.defaults({ scroller: window })
    }
  }, [])

  // Cart Operations
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

  const handleOpenCheckoutModal = (product) => {
    cinemaAudio.playOrbSelect()
    setTargetProduct(product || PRODUCTS[0])
    setIsCustomerModalOpen(true)
  }

  const handleStartPayment = (e) => {
    e.preventDefault()
    if (!custEmail || !custEmail.includes('@')) {
      showToast('Please enter a valid email to receive your instant Google Drive access.')
      return
    }
    if (!custName) {
      showToast('Please enter your full name.')
      return
    }

    setIsCustomerModalOpen(false)
    setIsPaying(true)

    initiateCashfreePayment(
      targetProduct || PRODUCTS[0],
      custName,
      custEmail,
      custPhone,
      () => {
        setIsPaying(false)
        setCheckoutMode('cashfree')
        setSandboxStep(3)
        setSandboxMsg(`🎉 Payment Verified! Your Excel Suite access link has been dispatched to ${custEmail}`)
        cinemaAudio.playAccessGrantedChime()
        voiceEmitter.emit('PAYMENT_SUCCESS')
        try {
          localStorage.setItem('bex_customer_email', custEmail)
          localStorage.setItem('bex_customer_phone', custPhone)
        } catch { }
        if (cart.length > 0) setCart([])
      },
      (err) => {
        setIsPaying(false)
        setCheckoutMode(null)
        showToast(`Payment error: ${err}`, 'error')
      }
    )
  }

  return (
    <div ref={containerRef} className="webdev-store-container lumos-store-experience" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      {/* ── 0. Iconic Hot-Pink Intro Curtain & Marquee ── */}
      {isIntroActive && (
        <div className={`lumos-intro-curtain ${isIntroTearing ? 'tearing' : ''}`}>
          <div className="lumos-intro-marquee-track">
            <div className="lumos-intro-marquee-content">
              <span>HELLO BEX</span><span className="lumos-cross">✖</span>
              <span>EXCEL MASTER SUITE</span><span className="lumos-cross">✖</span>
              <span>1000+ TEMPLATES</span><span className="lumos-cross">✖</span>
              <span>LIFETIME ACCESS</span><span className="lumos-cross">✖</span>
              <span>HELLO BEX</span><span className="lumos-cross">✖</span>
              <span>EXCEL MASTER SUITE</span><span className="lumos-cross">✖</span>
              <span>1000+ TEMPLATES</span><span className="lumos-cross">✖</span>
              <span>LIFETIME ACCESS</span><span className="lumos-cross">✖</span>
            </div>
          </div>
          <button className="lumos-intro-skip-btn interactive" onClick={dismissIntro}>
            ENTER STORE →
          </button>
        </div>
      )}

      {/* ── Pink Screen Flash on Tear Trigger ── */}
      <div className={`lumos-pink-flash-overlay ${isPinkFlash ? 'active' : ''}`} />

      {/* ── Grainy Paper Noise Overlay ── */}
      <div className="lumos-paper-grain" />

      {/* ══════════════════════════════════════════════════════════════════════════
         1. STORE PAGE HERO - OFF-WHITE PAPER #F2EFE9
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="lumos-hero-section">
        {/* Top of Store Page: Small text BEX STORE */}
        <header className="lumos-hero-top-bar">
          <div className="lumos-brand-pill">
            BEX STORE
          </div>

          <div className="lumos-center-pill">
            Excel Master Suite
          </div>

          <div className="lumos-top-actions">
            <button
              className="lumos-currency-btn interactive"
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              title="Toggle currency display"
            >
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </button>

            <button
              className="lumos-cart-btn interactive"
              onClick={() => setIsCartOpen(true)}
            >
              <span>🛒 CART</span>
              {cart.length > 0 && (
                <span className="lumos-cart-badge-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
              )}
            </button>

            <button
              className="lumos-get-started-btn interactive"
              onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
            >
              Get Started
            </button>

            {/* Exit Store button to return to HQ */}
            <button
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#444',
                padding: '4px 8px',
                fontWeight: 800,
              }}
              onClick={exitWebDevStore}
              title="Return to Headquarters"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Hero Top Content Row */}
        <div className="lumos-hero-content-row">
          {/* Left: Huge bold black text */}
          <h1 className="lumos-hero-headline">
            We believe<br />
            there's no bad Excel,<br />
            there's bad templates.
          </h1>

          {/* Right: Small text + Bracket Tag + Micro Note */}
          <div className="lumos-hero-side-sub">
            <span className="lumos-bracket-tag">[bex store]</span>
            For every business.
            <span className="lumos-hero-side-micro">
              a quick and effective enterprise solution can be found. Instant download & lifetime access included.
            </span>
          </div>
        </div>

        {/* Center: BEX Watermark + Metallic Teal Logo + Viscous Drips */}
        <div className="lumos-centerpiece-wrap">
          {/* Behind logo: Huge light grey BEX watermark */}
          <div className="lumos-bex-watermark" aria-hidden="true">
            BEX
          </div>

          {/* Center: Uploaded glossy metallic teal BEX SIGMA TECH logo */}
          <div className="lumos-logo-container">
            <img
              src="/bex_metallic_logo_clean.png"
              alt="BEx SIGMA TECH"
              className="lumos-metallic-logo"
            />

            {/* Viscous Teal Melting / Dripping SVG */}
            <svg
              className="lumos-drips-svg"
              viewBox="0 0 700 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="tealDripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d5c4b" />
                  <stop offset="45%" stopColor="#138a72" />
                  <stop offset="85%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
                <filter id="dripGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Drip 1 (Under Sigma Loop) */}
              <g className="lumos-drip-group-1">
                <path
                  className="lumos-drip-neck"
                  d="M 142 0 Q 150 25 150 45 Q 150 25 158 0 Z"
                  fill="url(#tealDripGrad)"
                />
                <circle
                  className="lumos-drip-drop lumos-drip-drop-1"
                  cx="150"
                  cy="48"
                  r="7.5"
                  fill="url(#tealDripGrad)"
                  filter="url(#dripGlow)"
                />
              </g>

              {/* Drip 2 (Under BEX letters center) */}
              <g className="lumos-drip-group-2">
                <path
                  className="lumos-drip-neck"
                  d="M 338 0 Q 350 35 350 62 Q 350 35 362 0 Z"
                  fill="url(#tealDripGrad)"
                />
                <circle
                  className="lumos-drip-drop lumos-drip-drop-2"
                  cx="350"
                  cy="66"
                  r="9.5"
                  fill="url(#tealDripGrad)"
                  filter="url(#dripGlow)"
                />
              </g>

              {/* Drip 3 (Under SIGMA TECH bar right) */}
              <g className="lumos-drip-group-3">
                <path
                  className="lumos-drip-neck"
                  d="M 514 0 Q 522 22 522 38 Q 522 22 530 0 Z"
                  fill="url(#tealDripGrad)"
                />
                <circle
                  className="lumos-drip-drop lumos-drip-drop-3"
                  cx="522"
                  cy="42"
                  r="7"
                  fill="url(#tealDripGrad)"
                  filter="url(#dripGlow)"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Bottom Hero Bar (Lumos Brutalist Signature) */}
        <div className="lumos-hero-bottom-bar">
          <div className="lumos-hero-bottom-left">
            <span className="lumos-smiley-icon">㋡</span>
            <span>Illuminate Enterprise BI Potential</span>
          </div>

          <div className="lumos-hero-bottom-center">
            {/* Authentic Lumos Barcode Signature */}
            <svg className="lumos-barcode-svg" viewBox="0 0 160 36" fill="currentColor">
              <rect x="0" y="0" width="3" height="36" />
              <rect x="5" y="0" width="2" height="36" />
              <rect x="10" y="0" width="5" height="36" />
              <rect x="18" y="0" width="1" height="36" />
              <rect x="22" y="0" width="4" height="36" />
              <rect x="29" y="0" width="2" height="36" />
              <rect x="34" y="0" width="6" height="36" />
              <rect x="43" y="0" width="2" height="36" />
              <rect x="48" y="0" width="4" height="36" />
              <rect x="55" y="0" width="1" height="36" />
              <rect x="59" y="0" width="5" height="36" />
              <rect x="67" y="0" width="3" height="36" />
              <rect x="73" y="0" width="2" height="36" />
              <rect x="78" y="0" width="6" height="36" />
              <rect x="87" y="0" width="1" height="36" />
              <rect x="91" y="0" width="4" height="36" />
              <rect x="98" y="0" width="3" height="36" />
              <rect x="104" y="0" width="2" height="36" />
              <rect x="109" y="0" width="5" height="36" />
              <rect x="117" y="0" width="2" height="36" />
              <rect x="122" y="0" width="4" height="36" />
              <rect x="129" y="0" width="1" height="36" />
              <rect x="133" y="0" width="6" height="36" />
              <rect x="142" y="0" width="3" height="36" />
              <rect x="148" y="0" width="2" height="36" />
              <rect x="153" y="0" width="4" height="36" />
            </svg>
          </div>

          <div
            className="lumos-hero-bottom-right interactive"
            onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="lumos-bracket-tag">[bex suite]</span>
            <span className="lumos-bottom-line" />
            <span>Enhance Commercial Power</span>
            <span className="lumos-arrow-down">↓</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         2. STORE PAGE SCROLL 1 - TORN PAPER & STATS
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={tornRef} className="lumos-torn-section">
        {/* Torn paper edge peeling from bottom of hero */}
        <div className="lumos-torn-paper-edge" />

        <div className="lumos-torn-content">
          <h2 className="lumos-torn-headline">
            We offer only personalized templates.
          </h2>
          <p className="lumos-torn-sub">
            To bring you automated executive clarity and the rapid commercial growth of your enterprise.
          </p>

          <div className="lumos-stats-row">
            <div className="lumos-stat-item">
              <span className="lumos-stat-val">200%</span>
              <span className="lumos-stat-label">Growth</span>
              <span className="lumos-stat-bracket">[client roi]</span>
            </div>
            <div className="lumos-stat-divider" />
            <div className="lumos-stat-item">
              <span className="lumos-stat-val">120+</span>
              <span className="lumos-stat-label">Projects</span>
              <span className="lumos-stat-bracket">[completed works]</span>
            </div>
            <div className="lumos-stat-divider" />
            <div className="lumos-stat-item">
              <span className="lumos-stat-val">100%</span>
              <span className="lumos-stat-label">Success</span>
              <span className="lumos-stat-bracket">[satisfaction rate]</span>
            </div>
            <div className="lumos-stat-divider" />
            <div className="lumos-stat-item">
              <span className="lumos-stat-val">₹199</span>
              <span className="lumos-stat-label">Master Suite</span>
              <span className="lumos-stat-bracket">[one-time lifetime]</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         3. STORE PAGE SCROLL 2 - WHY WE ARE LOVED (DRAGGABLE STICKER CARDS)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={lovedRef} className="lumos-loved-section">
        <div className="lumos-loved-inner">
          <h2 className="lumos-loved-title">
            <span className="white-text">why we are </span>
            <span className="grey-text">loved</span>
          </h2>

          <div className="lumos-cards-cluster">
            {/* Card 1: Fast & Reliable (Polaroid Off-White Style with Hazard Tape) */}
            <div
              className="lumos-drag-card card-polaroid interactive"
              style={{
                transform: `translate(${cardOffsets.card1.x}px, ${cardOffsets.card1.y}px) rotate(-6deg)`,
              }}
              onPointerDown={(e) => handlePointerDown('card1', e)}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <span className="lumos-card-badge">Instant Setup</span>
              <h3 className="lumos-card-title">Fast & Reliable</h3>
              <p className="lumos-card-desc">
                Instant Google Drive delivery in 60 seconds. Battle-tested formulas, XLOOKUP logic, and dynamic arrays pre-calculated with zero errors.
              </p>
              <div className="lumos-hazard-tape" />
            </div>

            {/* Card 2: Custom To You (Mint Teal Card with Barcode Stripes) */}
            <div
              className="lumos-drag-card card-mint interactive"
              style={{
                transform: `translate(${cardOffsets.card2.x}px, ${cardOffsets.card2.y}px) rotate(2deg)`,
              }}
              onPointerDown={(e) => handlePointerDown('card2', e)}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <span className="lumos-card-badge">100+ Verticals</span>
              <h3 className="lumos-card-title">Custom To You</h3>
              <p className="lumos-card-desc">
                100% editable .xlsx & Google Sheets tailored for high-growth tech startups, e-commerce, retail, manufacturing, logistics, and consultancies.
              </p>
              <div className="lumos-hazard-tape" />
            </div>

            {/* Card 3: Easy To Use (Hot Pink Card) */}
            <div
              className="lumos-drag-card card-pink interactive"
              style={{
                transform: `translate(${cardOffsets.card3.x}px, ${cardOffsets.card3.y}px) rotate(7deg)`,
              }}
              onPointerDown={(e) => handlePointerDown('card3', e)}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <span className="lumos-card-badge">Zero VBA Math</span>
              <h3 className="lumos-card-title">Easy To Use</h3>
              <p className="lumos-card-desc">
                No complex VBA macro coding or formula wrestling. Clean interactive slicers and executive BI visuals ready for your Monday leadership reviews.
              </p>
              <div className="lumos-hazard-tape" />
            </div>
          </div>

          {/* Bottom Continuous Marquee Ticker Strip */}
          <div className="lumos-ticker-strip">
            <button
              className="lumos-ticker-btn interactive"
              onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
            >
              Yes, I want the Suite! +
            </button>
            <div className="lumos-ticker-track">
              <div className="lumos-ticker-content">
                <span>Do you like this approach?</span><span className="cross">✖</span>
                <span>Do you like this approach?</span><span className="cross">✖</span>
                <span>Do you like this approach?</span><span className="cross">✖</span>
                <span>Do you like this approach?</span><span className="cross">✖</span>
                <span>Do you like this approach?</span><span className="cross">✖</span>
                <span>Do you like this approach?</span><span className="cross">✖</span>
                <span>Do you like this approach?</span><span className="cross">✖</span>
                <span>Do you like this approach?</span><span className="cross">✖</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         4. STORE PAGE SCROLL 3 - ALL PRODUCTS LIST (SPLIT PREVIEW LAYOUT)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={productsRef} className="lumos-products-section">
        <div className="lumos-products-inner">
          <div className="lumos-products-header">
            <h2 className="lumos-products-title">All Products</h2>
            <span className="lumos-products-sub">Curated Executive Excel Architecture</span>
          </div>

          <div className="lumos-products-split-layout">
            {/* Left Floating Preview Pane (Matching Lumos Video Frame 6!) */}
            <div className="lumos-product-preview-pane">
              <div className="lumos-preview-thumb-wrap">
                <img
                  src={activePreviewProd.image}
                  alt={activePreviewProd.name}
                  className="lumos-preview-img"
                />
              </div>
              <span className="lumos-preview-tag">{activePreviewProd.category}</span>
              <h3 className="lumos-preview-name">{activePreviewProd.name}</h3>
              <p className="lumos-preview-tagline">{activePreviewProd.tagline}</p>
              <button
                className="lumos-preview-btn interactive"
                onClick={() => handleOpenCheckoutModal(activePreviewProd)}
              >
                <span>Quick Buy ₹199</span>
                <span>→</span>
              </button>
            </div>

            {/* Right Horizontal Linear Rows */}
            <div className="lumos-products-list">
              {LUMOS_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className={`lumos-product-row interactive ${activePreviewProd.id === prod.id ? 'active' : ''}`}
                  onMouseEnter={() => setActivePreviewProd(prod)}
                  onClick={() => handleOpenCheckoutModal(prod)}
                >
                  <span className="lumos-row-index">{prod.index}</span>
                  <div className="lumos-row-name-wrap">
                    <h3 className="lumos-row-name">{prod.name}</h3>
                    <span className="lumos-row-tagline">{prod.tagline}</span>
                  </div>
                  <span className="lumos-row-category">{prod.category}</span>
                  <span className="lumos-row-price">
                    {currency === 'INR' ? prod.priceDisplay : '$2.49'}
                  </span>
                  <div className="lumos-row-action">
                    <button
                      className="lumos-buy-pill-btn interactive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenCheckoutModal(prod)
                      }}
                    >
                      <span>Buy Now</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         5. STORE PAGE SCROLL 4 - EXPERT (3D PERSPECTIVE TILT)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={expertRef} className="lumos-expert-section">
        <div className="lumos-expert-inner">
          <div
            className="lumos-expert-photo-wrap"
            style={{
              transform: `perspective(1000px) rotateX(${expertTilt.x}deg) rotateY(${expertTilt.y}deg)`,
            }}
            onMouseMove={handleExpertMouseMove}
            onMouseLeave={handleExpertMouseLeave}
          >
            <img
              src="/ceo_hariharan.jpg"
              alt="Hariharan D"
              className="lumos-expert-img"
            />
          </div>

          <div className="lumos-expert-info">
            <span className="lumos-expert-meta-header">[Who will you cooperate with?]</span>
            <span className="lumos-expert-tag">Microsoft Verified Architect</span>
            <h2 className="lumos-expert-title">
              Hariharan D — Excel Expert, 10+ Years.
            </h2>
            <div className="lumos-expert-quote">
              "[H] I architected this suite because businesses bleed time and capital on broken spreadsheet models, never on lack of vision."
            </div>
            <p className="lumos-expert-bio">
              Lead technical consultant and architect behind 120+ mission-critical enterprise spreadsheet systems, 3-statement GAAP valuation engines, and executive BI command centers.
            </p>
            <div className="lumos-expert-bullets">
              <div className="lumos-expert-bullet-item">
                <span className="lumos-bullet-icon">✓</span>
                <span>10+ Years Building Enterprise-Grade Financial & BI Architectures</span>
              </div>
              <div className="lumos-expert-bullet-item">
                <span className="lumos-bullet-icon">✓</span>
                <span>Official Microsoft Verified Excel Standard & GAAP Modeling</span>
              </div>
              <div className="lumos-expert-bullet-item">
                <span className="lumos-bullet-icon">✓</span>
                <span>Direct 1-on-1 WhatsApp Support Included with Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         6. STORE PAGE BUY BOX (CLIMAX SECTION)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section className="lumos-buybox-section">
        <div className="lumos-buybox-card">
          <span className="lumos-buybox-pill">⚡ Lifetime Master Access</span>
          <h2 className="lumos-buybox-heading">
            GET THE SUITE — {currency === 'INR' ? 'Rs 199' : '$2.49'}
          </h2>

          <div className="lumos-buybox-actions">
            <button
              className="lumos-action-btn-primary interactive"
              onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
            >
              <span>⚡ Buy Now</span>
            </button>

            <button
              className="lumos-action-btn-cart interactive"
              onClick={() => addToCart(PRODUCTS[0])}
            >
              <span>+ Add to Cart</span>
            </button>

            <a
              href="https://wa.me/919361657929?text=Hi%20Hariharan,%20I%20have%20a%20query%20about%20the%20aIn%20Excel%20Master%20Suite."
              target="_blank"
              rel="noreferrer"
              className="lumos-action-btn-wa interactive"
            >
              <span>💬 WhatsApp</span>
            </a>
          </div>

          <div className="lumos-buybox-guarantee">
            1000+ Templates • Instant Download • Lifetime Access • 100% Secure Checkout
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         7. STORE PAGE FOOTER (INSIDE STORE PAGE) — WITH MELTING LETTER DRIPS!
         ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="lumos-footer-section">
        <div className="lumos-footer-statement">
          <span className="lumos-footer-hello">
            HELLO
            {/* Melting SVG Drip on H */}
            <svg className="lumos-footer-letter-drip" style={{ left: '6%', bottom: '-22px' }} viewBox="0 0 16 36">
              <path d="M 4 0 Q 8 18 8 28 Q 8 36 12 28 Q 12 18 12 0 Z" />
            </svg>
            {/* Melting SVG Drip on O */}
            <svg className="lumos-footer-letter-drip" style={{ right: '8%', bottom: '-26px' }} viewBox="0 0 16 36">
              <path d="M 4 0 Q 8 20 8 32 Q 8 36 12 32 Q 12 20 12 0 Z" />
            </svg>
          </span>

          <span className="lumos-footer-bex">
            BEX
            {/* Melting SVG Drip on B */}
            <svg className="lumos-footer-letter-drip" style={{ left: '12%', bottom: '-26px', fill: '#A6F4E0' }} viewBox="0 0 16 36">
              <path d="M 4 0 Q 8 22 8 34 Q 8 38 12 34 Q 12 22 12 0 Z" />
            </svg>
            {/* Melting SVG Drip on X */}
            <svg className="lumos-footer-letter-drip" style={{ right: '14%', bottom: '-28px', fill: '#A6F4E0' }} viewBox="0 0 16 36">
              <path d="M 4 0 Q 8 24 8 36 Q 8 40 12 36 Q 12 24 12 0 Z" />
            </svg>
          </span>
        </div>

        {/* 3-Column Meta Grid (Matching Lumos Video Frames 10 & 11) */}
        <div className="lumos-footer-meta-grid">
          <div className="lumos-footer-col-left">
            <a href="#about" onClick={(e) => { e.preventDefault(); heroRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>About Suite</a>
            <a href="#products" onClick={(e) => { e.preventDefault(); productsRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Products & Slicers</a>
            <a href="#expert" onClick={(e) => { e.preventDefault(); expertRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Technical Architect</a>
            <a href="https://wa.me/919361657929" target="_blank" rel="noreferrer">Direct WhatsApp</a>
          </div>

          <div className="lumos-footer-col-center">
            Illuminate Your Enterprise BI Potential
          </div>

          <div className="lumos-footer-col-right">
            <div className="lumos-footer-meta-item">
              <span className="lumos-footer-meta-label">[email]</span>
              <span>support@bexsigmatech.com</span>
            </div>
            <div className="lumos-footer-meta-item">
              <span className="lumos-footer-meta-label">[phone]</span>
              <span>+91 93616 57929</span>
            </div>
            <div className="lumos-footer-meta-item">
              <span className="lumos-footer-meta-label">[delivery]</span>
              <span>Instant Google Drive Dispatch</span>
            </div>
          </div>
        </div>

        <div className="lumos-footer-bottom-row">
          <div>
            <span>© {new Date().getFullYear()} BEx SIGMA TECH. All rights reserved.</span>
          </div>
          <div>
            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#6b7280', marginRight: '20px' }}>
              [architecture by] Bex Sigma Tech Pod
            </span>
            <button
              className="lumos-footer-top-btn interactive"
              onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* ── Cart Sidebar Drawer ── */}
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
                    price: getCartTotal(),
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
      {isCustomerModalOpen && (
        <div className="ain-checkout-overlay" onClick={(e) => e.target === e.currentTarget && setIsCustomerModalOpen(false)}>
          <div className="ain-checkout-modal" role="dialog" aria-modal="true" aria-label="Checkout">
            <div className="ain-checkout-bar" />

            <div className="ain-checkout-header">
              <div className="ain-checkout-badge">⚡ INSTANT ACCESS CONFIRMATION</div>
              <h3 className="ain-checkout-title">Where should we deliver your files?</h3>
              <p className="ain-checkout-sub">
                Complete your details below to receive the Google Drive master folder link immediately upon payment.
              </p>
            </div>

            <form onSubmit={handleStartPayment} className="ain-checkout-form">
              <div className="ain-form-group">
                <label className="ain-form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="ain-form-input"
                />
              </div>

              <div className="ain-form-group">
                <label className="ain-form-label">Email Address (Google Drive Delivery) *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="ain-form-input"
                />
              </div>

              <div className="ain-form-group">
                <label className="ain-form-label">WhatsApp Mobile Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="ain-form-input"
                />
              </div>

              <div className="ain-order-summary-box">
                <div className="ain-summary-row">
                  <span>Product</span>
                  <span className="ain-summary-highlight">{targetProduct?.name || PRODUCTS[0].name}</span>
                </div>
                <div className="ain-summary-row">
                  <span>Total Amount</span>
                  <span className="ain-summary-price">
                    {currency === 'INR' ? `₹${targetProduct?.price || 199}` : '$2.49'}
                  </span>
                </div>
                <div className="ain-summary-row micro">
                  <span>Delivery Speed</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>⚡ Instant (Within 60 Seconds)</span>
                </div>
              </div>

              <div className="ain-form-actions">
                <button
                  type="button"
                  className="ain-btn-secondary interactive"
                  onClick={() => setIsCustomerModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ain-btn-submit interactive"
                >
                  <span>Pay Now via Cashfree (₹{targetProduct?.price || 199})</span>
                  <span>🔒</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sandboxed Order Modal Confirmation ── */}
      {checkoutMode === 'cashfree' && (
        <div className="ain-checkout-overlay">
          <div className="ain-checkout-modal" style={{ textAlign: 'center', padding: '40px 30px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginBottom: '10px' }}>
              Order Confirmed & Access Dispatched!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {sandboxMsg}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="lumos-action-btn-primary interactive"
                onClick={() => setCheckoutMode(null)}
              >
                Done
              </button>
              <a
                href="https://wa.me/919361657929?text=Hi%20Hariharan,%20I%20just%20completed%20my%20order%20for%20the%20Excel%20Master%20Suite."
                target="_blank"
                rel="noreferrer"
                className="lumos-action-btn-wa interactive"
              >
                <span>💬 WhatsApp Support</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification (Zero Alert() UI) ── */}
      {toast && (
        <div className={`ain-toast ${toast.type}`}>
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  )
}
