// js/ui/charts.js

/* 1. Pure canvas drawing – no state or DOM here */
export function drawRadar(ctx, values, labels) {
  const size = ctx.canvas.width,
    center = size / 2,
    maxRadius = center * 0.8,
    rings = 4,
    count = values.length

  /* 2. Clear & draw concentric rings */
  ctx.clearRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.shadowColor = 'rgba(0,255,255,0.4)'
  ctx.shadowBlur = 4
  for (let r = 1; r <= rings; r++) {
    const rad = (maxRadius / rings) * r
    ctx.beginPath()
    for (let i = 0; i < count; i++) {
      const angle = ((2 * Math.PI) / count) * i - Math.PI / 2
      const x = center + Math.cos(angle) * rad
      const y = center + Math.sin(angle) * rad
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }
  ctx.shadowBlur = 0

  /* 3. Draw axes & labels */
  ctx.textAlign = 'center'
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.shadowColor = 'rgba(0,255,255,0.6)'
  ctx.shadowBlur = 4
  labels.forEach((lab, i) => {
    const angle = ((2 * Math.PI) / count) * i - Math.PI / 2
    const xA = center + Math.cos(angle) * maxRadius
    const yA = center + Math.sin(angle) * maxRadius
    ctx.beginPath()
    ctx.moveTo(center, center)
    ctx.lineTo(xA, yA)
    ctx.stroke()

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 8px monospace'
    const xL = center + Math.cos(angle) * maxRadius * 0.9
    const yL = center + Math.sin(angle) * maxRadius * 0.9 + 3
    ctx.fillText(lab, xL, yL)
  })
  ctx.shadowBlur = 0

  /* 4. Plot data polygon */
  ctx.beginPath()
  ctx.strokeStyle = '#fff'
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(0,255,255,0.8)'
  ctx.shadowBlur = 8
  values.forEach((v, i) => {
    const angle = ((2 * Math.PI) / count) * i - Math.PI / 2
    const r = maxRadius * (v / 100)
    const xD = center + Math.cos(angle) * r
    const yD = center + Math.sin(angle) * r
    i === 0 ? ctx.moveTo(xD, yD) : ctx.lineTo(xD, yD)
  })
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.shadowBlur = 0
}
