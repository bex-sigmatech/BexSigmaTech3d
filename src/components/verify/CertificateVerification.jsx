import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSearch,
  FaDownload,
  FaShieldAlt,
  FaArrowLeft,
  FaCertificate,
  FaCalendarAlt,
  FaUserGraduate,
  FaBookOpen,
  FaClock,
  FaCopy,
  FaCheck
} from 'react-icons/fa'
import '../../styles/adminCertificate.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

export default function CertificateVerification() {
  const { certificateId: routeCertId } = useParams()
  const navigate = useNavigate()

  const [inputCertId, setInputCertId] = useState(routeCertId || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const verifyCertificate = async (idToVerify) => {
    const cleanId = (idToVerify || '').trim()
    if (!cleanId) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/certificates/verify/${encodeURIComponent(cleanId)}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({
        success: false,
        status: 'INVALID',
        message: 'Could not connect to the verification registry. Please check your network connection.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Ensure body/html allows scrolling in public verification portal
  useEffect(() => {
    const origHtml = document.documentElement.style.overflow
    const origBody = document.body.style.overflow
    const rootEl = document.getElementById('root')
    const origRoot = rootEl ? rootEl.style.overflow : ''

    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
    if (rootEl) {
      rootEl.style.overflow = 'auto'
      rootEl.style.height = 'auto'
      rootEl.style.minHeight = '100vh'
    }

    return () => {
      document.documentElement.style.overflow = origHtml
      document.body.style.overflow = origBody
      if (rootEl) {
        rootEl.style.overflow = origRoot
        rootEl.style.height = ''
        rootEl.style.minHeight = ''
      }
    }
  }, [])

  // Auto-verify if certificateId is present in URL (e.g. from scanning QR code)
  useEffect(() => {
    if (routeCertId) {
      setInputCertId(routeCertId)
      verifyCertificate(routeCertId)
    }
  }, [routeCertId])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputCertId.trim()) return
    navigate(`/verify/${inputCertId.trim()}`)
    verifyCertificate(inputCertId.trim())
  }

  const handleCopyId = () => {
    if (!result?.certificate?.certificateId) return
    navigator.clipboard.writeText(result.certificate.certificateId)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  return (
    <div className="cert-verify-root">
      <div className="cert-ambient-bg" />
      <div className="cert-grid-pattern" />

      <div className="cert-verify-container">
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
              fontSize: '1.6rem',
              color: '#38bdf8',
              marginBottom: '16px',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)'
            }}
          >
            <FaShieldAlt />
          </div>
          <h1 style={{ fontFamily: 'var(--cert-font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
            Certificate Verification
          </h1>
          <p style={{ color: '#38bdf8', fontFamily: 'var(--cert-font-ui)', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
            Official Credential Authentication Registry • BEx Sigma Tech
          </p>
        </div>

        {/* Verification Card */}
        <div className="cert-verify-card">
          {/* Lookup Input Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: result ? '28px' : '0' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FaSearch style={{ position: 'absolute', left: '16px', color: '#64748b' }} />
                <input
                  type="text"
                  className="cert-input"
                  style={{ paddingLeft: '44px', textTransform: 'uppercase', fontFamily: 'var(--cert-font-ui)', fontWeight: 700, letterSpacing: '0.04em' }}
                  placeholder="ENTER CERTIFICATE ID (e.g. CERT-2026-00001)"
                  value={inputCertId}
                  onChange={e => setInputCertId(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="cert-submit-btn"
                style={{ width: 'auto', padding: '12px 24px', margin: 0, minWidth: '150px' }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Now'}
              </button>
            </div>
          </form>

          {/* Verification Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#38bdf8' }}>
              <div style={{ fontSize: '1rem', fontFamily: 'Orbitron', letterSpacing: '0.1em', marginBottom: '8px' }}>
                QUERYING OFFICIAL DATABASE RECORD...
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Validating cryptographic hash against authoritative credential registry
              </div>
            </div>
          )}

          {/* Verification Results */}
          {!loading && result && (
            <div>
              {/* 1. VALID CERTIFICATE */}
              {result.status === 'VALID' && (
                <div>
                  <div className="cert-verify-badge-banner valid">
                    <FaCheckCircle className="cert-verify-icon" />
                    <div>
                      <h2 className="cert-verify-banner-title">VERIFIED CERTIFICATE</h2>
                      <p className="cert-verify-banner-desc">
                        This certificate is authentic and was officially issued by <strong>BEx Sigma Tech</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="cert-verify-details-grid">
                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Certificate ID</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="cert-verify-detail-value highlight">
                          {result.certificate.certificateId}
                        </span>
                        <button
                          onClick={handleCopyId}
                          style={{ background: 'transparent', border: 'none', color: copyFeedback ? '#10b981' : '#64748b', cursor: 'pointer', padding: '2px' }}
                          title="Copy ID"
                        >
                          {copyFeedback ? <FaCheck size={12} /> : <FaCopy size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Student Name</span>
                      <span className="cert-verify-detail-value">
                        {result.certificate.studentName}
                      </span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Course Title</span>
                      <span className="cert-verify-detail-value">
                        {result.certificate.courseName}
                      </span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Duration</span>
                      <span className="cert-verify-detail-value">
                        {result.certificate.courseDuration}
                      </span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Completion Date</span>
                      <span className="cert-verify-detail-value">
                        {result.certificate.completionDate}
                      </span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Issue Date</span>
                      <span className="cert-verify-detail-value">
                        {result.certificate.issueDate}
                      </span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Credential Type</span>
                      <span className="cert-verify-detail-value">
                        {result.certificate.certificateType}
                      </span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Official Status</span>
                      <span className="cert-status-pill valid" style={{ alignSelf: 'flex-start' }}>
                        ● Officially Verified
                      </span>
                    </div>
                  </div>

                  {result.certificate.additionalDetails && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      <strong style={{ color: '#38bdf8' }}>Honors & Remarks:</strong> {result.certificate.additionalDetails}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="cert-verify-actions">
                    <a
                      href={`${BACKEND_URL}/api/certificates/download/${result.certificate.certificateId}`}
                      className="cert-submit-btn"
                      style={{ textDecoration: 'none', margin: 0, flex: 1, minWidth: '220px' }}
                      download
                    >
                      <FaDownload />
                      <span>Download Official PDF</span>
                    </a>

                    <button
                      onClick={() => { setResult(null); setInputCertId(''); navigate('/verify') }}
                      className="cert-nav-btn"
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      Verify Another Certificate
                    </button>
                  </div>
                </div>
              )}

              {/* 2. REVOKED CERTIFICATE */}
              {result.status === 'REVOKED' && (
                <div>
                  <div className="cert-verify-badge-banner revoked">
                    <FaExclamationTriangle className="cert-verify-icon" />
                    <div>
                      <h2 className="cert-verify-banner-title">CERTIFICATE REVOKED</h2>
                      <p className="cert-verify-banner-desc">
                        This certificate was previously issued but has been <strong>revoked</strong> by the issuing organization.
                      </p>
                    </div>
                  </div>

                  <div className="cert-verify-details-grid">
                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Certificate ID</span>
                      <span className="cert-verify-detail-value highlight" style={{ color: '#fbbf24' }}>
                        {result.certificate.certificateId}
                      </span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Student Name</span>
                      <span className="cert-verify-detail-value">{result.certificate.studentName}</span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Course Title</span>
                      <span className="cert-verify-detail-value">{result.certificate.courseName}</span>
                    </div>

                    <div className="cert-verify-detail-item">
                      <span className="cert-verify-detail-label">Current Status</span>
                      <span className="cert-status-pill revoked" style={{ alignSelf: 'flex-start' }}>
                        ✕ Revoked Record
                      </span>
                    </div>

                    {result.certificate.revokedAt && (
                      <div className="cert-verify-detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="cert-verify-detail-label">Revocation Timestamp</span>
                        <span className="cert-verify-detail-value" style={{ fontSize: '0.85rem', color: '#f87171' }}>
                          {new Date(result.certificate.revokedAt).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {result.certificate.revokedReason && (
                      <div className="cert-verify-detail-item" style={{ gridColumn: 'span 2' }}>
                        <span className="cert-verify-detail-label">Reason for Revocation</span>
                        <span className="cert-verify-detail-value" style={{ fontSize: '0.85rem', color: '#f87171' }}>
                          {result.certificate.revokedReason}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="cert-verify-actions">
                    <button
                      onClick={() => { setResult(null); setInputCertId(''); navigate('/verify') }}
                      className="cert-nav-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Verify Another Certificate
                    </button>
                  </div>
                </div>
              )}

              {/* 3. INVALID CERTIFICATE */}
              {result.status === 'INVALID' && (
                <div>
                  <div className="cert-verify-badge-banner invalid">
                    <FaTimesCircle className="cert-verify-icon" />
                    <div>
                      <h2 className="cert-verify-banner-title">INVALID CERTIFICATE</h2>
                      <p className="cert-verify-banner-desc">
                        No matching certificate was found in our official records.
                      </p>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(3, 7, 18, 0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '22px', marginBottom: '24px', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    <p style={{ margin: '0 0 10px' }}>
                      The Certificate ID <strong>"{result.certificateId || inputCertId}"</strong> does not exist in the BEx Sigma Tech verified database.
                    </p>
                    <ul style={{ margin: '0 0 0 16px', padding: 0, color: '#94a3b8' }}>
                      <li>Ensure there are no typos in the Certificate ID (format: <code>CERT-2026-00001</code>).</li>
                      <li>Verify you are using an official BEx Sigma Tech issued credential.</li>
                      <li>If you believe this is an error, contact <strong style={{ color: '#38bdf8' }}>bexsigmatech@gmail.com</strong>.</li>
                    </ul>
                  </div>

                  <div className="cert-verify-actions">
                    <button
                      onClick={() => { setResult(null); setInputCertId(''); navigate('/verify') }}
                      className="cert-nav-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Try Another Certificate ID
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Back Link */}
          <div style={{ marginTop: '28px', textAlign: 'center', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Link
              to="/"
              style={{
                color: '#94a3b8',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color = '#38bdf8'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}
            >
              <FaArrowLeft />
              <span>Return to BEx Sigma Tech Main Site</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
