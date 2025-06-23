// js/ui/quests/mainDetail.js

import { DOM } from '../dom.js'
import { state, getCurrentQuest, updateStepProgress, advanceMainQuest } from '../../core/engine.js'
//import { urgentQuests } from '../quests/urgent/index.js';
import { quests } from '../../core/data.js'
import { refreshUI, showView } from '../main.js'
import { BTN, NOTIFY } from '../text.js'
import { notify } from '../../core/engine.js'
import { isQuestUnlocked } from '../../core/engine.js'
import { completeQuest } from '../../core/engine.js'

import {
  renderRewardLine,
  renderMicroSteps,
  isAllChecked,
  setQuestTitleDesc,
  clearRewardLine,
  renderActNumber,
  resetQuestPanel,
  renderActIntro,
  configureCompleteButton,
  showNoticeIfPresent,
  renderGoToTaskLink,
} from './uiHelper.js'

export function renderMainQuest() {
  document.getElementById('act-number')?.remove()

  console.log('Rendering main quest:', getCurrentQuest(), state)

  // Act intro screen
  const q = getCurrentQuest()

  if (q && !Array.isArray(q.microSteps)) {
    renderActIntro(
      DOM,
      q,
      () => {
        const slot = state.mainQuests[state.activeLead]
        const next = slot.currentQuestIndex + 1
        const nextQ = quests[next]
        if (!isQuestUnlocked(nextQ, state.currentLevel)) {
          const d = nextQ.unlock.date ? new Date(nextQ.unlock.date).toLocaleDateString() : ''
          notify(NOTIFY.unlockedAt(nextQ.title, nextQ.unlock.level, d))
          return
        }
        advanceMainQuest()
        showView(DOM.viewQuests)
        refreshUI()
      },
      showView,
    )
    return
  }

  showNoticeIfPresent(q, `main-${state.activeLead || 0}-${q?.title || ''}`)

  // micro-steps
  DOM.completeQuestBtn.onclick = null
  DOM.completeQuestBtn.classList.remove('hidden')
  DOM.completeQuestBtn.textContent = BTN.complete
  // In renderMainQuest()

  // title + desc + act number
  // Set text/desc first, then render act number, then check if something wipes it after
  // Instead of calling renderActNumber(DOM, q);
  setQuestTitleDesc(DOM, q?.title || '', q?.description || '')

  console.log(
    'Q:',
    q,
    'DOM.questTitle:',
    DOM.questTitle,
    'DOM.questTitle.parentNode:',
    DOM.questTitle?.parentNode,
  )

  if (q?.act !== null) {
    renderActNumber(DOM, q)
  }

  DOM.questSteps.innerHTML = ''
  DOM.completeQuestBtn.disabled = true

  if (q) {
    // RENDER LINK BUTTON if url exists
    renderGoToTaskLink(DOM.completeQuestBtn, q.url, BTN.link, true)

    renderMicroSteps(DOM.questSteps, q.microSteps, q.progress, (stepIdx) => {
      updateStepProgress(stepIdx)
      refreshUI()
    })

    const allChecked = isAllChecked(DOM.questSteps)

    DOM.completeQuestBtn = configureCompleteButton(
      DOM.completeQuestBtn,
      BTN.complete,
      state.ascensionQuestIndex === null &&
        state.sideQuestIndex === null &&
        !state.activeDaily &&
        allChecked,
      () => {
        completeQuest()
        resetQuestPanel(DOM)
        refreshUI()
      },
    )

    clearRewardLine()
    renderRewardLine(DOM.questSteps, q.rewardXP, q.skillReward)
  }

  return true
}
