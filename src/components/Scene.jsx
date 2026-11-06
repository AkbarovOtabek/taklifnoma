import { useMemo } from 'react'
import { GirihPattern } from './Ornaments.jsx'
import { Rose, Sprig } from './Flowers.jsx'

// Нарисованная сцена: вечерний портал-пештак, цветочная арка, ковровая дорожка
// с фонарями и пара со спины. Ширина 2400 — на телефоне видна центральная
// часть 1200×1600, на компьютере ещё и город по бокам. Поэтому всё главное
// держим в полосе x 600…1800, а по краям — только глубина и воздух.
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

function Lantern({ s = 1, delay = 0 }) {
  return (
    <g transform={`scale(${s})`}>
      <circle className="flicker" style={{ animationDelay: `${delay}s` }} r="74" cy="-48" fill="url(#lanternGlow)" />
      <path d="M-17 0H17L13-8H-13Z" fill="#6f4f24" />
      <path d="M-13-8V-66L0-84 13-66V-8Z" fill="url(#lanternGlass)" stroke="#9a7538" strokeWidth="2.5" />
      <path d="M0-66V-8M-13-38H13" stroke="#9a7538" strokeWidth="1.6" strokeOpacity=".8" />
      <path d="M-15-66H15" stroke="#9a7538" strokeWidth="3" />
      <path d="M0-84V-96" stroke="#9a7538" strokeWidth="2.4" />
      <circle cy="-98" r="4" fill="#e3c074" />
      {/* огонёк свечи */}
      <path className="flicker" style={{ animationDelay: `${delay}s` }} d="M0-44C6-38 5-28 0-24-5-28-6-38 0-44Z" fill="#fff6d9" />
    </g>
  )
}

// Подвесной светильник в глубине зала
function HangLamp({ x, top, y, s }) {
  return (
    <g>
      <path d={`M${x} ${top}V${y - 86 * s}`} stroke="#8a5a28" strokeWidth="2" />
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle r="54" fill="url(#lanternGlow)" />
        <path d="M-22-6 0-52 22-6 0 18Z" fill="#ffe3a8" fillOpacity=".9" stroke="#9a7538" strokeWidth="2.5" />
        <circle cy="-14" r="6" fill="#fff8e2" />
      </g>
    </g>
  )
}

function Dome({ x, y, w, h, tone = 'url(#domeBlue)', trim = '#d3ae66' }) {
  return (
    <g>
      <path
        d={`M${x - w / 2} ${y}C${x - w * 0.62} ${y - h * 0.58} ${x - w * 0.24} ${y - h * 0.82} ${x} ${y - h}C${x + w * 0.24} ${y - h * 0.82} ${x + w * 0.62} ${y - h * 0.58} ${x + w / 2} ${y}Z`}
        fill={tone}
      />
      {[-0.3, -0.12, 0.06, 0.24].map((k) => (
        <path key={k} d={`M${x + k * w} ${y}Q${x + k * w * 1.1} ${y - h * 0.55} ${x} ${y - h}`} fill="none" stroke="#0a2c3d" strokeOpacity=".32" strokeWidth="2" />
      ))}
      <rect x={x - w * 0.42} y={y} width={w * 0.84} height={h * 0.32} fill="#2d5960" />
      <path d={`M${x} ${y - h}V${y - h - 26}`} stroke={trim} strokeWidth="4" />
      <circle cx={x} cy={y - h - 30} r="5" fill="#ecca82" />
    </g>
  )
}

function Minaret({ x, base, top, w, trim = '#c7a25b' }) {
  const bands = []
  for (let y = top + 62; y < base - 20; y += 58) bands.push(y)
  const body = `M${x - w * 0.42} ${top + 40}L${x - w * 0.56} ${base}H${x + w * 0.56}L${x + w * 0.42} ${top + 40}Z`
  return (
    <g>
      <path d={body} fill="url(#minaretFill)" />
      <path d={body} fill="url(#tile)" />
      {bands.map((y) => (
        <rect key={y} x={x - w * 0.54} y={y} width={w * 1.08} height="5" fill={trim} fillOpacity=".55" />
      ))}
      <path d={`M${x - w * 0.62} ${top + 40}H${x + w * 0.62}L${x + w * 0.46} ${top + 12}H${x - w * 0.46}Z`} fill={trim} />
      <path d={`M${x - w * 0.36} ${top + 12}Q${x} ${top - 60} ${x + w * 0.36} ${top + 12}Z`} fill="url(#domeBlue)" />
      <circle cx={x} cy={top - 26} r="5" fill="#ecca82" />
    </g>
  )
}

