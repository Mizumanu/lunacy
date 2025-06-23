// ── js/ui/questRefresher.js ─────────────────────────────────
// import { DOM } from './dom.js';
// import { renderQuestList, switchTab } from './main.js';
// import {
//   state,
//   getCurrentQuest,
//   updateUrgentProgress,
//   completeAscension,
//   updateStepProgress,
//   updateXP,
//   addCompletedDaily,
//   setActiveDaily,
//   clearActiveDaily,
//   advanceMainQuest,
// } from '../core/engine.js';
// import { pickTodaysDaily } from '../quests/daily/picker.js';
// import { sideQuests, advanceSideStep } from '../quests/side/side-helpers.js';
// import { dailyQuests } from '../quests/daily/index.js';
// import { urgentQuests } from '../quests/urgent/index.js';
// import { ascensionQuests } from '../quests/ascension/index.js';
// import { quests } from '../core/data.js';
// import { startAscensionTimer, clearAscensionTimer } from '../util/index.js';
// import {
//   createElement,
//   rollBonus,
//   formatBonus,
//   notifyWait,
// } from '../util/index.js';
// import { refreshUI, showView } from './main.js';
// import { awardItem } from './inventory.js';
// import { BTN, NOTIFY } from './text.js';
// import { notify } from '../core/engine.js';
// import { isQuestUnlocked } from '../core/engine.js';
// import { completeQuest } from '../core/engine.js';

/**
 * Returns true if it rendered the SIDE-quest detail.
 */
/**
 * Returns true if it rendered the embedded DAILY-quest detail.
 */

/**
+ * Returns true if it rendered the Ascension-quest detail.
+ */
/**
 * Returns true if it rendered the Ascension-quest detail.
 * (Full file is huge – this is JUST the function body you asked for.)
 */

/**
 * Returns true if it rendered the URGENT-quest detail.
 */
//  export function renderUrgentDetail() {

//   if (state.urgentQuestIndex === null) return false;

//   const asc = urgentQuests[0];
//   if (!asc) return false;
//   const stage = state.urgentQuestIndex;
//   const trial = asc.chain[stage];

//   document.getElementById('urgent-timer')?.remove();
//   if (state.urgentDeadline) {
//     const rem = Math.max(0, state.urgentDeadline - Date.now());
//     const h = String(Math.floor(rem / 3600000)).padStart(2, '0');
//     const m = String(Math.floor((rem % 3600000) / 60000)).padStart(2, '0');
//     const s = String(Math.floor((rem % 60000) / 1000)).padStart(2, '0');
//     const t = createElement('p', {
//       id: 'urgent-timer',
//       textContent: `Time remaining: ${h}:${m}:${s}`,
//     });
//     DOM.questTitle.before(t);
//   }
//   document.getElementById('act-number')?.remove();
//   const hdr = createElement('p', {
//     id: 'act-number',
//     textContent: `Trial ${stage + 1}/${asc.chain.length}`,
//   });
//   DOM.questTitle.before(hdr);

// DOM.questTitle.textContent = asc.title;
// DOM.questDescription.textContent = trial.description || '';

// DOM.questSteps.innerHTML = '';
//   const ul = createElement('ul');
//   trial.microSteps.forEach((st, i) => {
//     const cb = createElement('input', {
//       type: 'checkbox',
//       id: `u-step-${i}`,
//       checked: (state.urgentProgress[stage] || []).includes(i),
//     });
//     cb.addEventListener('change', () => {
//       updateUrgentProgress(i);
//       refreshUI();
//     });
//     const lb = createElement('label', { htmlFor: cb.id, textContent: st });
//     const li = createElement('li');
//     li.append(cb, lb);
//     ul.append(li);
//   });
//   DOM.questSteps.append(ul);

//   document.getElementById('quest-reward')?.remove();
//   const r = createElement('p', {
//     id: 'quest-reward',
//     textContent: `Reward: +${trial.rewardXP} XP`,
//   });
//   DOM.questSteps.after(r);

//   return true;
// }
/**
 * The fallback: renders the MAIN-quest detail.
 */
