// js/ui/bindEvents/completeQuest.js

import { DOM } from '../dom.js'
import { state, completeQuest } from '../../core/engine.js'
// import { setUrgentQuestIndex, clearUrgentQuest } from '../../core/functions/state.js';
// import { urgentQuests }            from '../../quests/urgent/index.js';
import { quests } from '../../core/data.js'
import { isQuestUnlocked } from '../../core/engine.js'
import { refreshUI } from '../main.js'
import { notify } from '../../core/engine.js'
import { NOTIFY } from '../text.js'

export function bindCompleteQuestEvents() {
  /* Replace the button so no duplicate listeners survive a hot-reload */
  DOM.completeQuestBtn.replaceWith(DOM.completeQuestBtn.cloneNode(true))
  DOM.completeQuestBtn = document.getElementById('complete-quest')

  DOM.completeQuestBtn.addEventListener('click', () => {
    /* MAIN-quest completion only if nothing special is active */
    if (state.ascensionQuestIndex !== null || state.sideQuestIndex !== null || state.activeDaily) {
      return // ignore click – handled by specialised renderer
    }

    /* ---------------- main-quest lock check ---------------- */
    const slot = state.mainQuests[state.activeLead]
    if (!slot) return // no slot for current lead

    const nextIdx = (slot.currentQuestIndex + 1) % quests.length
    const nextQ = quests[nextIdx]

    if (!isQuestUnlocked(nextQ, state.currentLevel)) {
      const date = nextQ.unlock.date
        ? ` on ${new Date(nextQ.unlock.date).toLocaleDateString()}`
        : ''
      notify(NOTIFY.unlockedAt(nextQ.title, nextQ.unlock.level, date))
      return
    }

    /* ---------------- actually complete -------------------- */
    const beforeLvl = state.currentLevel
    completeQuest()
    refreshUI()
    if (state.currentLevel > beforeLvl) notify(NOTIFY.levelUp)
  })
}
