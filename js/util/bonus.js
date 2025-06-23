// js/util/bonus.js

import { rankCaps, rankLetters } from '../core/data.js'
import { clearActiveDaily } from '../core/engine.js'

import { notify } from '../core/engine.js'

import { warn } from './debug.js'

export function getRankIndex(value, caps) {
  for (let i = 0; i < caps.length; i++) {
    if (value <= caps[i]) return i
  }
  return caps.length - 1
}

/** Returns the “next” rank letter (E→D→C→B→A→S) */
export function nextRank(rank) {
  const order = ['E', 'D', 'C', 'B', 'A', 'S']
  const idx = order.indexOf(rank.toUpperCase())
  return idx === -1 || idx === order.length - 1 ? rank : order[idx + 1]
}

export function getLowestRank(skills) {
  // 1) Convert each XP value to its rank‐index, then to a letter
  const ranks = Object.values(skills).map((xp) => {
    const idx = getRankIndex(xp, rankCaps)
    return rankLetters[idx]
  })

  // 2) Find the lowest letter (E is lowest in rankLetters order)
  const order = rankLetters // ['E','D','C','B','A','S']
  const indices = ranks.map((r) => order.indexOf(r))
  const minIdx = Math.min(...indices)
  return order[minIdx] || 'E'
}

/** Roll a bonus: 70% SP, 25% key, 5% rune—with dynamic asset paths */
export function rollBonus(state) {
  // const r = Math.random() * 100
  const r = 95

  if (r < 90) {
    // ── Common: +10 XP +1 random SP
    state.currentXP = (state.currentXP || 0) + 10
    // if you track total xp differently, adjust the above line to
    // however you normally add XP: e.g. state.xp += 10 or updateXP(10)

    const skills = Object.keys(state.skills)
    const skill = skills[Math.floor(Math.random() * skills.length)]
    state.skills[skill] = (state.skills[skill] || 0) + 1

    return { tier: 'common', skill, xp: 10 }
  }

  if (r < 98) {
    // ── Rare: Ascension Key at lowest rank
    const lowest = getLowestRank(state.skills) // e.g. "E"
    const types = ['main', 'important', 'efficiency', 'health']
    const type = types[Math.floor(Math.random() * types.length)]
    // build icon path: /assets/keys/<rank>/<type><rank>.png
    const iconPath = `/assets/keys/${lowest}/${type}${lowest}.png`
    const key = { type, rank: lowest, icon: iconPath }

    state.keys = state.keys || []
    state.keys.push(key)
    return { tier: 'rare', key }
  }

  // ── Epic split: 50% next‐rank key, 50% rune stone
  if (Math.random() < 0.5) {
    // Epic Key path
    const lowest = getLowestRank(state.skills) // e.g. "E"
    const next = nextRank(lowest) // e.g. "D"
    const types = ['main', 'important', 'efficiency', 'health']
    const type = types[Math.floor(Math.random() * types.length)]
    const icon = `/assets/keys/${next}/${type}${next}.png`

    const key = { type, rank: next, icon }
    state.keys = state.keys || []
    state.keys.push(key)

    return { tier: 'epic', key }
  } else {
    // Epic Rune path
    const runeName = 'teleportStone'
    const icon = `/assets/runes/${runeName}.png`
    state.runes = state.runes || []
    state.runes.push(runeName)

    return { tier: 'epic', rune: runeName, icon }
  }
}

/**
 * Given a bonus object of shape
 *   { tier: 'common', skill: 'research' }
 *   { tier: 'rare',   key: { type, rank } }
 *   { tier: 'epic',   key: { type, rank } }
 *   { tier: 'epic',   rune: 'teleportStone' }
 * format it into HTML/text with a centered icon.
 */
