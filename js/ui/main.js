// js/ui/main.js
import '../../style/index.css'
/* 1. CORE GAME MODULES */
import { state, setCurrentTab, clearActiveDaily } from '../core/engine.js'

import { DOM } from './dom.js'
import { SECTION_TITLES, BTN } from './text.js'

import {
  //renderUrgentSection,
  renderAscensionSection,
  renderDailySection,
  renderSideSection,
  renderMainSection,
  renderAllSection,
} from './questSections.js'

import { renderXpAndRadar, updateStatusView } from './uiHelpers.js'

import { renderSideDetail } from './quests/sideDetail.js'
import { renderDailyEmbed } from './quests/dailyDetail.js'
import { renderAscensionDetail } from './quests/ascensionDetail.js'
import { renderMainQuest } from './quests/mainDetail.js'
// import { renderUrgentDetail } from './quests/urgentDetail.js';

import {
  bindQuestOverlayEvents,
  bindCompleteQuestEvents,
  bindNavigationEvents,
  bindInventoryEvents,
} from './bindEvents/index.js'

// Side-quest helpers

/* 2. HELPERS & UTILS */
import { createElement } from '../util/index.js'

/* 3. NOTIFICATIONS */
import { initNotifications } from '../core/engine.js'
initNotifications()

import { inventoryItems } from './inventory.js'

// new helper to toggle the “.active” class on quest-sidebar tabs
import { highlightActiveTab } from './uiHelpers.js'

import { notify } from '../core/engine.js'
import { setQuestSidebarRestricted } from './quests/uiHelper.js'

/* ─── GLOBAL UI SETUP ─────────────────────────────────────── */

// “Reset” button
// “Reset” button
const resetBtn = createElement('button', {
  textContent: BTN.reset,
  style: 'position:absolute;top:1rem;right:1rem;z-index:999',
})
resetBtn.onclick = () => {
  localStorage.clear() // Clears ALL localStorage (not just gameState)
  sessionStorage.clear() // Clears ALL sessionStorage (including event progress)
  location.reload()
}
document.body.append(resetBtn)

// Ensure these arrays exist
if (!state.completedDaily) state.completedDaily = []
if (!state.activeDaily) state.activeDaily = null

// Seed inventory defaults
if (!state.inventory.length) {
  state.inventory.push(...inventoryItems)
}

/**
 * Switches the active quest category.
 * @param {'all'|'daily'|'side'|'main'|'urgent'} category
 */
export function switchTab(category) {
  setQuestSidebarRestricted(false)
  // Prevent switching to "main" if ascension quest is active,
  // or to "side"/"daily" if those are active.
  if (
    (category === 'main' && state.ascensionQuestIndex !== null) ||
    (category === 'side' && state.sideQuestIndex !== null) ||
    (category === 'daily' && state.activeDaily !== null)
  ) {
    notify('⚠️ Finish your current special quest before switching!')
    // Optionally, auto-redirect user back to the current special quest:
    if (state.ascensionQuestIndex !== null) {
      highlightActiveTab('ascension')
      renderQuestList('ascension')
    } else if (state.sideQuestIndex !== null) {
      highlightActiveTab('side')
      renderQuestList('side')
    } else if (state.activeDaily !== null) {
      highlightActiveTab('daily')
      renderQuestList('daily')
    }
    return
  }
  // Otherwise, switch tabs as normal
  setCurrentTab(category)
  highlightActiveTab(category)
  renderQuestList(category)
  showView(DOM.viewQuests)
}
/** Switch visible panel and trigger a UI refresh when appropriate */
export function showView(viewEl) {
  ;[
    DOM.viewQuests,
    DOM.viewAct,
    DOM.viewStats,
    DOM.viewStatus,
    DOM.viewEvents,
    DOM.viewInventory,
  ].forEach((v) => v.classList.add('hidden'))
  viewEl.classList.remove('hidden')

  if (viewEl === DOM.viewQuests) refreshUI()

  const isQuestPanel = viewEl === DOM.viewQuests || viewEl === DOM.viewAct
  DOM.questIcon.classList.toggle('hidden', !isQuestPanel)
}
/** Populate the sidebar list for the given category */
export function renderQuestList(category) {
  if (category !== 'daily' && state.activeDaily) {
    state.activeDaily = null
    clearActiveDaily()
  }

  // Section heading
  DOM.questListTitle.textContent = SECTION_TITLES[category]
  DOM.questList.innerHTML = ''

  // Branch in one place based on the category
  switch (category) {
    // case 'urgent':
    // renderUrgentSection(showView, refreshUI);
    // break;

    case 'ascension':
      renderAscensionSection(showView, refreshUI)
      break

    case 'daily':
      renderDailySection(showView, refreshUI)
      break

    case 'side':
      renderSideSection(showView, refreshUI)
      break

    case 'main':
      renderMainSection(showView, refreshUI)
      break

    default:
      renderAllSection(showView, refreshUI)
      break
  }
}

/** Redraw everything in the detail panel when state changes */
/**
 * Redraws the detail panel.
 */

/** Wire up all the buttons and tabs */
function bindEventHandlers() {
  bindQuestOverlayEvents()
  bindCompleteQuestEvents()
  bindNavigationEvents()
  bindInventoryEvents()
}

window.addEventListener('DOMContentLoaded', () => {
  bindEventHandlers()
  switchTab(state.currentTab)
})

/**
+ * Decide which detail‐view to render based on current state.
+ * @returns {'side'|'daily'|'urgent'|'main'}
+ */
function determineBranch() {
  if (state.sideQuestIndex !== null) return 'side'
  if (state.activeDaily) return 'daily'
  if (state.ascensionQuestIndex !== null) return 'ascension'
  // if (state.urgentQuestIndex !== null) return 'urgent';
  return 'main'
}

// Map each branch key to its renderer
const detailRenderers = {
  side: renderSideDetail,
  daily: renderDailyEmbed,
  // urgent: renderUrgentDetail,
  ascension: renderAscensionDetail,
  main: renderMainQuest,
}

export function refreshUI() {
  // 0) housekeeping
  document.getElementById('quest-link')?.remove()
  DOM.completeQuestBtn.classList.remove('hidden')
  DOM.questDescription.classList.remove('hidden')
  DOM.completeQuestBtn.onclick = null
  DOM.viewQuests.classList.remove('daily-active')

  // 1) XP bar + radar
  renderXpAndRadar(DOM)
  updateStatusView()

  // 2) render the single appropriate detail view
  const branch = determineBranch()
  detailRenderers[branch]()
}
// keep the urgent countdown ticking
// setInterval(() => {
//   if (state.urgentDeadline !== null) refreshUI();
// }, 1000);
