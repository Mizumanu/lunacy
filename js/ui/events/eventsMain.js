// js/ui/events/eventsMain.js

import { events } from '../../events/index.js'
import { DOM } from '../dom.js'
// Or your path
import { renderEventsSidebar } from './eventsSidebar.js'

import { renderEventCountdown } from './eventsUtils.js'

import { renderSectionDayByDayPage,
       renderFinalBattlePanel } from './eventsDayPanel.js'

import { renderEventsSectionRow } from './eventsSection.js'

import { renderSectionDetail } from './eventsDetails.js'

// Utility: get active events
function getActiveEvents() {
  const now = Date.now()
  return events
    .map((e) => {
      const start = new Date(e.unlock).getTime()
     // include “grace” days after the normal duration
     const totalDays = (e.duration || 1) + (e.additionDays || 0)
     const end = start + totalDays * 86400000
      return now >= start && now <= end ? e : null
    })
    .filter(Boolean)
}

// Get only active and upcoming events (1 day)
function getSidebarEvents() {
  const now = Date.now()
  return events.filter((ev) => {
    const start = new Date(ev.unlock).getTime()
   const totalDays = (ev.duration || 1) + (ev.additionDays || 0)
   const end = start + totalDays * 86400000
    if (now >= start && now <= end) return true        // Active
    if (now < start && start - now <= 86400000) return true // Upcoming ≤24 h
    return false
  })
}

// MAIN RENDER: Full Genshin-Style Events Layout
export function renderEventsPanel() {
  const sidebarEvents = getSidebarEvents()
  const eventsList = DOM.viewEvents.querySelector('#events-list')
  eventsList.innerHTML = ''
  if (sidebarEvents.length === 0) {
    eventsList.innerHTML = `<div class="events-container"><div class="events-main"><div class="events-header"><h2>No Active Events</h2></div></div></div>`
    return
  }
  // Open the first event by default
  showEventDetail(sidebarEvents[0].id)
}

export function showEventDetail(eventId, sectionId = null) {
  const sidebarEvents = getSidebarEvents()
  if (!sidebarEvents.length) return renderEventsPanel()
  const event = sidebarEvents.find((e) => e.id === eventId) || sidebarEvents[0]
  const eventsList = DOM.viewEvents.querySelector('#events-list')
  eventsList.innerHTML = ''

  // === Sidebar ===
  const sidebar = renderEventsSidebar(sidebarEvents, event.id, showEventDetail)

  // === Main panel ===
  const main = document.createElement('div')
  main.className = 'events-main'
  // -- Panel background image
  const bg = document.createElement('div')
  bg.className = 'events-main__bg'
  const panelName = event.panelName || 'speedPanel'
  bg.style.backgroundImage = `url('/assets/events/${event.id}/${panelName}.png')`
    main.appendChild(bg)

  // -- Header (Title & Timer)
  const header = document.createElement('div')
  header.className = 'events-header'
  header.innerHTML = `<h2>${event.title}</h2>
    <span class="events-timer">${renderEventCountdown(event)}</span>`
  main.appendChild(header)

  // -- Info (just show event description, not as a section!)
  const info = document.createElement('div')
  info.className = 'events-info'
  info.innerText = event.description
  main.appendChild(info)

  // -- Section detail placeholder (empty until user clicks!)
  const sectionDetail = document.createElement('div')
  sectionDetail.className = 'events-section-detail'
  // sectionDetail.innerHTML = `<div style="text-align:center;color:#ccc;padding:2em;">
  //   Select a section below to view tasks and rewards.
  // </div>`
  main.appendChild(sectionDetail)

  // -- Section icons row: use the new modular function!
  const sectionRow = renderEventsSectionRow(event, (section) => {
    sectionDetail.innerHTML = ''
    // Route to Final Battle panel if section is "A"
    if (section.id === 'A') {
      renderFinalBattlePanel(event, section)
    }
    // Optional: If you ever re-enable an "Info" panel at [0], handle it here
    else if (section.id === event.sections[0].id && section.id !== 'A') {
      const detail = renderSectionDetail(event, section)
      sectionDetail.appendChild(detail.firstElementChild || detail)
    } else {
      renderSectionDayByDayPage(event, section)
    }
  })
  main.appendChild(sectionRow)

  // -- Compose main container
  const container = document.createElement('div')
  container.className = 'events-container'
  container.appendChild(sidebar)
  container.appendChild(main)
  eventsList.appendChild(container)
}
