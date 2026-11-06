import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

// Восьмиконечная звезда гирих — повторяющийся мотив майолики Самарканда и Бухары.
export function GirihPattern({ id, color = '#c9a35c', opacity = 0.35, size = 96, width = 1 }) {
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" viewBox="0 0 96 96">
      <g fill="none" stroke={color} strokeOpacity={opacity} strokeWidth={width}>
        <path d="M48 14 58 24 72 24 72 38 82 48 72 58 72 72 58 72 48 82 38 72 24 72 24 58 14 48 24 38 24 24 38 24Z" />
        <path d="M48 28 54 34 62 34 62 42 68 48 62 54 62 62 54 62 48 68 42 62 34 62 34 54 28 48 34 42 34 34 42 34Z" />
        <path d="M0 0 24 24M96 0 72 24M0 96 24 72M96 96 72 72" />
        <path d="M48 0V14M48 82V96M0 48H14M82 48H96" />
        <path d="M0 24 14 48 0 72M96 24 82 48 96 72M24 0 48 14 72 0M24 96 48 82 72 96" />
      </g>
      <circle cx="48" cy="48" r="2.2" fill={color} fillOpacity={opacity * 1.4} />
    </pattern>
  )
}

export function GirihLayer({ id, color, opacity, size, style }) {
  return (
    <svg className="girih" aria-hidden="true" style={style}>
      <defs><GirihPattern id={id} color={color} opacity={opacity} size={size} /></defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// Маленький золотой разделитель, который прорисовывается при появлении
export function Divider({ color = '#b48f4a' }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.6, ease: 'easeInOut' } },
  }
  return (
    <motion.svg
      className="divider"
      viewBox="0 0 220 24"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      aria-hidden="true"
    >
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round">
        <motion.path variants={draw} d="M96 12C70 12 50 4 6 12" />
        <motion.path variants={draw} d="M124 12C150 12 170 4 214 12" />
        <motion.path variants={draw} d="M110 3 119 12 110 21 101 12Z" />
        <motion.path variants={draw} d="M110 8 114 12 110 16 106 12Z" />
      </g>
    </motion.svg>
  )
}

// Текст появляется мягко, снизу. Без размытия: на телефоне оно даёт рывки
export function Reveal({ children, delay = 0, y = 26, className, as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}

// Резная арка-дверь: стена с узором и стрельчатым проёмом в центре.
// Проём — по центру квадрата 3000×3000, поэтому зум идёт ровно в него.
const HOLE = 'M1180 2000V1330C1180 1190 1330 1090 1500 1000 1670 1090 1820 1190 1820 1330V2000Z'
const RIM = 'M1140 2040V1322C1140 1166 1306 1052 1500 952 1694 1052 1860 1166 1860 1322V2040'
const RIM2 = 'M1106 2074V1316C1106 1146 1288 1020 1500 912 1712 1020 1894 1146 1894 1316V2074'

// Стена с узором и светильниками — дальний слой двери
function PortalWall({ id, tone }) {
  const teal = tone === 'teal'
  return (
    <svg viewBox="0 0 3000 3000" aria-hidden="true">
      <defs>
        <GirihPattern id={`${id}-tile`} color={teal ? '#e3c47f' : '#c9a35c'} opacity={teal ? 0.32 : 0.28} size={110} width={1.6} />
        <radialGradient id={`${id}-wall`} cx=".5" cy=".5" r=".5">
          <stop offset=".25" stopColor={teal ? '#14566a' : '#fbf6ea'} />
          <stop offset="1" stopColor={teal ? '#082c33' : '#ecdcbc'} />
        </radialGradient>
      </defs>
      <path fillRule="evenodd" fill={`url(#${id}-wall)`} d={`M0 0H3000V3000H0Z ${HOLE}`} />
      <path fillRule="evenodd" fill={`url(#${id}-tile)`} d={`M0 0H3000V3000H0Z ${HOLE}`} />
      <path d={HOLE} fill="none" stroke={teal ? '#e7cd92' : '#94702f'} strokeWidth="4" />
      {/* светильники по сторонам двери */}
      {[1050, 1950].map((x) => (
        <g key={x}>
          <circle cx={x} cy="1560" r="120" fill="#ffd98f" fillOpacity={teal ? 0.28 : 0.18} />
          <circle cx={x} cy="1560" r="16" fill="#fff4d2" />
        </g>
      ))}
    </svg>
  )
}

// Золотой обод — ближний слой. Он растёт быстрее стены, и у двери появляется толщина
function PortalRim() {
  return (
    <svg viewBox="0 0 3000 3000" aria-hidden="true">
      <path d={RIM2} fill="none" stroke="#c9a35c" strokeWidth="3" />
      <path d={RIM} fill="none" stroke="#c9a35c" strokeWidth="10" />
    </svg>
  )
}

const smoothstep = (v) => v * v * (3 - 2 * v)
// пружина сглаживает рывки пальца и колеса: анимация догоняет прокрутку мягко
export const SPRING = { stiffness: 140, damping: 30, mass: 0.6, restDelta: 0.0002 }

// «Вход внутрь» для любой части сайта: часть закрепляется на экране, перед гостем
// стоит резная арка-дверь, а при прокрутке он проходит сквозь неё — содержимое
// раскрывается из проёма на весь экран и стоит, пока его читают.
let portalCount = 0
export function Portal({ children, tone = 'ivory', className = '', stops = '0.72', nav = '' }) {
  const ref = useRef(null)
  const content = useRef(null)
  const [id] = useState(() => `portal${++portalCount}`)
  const [fit, setFit] = useState(1)

  // содержимое должно целиком встать в экран: на низких экранах уменьшаем его
  useEffect(() => {
    const measure = () => {
      const el = content.current
      if (!el) return
      setFit(Math.min(1, (window.innerHeight - 24) / el.offsetHeight, window.innerWidth / el.offsetWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, SPRING)

  // 0–0.55 — проход сквозь дверь, 0.55–0.88 — содержимое стоит, 0.88–1 — оно отдаляется
  const wall = useTransform(p, [0, 0.55], [1, 5.5], { ease: (v) => v ** 2.2 })
  const rim = useTransform(p, [0, 0.55], [1, 7.5], { ease: (v) => v ** 2.2 })
  const archOp = useTransform(p, [0.36, 0.55], [1, 0], { ease: smoothstep })
  const flash = useTransform(p, [0.28, 0.46, 0.66], [0, 0.6, 0])
  const scale = useTransform(p, [0, 0.55, 0.88, 1], [0.42 * fit, fit, fit, 0.9 * fit], { ease: smoothstep })
  const opacity = useTransform(p, [0, 0.1, 0.88, 1], [0.75, 1, 1, 0.4])

  return (
    <section
      ref={ref}
      className={`portal portal-${tone} ${className}`}
      data-stops={stops}
      data-tone={tone === 'teal' ? 'dark' : 'light'}
      data-nav={nav}
    >
      <div className="portal-sticky">
        <motion.div ref={content} className="portal-content" style={{ scale, opacity }}>
          {children}
        </motion.div>
        <motion.div className="portal-flash" style={{ opacity: flash }} />
        <motion.div className="portal-arch" style={{ scale: wall, opacity: archOp }}>
          <PortalWall id={id} tone={tone} />
        </motion.div>
        <motion.div className="portal-arch" style={{ scale: rim, opacity: archOp }}>
          <PortalRim />
        </motion.div>
      </div>
    </section>
  )
}
