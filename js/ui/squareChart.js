// js/ui/squareChart.js

export function drawSquareStats(ctx, values, labels) {
  const size = ctx.canvas.width // assume square canvas
  const center = size / 2
  // 75% of the old “max radius”
  const max = center * 0.6

  // 1) Clear
  ctx.clearRect(0, 0, size, size)

  // 2) Style for the “rings”
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.shadowColor = 'rgba(0,255,255,0.4)'
  ctx.shadowBlur = 4

  // 3) Draw 4 concentric **rotated** squares (i.e. a diamond)
  ctx.save()
  ctx.translate(center, center)
  ctx.rotate(Math.PI / 4) // rotate 45° so rects become diamonds
  for (let r = 1; r <= 4; r++) {
    const side = ((max * 2) / 4) * r // each ring is (max*2) / 4
    ctx.beginPath()
    ctx.rect(-side / 2, -side / 2, side, side)
    ctx.stroke()
  }
  ctx.restore()
  ctx.shadowBlur = 0

  // 4) axes & labels at the vertices
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.shadowColor = 'rgba(0,255,255,0.6)'
  ctx.shadowBlur = 4
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 12px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle' // <-- new

  // TOP, RIGHT, BOTTOM, LEFT
  const angles = labels.map((_, i) => -Math.PI / 2 + i * (Math.PI / 2))
  const labelDist = max + 40 // push labels further out

  angles.forEach((angle, i) => {
    // axis line
    const xA = center + Math.cos(angle) * max
    const yA = center + Math.sin(angle) * max
    ctx.beginPath()
    ctx.moveTo(center, center)
    ctx.lineTo(xA, yA)
    ctx.stroke()

    // label just beyond the vertex
    const lx = center + Math.cos(angle) * labelDist
    const ly = center + Math.sin(angle) * labelDist
    ctx.fillText(labels[i], lx, ly)
  })
  ctx.shadowBlur = 0

  // 5) Plot your data polygon in neon-white
  ctx.beginPath()
  ctx.strokeStyle = '#fff'
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(0,255,255,0.8)'
  ctx.shadowBlur = 8

  values.forEach((v, i) => {
    const angle = angles[i]
    const r = max * (v / 100)
    const xD = center + Math.cos(angle) * r
    const yD = center + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(xD, yD)
    else ctx.lineTo(xD, yD)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.shadowBlur = 0
}
