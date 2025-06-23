// js/ui/inventory.js
import { state, persist } from '../core/engine.js'
import { log, warn } from '../util/index.js'
  import { resolveKeySpec } from './events/eventsUtils.js'
/* ----------------------------------------------------------- */
/* 1)  Default item specs (unchanged)                           */
/* ----------------------------------------------------------- */
const DEFAULT_ITEMS = [
  // {
  //   name: 'Main (E) Key',
  //   type: 'key',
  //   rank: 'E',
  //   category: 'main',
  //   icon: '/assets/keys/E/mainE.png',
  //   quantity: 2,
  //   description: 'Unlocks E-rank Main ascension quests.',
  // },
  // {
  //   name: 'Main (D) Key',
  //   type: 'key',
  //   rank: 'E',
  //   category: 'main',
  //   icon: '/assets/keys/D/mainD.png',
  //   quantity: 2,
  //   description: 'Unlocks D-rank Main ascension quests.',
  // },
  // {
  //   name: 'Efficiency (E) Key',
  //   type: 'key',
  //   rank: 'E',
  //   category: 'efficiency',
  //   icon: '/assets/keys/E/efficiencyE.png',
  //   quantity: 2,
  //   description: 'Unlocks E-rank Efficiency ascension quests.',
  // },
  // {
  //   name: 'Important (E) Key',
  //   type: 'key',
  //   rank: 'E',
  //   category: 'important',
  //   icon: '/assets/keys/E/importantE.png',
  //   quantity: 2,
  //   description: 'Unlocks E-rank Important ascension quests.',
  // },
  // {
  //   name: 'Health (E) Key',
  //   type: 'key',
  //   rank: 'E',
  //   category: 'health',
  //   icon: '/assets/keys/E/healthE.png',
  //   quantity: 2,
  //   description: 'Unlocks E-rank Health ascension quests.',
  // },
  // {
  //   name: 'Instant Teleportation Stone',
  //   type: 'rune',
  //   icon: '/assets/runes/teleportStone.png',
  //   quantity: 3,
  //   description: 'A charged rune that bends space for one blink.',
  // },
]

/* ----------------------------------------------------------- */
/* 2)  Helper: ensure state.inventory is initialised            */
/* ----------------------------------------------------------- */
function ensureInventory() {
  if (!Array.isArray(state.inventory) || state.inventory.length === 0) {
    state.inventory = DEFAULT_ITEMS.map((it) => ({ ...it }))
  }
}

/* ----------------------------------------------------------- */
/* 3)  Mutators (persisted)                                     */
/* ----------------------------------------------------------- */
function _useItem(name) {
  ensureInventory()
  const idx = state.inventory.findIndex((i) => i.name === name)
  if (idx === -1) return
  const it = state.inventory[idx]
  if (--it.quantity <= 0) state.inventory.splice(idx, 1)
  log(`🚀 Used one ${name}. Remaining: ${it.quantity || 0}`)
}
export const useItem = persist(_useItem)

function _awardItem(specOrName, qty = 1) {
  ensureInventory()
  let it
  if (typeof specOrName === 'string') {
    it = state.inventory.find((i) => i.name === specOrName)
      if (!it) {
        // Try to interpret the shorthand and auto-create a key spec
        const spec = resolveKeySpec(specOrName)
        if (!spec) return warn(`awardItem: unknown item “${specOrName}”`)
  
                // 🔍 Does this key already exist *after* we expanded the spec?
              it = state.inventory.find((i) => i.name === spec.name)
                if (!it) {
                  it = { ...spec, quantity: 0 }
                  state.inventory.push(it)
                  log(`↳ New key added: ${it.name}`)
                } else {
                  log(`↳ Merging with existing slot: ${it.name}`)
                }
      }
  } else if (specOrName && specOrName.name) {
      /*  ⬇️  NEW: merge with an existing slot if the key already exists  */
      it = state.inventory.find((i) => i.name === specOrName.name)
      if (!it) {
        it = { ...specOrName, quantity: 0 }
        state.inventory.push(it)
        log(`↳ New item added: ${it.name}`)
      } else {
        log(`↳ Merging with existing slot: ${it.name}`)
      }
   } else {
    return warn('awardItem: invalid argument', specOrName)
  }
  it.quantity += qty
  log(`🏆 Awarded ${qty}× ${it.name}. Total now: ${it.quantity}`)
}
export const awardItem = persist(_awardItem)

/* ----------------------------------------------------------- */
/* 4)  Rendering & filtering                                    */
/* ----------------------------------------------------------- */
export function renderInventory(container, list = null) {
  ensureInventory()
  const items = list || state.inventory
  container.innerHTML = ''
  container.classList.add('inventory-grid')

  items
    .filter((i) => i.quantity > 0)
    .forEach((i) => {
      const tile = document.createElement('div')
      tile.className = 'inventory-item'
      tile.style.backgroundImage = `url(${i.icon})`
      tile.dataset.count = i.quantity
      tile._item = i
      container.appendChild(tile)
    })
}

export function filterInventory(type) {
  const c = document.getElementById('inventory-items')
  ensureInventory()
  if (type === 'all') renderInventory(c)
  else
    renderInventory(
      c,
      state.inventory.filter((i) => i.type === type),
    )
}

/* ----------------------------------------------------------- */
/* 5)  Interaction wiring                                       */
/* ----------------------------------------------------------- */

export function initInventoryInteraction() {
  const container = document.getElementById('inventory-items')
  const modal = document.getElementById('inventory-modal')
  const backdrop = modal.querySelector('.modal-backdrop')
  const modalBody = modal.querySelector('.modal-body')
  let current

  // 1️⃣ Open modal on click
  container.addEventListener('click', (e) => {
    const tile = e.target.closest('.inventory-item')
    if (!tile) return
    current = tile._item

    // build two-column content
    modalBody.innerHTML = `
      <div class="inventory-img">
        <img src="${current.icon}" alt="${current.name}" />
      </div>
      <div class="inventory-info">
        <h3>${current.name}</h3>
        <p>Type: ${current.type}</p>
        ${current.rank ? `<p>Rank: ${current.rank}</p>` : ''}
        ${current.category ? `<p>Category: ${current.category}</p>` : ''}
        <p>${current.description}</p>
        <button id="modal-use-btn" class="use-btn">Use</button>
      </div>
    `

    // wire the Use button
    document.getElementById('modal-use-btn').addEventListener('click', () => {
      useItem(current.name)
      renderInventory(container)
      modal.classList.add('hidden')
    })

    modal.classList.remove('hidden')
  })

  // 2️⃣ Close when clicking backdrop
  backdrop.addEventListener('click', () => {
    modal.classList.add('hidden')
  })

  // 3️⃣ Also close if clicking the transparent area around modal-content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden')
    }
  })
}
// 👇 add this line
export const inventoryItems = DEFAULT_ITEMS // legacy re-export for old imports
