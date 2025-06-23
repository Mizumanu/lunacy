// js/core/functions/questFunctions.js
import { state, persist } from './state.js'
import { quests, rankCaps } from '../data.js'
import { updateXP } from './xp.js'
import { isQuestUnlocked } from '../unlock.js'
import { notify } from '../notifications.js'
import { NOTIFY } from '../../ui/text.js'
import { CATEGORY_MAP } from './skills.js'
import { ascensionQuests } from '../../quests/ascension/index.js'

export function getSlot() {
  if (!state.activeLead) {
    const names = Object.keys(state.mainQuests)
    state.activeLead = names[0] || ''
  }
  if (!state.mainQuests[state.activeLead]) return null
  return state.mainQuests[state.activeLead]
}

export function getCurrentQuest() {
  // Don’t return a main quest if a special quest is active
  if (
    state.ascensionQuestIndex !== null ||
    state.sideQuestIndex !== null ||
    state.activeDaily !== null
  ) {
    return null
  }
  const slot = getSlot()
  if (!slot) {
    console.log(
      'No main quest slot for active lead:',
      state.activeLead,
      'state.mainQuests:',
      state.mainQuests,
    )
    return null
  }
  const qi = slot.currentQuestIndex
  const q = quests[qi]
  return {
    ...q,
    progress: slot.progress[qi] || [],
  }
}

function _completeQuest() {
  const slot = getSlot()
  if (!slot) return null
  const qi = slot.currentQuestIndex
  const q = quests[qi]

  // ── “Splash” check unchanged
  if (!Array.isArray(q.microSteps)) {
    const nextIndex = (qi + 1) % quests.length
    slot.currentQuestIndex = nextIndex
    slot.progress[nextIndex] = []
    return getCurrentQuest()
  }

  // 1) First, distribute any single‐skill rewards
  for (const [key, val] of Object.entries(q.skillReward)) {
    const beforeXP = state.skills[key] || 0
    const afterXP = beforeXP + val
    state.skills[key] = afterXP
  }

  // 2) Now compute the *integer‐floor* of the average “main” skills, before & after
  //    so we can see if the average just hit the E‐rank threshold (rankCaps[0]).
  // function computeMainAverage() {
  //   const sum = MAIN_SKILLS.reduce((acc, skillName) => {
  //     return acc + (state.skills[skillName] || 0);
  //   }, 0);
  //   // take floor of average
  //   return Math.floor(sum / MAIN_SKILLS.length);
  // }

  // But we need “before” & “after.”
  // We only changed exactly those skills in q.skillReward, so:
  //   - “beforeAverage” = average computed with each skill's old value
  //   - “afterAverage”  = average computed with each skill's new value (i.e. state.skills[...] already updated)
  // 1) compute before/after *for each category*
  const categoryNames = ['Main', 'Important', 'Efficiency', 'Health']
  const beforeMap = {}
  const afterMap = {}

  // record “before” for each category
  for (let cat of categoryNames) {
    const keys = CATEGORY_MAP[cat]
    const sumBefore = keys.reduce(
      (sum, sk) => sum + ((state.skills[sk] || 0) - (q.skillReward[sk] || 0)),
      0,
    )
    beforeMap[cat] = Math.floor(sumBefore / keys.length)
  }
  // apply your q.skillReward to state.skills here…
  const afterRaw = (keys) => keys.reduce((sum, sk) => sum + (state.skills[sk] || 0), 0)
  for (let cat of categoryNames) {
    const keys = CATEGORY_MAP[cat]
    afterMap[cat] = Math.floor(afterRaw(keys) / keys.length)
  }

  // 2) for each ascension quest that isn’t yet completed, fire unlock
  ascensionQuests.forEach((ascQ, i) => {
    const cat = ascQ.skillCategory.charAt(0).toUpperCase() + ascQ.skillCategory.slice(1)
    if (
      !state.ascensionCompleted[i] &&
      beforeMap[cat] < rankCaps[0] &&
      afterMap[cat] >= rankCaps[0]
    ) {
      notify(NOTIFY.ascendUnlocked)
    }
  })

  // 4) Award XP & compute new level (unchanged)
  const { level } = updateXP(q.rewardXP)

  // 5) Find next quest, check lock, etc. (unchanged)
  const nextIndex = (qi + 1) % quests.length
  const nextQ = quests[nextIndex]
  if (!Array.isArray(nextQ.microSteps)) {
    slot.currentQuestIndex = nextIndex
    slot.progress[nextIndex] = []
    return getCurrentQuest()
  }
  if (!isQuestUnlocked(nextQ, level)) {
    const msg =
      `“${nextQ.title}” unlocks at level ${nextQ.unlock.level}` +
      (nextQ.unlock.date ? ` on ${new Date(nextQ.unlock.date).toLocaleDateString()}` : '')
    notify(msg)
    return getCurrentQuest()
  }
  slot.currentQuestIndex = nextIndex
  slot.progress[nextIndex] = []
  return getCurrentQuest()
}

export const completeQuest = persist(_completeQuest)

// 5) Lead helpers
function _createLead(name) {
  if (!name.trim() || state.mainQuests[name]) return false
  state.mainQuests[name] = {
    currentQuestIndex: 0,
    progress: {},
  }
  state.activeLead = name
  return true
}
export const createLead = persist(_createLead)

function _switchLead(name) {
  if (!state.mainQuests[name]) return false
  state.activeLead = name
  return true
}
export const switchLead = persist(_switchLead)
