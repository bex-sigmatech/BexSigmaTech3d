import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FaCertificate,
  FaPlusCircle,
  FaListAlt,
  FaUserGraduate,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaDownload,
  FaCopy,
  FaCheck,
  FaTimes,
  FaEye,
  FaBan,
  FaUndo,
  FaTrashAlt,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaIdCard,
  FaQrcode
} from 'react-icons/fa'
import AdminLogin from './AdminLogin'
import '../../styles/adminCertificate.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'https://bexsigmatech3d.onrender.com')

const COURSE_PRESETS = [
  {
    name: 'DSA',
    label: 'DSA Masterclass (Data Structures & Algorithms)',
    defaultDuration: '3 Months (120 Hours)',
    badge: 'Popular',
    icon: '⚡'
  },
  {
    name: 'EXCEL Master class',
    label: 'EXCEL Master class (Advanced Analytics & Models)',
    defaultDuration: '4 Weeks (40 Hours)',
    badge: 'Popular',
    icon: '📊'
  }
]

const POPULAR_COURSES = ['DSA', 'EXCEL Master class']

const CERTIFICATE_TYPES = [
  'Certificate of Completion',
  'Certificate of Excellence',
  'Professional Certification',
  'Mastery Achievement'
]

function formatCertificateDate(dateStr) {
  if (!dateStr) return '25 Oct 2026'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = d.getDate()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return dateStr
  }
}

