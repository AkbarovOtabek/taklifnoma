import { motion } from 'framer-motion'
import { wedding, when } from '../config.js'
import { Divider, Reveal, Portal } from './Ornaments.jsx'
import Petals from './Petals.jsx'

export default function Closing({ t, data }) {
  return (
    <Portal tone="teal" className="closing" nav={t.nav.end}>
      <Petals count={26} />
      <motion.div
        className="closing-mono"
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {wedding.monogram[0]}<i>&amp;</i>{wedding.monogram[1]}
      </motion.div>
      <Reveal delay={0.2}><p className="closing-text">{t.closing}</p></Reveal>
      <Divider color="#d9b878" />
      <Reveal delay={0.1}><h2 className="script light">{t.wait}</h2></Reveal>
      <Reveal delay={0.25}>
        <p className="closing-sign">
          {data.names[0]} &amp; {data.names[1]}
          <span>{t.fmt(when.day, t.months[when.month], when.year)} · {when.time}</span>
        </p>
      </Reveal>
    </Portal>
  )
}
