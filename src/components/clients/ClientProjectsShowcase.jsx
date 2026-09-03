import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { cinemaAudio } from '../../audio/CinematicAudioEngine'
import { voiceEmitter } from '../../audio/AIVoiceEngine'
import '../../styles/clientProjects.css'

/* ==========================================================================
   BEX SIGMA TECH — CLIENT DOSSIER INTELLIGENCE BOARD
   A unique "case file" portfolio — each client is a classified dossier
   ========================================================================== */

const CLIENT_DOSSIERS = [
  {
    id: 'finexhub',
    codename: 'OPERATION GOLDVAULT',
    status: 'ACTIVE · ONGOING',
    statusColor: '#00ff88',
    clientName: 'FinexHub',
    industry: 'Fintech · Trading Education · Wealth Tech',
    websiteUrl: 'https://finexhub.online',
    websiteDomain: 'finexhub.online',
    instagramHandle: '@finex.hub',
    instagramUrl: 'https://instagram.com/finex.hub',
    clientEmail: 'finexhub3@gmail.com',
    logo: '/finexhub_logo.jpg',
    webPreviewImg: '/finexhub_web_preview.jpg',
    instaPreviewImg: '/finexhub_insta_preview.jpg',
    briefing: 'Full-spectrum digital ecosystem deployment — custom fintech web platform, daily Instagram content engine, brand identity architecture, and automated client operations pipeline.',
    color: '#f59e0b',
    services: ['Website', 'Instagram', 'Brand Design', 'Client Ops'],
    timeline: [
      { phase: 'Discovery & Architecture', status: 'done', detail: 'Brand audit, wireframes, UX research' },
      { phase: 'Web Platform Engineering', status: 'done', detail: 'React + Vite glassmorphic trading UI' },
      { phase: 'Instagram Launch & Growth', status: 'done', detail: 'Content templates, reel strategy, community' },
      { phase: 'Ongoing Management', status: 'active', detail: 'Daily content, updates, maintenance' }
    ],
    deliverables: [
      { icon: '🌐', label: 'finexhub.online', type: 'Web Platform', url: 'https://finexhub.online' },
      { icon: '📸', label: '@finex.hub', type: 'Instagram Channel', url: 'https://instagram.com/finex.hub' },
      { icon: '🎨', label: 'Brand Guidelines', type: 'Visual Identity', url: null },
      { icon: '🔒', label: 'Client Mail Gateway', type: 'Operations', url: null }
    ],
    techStack: ['React.js', 'Vite', 'Node.js', 'PostgreSQL', 'Edge CDN', 'Adobe CC', 'Meta Graph API'],
    testimonial: {
      quote: 'BEx Sigma Tech delivered far beyond expectations. Their execution velocity and design standards are world-class.',
      author: 'Leadership Team · FinexHub'
    }
  }
]

