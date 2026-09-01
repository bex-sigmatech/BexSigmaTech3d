import React, { useState } from 'react'
import { SERVICE_DETAILS } from '../../data/serviceDetails'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

export default function ServiceDetail({ serviceId, onClose }) {
  const detail = SERVICE_DETAILS[serviceId]
  const [customIdea, setCustomIdea] = useState('')
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [customSent, setCustomSent] = useState(false)
  const [customError, setCustomError] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Generic contact form for all 4 services
  const [showContact, setShowContact] = useState(false)
  const [contactSubject, setContactSubject] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSending, setContactSending] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState('')

  if (!detail) return null

  const accent = detail.accent

  const openContact = (subject, prefillMsg = '') => {
    setContactSubject(subject || `Inquiry — ${detail.title}`)
    setContactMessage(prefillMsg)
    setContactSent(false)
    setContactError('')
    setShowContact(true)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    if (!contactEmail.trim() || !contactMessage.trim()) return
    setContactSending(true)
    setContactError('')
    setContactSent(false)
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || 'Anonymous',
          email: contactEmail,
          message: `Service: ${detail.title} | Subject: ${contactSubject}\nPhone: ${contactPhone || '—'}\n\n${contactMessage}`,
          subject: contactSubject,
          service: detail.title
        })
      })
      const ct = res.headers.get('content-type') || ''
      let data = null
      let text = ''
      if (ct.includes('application/json')) {
        data = await res.json()
      } else {
        text = await res.text()
        // Live server not yet deployed → returns HTML <!DOCTYPE
        if (text.trim().startsWith('<!DOCTYPE') || text.includes('Cannot POST')) {
          throw new Error(`Live server not updated yet — please email directly to bexsigmatech@gmail.com or try again after deployment. (Details: ${res.status} ${res.statusText})`)
        }
        try { data = JSON.parse(text) } catch { data = { success: res.ok, error: text.slice(0, 200) } }
      }
      if (!res.ok || !data?.success) throw new Error(data?.error || text?.slice(0, 200) || 'Failed to send')
      setContactSent(true)
      setContactMessage('')
      setContactPhone('')
      setTimeout(() => setContactSent(false), 6000)
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Unexpected token') || msg.includes('<!DOCTYPE') || msg.includes('is not valid JSON')) {
        setContactError('Live server not updated yet — the new contact API is not deployed on render. Please email directly to bexsigmatech@gmail.com or contact us after deployment.')
      } else {
        setContactError(msg || 'Failed to send — please try again or email directly to bexsigmatech@gmail.com')
      }
    } finally {
      setContactSending(false)
    }
  }

  const handleCustomSubmit = async (e) => {
    e.preventDefault()
    if (!customIdea.trim() || !customEmail.trim()) return
    setIsSending(true)
    setCustomError('')
    setCustomSent(false)
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customName || 'Anonymous',
          email: customEmail,
          message: customIdea,
          subject: `Unique Idea — ${detail.title}`,
          service: detail.title
        })
      })
      const ct = res.headers.get('content-type') || ''
      let data = null
      let text = ''
      if (ct.includes('application/json')) {
        data = await res.json()
      } else {
        text = await res.text()
        if (text.trim().startsWith('<!DOCTYPE') || text.includes('Cannot POST')) {
          throw new Error(`Live server not updated yet — please email directly to bexsigmatech@gmail.com or try again after deployment. (Details: ${res.status} ${res.statusText})`)
        }
        try { data = JSON.parse(text) } catch { data = { success: res.ok, error: text.slice(0, 200) } }
      }
      if (!res.ok || !data?.success) throw new Error(data?.error || text?.slice(0, 200) || 'Failed to send')
      setCustomSent(true)
      setCustomIdea('')
      setTimeout(() => setCustomSent(false), 6000)
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Unexpected token') || msg.includes('<!DOCTYPE') || msg.includes('is not valid JSON')) {
        setCustomError('Live server not updated yet — the new contact API is not deployed on render. Please email directly to bexsigmatech@gmail.com or contact us after deployment.')
      } else {
        setCustomError(msg || 'Failed to send — please try again or email directly to bexsigmatech@gmail.com')
      }
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="service-detail-overlay" onClick={onClose}>
      <div className="service-detail-modal" onClick={(e) => e.stopPropagation()} style={{ '--accent': accent }}>
        <button className="service-detail-close" onClick={onClose} aria-label="Close">×</button>

        {/* Header */}
        <div className="service-detail-header">
          <div className="service-detail-eyebrow" style={{ color: accent, borderColor: accent + '30' }}>
            <span style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} className="eyebrow-dot" />
            {serviceId === 'normal' && 'WEBSITE · ESSENTIAL'}
            {serviceId === 'threed' && '3D · SPATIAL WEB'}
            {serviceId === 'software' && 'SOFTWARE · LIVE PRODUCTS'}
            {serviceId === 'custom' && 'CREATIVE · CUSTOM BUILD'}
          </div>
          <h1 className="service-detail-title">{detail.title}</h1>
          <p className="service-detail-subtitle">{detail.subtitle}</p>
          <p className="service-detail-intro">{detail.intro}</p>
        </div>

        <div className="service-detail-scroll">
          {/* CONTACT FORM PAGE — shown when user clicks Contact Us */}
          {showContact ? (
            <div className="custom-form-wrap" style={{ borderColor: accent + '35', background: `linear-gradient(135deg, ${accent}08, transparent)` }}>
              <button onClick={() => setShowContact(false)} style={{ background: 'transparent', border: 'none', color: accent, fontFamily: 'Orbitron', fontSize: '0.70rem', fontWeight: 700, letterSpacing: '0.10em', cursor: 'pointer', marginBottom: 12 }}>← Back to details</button>
              <h3 className="custom-form-title" style={{ color: accent }}>Contact Us — {detail.title}</h3>
              <p className="custom-form-desc">Enter your credentials and message below. This will be sent directly to <strong>bexsigmatech@gmail.com</strong> and we’ll reply within 24 hours.</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 10px 0' }}>Subject: <strong style={{ color: '#fff' }}>{contactSubject}</strong></p>
              <form onSubmit={handleContactSubmit} className="custom-form">
                <div className="custom-form-row">
                  <input type="text" placeholder="Your name *" value={contactName} onChange={(e) => setContactName(e.target.value)} required className="custom-input" />
                  <input type="email" placeholder="Your email for reply *" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required className="custom-input" />
                </div>
                <input type="tel" placeholder="Phone (optional)" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="custom-input" />
                <textarea placeholder={`Your message for ${detail.title}...`} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required rows={5} className="custom-textarea" />
                <button type="submit" className="custom-submit" style={{ background: accent, color: '#000', opacity: contactSending ? 0.7 : 1 }} disabled={contactSending}>
                  {contactSending ? 'Sending to bexsigmatech@gmail.com...' : '✦ Send Message'}
                </button>
                {contactSent && <div className="custom-sent" style={{ color: accent }}>✓ Sent to bexsigmatech@gmail.com — we’ll reply within 24h.</div>}
                {contactError && <div className="custom-sent" style={{ color: '#f43f5e' }}>⚠ {contactError}</div>}
              </form>
            </div>
          ) : (
            <>
              {/* NORMAL & 3D: two-type article */}
              {(serviceId === 'normal' || serviceId === 'threed') && (
                <>
                  <div className="service-types-grid">
                    {detail.types.map((t, idx) => (
                      <div key={idx} className="service-type-card" style={{ borderColor: idx === 0 ? 'rgba(255,255,255,0.08)' : accent + '35' }}>
                        {idx === 1 && <div className="popular-ribbon" style={{ background: accent }}>RECOMMENDED</div>}
                        <div className="service-type-badge" style={{ background: idx === 1 ? accent : 'rgba(255,255,255,0.06)', color: idx === 1 ? '#000' : 'rgba(255,255,255,0.7)', borderColor: idx === 1 ? accent : 'rgba(255,255,255,0.1)' }}>{t.badge}</div>
                        <h3 className="service-type-name">{t.name}</h3>
                        <p className="service-type-desc">{t.desc}</p>
                        <ul className="service-type-list">
                          {t.includes.map((it, i) => (
                            <li key={i}><span style={{ color: accent }}>✓</span> {it}</li>
                          ))}
                        </ul>
                        <div className="service-type-tech">
                          {t.tech.map((tech, i) => (
                            <span key={i} className="tech-pill">{tech}</span>
                          ))}
                        </div>
                        <div className="service-type-ideal"><strong>Ideal for:</strong> {t.idealFor}</div>
                        <button className="service-type-cta" style={{ background: idx === 1 ? accent : 'transparent', color: idx === 1 ? '#000' : '#fff', borderColor: idx === 1 ? accent : 'rgba(255,255,255,0.18)' }} onClick={() => openContact(`${t.name} — ${detail.title}`, `Hi BEx Sigma Tech, I'm interested in ${t.name} for ${detail.title}. Please share next steps.`)}> 
                          Contact Us →
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="service-compare">
                    <h4 className="service-compare-title">Quick comparison</h4>
                    <div className="service-compare-table">
                      <div className="compare-head">
                        <span>Feature</span><span>Frontend Only</span><span style={{ color: accent }}>Full Website</span>
                      </div>
                      {detail.comparison.map((row, i) => (
                        <div key={i} className="compare-row">
                          <span>{row.feature}</span>
                          <span>{row.frontend}</span>
                          <span style={{ color: row.full.includes('✓') ? accent : '#fff' }}>{row.full}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="service-cta-note" style={{ borderColor: accent + '25', background: accent + '08' }}>
                    <span style={{ color: accent }}>💡</span> {detail.cta}
                  </div>

                  <button className="service-type-cta" style={{ background: accent, color: '#000', borderColor: accent, width: '100%', padding: '12px' }} onClick={() => openContact(`General Inquiry — ${detail.title}`)}>
                    ✉ Contact Us About {detail.title} →
                  </button>
                </>
              )}

              {/* SOFTWARE */}
              {serviceId === 'software' && (
                <>
                  <div className="service-products-grid">
                    {detail.products.map((p, idx) => (
                      <div key={idx} className="service-product-card" style={{ borderColor: accent + '22' }}>
                        <div className="service-product-top">
                          <div className="service-product-icon" style={{ background: accent + '18', color: accent, borderColor: accent + '30' }}>{idx === 0 ? '🎓' : '⚡'}</div>
                          <div>
                            <div className="service-product-purpose" style={{ color: accent }}>{p.purpose}</div>
                            <h3 className="service-product-name">{p.name}</h3>
                          </div>
                          <span className="service-product-tag">{p.tag}</span>
                        </div>
                        <p className="service-product-desc">{p.desc}</p>
                        <ul className="service-type-list">
                          {p.features.map((f, i) => (
                            <li key={i}><span style={{ color: accent }}>✓</span> {f}</li>
                          ))}
                        </ul>
                        <div className="service-product-meta">
                          <span><strong>Audience:</strong> {p.audience}</span>
                          <span><strong>Tech:</strong> {p.tech.join(' · ')}</span>
                          <span className="status-live" style={{ color: accent }}>● {p.status}</span>
                        </div>
                        <button className="service-type-cta" style={{ background: 'transparent', color: accent, borderColor: accent + '55', marginTop: 12, width: '100%' }} onClick={() => openContact(`${p.name} — ${detail.title}`, `Hi team, I want to know more about ${p.name} (${p.purpose}).`)}>
                          Contact About {p.name} →
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="service-custom-note" style={{ borderColor: accent + '25', background: `linear-gradient(135deg, ${accent}0d, transparent)` }}>
                    <h4 style={{ color: accent }}>{detail.customNote.title}</h4>
                    <p>{detail.customNote.desc}</p>
                    <div className="service-examples">
                      {detail.customNote.examples.map((ex, i) => (
                        <span key={i} className="example-pill">{ex}</span>
                      ))}
                    </div>
                  </div>

                  <div className="service-cta-note" style={{ borderColor: accent + '25' }}>
                    <span style={{ color: accent }}>💡</span> {detail.cta}
                  </div>

                  <button className="service-type-cta" style={{ background: accent, color: '#000', borderColor: accent, width: '100%', padding: '12px' }} onClick={() => openContact(`Software Inquiry — ${detail.title}`)}>
                    ✉ Contact Us About Software →
                  </button>
                </>
              )}

              {/* CUSTOM */}
              {serviceId === 'custom' && (
                <>
                  <div className="custom-process-grid">
                    {detail.process.map((p) => (
                      <div key={p.step} className="custom-step-card" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                        <div className="custom-step-num" style={{ color: accent, borderColor: accent + '30', background: accent + '12' }}>{p.step}</div>
                        <h4 className="custom-step-title">{p.title}</h4>
                        <p className="custom-step-desc">{p.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="custom-love">
                    <h4>We love building:</h4>
                    <div className="custom-love-tags">
                      {detail.whatWeLove.map((w, i) => (
                        <span key={i} className="love-tag" style={{ borderColor: accent + '25' }}>{w}</span>
                      ))}
                    </div>
                    <p className="custom-promise">{detail.promise}</p>
                    <p className="custom-examples-prompt">{detail.examplesPrompt}</p>
                  </div>

                  <button className="service-type-cta" style={{ background: accent, color: '#000', borderColor: accent, width: '100%', padding: '12px', marginBottom: 14 }} onClick={() => openContact(`Custom Idea Consultation — ${detail.title}`, 'Hi, I have a unique idea to discuss...')}>
                    ✉ Contact Us to Discuss Your Idea →
                  </button>

                  <div className="custom-form-wrap" style={{ borderColor: accent + '25' }}>
                    <h3 className="custom-form-title" style={{ color: accent }}>{detail.ctaTitle}</h3>
                    <p className="custom-form-desc">{detail.ctaDesc}</p>
                    <form onSubmit={handleCustomSubmit} className="custom-form">
                      <div className="custom-form-row">
                        <input type="text" placeholder="Your name (optional)" value={customName} onChange={(e) => setCustomName(e.target.value)} className="custom-input" />
                        <input type="email" placeholder="Your email for reply *" value={customEmail} onChange={(e) => setCustomEmail(e.target.value)} required className="custom-input" />
                      </div>
                      <textarea placeholder={detail.formPlaceholder} value={customIdea} onChange={(e) => setCustomIdea(e.target.value)} required rows={5} className="custom-textarea" />
                      <button type="submit" className="custom-submit" style={{ background: accent, color: '#000', opacity: isSending ? 0.7 : 1 }} disabled={isSending}>
                        {isSending ? 'Sending to bexsigmatech@gmail.com...' : '✦ Submit Your Idea — We’ll Shape It'}
                      </button>
                      {customSent && <div className="custom-sent" style={{ color: accent }}>✓ Sent to bexsigmatech@gmail.com — we’ll reply within 24h. Your vision is safe with us.</div>}
                      {customError && <div className="custom-sent" style={{ color: '#f43f5e' }}>⚠ {customError}</div>}
                    </form>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="service-detail-footer">
          {!showContact ? (
            <>
              <button className="service-footer-back" onClick={onClose}>← Back to Services</button>
              <button className="service-footer-cta" style={{ background: accent, color: '#000' }} onClick={() => openContact(`General Inquiry — ${detail.title}`)}>Contact Us →</button>
            </>
          ) : (
            <>
              <button className="service-footer-back" onClick={() => setShowContact(false)}>← Back to details</button>
              <button className="service-footer-cta" style={{ background: accent, color: '#000' }} onClick={() => document.querySelector('.custom-form-wrap textarea, .custom-form-wrap input')?.focus()}>Go to Form ↑</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
