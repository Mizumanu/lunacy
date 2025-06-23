// js/quests/side/side-helpers.js

// 1) Pull in all quests, then filter side-quests
import { sideQuests } from './index.js'
// 2) Engine helpers: state, persistence, XP & skill
import { state, updateXP, applySkillReward, persist, isQuestUnlocked } from '../../core/engine.js'

import { notifyWait, capitalize } from '../../util/index.js'

function _startSideQuest(key) {
  // 1) look at the splash/introduction step
  const splash = sideQuests[key]?.[0]
  // 2) don't even start if player's level is too low
  if (!isQuestUnlocked(splash, state.currentLevel)) return

  state.sideQuestIndex = key
  if (!(key in state.sideProgress)) {
    state.sideProgress[key] = 0
  }
  state.__justStartedSideQuest = true
}

export const startSideQuest = persist(_startSideQuest)

async function _advanceSideStep() {
  const key = state.sideQuestIndex
  if (!key) return
  const idx = state.sideProgress[key] ?? 0
  const steps = sideQuests[key]
  if (!steps) return // Defensive

  const step = steps[idx]

  if (idx === steps.length - 1) {
    // Award rewards
    if (step.rewardXP) updateXP(step.rewardXP)
    if (step.skillReward) applySkillReward(step.skillReward)

    // Mark completed and reset quest index
    if (!state.sideCompleted.includes(key)) state.sideCompleted.push(key)
    state.sideQuestIndex = null
    state.sideProgress[key] = idx // stays at last step
    // No need to reset sideStepIndex (it's gone!)
    const lines = []
    lines.push(`+${step.rewardXP || 0} XP`)
    if (step.skillReward) {
      for (const [skill, amt] of Object.entries(step.skillReward)) {
        lines.push(`+${amt} ${capitalize(skill)}`)
      }
    }
    await notifyWait(`Side Quest Complete!<br>` + lines.join('<br>'))
  } else {
    state.sideProgress[key] = idx + 1
  }
}
export const advanceSideStep = persist(_advanceSideStep)

// Get the current step object, or null if none
export function getCurrentSideStep() {
  const key = state.sideQuestIndex
  const idx = key ? (state.sideProgress[key] ?? 0) : 0
  return key && sideQuests[key] ? sideQuests[key][idx] : null
}
