// Запекает Scene.jsx в картинки. SVG из тысяч элементов телефон не может масштабировать
// при прокрутке, а готовое изображение двигает видеокарта. Запускать после правок сцены:
//   node scripts/bake-scene.mjs
// Нужны: Chrome и Python с Pillow.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const out = resolve('src/assets')
const tmp = mkdtempSync(join(tmpdir(), 'scene-'))

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { default: Scene } = await vite.ssrLoadModule('/src/components/Scene.jsx')
const svg = renderToStaticMarkup(React.createElement(Scene))
await vite.close()

// В картинке живые слои стоят в среднем положении — движение добавляет Hero.jsx
const page = join(tmp, 'scene.html')
writeFileSync(page, `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;background:#0a2b38;overflow:hidden}
  svg{display:block;width:2400px;height:1600px}
  .glow-breathe{opacity:.45}.rays{opacity:.55}.flicker{opacity:.9}
</style>${svg}`)

const png = join(tmp, 'scene.png')
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
  '--window-size=2400,1600', `--screenshot=${png}`, `file:///${page.replaceAll('\\', '/')}`,
], { stdio: 'ignore' })

// Широкая — для компьютера, узкая (центр 1200×1600) — для телефона
const py = `
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB')
print(im.size)
k = im.width / 2400
im.resize((3000, 2000), Image.LANCZOS).save(sys.argv[2] + '/scene-wide.webp', quality=86, method=6)
im.crop((int(600 * k), 0, int(1800 * k), int(1600 * k))).save(sys.argv[2] + '/scene-tall.webp', quality=86, method=6)
`
console.log(execFileSync('python', ['-P', '-c', py, png, out], { encoding: 'utf-8' }))
