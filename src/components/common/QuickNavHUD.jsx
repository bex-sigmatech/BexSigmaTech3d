import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'

/* ==========================================================================
   BEX SIGMA TECH — GLOBAL QUICK NAV & ABOUT HUD
   Provides instant navigation across all sectors and an informative
   "What is BEx Sigma Tech" guide so new users are never confused.
   ========================================================================== */

const SECTOR_LINKS = [
  {
    id: 'headquarters',
    sectorId: 'headquarters',
    icon: '🪐',
    title: 'Headquarters Station',
    badge: '3D HUB',
    desc: 'Central orbital station & 3D navigation hub',
    color: '#00d4ff',
  },
  {
    id: 'webdev_store',
    sectorId: 'web_dev',
    icon: '🛒',
    title: 'Our Products Store',
    badge: 'STORE',
    desc: 'Excel Dashboards (₹256–₹349) & Digital Products',
    color: '#7c3aed',
  },
  {
    id: 'apps_store',
    sectorId: 'cloud',
    icon: '📱',
    title: 'Apps & Software Matrix',
    badge: 'SOFTWARE',
    desc: 'Future Path AI, UrDay ESBI & Custom mobile apps',
    color: '#38bdf8',
  },
  {
    id: 'client_projects_showcase',
    sectorId: 'client_projects',
    icon: '💼',
    title: 'Our Client Projects',
    badge: 'PORTFOLIO',
    desc: 'Real client case studies, FinexHub & enterprise builds',
    color: '#f59e0b',
  },
  {
    id: 'dashboard',
    sectorId: 'dashboard',
    icon: '📊',
    title: 'Analytics Dashboard',
    badge: 'METRICS',
    desc: 'Live financial telemetry, server load & performance',
    color: '#10b981',
  },
  {
    id: 'ai_core',
    sectorId: 'ai_core',
    icon: '🤖',
    title: 'SIGMA AI Concierge',
    badge: 'AI VOICE',
    desc: 'Ask questions, get recommendations or reconfigure',
    color: '#ec4899',
  },
]

