// js/ui/quests/uiHelper.js
import { createElement } from '../../util/index.js'
import { startAscensionTimer, clearAscensionTimer } from '../../util/index.js'
import { BTN } from '../text.js'
import { DOM } from '../dom.js'
import { notify } from '../../core/engine.js'

// Add at the top with your other helpers
export function isAllChecked(containerEl) {
  // Returns true if all input[type=checkbox] inside containerEl are checked
  return [...containerEl.querySelectorAll('input[type=checkbox]')].every((cb) => cb.checked)
}

export function renderRewardLine(containerEl, xp = 0, skillReward = {}) {
  const parts = []
  if (xp) parts.push(`+${xp} XP`)
  for (const [sk, amt] of Object.entries(skillReward || {})) {
    parts.push(`+${amt} ${sk}`)
  }
  if (!parts.length) return
  const el = document.createElement('p')
  el.id = 'quest-reward'
  el.textContent = `Reward: ${parts.join(' | ')}`
  containerEl.after(el)
}

/**
 * Renders a <ul> of checkboxes into `containerEl` for each step.
 *
 * @param {HTMLElement} containerEl  e.g. DOM.questSteps
 * @param {string[]}    steps        array of step-labels
 * @param {number[]}    checkedList  which indices should start checked
 * @param {(idx:number)=>void} onCheck  called whenever any box is toggled
 */
export function renderMicroSteps(containerEl, steps, checkedList, onCheck) {
  containerEl.innerHTML = ''
  const ul = createElement('ul')
  steps.forEach((text, i) => {
    const cb = createElement('input', {
      type: 'checkbox',
      id: `${containerEl.id}-step-${i}`,
      checked: checkedList.includes(i),
    })
    cb.addEventListener('change', () => onCheck(i))
    const label = createElement('label', {
      htmlFor: cb.id,
      textContent: text,
    })
    const li = createElement('li')
    li.append(cb, label)
    ul.append(li)
  })
  containerEl.append(ul)
}

/**
 * Helper to set title and description for ANY quest panel.
 * Removes a leftover ACT eyebrow; only main quests
 * will add it back later through renderActNumber().
 *
 * @param {object} DOM - contains questTitle & questDescription refs
 * @param {string} title
 * @param {string} description (may contain HTML)
 */
export function setQuestTitleDesc(DOM, title = '', description = '') {
  // Always purge any previous eyebrow first
  document.getElementById('act-number')?.remove()

  if (DOM.questTitle) DOM.questTitle.textContent = title
  if (DOM.questDescription) DOM.questDescription.innerHTML = description
}

/**
 * Removes any existing reward line (with id "quest-reward") from the DOM.
 */
export function clearRewardLine() {
  document.getElementById('quest-reward')?.remove()
}

/**
 * Renders the ACT number above the quest title if the quest has an act.
 * Removes any previous act-number element.
 * @param {object} DOM - Your DOM refs (with questTitle)
 * @param {object} quest - The quest object (should have act property)
 */
export function renderActNumber(DOM, quest) {
  console.log('CALLED renderActNumber with', { DOM, quest })
  document.getElementById('act-number')?.remove()
  if (quest && quest.act !== null && DOM.questTitle && DOM.questTitle.parentNode) {
    const el = createElement('p', {
      id: 'act-number',
      textContent: `ACT ${quest.act}`,
    })
    DOM.questTitle.parentNode.insertBefore(el, DOM.questTitle)
    console.log('Inserted:', el, 'Before:', DOM.questTitle)
  } else {
    console.log('SKIPPED: act-number', {
      quest,
      questTitle: DOM.questTitle,
      parentNode: DOM.questTitle?.parentNode,
    })
  }
}
/**
 * Replaces a button with its clone to remove all event listeners.
 * Returns the fresh new button (also reassign this to your DOM ref!).
 * @param {HTMLElement} btn - The button element to replace
 * @returns {HTMLElement} The new (cloned) button element
 */
export function replaceButton(btn) {
  const newBtn = btn.cloneNode(true)
  btn.replaceWith(newBtn)
  return newBtn
}

/**
 * Renders a "Go to Task" button that opens a URL in a new tab.
 * Supports plain label or icon HTML via `labelOrHtml`.
 * @param {HTMLElement} containerEl - Where to insert the button (often before the Complete button)
 * @param {string} url - The external URL to open
 * @param {string} [labelOrHtml="Go to Task"] - Button label or icon HTML
 * @param {boolean} [isHtml=false] - Set true if labelOrHtml contains HTML (like <i>...</i>)
 * @returns {HTMLElement} The button element
 */
