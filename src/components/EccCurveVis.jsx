import { useEffect, useRef } from 'react'
import { getCurvePointsForVis, getGeneratorPoint } from '../utils/ecc'

export default function EccCurveVis({ highlightPoint = null }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    // Clear
    ctx.fillStyle = '#020a02'
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = '#0a1a0a'
    ctx.lineWidth = 1
    for (let x = 0; x <= W; x += W / 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 0; y <= H; y += H / 8) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // Plot real y²=x³-3x+3 curve (mod 97 = finite field points)
    const points = getCurvePointsForVis()
    const G = getGeneratorPoint()
    const P = 97

    // Scale point coordinates to canvas
    const scaleX = (x) => (x / P) * W * 0.9 + W * 0.05
    const scaleY = (y) => H - ((y / P) * H * 0.9 + H * 0.05)

    // Draw all curve points as small green dots
    ctx.fillStyle = '#003b0f'
    for (const [x, y] of points) {
      const cx = scaleX(x)
      const cy = scaleY(y)
      ctx.beginPath()
      ctx.arc(cx, cy, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw generator point G
    if (G) {
      const gx = scaleX(G[0])
      const gy = scaleY(G[1])
      ctx.fillStyle = '#00ff41'
      ctx.shadowColor = '#00ff41'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(gx, gy, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = '#00ff41'
      ctx.font = '11px Share Tech Mono, monospace'
      ctx.fillText('G', gx + 7, gy + 4)
    }

    // Highlight point if provided
    if (highlightPoint && highlightPoint[0] !== undefined) {
      const [px, py] = highlightPoint
      const hx = scaleX(px)
      const hy = scaleY(py)
      ctx.fillStyle = '#ffaa00'
      ctx.shadowColor = '#ffaa00'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(hx, hy, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = '#ffaa00'
      ctx.font = '11px Share Tech Mono, monospace'
      ctx.fillText('P', hx + 7, hy + 4)

      // Line from G to P
      if (G) {
        const gx = scaleX(G[0])
        const gy = scaleY(G[1])
        ctx.strokeStyle = 'rgba(0,255,65,0.3)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(gx, gy)
        ctx.lineTo(hx, hy)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    // Axes labels
    ctx.fillStyle = '#005515'
    ctx.font = '10px Share Tech Mono, monospace'
    ctx.fillText('x', W - 12, H / 2 + 4)
    ctx.fillText('y', W / 2 - 14, 12)
    ctx.fillText('y²=x³-3x+3 (mod 97)', 4, 14)

  }, [highlightPoint])

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={260}
      className="border w-full max-w-sm"
      style={{ borderColor: '#1a3a1a', imageRendering: 'pixelated' }}
    />
  )
}
