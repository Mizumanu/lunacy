// js/quests/side/s5.js

export const s5Splash1 = {
  id: 's5-splash1',
  category: 'side',
  type: 'splash',
  title: 'Path of the Quill',
  description:
    'A side quest for writing-based mastery. Choose this path to focus on refining language, flow, and creativity.',
  unlock: { level: 1 },
}

export const s5Step1 = {
  id: 's5-step1',
  category: 'side',
  title: 'Step 1/3: Freewrite',
  description:
    'Write 300 words without stopping on any topic of your choice.<br>Ignore structure, grammar, or coherence—just let the words spill.',
  rewardXP: 15,
}

export const s5Step2 = {
  id: 's5-step2',
  category: 'side',
  title: 'Step 2/3: Sharpen the Blade',
  description:
    'Pick your favorite paragraph and revise it for flow, rhythm, and word choice.<br>Read it out loud, then polish again.',
  url: 'www.google.com',
}

export const s5Step3 = {
  id: 's5-step3',
  category: 'side',
  title: 'Step 3/3: Compress with Force',
  description:
    'Take the entire 300-word text and rewrite it in under 100 words without losing core meaning.<br>Make it tight. Make it punch.',
  rewardXP: 15,
  skillReward: { writing: 2 },
}

export const s5Splash2 = {
  id: 's5-splash2',
  category: 'side',
  type: 'splash',
  title: 'Path of the Forge',
  description:
    'A side quest focused on systems and structure. Choose this path to train discipline, planning, and system design.',
  unlock: { level: 1 },
}

export const s5Step4 = {
  id: 's5-step4',
  category: 'side',
  title: 'Step 1/3: Identify the Leak',
  description:
    "Pick a habit or system in your life that feels inefficient or leaky.<br>Write 3 reasons why it's not working.",
  notice: 'step4-notice',
}

export const s5Step5 = {
  id: 's5-step5',
  category: 'side',
  title: 'Step 2/3: Draft a Fix Plan',
  description:
    'Brainstorm at least 2 structural fixes for the leak.<br>Don’t worry about perfect execution—focus on realistic experiments.',
}

export const s5Step6 = {
  id: 's5-step6',
  category: 'side',
  title: 'Step 3/3: Implement Mini Change',
  description:
    'Apply one change within the next 24 hours.<br>Observe what shifts and write a 2-line post-action note.',
  rewardXP: 15,
  skillReward: { thinking: 2 },
}

export const s5 = [s5Splash1, s5Step1, s5Step2, s5Step3, s5Splash2, s5Step4, s5Step5, s5Step6]
