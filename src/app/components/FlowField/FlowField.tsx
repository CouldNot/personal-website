'use client'

import { useEffect, useRef } from 'react'
import styles from './FlowField.module.css'

const TWO_PI = Math.PI * 2

function makeNoise() {
  const perm = new Uint8Array(512)
  for (let i = 0; i < 256; i++) perm[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i]

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (a: number, b: number, t: number) => a + t * (b - a)
  const grad = (h: number, x: number, y: number) =>
    ((h & 1) ? -x : x) + ((h & 2) ? -y : y)

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = fade(x)
    const v = fade(y)
    const a = perm[X] + Y
    const b = perm[X + 1] + Y
    return lerp(
      lerp(grad(perm[a], x, y), grad(perm[b], x - 1, y), u),
      lerp(grad(perm[a + 1], x, y - 1), grad(perm[b + 1], x - 1, y - 1), u),
      v
    )
  }
}

const COLORS = [
  'rgba(26, 26, 26, 0.07)',
  'rgba(26, 26, 26, 0.05)',
  'rgba(80, 52, 22, 0.06)',
  'rgba(110, 75, 35, 0.04)',
]

export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const noise = makeNoise()
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#fefef4'
    ctx.fillRect(0, 0, W, H)

    const particles = Array.from({ length: 350 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    let t = 0
    let raf: number

    function tick() {
      ctx.fillStyle = 'rgba(254, 254, 244, 0.018)'
      ctx.fillRect(0, 0, W, H)

      for (const p of particles) {
        const angle = noise(p.x * 0.003, p.y * 0.003 + t) * TWO_PI * 2
        const nx = p.x + Math.cos(angle) * 0.9
        const ny = p.y + Math.sin(angle) * 0.9

        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(nx, ny)
        ctx.strokeStyle = p.color
        ctx.lineWidth = 1.1
        ctx.stroke()

        p.x = nx
        p.y = ny

        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          p.x = Math.random() * W
          p.y = Math.random() * H
        }
      }

      t += 0.0003
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