// Сталактитовый карниз: ряды маленьких ниш, которыми в Самарканде заполняют
// переход от стены к своду. Даёт порталу объём даже на маленьком экране.
function Muqarnas({ x, y, w, rows = 3, cell = 52 }) {
  const cells = []
  for (let r = 0; r < rows; r++) {
    const n = Math.max(1, Math.floor(w / cell) - r * 2)
    const left = x + (w - n * cell) / 2
    for (let i = 0; i < n; i++) {
      const cx = left + cell * (i + 0.5)
      const cy = y - r * cell * 0.74
      cells.push(
        <path
          key={`${r}-${i}`}
          d={`M${cx - cell / 2} ${cy}V${cy - cell * 0.28}Q${cx} ${cy - cell * 1.08} ${cx + cell / 2} ${cy - cell * 0.28}V${cy}Z`}
          fill={r % 2 ? '#0e4557' : '#11566a'}
          stroke="#cba468"
          strokeWidth="1.6"
          strokeOpacity=".65"
        />,
      )
    }
  }
  return <g>{cells}</g>
}

// Гирлянда лампочек: провисающая нить с огоньками по дуге
function Garland({ x1, y1, x2, y2, sag, n }) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2 + sag
  const at = (t) => [
    (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2,
    (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2,
  ]
  return (
    <g>
      <path d={`M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke="#1b3b44" strokeWidth="3" strokeOpacity=".8" />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = at((i + 0.5) / n)
        return (
          <g key={i}>
            <path d={`M${x} ${y}V${y + 13}`} stroke="#1b3b44" strokeWidth="2" />
            <circle cx={x} cy={y + 30} r="30" fill="url(#bulbGlow)" />
            <circle cx={x} cy={y + 20} r="7" fill="#ffeec0" />
          </g>
        )
      })}
    </g>
  )
}

function Cypress({ x, base, h, w, fill = '#143c37' }) {
  return (
    <path
      d={`M${x} ${base - h}C${x + w * 0.5} ${base - h * 0.62} ${x + w * 0.62} ${base - h * 0.2} ${x + w * 0.2} ${base}H${x - w * 0.2}C${x - w * 0.62} ${base - h * 0.2} ${x - w * 0.5} ${base - h * 0.62} ${x} ${base - h}Z`}
      fill={fill}
    />
  )
}

// Город по обе стороны от портала; виден только на широких экранах
function Skyline({ side }) {
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

// Дальний город в дымке: тот же силуэт, но бледнее — за ним читается глубина
function FarCity() {
  return (
    <g opacity=".42">
      <Dome x={520} y={1230} w={190} h={170} tone="#36707f" trim="#7fa4a6" />
      <Dome x={1880} y={1230} w={230} h={200} tone="#36707f" trim="#7fa4a6" />
      <Minaret x={330} base={1240} top={930} w={38} trim="#7fa4a6" />
      <Minaret x={2080} base={1240} top={900} w={42} trim="#7fa4a6" />
      <rect x="640" y="1150" width="220" height="90" fill="#36707f" />
      <rect x="1560" y="1170" width="260" height="70" fill="#36707f" />
    </g>
  )
}

export default function Scene() {
  const { roses, sprigs, stars, carpet, bokeh } = useMemo(() => {
    const rnd = seeded(20270612)
    const roses = []
    const sprigs = []
    const push = (x, y, r) => roses.push({ x, y, r, tone: Math.floor(rnd() * 4), rot: rnd() * 360 })
    // плотная арка: три ряда и случайный разброс
    archPoints(322, 1312, 590, 76).forEach(([x, y], i) => {
      push(x + (rnd() - 0.5) * 30, y + (rnd() - 0.5) * 30, 13 + rnd() * 10)
      push(x + (rnd() - 0.5) * 58, y + (rnd() - 0.5) * 58, 8 + rnd() * 7)
      push(x + (rnd() - 0.5) * 76, y + (rnd() - 0.5) * 76, 5 + rnd() * 4)
      if (i % 2) {
        sprigs.push({
          x: x + (rnd() - 0.5) * 96,
          y: y + (rnd() - 0.5) * 96,
          r: 9 + rnd() * 9,
          rot: rnd() * 360,
        })
      }
    })
    // кусты у основания арки
    for (let i = 0; i < 60; i++) {
      const side = i % 2 ? 1 : -1
      push(CX + side * (250 + rnd() * 150), 1250 + rnd() * 80, 10 + rnd() * 13)
    }
    for (let i = 0; i < 26; i++) {
      const side = i % 2 ? 1 : -1
      sprigs.push({ x: CX + side * (240 + rnd() * 180), y: 1240 + rnd() * 90, r: 10 + rnd() * 10, rot: rnd() * 360 })
    }
    roses.sort((a, b) => a.r - b.r)

    const stars = Array.from({ length: 150 }, () => {
      const y = rnd() ** 1.6 * 760
      return { x: rnd() * 2400, y, r: 0.8 + rnd() * 2.2, o: 0.35 + rnd() * 0.65, d: rnd() * 5 }
    })
    const carpet = Array.from({ length: 90 }, () => {
      const t = rnd()
      const y = 1330 + t * 270
      const spread = 60 + t * 420
      return { x: CX + (rnd() - 0.5) * 2 * spread, y, r: 2 + t * 6, rot: rnd() * 180 }
    })
    const bokeh = Array.from({ length: 34 }, () => ({
      x: CX + (rnd() - 0.5) * 1700,
      y: 980 + rnd() * 560,
      r: 5 + rnd() * 16,
      o: 0.12 + rnd() * 0.3,
    }))
    return { roses, sprigs, stars, carpet, bokeh }
  }, [])

  const lanterns = [
    [1330, 0.42], [1385, 0.72], [1475, 1.25], [1590, 2],
  ]

  return (
    <svg className="scene" viewBox="0 0 2400 1600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04121c" />
          <stop offset=".18" stopColor="#0a2a3d" />
          <stop offset=".38" stopColor="#15505f" />
          <stop offset=".54" stopColor="#3e7b7c" />
          <stop offset=".66" stopColor="#c08a5c" />
          <stop offset=".75" stopColor="#efb87a" />
          <stop offset=".84" stopColor="#fbdfb2" />
        </linearGradient>
        <radialGradient id="sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff2cf" stopOpacity=".95" />
          <stop offset=".4" stopColor="#ffd99a" stopOpacity=".45" />
          <stop offset="1" stopColor="#ffd99a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonHalo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff6dc" stopOpacity=".55" />
          <stop offset=".35" stopColor="#ffeec4" stopOpacity=".16" />
          <stop offset="1" stopColor="#ffeec4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vignette" cx=".5" cy=".62" r=".78">
          <stop offset=".55" stopColor="#031219" stopOpacity="0" />
          <stop offset="1" stopColor="#031219" stopOpacity=".5" />
        </radialGradient>
        <radialGradient id="bulbGlow">
          <stop offset="0" stopColor="#ffe9b4" stopOpacity=".7" />
          <stop offset="1" stopColor="#ffe9b4" stopOpacity="0" />
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
          <stop offset="0" stopColor="#15607a" />
          <stop offset=".55" stopColor="#104a5e" />
          <stop offset="1" stopColor="#0a3140" />
        </linearGradient>
        <linearGradient id="lanternGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0c6" />
          <stop offset="1" stopColor="#f3c472" />
        </linearGradient>
        <radialGradient id="doorLight" cx=".5" cy=".72" r=".75">
          <stop offset="0" stopColor="#fffaec" />
          <stop offset=".3" stopColor="#ffdf9f" />
          <stop offset=".66" stopColor="#cd833c" />
          <stop offset="1" stopColor="#6b401d" />
        </radialGradient>
        <linearGradient id="aisle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0cf" />
          <stop offset=".5" stopColor="#e9d6b6" />
          <stop offset="1" stopColor="#a58d73" />
        </linearGradient>
        <linearGradient id="runner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c6273" />
          <stop offset="1" stopColor="#0d3c49" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b5a50" />
          <stop offset="1" stopColor="#0f2a2c" />
        </linearGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6cf9c" stopOpacity="0" />
          <stop offset="1" stopColor="#f6cf9c" stopOpacity=".5" />
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
        <GirihPattern id="tileRunner" color="#f0d79e" opacity={0.5} size={58} width={1.2} />
      </defs>

      <rect width="2400" height="1600" fill="url(#sky)" />
      {stars.map((s, i) => (
        <circle key={i} className="twinkle" style={{ animationDelay: `${s.d}s` }} cx={s.x} cy={s.y} r={s.r} fill="#fff4d4" opacity={s.o} />
      ))}

      {/* луна над садом */}
      <circle cx="960" cy="258" r="250" fill="url(#moonHalo)" />
      <circle cx="960" cy="258" r="62" fill="#fff8e4" />
      <circle cx="980" cy="246" r="9" fill="#efe0c0" fillOpacity=".55" />
      <circle cx="944" cy="284" r="13" fill="#efe0c0" fillOpacity=".45" />
      <circle cx="972" cy="292" r="6" fill="#efe0c0" fillOpacity=".5" />

      <circle cx={CX} cy="900" r="760" fill="url(#sun)" />

      <g className="clouds-a" filter="url(#soft)" fill="#fff0da" opacity=".15">
        <ellipse cx="500" cy="500" rx="420" ry="44" />
        <ellipse cx="1040" cy="430" rx="360" ry="34" />
        <ellipse cx="1900" cy="540" rx="520" ry="52" />
      </g>
      <g className="clouds-b" filter="url(#soft)" fill="#ffd9b0" opacity=".42">
        <ellipse cx="240" cy="700" rx="520" ry="46" />
        <ellipse cx="1340" cy="640" rx="430" ry="36" />
        <ellipse cx="2240" cy="760" rx="440" ry="42" />
      </g>

      <FarCity />
      <rect y="1020" width="2400" height="280" fill="url(#haze)" />

      <Skyline side={-1} />
      <Skyline side={1} />

      {/* земля */}
      <rect y="1280" width="2400" height="320" fill="url(#ground)" />
      {[300, 2100, 420, 1980].map((x, i) => (
        <Cypress key={`f${x}`} x={x} base={1300} h={[300, 260, 230, 270][i]} w={56} fill="#1d4a46" />
      ))}
      {[640, 700, 1700, 1760, 560, 1840].map((x, i) => (
        <Cypress key={x} x={x} base={1330} h={[420, 330, 330, 420, 280, 280][i]} w={70} />
      ))}

      {/* гирлянды над боковыми садами */}
      <Garland x1={-40} y1={700} x2={796} y2={560} sag={150} n={9} />
      <Garland x1={2440} y1={700} x2={1604} y2={560} sag={150} n={9} />

      {/* минареты портала */}
      <Minaret x={796} base={1310} top={330} w={92} />
      <Minaret x={1604} base={1310} top={330} w={92} />

      {/* пештак */}
      <rect x="842" y="470" width="716" height="840" fill="url(#facade)" />
      <rect x="842" y="470" width="716" height="840" fill="url(#tile)" />
      <rect x="842" y="470" width="716" height="46" fill="#c7a25b" />
      <rect x="852" y="480" width="696" height="26" fill="#0f4351" />
      <rect x="852" y="480" width="696" height="26" fill="url(#tileSmall)" />
      {/* рамка айвана */}
      <rect x="884" y="540" width="632" height="770" fill="none" stroke="#c7a25b" strokeWidth="5" strokeOpacity=".7" />
      <path d="M906 1310V870C906 750 1060 640 1200 560 1340 640 1494 750 1494 870V1310Z" fill="#0b3440" />
      <path d="M906 1310V870C906 750 1060 640 1200 560 1340 640 1494 750 1494 870V1310" fill="none" stroke="#d3ae66" strokeWidth="6" />
      <path d="M948 1310V885C948 780 1080 680 1200 606 1320 680 1452 780 1452 885V1310Z" fill="#0f4351" />
      <path d="M948 1310V885C948 780 1080 680 1200 606 1320 680 1452 780 1452 885V1310Z" fill="url(#tileSmall)" />
      {/* мукарны в глубине свода */}
      <Muqarnas x={1000} y={900} w={400} rows={3} cell={56} />

      {/* светящийся проём */}
      <path d="M1030 1310V960C1030 880 1120 800 1200 748 1280 800 1370 880 1370 960V1310Z" fill="url(#doorLight)" />
      <path className="glow-breathe" d="M1030 1310V960C1030 880 1120 800 1200 748 1280 800 1370 880 1370 960V1310Z" fill="#fff4d0" filter="url(#softS)" />
      <path d="M1030 1310V960C1030 880 1120 800 1200 748 1280 800 1370 880 1370 960V1310" fill="none" stroke="#e8c98a" strokeWidth="4" />
      {/* глубина зала: вложенные арки и подвесные светильники */}
      <g fill="none" stroke="#7f4f22" strokeOpacity=".5" strokeWidth="3">
        <path d="M1080 1310V985C1080 925 1145 860 1200 822 1255 860 1320 925 1320 985V1310" />
        <path d="M1126 1310V1020C1126 975 1165 925 1200 900 1235 925 1274 975 1274 1020V1310" />
      </g>
      <HangLamp x={1200} top={790} y={944} s={1} />
      <HangLamp x={1124} top={830} y={930} s={0.7} />
      <HangLamp x={1276} top={830} y={930} s={0.7} />

      {/* лучи из проёма */}
      <g className="rays" fill="url(#rays)">
        <path d="M1120 1000 760 1600H1020L1180 1000Z" />
        <path d="M1220 1000 1380 1600H1640L1280 1000Z" />
      </g>

      {/* аллея и ковровая дорожка */}
      <path d="M1040 1310H1360L1980 1600H420Z" fill="url(#aisle)" />
      <path d="M1040 1310 420 1600M1360 1310 1980 1600" stroke="#fff3d0" strokeOpacity=".65" strokeWidth="3" />
      <path d="M1094 1310H1306L1660 1600H740Z" fill="url(#runner)" />
      <path d="M1094 1310H1306L1660 1600H740Z" fill="url(#tileRunner)" />
      <path d="M1094 1310 740 1600M1306 1310 1660 1600" stroke="#e3c489" strokeWidth="5" strokeOpacity=".85" />
      {carpet.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx={p.r} ry={p.r * 0.5} transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill={i % 3 ? '#fff6ea' : '#efcdb7'} fillOpacity=".9" />
      ))}

      {/* цветы */}
      {sprigs.map((s, i) => <Sprig key={`s${i}`} {...s} />)}
      {roses.map((r, i) => <Rose key={i} {...r} />)}

      {/* фонари */}
      {lanterns.map(([x, s], i) => {
        const dx = x - CX
        const y = 1320 + (s - 0.42) * 170
        return (
          <g key={x}>
            <g transform={`translate(${CX + dx} ${y})`}><Lantern s={s} delay={i * 0.7} /></g>
            <g transform={`translate(${CX - dx} ${y})`}><Lantern s={s} delay={i * 0.7 + 0.4} /></g>
          </g>
        )
      })}

      {/* тёплые огоньки в воздухе */}
      {bokeh.map((b, i) => (
        <circle key={`b${i}`} cx={b.x} cy={b.y} r={b.r} fill="#ffe7b6" opacity={b.o} filter="url(#softS)" />
      ))}

      {/* туман */}
      <g className="mist" filter="url(#soft)" fill="#fff5de" opacity=".5">
        <ellipse cx="900" cy="1370" rx="420" ry="28" />
        <ellipse cx="1560" cy="1400" rx="460" ry="30" />
      </g>

      {/* виньетка: углы уходят в темноту, и взгляд сам идёт к проёму */}
      <rect width="2400" height="1600" fill="url(#vignette)" />
    </svg>
  )
}
