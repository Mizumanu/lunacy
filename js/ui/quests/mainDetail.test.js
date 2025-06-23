/**
 * @jest-environment jsdom
 */
import { DOM } from '../dom.js'
import { renderMainQuest } from './mainDetail.js'
import * as engine from '../../core/engine.js'
import { quests } from '../../core/data.js'
import * as ui from './uiHelper.js'
import { refreshUI, showView } from '../main.js'
import { BTN, NOTIFY } from '../text.js'
import { notify as notifySpy } from '../../core/engine.js'

jest.mock('../../core/engine.js', () => ({
  state: {
    mainQuests: [{ currentQuestIndex: 0 }],
    activeLead: 0,
    currentLevel: 1,
    ascensionQuestIndex: null,
    sideQuestIndex: null,
    activeDaily: false,
  },
  getCurrentQuest: jest.fn(),
  isQuestUnlocked: jest.fn(),
  advanceMainQuest: jest.fn(),
  updateStepProgress: jest.fn(),
  completeQuest: jest.fn(),
  notify: jest.fn(),
}))

jest.mock('../../core/data.js', () => ({
  quests: [
    // quest 0, for act-intro branch
    {
      act: 1,
      title: 'Act I',
      description: 'Begin Act I',
      unlock: { level: 99 },
    },
    // quest 1, next after 0 for unlocked test
    {
      act: 2,
      title: 'Act II',
      description: 'Begin Act II',
      unlock: { level: 0 },
    },
    // quest for micro-steps branch
    {
      act: 3,
      title: 'Micro Quest',
      description: 'Do steps',
      microSteps: ['one', 'two'],
      progress: [0],
      rewardXP: 42,
      skillReward: { foo: 7 },
    },
  ],
}))

// ui helpers main detail
jest.mock('./uiHelper.js', () => ({
  renderActIntro: jest.fn(),
  setQuestTitleDesc: jest.fn(),
  renderActNumber: jest.fn(),
  renderMicroSteps: jest.fn(),
  isAllChecked: jest.fn().mockReturnValue(true),
  configureCompleteButton: jest.fn(),
  clearRewardLine: jest.fn(),
  renderRewardLine: jest.fn(),
  resetQuestPanel: jest.fn(),
  showNoticeIfPresent: jest.fn(),
  renderGoToTaskLink: jest.fn(),
}))

jest.mock('../main.js', () => ({
  refreshUI: jest.fn(),
  showView: jest.fn(),
}))

jest.mock('../text.js', () => ({
  BTN: { complete: 'Complete', startAct: (n) => `Start Act ${n}` },
  NOTIFY: { unlockedAt: (t, _l, _d) => `unlocked ${t}` },
}))

const { getCurrentQuest, isQuestUnlocked, advanceMainQuest, completeQuest } = engine

const {
  renderActIntro,
  setQuestTitleDesc,
  renderActNumber,
  renderMicroSteps,
  configureCompleteButton,
  clearRewardLine,
  renderRewardLine,
  resetQuestPanel,
} = ui

describe('renderMainQuest()', () => {
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
    jest.clearAllMocks()
  })

  describe('act intro branch', () => {
    it('shows the act-intro splash when microSteps is not an array', () => {
      getCurrentQuest.mockReturnValue(quests[0])
      renderMainQuest()
      expect(renderActIntro).toHaveBeenCalledWith(DOM, quests[0], expect.any(Function), showView)
    })

    it('locked: notify only', () => {
      getCurrentQuest.mockReturnValue(quests[0])
      isQuestUnlocked.mockReturnValue(false)
      renderMainQuest()
      // grab the onStart passed to renderActIntro
      const onStart = renderActIntro.mock.calls[0][2]
      onStart()
      expect(notifySpy).toHaveBeenCalledWith(
        NOTIFY.unlockedAt(quests[1].title, quests[1].unlock.level, ''),
      )
      expect(advanceMainQuest).not.toHaveBeenCalled()
    })

    it('unlocked: advances, showView, refreshUI', () => {
      getCurrentQuest.mockReturnValue(quests[0])
      isQuestUnlocked.mockReturnValue(true)
      renderMainQuest()
      const onStart = renderActIntro.mock.calls[0][2]
      onStart()
      expect(advanceMainQuest).toHaveBeenCalled()
      expect(showView).toHaveBeenCalledWith(DOM.viewQuests)
      expect(refreshUI).toHaveBeenCalled()
    })
  })

  describe('micro-steps branch', () => {
    let origBtn
    beforeEach(() => {
      getCurrentQuest.mockReturnValue(quests[2])
      origBtn = DOM.completeQuestBtn
    })

    it('renders title/desc, act-number, steps, reward, and wires button', () => {
      renderMainQuest()
      expect(setQuestTitleDesc).toHaveBeenCalledWith(DOM, quests[2].title, quests[2].description)
      expect(renderActNumber).toHaveBeenCalledWith(DOM, quests[2])
      expect(renderMicroSteps).toHaveBeenCalledWith(
        DOM.questSteps,
        quests[2].microSteps,
        quests[2].progress,
        expect.any(Function),
      )
      expect(clearRewardLine).toHaveBeenCalled()
      expect(renderRewardLine).toHaveBeenCalledWith(
        DOM.questSteps,
        quests[2].rewardXP,
        quests[2].skillReward,
      )
      expect(configureCompleteButton).toHaveBeenCalledWith(
        origBtn,
        BTN.complete,
        true,
        expect.any(Function),
      )
    })

    it('handler calls completeQuest, resetQuestPanel, refreshUI', () => {
      renderMainQuest()
      const handler = configureCompleteButton.mock.calls[0][3]
      handler()
      expect(completeQuest).toHaveBeenCalled()
      expect(resetQuestPanel).toHaveBeenCalledWith(DOM)
      expect(refreshUI).toHaveBeenCalled()
    })
  })
})
