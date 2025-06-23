/**
 * @jest-environment jsdom
 */
import * as util from '../../util/index.js'
import {
  isAllChecked,
  renderMicroSteps,
  setQuestTitleDesc,
  configureCompleteButton,
  renderTimer,
  clearTimer,
  clearRewardLine,
  renderRewardLine,
  renderGoToTaskLink,
  renderActIntro,
  renderSplashScreen,
  renderActNumber,
  replaceButton,
  setQuestSidebarRestricted,
  renderCooldownPanel,
  showNoticeIfPresent,
} from './uiHelper.js'
import { notify } from '../../core/engine.js'
import { DOM } from '../dom.js'

jest.mock('../../util/index.js', () => ({
  startAscensionTimer: jest.fn((_deadline, cb) => {
    cb(0)
    return 123
  }),
  clearAscensionTimer: jest.fn(),
  createElement: jest.fn(), // we’ll wire up its behavior below
}))

// now give our createElement mock a real implementation:
util.createElement.mockImplementation((tag, props = {}) => {
  const el = document.createElement(tag)
  Object.assign(el, props)
  return el
})

const { startAscensionTimer, clearAscensionTimer } = util

describe('uiHelper', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <h2 id="quest-title"></h2>
      <p id="quest-description"></p>
      <button id="complete-quest"></button>
      <div id="quest-steps"></div>
    `
  })

  describe('isAllChecked()', () => {
    it('returns true if all checkboxes in a container are checked', () => {
      const container = document.getElementById('quest-steps')
      container.innerHTML = `
        <input type="checkbox" checked>
        <input type="checkbox" checked>
      `
      expect(isAllChecked(container)).toBe(true)
    })

    it('returns false if any checkbox is unchecked', () => {
      const container = document.getElementById('quest-steps')
      container.innerHTML = `
        <input type="checkbox" checked>
        <input type="checkbox">
      `
      expect(isAllChecked(container)).toBe(false)
    })
  })

  describe('renderMicroSteps()', () => {
    it('renders a UL with one LI per step and wires the onCheck callback', () => {
      const container = document.getElementById('quest-steps')
      const steps = ['a', 'b', 'c']
      const checkedList = [1]
      const onCheck = jest.fn()

      renderMicroSteps(container, steps, checkedList, onCheck)

      const lis = container.querySelectorAll('li')
      expect(lis).toHaveLength(3)

      // only the second checkbox starts checked
      const inputs = container.querySelectorAll('input[type="checkbox"]')
      expect(inputs[1].checked).toBe(true)
      // simulate clicking the third checkbox
      inputs[2].checked = true
      inputs[2].dispatchEvent(new Event('change'))
      expect(onCheck).toHaveBeenCalledWith(2)
    })
  })

  describe('setQuestTitleDesc()', () => {
    it('updates title and description and removes any #act-number', () => {
      // inject a stray act-number
      document.body.insertAdjacentHTML('afterbegin', '<p id="act-number">ACT X</p>')
      setQuestTitleDesc(
        {
          questTitle: document.getElementById('quest-title'),
          questDescription: document.getElementById('quest-description'),
        },
        'Hello',
        '<strong>World</strong>',
      )
      expect(document.getElementById('act-number')).toBeNull()
      expect(document.getElementById('quest-title').textContent).toBe('Hello')
      expect(document.getElementById('quest-description').innerHTML).toBe('<strong>World</strong>')
    })
  })

  describe('configureCompleteButton()', () => {
    it('clones the button, sets label, enabled state and click handler', () => {
      const oldBtn = document.getElementById('complete-quest')
      const onClick = jest.fn()
      const fresh = configureCompleteButton(oldBtn, 'LABEL', true, onClick)

      // original element should be replaced
      expect(fresh).not.toBe(oldBtn)
      expect(fresh.textContent).toBe('LABEL')
      expect(fresh.disabled).toBe(false)

      // click should invoke our handler
      fresh.click()
      expect(onClick).toHaveBeenCalled()
    })

    it('disables the button when enabled=false and does not attach handler', () => {
      const oldBtn = document.getElementById('complete-quest')
      const onClick = jest.fn()
      const fresh = configureCompleteButton(oldBtn, 'NOPE', false, onClick)

      expect(fresh.disabled).toBe(true)
      fresh.click()
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('renderTimer & clearTimer', () => {
    it('uses startAscensionTimer and injects an #asc-timer element', () => {
      const titleEl = document.getElementById('quest-title')
      renderTimer(titleEl, Date.now() + 5000)

      // startAscensionTimer should have been called
      expect(startAscensionTimer).toHaveBeenCalled()
      // after mock callback, asc-timer should exist
      const timer = document.getElementById('asc-timer')
      expect(timer).not.toBeNull()
      expect(timer.textContent).toMatch(/\d\d:\d\d:\d\d/)
    })

    it('clearTimer clears interval and removes #asc-timer', () => {
      // first render so timer exists
      const titleEl = document.getElementById('quest-title')
      renderTimer(titleEl, Date.now() + 5000)
      expect(document.getElementById('asc-timer')).not.toBeNull()

      clearTimer()
      expect(clearAscensionTimer).toHaveBeenCalled()
      expect(document.getElementById('asc-timer')).toBeNull()
    })
  })
})

describe('renderRewardLine & clearRewardLine', () => {
  let container

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="wrapper">
        <div id="target"></div>
      </div>
    `
    container = document.getElementById('target')
  })

  it('injects a #quest-reward paragraph with XP and skill parts', () => {
    renderRewardLine(container, 10, { physical: 2, mental: 3 })
    const el = document.getElementById('quest-reward')
    expect(el).not.toBeNull()
    // should have "+10 XP | +2 physical | +3 mental"
    expect(el.textContent).toBe('Reward: +10 XP | +2 physical | +3 mental')
    // it should be inserted *after* the container
    expect(container.nextSibling).toBe(el)
  })

  it('does nothing (no error) if xp and skillReward are empty', () => {
    // should not throw or create anything
    expect(() => renderRewardLine(container, 0, {})).not.toThrow()
    expect(document.getElementById('quest-reward')).toBeNull()
  })

  it('clearRewardLine removes the injected element', () => {
    // first inject one
    renderRewardLine(container, 5, { writing: 1 })
    expect(document.getElementById('quest-reward')).not.toBeNull()

    // now clear it
    clearRewardLine()
    expect(document.getElementById('quest-reward')).toBeNull()
  })
})

