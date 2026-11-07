// Если в конфиге указан файл — играем его. Иначе тихо синтезируем музыкальную шкатулку,
// чтобы приглашение не зависело от чужой музыки и лицензий.
export function createMusic(file) {
  if (file) {
    const audio = new Audio(`${import.meta.env.BASE_URL}${file}`)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.6
    return { play: () => audio.play().catch(() => {}), pause: () => audio.pause() }
  }

  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return { play() {}, pause() {} }

  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // простое эхо вместо реверберации
  const delay = ctx.createDelay()
  delay.delayTime.value = 0.42
  const feedback = ctx.createGain()
  feedback.gain.value = 0.38
  delay.connect(feedback).connect(delay)
  delay.connect(master)

  const note = (freq, when, volume = 0.1, length = 2.6) => {
    const osc = ctx.createOscillator()
    const shimmer = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    shimmer.type = 'sine'
    osc.frequency.value = freq
    shimmer.frequency.value = freq * 3.01
    const shimmerGain = ctx.createGain()
    shimmerGain.gain.value = 0.12
    gain.gain.setValueAtTime(0, when)
    gain.gain.linearRampToValueAtTime(volume, when + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + length)
    osc.connect(gain)
    shimmer.connect(shimmerGain).connect(gain)
    gain.connect(master)
    gain.connect(delay)
    osc.start(when)
    shimmer.start(when)
    osc.stop(when + length)
    shimmer.stop(when + length)
  }

  const midi = (m) => 440 * 2 ** ((m - 69) / 12)
  // ля минор — фа мажор — до мажор — соль мажор, мелодия поверх арпеджио
  const chords = [
    [45, 57, 60, 64, 69],
    [41, 57, 60, 65, 69],
    [48, 55, 60, 64, 67],
    [43, 55, 59, 62, 67],
  ]
  const melody = [76, 72, 69, 72, 74, 72, 67, 71]
  const beat = 0.62
  let bar = 0
  let next = 0
  let timer = null

  const schedule = () => {
    while (next < ctx.currentTime + 1.5) {
      const chord = chords[bar % chords.length]
      note(midi(chord[0]), next, 0.09, 4.5)
      const order = [1, 2, 3, 4, 3, 2]
      order.forEach((n, i) => note(midi(chord[n]), next + i * beat, 0.05))
      note(midi(melody[bar % melody.length]), next, 0.075, 3.4)
      if (bar % 2) note(midi(melody[(bar + 3) % melody.length]), next + 3 * beat, 0.055, 3)
      next += 6 * beat
      bar += 1
    }
  }

  return {
    play() {
      ctx.resume()
      if (next < ctx.currentTime) next = ctx.currentTime + 0.1
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.75, ctx.currentTime + 2)
      if (!timer) {
        schedule()
        timer = setInterval(schedule, 500)
      }
    },
    pause() {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
      clearInterval(timer)
      timer = null
    },
  }
}
