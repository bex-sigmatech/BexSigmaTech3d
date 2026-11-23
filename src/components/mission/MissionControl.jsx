import React, { useEffect, useState, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import ScheduleDemoModal from './ScheduleDemoModal'
import '../../styles/missionControl.css'

/* ==========================================================================
   BEX SIGMA TECH — STRATEGIC MISSION CONTROL
   High-End Editorial Dark Aesthetic (Inspired by Hyperfit, Bold Typography & CourseKit):
   - Pure obsidian background (#060709) with warm amber & emerald ambient glow
   - Floating glass capsule navbar with 'BOOK A CALL' action
   - Massive condensed editorial headline: "BUILD PRODUCTION SYSTEMS. CHANGE YOUR BUSINESS TODAY."
   - Executive Centerpiece: Studio portrait card of Manager / Architect Hariharan.D
   - Big bold manifesto statement block
   - Stacked numbered services showcase (01 to 06) with interactive expansions
   - 4 Live telemetry metrics + Why Choose Us comparative matrix
   ========================================================================== */

const SERVICES = [
  {
    num: '01',
    code: 'SRV-01',
    title: 'Enterprise BI & Spreadsheet Master Suites',
    tagline: '1,000+ Business Templates (.xlsx) + Weekend Live Masterclasses',
    badge: 'FLAGSHIP DIVISION · ₹199',
    accent: '#f59e0b',
    desc: 'Automated executive spreadsheet architecture built for corporate decision-makers. Includes 10 plug-and-play executive BI dashboards, Power Query 1-Click ETL automation, financial models, and direct weekend cohort training with Microsoft Verified Architect Hariharan.D.',
    specs: ['1,000+ Production Templates', '10 Executive BI Dashboards', 'Power Query 1-Click ETL', 'Weekend Live Masterclasses'],
    actionLabel: '🛒 Launch Product Store (₹199)',
    actionRoute: 'web_dev',
  },
  {
    num: '02',
    code: 'SRV-02',
    title: '3D Spatial Web & 60 FPS WebGL Interactive Sites',
    tagline: 'Hardware-Accelerated WebGL, Three.js & Immersive Storytelling',
    badge: '3D SPATIAL WEB · 60 FPS',
    accent: '#38bdf8',
    desc: 'High-performance 3D digital experiences that run smoothly at 60 FPS on any modern browser. From interactive 3D product visualizers to cinematic spatial landing pages that captivate enterprise customers and elevate brand authority.',
    specs: ['Three.js & WebGL 60 FPS', 'Draco Mesh Compression', 'Interactive Camera Rigs', 'Silk Shader Dynamics'],
    actionLabel: '🌐 Inspect 3D Architecture',
    actionRoute: 'web_dev',
  },
  {
    num: '03',
    code: 'SRV-03',
    title: 'Custom Enterprise Software & Cloud SaaS',
    tagline: 'Scalable Administrative Portals, Cloud Backends & APIs',
    badge: 'FULL STACK SAAS · APIS',
    accent: '#a78bfa',
    desc: 'End-to-end custom business software engineered to match your operational workflow. We build multi-tenant SaaS platforms, administrative command dashboards, secure REST & GraphQL microservices, and automated CI/CD cloud pipelines.',
    specs: ['Bespoke Cloud Portals', 'Automated CI/CD Pipelines', 'PostgreSQL / MongoDB Microservices', 'Enterprise RBAC Security'],
    actionLabel: '💻 View Software Scope',
    actionRoute: 'apps',
  },
  {
    num: '04',
    code: 'SRV-04',
    title: 'Mobile Application Engineering (iOS & Android)',
    tagline: 'High-Performance React Native & Flutter Mobile Apps',
    badge: 'CROSS-PLATFORM · NATIVE',
    accent: '#10b981',
    desc: 'Fluid, responsive mobile applications for iOS and Android. Built with offline-first synchronization, real-time push notifications, payment gateway integrations, and published directly to the Apple App Store and Google Play Store.',
    specs: ['React Native & Flutter', 'Offline-First Local DB', 'Real-Time WebSockets', 'App Store & Play Store Setup'],
    actionLabel: '📱 Request Mobile Build',
    actionRoute: 'apps',
  },
  {
    num: '05',
    code: 'SRV-05',
    title: 'Autonomous AI Pipelines & Workflow Automation',
    tagline: 'Intelligent Agent Swarms, Document Processing & ETL',
    badge: 'AI AUTOMATION · LLMS',
    accent: '#ec4899',
    desc: 'Eliminate repetitive manual operations. We design and integrate custom AI agent workflows, automated document data extractors, intelligent customer service bots, and automated ETL pipelines powered by Gemini and Claude.',
    specs: ['LLM Agent Workflows', 'Automated Document OCR & ETL', 'Gemini & Claude Integrations', 'Real-Time Alert Webhooks'],
    actionLabel: '🤖 Explore AI Pipelines',
    actionMailto: true,
  },
  {
    num: '06',
    code: 'SRV-06',
    title: 'Bespoke R&D Pod & Rapid Startup Prototyping',
    tagline: 'Turn Your Breakthrough Concept Into a Working MVP in < 48 Hours',
    badge: 'BESPOKE INNOVATION · 100% IP',
    accent: '#06b6d4',
    desc: 'Have an ambitious idea or uncharted digital vision? Our elite engineering pod builds and deploys custom interactive prototypes and production-ready MVPs with weekly milestone demos and 100% intellectual property ownership transfer.',
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
    desc: 'All our systems, spreadsheet architectures, and software data models are verified against Microsoft enterprise standards for absolute formula accuracy and zero crashes.',
  },
  {
    number: '02',
    title: '< 48-Hour Rapid Sprint Delivery',
    badge: 'EXTREME AGILITY',
    icon: '⚡',
    desc: 'While traditional corporate agencies take months just to scope a project, we build and deliver functioning interactive prototypes in less than 48 hours.',
  },
  {
    number: '03',
    title: 'Executive Presentation-Ready UI/UX',
    badge: 'CINEMATIC CRAFT',
    icon: '🎨',
    desc: 'Every dashboard, 3D WebGL experience, and software interface is built with luxury dark aesthetics, crisp typography, and silky 60 FPS fluidity.',
  },
  {
    number: '04',
    title: '100% Source Code & IP Ownership',
    badge: 'ZERO LOCK-IN',
    icon: '🔑',
    desc: 'You own 100% of the intellectual property, design assets, and source code upon completion. No hidden royalties, no forced dependencies.',
  },
  {
    number: '05',
    title: 'Direct Line with Lead Architect',
    badge: 'ZERO MIDDLEMEN',
    icon: '👤',
    desc: 'You work directly with Founder & Chief Architect Hariharan.D — not junior account managers or offshore support tickets. Clear technical execution.',
  },
  {
    number: '06',
    title: 'Unmatched Value & Accessible Pricing',
    badge: 'MAXIMUM ROI',
    icon: '💎',
    desc: 'Our flagship aIn Excel Master Suite provides 1,000+ enterprise templates and live training for just ₹199, and our custom software builds deliver agency-grade quality at accessible startup rates.',
  },
]

const GLOBAL_NODES = [
  { city: 'Bengaluru (HQ)', country: 'India', flag: '🇮🇳', role: 'Architecture Mainframe & Core Pod', status: 'ONLINE', latency: '12ms' },
  { city: 'Silicon Valley', country: 'USA', flag: '🇺🇸', role: 'Cloud Infrastructure & Scale Nodes', status: 'ONLINE', latency: '48ms' },
  { city: 'London', country: 'UK', flag: '🇬🇧', role: 'Financial Modeling & BI Strategy', status: 'ONLINE', latency: '34ms' },
  { city: 'Tokyo', country: 'Japan', flag: '🇯🇵', role: 'Spatial Web & Low-Latency R&D', status: 'ONLINE', latency: '28ms' },
]

export default function MissionControl() {
  const { closeMissionBriefing, navigateToSector } = useStore()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('divisions')
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [expandedService, setExpandedService] = useState('01')
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
    const t = setTimeout(() => setMounted(true), 40)
    return () => clearTimeout(t)
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
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={`mc-editorial-overlay ${mounted ? 'mc-mounted' : ''}`}>
      {/* Background Ambience */}
      <div className="mc-editorial-ambient-glow" />
      <div className="mc-editorial-grid-lines" />

      {/* ── TOP CAPSULE FLOATING NAVIGATION (Hyperfit / CourseKit Style) ── */}
      <header className="mc-capsule-navbar">
        <div className="mc-capsule-brand" onClick={() => scrollToSection('top')}>
          <span className="mc-brand-sigma">σ</span>
          <span className="mc-brand-name">BEx SIGMA TECH</span>
          <span className="mc-brand-dot" />
        </div>

        <nav className="mc-capsule-links">
          <button
            className={`mc-capsule-link ${activeTab === 'divisions' ? 'active' : ''}`}
            onClick={() => scrollToSection('divisions')}
          >
            DIVISIONS
          </button>
          <button
            className={`mc-capsule-link ${activeTab === 'manifesto' ? 'active' : ''}`}
            onClick={() => scrollToSection('manifesto')}
          >
            METHODOLOGY
          </button>
          <button
            className={`mc-capsule-link ${activeTab === 'why' ? 'active' : ''}`}
            onClick={() => scrollToSection('why')}
          >
            WHY BEX
          </button>
          <button
            className={`mc-capsule-link ${activeTab === 'manager' ? 'active' : ''}`}
            onClick={() => scrollToSection('manager')}
          >
            LEADERSHIP
          </button>
          <button
            className="mc-capsule-link"
            onClick={() => handleNavigate('web_dev')}
          >
            PRICING (₹199)
          </button>
        </nav>

        <div className="mc-capsule-actions">
          <button
            className="mc-capsule-btn-primary interactive"
            onClick={() => setDemoModalOpen(true)}
          >
            <span>BOOK A CALL</span>
            <span className="mc-btn-arrow">→</span>
          </button>
          <button
            className="mc-capsule-btn-close interactive"
            onClick={handleClose}
            title="Return to Headquarters"
          >
            ✕
          </button>
        </div>
      </header>

      {/* ── SCROLLABLE EDITORIAL BODY ── */}
      <div className="mc-editorial-scroll" ref={scrollContainerRef}>
        <div id="top" />

        {/* ── SECTION 1: MASSIVE EDITORIAL HERO (Template 2 Bold Style) ── */}
        <section className="mc-editorial-hero">
          <div className="mc-hero-eyebrow">
            <span className="mc-eyebrow-badge">● MICROSOFT VERIFIED ARCHITECTURE STUDIO</span>
            <span className="mc-eyebrow-sep">/</span>
            <span className="mc-eyebrow-sub">ENTERPRISE BI · 3D SPATIAL WEB · CLOUD SAAS</span>
          </div>

          <h1 className="mc-hero-giant-title">
            BUILD PRODUCTION SYSTEMS.<br />
            CHANGE YOUR BUSINESS.<br />
            <span className="mc-title-highlight">TODAY.</span>
          </h1>

          <p className="mc-hero-manifesto-sub">
            Eliminating theory fluff. BEx Sigma Tech architects automated enterprise spreadsheets, 60 FPS 3D spatial web applications, and custom cloud SaaS platforms with 100% intellectual property ownership.
          </p>

          <div className="mc-hero-actions-row">
            <button
              className="mc-hero-btn-accent interactive"
              onClick={() => handleNavigate('web_dev')}
            >
              <span>⚡ Explore Master Suite (₹199)</span>
              <span className="mc-btn-arrow">→</span>
            </button>
            <button
              className="mc-hero-btn-ghost interactive"
              onClick={() => setDemoModalOpen(true)}
            >
              <span className="mc-ghost-dot" />
              <span>Book Architectural Call</span>
            </button>
          </div>

          <div className="mc-hero-trust-bar">
            <div className="mc-trust-pill">
              <span className="mc-trust-check">✓</span>
              <span>100% Microsoft Verified</span>
            </div>
            <div className="mc-trust-pill">
              <span className="mc-trust-check">✓</span>
              <span>&lt; 48h Sprint Delivery</span>
            </div>
            <div className="mc-trust-pill">
              <span className="mc-trust-check">✓</span>
              <span>100% Source Code & IP Transfer</span>
            </div>
            <div className="mc-trust-pill">
              <span className="mc-trust-check">✓</span>
              <span>Direct Lead Architect Collaboration</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: EXECUTIVE SPOTLIGHT (Template 3 Style Creator Card) ── */}
        <section id="manager" className="mc-executive-spotlight-section">
          <div className="mc-spotlight-card">
            <div className="mc-spotlight-ambient-glow" />
            
            <div className="mc-spotlight-grid">
              {/* Left Portrait */}
              <div className="mc-spotlight-portrait-wrap">
                <img
                  src="/ceo_hariharan.jpg"
                  alt="Hariharan.D — Founder & Lead Technical Architect"
                  className="mc-spotlight-img"
                />
                <div className="mc-spotlight-portrait-overlay" />
                <div className="mc-spotlight-live-tag">
                  <span className="mc-pulse-dot" />
                  <span>LEAD ARCHITECT DIRECT LINE</span>
                </div>
              </div>

              {/* Right Bio & Direct Credentials */}
              <div className="mc-spotlight-content">
                <div className="mc-spotlight-tag">
                  <span>FOUNDER & CHIEF TECHNICAL ARCHITECT</span>
                </div>
                <h2 className="mc-spotlight-name">Hariharan.D</h2>
                <div className="mc-spotlight-role-badge">
                  <span className="mc-badge-check">✓</span>
                  <span>MICROSOFT VERIFIED PROFESSIONAL · ENTERPRISE DATA ARCHITECT</span>
                </div>
                
                <p className="mc-spotlight-p">
                  "We reject theoretical fluff and sluggish agency retainers. Every spreadsheet pipeline, 3D WebGL camera rig, and SaaS database architecture built at BEx Sigma Tech is engineered for production accuracy, zero spreadsheet crash risk, and presentation-ready executive visual clarity."
                </p>

                <div className="mc-spotlight-stats-row">
                  <div className="mc-spotlight-stat">
                    <span className="mc-stat-num">1,000+</span>
                    <span className="mc-stat-label">Production Templates</span>
                  </div>
                  <div className="mc-spotlight-stat">
                    <span className="mc-stat-num">&lt; 48h</span>
                    <span className="mc-stat-label">Rapid MVP Turnaround</span>
                  </div>
                  <div className="mc-spotlight-stat">
                    <span className="mc-stat-num">500+</span>
                    <span className="mc-stat-label">Engineers & Leaders Mentored</span>
                  </div>
                </div>

                <div className="mc-spotlight-actions">
                  <button
                    className="mc-spotlight-btn interactive"
                    onClick={() => setDemoModalOpen(true)}
                  >
                    <span>🗓️ Schedule Direct Briefing</span>
                    <span className="mc-btn-arrow">→</span>
                  </button>
                  <a
                    href="https://wa.me/919361657929?text=Hi%20Hariharan,%20I%20would%20like%20to%20discuss%20a%20project%20with%20BEx%20Sigma%20Tech."
                    target="_blank"
                    rel="noreferrer"
                    className="mc-spotlight-wa-btn interactive"
                  >
                    <span>💬 WhatsApp Quick Chat</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: BOLD MANIFESTO BANNER (Template 2 Manifesto Style) ── */}
        <section id="manifesto" className="mc-manifesto-banner">
          <div className="mc-manifesto-container">
            <span className="mc-manifesto-kicker">OUR OPERATIONAL CODE</span>
            <h2 className="mc-manifesto-headline">
              HELPING YOU BUILD AUTOMATED DATA ARCHITECTURES, FLUID 3D EXPERIENCES, AND ROCK-SOLID CODE THROUGH UNCOMPROMISING PRECISION.
            </h2>
            <div className="mc-manifesto-credit">
              <span className="mc-credit-line" />
              <span className="mc-credit-text">BEX SIGMA TECH · ZERO FLUFF METHODOLOGY</span>
              <span className="mc-credit-line" />
            </div>
          </div>
        </section>

        {/* ── SECTION 4: NUMBERED SERVICES MATRIX (Template 1 Numbered Style) ── */}
        <section id="divisions" className="mc-numbered-services-section">
          <div className="mc-section-top-row">
            <div>
              <span className="mc-section-kicker">OUR CAPABILITIES</span>
              <h2 className="mc-section-giant-heading">
                NOT JUST CODE.<br />
                A WHOLE ARCHITECTURAL APPROACH.
              </h2>
            </div>
            <p className="mc-section-lead-p">
              From turnkey, automated enterprise spreadsheet suites to high-scale custom cloud SaaS platforms and 60 FPS 3D spatial web environments.
            </p>
          </div>

          <div className="mc-numbered-list">
            {SERVICES.map((srv) => {
              const isExpanded = expandedService === srv.num
              return (
                <div
                  key={srv.num}
                  className={`mc-numbered-item ${isExpanded ? 'is-expanded' : ''}`}
                  onClick={() => setExpandedService(isExpanded ? '' : srv.num)}
                >
                  <div className="mc-item-header">
                    <span className="mc-item-num">{srv.num}</span>
                    <div className="mc-item-title-group">
                      <div className="mc-item-badge-row">
                        <span className="mc-item-code">{srv.code}</span>
                        <span className="mc-item-badge" style={{ color: srv.accent, borderColor: srv.accent }}>
                          {srv.badge}
                        </span>
                      </div>
                      <h3 className="mc-item-title">{srv.title}</h3>
                      <p className="mc-item-tagline">{srv.tagline}</p>
                    </div>
                    <span className="mc-item-toggle-icon">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mc-item-expanded-content">
                      <p className="mc-item-desc">{srv.desc}</p>
                      
                      <div className="mc-item-specs-grid">
                        {srv.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="mc-spec-pill">
                            <span className="mc-spec-dot" style={{ background: srv.accent }} />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mc-item-action-row">
                        {srv.actionMailto ? (
                          <a
                            href={`mailto:bexsigmatech@gmail.com?subject=${encodeURIComponent(srv.title + ' - Project Inquiry')}&body=Hi%20BEx%20Sigma%20Tech%20Pod,%0A%0AI%20am%20interested%20in%20your%20services%20for%20${encodeURIComponent(srv.title)}.`}
                            className="mc-item-action-btn interactive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{srv.actionLabel}</span>
                            <span className="mc-btn-arrow">→</span>
                          </a>
                        ) : (
                          <button
                            className="mc-item-action-btn interactive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNavigate(srv.actionRoute)
                            }}
                          >
                            <span>{srv.actionLabel}</span>
                            <span className="mc-btn-arrow">→</span>
                          </button>
                        )}
                        <button
                          className="mc-item-demo-btn interactive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDemoModalOpen(true)
                          }}
                        >
                          <span>Request Consultation</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── SECTION 5: WHY CHOOSE US (Template 3 Style Modular Cards) ── */}
        <section id="why" className="mc-why-section">
          <div className="mc-section-top-row">
            <div>
              <span className="mc-section-kicker">THE BEX ADVANTAGE</span>
              <h2 className="mc-section-giant-heading">
                WHY WORK WITH BEX SIGMA TECH?
              </h2>
            </div>
            <p className="mc-section-lead-p">
              How our agile architecture model compares against slow traditional consultancies and generic low-quality template sellers.
            </p>
          </div>

          <div className="mc-why-cards-grid">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="mc-why-card-editorial">
                <span className="mc-why-card-number">{item.number}</span>
                <div className="mc-why-card-top">
                  <span className="mc-why-card-icon">{item.icon}</span>
                  <span className="mc-why-card-badge">{item.badge}</span>
                </div>
                <h3 className="mc-why-card-title">{item.title}</h3>
                <p className="mc-why-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: GLOBAL NODES & TELEMETRY ── */}
        <section className="mc-nodes-section-editorial">
          <div className="mc-nodes-header-row">
            <div>
              <span className="mc-section-kicker">INFRASTRUCTURE</span>
              <h3 className="mc-nodes-title-editorial">Worldwide Strategic Mainframe</h3>
            </div>
            <span className="mc-nodes-status-live">● 4 NODES ONLINE · 99.98% UPTIME</span>
          </div>

          <div className="mc-nodes-editorial-grid">
            {GLOBAL_NODES.map((node, nIdx) => (
              <div key={nIdx} className="mc-node-card-editorial">
                <div className="mc-node-card-top">
                  <span className="mc-node-flag">{node.flag}</span>
                  <span className="mc-node-city-editorial">{node.city}</span>
                  <span className="mc-node-ping-val">{node.latency}</span>
                </div>
                <div className="mc-node-role-editorial">{node.role}</div>
                <div className="mc-node-footer">
                  <span className="mc-node-status-dot" />
                  <span>{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 7: FINAL CALL-TO-ACTION (DISPATCH) ── */}
        <section className="mc-final-cta-section">
          <div className="mc-cta-container">
            <span className="mc-cta-kicker">READY TO COMMAND YOUR DATA & TECH?</span>
            <h2 className="mc-cta-title">
              STEP INTO THE FUTURE WITH BEX SIGMA TECH
            </h2>
            <p className="mc-cta-sub">
              Get immediate lifetime access to the <strong>aIn Excel Master Suite (₹199)</strong> with 1,000+ templates, or book an architectural sprint for custom 3D web applications and cloud software.
            </p>

            <div className="mc-cta-buttons-row">
              <button
                className="mc-cta-btn-primary interactive"
                onClick={() => handleNavigate('web_dev')}
              >
                <span>🛒 Get Flagship Excel Suite (₹199 Only)</span>
                <span className="mc-btn-arrow">→</span>
              </button>
              <button
                className="mc-cta-btn-secondary interactive"
                onClick={() => setDemoModalOpen(true)}
              >
                <span>🗓️ Book Architectural Call</span>
              </button>
              <a
                href="https://wa.me/919361657929?text=Hi%20BEx%20Sigma%20Tech,%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noreferrer"
                className="mc-cta-btn-wa interactive"
              >
                <span>💬 WhatsApp Us</span>
              </a>
            </div>

            <div className="mc-cta-trust-row">
              <span>🔒 SSL Encrypted</span>
              <span>⚡ Instant Download Access</span>
              <span>⭐ 4.9/5 Rating (500+ Leaders)</span>
              <span>🛡️ Microsoft Verified Standards</span>
              <span>🇮🇳 Engineered in India</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── SCHEDULE / BOOK A CALL MODAL ── */}
      <ScheduleDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  )
}