export default function ClientProjectsShowcase() {
  const { userName, exitClientProjects } = useStore()
  const [activeDossier, setActiveDossier] = useState(null)
  const [expandedSection, setExpandedSection] = useState('overview')
  const dossierRef = useRef(null)

  // Inquiry form
  const [formData, setFormData] = useState({
    service: 'Full-Stack Web + Social Media',
    name: '', email: '', scope: '',
    budget: 'Custom Enterprise (~₹50K - ₹1.5L)'
  })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    cinemaAudio.unlock()
    cinemaAudio.setScene('headquarters')
    voiceEmitter.emit('MISSION_BRIEF_VISIBLE')
  }, [])

  const openDossier = (d) => {
    cinemaAudio.playOrbSelect()
    setActiveDossier(d)
    setExpandedSection('overview')
    setTimeout(() => dossierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const closeDossier = () => {
    cinemaAudio.playOrbHover()
    setActiveDossier(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    cinemaAudio.playAccessGrantedChime()
    setSent(true)
    const s = encodeURIComponent(`Client Inquiry: ${formData.name || 'New Project'}`)
    const b = encodeURIComponent(
      `Project: ${formData.name}\nService: ${formData.service}\nBudget: ${formData.budget}\nEmail: ${formData.email}\n\nScope:\n${formData.scope}`
    )
    window.location.href = `mailto:bexsigmatech@gmail.com?subject=${s}&body=${b}`
  }

  return (
    <div className="cp-root">
      <div className="cp-bg-noise" />

      {/* ── Topbar ── */}
      <header className="cp-topbar">
        <button className="cp-back interactive" onClick={exitClientProjects}>← HQ</button>
        <div className="cp-topbar-center">
          <div className="cp-topbar-eyebrow">SIGMA PROTOCOL · CLIENT INTELLIGENCE BOARD</div>
          <h1 className="cp-topbar-title">Our Client Projects</h1>
        </div>
        <div className="cp-topbar-operator">
          <span className="cp-operator-dot" />
          <span>{userName || 'COMMANDER'}</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          SECTION 1: DOSSIER GRID (Case File Cards)
         ══════════════════════════════════════════════ */}
      <section className="cp-grid-section">
        <div className="cp-section-label">
          <span className="cp-label-line" />
          <span>CLASSIFIED CASE FILES</span>
          <span className="cp-label-line" />
        </div>

        <div className="cp-dossier-grid">
          {CLIENT_DOSSIERS.map((d) => (
            <button
              key={d.id}
              className={`cp-dossier-card interactive ${activeDossier?.id === d.id ? 'selected' : ''}`}
              onClick={() => openDossier(d)}
              style={{ '--card-accent': d.color }}
            >
              <div className="cp-card-stamp">
                <span className="cp-stamp-status" style={{ color: d.statusColor }}>{d.status}</span>
              </div>
              <div className="cp-card-top">
                <div className="cp-card-logo">
                  <img src={d.logo} alt={d.clientName} />
                </div>
                <div>
                  <div className="cp-card-codename">{d.codename}</div>
                  <h3 className="cp-card-client">{d.clientName}</h3>
                  <div className="cp-card-industry">{d.industry}</div>
                </div>
              </div>
              <p className="cp-card-brief">{d.briefing}</p>
              <div className="cp-card-tags">
                {d.services.map((s, i) => <span key={i} className="cp-service-tag">{s}</span>)}
              </div>
              <div className="cp-card-action">
                OPEN CASE FILE →
              </div>
            </button>
          ))}

          {/* Future Client Placeholder */}
          <div className="cp-dossier-card cp-placeholder-card">
            <div className="cp-placeholder-icon">+</div>
            <div className="cp-placeholder-text">Your Brand Here</div>
            <div className="cp-placeholder-sub">Submit a project inquiry below to start your case file</div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2: EXPANDED DOSSIER (Case File Detail)
         ══════════════════════════════════════════════ */}
      {activeDossier && (
        <section className="cp-dossier-detail" ref={dossierRef}>
          {/* Dossier Header Strip */}
          <div className="cp-detail-header" style={{ '--accent': activeDossier.color }}>
            <div className="cp-detail-header-left">
              <div className="cp-detail-codename">{activeDossier.codename}</div>
              <h2 className="cp-detail-client">{activeDossier.clientName}</h2>
              <div className="cp-detail-industry">{activeDossier.industry}</div>
            </div>
            <button className="cp-detail-close interactive" onClick={closeDossier}>✕ CLOSE FILE</button>
          </div>

          {/* Accordion Sections */}
          <div className="cp-accordion">

            {/* ── Overview & Links ── */}
            <div className={`cp-acc-item ${expandedSection === 'overview' ? 'open' : ''}`}>
              <button className="cp-acc-trigger interactive" onClick={() => { cinemaAudio.playOrbHover(); setExpandedSection(expandedSection === 'overview' ? '' : 'overview') }}>
                <span className="cp-acc-icon">📋</span>
                <span>Mission Overview & Live Links</span>
                <span className="cp-acc-arrow">{expandedSection === 'overview' ? '▾' : '▸'}</span>
              </button>
              {expandedSection === 'overview' && (
                <div className="cp-acc-body">
                  <p className="cp-overview-text">{activeDossier.briefing}</p>
                  <div className="cp-links-row">
                    {activeDossier.deliverables.filter(d => d.url).map((d, i) => (
                      <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className="cp-live-link interactive" onClick={() => cinemaAudio.playOrbSelect()}>
                        <span className="cp-link-icon">{d.icon}</span>
                        <div>
                          <div className="cp-link-label">{d.label}</div>
                          <div className="cp-link-type">{d.type}</div>
                        </div>
                        <span className="cp-link-arrow">↗</span>
                      </a>
                    ))}
                    <a href={`mailto:${activeDossier.clientEmail}`} className="cp-live-link interactive" onClick={() => cinemaAudio.playOrbSelect()}>
                      <span className="cp-link-icon">✉️</span>
                      <div>
                        <div className="cp-link-label">{activeDossier.clientEmail}</div>
                        <div className="cp-link-type">Client Contact</div>
                      </div>
                      <span className="cp-link-arrow">↗</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* ── Web Platform Preview ── */}
            <div className={`cp-acc-item ${expandedSection === 'web' ? 'open' : ''}`}>
              <button className="cp-acc-trigger interactive" onClick={() => { cinemaAudio.playOrbHover(); setExpandedSection(expandedSection === 'web' ? '' : 'web') }}>
                <span className="cp-acc-icon">🌐</span>
                <span>Web Platform — {activeDossier.websiteDomain}</span>
                <span className="cp-acc-arrow">{expandedSection === 'web' ? '▾' : '▸'}</span>
              </button>
              {expandedSection === 'web' && (
                <div className="cp-acc-body">
                  <div className="cp-browser-frame">
                    <div className="cp-browser-chrome">
                      <div className="cp-chrome-dots"><span/><span/><span/></div>
                      <div className="cp-chrome-url">🔒 https://{activeDossier.websiteDomain}</div>
                      <a href={activeDossier.websiteUrl} target="_blank" rel="noopener noreferrer" className="cp-chrome-open interactive">VISIT LIVE ↗</a>
                    </div>
                    <div className="cp-browser-body">
                      <img src={activeDossier.webPreviewImg} alt={`${activeDossier.clientName} website`} className="cp-preview-img" />
                    </div>
                  </div>
                  <ul className="cp-capability-list">
                    <li>✓ High-speed responsive trading & educational frontend</li>
                    <li>✓ Dark glassmorphism dashboards with candlestick charts</li>
                    <li>✓ Risk calculators, course modules, instant search</li>
                    <li>✓ Multi-region edge CDN for global instant loads</li>
                  </ul>
                </div>
              )}
            </div>

            {/* ── Instagram Operations ── */}
            <div className={`cp-acc-item ${expandedSection === 'insta' ? 'open' : ''}`}>
              <button className="cp-acc-trigger interactive" onClick={() => { cinemaAudio.playOrbHover(); setExpandedSection(expandedSection === 'insta' ? '' : 'insta') }}>
                <span className="cp-acc-icon">📸</span>
                <span>Instagram Channel — {activeDossier.instagramHandle}</span>
                <span className="cp-acc-arrow">{expandedSection === 'insta' ? '▾' : '▸'}</span>
              </button>
              {expandedSection === 'insta' && (
                <div className="cp-acc-body">
                  <div className="cp-insta-grid">
                    <div className="cp-phone-wrap">
                      <img src={activeDossier.instaPreviewImg} alt={`${activeDossier.clientName} Instagram`} className="cp-phone-screen" />
                    </div>
                    <div className="cp-insta-info">
                      <h4>Social Media Engineering & Daily Content Operations</h4>
                      <p>We handle complete daily social media operations for <strong>{activeDossier.clientName}</strong> — creating high-engagement visual assets that educate and convert.</p>
                      <ul className="cp-capability-list">
                        <li>✓ <strong>Algorithmic Visual Reach:</strong> High-impact reels for maximum viral distribution</li>
                        <li>✓ <strong>Luxury Visual Identity:</strong> Black & gold carousels optimized for saves & shares</li>
                        <li>✓ <strong>Content Pipeline:</strong> Daily market recaps & trading mindset posts</li>
                        <li>✓ <strong>Lead Funnel:</strong> Direct traffic to website and client email</li>
                      </ul>
                      <a href={activeDossier.instagramUrl} target="_blank" rel="noopener noreferrer" className="cp-insta-cta interactive" onClick={() => cinemaAudio.playOrbSelect()}>
                        📸 VISIT {activeDossier.instagramHandle.toUpperCase()} ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Project Timeline ── */}
            <div className={`cp-acc-item ${expandedSection === 'timeline' ? 'open' : ''}`}>
              <button className="cp-acc-trigger interactive" onClick={() => { cinemaAudio.playOrbHover(); setExpandedSection(expandedSection === 'timeline' ? '' : 'timeline') }}>
                <span className="cp-acc-icon">⏱️</span>
                <span>Project Timeline & Deliverables</span>
                <span className="cp-acc-arrow">{expandedSection === 'timeline' ? '▾' : '▸'}</span>
              </button>
              {expandedSection === 'timeline' && (
                <div className="cp-acc-body">
                  <div className="cp-timeline">
                    {activeDossier.timeline.map((t, i) => (
                      <div key={i} className={`cp-tl-item ${t.status}`}>
                        <div className="cp-tl-marker">
                          {t.status === 'done' ? '✓' : '◉'}
                        </div>
                        <div className="cp-tl-content">
                          <div className="cp-tl-phase">{t.phase}</div>
                          <div className="cp-tl-detail">{t.detail}</div>
                        </div>
                        <div className={`cp-tl-badge ${t.status}`}>
                          {t.status === 'done' ? 'COMPLETED' : 'IN PROGRESS'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cp-tech-row">
                    <span className="cp-tech-label">TECH STACK:</span>
                    {activeDossier.techStack.map((t, i) => <span key={i} className="cp-tech-chip">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Testimonial */}
          <div className="cp-testimonial">
            <span className="cp-quote-mark">"</span>
            <p className="cp-quote-body">{activeDossier.testimonial.quote}</p>
            <div className="cp-quote-source">— {activeDossier.testimonial.author}</div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 3: BECOME A CLIENT (Inquiry Form)
         ══════════════════════════════════════════════ */}
      <section className="cp-inquiry-section">
        <div className="cp-section-label">
          <span className="cp-label-line" />
          <span>INITIATE YOUR CASE FILE</span>
          <span className="cp-label-line" />
        </div>

        <div className="cp-inquiry-layout">
          <div className="cp-inquiry-left">
            <h2 className="cp-inquiry-headline">Ready to Build Something Exceptional?</h2>
            <p className="cp-inquiry-sub">Join visionary clients like FinexHub. We architect, engineer, and manage world-class digital platforms with rapid turnarounds.</p>

            <div className="cp-inquiry-pillars">
              {[
                { icon: '🌐', title: 'Full-Stack Web', desc: 'Custom platforms, 3D sites, e-commerce' },
                { icon: '📸', title: 'Social Media Growth', desc: 'Instagram, reels, brand carousels' },
                { icon: '⚡', title: 'On-Time Delivery', desc: 'Agile sprints, direct founder access' },
                { icon: '🛡️', title: 'Post-Launch Care', desc: 'Updates, security, analytics' }
              ].map((p, i) => (
                <div key={i} className="cp-pillar-row">
                  <span className="cp-pillar-icon">{p.icon}</span>
                  <div>
                    <div className="cp-pillar-name">{p.title}</div>
                    <div className="cp-pillar-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cp-inquiry-right">
            <div className="cp-form-card">
              <h3 className="cp-form-heading">📋 Project Sprint Intake</h3>
              {sent ? (
                <div className="cp-form-success">
                  <div className="cp-success-icon">🚀</div>
                  <h4>INQUIRY DISPATCHED</h4>
                  <p>Transmitted to BEx Sigma Tech. We'll schedule your blueprint call within 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="cp-form">
                  <label>SERVICE TYPE</label>
                  <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="interactive">
                    <option>Full-Stack Web + Social Media</option>
                    <option>Custom Web Application</option>
                    <option>Instagram Growth Engine</option>
                    <option>Brand Identity & UI/UX</option>
                    <option>Mobile App (iOS & Android)</option>
                  </select>

                  <label>PROJECT / BRAND NAME</label>
                  <input type="text" placeholder="e.g. FinexHub" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="interactive" />

                  <label>BUDGET & TIMELINE</label>
                  <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} className="interactive">
                    <option>Sprint MVP (~₹30K-50K · 1-2 Weeks)</option>
                    <option>Custom Enterprise (~₹50K - ₹1.5L · 2-4 Weeks)</option>
                    <option>Full Ecosystem (~₹1.5L+ · Dedicated Team)</option>
                  </select>

                  <label>YOUR EMAIL</label>
                  <input type="email" placeholder="founder@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="interactive" />

                  <label>PROJECT SCOPE</label>
                  <textarea rows={3} placeholder="Describe your goals, target audience, features..." value={formData.scope} onChange={e => setFormData({...formData, scope: e.target.value})} required className="interactive" />

                  <button type="submit" className="cp-submit interactive">⚡ CONTACT BEX SIGMA TECH</button>
                  <div className="cp-form-note">🔒 Direct to bexsigmatech@gmail.com</div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
