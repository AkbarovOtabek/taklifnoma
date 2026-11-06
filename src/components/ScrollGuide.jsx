import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { getStops, onStops, onMove, goStep, goToStop } from '../scroll.js'

// Гид по странице: точки-остановки справа, кнопка «дальше» внизу и короткий
// совет при открытии. Гостю не нужно догадываться, как листать и где остановиться.
export default function ScrollGuide({ t, active }) {
  const [stops, setStops] = useState(getStops)
  const [place, setPlace] = useState({ index: 0, near: true })
  const [armed, setArmed] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => onStops((list) => setStops([...list])), [])
  useEffect(() => onMove(setPlace), [])

  // совет появляется через пару секунд после конверта и уходит, как только
  // гость тронул страницу — он уже понял
  useEffect(() => {
    if (!active) return
    const show = setTimeout(() => setArmed(true), 1800)
    const hide = setTimeout(() => setArmed(false), 12000)
    const off = () => setTouched(true)
    window.addEventListener('wheel', off, { passive: true, once: true })
    window.addEventListener('touchmove', off, { passive: true, once: true })
    window.addEventListener('keydown', off, { once: true })
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
      window.removeEventListener('wheel', off)
      window.removeEventListener('touchmove', off)
      window.removeEventListener('keydown', off)
    }
  }, [active])

  if (!active || stops.length < 2) return null

  const last = stops.length - 1
  const tone = stops[place.index]?.tone === 'dark' ? 'dark' : 'light'
  const hint = armed && !touched && place.index === 0
  const next = place.near && place.index < last

  return (
    <div className={`guide guide-${tone}`}>
      <nav className="rail" aria-label={t.guideTitle}>
        <span className="rail-line" aria-hidden="true">
          <i style={{ transform: `scaleY(${last ? place.index / last : 0})` }} />
        </span>
        {stops.map((s, i) => (
          <button
            key={i}
            onClick={() => goToStop(i)}
            aria-current={i === place.index}
            aria-label={s.label || String(i + 1)}
          >
            <em />
            {s.label && <span>{s.label}</span>}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {next && (
          <motion.button
            className="guide-next"
            onClick={() => goStep(1)}
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            <span>{place.index === 0 ? t.scroll : t.next}</span>
            <motion.i animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <ChevronDown size={16} />
            </motion.i>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hint && (
          <motion.button
            className="coach"
            onClick={() => setTouched(true)}
            style={{ x: '-50%' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="coach-swipe" aria-hidden="true">
              <motion.i
                animate={{ y: [12, -12], opacity: [0, 1, 1, 0] }}
                transition={{
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 2, repeat: Infinity, times: [0, 0.2, 0.75, 1] },
                }}
              />
            </span>
            <span className="coach-text">
              <b>{t.guideTitle}</b>
              <small>{t.guideText}</small>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
