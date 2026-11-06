// Всё, что меняется от свадьбы к свадьбе, — только здесь.
// Программа вечера пока ОБРАЗЕЦ — замените настоящей.
// Родители: оставьте '' — строка не покажется.

export const wedding = {
  date: '2026-12-19T18:00:00+05:00',
  monogram: ['M', 'O'],

  // Зал «Узумзор»: yandex.uz/maps/org/uzumzor/93190156906 и 2gis.uz/tashkent/firm/70000001037810391.
  // Номера организаций нужны, чтобы навигатор вёл к самому залу, а не к адресу рядом.
  map: { lat: 41.339059, lng: 69.177912, yandexOrg: '93190156906', twoGisFirm: '70000001037810391' },

  // Необязательно. Положите файлы в папку public и впишите имена, например 'hero.mp4'.
  // Пока пусто, в первом экране идёт нарисованная живая сцена, а музыка синтезируется.
  heroVideo: '',
  music: '',

  uz: {
    names: ['Otabek', 'Mohlaroyim'],
    groom: '',
    bride: '',
    venue: 'Uzumzor',
    venueKind: 'Banket zali',
    address: "Toshkent shahri, Shayxontohur tumani, Jarariq ko'chasi, 10",
    program: [
      ['18:00', 'Mehmonlarni kutib olish', "Choy, shirinliklar va jonli musiqa"],
      ['19:00', 'Kuyov va kelin kirishi', "Oqshomning eng go'zal lahzasi"],
      ['20:00', 'Bazm dasturxoni', "Milliy taomlar va tabriklar"],
      ['21:30', 'Birinchi raqs', "Yoshlar raqsi va xotira suratlari"],
      ['23:00', 'Xayrlashuv', "Minnatdorchilik so'zlari"],
    ],
  },
  ru: {
    names: ['Отабек', 'Мохларойим'],
    groom: '',
    bride: '',
    venue: 'Узумзор',
    venueKind: 'Банкетный зал',
    address: 'г. Ташкент, Шайхантахурский район, ул. Джарарык, 10',
    program: [
      ['18:00', 'Встреча гостей', 'Чай, сладости и живая музыка'],
      ['19:00', 'Выход жениха и невесты', 'Самый красивый момент вечера'],
      ['20:00', 'Праздничный стол', 'Национальные блюда и поздравления'],
      ['21:30', 'Первый танец', 'Танец молодых и фото на память'],
      ['23:00', 'Прощальный вечер', 'Слова благодарности'],
    ],
  },
}

// Дата и время всегда по месту свадьбы, в каком бы часовом поясе ни был гость
const [y, m, d, hh, mm] = wedding.date.match(/\d+/g).map(Number)
export const when = {
  year: y,
  month: m - 1,
  day: d,
  weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay(),
  time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
}

export const text = {
  uz: {
    gate: 'Taklifnoma',
    tap: 'Ochish uchun bosing',
    dear: 'Hurmatli',
    theWedding: "Nikoh to'yi",
    scroll: 'Pastga suring',
    next: 'Keyingisi',
    guideTitle: "Qanday ko'rish kerak",
    guideText: "Pastga suring — sahifa har bir ekranda o'zi to'xtaydi. O'ngdagi nuqtalar bilan ham yurish mumkin.",
    nav: { hero: 'Boshlanish', card: 'Taklifnoma', count: 'Hisob', venue: 'Manzil', route: "Yo'nalish", prog: 'Dastur', end: 'Yakun' },
    countTitle: 'Baxtli kungacha',
    countSub: "Hayotimizning eng go'zal kuni yaqinlashmoqda",
    unit: (i) => ['kun', 'soat', 'daqiqa', 'soniya'][i],
    past: "To'y muborak!",
    inviteTop: "Ikki qalb bir bo'lgan kun",
    and: 'va',
    invite: "Sizni hayotimizning eng quvonchli kunida biz bilan birga bo'lishga taklif qilamiz",
    venueTitle: "To'y manzili",
    venueSub: "Oqshomni shu yerda birga o'tkazamiz",
    route: "Yo'nalish qurish",
    routeSub: "Navigatorni tanlang — yo'l avtomatik quriladi",
    copy: 'Manzilni nusxalash',
    copied: 'Nusxalandi',
    dateLabel: 'Sana',
    timeLabel: 'Boshlanish',
    placeLabel: 'Joy',
    coordsLabel: 'Koordinatalar',
    liveMap: 'Jonli xarita',
    live: 'Jonli',
    city: 'Toshkent · UTC+5',
    labels: ['Vaqt', 'Manzil', 'Dastur'],
    progTitle: 'Oqshom dasturi',
    progSub: 'Bayram quyidagi tartibda davom etadi',
    closing: "Sizning tashrifingiz biz uchun eng qimmatli sovg'adir",
    wait: 'Sizni intizorlik bilan kutamiz',
    months: ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'],
    weekdays: ['yakshanba','dushanba','seshanba','chorshanba','payshanba','juma','shanba'],
    fmt: (d, m, y) => `${d}-${m}, ${y}-yil`,
  },
  ru: {
    gate: 'Приглашение',
    tap: 'Нажмите, чтобы открыть',
    dear: 'Дорогой гость,',
    theWedding: 'Свадьба',
    scroll: 'Листайте вниз',
    next: 'Дальше',
    guideTitle: 'Как смотреть',
    guideText: 'Листайте вниз — страница сама остановится на каждом экране. Переходить можно и по точкам справа.',
    nav: { hero: 'Начало', card: 'Приглашение', count: 'Отсчёт', venue: 'Место', route: 'Маршрут', prog: 'Программа', end: 'Финал' },
    countTitle: 'До счастливого дня',
    countSub: 'Самый красивый день нашей жизни всё ближе',
    unit: (i, n) => {
      const forms = [['день', 'дня', 'дней'], ['час', 'часа', 'часов'], ['минута', 'минуты', 'минут'], ['секунда', 'секунды', 'секунд']][i]
      const a = n % 100, b = n % 10
      if (a > 10 && a < 20) return forms[2]
      return b === 1 ? forms[0] : b >= 2 && b <= 4 ? forms[1] : forms[2]
    },
    past: 'Свадьба состоялась!',
    inviteTop: 'День, когда два сердца стали одним',
    and: 'и',
    invite: 'Приглашаем вас разделить с нами самый радостный день нашей жизни',
    venueTitle: 'Место торжества',
    venueSub: 'Здесь мы проведём этот вечер вместе',
    route: 'Построить маршрут',
    routeSub: 'Выберите навигатор — маршрут построится сам',
    copy: 'Скопировать адрес',
    copied: 'Скопировано',
    dateLabel: 'Дата',
    timeLabel: 'Начало',
    placeLabel: 'Место',
    coordsLabel: 'Координаты',
    liveMap: 'Живая карта',
    live: 'Онлайн',
    city: 'Ташкент · UTC+5',
    labels: ['Время', 'Место', 'Программа'],
    progTitle: 'Программа вечера',
    progSub: 'Праздник пройдёт в таком порядке',
    closing: 'Ваше присутствие — самый дорогой подарок для нас',
    wait: 'С нетерпением ждём вас',
    months: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
    weekdays: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
    fmt: (d, m, y) => `${d} ${m} ${y} года`,
  },
}
