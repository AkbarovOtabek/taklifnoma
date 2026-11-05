import { useEffect, useRef } from 'react'

// Падающие лепестки и золотая пыль. Холст останавливается, когда ушёл с экрана.
export default function Petals({ count = 46, active = true }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0, h = 0, raf = 0, visible = true, last = performance.now()

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (top) => {
      const dust = Math.random() < 0.45
      return {
        x: Math.random() * w,
        y: top ? -20 - Math.random() * 60 : Math.random() * h,
        r: dust ? 0.7 + Math.random() * 1.5 : 4 + Math.random() * 6,
        vy: dust ? -6 - Math.random() * 10 : 16 + Math.random() * 26,
        sway: 10 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.6,
        rot: Math.random() * 6.28,
        tint: Math.random(),
        dust,
      }
    }
    const items = Array.from({ length: w < 600 ? Math.round(count * 0.55) : count }, () => spawn(false))

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) { last = performance.now(); raf = requestAnimationFrame(frame) }
    })
    io.observe(canvas)

    function frame(now) {
      if (!visible) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)
      for (const p of items) {
        p.y += p.vy * dt
        p.phase += dt * 0.9
        p.rot += p.spin * dt
        const x = p.x + Math.sin(p.phase) * p.sway
        if (p.dust) {
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
          ctx.globalAlpha = 0.35 + 0.45 * Math.abs(Math.sin(p.phase * 1.7))
          ctx.fillStyle = '#ffe6a8'
          ctx.beginPath()
          ctx.arc(x, p.y, p.r, 0, 6.28)
          ctx.fill()
          continue
        }
        if (p.y > h + 20) Object.assign(p, spawn(true))
        ctx.save()
        ctx.translate(x, p.y)
        ctx.rotate(p.rot)
        // вращение в пространстве: лепесток то шире, то у́же
        ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(p.phase)))
        ctx.globalAlpha = 0.85
        ctx.fillStyle = p.tint < 0.55 ? '#fbeee0' : p.tint < 0.85 ? '#f4d5c6' : '#e9c98c'
        ctx.beginPath()
        ctx.moveTo(0, -p.r)
        ctx.bezierCurveTo(p.r, -p.r * 0.6, p.r * 0.8, p.r * 0.7, 0, p.r)
        ctx.bezierCurveTo(-p.r * 0.8, p.r * 0.7, -p.r, -p.r * 0.6, 0, -p.r)
        ctx.fill()
        ctx.restore()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [active, count])

  return <canvas ref={ref} className="petals" aria-hidden="true" />
}
