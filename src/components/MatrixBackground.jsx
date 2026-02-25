import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01010110ABCDEF∑∏√∞∂∇⊕⊗'

export default function MatrixBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const FONT_SIZE = 14
    let cols, drops, speeds, opacities, charIdx

    function init() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / FONT_SIZE)

      drops = Array.from({ length: cols }, () => Math.random() * -canvas.height / FONT_SIZE)
      speeds = Array.from({ length: cols }, () => 0.3 + Math.random() * 1.2)
      opacities = Array.from({ length: cols }, () => 0.4 + Math.random() * 0.6)
      charIdx = Array.from({ length: cols }, () => Math.floor(Math.random() * CHARS.length))
    }

    init()

    let animId
    function draw() {
      // Fade trail — semi-transparent black overlay
      ctx.fillStyle = 'rgba(10, 10, 10, 0.055)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${FONT_SIZE}px 'Share Tech Mono', monospace`

      for (let i = 0; i < cols; i++) {
        const y = drops[i] * FONT_SIZE
        const x = i * FONT_SIZE

        // Head character — bright white-green glow
        const headY = Math.floor(drops[i]) * FONT_SIZE
        ctx.shadowBlur = 8
        ctx.shadowColor = '#00ff41'
        ctx.fillStyle = `rgba(180, 255, 200, ${opacities[i]})`
        ctx.fillText(CHARS[charIdx[i]], x, headY)

        // Body character just below head — green
        ctx.shadowBlur = 4
        ctx.shadowColor = '#00ff41'
        ctx.fillStyle = `rgba(0, 255, 65, ${opacities[i] * 0.7})`
        const c2 = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillText(c2, x, headY + FONT_SIZE)

        ctx.shadowBlur = 0

        // Advance drop
        drops[i] += speeds[i]

        // Random char change
        if (Math.random() < 0.04) {
          charIdx[i] = Math.floor(Math.random() * CHARS.length)
        }

        // Reset when off screen
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() < 0.015) {
          drops[i] = Math.random() * -20
          speeds[i] = 0.3 + Math.random() * 1.2
          opacities[i] = 0.3 + Math.random() * 0.5
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => { init() }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.35,
      }}
    />
  )
}
