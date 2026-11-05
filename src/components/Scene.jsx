import { useMemo } from 'react'
import { GirihPattern } from './Ornaments.jsx'

// Нарисованная сцена: вечерний портал-пештак, цветочная арка, аллея с фонарями, пара со спины.
// Ширина 2400 — на телефоне видна центральная часть, на компьютере ещё и город по бокам.
const CX = 1200

function seeded(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// Точки вдоль стрельчатой арки
function archPoints(halfWidth, base, top, n) {
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const side = t < 0.5 ? -1 : 1
    const u = t < 0.5 ? t * 2 : (1 - t) * 2
    const y = base + (top - base) * u
    const x = CX + side * halfWidth * Math.pow(1 - Math.pow(u, 3.2), 0.62)
    pts.push([x, y])
  }
  return pts
}

function Rose({ x, y, r, tone, rot }) {
  const colors = [
    ['#fff9ef', '#ecd9c0'],
    ['#fbe7dc', '#e2b9a6'],
    ['#fdf3df', '#e4c790'],
  ][tone]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      <use href="#leaf" transform="rotate(35) translate(0 -1.05)" />
      <use href="#leaf" transform="rotate(205) translate(0 -1.05)" />
      <use href="#leaf" transform="rotate(120) translate(0 -1)" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-.56" rx=".6" ry=".56" transform={`rotate(${a})`} fill={colors[0]} stroke={colors[1]} strokeWidth=".05" />
      ))}
      {[36, 126, 216, 306].map((a) => (
        <ellipse key={a} cx="0" cy="-.3" rx=".38" ry=".36" transform={`rotate(${a})`} fill={colors[0]} stroke={colors[1]} strokeWidth=".05" />
      ))}
      <circle r=".22" fill={colors[1]} fillOpacity=".75" />
    </g>
  )
}

function Lantern({ x, y, s, delay }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle className="flicker" style={{ animationDelay: `${delay}s` }} r="66" cy="-46" fill="url(#lanternGlow)" />
      <path d="M-16 0H16L13-8H-13Z" fill="#7c5b2b" />
      <path d="M-13-8V-68L0-86 13-68V-8Z" fill="#ffdf9e" fillOpacity=".92" stroke="#8e6b35" strokeWidth="2.5" />
      <path d="M0-68V-8M-13-40H13" stroke="#8e6b35" strokeWidth="1.8" />
      <circle className="flicker" style={{ animationDelay: `${delay}s` }} cy="-34" r="7" fill="#fff6d9" />
    </g>
  )
}

function Dome({ x, y, w, h, tone = 'url(#domeBlue)' }) {
  return (
    <g>
      <path
        d={`M${x - w / 2} ${y}C${x - w * 0.62} ${y - h * 0.58} ${x - w * 0.24} ${y - h * 0.82} ${x} ${y - h}C${x + w * 0.24} ${y - h * 0.82} ${x + w * 0.62} ${y - h * 0.58} ${x + w / 2} ${y}Z`}
        fill={tone}
      />
      {[-0.3, -0.12, 0.06, 0.24].map((k) => (
        <path key={k} d={`M${x + k * w} ${y}Q${x + k * w * 1.1} ${y - h * 0.55} ${x} ${y - h}`} fill="none" stroke="#0a2c3d" strokeOpacity=".35" strokeWidth="2" />
      ))}
      <rect x={x - w * 0.42} y={y} width={w * 0.84} height={h * 0.32} fill="#2d5960" />
      <path d={`M${x} ${y - h}V${y - h - 26}`} stroke="#d3ae66" strokeWidth="4" />
      <circle cx={x} cy={y - h - 30} r="5" fill="#ecca82" />
    </g>
  )
}

function Minaret({ x, base, top, w }) {
  const bands = []
  for (let y = top + 62; y < base - 20; y += 58) bands.push(y)
  return (
    <g>
      <path d={`M${x - w * 0.42} ${top + 40}L${x - w * 0.56} ${base}H${x + w * 0.56}L${x + w * 0.42} ${top + 40}Z`} fill="url(#minaretFill)" />
      <path d={`M${x - w * 0.42} ${top + 40}L${x - w * 0.56} ${base}H${x + w * 0.56}L${x + w * 0.42} ${top + 40}Z`} fill="url(#tile)" />
      {bands.map((y) => (
        <rect key={y} x={x - w * 0.54} y={y} width={w * 1.08} height="5" fill="#d3ae66" fillOpacity=".55" />
      ))}
      <path d={`M${x - w * 0.62} ${top + 40}H${x + w * 0.62}L${x + w * 0.46} ${top + 12}H${x - w * 0.46}Z`} fill="#c7a25b" />
      <path d={`M${x - w * 0.36} ${top + 12}Q${x} ${top - 60} ${x + w * 0.36} ${top + 12}Z`} fill="url(#domeBlue)" />
      <circle cx={x} cy={top - 26} r="5" fill="#ecca82" />
    </g>
  )
}

