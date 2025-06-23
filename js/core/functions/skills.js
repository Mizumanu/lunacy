// js/core/functions/skills.js
import { state, persist } from './state.js'
import { getRankIndex } from '../../util/index.js'
import { rankCaps, rankLetters } from '../data.js'
import { getSlot } from './questFunctions.js'

// Build radar‐chart data from your skill buckets.
export function getSkillsRadarData(configs) {
  return configs.map(({ skills: keys, labels }) => {
    const xpArr = keys.map((k) => state.skills[k] || 0)
    const ranks = xpArr.map((xp) => getRankIndex(xp, rankCaps))
    const base = rankCaps[Math.min(...ranks)]
    const values = xpArr.map((xp) => (xp / base) * 100)
    const labelled = labels.map((lab, i) => `${lab} (${rankLetters[ranks[i]]})`)
    return { values, labels: labelled }
  })
}

function _applySkillReward(reward) {
  for (const [skill, amt] of Object.entries(reward)) {
    state.skills[skill] = (state.skills[skill] || 0) + amt
  }
}
export const applySkillReward = persist(_applySkillReward)

function _updateStepProgress(stepIdx) {
  const slot = getSlot()
  if (!slot) return
  const qi = slot.currentQuestIndex
  slot.progress[qi] = slot.progress[qi] || []
  if (!slot.progress[qi].includes(stepIdx)) {
    slot.progress[qi].push(stepIdx)
  }
}
export const updateStepProgress = persist(_updateStepProgress)

// function _updateUrgentProgress(stepIdx) {
//   const stage = state.urgentQuestIndex;
//   if (stage === null) return;
//   const arr = state.urgentProgress[stage] || [];
//   if (!arr.includes(stepIdx)) {
//     arr.push(stepIdx);
//     state.urgentProgress[stage] = arr;
//   }
// }
// export const updateUrgentProgress = persist(_updateUrgentProgress);

// js/core/functions/skills.js

// ─────────────────────────────────────────────────────────────────────────
// CATEGORY MAP: which of the 18 skills belong to each top‐level category
// Note: Adjust these arrays if your category → skill grouping changes.
export const CATEGORY_MAP = {
  Main: ['writing', 'research', 'outreach', 'analysis', 'sales', 'binge'],
  Important: ['prompt', 'english', 'sleep'],
  Efficiency: ['speedtyping', 'speedreading', 'thinking', 'ultralearning', 'superbinging'],
  Health: ['physical', 'nutrition', 'mental'],
}

// We assume rankCaps (imported above) defines the maximum XP for an S‐rank skill
// (i.e. the highest XP threshold among all ranks). That will be the "100%" baseline.
const MAX_SKILL_XP = Math.max(...rankCaps) // e.g. 10000

/**
 * Returns an array of 4 percentages (0–100), in the order:
 *   [ MainPercent, ImportantPercent, EfficiencyPercent, HealthPercent ]
 *
 * Each category’s value = ( sum_of_category_skill_XP / (number_of_skills_in_category * MAX_SKILL_XP) ) * 100
 */
export function getAllCategoryStats(skillsObj = state.skills) {
  // Ensure the categories come back in the same order every time:
  const categoryNames = ['Main', 'Important', 'Efficiency', 'Health']

  return categoryNames.map((catName) => {
    // Sum the XP of all skills in this category
    const skillKeys = CATEGORY_MAP[catName]
    const sumXP = skillKeys.reduce((acc, key) => {
      return acc + (skillsObj[key] || 0)
    }, 0)

    // Maximum possible XP for this category = count_of_skills * MAX_SKILL_XP
    const maxCategoryXP = skillKeys.length * MAX_SKILL_XP

    // Convert to percentage (0–100), rounded to an integer
    const pct = (sumXP / maxCategoryXP) * 100
    return Math.round(pct)
  })
}

// The labels we’ll pass to our rhombus chart must match this same order:
export const CATEGORY_LABELS = ['Main', 'Important', 'Efficiency', 'Health']
// ─────────────────────────────────────────────────────────────────────────
