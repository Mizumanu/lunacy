// js/ui/quests/ascensionDetail.js
import { DOM } from '../dom.js'
import { switchTab } from '../main.js'
import { state, completeAscension, updateXP } from '../../core/engine.js'

import { ascensionQuests } from '../../quests/ascension/index.js'
import { clearAscensionTimer } from '../../util/index.js'
import { refreshUI } from '../main.js'
import { BTN } from '../text.js'
import { notify } from '../../core/engine.js'

import {
  renderRewardLine,
  renderMicroSteps,
  isAllChecked,
  setQuestTitleDesc,
  clearRewardLine,
  resetQuestPanel,
  renderTimer,
  clearTimer,
  renderSplashScreen,
  configureCompleteButton,
  renderCooldownPanel,
  setQuestSidebarRestricted,
  showNoticeIfPresent,
  renderGoToTaskLink,
} from './uiHelper.js'

export function renderAscensionDetail() {
  // 1. If nothing in progress, bail
  const questIdx = state.ascensionQuestIndex
  if (questIdx === null) return false

  const quest = ascensionQuests[questIdx]
  let progress = state.ascensionProgress[questIdx]

  // 2. Clamp progress (guard: don't go past last trial)
  if (progress >= quest.trials.length) {
    progress = quest.trials.length - 1
    state.ascensionProgress[questIdx] = progress
  }

  // 3. If past last trial (e.g., finished cooldown off-screen), finish and bail
  if (progress >= quest.trials.length) {
    return finishAscension()
  }

  const trial = quest.trials[progress]

  setQuestSidebarRestricted(trial ? !!trial.restriction : false)

  showNoticeIfPresent(trial, `asc-trial-${questIdx}-${progress}`) // Only once per trial/questIdx/progress combo

  const isLast = progress === quest.trials.length - 1

  // 4. Handle active cooldown (even if just returned to this panel)
  if (state.ascensionCooldown.active) {
    const now = Date.now()
    if (state.ascensionCooldown.endsAt > now) {
      // Still cooling down: show panel, and bail
      const seconds = Math.ceil((state.ascensionCooldown.endsAt - now) / 1000)
      renderCooldownPanel(DOM.questSteps.parentNode, seconds, {
        hide: {
          title: true,
          desc: true,
          reward: true,
          steps: true,
          button: true,
          link: true,
        },
        onDone: () => advanceAscension(quest, trial, isLast, questIdx, progress),
      })
      return true
    } else {
      // Cooldown is over: auto-advance before rendering main UI
      return advanceAscension(quest, trial, isLast, questIdx, progress)
    }
  }

  // 5. Splash screen at start
  if (progress === -1 && quest.splash) {
    renderSplashScreen(DOM, quest.splash, () => {
      notify(quest.intro || 'Ascension begins!', { long: true })
      state.ascensionProgress[questIdx] = 0
      state.ascensionDeadline = Date.now() + (quest.timer || 0) * 1000
      state.ascensionProgress[questIdx + '-steps'] = []
      state.ascensionCooldown.active = false
      state.ascensionCooldown.endsAt = 0
      refreshUI()
    })
    return true
  }

  // 6. Timer (if present)
  clearTimer()
  if (quest.timer && state.ascensionDeadline !== null && progress >= 0) {
    renderTimer(DOM.questTitle, state.ascensionDeadline)
  }

  // 7. Main quest/trial UI
  setQuestTitleDesc(DOM, trial.title || quest.title, trial.description || '')
  const checkedSteps = state.ascensionProgress[questIdx + '-steps'] || []
  // new link button
  renderGoToTaskLink(DOM.completeQuestBtn, trial.url, BTN.link, true)

  renderMicroSteps(DOM.questSteps, trial.microSteps, checkedSteps, (i) => {
    if (!checkedSteps.includes(i)) checkedSteps.push(i)
    state.ascensionProgress[questIdx + '-steps'] = checkedSteps
    checkAll()
    refreshUI()
  })

  clearRewardLine()
  renderRewardLine(DOM.questSteps, trial.rewardXP, {})

  function checkAll() {
    const all = isAllChecked(DOM.questSteps)
    DOM.completeQuestBtn.disabled = !all
    DOM.completeQuestBtn.classList.toggle('active', all)
    return all
  }

  // 8. Complete/Next button
  if (state.ascensionCooldown.active && state.ascensionCooldown.endsAt > Date.now()) {
    DOM.completeQuestBtn.style.display = 'none'
  } else {
    DOM.completeQuestBtn.style.display = ''
    DOM.completeQuestBtn = configureCompleteButton(
      DOM.completeQuestBtn,
      isLast ? BTN.complete : BTN.next,
      checkAll() && state.sideQuestIndex === null && !state.activeDaily,
      () => {
        if (!checkAll()) return
        // Common payout
        if (trial.rewardXP) updateXP(trial.rewardXP)
        if (trial.skillReward) {
          for (const [sk, amt] of Object.entries(trial.skillReward)) {
            state.skills[sk] = (state.skills[sk] || 0) + amt
          }
        }

        if (isLast) {
          return finishAscension()
        } else if (trial.cooldown) {
          state.ascensionCooldown.active = true
          state.ascensionCooldown.endsAt = Date.now() + trial.cooldown * 1000
          DOM.questSteps.innerHTML = ''
          DOM.completeQuestBtn.style.display = 'none'
          renderCooldownPanel(DOM.questSteps.parentNode, trial.cooldown, {
            hide: {
              title: true,
              desc: true,
              reward: true,
              steps: true,
              button: true,
              link: true,
            },
            onDone: () => advanceAscension(quest, trial, isLast, questIdx, progress),
          })
        } else {
          advanceAscension(quest, trial, isLast, questIdx, progress)
        }
      },
    )
  }

  return true
}

// --- Helper: Handles advancing to the next trial or finishing the quest ---
function advanceAscension(quest, trial, isLast, questIdx, progress) {
  state.ascensionCooldown.active = false
  state.ascensionCooldown.endsAt = 0
  if (isLast) {
    if (trial.rewardXP) updateXP(trial.rewardXP)
    if (trial.skillReward) {
      for (const [sk, a] of Object.entries(trial.skillReward)) {
        state.skills[sk] = (state.skills[sk] || 0) + a
      }
    }
    notify(quest.outro || 'Ascension complete!', { long: true })
    if (quest.rewardNotification) notify(quest.rewardNotification)
    setTimeout(() => {
      completeAscension()
      clearAscensionTimer()
      resetQuestPanel(DOM)
      switchTab('main')
      refreshUI()
    }, 1200)
    return true
  } else {
    state.ascensionProgress[questIdx] = progress + 1
    state.ascensionProgress[`${questIdx}-steps`] = []
    refreshUI()
    return true
  }
}

// --- Helper: Handles complete-quest (end) logic ---
function finishAscension() {
  // Retrieve current quest/outro for notification
  const questIdx = state.ascensionQuestIndex
  const quest = ascensionQuests[questIdx]

  // Show outro and reward notification if present, then finish
  notify(quest?.outro || 'Ascension complete!', { long: true })
  if (quest?.rewardNotification) notify(quest.rewardNotification)

  setTimeout(() => {
    completeAscension()
    clearAscensionTimer()
    clearTimer()
    resetQuestPanel(DOM)
    switchTab('main')
    refreshUI()
  }, 1200)

  return true
}
