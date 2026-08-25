const WebSocket = require('ws')
const https = require('https')

/* ==========================================================================
   BEX SIGMA TECH — GEMINI 2.0 MULTIMODAL LIVE AUDIO GATEWAY
   Bidirectional WebSocket proxy connecting Browser Web Audio with Google
   Gemini 2.0 Flash Multimodal Live API.
   ========================================================================== */

const GEMINI_LIVE_HOST = 'generativelanguage.googleapis.com'
const GEMINI_LIVE_PATH = '/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent'

const SYSTEM_INSTRUCTION = `
You are SIGMA, the senior AI executive and client consultant for BEX SIGMA TECH (Year 2070).
Your goal is to conduct real-time, interactive, professional client consultations and guide visitors through the company's capabilities and 3D orbital command station.

About BEX Sigma Tech:
- We build Next-Generation 3D Web Experiences, Autonomous AI Agent workflows, Quantum Cloud Systems, Cybersecurity Grids, and Executive Analytics Dashboard Blueprints.
- Products & Blueprints in Store: Marketing Performance Dashboard (₹299), Business Executive Analytics Dashboard (₹349), Financial Trend Dashboard (₹319), HR KPI Suite (₹295), and the master One Dashboard BI Suite (₹256).

Client Conversation Protocol:
1. Greet the client warmly, ask their name, and inquire how you can assist their business or project.
2. When the client tells you their name (e.g., "I am Kandavel"), acknowledge it respectfully and address them by name (e.g. "Welcome, Commander Kandavel").
3. When the client asks "tell about your website", "what do you do", or "show me your services":
   - Provide a clear, charismatic overview of BEX Sigma Tech.
   - Explain how our 3D web apps and AI solutions transform businesses.
   - Call the relevant tool to navigate them visually to that sector:
     - Sector 9 Web Development & Store: navigateSector('web_dev')
     - Mission Control & Core AI: navigateSector('mission_control')
     - Biometric Clearance: triggerBiometricScan(callsign)
4. Keep spoken responses natural, engaging, and concise (2-3 sentences per turn) so the conversation flows seamlessly without long monologues.
5. If the client asks about pricing or software blueprints, explain the products and offer to open checkout.
`

const TOOL_DECLARATIONS = [
  {
    name: 'navigateSector',
    description: 'Navigates the 3D orbital command station to a specific sector.',
    parameters: {
      type: 'OBJECT',
      properties: {
        sector: {
          type: 'STRING',
          description: 'Sector to navigate to: web_dev, mission_control, ai_auto, analytics, cyber, cloud, store',
          enum: ['web_dev', 'mission_control', 'ai_auto', 'analytics', 'cyber', 'cloud', 'store']
        }
      },
      required: ['sector']
    }
  },
  {
    name: 'triggerBiometricScan',
    description: 'Triggers the biometric scanning sequence for identity authorization.',
    parameters: {
      type: 'OBJECT',
      properties: {
        callsign: {
          type: 'STRING',
          description: 'Operator callsign or name'
        }
      }
    }
  },
  {
    name: 'showProductDetails',
    description: 'Displays details and pricing of a specific BI dashboard or software blueprint.',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: {
          type: 'STRING',
          description: 'Product identifier: marketing-dashboard, business-dashboard, finance-trend, sales-dashboard, hr-kpi, dashboard-suite, omnicoder-ai'
        }
      },
      required: ['productId']
    }
  }
]

