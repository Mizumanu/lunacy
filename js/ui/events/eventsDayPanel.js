// --- In js/ui/events/eventsDayPanel.js ---
import { updateXP, applySkillReward } from '../../core/engine.js'
import { awardItem } from '../inventory.js'
import { renderXpAndRadar } from '../uiHelpers.js'
import { renderRewardIcon, renderEventCountdown } from './eventsUtils.js'
import { notify } from '../../core/engine.js'
import { showEventDetail } from './eventsMain.js'
import { DOM } from '../dom.js'
import { getEventDay } from './eventsUtils.js'
import { isEventExpired } from './eventsUtils.js' // adjust path if needed

export function renderSectionDayByDayPanel(container, event, section, selectedDay = 1) {
  // Setup state (persist for the session)
  let elapsed = 0
  let timer = null
  let running = false

  // Find the tasks for today and milestones
  const tasks = section.tasks.filter((t) => t.day === selectedDay)
  const milestones = tasks.map((t) => t.timerMinutes * 60) // [180, 360, 540] for 3, 6, 9 min
  let claimed = new Array(tasks.length).fill(false)

  // Load from sessionStorage if you want persistence (optional)
  const stateKey = `event-timer-${event.id}-${section.id}-day${selectedDay}`
  try {
    const prev = JSON.parse(sessionStorage.getItem(stateKey))
    if (prev) {
      elapsed = prev.elapsed
      claimed = prev.claimed
    }
  } catch (err) {
    // Ignore errors
  }

  // Utility
  function saveState() {
    sessionStorage.setItem(stateKey, JSON.stringify({ elapsed, claimed }))
  }

  // --- Build UI ---
  const sidebar = document.createElement('div')
  sidebar.className = 'section-days-sidebar wide'
  const days = Array.from(new Set(section.tasks.map((t) => t.day))).sort((a, b) => a - b)
  const nowDay = getEventDay(event) // This gives you today’s “event day” (1-indexed)
  days.forEach((day, idx) => {
    const btn = document.createElement('button')
    btn.className = 'section-day-btn' + (day === selectedDay ? ' active' : '')
    btn.innerText = (section.dayLabels && section.dayLabels[idx]) || `Day ${day}`

    // LOCK logic: only unlock when nowDay >= day
    if (isEventExpired(event)) {
      btn.classList.add('locked')
      btn.title = `Event expired.`
      btn.onclick = () => notify('This event has expired.')
    } else if (nowDay < day) {
      btn.classList.add('locked')
      btn.title = `Unlocks on day ${day}!`
      btn.onclick = () => notify(`Day ${day} is not unlocked yet!`)
    } else {
      btn.onclick = () => renderSectionDayByDayPage(event, section, day)
    }
    sidebar.appendChild(btn)
  })
  const main = document.createElement('div')
  main.className = 'section-day-tasks-panel'
  main.innerHTML = `<h3>Day ${selectedDay}</h3>`

  // ---- Timer display ----
  const timerRow = document.createElement('div')
  timerRow.className = 'event-multi-timer-row'
  timerRow.style.display = 'flex'
  timerRow.style.alignItems = 'center'
  timerRow.style.gap = '22px'
  timerRow.style.marginBottom = '15px'

  const timerLabel = document.createElement('div')
  timerLabel.className = 'event-multi-timer-label'
  timerLabel.innerText = 'Timer:'

  const timerDisplay = document.createElement('div')
  timerDisplay.className = 'event-multi-timer-display'
  timerDisplay.innerText = formatTimer(elapsed)

  timerRow.appendChild(timerLabel)
  timerRow.appendChild(timerDisplay)

  main.appendChild(timerRow)

  // ---- Task rows with claim status ----
  const taskRows = []
  tasks.forEach((task, idx) => {
    const row = document.createElement('div')
    row.className = 'event-task-row'
    row.innerHTML = `
      <span>${task.title || ''}</span>
      <span class="reward-icon">${renderRewardIcon(task.reward)}</span>
      <span class="milestone-badge" id="milestone-badge-${idx}"></span>
    `
    main.appendChild(row)
    taskRows.push(row)
  })

  // ---- Buttons (Start/Stop/Continue/Claim All) ----
  const buttonsRow = document.createElement('div')
  buttonsRow.className = 'event-task-buttons-row'
  main.appendChild(buttonsRow)

  function updateTimerDisplay() {
    timerDisplay.innerText = formatTimer(elapsed)
    saveState()
  }

  function updateBadges() {
    tasks.forEach((task, idx) => {
      const badge = main.querySelector(`#milestone-badge-${idx}`)
      if (claimed[idx]) {
        badge.innerHTML = '<span class="badge-claimed">Claimed</span>'
      } else if (elapsed >= milestones[idx]) {
        badge.innerHTML = `<button class="badge-claim" onclick="window._claimMilestone_${idx}()">Claim!</button>`
      } else {
        badge.innerHTML = '<span class="badge-locked">Locked</span>'
      }
    })
    // Expose claim functions for each milestone
    tasks.forEach((_, idx) => {
      window[`_claimMilestone_${idx}`] = () => {
        if (!claimed[idx] && elapsed >= milestones[idx]) {
          claimed[idx] = true
          saveState()

          // --- Award rewards here ---
          const reward = tasks[idx].reward || {}
          // XP
          if (reward.xp) updateXP(reward.xp)
          // Skill reward (for SP, etc.)
          if (reward.skillReward) applySkillReward(reward.skillReward)
          // (Optional) If you want to allow direct sp as a fallback:
          if (reward.sp) applySkillReward({ speedtyping: reward.sp }) // pick default skill or change as needed

          // Refresh XP bar and radar
          renderXpAndRadar(DOM)

          updateBadges()
          notify(`Tier ${idx + 1} reward claimed!`)
        }
      }
    })
  }

  function updateButtons() {
    buttonsRow.innerHTML = ''
    if (!running && elapsed === 0) {
      // Not started
      const startBtn = document.createElement('button')
      startBtn.className = 'event-start-btn'
      startBtn.innerText = 'Start'
      startBtn.onclick = () => start()
      buttonsRow.appendChild(startBtn)
    } else if (running) {
      // Running
      const stopBtn = document.createElement('button')
      stopBtn.className = 'event-start-btn'
      stopBtn.innerText = 'Stop'
      stopBtn.onclick = () => stop()
      buttonsRow.appendChild(stopBtn)
    } else if (!running && elapsed < Math.max(...milestones)) {
      // Paused (not finished)
      const continueBtn = document.createElement('button')
      continueBtn.className = 'event-start-btn'
      continueBtn.innerText = 'Continue'
      continueBtn.onclick = () => start()
      buttonsRow.appendChild(continueBtn)
    }
    // Show Claim All when finished
    if (elapsed >= Math.max(...milestones)) {
      const claimAllBtn = document.createElement('button')
      claimAllBtn.className = 'event-start-btn'
      claimAllBtn.innerText = 'Claim All'
      claimAllBtn.onclick = () => {
        tasks.forEach((_, idx) => {
          if (!claimed[idx]) {
            claimed[idx] = true
            const reward = tasks[idx].reward || {}
            if (reward.xp) updateXP(reward.xp)
            if (reward.skillReward) applySkillReward(reward.skillReward)
            if (reward.sp) applySkillReward({ speedtyping: reward.sp }) // Or as needed
            notify(`Tier ${idx + 1} reward claimed!`)
          }
        })
        saveState()
        renderXpAndRadar(DOM)
        updateBadges()
      }
      buttonsRow.appendChild(claimAllBtn)
    }
  }

  function start() {
    running = true
    updateButtons()
    timer = setInterval(() => {
      elapsed++
      updateTimerDisplay()
      updateBadges()
      if (elapsed >= Math.max(...milestones)) {
        stop()
      }
    }, 1000)
  }
  function stop() {
    running = false
    clearInterval(timer)
    updateButtons()
    updateBadges()
  }

  function formatTimer(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  updateTimerDisplay()
  updateBadges()
  updateButtons()

  // Compose panel
  const flex = document.createElement('div')
  flex.className = 'section-day-flex'
  flex.appendChild(sidebar)
  flex.appendChild(main)
  container.appendChild(flex)
}

export function renderSectionDayByDayPage(event, section, selectedDay = 1) {
  const eventsList = DOM.viewEvents.querySelector('#events-list')
  eventsList.innerHTML = '' // clear everything

  // === Main day-by-day panel (full width) ===
  const main = document.createElement('div')
  main.className = 'events-main'

  // Panel background
  const bg = document.createElement('div')
  bg.className = 'events-main__bg'
  const panelName = event.panelName || 'speedPanel'
  bg.style.backgroundImage = `url('/assets/events/${event.id}/${panelName}.png')`
  main.appendChild(bg)

  // Header
  const header = document.createElement('div')
  header.className = 'events-header'
  header.innerHTML = `
    <h2>${section.label}</h2>
    <span class="events-timer">${renderEventCountdown(event)}</span>
    <button class="event-detail-close-btn" style="position:absolute;top:32px;right:44px;font-size:2em" title="Back">&times;</button>
  `
  header.querySelector('.event-detail-close-btn').onclick = () =>
    showEventDetail(event.id, section.id)
  main.appendChild(header)

  // Actual content (reuse your day-by-day logic)
  const panel = document.createElement('div')
  panel.style.position = 'relative'
  // <--- Key: must call the panel render!
  renderSectionDayByDayPanel(panel, event, section, selectedDay)
  main.appendChild(panel)

  // Compose and render (NO SIDEBAR)
  const container = document.createElement('div')
  container.className = 'events-container'
  container.appendChild(main)
  eventsList.appendChild(container)
}

export function renderFinalBattlePanel(event, section) {
  const eventsList = DOM.viewEvents.querySelector('#events-list')
  eventsList.innerHTML = ''

  // Compute current day and unlock logic
  const nowDay = getEventDay(event)
  const unlockDay = section.unlockDay || 1
  const isLocked = nowDay < unlockDay // lock until final-day arrives
  // DEBUG LOGS
  console.log('--- Final Battle Panel Debug ---')
  console.log('nowDay:', nowDay, 'unlockDay:', unlockDay, 'isLocked:', isLocked)
  console.log('Tasks:', section.tasks)
  console.log('Claimed:', sessionStorage.getItem(`event-finalbattle-${event.id}`))

  // --- Main panel ---
  const main = document.createElement('div')
  main.className = 'events-main'

  // REMOVE THIS: full-panel background
  // const bg = document.createElement('div')
  // bg.className = 'events-main__bg'
  // const panelName = event.panelName || 'speedPanel'
  // bg.style.backgroundImage = `url('/assets/events/${event.id}/${panelName}.png')`
  // main.appendChild(bg)

  // INSTEAD: Use the background image on the header only
  const header = document.createElement('div')
  header.className = 'events-header'
  const panelName = event.panelName || 'speedPanel'
  header.style.backgroundImage = `url('/assets/events/${event.id}/${panelName}.png')`
  header.style.backgroundSize = 'cover'
  header.style.backgroundPosition = 'center'
  header.innerHTML = `
    <h2>${section.label || 'Final Battle'}</h2>
    <button class="event-detail-close-btn" style="position:absolute;top:32px;right:44px;font-size:2em" title="Back">&times;</button>
  `
  header.querySelector('.event-detail-close-btn').onclick = () =>
    showEventDetail(event.id, section.id)
  main.appendChild(header)
  // --- Task list panel ---
  const mainPanel = document.createElement('div')
  mainPanel.className = 'final-battle-task-panel'
  // mainPanel.innerHTML = `<h3>${section.label || 'Final Battle'}</h3>`

  // Rewards state
  let claimed = JSON.parse(sessionStorage.getItem(`event-finalbattle-${event.id}`) || '[]')
  if (!Array.isArray(claimed)) claimed = []

  section.tasks.forEach((task, idx) => {
    const row = document.createElement('div')
    row.className = 'event-task-row'

    // Build reward icons (all reward types, readable)
    let rewards = ''
    if (task.reward) {
      if (task.reward.xp) {
        rewards += `<i class="fas fa-gem" style="color:#3ff; margin-left:9px"></i> <span style="font-size:1.05em">${task.reward.xp} XP</span>`
      }
      if (task.reward.skillReward) {
        for (const [skill, amt] of Object.entries(task.reward.skillReward)) {
          rewards += `<i class="fas fa-bolt" style="color:#7df; margin-left:9px"></i> <span style="font-size:1.05em">+${amt} ${capitalize(skill)}</span>`
        }
      }
      if (task.reward.sp) {
        rewards += `<i class="fas fa-key" style="color:#fc3; margin-left:9px"></i> <span style="font-size:1.05em">${task.reward.sp} SP</span>`
      }
      if (task.reward.key) {
        rewards += `<i class="fas fa-key" style="color:#ff0; margin-left:9px"></i> <span style="font-size:1.05em">Key: ${task.reward.key}</span>`
      }
    }

    // DEBUG per row:
    console.log(`[Task ${idx}] claimed?`, claimed[idx], '| isLocked:', isLocked)

    // Build claim button/status
    let claimBtn = ''
    if (claimed[idx]) {
      claimBtn = `<span class="badge-claimed">Claimed</span>`
    } else if (isLocked) {
      claimBtn = `<span class="badge-locked" style="opacity:.7;pointer-events:none;">Locked</span>`
    } else {
      claimBtn = `<button class="badge-claim" id="finalbattle-claim-${idx}">Claim</button>`
    }

    let descHtml = ''
    if (section.id === 'A' && task.description) {
      descHtml = `<div class="task-desc-a">${task.description}</div>`
    }
    row.innerHTML = `
  <div class="task-a-wrapper">
    <span class="task-title-a">${task.title || ''}</span>
    ${descHtml}
  </div>
  <span class="reward-icon">${rewards}</span>
  ${claimBtn}
`

    // Remove dim (for debugging always) -- always show
    row.style.opacity = 1
    mainPanel.appendChild(row)
  })
  /* ──────────────────────────────
     “Claim”   button handlers
  ────────────────────────────── */
  if (!isLocked) {
    section.tasks.forEach((task, idx) => {
      const btn = mainPanel.querySelector(`#finalbattle-claim-${idx}`)
      if (!btn) return
      btn.onclick = () => {
        if (claimed[idx]) return // already claimed

        /* 1. pay rewards */
        if (task.reward?.xp) updateXP(task.reward.xp)

        if (task.reward?.skillReward) applySkillReward(task.reward.skillReward)

        if (task.reward?.sp)
          // simple “SP” fallback
          applySkillReward({ speedtyping: task.reward.sp })

        if (task.reward?.key)
          // give the actual key item
          awardItem(task.reward.key, task.reward.qty || 1)

        /* 2. mark + persist */
        claimed[idx] = true
        sessionStorage.setItem(`event-finalbattle-${event.id}`, JSON.stringify(claimed))

        /* 3. UI feedback */
        renderXpAndRadar(DOM) // refresh bars / radars
        notify(`Final Battle: ${task.title} reward claimed!`)
        renderFinalBattlePanel(event, section) // re-render list
      }
    })
  }
  // -- Add to DOM
  main.appendChild(mainPanel)

  const container = document.createElement('div')
  container.className = 'events-container'
  container.appendChild(main)
  eventsList.appendChild(container)
}

// Helper (if not present)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
