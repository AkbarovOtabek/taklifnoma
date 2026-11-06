// Прокрутка всей страницы: инерция колеса, «остановки» и переходы по ним.
//
// Каждая секция объявляет свои остановки — data-stops, доли её собственной
// прокрутки, на которых экран стоит и содержимое читается. Гость отпустил палец
// или колесо — страница сама доезжает до ближайшей остановки, поэтому повиснуть
// между экранами и не увидеть текст невозможно.
import Lenis from 'lenis'
import Snap from 'lenis/snap'

const out = (t) => 1 - (1 - t) ** 3
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
// насколько близко к остановке считается, что мы на ней стоим
const NEAR = 0.22

let lenis = null
let snap = null
let unsnap = []
let stops = []
let moving = false
let idle = null
let live = false
let said = ''

const stopSubs = new Set()
const moveSubs = new Set()

export const getStops = () => stops
export function onStops(fn) { stopSubs.add(fn); return () => stopSubs.delete(fn) }
export function onMove(fn) { moveSubs.add(fn); return () => moveSubs.delete(fn) }

const at = () => (lenis ? lenis.scroll : window.scrollY)

// где мы сейчас: ближайшая остановка и стоим ли мы на ней
function place() {
  const scroll = at()
  let index = 0
  stops.forEach((s, i) => {
    if (Math.abs(s.value - scroll) < Math.abs(stops[index].value - scroll)) index = i
  })
  const dist = stops.length ? Math.abs(stops[index].value - scroll) : 0
  return { index, near: !moving && dist < window.innerHeight * NEAR, total: stops.length }
}

function tellMove() {
  const p = place()
  const key = `${p.index}:${p.near}:${p.total}`
  if (key === said) return
  said = key
  moveSubs.forEach((fn) => fn(p))
}

// Высоты секций заданы в экранах, поэтому остановки переезжают вместе с экраном:
// при повороте телефона и когда прячется адресная строка браузера.
export function measureStops() {
  const next = []
  document.querySelectorAll('main > section').forEach((el) => {
    const sticky = el.firstElementChild
    const screen = sticky ? sticky.offsetHeight : window.innerHeight
    const range = Math.max(0, el.offsetHeight - screen)
    const tones = (el.dataset.tone || 'light').split('|')
    const names = (el.dataset.nav || '').split('|')
    ;(el.dataset.stops || '0.7').split('|').forEach((part, i) => {
      next.push({
        value: Math.round(el.offsetTop + range * Number(part)),
        tone: tones[i] || tones[0],
        label: names[i] || '',
      })
    })
  })
  stops = next
  unsnap.forEach((off) => off())
  unsnap = snap ? stops.map((s) => snap.add(s.value)) : []
  stopSubs.forEach((fn) => fn(stops))
  said = ''
  tellMove()
}

function onScroll() {
  moving = true
  clearTimeout(idle)
  idle = setTimeout(() => { moving = false; tellMove() }, 160)
  tellMove()
}

// колесо и клавиши ведут к остановкам, а не на произвольные пиксели
function onKey(e) {
  if (!live || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
  const tag = e.target?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') return
  if (e.target?.isContentEditable) return
  const down = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' '
  const up = e.key === 'ArrowUp' || e.key === 'PageUp'
  if (down || up) { e.preventDefault(); goStep(down ? 1 : -1) }
  else if (e.key === 'Home') { e.preventDefault(); goToStop(0) }
  else if (e.key === 'End') { e.preventDefault(); goToStop(stops.length - 1) }
}

export function initScroll() {
  if (lenis) return
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1.3, autoRaf: true })
  snap = new Snap(lenis, {
    type: 'proximity',
    duration: reduced() ? 0.25 : 0.9,
    easing: out,
    velocityThreshold: 0.6,
    debounce: 180,
  })
  snap.stop()
  lenis.on('scroll', onScroll)
  window.addEventListener('resize', measureStops)
  window.addEventListener('load', measureStops)
  window.addEventListener('keydown', onKey)
  measureStops()
}

export function destroyScroll() {
  window.removeEventListener('resize', measureStops)
  window.removeEventListener('load', measureStops)
  window.removeEventListener('keydown', onKey)
  clearTimeout(idle)
  snap?.destroy()
  lenis?.destroy()
  lenis = null
  snap = null
  unsnap = []
  stops = []
  live = false
}

export function startScroll() {
  live = true
  lenis?.start()
  snap?.start()
  measureStops()
}

export function stopScroll() {
  live = false
  lenis?.stop()
  snap?.stop()
}

function ride(value) {
  lenis?.scrollTo(value, {
    duration: reduced() ? 0.25 : 1.1,
    easing: out,
    // помечаем переход как «притяжение», иначе он сам себя запустит заново
    userData: { initiator: 'snap' },
  })
}

export function goToStop(i) {
  const s = stops[Math.max(0, Math.min(stops.length - 1, i))]
  if (s) ride(s.value)
}

// следующая остановка по ходу движения, а не просто ближайшая
export function goStep(dir) {
  if (!stops.length) return
  const scroll = at()
  const gap = 8
  const s = dir > 0
    ? stops.find((x) => x.value > scroll + gap) || stops[stops.length - 1]
    : [...stops].reverse().find((x) => x.value < scroll - gap) || stops[0]
  ride(s.value)
}
