// js/ui/quests/dailyDetail.js
import { DOM } from '../dom.js'
import { renderQuestList } from '../main.js'
import {
  state,
  updateXP,
  addCompletedDaily,
  setActiveDaily,
  clearActiveDaily,
} from '../../core/engine.js'
import { pickTodaysDaily } from '../../quests/daily/picker.js'
import { dailyQuests } from '../../quests/daily/index.js'
import { rollBonus, formatBonus, notifyWait } from '../../util/index.js'
import { refreshUI, showView } from '../main.js'
import { awardItem } from '../inventory.js'
import { BTN, NOTIFY } from '../text.js'
import { resolveKeySpec } from '../events/eventsUtils.js'

import {
  renderRewardLine,
  setQuestTitleDesc,
  clearRewardLine,
  renderGoToTaskLink,
  resetQuestPanel,
  configureCompleteButton,
  showNoticeIfPresent,
} from './uiHelper.js'

export function renderDailyEmbed() {
  if (!state.activeDaily) return false
  DOM.viewQuests.classList.add('daily-active')

  const dq = dailyQuests.find((d) => d.id === state.activeDaily)
  if (!dq) return true
  showNoticeIfPresent(dq, `daily-${dq.id}`)

  // title + desc

  setQuestTitleDesc(DOM, dq.title, dq.description || '')
  DOM.questSteps.innerHTML = ''

  // reward line
  clearRewardLine()
  renderRewardLine(DOM.questDescription, dq.rewardXP, dq.skillReward)

  // link
  renderGoToTaskLink(DOM.completeQuestBtn, dq.url, BTN.link, true)

  // complete button
  const done = state.completedDaily.includes(dq.id)

  DOM.completeQuestBtn = configureCompleteButton(
    DOM.completeQuestBtn,
    done ? BTN.completed : BTN.complete,
    state.activeDaily &&
      state.ascensionQuestIndex === null &&
      state.sideQuestIndex === null &&
      !done,
    async () => {
      if (!done) {
        addCompletedDaily(dq.id)
        if (dq.rewardXP) updateXP(dq.rewardXP)
        if (dq.skillReward) {
          for (let [sk, amt] of Object.entries(dq.skillReward)) {
            state.skills[sk] = (state.skills[sk] || 0) + amt
          }
        }
      }
      const remaining = pickTodaysDaily()
        .map((q) => q.id)
        .filter((id) => !state.completedDaily.includes(id))
      if (remaining.length) {
        setActiveDaily(remaining[0])
        refreshUI()
        return showView(DOM.viewQuests)
      }
      const bonus = rollBonus(state)
      let spec
     if (bonus.tier === 'rare' && bonus.key) {
        // "efficiencyE", "mainD", …
        spec = resolveKeySpec(`${bonus.key.type}${bonus.key.rank}`)
      } 
     else if (bonus.tier === 'epic') {
       if (bonus.key) {
         spec = resolveKeySpec(`${bonus.key.type}${bonus.key.rank}`)
       }  else if (bonus.rune) {
          const r = bonus.rune[0].toUpperCase() + bonus.rune.slice(1)
          spec = {
            name: `${r} Rune`,
            type: 'rune',
            icon: `/assets/runes/${bonus.rune}.png`,
            description: `A powerful ${bonus.rune} rune.`,
          }
        }
      }
      if (spec) awardItem(spec, 1)
      clearActiveDaily()
      renderQuestList('daily')
      resetQuestPanel(DOM)
      showView(DOM.viewQuests)
      await notifyWait(NOTIFY.dailyDone)
      await notifyWait(NOTIFY.dailyRewards(formatBonus(bonus)))
    },
  )

  return true
}