export default function AdminDashboard() {
  // Session-scoped token: visiting /admin in a new tab/session always prompts for password
  const [authToken, setAuthToken] = useState(() => {
    try { localStorage.removeItem('bex_admin_token') } catch {}
    return sessionStorage.getItem('bex_admin_token') || ''
  })
  const [adminUser, setAdminUser] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'issue' | 'certificates' | 'students' | 'settings'

  // Data state
  const [stats, setStats] = useState({ totalIssued: 0, totalStudents: 0, validCertificates: 0, revokedCertificates: 0 })
  const [certificates, setCertificates] = useState([])
  const [students, setStudents] = useState([])
  const [loadingData, setLoadingData] = useState(false)

  // Filters
  const [certSearch, setCertSearch] = useState('')
  const [certCourseFilter, setCertCourseFilter] = useState('')
  const [certStatusFilter, setCertStatusFilter] = useState('')
  const [studentSearch, setStudentSearch] = useState('')

  // Modals
  const [viewCertModal, setViewCertModal] = useState(null)
  const [successIssueModal, setSuccessIssueModal] = useState(null)
  const [studentHistoryModal, setStudentHistoryModal] = useState(null)
  const [actionConfirmModal, setActionConfirmModal] = useState(null) // { type: 'revoke'|'restore'|'delete', cert }
  const [revokeReason, setRevokeReason] = useState('')

  // Toast
  const [copyToast, setCopyToast] = useState('')

  // Issue Form State
  const todayStr = new Date().toISOString().split('T')[0]
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    courseName: 'DSA',
    courseDuration: '3 Months (120 Hours)',
    certificateType: 'Certificate of Completion',
    completionDate: todayStr,
    issueDate: todayStr,
    additionalDetails: ''
  })
  const [customCourseInput, setCustomCourseInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Settings State
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passLoading, setPassLoading] = useState(false)
  const [passMessage, setPassMessage] = useState({ type: '', text: '' })

  // 1. Check Authentication on Mount
  useEffect(() => {
    const verifySession = async () => {
      try { localStorage.removeItem('bex_admin_token') } catch {}
      const token = sessionStorage.getItem('bex_admin_token')
      if (!token) {
        setAuthToken('')
        setAdminUser(null)
        setAuthChecking(false)
        return
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (res.ok && data.success) {
          setAuthToken(token)
          setAdminUser(data.admin)
        } else {
          sessionStorage.removeItem('bex_admin_token')
          setAuthToken('')
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message)
        sessionStorage.removeItem('bex_admin_token')
        setAuthToken('')
      } finally {
        setAuthChecking(false)
      }
    }

    verifySession()
  }, [])

  // 2. Fetch Data when logged in
  const fetchData = async () => {
    if (!authToken) return
    setLoadingData(true)
    try {
      const headers = { Authorization: `Bearer ${authToken}` }
      const [statsRes, certsRes, studentsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/certificates/stats`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/certificates?limit=150`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/students`, { headers })
      ])

      const statsData = await statsRes.json()
      const certsData = await certsRes.json()
      const studentsData = await studentsRes.json()

      if (statsData.success) setStats(statsData.stats)
      if (certsData.success) setCertificates(certsData.certificates)
      if (studentsData.success) setStudents(studentsData.students)
    } catch (err) {
      console.error('Data fetch error:', err)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (authToken) {
      fetchData()
    }
  }, [authToken])

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/admin/logout`, { method: 'POST' })
    } catch {}
    try { localStorage.removeItem('bex_admin_token') } catch {}
    sessionStorage.removeItem('bex_admin_token')
    setAuthToken('')
    setAdminUser(null)
  }

  // Copy helper with feedback toast
  const handleCopyLink = (url, label = 'Verification link') => {
    navigator.clipboard.writeText(url)
    setCopyToast(`${label} copied to clipboard!`)
    setTimeout(() => setCopyToast(''), 2500)
  }

  // Ensure body/html allows scrolling in Admin Dashboard
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

  // Robust download handler that triggers instant direct save
  const handleDownloadCertificate = (certId) => {
    if (!certId) return
    const downloadUrl = `${BACKEND_URL}/api/admin/certificates/${encodeURIComponent(certId)}/download`
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${certId}.pdf`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      try { document.body.removeChild(link) } catch {}
    }, 200)
  }

  // Issue Certificate Submit Handler
  const handleIssueSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const effectiveCourse = formData.courseName === 'CUSTOM' ? customCourseInput.trim() : formData.courseName

    if (!formData.studentName.trim()) {
      setFormError('Student full name is required.')
      return
    }
    if (!effectiveCourse) {
      setFormError('Course name is required.')
      return
    }
    if (!formData.courseDuration.trim()) {
      setFormError('Course duration is required.')
      return
    }
    if (!formData.completionDate) {
      setFormError('Completion date is required.')
      return
    }
    if (!formData.issueDate) {
      setFormError('Issue date is required.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        courseName: effectiveCourse
      }

      const res = await fetch(`${BACKEND_URL}/api/admin/certificates/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to issue certificate.')
      }

      // Success modal
      setSuccessIssueModal(data)

      // Refresh data list & stats
      fetchData()

      // Reset form (keep dates and durations convenient)
      setFormData(prev => ({
        ...prev,
        studentName: '',
        studentId: '',
        additionalDetails: ''
      }))
      setCustomCourseInput('')
    } catch (err) {
      setFormError(err.message || 'Error occurred while generating certificate.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Status toggle handler (revoke / restore)
  const handleStatusToggle = async () => {
    if (!actionConfirmModal?.cert) return
    const { cert, type } = actionConfirmModal

    try {
      if (type === 'delete') {
        const res = await fetch(`${BACKEND_URL}/api/admin/certificates/${cert.certificateId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        })
        const data = await res.json()
        if (data.success) {
          setCopyToast(`Certificate ${cert.certificateId} deleted.`)
          setTimeout(() => setCopyToast(''), 2500)
        }
      } else {
        const newStatus = type === 'revoke' ? 'revoked' : 'valid'
        const res = await fetch(`${BACKEND_URL}/api/admin/certificates/${cert.certificateId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ status: newStatus, reason: revokeReason })
        })
        const data = await res.json()
        if (data.success) {
          setCopyToast(`Certificate ${cert.certificateId} ${newStatus === 'revoked' ? 'revoked' : 'restored'}.`)
          setTimeout(() => setCopyToast(''), 2500)
        }
      }
      fetchData()
    } catch (err) {
      alert(`Action failed: ${err.message}`)
    } finally {
      setActionConfirmModal(null)
      setRevokeReason('')
    }
  }

  // Change Password Handler
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPassMessage({ type: '', text: '' })

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMessage({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }

    if (passForm.newPassword.length < 6) {
      setPassMessage({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }

    setPassLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password.')
      }

      setPassMessage({ type: 'success', text: 'Admin password changed successfully!' })
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPassMessage({ type: 'error', text: err.message })
    } finally {
      setPassLoading(false)
    }
  }

  // Available Courses for filtering (guarantees DSA & EXCEL Master class + any issued)
  const allCourseOptions = useMemo(() => {
    const set = new Set(['DSA', 'EXCEL Master class'])
    certificates.forEach(c => {
      if (c.courseName) set.add(c.courseName)
    })
    return Array.from(set)
  }, [certificates])

  // Filtered Certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter(c => {
      const matchesSearch = !certSearch.trim() ||
        c.certificateId.toLowerCase().includes(certSearch.toLowerCase().trim()) ||
        c.studentName.toLowerCase().includes(certSearch.toLowerCase().trim()) ||
        (c.studentId && c.studentId.toLowerCase().includes(certSearch.toLowerCase().trim())) ||
        c.courseName.toLowerCase().includes(certSearch.toLowerCase().trim())

      const matchesCourse = !certCourseFilter || c.courseName === certCourseFilter
      const matchesStatus = !certStatusFilter || c.status === certStatusFilter

      return matchesSearch && matchesCourse && matchesStatus
    })
  }, [certificates, certSearch, certCourseFilter, certStatusFilter])

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      if (!studentSearch.trim()) return true
      const q = studentSearch.toLowerCase().trim()
      return s.studentName.toLowerCase().includes(q) ||
        (s.studentId && s.studentId.toLowerCase().includes(q)) ||
        s.courses.some(course => course.toLowerCase().includes(q))
    })
  }, [students, studentSearch])

  // If checking session or not logged in, render Login
  if (authChecking) {
    return (
      <div className="cert-admin-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#38bdf8', fontFamily: 'Orbitron', letterSpacing: '0.15em' }}>AUTHENTICATING ADMIN PORTAL...</div>
      </div>
    )
  }

  if (!authToken) {
    return <AdminLogin onLoginSuccess={(token, admin) => { setAuthToken(token); setAdminUser(admin) }} />
  }

  return (
    <div className="cert-admin-root">
      <div className="cert-ambient-bg" />
      <div className="cert-grid-pattern" />

      {/* Copy Toast Notification */}
      {copyToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontSize: '0.86rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'certFadeIn 0.2s ease'
          }}
        >
          <FaCheck />
          <span>{copyToast}</span>
        </div>
      )}

      <div className="cert-content-container">
        {/* ── TOPBAR ── */}
        <header className="cert-topbar">
          <div className="cert-brand-group">
            <div className="cert-brand-emblem">Σ</div>
            <div>
              <h1 className="cert-brand-title">
                BEx Sigma Tech
                <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  ADMIN
                </span>
              </h1>
              <div className="cert-brand-subtitle">CERTIFICATE ISSUANCE & VERIFICATION SYSTEM</div>
            </div>
          </div>

          <div className="cert-topbar-actions">
            <button
              onClick={() => setActiveTab('issue')}
              className="cert-generate-topbar-btn"
              title="Issue a new student certificate"
            >
              <FaPlusCircle />
              <span>Generate Certificate</span>
            </button>

            <span className="cert-admin-badge">
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              OPERATOR: {adminUser?.username || 'Admin'}
            </span>

            <Link to="/verify" target="_blank" className="cert-nav-btn" title="Open Public Verification Page">
              <FaExternalLinkAlt />
              <span>Public Verification Portal</span>
            </Link>

            <Link to="/" className="cert-nav-btn" title="Back to Main Website">
              <FaArrowLeft />
              <span>HQ</span>
            </Link>

            <button onClick={handleLogout} className="cert-nav-btn logout" title="Sign out of admin console">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* ── TABS NAVIGATION ── */}
        <nav className="cert-tabs-bar">
          <button
            className={`cert-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaCertificate />
            <span>Dashboard</span>
          </button>
          <button
            className={`cert-tab-item ${activeTab === 'issue' ? 'active' : ''}`}
            onClick={() => setActiveTab('issue')}
          >
            <FaPlusCircle />
            <span>Generate Certificate</span>
          </button>
          <button
            className={`cert-tab-item ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <FaListAlt />
            <span>All Certificates</span>
            <span className="cert-tab-badge">{stats.totalIssued}</span>
          </button>
          <button
            className={`cert-tab-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <FaUserGraduate />
            <span>Students</span>
            <span className="cert-tab-badge">{stats.totalStudents}</span>
          </button>
          <button
            className={`cert-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog />
            <span>Settings</span>
          </button>
        </nav>

        {/* ══════════════════════════════════════════════════════════════════
            TAB 1: DASHBOARD OVERVIEW
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div>
            {/* Quick Hero Banner with Direct Action */}
            <div className="cert-hero-banner">
              <div>
                <h3 className="cert-hero-title">
                  <span>⚡ Issue Student Certificate</span>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    DSA & EXCEL Master class
                  </span>
                </h3>
                <p className="cert-hero-desc">
                  Issue official verifiable certificates with QR codes for <strong>DSA</strong> or <strong>EXCEL Master class</strong> students in one click.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('issue')}
                className="cert-hero-cta"
                title="Generate certificate"
              >
                <FaPlusCircle />
                <span>Generate Certificate Now →</span>
              </button>
            </div>

            {/* Stat Cards */}
            <div className="cert-stats-grid">
              <div className="cert-stat-card" style={{ '--card-accent': '#38bdf8' }}>
                <div className="cert-stat-icon-wrap"><FaCertificate /></div>
                <div>
                  <div className="cert-stat-num">{stats.totalIssued}</div>
                  <div className="cert-stat-label">Total Certificates Issued</div>
                </div>
              </div>

              <div className="cert-stat-card" style={{ '--card-accent': '#10b981' }}>
                <div className="cert-stat-icon-wrap" style={{ color: '#10b981' }}><FaUserGraduate /></div>
                <div>
                  <div className="cert-stat-num">{stats.totalStudents}</div>
                  <div className="cert-stat-label">Total Enrolled Students</div>
                </div>
              </div>

              <div className="cert-stat-card" style={{ '--card-accent': '#34d399' }}>
                <div className="cert-stat-icon-wrap" style={{ color: '#34d399' }}><FaCheck /></div>
                <div>
                  <div className="cert-stat-num" style={{ color: '#34d399' }}>{stats.validCertificates}</div>
                  <div className="cert-stat-label">Valid Active Certificates</div>
                </div>
              </div>

              <div className="cert-stat-card" style={{ '--card-accent': '#ef4444' }}>
                <div className="cert-stat-icon-wrap" style={{ color: '#ef4444' }}><FaBan /></div>
                <div>
                  <div className="cert-stat-num" style={{ color: '#f87171' }}>{stats.revokedCertificates}</div>
                  <div className="cert-stat-label">Revoked Certificates</div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Table */}
            <div className="cert-card-panel" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="cert-panel-title" style={{ fontSize: '1.2rem' }}>Recently Issued Certificates</h2>
                  <p className="cert-panel-sub">Official credential ledger in the persistent database</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setActiveTab('issue')} className="cert-nav-btn" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                    <FaPlusCircle />
                    <span>Issue New Certificate</span>
                  </button>
                  <button onClick={() => setActiveTab('certificates')} className="cert-nav-btn">
                    <span>View All →</span>
                  </button>
                </div>
              </div>

              {certificates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <FaCertificate style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '12px' }} />
                  <p>No certificates issued yet.</p>
                  <button onClick={() => setActiveTab('issue')} className="cert-submit-btn" style={{ maxWidth: '240px', margin: '14px auto 0' }}>
                    Generate First Certificate
                  </button>
                </div>
              ) : (
                <div className="cert-table-wrapper">
                  <table className="cert-data-table">
                    <thead>
                      <tr>
                        <th>Certificate ID</th>
                        <th>Student Name</th>
                        <th>Course</th>
                        <th>Issue Date</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.slice(0, 8).map(cert => (
                        <tr key={cert.certificateId}>
                          <td>
                            <span style={{ fontFamily: 'var(--cert-font-ui)', fontWeight: 800, color: '#38bdf8' }}>
                              {cert.certificateId}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#ffffff' }}>{cert.studentName}</div>
                            {cert.studentId && <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ID: {cert.studentId}</div>}
                          </td>
                          <td>
                            <div style={{ color: '#cbd5e1' }}>{cert.courseName}</div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{cert.courseDuration}</div>
                          </td>
                          <td style={{ color: '#94a3b8' }}>{cert.issueDate}</td>
                          <td>
                            <span className={`cert-status-pill ${cert.status}`}>
                              {cert.status === 'valid' ? '● Valid' : '✕ Revoked'}
                            </span>
                          </td>
                          <td>
                            <div className="cert-actions-cell" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="cert-action-btn"
                                onClick={() => setViewCertModal(cert)}
                                title="View details"
                              >
                                <FaEye />
                              </button>
                              <button
                                type="button"
                                className="cert-action-btn"
                                onClick={() => handleDownloadCertificate(cert.certificateId)}
                                title="Download PDF"
                              >
                                <FaDownload />
                              </button>
                              <button
                                className="cert-action-btn"
                                onClick={() => handleCopyLink(cert.verificationUrl, 'Verification URL')}
                                title="Copy verification URL"
                              >
                                <FaCopy />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2: ISSUE CERTIFICATE FORM
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'issue' && (
          <div className="cert-issue-layout">
            {/* Form Column */}
            <div className="cert-card-panel">
              <div className="cert-panel-header">
                <h2 className="cert-panel-title">Issue Official Certificate</h2>
                <p className="cert-panel-sub">Fill out the student and curriculum credentials to generate a verifiable PDF with QR code.</p>
              </div>

              {formError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '12px 14px', color: '#f87171', fontSize: '0.82rem', marginBottom: '18px' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleIssueSubmit} className="cert-form-grid">
                {/* Student Full Name */}
                <div className="cert-form-group cert-form-full">
                  <label className="cert-form-label">
                    <span>Student Full Name <span className="req">*</span></span>
                  </label>
                  <input
                    type="text"
                    className="cert-input"
                    placeholder="Enter student name"
                    value={formData.studentName}
                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                    required
                  />
                </div>

                {/* Student ID */}
                <div className="cert-form-group">
                  <label className="cert-form-label">
                    <span>Student ID (Optional)</span>
                  </label>
                  <input
                    type="text"
                    className="cert-input"
                    placeholder="e.g. BEX-2026-9041"
                    value={formData.studentId}
                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  />
                </div>

                {/* Certificate Type */}
                <div className="cert-form-group">
                  <label className="cert-form-label">
                    <span>Certificate Type <span className="req">*</span></span>
                  </label>
                  <select
                    className="cert-select"
                    value={formData.certificateType}
                    onChange={e => setFormData({ ...formData, certificateType: e.target.value })}
                  >
                    {CERTIFICATE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Course Name with 1-Click Course Track Selectors */}
                <div className="cert-form-group cert-form-full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <label className="cert-form-label" style={{ marginBottom: 0 }}>
                      <span>Course Track <span className="req">*</span></span>
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Click to select track:
                    </span>
                  </div>

                  {/* 1-Click Course Pills: DSA & EXCEL Master class */}
                  <div className="cert-course-pills">
                    {COURSE_PRESETS.map(preset => {
                      const isSelected = formData.courseName === preset.name
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          className={`cert-course-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              courseName: preset.name,
                              courseDuration: preset.defaultDuration
                            }))
                            setCustomCourseInput('')
                          }}
                        >
                          <span>{preset.icon}</span>
                          <span style={{ fontWeight: 800 }}>{preset.name}</span>
                          <span className="pill-badge">{preset.badge}</span>
                          {isSelected && <FaCheck size={11} style={{ marginLeft: '4px' }} />}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      className={`cert-course-pill ${formData.courseName === 'CUSTOM' ? 'active' : ''}`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, courseName: 'CUSTOM' }))
                      }}
                    >
                      <span>✍️</span>
                      <span>Custom Course</span>
                      {formData.courseName === 'CUSTOM' && <FaCheck size={11} style={{ marginLeft: '4px' }} />}
                    </button>
                  </div>

                  {formData.courseName === 'CUSTOM' ? (
                    <input
                      type="text"
                      className="cert-input"
                      placeholder="Type custom course title here"
                      value={customCourseInput}
                      onChange={e => setCustomCourseInput(e.target.value)}
                      required
                      autoFocus
                    />
                  ) : (
                    <select
                      className="cert-select"
                      value={formData.courseName}
                      onChange={e => {
                        const selected = e.target.value
                        const found = COURSE_PRESETS.find(c => c.name === selected)
                        setFormData(prev => ({
                          ...prev,
                          courseName: selected,
                          courseDuration: found ? found.defaultDuration : prev.courseDuration
                        }))
                      }}
                    >
                      {COURSE_PRESETS.map(preset => (
                        <option key={preset.name} value={preset.name}>
                          {preset.name} — {preset.defaultDuration}
                        </option>
                      ))}
                      <option value="CUSTOM">-- Custom Course Title --</option>
                    </select>
                  )}
                </div>

                {/* Course Duration */}
                <div className="cert-form-group">
                  <label className="cert-form-label">
                    <span>Course Duration <span className="req">*</span></span>
                  </label>
                  <input
                    type="text"
                    className="cert-input"
                    placeholder="e.g. 3 Months (120 Hours)"
                    value={formData.courseDuration}
                    onChange={e => setFormData({ ...formData, courseDuration: e.target.value })}
                    required
                  />
                </div>

                {/* Course Completion Date */}
                <div className="cert-form-group">
                  <label className="cert-form-label">
                    <span>Completion Date <span className="req">*</span></span>
                  </label>
                  <input
                    type="date"
                    className="cert-input"
                    value={formData.completionDate}
                    onChange={e => setFormData({ ...formData, completionDate: e.target.value })}
                    required
                  />
                </div>

                {/* Certificate Issue Date */}
                <div className="cert-form-group">
                  <label className="cert-form-label">
                    <span>Certificate Issue Date <span className="req">*</span></span>
                  </label>
                  <input
                    type="date"
                    className="cert-input"
                    value={formData.issueDate}
                    onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                    required
                  />
                </div>

                {/* Additional Details */}
                <div className="cert-form-group cert-form-full">
                  <label className="cert-form-label">
                    <span>Additional Details / Honors (Optional)</span>
                  </label>
                  <textarea
                    className="cert-textarea"
                    placeholder="e.g. Graduated with First-Class Distinction & Capstone Deployment"
                    value={formData.additionalDetails}
                    onChange={e => setFormData({ ...formData, additionalDetails: e.target.value })}
                  />
                </div>

                <div className="cert-form-full">
                  <button type="submit" className="cert-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="product-btn-spinner" />
                        <span>Generating Certificate...</span>
                      </>
                    ) : (
                      <>
                        <FaCertificate />
                        <span>Generate Certificate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div>
              <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Live Certificate Preview
                </span>
                <span style={{ fontSize: '0.72rem', color: '#10b981' }}>● Vector Layout Sync</span>
              </div>

              <div
                className="cert-preview-canvas-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '842 / 595.28',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: '#ffffff'
                }}
              >
                {/* 1. Master Template Background (Exact Canva Geometry & Branding) */}
                <img
                  src={formData.courseName.toLowerCase().includes('excel') ? '/assets/certificate_template_excel_web.png' : '/assets/certificate_template_dsa_web.png'}
                  alt="Certificate Template"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'fill',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                />

                {/* 2. Dynamic Recipient Name Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    left: '8.08%',
                    top: '47.4%',
                    width: '61.76%',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(0.85rem, 2.3vw, 1.45rem)',
                    color: '#0f172a',
                    letterSpacing: '0.01em',
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    pointerEvents: 'none'
                  }}
                >
                  {formData.studentName.trim() ? formData.studentName.trim().toUpperCase() : 'NAME'}
                </div>

                {/* 3. Dynamic Description (DSA / Custom Track only) */}
                {!formData.courseName.toLowerCase().includes('excel') && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '8.08%',
                      top: '58.2%',
                      width: '58.8%',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                      fontSize: 'clamp(0.42rem, 0.95vw, 0.58rem)',
                      lineHeight: 1.35,
                      color: '#475569',
                      pointerEvents: 'none'
                    }}
                  >
                    For successfully completing the{' '}
                    <strong style={{ color: '#0f172a', fontWeight: 700 }}>
                      {formData.courseName === 'CUSTOM'
                        ? (customCourseInput || 'Custom Course Title')
                        : (formData.courseName.toLowerCase().includes('dsa')
                            ? 'Data Structures & Algorithms (DSA) Masterclass'
                            : formData.courseName)}
                    </strong>{' '}
                    and demonstrating practical skills in{' '}
                    {formData.additionalDetails || (formData.courseName.toLowerCase().includes('dsa')
                      ? 'data structures, algorithms, problem solving, time complexity analysis, and software development.'
                      : 'core curriculum concepts, practical problem-solving methodologies, and industry-standard applications.')}
                  </div>
                )}

                {/* 4. Three Metric Badges Values */}
                {/* Badge 1: Date */}
                <div
                  style={{
                    position: 'absolute',
                    left: '12.21%',
                    top: '74.85%',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(0.42rem, 0.95vw, 0.58rem)',
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}
                >
                  {formatCertificateDate(formData.completionDate || '2026-11-21')}
                </div>

                {/* Badge 2: Duration */}
                <div
                  style={{
                    position: 'absolute',
                    left: '30.57%',
                    top: '74.85%',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(0.42rem, 0.95vw, 0.58rem)',
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}
                >
                  {formData.courseDuration || (formData.courseName.toLowerCase().includes('excel') ? '12 Hours' : '3 Months (120 Hours)')}
                </div>

                {/* Badge 3: Certificate ID */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50.19%',
                    top: '74.85%',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(0.42rem, 0.95vw, 0.58rem)',
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                  }}
                >
                  {formData.studentId || (formData.courseName.toLowerCase().includes('excel') ? 'BEX-CERT-EXL-2026-0001' : 'BEX-CERT-DSA-2026-0001')}
                </div>

                {/* 5. Bottom Verification Link */}
                <div
                  style={{
                    position: 'absolute',
                    left: '8.08%',
                    top: '90.4%',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    fontSize: 'clamp(0.4rem, 0.82vw, 0.52rem)',
                    fontWeight: 700,
                    color: '#064e3b',
                    pointerEvents: 'none'
                  }}
                >
                  www.bexsigmatech.com
                </div>

                {/* 6. Non-Excel Designation (DSA only) */}
                {!formData.courseName.toLowerCase().includes('excel') && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '4.5%',
                      top: '90.7%',
                      width: '38%',
                      textAlign: 'right',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: 'clamp(0.4rem, 0.85vw, 0.52rem)',
                      color: '#064e3b',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none'
                    }}
                  >
                    Founder & Lead Technical Architect
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3: ALL CERTIFICATES MANAGEMENT
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'certificates' && (
          <div>
            {/* Toolbar */}
            <div className="cert-table-toolbar">
              <div className="cert-search-box">
                <FaSearch style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search student, certificate ID, course..."
                  value={certSearch}
                  onChange={e => setCertSearch(e.target.value)}
                />
              </div>

              <div className="cert-filter-group">
                <select
                  className="cert-select"
                  style={{ width: 'auto', minWidth: '170px' }}
                  value={certStatusFilter}
                  onChange={e => setCertStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="valid">Valid Active Only</option>
                  <option value="revoked">Revoked Only</option>
                </select>

                <select
                  className="cert-select"
                  style={{ width: 'auto', minWidth: '220px' }}
                  value={certCourseFilter}
                  onChange={e => setCertCourseFilter(e.target.value)}
                >
                  <option value="">All Courses</option>
                  {allCourseOptions.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>

                <button onClick={() => setActiveTab('issue')} className="cert-submit-btn" style={{ padding: '8px 16px', fontSize: '0.82rem', width: 'auto', margin: 0 }}>
                  <FaPlusCircle />
                  <span>Generate Certificate</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="cert-table-wrapper">
              <table className="cert-data-table">
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Issue Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        No certificates matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map(cert => (
                      <tr key={cert.certificateId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontFamily: 'var(--cert-font-ui)', fontWeight: 800, color: '#38bdf8' }}>
                              {cert.certificateId}
                            </span>
                            <button
                              onClick={() => handleCopyLink(cert.certificateId, 'Certificate ID')}
                              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                              title="Copy ID"
                            >
                              <FaCopy size={11} />
                            </button>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{cert.certificateType}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#ffffff' }}>{cert.studentName}</div>
                          {cert.studentId && <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ID: {cert.studentId}</div>}
                        </td>
                        <td>
                          <div style={{ color: '#cbd5e1' }}>{cert.courseName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{cert.courseDuration}</div>
                        </td>
                        <td style={{ color: '#94a3b8' }}>{cert.issueDate}</td>
                        <td>
                          <span className={`cert-status-pill ${cert.status}`}>
                            {cert.status === 'valid' ? '● Valid' : '✕ Revoked'}
                          </span>
                        </td>
                        <td>
                          <div className="cert-actions-cell" style={{ justifyContent: 'flex-end' }}>
                            <button
                              className="cert-action-btn"
                              onClick={() => setViewCertModal(cert)}
                              title="View details"
                            >
                              <FaEye />
                            </button>
                            <button
                              type="button"
                              className="cert-action-btn"
                              onClick={() => handleDownloadCertificate(cert.certificateId)}
                              title="Download PDF"
                            >
                              <FaDownload />
                            </button>
                            <button
                              className="cert-action-btn"
                              onClick={() => handleCopyLink(cert.verificationUrl, 'Verification Link')}
                              title="Copy verification link"
                            >
                              <FaCopy />
                            </button>
                            {cert.status === 'valid' ? (
                              <button
                                className="cert-action-btn danger"
                                onClick={() => setActionConfirmModal({ type: 'revoke', cert })}
                                title="Revoke Certificate"
                              >
                                <FaBan />
                              </button>
                            ) : (
                              <button
                                className="cert-action-btn"
                                style={{ color: '#34d399' }}
                                onClick={() => setActionConfirmModal({ type: 'restore', cert })}
                                title="Restore Certificate"
                              >
                                <FaUndo />
                              </button>
                            )}
                            <button
                              className="cert-action-btn danger"
                              onClick={() => setActionConfirmModal({ type: 'delete', cert })}
                              title="Delete Record"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4: STUDENT MANAGEMENT
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'students' && (
          <div>
            <div className="cert-table-toolbar">
              <div className="cert-search-box">
                <FaSearch style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search students by name, ID or course..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                />
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                Showing <strong>{filteredStudents.length}</strong> registered students
              </div>
            </div>

            <div className="cert-table-wrapper">
              <table className="cert-data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Courses Completed</th>
                    <th>Total Certificates</th>
                    <th>Standing</th>
                    <th style={{ textAlign: 'right' }}>Certificate History</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        No student records found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.92rem' }}>{st.studentName}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--cert-font-mono)', color: '#38bdf8' }}>
                          {st.studentId}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {st.courses.map((course, cIdx) => (
                              <span key={cIdx} style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>
                                • {course}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                            {st.totalCertificates}
                          </span>
                        </td>
                        <td>
                          {st.revokedCount > 0 ? (
                            <span className="cert-status-pill revoked">
                              {st.validCount} Valid / {st.revokedCount} Revoked
                            </span>
                          ) : (
                            <span className="cert-status-pill valid">
                              ● All Valid ({st.validCount})
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="cert-nav-btn"
                            onClick={() => setStudentHistoryModal(st)}
                            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                          >
                            <FaListAlt />
                            <span>View History ({st.totalCertificates})</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5: SETTINGS & SECURITY
           ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
            {/* Change Password Panel */}
            <div className="cert-card-panel">
              <div className="cert-panel-header">
                <h2 className="cert-panel-title">Change Admin Password</h2>
                <p className="cert-panel-sub">Update the credential used to access this administrative authority.</p>
              </div>

              {passMessage.text && (
                <div
                  style={{
                    background: passMessage.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                    border: `1px solid ${passMessage.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    color: passMessage.type === 'error' ? '#f87171' : '#34d399',
                    fontSize: '0.84rem',
                    marginBottom: '18px'
                  }}
                >
                  {passMessage.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="cert-form-group">
                  <label className="cert-form-label"><span>Current Password</span></label>
                  <input
                    type="password"
                    className="cert-input"
                    value={passForm.currentPassword}
                    onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="cert-form-group">
                  <label className="cert-form-label"><span>New Password (Min 6 Characters)</span></label>
                  <input
                    type="password"
                    className="cert-input"
                    value={passForm.newPassword}
                    onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="cert-form-group">
                  <label className="cert-form-label"><span>Confirm New Password</span></label>
                  <input
                    type="password"
                    className="cert-input"
                    value={passForm.confirmPassword}
                    onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="cert-submit-btn" disabled={passLoading}>
                  {passLoading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            </div>

            {/* System Info & Security Telemetry */}
            <div className="cert-card-panel">
              <div className="cert-panel-header">
                <h2 className="cert-panel-title">System & Security Telemetry</h2>
                <p className="cert-panel-sub">Verified engine configuration and compliance details</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Organization Authority</span>
                  <strong style={{ color: '#38bdf8' }}>BEx Sigma Tech</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Database Storage Engine</span>
                  <strong style={{ color: '#10b981' }}>JSON Persistent Database</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>PDF Engine</span>
                  <strong style={{ color: '#ffffff' }}>Vector PDFKit (A4 Landscape)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>QR Code Resolution</span>
                  <strong style={{ color: '#ffffff' }}>Level-H Error Correction (300DPI)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Password Security</span>
                  <strong style={{ color: '#10b981' }}>bcrypt (10 Salt Rounds)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                  <span style={{ color: '#94a3b8' }}>Public Verification Route</span>
                  <strong style={{ color: '#38bdf8' }}>/verify/:certificateId</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 1: SUCCESSFUL CERTIFICATE CREATION
         ══════════════════════════════════════════════════════════════════ */}
      {successIssueModal && (
        <div className="cert-modal-backdrop">
          <div className="cert-modal-content" style={{ maxWidth: '520px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
              <FaCheck />
            </div>

            <h3 className="cert-modal-title" style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '6px' }}>
              Certificate Successfully Issued!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', marginBottom: '20px' }}>
              The certificate has been permanently recorded in the database and is ready for public verification.
            </p>

            <div style={{ background: 'rgba(3, 7, 18, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '18px', marginBottom: '22px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                Unique Certificate ID
              </div>
              <div style={{ fontFamily: 'var(--cert-font-ui)', fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.04em' }}>
                {successIssueModal.certificate?.certificateId}
              </div>
              <div style={{ fontSize: '0.86rem', color: '#ffffff', marginTop: '6px', fontWeight: 700 }}>
                {successIssueModal.certificate?.studentName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                {successIssueModal.certificate?.courseName}
              </div>

              {/* QR Preview */}
              {successIssueModal.qrDataUrl && (
                <div style={{ marginTop: '14px' }}>
                  <img
                    src={successIssueModal.qrDataUrl}
                    alt="Verification QR Code"
                    style={{ width: '130px', height: '130px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.15)', background: '#fff', padding: '4px' }}
                  />
                  <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '4px' }}>
                    Scan with any smartphone camera to verify
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleDownloadCertificate(successIssueModal.certificate?.certificateId)}
                className="cert-submit-btn"
                style={{ textDecoration: 'none', cursor: 'pointer', margin: 0 }}
              >
                <FaDownload />
                <span>Download Official Certificate PDF</span>
              </button>

              <button
                onClick={() => handleCopyLink(successIssueModal.verificationUrl, 'Public Verification Link')}
                className="cert-nav-btn"
                style={{ justifyContent: 'center', padding: '12px' }}
              >
                <FaCopy />
                <span>Copy Public Verification Link</span>
              </button>

              <button
                onClick={() => setSuccessIssueModal(null)}
                className="cert-nav-btn"
                style={{ justifyContent: 'center', background: 'transparent' }}
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 2: VIEW CERTIFICATE DETAILS
         ══════════════════════════════════════════════════════════════════ */}
      {viewCertModal && (
        <div className="cert-modal-backdrop">
          <div className="cert-modal-content">
            <div className="cert-modal-header">
              <h3 className="cert-modal-title">Certificate Intelligence Dossier</h3>
              <button className="cert-modal-close" onClick={() => setViewCertModal(null)}><FaTimes /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>CERTIFICATE ID</div>
                  <div style={{ fontFamily: 'var(--cert-font-ui)', fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>
                    {viewCertModal.certificateId}
                  </div>
                </div>
                <span className={`cert-status-pill ${viewCertModal.status}`}>
                  {viewCertModal.status === 'valid' ? '● Valid Active' : '✕ Revoked'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.84rem' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>STUDENT NAME</div>
                  <strong style={{ color: '#ffffff' }}>{viewCertModal.studentName}</strong>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>STUDENT ID</div>
                  <strong style={{ color: '#cbd5e1' }}>{viewCertModal.studentId || 'N/A'}</strong>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>COURSE</div>
                  <strong style={{ color: '#cbd5e1' }}>{viewCertModal.courseName}</strong>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>DURATION</div>
                  <strong style={{ color: '#cbd5e1' }}>{viewCertModal.courseDuration}</strong>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>COMPLETION DATE</div>
                  <strong style={{ color: '#cbd5e1' }}>{viewCertModal.completionDate}</strong>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>ISSUE DATE</div>
                  <strong style={{ color: '#cbd5e1' }}>{viewCertModal.issueDate}</strong>
                </div>
              </div>

              {viewCertModal.qrDataUrl && (
                <div style={{ textAlign: 'center', padding: '14px', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '12px' }}>
                  <img
                    src={viewCertModal.qrDataUrl}
                    alt="QR"
                    style={{ width: '120px', height: '120px', background: '#fff', borderRadius: '8px', padding: '4px' }}
                  />
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '6px' }}>
                    Verification URL: {viewCertModal.verificationUrl}
                  </div>
                </div>
              )}

              {viewCertModal.status === 'revoked' && viewCertModal.revokedReason && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#f87171' }}>
                  <strong>Revocation Reason:</strong> {viewCertModal.revokedReason}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadCertificate(viewCertModal.certificateId)}
                  className="cert-submit-btn"
                  style={{ textDecoration: 'none', margin: 0, flex: 1, cursor: 'pointer' }}
                >
                  <FaDownload />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => handleCopyLink(viewCertModal.verificationUrl, 'Verification URL')}
                  className="cert-nav-btn"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <FaCopy />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 3: STUDENT CERTIFICATE HISTORY
         ══════════════════════════════════════════════════════════════════ */}
      {studentHistoryModal && (
        <div className="cert-modal-backdrop">
          <div className="cert-modal-content">
            <div className="cert-modal-header">
              <div>
                <h3 className="cert-modal-title">{studentHistoryModal.studentName}</h3>
                <span style={{ fontSize: '0.74rem', color: '#38bdf8' }}>Student ID: {studentHistoryModal.studentId}</span>
              </div>
              <button className="cert-modal-close" onClick={() => setStudentHistoryModal(null)}><FaTimes /></button>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '0.84rem', color: '#94a3b8' }}>
              Total Issued Credentials: <strong style={{ color: '#ffffff' }}>{studentHistoryModal.certificates.length}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {studentHistoryModal.certificates.map(cert => (
                <div
                  key={cert.certificateId}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--cert-border)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--cert-font-ui)', fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>
                      {cert.certificateId}
                    </div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.82rem' }}>{cert.courseName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Issued: {cert.issueDate}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`cert-status-pill ${cert.status}`}>
                      {cert.status === 'valid' ? '● Valid' : '✕ Revoked'}
                    </span>
                    <button
                      type="button"
                      className="cert-action-btn"
                      onClick={() => handleDownloadCertificate(cert.certificateId)}
                      title="Download PDF"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL 4: CONFIRMATION (REVOKE / RESTORE / DELETE)
         ══════════════════════════════════════════════════════════════════ */}
      {actionConfirmModal && (
        <div className="cert-modal-backdrop">
          <div className="cert-modal-content" style={{ maxWidth: '460px' }}>
            <div className="cert-modal-header">
              <h3 className="cert-modal-title">
                {actionConfirmModal.type === 'revoke' && 'Revoke Certificate Authority'}
                {actionConfirmModal.type === 'restore' && 'Restore Certificate Authority'}
                {actionConfirmModal.type === 'delete' && 'Delete Certificate Record'}
              </h3>
              <button className="cert-modal-close" onClick={() => setActionConfirmModal(null)}><FaTimes /></button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '16px' }}>
              Are you sure you want to {actionConfirmModal.type} certificate <strong>{actionConfirmModal.cert.certificateId}</strong> for <strong>{actionConfirmModal.cert.studentName}</strong>?
              {actionConfirmModal.type === 'revoke' && ' This will immediately update the public verification portal to show CERTIFICATE REVOKED.'}
              {actionConfirmModal.type === 'delete' && ' This will permanently remove the record and cannot be undone.'}
            </p>

            {actionConfirmModal.type === 'revoke' && (
              <div style={{ marginBottom: '18px' }}>
                <label className="cert-form-label" style={{ marginBottom: '6px' }}><span>Reason for Revocation (Optional)</span></label>
                <input
                  type="text"
                  className="cert-input"
                  placeholder="e.g. Administrative review / Policy violation"
                  value={revokeReason}
                  onChange={e => setRevokeReason(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleStatusToggle}
                className="cert-submit-btn"
                style={{
                  background: actionConfirmModal.type === 'revoke' || actionConfirmModal.type === 'delete'
                    ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  margin: 0,
                  flex: 1
                }}
              >
                Confirm {actionConfirmModal.type.toUpperCase()}
              </button>
              <button
                onClick={() => setActionConfirmModal(null)}
                className="cert-nav-btn"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
