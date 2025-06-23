// js/core/unlock.js

/**
 * Returns true if currentLevel ≥ quest.unlock.level
 *  and (no date OR now ≥ quest.unlock.date).
 */
export function isQuestUnlocked(quest, currentLevel) {
  /*------------------------------------------------------------
+    RULES
+    • Act-intro cards (they have *no* microSteps array *and*
+      are **not** side-quest splashes) are always unlocked.
+    • Otherwise honour unlock.level and optional unlock.date.
+  ------------------------------------------------------------*/
  const isSplash = quest.type === 'splash'
  const hasSteps = Array.isArray(quest.microSteps)
  if (!hasSteps && !isSplash) return true // act intro

  const lvlReq = quest.unlock?.level ?? 0
  const dateReq = quest.unlock?.date ? new Date(quest.unlock.date) : null

  const levelOK = currentLevel >= lvlReq
  const dateOK = !dateReq || new Date() >= dateReq

  return levelOK && dateOK
}
/**
 * Filters quests by category AND unlock conditions.
 */
export function getUnlockedQuests(quests, state, category) {
  return quests.filter((q) => q.category === category && isQuestUnlocked(q, state.currentLevel))
}
