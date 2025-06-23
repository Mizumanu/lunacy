// js/core/functions/state.js

// The game’s state object
export const state = {
  currentXP: 0,
  currentLevel: 1,
  currentTab: 'all',
  ascensionQuestIndex: null,
  ascensionProgress: {},
  ascensionCompleted: {},
  ascensionDeadline: null,
  ascensionCooldown: {
    active: false,
    endsAt: 0,
  },
  sideQuestIndex: null,
  sideProgress: {},
  sideCompleted: [],
  inventory: [],
  mainQuests: {},
  activeLead: '',
  playerRank: 0,
  skills: {
    writing: 0,
    research: 0,
    outreach: 0,
    analysis: 0,
    sales: 0,
    binge: 0,
    prompt: 0,
    sleep: 0,
    english: 0,
    speedtyping: 0,
    speedreading: 0,
    ultralearning: 0,
    superbinging: 0,
    thinking: 0,
    physical: 0,
    mental: 0,
    nutrition: 0,
  },
  xpMultipliers: {}, // preserved for any future logic
  unlockedAscensions: [],
}

export function saveState() {
  localStorage.setItem('gameState', JSON.stringify(state))
}

export function loadState() {
  const raw = localStorage.getItem('gameState')
  if (!raw) return
  try {
    Object.assign(state, JSON.parse(raw))
  } catch (err) {
    console.error('Failed to parse gameState:', err)
  }
}
loadState()

export function persist(fn) {
  return function (...args) {
    const result = fn(...args)
    saveState()
    return result
  }
}

// ─────────────────────────────────────────────
// Ascension mutators have been moved to ascension.js:
// (we now re‐export them below)
//
//   import { startAscension, updateAscensionProgress, completeAscension } from './ascension.js';
//   export { startAscension, updateAscensionProgress, completeAscension };
// ─────────────────────────────────────────────
// js/core/functions/state.js

// ─── Import and wrap the three raw ascension helpers ───
import {
  _startAscension,
  _updateAscensionProgress,
  _completeAscension,
} from '../../quests/ascension/ascension.js'

export const startAscension = persist(_startAscension)
export const updateAscensionProgress = persist(_updateAscensionProgress)
export const completeAscension = persist(_completeAscension)

// … rest of your setActiveDaily, setSideQuestIndex, advanceMainQuest, etc. …

// ─────────────────────────────────────────────
// (other mutators for daily/side/main, etc.—unchanged)
// ─────────────────────────────────────────────

function _setActiveDaily(id) {
  state.activeDaily = id
}
function _clearActiveDaily() {
  state.activeDaily = null
}
function _setSideQuestIndex(idx) {
  state.sideQuestIndex = idx
}
function _addCompletedDaily(id) {
  state.completedDaily.push(id)
}
function _setCurrentTab(tab) {
  state.currentTab = tab
}
function _advanceMainQuest() {
  const slot = state.mainQuests[state.activeLead]
  const next = slot.currentQuestIndex + 1
  slot.currentQuestIndex = next
  slot.progress[next] = []
}

export const setActiveDaily = persist(_setActiveDaily)
export const clearActiveDaily = persist(_clearActiveDaily)
export const setSideQuestIndex = persist(_setSideQuestIndex)
export const addCompletedDaily = persist(_addCompletedDaily)
export const setCurrentTab = persist(_setCurrentTab)
export const advanceMainQuest = persist(_advanceMainQuest)
