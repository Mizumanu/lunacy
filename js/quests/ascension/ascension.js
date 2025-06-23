// js/quests/ascension/ascension.js
import { state } from '../../core/engine.js'
import { useItem } from '../../ui/inventory.js'
import { ascensionQuests } from './index.js' // Import for timer
import { playerRankLetters, playerRankRewards } from '../../core/data.js' // add at top if not already

/**
 * Raw helpers that operate directly on `state`.
 * We will wrap these with `persist(...)` in core/functions/state.js (or a dedicated core/functions/ascension.js).
 */

/** Begins a new ascension trial. */

export function _startAscension(index, keyName) {
  useItem(keyName)
  state.ascensionQuestIndex = index
  state.ascensionProgress[index] = -1 // -1 = splash, 0 = first trial
  // const quest = ascensionQuests[index];
  // state.ascensionDeadline = Date.now() + ((quest.timer || 0) * 1000);
  console.log('Ascension quest started:', index)
}

/** Mark off a single micro-step in the current ascension trial. */
export function _updateAscensionProgress(stepIdx) {
  const idx = state.ascensionQuestIndex
  if (idx === null) return
  const arr = state.ascensionProgress[idx] || []
  if (!arr.includes(stepIdx)) {
    arr.push(stepIdx)
    state.ascensionProgress[idx] = arr
  }
}

/** When the very last trial is done, “retire” this ascension quest. */
// export function _completeAscension() {
//   state.ascensionQuestIndex = null;
//   state.ascensionProgress = {};
//   state.ascensionDeadline = null;
//   state.ascensionDone = true;
// }

// Note: We do NOT wrap these here. Instead, core/functions/state.js (or a new core/functions/ascension.js) will do:
//   export const startAscension       = persist(_startAscension);
//   export const updateAscensionProgress = persist(_updateAscensionProgress);
//   export const completeAscension    = persist(_completeAscension);

// In _completeAscension (AFTER all existing logic):

export function _completeAscension() {
  const idx = state.ascensionQuestIndex

  // retire this quest
  state.ascensionQuestIndex = null
  state.ascensionProgress = {}
  state.ascensionDeadline = null
  state.ascensionCompleted[idx] = true

  // --- NEW LOGIC: award rank points based on quest.rank ---
  const quest = ascensionQuests[idx]
  let rankIdx = 0
  if (quest && quest.rank) {
    rankIdx = playerRankLetters.indexOf(quest.rank.toUpperCase())
  }
  const reward = playerRankRewards[rankIdx] || 0
  state.playerRank = (state.playerRank || 0) + reward
}
