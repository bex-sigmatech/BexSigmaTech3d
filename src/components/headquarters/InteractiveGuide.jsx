import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import '../../styles/interactiveGuide.css'

/* ==========================================================================
   BEX SIGMA TECH — INTERACTIVE GUIDED TOUR
   Game-style arrow pointers that guide new users step by step
   Like a first-time game tutorial with animated arrows & tooltips
   ========================================================================== */

// SVG Arrow Component — sharp, clean directional arrow
const ArrowSVG = () => (
  <svg className="guide-arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L12 18M12 18L6 12M12 18L18 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="20" r="2" fill="currentColor" opacity="0.5"/>
  </svg>
)

// Click hand icon
const ClickIcon = () => (
  <span className="guide-click-icon">👆</span>
)

// Scroll icon
const ScrollIcon = () => (
  <svg className="guide-scroll-arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="2" width="8" height="14" rx="4" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="12" y1="6" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 20L12 23L16 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ─── GUIDE STEPS CONFIGURATION ─── */
const GUIDE_STEPS = [
  {
    id: 'header',
    target: '.nolan-hq-header',
    arrowDirection: 'down',
    title: 'BEx Sigma Tech Command Bar',
    description: 'Header shows your active session. BEx Sigma Tech builds SaaS products, high-ROAS Meta Ads, and full-stack web solutions.',
    action: 'look',
    arrowOffset: { x: 0, y: -55 },
    tooltipPosition: 'below',
  },
  {
    id: '3d-canvas',
    target: '.hq-3d-canvas-wrapper',
    arrowDirection: 'down',
    title: '3D Service Sectors',
    description: 'Each floating orb represents a division: Products Store (Excel Dashboards from ₹256), Mobile Apps Matrix, Client Case Studies, and Company Hub.',
    action: 'look',
    arrowOffset: { x: 0, y: -55 },
    tooltipPosition: 'center',
  },
  {
    id: 'scroll-nav',
    target: '.jarvis-scroll-hint',
    arrowDirection: 'up',
    title: 'Scroll / Swipe to Rotate',
    description: 'Use your mouse scroll wheel or swipe on mobile to rotate the orbital camera and switch between service sectors.',
    action: 'scroll',
    arrowOffset: { x: 0, y: 55 },
    tooltipPosition: 'above',
  },
  {
    id: 'dept-panel',
    target: '.jarvis-dept-panel',
    arrowDirection: 'up',
    title: 'Service Info Capsule',
    description: 'This capsule highlights the selected service, products available, and pricing tags. Use the ‹ and › buttons to cycle sectors.',
    action: 'look',
    arrowOffset: { x: 0, y: 55 },
    tooltipPosition: 'above',
  },
  {
    id: 'engage-btn',
    target: '.jarvis-capsule-engage-btn',
    arrowDirection: 'down',
    title: 'Click ENTER to Open Division',
    description: 'Click ENTER (or press Enter key) to open the store, browse dashboard products, see client case studies, or place an order.',
    action: 'click',
    arrowOffset: { x: 0, y: -55 },
    tooltipPosition: 'above',
  },
]

/* ─── Utility: Get element rect with safety ─── */
function getElementRect(selector) {
  try {
    const el = document.querySelector(selector)
    if (!el) return null
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) return null
    return rect
  } catch {
    return null
  }
}

/* ─── Calculate arrow position based on target and direction ─── */
function getArrowPosition(rect, direction, offset = { x: 0, y: 0 }) {
  if (!rect) return { top: -9999, left: -9999 }
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  switch (direction) {
    case 'down':
      return { top: rect.top + offset.y, left: cx - 24 + offset.x }
    case 'up':
      return { top: rect.bottom - offset.y, left: cx - 24 + offset.x }
    case 'left':
      return { top: cy - 24 + offset.y, left: rect.left + offset.x }
    case 'right':
      return { top: cy - 24 + offset.y, left: rect.right - offset.x }
    default:
      return { top: rect.top - 55, left: cx - 24 }
  }
}