function Skyline({ side }) {
  // Город зеркально по обе стороны от портала; виден только на широких экранах
  const m = (x) => (side < 0 ? x : 2400 - x)
  return (
    <g>
      <rect x={Math.min(m(40), m(700))} y="900" width="660" height="400" fill="#23505a" />
      <Dome x={m(240)} y={900} w={250} h={230} />
      <Minaret x={m(30)} base={1300} top={590} w={64} />
      <Minaret x={m(470)} base={1300} top={720} w={48} />
      <Dome x={m(620)} y={980} w={170} h={160} />
      {[100, 190, 280, 370, 540, 630].map((x) => (
        <path
          key={x}
          d={`M${m(x) - 32} 1300V1100Q${m(x)} 1020 ${m(x) + 32} 1100V1300Z`}
          fill="#123a44"
          stroke="#c9a35c"
          strokeOpacity=".4"
          strokeWidth="2"
        />
      ))}
    </g>
  )
}

function Cypress({ x, base, h, w }) {
  return (
    <path
      d={`M${x} ${base - h}C${x + w * 0.5} ${base - h * 0.62} ${x + w * 0.62} ${base - h * 0.2} ${x + w * 0.2} ${base}H${x - w * 0.2}C${x - w * 0.62} ${base - h * 0.2} ${x - w * 0.5} ${base - h * 0.62} ${x} ${base - h}Z`}
      fill="#143c37"
    />
  )
}

