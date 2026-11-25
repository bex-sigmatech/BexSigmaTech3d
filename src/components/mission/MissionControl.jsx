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
   BEX SIGMA TECH — MISSION PAGE (themessageukraine.obys.agency 1:1)
   Colors ONLY: #FFFFFF | #EAE3D0 | #111111 | #D8CCB0
   Fonts: Anton (Condensed Extra Bold) + Caveat (Handwritten Script) + Inter
   Animations: GSAP + ScrollTrigger (transform + opacity only, continuous motion)
   NO birds / NO crow animations.
   ========================================================================== */

const BUILD_SERVICES = [
  {
    num: '01',
    title: 'Website Development',
    summary: 'Modern, Animated, 3D Websites, 60 FPS, Fast Loading',
    details: 'High-speed responsive websites built with clean architecture, interactive motion, and zero layout bloat.',
    route: 'web_dev',
  },
  {
    num: '02',
    title: 'App Development',
    summary: 'iOS & Android Apps, Clean UI, Smooth Animation',
    details: 'Native-feel mobile applications engineered for smooth gestures, offline reliability, and app store deployment.',
    route: 'apps',
  },
  {
    num: '03',
    title: 'Software Development',
    summary: 'Custom Software, Cloud Software, Business Tools',
    details: 'Tailored portals, cloud APIs, and internal automation systems built directly for your operational workflow.',
    route: 'apps',
  },
  {
    num: '04',
    title: '3D & Animated Websites',
    summary: '3D WebGL, Animated Landing Pages, Interactive Sites',
    details: 'Hardware-accelerated Three.js scenes, scroll-linked GSAP choreography, and 60 FPS visual storytelling.',
    route: 'web_dev',
  },
]

const COURSES = [
  {
    num: '01',
    tag: 'LIVE + PRACTICAL',
    title: 'EXCEL COURSE',
    desc: 'From Basics to Advanced, Dashboard, Automation, Job Ready',
  },
  {
    num: '02',
    tag: 'CAREER TRACK',
    title: 'DSA COURSE',
    desc: 'Data Structures & Algorithms, Interview Ready, Coding Practice',
  },
]

const DASHBOARD_PREVIEWS = [
  { src: '/sales_dashboard.jpg', code: '01 / SALES', label: 'SALES DASHBOARD' },
  { src: '/financial_trend.jpg', code: '02 / FINANCE', label: 'FINANCE TRACKER' },
  { src: '/hr_kpi.jpg', code: '03 / HR', label: 'HR KPI SUITE' },
  { src: '/ain_excel_pack.jpg', code: '04 / INVENTORY', label: 'INVENTORY SHEET' },
]

const MARKETING_CARDS = [
  {
    num: '01',
    tag: 'GROWTH',
    title: 'Digital Marketing',
    desc: 'Instagram, Ads, SEO, Branding',
  },
  {
    num: '02',
    tag: 'POST-PRODUCTION',
    title: 'Video Editing',
    desc: 'Reels, Ads, YouTube, Cinematic Edit',
  },
  {
    num: '03',
    tag: 'PRODUCTION',
    title: 'Shooting',
    desc: 'Product Shoot, Business Shoot, Event Shoot',
  },
]

const STUDIO_SHOWCASE_PHOTOS = [
  { src: '/sector_website.jpg', code: '01 / WEB', label: 'WEBSITE SYSTEMS' },
  { src: '/sector_application.jpg', code: '02 / APP', label: 'MOBILE APPS' },
  { src: '/sector_software.jpg', code: '03 / CLOUD', label: 'CUSTOM SOFTWARE' },
  { src: '/sector_3d_website.jpg', code: '04 / 3D', label: '3D EXPERIENCES' },
]

const BLACK_SCALE_NUMBERS = [
  { value: '01', label: 'Website Development' },
  { value: '02', label: 'App Development' },
  { value: '03', label: 'Software Systems' },
  { value: '04', label: '60 FPS & 3D Web' },
]

const STACKED_POLAROID_CARDS = [
  { src: '/sector_website.jpg', label: '01 · WEBSITE SYSTEMS', rot: -10, x: -18, y: -12 },
  { src: '/sector_application.jpg', label: '02 · MOBILE APPS', rot: 7, x: 22, y: 10 },
  { src: '/sector_software.jpg', label: '03 · CUSTOM SOFTWARE', rot: -5, x: -10, y: 18 },
  { src: '/sector_3d_website.jpg', label: '04 · 3D & ANIMATED', rot: 2, x: 8, y: 4 },
]

