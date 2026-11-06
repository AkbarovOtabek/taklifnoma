import { motion } from 'framer-motion'
import { Coffee, Heart, UtensilsCrossed, Music2, Sparkles } from 'lucide-react'
import { Divider, Reveal, Portal } from './Ornaments.jsx'

const icons = [Coffee, Heart, UtensilsCrossed, Music2, Sparkles]

export default function Program({ t, data }) {
  return (
    <Portal className="program" nav={t.nav.prog}>
      <Reveal><h2 className="script">{t.progTitle}</h2></Reveal>
      <Reveal delay={0.1}><p className="sub">{t.progSub}</p></Reveal>
      <Divider />
      <div className="timeline">
        <span className="line" />
        {/* золотая линия прорастает сверху вниз */}
        <motion.span
          className="line line-gold"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2.2, delay: 0.3, ease: 'easeInOut' }}
        />
        <ol>
          {data.program.map(([time, title, note], i) => {
            const Icon = icons[i % icons.length]
            return (
              <motion.li
                key={time}
                style={{ transformPerspective: 900, transformOrigin: '0% 50%' }}
                initial={{ opacity: 0, x: 30, rotateY: -55 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: 0.4 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="tl-dot"><Icon size={18} strokeWidth={1.4} /></span>
                <div>
                  <time>{time}</time>
                  <h3>{title}</h3>
                  <p>{note}</p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </Portal>
  )
}
