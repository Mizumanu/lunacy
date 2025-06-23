/**
 * @jest-environment jsdom
 */
import { DOM } from '../dom.js'
import * as engine from '../../core/engine.js'
import { ascensionQuests } from '../../quests/ascension/index.js'
import { renderAscensionDetail } from './ascensionDetail.js'
import * as ui from './uiHelper.js'
import { refreshUI, switchTab } from '../main.js'
import { clearAscensionTimer } from '../../util/index.js'
import { BTN } from '../text.js'

jest.useFakeTimers()

// ─── MOCK ALL THE THINGS ────────────────────────────────────────────────────

// stub out the engine
jest.mock('../../core/engine.js', () => ({
  state: {
    ascensionQuestIndex: null,
    ascensionProgress: {},
    ascensionDeadline: null,
    sideQuestIndex: null,
    activeDaily: false,
    skills: {},
    ascensionCooldown: { active: false, endsAt: 0 }, // <-- ADD THIS!
  },
  completeAscension: jest.fn(),
  updateXP: jest.fn(),
  notify: jest.fn(),
}))

// stub out the ascensionQuests data
jest.mock('../../quests/ascension/index.js', () => ({
  ascensionQuests: [
    {
      timer: 10,
      splash: {
        title: 'Splash Title',
        description: 'Splash Desc',
        button: 'Begin',
      },
      intro: 'Go!',
      outro: 'Done!',
      rewardNotification: 'Yay!',
      trials: [
        {
          title: 'Trial 1',
          description: 'Do thing',
          microSteps: ['step A'],
          rewardXP: 5,
        },
      ],
    },
  ],
}))

// spy on all ui helpers so we can assert they get called, ascension detail
jest.mock('./uiHelper.js', () => ({
  renderRewardLine: jest.fn(),
  renderMicroSteps: jest.fn(),
  isAllChecked: jest.fn().mockReturnValue(true),
  setQuestTitleDesc: jest.fn(),
  clearRewardLine: jest.fn(),
  resetQuestPanel: jest.fn(),
  renderTimer: jest.fn(),
  clearTimer: jest.fn(),
  renderSplashScreen: jest.fn(),
  configureCompleteButton: jest.fn(),
  setQuestSidebarRestricted: jest.fn(),
  showNoticeIfPresent: jest.fn(),
  renderGoToTaskLink: jest.fn(),
}))

// spy on other imports
jest.mock('../main.js', () => ({
  refreshUI: jest.fn(),
  switchTab: jest.fn(),
}))
jest.mock('../../util/index.js', () => ({
  clearAscensionTimer: jest.fn(),
}))
jest.mock('../text.js', () => ({
  BTN: { next: 'Next', complete: 'Complete' },
}))

const { state, completeAscension, updateXP, notify: notifySpy } = engine

const {
  renderSplashScreen,
  clearTimer,
  renderTimer,
  setQuestTitleDesc,
  renderMicroSteps,
  clearRewardLine,
  renderRewardLine,
  configureCompleteButton,
} = ui

describe('renderAscensionDetail()', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <h2 id="quest-title"></h2>
      <p id="quest-description"></p>
      <div id="quest-steps"></div>
      <button id="complete-quest"></button>
    `
    DOM.questTitle = document.getElementById('quest-title')
    DOM.questDescription = document.getElementById('quest-description')
    DOM.questSteps = document.getElementById('quest-steps')
    // wire up the button once, we'll capture it below
    DOM.completeQuestBtn = document.getElementById('complete-quest')
    jest.clearAllMocks()
  })

  it('returns false when no ascensionQuestIndex is set', () => {
    state.ascensionQuestIndex = null
    expect(renderAscensionDetail()).toBe(false)
    expect(renderSplashScreen).not.toHaveBeenCalled()
  })

  it('renders the splash screen when progress is -1', () => {
    state.ascensionQuestIndex = 0
    state.ascensionProgress = { 0: -1 }
    expect(renderAscensionDetail()).toBe(true)
    expect(renderSplashScreen).toHaveBeenCalledWith(
      DOM,
      ascensionQuests[0].splash,
      expect.any(Function),
    )
  })

  describe('non-splash flow (progress ≥ 0)', () => {
    let origBtn
    beforeEach(() => {
      // set up for the non-splash branch
      origBtn = DOM.completeQuestBtn
      state.ascensionQuestIndex = 0
      state.ascensionProgress = { 0: 0, '0-steps': [] }
      state.ascensionDeadline = Date.now() + 5000
      jest.clearAllMocks()
    })

    it('clears any existing timer and invokes renderTimer', () => {
      renderAscensionDetail()
      expect(clearTimer).toHaveBeenCalled()
      expect(renderTimer).toHaveBeenCalledWith(DOM.questTitle, state.ascensionDeadline)
    })

    it('sets title/description, renders micro-steps and reward line', () => {
      const trial = ascensionQuests[0].trials[0]
      renderAscensionDetail()
      expect(setQuestTitleDesc).toHaveBeenCalledWith(DOM, trial.title, trial.description)
      expect(renderMicroSteps).toHaveBeenCalledWith(
        DOM.questSteps,
        trial.microSteps,
        state['ascensionProgress']['0-steps'],
        expect.any(Function),
      )
      expect(clearRewardLine).toHaveBeenCalled()
      expect(renderRewardLine).toHaveBeenCalledWith(DOM.questSteps, trial.rewardXP, {})
    })

    it('configures Complete button for last trial', () => {
      renderAscensionDetail()
      // now check that configureCompleteButton was passed our original button reference:
      expect(configureCompleteButton).toHaveBeenCalledWith(
        origBtn,
        BTN.complete,
        true,
        expect.any(Function),
      )
    })

    it('clicking Complete pays XP, fires notifications and completes quest', () => {
      renderAscensionDetail()
      // grab the handler that was passed into configureCompleteButton
      const handler = configureCompleteButton.mock.calls[0][3]

      // restore DOM.completeQuestBtn so checkAll() can work
      DOM.completeQuestBtn = origBtn

      // invoke it
      handler()

      // reward & notifications
      expect(updateXP).toHaveBeenCalledWith(5)
      expect(notifySpy).toHaveBeenCalledWith('Done!', { long: true })
      expect(notifySpy).toHaveBeenCalledWith('Yay!')

      // fast-forward the setTimeout
      jest.advanceTimersByTime(1200)

      expect(completeAscension).toHaveBeenCalled()
      expect(clearAscensionTimer).toHaveBeenCalled()
      expect(ui.resetQuestPanel).toHaveBeenCalledWith(DOM)
      expect(switchTab).toHaveBeenCalledWith('main')
      expect(refreshUI).toHaveBeenCalled()
    })
  })
})