export function renderGoToTaskLink(containerEl, url, labelOrHtml = 'Go to Task', isHtml = false) {
  // Remove existing if present
  document.getElementById('quest-link')?.remove()
  if (!url) return null
  const btn = createElement('button', {
    id: 'quest-link',
    className: 'btn',
  })
  if (isHtml) {
    btn.innerHTML = labelOrHtml
  } else {
    btn.textContent = labelOrHtml
  }
  btn.addEventListener('click', () => window.open(url, '_blank'))
  containerEl.before(btn)
  return btn
}

/**
 * Resets the entire quest panel: title, description, steps, reward, act number, and button.
 * @param {object} DOM - Your DOM refs (with questTitle, questDescription, questSteps, completeQuestBtn)
 */
export function resetQuestPanel(DOM) {
  if (DOM.questTitle) DOM.questTitle.textContent = ''
  if (DOM.questDescription) DOM.questDescription.innerHTML = ''
  if (DOM.questSteps) DOM.questSteps.innerHTML = ''
  document.getElementById('quest-reward')?.remove()
  document.getElementById('act-number')?.remove()
  if (DOM.completeQuestBtn) {
    DOM.completeQuestBtn.disabled = true
    DOM.completeQuestBtn.onclick = null
    DOM.completeQuestBtn.textContent = ''
  }
}

/**
+ * Renders a live countdown before a given element.
+ * @param {HTMLElement} containerEl – e.g. DOM.questTitle
+ * @param {number}      deadline    – timestamp (ms) when it reaches zero
 */
export function renderTimer(containerEl, deadline) {
  clearAscensionTimer()
  document.getElementById('asc-timer')?.remove()
  if (!deadline) return

  startAscensionTimer(deadline, (ms) => {
    const pad = (n) => String(Math.floor(n)).padStart(2, '0')
    const h = pad(ms / 3.6e6),
      m = pad((ms % 3.6e6) / 6e4),
      s = pad((ms % 6e4) / 1e3)

    document.getElementById('asc-timer')?.remove()
    let cooldownEl = document.getElementById('trial-cooldown')
    let timerP = createElement('p', {
      id: 'asc-timer',
      textContent: `${h}:${m}:${s}`,
    })

    if (cooldownEl) {
      cooldownEl.parentNode.insertBefore(timerP, cooldownEl)
    } else {
      containerEl.before(timerP)
    }
  })
}
/**
+ * Stops and clears any active countdown timer.
+ */
export function clearTimer() {
  clearAscensionTimer()
  document.getElementById('asc-timer')?.remove()
}

/**
 * Renders a splash screen for a quest/trial.
 * @param {object} DOM            – your DOM refs (questTitle, questDescription, questSteps, completeQuestBtn)
 * @param {{title:string,description:string,button?:string}} splash
 * @param {() => void} onStart    – what to do when the “Start” button is clicked
 */
export function renderSplashScreen(DOM, splash, onStart) {
  // clear out old reward/steps/timer/etc
  document.getElementById('act-number')?.remove()
  document.getElementById('quest-reward')?.remove()
  DOM.questSteps.innerHTML = ''

  // title & description
  DOM.questTitle.textContent = splash.title
  DOM.questDescription.innerHTML = splash.description

  // button
  DOM.completeQuestBtn.disabled = false
  DOM.completeQuestBtn.textContent = splash.button || 'Start'
  DOM.completeQuestBtn.onclick = onStart
}

/**
 * Renders the Act Intro view (the “Start Act” splash) for a main quest.
 * @param {object} DOM           – your DOM refs (viewAct, startActBtn, completeQuestBtn)
 * @param {object} quest         – the current quest object (with act, title, description)
 * @param {() => void} onStart   – callback to fire when “Start Act” is clicked
 * @param {(viewEl: HTMLElement) => void} showView – your UI’s showView function
 */
export function renderActIntro(DOM, quest, onStart, showView) {
  // hide the “Complete” button and switch to the Act splash panel
  DOM.completeQuestBtn.classList.add('hidden')
  showView(DOM.viewAct)

  // fill in title, tagline, button
  document.getElementById('act-title').textContent = quest.title
  document.getElementById('act-tagline').textContent = quest.description
  DOM.startActBtn.textContent = BTN.startAct(quest.act)
  DOM.startActBtn.onclick = onStart
}

