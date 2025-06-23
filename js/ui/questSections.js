// js/ui/questSections.js
import { DOM } from './dom.js'
import { SECTION_TITLES, EMPTY_TEXT, NOTIFY } from './text.js'
import { CATEGORY_MAP } from '../core/engine.js'
import { renderSection } from './questRenderer.js'

// Import “state” + its ascension helpers from state.js
import {
  state,
  setActiveDaily,
  clearActiveDaily,
  startAscension,
  isQuestUnlocked,
} from '../core/engine.js'

// Import switchLead (and any other “main-quest” helpers) from questFunctions.js
import { switchLead } from '../core/engine.js'

import { rankCaps } from '../core/data.js'
import { notifyConfirm } from '../util/index.js'

// Side-quest and daily helpers
import { startSideQuest } from '../quests/side/side-helpers.js'
import { sideQuests } from '../quests/side/index.js'
import { pickTodaysDaily } from '../quests/daily/picker.js'
import { ascensionQuests } from '../quests/ascension/index.js'
import { notify } from '../core/engine.js'

/**
 * Renders the “Ascension” section of the sidebar.
 * Eligibility = floor(average of MAIN_SKILLS) ≥ rankCaps[0], and not already mid-ascension.
 */

export function renderAscensionSection(showView, refreshUI, showHeading = false) {
  // 1) Build a list of all quests that are either eligible or in-progress
  const items = ascensionQuests.reduce((arr, quest, idx) => {
    // pick the right skill set & compute average
    const catKey = quest.skillCategory.charAt(0).toUpperCase() + quest.skillCategory.slice(1)
    const keys = CATEGORY_MAP[catKey] || []
    const avg = Math.floor(keys.reduce((s, k) => s + (state.skills[k] || 0), 0) / keys.length)

    const eligible = avg >= rankCaps[0]
    const inProgress = state.ascensionQuestIndex === idx
    const done = Boolean(state.ascensionCompleted[idx])

    if (!done && (eligible || inProgress)) {
      arr.push({ quest, idx, eligible })
    }
    return arr
  }, [])

  // 2) Render them all
  renderSection(
    DOM.questList,
    SECTION_TITLES.ascension,
    items,
    ({ quest, idx, eligible }) => ({
      text: quest.title,
      className: `quest-item${state.ascensionQuestIndex === idx ? ' active' : ''}`,
      onClick: async () => {
        const inProgress = state.ascensionQuestIndex === idx
        if (!inProgress && eligible) {
          const keyName = quest.keyName
          const key = state.inventory.find(
            (i) => i.name === keyName && i.category === quest.skillCategory && i.quantity > 0,
          )
          if (!key) return notify(`You don't have the required ${keyName}!`)
          const confirmed = await notifyConfirm(
            NOTIFY.ascendKeyPrompt(quest.skillCategory, key.rank),
          )
          if (confirmed) {
            startAscension(idx, keyName)
            refreshUI()
            showView(DOM.viewQuests)
            DOM.questOverlay.classList.add('hidden')
          }
        } else if (inProgress) {
          refreshUI()
          showView(DOM.viewQuests)
          DOM.questOverlay.classList.add('hidden')
        }
      },
    }),
    { emptyText: EMPTY_TEXT.ascension, showHeading },
  )
}

export function renderDailySection(showView, refreshUI, showHeading = false) {
  renderSection(
    DOM.questList,
    SECTION_TITLES.daily,
    pickTodaysDaily(),
    (q) => ({
      text: q.title,
      className: `quest-item${state.completedDaily.includes(q.id) ? ' completed' : ''}`,
      onClick: () => {
        setActiveDaily(q.id)
        refreshUI()
        showView(DOM.viewQuests)
        DOM.questOverlay.classList.add('hidden')
      },
    }),
    { emptyText: EMPTY_TEXT.daily, showHeading },
  )
}

export function renderSideSection(showView, refreshUI, showHeading = false) {
  const avail = Object.entries(sideQuests)
    // 1) drop any already completed keys
    // 2) drop any whose splash isn’t yet unlocked by level/date
    .filter(
      ([key, steps]) =>
        !state.sideCompleted.includes(key) && isQuestUnlocked(steps[0], state.currentLevel),
    )
    // 3) map to the shape renderSection expects
    .map(([key, steps]) => ({ key, step: steps[0] }))

  renderSection(
    DOM.questList,
    SECTION_TITLES.side,
    avail,
    ({ key, step }) => ({
      text: step.title,
      className: `quest-item${state.sideQuestIndex === key ? ' active' : ''}`,
      onClick: () => {
        startSideQuest(key) // Pass key ("s1", "s2", ...)
        refreshUI()
        showView(DOM.viewQuests)
        DOM.questOverlay.classList.add('hidden')
      },
    }),
    {
      activeIdx: Object.keys(sideQuests).indexOf(state.sideQuestIndex),
      emptyText: EMPTY_TEXT.side,
      showHeading,
    },
  )
}
export function renderMainSection(showView, refreshUI, showHeading = false) {
  const leads = Object.keys(state.mainQuests)
  renderSection(
    DOM.questList,
    SECTION_TITLES.main,
    leads,
    (name) => ({
      text: name,
      className: `quest-item${name === state.activeLead ? ' active' : ''}`,
      onClick: () => {
        switchLead(name)
        refreshUI()
        showView(DOM.viewQuests)
        DOM.questOverlay.classList.add('hidden')
      },
    }),
    {
      activeIdx: leads.indexOf(state.activeLead),
      emptyText: EMPTY_TEXT.main,
      showHeading,
    },
  )
}

export function renderAllSection(showView, refreshUI) {
  clearActiveDaily()
  renderDailySection(showView, refreshUI, true)
  renderSideSection(showView, refreshUI, true)
  renderMainSection(showView, refreshUI, true)
  renderAscensionSection(showView, refreshUI, true)
}
/**
 * Renders the “Urgent” section of the quest list.
 * @param {Function} showView
 * @param {Function} refreshUI
 */
// export function renderUrgentSection(showView, refreshUI, showHeading = false) {
//  const items = state.urgentQuestIndex === null ? [] : [urgentQuests[0]];

//  renderSection(
//    DOM.questList,
//    SECTION_TITLES.urgent,
//    items,
//    (q) => ({
//      text: q.title,
//      className: 'quest-item',
//      onClick: () => {
//        refreshUI();
//        showView(DOM.viewQuests);
//        DOM.questOverlay.classList.add('hidden');
//      },
//    }),
//    { emptyText: EMPTY_TEXT.urgent, showHeading }
//  );
// }

// Assumes only one ascension quest for now; expand as needed
// ── js/ui/questSections.js ─────────────────────────────────

/**
 * Renders the “Ascension” section of the quest‐list sidebar.
 * Decides eligibility when the floored average of MAIN_SKILLS ≥ rankCaps[0].
 */
