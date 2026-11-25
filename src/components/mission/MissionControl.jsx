import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import ScheduleDemoModal from './ScheduleDemoModal'
import '../../styles/missionControl.css'

gsap.registerPlugin(ScrollTrigger)

/* ==========================================================================
   BEX SIGMA TECH — STRATEGIC MISSION PAGE (themessageukraine.obys.agency 1:1)
   Colors ONLY: #FFFFFF | #EAE3D0 | #111111 | #D8CCB0
   Fonts: Anton (Condensed Extra Bold) + Caveat (Handwritten Script) + Inter
   Animations: GSAP + ScrollTrigger (transform + opacity only, continuous motion)
   ========================================================================== */

const SERVICES = [
  {
    num: '01',
    code: 'SRV-01',
    title: 'Enterprise BI & Spreadsheet Master Suites',
    tagline: '1,000+ Business Templates (.xlsx) + Weekend Live Masterclasses',
    badge: 'FLAGSHIP DIVISION · ₹199',
    desc: 'Automated executive spreadsheet architecture built for corporate decision-makers. Includes 10 plug-and-play executive BI dashboards, Power Query 1-Click ETL automation, financial models, and direct weekend cohort training with Microsoft Verified Architect Hariharan.D.',
    specs: ['1,000+ Production Templates', '10 Executive BI Dashboards', 'Power Query 1-Click ETL', 'Weekend Live Masterclasses'],
    actionLabel: 'Launch Product Store (₹199)',
    actionRoute: 'web_dev',
  },
  {
    num: '02',
    code: 'SRV-02',
    title: '3D Spatial Web & 60 FPS WebGL',
    tagline: 'Hardware-Accelerated WebGL, Three.js & Immersive Storytelling',
    badge: '3D SPATIAL WEB · 60 FPS',
    desc: 'High-performance 3D digital experiences that run smoothly at 60 FPS on any modern browser. From interactive 3D product visualizers to cinematic spatial landing pages that captivate enterprise customers and elevate brand authority.',
    specs: ['Three.js & WebGL 60 FPS', 'Draco Mesh Compression', 'Interactive Camera Rigs', 'Silk Shader Dynamics'],
    actionLabel: 'Inspect 3D Architecture',
    actionRoute: 'web_dev',
  },
  {
    num: '03',
    code: 'SRV-03',
    title: 'Custom Enterprise Software & Cloud SaaS',
    tagline: 'Scalable Administrative Portals, Cloud Backends & APIs',
    badge: 'FULL STACK SAAS · APIS',
    desc: 'End-to-end custom business software engineered to match your operational workflow. We build multi-tenant SaaS platforms, administrative command dashboards, secure REST & GraphQL microservices, and automated CI/CD cloud pipelines.',
    specs: ['Bespoke Cloud Portals', 'Automated CI/CD Pipelines', 'PostgreSQL / MongoDB Microservices', 'Enterprise RBAC Security'],
    actionLabel: 'View Software Scope',
    actionRoute: 'apps',
  },
  {
    num: '04',
    code: 'SRV-04',
    title: 'Mobile App Engineering iOS & Android',
    tagline: 'High-Performance React Native & Flutter Mobile Apps',
    badge: 'CROSS-PLATFORM · NATIVE',
    desc: 'Fluid, responsive mobile applications for iOS and Android. Built with offline-first synchronization, real-time push notifications, payment gateway integrations, and published directly to the Apple App Store and Google Play Store.',
    specs: ['React Native & Flutter', 'Offline-First Local DB', 'Real-Time WebSockets', 'App Store & Play Store Setup'],
    actionLabel: 'Request Mobile Build',
    actionRoute: 'apps',
  },
  {
    num: '05',
    code: 'SRV-05',
    title: 'Autonomous AI Pipelines',
    tagline: 'Intelligent Agent Swarms, Document Processing & ETL',
    badge: 'AI AUTOMATION · LLMS',
    desc: 'Eliminate repetitive manual operations. We design and integrate custom AI agent workflows, automated document data extractors, intelligent customer service bots, and automated ETL pipelines powered by Gemini and Claude.',
    specs: ['LLM Agent Workflows', 'Automated Document OCR & ETL', 'Gemini & Claude Integrations', 'Real-Time Alert Webhooks'],
    actionLabel: 'Explore AI Pipelines',
    actionMailto: true,
  },
  {
    num: '06',
    code: 'SRV-06',
    title: 'Bespoke R&D Pod',
    tagline: 'Turn Your Breakthrough Concept Into a Working MVP in < 48 Hours',
    badge: 'BESPOKE INNOVATION · 100% IP',
    desc: 'Have an ambitious idea or uncharted digital vision? Our elite engineering pod builds and deploys custom interactive prototypes and production-ready MVPs with weekly milestone demos and 100% intellectual property ownership transfer.',
    specs: ['Dedicated Engineering Pod', 'Weekly Milestone Demos', '< 48h Rapid MVP Sprint', '100% Full IP Transfer'],
    actionLabel: 'Initiate Bespoke Project',
    actionMailto: true,
  },
]

