import React, { useEffect, useState, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import '../../styles/missionControl.css'

/* ==========================================================================
   BEX SIGMA TECH — STRATEGIC MISSION CONTROL & CORPORATE PROFILE
   "Who We Are · What Services We Do · Why Choose Us · About Us Fully"
   ========================================================================== */

const SERVICES_CATALOG = [
  {
    id: 'excel_bi',
    code: 'SRV-01',
    title: 'Enterprise BI & Spreadsheet Master Suites',
    badge: 'FLAGSHIP DIVISION · ₹199',
    tagline: '1,000+ Business Templates (.xlsx) + Weekend Live Masterclasses',
    desc: 'Automated executive spreadsheet architecture built for corporate decision-makers. Includes 10 plug-and-play executive BI dashboards, Power Query 1-Click ETL automation, financial models, and direct weekend cohort training with Microsoft Verified Architect Hariharan.D.',
    image: '/ain_excel_pack.jpg',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    specs: ['1,000+ Production Templates', '10 Executive BI Dashboards', 'Power Query 1-Click ETL', 'Weekend Live Masterclasses'],
    actionLabel: '🛒 Launch Product Store (₹199)',
    actionRoute: 'web_dev',
  },
  {
    id: 'spatial_3d',
    code: 'SRV-02',
    title: '3D Spatial Web & WebGL Interactive Sites',
    badge: '3D SPATIAL WEB · 60 FPS',
    tagline: 'Hardware-Accelerated WebGL, Three.js & Immersive Storytelling',
    desc: 'High-performance 3D digital experiences that run smoothly at 60 FPS on any modern browser. From interactive 3D product visualizers to cinematic spatial landing pages that captivate enterprise customers and elevate brand authority.',
    image: '/sector_3d_website.jpg',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    specs: ['Three.js & WebGL 60 FPS', 'Draco Mesh Compression', 'Interactive Camera Rigs', 'Silk Shader Dynamics'],
    actionLabel: '🌐 Inspect 3D Architecture',
    actionRoute: 'web_dev',
  },
  {
    id: 'cloud_saas',
    code: 'SRV-03',
    title: 'Custom Enterprise Software & Cloud SaaS',
    badge: 'FULL STACK SAAS · APIS',
    tagline: 'Scalable Administrative Portals, Cloud Backends & APIs',
    desc: 'End-to-end custom business software engineered to match your operational workflow. We build multi-tenant SaaS platforms, administrative command dashboards, secure REST & GraphQL microservices, and automated CI/CD cloud pipelines.',
    image: '/sector_software.jpg',
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.45)',
    specs: ['Bespoke Cloud Portals', 'Automated CI/CD Pipelines', 'PostgreSQL / MongoDB Microservices', 'Enterprise RBAC Security'],
    actionLabel: '💻 View Software Scope',
    actionRoute: 'apps',
  },
  {
    id: 'mobile_apps',
    code: 'SRV-04',
    title: 'Mobile Application Engineering (iOS & Android)',
    badge: 'CROSS-PLATFORM · NATIVE',
    tagline: 'High-Performance React Native & Flutter Mobile Apps',
    desc: 'Fluid, responsive mobile applications for iOS and Android. Built with offline-first synchronization, real-time push notifications, payment gateway integrations, and published directly to the Apple App Store and Google Play Store.',
    image: '/sector_application.jpg',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.45)',
    specs: ['React Native & Flutter', 'Offline-First Local DB', 'Real-Time WebSockets', 'App Store & Play Store Setup'],
    actionLabel: '📱 Request Mobile Build',
    actionRoute: 'apps',
  },
  {
    id: 'ai_pipelines',
    code: 'SRV-05',
    title: 'Autonomous AI Pipelines & Workflow Automation',
    badge: 'AI AUTOMATION · LLMS',
    tagline: 'Intelligent Agent Swarms, Document Processing & ETL',
    desc: 'Eliminate repetitive manual operations. We design and integrate custom AI agent workflows, automated document data extractors, intelligent customer service bots, and automated ETL pipelines powered by Gemini and Claude.',
    image: '/sector_ai_automation.jpg',
    accent: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    specs: ['LLM Agent Workflows', 'Automated Document OCR & ETL', 'Gemini & Claude Integrations', 'Real-Time Alert Webhooks'],
    actionLabel: '🤖 Explore AI Pipelines',
    actionMailto: true,
  },
  {
    id: 'bespoke_rd',
    code: 'SRV-06',
    title: 'Bespoke R&D Pod & Rapid Startup Prototyping',
    badge: 'BESPOKE INNOVATION · 100% IP',
    tagline: 'Turn Your Breakthrough Concept Into a Working MVP in < 48 Hours',
    desc: 'Have an ambitious idea or uncharted digital vision? Our elite engineering pod builds and deploys custom interactive prototypes and production-ready MVPs with weekly milestone demos and 100% intellectual property ownership transfer.',
    image: '/pathway_bespoke_idea.jpg',
    accent: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.45)',
    specs: ['Dedicated Engineering Pod', 'Weekly Milestone Demos', '< 48h Rapid MVP Sprint', '100% Full IP Transfer'],
    actionLabel: '✦ Initiate Bespoke Project',
    actionMailto: true,
  },
]