export default function QuickNavHUD() {
  const { scene, navigateToSector } = useStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        setIsAboutOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentSector = SECTOR_LINKS.find((s) => s.id === scene) || {
    icon: '🚀',
    title: 'BEx Station',
    badge: 'ACTIVE',
  }

  const handleSelectSector = (sectorId) => {
    cinemaAudio.playSectorTransition()
    setIsMenuOpen(false)
    navigateToSector(sectorId)
  }

  return (
    <>
      {/* ── Persistent Floating Pill Dock at Bottom Left ── */}
      <nav className="quicknav-dock" aria-label="Quick Navigation">
        {/* Sectors Dropdown Trigger */}
        <button
          type="button"
          className={`quicknav-btn quicknav-sectors-btn interactive ${isMenuOpen ? 'active' : ''}`}
          onClick={() => {
            cinemaAudio.playBootBeep()
            setIsMenuOpen((prev) => !prev)
            setIsAboutOpen(false)
          }}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          title="Explore All Website Pages & Stores"
        >
          <span className="quicknav-btn-icon">🧭</span>
          <span className="quicknav-btn-text">EXPLORE SECTORS</span>
          <span className="quicknav-current-badge">{currentSector.icon}</span>
          <span className="quicknav-chevron">{isMenuOpen ? '▼' : '▲'}</span>
        </button>

        {/* About BEx Sigma Tech Modal Trigger */}
        <button
          type="button"
          className={`quicknav-btn quicknav-about-btn interactive ${isAboutOpen ? 'active' : ''}`}
          onClick={() => {
            cinemaAudio.playBootBeep()
            setIsAboutOpen((prev) => !prev)
            setIsMenuOpen(false)
          }}
          title="What is BEx Sigma Tech? & How to Use"
        >
          <span className="quicknav-btn-icon">ℹ️</span>
          <span className="quicknav-btn-text">WHAT IS THIS?</span>
        </button>
      </nav>

      {/* ── SECTORS POPOVER MENU ── */}
      {isMenuOpen && (
        <div className="quicknav-popover-overlay" onClick={() => setIsMenuOpen(false)}>
          <div
            className="quicknav-popover"
            onClick={(e) => e.stopPropagation()}
            role="menu"
            aria-label="Website Sectors"
          >
            <div className="quicknav-popover-header">
              <div className="quicknav-header-title">
                <span className="quicknav-header-dot" />
                <span>DIRECT JUMP · ALL SECTORS</span>
              </div>
              <button
                type="button"
                className="quicknav-close-btn interactive"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="quicknav-items-grid">
              {SECTOR_LINKS.map((item) => {
                const isActive = scene === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`quicknav-item interactive ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectSector(item.sectorId)}
                    style={{ '--item-accent': item.color }}
                  >
                    <div className="quicknav-item-top">
                      <span className="quicknav-item-icon">{item.icon}</span>
                      <span className="quicknav-item-badge" style={{ color: item.color, borderColor: item.color }}>
                        {item.badge}
                      </span>
                      {isActive && <span className="quicknav-active-pill">CURRENT</span>}
                    </div>
                    <div className="quicknav-item-title">{item.title}</div>
                    <div className="quicknav-item-desc">{item.desc}</div>
                  </button>
                )
              })}
            </div>

            <div className="quicknav-popover-footer">
              <span className="quicknav-footer-hint">
                💡 Tip: You can also use the microphone button at the bottom-right to navigate by voice!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── "WHAT IS BEX SIGMA TECH?" COMPREHENSIVE ONBOARDING MODAL ── */}
      {isAboutOpen && (
        <div className="quicknav-modal-backdrop" onClick={() => setIsAboutOpen(false)}>
          <div
            className="quicknav-about-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
          >
            {/* Modal Header */}
            <div className="quicknav-modal-header">
              <div>
                <div className="quicknav-modal-brand-tag">BEX SIGMA TECH · COMPANY OVERVIEW</div>
                <h2 id="about-modal-title" className="quicknav-modal-title">
                  Next-Gen Digital Experiences & SaaS Products
                </h2>
              </div>
              <button
                type="button"
                className="quicknav-modal-close interactive"
                onClick={() => setIsAboutOpen(false)}
                aria-label="Close about modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="quicknav-modal-body">
              {/* Introduction Banner */}
              <div className="quicknav-intro-card">
                <p className="quicknav-intro-lead">
                  <strong>BEx Sigma Tech</strong> is a modern software and digital solutions powerhouse. We specialize
                  in high-impact <strong>Meta Ads</strong>, <strong>Full-Stack Web Development</strong>, ready-to-use{' '}
                  <strong>Business Excel Dashboards</strong>, <strong>Mobile Applications</strong>, and custom{' '}
                  <strong>AI Automation</strong>.
                </p>
                <div className="quicknav-pill-row">
                  <span className="quicknav-pill">🌐 Our Products</span>
                  <span className="quicknav-pill">📈 Meta Ads</span>
                  <span className="quicknav-pill">📊 Excel Dashboards</span>
                  <span className="quicknav-pill">📱 Mobile Apps</span>
                  <span className="quicknav-pill">🤖 AI Automation</span>
                </div>
              </div>

              {/* What We Offer Grid */}
              <div className="quicknav-section-title">
                <span>OUR CORE SERVICES & PRODUCTS</span>
              </div>
              <div className="quicknav-services-grid">
                <div className="quicknav-service-card">
                  <div className="quicknav-service-header">
                    <span className="quicknav-service-icon">🛒</span>
                    <h3>Excel Dashboards Store</h3>
                  </div>
                  <p>
                    Ready-to-use business intelligence spreadsheets (Sales, Finance, Inventory, HR) starting from{' '}
                    <strong>₹256 to ₹349</strong> with instant download.
                  </p>
                  <button
                    type="button"
                    className="quicknav-service-action interactive"
                    onClick={() => handleSelectSector('web_dev')}
                  >
                    View Dashboards Store →
                  </button>
                </div>

                <div className="quicknav-service-card">
                  <div className="quicknav-service-header">
                    <span className="quicknav-service-icon">💻</span>
                    <h3>Web & 3D Development</h3>
                  </div>
                  <p>
                    Ultra-fast React websites, 3D WebGL interactive experiences (like this one!), enterprise SaaS portals,
                    and conversion-optimized landing pages.
                  </p>
                  <button
                    type="button"
                    className="quicknav-service-action interactive"
                    onClick={() => handleSelectSector('web_dev')}
                  >
                    Explore Web Services →
                  </button>
                </div>

                <div className="quicknav-service-card">
                  <div className="quicknav-service-header">
                    <span className="quicknav-service-icon">📱</span>
                    <h3>Mobile Apps & Software</h3>
                  </div>
                  <p>
                    Flagship consumer apps like <em>Future Path AI</em> and <em>UrDay ESBI</em>, plus bespoke Flutter and
                    React Native mobile app engineering.
                  </p>
                  <button
                    type="button"
                    className="quicknav-service-action interactive"
                    onClick={() => handleSelectSector('cloud')}
                  >
                    Explore Apps Matrix →
                  </button>
                </div>

                <div className="quicknav-service-card">
                  <div className="quicknav-service-header">
                    <span className="quicknav-service-icon">💼</span>
                    <h3>Client Case Studies</h3>
                  </div>
                  <p>
                    See real results from businesses we have helped scale, including <em>FinexHub</em>, enterprise
                    deployments, and AI workflow automation.
                  </p>
                  <button
                    type="button"
                    className="quicknav-service-action interactive"
                    onClick={() => handleSelectSector('client_projects')}
                  >
                    View Client Projects →
                  </button>
                </div>
              </div>

              {/* How To Navigate This Site */}
              <div className="quicknav-section-title">
                <span>HOW TO NAVIGATE THIS WEBSITE</span>
              </div>
              <div className="quicknav-instructions-list">
                <div className="quicknav-instruction-step">
                  <div className="quicknav-step-number">1</div>
                  <div className="quicknav-step-text">
                    <h4>3D Orbital HQ (The Main Experience)</h4>
                    <p>
                      In the Headquarters scene, rotate or scroll through glowing planetary orbs. Click the{' '}
                      <strong>ENTER ⚡</strong> button in the bottom capsule to dive into any department.
                    </p>
                  </div>
                </div>

                <div className="quicknav-instruction-step">
                  <div className="quicknav-step-number">2</div>
                  <div className="quicknav-step-text">
                    <h4>Quick Navigation Menu (Instant Access)</h4>
                    <p>
                      Click <strong>EXPLORE SECTORS</strong> anytime at the bottom-left to jump straight to our
                      Dashboard, Store, Apps, or Case Studies without waiting.
                    </p>
                  </div>
                </div>

                <div className="quicknav-instruction-step">
                  <div className="quicknav-step-number">3</div>
                  <div className="quicknav-step-text">
                    <h4>Talk to SIGMA (Real-Time Voice AI)</h4>
                    <p>
                      Click the glowing microphone button in the bottom-right corner to speak naturally with SIGMA! Ask
                      questions, enquire about pricing, or say <em>"Take me to the store"</em>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact / Inquiries Callout */}
              <div className="quicknav-contact-card">
                <div className="quicknav-contact-text">
                  <h3>Ready to build your next digital product?</h3>
                  <p>Get in touch with our team for web development, Meta ads campaigns, or custom software.</p>
                </div>
                <div className="quicknav-contact-buttons">
                  <a
                    href="https://wa.me/919940864319?text=Hi%20BEx%20Sigma%20Tech%2C%20I%20am%20interested%20in%20your%20services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quicknav-cta-btn quicknav-whatsapp interactive"
                  >
                    💬 Chat on WhatsApp
                  </a>
                  <button
                    type="button"
                    className="quicknav-cta-btn quicknav-explore interactive"
                    onClick={() => handleSelectSector('web_dev')}
                  >
                    🛒 Explore Store & Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
