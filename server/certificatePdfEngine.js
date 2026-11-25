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
      light: '#f9fdff'
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
      light: '#f9fdff'
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
  // Positioned in the open whitespace between the BEx logo (ends x≈365) and the Certified seal (starts x≈615)
  const qrBuffer = await generateQrBuffer(verificationUrl)
  const qrImage = await outputDoc.embedPng(qrBuffer)
  const qrSize = 78
  page.drawImage(qrImage, {
    x: 472,
    y: 446, // vertically aligned beside BEx SIGMA TECH logo (y=450..540)
    width: qrSize,
    height: qrSize,
  })

  // ══════════════════════════════════════════════════════════════════════════
  // Exact PDF bottom-left coordinates measured from Excel_Certificate_template.pdf:
  //   Card fill color       : rgb(0.976, 0.992, 1) (#f9fdff)
  //   "CERTIFICATE"         : x=61.01,  y=367.63 (KEEP UNTOUCHED)
  //   "OF COMPLETION..."    : x=61.01,  y=341.45 (KEEP UNTOUCHED)
  //   Placeholder Name      : x=64.18,  y=273.72
  //   Description lines     : x=65.83,  y=237.55 / 214.15 / 190.73
  //   Metric Labels         : y=152.59           (KEEP UNTOUCHED)
  //   Metric Values         : y=137.98 / 138.10
  //   "Verify Authenticity:": x=65.16,  y=70.73  (KEEP UNTOUCHED)
  //   "link" placeholder    : x=65.16,  y=46.42
  //   Signatory Name        : x=675.58, y=60.53  (KEEP UNTOUCHED)
  //   Signatory Title       : x=559.63, y=41.09
  // ══════════════════════════════════════════════════════════════════════════

  const cardBg = rgb(0.976, 0.992, 1)
  const pureBlack = rgb(0, 0, 0)
  const slateGray = rgb(0.267, 0.267, 0.267)
  const darkGreen = rgb(0.0353, 0.318, 0.125)

  // 1. Clear ONLY the placeholder Recipient Name ("KANDAVEL J" at y=273.72)
  page.drawRectangle({
    x: 60,
    y: 263,
    width: 575,
    height: 62, // covers y=263..325 cleanly without touching subtitle (341.45) or desc (237.55)
    color: cardBg,
    opacity: 1,
  })

  // 2. RECIPIENT NAME — bold vector text auto-fitted to 570pt max width
  const displayName = (cert.studentName && cert.studentName.trim())
    ? cert.studentName.trim().toUpperCase()
    : 'NAME'

  let nameFontSize = 46
  while (nameFontSize > 20 && fontBold.widthOfTextAtSize(displayName, nameFontSize) > 570) {
    nameFontSize -= 1
  }

  page.drawText(displayName, {
    x: 64.18,
    y: 273.72,
    font: fontBold,
    size: nameFontSize,
    color: pureBlack,
  })

  // 3. DESCRIPTION TEXT
  // Keep original Canva vector description intact for standard Excel certificates;
  // replace only for DSA, custom course, or explicit custom additionalDetails.
  if (!isExcel || (cert.additionalDetails && cert.additionalDetails.trim())) {
    page.drawRectangle({
      x: 60,
      y: 176,
      width: 585,
      height: 80, // covers y=176..256 cleanly between name (263) and badge labels (152.59)
      color: cardBg,
      opacity: 1,
    })

    const courseTitle = isExcel
      ? 'Microsoft Excel Productivity Masterclass'
      : isDsa
        ? 'Data Structures & Algorithms (DSA) Masterclass'
        : (cert.courseName || 'Professional Masterclass')

    const skillsText = (cert.additionalDetails && cert.additionalDetails.trim()) || (isExcel
      ? 'data management, formulas and functions, PivotTables, Charts, and workplace productivity.'
      : isDsa
        ? 'data structures, algorithms, problem solving, time complexity analysis, and software development.'
        : 'core curriculum concepts, practical problem-solving methodologies, and industry-standard applications.')

    const fullDesc = `For successfully completing the ${courseTitle} and demonstrating practical skills in ${skillsText}`
    const lines = wrapText(fullDesc, 82)
    const descStep = lines.length > 3 ? 18.5 : 22.5
    let descY = 237.55
    for (const line of lines.slice(0, 4)) {
      page.drawText(line, {
        x: 65.83,
        y: descY,
        font: fontRegular,
        size: 11.8,
        color: slateGray,
      })
      descY -= descStep
    }
  }

  // 4. THREE METRIC BADGE VALUES (keep labels at y=152.59 & icons on left untouched!)
  const formattedDate = formatCertificateDate(cert.completionDate || cert.issueDate)
  const durationDisplay = cert.courseDuration || (isExcel ? '12 Hours' : '3 Months (120 Hours)')
  const certNo = cert.certificateId || 'BEX-CERT-EXL-2026-0001'

  page.drawRectangle({ x: 103, y: 132, width: 122, height: 17, color: cardBg, opacity: 1 })
  page.drawRectangle({ x: 257, y: 132, width: 135, height: 17, color: cardBg, opacity: 1 })
  page.drawRectangle({ x: 421, y: 132, width: 225, height: 17, color: cardBg, opacity: 1 })

  page.drawText(formattedDate, {
    x: 105.29,
    y: 137.98,
    font: fontBold,
    size: 10,
    color: slateGray,
  })

  page.drawText(durationDisplay, {
    x: 259.56,
    y: 137.98,
    font: fontBold,
    size: 10,
    color: slateGray,
  })

  page.drawText(certNo, {
    x: 423.46,
    y: 138.10,
    font: fontBold,
    size: 10,
    color: slateGray,
  })

  // 5. VERIFICATION URL (keep "Verify Authenticity:" at y=70.73 untouched, replace only "link" at y=46.42)
  page.drawRectangle({
    x: 62,
    y: 38,
    width: 340,
    height: 22,
    color: cardBg,
    opacity: 1,
  })

  const verifyDisplayUrl = `www.bexsigmatech.com/verify/${cert.certificateId}`

  page.drawText(verifyDisplayUrl, {
    x: 65.16,
    y: 46.42,
    font: fontBold,
    size: 10.5,
    color: darkGreen,
  })

  // Add clickable URI annotation over the URL text
  const urlTextWidth = fontBold.widthOfTextAtSize(verifyDisplayUrl, 10.5)
  const annotContext = outputDoc.context
  const linkAnnotRef = annotContext.register(
    annotContext.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [65.16, 42, 65.16 + urlTextWidth, 58],
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

  // 6. SIGNATORY TITLE — keep Hariharan Dilli & signature intact; only update title for DSA/custom tracks
  if (!isExcel) {
    page.drawRectangle({
      x: 545,
      y: 33,
      width: 270,
      height: 21,
      color: cardBg,
      opacity: 1,
    })

    const signatoryTitle = isDsa ? 'Founder & Lead Technical Architect' : 'Founder & Technical Director'
    const sigAreaRight = 799
    const titleWidth = fontBold.widthOfTextAtSize(signatoryTitle, 11.5)

    page.drawText(signatoryTitle, {
      x: sigAreaRight - titleWidth,
      y: 41.09,
      font: fontBold,
      size: 11.5,
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
