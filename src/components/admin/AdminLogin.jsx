import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import '../../styles/adminCertificate.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.')
      }

      // Store JWT token safely in browser sessionStorage (session-scoped: entering /admin in new tab requires password)
      if (data.token) {
        try { localStorage.removeItem('bex_admin_token') } catch {}
        sessionStorage.setItem('bex_admin_token', data.token)
        if (onLoginSuccess) {
          onLoginSuccess(data.token, data.admin)
        }
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cert-admin-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="cert-ambient-bg" />
      <div className="cert-grid-pattern" />

      <div className="cert-content-container" style={{ maxWidth: '440px', width: '100%', margin: '0 auto', padding: '0' }}>
        <div className="cert-card-panel" style={{ padding: '36px 32px' }}>
          {/* Brand Emblem & Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(16, 185, 129, 0.25))',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#38bdf8',
                marginBottom: '16px',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)'
              }}
            >
              <FaShieldAlt />
            </div>
            <h1 className="cert-panel-title" style={{ fontSize: '1.45rem', marginBottom: '4px' }}>
              Admin Portal
            </h1>
            <p className="cert-panel-sub" style={{ fontSize: '0.8rem' }}>
              BEx Sigma Tech · Certificate Authority Console
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                padding: '12px 14px',
                color: '#f87171',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}
            >
              <FaExclamationTriangle style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="cert-form-group">
              <label className="cert-form-label">
                <span>Admin Username</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaUser style={{ position: 'absolute', left: '14px', color: '#64748b', fontSize: '0.9rem' }} />
                <input
                  type="text"
                  className="cert-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="cert-form-group">
              <label className="cert-form-label">
                <span>Admin Password</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaLock style={{ position: 'absolute', left: '14px', color: '#64748b', fontSize: '0.9rem' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="cert-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '4px'
                  }}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="cert-submit-btn"
              disabled={loading}
              style={{ marginTop: '10px' }}
            >
              {loading ? (
                <>
                  <span className="product-btn-spinner" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <FaShieldAlt />
                  <span>Authenticate & Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Back Link */}
          <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link
              to="/"
              style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.target.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
            >
              <FaArrowLeft />
              <span>Back to BEx Sigma Tech HQ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
