import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { wedding, when } from '../config.js'
import { SPRING } from './Ornaments.jsx'
import sceneWide from '../assets/scene-wide.webp'
import sceneTall from '../assets/scene-tall.webp'
import Petals from './Petals.jsx'
import HeroCard from './HeroCard.jsx'

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
      <div className="fx fx-door" />
      {lanterns.map((style, i) => <div key={i} className="fx fx-lantern" style={style} />)}
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
  const zoom = useTransform(scrollYProgress, [0, 0.15, 0.45], [1, 1.3, 3.8], { ease: (v) => v * v })
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -170])
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.82])
  const titleOp = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const shade = useTransform(scrollYProgress, [0, 0.16], [1, 0])
  const sceneOp = useTransform(scrollYProgress, [0.38, 0.5], [1, 0])
  const cardOp = useTransform(scrollYProgress, [0.33, 0.43], [0, 1])
  const flight = useTransform(scrollYProgress, [0.36, 1], [0, 1])

  const dateText = t.fmt(when.day, t.months[when.month], when.year)

  return (
    <section className="hero" ref={ref}>
      <div className="hero-sticky">
        <motion.div className="hero-stage" style={{ opacity: sceneOp }}>
          {wedding.heroVideo ? (
            <video
              className="scene"
              src={`${import.meta.env.BASE_URL}${wedding.heroVideo}`}
              autoPlay muted loop playsInline
            />
          ) : (
            <BakedScene zoom={zoom} />
          )}
        </motion.div>

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
              transition={{ duration: 1.6, delay: 0.2, ease }}
            >
              {t.theWedding}
            </motion.span>
            <h1 className="hero-names">
              <Letters word={data.names[0]} delay={0.5} />
              <motion.i
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.1, ease }}
              >&amp;</motion.i>
              <Letters word={data.names[1]} delay={1.3} />
            </h1>
            <motion.p
              className="hero-date"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 2.1, ease }}
            >
              {dateText}
            </motion.p>
          </motion.div>
        )}

        {revealed && (
          <motion.div className="hero-scroll" style={{ opacity: titleOp }}>
            <motion.div
              className="hero-scroll-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              <span>{t.scroll}</span>
              <motion.i
                style={{ rotate: 45 }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