const QUADRANT_TILES = [
  { id: '01', title: 'WEBSITE', sub: 'MODERN · 3D · 60 FPS', sticker: '/sector_website.jpg' },
  { id: '02', title: 'APPS', sub: 'IOS & ANDROID · SMOOTH', sticker: '/sector_application.jpg' },
  { id: '03', title: 'SOFTWARE', sub: 'CLOUD · CUSTOM TOOLS', sticker: '/sector_software.jpg' },
  { id: '04', title: 'COURSES', sub: 'EXCEL & DSA · JOB READY', sticker: '/ain_excel_pack.jpg' },
]

const FALLING_ICONS = [
  { code: 'XLS', sub: 'EXCEL', targetX: -6, targetY: 120, rot: -12 },
  { code: 'WEB', sub: 'WEBSITE', targetX: 4, targetY: 110, rot: 8 },
  { code: 'APP', sub: 'APPS', targetX: -2, targetY: 104, rot: -6 },
  { code: '3D', sub: 'WEBGL', targetX: 6, targetY: 116, rot: 11 },
  { code: 'DEV', sub: 'SOFTWARE', targetX: -8, targetY: 122, rot: -9 },
]

const TOP_NAV_ITEMS = [
  { label: 'Website', target: 'services' },
  { label: 'Apps', target: 'services' },
  { label: 'Software', target: 'services' },
  { label: 'Courses', target: 'courses' },
]

