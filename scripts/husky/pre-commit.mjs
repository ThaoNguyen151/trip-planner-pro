/**
 * Chạy lint-staged qua API Node (không gọi `npx`/shell) — tránh lỗi WSL/bash khi commit từ IDE.
 */
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const { default: lintStaged } = await import('lint-staged')
const ok = await lintStaged({ cwd: root })

process.exit(ok ? 0 : 1)
