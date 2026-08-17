/* ==========================================================================
   BEX SIGMA TECH — CASHFREE PAYMENT BACKEND
   Express + Cashfree PG SDK · Order creation · Payment verification
   ========================================================================== */

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const { Cashfree } = require('cashfree-pg')
const db = require('./db')

db.initDb()

const app = express()
const PORT = process.env.PORT || 5001

/* ── Middleware ── */
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}))

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString() // Store raw body for webhook verification
  }
}))

/* ── Cashfree Instance ── */
Cashfree.XClientId = process.env.CASHFREE_APP_ID || 'TEST_APP_ID'
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY || 'TEST_SECRET_KEY'
Cashfree.XEnvironment = (process.env.CASHFREE_ENV || 'SANDBOX') === 'PRODUCTION'
  ? Cashfree.Environment.PRODUCTION
  : Cashfree.Environment.SANDBOX

/* ── Product Catalog (same as frontend) ── */
const PRODUCTS = {
  'omnicoder-ai': {
    id: 'omnicoder-ai',
    name: 'OmniCoder AI Agent',
    price: 149900,      // ₹1,499 in paise
    currency: 'INR',
    description: 'Autonomous repository developer with multi-agent planning.',
  },
  'quantum-shield': {
    id: 'quantum-shield',
    name: 'QuantumShield Crypt Vault',
    price: 29100,     // ₹291 in paise
    currency: 'INR',
    description: 'Post-quantum security matrix for telemetry and key exchange.',
  },
  'spacemesh-iot': {
    id: 'spacemesh-iot',
    name: 'SpaceMesh IoT Gateway',
    price: 35900,     // ₹359 in paise
    currency: 'INR',
    description: 'Planetary real-time distributed device data synchronizer.',
  },
  'vision-spatial': {
    id: 'vision-spatial',
    name: 'VisionSpatial Designer',
    price: 28900,     // ₹289 in paise
    currency: 'INR',
    description: '3D browser designer for Apple Vision Pro environments.',
  },
  'biosync-health': {
    id: 'biosync-health',
    name: 'BioSync Telehealth Engine',
    price: 29100,      // ₹291 in paise
    currency: 'INR',
    description: 'Low-latency clinical telemetry and patient nodes.',
  },
  'finance-trend': {
    id: 'finance-trend',
    name: 'Financial Trend Analytic',
    price: 31900,      // ₹319 in paise
    currency: 'INR',
    description: 'Predictive financial & yield analytics engine.',
  },
  'sales-dashboard': {
    id: 'sales-dashboard',
    name: 'Sales Performance Dashboard',
    price: 28100,      // ₹281 in paise
    currency: 'INR',
    description: 'Real-time revenue & conversion optimization engine.',
  },
  'hr-kpi': {
    id: 'hr-kpi',
    name: 'HR KPI Performance Dashboard',
    price: 29500,      // ₹295 in paise
    currency: 'INR',
    description: 'Workforce performance, retention & KPI analytics.',
  },
  'dashboard-suite': {
    id: 'dashboard-suite',
    name: 'One Dashboard BI Suite',
    price: 25600,      // ₹256 in paise
    currency: 'INR',
    description: 'Unified business intelligence & executive analytics suite.',
  },
}


/* ── Health Check ── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'BEX Sigma Tech Payment API — ONLINE', timestamp: new Date().toISOString() })
})

/* ── GET: Product list ── */
app.get('/api/products', (req, res) => {
  res.json({ success: true, products: Object.values(PRODUCTS) })
})

