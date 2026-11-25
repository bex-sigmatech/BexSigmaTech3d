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

// Flagship single product: ₹199 All-in-One Master Suite (No other products sold)
const PRODUCTS = [
  {
    id: 'ain-excel-pack',
    badge: '🔥 1,000+ EXCEL TEMPLATES — ₹199 ONLY',
    name: 'aIn — Excel All-in-One Master Suite',
    category: 'ALL-IN-ONE SUITE',
    tagline: 'From Manual To Smart Work — 1,000+ Pro Dashboards, Financial Engines & Business Templates (.xlsx)',
    shortDesc: 'One complete ₹199 download containing 1,000+ automated Excel & Google Sheets templates with lifetime Drive access.',
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

// 5 Core Pillars Included INSIDE the Single ₹199 All-in-One Suite (Not separate products)
const SUITE_PILLARS = [
  {
    id: 'sales-dashboard',
    index: '01',
    watermark: 'SALES BI',
    name: 'Executive BI & Sales Dashboards',
    tagline: 'Automated Regional Slicers, Win-Rates, Quotas & Revenue Velocity (.xlsx)',
    category: 'PILLAR 01 · INCLUDED',
    highlights: ['Regional Heatmaps', 'Pipeline Velocity', 'Executive Summary Slicers'],
    outcome: 'Turns raw CRM & POS exports into board-ready charts in 15 seconds.',
    image: '/sales_dashboard.jpg',
  },
  {
    id: 'finance-tracker',
    index: '02',
    watermark: 'FINANCE',
    name: '3-Statement GAAP Financial Architecture',
    tagline: 'Linked P&L, Balance Sheet, Cash Runway & Investor DCF Valuation Engines',
    category: 'PILLAR 02 · INCLUDED',
    highlights: ['Auto-Linked P&L', '13-Week Cashflow', 'GST & Expense Ledger'],
    outcome: 'Zero broken formulas — audit-proof P&L and cash runway visibility.',
    image: '/financial_trend.jpg',
  },
  {
    id: 'inventory-manager',
    index: '03',
    watermark: 'INVENTORY',
    name: 'Operations & Automated SKU Inventory',
    tagline: 'Automated Reorder Alerts, Stock Turnover Math & Supplier Logistics',
    category: 'PILLAR 03 · INCLUDED',
    highlights: ['Low-Stock Alerts', 'FIFO Valuation', 'Vendor Purchase Tracker'],
    outcome: 'Eliminates stockouts & dead inventory across warehouses and retail.',
    image: '/one_dashboard_suite.jpg',
  },
  {
    id: 'kpi-report',
    index: '04',
    watermark: 'HR & KPI',
    name: 'HR & Enterprise KPI Scorecards',
    tagline: 'Payroll Runs, Attendance Calendars, Project Gantt Timelines & Team Metrics',
    category: 'PILLAR 04 · INCLUDED',
    highlights: ['Automated Payroll', 'Dynamic Gantt Charts', '9-Box Performance Grid'],
    outcome: 'Instant visibility across attendance, project deadlines, and SLA KPIs.',
    image: '/project_scorecard.jpg',
  },
  {
    id: 'templates-vault',
    index: '05',
    watermark: '1000+ VAULT',
    name: '1,000+ Ready-To-Use Industry Spreadsheets',
    tagline: 'E-commerce, Invoicing, CRM, Agency, Real Estate & Lifetime Google Drive Vault',
    category: 'PILLAR 05 · INCLUDED',
    highlights: ['100+ Verticals', 'Bonus Shortcuts Pack', 'Lifetime Drive Updates'],
    outcome: 'Every business spreadsheet you will ever need — unlocked forever for ₹199.',
    image: '/ain_excel_pack.jpg',
  },
]

// Lumos-Style 3D Depth Review Cards ("What people say about BEX")
const SUITE_REVIEWS = [
  {
    id: 'rev-1',
    quote: 'BEX replaced 14 broken company spreadsheets in one afternoon!',
    body: 'We bought the ₹199 All-in-One Master Suite expecting a few basic sheets. Instead we got complete 3-statement financial models and automated sales dashboards we now present in every Monday review.',
    author: 'Rohan Kulkarni',
    role: 'Founder, FinEdge Commerce',
    tags: ['Sales Dashboard', '₹199 All-in-One', 'Instant Drive'],
    image: '/lumos/card_coop.webp',
  },
  {
    id: 'rev-2',
    quote: 'Zero VBA headaches. Clean XLOOKUP & dynamic formulas out of the box.',
    body: 'Our finance team used to spend 12 hours a week reconciling inventory and GST trackers manually. The inventory & GAAP templates saved us over 40 hours every month immediately.',
    author: 'Ananya Iyer',
    role: 'Finance Lead, Kaveri Retail',
    tags: ['Finance Model', '1000+ Vault', 'Lifetime Access'],
    image: '/financial_trend.jpg',
  },
  {
    id: 'rev-3',
    quote: 'Best ₹199 business investment we made all year.',
    body: 'Every folder inside the Google Drive archive is cleanly structured for Microsoft Excel and Google Sheets. The HR payroll and project scorecard alone are worth 50x the suite price.',
    author: 'Karthik Nair',
    role: 'Operations Director, SwiftLogix',
    tags: ['HR & KPI', 'Inventory Tracker', 'Zero Coding'],
    image: '/lumos/card_picnic.webp',
  },
  {
    id: 'rev-4',
    quote: 'Executive-grade dashboards ready for client & board presentations.',
    body: 'Instead of building slicers from scratch for clients, our analytics pod customizes BEX templates in minutes. Crisp layout, rock-solid formulas, and lifetime updates included.',
    author: 'Sneha Verma',
    role: 'BI Consultant, PeakMetrics',
    tags: ['Executive BI', 'Project Gantt', 'Verified'],
    image: '/sales_dashboard.jpg',
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
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh()
      }
    }, 850)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissIntro()
    }, 2400)
    return () => clearTimeout(timer)
  }, [])

  // Draggable Sticker Cards State (Scroll 2 "Why We Are Loved" - all 7 cards from Lumos)
  const [activeCardKey, setActiveCardKey] = useState(null)
  const [cardOffsets, setCardOffsets] = useState({
    card1: { x: 0, y: 0 },
    card2: { x: 0, y: 0 },
    card3: { x: 0, y: 0 },
    card4: { x: 0, y: 0 },
    card5: { x: 0, y: 0 },
    card6: { x: 0, y: 0 },
    card7: { x: 0, y: 0 },
  })
  const activeDragRef = useRef(null)

  const handlePointerDown = (cardKey, e) => {
    setActiveCardKey(cardKey)
    activeDragRef.current = {
      cardKey,
      startX: e.clientX,
      startY: e.clientY,
      initX: cardOffsets[cardKey]?.x || 0,
      initY: cardOffsets[cardKey]?.y || 0,
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

  // Hero Dripping Centerpiece Mouse Parallax
  const [logoTilt, setLogoTilt] = useState({ x: 0, y: 0 })
  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setLogoTilt({ x: -y * 10, y: x * 12 })
  }
  const handleHeroMouseLeave = () => {
    setLogoTilt({ x: 0, y: 0 })
  }

  // Active Pillar for Side Preview Pane ("Text Behind Image" in Scroll 3)
  const [activePreviewProd, setActivePreviewProd] = useState(SUITE_PILLARS[0])
  const [expandedPillarId, setExpandedPillarId] = useState(null)

  // Lumos Line Tilt Effect on Product Rows (initTilt)
  const [rowTilts, setRowTilts] = useState({})
  const handleRowMouseMove = (id, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const rot = ((e.clientX - rect.left) / rect.width - 0.5) * -6
    setRowTilts((prev) => ({ ...prev, [id]: rot }))
  }
  const handleRowMouseLeave = (id) => {
    setRowTilts((prev) => ({ ...prev, [id]: 0 }))
  }

  // 3D Cube / Card Tilt for Expert Photo Card (Scroll 4)
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

  // Refs for Store Sections
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const tornRef = useRef(null)
  const lovedRef = useRef(null)
  const productsRef = useRef(null)
  const expertRef = useRef(null)
  const cubeTrackRef = useRef(null)
  const reviewsRef = useRef(null)
  const footerRef = useRef(null)

  // 3D Depth Progress for Reviews ("What people say about BEX")
  const [reviewDepth, setReviewDepth] = useState(0)

  // Scroll 4 Dual 3D Cube Rotation State (Hariharan [01] <-> Microsoft [02])
  const [expertCubeProgress, setExpertCubeProgress] = useState(0)
  const [cubeFaceOverride, setCubeFaceOverride] = useState(null) // null = scroll-driven, 0 = Face 1, 1 = Face 2
  const [hoveredCube, setHoveredCube] = useState(false)

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

  // ── Lumos Animations: GSAP + Lenis + Cube Text + Digit Roll + 3D Review Zoom + Box Rounding ──
  useEffect(() => {
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

    const updateReviews3DDepth = () => {
      if (!reviewsRef.current || window.innerWidth < 768) return
      const rect = reviewsRef.current.getBoundingClientRect()
      const winH = window.innerHeight || 900
      const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height * 0.72)))
      setReviewDepth(progress)
    }

    const updateExpertCubeRotation = () => {
      if (!expertRef.current || window.innerWidth < 768) return
      const winH = window.innerHeight || 900
      const trackEl = cubeTrackRef.current
      if (!trackEl) return
      const trackRect = trackEl.getBoundingClientRect()
      const stickyEl = trackEl.firstElementChild
      const stageH = stickyEl ? stickyEl.offsetHeight : Math.min(winH * 0.72, 650)
      const stickyTop = winH * 0.12
      const travel = Math.max(1, trackRect.height - stageH)
      // Rotate smoothly 0 -> 1 over 82% of sticky travel so [01] locks cleanly at start and [02] settles at 90deg before unsticking
      const progress = Math.max(0, Math.min(1, (stickyTop - trackRect.top) / (travel * 0.82)))
      setExpertCubeProgress(progress)
    }

    const onScrollUpdate = () => {
      ScrollTrigger.update()
      updateReviews3DDepth()
      updateExpertCubeRotation()
    }

    if (scrollContainer) {
      ScrollTrigger.defaults({ scroller: scrollContainer })
      scrollContainer.addEventListener('scroll', onScrollUpdate, { passive: true })
    }

    lenis.on('scroll', onScrollUpdate)

    const tickerCb = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCb)
    gsap.ticker.lagSmoothing(0)

    lenis.scrollTo(0, { immediate: true })

    // 1. Hero Melt / Drip + Watermark Parallax on Scroll
    if (heroRef.current) {
      const dripTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom center',
          scrub: 1,
        }
      })
      dripTl.to('.lumos-drip-neck', { scaleY: 3.2, transformOrigin: 'top center', ease: 'none' }, 0)
      dripTl.to('.lumos-drip-drop-1', { y: 150, opacity: 0.15, ease: 'power1.in' }, 0.05)
      dripTl.to('.lumos-drip-drop-2', { y: 210, opacity: 0.2, ease: 'power1.in' }, 0.12)
      dripTl.to('.lumos-drip-drop-3', { y: 140, opacity: 0.15, ease: 'power1.in' }, 0.08)
      dripTl.to('.lumos-bex-watermark', { y: -45, scale: 1.08, ease: 'none' }, 0)
    }

    // 2. Torn Paper Reveal, Pink Flash, 3D Cube Text Flip & Stat Box Rounding + Digit Flip
    if (tornRef.current) {
      ScrollTrigger.create({
        trigger: tornRef.current,
        start: 'top 85%',
        onEnter: () => triggerPinkFlash(),
        onEnterBack: () => triggerPinkFlash(),
      })

      const ioTorn = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tornRef.current?.classList.add('is-revealed')
              ioTorn.disconnect()
            }
          })
        },
        { root: scrollContainer || null, threshold: 0.08 }
      )
      ioTorn.observe(tornRef.current)

      // Stat Box Rounding + Lift Morph on Scroll
      gsap.fromTo(
        '.lumos-stat-item',
        { borderRadius: '0px', y: 20 },
        {
          borderRadius: '22px',
          y: 0,
          stagger: 0.08,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.lumos-stats-row',
            start: 'top 95%',
            toggleActions: 'play none none none',
          }
        }
      )
    }

    // 3. Why We Are Loved — 7 Cards Fly-In + Rounding Morph + Background Scale
    if (lovedRef.current) {
      gsap.fromTo(
        '.lumos-drag-card',
        { y: 55, scale: 0.92 },
        {
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: lovedRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          }
        }
      )
    }

    // 4. Inside All-in-One Suite — Sticky Left Preview Box Rounding Morph + Rows Slide
    if (productsRef.current) {
      gsap.fromTo(
        '.lumos-product-preview-pane',
        { borderRadius: '6px' },
        {
          borderRadius: '26px',
          ease: 'none',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 0.6,
          }
        }
      )
    }

    // 5. Expert Dual 3D Cube Scroll Initialization
    if (expertRef.current) {
      updateExpertCubeRotation()
    }

    // 6. Reviews Heading Cube Reveal (via reliable IntersectionObserver inside scroller)
    if (reviewsRef.current) {
      const ioReviews = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reviewsRef.current?.classList.add('is-revealed')
              ioReviews.disconnect()
            }
          })
        },
        { root: scrollContainer || null, threshold: 0.08 }
      )
      ioReviews.observe(reviewsRef.current)
    }

    // 7. Footer HELLO BEX Dripping Melt Elongation on Scroll (Matching Lumos Frames 10 -> 11)
    if (footerRef.current) {
      gsap.fromTo(
        '.lumos-footer-letter-drip',
        { scaleY: 0.65, transformOrigin: 'top center' },
        {
          scaleY: 1.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            end: 'bottom bottom',
            scrub: 0.7,
          }
        }
      )
    }

    // CLEANUP ON UNMOUNT: Guarantee zero bleed to other pages
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', onScrollUpdate)
      }
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
         1. STORE PAGE HERO - OFF-WHITE PAPER #F2EFE9 (MATCHING LUMOS SCREEN RECORDING)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="lumos-hero-section"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        {/* Top Nav Bar: BEX STORE left, internal section anchors center, Pink CTA right */}
        <header className="lumos-hero-top-bar">
          <div className="lumos-brand-pill">
            BEX STORE
          </div>

          <nav className="lumos-hero-nav-links" aria-label="Store sections">
            <a href="#about-suite" onClick={(e) => { e.preventDefault(); tornRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>About</a>
            <a href="#inside-suite" onClick={(e) => { e.preventDefault(); productsRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Inside Suite</a>
            <a href="#suite-reviews" onClick={(e) => { e.preventDefault(); reviewsRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Reviews</a>
            <a href="#architect" onClick={(e) => { e.preventDefault(); expertRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Architect</a>
          </nav>

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
              <span>🛒</span>
              {cart.length > 0 && (
                <span className="lumos-cart-badge-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
              )}
            </button>

            <button
              className="lumos-get-started-btn interactive"
              onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
            >
              <span>Get Suite · {currency === 'INR' ? '₹199' : '$2.49'}</span>
              <span className="lumos-btn-plus">+</span>
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
              1 All-in-One Master Suite with 1,000+ ready templates for {currency === 'INR' ? '₹199' : '$2.49'}. Instant Google Drive & lifetime access.
            </span>
            <div className="lumos-hero-side-divider" />
          </div>
        </div>

        {/* Center: BEX Watermark BEHIND + Dripping Metallic Teal Logo */}
        <div className="lumos-centerpiece-wrap">
          {/* Text Behind Image: Huge light grey BEX watermark */}
          <div className="lumos-bex-watermark" aria-hidden="true">
            BEX
          </div>

          {/* Foreground: Glossy metallic teal BEX SIGMA TECH logo with mouse parallax & melting drips */}
          <div
            className="lumos-logo-container"
            style={{
              transform: `perspective(1000px) rotateX(${logoTilt.x}deg) rotateY(${logoTilt.y}deg)`,
            }}
          >
            <img
              src="/bex_metallic_logo_clean.png"
              alt="BEx SIGMA TECH"
              className="lumos-metallic-logo"
            />

            {/* Viscous Teal Melting / Dripping SVG extending toward bottom barcode */}
            <svg
              className="lumos-drips-svg"
              viewBox="0 0 700 115"
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

              <g className="lumos-drip-group-1">
                <path
                  className="lumos-drip-neck"
                  d="M 142 0 Q 150 28 150 50 Q 150 28 158 0 Z"
                  fill="url(#tealDripGrad)"
                />
                <circle
                  className="lumos-drip-drop lumos-drip-drop-1"
                  cx="150"
                  cy="54"
                  r="7.5"
                  fill="url(#tealDripGrad)"
                  filter="url(#dripGlow)"
                />
              </g>

              <g className="lumos-drip-group-2">
                <path
                  className="lumos-drip-neck"
                  d="M 336 0 Q 350 45 350 86 Q 350 45 364 0 Z"
                  fill="url(#tealDripGrad)"
                />
                <circle
                  className="lumos-drip-drop lumos-drip-drop-2"
                  cx="350"
                  cy="92"
                  r="10"
                  fill="url(#tealDripGrad)"
                  filter="url(#dripGlow)"
                />
              </g>

              <g className="lumos-drip-group-3">
                <path
                  className="lumos-drip-neck"
                  d="M 514 0 Q 522 24 522 44 Q 522 24 530 0 Z"
                  fill="url(#tealDripGrad)"
                />
                <circle
                  className="lumos-drip-drop lumos-drip-drop-3"
                  cx="522"
                  cy="48"
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
            <span>Illuminate Commercial Power</span>
          </div>

          <div className="lumos-hero-bottom-center">
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
            <span className="lumos-bracket-tag">[all-in-one]</span>
            <span className="lumos-bottom-line" />
            <span>One Suite · {currency === 'INR' ? '₹199' : '$2.49'}</span>
            <span className="lumos-arrow-down">↓</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         2. STORE PAGE SCROLL 1 - TORN PAPER, 3D CUBE TEXT & FLIPPING DIGIT BOXES
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={tornRef} id="about-suite" className="lumos-torn-section">
        <div className="lumos-torn-paper-edge" />

        <div className="lumos-torn-content">
          <div className="lumos-torn-top-meta">
            <span className="lumos-scramble-tag">[ Nothing tells us better than the numbers achieved ]</span>
          </div>

          <h2 className="lumos-torn-headline lumos-cube-wrap">
            <span className="lumos-cube-line">
              <span className="lumos-ghost-word">We</span> offer
            </span>
            <span className="lumos-cube-line">only personalized</span>
            <span className="lumos-cube-line">
              <span className="lumos-ghost-word">templates</span>
            </span>
          </h2>

          <div className="lumos-torn-sub-row">
            <span className="lumos-scramble-tag">[about the suite]</span>
            <p className="lumos-torn-sub">
              One complete <strong>All-in-One Suite</strong> replacing messy manual sheets — bringing quality growth and instant business clarity for a one-time {currency === 'INR' ? '₹199' : '$2.49'}.
            </p>
          </div>

          <div className="lumos-stats-row">
            <div className="lumos-stat-item">
              <span className="lumos-stat-val">
                <span className="lumos-digit-cube">2</span>
                <span className="lumos-digit-cube">0</span>
                <span className="lumos-digit-cube">0</span>%
              </span>
              <span className="lumos-stat-label">Growth</span>
              <span className="lumos-stat-bracket">[client roi]</span>
            </div>
            <div className="lumos-stat-divider" />
            <div className="lumos-stat-item">
              <span className="lumos-stat-val">
                <span className="lumos-digit-cube">1</span>
                <span className="lumos-digit-cube">2</span>
                <span className="lumos-digit-cube">0</span>+
              </span>
              <span className="lumos-stat-label">Projects</span>
              <span className="lumos-stat-bracket">[completed works]</span>
            </div>
            <div className="lumos-stat-divider" />
            <div className="lumos-stat-item">
              <span className="lumos-stat-val">
                <span className="lumos-digit-cube">1</span>
                <span className="lumos-digit-cube">0</span>
                <span className="lumos-digit-cube">0</span>%
              </span>
              <span className="lumos-stat-label">Success</span>
              <span className="lumos-stat-bracket">[satisfaction rate]</span>
            </div>
            <div className="lumos-stat-divider" />
            <div className="lumos-stat-item is-suite-pill" onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}>
              <span className="lumos-stat-val">
                {currency === 'INR' ? '₹' : '$'}
                <span className="lumos-digit-cube">{currency === 'INR' ? '1' : '2'}</span>
                <span className="lumos-digit-cube">{currency === 'INR' ? '9' : '.4'}</span>
                <span className="lumos-digit-cube">{currency === 'INR' ? '9' : '9'}</span>
              </span>
              <span className="lumos-stat-label">All-in-One Suite</span>
              <span className="lumos-stat-bracket">[1,000+ sheets lifetime]</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         3. STORE PAGE SCROLL 2 - WHY WE ARE LOVED (FRONT CARDS & BACKGROUND TEXT)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        ref={lovedRef}
        className="lumos-loved-section"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Atmospheric Magenta Glow Behind Text */}
        <img
          src="/lumos/pink_bg.webp"
          alt="Pink atmospheric glow background"
          className="lumos-pink-bg-glow"
          loading="eager"
        />

        <div className="lumos-loved-inner">
          {/* GIANT BACKGROUND TYPOGRAPHY (Layer 1 - Sits Behind Foreground Cards) */}
          <div className="lumos-h2-wrapper">
            <h2 className="lumos-heading-xlarge">
              why <span className="lumos-low-opacity">we</span>
            </h2>
            <h2 className="lumos-heading-xlarge lumos-minus-margin">
              <span className="lumos-low-opacity">are</span> loved
            </h2>
          </div>

          {/* FOREGROUND OVERLAPPING CARDS CLUSTER (Layer 2 - Sits Directly in Front of Giant Text) */}
          <div className="lumos-drag-stage">
            {/* Card 7: Hot Pink Peeking Sticker ("We create worldwide" - matching Lumos Video Frame 5) */}
            <div
              className={`lumos-drag-card card-pink-worldwide interactive ${activeCardKey === 'card7' ? 'is-dragging' : ''}`}
              style={{
                transform: `translate(${cardOffsets.card7.x}px, ${cardOffsets.card7.y}px) rotate(-10deg)`,
                zIndex: activeCardKey === 'card7' ? 30 : 4,
              }}
              onPointerDown={(e) => handlePointerDown('card7', e)}
              onPointerUp={handlePointerUp}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <img
                src="/lumos/paper_top.webp"
                alt="Paper texture"
                className="lumos-paper-topper"
                draggable={false}
              />
              <span className="lumos-sticker-badge is-pink">[100+ industries]</span>
              <h3 className="lumos-sticker-title">
                We build <br />worldwide
              </h3>
              <p className="lumos-sticker-desc">
                Ready for any business vertical across retail, finance, SaaS, logistics & services.
              </p>
            </div>

            {/* Card 1: Left Polaroid (Cooperative) */}
            <div
              className={`lumos-drag-card card-polaroid-1 interactive ${activeCardKey === 'card1' ? 'is-dragging' : ''}`}
              style={{
                transform: `translate(${cardOffsets.card1.x}px, ${cardOffsets.card1.y}px) rotate(-18deg)`,
                zIndex: activeCardKey === 'card1' ? 30 : 5,
              }}
              onPointerDown={(e) => handlePointerDown('card1', e)}
              onPointerUp={handlePointerUp}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <div className="lumos-polaroid-inner">
                <img
                  src="/lumos/card_coop.webp"
                  alt="Cooperative team"
                  className="lumos-card-photo"
                  draggable={false}
                />
                <div className="lumos-polaroid-meta">
                  <span className="lumos-polaroid-title">cooperative</span>
                  <span className="lumos-polaroid-date">08.07.24</span>
                </div>
                <div className="lumos-hazard-stripe-tape" />
              </div>
            </div>

            {/* Card 2: Mint Teal Sticker (We are always near) */}
            <div
              className={`lumos-drag-card card-mint-near interactive ${activeCardKey === 'card2' ? 'is-dragging' : ''}`}
              style={{
                transform: `translate(${cardOffsets.card2.x}px, ${cardOffsets.card2.y}px) rotate(3deg)`,
                zIndex: activeCardKey === 'card2' ? 30 : 8,
              }}
              onPointerDown={(e) => handlePointerDown('card2', e)}
              onPointerUp={handlePointerUp}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <img
                src="/lumos/paper_top.webp"
                alt="Paper texture"
                className="lumos-paper-topper"
                draggable={false}
              />
              <span className="lumos-sticker-badge">[instant setup]</span>
              <h3 className="lumos-sticker-title">
                We are <br />always near
              </h3>
              <p className="lumos-sticker-desc">
                We are always available to understand your spreadsheet needs and come up with a quick, battle-tested solution.
              </p>
            </div>

            {/* Card 3: Center-Top Polaroid (Concert / Movie Day) */}
            <div
              className={`lumos-drag-card card-polaroid-2 interactive ${activeCardKey === 'card3' ? 'is-dragging' : ''}`}
              style={{
                transform: `translate(${cardOffsets.card3.x}px, ${cardOffsets.card3.y}px) rotate(1deg)`,
                zIndex: activeCardKey === 'card3' ? 30 : 6,
              }}
              onPointerDown={(e) => handlePointerDown('card3', e)}
              onPointerUp={handlePointerUp}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <div className="lumos-polaroid-inner">
                <img
                  src="/lumos/card_concert.webp"
                  alt="Movie day crowd"
                  className="lumos-card-photo"
                  draggable={false}
                />
                <div className="lumos-polaroid-meta">
                  <span className="lumos-polaroid-title">movie day</span>
                  <span className="lumos-polaroid-date">12.08.24</span>
                </div>
                <div className="lumos-hazard-stripe-tape" />
              </div>
            </div>

            {/* Card 4: Center-Bottom Polaroid (Picnic Skyline) */}
            <div
              className={`lumos-drag-card card-polaroid-3 interactive ${activeCardKey === 'card4' ? 'is-dragging' : ''}`}
              style={{
                transform: `translate(${cardOffsets.card4.x}px, ${cardOffsets.card4.y}px) rotate(-6deg)`,
                zIndex: activeCardKey === 'card4' ? 30 : 9,
              }}
              onPointerDown={(e) => handlePointerDown('card4', e)}
              onPointerUp={handlePointerUp}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <div className="lumos-polaroid-inner">
                <img
                  src="/lumos/card_picnic.webp"
                  alt="Picnic skyline"
                  className="lumos-card-photo"
                  draggable={false}
                />
                <div className="lumos-polaroid-meta">
                  <span className="lumos-polaroid-title">Picnic</span>
                  <span className="lumos-polaroid-date">24.09.24</span>
                </div>
                <div className="lumos-hazard-stripe-tape" />
              </div>
            </div>

            {/* Card 5: Hot Pink Sticker (We are playing the long game) */}
            <div
              className={`lumos-drag-card card-pink-long interactive ${activeCardKey === 'card5' ? 'is-dragging' : ''}`}
              style={{
                transform: `translate(${cardOffsets.card5.x}px, ${cardOffsets.card5.y}px) rotate(8deg)`,
                zIndex: activeCardKey === 'card5' ? 30 : 7,
              }}
              onPointerDown={(e) => handlePointerDown('card5', e)}
              onPointerUp={handlePointerUp}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <img
                src="/lumos/paper_top.webp"
                alt="Paper texture"
                className="lumos-paper-topper"
                draggable={false}
              />
              <span className="lumos-sticker-badge is-pink">[lifetime roi]</span>
              <h3 className="lumos-sticker-title">
                We are <br />playing the<br />long game
              </h3>
              <p className="lumos-sticker-desc">
                Our clients stay with us, continuing to automate and scale their business operations for years.
              </p>
            </div>

            {/* Card 6: Mint Cyan Sticker (We are for a comprehensive approach) */}
            <div
              className={`lumos-drag-card card-mint-approach interactive ${activeCardKey === 'card6' ? 'is-dragging' : ''}`}
              style={{
                transform: `translate(${cardOffsets.card6.x}px, ${cardOffsets.card6.y}px) rotate(-3deg)`,
                zIndex: activeCardKey === 'card6' ? 30 : 10,
              }}
              onPointerDown={(e) => handlePointerDown('card6', e)}
              onPointerUp={handlePointerUp}
            >
              <span className="lumos-drag-pill">DRAG</span>
              <img
                src="/lumos/paper_top.webp"
                alt="Paper texture"
                className="lumos-paper-topper"
                draggable={false}
              />
              <span className="lumos-sticker-badge">[1000+ templates]</span>
              <h3 className="lumos-sticker-title">
                We are for a <br />comprehensive <br />approach
              </h3>
              <p className="lumos-sticker-desc">
                We select the optimal set of templates specifically for your business to deliver maximum commercial results.
              </p>
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
         4. STORE PAGE SCROLL 3 - SINGLE ALL-IN-ONE SUITE (TEXT BEHIND IMAGE + TILT ROWS + TORN BLACK)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={productsRef} id="inside-suite" className="lumos-products-section">
        <div className="lumos-products-inner">
          {/* Top Lumos Header Bar with Counter [ 05 ] & Rotating Crosshair */}
          <div className="lumos-products-header">
            <div className="lumos-header-left-group">
              <span className="lumos-suite-count-bracket">[ 0{SUITE_PILLARS.length} ]</span>
              <h2 className="lumos-products-title">ONE ALL-IN-ONE SUITE</h2>
            </div>
            <div className="lumos-header-right-group">
              <span className="lumos-products-sub">
                Only 1 Product · Everything Included for {currency === 'INR' ? '₹199' : '$2.49'}
              </span>
              <span className="lumos-rotating-cross">+</span>
            </div>
          </div>

          <div className="lumos-products-split-layout">
            {/* Left Sticky Preview Box (Matching Lumos Video Frame 6: TEXT BEHIND IMAGE + BOX ROUNDING!) */}
            <div className="lumos-product-preview-pane">
              <div className="lumos-preview-thumb-wrap">
                <div className="lumos-preview-bg-text" aria-hidden="true">
                  {activePreviewProd.watermark}
                </div>
                <img
                  src={activePreviewProd.image}
                  alt={activePreviewProd.name}
                  className="lumos-preview-img"
                />
                <div className="lumos-preview-specs-overlay">
                  <div className="lumos-spec-item">
                    <span className="lumos-spec-label">Included In:</span>
                    <span className="lumos-spec-val">All-in-One ₹199 Master Suite</span>
                  </div>
                  <div className="lumos-spec-item">
                    <span className="lumos-spec-label">Format:</span>
                    <span className="lumos-spec-val">.XLSX + Google Sheets</span>
                  </div>
                  <div className="lumos-spec-item">
                    <span className="lumos-spec-label is-pink">Outcome:</span>
                    <span className="lumos-spec-val">{activePreviewProd.outcome}</span>
                  </div>
                </div>
              </div>

              <span className="lumos-preview-tag">{activePreviewProd.category}</span>
              <h3 className="lumos-preview-name">{activePreviewProd.name}</h3>
              <p className="lumos-preview-tagline">{activePreviewProd.tagline}</p>

              <button
                className="lumos-preview-btn interactive"
                onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
              >
                <span>⚡ Buy Complete Suite — {currency === 'INR' ? '₹199' : '$2.49'}</span>
                <span>+</span>
              </button>
            </div>

            {/* Right Interactive Pillars List (Zero Separate Product Prices — Strictly Everything Included in the 1 Suite) */}
            <div className="lumos-products-right-col">
              <div className="lumos-products-list">
                {SUITE_PILLARS.map((pillar) => {
                  const isActive = activePreviewProd.id === pillar.id
                  const isExpanded = expandedPillarId === pillar.id
                  const rowTilt = rowTilts[pillar.id] || 0
                  return (
                    <div
                      key={pillar.id}
                      className={`lumos-product-row interactive ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
                      onMouseEnter={() => setActivePreviewProd(pillar)}
                      onMouseMove={(e) => handleRowMouseMove(pillar.id, e)}
                      onMouseLeave={() => handleRowMouseLeave(pillar.id)}
                      onClick={() => {
                        setActivePreviewProd(pillar)
                        setExpandedPillarId(isExpanded ? null : pillar.id)
                      }}
                    >
                      {/* Lumos Rotating Top Divider Line */}
                      <div
                        className="lumos-row-tilt-divider"
                        style={{ transform: `rotateZ(${rowTilt}deg)` }}
                      />

                      <div className="lumos-row-main-grid">
                        <span className="lumos-row-index">{pillar.index}</span>
                        <div className="lumos-row-name-wrap">
                          <h3 className="lumos-row-name">{pillar.name}</h3>
                          <span className="lumos-row-tagline">{pillar.tagline}</span>
                        </div>
                        <span className="lumos-row-category">{pillar.category}</span>
                        <div className="lumos-row-action">
                          <span className="lumos-row-plus-icon">
                            {isExpanded ? '−' : '+'}
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="lumos-row-expanded-details">
                          <div className="lumos-expanded-chips">
                            {pillar.highlights.map((h) => (
                              <span key={h} className="lumos-expanded-chip">✓ {h}</span>
                            ))}
                          </div>
                          <button
                            className="lumos-buy-pill-btn interactive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenCheckoutModal(PRODUCTS[0])
                            }}
                          >
                            <span>Unlock All 5 Pillars · {currency === 'INR' ? '₹199' : '$2.49'}</span>
                            <span>→</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Bottom CTA Banner Matching Lumos Video Frame 7 */}
              <div className="lumos-suite-callout-bar">
                <div className="lumos-callout-left">
                  <strong>All 5 pillars + 1,000+ templates in one download.</strong>
                  <span>No subscriptions. No upsells. Lifetime access.</span>
                </div>
                <button
                  className="lumos-callout-pink-btn interactive"
                  onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
                >
                  <span>Buy All-in-One<br />Suite · {currency === 'INR' ? '₹199' : '$2.49'}</span>
                  <span className="lumos-callout-plus">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Torn White-to-Black Paper Edge Peeling Down into Expert Section (Video Frame 7) */}
        <div className="lumos-torn-bottom-black-edge" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         5. STORE PAGE SCROLL 4 - ARCHITECT DUAL 3D CUBE FLIP (MATCHING LUMOS SCREEN RECORDING)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={expertRef} id="architect" className="lumos-expert-section">
        <div className="lumos-expert-meta-center">
          <h2 className="lumos-expert-meta-header">[Who will you<br />cooperate with?]</h2>
          <div className="lumos-cube-face-switcher">
            <button
              type="button"
              className={`lumos-face-tab interactive ${(cubeFaceOverride === 0 || (cubeFaceOverride === null && expertCubeProgress < 0.5)) ? 'active' : ''}`}
              onClick={() => setCubeFaceOverride(cubeFaceOverride === 0 ? null : 0)}
            >
              [01] Hariharan D
            </button>
            <button
              type="button"
              className={`lumos-face-tab interactive ${(cubeFaceOverride === 1 || (cubeFaceOverride === null && expertCubeProgress >= 0.5)) ? 'active' : ''}`}
              onClick={() => setCubeFaceOverride(cubeFaceOverride === 1 ? null : 1)}
            >
              [02] Microsoft Verified
            </button>
          </div>
        </div>

        {/* Sticky 3D Dual-Cube Stage (Scroll rotates both 3D cubes 0deg -> 90deg!) */}
        <div ref={cubeTrackRef} className="lumos-cube-scroll-track">
          <div className="lumos-cube-sticky-stage">
            {(() => {
              const effProgress = cubeFaceOverride !== null ? cubeFaceOverride : expertCubeProgress
              const cube1Deg = Math.min(90, effProgress * 92)
              // Slight natural phase lag on Cube 2 matching Lumos video frame 3!
              const cube2Deg = Math.min(90, Math.max(0, (effProgress - 0.04) / 0.96) * 90)
              const manualClass = cubeFaceOverride !== null ? 'has-manual-transition' : ''
              return (
                <div className="lumos-dual-cubes-row">
                  {/* LEFT 3D CUBE: Portraits [01] & [02] */}
                  <div
                    className={`lumos-3d-cube is--cube-1 interactive ${effProgress >= 0.5 ? 'show-face-2' : ''}`}
                    onMouseEnter={() => setHoveredCube(true)}
                    onMouseLeave={() => setHoveredCube(false)}
                    onClick={() => setCubeFaceOverride(effProgress < 0.5 ? 1 : 0)}
                  >
                    {hoveredCube && <span className="lumos-cube-hover-pill">@hariharan_d</span>}

                    {/* Face 1 (Front): Hariharan D Portrait */}
                    <div
                      className={`lumos-cube-side is--front ${manualClass}`}
                      style={{
                        transform: `translate3d(0, 0, calc(var(--cube-half) * -1)) rotateX(${cube1Deg}deg) translate3d(0, 0, var(--cube-half))`,
                        opacity: cube1Deg > 88 ? 0 : 1,
                      }}
                    >
                      <img
                        src="/ceo_hariharan.jpg"
                        alt="Hariharan D"
                        className="lumos-cube-photo"
                      />
                    </div>

                    {/* Face 2 (Bottom): Microsoft Verified / Master Suite Preview */}
                    <div
                      className={`lumos-cube-side is--bottom ${manualClass}`}
                      style={{
                        transform: `translate3d(0, 0, calc(var(--cube-half) * -1)) rotateX(${cube1Deg - 90}deg) translate3d(0, 0, var(--cube-half))`,
                        opacity: cube1Deg < 2 ? 0 : 1,
                      }}
                    >
                      <img
                        src="/ain_excel_pack.jpg"
                        alt="Microsoft Verified Excel Architecture"
                        className="lumos-cube-photo is--mono"
                      />
                      <div className="lumos-cube-photo-badge">MICROSOFT VERIFIED ARCH</div>
                    </div>
                  </div>

                  {/* RIGHT 3D CUBE: Editorial Manifesto Cards [01 Hariharan] <-> [02 Microsoft] */}
                  <div
                    className={`lumos-3d-cube is--cube-2 interactive ${effProgress >= 0.5 ? 'show-face-2' : ''}`}
                    onMouseEnter={() => setHoveredCube(true)}
                    onMouseLeave={() => setHoveredCube(false)}
                    onClick={() => setCubeFaceOverride(effProgress < 0.5 ? 1 : 0)}
                  >
                    {/* Face 1 (Front): [01] Hariharan */}
                    <div
                      className={`lumos-cube-side is--front is--dark-card ${manualClass}`}
                      style={{
                        transform: `translate3d(0, 0, calc(var(--cube-half) * -1)) rotateX(${cube2Deg}deg) translate3d(0, 0, var(--cube-half))`,
                        opacity: cube2Deg > 88 ? 0 : 1,
                      }}
                    >
                      <img
                        src="/lumos/cube_dark_bg.webp"
                        alt="Card grain"
                        className="lumos-cube-card-bg"
                        draggable={false}
                      />
                      <div className="lumos-cube-card-content">
                        <div className="lumos-cube-left-col">
                          <h3 className="lumos-cube-name">Hariharan</h3>
                        </div>
                        <div className="lumos-cube-right-col">
                          <div className="lumos-cube-top-row">
                            <span className="lumos-cube-role">[architect]</span>
                            <span className="lumos-cube-num">[01]</span>
                          </div>
                          <div className="lumos-cube-quote-wrap">
                            <span className="lumos-cube-letter">[H]</span>
                            <blockquote className="lumos-cube-quote">
                              I architected this all-in-one suite because businesses bleed hours and capital on broken spreadsheets — never on lack of vision.
                            </blockquote>
                          </div>
                          <div className="lumos-cube-bottom-row">
                            <p className="lumos-cube-bio">
                              Lead technical architect with 10+ years engineering 120+ mission-critical financial models, GAAP 3-statement systems, and automated executive BI dashboards.
                            </p>
                            <span className="lumos-cube-arrow">↗</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Face 2 (Bottom): [02] Microsoft Verified */}
                    <div
                      className={`lumos-cube-side is--bottom is--dark-card ${manualClass}`}
                      style={{
                        transform: `translate3d(0, 0, calc(var(--cube-half) * -1)) rotateX(${cube2Deg - 90}deg) translate3d(0, 0, var(--cube-half))`,
                        opacity: cube2Deg < 2 ? 0 : 1,
                      }}
                    >
                      <img
                        src="/lumos/cube_dark_bg.webp"
                        alt="Card grain"
                        className="lumos-cube-card-bg"
                        draggable={false}
                      />
                      <div className="lumos-cube-card-content">
                        <div className="lumos-cube-left-col">
                          <h3 className="lumos-cube-name">Microsoft<br />10+ Yrs</h3>
                        </div>
                        <div className="lumos-cube-right-col">
                          <div className="lumos-cube-top-row">
                            <span className="lumos-cube-role">[certified]</span>
                            <span className="lumos-cube-num">[02]</span>
                          </div>
                          <div className="lumos-cube-quote-wrap">
                            <span className="lumos-cube-letter">[M]</span>
                            <blockquote className="lumos-cube-quote">
                              Official Microsoft Verified Excel Standard — instant plug-and-play clarity built to run cleanly with zero VBA headaches.
                            </blockquote>
                          </div>
                          <div className="lumos-cube-bottom-row">
                            <p className="lumos-cube-bio">
                              Every template inside the ₹199 All-in-One Suite pairs institutional XLOOKUP math with automated slicers and direct 1-on-1 WhatsApp guidance.
                            </p>
                            <span className="lumos-cube-arrow">↗</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Centered Hot-Pink CTA Below Dual Cubes (Matching Lumos Screen Recording Frames 4 & 5!) */}
            <div className="lumos-cube-bottom-cta-wrap">
              <button
                className="lumos-cube-pink-cta interactive"
                onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
              >
                <span>Get All-in-One<br />Suite · {currency === 'INR' ? '₹199' : '$2.49'}!</span>
                <span className="lumos-cta-plus">+</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         6. STORE PAGE SCROLL 5 - "WHAT PEOPLE SAY ABOUT BEX" (3D DEPTH ZOOM REVIEWS - VIDEO FRAMES 8 & 9)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={reviewsRef} id="suite-reviews" className="lumos-reviews-section">
        <div className="lumos-reviews-top-wrap">
          <span className="lumos-scramble-tag">[reviews]</span>
          <div className="lumos-reviews-dividers">
            <div className="lumos-rev-line" />
            <div className="lumos-rev-line" />
            <div className="lumos-rev-line" />
            <div className="lumos-rev-line" />
          </div>

          {/* Matching Video Frame 8 Typography & Cube/Ghost Fade Reveal */}
          <h2 className="lumos-reviews-heading">
            <span className="lumos-review-cube-word ghost-top">What</span><br />
            <span className="lumos-review-cube-word ghost-left">people </span>
            <span className="lumos-review-cube-word solid-black">say about</span><br />
            <span className="lumos-review-cube-word solid-black">BEX</span>
          </h2>
        </div>

        {/* Sticky 3D Perspective Zoom Stage (Matching Video Frame 9) */}
        <div className="lumos-reviews-relative-block">
          <div className="lumos-reviews-sticky-stage">
            <div className="lumos-reviews-cards-grid">
              {SUITE_REVIEWS.map((rev, idx) => {
                const isLeft = idx % 2 === 1
                const progress = Math.min(1, Math.max(0, reviewDepth * 1.15 - idx * 0.14))
                const translateZ = -220 + progress * 260
                const translateX = isLeft ? -progress * 45 : progress * 45
                const radiusMorph = `${6 + Math.round(progress * 18)}px`

                return (
                  <article
                    key={rev.id}
                    className={`lumos-review-card ${isLeft ? 'is-left' : 'is-right'}`}
                    style={{
                      transform: typeof window !== 'undefined' && window.innerWidth >= 768
                        ? `translateX(${translateX}px) translateZ(${translateZ}px) rotate(${isLeft ? -1.5 : 1.5}deg)`
                        : undefined,
                      borderRadius: radiusMorph,
                    }}
                  >
                    <div className="lumos-review-card-top">
                      <img
                        src={rev.image}
                        alt={rev.author}
                        className="lumos-review-photo"
                        loading="lazy"
                      />
                      <div className="lumos-review-quote-col">
                        <div className="lumos-review-bracket-row">
                          <span className="lumos-review-big-bracket">[</span>
                          <h3 className="lumos-review-headline">{rev.quote}</h3>
                        </div>
                        <p className="lumos-review-body">{rev.body}</p>
                        <div className="lumos-review-divider-line" />
                      </div>
                    </div>

                    <div className="lumos-review-card-bottom">
                      <div className="lumos-review-author-wrap">
                        <strong className="lumos-review-author">{rev.author}</strong>
                        <span className="lumos-review-role">{rev.role}</span>
                      </div>
                      <div className="lumos-review-tags">
                        {rev.tags.map((t) => (
                          <span key={t} className="lumos-review-pill">{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Signature Diagonal Hazard Stripes Along Card Bottom */}
                    <div className="lumos-hazard-stripe-tape lumos-review-hazard" />
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         7. STORE PAGE BUY BOX (SINGLE ALL-IN-ONE PRODUCT CLIMAX SECTION)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section className="lumos-buybox-section">
        <div className="lumos-buybox-card">
          <span className="lumos-buybox-pill">⚡ 1 All-in-One Suite · Zero Upsells</span>
          <h2 className="lumos-buybox-heading">
            GET THE SUITE — {currency === 'INR' ? 'Rs 199' : '$2.49'}
          </h2>

          <div className="lumos-buybox-actions">
            <button
              className="lumos-action-btn-primary interactive"
              onClick={() => handleOpenCheckoutModal(PRODUCTS[0])}
            >
              <span>⚡ Buy All-in-One Now</span>
            </button>

            <button
              className="lumos-action-btn-cart interactive"
              onClick={() => addToCart(PRODUCTS[0])}
            >
              <span>+ Add Suite to Cart</span>
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
            1,000+ Templates • 5 Automated Business Pillars • Instant Google Drive • Lifetime Access
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
         8. STORE PAGE FOOTER (INSIDE STORE PAGE) — HELLO BEX WITH MELTING DRIPS!
         ══════════════════════════════════════════════════════════════════════════ */}
      <footer ref={footerRef} className="lumos-footer-section">
        <div className="lumos-footer-statement">
          <span className="lumos-footer-hello">
            HELLO
            {/* Melting SVG Drip on H */}
            <svg className="lumos-footer-letter-drip" style={{ left: '5%', bottom: '-18px' }} viewBox="0 0 24 56">
              <path d="M 6 0 L 18 0 Q 17 26 17 38 C 17 48 15 54 12 54 C 9 54 7 48 7 38 Q 7 26 6 0 Z" />
            </svg>
            {/* Melting SVG Drip on O */}
            <svg className="lumos-footer-letter-drip" style={{ right: '7%', bottom: '-20px' }} viewBox="0 0 24 56">
              <path d="M 6 0 L 18 0 Q 17 28 17 40 C 17 49 15 55 12 55 C 9 55 7 49 7 40 Q 7 28 6 0 Z" />
            </svg>
          </span>

          <span className="lumos-footer-bex">
            BEX
            {/* Melting SVG Drip on B */}
            <svg className="lumos-footer-letter-drip" style={{ left: '10%', bottom: '-20px', fill: '#A6F4E0' }} viewBox="0 0 24 56">
              <path d="M 6 0 L 18 0 Q 17 28 17 41 C 17 50 15 55 12 55 C 9 55 7 50 7 41 Q 7 28 6 0 Z" />
            </svg>
            {/* Melting SVG Drip on X */}
            <svg className="lumos-footer-letter-drip" style={{ right: '11%', bottom: '-22px', fill: '#A6F4E0' }} viewBox="0 0 24 56">
              <path d="M 6 0 L 18 0 Q 17 30 17 42 C 17 51 15 56 12 56 C 9 56 7 51 7 42 Q 7 30 6 0 Z" />
            </svg>
          </span>
        </div>

        {/* 3-Column Meta Grid (Matching Lumos Video Frames 10 & 11) */}
        <div className="lumos-footer-meta-grid">
          <div className="lumos-footer-col-left">
            <a href="#about-suite" onClick={(e) => { e.preventDefault(); tornRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>About Suite</a>
            <a href="#inside-suite" onClick={(e) => { e.preventDefault(); productsRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Inside All-in-One</a>
            <a href="#suite-reviews" onClick={(e) => { e.preventDefault(); reviewsRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Reviews</a>
            <a href="#architect" onClick={(e) => { e.preventDefault(); expertRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Architect</a>
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
              <div>Your cart is empty. Add the All-in-One Suite (₹199) to get started!</div>
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
