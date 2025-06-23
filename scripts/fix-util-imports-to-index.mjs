#!/usr/bin/env node
// scripts/fix-util-imports-to-index.mjs

import fs from 'fs'
import path from 'path'

// List of util modules (filenames) to redirect into util/index.js
const TARGETS = [
  'bonus.js',
  'dom.js',
  'debug.js',
  'rank.js',
  'strings.js',
  'timer.js',
]

// Root of your JS source
const JS_DIR = path.resolve('./js')

// Walk the directory tree and collect all .js files except anything under js/util/
function walk(dir) {
  return fs.readdirSync(dir).flatMap(name => {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) {
      // skip the util folder itself
      if (path.basename(full) === 'util') return []
      return walk(full)
    }
    return name.endsWith('.js') ? [full] : []
  })
}

function fixFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8')
  let changed = false

  for (const target of TARGETS) {
    // Build a regex that matches import paths ending with util/<target>
    // e.g. import { foo } from '../util/debug.js'
    const re = new RegExp(
      `(from\\s+['"\`])(.+?/)?util/${target}(['"\`])`,
      'g'
    )

    if (re.test(content)) {
      content = content.replace(
        re,
        `$1$2util/index.js$3`
      )
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8')
    console.log(`✅ Fixed util imports in: ${path.relative(process.cwd(), filepath)}`)
  }
}

function runFixer() {
  const files = walk(JS_DIR)
  for (const file of files) {
    fixFile(file)
  }
}

runFixer()