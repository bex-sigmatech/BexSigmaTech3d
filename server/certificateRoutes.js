/**
 * BEx Sigma Tech — Certificate Management & Public Verification API
 * Complete, isolated router for certificate issuance, verification, and admin controls
 */

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const rateLimit = require('express-rate-limit')
const db = require('./db')
const { generateCertificatePdf, generateQrDataUrl, CERT_STORAGE_DIR } = require('./certificatePdfEngine')

const JWT_SECRET = process.env.JWT_SECRET || process.env.DOWNLOAD_TOKEN_SECRET || 'bex_default_jwt_secret_fallback_2026'

/* ── Rate Limiters ── */
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // max 10 login attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Please wait 15 minutes.' }
})

const publicVerifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60, // 60 lookups per min
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Verification rate limit reached. Please wait a moment.' }
})

/* ── Admin Authentication Middleware ── */
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['x-admin-token'] || req.headers['x-admin-jwt'] || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Please sign in.' })
  }

  // 1. Check if token matches static ADMIN_API_KEY
  if (process.env.ADMIN_API_KEY && token === process.env.ADMIN_API_KEY) {
    req.admin = { username: 'Admin', role: 'admin' }
    return next()
  }

  // 2. Check JWT token
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded && decoded.role === 'admin') {
      req.admin = decoded
      return next()
    }
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session. Please sign in again.' })
  }

  return res.status(401).json({ success: false, error: 'Unauthorized access.' })
}

/**
 * Determine the public origin for verification URLs
 */
function getPublicOrigin(req) {
  // If explicitly configured in env
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL.replace(/\/$/, '')
  }
  // If request origin or referer provided by frontend
  if (req.headers.origin) {
    return req.headers.origin.replace(/\/$/, '')
  }
  // Fallback to current host
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http'
  const host = req.get('host') || 'localhost:5174'
  return `${protocol}://${host}`
}

/* ==========================================================================
   1. ADMIN AUTHENTICATION ENDPOINTS
   ========================================================================== */

/**
 * POST /api/admin/login
 * Body: { username, password }
 */
router.post('/admin/login', adminLoginLimiter, (req, res) => {
  try {
    const { username, password } = req.body || {}
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' })
    }

    const adminUser = db.getAdminUser()
    const isValidUsername = adminUser && adminUser.username.toLowerCase() === username.trim().toLowerCase()
    const isValidPassword = isValidUsername && db.verifyAdminPassword(password)

    if (!isValidUsername || !isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' })
    }

    // Generate 24h admin session token
    const token = jwt.sign(
      {
        id: adminUser.id,
        username: adminUser.username,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        id: adminUser.id,
        username: adminUser.username
      }
    })
  } catch (err) {
    console.error('Admin login error:', err)
    res.status(500).json({ success: false, error: 'Authentication service encountered an error.' })
  }
})

/**
 * GET /api/admin/me
 * Validate current session
 */
router.get('/admin/me', requireAdminAuth, (req, res) => {
  const adminUser = db.getAdminUser()
  res.json({
    success: true,
    admin: {
      username: adminUser ? adminUser.username : req.admin.username,
      updatedAt: adminUser?.updatedAt
    }
  })
})

/**
 * POST /api/admin/change-password
 * Body: { currentPassword, newPassword }
 */
router.post('/admin/change-password', requireAdminAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {}
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required.' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' })
    }

    const isMatch = db.verifyAdminPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' })
    }

    db.updateAdminPassword(newPassword)
    res.json({ success: true, message: 'Admin password changed successfully.' })
  } catch (err) {
    console.error('Change password error:', err)
    res.status(500).json({ success: false, error: 'Failed to update password.' })
  }
})

/**
 * POST /api/admin/logout
 */
router.post('/admin/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' })
})

/* ==========================================================================
   2. ADMIN CERTIFICATE MANAGEMENT ENDPOINTS
   ========================================================================== */

/**
 * GET /api/admin/certificates/stats
 */
