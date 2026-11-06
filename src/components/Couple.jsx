import { memo } from 'react'

// Жених и невеста со спины. В запечённую картинку их не кладём: отдельным слоем
// они живут — пара едва заметно покачивается, фата и шлейф идут своим ритмом,
// а свет из проёма дышит на плечах. Система координат та же, что у сцены:
// 2400×1600, поэтому слой просто ложится поверх и совпадает на любом экране.
//
// Пропорции как в модной графике: рост около семи голов, ноги — половина роста,
// плечи у жениха в три головы шириной. Фата шире платья, иначе её не видно.
function Couple() {
  return (
    <svg className="fx-couple" viewBox="0 0 2400 1600" aria-hidden="true">
      <defs>
        <linearGradient id="cpl-gown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset=".55" stopColor="#f7ebd8" />
          <stop offset="1" stopColor="#dcc7a9" />
        </linearGradient>
        <linearGradient id="cpl-veil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".34" />
          <stop offset=".7" stopColor="#fff6e4" stopOpacity=".26" />
          <stop offset="1" stopColor="#fff6e4" stopOpacity=".18" />
        </linearGradient>
        <linearGradient id="cpl-suit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#24394a" />
          <stop offset=".45" stopColor="#152632" />
          <stop offset="1" stopColor="#0a141c" />
        </linearGradient>
        <radialGradient id="cpl-shadow">
          <stop offset="0" stopColor="#3b2a1b" stopOpacity=".4" />
          <stop offset="1" stopColor="#3b2a1b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(1206 1478) scale(1.04)">
        <ellipse cx="-14" cy="8" rx="215" ry="19" fill="url(#cpl-shadow)" />

        <g className="couple">
          {/* ───── невеста ───── */}
          <g transform="translate(-36 0)">
            <path className="couple-train" d="M-18-170C-38-136-80-92-132-48-160-24-176-10-180 2H92C88-34 56-100 20-170Z" fill="url(#cpl-gown)" />
            <g className="couple-train" fill="none" stroke="#d6ba8c" strokeOpacity=".5" strokeWidth="1.5">
              <path d="M-14-162C-50-116-102-70-164 0" />
              <path d="M-2-162C-24-112-50-56-80 0" />
              <path d="M8-162C7-112 4-52-1 0" />
              <path d="M18-162C34-112 58-52 74 0" />
            </g>

            {/* корсет: плечи покатые, талия забрана */}
            <path d="M-26-214C-17-225-9-228 0-228 9-228 17-225 26-214 29-198 24-184 20-170H-18C-22-184-29-198-26-214Z" fill="#fdf7ec" />
            <path d="M0-226V-172" stroke="#e3d0af" strokeOpacity=".65" strokeWidth="1.3" />
            <path d="M-18-172C-8-166 10-166 20-172" fill="none" stroke="#e0cba6" strokeWidth="1.6" />

            <rect x="-7" y="-246" width="14" height="22" rx="5" fill="#b08763" />
            <ellipse cx="0" cy="-264" rx="13.5" ry="16.5" fill="#a67d5b" />
            <path d="M-14-265C-14-281-7-289 0-289 7-289 14-281 14-265 14-258 12-253 10-250H-10C-12-253-14-258-14-265Z" fill="#2b1c15" />
            <ellipse cx="0" cy="-247" rx="10.5" ry="9" fill="#241610" />
            <path d="M-7-252C-3-256 3-256 7-252" fill="none" stroke="#45301f" strokeWidth="1.5" />
            <circle cx="-12" cy="-258" r="3.4" fill="#fff4e4" />
            <circle cx="-8" cy="-263" r="2.8" fill="#f8e3d5" />
            <circle cx="-14" cy="-252" r="2.2" fill="#fdeede" />

            <g className="couple-rim" fill="none" stroke="#f3cf92" strokeWidth="2.4">
              <path d="M-26-214C-29-198-22-184-18-170" strokeOpacity=".45" />
              <path d="M-13-276C-8-286-4-289 0-289" strokeOpacity=".32" strokeWidth="1.4" />
            </g>

            <path className="couple-veil" d="M-8-252C-30-210-54-126-120-42-154 0-182 16-194 22H100C94-22 58-122 10-252Z" fill="url(#cpl-veil)" />
            <path className="couple-veil" d="M-194 22C-156 17-96 19-36 21 26 23 74 23 100 22" fill="none" stroke="#fff" strokeOpacity=".38" strokeWidth="2.2" />
          </g>

          {/* ───── жених ───── */}
          <g transform="translate(62 0)">
            <path d="M-38-158H38V-142H-38Z" fill="#0b151c" />
            <path d="M-37-154-31 0H-7L-6-154Z" fill="#0e1a22" />
            <path d="M6-154 7 0H31L37-154Z" fill="#0e1a22" />
            <ellipse cx="-19" cy="1" rx="15" ry="6" fill="#060c10" />
            <ellipse cx="19" cy="1" rx="15" ry="6" fill="#060c10" />

            {/* пиджак: покатые плечи, забранная талия, полы до середины бедра */}
            <path d="M-46-236C-31-249-15-252 0-252 15-252 31-249 46-236 48-214 41-200 38-190 36-178 39-162 39-150H-39C-39-162-36-178-38-190-41-200-48-214-46-236Z" fill="url(#cpl-suit)" />
            <path d="M0-250V-150" stroke="#000" strokeOpacity=".32" strokeWidth="2" />
            <path d="M-28-242C-31-220-30-196-29-172M28-242C31-220 30-196 29-172" fill="none" stroke="#000" strokeOpacity=".2" strokeWidth="2" />
            <path d="M-13-249C-7-243 7-243 13-249" fill="none" stroke="#efe3c9" strokeOpacity=".75" strokeWidth="3.4" />

            <rect x="-8" y="-268" width="16" height="24" rx="5" fill="#9b7252" />
            <ellipse cx="0" cy="-286" rx="15" ry="18.5" fill="#8d6646" />
            <path d="M-16-287C-16-303-8-311 0-311 8-311 16-303 16-287 16-279 14-273 11-269 7-272-7-272-11-269-14-273-16-279-16-287Z" fill="#17120f" />

            <g className="couple-rim" fill="none" stroke="#f3cf92" strokeWidth="3.2">
              <path d="M-46-236C-48-214-41-200-38-190-36-178-39-162-39-150" strokeOpacity=".5" />
              <path d="M46-236C48-214 41-200 38-190 36-178 39-162 39-150" strokeOpacity=".26" />
              <path d="M-15-296C-10-306-5-311 0-311" strokeOpacity=".32" strokeWidth="1.6" />
            </g>
          </g>

          {/* его рука на её талии */}
          <path d="M17-240C9-220 0-200-11-180" fill="none" stroke="#16252e" strokeWidth="13" strokeLinecap="round" />
          <path d="M17-238C10-220 2-202-8-184" fill="none" stroke="#2c4455" strokeOpacity=".45" strokeWidth="2.5" />
          <ellipse cx="-15" cy="-176" rx="8" ry="6" transform="rotate(-25 -15 -176)" fill="#c0906a" />
        </g>
      </g>
    </svg>
  )
}

export default memo(Couple)