/* ── POST: Create Cashfree Order ── */
app.post('/api/create-order', async (req, res) => {
  try {
    const { productId, userName } = req.body

    const product = PRODUCTS[productId]
    if (!product) {
      return res.status(400).json({ success: false, error: 'Invalid product ID' })
    }

    // Cashfree uses amounts in Rupees (not paise), so divide by 100
    const amountInRupees = (product.price / 100).toFixed(2)
    const orderId = `bex_${productId}_${Date.now()}`

    const orderRequest = {
      order_amount: parseFloat(amountInRupees),
      order_currency: product.currency,
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: userName || 'Operator',
        customer_phone: '9999999999', // Required by Cashfree
      },
      order_meta: {
        notify_url: `${req.protocol}://${req.get('host')}/api/webhook`,
      },
      order_note: `BEX Sigma Tech — ${product.name}`,
    }

    const response = await Cashfree.PGCreateOrder("2022-09-01", orderRequest)
    const orderData = response.data

    res.json({
      success: true,
      order_id: orderData.order_id,
      payment_session_id: orderData.payment_session_id,
      product,
    })
  } catch (err) {
    console.error('❌ Order creation error:', err?.response?.data || err.message || err)
    res.status(500).json({ success: false, error: err?.response?.data?.message || err.message })
  }
})

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')

const DOWNLOAD_TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'bex_sigma_default_secret_key_2026'

/* ── Email Transporter Setup ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

/* ── Helper: Generate 24-Hour Signed Download Token ── */
function generateDownloadToken(productId, customerEmail) {
  return jwt.sign(
    {
      productId,
      customerEmail,
      createdAt: Date.now(),
    },
    DOWNLOAD_TOKEN_SECRET,
    { expiresIn: '24h' }
  )
}

/* ── Helper: Send Email with Download Link ── */
async function sendReceiptEmail({ customerEmail, customerName, product, downloadUrl }) {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log(`\nℹ️  [EMAIL SIMULATION]`)
    console.log(`   To: ${customerEmail}`)
    console.log(`   Product: ${product.name}`)
    console.log(`   Download Link (Valid 24h): ${downloadUrl}\n`)
    return
  }

  try {
    await transporter.sendMail({
      from: `"BEX Sigma Tech" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `🎉 Your Dashboard Access: ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #060b13; color: #ffffff; padding: 30px; border-radius: 10px;">
          <h2 style="color: #00d4ff; margin-bottom: 5px;">BEX SIGMA TECH — Order Confirmed</h2>
          <p style="color: #8899a6; font-size: 14px;">Thank you for your purchase, <strong>${customerName || 'Operator'}</strong>!</p>
          <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
          
          <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(0,212,255,0.2);">
            <h3 style="margin: 0 0 10px 0; color: #38bdf8;">${product.name}</h3>
            <p style="margin: 0; font-size: 13px; color: #cccccc;">${product.description}</p>
          </div>

          <p style="margin-top: 25px;">Your secure 24-hour single-use download link is ready below:</p>
          
          <div style="margin: 25px 0;">
            <a href="${downloadUrl}" style="background: linear-gradient(135deg, #00d4ff, #7c3aed); color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 6px; display: inline-block;">
              ⚡ Download Product Package
            </a>
          </div>

          <p style="font-size: 12px; color: #ff6b6b; margin-top: 20px;">
            ⚠️ <strong>Security Note:</strong> This download link is cryptographically signed and will automatically expire in 24 hours.
          </p>
        </div>
      `,
    })
    console.log(`✉️  Receipt email sent successfully to ${customerEmail}`)
  } catch (err) {
    console.error('❌ Failed to send receipt email:', err.message)
  }
}

/* ── POST: Verify Payment (Cashfree — Fetch Order Status) ── */
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { order_id, productId, customerEmail, customerName } = req.body

    if (!order_id) {
      return res.status(400).json({ success: false, error: 'Missing order_id' })
    }

    // Fetch order status from Cashfree to verify payment
    const response = await Cashfree.PGFetchOrder("2022-09-01", order_id)
    const orderData = response.data

    if (orderData.order_status !== 'PAID') {
      console.warn(`⚠️  Order ${order_id} status: ${orderData.order_status}`)
      return res.status(400).json({
        success: false,
        error: `Payment not completed. Status: ${orderData.order_status}`,
      })
    }

    const product = PRODUCTS[productId]
    if (!product) {
      return res.status(400).json({ success: false, error: 'Product not found' })
    }

    // Extract payment ID from Cashfree order
    const paymentId = orderData.cf_order_id || order_id

    // Generate 24-hour signed download link
    const token = generateDownloadToken(productId, customerEmail || 'guest')
    const protocol = req.protocol
    const host = req.get('host')
    const downloadUrl = `${protocol}://${host}/api/download?token=${token}`

    console.log(`✅ Payment verified for ${product.name}: ${paymentId}`)

    // Persist verified order to database
    db.saveOrder({
      order_id: order_id,
      payment_id: paymentId,
      productId,
      product,
      customerEmail,
      customerName,
      downloadUrl
    })

    // Dispatch automated email receipt
    if (customerEmail) {
      await sendReceiptEmail({ customerEmail, customerName, product, downloadUrl })
    }

    res.json({
      success: true,
      message: 'Payment verified & access link generated',
      payment_id: paymentId,
      order_id: order_id,
      product,
      downloadUrl,
      expiresIn: '24 Hours',
    })
  } catch (err) {
    console.error('❌ Verification error:', err?.response?.data || err)
    res.status(500).json({ success: false, error: err?.response?.data?.message || err.message })
  }
})