const WHY_CHOOSE_US = [
  {
    number: '01',
    title: '100% Microsoft Verified Standards',
    badge: 'VERIFIED INTEGRITY',
    icon: '🛡️',
    desc: 'Unlike self-taught hobbyists or generic template aggregators, all our systems, spreadsheet architectures, and software data models are verified against Microsoft enterprise standards for absolute formula accuracy and zero spreadsheet crashes.',
  },
  {
    number: '02',
    title: '< 48-Hour Rapid Sprint Delivery',
    badge: 'EXTREME AGILITY',
    icon: '⚡',
    desc: 'We operate with agile, elite engineering pods. While traditional corporate agencies take months and endless meetings just to scope a project, we build and deliver functioning interactive prototypes in less than 48 hours.',
  },
  {
    number: '03',
    title: 'Executive Presentation-Ready UI/UX',
    badge: 'CINEMATIC CRAFT',
    icon: '🎨',
    desc: 'We reject ugly, boring corporate tools. Every dashboard, 3D WebGL experience, and software interface is built with luxury dark aesthetics, crisp typography, and silky 60 FPS fluidity that will impress boards, investors, and clients.',
  },
  {
    number: '04',
    title: '100% Source Code & IP Ownership',
    badge: 'ZERO LOCK-IN',
    icon: '🔑',
    desc: 'When we build custom software, web platforms, or bespoke spreadsheet models for you, you own 100% of the intellectual property, design assets, and source code upon completion. No hidden royalties, no forced dependencies.',
  },
  {
    number: '05',
    title: 'Direct Line with Lead Architect',
    badge: 'ZERO MIDDLEMEN',
    icon: '👤',
    desc: 'You work directly with Founder & Chief Architect Hariharan.D and senior engineers — not junior account managers or offshore support tickets. Clear technical communication, rapid decisions, and flawless execution.',
  },
  {
    number: '06',
    title: 'Unmatched Value & Accessible Pricing',
    badge: 'MAXIMUM ROI',
    icon: '💎',
    desc: 'We democratize elite technology. Our flagship aIn Excel Master Suite provides 1,000+ enterprise templates and live training for just ₹199, and our custom software builds deliver agency-grade quality at accessible startup rates.',
  },
]

const GLOBAL_NODES = [
  { city: 'Bengaluru (HQ)', country: 'India', flag: '🇮🇳', role: 'Architecture Mainframe & Core Pod', status: 'ONLINE', latency: '12ms' },
  { city: 'Silicon Valley', country: 'USA', flag: '🇺🇸', role: 'Cloud Infrastructure & Scale Nodes', status: 'ONLINE', latency: '48ms' },
  { city: 'London', country: 'UK', flag: '🇬🇧', role: 'Financial Modeling & BI Strategy', status: 'ONLINE', latency: '34ms' },
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', role: 'Spatial Web & Low-Latency R&D', status: 'ONLINE', latency: '28ms' },
]