describe('renderGoToTaskLink()', () => {
  let container
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="before"></div>
      <div id="container"></div>
      <button id="complete-quest"></button>
    `
    container = document.getElementById('container')
  })

  it('inserts a button with correct id and label before the container', () => {
    const url = 'https://example.com'
    const btn = renderGoToTaskLink(container, url, 'Visit', false)
    expect(btn).not.toBeNull()
    expect(btn.id).toBe('quest-link')
    expect(btn.textContent).toBe('Visit')
    expect(btn.nextSibling).toBe(container)
  })

  it('uses innerHTML when isHtml=true', () => {
    const html = '<i>Icon</i>'
    const btn = renderGoToTaskLink(container, '#', html, true)
    expect(btn.innerHTML).toBe(html)
  })

  it('does nothing when url is falsy', () => {
    expect(renderGoToTaskLink(container, '', 'X', false)).toBeNull()
    expect(document.getElementById('quest-link')).toBeNull()
  })
})

describe('renderSplashScreen()', () => {
  let DOM
  beforeEach(() => {
    document.body.innerHTML = `
      <h2 id="quest-title"></h2>
      <p id="quest-description"></p>
      <div id="quest-steps"><span>old</span></div>
      <button id="complete-quest"></button>
      <p id="act-number">ACT X</p>
      <p id="quest-reward">Reward</p>
    `
    DOM = {
      questTitle: document.getElementById('quest-title'),
      questDescription: document.getElementById('quest-description'),
      questSteps: document.getElementById('quest-steps'),
      completeQuestBtn: document.getElementById('complete-quest'),
    }
  })

  it('clears act-number, reward line and steps, then populates title/desc and wires button', () => {
    const splash = {
      title: 'Splash!',
      description: '<b>Desc</b>',
      button: 'Go!',
    }
    const onStart = jest.fn()
    renderSplashScreen(DOM, splash, onStart)

    // old elements removed
    expect(document.getElementById('act-number')).toBeNull()
    expect(document.getElementById('quest-reward')).toBeNull()
    expect(DOM.questSteps.innerHTML).toBe('')

    // new title/desc
    expect(DOM.questTitle.textContent).toBe('Splash!')
    expect(DOM.questDescription.innerHTML).toBe('<b>Desc</b>')

    // button state & click handler
    expect(DOM.completeQuestBtn.disabled).toBe(false)
    expect(DOM.completeQuestBtn.textContent).toBe('Go!')
    DOM.completeQuestBtn.click()
    expect(onStart).toHaveBeenCalled()
  })
})

describe('renderActIntro()', () => {
  let DOM, mockShowView
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="viewAct"></div>
      <button id="complete-quest"></button>
      <button id="start-act"></button>
      <h2 id="act-title"></h2>
      <p id="act-tagline"></p>
    `
    DOM = {
      viewAct: document.getElementById('viewAct'),
      completeQuestBtn: document.getElementById('complete-quest'),
      startActBtn: document.getElementById('start-act'),
    }
    mockShowView = jest.fn()
  })

  it('hides the complete button, shows the act view, and wires up title, tagline, and start button', () => {
    const quest = { act: 3, title: 'Act 3', description: 'Begin!' }
    const onStart = jest.fn()

    renderActIntro(DOM, quest, onStart, mockShowView)

    // complete button hidden
    expect(DOM.completeQuestBtn.classList).toContain('hidden')
    // showView called with viewAct
    expect(mockShowView).toHaveBeenCalledWith(DOM.viewAct)

    // title & tagline
    expect(document.getElementById('act-title').textContent).toBe('Act 3')
    expect(document.getElementById('act-tagline').textContent).toBe('Begin!')

    // start button
    expect(DOM.startActBtn.textContent).toMatch(/Start Act\s*3/)
    DOM.startActBtn.click()
    expect(onStart).toHaveBeenCalled()
  })
})

