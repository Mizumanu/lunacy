//js/ui/bindEvents/inventory.js
import { DOM } from '../dom.js'
import { renderInventory, initInventoryInteraction, filterInventory } from '../inventory.js'
import { showView } from '../main.js'

export function bindInventoryEvents() {
  DOM.btnInventory.addEventListener('click', (e) => {
    e.stopPropagation()
    renderInventory(DOM.inventoryList)
    initInventoryInteraction()
    showView(DOM.viewInventory)
    DOM.menu.classList.remove('open')

    document.querySelectorAll('.filter-btn').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((x) => x.classList.remove('active'))
        b.classList.add('active')
        filterInventory(b.dataset.filter)
      })
    })
  })
}
