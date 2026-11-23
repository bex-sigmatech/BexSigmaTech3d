import React, { useState } from 'react'

export default function ScheduleDemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: 'excel_bi',
    date: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      // Create pre-filled mailto
      const subject = encodeURIComponent(`Executive Demo Request - ${formData.purpose.toUpperCase()}`)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSolution: ${formData.purpose}\nPreferred Date: ${formData.date}\nNotes: ${formData.notes}`
      )
      window.location.href = `mailto:bexsigmatech@gmail.com?subject=${subject}&body=${body}`
    }, 1200)
  }

  return (
    <div className="mc-modal-backdrop" onClick={onClose}>
      <div className="mc-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="mc-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="mc-modal-header">
          <div className="mc-modal-pill">
            <span className="mc-pulse-dot" />
            <span>DIRECT ARCHITECTURAL BRIEFING</span>
          </div>
          <h2 className="mc-modal-title">Schedule a Live Architecture Demo</h2>
          <p className="mc-modal-sub">
            Meet directly with Lead Architect Hariharan.D and our engineering pod to review enterprise BI toolkits, custom 3D web systems, or scalable SaaS solutions.
          </p>
        </div>

        {submitted ? (
          <div className="mc-modal-success">
            <div className="mc-success-check">✓</div>
            <h3>Demo Briefing Requested</h3>
            <p>Our engineering lead will confirm via email / WhatsApp within 2 business hours.</p>
            <button className="mc-modal-btn mc-modal-btn-primary" onClick={onClose}>
              Return to Mission Control
            </button>
          </div>
        ) : (
          <form className="mc-modal-form" onSubmit={handleSubmit}>
            <div className="mc-modal-row">
              <div className="mc-modal-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mc-modal-field">
                <label>Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="mc-modal-row">
              <div className="mc-modal-field">
                <label>Phone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="mc-modal-field">
                <label>System of Interest *</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                >
                  <option value="excel_bi">Enterprise BI & Excel Master Suite (₹199)</option>
                  <option value="spatial_3d">3D Spatial Web & 60 FPS WebGL</option>
                  <option value="cloud_saas">Custom Enterprise SaaS & Cloud Portals</option>
                  <option value="mobile_apps">Mobile App Engineering (iOS & Android)</option>
                  <option value="ai_pipelines">Autonomous AI Pipelines & Agents</option>
                  <option value="bespoke_rd">Bespoke R&D Prototype Sprint (&lt; 48h)</option>
                </select>
              </div>
            </div>

            <div className="mc-modal-field">
              <label>Preferred Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="mc-modal-field">
              <label>Project Scope or Requirements</label>
              <textarea
                rows={3}
                placeholder="Briefly describe your current requirements, team size, or target timeline..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="mc-modal-actions">
              <button type="submit" className="mc-modal-btn mc-modal-btn-primary">
                <span>🗓️ Confirm Demo Request</span>
                <span>→</span>
              </button>
              <a
                href="https://wa.me/919361657929?text=Hi%20BEx%20Sigma%20Tech,%20I%20would%20like%20to%20schedule%20a%20demo%20with%20your%20lead%20architect."
                target="_blank"
                rel="noreferrer"
                className="mc-modal-btn mc-modal-btn-whatsapp"
              >
                <span>💬 Quick WhatsApp Dispatch</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
