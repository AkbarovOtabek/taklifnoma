import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { wedding, when } from '../config.js'
import { SPRING } from './Ornaments.jsx'
import sceneWide from '../assets/scene-wide.webp'
import sceneTall from '../assets/scene-tall.webp'
import Petals from './Petals.jsx'
import HeroCard from './HeroCard.jsx'
import Couple from './Couple.jsx'

const ease = [0.22, 1, 0.36, 1]

// Положения фонарей из Scene.jsx, в процентах от сцены 2400×1600
const lanterns = [[130, 0.42], [185, 0.72], [275, 1.25], [390, 2]].flatMap(([dx, s], i) => {
  const y = 1320 + (s - 0.42) * 170 - 46 * s
  const size = (160 * s) / 24
  return [-1, 1].map((side) => ({
    left: `${(1200 + side * dx) / 24}%`,
    top: `${y / 16}%`,
    width: `${size}%`,
    animationDelay: `${i * 0.7 + (side > 0 ? 0.4 : 0)}s`,
  }))
})

// Светильники в глубине зала — из Scene.jsx
const hallLamps = [[1200, 944, 1], [1124, 930, 0.72], [1276, 930, 0.72]].map(([x, y, s], i) => ({
  left: `${x / 24}%`,
  top: `${y / 16}%`,
  width: `${(140 * s) / 24}%`,
  animationDelay: `${0.3 + i * 0.6}s`,
}))

// Звёзды мерцают каждая в своём ритме. Координаты — проценты сцены 2400×1600,
// на телефоне видна её середина, поэтому большая часть звёзд стоит в центре.
const stars = [
  [31, 7, 4], [36, 13, 3], [44, 5, 5], [49, 11, 3], [56, 16, 4], [61, 6, 3],
  [66, 12, 4], [53, 22, 3], [40, 19, 4], [69, 20, 3], [34, 25, 3], [45, 15, 3],
  [12, 9, 4], [18, 17, 3], [24, 5, 4], [82, 15, 4], [88, 8, 3], [92, 20, 3],
].map(([x, y, r], i) => ({
  left: `${x}%`,
  top: `${y}%`,
  width: `${r}px`,
  height: `${r}px`,
  animationDuration: `${2.6 + (i % 5) * 0.7}s`,
  animationDelay: `${(i % 7) * 0.45}s`,
}))

// Светлячки над садом: медленно всплывают и гаснут
const fireflies = [
  [30, 86], [38, 78], [45, 84], [57, 80], [64, 87], [70, 75],
  [34, 70], [62, 68], [50, 90], [26, 80], [74, 83], [42, 73],
].map(([x, y], i) => ({
  left: `${x}%`,
  top: `${y}%`,
  animationDuration: `${8 + (i % 5) * 1.6}s`,
  animationDelay: `${(i * 1.3) % 9}s`,
}))

// Лучи из проёма — те же два клина, что запечены в сцене, но дышащие
const beams = [
  'polygon(46.7% 0, 31.7% 100%, 42.5% 100%, 49.2% 0)',
  'polygon(50.8% 0, 57.5% 100%, 68.3% 100%, 53.3% 0)',
]

// Видео вместо рисованной сцены. Живые слои ему не нужны — всё движение уже
// внутри ролика, поэтому поверх только наезд камеры.
// Доиграв до CLIP, видео замирает на последнем кадре — с него сцену подхватывает
// прокрутка. Срез нужен потому, что в самом конце ролика проступает чужое имя.
const CLIP = 11

function VideoScene({ zoom, play }) {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    // кадр отслеживаем покадрово, где браузер умеет: timeupdate приходит
    // четыре раза в секунду и успевает проскочить лишнее
    const hold = () => {
      if (v.currentTime < CLIP) {
        if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(hold)
        return
      }
      v.pause()
      v.currentTime = CLIP
    }
    v.addEventListener('timeupdate', hold)
    if (play) {
      v.currentTime = 0
      const started = v.play()
      if (started) started.catch(() => {})
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(hold)
    }
    return () => v.removeEventListener('timeupdate', hold)
  }, [play])

  return (
    <motion.div
      className="scene-video"
      aria-hidden="true"
      style={{ scale: zoom, transformOrigin: '50% 38%' }}
    >
      <video
        ref={ref}
        className="scene"
        src={`${import.meta.env.BASE_URL}${wedding.heroVideo}`}
        muted
        playsInline
        preload="auto"
      />
    </motion.div>
  )
}

