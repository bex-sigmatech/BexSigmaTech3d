/**
 * BEx Sigma Tech — TRUE VECTOR Certificate PDF Engine
 * Uses authentic Canva-designed PDF as base + pdf-lib vector text overlay
 * Result: Infinite zoom quality — ZERO pixel damage at any magnification
 */

const { PDFDocument, rgb, StandardFonts, PDFName, PDFArray, PDFDict, PDFString } = require('pdf-lib')
const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')

const CERT_STORAGE_DIR = path.join(__dirname, 'data', 'certificates')
const ASSETS_DIR = path.join(__dirname, 'assets')

// The user's authentic Canva vector PDF template (uploaded original)
const EXCEL_TEMPLATE_PDF = path.join(ASSETS_DIR, 'Excel_Certificate_template.pdf')
// DSA template — same base, different description overlay
const DSA_TEMPLATE_PDF = path.join(ASSETS_DIR, 'DSA_Certificate_template.pdf')

// Fallback: the originally uploaded PDF path
const UPLOADED_PDF = '/Users/kandavel/.gemini/antigravity/brain/0945c781-a6b9-423c-9c40-3c6c1b7dea07/.user_uploaded/media_1795243695247_1a22a2ff.pdf'

function ensureStorageDir() {
  if (!fs.existsSync(CERT_STORAGE_DIR)) {
    fs.mkdirSync(CERT_STORAGE_DIR, { recursive: true })
  }
}

/**
 * Format date string into "25 Oct 2026"
 */
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

/**
 * Generate a high-resolution QR code image buffer
 */
async function generateQrBuffer(text) {
  return await QRCode.toBuffer(text, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 1,
    width: 300,
    color: {
      dark: '#064e3b',
      light: '#ffffff'
    }
  })
}

/**
 * Generate Data URL of the QR code
 */
async function generateQrDataUrl(text) {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#064e3b',
      light: '#ffffff'
    }
  })
}

/**
 * Load the best available template PDF bytes
 * Priority: local copy in assets/ → original upload path
 */
function loadTemplatePdfBytes(isExcel) {
  const localPath = isExcel ? EXCEL_TEMPLATE_PDF : DSA_TEMPLATE_PDF
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath)
  }
  // Fallback to the user's uploaded PDF (Excel template for both tracks)
  if (fs.existsSync(UPLOADED_PDF)) {
    return fs.readFileSync(UPLOADED_PDF)
  }
  throw new Error('Template PDF not found. Please ensure Excel_Certificate_template.pdf exists in server/assets/')
}

/**
 * Wrap text to fit within maxCharsPerLine
 * Returns array of lines
 */
function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

/**
 * Generate Certificate PDF — TRUE VECTOR quality
 * Uses authentic Canva PDF as base + pure vector text overlay via pdf-lib
 *
 * Page size: 842.04 x 594.96 pt (A4 landscape)
 * pdf-lib coordinate system: origin at BOTTOM-LEFT
 * So: pdf_lib_y = pageHeight - desired_y_from_top
 *
 * @param {Object} cert
 * @returns {Promise<{ pdfPath: string, buffer: Buffer, qrDataUrl: string }>}
 */
