import fs from 'fs';
import path from 'path';

const TARGETS = [
  'functions/questFunctions.js',
  'functions/skills.js',
  'functions/state.js',
  'functions/xp.js',
  'unlock.js',
  'notifications.js'
];

const JS_DIR = path.resolve('./js');

function walk(dir) {
  const result = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      result.push(...walk(full));
    } else if (file.endsWith('.js')) {
      result.push(full);
    }
  }
  return result;
}

function fixFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;

  for (const target of TARGETS) {
    const regex = new RegExp(`(['"\`])\\.\\.?/core/${target.replace('.', '\\.')}\\1`, 'g');

    if (regex.test(content)) {
      content = content.replace(regex, `'../core/engine.js'`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Fixed imports in: ${path.relative('.', filepath)}`);
  }
}

function runFixer() {
  const files = walk(JS_DIR);
  for (const file of files) {
    fixFile(file);
  }
}

runFixer();