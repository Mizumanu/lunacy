// js/quests/side/s1.js

// — Splash Screen —
export const s1Splash = {
  id: 's1-splash',
  category: 'side',
  type: 'splash',
  title: 'AI Copy Critique',
  description: 'Forge the perfect ChatGPT prompt to critique your copywriting. 6 steps await!',
  unlock: { level: 7 },
}

// — Step 1/6 —
export const s1Step1 = {
  id: 's1-step1',
  category: 'side',
  title: 'Step 1/6: Analyze a Perfect-ish Prompt',
  description: `
- Request a near-perfect prompt that critiques copy.
- Note its structure: role, goal, context, tasks, style/tone.`,
}

// — Step 2/6 —
export const s1Step2 = {
  id: 's1-step2',
  category: 'side',
  title: 'Step 2/6: Prompt the Prompt-Builder',
  description:
    'Use that model prompt to generate another prompt that asks the right questions for critique.',
}

// — Step 3/6 —
export const s1Step3 = {
  id: 's1-step3',
  category: 'side',
  title: 'Step 3/6: Uncover Critique Techniques',
  description:
    'List techniques you’d use to critique copy: frameworks, checklists, biases to watch for.',
}

// — Step 4/6 —
export const s1Step4 = {
  id: 's1-step4',
  category: 'side',
  title: 'Step 4/6: Study the Masters',
  description:
    'Watch 3 videos (Copy Squad, Guibi, Sales Breakdown) and note how they dissect copy.',
}

// — Step 5/6 —
export const s1Step5 = {
  id: 's1-step5',
  category: 'side',
  title: 'Step 5/6: Draft Your Master Prompt',
  description:
    'Answer the questions from your generated prompt to craft a final ‘master critique’ prompt.',
}

// — Step 6/6 —
export const s1Step6 = {
  id: 's1-step6',
  category: 'side',
  title: 'Step 6/6: Test & Tweak',
  description: 'Run your prompt against sample copy, iterate until it nails the critique.',
  rewardXP: 50,
  skillReward: { prompt: 3, thinking: 1 },
}

// — Full Side Quest Array —
export const s1 = [s1Splash, s1Step1, s1Step2, s1Step3, s1Step4, s1Step5, s1Step6]