export default function MissionControl() {
  const { closeMissionBriefing, navigateToSector } = useStore()
  const [mounted, setMounted] = useState(false)
  const [activeNav, setActiveNav] = useState('services')
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [expandedService, setExpandedService] = useState('01')
  const [activeQuadIdx, setActiveQuadIdx] = useState(0)

  const overlayRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const splitRightRef = useRef(null)
  const splitSectionRef = useRef(null)
  const obysShowcaseRef = useRef(null)

  useEffect(() => {
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  // GSAP + ScrollTrigger Engine (transform + opacity only, immediate + looping motion)
  useEffect(() => {
    const scroller = scrollContainerRef.current
    const root = overlayRef.current
    if (!scroller || !root) return

    const ctx = gsap.context(() => {
      // 1. Hero Line-by-Line Reveal (0.8s) + Team Photo Fade (1s) + Subtle Idle Breathe
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
              duration: 3.0,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            })
          },
        }
      )

      // 2. Marquee Continuous RIGHT-TO-LEFT Loop (20s linear, never stops)
      gsap.fromTo(
        '.mc-marquee-track',
        { xPercent: 0 },
        {
          xPercent: -50,
          duration: 20,
          repeat: -1,
          ease: 'none',
        }
      )

      // 3B. Obys Stacked Polaroid Collage (00:03 -> 00:05 cards fly in and pile atop each other on sticky left)
      if (obysShowcaseRef.current) {
        STACKED_POLAROID_CARDS.forEach((card, i) => {
          const sel = `.mc-stack-card--${i + 1}`
          const fromLeft = i % 2 === 0
          gsap.fromTo(
            sel,
            {
              x: fromLeft ? -220 : 220,
              y: -140 - i * 40,
              rotation: fromLeft ? -24 : 22,
              scale: 0.84,
              opacity: 0,
            },
            {
              x: card.x,
              y: card.y,
              rotation: card.rot,
              scale: 1,
              opacity: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: obysShowcaseRef.current,
                scroller,
                start: `${i * 18}% 78%`,
                end: `${i * 18 + 26}% 42%`,
                scrub: 0.7,
              },
            }
          )
        })

        // Poetic Manifesto lines slide up inside right scrolling stage
        gsap.fromTo(
          '.mc-obys-poetic-line',
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.14,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.mc-obys-poetic-wrap',
              scroller,
              start: 'top 85%',
            },
          }
        )

        // 2x2 Quadrant tiles reveal + cycle active cutout sticker on scroll
        gsap.fromTo(
          '.mc-quad-tile',
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.mc-quad-grid',
              scroller,
              start: 'top 85%',
              onEnter: () => setActiveQuadIdx(2),
            },
          }
        )

        // Torn-paper halftone ridge contour parallax rise into Black section (00:06 -> 00:07)
        gsap.fromTo(
          '.mc-ridge-layer--back',
          { y: 55 },
          {
            y: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: '.mc-ridge-transition',
              scroller,
              start: 'top bottom',
              end: 'bottom 35%',
              scrub: true,
            },
          }
        )
        gsap.fromTo(
          '.mc-ridge-layer--front',
          { y: 85 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.mc-ridge-transition',
              scroller,
              start: 'top bottom',
              end: 'bottom 35%',
              scrub: true,
            },
          }
        )
      }

      // 3B. Animated wavy steam risers above bowl (00:08)
      gsap.utils.toArray('.mc-steam-path').forEach((line, i) => {
        gsap.fromTo(
          line,
          { y: 12, opacity: 0.15, scaleY: 0.85 },
          {
            y: -14,
            opacity: 0.75,
            scaleY: 1.12,
            duration: 1.5 + i * 0.25,
            repeat: -1,
            yoyo: true,
            delay: i * 0.35,
            ease: 'sine.inOut',
          }
        )
      })

      // 3C. Circular Medallions Reveal (00:10)
      gsap.fromTo(
        '.mc-circle-node',
        { scale: 0.72, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mc-circles-row',
            scroller,
            start: 'top 90%',
          },
        }
      )

      // 3. Falling Icons (Excel / Website / App) Gravity + Bounce Loop (stagger 0.2s, infinite)
      const fallTl = gsap.timeline({ repeat: -1, repeatDelay: 0.85 })
      FALLING_ICONS.forEach((item, i) => {
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
        { opacity: 0, y: '+=16', duration: 0.35, stagger: 0.05, ease: 'power2.in' },
        '+=1.4'
      )

      // 4. Black Section Huge Beige Numbers Scale 0.5 -> 1.2
      gsap.fromTo(
        '.mc-counter-scale-num',
        { scale: 0.5, opacity: 0.3 },
        {
          scale: 1.2,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.mc-black-section',
            scroller,
            start: 'top 88%',
            end: 'top 30%',
            scrub: 0.6,
          },
        }
      )

      // 5. Photos Fly In From Sides (rotate -10deg -> 0deg)
      gsap.utils.toArray('.mc-fly-card').forEach((card, i) => {
        const fromLeft = i % 2 === 0
        gsap.fromTo(
          card,
          {
            x: fromLeft ? -140 : 140,
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
              trigger: card,
              scroller,
              start: 'top 94%',
              end: 'top 52%',
              scrub: 0.65,
            },
          }
        )
      })

      // 6. Split Scroll Speed Difference (Left Sticky, Right Parallax Velocity)
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

      // 7. Courses & Marketing Cards Reveal
      gsap.fromTo(
        '.mc-course-big-card',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mc-courses-grid-2',
            scroller,
            start: 'top 90%',
          },
        }
      )

      gsap.fromTo(
        '.mc-marketing-card',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.mc-marketing-grid-3',
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
    setActiveNav(id)
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

            <div className="mc-top-links">
              <button
                type="button"
                className={`mc-top-link-btn interactive ${activeNav === 'manager' ? 'active' : ''}`}
                onClick={() => scrollToSection('manager')}
              >
                Manager
              </button>
              <span className="mc-nav-sep">|</span>
              <button
                type="button"
                className={`mc-top-link-btn interactive ${activeNav === 'dashboard' ? 'active' : ''}`}
                onClick={() => scrollToSection('dashboard')}
              >
                Dashboards
              </button>
              <span className="mc-nav-sep">|</span>
              <button
                type="button"
                className={`mc-top-link-btn interactive ${activeNav === 'marketing' ? 'active' : ''}`}
                onClick={() => scrollToSection('marketing')}
              >
                Marketing
              </button>
            </div>
          </div>

          <div className="mc-topbar-right">
            <nav className="mc-top-links">
              {TOP_NAV_ITEMS.map((item, idx) => (
                <React.Fragment key={item.label}>
                  {idx > 0 && <span className="mc-nav-sep">|</span>}
                  <button
                    type="button"
                    className="mc-top-link-btn interactive"
                    onClick={() => scrollToSection(item.target)}
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </nav>

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

        {/* ── 1. HERO - WHO WE ARE (50/50 SPLIT, 100vh) ── */}
        <section className="mc-obys-hero">
          {/* Left 50% White #FFFFFF */}
          <div className="mc-hero-left-white">
            <div>
              <span className="mc-kicker-label">BEX SIGMA TECH · WHO WE ARE</span>

              <h1 className="mc-display-mega" style={{ marginTop: '20px' }}>
                <span className="mc-line-mask">
                  <span className="mc-hero-line">
                    <span className="mc-script-overlap mc-script-overlap--lead">who</span> WE ARE.
                  </span>
                </span>
                <span className="mc-line-mask">
                  <span className="mc-hero-line">WE BUILD</span>
                </span>
                <span className="mc-line-mask" style={{ marginTop: '-0.18em' }}>
                  <span className="mc-hero-line">
                    <span className="mc-script-overlap mc-script-overlap--lead">modern.</span>
                  </span>
                </span>
              </h1>

              <p className="mc-body-sub">
                We are BEX Sigma Tech. We build Websites, Apps &amp; Software that are Modern, Animated &amp; 3D.
              </p>
            </div>

            <div className="mc-hero-actions">
              <button
                type="button"
                className="mc-btn-solid interactive"
                onClick={() => setDemoModalOpen(true)}
              >
                Book A Call →
              </button>
              <a
                href="https://wa.me/919361657929?text=Hi%20BEx%20Sigma%20Tech,%20I%20would%20like%20to%20build%20a%20modern%20website%20or%20app."
                target="_blank"
                rel="noreferrer"
                className="mc-btn-outline interactive"
              >
                WhatsApp Quick Chat
              </a>
            </div>
          </div>

          {/* Right 50% Beige #EAE3D0 */}
          <div className="mc-hero-right-beige">
            <div className="mc-hero-sub-bar">
              <span>Website | Apps | Software | Courses</span>
              <span>BEX SIGMA TECH</span>
            </div>

            <div className="mc-hero-photo-stage">
              <div className="mc-photo-torn-wrap mc-hero-portrait-frame mc-hero-logo-frame">
                <img
                  src="/bex_metallic_logo_clean.png"
                  alt="BEX Sigma Tech Official Logo"
                  className="mc-hero-logo-img"
                />
                <div className="mc-photo-halftone-caption">
                  <span>BEX SIGMA TECH</span>
                  <span>WHO WE ARE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT-TO-LEFT CONTINUOUS MARQUEE BAND (20s LOOP, NEVER STOPS) ── */}
        <div className="mc-marquee-band" aria-hidden="true">
          <div className="mc-marquee-track">
            {Array.from({ length: 8 }).map((_, idx) => (
              <span key={idx} className="mc-marquee-item">
                BEX SIGMA TECH - <span className="mc-marquee-script">WHO WE ARE</span> - BUILD MODERN. ·
              </span>
            ))}
          </div>
        </div>

        {/* ── OBYS 00:03-00:07 REFERENCE: STICKY STACKING POLAROIDS + 2x2 QUADRANT MATRIX + TORN RIDGE ── */}
        <section ref={obysShowcaseRef} className="mc-obys-showcase-section">
          {/* Left Sticky White Column: Stacked Polaroid Pile */}
          <div className="mc-obys-showcase-left">
            <div className="mc-obys-showcase-sticky">
              <div className="mc-obys-stack-top-text">
                <span className="mc-kicker-label">BEX SIGMA TECH · MODERN ARCHIVE</span>
                <h2 className="mc-display-mega" style={{ marginTop: '10px', fontSize: 'clamp(2.4rem, 4.6vw, 76px)' }}>
                  WHO <span className="mc-script-overlap">we</span> ARE.
                </h2>
              </div>

              <div className="mc-polaroid-pile-stage">
                {STACKED_POLAROID_CARDS.map((card, idx) => (
                  <div
                    key={card.label}
                    className={`mc-photo-torn-wrap mc-stack-card mc-stack-card--${idx + 1}`}
                    style={{ zIndex: idx + 2 }}
                  >
                    <img src={card.src} alt={card.label} className="mc-photo-sepia" />
                    <div className="mc-photo-halftone-caption">
                      <span>{card.label}</span>
                      <span>BEX</span>
                    </div>
                  </div>
                ))}
                {/* 00:00 Pinned Handwritten Note Tag */}
                <div className="mc-note-stamp" style={{ zIndex: 8 }}>
                  <span>Built Modern.</span>
                </div>
              </div>

              <div className="mc-obys-stack-bottom-text">
                <h3 className="mc-display-mega" style={{ fontSize: 'clamp(2.2rem, 4.2vw, 68px)' }}>
                  BUILD <span className="mc-script-overlap">modern.</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Right Scrolling Column: Poetic Manifesto + 2x2 Quadrant Matrix */}
          <div className="mc-obys-showcase-right">
            <div className="mc-obys-intro-row">
              <span>Showcase:</span>
              <span>Website | Apps | Software | Courses</span>
            </div>

            <div className="mc-obys-poetic-wrap">
              <p className="mc-obys-poetic-line">
                We build <strong>Websites, Apps &amp; Software</strong> that move smoothly at 60 FPS.
              </p>
              <p className="mc-obys-poetic-line">
                Interactive 3D web experiences, clean mobile interfaces, and fast cloud systems crafted without middlemen.
              </p>
              <p className="mc-obys-poetic-line">
                Ready-to-use Excel Dashboards, practical Excel &amp; DSA training, and growth marketing under one studio.
              </p>
            </div>

            <div className="mc-quad-grid">
              {QUADRANT_TILES.map((tile, idx) => {
                const isActive = activeQuadIdx === idx
                return (
                  <div
                    key={tile.id}
                    className={`mc-quad-tile ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => setActiveQuadIdx(idx)}
                    onClick={() => scrollToSection(tile.id === '04' ? 'courses' : 'services')}
                  >
                    <div className="mc-quad-head">
                      <span>{tile.title}</span>
                      <span>{tile.id}</span>
                    </div>

                    <div className="mc-quad-center">
                      {isActive ? (
                        <div className="mc-photo-torn-wrap mc-quad-sticker">
                          <img src={tile.sticker} alt={tile.title} className="mc-photo-sepia" />
                        </div>
                      ) : (
                        <span className="mc-quad-word">{tile.title}</span>
                      )}
                    </div>

                    <div className="mc-quad-foot">
                      <span>{tile.sub}</span>
                      <span>→</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── 00:01-00:02 GIANT BEIGE WORD BEHIND STRIPED CONTOUR MOUNTAIN RIDGES ── */}
        <div className="mc-ridge-transition" aria-hidden="true">
          <div className="mc-ridge-giant-word">
            MODERN <span className="mc-ridge-giant-script">craft</span>
          </div>
          <svg className="mc-ridge-svg mc-ridge-layer--back" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <defs>
              <pattern id="mcRidgeLinesBack" width="12" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="3" x2="12" y2="3" stroke="#D8CCB0" strokeWidth="1" opacity="0.45" />
              </pattern>
            </defs>
            <path
              d="M0 200 L0 124 L110 74 L240 112 L380 44 L540 98 L700 28 L875 94 L1055 24 L1230 88 L1375 46 L1440 94 L1440 200 Z"
              fill="#111111"
              stroke="#D8CCB0"
              strokeWidth="2.5"
            />
            <path
              d="M0 200 L0 124 L110 74 L240 112 L380 44 L540 98 L700 28 L875 94 L1055 24 L1230 88 L1375 46 L1440 94 L1440 200 Z"
              fill="url(#mcRidgeLinesBack)"
            />
          </svg>
          <svg className="mc-ridge-svg mc-ridge-layer--front" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <defs>
              <pattern id="mcRidgeLinesFront" width="14" height="7" patternUnits="userSpaceOnUse">
                <path d="M0 3.5 Q7 1 14 3.5" stroke="#D8CCB0" strokeWidth="1" fill="none" opacity="0.55" />
              </pattern>
            </defs>
            <path
              d="M0 200 L0 146 L130 98 L255 138 L405 78 L560 128 L725 60 L900 122 L1080 54 L1250 116 L1390 74 L1440 118 L1440 200 Z"
              fill="#111111"
              stroke="#D8CCB0"
              strokeWidth="3"
            />
            <path
              d="M0 200 L0 146 L130 98 L255 138 L405 78 L560 128 L725 60 L900 122 L1080 54 L1250 116 L1390 74 L1440 118 L1440 200 Z"
              fill="url(#mcRidgeLinesFront)"
            />
          </svg>
        </div>

        {/* ── 2. MANAGER - HARIHARAN (BLACK SECTION + SCALE 0.5->1.2 + FLYING PHOTOS -10DEG->0) ── */}
        <section id="manager" className="mc-black-section">
          <div className="mc-counter-columns">
            {BLACK_SCALE_NUMBERS.map((item) => (
              <div key={item.value} className="mc-counter-col">
                <span className="mc-kicker-label mc-kicker-label--beige">STUDIO CORE</span>
                <span className="mc-counter-scale-num">{item.value}</span>
                <span className="mc-counter-col-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mc-manager-grid">
            <div>
              <span className="mc-kicker-label mc-kicker-label--beige" style={{ marginBottom: '16px' }}>
                LEADERSHIP · DIRECT LINE
              </span>
              <h2 className="mc-display-mega mc-display-mega--beige">
                MEET OUR
                <br />
                MANAGER. <span className="mc-script-overlap mc-script-overlap--beige">Hariharan</span>
              </h2>
              <p className="mc-body-sub mc-body-sub--beige">
                Led by Hariharan. He leads design, development &amp; delivery. Direct line with him, no middlemen.
              </p>

              <div className="mc-hero-actions" style={{ marginTop: '28px' }}>
                <a
                  href="https://wa.me/919361657929?text=Hi%20Hariharan,%20I%20would%20like%20to%20talk%20about%20my%20project."
                  target="_blank"
                  rel="noreferrer"
                  className="mc-btn-beige interactive"
                >
                  Talk to Hariharan → WhatsApp
                </a>
              </div>
            </div>

            <div className="mc-manager-photo-card mc-photo-torn-wrap mc-fly-card">
              <img
                src="/ceo_hariharan.jpg"
                alt="Hariharan - Manager at BEX Sigma Tech"
              />
              <div className="mc-photo-halftone-caption">
                <span>HARIHARAN - MANAGER</span>
                <span>DIRECT ACCESS</span>
              </div>
            </div>
          </div>

          <div className="mc-flying-photos-grid">
            {STUDIO_SHOWCASE_PHOTOS.map((photo) => (
              <div key={photo.code} className="mc-flying-photo-card mc-photo-torn-wrap mc-fly-card">
                <img src={photo.src} alt={photo.label} />
                <div className="mc-flying-photo-meta">
                  <span>{photo.code}</span>
                  <span>{photo.label}</span>
                </div>
              </div>
            ))}
          </div>
          {/* 00:04-00:05 Diagonal Halftone Contour Flap Break into Services Split */}
          <div className="mc-diagonal-flap-wrap" aria-hidden="true">
            <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="mc-diagonal-flap-svg">
              <polygon points="0,72 0,14 960,72" fill="#EAE3D0" />
              <polygon points="0,72 0,24 930,72" fill="#FFFFFF" />
            </svg>
          </div>
        </section>

        {/* ── 3. WHAT WE BUILD - SERVICES (SPLIT SCROLL + 0:23 FALLING ICONS + ACCORDION) ── */}
        <section id="services" ref={splitSectionRef} className="mc-split-scroll-section">
          {/* Left Sticky White Column */}
          <div className="mc-split-sticky-left">
            <div className="mc-sticky-inner">
              <div>
                <span className="mc-kicker-label">SERVICES 01 — 04 · MODERN ENGINEERING</span>
                <h2 className="mc-display-mega" style={{ marginTop: '16px' }}>
                  WHAT WE BUILD. <span className="mc-script-overlap">We Build</span>
                </h2>
                <p className="mc-body-sub">
                  Modern, animated, 3D websites, mobile apps, and custom business software engineered for speed and visual craft.
                </p>

                <div style={{ marginTop: '22px' }}>
                  <button
                    type="button"
                    className="mc-btn-solid interactive"
                    onClick={() => setDemoModalOpen(true)}
                  >
                    Book A Call →
                  </button>
                </div>
              </div>

              {/* 00:06-00:09 Reference: Giant Word Behind Bowl + Rising Steam + Falling Stack Icons + Pinned Note */}
              <div className="mc-falling-bowl-stage">
                <div className="mc-falling-stage-label">
                  <span>EXCEL · WEBSITE · APP</span>
                  <span>BOUNCE LOOP</span>
                </div>

                {/* Massive word behind bowl (00:06 -> 00:09) */}
                <div className="mc-bowl-bg-word" aria-hidden="true">
                  BEX STACK:
                </div>

                {FALLING_ICONS.map((item, idx) => (
                  <div key={item.code} className={`mc-falling-icon mc-falling-icon--${idx + 1}`}>
                    <span className="mc-falling-icon-code">{item.code}</span>
                    <span className="mc-falling-icon-sub">{item.sub}</span>
                  </div>
                ))}

                {/* Wavy steam above bowl (00:08) */}
                <svg className="mc-bowl-steam" viewBox="0 0 180 46" fill="none" aria-hidden="true">
                  <path className="mc-steam-path" d="M40 42 Q32 30 42 20 Q50 10 40 2" stroke="#111111" strokeWidth="2.2" />
                  <path className="mc-steam-path" d="M90 42 Q82 30 92 20 Q100 10 90 2" stroke="#111111" strokeWidth="2.2" />
                  <path className="mc-steam-path" d="M140 42 Q132 30 142 20 Q150 10 140 2" stroke="#111111" strokeWidth="2.2" />
                </svg>

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
                  <span className="mc-bowl-caption">EXCEL · WEBSITE · APP STACK</span>
                </div>

                <div className="mc-note-stamp mc-note-stamp--bowl">
                  <span>All Systems Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Beige Column (Scrolls at Independent Speed + 01-04 Accordion) */}
          <div className="mc-split-scroll-right">
            <div ref={splitRightRef} className="mc-divisions-list">
              {BUILD_SERVICES.map((srv) => {
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
                        <h3 className="mc-division-title">{srv.title}</h3>
                        <p className="mc-division-tagline">{srv.summary}</p>
                      </div>
                      <span className="mc-division-toggle">{isExpanded ? '−' : '+'}</span>
                    </div>

                    {isExpanded && (
                      <div className="mc-division-body">
                        <p className="mc-division-desc">{srv.details}</p>
                        <div className="mc-hero-actions">
                          <button
                            type="button"
                            className="mc-btn-solid interactive"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDemoModalOpen(true)
                            }}
                          >
                            Book A Call →
                          </button>
                          <button
                            type="button"
                            className="mc-btn-outline interactive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNavigate(srv.route)
                            }}
                          >
                            Explore Work
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div>
              <button
                type="button"
                className="mc-btn-solid interactive"
                onClick={() => setDemoModalOpen(true)}
              >
                Book A Call →
              </button>
            </div>
          </div>
        </section>

        {/* ── 4. COURSES WE PROVIDE (2 BIG CARDS) ── */}
        <section id="courses" className="mc-courses-section">
          <div className="mc-courses-header">
            <div>
              <span className="mc-kicker-label" style={{ marginBottom: '12px' }}>
                SKILL TRACKS · LIVE TRAINING
              </span>
              <h2 className="mc-display-mega">
                LEARN WITH US. <span className="mc-script-overlap">Courses</span>
              </h2>
            </div>

            <button
              type="button"
              className="mc-btn-solid interactive"
              onClick={() => setDemoModalOpen(true)}
            >
              Join Course →
            </button>
          </div>

          {/* 00:10 Obys Circular Node Row */}
          <div className="mc-circles-row">
            {['EXCEL', 'DSA', 'DASHBOARDS', 'INTERVIEWS'].map((label, cIdx) => (
              <div
                key={label}
                className={`mc-circle-node ${cIdx === 0 ? 'is-inverted' : ''}`}
                onClick={() => setDemoModalOpen(true)}
              >
                <span className="mc-circle-text">{label}</span>
              </div>
            ))}
          </div>

          <div className="mc-courses-grid-2">
            {COURSES.map((course) => (
              <div key={course.num} className="mc-course-big-card">
                <div className="mc-course-card-top">
                  <span className="mc-course-num">{course.num}</span>
                  <span className="mc-kicker-label">{course.tag}</span>
                </div>

                <div>
                  <h3 className="mc-course-title">{course.title}</h3>
                  <p className="mc-course-copy" style={{ marginTop: '14px' }}>{course.desc}</p>
                </div>

                <div>
                  <button
                    type="button"
                    className="mc-btn-solid interactive"
                    onClick={() => setDemoModalOpen(true)}
                  >
                    Join Course →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. EXCEL DASHBOARD SALE (50/50 SPLIT + FLYING DASHBOARD CARDS) ── */}
        <section id="dashboard" className="mc-dashboard-sale-section">
          <div className="mc-sale-left">
            <span className="mc-kicker-label">READY-TO-USE TEMPLATES · INSTANT DOWNLOAD</span>
            <h2 className="mc-display-mega">
              EXCEL DASHBOARD. <span className="mc-script-overlap">For Sale</span>
            </h2>
            <p className="mc-body-sub">
              Ready-made Excel Dashboards for Business. Sales, Finance, HR, Inventory. Buy &amp; Use Today.
            </p>
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                className="mc-btn-solid interactive"
                onClick={() => handleNavigate('web_dev')}
              >
                Buy Dashboard - ₹199 →
              </button>
            </div>
          </div>

          <div className="mc-sale-right">
            {DASHBOARD_PREVIEWS.map((card) => (
              <div key={card.code} className="mc-flying-photo-card mc-photo-torn-wrap mc-fly-card">
                <img src={card.src} alt={card.label} />
                <div className="mc-flying-photo-meta">
                  <span>{card.code}</span>
                  <span>{card.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. DIGITAL MARKETING + VIDEO (BLACK SECTION + 3 CARDS) ── */}
        <section id="marketing" className="mc-marketing-section">
          <div className="mc-marketing-header">
            <div>
              <span className="mc-kicker-label mc-kicker-label--beige" style={{ marginBottom: '12px' }}>
                GROWTH · EDITING · PRODUCTION SHOOT
              </span>
              <h2 className="mc-display-mega mc-display-mega--beige">
                WE MARKET +
                <br />
                WE SHOOT. <span className="mc-script-overlap mc-script-overlap--beige">Marketing</span>
              </h2>
            </div>

            <button
              type="button"
              className="mc-btn-beige interactive"
              onClick={() => setDemoModalOpen(true)}
            >
              Start Project →
            </button>
          </div>

          <div className="mc-marketing-grid-3">
            {MARKETING_CARDS.map((card) => (
              <div key={card.num} className="mc-marketing-card">
                <div className="mc-marketing-card-top">
                  <span className="mc-marketing-num">{card.num}</span>
                  <span className="mc-kicker-label mc-kicker-label--beige" style={{ color: 'inherit' }}>
                    {card.tag}
                  </span>
                </div>

                <h3 className="mc-marketing-title">{card.title}</h3>
                <p className="mc-marketing-desc">{card.desc}</p>

                <div>
                  <button
                    type="button"
                    className="mc-btn-beige interactive"
                    onClick={() => setDemoModalOpen(true)}
                  >
                    Start Project →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. CTA: LET'S BUILD YOURS. TOGETHER ── */}
        <section className="mc-cta-obys-section">
          <div className="mc-cta-left">
            <span className="mc-kicker-label">BEX SIGMA TECH · LET&apos;S TALK</span>
            <h2 className="mc-display-mega">
              LET&apos;S BUILD
              <br />
              YOURS. <span className="mc-script-overlap">Together</span>
            </h2>
            <p className="mc-body-sub">
              Website vena? App vena? Course vena? Dashboard vena? Pesalam.
            </p>
          </div>

          <div className="mc-cta-right">
            <span className="mc-kicker-label">DIRECT ACTION</span>
            <div className="mc-cta-actions-stack">
              <button
                type="button"
                className="mc-btn-solid interactive"
                onClick={() => setDemoModalOpen(true)}
              >
                BOOK A CALL →
              </button>
              <a
                href="https://wa.me/919361657929?text=Website%20vena%3F%20App%20vena%3F%20Course%20vena%3F%20Dashboard%20vena%3F%20Pesalam!"
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
                Buy Dashboard - ₹199
              </button>
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
