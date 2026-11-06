import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { wedding } from '../config.js'
import { GirihLayer } from './Ornaments.jsx'
import { Bloom } from './Flowers.jsx'

const ease = [0.65, 0, 0.35, 1]
const fall = [0.5, 0, 0.9, 0.6]

function seeded(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// Гирлянда вдоль верхних сгибов: розы сходятся к печати и становятся крупнее
// ближе к ней. Сгибы заданы в процентах конверта, поэтому цветы ложатся на шов
// при любой форме экрана.
const garland = (side) => {
  const rnd = seeded(side > 0 ? 919 : 373)
  const mirror = (x) => (side < 0 ? x : 100 - x)
  const bloom = (x, y, size, green) => ({
    left: `${mirror(x)}%`,
    top: `${y}%`,
    width: `calc(var(--bloom) * ${size.toFixed(2)})`,
    tone: Math.floor(rnd() * 4),
    rot: Math.round(rnd() * 360),
    green,
  })

  const out = Array.from({ length: 18 }, (_, i) => {
    const t = 0.24 + (i / 17) * 0.7
    const green = i % 3 === 2
    return bloom(
      50 * t + (rnd() - 0.5) * 6,
      56 * t + (rnd() - 0.5) * 6,
      (green ? 0.8 : 0.5) + t * 0.95,
      green,
    )
  })

  // венок у самой печати: сюда садятся самые крупные цветы
  const collar = [[17, 50.5, 1.5], [12.5, 57, 1.6], [19, 61, 1.25], [8, 62.5, 1.1], [22, 55, 0.95]]
  collar.forEach(([dx, y, size], i) => out.push(bloom(50 - dx, y, size, i === 3)))
  return out
}
const garlands = [garland(-1), garland(1)]

function Bouquet({ side, opened }) {
  return (
    <motion.div
      className="bouquet"
      aria-hidden="true"
      animate={opened ? { x: `${side * 16}%`, y: '11%', rotate: side * 7, opacity: 0 } : {}}
      transition={{ duration: 1.1, ease: fall, delay: 0.1 }}
    >
      {garlands[side < 0 ? 0 : 1].map(({ left, top, width, tone, rot, green }, i) => (
        <span key={i} className="bloom" style={{ left, top, width }}>
          <Bloom tone={tone} rot={rot} green={green} />
        </span>
      ))}
    </motion.div>
  )
}

// Шнур, которым запечатан конверт: печать лежит прямо на нём
function Cord({ opened }) {
  return (
    <motion.div
      className="env-cord"
      aria-hidden="true"
      animate={{ opacity: opened ? 0 : 1 }}
      transition={{ duration: 0.7 }}
    >
      <svg viewBox="0 0 100 14" preserveAspectRatio="none">
        <path d="M0 3Q50 9.5 100 3" fill="none" stroke="#e7cd92" strokeOpacity=".7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M0 4.6Q50 11.1 100 4.6" fill="none" stroke="#c9a35c" strokeOpacity=".45" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M0 3Q50 9.5 100 3" fill="none" stroke="#6f4c1b" strokeOpacity=".45" strokeWidth="2" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
      </svg>
    </motion.div>
  )
}

function Seal({ opened }) {
  const [a, b] = wedding.monogram
  const half = (side) => (
    <motion.div
      className="seal-half"
      style={{ clipPath: side < 0 ? 'polygon(0 0,54% 0,46% 30%,56% 52%,44% 74%,52% 100%,0 100%)' : 'polygon(54% 0,100% 0,100% 100%,52% 100%,44% 74%,56% 52%,46% 30%)' }}
      animate={opened ? { x: side * 70, y: 240, rotate: side * 34, opacity: 0 } : {}}
      transition={{ duration: 1, ease: [0.5, 0, 0.9, 0.6], delay: 0.1 }}
    >
      <svg viewBox="0 0 200 200">
        <defs>
          <radialGradient id={`wax${side}`} cx="38%" cy="30%" r="80%">
            <stop offset="0" stopColor="#f6e2ae" />
            <stop offset=".45" stopColor="#d5ad63" />
            <stop offset="1" stopColor="#8d6429" />
          </radialGradient>
        </defs>
        <path
          d="M100 6c17-2 29 5 43 12 15 8 30 16 37 32 6 15 3 31 8 47 4 16 5 33-4 47-9 15-27 21-41 30-14 8-27 20-44 19-17 0-30-12-44-21-14-8-31-14-39-29s-5-32-8-48c-3-16-8-32-1-47C14 33 31 25 46 17 63 9 82 8 100 6Z"
          fill={`url(#wax${side})`}
        />
        <circle cx="100" cy="100" r="63" fill="none" stroke="#7f5a24" strokeOpacity=".55" strokeWidth="3" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#fff3cf" strokeOpacity=".5" strokeWidth="1.5" />
        <text x="100" y="121" textAnchor="middle" className="seal-text">{a}&amp;{b}</text>
      </svg>
    </motion.div>
  )
  return (
    <div className={opened ? 'seal seal-open' : 'seal'}>
      {half(-1)}
      {half(1)}
    </div>
  )
}

export default function Envelope({ t, guest, opened, onOpen, onDone }) {
  // 0 — закрыт, 1 — клапан поднят, 2 — карточка выходит, 3 — конверт расходится
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (!opened) return
    const timers = [
      setTimeout(() => setStage(1), 350),
      setTimeout(() => setStage(2), 1250),
      setTimeout(() => setStage(3), 2500),
      setTimeout(onDone, 3500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [opened]) // eslint-disable-line react-hooks/exhaustive-deps

  const lines = (
    <svg className="env-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0 50 56 100 0" />
    </svg>
  )

  return (
    <motion.div
      className="envelope"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      onClick={opened ? undefined : onOpen}
      onKeyDown={(e) => { if (!opened && (e.key === 'Enter' || e.key === ' ')) onOpen() }}
      role="button"
      tabIndex={0}
      aria-label={t.tap}
    >
      {/* внутренность конверта */}
      <div className="env-inside">
        <GirihLayer id="g-inside" color="#e3c47f" opacity={0.3} size={72} />
      </div>

      {/* карточка, которая выходит и заполняет экран */}
      <motion.div
        className="env-card"
        initial={{ y: '58%', scale: 0.72 }}
        animate={
          stage >= 3 ? { y: 0, scale: 1.55, opacity: 0 }
          : stage >= 2 ? { y: '-6%', scale: 0.86 }
          : { y: '58%', scale: 0.72 }
        }
        transition={{ duration: stage >= 3 ? 1.1 : 1.25, ease }}
        style={{ zIndex: stage >= 1 ? 3 : 1 }}
      >
        <div className="env-card-in">
          <span className="eyebrow">{t.theWedding}</span>
          <div className="env-card-mono">{wedding.monogram[0]}<i>&amp;</i>{wedding.monogram[1]}</div>
        </div>
      </motion.div>

      {/* боковые и нижний клапаны */}
      <motion.div
        className="flap flap-left"
        animate={stage >= 3 ? { x: '-105%' } : { x: 0 }}
        transition={{ duration: 1, ease }}
      ><GirihLayer id="g-left" size={110} opacity={0.26} /></motion.div>
      <motion.div
        className="flap flap-right"
        animate={stage >= 3 ? { x: '105%' } : { x: 0 }}
        transition={{ duration: 1, ease }}
      ><GirihLayer id="g-right" size={110} opacity={0.26} /></motion.div>
      <motion.div
        className="flap flap-bottom"
        animate={stage >= 3 ? { y: '105%' } : { y: 0 }}
        transition={{ duration: 1, ease }}
      ><GirihLayer id="g-bottom" size={110} opacity={0.3} /></motion.div>

      {/* верхний клапан: откидывается вокруг верхней кромки */}
      <motion.div
        className="flap-top-wrap"
        style={{ zIndex: stage >= 1 ? 2 : 6, transformOrigin: '50% 0%' }}
        animate={{ rotateX: stage >= 1 ? 178 : 0 }}
        transition={{ duration: 1.15, ease }}
      >
        <div className="flap flap-top">
          <GirihLayer id="g-top" size={110} opacity={0.38} />
          {lines}
        </div>
      </motion.div>

      <Cord opened={opened} />
      <Bouquet side={-1} opened={opened} />
      <Bouquet side={1} opened={opened} />

      <div className="env-face">
        <Seal opened={opened} />
        <motion.div
          className="env-title"
          animate={{ opacity: opened ? 0 : 1, y: opened ? 16 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {guest && <p className="env-guest">{t.dear} {guest}</p>}
          <h1>{t.gate}</h1>
          <motion.p
            className="env-tap"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {t.tap}
          </motion.p>
        </motion.div>
      </div>

      {/* золотая вспышка на переходе к сцене */}
      <motion.div
        className="env-flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 3 ? [0, 0.95, 0.95] : 0 }}
        transition={{ duration: 1, times: [0, 0.7, 1] }}
      />
    </motion.div>
  )
}