// Готовая картинка и лёгкие слои поверх: двигаем только transform и opacity
function BakedScene({ zoom }) {
  return (
    <motion.div
      className="scene-box"
      aria-hidden="true"
      // центр зума — светящийся проём (y 1050 из 1600)
      style={{ x: '-50%', scale: zoom, transformOrigin: '50% 65.6%' }}
    >
      <picture>
        <source media="(max-aspect-ratio: 3/4)" srcSet={sceneTall} />
        <img className="scene-img" src={sceneWide} alt="" />
      </picture>
      <div className="fx fx-cloud clouds-a" style={{ top: '27%', left: '10%' }} />
      <div className="fx fx-cloud clouds-b" style={{ top: '38%', left: '50%' }} />
      <div className="fx fx-moon" />
      {stars.map((style, i) => <div key={`star${i}`} className="fx fx-star" style={style} />)}
      {beams.map((clipPath, i) => (
        <div key={`beam${i}`} className={i ? 'fx fx-beam fx-beam-b' : 'fx fx-beam'} style={{ clipPath }} />
      ))}
      <div className="fx fx-door" />
      <Couple />
      {lanterns.map((style, i) => <div key={i} className="fx fx-lantern" style={style} />)}
      {hallLamps.map((style, i) => <div key={`hall${i}`} className="fx fx-lantern" style={style} />)}
      {fireflies.map((style, i) => <div key={`fly${i}`} className="fx fx-fly" style={style} />)}
      <div className="fx fx-mist" style={{ left: '22%' }} />
      <div className="fx fx-mist fx-mist-b" style={{ left: '50%' }} />
    </motion.div>
  )
}

// Имя собирается по буквам
function Letters({ word, delay }) {
  return (
    <span className="letters" aria-label={word}>
      {[...word].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: delay + i * 0.07, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero({ t, data, live, revealed }) {
  const ref = useRef(null)
  const raw = useScroll({ target: ref, offset: ['start start', 'end end'] }).scrollYProgress
  const scrollYProgress = useSpring(raw, SPRING)
  // Один закреплённый экран: камера летит в светящийся проём, и из его света
  // к гостю вылетает карточка приглашения. Всё в одном слое, поэтому шва нет.
  // Рисованная сцена отрисована в 3000 пикселей и держит наезд вчетверо.
  // Видео 720p на таком зуме рассыплется, поэтому для него наезд мягкий.
  const near = wedding.heroVideo ? 1.1 : 1.3
  const far = wedding.heroVideo ? 1.5 : 3.8
  const zoom = useTransform(scrollYProgress, [0, 0.15, 0.45], [1, near, far], { ease: (v) => v * v })
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -170])
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.82])
  const titleOp = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const shade = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const sceneOp = useTransform(scrollYProgress, [0.38, 0.5], [1, 0])
  const cardOp = useTransform(scrollYProgress, [0.33, 0.43], [0, 1])
  const flight = useTransform(scrollYProgress, [0.36, 1], [0, 1])

  // пока ролик раскрывает кулису, имена ждут за кадром — иначе они тонут в белом
  const lag = wedding.heroVideo ? 1.9 : 0
  const dateText = t.fmt(when.day, t.months[when.month], when.year)

  return (
    <section
      className="hero"
      ref={ref}
      data-stops="0|0.93"
      data-tone="dark|light"
      data-nav={`${t.nav.hero}|${t.nav.card}`}
    >
      <div className={wedding.heroVideo ? 'hero-sticky hero-on-video' : 'hero-sticky'}>
        <motion.div className="hero-stage" style={{ opacity: sceneOp }}>
          {wedding.heroVideo ? <VideoScene zoom={zoom} play={revealed} /> : <BakedScene zoom={zoom} />}
        </motion.div>

        {wedding.heroVideo && <div className="hero-corner" />}
        <motion.div className="hero-sky-shade" style={{ opacity: shade }} />
        <motion.div className="hero-petals" style={{ opacity: sceneOp }}>
          <Petals active={live} />
        </motion.div>
        <motion.div className="hero-cardlayer" style={{ opacity: cardOp }}>
          <HeroCard progress={flight} t={t} data={data} />
        </motion.div>

        {revealed && (
          <motion.div className="hero-title" style={{ y: titleY, scale: titleScale, opacity: titleOp }}>
            <motion.span
              className="eyebrow eyebrow-light"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.42em' }}
              transition={{ duration: 1.6, delay: lag + 0.2, ease }}
            >
              {t.theWedding}
            </motion.span>
            <h1 className="hero-names">
              <Letters word={data.names[0]} delay={lag + 0.5} />
              <motion.i
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: lag + 1.1, ease }}
              >&amp;</motion.i>
              <Letters word={data.names[1]} delay={lag + 1.3} />
            </h1>
            <motion.div
              className="hero-date"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: lag + 2.1, ease }}
            >
              <b><span>{dateText}</span><em>{when.time}</em></b>
              <small>{data.venue} · {t.cityName}</small>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
