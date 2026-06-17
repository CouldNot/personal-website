'use client'

import { useEffect, useRef } from 'react'
import type P5 from 'p5'
import styles from './FlowField.module.css'

type Particle = { x: number; y: number; g: number; s: number }

export default function FlowField() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let instance: P5 | undefined

    import('p5').then(({ default: P5 }) => {
      instance = new P5((p: P5) => {
        const particles: Particle[] = []
        let time = 0

        p.setup = () => {
          p.pixelDensity(window.devicePixelRatio)
          const rect = container.getBoundingClientRect()
          const W = Math.round(rect.width)
          const H = rect.height > 0 ? Math.round(rect.height) : Math.round(W * 5 / 3)
          p.createCanvas(W, H)
          p.frameRate(30)
        }

        p.draw = () => {
          const W = p.width

          p.background(0, 15)
          p.filter(p.BLUR)
          p.stroke(190)

          for (let i = 9; i > 0; i--) {
            particles[time % (W * 9)] = { x: (time * 99) % W, y: 0, g: 0, s: 1.5 }
            time++
          }

          for (const pt of particles) {
            if (!pt) continue
            pt.s *= 0.997
            p.strokeWeight(pt.s)

            const n = p.noise(pt.x / W, pt.y / 9, time / W)

            if (n > 0.4) {
              pt.g += 0.5
              pt.y += pt.g
            } else {
              pt.x += n % 0.1 > 0.05 ? 1 : -1
              pt.g = 0
              pt.y += 0.5
            }

            p.point(pt.x, pt.y)
          }
        }
      }, container)
    })

    return () => instance?.remove()
  }, [])

  return <div ref={containerRef} className={styles.container} />
}
