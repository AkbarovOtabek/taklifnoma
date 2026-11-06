// Розы и зелень. Одни и те же цветы растут и на арке в сцене, и на створках
// конверта, поэтому они живут отдельным файлом. Лист нарисован прямо в розе,
// без общего <defs>, — так цветок можно поставить в любую svg на странице.
const LEAF = 'M0 0C.5-.3.55-.9 0-1.35-.55-.9-.5-.3 0 0Z'

const PALETTE = [
  ['#fffaf2', '#e8d6bf'],
  ['#fbe4da', '#dfb3a1'],
  ['#fdf2dc', '#e2c48d'],
  ['#f9dfe2', '#ddafb3'],
]

export function Rose({ x = 0, y = 0, r = 1, tone = 0, rot = 0 }) {
  const colors = PALETTE[tone % PALETTE.length]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`}>
      {[[35, -1.05], [205, -1.05], [120, -1]].map(([a, dy]) => (
        <g key={a} transform={`rotate(${a}) translate(0 ${dy})`}>
          <path d={LEAF} fill="#40654e" />
        </g>
      ))}
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

// Веточка зелени: между розами видна листва, и букет перестаёт быть «ватным»
export function Sprig({ x = 0, y = 0, r = 1, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`} fill="#3c6a53">
      <path d="M0 0C.2-1.4.2-2.8 0-4" stroke="#3c6a53" strokeWidth=".12" fill="none" />
      {[-0.7, -1.5, -2.3, -3].map((cy, i) => (
        <g key={cy}>
          <ellipse cx=".42" cy={cy} rx=".42" ry=".22" transform={`rotate(${-28 + i * 4} .42 ${cy})`} fillOpacity={0.9 - i * 0.08} />
          <ellipse cx="-.42" cy={cy - 0.3} rx=".42" ry=".22" transform={`rotate(${28 - i * 4} -.42 ${cy - 0.3})`} fillOpacity={0.82 - i * 0.08} />
        </g>
      ))}
    </g>
  )
}

// Отдельный цветок как самостоятельная картинка — для вёрстки вне сцены
export function Bloom({ tone = 0, rot = 0, green = false }) {
  return (
    <svg viewBox="-1.5 -1.5 3 3" aria-hidden="true">
      {green ? <Sprig y={1.4} r={0.7} rot={rot} /> : <Rose tone={tone} rot={rot} />}
    </svg>
  )
}
