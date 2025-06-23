/**
 * @jest-environment jsdom
 */
import { DOM } from '../dom.js'
import { renderSideDetail } from './sideDetail.js'
import { state } from '../../core/engine.js'
import { advanceSideStep } from '../../quests/side/side-helpers.js'
import { refreshUI } from '../main.js'
import { BTN } from '../text.js'
import * as ui from './uiHelper.js'

// ─── MOCK ALL DEPENDENCIES ─────────────────────────────────────────────────
jest.mock('../../core/engine.js', () => ({
  state: {
    sideQuestIndex: null,
    sideProgress: {},
    ascensionQuestIndex: null,
    activeDaily: false,
  },
}))

// GOOD MOCK
jest.mock('../../quests/side/side-helpers.js', () => ({
  sideQuests: {
    s1: [
      {
        title: 'AI Copy Critique',
        type: 'splash',
        description:
          'Forge the perfect ChatGPT prompt to critique your copywriting. 6 steps await!',
      },
      { title: 'Step 1', type: 'regular' },
    ],
    s2: [{ title: 'The Sleep Architect', type: 'splash' }],
  },
  startSideQuest: jest.fn(),
  advanceSideStep: jest.fn(),
}))

// 👇 THIS new mock makes sideDetail.js see the same data
jest.mock('../../quests/side/index.js', () => ({
  sideQuests: {
    s1: [
      {
        title: 'AI Copy Critique',
        type: 'splash',
        description:
          'Forge the perfect ChatGPT prompt to critique your copywriting. 6 steps await!',
      },
      { title: 'Step 1', type: 'regular' },
    ],
    s2: [{ title: 'The Sleep Architect', type: 'splash' }],
  },
}))

jest.mock('../main.js', () => ({
  refreshUI: jest.fn(),
}))

jest.mock('../text.js', () => ({
  BTN: { startQuest: 'Start', next: 'Next', complete: 'Complete' },
}))

// ui helpers, side detail
jest.mock('./uiHelper.js', () => ({
  setQuestTitleDesc: jest.fn(),
  clearRewardLine: jest.fn(),
  resetQuestPanel: jest.fn(),
  configureCompleteButton: jest.fn(),
  showNoticeIfPresent: jest.fn(),
  renderGoToTaskLink: jest.fn(),
}))

describe('renderSideDetail()', () => {
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
    DOM.completeQuestBtn = document.getElementById('complete-quest')
    jest.clearAllMocks()
  })

  it('returns false when no sideQuestIndex is set', () => {
    state.sideQuestIndex = null
    expect(renderSideDetail()).toBe(false)
  })

  it('renders and configures for splash step', () => {
    state.sideQuestIndex = 's1'
    state.sideProgress = { s1: 0 }
    const _origBtn = DOM.completeQuestBtn

    expect(renderSideDetail()).toBe(true)
    expect(ui.setQuestTitleDesc).toHaveBeenCalledWith(
      DOM,
      'AI Copy Critique',
      'Forge the perfect ChatGPT prompt to critique your copywriting. 6 steps await!',
    )
    expect(DOM.questSteps.innerHTML).toBe('')
    expect(ui.clearRewardLine).toHaveBeenCalled()
    expect(ui.configureCompleteButton).toHaveBeenCalledWith(
      _origBtn,
      BTN.startQuest,
      true,
      expect.any(Function),
    )
  })

  it('splash handler advances and refreshUI without resetting', () => {
    state.sideQuestIndex = 's1'
    state.sideProgress = { s1: 0 }
    const _origBtn = DOM.completeQuestBtn
    renderSideDetail()
    const handler = ui.configureCompleteButton.mock.calls[0][3]

    handler()
    expect(advanceSideStep).toHaveBeenCalled()
    expect(ui.resetQuestPanel).not.toHaveBeenCalled()
    expect(refreshUI).toHaveBeenCalled()
  })

  it('configures and handles mid step', () => {
    state.sideQuestIndex = 's1'
    state.sideProgress = { s1: 0 }
    const _origBtn = DOM.completeQuestBtn

    renderSideDetail()
    expect(ui.configureCompleteButton).toHaveBeenCalledWith(
      _origBtn,
      BTN.startQuest,
      true,
      expect.any(Function),
    )

    const handler = ui.configureCompleteButton.mock.calls[0][3]
    handler()
    expect(advanceSideStep).toHaveBeenCalled()
    expect(ui.resetQuestPanel).not.toHaveBeenCalled()
    expect(refreshUI).toHaveBeenCalled()
  })

  it('configures and handles last step', () => {
    state.sideQuestIndex = 's1'
    state.sideProgress = { s1: 1 }

    const _origBtn = DOM.completeQuestBtn

    renderSideDetail()
    expect(ui.configureCompleteButton).toHaveBeenCalledWith(
      _origBtn,
      BTN.complete,
      true,
      expect.any(Function),
    )

    const handler = ui.configureCompleteButton.mock.calls[0][3]
    handler()
    expect(advanceSideStep).toHaveBeenCalled()
    expect(ui.resetQuestPanel).toHaveBeenCalledWith(DOM)
    expect(refreshUI).toHaveBeenCalled()
  })
})
