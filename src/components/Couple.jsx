import { memo } from 'react'

// Жених и невеста перед аркой. Рисунок плоский, как на свадебной графике:
// тёмно-синие силуэты, кремовое платье с длинным шлейфом, золотые детали
// и ленты у ног. Отдельным слоем поверх запечённой сцены — чтобы фигуры жили:
// пара едва заметно покачивается, шлейф и ленты идут своим ритмом.
//
// Система координат та же, что у сцены: 2400×1600, слой ложится ровно поверх.
const NAVY = '#16304d'
const NAVY_DEEP = '#0e2138'
const GOLD = '#c9a35c'
const CREAM = '#fdf6e7'

function Couple() {
  return (
    <svg className="fx-couple" viewBox="0 0 2400 1600" aria-hidden="true">
      <defs>
        <linearGradient id="cpl-gown" x1=".2" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#fffdf8" />
          <stop offset=".5" stopColor="#f8efdd" />
          <stop offset="1" stopColor="#e8d6b8" />
        </linearGradient>
        <linearGradient id="cpl-suit" x1="0" y1="0" x2="1" y2=".3">
          <stop offset="0" stopColor="#1d3a5c" />
          <stop offset=".6" stopColor="#16304d" />
          <stop offset="1" stopColor="#0e2138" />
        </linearGradient>
        <radialGradient id="cpl-shadow">
          <stop offset="0" stopColor="#3b2a1b" stopOpacity=".38" />
          <stop offset="1" stopColor="#3b2a1b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(1200 1480) scale(1.02)">
        <ellipse cx="10" cy="10" rx="235" ry="20" fill="url(#cpl-shadow)" />

        {/* ленты у ног: золотая и синяя, как росчерк пера */}
        <g className="couple-ribbon" fill="none" strokeLinecap="round">
          <path d="M-250 2C-170-18-96 16-16 4 64-8 140 20 248-2" stroke={NAVY} strokeWidth="7" strokeOpacity=".85" />
          <path d="M-238 13C-150 0-70 28 10 15 92 2 168 26 240 11" stroke={GOLD} strokeWidth="4" strokeOpacity=".9" />
          <path d="M-250 2C-268-6-268-20-252-22-240-24-234-14-240-8" stroke={NAVY} strokeWidth="5" strokeOpacity=".7" />
          <path d="M248-2C266-10 266-24 250-26 238-28 232-18 238-12" stroke={GOLD} strokeWidth="4" strokeOpacity=".8" />
        </g>

        {/* веточки по сторонам */}
        {[-1, 1].map((side) => (
          <g key={side} className="couple-sprig" transform={`translate(${side * 212} -34) scale(${side} 1)`} fill="none">
            <path d="M0 0C14-22 20-52 16-78" stroke={GOLD} strokeWidth="2.4" strokeOpacity=".85" />
            {[0, 1, 2, 3, 4].map((i) => {
              const y = -10 - i * 15
              const x = 4 + i * 2.6
              return (
                <g key={i}>
                  <ellipse cx={x + 9} cy={y} rx="9" ry="4.2" transform={`rotate(-28 ${x + 9} ${y})`} fill={i % 2 ? GOLD : '#2e6b7a'} fillOpacity=".8" />
                  <ellipse cx={x - 7} cy={y - 5} rx="8" ry="3.8" transform={`rotate(26 ${x - 7} ${y - 5})`} fill={i % 2 ? '#2e6b7a' : GOLD} fillOpacity=".7" />
                </g>
              )
            })}
            <circle cx="22" cy="-86" r="3" fill={GOLD} fillOpacity=".9" />
          </g>
        ))}

        <g className="couple">
          {/* ───── невеста ───── */}
          <g transform="translate(56 0)">
            {/* платье: юбка уходит вправо длинным шлейфом */}
            <path
              className="couple-train"
              d="M-15-176C-29-138-39-84-41-12-41-2-39 3-33 5 22 8 112 4 182 0 152-14 94-40 58-84 35-112 19-146 13-176Z"
              fill="url(#cpl-gown)"
            />
            <g className="couple-train" fill="none" stroke={GOLD} strokeOpacity=".5" strokeWidth="1.6">
              <path d="M-12-168C-24-128-33-72-34 0" />
              <path d="M0-168C-2-120-6-62-12 2" />
              <path d="M10-166C22-120 48-66 96-22" />
              <path d="M-33 5C20 8 110 4 180 0" strokeOpacity=".75" />
            </g>

            {/* корсет с мысом и вырезом */}
            <path d="M-15-238C-19-218-19-196-15-176H13C16-196 16-218 12-238 4-246-7-246-15-238Z" fill={CREAM} />
            <path d="M-13-240C-8-230-4-224 0-222 4-224 8-230 12-240 4-246-6-246-13-240Z" fill={NAVY} />
            <path d="M-15-186C-6-181 5-181 13-186" stroke={GOLD} strokeOpacity=".7" strokeWidth="1.6" fill="none" />

            {/* шея, лицо в профиль, высокая причёска с цветами */}
            <path d="M-5-250H5V-234C2-230-2-230-5-234Z" fill={NAVY} />
            <path d="M-11-271C-11-285-5-293 2-293 9-293 14-286 14-276 14-269 12-264 8-260 3-256-5-257-9-261-11-264-11-268-11-271Z" fill={NAVY} />
            <path d="M-12-275C-17-277-18-271-14-269Z" fill={NAVY} />
            <path d="M2-299C14-301 22-293 22-283 22-274 17-268 12-266 16-274 15-284 8-288 2-291-6-290-11-285-9-294-5-298 2-299Z" fill={NAVY_DEEP} />
            <ellipse cx="18" cy="-276" rx="11" ry="9" fill={NAVY_DEEP} />
            <circle cx="22" cy="-286" r="4.5" fill={CREAM} />
            <circle cx="27" cy="-277" r="3.6" fill="#f7e7cf" />
            <circle cx="19" cy="-266" r="3" fill={CREAM} />

            {/* рука к жениху */}
            <path d="M-14-230C-26-208-34-184-40-164" stroke={NAVY} strokeWidth="9" strokeLinecap="round" fill="none" />

            {/* букет у талии */}
            <g transform="translate(-30 -170)">
              {[[0, 0, 9], [-13, -5, 7], [12, -4, 7.5], [-5, -14, 6.5], [7, 9, 6]].map(([x, y, r], i) => (
                <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#fffaf0' : CREAM} stroke={GOLD} strokeOpacity=".5" strokeWidth=".9" />
              ))}
              {[[-20, -14, -40], [18, -16, 35], [-22, 8, -120], [20, 10, 120]].map(([x, y, a], i) => (
                <ellipse key={i} cx={x} cy={y} rx="11" ry="4.4" transform={`rotate(${a} ${x} ${y})`} fill={i % 2 ? GOLD : '#2e6b7a'} fillOpacity=".85" />
              ))}
              <path d="M0 12C-2 24-2 30 0 36" stroke={GOLD} strokeWidth="2" strokeOpacity=".8" fill="none" />
            </g>
          </g>

          {/* ───── жених ───── */}
          <g transform="translate(-58 0)">
            <path d="M-30-150-26 0H-7L-5-150Z" fill={NAVY_DEEP} />
            <path d="M5-150 7 0H26L30-150Z" fill={NAVY_DEEP} />
            <ellipse cx="-16" cy="2" rx="14" ry="5.5" fill="#09182a" />
            <ellipse cx="17" cy="2" rx="14" ry="5.5" fill="#09182a" />

            {/* пиджак */}
            <path d="M-38-242C-27-252-12-256 0-256 12-256 27-252 38-242 39-218 33-200 31-182 30-162 31-150 31-142H-31C-31-150-30-162-31-182-33-200-39-218-38-242Z" fill="url(#cpl-suit)" />
            <path d="M-26-250C-31-226-30-202-28-182M26-250C31-226 30-202 28-182" stroke="#09182a" strokeOpacity=".45" strokeWidth="1.8" fill="none" />
            {/* рубашка и жилет */}
            <path d="M-12-247C-6-240-2-232 0-224 2-232 6-240 12-247 6-251-6-251-12-247Z" fill={CREAM} />
            <path d="M-11-244C-7-226-5-206-4-184H5C6-206 8-226 11-244 6-248-6-248-11-244Z" fill="#f6ead3" />
            <path d="M-9-240C-6-216-5-198-4-182M9-240C6-216 5-198 4-182" stroke={GOLD} strokeOpacity=".55" strokeWidth="1.5" fill="none" />
            {/* лацканы */}
            <path d="M-13-247C-20-236-24-220-26-200-18-214-10-230-4-246Z" fill={NAVY_DEEP} />
            <path d="M13-247C20-236 24-220 26-200 18-214 10-230 4-246Z" fill={NAVY_DEEP} />
            {/* бабочка и бутоньерка */}
            <path d="M-11-248 0-243 11-248 11-238 0-233-11-238Z" fill={GOLD} />
            <circle cx="0" cy="-243" r="3" fill="#8d6429" />
            <circle cx="-21" cy="-230" r="5" fill={CREAM} stroke={GOLD} strokeOpacity=".6" strokeWidth=".9" />
            <ellipse cx="-27" cy="-236" rx="7" ry="3" transform="rotate(-35 -27 -236)" fill="#2e6b7a" fillOpacity=".85" />

            {/* шея и голова в профиль с зачёсом */}
            <path d="M-5-262H6V-250C2-246-2-246-5-250Z" fill={NAVY} />
            <path d="M-12-286C-12-300-5-308 2-308 10-308 15-301 15-291 15-283 13-278 9-274 3-269-6-270-10-274-12-277-12-282-12-286Z" fill={NAVY} />
            <path d="M16-290C19-288 19-283 15-281Z" fill={NAVY} />
            <path d="M-13-289C-14-303-5-312 6-311 15-310 20-303 19-296 16-302 10-306 3-305-4-304-9-298-9-290Z" fill={NAVY_DEEP} />
            <path d="M18-297C23-300 25-296 23-293 21-291 19-292 17-294Z" fill={NAVY_DEEP} />

            {/* рука к невесте и рука в кармане */}
            <path d="M34-236C44-212 50-188 53-166" stroke={NAVY} strokeWidth="9.5" strokeLinecap="round" fill="none" />
            <path d="M-34-236C-41-212-41-190-37-172" stroke={NAVY} strokeWidth="9.5" strokeLinecap="round" fill="none" />
          </g>

          {/* соединённые руки */}
          <ellipse cx="4" cy="-160" rx="11" ry="8" transform="rotate(-18 4 -160)" fill={NAVY} />
          <path d="M-5-163C0-158 6-158 12-162" stroke={GOLD} strokeOpacity=".45" strokeWidth="1.6" fill="none" />
        </g>
      </g>
    </svg>
  )
}

export default memo(Couple)