/**
 * Wipe any previous listeners, set label + enabled state, attach new handler.
 *
 * @param {HTMLElement} btn       – the Complete button (DOM.completeQuestBtn)
 * @param {string}      label     – text to display
 * @param {boolean}     enabled   – whether it should be clickable
 * @param {() => void} onClick    – handler for the click event
 * @returns {HTMLElement}         – the fresh new button (reassign back to DOM.completeQuestBtn)
 */
export function configureCompleteButton(btn, label, enabled, onClick) {
  const fresh = btn.cloneNode(true)
  btn.replaceWith(fresh)
  fresh.textContent = label
  fresh.disabled = !enabled
  fresh.onclick = enabled ? onClick : null
  return fresh
}

/* ============================================================================
   renderCooldownPanel(parentEl, seconds, opts?)
   ---------------------------------------------------------------------------
   • parentEl  : container whose children you want hidden
   • seconds   : countdown length
   • opts      : {
        onDone : () => void,          // called at 0
        hide   : {                    // WHAT to hide
          title:true, desc:true, reward:true,
          steps:true, button:true
        }
     }
   • returns   : handle.cancel()  –– call if you navigate away mid-count
   ============================================================================ */
export function renderCooldownPanel(parentEl, seconds, opts = {}) {
  const { onDone, hide = {} } = opts

  // zap any previous panel
  parentEl.querySelector('#cooldown-panel')?.remove()

  // map commonly-named nodes *inside the same parent*
  const nodes = {
    title: parentEl.querySelector('#quest-title'),
    desc: parentEl.querySelector('#quest-description'),
    reward: parentEl.querySelector('#quest-reward'),
    steps: parentEl.querySelector('#quest-steps'),
    button: parentEl.querySelector('#complete-quest'),
    link: parentEl.querySelector('#quest-link'),
  }

  // hide requested nodes
  Object.entries(hide).forEach(([k, v]) => v && nodes[k]?.classList.add('u-hidden'))

  // build panel
  const panel = document.createElement('div')
  panel.id = 'cooldown-panel'
  panel.innerHTML = `
      <span class="cool-label">COOLDOWN</span>
      <span class="cool-timer">${seconds}</span>
      <span class="cool-unit">s</span>`
  parentEl.append(panel)

  /* ---------- countdown ---------- */
  let t = seconds
  const iv = setInterval(() => {
    t--

    /* update the DOM only while the panel is actually mounted */
    if (panel.isConnected) {
      panel.querySelector('.cool-timer').textContent = t
      panel.classList.toggle('blink', t <= 10 && t > 0)
    }

    /* when the count reaches 0 we ALWAYS finish,
       even if the user navigated away during the wait */
    if (t <= 0) finish()
  }, 1000)

  function finish() {
    clearInterval(iv)
    panel.remove()
    Object.values(nodes).forEach((el) => el?.classList.remove('u-hidden'))
    onDone?.()
  }

  /* expose a handle for manual cancel */
  return { cancel: finish }
}

export function setQuestSidebarRestricted(restricted) {
  const sidebar = DOM.questOverlay.querySelector('#quest-sidebar')
  // Hide the sidebar if you want, but most importantly hide the hamburger icon
  if (restricted) {
    sidebar?.classList.add('u-hidden')
    DOM.questIcon.classList.add('u-hidden') // <--- Hide the hamburger!
  } else {
    sidebar?.classList.remove('u-hidden')
    DOM.questIcon.classList.remove('u-hidden') // <--- Show the hamburger!
  }
}

/**
 * Show a notice if the quest/trial/step has a `notice` property.
 * If `onceKey` is provided, will only show that notice once per session (optional).
 * @param {object} obj    - the quest/trial/step object
 * @param {string} [onceKey] - optional unique key to show only once
 */
export function showNoticeIfPresent(obj, onceKey = null) {
  if (!obj || !obj.notice) return
  // Optionally: Only show once using a window/session cache (optional)
  if (onceKey) {
    window.__shownNotices = window.__shownNotices || {}
    if (window.__shownNotices[onceKey]) return
    window.__shownNotices[onceKey] = true
  }
  notify(obj.notice)
}
