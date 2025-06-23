// js/quests/side/s3.js

export const s3Splash = {
  id: 's3-splash',
  category: 'side',
  type: 'splash',
  title: 'The Ultralearning Overhaul',
  description:
    'Master the 9 principles of Ultralearning and build a mindmap that rewires how you learn skills like prompt engineering, writing, and sleep optimization.',
  unlock: { level: 5 },
}

export const s3Step1 = {
  id: 's3-step1',
  category: 'side',
  title: 'Step 1/5: Decode the Principles',
  description:
    'Research all 9 Ultralearning principles:<br>• Meta-learning<br>• Focus<br>• Directness<br>• Drill<br>• Retrieval<br>• Feedback<br>• Retention<br>• Intuition<br>• Experimentation<br><br>Use multiple sources like ChatGPT, Google, and YouTube.',
}

export const s3Step2 = {
  id: 's3-step2',
  category: 'side',
  title: 'Step 2/5: Analyze Your Skills',
  description:
    "Choose 2–3 skills you're currently learning (e.g., prompt engineering, sleep, writing).<br>For each Ultralearning principle, write how it could apply to one or more of these skills.",
}

export const s3Step3 = {
  id: 's3-step3',
  category: 'side',
  title: 'Step 3/5: Build the Mindmap',
  description:
    'Draw a single mindmap on paper that connects all 9 principles to your chosen skills.<br>Add specific tactics or habits under each node that you’ll actually implement.',
}

export const s3Step4 = {
  id: 's3-step4',
  category: 'side',
  title: 'Step 4/5: Make It Practical',
  description:
    "For each principle, write a short bullet under the mindmap explaining <i>how</i> you’ll apply it weekly — not just the idea, but the action.<br>Example: 'Daily recall quiz for sleep techniques'.",
}

export const s3Step5 = {
  id: 's3-step5',
  category: 'side',
  title: 'Step 5/5: Reflect and Refine',
  description:
    'Write down:<br>1) Two ways your learning system has improved after this<br>2) Two challenges you expect to face while applying it.<br>Optional: Digitize this and keep it somewhere visible.',
  rewardXP: 35,
  skillReward: { ultralearning: 2, thinking: 1 },
}

export const s3 = [s3Splash, s3Step1, s3Step2, s3Step3, s3Step4, s3Step5]