/* ─── Calculate tooltip position ─── */
function getTooltipPosition(rect, position, tooltipWidth = 320) {
  if (!rect) return { top: -9999, left: -9999 }
  const cx = rect.left + rect.width / 2
  const vw = window.innerWidth
  const vh = window.innerHeight
  let pos = {}

  switch (position) {
    case 'below':
      pos = { top: rect.bottom + 65, left: Math.max(16, Math.min(cx - tooltipWidth / 2, vw - tooltipWidth - 16)) }
      break
    case 'below-left':
      pos = { top: rect.bottom + 65, left: Math.max(16, rect.right - tooltipWidth) }
      break
    case 'above':
      pos = { top: rect.top - 220, left: Math.max(16, Math.min(cx - tooltipWidth / 2, vw - tooltipWidth - 16)) }
      break
    case 'left':
      pos = { top: rect.top, left: Math.max(16, rect.left - tooltipWidth - 70) }
      break
    case 'right':
      pos = { top: rect.top, left: Math.min(rect.right + 70, vw - tooltipWidth - 16) }
      break
    case 'center':
      pos = { top: Math.min(rect.top + rect.height / 2 - 80, vh - 280), left: Math.max(16, Math.min(cx - tooltipWidth / 2, vw - tooltipWidth - 16)) }
      break
    default:
      pos = { top: rect.bottom + 65, left: Math.max(16, cx - tooltipWidth / 2) }
  }

  // Clamp to viewport
  pos.top = Math.max(16, Math.min(pos.top, vh - 260))
  pos.left = Math.max(16, Math.min(pos.left, vw - tooltipWidth - 16))
  return pos
}

/* ─── PULSE RING around target element ─── */
function getPulseRect(rect) {
  if (!rect) return { top: -9999, left: -9999, width: 0, height: 0 }
  const pad = 8
  return {
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  }
}


/* ==========================================================================
   MAIN INTERACTIVE GUIDE COMPONENT
   ========================================================================== */
