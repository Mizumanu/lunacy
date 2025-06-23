// js/quests/side/s4.js

export const s4Splash = {
  id: 's4-splash',
  category: 'side',
  type: 'splash',
  title: 'The Binge Checklist Forge',
  description:
    'Create a reusable mindmap that helps you analyze any email, ad, or sales page like a pro. From raw instinct to refined criteria.',
  unlock: { level: 6 },
}

export const s4Step1 = {
  id: 's4-step1',
  category: 'side',
  title: 'Step 1/5: Raw Binging',
  description:
    'Open a folder of saved emails, sales pages, or ads.<br>Binge through 5–10 of them and write rough notes: What stood out? What felt persuasive? What patterns did you notice?',
}

export const s4Step2 = {
  id: 's4-step2',
  category: 'side',
  title: 'Step 2/5: Draft Your Checklist',
  description:
    "Based on your raw notes, draft 10–15 checkpoints you'd like to track when reading any future copy.<br>Each should have:<br>• A title<br>• A short description<br>• An example",
}

export const s4Step3 = {
  id: 's4-step3',
  category: 'side',
  title: 'Step 3/5: Study the Pros',
  description:
    "Search YouTube for 'copywriter breakdowns' or 'email teardown'.<br>Watch at least 2–3 breakdowns and compare how professionals analyze vs. your own approach.<br>Add or tweak 3+ checkpoints.",
}

export const s4Step4 = {
  id: 's4-step4',
  category: 'side',
  title: 'Step 4/5: Sharpen with ChatGPT',
  description:
    'Use ChatGPT to polish each checkpoint:<br>• Ask for better phrasing or definitions<br>• Ask what pros usually look for in that element<br>• Fix any gaps or unclear ideas<br>Update your checklist.',
}

export const s4Step5 = {
  id: 's4-step5',
  category: 'side',
  title: 'Step 5/5: Draw the Mindmap',
  description:
    "Turn your checklist into a clean mindmap on paper. Organize it into clusters (e.g., Hook, Emotions, Offer, Proof, CTA, etc.).<br>Make it simple and visible. You'll reuse this every time you binge.",
  rewardXP: 50,
  skillReward: { analysis: 1, binge: 3, thinking: 1 },
}

export const s4 = [s4Splash, s4Step1, s4Step2, s4Step3, s4Step4, s4Step5]
