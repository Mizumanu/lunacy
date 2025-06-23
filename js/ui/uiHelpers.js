// ── js/ui/uiHelpers.js ─────────────────────────────────────
import { updateXP, getSkillsRadarData, state } from '../core/engine.js'
import { drawRadar } from './charts.js'
import { DOM } from './dom.js'
import { rankCaps, rankLetters, levelUpXP } from '../core/data.js'
import { getRankIndex } from '../util/index.js'
import { playerRankCaps } from '../core/data.js'
import { getPlayerRankLetter } from '../util/index.js'

// NEW: category‐based stats helpers
// import { getAllCategoryStats, CATEGORY_LABELS } from '../core/engine.js';
import { drawSquareStats } from './squareChart.js'

/**
 * Updates XP bar + text, then redraws either:
 *  - the single square chart (if “All” tab is active), or
 *  - whichever one radar chart (Main, Important, Efficiency, or Health) is active.
 */
export function renderXpAndRadar(DOM) {
  // 1) Update XP bar and text exactly as before
  const { level, xp, nextXp } = updateXP(0)
  DOM.levelEl.textContent = level
  DOM.xpBarEl.style.width = `${(xp / nextXp) * 100}%`
  DOM.xpTextEl.textContent = `XP: ${xp}/${nextXp}`

  // 2) Are we on the "All" tab? (viewStats has class "section-all")
  const isAll = DOM.viewStats.classList.contains('section-all')

  if (isAll) {
    // ── “All” Tab: Draw the single diamond chart ────────────────────

    // 2a) Compute *normalized percentages* for each of the four categories
    //     (We could just call getAllCategoryStats and use that, but to also get the rank letters below,
    //      we compute raw averages first, then normalize below.)
    //
    //    getSkillsRadarData(DOM.radarConfigs) returns an array of four objects,
    //    each with `.values` (array of skill‐percentages) and `.labels`.
    //    We want a single number per category = the average of that category’s skill‐percent list.
    const radarData = getSkillsRadarData(DOM.radarConfigs)
    const normValues = radarData.map((d) =>
      Math.round(d.values.reduce((sum, v) => sum + v, 0) / d.values.length),
    )
    //    Now `normValues` is an array of four integers, each 0–100, in the order of DOM.radarConfigs:
    //      [MainPercent, ImportantPercent, EfficiencyPercent, HealthPercent]

    // 2b) Compute “raw” average XP per category (to pick letter)
    const rawAvgs = DOM.radarConfigs.map((cfg) => {
      const total = cfg.skills.reduce((sum, sk) => sum + (state.skills[sk] || 0), 0)
      return total / cfg.skills.length
    })
    // 2c) Convert those raw averages into rank letters (E, D, C, B, A, S)
    const letters = rawAvgs.map((xpValue) => {
      const idx = getRankIndex(xpValue, rankCaps)
      return rankLetters[idx]
    })

    // 2d) Build an array of labels with letter suffix: ["Main (E)", "Important (D)", ...]
    const categories = ['Main', 'Important', 'Efficiency', 'Health']
    const labelsWithLetter = categories.map((cat, i) => `${cat} (${letters[i]})`)

    // 2e) Finally, draw the single square/diamond chart
    const ctx = DOM.squareCanvas.getContext('2d')
    drawSquareStats(ctx, normValues, labelsWithLetter)
  } else {
    // ── Not “All” Tab: Draw the ONE radar chart that is visible ────────────────────

    // We assume each DOM.radarConfigs[i] has:
    //    { canvas: <canvas-element>, skills: [...], labels: [...] }
    // getSkillsRadarData(DOM.radarConfigs) returns four { values, labels } objects in that same order.

    getSkillsRadarData(DOM.radarConfigs).forEach(({ values, labels }, i) => {
      const canv = DOM.radarConfigs[i].canvas
      if (!canv) return
      // If that canvas’s parent has class "section‐X" matching the active stats tab, it’s visible.
      // Instead of querying CSS, we can simply draw on all four, but ensure only one is shown via CSS.
      const ctx = canv.getContext('2d')
      drawRadar(ctx, values, labels)
    })
  }
}

/**
 * Highlight the active quest‐tab in the sidebar (no change needed).
 * @param {'all'|'daily'|'side'|'main'|'urgent'} category
 */
export function highlightActiveTab(category) {
  DOM.questTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.cat === category)
  })
}

// Returns true if any special quest (ascension, side, daily) is active (no change needed)
export function isAnySpecialQuestActive(state) {
  return (
    state.ascensionQuestIndex !== null ||
    state.sideQuestIndex !== null ||
    state.activeDaily !== null
  )
}

export function updateStatusView() {
  // DEBUG: log out current rank-point total
  // console.log("💠 Player rank points:", state.playerRank);

  // Level/XP bar (unchanged)
  DOM.levelEl.textContent = state.currentLevel
  const xpMax = levelUpXP[state.currentLevel] || 100
  DOM.xpBarEl.style.width = `${(100 * state.currentXP) / xpMax}%`
  DOM.xpTextEl.textContent = `XP: ${state.currentXP}/${xpMax}`

  // Rank bar — FILL BY CURRENT TIER, NOT TOTAL
  const currentRankPoints = state.playerRank || 0

  // Find which tier we're in (E, D, C, B, A, S)
  let tierIdx = playerRankCaps.findIndex((cap) => currentRankPoints < cap)
  if (tierIdx === -1) tierIdx = playerRankCaps.length - 1 // If max, S-rank

  // Lower and upper bounds for this tier
  const lower = tierIdx === 0 ? 0 : playerRankCaps[tierIdx - 1]
  const upper = playerRankCaps[tierIdx]

  // Calculate percent progress in this tier
  const tierSpan = upper - lower
  const inTierPoints = currentRankPoints - lower
  const percent = tierSpan ? Math.min(100, (100 * inTierPoints) / tierSpan) : 100

  // DEBUG: show which tier and tier percent
  // console.log(
  //   `💠 Tier: ${
  //     ["E", "D", "C", "B", "A", "S"][tierIdx] || "S"
  //   }, lower: ${lower}, upper: ${upper}`
  // );
  // console.log("💠 Rank % in current tier:", percent.toFixed(1) + "%");

  document.getElementById('rank-bar').style.width = `${percent}%`

  // Rank text (getPlayerRankLetter should use the new cap system)
  const letter = getPlayerRankLetter(currentRankPoints)
  document.getElementById('rank-text').textContent = `${letter} rank`
}