export default function InteractiveGuide({ isActive, onClose, onTriggerFirstTime }) {
  const [phase, setPhase] = useState('idle') // 'idle' | 'welcome' | 'touring' | 'complete' | 'exiting'
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState(null)
  const animFrameRef = useRef(null)
  const hasSeenGuideRef = useRef(false)

  // Check localStorage for first-time user
  useEffect(() => {
    try {
      const seen = localStorage.getItem('bex_guide_completed')
      hasSeenGuideRef.current = !!seen
      if (!seen && onTriggerFirstTime) {
        // Auto-trigger for first-time users after a short delay
        const timer = setTimeout(() => {
          onTriggerFirstTime()
        }, 2500)
        return () => clearTimeout(timer)
      }
    } catch { }
  }, [onTriggerFirstTime])

  // When guide activates, show welcome splash
  useEffect(() => {
    if (isActive) {
      setPhase('welcome')
      setCurrentStep(0)
    } else {
      setPhase('idle')
    }
  }, [isActive])

  // Track target element position with RAF for smooth updates
  const updateTargetPosition = useCallback(() => {
    if (phase !== 'touring') return
    const step = GUIDE_STEPS[currentStep]
    if (!step) return
    const rect = getElementRect(step.target)
    setTargetRect(rect)
    animFrameRef.current = requestAnimationFrame(updateTargetPosition)
  }, [phase, currentStep])

  useEffect(() => {
    if (phase === 'touring') {
      animFrameRef.current = requestAnimationFrame(updateTargetPosition)
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [phase, updateTargetPosition])

  // Start the tour
  const handleStartTour = useCallback(() => {
    setCurrentStep(0)
    setPhase('touring')
  }, [])

  // Next step
  const handleNext = useCallback(() => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setPhase('complete')
      try {
        localStorage.setItem('bex_guide_completed', 'true')
      } catch { }
    }
  }, [currentStep])

  // Previous step
  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  // Skip / Close guide
  const handleSkip = useCallback(() => {
    setPhase('exiting')
    try {
      localStorage.setItem('bex_guide_completed', 'true')
    } catch { }
    setTimeout(() => {
      onClose()
      setPhase('idle')
    }, 500)
  }, [onClose])

  // Complete close
  const handleComplete = useCallback(() => {
    setPhase('exiting')
    setTimeout(() => {
      onClose()
      setPhase('idle')
    }, 500)
  }, [onClose])

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'touring') return
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        handlePrev()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [phase, handleNext, handlePrev, handleSkip])

  // Don't render if idle
  if (phase === 'idle') return null

  const step = GUIDE_STEPS[currentStep]
  const arrowPos = phase === 'touring' && targetRect
    ? getArrowPosition(targetRect, step?.arrowDirection, step?.arrowOffset)
    : null
  const tooltipPos = phase === 'touring' && targetRect
    ? getTooltipPosition(targetRect, step?.tooltipPosition)
    : null
  const pulseRect = phase === 'touring' && targetRect
    ? getPulseRect(targetRect)
    : null

  return (
    <>
      {/* ── SPOTLIGHT DARK MASK ── */}
      <div className={`guide-spotlight-mask ${phase !== 'idle' ? 'active' : ''}`}
        style={{
          background: phase === 'touring' && targetRect
            ? `radial-gradient(ellipse 300px 200px at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent 30%, rgba(2, 8, 18, 0.75) 100%)`
            : 'transparent'
        }}
      />

      {/* ── MAIN OVERLAY ── */}
      <div className={`guide-overlay ${phase !== 'idle' ? 'active' : ''} ${phase === 'exiting' ? 'exiting' : ''}`}>

        {/* ── WELCOME SPLASH ── */}
        {phase === 'welcome' && (
          <div className="guide-welcome-splash">
            <div className="guide-welcome-card">
              <span className="guide-welcome-icon">🪐</span>
              <h2 className="guide-welcome-title">WELCOME TO BEX SIGMA TECH</h2>
              <p className="guide-welcome-subtitle">
                Explore our web development services, Excel business dashboards, mobile apps, and client case studies inside this interactive 3D command station.
              </p>
              <div className="guide-welcome-service-tags">
                <span className="guide-service-tag">🛒 Excel Dashboards Store</span>
                <span className="guide-service-tag">💻 Custom Web & 3D Design</span>
                <span className="guide-service-tag">📱 Mobile Apps</span>
                <span className="guide-service-tag">📈 Meta Ads</span>
              </div>
              <button className="guide-welcome-start-btn" onClick={handleStartTour}>
                QUICK 30-SEC TOUR ▸
              </button>
              <button className="guide-welcome-dismiss" onClick={handleSkip}>
                I already know how to explore
              </button>
            </div>
          </div>
        )}

        {/* ── TOUR ACTIVE: Arrow + Pulse + Tooltip ── */}
        {phase === 'touring' && step && (
          <>
            {/* Pulsing ring around target */}
            {pulseRect && (
              <div
                className="guide-pulse-ring"
                style={{
                  top: pulseRect.top,
                  left: pulseRect.left,
                  width: pulseRect.width,
                  height: pulseRect.height,
                }}
              />
            )}

            {/* Animated arrow pointing at target */}
            {arrowPos && (
              <div
                className={`guide-arrow arrow-${step.arrowDirection}`}
                style={{ top: arrowPos.top, left: arrowPos.left }}
              >
                <ArrowSVG />
              </div>
            )}

            {/* Action indicators (click hand, scroll icon) */}
            {step.action === 'click' && targetRect && (
              <div
                className="guide-click-indicator"
                style={{
                  top: targetRect.top + targetRect.height / 2 - 16,
                  left: targetRect.left + targetRect.width / 2 - 16,
                }}
              >
                <ClickIcon />
              </div>
            )}
            {step.action === 'scroll' && targetRect && (
              <div
                className="guide-scroll-arrow"
                style={{
                  top: targetRect.top + targetRect.height / 2 - 24,
                  left: targetRect.left + targetRect.width / 2 - 16,
                }}
              >
                <ScrollIcon />
                <span className="guide-scroll-label">Scroll</span>
              </div>
            )}

            {/* Tooltip card */}
            {tooltipPos && (
              <div
                className="guide-tooltip"
                key={step.id}
                style={{ top: tooltipPos.top, left: tooltipPos.left }}
              >
                {/* Progress dots */}
                <div className="guide-progress-bar">
                  {GUIDE_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`guide-progress-dot ${idx < currentStep ? 'completed' : ''} ${idx === currentStep ? 'active' : ''}`}
                    />
                  ))}
                </div>

                {/* Header with step badge */}
                <div className="guide-tooltip-header">
                  <span className="guide-tooltip-step-badge">{currentStep + 1}</span>
                  <span className="guide-tooltip-label">
                    Step {currentStep + 1} of {GUIDE_STEPS.length}
                  </span>
                </div>

                <h3 className="guide-tooltip-title">{step.title}</h3>
                <p className="guide-tooltip-desc">{step.description}</p>

                {/* Action buttons */}
                <div className="guide-tooltip-actions">
                  {currentStep > 0 ? (
                    <button className="guide-tooltip-btn btn-prev" onClick={handlePrev}>
                      ‹ Back
                    </button>
                  ) : (
                    <button className="guide-tooltip-btn btn-skip" onClick={handleSkip}>
                      Skip
                    </button>
                  )}
                  <button className="guide-tooltip-btn btn-next" onClick={handleNext}>
                    {currentStep < GUIDE_STEPS.length - 1 ? 'Next ›' : 'Finish ✓'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── COMPLETION SPLASH ── */}
        {phase === 'complete' && (
          <div className="guide-welcome-splash">
            <div className="guide-complete-card">
              <span className="guide-complete-icon">✅</span>
              <h2 className="guide-complete-title">ORIENTATION COMPLETE</h2>
              <p className="guide-complete-subtitle">
                You're ready to explore the station! Scroll to navigate between departments,
                click ENTER to dive in, and use the minimap for quick jumps.
                You can restart this guide anytime from the <strong>?</strong> button in the header.
              </p>
              <button className="guide-complete-close-btn" onClick={handleComplete}>
                BEGIN EXPLORATION ▸
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