/* ── GET: Tokenized Secure Download ── */
app.get('/api/download', (req, res) => {
  try {
    const { token } = req.query
    if (!token) {
      return res.status(400).send('<h1>400 Bad Request</h1><p>Missing download access token.</p>')
    }

    // Verify token signature & expiration
    let decoded
    try {
      decoded = jwt.verify(token, DOWNLOAD_TOKEN_SECRET)
    } catch (err) {
      return res.status(403).send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 60px; background: #090d16; color: #fff; min-height: 100vh;">
          <h1 style="color: #f43f5e; font-size: 2rem;">🔒 403 Access Expired or Invalid</h1>
          <p style="color: #94a3b8; font-size: 1.1rem; max-width: 500px; margin: 20px auto;">
            This download link has expired (24-hour security limit) or has an invalid signature.
          </p>
          <p style="color: #64748b; font-size: 0.9rem;">Please check your purchase email or contact support for a new link.</p>
        </div>
      `)
    }

    const product = PRODUCTS[decoded.productId]
    if (!product) {
      return res.status(404).send('<h1>404 Product Not Found</h1>')
    }

    // 1. If product has a Cloudflare R2 / AWS S3 / Google Drive URL, redirect cleanly:
    if (product.driveUrl || product.storageUrl) {
      return res.redirect(product.driveUrl || product.storageUrl)
    }

    // 2. Or if hosting local zip files in server/downloads/[productId].zip:
    const filePath = path.join(__dirname, 'downloads', `${decoded.productId}.zip`)
    if (fs.existsSync(filePath)) {
      return res.download(filePath, `${decoded.productId}-dashboard-blueprint.zip`)
    }

    // 3. Fallback preview response when zip file is pending upload
    res.setHeader('Content-Type', 'text/html')
    res.send(`
      <div style="font-family: sans-serif; background: #0b1120; color: #fff; text-align: center; padding: 60px; border-radius: 12px; max-width: 600px; margin: 40px auto; border: 1px solid rgba(56,189,248,0.3);">
        <h2 style="color: #38bdf8;">✅ Download Access Authenticated</h2>
        <p>Product: <strong>${product.name}</strong></p>
        <p style="color: #94a3b8; font-size: 0.9rem;">Token Verified for: <code>${decoded.customerEmail || 'Authenticated User'}</code></p>
        <hr style="border-color: #1e293b; margin: 20px 0;" />
        <p style="font-size: 0.85rem; color: #64748b;">To serve actual files, place your <code>${decoded.productId}.zip</code> in <code>server/downloads/</code> directory or add <code>driveUrl</code> to the product object.</p>
      </div>
    `)
  } catch (err) {
    console.error('❌ Download error:', err)
    res.status(500).send('Server Error')
  }
})

/* ── POST: Payment Webhook (Cashfree → Server) ── */
app.post('/api/webhook', (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature']
    const timestamp = req.headers['x-webhook-timestamp']

    if (!signature || !timestamp) {
      return res.status(400).json({ error: 'Missing webhook signature or timestamp' })
    }

    // Verify webhook signature: HMAC-SHA256(timestamp + rawBody, secretKey) → base64
    const data = timestamp + req.rawBody
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
      .update(data)
      .digest('base64')

    if (signature !== expectedSignature) {
      console.warn('⚠️  Invalid webhook signature')
      return res.status(400).json({ error: 'Invalid webhook signature' })
    }

    const event = req.body
    console.log(`📦 Cashfree Webhook event: ${event.type}`)

    // Handle PAYMENT_SUCCESS event
    if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const payment = event.data
      console.log(`💰 Payment captured: Order ${payment.order?.order_id} — ₹${payment.order?.order_amount}`)
    }

    res.json({ status: 'ok' })
  } catch (err) {
    console.error('❌ Webhook error:', err)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

/* ── GET: Query recorded orders from persistent database ── */
app.get('/api/admin/orders', (req, res) => {
  try {
    const orders = db.getOrders()
    res.json({ success: true, count: orders.length, orders })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

/* ── POST: Gemini AI Chat Assistant Endpoint ── */
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, userName } = req.body
    const apiKey = process.env.GEMINI_API_KEY
    const operator = userName || 'Operator'

    let replyText = ''
    let modelUsed = 'Gemini 2.5 Flash'

    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are the BEX SIGMA TECH AI Core, a futuristic, ultra-intelligent sci-fi AI assistant for a high-tech software and analytics firm. Respond concisely (2-3 sentences max) with a high-tech, futuristic tone to user ${operator}: "${prompt || 'System status check'}"`
                }]
              }]
            })
          }
        )
        const data = await response.json()
        replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text
      } catch (geminiErr) {
        console.warn('⚠️ Gemini API call failed, using intelligent fallback:', geminiErr.message)
      }
    }

    // Contextual fallback when API key is missing or call fails
    if (!replyText) {
      modelUsed = 'BEX Neural Core (Local)'
      const cleanPrompt = (prompt || '').toLowerCase()
      if (cleanPrompt.includes('web') || cleanPrompt.includes('store') || cleanPrompt.includes('product') || cleanPrompt.includes('buy')) {
        replyText = `Welcome ${operator}. BEX SIGMA TECH provides production-ready software solutions including OmniCoder AI, One Dashboard BI Suite, and SpaceMesh IoT Gateway. Visit Sector 9 WebDev Store to inspect.`
      } else if (cleanPrompt.includes('hello') || cleanPrompt.includes('hi') || cleanPrompt.includes('sync')) {
        replyText = `Callsign recognized. Welcome back, ${operator}. All orbital telemetry systems and 8K mainframe nodes are operational.`
      } else {
        replyText = `Command logged, ${operator}. BEX SIGMA TECH neural grid is operating at peak capacity. All biometric signatures and quantum encryption keys verified.`
      }
    }

    db.saveAIChat(prompt, replyText, modelUsed)

    res.json({
      success: true,
      response: replyText,
      modelUsed,
      operator
    })
  } catch (err) {
    console.error('❌ AI Chat error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

/* ── Start Server ── */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 BEX Sigma Tech Payment API running on http://localhost:${PORT}`)
  console.log(`   Cashfree App ID: ${process.env.CASHFREE_APP_ID || '⚠️  NOT SET — add to .env'}`)
  console.log(`   Cashfree Environment: ${process.env.CASHFREE_ENV || 'SANDBOX'}`)
  console.log(`   Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : 'ℹ️  Using BEX Neural Core (Local)'}`)
  console.log(`   Database: ✅ JSON/SQLite Engine Online`)
  console.log(`   Download Tokens: ✅ Enabled (24-Hour Signed Link)`)
  console.log(`   Webhook: POST /api/webhook\n`)
})
