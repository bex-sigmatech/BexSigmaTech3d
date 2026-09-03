import React, { useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import '../../styles/appsStore.css'

/* ==========================================================================
   BEX SIGMA TECH — APPS & MOBILE PRODUCTS STORE
   Featuring Future Path & UrDay + Custom App Development Advertisement
   ========================================================================== */

const APP_PRODUCTS = [
  {
    id: 'future-path',
    badge: '🚀 AI CAREER GPS',
    name: 'Future Path',
    tagline: 'From Career Confusion to an Actionable Daily Roadmap',
    shortDesc: 'AI uncovers your ideal career, analyzes your resume with ATS scoring, and builds a day-by-day learning roadmap to reach your goals.',
    conceptTheme: 'roadmap',
    heroMetric: { label: 'CAREER CLARITY', value: '98% Match' },
    transformation: {
      from: '“Unsure what career to choose”',
      to: '“Clear roadmap & daily actions”'
    },
    keyHighlights: [
      { icon: '🧭', name: 'Career Explorer' },
      { icon: '🤖', name: 'FP AI Chatbot' },
      { icon: '📄', name: 'Resume Analyzer' },
      { icon: '📅', name: 'Daily Schedule' },
    ],
    modules: [
      { title: 'Career Explorer', desc: 'Explore and discover suitable career options.' },
      { title: 'FP Career Chatbot', desc: 'Ask AI questions about careers and get personalized guidance.' },
      { title: 'FP Resume Analyzer', desc: 'Analyze and improve resumes with smart AI feedback.' },
      { title: 'Daily Schedule', desc: 'Follow a personalized, day-by-day roadmap.' },
      { title: 'My Journey', desc: 'Track the career path the user has chosen.' },
      { title: 'Roadmap, Tasks & Progress', desc: 'Organize learning tasks and monitor career-development progress.' },
      { title: 'Profile', desc: 'Manage the user’s personal information and journey.' }
    ],
    price: 499,
    priceDisplay: '₹499',
    originalPrice: '₹999',
    currency: 'INR',
    color: '#00d4ff',
    glowColor: 'rgba(0, 212, 255, 0.25)',
    logo: '/future_path_logo.jpg',
    tech: ['React Native', 'Expo', 'AI Career Core', 'SQLite Sync'],
    platforms: ['iOS', 'Android', 'Web PWA'],
    deliveryDays: 3,
    popular: true,
    rating: '4.9 ★★★★★',
    downloads: '10K+ Active Users',
    mockScreens: [
      { title: 'Career Explorer & AI Chat', subtitle: 'Target: AI Engineer · 100% Match', desc: 'Explore career options with the FP Career Chatbot giving tailored guidance.' },
      { title: 'Daily Schedule & Roadmap', subtitle: 'Day 14 of 90 · 3 Tasks Pending', desc: 'Follow your day-by-day personalized learning tasks and milestones.' },
      { title: 'FP Resume Analyzer', subtitle: 'ATS Score: 94/100 · 6 Improvements Applied', desc: 'Instant AI critique optimizing keywords and impact metrics.' }
    ]
  },
  {
    id: 'ur-day',
    badge: '⚡ HABITS & CASH FLOW',
    name: 'UrDay',
    tagline: 'Build Unbreakable Habits & Master Your Money',
    shortDesc: 'Track daily habits with visual streak grids, enforce accountability with missed reflections, and take control of your cash flow with ESBI budgeting.',
    conceptTheme: 'telemetry',
    heroMetric: { label: 'HABIT CONSISTENCY', value: '42-Day Streak 🔥' },
    transformation: {
      from: '“Disorganized & stressed about money”',
      to: '“Disciplined & financially clear”'
    },
    keyHighlights: [
      { icon: '⚡', name: 'Habit Tracker' },
      { icon: '✍️', name: 'Missed Reflection' },
      { icon: '💰', name: 'Cash Flow & Debt' },
      { icon: '🎯', name: 'Goal Milestones' },
    ],
    modules: [
      { title: 'Daily Dashboard', desc: "Get an instant overview of today's priorities, active streaks, completion rates, and financial status." },
      { title: 'Habit Tracker', desc: 'Build consistency with custom schedules, visual weekly grids, interactive check-ins, and streak celebrations.' },
      { title: 'Missed-Habit Reflection', desc: 'Build genuine accountability by writing mandatory reflections whenever scheduled habits are missed.' },
      { title: 'Goal Tracker', desc: 'Break down long-term personal and career objectives into trackable milestones and monitor progress to completion.' },
      { title: 'Cash Flow & Debt Planner', desc: 'Manage money using the ESBI income & ESDI outflow system, multi-account pockets (Bank, Cash, Card), and debt payoff tracking.' },
      { title: 'Smart Reminders', desc: 'Stay disciplined with timely scheduled notifications for daily habits and milestones.' },
      { title: 'Profile & Lifetime Stats', desc: 'View current and best streaks, habit completion records, and growth analytics.' }
    ],
    color: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.25)',
    logo: '/urday_logo.png',
    tech: ['Flutter', 'Dart', 'Local SQLite', 'ESBI Cash Flow'],
    platforms: ['iOS', 'Android', 'macOS', 'Windows'],
    rating: '4.95 ★★★★★',
    downloads: '15K+ Active Users',
    mockScreens: [
      { title: 'Daily Dashboard & Streaks', subtitle: '4 Active Streaks · 92% Today Completion', desc: 'Instant overview of today’s priorities, active streaks, and cash flow balance.' },
      { title: 'Cash Flow & Debt Planner', subtitle: 'ESBI Income & ESDI Outflow Active', desc: 'Manage multi-account pockets (Bank, Cash, Card) and debt payoff tracking.' },
      { title: 'Missed-Habit Reflection', subtitle: 'Accountability Protocol Engaged', desc: 'Mandatory reflection entries build genuine consistency and discipline.' }
    ]
  }
]

