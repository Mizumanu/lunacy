// js/ui/bindEvents/navigation.js

import { DOM } from '../dom.js'
import { showView, switchTab } from '../main.js'
import { renderXpAndRadar } from '../uiHelpers.js'
import { STATS_TITLES } from '../text.js'
import { updateStatusView } from '../uiHelpers.js'
import { renderEventsPanel } from '../events.js'

export function bindNavigationEvents() {
  // menu toggle
  DOM.menuIcon.addEventListener('click', (e) => {
    e.stopPropagation()
    DOM.menu.classList.toggle('open')
  })
  document.addEventListener('click', (e) => {
    if (!DOM.menu.contains(e.target) && !DOM.menuIcon.contains(e.target)) {
      DOM.menu.classList.remove('open')
    }
  })

  // menu items
  DOM.btnQuests.addEventListener('click', (e) => {
    e.stopPropagation()
    showView(DOM.viewQuests)
    renderXpAndRadar(DOM) // ensure quests loads with fresh radars/stats
    DOM.menu.classList.remove('open')
  })
  DOM.btnEvents.addEventListener('click', (e) => {
    e.stopPropagation()
    showView(DOM.viewEvents)
    renderEventsPanel()
    DOM.menu.classList.remove('open')
  })
  DOM.btnStats.addEventListener('click', (e) => {
    e.stopPropagation()
    showView(DOM.viewStats)
    renderXpAndRadar(DOM) // ← call here so when you open Stats, it draws "All" by default
    DOM.menu.classList.remove('open')
  })
  DOM.btnStatus.addEventListener('click', (e) => {
    e.stopPropagation()
    updateStatusView()
    showView(DOM.viewStatus)
    DOM.menu.classList.remove('open')
  })

  // stats tabs (All, Main, Important, Efficiency, Health)
  DOM.statsTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // 1) Visual highlight
      DOM.statsTabs.forEach((t) => t.classList.toggle('active', t === tab))

      // 2) Switch the viewStats class so CSS can hide/show canvases
      const section = tab.dataset.section // "all", "main", etc.
      DOM.viewStats.className = `section-${section}`

      // 3) Update the heading text
      DOM.statsTitle.textContent = STATS_TITLES[section] || STATS_TITLES.all

      // 4) Actually redraw the chart (diamond or radar)
      renderXpAndRadar(DOM)

      // 5) Ensure the Stats panel is visible
      showView(DOM.viewStats)
    })
  })

  // ── QUEST‐SIDEBAR TABS ──────────────────────────────────────
  DOM.questTabs.forEach((tabEl) => {
    const cat = tabEl.dataset.cat
    tabEl.addEventListener('click', (e) => {
      e.stopPropagation()
      switchTab(cat)
    })
  })
}
