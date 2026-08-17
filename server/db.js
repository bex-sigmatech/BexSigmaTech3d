/* ==========================================================================
   BEX SIGMA TECH — PERSISTENT DATABASE ENGINE
   Zero-config persistent database module for orders, download logs & AI chats
   ========================================================================== */

const fs = require('fs')
const path = require('path')

const DB_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DB_DIR, 'database.json')

// Default structure
const initialSchema = {
  orders: [],
  downloads: [],
  aiChats: [],
  systemLogs: []
}

// Ensure data directory and file exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSchema, null, 2), 'utf8')
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
      timestamp: new Date().toISOString()
    }
    db.orders.unshift(record)
    writeDb(db)
    console.log(`💾 Saved verified order to DB: ${record.payment_id}`)
    return record
  },

  getOrders() {
    const db = readDb()
    return db.orders
  },

  logDownload(productId, customerEmail, token) {
    const db = readDb()
    const log = {
      id: `dl_${Date.now()}`,
      productId,
      customerEmail,
      token,
      timestamp: new Date().toISOString()
    }
    db.downloads.unshift(log)
    writeDb(db)
    return log
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
  }
}
