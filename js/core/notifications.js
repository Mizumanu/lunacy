// Cache DOM elements
const modal = document.getElementById('notification-modal')
const textEl = document.getElementById('notification-text')
const okBtn = document.getElementById('notification-ok')
const backdrop = modal.querySelector('.modal-backdrop')

// Notification queue & state
const queue = []
let showing = false
let hideTimer = null

function hideCurrent() {
  clearTimeout(hideTimer)
  modal.classList.add('hidden')
  showing = false

  // Fire off a “notify-hide” event so listeners can proceed
  window.dispatchEvent(new Event('notify-hide'))

  // Show next queued notification after a tiny pause
  setTimeout(showNext, 200)
}

export function initNotifications() {
  okBtn.addEventListener('click', hideCurrent)
  backdrop.addEventListener('click', hideCurrent)
}

/**
 * Show a notification with optional `hideOkButton` flag.
 * @param {string} message    — the HTML/text to display
 * @param {object} [options]  — e.g. { hideOkButton: true }
 */
export function notify(message, options = {}) {
  const hideOk = !!options.hideOkButton
  const long = !!options.long // <-- NEW: for long notifications
  queue.push({ text: message, hideOk, long })
  showNext()
}

function showNext() {
  if (showing || queue.length === 0) return
  showing = true
  const { text, hideOk, long } = queue.shift()
  textEl.innerHTML = text

  // Hide or show OK button
  if (hideOk) {
    okBtn.classList.add('hidden')
  } else {
    okBtn.classList.remove('hidden')
  }

  // Show the modal
  modal.classList.remove('hidden')

  // Tag “daily‐rewards” panel if needed (unchanged)
  const panel = modal.querySelector('.modal-content')
  if (text.startsWith('Daily rewards:')) {
    panel.classList.add('daily-rewards')
  } else {
    panel.classList.remove('daily-rewards')
  }

  // --- Extended delay if flagged as 'long' ---
  const delay = long ? 12000 : 4000
  clearTimeout(hideTimer)
  hideTimer = setTimeout(hideCurrent, delay)
}
