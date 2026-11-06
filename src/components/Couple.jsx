import { memo } from 'react'
import couple from '../assets/couple.webp'

// Жених и невеста — готовая иллюстрация. В запечённую картинку её не кладём:
// отдельным слоем пара может едва заметно покачиваться, как живая.
// Система координат та же, что у сцены (2400×1600), поэтому слой ложится
// ровно поверх и совпадает с ней на любом экране.
//
// Рисунок стоит на ковровой дорожке: туфли жениха приходятся на y ≈ 1480,
// лента под ними ложится на ковёр.
function Couple() {
  return (
    <svg className="fx-couple" viewBox="0 0 2400 1600" aria-hidden="true">
      <image className="couple" href={couple} x="966" y="1140" width="468" height="413" />
    </svg>
  )
}

export default memo(Couple)
