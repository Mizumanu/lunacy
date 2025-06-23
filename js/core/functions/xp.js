// js/core/functions/xp.js
import { levelUpXP } from '../data.js'
import { notify } from '../notifications.js'
import { state, persist } from './state.js'

function _updateXP(gainedXP = 0, skillRewards = {}) {
  const beforeLv = state.currentLevel
  let xp = state.currentXP + gainedXP
  let lvl = state.currentLevel

  while (xp >= levelUpXP[lvl]) {
    xp -= levelUpXP[lvl]
    lvl++
  }

  state.currentXP = xp
  state.currentLevel = lvl

  if (lvl > beforeLv) {
    notify('<em>You leveled up!</em>')
  }

  // After you compute raw xp, scale by any multipliers:
  const totalMultiplier = Object.entries(skillRewards).reduce(
    (m, [sk, _amt]) => m * (state.xpMultipliers?.[sk] || 1),
    1,
  )
  xp = Math.floor(xp * totalMultiplier)
  return { level: lvl, xp, nextXp: levelUpXP[lvl] }
}

export const updateXP = persist(_updateXP)
