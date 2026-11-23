/* ==========================================================================
   BEX SIGMA TECH — PERSISTENT DATABASE ENGINE
   Zero-config persistent database module for orders, download logs & AI chats
   ========================================================================== */

const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const DB_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DB_DIR, 'database.json')

// Default structure
const initialSchema = {
  orders: [],
  downloads: [],
  aiChats: [],
  systemLogs: [],
  contacts: [],
  certificates: [],
  adminUser: null
}

// Ensure data directory, file and schema exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialUsername = process.env.ADMIN_USERNAME || 'Admin'
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'bex1232026'
    const passwordHash = bcrypt.hashSync(initialPassword, 10)
    const seed = {
      ...initialSchema,
      adminUser: {
        id: 'admin_1',
        username: initialUsername,
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8')
  } else {
    // Non-destructive schema migration check
    try {
      const existing = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
      let modified = false
      if (!Array.isArray(existing.certificates)) {
        existing.certificates = []
        modified = true
      }
      if (!existing.adminUser) {
        const initialUsername = process.env.ADMIN_USERNAME || 'Admin'
        const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'bex1232026'
        const passwordHash = bcrypt.hashSync(initialPassword, 10)
        existing.adminUser = {
          id: 'admin_1',
          username: initialUsername,
          passwordHash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        modified = true
      }
      if (modified) {
        const tempFile = `${DB_FILE}.tmp`
        fs.writeFileSync(tempFile, JSON.stringify(existing, null, 2), 'utf8')
        fs.renameSync(tempFile, DB_FILE)
      }
    } catch (e) {
      console.error('Schema check error:', e.message)
    }
  }
}

// Read database
function readDb() {
  try {
    initDb()
    const content = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    console.error('❌ Database read error:', err.message)
    return initialSchema
  }
}

// Write database atomically
function writeDb(data) {
  try {
    initDb()
    const tempFile = `${DB_FILE}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8')
    fs.renameSync(tempFile, DB_FILE)
  } catch (err) {
    console.error('❌ Database write error:', err.message)
  }
}

// Public API
module.exports = {
  initDb,

  saveOrder(order) {
    const db = readDb()
    // Idempotency: prevent duplicate order_id (webhook + verify race)
    if (order.order_id && db.orders.some((o) => o.order_id === order.order_id)) {
      const existing = db.orders.find((o) => o.order_id === order.order_id)
      console.log(`♻️ DB duplicate guard — order ${order.order_id} already exists`)
      return existing
    }
    const record = {
      id: order.order_id || `ord_${Date.now()}`,
      payment_id: order.payment_id,
      order_id: order.order_id,
      productId: order.productId,
      productName: order.product?.name || order.productId,
      amount: order.product?.price || order.amount,
      customerEmail: order.customerEmail || 'anonymous@bexsigmatech.io',
      customerName: order.customerName || 'Operator',
      status: 'VERIFIED',
      downloadUrl: order.downloadUrl,
      cartItems: order.cartItems || undefined,
      product: order.product || undefined,
      timestamp: new Date().toISOString()
    }
    db.orders.unshift(record)
    writeDb(db)
    console.log(`💾 Saved verified order to DB: ${record.payment_id} (${record.productId})`)
    return record
  },

  getOrders() {
    const db = readDb()
    return db.orders
  },

  logDownload(productId, customerEmail, token) {
    const db = readDb()
    let jti = null
    try { const decoded = require('jsonwebtoken').decode(token); jti = decoded?.jti || null } catch {}
    const log = {
      id: `dl_${Date.now()}`,
      productId,
      customerEmail,
      token,
      jti,
      timestamp: new Date().toISOString()
    }
    db.downloads.unshift(log)
    writeDb(db)
    return log
  },

  isDownloadTokenUsed(jti) {
    if (!jti) return false
    const db = readDb()
    return db.downloads.some((d) => d.jti === jti)
  },

  getDownloads() {
    const db = readDb()
    return db.downloads
  },

  saveAIChat(userPrompt, aiResponse, modelUsed = 'Gemini 2.5 Flash') {
    const db = readDb()
    const chat = {
      id: `chat_${Date.now()}`,
      userPrompt,
      aiResponse,
      modelUsed,
      timestamp: new Date().toISOString()
    }
    db.aiChats.unshift(chat)
    if (db.aiChats.length > 50) db.aiChats = db.aiChats.slice(0, 50)
    writeDb(db)
    return chat
  },

  saveContact({ name, email, phone, message, subject, service }) {
    const db = readDb()
    if (!db.contacts) db.contacts = []
    const record = {
      id: `contact_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name || 'Anonymous',
      email,
      phone: phone || '',
      message,
      subject: subject || 'Contact',
      service: service || 'General',
      timestamp: new Date().toISOString()
    }
    db.contacts.unshift(record)
    if (db.contacts.length > 200) db.contacts = db.contacts.slice(0, 200)
    writeDb(db)
    console.log(`💾 Saved contact to DB: ${record.id} from ${email} (${service})`)
    return record
  },

  getContacts() {
    const db = readDb()
    return db.contacts || []
  },

  /* ══════════════════════════════════════════════════════════════════════
     ADMIN CREDENTIALS & AUTHENTICATION
     ══════════════════════════════════════════════════════════════════════ */
  getAdminUser() {
    initDb()
    const db = readDb()
    return db.adminUser
  },

  verifyAdminPassword(password) {
    const admin = this.getAdminUser()
    if (!admin || !admin.passwordHash) return false
    return bcrypt.compareSync(password, admin.passwordHash)
  },

  updateAdminPassword(newPassword) {
    const db = readDb()
    if (!db.adminUser) {
      db.adminUser = {
        id: 'admin_1',
        username: process.env.ADMIN_USERNAME || 'Admin',
        createdAt: new Date().toISOString()
      }
    }
    const newHash = bcrypt.hashSync(newPassword, 10)
    db.adminUser.passwordHash = newHash
    db.adminUser.updatedAt = new Date().toISOString()
    writeDb(db)
    console.log('🔒 Admin password updated successfully in DB')
    return true
  },

  /* ══════════════════════════════════════════════════════════════════════
     CERTIFICATE MANAGEMENT & VERIFICATION ENGINE
     ══════════════════════════════════════════════════════════════════════ */
  getNextCertificateId() {
    const db = readDb()
    const currentYear = new Date().getFullYear()
    const prefix = `CERT-${currentYear}-`
    const certsThisYear = (db.certificates || []).filter(
      c => c.certificateId && c.certificateId.startsWith(prefix)
    )
    let maxNumber = 0
    certsThisYear.forEach(c => {
      const parts = c.certificateId.split('-')
      if (parts.length >= 3) {
        const num = parseInt(parts[2], 10)
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num
        }
      }
    })
    const nextNumber = maxNumber + 1
    const padded = String(nextNumber).padStart(5, '0')
    return `${prefix}${padded}`
  },

  saveCertificate(certData) {
    const db = readDb()
    if (!Array.isArray(db.certificates)) db.certificates = []

    const certificateId = certData.certificateId || this.getNextCertificateId()
    if (db.certificates.some(c => c.certificateId.toLowerCase() === certificateId.toLowerCase())) {
      throw new Error(`Certificate ID ${certificateId} already exists.`)
    }

    const now = new Date().toISOString()
    const record = {
      id: `cert_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      certificateId,
      studentName: (certData.studentName || '').trim(),
      studentId: (certData.studentId || '').trim() || undefined,
      courseName: (certData.courseName || '').trim(),
      courseDuration: (certData.courseDuration || '').trim(),
      completionDate: certData.completionDate,
      issueDate: certData.issueDate,
      certificateType: certData.certificateType || 'Certificate of Completion',
      verificationUrl: certData.verificationUrl,
      pdfPath: certData.pdfPath,
      qrDataUrl: certData.qrDataUrl,
      additionalDetails: certData.additionalDetails || undefined,
      status: 'valid',
      revokedAt: null,
      revokedReason: null,
      createdAt: now,
      updatedAt: now
    }

    db.certificates.unshift(record)
    writeDb(db)
    console.log(`📜 Saved new certificate to DB: ${record.certificateId} for ${record.studentName}`)
    return record
  },

  getCertificates({ search = '', course = '', status = '', page = 1, limit = 50 } = {}) {
    const db = readDb()
    let certs = db.certificates || []

    if (search) {
      const q = search.toLowerCase().trim()
      certs = certs.filter(c =>
        (c.certificateId && c.certificateId.toLowerCase().includes(q)) ||
        (c.studentName && c.studentName.toLowerCase().includes(q)) ||
        (c.studentId && c.studentId.toLowerCase().includes(q)) ||
        (c.courseName && c.courseName.toLowerCase().includes(q))
      )
    }

    if (course) {
      certs = certs.filter(c => c.courseName === course)
    }

    if (status) {
      certs = certs.filter(c => c.status === status)
    }

    const total = certs.length
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1)
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200)
    const start = (parsedPage - 1) * parsedLimit
    const paged = certs.slice(start, start + parsedLimit)

    return {
      certificates: paged,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit) || 1
    }
  },

  getCertificateById(certificateId) {
    if (!certificateId) return null
    const db = readDb()
    const q = certificateId.trim().toLowerCase()
    return (db.certificates || []).find(c => c.certificateId && c.certificateId.toLowerCase() === q) || null
  },

  updateCertificateStatus(certificateId, status, reason = '') {
    const db = readDb()
    const q = certificateId.trim().toLowerCase()
    const cert = (db.certificates || []).find(c => c.certificateId && c.certificateId.toLowerCase() === q)
    if (!cert) return null

    cert.status = status === 'revoked' ? 'revoked' : 'valid'
    cert.updatedAt = new Date().toISOString()
    if (cert.status === 'revoked') {
      cert.revokedAt = new Date().toISOString()
      cert.revokedReason = reason || 'Revoked by administrative authority'
    } else {
      cert.revokedAt = null
      cert.revokedReason = null
    }

    writeDb(db)
    console.log(`🔄 Certificate ${cert.certificateId} status updated to: ${cert.status}`)
    return cert
  },

  deleteCertificate(certificateId) {
    const db = readDb()
    const q = certificateId.trim().toLowerCase()
    const index = (db.certificates || []).findIndex(c => c.certificateId && c.certificateId.toLowerCase() === q)
    if (index === -1) return false

    const cert = db.certificates[index]
    db.certificates.splice(index, 1)
    writeDb(db)

    // Remove PDF from disk if exists
    if (cert.pdfPath && fs.existsSync(cert.pdfPath)) {
      try { fs.unlinkSync(cert.pdfPath) } catch (e) { console.warn('Could not unlink PDF file:', e.message) }
    }

    console.log(`🗑️ Deleted certificate: ${certificateId}`)
    return true
  },

  getStudentsList({ search = '' } = {}) {
    const db = readDb()
    const certs = db.certificates || []
    const studentMap = new Map()

    certs.forEach(cert => {
      // Group by studentId if available, otherwise studentName
      const key = (cert.studentId || cert.studentName || 'Unknown').trim().toLowerCase()
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          studentName: cert.studentName,
          studentId: cert.studentId || 'N/A',
          courses: new Set(),
          certificates: [],
          validCount: 0,
          revokedCount: 0
        })
      }
      const student = studentMap.get(key)
      if (cert.studentId && student.studentId === 'N/A') {
        student.studentId = cert.studentId
      }
      student.courses.add(cert.courseName)
      student.certificates.push({
        certificateId: cert.certificateId,
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        status: cert.status
      })
      if (cert.status === 'valid') student.validCount++
      else student.revokedCount++
    })

    let students = Array.from(studentMap.values()).map(s => ({
      ...s,
      courses: Array.from(s.courses),
      totalCertificates: s.certificates.length
    }))

    if (search) {
      const q = search.toLowerCase().trim()
      students = students.filter(s =>
        (s.studentName && s.studentName.toLowerCase().includes(q)) ||
        (s.studentId && s.studentId.toLowerCase().includes(q)) ||
        s.courses.some(course => course.toLowerCase().includes(q))
      )
    }

    return students
  },

  getCertificateStats() {
    const db = readDb()
    const certs = db.certificates || []
    const students = this.getStudentsList()
    const validCount = certs.filter(c => c.status === 'valid').length
    const revokedCount = certs.filter(c => c.status === 'revoked').length

    return {
      totalIssued: certs.length,
      totalStudents: students.length,
      validCertificates: validCount,
      revokedCertificates: revokedCount
    }
  }
}