router.get('/admin/certificates/stats', requireAdminAuth, (req, res) => {
  try {
    const stats = db.getCertificateStats()
    res.json({ success: true, stats })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * GET /api/admin/certificates
 * Query: search, course, status, page, limit
 */
router.get('/admin/certificates', requireAdminAuth, (req, res) => {
  try {
    const { search, course, status, page, limit } = req.query
    const result = db.getCertificates({ search, course, status, page, limit })
    res.json({ success: true, ...result })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * POST /api/admin/certificates/issue
 * Body: { studentName, courseName, courseDuration, certificateType, completionDate, issueDate, studentId, additionalDetails }
 */
router.post('/admin/certificates/issue', requireAdminAuth, async (req, res) => {
  try {
    const {
      studentName,
      courseName,
      courseDuration,
      certificateType,
      completionDate,
      issueDate,
      studentId,
      additionalDetails
    } = req.body || {}

    // Validation
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ success: false, error: 'Student full name is required.' })
    }
    if (!courseName || !courseName.trim()) {
      return res.status(400).json({ success: false, error: 'Course name is required.' })
    }
    if (!courseDuration || !courseDuration.trim()) {
      return res.status(400).json({ success: false, error: 'Course duration is required.' })
    }
    if (!completionDate) {
      return res.status(400).json({ success: false, error: 'Course completion date is required.' })
    }
    if (!issueDate) {
      return res.status(400).json({ success: false, error: 'Certificate issue date is required.' })
    }

    // 1. Generate unique sequential ID
    const certificateId = db.getNextCertificateId()

    // 2. Build verification URL
    const origin = getPublicOrigin(req)
    const verificationUrl = `${origin}/verify/${certificateId}`

    // 3. Generate QR and PDF
    const certPayload = {
      certificateId,
      studentName: studentName.trim(),
      courseName: courseName.trim(),
      courseDuration: courseDuration.trim(),
      certificateType: certificateType || 'Certificate of Completion',
      completionDate,
      issueDate,
      studentId: studentId ? studentId.trim() : undefined,
      additionalDetails: additionalDetails ? additionalDetails.trim() : undefined,
      verificationUrl
    }

    const { pdfPath, qrDataUrl } = await generateCertificatePdf(certPayload)

    // 4. Save to persistent DB
    const savedRecord = db.saveCertificate({
      ...certPayload,
      pdfPath,
      qrDataUrl
    })

    res.status(201).json({
      success: true,
      message: 'Certificate generated and registered successfully.',
      certificate: savedRecord,
      verificationUrl,
      qrDataUrl
    })
  } catch (err) {
    console.error('Issue certificate error:', err)
    res.status(500).json({ success: false, error: err.message || 'Failed to issue certificate.' })
  }
})

/**
 * GET /api/admin/certificates/:certificateId/download
 * Download certificate PDF (direct download allowed for browser links)
 */
router.get('/admin/certificates/:certificateId/download', async (req, res) => {
  try {
    const { certificateId } = req.params
    const cert = db.getCertificateById(certificateId)
    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate not found.' })
    }

    let pdfPath = typeof cert.pdfPath === 'string'
      ? cert.pdfPath
      : (cert.pdfPath?.pdfPath || path.join(CERT_STORAGE_DIR, `${cert.certificateId}.pdf`))

    if (!fs.existsSync(pdfPath)) {
      console.log(`⚠️ PDF file missing on disk for ${cert.certificateId}, re-generating...`)
      const generated = await generateCertificatePdf(cert)
      pdfPath = generated.pdfPath
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${cert.certificateId}.pdf"`)
    fs.createReadStream(pdfPath).pipe(res)
  } catch (err) {
    console.error('Download error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * PATCH /api/admin/certificates/:certificateId/status
 * Body: { status: 'valid' | 'revoked', reason }
 */
router.patch('/admin/certificates/:certificateId/status', requireAdminAuth, (req, res) => {
  try {
    const { certificateId } = req.params
    const { status, reason } = req.body || {}

    if (status !== 'valid' && status !== 'revoked') {
      return res.status(400).json({ success: false, error: "Status must be either 'valid' or 'revoked'." })
    }

    const updated = db.updateCertificateStatus(certificateId, status, reason)
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Certificate not found.' })
    }

    res.json({
      success: true,
      message: `Certificate ${status === 'revoked' ? 'revoked' : 'restored'} successfully.`,
      certificate: updated
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * DELETE /api/admin/certificates/:certificateId
 */
router.delete('/admin/certificates/:certificateId', requireAdminAuth, (req, res) => {
  try {
    const { certificateId } = req.params
    const deleted = db.deleteCertificate(certificateId)
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Certificate not found.' })
    }
    res.json({ success: true, message: `Certificate ${certificateId} deleted permanently.` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * GET /api/admin/students
 * Query: search
 */
router.get('/admin/students', requireAdminAuth, (req, res) => {
  try {
    const { search } = req.query
    const students = db.getStudentsList({ search })
    res.json({ success: true, students, count: students.length })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

/* ==========================================================================
   3. PUBLIC VERIFICATION & DOWNLOAD ENDPOINTS (NO AUTH REQUIRED)
   ========================================================================== */

/**
 * GET /api/certificates/verify/:certificateId
 * Public verification query — checks directly against official database
 */
router.get('/certificates/verify/:certificateId', publicVerifyLimiter, (req, res) => {
  try {
    const { certificateId } = req.params
    if (!certificateId || !certificateId.trim()) {
      return res.status(400).json({
        success: false,
        status: 'INVALID',
        message: 'Certificate ID is required for verification.'
      })
    }

    const cert = db.getCertificateById(certificateId)

    // 1. INVALID: Not found in database
    if (!cert) {
      return res.json({
        success: false,
        status: 'INVALID',
        certificateId: certificateId.trim().toUpperCase(),
        message: 'No matching certificate was found in our official records.',
        organization: {
          name: 'BEx Sigma Tech',
          verifiedAt: new Date().toISOString()
        }
      })
    }

    // 2. REVOKED: Found but marked as revoked
    if (cert.status === 'revoked') {
      return res.json({
        success: true,
        status: 'REVOKED',
        message: 'This certificate was previously issued but has been revoked by the issuing organization.',
        certificate: {
          certificateId: cert.certificateId,
          studentName: cert.studentName,
          studentId: cert.studentId || null,
          courseName: cert.courseName,
          courseDuration: cert.courseDuration,
          completionDate: cert.completionDate,
          issueDate: cert.issueDate,
          certificateType: cert.certificateType,
          status: 'revoked',
          revokedAt: cert.revokedAt,
          revokedReason: cert.revokedReason || 'Revoked by administrative authority',
          organization: 'BEx Sigma Tech'
        }
      })
    }

    // 3. VALID: Officially authentic
    return res.json({
      success: true,
      status: 'VALID',
      message: 'This certificate is authentic and was officially issued by BEx Sigma Tech.',
      certificate: {
        certificateId: cert.certificateId,
        studentName: cert.studentName,
        studentId: cert.studentId || null,
        courseName: cert.courseName,
        courseDuration: cert.courseDuration,
        completionDate: cert.completionDate,
        issueDate: cert.issueDate,
        certificateType: cert.certificateType,
        status: 'valid',
        additionalDetails: cert.additionalDetails || null,
        verificationUrl: cert.verificationUrl,
        qrDataUrl: cert.qrDataUrl,
        organization: 'BEx Sigma Tech',
        verifiedAt: new Date().toISOString()
      }
    })
  } catch (err) {
    console.error('Public verify error:', err)
    res.status(500).json({ success: false, status: 'INVALID', message: 'Verification lookup encountered an error.' })
  }
})

/**
 * GET /api/certificates/download/:certificateId
 * Public download for valid certificates
 */
router.get('/certificates/download/:certificateId', publicVerifyLimiter, async (req, res) => {
  try {
    const { certificateId } = req.params
    const cert = db.getCertificateById(certificateId)

    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate not found.' })
    }

    if (cert.status === 'revoked') {
      return res.status(403).json({ success: false, error: 'This certificate has been revoked and cannot be downloaded.' })
    }

    let pdfPath = typeof cert.pdfPath === 'string'
      ? cert.pdfPath
      : (cert.pdfPath?.pdfPath || path.join(CERT_STORAGE_DIR, `${cert.certificateId}.pdf`))

    if (!fs.existsSync(pdfPath)) {
      console.log(`⚠️ PDF file missing on disk for ${cert.certificateId}, re-generating...`)
      const generated = await generateCertificatePdf(cert)
      pdfPath = generated.pdfPath
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${cert.certificateId}.pdf"`)
    fs.createReadStream(pdfPath).pipe(res)
  } catch (err) {
    console.error('Public download error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
