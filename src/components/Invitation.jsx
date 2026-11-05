import { motion } from 'framer-motion'
import { when } from '../config.js'
import { Divider, Reveal } from './Ornaments.jsx'

const draw = (delay, duration = 2.6) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration, delay, ease: 'easeInOut' }, opacity: { duration: 0.3, delay } },
  },
})

// Рамка в форме стрельчатой арки: линии прорисовываются, когда рамка попала на экран
function ArchFrame() {
  const outer = 'M12 628V190C12 120 110 70 200 12 290 70 388 120 388 190V628Z'
  const inner = 'M24 616V196C24 132 118 86 200 32 282 86 376 132 376 196V616Z'
  return (
    <motion.svg
      className="arch-frame"
      viewBox="0 0 400 640"
      preserveAspectRatio="none"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      aria-hidden="true"
    >
      {/* сама «табличка»: она вылетает из света проёма */}
      <path d={outer} fill="#f8f1e3" stroke="none" />
      <motion.path variants={draw(0)} d={outer} vectorEffect="non-scaling-stroke" strokeWidth="1.5" />
      <motion.path variants={draw(0.3)} d={inner} vectorEffect="non-scaling-stroke" strokeWidth=".75" />
      {[
        'M24 616C50 616 70 600 70 578 70 560 50 556 44 568 40 578 52 584 58 576',
        'M376 616C350 616 330 600 330 578 330 560 350 556 356 568 360 578 348 584 342 576',
        'M24 580C38 570 40 548 30 534M376 580C362 570 360 548 370 534',
        'M72 616C90 606 112 606 128 616M328 616C310 606 288 606 272 616',
      ].map((d, i) => (
        <motion.path key={i} variants={draw(1 + i * 0.25, 1.6)} d={d} vectorEffect="non-scaling-stroke" strokeWidth="1" />
      ))}
    </motion.svg>
  )
}

// Карточка вылетает из проёма на первом экране (HeroCard.jsx), отдельной секции у неё нет
export function InvitationCard({ t, data }) {
  return (
    <div className="arch">
      <ArchFrame />
      <div className="arch-in">
        <Reveal><span className="eyebrow">{t.inviteTop}</span></Reveal>
        <Reveal delay={0.15}><h2 className="script">{data.names[0]}</h2></Reveal>
        {data.groom && <Reveal delay={0.25}><p className="parents">{data.groom}</p></Reveal>}
        <Reveal delay={0.35}><p className="amp">{t.and}</p></Reveal>
        <Reveal delay={0.45}><h2 className="script">{data.names[1]}</h2></Reveal>
        {data.bride && <Reveal delay={0.55}><p className="parents">{data.bride}</p></Reveal>}
        <Divider />
        <Reveal delay={0.2}><p className="invite-text">{t.invite}</p></Reveal>
        <Reveal delay={0.3}>
          <div className="date-row">
            <span>{t.weekdays[when.weekday]}</span>
            <b>{when.day}</b>
            <span>{t.months[when.month]}<br />{when.year}</span>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="invite-time">{when.time}</p>
        </Reveal>
        <Reveal delay={0.5}>
          <p className="invite-venue">{data.venueKind} <b>«{data.venue}»</b></p>
        </Reveal>
      </div>
    </div>
  )
}