export function formatBonus(bonus) {
  if (bonus.tier === 'common') {
    // if rollBonus returned an `xp` field, show it
    const xpPart = bonus.xp ? `+${bonus.xp} XP` : ''
    const spPart = `+1 ${bonus.skill}`
    // join with a <br> so your notification will read:
    //   +10 XP
    //   +1 research
    return [xpPart, spPart].filter(Boolean).join('<br>')
  }
  // …rare/epic formatting unchanged…

  // ── RARE KEY ──
  if (bonus.tier === 'rare' && bonus.key) {
    const { type, rank } = bonus.key
    const name = type[0].toUpperCase() + type.slice(1)
     const desc = `Unlocks ${rank}-rank ${type} ascension quests.`
      return `
        <img
          src="/assets/keys/${rank}/${type}${rank}.png"
          alt="${name} (${rank}) Key"
          style="width:48px;display:block;margin:0.5rem auto;"
        >
       <strong>${name} (${rank}) Key</strong><br>
       <small style="opacity:.75">${desc}</small>
      `
  }

  // ── EPIC KEY ──
  if (bonus.tier === 'epic' && bonus.key) {
    const { type, rank } = bonus.key
    const name = type[0].toUpperCase() + type.slice(1)
     const desc = `Unlocks ${rank}-rank ${type} ascension quests.`
      return `
        <img
          src="/assets/keys/${rank}/${type}${rank}.png"
          alt="${name} (${rank}) Key"
          style="width:48px;display:block;margin:0.5rem auto;"
        >
       <strong>${name} (${rank}) Key</strong><br>
       <small style="opacity:.75">${desc}</small>
      `
  }

  // ── EPIC RUNE ──
  if (bonus.tier === 'epic' && bonus.rune) {
    const runeName = bonus.rune[0].toUpperCase() + bonus.rune.slice(1)
    return `
      <img
        src="/assets/runes/${bonus.rune}.png"
        alt="${runeName} Rune"
        style="width:48px;display:block;margin:0.5rem auto;"
      >
      ${runeName} Rune
    `
  }

  // ── FALLBACK ──
  warn('formatBonus got unexpected bonus:', bonus)
  return JSON.stringify(bonus)
}
/**
 * Show two back-to-back notifications, waiting
 * for each to be dismissed (or auto-timeout)
 * before moving on.
 */
export async function twoStepDailyBonus(state, bonus) {
  // reuse the same promise-wrapper you already wired in notifications.js
  function waitNotify(msg) {
    return new Promise((resolve) => {
      const onHide = () => {
        window.removeEventListener('notify-hide', onHide)
        resolve()
      }
      window.addEventListener('notify-hide', onHide)
      notify(msg)
    })
  }

  // Step 1
  await waitNotify('🎉 You have completed today’s daily quests!')

  // Step 2
  await waitNotify(`Daily rewards:<br>${formatBonus(bonus)}`)

  // done — clear daily mode and return to main-quest view
  clearActiveDaily()
  // renderQuestList("daily");
  // showView(DOM.viewQuests);
}
/**
 * Show a notification (via the same CustomEvent) and wait N ms before resolving.
 * @param {string} msg HTML/text for the popup
 * @param {number} ms  how long to wait before continuing
 */
export function notifyWait(msg) {
  notify(msg) // use the actual queue-based system
  return new Promise((resolve) => {
    const onHide = () => {
      window.removeEventListener('notify-hide', onHide)
      resolve()
    }
    window.addEventListener('notify-hide', onHide)
  })
}

// Pops a modal with message and "Confirm" button, returns a Promise<boolean>

export function notifyConfirm(msg) {
  return new Promise((resolve) => {
    // Show the notification (hiding the OK button, since Confirm will close it)
    notify(msg + '<br><button id="confirm-btn" class="btn">Confirm</button>', {
      hideOkButton: true,
    })

    // After a brief delay (so the DOM has rendered), wire up the Confirm button:
    setTimeout(() => {
      const btn = document.getElementById('confirm-btn')
      if (!btn) return

      btn.onclick = () => {
        // 1) Programmatically click the OK button to hide immediately
        const ok = document.getElementById('notification-ok')
        if (ok) ok.click()

        // 2) Resolve our promise so the caller proceeds
        resolve(true)
      }
    }, 100)
  })
}