const WHY_CHOOSE_US = [
  {
    number: '01',
    title: '100% Source Code IP Ownership',
    badge: 'ZERO LOCK-IN',
    desc: 'You own 100% of the intellectual property, design assets, and source code upon completion. No hidden royalties, no forced dependencies.',
  },
  {
    number: '02',
    title: 'Direct Line with Lead Architect',
    badge: 'ZERO MIDDLEMEN',
    desc: 'You work directly with Founder & Chief Architect Hariharan.D — not junior account managers or offshore support tickets. Clear technical execution.',
  },
  {
    number: '03',
    title: 'Unmatched Value & Accessible Pricing',
    badge: 'MAXIMUM ROI',
    desc: 'Our flagship aIn Excel Master Suite provides 1,000+ enterprise templates and live training for just ₹199, and our custom software builds deliver agency-grade quality at accessible startup rates.',
  },
]

const GLOBAL_NODES = [
  { city: 'Bengaluru (HQ)', country: 'India', role: 'Architecture Mainframe & Core Pod', status: 'ONLINE', latency: '12MS' },
  { city: 'Silicon Valley', country: 'USA', role: 'Cloud Infrastructure & Scale Nodes', status: 'ONLINE', latency: '48MS' },
  { city: 'London', country: 'UK', role: 'Financial Modeling & BI Strategy', status: 'ONLINE', latency: '34MS' },
  { city: 'Tokyo', country: 'Japan', role: 'Spatial Web & Low-Latency R&D', status: 'ONLINE', latency: '28MS' },
]

const ARCHIVE_PHOTOS = [
  { src: '/ain_excel_pack.jpg', code: '01 / BI', label: '1000+ TEMPLATES', dir: 'left' },
  { src: '/sector_3d_website.jpg', code: '02 / 3D', label: '60 FPS WEBGL', dir: 'left' },
  { src: '/sector_software.jpg', code: '03 / SAAS', label: 'CLOUD SYSTEMS', dir: 'right' },
  { src: '/sector_ai_automation.jpg', code: '04 / AI', label: 'AUTONOMOUS PODS', dir: 'right' },
]

const COUNTER_COLUMNS = [
  { value: '1000+', label: 'Production Templates' },
  { value: '<48H', label: 'Rapid MVP Turnaround' },
  { value: '500+', label: 'Engineers & Leaders' },
  { value: '100%', label: 'Source Code IP' },
]

const FALLING_STACK = [
  { code: 'XLS', sub: 'EXCEL', targetX: -6, targetY: 122, rot: -12 },
  { code: 'RCT', sub: 'REACT', targetX: 4, targetY: 112, rot: 8 },
  { code: 'AI', sub: 'AGENTS', targetX: -2, targetY: 104, rot: -6 },
  { code: '3D', sub: 'WEBGL', targetX: 8, targetY: 116, rot: 11 },
  { code: 'API', sub: 'CLOUD', targetX: -8, targetY: 124, rot: -9 },
]

const BirdSvg = () => (
  <svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true">
    <path d="M2 18c10-10 21-8 29 1 7-11 20-15 31-7-11-1-19 4-25 13 6 3 11 7 15 13-9-5-16-6-23-3-7 3-14 4-21-1 6-2 10-5 13-9-6-3-12-4-19-7z" />
  </svg>
)

