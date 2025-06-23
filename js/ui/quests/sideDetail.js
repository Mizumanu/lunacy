// js/ui/quests/sideDetail.js

import { DOM } from '../dom.js'
import { state } from '../../core/engine.js'
import { advanceSideStep } from '../../quests/side/side-helpers.js'
import { sideQuests } from '../../quests/side/index.js'
import { refreshUI } from '../main.js'
import { BTN } from '../text.js'

import {
  setQuestTitleDesc,
  clearRewardLine,
  resetQuestPanel,
  configureCompleteButton,
  showNoticeIfPresent,
  renderGoToTaskLink,
} from './uiHelper.js'

export function renderSideDetail() {
  if (!state.sideQuestIndex) return false
  const key = state.sideQuestIndex
  const idx = state.sideProgress[key] ?? 0
  const steps = sideQuests[key]
  if (!steps) return
  const step = steps[idx]
  showNoticeIfPresent(step, `side-${key}-${idx}`)
  setQuestTitleDesc(DOM, step.title, step.description || '')
  DOM.questSteps.innerHTML = ''

  clearRewardLine()
  renderGoToTaskLink(DOM.completeQuestBtn, step.url, BTN.link, true)

  const isSplash = step.type === 'splash'
  const isLast = idx === steps.length - 1
  const label = isSplash ? BTN.startQuest : isLast ? BTN.complete : BTN.next

  DOM.completeQuestBtn = configureCompleteButton(
    DOM.completeQuestBtn,
    label,
    !!key && state.ascensionQuestIndex === null && !state.activeDaily,
    () => {
      advanceSideStep()
      if (isLast) resetQuestPanel(DOM)
      refreshUI()
    },
  )
  return true
}