export default function AppsStore() {
  const { userName, exitWebDevStore } = useStore()
  const [selectedAppModal, setSelectedAppModal] = useState(null)
  const [activeMockTab, setActiveMockTab] = useState(0)

  // Custom App Inquiry Form State
  const [customAppPlatform, setCustomAppPlatform] = useState('Cross-Platform (iOS & Android)')
  const [customAppScale, setCustomAppScale] = useState('Commercial Production (4 - 6 Weeks)')
  const [customAppDesc, setCustomAppDesc] = useState('')
  const [customAppEmail, setCustomAppEmail] = useState('')
  const [inquirySent, setInquirySent] = useState(false)

  // Audio effect on mount
  useEffect(() => {
    cinemaAudio.unlock()
    cinemaAudio.setScene('headquarters')
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
  }, [])

  // Handle Custom App Inquiry Submission
  const handleInquirySubmit = (e) => {
    e.preventDefault()
    cinemaAudio.playAccessGrantedChime()
    setInquirySent(true)
    const mailSubject = encodeURIComponent(`Custom App Build Inquiry: ${customAppPlatform}`)
    const mailBody = encodeURIComponent(
      `Hi BEx Sigma Tech Team,\n\nI want to build a custom application with BEx Sigma Tech.\n\n` +
      `Platform: ${customAppPlatform}\n` +
      `Target Scale & Timeline: ${customAppScale}\n` +
      `User Email: ${customAppEmail}\n\n` +
      `Project Scope:\n${customAppDesc}\n\n` +
      `Looking forward to connecting!`
    )
    window.location.href = `mailto:bexsigmatech@gmail.com?subject=${mailSubject}&body=${mailBody}`
  }

  return (
    <div className="webdev-store-container apps-store-container">
      {/* Background Holographic Glow */}
      <div className="webdev-store-bg apps-store-bg" />

      {/* ── Top Header ── */}
      <header className="webdev-store-header">
        <div className="webdev-header-left">
          <button className="webdev-back-btn interactive" onClick={exitWebDevStore}>
            ← BACK TO HQ
          </button>
          <div className="webdev-header-titles">
            <span className="webdev-dept-label" style={{ color: '#00d4ff' }}>
              APPS & MOBILE PLATFORM DIVISION
            </span>
            <h1 className="webdev-store-title">Autonomous Application Matrix</h1>
            <p className="webdev-store-sub">
              Operator: <strong style={{ color: '#00d4ff' }}>{userName || 'COMMANDER'}</strong> · Native & Cross-Platform Software
            </p>
          </div>
        </div>

        <div className="webdev-header-right">
          <div className="webdev-secure-badge">
            <span>🔒</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>100% Verified</div>
              <div style={{ fontSize: '0.62rem', opacity: 0.65 }}>App Store & Play Store Ready</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="apps-store-body">
        {/* Section Header */}
        <div className="apps-hero-banner">
          <div className="mc-section-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="mc-eyebrow-dot" style={{ background: '#00d4ff' }} />
            FEATURED AUTONOMOUS APPLICATIONS
          </div>
          <h2 className="apps-hero-title">Production-Ready Mobile & Desktop Software</h2>
          <p className="apps-hero-desc">
            Explore our flagship consumer & enterprise mobile apps engineered for speed, privacy, and seamless cross-platform performance.
          </p>
        </div>

        {/* ── 2 Featured Products Grid ── */}
        <div className="apps-products-grid">
          {APP_PRODUCTS.map((app) => {
            const isFuturePath = app.id === 'future-path'
            return (
              <div
                key={app.id}
                className="apps-card interactive"
                style={{
                  '--card-accent': app.color,
                  '--card-glow': app.glowColor,
                }}
                onClick={() => {
                  cinemaAudio.playOrbSelect()
                  setSelectedAppModal(app)
                  setActiveMockTab(0)
                }}
              >
                {/* Card Top Row */}
                <div className="apps-card-top">
                  <div className="apps-card-badge">{app.badge}</div>
                  <div className="apps-card-rating">{app.rating}</div>
                </div>

                {/* Card Main Info */}
                <div className="apps-card-center">
                  <div className="apps-logo-wrap">
                    <img src={app.logo} alt={app.name} className="apps-logo-img" />
                    <div className="apps-logo-glow" />
                  </div>
                  <div className="apps-meta">
                    <h3 className="apps-title">{app.name}</h3>
                    <p className="apps-tagline">{app.tagline}</p>
                    <div className="apps-platforms-row">
                      {app.platforms.map((p, idx) => (
                        <span key={idx} className="apps-platform-tag">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short & Sweet Description */}
                <p className="apps-desc">{app.shortDesc}</p>

                {/* Unique Concept Widget per Product */}
                {isFuturePath ? (
                  /* ── Future Path: Interactive AI Career Stepper ── */
                  <div className="apps-concept-widget future-path-widget">
                    <div className="apps-widget-header">
                      <span className="apps-widget-title">🧭 AI CAREER PROGRESSION</span>
                      <span className="apps-widget-score">{app.heroMetric.value}</span>
                    </div>

                    <div className="apps-roadmap-stepper">
                      <div className="apps-step-node active">
                        <span className="node-icon">🧭</span>
                        <span className="node-text">Explore</span>
                      </div>
                      <div className="apps-step-line active" />
                      <div className="apps-step-node active">
                        <span className="node-icon">🤖</span>
                        <span className="node-text">AI Guide</span>
                      </div>
                      <div className="apps-step-line" />
                      <div className="apps-step-node">
                        <span className="node-icon">📅</span>
                        <span className="node-text">Daily Action</span>
                      </div>
                    </div>

                    <div className="apps-transformation-pill">
                      <span className="trans-from">{app.transformation.from}</span>
                      <span className="trans-arrow">➔</span>
                      <span className="trans-to">{app.transformation.to}</span>
                    </div>
                  </div>
                ) : (
                  /* ── UrDay: Live Discipline & Cash Flow Telemetry ── */
                  <div className="apps-concept-widget ur-day-widget track-me-widget">
                    <div className="apps-widget-header">
                      <span className="apps-widget-title">⚡ DISCIPLINE & CASH FLOW MATRIX</span>
                      <span className="apps-widget-score" style={{ color: '#00ff88' }}>{app.heroMetric.value}</span>
                    </div>

                    <div className="apps-telemetry-grid">
                      <div className="apps-metric-box">
                        <div className="metric-icon">🔥</div>
                        <div className="metric-val">100%</div>
                        <div className="metric-lbl">Habit Streaks</div>
                      </div>
                      <div className="apps-metric-box">
                        <div className="metric-icon">✍️</div>
                        <div className="metric-val" style={{ fontSize: '0.72rem' }}>Mandatory</div>
                        <div className="metric-lbl">Reflections</div>
                      </div>
                      <div className="apps-metric-box">
                        <div className="metric-icon">💰</div>
                        <div className="metric-val" style={{ color: '#00ff88', fontSize: '0.72rem' }}>ESBI / ESDI</div>
                        <div className="metric-lbl">Cash Flow</div>
                      </div>
                    </div>

                    <div className="apps-transformation-pill">
                      <span className="trans-from">{app.transformation.from}</span>
                      <span className="trans-arrow">➔</span>
                      <span className="trans-to">{app.transformation.to}</span>
                    </div>
                  </div>
                )}

                {/* 4 Quick Highlights */}
                <div className="apps-quick-highlights">
                  {app.keyHighlights.map((kh, idx) => (
                    <div key={idx} className="apps-highlight-chip">
                      <span>{kh.icon}</span>
                      <span>{kh.name}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="apps-tech-cloud">
                  {app.tech.map((t, idx) => (
                    <span key={idx} className="apps-tech-pill">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Card Footer Actions */}
                <div className="apps-card-footer">
                  <div className="apps-status-pill">
                    <span className="apps-status-dot" style={{ background: app.color }} />
                    <span>VERIFIED PRODUCTION PLATFORM</span>
                  </div>
                  <button
                    className="apps-view-specs-btn interactive"
                    onClick={(e) => {
                      e.stopPropagation()
                      cinemaAudio.playOrbSelect()
                      setSelectedAppModal(app)
                      setActiveMockTab(0)
                    }}
                  >
                    <span>✦ EXPLORE PLATFORM ARCHITECTURE</span>
                    <span className="apps-btn-arrow">→</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            HIGH-CONVERTING ADVERTISEMENT: BUILD YOUR CUSTOM APP
           ══════════════════════════════════════════════════════════════════════ */}
        <section className="apps-custom-build-ad">
          <div className="apps-ad-glow-accent" />

          <div className="apps-ad-header">
            <div className="mc-section-eyebrow" style={{ color: '#00d4ff' }}>
              <span className="mc-eyebrow-dot" style={{ background: '#00d4ff' }} />
              CUSTOM APPLICATION ENGINEERING LAB
            </div>
            <h2 className="apps-ad-title">Have An App Idea? Let's Architect It Together.</h2>
            <p className="apps-ad-subtitle">
              We turn rough concepts and business workflows into high-performance, beautiful mobile & desktop apps published on the App Store and Google Play Store in weeks.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="apps-ad-pillars-grid">
            <div className="apps-ad-pillar-card">
              <div className="apps-pillar-icon">📱</div>
              <h4>Cross-Platform 60 FPS</h4>
              <p>One unified codebase for iOS, Android, macOS, and Web with native performance using React Native & Flutter.</p>
            </div>

            <div className="apps-ad-pillar-card">
              <div className="apps-pillar-icon">🔒</div>
              <h4>Encrypted & Offline Sync</h4>
              <p>Local SQLite / WatermelonDB databases with zero-latency synchronization and end-to-end cloud security.</p>
            </div>

            <div className="apps-ad-pillar-card">
              <div className="apps-pillar-icon">🎨</div>
              <h4>Apple Park Design Standard</h4>
              <p>Silky glassmorphic interfaces, fluid micro-interactions, dark mode elegance, and haptic feedback.</p>
            </div>

            <div className="apps-ad-pillar-card">
              <div className="apps-pillar-icon">🚀</div>
              <h4>100% Store Approval SLA</h4>
              <p>We manage certificates, test flights, Google Play Console compliance, and ensure zero-rejection submissions.</p>
            </div>
          </div>

          {/* Interactive Custom App Inquiry Section */}
          <div className="apps-inquiry-box">
            <h3 className="apps-inquiry-title">Start Your App Development Sprint</h3>
            <p className="apps-inquiry-desc">
              Select your specifications below to connect directly with BEx Sigma Tech for architecture planning and an instant delivery estimate.
            </p>

            <form onSubmit={handleInquirySubmit} className="apps-inquiry-form">
              <div className="apps-form-row">
                <div className="apps-form-group">
                  <label>TARGET PLATFORMS</label>
                  <select
                    value={customAppPlatform}
                    onChange={(e) => setCustomAppPlatform(e.target.value)}
                    className="apps-select interactive"
                  >
                    <option>Cross-Platform (iOS & Android)</option>
                    <option>iOS Native (Swift / SwiftUI)</option>
                    <option>Android Native (Kotlin / Jetpack)</option>
                    <option>Progressive Web App (PWA)</option>
                    <option>Enterprise Cloud Backend + API</option>
                  </select>
                </div>

                <div className="apps-form-group">
                  <label>TARGET SCALE & TIMELINE</label>
                  <select
                    value={customAppScale}
                    onChange={(e) => setCustomAppScale(e.target.value)}
                    className="apps-select interactive"
                  >
                    <option>Sprint MVP (1-2 Weeks · ₹30,000 - ₹50,000)</option>
                    <option>Production App (2-4 Weeks · ₹50,000 - ₹1,20,000)</option>
                    <option>Custom Enterprise Ecosystem (Dedicated Engineering)</option>
                  </select>
                </div>
              </div>

              <div className="apps-form-group full-width">
                <label>YOUR CONTACT EMAIL</label>
                <input
                  type="email"
                  placeholder="founder@company.com"
                  value={customAppEmail}
                  onChange={(e) => setCustomAppEmail(e.target.value)}
                  required
                  className="apps-input interactive"
                />
              </div>

              <div className="apps-form-group full-width">
                <label>DESCRIBE YOUR APP CONCEPT & CORE FEATURES</label>
                <textarea
                  rows={3}
                  placeholder="e.g. An AI-powered productivity workspace with real-time sync, auth, and automated billing..."
                  value={customAppDesc}
                  onChange={(e) => setCustomAppDesc(e.target.value)}
                  required
                  className="apps-textarea interactive"
                />
              </div>

              <div className="apps-form-submit-row">
                <button type="submit" className="apps-submit-btn interactive">
                  ⚡ TRANSMIT APP BLUEPRINT TO BEX SIGMA TECH
                </button>
                <a
                  href="mailto:bexsigmatech@gmail.com?subject=Direct%20App%20Development%20Inquiry"
                  className="apps-direct-mail-btn interactive"
                >
                  ✉ DIRECT EMAIL: bexsigmatech@gmail.com
                </a>
              </div>

              {inquirySent && (
                <div className="apps-success-banner">
                  ✓ Transmission Prepared! Opening your email client to send directly to BEx Sigma Tech.
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* ── Interactive App Simulator Modal ── */}
      {selectedAppModal && (
        <div className="apps-modal-overlay" onClick={() => setSelectedAppModal(null)}>
          <div className="apps-modal-box interactive" onClick={(e) => e.stopPropagation()}>
            <div className="apps-modal-header">
              <div className="apps-modal-title-group">
                <img src={selectedAppModal.logo} alt={selectedAppModal.name} className="apps-modal-logo" />
                <div>
                  <span className="apps-modal-badge">{selectedAppModal.badge}</span>
                  <h3 className="apps-modal-title">{selectedAppModal.name}</h3>
                </div>
              </div>
              <button className="apps-modal-close interactive" onClick={() => setSelectedAppModal(null)}>
                ✕
              </button>
            </div>

            <div className="apps-modal-body">
              {/* Phone Frame Simulator */}
              <div className="apps-phone-mockup">
                <div className="apps-phone-notch" />
                <div className="apps-phone-screen">
                  <div className="apps-screen-header">
                    <span>9:41</span>
                    <span>5G 100%</span>
                  </div>

                  <div className="apps-screen-app-bar">
                    <span className="apps-screen-app-title">{selectedAppModal.name}</span>
                    <span className="apps-screen-live-dot" />
                  </div>

                  {/* Tabs */}
                  <div className="apps-screen-tabs">
                    {selectedAppModal.mockScreens.map((screen, idx) => (
                      <button
                        key={idx}
                        className={`apps-screen-tab interactive ${activeMockTab === idx ? 'active' : ''}`}
                        onClick={() => {
                          cinemaAudio.playOrbHover()
                          setActiveMockTab(idx)
                        }}
                      >
                        {screen.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Screen Content View */}
                  <div className="apps-screen-view">
                    <h4>{selectedAppModal.mockScreens[activeMockTab]?.title}</h4>
                    <div className="apps-screen-sub">{selectedAppModal.mockScreens[activeMockTab]?.subtitle}</div>
                    <p className="apps-screen-desc">{selectedAppModal.mockScreens[activeMockTab]?.desc}</p>

                    <div className="apps-screen-telemetry-box">
                      <div className="apps-telemetry-line">⚡ Engine: Active nominal (60 FPS)</div>
                      <div className="apps-telemetry-line">🔒 Storage: On-Device Encrypted</div>
                      <div className="apps-telemetry-line">🌐 Status: Verified Production Build</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs & Ordering Details */}
              <div className="apps-modal-details">
                <div className="apps-transformation-box" style={{ marginBottom: 18 }}>
                  <div className="apps-trans-label" style={{ color: selectedAppModal.color }}>
                    <span className="apps-trans-dot" style={{ background: selectedAppModal.color }} />
                    TRANSFORMATION IMPACT
                  </div>
                  <div className="apps-trans-steps">
                    <div className="apps-trans-step from">{selectedAppModal.transformation.from}</div>
                    <div className="apps-trans-arrow">➔</div>
                    <div className="apps-trans-step to">{selectedAppModal.transformation.to}</div>
                  </div>
                </div>

                <h4>Architecture & Core Modules</h4>
                <ul className="apps-modal-features">
                  {selectedAppModal.modules.map((m, i) => (
                    <li key={i}>
                      <strong style={{ color: '#fff' }}>• {m.title}</strong>: {m.desc}
                    </li>
                  ))}
                </ul>

                <div className="apps-modal-action-box">
                  <div className="apps-modal-status-badge">
                    <span className="apps-modal-status-dot" style={{ background: selectedAppModal.color }} />
                    <span>Production Architecture · Custom Deployment & White-Label Available</span>
                  </div>
                  <a
                    href={`mailto:bexsigmatech@gmail.com?subject=${encodeURIComponent(`Inquiry Regarding ${selectedAppModal.name} Platform`)}&body=${encodeURIComponent(`Hi BEx Sigma Tech Team,\n\nI am interested in the ${selectedAppModal.name} platform and custom application engineering with BEx Sigma Tech.\n\nLooking forward to connecting!`)}`}
                    className="apps-modal-inquire-btn interactive"
                  >
                    ✉ INQUIRE ABOUT THIS PLATFORM →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
