import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import 'lenis/dist/lenis.css'
import { wedding, text } from './config.js'
import { createMusic } from './music.js'
import { initScroll, destroyScroll, startScroll, stopScroll } from './scroll.js'
import Envelope from './components/Envelope.jsx'
import Hero from './components/Hero.jsx'
import Countdown from './components/Countdown.jsx'
import { VenueInfo, VenueRoute } from './components/Venue.jsx'
import Program from './components/Program.jsx'
import Closing from './components/Closing.jsx'
import ScrollGuide from './components/ScrollGuide.jsx'

// ?lang=ru — открыть на русском, ?to=Aziz — обратиться к гостю по имени
const params = new URLSearchParams(window.location.search)

// после перезагрузки всегда начинаем с конверта, а не с середины страницы
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

export default function App() {
  const [lang, setLang] = useState(params.get('lang') === 'ru' ? 'ru' : 'uz')
  const [opened, setOpened] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [sound, setSound] = useState(true)
  const music = useRef(null)

  const t = text[lang]
  const data = wedding[lang]
  const guest = params.get('to')

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = `${data.names[0]} & ${data.names[1]} — ${t.gate}`
  }, [lang, data, t])

  // Плавная инерционная прокрутка и остановка на каждом экране — всё в scroll.js
  useEffect(() => {
    initScroll()
    return destroyScroll
  }, [])

  // пока конверт закрыт, страница не прокручивается
  useEffect(() => {
    document.body.style.overflow = revealed ? '' : 'hidden'
    if (revealed) startScroll()
    else stopScroll()
  }, [revealed])

  // свернули вкладку или заблокировали телефон — музыка замолкает
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) music.current?.pause()
      else if (sound) music.current?.play()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [sound])

  const open = () => {
    setOpened(true)
    // звук разрешён браузером только после нажатия — поэтому запускаем здесь
    music.current = createMusic(wedding.music)
    music.current.play()
  }

  const toggleSound = () => {
    if (sound) music.current?.pause()
    else music.current?.play()
    setSound(!sound)
  }

  return (
    <>
      <AnimatePresence>
        {!revealed && (
          <Envelope
            key="envelope"
            t={t}
            guest={guest}
            opened={opened}
            onOpen={open}
            onDone={() => setRevealed(true)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ pointerEvents: revealed ? 'auto' : 'none' }}
      >
        <button className="ctl" onClick={toggleSound} aria-label={sound ? 'Mute' : 'Sound'}>
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button className="ctl" onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}>
          {lang === 'uz' ? 'RU' : 'UZ'}
        </button>
      </motion.div>

      <main>
        <Hero t={t} data={data} live={opened} revealed={revealed} />
        <Countdown t={t} />
        <VenueInfo t={t} data={data} />
        <VenueRoute t={t} data={data} />
        <Program t={t} data={data} />
        <Closing t={t} data={data} />
      </main>

      <ScrollGuide t={t} active={revealed} />
    </>
  )
}
