// js/ui/events/eventsSection.js

import { getEventDay } from './eventsUtils.js'
import { notify } from '../../core/engine.js'
import { renderFinalBattlePanel } from './eventsDayPanel.js'
import { isEventExpired } from './eventsUtils.js'
/**
 * Renders the row of section icons (A at left, B/C... at right)
 * @param {object} event - the event object
 * @param {function} onSectionClick - callback when a section icon is clicked (unlocked)
 *        - called with the section object
 * @returns {HTMLElement}
 */
export function renderEventsSectionRow(event, onSectionClick) {
  const sectionRow = document.createElement('div')
  sectionRow.className = 'events-section-row flex-split'

  // LEFT: First icon (A)
  const leftGroup = document.createElement('div')
  leftGroup.className = 'section-row-left'
  const firstSec = event.sections[0]
  const leftIcon = document.createElement('img')
  leftIcon.className = 'event-section-icon'
  leftIcon.alt = firstSec.label
  leftIcon.title = firstSec.label
  leftIcon.src =
    firstSec.icon ||
    `/assets/events/${event.id}/${firstSec.iconName || firstSec.id.toLowerCase()}.png`

  const unlockDayA = firstSec.unlockDay || 1
  const nowDayA = getEventDay(event)
  const expired = isEventExpired(event)
  const isUnlockedA = nowDayA >= unlockDayA && !expired

  if (!isUnlockedA) {
    leftIcon.classList.add('locked')
    if (expired) {
      leftIcon.title = `Event expired.`
      leftIcon.onclick = () => notify('This event has expired.')
    } else {
      leftIcon.title = `Unlocks on day ${unlockDayA}!`
      leftIcon.onclick = () => notify(`Section "${firstSec.label}" unlocks on day ${unlockDayA}.`)
    }
  } else {
    leftIcon.onclick = () => {
      // If section is "Final Battle"
      renderFinalBattlePanel(event, firstSec)
    }
  
  }
  leftGroup.appendChild(leftIcon)

  // RIGHT: Remaining icons (B, C, ...)
  const rightGroup = document.createElement('div')
  rightGroup.className = 'section-row-right'
  event.sections.slice(1).forEach((sec) => {
    const icon = document.createElement('img')
    icon.className = 'event-section-icon'
    icon.alt = sec.label
    icon.title = sec.label
    icon.src = sec.icon || `/assets/events/${event.id}/${sec.iconName || sec.id.toLowerCase()}.png`

  const unlockDay = sec.unlockDay || 1
  const nowDay = getEventDay(event)
  const expired = isEventExpired(event)
  const isUnlocked = nowDay >= unlockDay && !expired

  if (!isUnlocked) {
    icon.classList.add('locked')
    if (expired) {
      icon.title = `Event expired.`
      icon.onclick = () => notify('This event has expired.')
    } else {
      icon.title = `Unlocks on day ${unlockDay}!`
      icon.onclick = () => notify(`Section "${sec.label}" unlocks on day ${unlockDay}.`)
    }
  } else {
    icon.onclick = () => onSectionClick(sec)
  }
  rightGroup.appendChild(icon)
})

  sectionRow.appendChild(leftGroup)
  sectionRow.appendChild(rightGroup)

  return sectionRow
}
