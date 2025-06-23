// js/core/functions/questFunctions.test.js
/**
 * @jest-environment jsdom
 */
const { state } = require('./state')
const {
  getSlot,
  getCurrentQuest,
  completeQuest,
  createLead,
  switchLead,
} = require('./questFunctions')

jest.mock('../data.js', () => ({
  quests: [
    {
      act: 1,
      category: 'main',
      title: 'Splash',
      description: 'intro',
      microSteps: null,
      rewardXP: 0,
      skillReward: {},
    },
    {
      act: 1,
      category: 'main',
      title: 'Q1',
      description: 'do stuff',
      microSteps: ['a', 'b'],
      rewardXP: 5,
      skillReward: { research: 1 },
      unlock: { level: 1 },
    },
  ],
  rankCaps: [1],
}))
jest.mock('./xp', () => ({ updateXP: jest.fn(() => ({ level: 2 })) }))
jest.mock('../unlock', () => ({ isQuestUnlocked: () => true }))
jest.mock('../notifications', () => ({ notify: jest.fn() }))

describe('questFunctions', () => {
  beforeEach(() => {
    // seed a lead
    state.mainQuests = { alice: { currentQuestIndex: 0, progress: {} } }
    state.activeLead = 'alice'
    state.skills = {}
    state.ascensionQuestIndex = null
    state.sideQuestIndex = null
    state.activeDaily = null
  })

  test('getSlot returns the active slot', () => {
    const slot = getSlot()
    expect(slot).toBe(state.mainQuests.alice)
  })

  test('getCurrentQuest returns splash when microSteps is null', () => {
    const splash = getCurrentQuest()
    expect(splash.act).toBe(1)
    expect(splash.microSteps).toBeNull()
  })

  test('createLead adds a new lead and returns true', () => {
    expect(createLead('bob')).toBe(true)
    expect(state.mainQuests.bob).toBeDefined()
    expect(state.activeLead).toBe('bob')
  })

  test('switchLead switches if existing', () => {
    createLead('charlie')
    expect(switchLead('alice')).toBe(true)
    expect(state.activeLead).toBe('alice')
  })

  test('completeQuest on a splash advances to next non-splash', () => {
    // initial currentQuestIndex=0 (splash)
    const next = completeQuest()
    expect(state.mainQuests.alice.currentQuestIndex).toBe(1)
    expect(next.title).toBe('Q1')
  })

  test('completeQuest awards skillReward & xp and triggers ascension', () => {
    // make Q1 have research reward crossing threshold
    state.mainQuests.alice.currentQuestIndex = 1
    state.skills = { research: 0 }
    // call completeQuest
    const returned = completeQuest()
    expect(state.skills.research).toBe(1)
    expect(state.ascensionQuestIndex).toBeNull
    expect(returned.title).toBe('Splash')
  })
})