describe('renderActNumber()', () => {
  let DOM
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="wrapper"><h2 id="quest-title">Title</h2></div>
      <p id="act-number">OLD</p>
    `
    DOM = { questTitle: document.getElementById('quest-title') }
  })

  it('removes any existing #act-number then inserts a new one before the title', () => {
    // clear old and render new
    renderActNumber(DOM, { act: 5 })
    const eyebrow = document.getElementById('act-number')
    expect(eyebrow).not.toBeNull()
    expect(eyebrow.textContent).toBe('ACT 5')
    expect(eyebrow.nextSibling).toBe(DOM.questTitle)
  })

  it('does nothing if quest.act is null', () => {
    renderActNumber(DOM, { act: null })
    expect(document.getElementById('act-number')).toBeNull()
  })
})

describe('replaceButton()', () => {
  beforeEach(() => {
    document.body.innerHTML = `<button id="btn">Click</button>`
  })

  it('replaces the old button node with a fresh clone (no listeners)', () => {
    const old = document.getElementById('btn')
    const newBtn = replaceButton(old)
    expect(newBtn).not.toBe(old)
    expect(document.getElementById('btn')).toBe(newBtn)

    // wiring up a listener on the old one shouldn't fire on the new one
    const handler = jest.fn()
    old.addEventListener('click', handler)
    newBtn.click()
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('replaceButton()', () => {
  it('clones the node and removes old listeners', () => {
    const btn = document.createElement('button')
    btn.id = 'foo'
    const handler = jest.fn()
    btn.addEventListener('click', handler)
    document.body.appendChild(btn)

    const fresh = replaceButton(btn)
    expect(fresh).not.toBe(btn)
    expect(fresh.id).toBe('foo')

    // clicking the new one shouldn’t call the old listener
    fresh.click()
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('setQuestSidebarRestricted', () => {
  let questOverlay, sidebar, questIcon
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="quest-overlay">
        <nav id="quest-sidebar"></nav>
      </div>
      <div id="quest-icon"></div>
    `
    questOverlay = document.getElementById('quest-overlay')
    sidebar = document.getElementById('quest-sidebar')
    questIcon = document.getElementById('quest-icon')
    // Patch the DOM singleton
    DOM.questOverlay = questOverlay
    DOM.questIcon = questIcon
  })
  afterEach(() => {
    document.body.innerHTML = ''
    DOM.questOverlay = null
    DOM.questIcon = null
  })

  it('hides sidebar and quest icon when restricted', () => {
    setQuestSidebarRestricted(true)
    expect(sidebar.classList.contains('u-hidden')).toBe(true)
    expect(questIcon.classList.contains('u-hidden')).toBe(true)
  })

  it('shows sidebar and quest icon when not restricted', () => {
    sidebar.classList.add('u-hidden')
    questIcon.classList.add('u-hidden')
    setQuestSidebarRestricted(false)
    expect(sidebar.classList.contains('u-hidden')).toBe(false)
    expect(questIcon.classList.contains('u-hidden')).toBe(false)
  })
})