function setupGeminiLiveGateway(server) {
  const wss = new WebSocket.Server({ noServer: true })

  server.on('upgrade', (request, socket, head) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
      if (url.pathname === '/ws/voice' || url.pathname === '/ws/voice/' || url.pathname.startsWith('/ws/voice')) {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request)
        })
      } else {
        socket.destroy()
      }
    } catch (e) {
      socket.destroy()
    }
  })

  console.log('📡 Gemini 2.0 Live Voice Gateway ready on ws://localhost:PORT/ws/voice')

  wss.on('connection', (clientWs, req) => {
    console.log(`🔌 Client connected to Live Voice Gateway from ${req.socket.remoteAddress}`)

    const apiKey = process.env.GEMINI_API_KEY
    const isLiveKeyAvailable = !!(apiKey && apiKey.trim() && apiKey !== 'your_gemini_api_key_here')

    let upstreamWs = null
    let isUpstreamOpen = false

    if (isLiveKeyAvailable) {
      const upstreamUrl = `wss://${GEMINI_LIVE_HOST}${GEMINI_LIVE_PATH}?key=${apiKey}`
      
      try {
        upstreamWs = new WebSocket(upstreamUrl)

        upstreamWs.on('open', () => {
          console.log('✅ Connected to Gemini Live Upstream')
          isUpstreamOpen = true

          // Send Initial Setup Handshake
          const setupMessage = {
            setup: {
              model: 'models/gemini-2.5-flash-native-audio-latest',
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: 'Puck' // Natural, crisp voice
                    }
                  }
                }
              },
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              tools: [{ functionDeclarations: TOOL_DECLARATIONS }]
            }
          }

          upstreamWs.send(JSON.stringify(setupMessage))
          clientWs.send(JSON.stringify({ type: 'STATUS', status: 'CONNECTED', model: 'Gemini 2.0 Live' }))
        })

        upstreamWs.on('message', (data) => {
          try {
            const parsed = JSON.parse(data.toString())
            
            // Proactive AI greeting on setup complete
            if (parsed.setupComplete) {
              console.log('🤖 Sending initial welcome prompt to Gemini Live...')
              upstreamWs.send(JSON.stringify({
                clientContent: {
                  turns: [
                    {
                      role: 'user',
                      parts: [{ text: "The client has just entered the website. Greet them warmly and professionally as Sigma from BEX Sigma Tech. Say: 'Hello! Welcome to BEX Sigma Tech. I am Sigma, your AI consultant. What is your name, and how can I assist you today?'" }]
                    }
                  ],
                  turnComplete: true
                }
              }))
            }

            // 1. Audio stream chunks from Gemini
            if (parsed.serverContent?.modelTurn?.parts) {
              for (const part of parsed.serverContent.modelTurn.parts) {
                if (part.inlineData && part.inlineData.data) {
                  clientWs.send(JSON.stringify({
                    type: 'AUDIO',
                    mimeType: part.inlineData.mimeType || 'audio/pcm;rate=24000',
                    audioData: part.inlineData.data
                  }))
                }
                if (part.text) {
                  clientWs.send(JSON.stringify({
                    type: 'TRANSCRIPT',
                    text: part.text
                  }))
                }
              }
            }

            // 2. Interruption / Barge-in notification
            if (parsed.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'INTERRUPTED' }))
            }

            // 3. Turn complete
            if (parsed.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'TURN_COMPLETE' }))
            }

            // 4. Tool / Function Calls
            if (parsed.toolCall?.functionCalls) {
              for (const call of parsed.toolCall.functionCalls) {
                console.log(`⚡ Voice Function Call: ${call.name}`, call.args)
                clientWs.send(JSON.stringify({
                  type: 'TOOL_CALL',
                  id: call.id,
                  name: call.name,
                  args: call.args
                }))

                // Acknowledge tool call back to Gemini
                if (upstreamWs && upstreamWs.readyState === WebSocket.OPEN) {
                  upstreamWs.send(JSON.stringify({
                    toolResponse: {
                      functionResponses: [
                        {
                          response: { output: { success: true, executed: call.name } },
                          id: call.id
                        }
                      ]
                    }
                  }))
                }
              }
            }
          } catch (err) {
            console.warn('⚠️ Error parsing upstream message:', err.message)
          }
        })

        upstreamWs.on('error', (err) => {
          console.error('❌ Upstream Gemini WS error:', err.message)
          clientWs.send(JSON.stringify({
            type: 'STATUS',
            status: 'OFFLINE_FALLBACK',
            message: 'Gemini Live upstream unavailable, operating in local neural mode.'
          }))
        })

        upstreamWs.on('close', (code, reason) => {
          console.log(`🔌 Upstream Gemini WS closed: ${code} - ${reason}`)
          isUpstreamOpen = false
        })

      } catch (err) {
        console.error('❌ Failed to initialize upstream WS:', err)
      }
    } else {
      console.log('ℹ️ No active GEMINI_API_KEY in server/.env — operating in Local Simulated Neural Voice Mode.')
      clientWs.send(JSON.stringify({
        type: 'STATUS',
        status: 'LOCAL_MODE',
        message: 'BEX Sigma Tech Neural Core ready (Add GEMINI_API_KEY to server/.env for live cloud voice)'
      }))
    }

    // Handle incoming messages from Browser Client
    clientWs.on('message', (message) => {
      try {
        const payload = JSON.parse(message.toString())

        // 1. Stream 16kHz audio chunk to Gemini
        if (payload.type === 'AUDIO_CHUNK' && payload.audioData) {
          if (upstreamWs && upstreamWs.readyState === WebSocket.OPEN) {
            upstreamWs.send(JSON.stringify({
              realtimeInput: {
                mediaChunks: [
                  {
                    mimeType: 'audio/pcm;rate=16000',
                    data: payload.audioData
                  }
                ]
              }
            }))
          }
        }

        // 2. Text command or manual query
        if (payload.type === 'TEXT_INPUT' && payload.text) {
          if (upstreamWs && upstreamWs.readyState === WebSocket.OPEN) {
            upstreamWs.send(JSON.stringify({
              clientContent: {
                turns: [
                  {
                    role: 'user',
                    parts: [{ text: payload.text }]
                  }
                ],
                turnComplete: true
              }
            }))
          }
        }

      } catch (err) {
        console.warn('⚠️ Error parsing client message:', err.message)
      }
    })

    clientWs.on('close', () => {
      console.log('🔌 Client disconnected from Voice Gateway')
      if (upstreamWs && upstreamWs.readyState === WebSocket.OPEN) {
        upstreamWs.close()
      }
    })
  })
}

module.exports = { setupGeminiLiveGateway }
