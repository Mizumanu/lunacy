// js/quests/daily/picker.js
import { dailyQuests } from './index.js'
import { state, persist } from '../../core/engine.js'
import { log } from '../../util/index.js'

function hasCrossed4am(lastISO) {
  if (!lastISO) return true
  const last = new Date(lastISO)
  const now = new Date()
  // same-day but before-4 AM -> after-4 AM should pick
  if (now.getDate() === last.getDate()) {
    return last.getHours() < 4 && now.getHours() >= 4
  }
  // different day -> always pick
  return now.getDate() !== last.getDate()
}

function _pickTodaysDaily() {
  const lastISO = state.lastDailyPick
  if (!hasCrossed4am(lastISO)) return state.todayDaily

  // if it’s the same day but our saved list includes an ID that no longer exists,
  // force a re-pick instead of reusing the stale list
  if (
    !hasCrossed4am(lastISO) &&
    state.todayDaily &&
    !state.todayDaily.every((q) => dailyQuests.some((d) => d.id === q.id))
  ) {
    // fall through to re-pick
  } else if (!hasCrossed4am(lastISO)) {
    return state.todayDaily
  }

  // enforce “one per group” while picking 4
  const pool = [...dailyQuests]
  const today = []
  const usedGroups = new Set()

  while (today.length < 4 && pool.length) {
    // pick a random candidate
    const idx = Math.floor(Math.random() * pool.length)
    const candidate = pool.splice(idx, 1)[0]

    // if we haven’t used its group, accept it
    if (!usedGroups.has(candidate.group)) {
      today.push(candidate)
      usedGroups.add(candidate.group)
    }
    // otherwise skip it and loop again
  }

  state.todayDaily = today
  state.lastDailyPick = new Date().toISOString()

  // ── DEBUG ──
  log(
    '🕵️ pickTodaysDaily → todayDaily IDs:',
    today.map((q) => q.id),
  )

  return today
}
export const pickTodaysDaily = persist(_pickTodaysDaily)
