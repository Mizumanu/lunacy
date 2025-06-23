/** @jest-environment jsdom */
/* global DOM */

/*── Minimal DOM stub ─────────────────────────────────────────*/
global.DOM = {
  questList: document.createElement('div'),
  questOverlay: document.createElement('div'),
  viewQuests: document.createElement('div'),
}
beforeEach(() => {
  DOM.questList.innerHTML = ''
  DOM.questOverlay.className = ''
  document.body.innerHTML = ''
  document.body.appendChild(DOM.questList)
})

/*── Stub out the little `dom.js` module so `import { DOM }` works ─┐*/
jest.mock('./dom.js', () => ({ DOM: global.DOM }))

/*── Stub `CATEGORY_MAP` so ascension eligibility runs ────────────┐*/
// jest.mock('../core/engine.js', () => ({
//   CATEGORY_MAP: {
//     Main   : ['writing','outreach'],
//     Health : ['physical','mental','nutrition'],
//   },
// }));

/*── Stub *all* of core/engine.js inline — no out-of-scope variables ─┐*/
jest.mock('../core/engine.js', () => {
  const state = {
    skills: {},
    ascensionQuestIndex: null,
    ascensionCompleted: {},
    sideQuestIndex: null,
    completedDaily: [],
    inventory: [{ name: 'Health (E) Key', category: 'health', quantity: 1 }],
    mainQuests: { Alice: { currentQuestIndex: 0, progress: {} } },
    activeLead: 'Alice',
    currentLevel: 1,
    sideCompleted: [],
  }
  const persist = (fn) => fn
  const startAscension = jest.fn()
  const setActiveDaily = jest.fn((id) => {
    state.completedDaily = []
    state.activeDaily = id
  })
  const clearActiveDaily = jest.fn(() => {
    state.activeDaily = null
  })
  const switchLead = jest.fn()
  const notify = jest.fn()
  const initNotifications = jest.fn()
  return {
    state,
    persist,
    isQuestUnlocked: (quest, lvl) => lvl >= (quest.unlock?.level ?? 0),
    CATEGORY_MAP: {
      Main: ['writing', 'outreach'],
      Health: ['physical', 'mental', 'nutrition'],
    },
    startAscension,
    setActiveDaily,
    clearActiveDaily,
    switchLead,
    notify,
    initNotifications,
  }
})
const { state, startAscension, switchLead } = require('../core/engine.js')

/*── Render‐Section mock applies your mapper fn for `onClick`, etc. ──┐*/
jest.mock('./questRenderer.js', () => ({
  renderSection: jest.fn((container, _title, items, mapFn) => {
    container._rows = items.map(mapFn)
  }),
}))
const { renderSection } = require('./questRenderer.js')

/*── Stub out confirm dialog so it always “OK”s ─────────────────────┐*/
jest.mock('../util/index.js', () => ({
  notifyConfirm: jest.fn(() => Promise.resolve(true)),
}))

/*── Static‐data & quest mocks ─────────────────────────────────────┐*/
jest.mock('../core/data.js', () => ({
  rankCaps: [10],
  rankLetters: ['E', 'D', 'C'],
}))
jest.mock('../quests/ascension/index.js', () => ({
  ascensionQuests: [
    {
      title: 'Main E',
      skillCategory: 'main',
      rank: 'E',
      keyName: 'Main (E) Key',
      trials: [{}],
    },
    {
      title: 'Health E',
      skillCategory: 'health',
      rank: 'E',
      keyName: 'Health (E) Key',
      trials: [{}],
    },
  ],
}))
jest.mock('../quests/daily/picker.js', () => ({
  pickTodaysDaily: () => [{ id: 'd1', title: 'Daily Quest' }],
}))
jest.mock('../quests/side/index.js', () => ({
  sideQuests: {
    s1: [{ type: 'splash', title: 'AI Copy Critique' }],
    s2: [{ type: 'splash', title: 'The Sleep Architect' }],
  },
}))
jest.mock('../quests/side/side-helpers.js', () => ({
  startSideQuest: jest.fn(),
}))

/*── Finally require the module under test ─────────────────────────┐*/
const {
  renderAscensionSection,
  renderDailySection,
  renderSideSection,
  renderMainSection,
} = require('./questSections.js')

/*────────────────────────────────────────────────────────────────*/
describe('quest-sidebar rendering', () => {
  beforeEach(() => {
    renderSection.mockClear()
    startAscension.mockClear()
    switchLead.mockClear()
  })

  it('lists only eligible ascension quests & starts one', async () => {
    state.skills = {
      physical: 10,
      mental: 10,
      nutrition: 10,
      writing: 1,
      outreach: 1,
    }
    await renderAscensionSection(
      () => {},
      () => {},
    )
    const rows = DOM.questList._rows

    expect(rows).toHaveLength(1)
    expect(rows[0].text).toBe('Health E')

    await rows[0].onClick()
    expect(startAscension).toHaveBeenCalledWith(1, 'Health (E) Key')
  })

  it('marks completed daily quests', () => {
    state.completedDaily = ['d1']
    renderDailySection(
      () => {},
      () => {},
    )
    expect(DOM.questList._rows[0].className).toContain('completed')
  })

  it('omits already-completed side splashes', () => {
    state.sideCompleted = ['s1', 's2']
    renderSideSection(
      () => {},
      () => {},
    )
    expect(DOM.questList._rows).toHaveLength(0)
  })

  it('highlights activeLead & switches on click', async () => {
    renderMainSection(
      () => {},
      () => {},
    )
    expect(DOM.questList._rows[0].className).toContain('active')

    state.mainQuests.Bob = { currentQuestIndex: 0, progress: {} }
    renderSection.mockClear()
    renderMainSection(
      () => {},
      () => {},
    )
    await DOM.questList._rows[1].onClick()
    expect(switchLead).toHaveBeenCalledWith('Bob')
  })
})
