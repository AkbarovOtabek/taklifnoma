import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wedding } from '../config.js'
import { Divider, Reveal, Portal } from './Ornaments.jsx'

const target = new Date(wedding.date).getTime()

function left() {
  const ms = Math.max(0, target - Date.now())
  return [
    Math.floor(ms / 86400000),
    Math.floor(ms / 3600000) % 24,
    Math.floor(ms / 60000) % 60,
    Math.floor(ms / 1000) % 60,
  ]
}

function Digit({ value }) {
  return (
    <span className="digit">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          // цифра перелистывается, как табло на вокзале
          style={{ transformPerspective: 300, transformOrigin: '50% 50%' }}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Countdown({ t }) {
  const [time, setTime] = useState(left)
  useEffect(() => {
    const id = setInterval(() => setTime(left()), 1000)
    return () => clearInterval(id)
  }, [])
  const over = target <= Date.now()

  return (
    <Portal tone="teal" className="count" nav={t.nav.count}>
      <Reveal><h2 className="script light">{t.countTitle}</h2></Reveal>
      <Reveal delay={0.1}><p className="sub light">{t.countSub}</p></Reveal>
      <Divider color="#d9b878" />
      {over ? (
        <Reveal><p className="script light">{t.past}</p></Reveal>
      ) : (
        <div className="count-grid">
          {time.map((v, i) => (
            <motion.div
              className="count-cell"
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: -35 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Digit value={v} />
              <small>{t.unit(i, v)}</small>
            </motion.div>
          ))}
        </div>
      )}
    </Portal>
  )
}