describe('renderCooldownPanel', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    document.body.innerHTML = `
      <div id="parent">
        <h2 id="quest-title">Quest</h2>
        <p id="quest-description">Desc</p>
        <p id="quest-reward">Reward</p>
        <div id="quest-steps">Steps</div>
        <button id="complete-quest"></button>
      </div>
    `
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('inserts a cooldown panel, counts down, and calls onDone', () => {
    const parent = document.getElementById('parent')
    const onDone = jest.fn()

    renderCooldownPanel(parent, 2, { onDone })

    // Cooldown panel exists
    let panel = parent.querySelector('#cooldown-panel')
    expect(panel).not.toBeNull()
    expect(panel.textContent).toContain('COOLDOWN')

    // Time advances
    jest.advanceTimersByTime(1000) // t = 1
    expect(panel.querySelector('.cool-timer').textContent).toBe('1')
    jest.advanceTimersByTime(1000) // t = 0, should finish

    // Panel removed and callback called
    expect(parent.querySelector('#cooldown-panel')).toBeNull()
    expect(onDone).toHaveBeenCalled()
  })

  it('hides specified elements and restores them after cooldown', () => {
    const parent = document.getElementById('parent')
    const title = document.getElementById('quest-title')
    const desc = document.getElementById('quest-description')
    const reward = document.getElementById('quest-reward')
    const steps = document.getElementById('quest-steps')
    const button = document.getElementById('complete-quest')
    const onDone = jest.fn()

    renderCooldownPanel(parent, 1, {
      onDone,
      hide: {
        title: true,
        desc: true,
        reward: true,
        steps: true,
        button: true,
      },
    })

    // All specified elements should be hidden
    expect(title.classList.contains('u-hidden')).toBe(true)
    expect(desc.classList.contains('u-hidden')).toBe(true)
    expect(reward.classList.contains('u-hidden')).toBe(true)
    expect(steps.classList.contains('u-hidden')).toBe(true)
    expect(button.classList.contains('u-hidden')).toBe(true)

    jest.advanceTimersByTime(1000)

    // After done, should be restored
    expect(title.classList.contains('u-hidden')).toBe(false)
    expect(desc.classList.contains('u-hidden')).toBe(false)
    expect(reward.classList.contains('u-hidden')).toBe(false)
    expect(steps.classList.contains('u-hidden')).toBe(false)
    expect(button.classList.contains('u-hidden')).toBe(false)
    expect(onDone).toHaveBeenCalled()
  })

  it('can be canceled before finishing', () => {
    const parent = document.getElementById('parent')
    const onDone = jest.fn()
    const handle = renderCooldownPanel(parent, 2, { onDone })

    // Cancel before done
    handle.cancel()
    expect(parent.querySelector('#cooldown-panel')).toBeNull()
    jest.advanceTimersByTime(2000)
    // Callback should not be called again
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})

// Mock notify before importing the rest
jest.mock('../../core/engine.js', () => ({
  notify: jest.fn(),
}))

describe('showNoticeIfPresent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the shown notices cache before each test
    window.__shownNotices = {}
  })

  it('shows a notification if notice is present', () => {
    showNoticeIfPresent({ notice: 'Hello!' })
    expect(notify).toHaveBeenCalledWith('Hello!')
  })

  it('does not show notification if notice is missing', () => {
    showNoticeIfPresent({})
    expect(notify).not.toHaveBeenCalled()
  })

  it('does not show notification if input is null', () => {
    showNoticeIfPresent(null)
    expect(notify).not.toHaveBeenCalled()
  })

  it('shows the notice only once per key if onceKey is provided', () => {
    showNoticeIfPresent({ notice: 'Once!' }, 'unique-key')
    expect(notify).toHaveBeenCalledWith('Once!')

    notify.mockClear()
    // Try to show again with the same key
    showNoticeIfPresent({ notice: 'Once!' }, 'unique-key')
    expect(notify).not.toHaveBeenCalled()
  })

  it('shows separate notices for different keys', () => {
    showNoticeIfPresent({ notice: 'One' }, 'k1')
    showNoticeIfPresent({ notice: 'Two' }, 'k2')
    expect(notify).toHaveBeenCalledTimes(2)
    expect(notify).toHaveBeenNthCalledWith(1, 'One')
    expect(notify).toHaveBeenNthCalledWith(2, 'Two')
  })
})
