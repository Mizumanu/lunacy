import { DOM } from '../dom.js'
import { renderQuestList, showView, refreshUI } from '../main.js'
import { state, createLead } from '../../core/engine.js'
import { setSideQuestIndex } from '../../core/engine.js'
import { notify } from '../../core/engine.js'

export function bindQuestOverlayEvents() {
  // open/close
  DOM.questIcon.addEventListener('click', () => {
    let category = state.sideQuestIndex !== null ? 'side' : state.activeDaily ? 'daily' : 'all'
    if (category === 'side' && state.sideQuestIndex === null) category = 'all'
    if (category !== 'side' && state.sideQuestIndex !== null) {
      setSideQuestIndex(null)
    }
    DOM.questTabs.forEach((t) => t.classList.toggle('active', t.dataset.cat === category))
    renderQuestList(category)
    showView(DOM.viewQuests)
    DOM.questOverlay.classList.toggle('hidden')
  })
  DOM.closeQuestBtn.addEventListener('click', () => DOM.questOverlay.classList.add('hidden'))

  // new‐lead modal
  DOM.newLeadBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    DOM.leadInput.value = ''
    DOM.leadModal.classList.remove('hidden')
    const rect = DOM.newLeadBtn.getBoundingClientRect()
    Object.assign(DOM.leadModal.style, {
      top: `${rect.bottom + 10}px`,
      left: `${rect.left}px`,
    })
    DOM.leadInput.focus()
  })
  DOM.leadConfirm.addEventListener('click', () => {
    const name = DOM.leadInput.value.trim()
    if (!name) return
    if (!createLead(name)) {
      DOM.leadInput.setCustomValidity('Name taken')
      DOM.leadInput.reportValidity()
      return
    }
    DOM.leadModal.classList.add('hidden')
    renderQuestList('main')
    refreshUI()
    showView(DOM.viewAct)
    notify(`New quest “${name}” created!`)
  })
  DOM.leadCancel.addEventListener('click', () => DOM.leadModal.classList.add('hidden'))
  DOM.leadModal
    .querySelector('.modal-backdrop')
    .addEventListener('click', () => DOM.leadModal.classList.add('hidden'))

  // sidebar tabs
  DOM.questTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      DOM.questTabs.forEach((t) => t.classList.toggle('active', t === tab))
      const category = tab.dataset.cat
      if (category !== 'side' && state.sideQuestIndex !== null) {
        setSideQuestIndex(null)
      }
      if (category === 'side' && state.sideQuestIndex !== null) {
        showView(DOM.viewQuests)
        refreshUI()
      } else {
        renderQuestList(category)
        showView(DOM.viewQuests)
      }
    })
  })
}