export default function MissionControl() {
  const { closeMissionBriefing, userName, navigateToSector } = useStore()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [activeTab, setActiveTab] = useState('who_are_we')
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
  }, [])

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC')
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Smooth Scrollspy: updates active tab as user scrolls
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const sectionIds = ['who_are_we', 'services', 'why_choose_us', 'leadership', 'dispatch']
    const handleScroll = () => {
      const scrollPos = container.scrollTop + 220
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(sectionIds[i])
          break
        }
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigate = (sectorId) => {
    cinemaAudio.playSectorTransition()
    navigateToSector(sectorId)
  }

  const handleClose = () => {
    cinemaAudio.playSectorTransition()
    closeMissionBriefing()
  }

  const scrollToSection = (id) => {
    cinemaAudio.playBeep?.()
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={`mc-command-overlay ${mounted ? 'mc-mounted' : ''}`}>
      <div className="mc-bg-grid" />
      <div className="mc-ambient-radial" />
      <div className="mc-ambient-spotlight" />
      
      {/* Dynamic Animated Aurora Glows */}
      <div className="mc-ambient-aurora mc-aurora-1" />
      <div className="mc-ambient-aurora mc-aurora-2" />
      <div className="mc-ambient-aurora mc-aurora-3" />

      <div className="mc-scroll-container" ref={scrollContainerRef}>
        {/* ── TOP HUD COMMAND DECK ── */}
        <header className="mc-top-deck">
          <div className="mc-deck-left">
            <button className="mc-deck-back-btn interactive" onClick={handleClose} title="Return to HQ Observatory">
              <span className="mc-back-arrow">‹</span>
              <span>HQ STATION</span>
            </button>
            <div className="mc-deck-title-group">
              <span className="mc-deck-brand">BEX SIGMA TECH · COMMAND HQ</span>
              <span className="mc-deck-op">OPERATOR: {userName || 'GUEST COMMANDER'}</span>
            </div>
          </div>

          <div className="mc-deck-center">
            <div className="mc-status-pill">
              <span className="mc-pulse-dot" />
              <span className="mc-pulse-ring" />
              <span>GRID STATUS: ALL SYSTEMS OPTIMAL</span>
            </div>
            <span className="mc-clock-text">{currentTime || '12:00:00 UTC'}</span>
          </div>

          <div className="mc-deck-right">
            <button className="mc-quick-nav-btn interactive" onClick={() => handleNavigate('web_dev')}>
              🛒 Products
            </button>
            <button className="mc-quick-nav-btn interactive" onClick={() => handleNavigate('apps')}>
              📱 Apps
            </button>
            <button className="mc-quick-nav-btn interactive" onClick={() => handleNavigate('client_projects')}>
              🚀 Projects
            </button>
            <button className="mc-close-cross interactive" onClick={handleClose} title="Exit Mission Control">
              ✕
            </button>
          </div>
        </header>

        {/* ── HERO COMMAND DIRECTIVE ── */}
        <section className="mc-directive-hero">
          <div className="mc-directive-eyebrow">
            <span className="mc-directive-star">★</span>
            <span>STRATEGIC EXECUTIVE DIRECTIVE & CORPORATE DOSSIER</span>
            <span className="mc-directive-star">★</span>
          </div>
          <h1 className="mc-directive-title">
            Who We Are · <span className="mc-title-gradient">What We Do</span> · Why Choose Us
          </h1>
          <p className="mc-directive-sub">
            The definitive blueprint of BEx Sigma Tech. An elite engineering laboratory and technology studio dedicated to enterprise business intelligence, 3D WebGL spatial web, and custom cloud software.
          </p>

          {/* Quick-Jump Section Floating Pill Dock */}
          <nav className="mc-jump-dock" aria-label="Section navigation">
            <button
              className={`mc-dock-item ${activeTab === 'who_are_we' ? 'mc-dock-active' : ''}`}
              onClick={() => scrollToSection('who_are_we')}
            >
              <span className="mc-dock-icon">🏢</span>
              <span>Who We Are</span>
            </button>
            <button
              className={`mc-dock-item ${activeTab === 'services' ? 'mc-dock-active' : ''}`}
              onClick={() => scrollToSection('services')}
            >
              <span className="mc-dock-icon">⚡</span>
              <span>What We Do</span>
            </button>
            <button
              className={`mc-dock-item ${activeTab === 'why_choose_us' ? 'mc-dock-active' : ''}`}
              onClick={() => scrollToSection('why_choose_us')}
            >
              <span className="mc-dock-icon">🛡️</span>
              <span>Why Choose Us</span>
            </button>
            <button
              className={`mc-dock-item ${activeTab === 'leadership' ? 'mc-dock-active' : ''}`}
              onClick={() => scrollToSection('leadership')}
            >
              <span className="mc-dock-icon">👤</span>
              <span>About Leadership</span>
            </button>
            <button
              className={`mc-dock-item ${activeTab === 'dispatch' ? 'mc-dock-active' : ''}`}
              onClick={() => scrollToSection('dispatch')}
            >
              <span className="mc-dock-icon">🚀</span>
              <span>Work With Us</span>
            </button>
          </nav>
        </section>

        {/* ── SECTION 1: WHO ARE WE? ── */}
        <section id="who_are_we" className="mc-section-block">
          <div className="mc-section-header">
            <div className="mc-section-eyebrow">
              <span className="mc-section-dot" />
              <span>SECTION 01 · CORPORATE IDENTITY</span>
            </div>
            <h2 className="mc-section-title">Who Are We?</h2>
            <p className="mc-section-sub">
              A specialized technology studio bridging enterprise data architectures, 3D spatial web design, and bespoke software engineering.
            </p>
          </div>

          <div className="mc-who-grid">
            {/* Left Story Column */}
            <div className="mc-who-story-card">
              <div className="mc-card-shine" />
              <div className="mc-who-badge-row">
                <span className="mc-who-badge">THE BEX SIGMA TECH ORIGIN</span>
                <span className="mc-who-verified-badge">✓ MICROSOFT AUDITED</span>
              </div>
              <h3 className="mc-who-story-title">
                Eliminating Theory Fluff. <br />
                <span className="mc-story-accent">Architecting Production Systems.</span>
              </h3>
              <p className="mc-who-p">
                BEx Sigma Tech was founded by <strong>Hariharan.D</strong>, a <strong>Microsoft Verified Professional</strong> and Enterprise Data Architect, with a single non-negotiable principle: <em>modern technology and business tools must be practical, automated, and presentation-ready from minute one.</em>
              </p>
              <p className="mc-who-p">
                Too many companies are trapped between slow, overpriced consulting agencies on one side, and low-quality theoretical courses or broken spreadsheet templates on the other. BEx Sigma Tech solves this by serving as a dual-engine technology powerhouse:
              </p>
              
              <div className="mc-dual-engine-box">
                <div className="mc-engine-item">
                  <div className="mc-engine-dot mc-dot-green" />
                  <div className="mc-engine-text">
                    <strong>1. Accessible Enterprise Toolkits:</strong> Turnkey, automated spreadsheet systems (like our flagship <strong>aIn All-in-One Master Suite</strong>) priced accessibly at <strong>₹199</strong> so professionals and businesses can automate their workflows without corporate budgets.
                  </div>
                </div>
                <div className="mc-engine-item">
                  <div className="mc-engine-dot mc-dot-blue" />
                  <div className="mc-engine-text">
                    <strong>2. High-End Custom Engineering:</strong> Partnering with ambitious startups and enterprises to architect <strong>60 FPS 3D spatial web experiences</strong>, scalable cloud SaaS portals, native mobile apps, and autonomous AI pipelines in rapid sprint cycles (&lt; 48 hours).
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Core DNA Pillars */}
            <div className="mc-who-pillars-wrap">
              <div className="mc-pillar-card">
                <div className="mc-pillar-icon-box">⚡</div>
                <div className="mc-pillar-content">
                  <h4 className="mc-pillar-title">Zero Theory Fluff</h4>
                  <p className="mc-pillar-desc">
                    Every spreadsheet template, formula pipeline, and software architecture is tested in real production environments before release.
                  </p>
                </div>
              </div>

              <div className="mc-pillar-card">
                <div className="mc-pillar-icon-box">🎨</div>
                <div className="mc-pillar-content">
                  <h4 className="mc-pillar-title">Cinematic UI & Spatial Web</h4>
                  <p className="mc-pillar-desc">
                    We believe business tools should be visually stunning. We build with hardware-accelerated WebGL, dark glass aesthetics, and 60 FPS fluidity.
                  </p>
                </div>
              </div>

              <div className="mc-pillar-card">
                <div className="mc-pillar-icon-box">🛡️</div>
                <div className="mc-pillar-content">
                  <h4 className="mc-pillar-title">Microsoft Verified Integrity</h4>
                  <p className="mc-pillar-desc">
                    Our data architectures adhere strictly to Microsoft enterprise validation standards, ensuring formula accuracy and zero spreadsheet corruption.
                  </p>
                </div>
              </div>

              <div className="mc-pillar-card">
                <div className="mc-pillar-icon-box">🤝</div>
                <div className="mc-pillar-content">
                  <h4 className="mc-pillar-title">Direct Pod Collaboration</h4>
                  <p className="mc-pillar-desc">
                    No layered account managers. You collaborate directly with Lead Architect Hariharan.D and core developers for rapid execution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Telemetry Metrics Bar */}
          <div className="mc-telemetry-ribbon">
            <div className="mc-telemetry-card">
              <div className="mc-telemetry-top">
                <span className="mc-telemetry-icon">📊</span>
                <span className="mc-telemetry-tag">ACTIVE SECTORS</span>
              </div>
              <div className="mc-telemetry-num">1,000+</div>
              <div className="mc-telemetry-label">Production Templates</div>
              <div className="mc-telemetry-desc">Excel & BI suites active across 100+ industries</div>
            </div>

            <div className="mc-telemetry-card">
              <div className="mc-telemetry-top">
                <span className="mc-telemetry-icon">⚡</span>
                <span className="mc-telemetry-tag">TURNAROUND</span>
              </div>
              <div className="mc-telemetry-num">&lt; 48h</div>
              <div className="mc-telemetry-label">Rapid Sprint Cycle</div>
              <div className="mc-telemetry-desc">Turnaround for working interactive prototypes</div>
            </div>

            <div className="mc-telemetry-card">
              <div className="mc-telemetry-top">
                <span className="mc-telemetry-icon">🏆</span>
                <span className="mc-telemetry-tag">STANDARDS</span>
              </div>
              <div className="mc-telemetry-num">100%</div>
              <div className="mc-telemetry-label">Microsoft Verified</div>
              <div className="mc-telemetry-desc">Formulas and architectural standards verified</div>
            </div>

            <div className="mc-telemetry-card">
              <div className="mc-telemetry-top">
                <span className="mc-telemetry-icon">🌍</span>
                <span className="mc-telemetry-tag">COMMUNITY</span>
              </div>
              <div className="mc-telemetry-num">500+</div>
              <div className="mc-telemetry-label">Mentored & Trained</div>
              <div className="mc-telemetry-desc">Students, managers & business owners empowered</div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: WHAT ARE ALL THE SERVICES WE DO? ── */}
        <section id="services" className="mc-section-block">
          <div className="mc-section-header">
            <div className="mc-section-eyebrow">
              <span className="mc-section-dot" />
              <span>SECTION 02 · FULL CAPABILITIES</span>
            </div>
            <h2 className="mc-section-title">What Services Do We Do?</h2>
            <p className="mc-section-sub">
              Our 6 core engineering divisions. From turnkey spreadsheet toolkits to high-scale custom cloud software and 3D spatial web.
            </p>
          </div>

          <div className="mc-divisions-grid">
            {SERVICES_CATALOG.map((srv) => (
              <div
                key={srv.id}
                className="mc-division-card interactive"
                style={{
                  '--div-accent': srv.accent,
                  '--div-glow': srv.glow,
                }}
              >
                {/* Visual Banner */}
                <div className="mc-div-visual-wrap">
                  <img src={srv.image} alt={srv.title} className="mc-div-visual-img" loading="lazy" />
                  <div className="mc-div-visual-overlay" />
                  <span className="mc-div-code">{srv.code}</span>
                  <span className="mc-div-badge">{srv.badge}</span>
                </div>

                {/* Body Content */}
                <div className="mc-div-body">
                  <h3 className="mc-div-title">{srv.title}</h3>
                  <div className="mc-div-tagline">{srv.tagline}</div>
                  <p className="mc-div-desc">{srv.desc}</p>

                  {/* 4 Specs */}
                  <div className="mc-div-specs-grid">
                    {srv.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="mc-div-spec-pill">
                        <span className="mc-spec-dot" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mc-div-action-row">
                    {srv.actionMailto ? (
                      <a
                        href={`mailto:bexsigmatech@gmail.com?subject=${encodeURIComponent(srv.title + ' - Project Inquiry')}&body=Hi%20BEx%20Sigma%20Tech%20Pod,%0A%0AI%20am%20interested%20in%20your%20services%20for%20${encodeURIComponent(srv.title)}.%20Please%20schedule%20a%20consultation.`}
                        className="mc-div-btn interactive"
                      >
                        <span>{srv.actionLabel}</span>
                        <span className="mc-btn-arrow">→</span>
                      </a>
                    ) : (
                      <button
                        className="mc-div-btn interactive"
                        onClick={() => handleNavigate(srv.actionRoute)}
                      >
                        <span>{srv.actionLabel}</span>
                        <span className="mc-btn-arrow">→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: WHY CHOOSE US? ── */}
        <section id="why_choose_us" className="mc-section-block">
          <div className="mc-section-header">
            <div className="mc-section-eyebrow">
              <span className="mc-section-dot" />
              <span>SECTION 03 · THE BEX ADVANTAGE</span>
            </div>
            <h2 className="mc-section-title">Why Choose BEx Sigma Tech?</h2>
            <p className="mc-section-sub">
              How we compare against slow traditional agencies and generic low-quality template sellers.
            </p>
          </div>

          <div className="mc-why-grid">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="mc-why-card">
                <span className="mc-why-bg-num">{item.number}</span>
                <div className="mc-why-top">
                  <span className="mc-why-icon">{item.icon}</span>
                  <span className="mc-why-badge">{item.badge}</span>
                </div>
                <h3 className="mc-why-title">{item.title}</h3>
                <p className="mc-why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: ABOUT US FULLY & LEADERSHIP ── */}
        <section id="leadership" className="mc-section-block">
          <div className="mc-section-header">
            <div className="mc-section-eyebrow">
              <span className="mc-section-dot" />
              <span>SECTION 04 · FOUNDER & INFRASTRUCTURE</span>
            </div>
            <h2 className="mc-section-title">About Us Fully & Leadership</h2>
            <p className="mc-section-sub">
              Engineered with pride from India, powering professionals and companies worldwide.
            </p>
          </div>

          {/* Founder Spotlight Card */}
          <div className="mc-leadership-card">
            <div className="mc-leadership-left">
              <div className="mc-leader-avatar-wrap">
                <div className="mc-leader-ring-glow" />
                <img
                  src="/ceo_hariharan.jpg"
                  alt="Hariharan.D — Founder & Lead Architect"
                  className="mc-leader-avatar"
                />
                <div className="mc-leader-verified-ring" title="Microsoft Verified">✓</div>
              </div>
              <div className="mc-leader-meta">
                <a
                  href="https://www.linkedin.com/in/hariharan-d"
                  target="_blank"
                  rel="noreferrer"
                  className="mc-leader-ms-badge"
                  title="View Microsoft Verified Profile on LinkedIn"
                >
                  <span className="mc-ms-check">✓</span>
                  <span>MICROSOFT VERIFIED ARCHITECT</span>
                  <span className="mc-ext-arrow">↗</span>
                </a>
                <h3 className="mc-leader-name">Hariharan.D</h3>
                <span className="mc-leader-role">Founder & Chief Architect · BEx Sigma Tech</span>
              </div>
            </div>

            <div className="mc-leadership-right">
              <div className="mc-leader-quote">
                "We don't teach or build theoretical concepts. Every spreadsheet formula, 3D WebGL camera rig, and SaaS database architecture built at BEx Sigma Tech is engineered for production accuracy, zero spreadsheet crash risk, and presentation-ready executive visual clarity."
              </div>
              <div className="mc-leader-stats-row">
                <div className="mc-leader-stat">
                  <strong>100+</strong>
                  <span>Dashboards Built</span>
                </div>
                <div className="mc-leader-stat">
                  <strong>500+</strong>
                  <span>Students & Clients</span>
                </div>
                <div className="mc-leader-stat">
                  <strong>100%</strong>
                  <span>Verified Standards</span>
                </div>
                <a
                  href="mailto:bexsigmatech@gmail.com?subject=Direct%20Inquiry%20-%20Lead%20Architect%20Hariharan.D"
                  className="mc-leader-contact-btn interactive"
                >
                  <span>✉ Direct Line with Hari</span>
                </a>
              </div>
            </div>
          </div>

          {/* Worldwide Operational Infrastructure Nodes */}
          <div className="mc-nodes-section-wrap">
            <div className="mc-nodes-header-row">
              <h3 className="mc-nodes-title">Global Strategic Nodes</h3>
              <span className="mc-nodes-status-badge">● 4 NODES ONLINE · 99.98% UPTIME</span>
            </div>
            <div className="mc-nodes-grid">
              {GLOBAL_NODES.map((node, nIdx) => (
                <div key={nIdx} className="mc-node-card">
                  <div className="mc-node-top">
                    <div className="mc-node-flag-city">
                      <span className="mc-node-flag">{node.flag}</span>
                      <span className="mc-node-city">{node.city}</span>
                    </div>
                    <div className="mc-node-ping">
                      <div className="mc-ping-wrapper">
                        <span className="mc-ping-radar" />
                        <span className="mc-ping-dot" />
                      </div>
                      <span className="mc-ping-val">{node.latency}</span>
                    </div>
                  </div>
                  <div className="mc-node-role">{node.role}</div>
                  <div className="mc-node-status-bar">
                    <span className="mc-status-label">GRID STATUS:</span>
                    <span className="mc-status-active">{node.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: WORK WITH US (DISPATCH TERMINAL) ── */}
        <section id="dispatch" className="mc-dispatch-terminal">
          <div className="mc-terminal-eyebrow">
            <span>READY TO ELEVATE YOUR BUSINESS OR TECH CAPABILITIES?</span>
          </div>
          <h2 className="mc-terminal-title">
            Step Into The Future with BEx Sigma Tech
          </h2>
          <p className="mc-terminal-sub">
            Whether you want immediate lifetime access to the <strong>aIn Excel Master Suite (₹199)</strong>, live weekend masterclass cohorts, or a custom 3D web application built in a 48-hour sprint — our engineering pod is ready to deploy.
          </p>

          <div className="mc-terminal-actions">
            <button
              className="mc-terminal-btn-primary interactive"
              onClick={() => handleNavigate('web_dev')}
            >
              <span className="mc-btn-shimmer" />
              <span>🛒 Get Flagship Excel Suite (₹199 Only)</span>
              <span className="mc-btn-arrow">→</span>
            </button>
            <a
              href="mailto:bexsigmatech@gmail.com?subject=Custom%20Project%20Inquiry%20-%20BEx%20Sigma%20Tech&body=Hi%20Hariharan%20%26%20BEx%20Sigma%20Tech%20Pod,%0A%0AI%20would%20like%20to%20discuss%20a%20custom%20project.%0A%0AScope:%20[Excel%20BI%20/%203D%20Web%20/%20Custom%20Software%20/%20AI%20Pipeline]%0ABudget%20/%20Timeline:%0ADetails:"
              className="mc-terminal-btn-secondary interactive"
            >
              <span>✉ Discuss a Custom Project Sprint</span>
            </a>
            <a
              href="https://wa.me/919361657929?text=Hi%20BEx%20Sigma%20Tech,%20I%20have%20an%20inquiry%20regarding%20your%20services%20and%20products."
              target="_blank"
              rel="noreferrer"
              className="mc-terminal-btn-whatsapp interactive"
            >
              <span>💬 WhatsApp: +91 93616 57929</span>
            </a>
          </div>

          <div className="mc-terminal-trust-row">
            <span className="mc-trust-item">🔒 SSL Encrypted Checkout</span>
            <span className="mc-trust-item">⚡ Instant Email Download Access</span>
            <span className="mc-trust-item">⭐ 4.9/5 Rating (500+ Professionals)</span>
            <span className="mc-trust-item">🛡️ Microsoft Verified Standards</span>
            <span className="mc-trust-item">🇮🇳 Proudly Engineered in India</span>
          </div>
        </section>
      </div>
    </div>
  )
}
