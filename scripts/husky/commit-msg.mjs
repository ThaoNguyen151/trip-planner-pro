/**
 * Commitlint qua `node …/cli.js` — không dùng `npx` (dễ kích hoạt bash sai trên Windows/WSL).
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const arg = process.argv[2]

if (!arg) {
  console.error('commit-msg: thiếu đường dẫn file message (đối số $1).')
  process.exit(1)
}

const msgPath = path.isAbsolute(arg)
  ? path.normalize(arg)
  : path.join(root, arg.replace(/^[\\/]+/, ''))

const cli = path.join(root, 'node_modules', '@commitlint', 'cli', 'cli.js')
const r = spawnSync(process.execPath, [cli, '--edit', msgPath], {
  cwd: root,
  stdio: 'inherit',
  shell: false,
  env: process.env,
})

if (r.error) {
  console.error(r.error)
  process.exit(1)
}

if (r.status === 0) {
  process.exit(0)
}

console.log(`
Invalid Commit Message Format
----------------------------------------------------
Examples of valid commits:
   feat: add login page
   fix: resolve navigation bug
   chore: update dependencies
   perf: optimize performance
   test: add unit tests
   build: update build process
   ci: update CI/CD pipeline
   revert: revert previous commit
   docs: update documentation
   style: update code style
   refactor: refactor code
----------------------------------------------------
`)
process.exit(1)