export default function MissionControl() {
  const { closeMissionBriefing, navigateToSector } = useStore()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('top')
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [expandedService, setExpandedService] = useState('01')

  const overlayRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const splitRightRef = useRef(null)
  const splitSectionRef = useRef(null)

  useEffect(() => {
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  // GSAP + ScrollTrigger Motion Engine (transform + opacity only, scoped to Mission scroller)
  useEffect(() => {
    const scroller = scrollContainerRef.current
    const root = overlayRef.current
    if (!scroller || !root) return

    const ctx = gsap.context(() => {
      // 1. Hero Line-by-Line Reveal (0.8s) + Portrait Fade (1s) + Subtle Idle Motion (< 2s visible)
      gsap.fromTo(
        '.mc-hero-line',
        { y: 88, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      )

      gsap.fromTo(
        '.mc-hero-portrait-frame',
        { opacity: 0, y: 24, scale: 0.96, rotation: -3 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 1.0,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to('.mc-hero-portrait-frame', {
              y: -8,
              rotation: 1.2,
              duration: 3.2,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            })
          },
        }
      )

      // 2. Marquee Continuous Loop (20s linear horizontal scroll, transform only, never stops)
      gsap.to('.mc-marquee-track', {
        xPercent: -50,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })

      // 3. Flying Birds Continuous Loop Across Viewport (visible within 1s)
      gsap.utils.toArray('.mc-bird').forEach((bird, idx) => {
        const dur = 11 + idx * 3.5
        const delay = idx * 1.1
        gsap.set(bird, { x: -120, y: 0, opacity: 0.85, rotation: -6 })

        const tl = gsap.timeline({ repeat: -1, delay })
        tl.to(bird, {
          x: window.innerWidth + 240,
          y: idx % 2 === 0 ? -45 : 38,
          rotation: idx % 2 === 0 ? 5 : -8,
          duration: dur,
          ease: 'none',
        })

        // Continuous wingbeat scaleY pulse
        gsap.to(bird, {
          scaleY: 0.62,
          scaleX: 1.08,
          duration: 0.36 + idx * 0.06,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })

      // 4. Falling Icons Loop into System Bowl (0:23 Reference: gravity + bounce, stagger 0.2s, infinite)
      const fallTl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 })
      FALLING_STACK.forEach((item, i) => {
        const sel = `.mc-falling-icon--${i + 1}`
        fallTl.fromTo(
          sel,
          { y: -85, x: item.targetX, rotation: item.rot * 2, opacity: 0 },
          {
            y: item.targetY,
            x: item.targetX,
            rotation: item.rot,
            opacity: 1,
            duration: 1.05,
            ease: 'bounce.out',
          },
          i * 0.2
        )
      })
      fallTl.to(
        '.mc-falling-icon',
        { opacity: 0, y: '+=18', duration: 0.35, stagger: 0.05, ease: 'power2.in' },
        '+=1.4'
      )

      // 5. Black Section Scale Numbers (0.5 -> 1.2) + Continuous Subtle Breathe
      gsap.fromTo(
        '.mc-counter-scale-num',
        { scale: 0.5, opacity: 0.25 },
        {
          scale: 1.2,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.mc-black-section',
            scroller,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.6,
          },
        }
      )

      // 6. 4 B&W Photos Fly In From Sides (rotate -10deg -> 0deg)
      gsap.utils.toArray('.mc-flying-photo-card').forEach((card, i) => {
        const fromLeft = i < 2
        gsap.fromTo(
          card,
          {
            x: fromLeft ? -160 : 160,
            rotation: fromLeft ? -10 : 10,
            opacity: 0,
          },
          {
            x: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.mc-flying-photos-grid',
              scroller,
              start: 'top 92%',
              end: 'top 42%',
              scrub: 0.65,
            },
          }
        )
      })

      // 7. Split Scroll Parallax Speed Difference (Left Sticky, Right Parallax Velocity)
      if (splitRightRef.current && splitSectionRef.current) {
        gsap.fromTo(
          splitRightRef.current,
          { y: 40 },
          {
            y: -36,
            ease: 'none',
            scrollTrigger: {
              trigger: splitSectionRef.current,
              scroller,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // 8. Why BEX Cards & Mainframe Boxes Entrance
      gsap.fromTo(
        '.mc-why-card-box',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mc-why-grid-3',
            scroller,
            start: 'top 88%',
          },
        }
      )

      gsap.fromTo(
        '.mc-node-box',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mc-nodes-grid-4',
            scroller,
            start: 'top 90%',
          },
        }
      )

      ScrollTrigger.refresh()
    }, overlayRef)

    return () => ctx.revert()
  }, [])

  const handleNavigate = (sectorId) => {
    cinemaAudio.playSectorTransition?.()
    navigateToSector(sectorId)
  }

  const handleClose = () => {
    cinemaAudio.playSectorTransition?.()
    closeMissionBriefing()
  }

  const scrollToSection = (id) => {
    cinemaAudio.playBeep?.()
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element && scrollContainerRef.current) {
      const containerTop = scrollContainerRef.current.getBoundingClientRect().top
      const elTop = element.getBoundingClientRect().top
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollTop + (elTop - containerTop) - 54,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div ref={overlayRef} className={`mc-editorial-overlay ${mounted ? 'mc-mounted' : ''}`}>
      {/* Static Paper Grain Overlay */}
      <div className="mc-grain-overlay" />

      {/* Continuous Flying Birds Layer */}
      <div className="mc-birds-layer" aria-hidden="true">
        <div className="mc-bird mc-bird--1"><BirdSvg /></div>
        <div className="mc-bird mc-bird--2"><BirdSvg /></div>
        <div className="mc-bird mc-bird--3"><BirdSvg /></div>
      </div>

      {/* Scrollable Obys Editorial Container */}
      <div className="mc-editorial-scroll" ref={scrollContainerRef}>
        {/* ── TOP STICKY 50/50 NAV BAR ── */}
        <header className="mc-obys-topbar">
          <div className="mc-topbar-left">
            <button
              type="button"
              className="mc-brand-mark interactive"
              onClick={() => scrollToSection('top')}
            >
              σ BEX SIGMA TECH
            </button>

            <nav className="mc-nav-mini-links">
              <button
                type="button"
                className={`mc-nav-mini-btn interactive ${activeTab === 'divisions' ? 'active' : ''}`}
                onClick={() => scrollToSection('divisions')}
              >
                DIVISIONS
              </button>
              <button
                type="button"
                className={`mc-nav-mini-btn interactive ${activeTab === 'why' ? 'active' : ''}`}
                onClick={() => scrollToSection('why')}
              >
                WHY BEX
              </button>
              <button
                type="button"
                className={`mc-nav-mini-btn interactive ${activeTab === 'nodes' ? 'active' : ''}`}
                onClick={() => scrollToSection('nodes')}
              >
                NODES
              </button>
            </nav>
          </div>

          <div className="mc-topbar-right">
            <div className="mc-cities-nav">
              {['Bengaluru', 'Silicon Valley', 'London', 'Tokyo'].map((city, idx) => (
                <React.Fragment key={city}>
                  {idx > 0 && <span className="mc-city-sep">|</span>}
                  <button
                    type="button"
                    className="mc-city-link interactive"
                    onClick={() => scrollToSection('nodes')}
                  >
                    {city}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <div className="mc-topbar-actions">
              <button
                type="button"
                className="mc-btn-call-top interactive"
                onClick={() => setDemoModalOpen(true)}
              >
                BOOK A CALL
              </button>
              <button
                type="button"
                className="mc-btn-close-top interactive"
                onClick={handleClose}
                title="Return to Headquarters"
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        <div id="top" />

        {/* ── SECTION 1: 50/50 SPLIT HERO (100vh) ── */}
        <section className="mc-obys-hero">
          {/* Left 50% White #FFFFFF */}
          <div className="mc-hero-left-white">
            <div>
              <span className="mc-kicker-label">
                MISSION ARCHITECTURE · HARIHARAN.D · MICROSOFT VERIFIED
              </span>

              <h1 className="mc-display-mega" style={{ marginTop: '22px' }}>
                <span className="mc-line-mask">
                  <span className="mc-hero-line">BUILD</span>
                </span>
                <span className="mc-line-mask">
                  <span className="mc-hero-line">PRODUCTION</span>
                </span>
                <span className="mc-line-mask">
                  <span className="mc-hero-line">
                    SYSTEMS. <span className="mc-script-overlap mc-script-overlap--shift">CHANGE</span>
                  </span>
                </span>
                <span className="mc-line-mask">
                  <span className="mc-hero-line">YOUR BUSINESS.</span>
                </span>
                <span className="mc-line-mask">
                  <span className="mc-hero-line" style={{ marginTop: '-0.12em' }}>
                    <span className="mc-script-overlap">TODAY.</span>
                  </span>
                </span>
              </h1>
            </div>

            <div>
              <div className="mc-hero-actions">
                <button
                  type="button"
                  className="mc-btn-solid interactive"
                  onClick={() => setDemoModalOpen(true)}
                >
                  Schedule Direct Briefing →
                </button>
                <a
                  href="https://wa.me/919361657929?text=Hi%20Hariharan,%20I%20would%20like%20to%20discuss%20a%20project%20with%20BEx%20Sigma%20Tech."
                  target="_blank"
                  rel="noreferrer"
                  className="mc-btn-outline interactive"
                >
                  WhatsApp Quick Chat
                </a>
                <button
                  type="button"
                  className="mc-btn-outline interactive"
                  onClick={() => handleNavigate('web_dev')}
                >
                  Store · ₹199
                </button>
              </div>
            </div>
          </div>

          {/* Right 50% Beige #EAE3D0 */}
          <div className="mc-hero-right-beige">
            <div className="mc-hero-sub-bar">
              <span>Bengaluru · Silicon Valley · London · Tokyo</span>
              <span>ARCHIVE / 01</span>
            </div>

            <div className="mc-hero-photo-stage">
              <div className="mc-photo-torn-wrap mc-hero-portrait-frame">
                <img
                  src="/ceo_hariharan.jpg"
                  alt="Hariharan.D — Chief Architect"
                  className="mc-photo-sepia"
                />
                <div className="mc-photo-halftone-caption">
                  <span>HARIHARAN.D</span>
                  <span>LEAD ARCHITECT</span>
                </div>
              </div>
            </div>

            <div className="mc-hero-stats-grid">
              <div className="mc-hero-stat-cell">
                <span className="mc-hero-stat-num">1000+</span>
                <span className="mc-hero-stat-lbl">Production Templates</span>
              </div>
              <div className="mc-hero-stat-cell">
                <span className="mc-hero-stat-num">&lt;48h</span>
                <span className="mc-hero-stat-lbl">Rapid MVP Turnaround</span>
              </div>
              <div className="mc-hero-stat-cell">
                <span className="mc-hero-stat-num">500+</span>
                <span className="mc-hero-stat-lbl">Engineers</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTINUOUS MARQUEE BAND (20s LOOP, NEVER STOPS) ── */}
        <div className="mc-marquee-band" aria-hidden="true">
          <div className="mc-marquee-track">
            {Array.from({ length: 8 }).map((_, idx) => (
              <span key={idx} className="mc-marquee-item">
                BEX <span className="mc-marquee-script">PRODUCTION</span> SYSTEMS ·
              </span>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: BLACK ARCHIVE (#111111 + #D8CCB0 NUMBERS 0.5 -> 1.2 + 4 FLYING PHOTOS) ── */}
        <section className="mc-black-section">
          <div className="mc-counter-columns">
            {COUNTER_COLUMNS.map((item, idx) => (
              <div key={idx} className="mc-counter-col">
                <span className="mc-kicker-label mc-kicker-label--beige">0{idx + 1}</span>
                <span className="mc-counter-scale-num">{item.value}</span>
                <span className="mc-counter-col-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mc-black-headline-wrap">
            <span className="mc-kicker-label mc-kicker-label--beige" style={{ marginBottom: '16px' }}>
              OPERATIONAL PHILOSOPHY
            </span>
            <h2 className="mc-display-mega mc-display-mega--beige">
              NOT JUST <span className="mc-script-overlap mc-script-overlap--beige">CODE.</span>
              <br />
              A WHOLE <span className="mc-script-overlap mc-script-overlap--beige">ARCHITECTURE.</span>
            </h2>
          </div>

          <div className="mc-flying-photos-grid">
            {ARCHIVE_PHOTOS.map((photo, idx) => (
              <div key={idx} className="mc-flying-photo-card mc-photo-torn-wrap">
                <img src={photo.src} alt={photo.label} />
                <div className="mc-flying-photo-meta">
                  <span>{photo.code}</span>
                  <span>{photo.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: SPLIT SCROLL (LEFT STICKY + 0:23 FALLING ICONS, RIGHT DIVISIONS 01-06) ── */}
        <section id="divisions" ref={splitSectionRef} className="mc-split-scroll-section">
          {/* Left Sticky White Column */}
          <div className="mc-split-sticky-left">
            <div className="mc-sticky-inner">
              <div>
                <span className="mc-kicker-label">DIVISIONS 01 — 06 · SPLIT ARCHITECTURE</span>
                <h2 className="mc-display-mega" style={{ marginTop: '16px' }}>
                  OUR
                  <br />
                  CORE <span className="mc-script-overlap mc-script-overlap--shift">DIVISIONS</span>
                </h2>
                <p className="mc-sticky-lead-p">
                  Automated BI templates, 60 FPS WebGL environments, cloud SaaS portals, mobile builds, AI pipelines, and dedicated rapid R&amp;D pods engineered under one roof.
                </p>
              </div>

              {/* 0:23 Obys Falling Icons Into Vessel */}
              <div className="mc-falling-bowl-stage">
                <div className="mc-falling-stage-label">
                  <span>LIVE STACK ASSEMBLY</span>
                  <span>INFINITE LOOP</span>
                </div>

                {FALLING_STACK.map((item, idx) => (
                  <div key={item.code} className={`mc-falling-icon mc-falling-icon--${idx + 1}`}>
                    <span className="mc-falling-icon-code">{item.code}</span>
                    <span className="mc-falling-icon-sub">{item.sub}</span>
                  </div>
                ))}

                <div className="mc-bowl-vessel">
                  <svg className="mc-bowl-svg" viewBox="0 0 320 96" fill="none" aria-hidden="true">
                    <path
                      d="M12 10 H308 C302 62 248 88 160 88 C72 88 18 62 12 10 Z"
                      fill="#FFFFFF"
                      stroke="#111111"
                      strokeWidth="2"
                    />
                    <path d="M24 24 H296" stroke="#111111" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M52 52 H268" stroke="#111111" strokeWidth="1" opacity="0.4" />
                  </svg>
                  <span className="mc-bowl-caption">EXCEL · REACT · AI · 3D · CLOUD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Beige Column (Independent Parallax Speed + 01-06 Accordion) */}
          <div className="mc-split-scroll-right">
            <div ref={splitRightRef} className="mc-divisions-list">
              {SERVICES.map((srv) => {
                const isExpanded = expandedService === srv.num
                return (
                  <div
                    key={srv.num}
                    className={`mc-division-row ${isExpanded ? 'is-expanded' : ''}`}
                    onClick={() => setExpandedService(isExpanded ? '' : srv.num)}
                  >
                    <div className="mc-division-head">
                      <span className="mc-division-num">{srv.num}</span>
                      <div className="mc-division-meta">
                        <span className="mc-division-badge">{srv.code} // {srv.badge}</span>
                        <h3 className="mc-division-title">{srv.title}</h3>
                        <p className="mc-division-tagline">{srv.tagline}</p>
                      </div>
                      <span className="mc-division-toggle">{isExpanded ? '−' : '+'}</span>
                    </div>

                    {isExpanded && (
                      <div className="mc-division-body">
                        <p className="mc-division-desc">{srv.desc}</p>

                        <div className="mc-division-specs">
                          {srv.specs.map((spec, sIdx) => (
                            <div key={sIdx} className="mc-division-spec-cell">
                              {spec}
                            </div>
                          ))}
                        </div>

                        <div className="mc-division-actions">
                          {srv.actionMailto ? (
                            <a
                              href={`mailto:bexsigmatech@gmail.com?subject=${encodeURIComponent(srv.title + ' - Project Inquiry')}&body=Hi%20BEx%20Sigma%20Tech%20Pod,%0A%0AI%20am%20interested%20in%20your%20services%20for%20${encodeURIComponent(srv.title)}.`}
                              className="mc-btn-solid interactive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {srv.actionLabel} →
                            </a>
                          ) : (
                            <button
                              type="button"
                              className="mc-btn-solid interactive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleNavigate(srv.actionRoute)
                              }}
                            >
                              {srv.actionLabel} →
                            </button>
                          )}

                          <button
                            type="button"
                            className="mc-btn-outline interactive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDemoModalOpen(true)
                            }}
                          >
                            Request Consultation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: WHY WORK WITH BEX SIGMA TECH? (3 CARDS) ── */}
        <section id="why" className="mc-why-obys-section">
          <div className="mc-why-header">
            <span className="mc-kicker-label" style={{ marginBottom: '14px' }}>
              THE BEX STANDARD · 03 GUARANTEES
            </span>
            <h2 className="mc-display-mega">
              WHY WORK <span className="mc-script-overlap">WITH</span>
              <br />
              BEX SIGMA TECH?
            </h2>
          </div>

          <div className="mc-why-grid-3">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.number} className="mc-why-card-box">
                <div className="mc-why-card-top-row">
                  <span className="mc-why-num">{item.number}</span>
                  <span className="mc-why-tag">{item.badge}</span>
                </div>
                <h3 className="mc-why-card-h3">{item.title}</h3>
                <p className="mc-why-card-p">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: WORLDWIDE STRATEGIC MAINFRAME (4 BOXES ONLY, NO GALLERY) ── */}
        <section id="nodes" className="mc-nodes-obys-section">
          <div className="mc-nodes-obys-head">
            <div>
              <span className="mc-kicker-label mc-kicker-label--beige" style={{ marginBottom: '12px' }}>
                GLOBAL TELEMETRY · 04 ACTIVE CLUSTERS
              </span>
              <h2 className="mc-display-mega mc-display-mega--beige">
                WORLDWIDE STRATEGIC <span className="mc-script-overlap mc-script-overlap--beige">MAINFRAME</span>
              </h2>
            </div>
            <span className="mc-kicker-label mc-kicker-label--beige">
              ● 4 NODES ONLINE · 99.98% UPTIME
            </span>
          </div>

          <div className="mc-nodes-grid-4">
            {GLOBAL_NODES.map((node) => (
              <div key={node.city} className="mc-node-box">
                <div className="mc-node-box-top">
                  <span>{node.country}</span>
                  <span>{node.latency}</span>
                </div>
                <div>
                  <h3 className="mc-node-city-name">{node.city}</h3>
                  <p style={{ fontSize: '13px', margin: '10px 0 0', opacity: 0.85 }}>{node.role}</p>
                </div>
                <div className="mc-node-box-foot">
                  <span>STATUS</span>
                  <span>{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: FINAL CTA (STEP INTO THE FUTURE + BOOK A CALL ₹199) ── */}
        <section className="mc-cta-obys-section">
          <div className="mc-cta-left">
            <span className="mc-kicker-label">DIRECT ARCHITECTURAL DISPATCH</span>
            <h2 className="mc-display-mega">
              STEP INTO <span className="mc-script-overlap">THE FUTURE</span>
              <br />
              WITH BEX SIGMA TECH
            </h2>
          </div>

          <div className="mc-cta-right">
            <span className="mc-kicker-label">FLAGSHIP ACCESS · INSTANT BRIEFING</span>
            <p style={{ fontSize: '14px', lineHeight: 1.6, margin: 0, color: '#111111' }}>
              Launch the aIn Excel Master Suite (₹199) with 1,000+ production templates or book an architectural session directly with Hariharan.D.
            </p>
            <div className="mc-cta-actions-stack">
              <button
                type="button"
                className="mc-btn-solid interactive"
                onClick={() => setDemoModalOpen(true)}
              >
                BOOK A CALL (₹199) →
              </button>
              <button
                type="button"
                className="mc-btn-outline interactive"
                onClick={() => handleNavigate('web_dev')}
              >
                Explore Master Suite (₹199)
              </button>
              <a
                href="https://wa.me/919361657929?text=Hi%20BEx%20Sigma%20Tech,%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noreferrer"
                className="mc-btn-outline interactive"
              >
                WhatsApp Quick Chat
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ── SCHEDULE / BOOK A CALL MODAL (Unchanged External Component) ── */}
      <ScheduleDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  )
}
