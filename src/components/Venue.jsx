import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Copy, Check, CalendarDays, Clock3, Navigation } from 'lucide-react'
import { wedding, when } from '../config.js'
import { Divider, Reveal, Portal } from './Ornaments.jsx'

const { lat, lng, yandexOrg, twoGisFirm } = wedding.map

// Без номера организации 2GIS «прилипает» к ближайшему объекту — однажды это был весь город
const yandexDest = yandexOrg ? `&ruri=~ymapsbm1%3A%2F%2Forg%3Foid%3D${yandexOrg}` : ''
const twoGisDest = `%7C${lng}%2C${lat}${twoGisFirm ? `%3B${twoGisFirm}` : ''}`

// Ссылки-«универсалы»: на телефоне открывают приложение, если оно стоит, иначе сайт
const navigators = [
  { id: 'yandex', name: 'Yandex', badge: 'Я', color: '#fc3f1d', href: `https://yandex.uz/maps/?rtext=~${lat},${lng}&rtt=auto${yandexDest}` },
  { id: 'google', name: 'Google Maps', badge: 'G', color: '#1a73e8', href: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving` },
  { id: '2gis', name: '2GIS', badge: '2', color: '#19aa1e', href: `https://2gis.uz/tashkent/directions/points/${twoGisDest}` },
  { id: 'apple', name: 'Apple Maps', badge: '', color: '#111', href: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d` },
  { id: 'waze', name: 'Waze', badge: 'W', color: '#2bb7e5', href: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes` },
]

// На айфоне первым ставим Apple Maps, на Android он не нужен
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const isAndroid = /Android/.test(navigator.userAgent)
const list = isIOS
  ? [navigators[3], ...navigators.filter((n) => n.id !== 'apple')]
  : isAndroid ? navigators.filter((n) => n.id !== 'apple') : navigators

const ease = [0.22, 1, 0.36, 1]

// Первая часть адреса: зал, дата и время
export function VenueInfo({ t, data }) {
  return (
    <Portal className="venue">
      <Reveal><h2 className="script">{t.venueTitle}</h2></Reveal>
      <Reveal delay={0.1}><p className="sub">{t.venueSub}</p></Reveal>
      <Divider />
      <div className="venue-card">
        <div className="venue-head">
          <motion.span
            className="venue-pin"
            initial={{ y: -40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.3 }}
          >
            <MapPin size={20} />
          </motion.span>
          <Reveal delay={0.2}><span className="eyebrow">{data.venueKind}</span></Reveal>
          <Reveal delay={0.3}><h3>{data.venue}</h3></Reveal>
          <Reveal delay={0.4}><p>{data.address}</p></Reveal>
        </div>

        <Reveal delay={0.5}>
          <div className="venue-facts">
            <div>
              <CalendarDays size={18} strokeWidth={1.4} />
              <small>{t.dateLabel}</small>
              <b>{when.day} {t.months[when.month]}</b>
              <span>{t.weekdays[when.weekday]}</span>
            </div>
            <div>
              <Clock3 size={18} strokeWidth={1.4} />
              <small>{t.timeLabel}</small>
              <b>{when.time}</b>
              <span>{when.year}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </Portal>
  )
}

// Вторая часть адреса: карта и кнопки навигаторов
export function VenueRoute({ t, data }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const value = `${data.venue}, ${data.address}`
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // старые браузеры: копируем через временное поле
      const area = document.createElement('textarea')
      area.value = value
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <Portal className="venue">
      <div className="venue-card venue-route">
        <div className="venue-map">
          <iframe
            title={data.venue}
            loading="lazy"
            src={`https://yandex.uz/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdl${yandexOrg ? `&oid=${yandexOrg}&ol=biz` : ''}`}
          />
        </div>

        <div className="nav-head">
          <Navigation size={16} />
          <div>
            <b>{t.route}</b>
            <small>{t.routeSub}</small>
          </div>
        </div>
        <div className="nav-grid">
          {list.map((n, i) => (
            <motion.a
              key={n.id}
              className="nav-btn"
              href={n.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20, rotateX: -60 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-badge" style={{ background: n.color }}>
                {n.id === 'apple' ? (
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff" aria-hidden="true">
                    <path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.4-1-2.4-3.6zM14.1 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />
                  </svg>
                ) : n.badge}
              </span>
              {n.name}
            </motion.a>
          ))}
          <motion.button className="nav-btn nav-copy" onClick={copy} whileTap={{ scale: 0.95 }}>
            <span className="nav-badge">{copied ? <Check size={15} /> : <Copy size={15} />}</span>
            {copied ? t.copied : t.copy}
          </motion.button>
        </div>
      </div>
    </Portal>
  )
}
