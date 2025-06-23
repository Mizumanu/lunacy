// js/ui/questRenderer.js
import { createElement } from '../util/index.js'

/**
 * Renders a section into the given container.
 *
 * @param {HTMLElement} container
 * @param {string} headingText
 * @param {Array} items
 * @param {function(item, idx)} renderItem  — returns { text, className, onClick }
 * @param {object} opts
 *    opts.activeIdx  — which index to highlight
 *    opts.emptyText  — override when items.length === 0
 */
export function renderSection(container, headingText, items, renderItem, opts = {}) {
  const {
    activeIdx = null,
    emptyText = `No ${headingText.toLowerCase()}.`,
    showHeading = true,
  } = opts

  // 1) section heading
  if (showHeading) {
    container.append(
      createElement('h3', {
        className: 'sub-title',
        textContent: headingText,
      }),
    )
  }

  // 2) empty state
  if (items.length === 0) {
    container.append(
      createElement('p', {
        className: 'quest-item',
        textContent: emptyText,
      }),
    )
    return
  }

  // 3) render each item
  items.forEach((it, i) => {
    const { text, className, onClick } = renderItem(it, i)
    // create your `div.quest-item`
    const el = createElement('div', {
      className,
      textContent: text,
    })
    // highlight if active
    if (i === activeIdx) el.classList.add('active')
    // hook up click
    if (onClick) el.addEventListener('click', onClick)
    container.append(el)
  })
}
