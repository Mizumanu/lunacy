// js/ui/events/eventsUtils.js
// ---- Helpers ----

export function renderEventCountdown(event) {
  const now = Date.now()
  const start = new Date(event.unlock).getTime()
  const totalDays = (event.duration || 1) + (event.additionDays || 0)
  const end = start + totalDays * 86400000
  if (now < start) return `Starts in: ${formatCountdown(start - now)}`
  if (now > end) return 'Event Ended'
  return `Ends in: ${formatCountdown(end - now)}`
}
export function formatCountdown(ms) {
  const d = Math.floor(ms / 86400000),
    h = Math.floor((ms % 86400000) / 3600000),
    m = Math.floor((ms % 3600000) / 60000)
  return ((d > 0 ? `${d}d ` : '') + (h > 0 ? `${h}h ` : '') + (m > 0 ? `${m}m` : '')).trim()
}

export function getEventDay(event) {
  const now = Date.now()
  const start = new Date(event.unlock).getTime()
  if (now < start) return 0
  const diff = now - start
  const totalDays = (event.duration || 1) + (event.additionDays || 0)
  // Clamp so that getEventDay never goes beyond totalDays
  return Math.min(Math.floor(diff / 86400000) + 1, totalDays)
}

export function isEventExpired(event) {
  const now = Date.now()
  const start = new Date(event.unlock).getTime()
  const expiry = (event.duration || 1) + (event.additionDays || 0)
  return now >= start + expiry * 86400000
}
export function renderRewardIcon(reward) {
  if (!reward) return ''

  let out = []

  // XP
  if (reward.xp)
    out.push(
      `<i class="fas fa-gem" style="color:#3ff; margin-left:9px"></i> <span style="font-size:1.05em">${reward.xp} XP</span>`,
    )
  // SP (fallback, if any tasks use it)
  if (reward.sp)
    out.push(
      `<i class="fas fa-key" style="color:#fc3; margin-left:9px"></i> <span style="font-size:1.05em">${reward.sp} SP</span>`,
    )

  // Skill Reward(s)
  if (reward.skillReward) {
    // Handles { speedtyping: 1, binge: 2, ... }
    Object.entries(reward.skillReward).forEach(([skill, amt]) => {
      out.push(
        `<i class="fas fa-bolt" style="color:#7df; margin-left:9px"></i> <span style="font-size:1.05em">+${amt} ${capitalize(skill)}</span>`,
      )
    })
  }

  return out.join(' ')
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Returns true if today is the final day defined for the event (e.g., day 7 of 7)
export function isEventFinalDay(event) {
  const start = new Date(event.unlock).getTime()
  const now = Date.now()
  const diffDays = Math.floor((now - start) / 86400000) + 1
  return diffDays === event.duration
}

/* ----------------------------------------------------------- */
/*  NEW: turn a shorthand like "healthE" into a full item spec */
/* ----------------------------------------------------------- */
export function resolveKeySpec(code) {
  // Accept “healthE”, “mainD”, “EfficiencyE”, “importantc” … case-insensitive
  if (typeof code !== 'string') return null

  const [, categoryRaw = '', rankRaw = ''] =
    code.match(/^([a-z]+)([a-e])$/i) || []

  if (!categoryRaw || !rankRaw) return null

  const category = categoryRaw.toLowerCase()       // health, main …
  const rank     = rankRaw.toUpperCase()           // A-E

  // Build friendly name & default icon path
  const name = `${category.charAt(0).toUpperCase() + category.slice(1)} (${rank}) Key`
  const icon = `/assets/keys/${rank}/${category}${rank}.png`

  return {
    name,
    type: 'key',
    rank,
    category,
    icon,
    description: `Unlocks ${rank}-rank ${category} ascension quests.`,
  }
}