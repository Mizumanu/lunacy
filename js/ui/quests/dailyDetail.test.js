/**
 * @jest-environment jsdom
 */
import { DOM } from '../dom.js'
import { renderDailyEmbed } from './dailyDetail.js'
import { dailyQuests } from '../../quests/daily/index.js'
import * as engine from '../../core/engine.js'
import { renderQuestList, showView, refreshUI } from '../main.js'
import * as util from '../../util/index.js'
import * as ui from './uiHelper.js'
import { BTN, NOTIFY } from '../text.js'

jest.useFakeTimers()

// ─── MOCK EVERYTHING ────────────────────────────────────────────────────

// core engine (note addCompletedDaily now mutates state.completedDaily)
jest.mock('../../core/engine.js', () => {
  const _state = {
    activeDaily: null,
    completedDaily: [],
    ascensionQuestIndex: null,
    sideQuestIndex: null,
    skills: {},
  }
  return {
    state: _state,
    updateXP: jest.fn(),
    addCompletedDaily: jest.fn((id) => {
      _state.completedDaily.push(id)
    }),
    setActiveDaily: jest.fn(),
    clearActiveDaily: jest.fn(),
  }
})

// daily data + picker
jest.mock('../../quests/daily/picker.js', () => ({
  pickTodaysDaily: jest.fn(),
}))
jest.mock('../../quests/daily/index.js', () => ({
  dailyQuests: [
    {
      id: 'u1',
      title: 'Q1',
      description: 'D1',
      rewardXP: 10,
      skillReward: { a: 1 },
      url: 'url1',
    },
    {
      id: 'd2',
      title: 'Q2',
      description: 'D2',
      rewardXP: 20,
      skillReward: { b: 2 },
      url: 'url2',
    },
  ],
}))

// util
jest.mock('../../util/index.js', () => ({
  rollBonus: jest.fn(() => ({ tier: 'common' })),
  formatBonus: jest.fn(() => 'BONUS'),
  notifyWait: jest.fn(),
}))

// ui helpers daily detail
jest.mock('./uiHelper.js', () => ({
  renderRewardLine: jest.fn(),
  setQuestTitleDesc: jest.fn(),
  clearRewardLine: jest.fn(),
  renderGoToTaskLink: jest.fn(),
  resetQuestPanel: jest.fn(),
  configureCompleteButton: jest.fn(),
  showNoticeIfPresent: jest.fn(),
}))

// main.js (now including refreshUI)
jest.mock('../main.js', () => ({
  renderQuestList: jest.fn(),
  showView: jest.fn(),
  refreshUI: jest.fn(),
}))

// inventory
jest.mock('../inventory.js', () => ({
  awardItem: jest.fn(),
}))

const { state, updateXP, addCompletedDaily, setActiveDaily, clearActiveDaily } = engine
const { pickTodaysDaily: pickMock } = require('../../quests/daily/picker.js')
const {
  renderRewardLine,
  setQuestTitleDesc,
  clearRewardLine,
  renderGoToTaskLink,
  resetQuestPanel,
  configureCompleteButton,
} = ui

describe('renderDailyEmbed()', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="viewQuests"></div>
      <h2 id="quest-title"></h2>
      <p id="quest-description"></p>
      <div id="quest-steps"></div>
      <button id="complete-quest"></button>
    `
    DOM.viewQuests = document.getElementById('viewQuests')
    DOM.questTitle = document.getElementById('quest-title')
    DOM.questDescription = document.getElementById('quest-description')
    DOM.questSteps = document.getElementById('quest-steps')
    DOM.completeQuestBtn = document.getElementById('complete-quest')
    // reset our in-memory state
    state.activeDaily = null
    state.completedDaily = []
    jest.clearAllMocks()
  })

  it('returns false if no activeDaily is set', () => {
    state.activeDaily = null
    expect(renderDailyEmbed()).toBe(false)
  })

  it('activates the daily view and bails if id not found', () => {
    state.activeDaily = 'nonexistent'
    expect(renderDailyEmbed()).toBe(true)
    expect(DOM.viewQuests.classList).toContain('daily-active')
  })

  it('renders the first daily quest when activeDaily matches', () => {
    state.activeDaily = 'u1'
    state.completedDaily = []
    renderDailyEmbed()

    // title & desc
    expect(setQuestTitleDesc).toHaveBeenCalledWith(DOM, 'Q1', 'D1')

    // reward line
    expect(clearRewardLine).toHaveBeenCalled()
    expect(renderRewardLine).toHaveBeenCalledWith(DOM.questDescription, 10, {
      a: 1,
    })

    // task link on the real button element
    const realBtn = document.getElementById('complete-quest')
    expect(renderGoToTaskLink).toHaveBeenCalledWith(realBtn, 'url1', BTN.link, true)

    // configure complete button
    expect(configureCompleteButton).toHaveBeenCalledWith(
      realBtn,
      BTN.complete,
      true,
      expect.any(Function),
    )
  })

  describe('click handler', () => {
    let handler
    beforeEach(() => {
      state.activeDaily = 'u1'
      state.completedDaily = []
      pickMock.mockReturnValue([dailyQuests[0], dailyQuests[1]])
      renderDailyEmbed()
      handler = configureCompleteButton.mock.calls[0][3]
    })

    it('marks done, awards XP/skills and advances to next', async () => {
      await handler()
      expect(addCompletedDaily).toHaveBeenCalledWith('u1')
      expect(updateXP).toHaveBeenCalledWith(10)
      expect(setActiveDaily).toHaveBeenCalledWith('d2')
      expect(refreshUI).toHaveBeenCalled()
      // we don’t re-render the list in this branch:
      expect(renderQuestList).not.toHaveBeenCalled()
      expect(showView).toHaveBeenCalledWith(DOM.viewQuests)
    })

    it('when none remain, awards bonus and resets UI', async () => {
      // force picker to only ever return the same one
      pickMock.mockReturnValue([{ id: 'u1' }])
      state.completedDaily = []
      renderDailyEmbed()
      handler = configureCompleteButton.mock.calls.pop()[3]

      await handler()
      // now state.completedDaily === ['u1'], so bonus branch runs:
      expect(util.rollBonus).toHaveBeenCalled()
      expect(clearActiveDaily).toHaveBeenCalled()
      expect(renderQuestList).toHaveBeenCalledWith('daily')
      expect(resetQuestPanel).toHaveBeenCalledWith(DOM)
      expect(util.notifyWait).toHaveBeenCalledWith(NOTIFY.dailyDone)
      expect(util.notifyWait).toHaveBeenCalledWith(NOTIFY.dailyRewards('BONUS'))
    })
  })
})
