// js/ui/questRefresher.js

import { state } from '../core/engine.js'

import { renderSideDetail } from './quests/sideDetail.js'
import { renderDailyEmbed } from './quests/dailyDetail.js'
import { renderAscensionDetail } from './quests/ascensionDetail.js'
import { renderMainQuest } from './quests/mainDetail.js'
// ...other imports

export function renderActiveQuest() {
  if (state.sideQuestIndex !== null) return renderSideDetail()
  if (state.activeDaily) return renderDailyEmbed()
  if (state.ascensionQuestIndex !== null) return renderAscensionDetail()
  // ...urgent, etc.
  return renderMainQuest()
}