async function generateCertificatePdf(cert) {
  ensureStorageDir()

  const pdfFileName = `${cert.certificateId}.pdf`
  const pdfPath = path.join(CERT_STORAGE_DIR, pdfFileName)

  const verificationUrl = cert.verificationUrl
    || `https://www.bexsigmatech.com/verify/${cert.certificateId}`

  const qrDataUrl = await generateQrDataUrl(verificationUrl)

  const isExcel = !cert.courseName || cert.courseName.toLowerCase().includes('excel')
  const isDsa = cert.courseName && (
    cert.courseName.toLowerCase().includes('dsa') ||
    cert.courseName.toLowerCase().includes('algorithm') ||
    cert.courseName.toLowerCase().includes('data structure')
  )

  // ── Load authentic vector PDF template ──────────────────────────────────
  const templateBytes = loadTemplatePdfBytes(isExcel)
  const templateDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true })

  // Create new output PDF, copy the template page into it
  const outputDoc = await PDFDocument.create()
  const [templatePage] = await outputDoc.copyPages(templateDoc, [0])
  outputDoc.addPage(templatePage)
  const page = outputDoc.getPage(0)

  const { width: pageWidth, height: pageHeight } = page.getSize()
  // pageWidth ≈ 842, pageHeight ≈ 595

  // ── Embed standard fonts (pure vector — no font substitution) ───────────
  const fontBold = await outputDoc.embedFont(StandardFonts.HelveticaBold)
  const fontRegular = await outputDoc.embedFont(StandardFonts.Helvetica)

  // ── Helper: convert top-left y to pdf-lib bottom-left y ─────────────────
  const fromTop = (y) => pageHeight - y

  // ── Embed QR Code PNG into PDF ───────────────────────────────────────────
  // Position: upper-center area (between logo and certified badge), ~x=485, y=38 from top
  const qrBuffer = await generateQrBuffer(verificationUrl)
  const qrImage = await outputDoc.embedPng(qrBuffer)
  const qrSize = 78  // pt — small square matching the box drawn on certificate
  page.drawImage(qrImage, {
    x: 487,
    y: fromTop(104 + qrSize),  // top of QR = 104pt from top of page (4pt lower)
    width: qrSize,
    height: qrSize,
  })

  // ══════════════════════════════════════════════════════════════════════════
  // 1. CLEAR dynamic text areas with white rectangles
  //    (Erases ALL placeholder text from the Canva template image)
  // ══════════════════════════════════════════════════════════════════════════

  const white = rgb(1, 1, 1)

  // ONE large rect erases the entire dynamic zone:
  // "CERTIFICATE OF COMPLETION AWARDED TO" + name + description (all baked into template)
  page.drawRectangle({
    x: 60,
    y: fromTop(420),   // bottom of area = 420pt from top
    width: 600,
    height: 230,       // covers y=190 to y=420 from top — the entire text body zone
    color: white,
    opacity: 1,
  })

  // Clear: Badge TEXT areas only (not the icons at left of each badge group)
  // Icons (calendar, clock, cert) are at x=70-100; text starts at x=100+
  page.drawRectangle({ x: 100, y: fromTop(468), width: 130, height: 48, color: white, opacity: 1 })
  page.drawRectangle({ x: 253, y: fromTop(468), width: 155, height: 48, color: white, opacity: 1 })
  page.drawRectangle({ x: 405, y: fromTop(468), width: 230, height: 48, color: white, opacity: 1 })

  // Clear: Verify Authenticity label + link at bottom (template has both baked in)
  // fromTop(595) = 0pt from bottom; height 85 covers y=510 to y=595 from top
  page.drawRectangle({
    x: 60,
    y: 1,
    width: 480,
    height: 85,
    color: white,
    opacity: 1,
  })

  // ══════════════════════════════════════════════════════════════════════════
  // 2. RECIPIENT NAME — large bold vector text
  // ══════════════════════════════════════════════════════════════════════════

  const displayName = (cert.studentName && cert.studentName.trim())
    ? cert.studentName.trim().toUpperCase()
    : 'NAME'

  let nameFontSize = 38
  if (displayName.length > 28) nameFontSize = 24
  else if (displayName.length > 22) nameFontSize = 28
  else if (displayName.length > 18) nameFontSize = 32
  else if (displayName.length > 14) nameFontSize = 35

  // Dark navy: #0f172a = rgb(15/255, 23/255, 42/255)
  const navyDark = rgb(0.059, 0.09, 0.165)

  // Name goes inside the cleared zone (250–400pt from top), at ~290pt from top
  page.drawText(displayName, {
    x: 65,
    y: fromTop(290),
    font: fontBold,
    size: nameFontSize,
    color: navyDark,
  })

  // ══════════════════════════════════════════════════════════════════════════
  // 3. DESCRIPTION TEXT — dynamic course description
  // ══════════════════════════════════════════════════════════════════════════

  const slateGray = rgb(0.278, 0.337, 0.412)   // #475569
  const darkGreen = rgb(0.024, 0.306, 0.235)   // #064e3b

  if (isExcel) {
    // Description lines start at ~355pt from top (after name + gap)
    const descLine1 = 'For successfully completing the Microsoft Excel Productivity Masterclass and'
    const descLine2 = 'demonstrating practical skills in data management, formulas and functions,'
    const descLine3 = 'PivotTables, Charts, and workplace productivity.'

    page.drawText(descLine1, {
      x: 65, y: fromTop(355),
      font: fontRegular, size: 10.5, color: slateGray,
    })
    page.drawText(descLine2, {
      x: 65, y: fromTop(372),
      font: fontRegular, size: 10.5, color: slateGray,
    })
    page.drawText(descLine3, {
      x: 65, y: fromTop(389),
      font: fontRegular, size: 10.5, color: slateGray,
    })
  } else {
    // DSA / custom course description
    const courseTitle = isDsa
      ? 'Data Structures & Algorithms (DSA) Masterclass'
      : (cert.courseName || 'Professional Masterclass')

    const skillsText = cert.additionalDetails || (isDsa
      ? 'data structures, algorithms, problem solving, time complexity analysis, and software development.'
      : 'core curriculum concepts, practical problem-solving methodologies, and industry-standard applications.')

    const fullDesc = `For successfully completing the ${courseTitle} and demonstrating practical skills in ${skillsText}`
    const lines = wrapText(fullDesc, 78)
    let descY = 355
    for (const line of lines.slice(0, 4)) {
      page.drawText(line, {
        x: 65, y: fromTop(descY),
        font: fontRegular, size: 10.5, color: slateGray,
      })
      descY += 17
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. THREE METRIC BADGES: Date / Duration / Certificate No.
  // ══════════════════════════════════════════════════════════════════════════

  const formattedDate = formatCertificateDate(cert.completionDate || cert.issueDate)
  const durationDisplay = cert.courseDuration || (isExcel ? '12 Hours' : '3 Months (120 Hours)')
  const certNo = cert.certificateId || 'BEX-CERT-EXL-2026-0001'

  // Badge value Y position — from observed screenshot the badges are at ~442pt from top
  const badgeValY = 442

  page.drawText(formattedDate, {
    x: 104.5,
    y: fromTop(badgeValY),
    font: fontBold,
    size: 10.5,
    color: navyDark,
  })

  page.drawText(durationDisplay, {
    x: 259.68,
    y: fromTop(badgeValY),
    font: fontBold,
    size: 10.5,
    color: navyDark,
  })

  page.drawText(certNo, {
    x: 423.46,
    y: fromTop(badgeValY),
    font: fontBold,
    size: 10.5,
    color: navyDark,
  })

  // Re-draw badge label text (cleared above with the large badge rect)
  const slateLight = rgb(0.45, 0.52, 0.60)  // lighter gray for sub-labels
  page.drawText('Date of Completion', {
    x: 104.5, y: fromTop(badgeValY + 15),
    font: fontRegular, size: 7.5, color: slateLight,
  })
  page.drawText('Duration', {
    x: 259.68, y: fromTop(badgeValY + 15),
    font: fontRegular, size: 7.5, color: slateLight,
  })
  page.drawText('Certificate No.', {
    x: 423.46, y: fromTop(badgeValY + 15),
    font: fontRegular, size: 7.5, color: slateLight,
  })

  // ══════════════════════════════════════════════════════════════════════════
  // 5. VERIFICATION URL — "Verify Authenticity:" label + clickable link
  // ══════════════════════════════════════════════════════════════════════════

  const verifyDisplayUrl = `www.bexsigmatech.com/verify/${cert.certificateId}`

  // Re-draw the "Verify Authenticity:" label (we cleared it above)
  page.drawText('Verify Authenticity:', {
    x: 65,
    y: fromTop(548),
    font: fontRegular,
    size: 9.5,
    color: navyDark,
  })

  // Draw the clickable URL link below the label
  page.drawText(verifyDisplayUrl, {
    x: 65,
    y: fromTop(562),
    font: fontBold,
    size: 10,
    color: darkGreen,
  })

  // Add clickable URI annotation over the URL text
  const urlTextWidth = fontBold.widthOfTextAtSize(verifyDisplayUrl, 10)
  const annotContext = outputDoc.context
  const linkAnnotRef = annotContext.register(
    annotContext.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [65, fromTop(565), 65 + urlTextWidth, fromTop(553)],
      Border: [0, 0, 0],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(verificationUrl),
      },
    })
  )

  // Attach annotation to page
  const existingAnnots = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray)
  if (existingAnnots) {
    existingAnnots.push(linkAnnotRef)
  } else {
    page.node.set(PDFName.of('Annots'), annotContext.obj([linkAnnotRef]))
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 6. SIGNATORY — Only override for DSA/non-Excel (Excel template already has correct signatory)
  // ══════════════════════════════════════════════════════════════════════════

  if (!isExcel) {
    // For DSA: template has Excel signatory, so we clear and replace with DSA title
    page.drawRectangle({
      x: 490,
      y: fromTop(564),
      width: 315,
      height: 34,
      color: white,
      opacity: 1,
    })

    const signatoryName = 'Hariharan Dilli'
    const signatoryTitle = isDsa ? 'Founder & Lead Technical Architect' : 'Founder & Technical Director'
    const sigAreaRight = 798

    const nameWidth = fontBold.widthOfTextAtSize(signatoryName, 11)
    const titleWidth = fontBold.widthOfTextAtSize(signatoryTitle, 9)

    page.drawText(signatoryName, {
      x: sigAreaRight - nameWidth,
      y: fromTop(549),
      font: fontBold,
      size: 11,
      color: navyDark,
    })

    page.drawText(signatoryTitle, {
      x: sigAreaRight - titleWidth,
      y: fromTop(561),
      font: fontBold,
      size: 9,
      color: darkGreen,
    })
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 7. Set PDF metadata
  // ══════════════════════════════════════════════════════════════════════════

  outputDoc.setTitle(`Certificate of Completion - ${cert.studentName || 'Student'}`)
  outputDoc.setAuthor('BEx Sigma Tech')
  outputDoc.setSubject(cert.courseName || 'Microsoft Excel Productivity Masterclass')
  outputDoc.setKeywords(['Certificate', 'BEx Sigma Tech', 'Verification', certNo])
  outputDoc.setCreator('BEx Sigma Tech Certificate System')
  outputDoc.setProducer('BEx Sigma Tech — pdf-lib Vector Engine')

  // ── Save PDF ─────────────────────────────────────────────────────────────
  const pdfBytes = await outputDoc.save()
  const buffer = Buffer.from(pdfBytes)
  fs.writeFileSync(pdfPath, buffer)

  return { pdfPath, buffer, qrDataUrl }
}

module.exports = {
  generateCertificatePdf,
  generateQrBuffer,
  generateQrDataUrl,
  formatCertificateDate,
  CERT_STORAGE_DIR
}
