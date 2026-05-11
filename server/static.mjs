/**
 * Phục vụ thư mục `dist/` (bản production của Vite) — tệp tĩnh + fallback SPA.
 * Không có API, không database; dùng để chạy bản build giống host tĩnh.
 *
 * Trước khi chạy: `npm run build`
 * Chạy: `npm start` hoặc `node server/static.mjs`
 * Cổng: biến môi trường PORT (mặc định 4173)
 */
import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(__dirname, '..', 'dist')
const PORT = Number(process.env.PORT ?? 4173)

/**
 * @param {string} base
 * @param {string} candidate
 */
function isUnderDir(base, candidate) {
  const b = path.resolve(base)
  const c = path.resolve(candidate)
  const rel = path.relative(b, c)
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

/** @param {string} ext */
function mime(ext) {
  const m = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json; charset=utf-8',
  }
  return m[/** @type {keyof typeof m} */ (ext)] ?? 'application/octet-stream'
}

/**
 * @param {string} base
 * @param {...string} segments
 */
function safeResolve(base, ...segments) {
  const resolved = path.resolve(base, ...segments)
  if (!isUnderDir(base, resolved)) return null
  return resolved
}

/**
 * @param {string} pathname
 */
function looksLikeAsset(pathname) {
  return /\.\w{1,8}$/.test(pathname)
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' })
    res.end()
    return
  }

  const host = req.headers.host ?? 'localhost'
  const url = new URL(req.url ?? '/', `http://${host}`)
  let pathname = decodeURIComponent(url.pathname)
  if (pathname.includes('\0')) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Bad request\n')
    return
  }

  if (!pathname.startsWith('/')) pathname = `/${pathname}`

  const relative = pathname === '/' ? 'index.html' : pathname.slice(1)
  let filePath = safeResolve(dist, ...relative.split('/'))

  /** @type {string | null} */
  let toServe = null

  if (filePath) {
    try {
      const st = await fs.stat(filePath)
      if (st.isFile()) toServe = filePath
      else if (st.isDirectory()) {
        const idx = path.join(filePath, 'index.html')
        try {
          await fs.access(idx)
          toServe = idx
        } catch {
          toServe = null
        }
      }
    } catch {
      toServe = null
    }
  }

  if (!toServe) {
    if (looksLikeAsset(pathname)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Not found\n')
      return
    }
    const indexHtml = safeResolve(dist, 'index.html')
    try {
      if (!indexHtml) throw new Error('escape')
      await fs.access(indexHtml)
      toServe = indexHtml
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Chưa có dist/index.html — chạy `npm run build` trước.\n')
      return
    }
  }

  try {
    const body = await fs.readFile(toServe)
    const ext = path.extname(toServe)
    res.writeHead(200, { 'Content-Type': mime(ext) })
    if (req.method === 'HEAD') res.end()
    else res.end(body)
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Lỗi đọc file\n')
  }
}

http.createServer(handler).listen(PORT, () => {
  console.log(`Static server (dist/) tại http://localhost:${PORT}`)
})
