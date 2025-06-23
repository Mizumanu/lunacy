// js/core/functions/skills.test.js

/**
 * @jest-environment jsdom
 */

// ── Set up a minimal DOM for notifications (imported transitively) ──
document.body.innerHTML = `
  <div id="notification-modal" class="hidden">
    <div class="modal-backdrop"></div>
    <div class="modal-content"></div>
  </div>
  <div id="notification-text"></div>
  <button id="notification-ok"></button>
`

// ── Stub out `state.js` (and its `persist`) before importing `skills.js` ──
jest.mock('./state.js', () => ({
  state: {
    skills: {},
    urgentQuestIndex: null,
    urgentProgress: {},
    mainQuests: {},
    activeLead: '',
  },
  persist: (fn) => fn, // no-op wrapper
}))

// ── Stub `getSlot` so that `updateStepProgress` has somewhere to write ──
const mockGetSlot = jest.fn()
jest.mock('./questFunctions.js', () => ({ getSlot: mockGetSlot }))

// ── Now import everything from `skills.js` ──
const { state } = require('./state.js')
const {
  getSkillsRadarData,
  applySkillReward,
  updateStepProgress,
  // NEWLY IMPORTED:
  getAllCategoryStats,
} = require('./skills.js')

describe('skills helpers', () => {
  beforeEach(() => {
    // Reset in-memory state for every test
    state.skills = { research: 0, writing: 0 }
    state.urgentQuestIndex = null
    state.urgentProgress = {}
    state.mainQuests = { lead1: { currentQuestIndex: 0, progress: {} } }
    state.activeLead = 'lead1'
    mockGetSlot.mockReturnValue(state.mainQuests.lead1)
  })

  test('getSkillsRadarData returns 0-percent bars at 0 XP', () => {
    const cfg = [{ skills: ['research', 'writing'], labels: ['R', 'W'] }]
    const out = getSkillsRadarData(cfg)
    expect(out).toHaveLength(1)
    expect(out[0].values).toEqual([0, 0]) // both zero
    expect(out[0].labels).toEqual(['R (E)', 'W (E)'])
  })

  test('applySkillReward adds once per skill only', () => {
    applySkillReward({ research: 5, writing: 2 })
    expect(state.skills.research).toBe(5) // single increment
    expect(state.skills.writing).toBe(2)
  })

  test('updateStepProgress stores unique step once', () => {
    updateStepProgress(3)
    expect(state.mainQuests.lead1.progress[0]).toEqual([3])
    updateStepProgress(3)
    expect(state.mainQuests.lead1.progress[0]).toEqual([3]) // still once
  })

  // ── NEW: Tests for getAllCategoryStats ───────────────────────────
  describe('getAllCategoryStats', () => {
    /**
     * Helper to build a “fake” skills object where every listed skill
     * key is assigned the same XP value. We include all 18 keys here.
     */
    function makeUniformSkills(xpValue) {
      return {
        writing: xpValue,
        research: xpValue,
        outreach: xpValue,
        analysis: xpValue,
        sales: xpValue,
        binge: xpValue, // 6 skills → Main

        prompt: xpValue,
        sleep: xpValue,
        english: xpValue, // 3 skills → Important

        speedtyping: xpValue,
        speedreading: xpValue,
        ultralearning: xpValue,
        superbinging: xpValue,
        thinking: xpValue, // 5 skills → Efficiency

        physical: xpValue,
        mental: xpValue,
        nutrition: xpValue, // 3 skills → Health
      }
    }

    test('returns [0,0,0,0] when all skills are 0 XP', () => {
      const zeroSkills = makeUniformSkills(0)
      const result = getAllCategoryStats(zeroSkills)
      expect(result).toEqual([0, 0, 0, 0])
    })

    test('returns [50,50,50,50] when all skills are exactly half of S-cap', () => {
      // We assume `rankCaps` is imported inside skills.js, where the max is the S-cap
      const { rankCaps } = require('../data.js')
      const S_CAP = Math.max(...rankCaps)
      const halfXP = S_CAP / 2

      const halfSkills = makeUniformSkills(halfXP)
      const result = getAllCategoryStats(halfSkills)

      // Each category’s percentage = (sum_of_category_XP)/(#skills_in_cat * S_CAP) * 100
      // Since every skill in category is half of S_CAP, the percentage = 50.
      expect(result).toEqual([50, 50, 50, 50])
    })

    test('returns [100,0,0,0] when only Main category skills are maxed to S-cap', () => {
      const { rankCaps } = require('../data.js')
      const S_CAP = Math.max(...rankCaps)

      // Build a partial skills object: Main skills = S_CAP, all others = 0
      const mixedSkills = {
        writing: S_CAP,
        research: S_CAP,
        outreach: S_CAP,
        analysis: S_CAP,
        sales: S_CAP,
        binge: S_CAP, // Main at full

        prompt: 0,
        sleep: 0,
        english: 0, // Important zero

        speedtyping: 0,
        speedreading: 0,
        ultralearning: 0,
        superbinging: 0,
        thinking: 0, // Efficiency zero

        physical: 0,
        mental: 0,
        nutrition: 0, // Health zero
      }

      const result = getAllCategoryStats(mixedSkills)
      expect(result).toEqual([100, 0, 0, 0])
    })
  })
})
