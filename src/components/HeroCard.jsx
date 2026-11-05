import { useEffect, useRef, useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { InvitationCard } from './Invitation.jsx'

// Карточка приглашения вылетает из света проёма и встаёт на экран.
// progress — 0…1 этого полёта, его задаёт первый экран.
export default function HeroCard({ progress, t, data }) {
  // карточка должна целиком поместиться в экран: на низких экранах уменьшаем её
  const ref = useRef(null)
  const [fit, setFit] = useState(1)
  useEffect(() => {
    const measure = () => {
      const el = ref.current
      if (!el) return
      setFit(Math.min(1, (window.innerHeight - 28) / el.offsetHeight, (window.innerWidth - 20) / el.offsetWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const ease = (v) => 1 - (1 - v) ** 3
  const scale = useTransform(progress, [0, 0.75], [0.18 * fit, fit], { ease })
  const rotateX = useTransform(progress, [0, 0.75], [32, 0], { ease })
  const opacity = useTransform(progress, [0, 0.2], [0, 1])
  const glow = useTransform(progress, [0, 0.5], [1, 0])

  return (
    <div className="hero-card">
      <motion.div className="hero-card-glow" style={{ opacity: glow }} />
      <motion.div
        ref={ref}
        className="hero-card-in"
        style={{ scale, rotateX, opacity, transformPerspective: 1000 }}
      >
        <InvitationCard t={t} data={data} />
      </motion.div>
    </div>
  )
}
