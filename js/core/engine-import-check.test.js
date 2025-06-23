import fs from 'fs'
import path from 'path'

const TARGETS = [
  'functions/questFunctions.js',
  'functions/skills.js',
  'functions/state.js',
  'functions/xp.js',
  'unlock.js',
  'notifications.js',
]

const JS_DIR = path.join(process.cwd(), 'js')
const CORE_SEG = `${path.sep}core${path.sep}`

function walk(dir) {
  return fs.readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return fs.statSync(full).isDirectory() ? walk(full) : full.endsWith('.js') ? [full] : []
  })
}

const files = walk(JS_DIR)
  .filter((f) => !f.includes(CORE_SEG)) // skip core/*
  .filter((f) => !f.endsWith('.test.js')) // skip tests

describe('❌ Direct imports from core modules instead of engine.js', () => {
  // ensure at least one test even if no files found
  if (files.length === 0) {
    test('no JS files to check', () => {})
  }
  files.forEach((file) => {
    const rel = path.relative(JS_DIR, file)
    const raw = fs.readFileSync(file, 'utf8')
    // strip out JS comments (both /*…*/ and //…)
    const src = raw.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')
    // re-check each forbidden target
    TARGETS.forEach((tgt) => {
      if (src.includes(tgt)) {
        test(`⛔ ${rel} imports "${tgt}" directly`, () => {
          throw new Error(`Use engine.js instead of importing ${tgt} in ${rel}`)
        })
      }
    })
  })
  // baseline test so suite never runs empty
  test('all imports are via engine.js only', () => {
    // if any forbidden import existed, it'd have generated its own failing test
  })
})
