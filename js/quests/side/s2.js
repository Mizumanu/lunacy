// js/quests/side/s2.js

export const s2Splash = {
  id: 's2-splash',
  category: 'side',
  type: 'splash',
  title: 'The Sleep Architect',
  description:
    'Research proven sleep techniques, document them thoroughly, and build a 30-day paper checklist to track and optimize your nightly rituals.',
  unlock: { level: 2 },
}

export const s2Step1 = {
  id: 's2-step1',
  category: 'side',
  title: 'Step 1/5: Consult the Oracles',
  description:
    "Search for sleep optimization techniques using three sources: <br>(1) ChatGPT with the prompt '? Sleep' <br>(2) YouTube tutorials<br>(3) Google articles. <br>Cross-check the top recommendations across sources.",
}

export const s2Step2 = {
  id: 's2-step2',
  category: 'side',
  title: 'Step 2/5: Document the Rituals',
  description:
    'For each technique (e.g., 10-min meditation, 4-7-7 breathing, journaling) create a typed doc inside `Luna Skills/sleep/(date)` that explains: <br>1) the correct method<br>2) common mistakes or wrong ways.',
}

export const s2Step3 = {
  id: 's2-step3',
  category: 'side',
  title: 'Step 3/5: Build the Paper Checklist',
  description:
    'Draw a 30-day sleep tracker in your notebook. Each row should be Day 1–30. Columns should include: sleepiness rating (1–5), estimated time to fall asleep, and checkboxes for each technique you plan to test.',
}

export const s2Step4 = {
  id: 's2-step4',
  category: 'side',
  title: 'Step 4/5: Paste and Prepare',
  description:
    "Paste the checklist onto a notebook page where you'll see it daily. Keep a pen nearby. You'll tick techniques each night and fill in sleepiness/time details each morning.",
}

export const s2Step5 = {
  id: 's2-step5',
  category: 'side',
  title: 'Step 5/5: Begin the First Night',
  description:
    'Mark Day 1. Pick 1–3 techniques to test tonight. Commit. Tick off what you used in the morning and record sleepiness (1–5) and estimated time to sleep. Repeat daily for 30 days.',
  rewardXP: 25,
  skillReward: { sleep: 3 },
}

export const s2 = [s2Splash, s2Step1, s2Step2, s2Step3, s2Step4, s2Step5]
