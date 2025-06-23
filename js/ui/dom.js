// js/ui/dom.js

// ─── tiny DOM‐lookup helpers ────────────────────────────────
const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => [...document.querySelectorAll(sel)]

export const DOM = {
  // QUEST OVERLAY
  questIcon: $('#quest-icon'),
  questOverlay: $('#quest-overlay'),
  questTabs: $$('#quest-sidebar .quest-tab'),
  questListTitle: $('#quest-list-title'),
  questList: $('#quest-list'),
  newLeadBtn: $('#new-main-quest'),
  closeQuestBtn: $('#close-quest-overlay'),

  // QUEST DETAIL / ACT VIEW
  viewQuests: $('#view-quests'),
  questTitle: $('#quest-title'),
  questDescription: $('#quest-description'),
  questSteps: $('#quest-steps'),
  completeQuestBtn: $('#complete-quest'),
  viewAct: $('#view-act'),

  // STATUS PANEL
  viewStatus: $('#view-status'),
  levelEl: $('#status-level-value'),
  xpBarEl: $('#xp-bar'),
  xpTextEl: $('#xp-text'),

  // EVENTS PANEL
  viewEvents: $('#view-events'),

  // STATS PANEL
  viewStats: $('#view-stats'),
  statsTabs: $$('.stats-tab'),
  statsTitle: $('#stats-title'),

  // SPLASH SCREEN
  startActBtn: $('#start-act'),

  // RADAR CANVASES
  radarConfigs: [
    {
      canvas: $('#radar-main'),
      skills: ['writing', 'research', 'outreach', 'analysis', 'sales', 'binge'],
      labels: ['Writing', 'Research', 'Outreach', 'Analysis', 'Sales', 'Binge'],
    },
    {
      canvas: $('#radar-important'),
      skills: ['prompt', 'sleep', 'english'],
      labels: ['Prompt', 'Sleep', 'English'],
    },
    {
      canvas: $('#radar-efficiency'),
      skills: ['speedtyping', 'speedreading', 'ultralearning', 'superbinging', 'thinking'],
      labels: ['Speedtyping', 'Speedreading', 'Ultralearning', 'Superbinging', 'Thinking'],
    },
    {
      canvas: $('#radar-health'),
      skills: ['physical', 'mental', 'nutrition'],
      labels: ['Physical', 'Mental', 'Nutrition'],
    },
  ],
  squareCanvas: $('#square-stats'),
  // MENU
  menuIcon: $('#menu-icon'),
  menu: $('#menu'),
  btnQuests: $('#menu-quests'),
  btnStats: $('#menu-stats'),
  btnStatus: $('#menu-status'),
  btnEvents: $('#menu-events'),

  // INVENTORY
  btnInventory: $('#menu-inventory'),
  viewInventory: $('#view-inventory'),
  inventoryList: $('#inventory-items'),

  // LEAD MODAL
  leadModal: $('#lead-name-modal'),
  leadInput: $('#lead-name-input'),
  leadConfirm: $('#lead-name-confirm'),
  leadCancel: $('#lead-name-cancel'),

  // NOTIFICATION MODAL
  notificationModal: $('#notification-modal'),
  notificationText: $('#notification-text'),
  notificationOk: $('#notification-ok'),
  notificationBackdrop: $('#notification-modal .modal-backdrop'),
}
