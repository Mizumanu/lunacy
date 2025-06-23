// js/util/util-import-check.test.js

import fs from 'fs'
import path from 'path'

const TARGETS = [
  'util/bonus.js',
  'util/dom.js',
  'util/debug.js',
  'util/rank.js',
  'util/strings.js',
  'util/timer.js',
]

const JS_DIR = path.join(process.cwd(), 'js')
const UTIL_SEG = `${path.sep}util${path.sep}`

function walk(dir) {
  return fs.readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return fs.statSync(full).isDirectory() ? walk(full) : full.endsWith('.js') ? [full] : []
  })
}

const files = walk(JS_DIR)
  // skip the util folder itself (so util/index.js and its tests aren't checked)
  .filter((f) => !f.includes(UTIL_SEG))
  // skip all test files
  .filter((f) => !f.endsWith('.test.js'))

describe('❌ Direct imports from util modules instead of util/index.js', () => {
  // ensure at least one test even if no files found
  if (files.length === 0) {
    test('no JS files to check', () => {})
  }

  files.forEach((file) => {
    const rel = path.relative(JS_DIR, file)
    const raw = fs.readFileSync(file, 'utf8')
    // strip out JS comments (both /*…*/ and //…)
    const src = raw.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')

    TARGETS.forEach((tgt) => {
      if (src.includes(tgt)) {
        test(`⛔ ${rel} imports "${tgt}" directly`, () => {
          throw new Error(`Use util/index.js instead of importing ${tgt} in ${rel}`)
        })
      }
    })
  })

  // baseline so suite never runs empty
  test('all util imports are via util/index.js only', () => {
    // any direct imports would have generated their own failing test
  })
})