export default function Scene() {
  const { roses, stars, carpet } = useMemo(() => {
    const rnd = seeded(20270612)
    const roses = []
    const push = (x, y, r) => roses.push({
      x, y, r, tone: Math.floor(rnd() * 3), rot: rnd() * 360,
    })
    // плотная арка: два ряда и случайный разброс
    archPoints(322, 1312, 590, 76).forEach(([x, y]) => {
      push(x + (rnd() - 0.5) * 30, y + (rnd() - 0.5) * 30, 13 + rnd() * 10)
      push(x + (rnd() - 0.5) * 58, y + (rnd() - 0.5) * 58, 8 + rnd() * 7)
      push(x + (rnd() - 0.5) * 76, y + (rnd() - 0.5) * 76, 5 + rnd() * 4)
    })
    // кусты у основания арки
    for (let i = 0; i < 60; i++) {
      const side = i % 2 ? 1 : -1
      push(CX + side * (250 + rnd() * 150), 1250 + rnd() * 80, 10 + rnd() * 13)
    }
    roses.sort((a, b) => a.r - b.r)

    const stars = Array.from({ length: 90 }, () => ({
      x: rnd() * 2400, y: rnd() * 560, r: 0.8 + rnd() * 1.9, d: rnd() * 5,
    }))
    const carpet = Array.from({ length: 70 }, () => {
      const t = rnd()
      const y = 1330 + t * 270
      const spread = 60 + t * 420
      return { x: CX + (rnd() - 0.5) * 2 * spread, y, r: 2 + t * 6, rot: rnd() * 180 }
    })
    return { roses, stars, carpet }
  }, [])

  const lanterns = [
    [1330, 0.42], [1385, 0.72], [1475, 1.25], [1590, 2],
  ]

  return (
    <svg className="scene" viewBox="0 0 2400 1600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a2b38" />
          <stop offset=".3" stopColor="#1d5361" />
          <stop offset=".55" stopColor="#8f9a8d" />
          <stop offset=".72" stopColor="#efc593" />
          <stop offset=".85" stopColor="#f7dfb5" />
        </linearGradient>
        <radialGradient id="sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff2cf" stopOpacity=".95" />
          <stop offset=".4" stopColor="#ffd99a" stopOpacity=".45" />
          <stop offset="1" stopColor="#ffd99a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="domeBlue" x1="0" y1="0" x2="1" y2=".4">
          <stop offset="0" stopColor="#5ec2c4" />
          <stop offset=".55" stopColor="#1d7f8c" />
          <stop offset="1" stopColor="#0f4c5c" />
        </linearGradient>
        <linearGradient id="minaretFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9b184" />
          <stop offset=".5" stopColor="#e6cfa0" />
          <stop offset="1" stopColor="#a48a5f" />
        </linearGradient>
        <linearGradient id="facade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14566a" />
          <stop offset="1" stopColor="#0e3d4c" />
        </linearGradient>
        <radialGradient id="doorLight" cx=".5" cy=".72" r=".75">
          <stop offset="0" stopColor="#fff7e0" />
          <stop offset=".34" stopColor="#ffd894" />
          <stop offset=".7" stopColor="#c77f3a" />
          <stop offset="1" stopColor="#6e431f" />
        </radialGradient>
        <linearGradient id="aisle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffeecb" />
          <stop offset=".5" stopColor="#e7d3b3" />
          <stop offset="1" stopColor="#a48c72" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b5a50" />
          <stop offset="1" stopColor="#0f2a2c" />
        </linearGradient>
        <radialGradient id="lanternGlow">
          <stop offset="0" stopColor="#ffd98f" stopOpacity=".75" />
          <stop offset="1" stopColor="#ffd98f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset=".6" stopColor="#f6e9d5" />
          <stop offset="1" stopColor="#d9c1a0" />
        </linearGradient>
        <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity=".2" />
        </linearGradient>
        <linearGradient id="suit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b2a33" />
          <stop offset="1" stopColor="#0b151b" />
        </linearGradient>
        <linearGradient id="rays" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0c8" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff0c8" stopOpacity="0" />
        </linearGradient>
        <filter id="soft" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="26" /></filter>
        <filter id="softS" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
        <GirihPattern id="tile" color="#e0c07a" opacity={0.55} size={70} width={1.4} />
        <GirihPattern id="tileSmall" color="#f3dca6" opacity={0.45} size={42} width={1} />
        <g id="leaf">
          <path d="M0 0C.5-.3.55-.9 0-1.35-.55-.9-.5-.3 0 0Z" fill="#40654e" />
        </g>
      </defs>

      <rect width="2400" height="1600" fill="url(#sky)" />
      {stars.map((s, i) => (
        <circle key={i} className="twinkle" style={{ animationDelay: `${s.d}s` }} cx={s.x} cy={s.y} r={s.r} fill="#fff4d4" />
      ))}
      <circle cx={CX} cy="900" r="760" fill="url(#sun)" />

      <g className="clouds-a" filter="url(#soft)" fill="#fff0da" opacity=".22">
        <ellipse cx="500" cy="500" rx="420" ry="44" />
        <ellipse cx="1040" cy="430" rx="360" ry="34" />
        <ellipse cx="1900" cy="540" rx="520" ry="52" />
      </g>
      <g className="clouds-b" filter="url(#soft)" fill="#ffd9b0" opacity=".42">
        <ellipse cx="240" cy="700" rx="520" ry="46" />
        <ellipse cx="1340" cy="640" rx="430" ry="36" />
        <ellipse cx="2240" cy="760" rx="440" ry="42" />
      </g>

      <Skyline side={-1} />
      <Skyline side={1} />

      {/* земля */}
      <rect y="1280" width="2400" height="320" fill="url(#ground)" />
      {[640, 700, 1700, 1760, 560, 1840].map((x, i) => (
        <Cypress key={x} x={x} base={1330} h={[420, 330, 330, 420, 280, 280][i]} w={70} />
      ))}

      {/* минареты портала */}
      <Minaret x={796} base={1310} top={330} w={92} />
      <Minaret x={1604} base={1310} top={330} w={92} />

      {/* пештак */}
      <rect x="842" y="470" width="716" height="840" fill="url(#facade)" />
      <rect x="842" y="470" width="716" height="840" fill="url(#tile)" />
      <rect x="842" y="470" width="716" height="46" fill="#c7a25b" />
      <rect x="852" y="480" width="696" height="26" fill="#0f4351" />
      <rect x="852" y="480" width="696" height="26" fill="url(#tileSmall)" />
      <path d="M906 1310V870C906 750 1060 640 1200 560 1340 640 1494 750 1494 870V1310Z" fill="#0b3440" />
      <path d="M906 1310V870C906 750 1060 640 1200 560 1340 640 1494 750 1494 870V1310" fill="none" stroke="#d3ae66" strokeWidth="6" />
      <path d="M948 1310V885C948 780 1080 680 1200 606 1320 680 1452 780 1452 885V1310Z" fill="#0f4351" />
      <path d="M948 1310V885C948 780 1080 680 1200 606 1320 680 1452 780 1452 885V1310Z" fill="url(#tileSmall)" />

      {/* светящийся проём */}
      <path d="M1030 1310V960C1030 880 1120 800 1200 748 1280 800 1370 880 1370 960V1310Z" fill="url(#doorLight)" />
      <path className="glow-breathe" d="M1030 1310V960C1030 880 1120 800 1200 748 1280 800 1370 880 1370 960V1310Z" fill="#fff4d0" filter="url(#softS)" />
      <path d="M1030 1310V960C1030 880 1120 800 1200 748 1280 800 1370 880 1370 960V1310" fill="none" stroke="#e8c98a" strokeWidth="4" />
      {/* глубина зала: вложенные арки и подвесные светильники */}
      <g fill="none" stroke="#7f4f22" strokeOpacity=".5" strokeWidth="3">
        <path d="M1080 1310V985C1080 925 1145 860 1200 822 1255 860 1320 925 1320 985V1310" />
        <path d="M1126 1310V1020C1126 975 1165 925 1200 900 1235 925 1274 975 1274 1020V1310" />
      </g>
      {[[1200, 930, 1], [1128, 905, 0.72], [1272, 905, 0.72]].map(([x, y, s], i) => (
        <g key={x}>
          <path d={`M${x} 760V${y}`} stroke="#7f4f22" strokeWidth="2" />
          <g transform={`translate(${x} ${y + 62 * s}) scale(${s})`}>
            <Lantern x={0} y={0} s={0.8} delay={i * 0.5} />
          </g>
        </g>
      ))}

      {/* лучи из проёма */}
      <g className="rays" fill="url(#rays)">
        <path d="M1120 1000 760 1600H1020L1180 1000Z" />
        <path d="M1220 1000 1380 1600H1640L1280 1000Z" />
      </g>

      {/* аллея */}
      <path d="M1040 1310H1360L1980 1600H420Z" fill="url(#aisle)" />
      <path d="M1040 1310 420 1600M1360 1310 1980 1600" stroke="#fff3d0" strokeOpacity=".65" strokeWidth="3" />
      <path d="M1100 1310 880 1600M1300 1310 1520 1600" stroke="#b5966e" strokeOpacity=".3" strokeWidth="2" />
      {carpet.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx={p.r} ry={p.r * 0.5} transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill={i % 3 ? '#fff6ea' : '#efcdb7'} fillOpacity=".9" />
      ))}

      {/* цветы */}
      {roses.map((r, i) => <Rose key={i} {...r} />)}

      {/* фонари */}
      {lanterns.map(([x, s], i) => {
        const dx = x - CX
        const y = 1320 + (s - 0.42) * 170
        return (
          <g key={x}>
            <Lantern x={CX + dx} y={y} s={s} delay={i * 0.7} />
            <Lantern x={CX - dx} y={y} s={s} delay={i * 0.7 + 0.4} />
          </g>
        )
      })}

      {/* туман */}
      <g className="mist" filter="url(#soft)" fill="#fff5de" opacity=".5">
        <ellipse cx="900" cy="1370" rx="420" ry="28" />
        <ellipse cx="1560" cy="1400" rx="460" ry="30" />
      </g>

      {/* пара со спины */}
      <g transform="translate(1210 1500) scale(.98)">
        <ellipse cx="-6" cy="4" rx="210" ry="18" fill="#3c2a1c" fillOpacity=".26" filter="url(#softS)" />

        {/* жених */}
        <g transform="translate(66 0)">
          <path d="M-29-224C-40-210-46-170-44-120-44-90-38-40-34 0H34C38-40 44-90 44-120 46-170 40-210 29-224 12-232-12-232-29-224Z" fill="url(#suit)" />
          <path d="M0-218V-104" stroke="#000" strokeOpacity=".45" strokeWidth="2" />
          <path d="M-2-120V0" stroke="#000" strokeOpacity=".35" strokeWidth="2" />
          <rect x="-11" y="-246" width="22" height="22" rx="5" fill="#b98a68" />
          <path d="M-28-262C-28-286-14-296 0-296 14-296 28-286 28-262 28-252 24-243 18-238H-18C-24-243-28-252-28-262Z" fill="#14100e" />
        </g>

        {/* невеста */}
        <g transform="translate(-30 0)">
          <path className="train" d="M-20-138C-46-110-104-76-170-34-200-14-214-2-214 6H118C110-40 76-96 26-138Z" fill="url(#gown)" />
          <path d="M-24-210C-30-180-30-160-22-136H24C30-160 30-180 22-210 8-218-10-218-24-210Z" fill="#fbf2e2" />
          <g fill="none" stroke="#d6bb8e" strokeOpacity=".65" strokeWidth="1.4">
            <path d="M-20-132C-60-90-116-52-178-8" />
            <path d="M-6-132C-30-90-60-46-92 2" />
            <path d="M10-132C8-90 4-40 -2 4" />
            <path d="M22-132C40-90 66-40 84 2" />
          </g>
          <rect x="-8" y="-228" width="16" height="20" rx="4" fill="#caa184" />
          <path d="M-20-252C-20-274-8-282 0-282 8-282 20-274 20-252 20-240 14-230 0-228-14-230-20-240-20-252Z" fill="#231713" />
          <circle cy="-240" r="11" fill="#2e1e18" />
          <path d="M-13-268Q0-284 13-268" fill="none" stroke="#f0d596" strokeWidth="3" />
          {/* фата */}
          <path className="veil" d="M-11-234C-40-190-62-110-122-40-150-6-172 6-180 8H70C66-30 44-120 11-234Z" fill="url(#veil)" />
        </g>
      </g>
    </svg>
  )
}
