/**
 * Gera os derivados das imagens de `public/` usados no site.
 *
 *   npm run images
 *
 * Rode de novo sempre que uma imagem original mudar; os arquivos gerados
 * ficam versionados junto com o original.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
/** Arte original da marca: fica fora de `public/` para não ir ao build. */
const DESIGN_DIR = path.join(process.cwd(), 'design')

const read = (file) => readFile(path.join(PUBLIC_DIR, file))

async function save(file, data) {
  await writeFile(path.join(PUBLIC_DIR, file), data)
  console.log(`${file} — ${(data.length / 1024).toFixed(1)} KiB`)
}

/**
 * A logo oficial é verde escuro e some no cabeçalho e no rodapé, que têm fundo
 * verde. Esta versão repinta a mesma arte de branco, preservando o recorte.
 */
async function whiteVersion(input) {
  const { width, height } = await sharp(input).metadata()
  const alpha = await sharp(input).ensureAlpha().extractChannel('alpha').toBuffer()

  return sharp({
    create: { width, height, channels: 3, background: '#ffffff' },
  })
    .joinChannel(alpha)
    .webp({ quality: 90 })
    .toBuffer()
}

/** Imagem de compartilhamento: fundo branco, porque transparência vira preto lá. */
async function shareImage(logo) {
  const mark = await sharp(logo).resize({ width: 760 }).toBuffer()

  return sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#ffffff' },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .webp({ quality: 88 })
    .toBuffer()
}

/**
 * Ícone da aba: só o símbolo da copa, que fica acima do texto da marca.
 * O recorte é medido na própria arte — a primeira linha que tem tinta encostada
 * na borda marca onde o texto começa; acima dela existe só o símbolo, e a linha
 * mais larga dessa faixa dá o centro e o diâmetro.
 */
async function faviconSymbol(logo) {
  const { data, info } = await sharp(logo)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const alphaAt = (x, y) => data[(y * info.width + x) * 4 + 3]
  const hasInk = (x, y) => alphaAt(x, y) > 16

  // Enquanto a linha tiver um único traço contíguo, ela ainda é só o símbolo;
  // quando as letras entram, a linha passa a ter vários traços separados.
  let best = { width: 0, left: 0 }
  for (let y = 0; y < info.height; y += 1) {
    let min = -1
    let max = -1
    let runs = 0
    let inside = false

    for (let x = 0; x < info.width; x += 1) {
      const ink = hasInk(x, y)
      if (ink && !inside) {
        runs += 1
        if (min < 0) min = x
      }
      if (ink) max = x
      inside = ink
    }

    if (runs === 0) continue // linha vazia acima do símbolo
    if (runs > 1) break
    if (max - min + 1 > best.width) {
      best = { width: max - min + 1, left: min }
    }
  }

  // Máscara circular: descarta a haste do "T", que desce para fora do disco.
  const mask = Buffer.from(
    `<svg width="96" height="96"><circle cx="48" cy="48" r="48" fill="#fff"/></svg>`,
  )

  const disc = await sharp(logo)
    .extract({ left: best.left, top: 0, width: best.width, height: best.width })
    .resize(96, 96)
    .toBuffer()

  return sharp(disc)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ palette: true })
    .toBuffer()
}

/** Larguras que cobrem o mobile (1x/2x) e o desktop. */
const SOURCES = [
  { file: 'img/garoto-fone.webp', widths: [480, 720] },
  { file: 'img/garoto-note.webp', widths: [480, 720] },
  { file: 'Logo-branca.webp', widths: [180, 320] },
]

const logo = await readFile(path.join(DESIGN_DIR, 'Logo.webp'))
await save('Logo-branca.webp', await whiteVersion(logo))
await save(
  'Logo-320.webp',
  await sharp(logo).resize({ width: 320 }).webp({ quality: 82 }).toBuffer(),
)
await save('og-image.webp', await shareImage(logo))
await save('favicon.png', await faviconSymbol(logo))

for (const { file, widths } of SOURCES) {
  const input = await read(file)

  for (const width of widths) {
    const output = file.replace(/\.webp$/, `-${width}.webp`)
    const data = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()

    await save(output, data)
  }
}
