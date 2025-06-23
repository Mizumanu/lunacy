// js/quests/side/side-helpers.test.js

/**
 * @jest-environment jsdom
 */

// 1) Ensure sideQuests is non‐empty by mocking out core/data.js.
//    We provide exactly one “fake” side quest at index 0 so that tests pass.
jest.mock('../../core/data.js', () => ({
  quests: [
    {
      id: 's1-splash',
      title: 'AI Copy Critique',
      type: 'splash',
      category: 'side',
      description: 'Forge the perfect ChatGPT prompt to critique your copywriting. 6 steps await!',
      microSteps: null, // “splash” has null microSteps
      rewardXP: 0,
      skillReward: {},
      unlock: { level: 1 },
    },

    {
      id: 's1-step1',
      title: 'Step 1',
      category: 'side',
      microSteps: ['x'],
      rewardXP: 0,
      skillReward: {},
    },
    // (You can add more dummy side‐quests here if your tests reference them,
    //  but index 0 is enough for “getCurrentSideStep” tests.)
  ],
}))

// 2) Now mock out engine.js so that state, updateXP, applySkillReward, persist exist
jest.mock('../../core/engine.js', () => ({
  state: {
    sideQuestIndex: null,
    sideProgress: {},
    sideCompleted: [],
    skills: {},
    currentXP: 0,
  },
  updateXP: jest.fn(),
  applySkillReward: jest.fn(),
  persist: (fn) => fn, // no-op wrapper
  // ← NEW: stub so startSideQuest’s unlock guard doesn’t throw
  isQuestUnlocked: () => true,
}))
// 3) Mock util/index.js so that notifyWait and capitalize are defined
jest.mock('../../util/index.js', () => ({
  notifyWait: jest.fn(() => Promise.resolve()),
  capitalize: (s) => s.toUpperCase(),
}))

// 4) Now import the things under test
const { state } = require('../../core/engine.js')
const { startSideQuest, advanceSideStep, getCurrentSideStep } = require('./side-helpers')
const { sideQuests } = require('../../quests/side/index.js')

describe('side-helpers', () => {
  beforeEach(() => {
    // Reset the in-memory state before each test
    state.sideQuestIndex = null
    state.sideProgress = {}
    state.sideCompleted = []
    state.skills = {}
    state.currentXP = 0
  })

  test('startSideQuest sets index and progress', () => {
    startSideQuest(2)
    expect(state.sideQuestIndex).toBe(2)
    expect(state.sideProgress[2]).toBe(0)
  })

  test('getCurrentSideStep returns correct step or null', () => {
    // 1) If no side quest is active, it returns null
    state.sideQuestIndex = null
    expect(getCurrentSideStep()).toBeNull()

    // 2) Activate s1 at step 0 and expect the correct object
    state.sideQuestIndex = 's1'
    state.sideProgress = { s1: 0 }
    expect(getCurrentSideStep()).toEqual(sideQuests.s1[0])
  })
  test('advanceSideStep increments progress until completion', async () => {
    // Arrange: activate quest 0 with progress = 0
    state.sideQuestIndex = 's1'
    state.sideProgress['s1'] = 0

    await advanceSideStep()
    expect(state.sideProgress['s1']).toBe(1)
    // You can add more checks here if you want to test reward logic,
    // but this is enough to confirm “advanceSideStep” increments as expected.
  })
})
