//js/quests/main/m2.js

// — Act 1 Intro —
export const m2Intro = {
  act: 1,
  title: 'Know Thy Enemy',
  description: 'Deep-dive into forbidden lore—what secrets lie beneath their veil?',
  category: 'main',
  unlock: { level: 1, date: null },
}

// — Act 2 Intro —
export const m2Intro2 = {
  act: 2,
  title: 'Forge the Blade',
  description: 'Blueprint your assault—plan assets, arenas, and angles.',
  category: 'main',
  unlock: { level: 3, date: '2025-05-09T00:00:00Z' },
}

// — Act 3 Intro —
export const m2Intro3 = {
  act: 3,
  title: 'Craft the Copy',
  description: 'Weave your incantations—draft, refine, and let your prose take form.',
  category: 'main',
  unlock: { level: 5, date: '2025-05-11T00:00:00Z' },
}

// — Act 4 Intro —
export const m2Intro4 = {
  act: 4,
  title: 'Think & Act',
  description: 'Test your mettle—actions today shape the echoes of tomorrow.',
  category: 'main',
  unlock: { level: 8, date: '2025-05-14T00:00:00Z' },
}

// — Act 5 Intro —
export const m2Intro5 = {
  act: 5,
  title: 'Tame the Beast',
  description: 'Master the aftermath—whisper gains and bind reluctant souls to your will.',
  category: 'main',
  unlock: { level: 10, date: '2025-05-16T00:00:00Z' },
}

// — Act Quests —
export const m2Quests = [
  {
    act: 1,

    title: 'Scan the Aura',

    description: 'Use GPT deep research to summarize lead’s business, offer, tone, and ICP.',

    microSteps: [
      'Open GPT> CSV > Type “Next”',

      'Skim through the whole info once',

      'Speedread the whole info',

      'Save notes to your Lead Sheet',
    ],

    rewardXP: 95,

    skillReward: { research: 1, analysis: 200 },

    category: 'main',

    unlock: {
      level: 1,
      date: null,
    },
  },

  {
    act: 1,

    title: 'Trace the Footsteps',

    description: 'Explore Instagram, YouTube, other social media, and websites MANUALLY.',

    microSteps: [
      'Open IG – skim bios, story, popular reels',

      'Open Yt – skim video intro, HL, descr, outro',

      'Visit links, review layout, superbinge copy',

      'Write down 3-5 bullet of the copies that you can improve',
    ],

    rewardXP: 10,

    skillReward: { analysis: 1, thinking: 100 },

    category: 'main',

    url: 'https://www.google.com/',

    unlock: {
      level: 1,
      date: null,
    },
  },

  {
    act: 1,

    title: 'Judge Their Potential',

    description: 'Evaluate if the lead is worth pursuing.',

    microSteps: [
      'Do they hire freelancers?',

      'Do they have a funnel?',

      'Are they making $10k+?',

      'Can your copy improve results?',
    ],

    rewardXP: 200,

    skillReward: { research: 1, prompt: 30 },

    category: 'main',

    notice: 'yessssssssss',

    unlock: {
      level: 1,
      date: null,
    },
  },

  {
    act: 2,

    title: 'Choose the Battlefield',

    description: 'Decide your outreach platform (DM, email, or other).',

    microSteps: [
      'Identify platform where they’re most active',

      'Decide best-fit based on tone and visibility',

      'Write down your choices/ plan',
    ],

    rewardXP: 10,

    skillReward: { outreach: 1 },

    category: 'main',

    unlock: {
      level: 3,
      date: '2025-05-09T00:00:00Z',
    },
  },

  {
    act: 2,

    title: 'Mind Probe',

    description: 'Build their Ideal Client Profile (ICP) using Gpt.',

    microSteps: [
      'List demographics, job, income, lifestyle',

      'Map desires, dreams, pain, problems, suspicions, predispositions, failures, 3 beliefs (vehicle, themselves, external)',

      'Awareness & Sophistication',
    ],

    rewardXP: 15,

    skillReward: { research: 2, prompt: 1 },

    category: 'main',

    unlock: {
      level: 3,
      date: '2025-05-09T00:00:00Z',
    },
  },

  {
    act: 2,

    title: 'Read the Scrolls',

    description: 'Decode the full value offer.',

    microSteps: [
      'List their benefits, USP, and risk reversal',

      'Check their social proofs',

      'Analyze their competitors',
    ],

    rewardXP: 15,

    skillReward: { research: 1 },

    category: 'main',

    unlock: {
      level: 3,
      date: '2025-05-09T00:00:00Z',
    },
  },

  {
    act: 2,

    title: 'Pick Your Weapon',

    description: 'Choose outreach style (value, Loom, compliment).',

    microSteps: ['Review 3 messaging styles', 'Pick one that matches their vibe'],

    rewardXP: 10,

    skillReward: { outreach: 1 },

    category: 'main',

    unlock: {
      level: 3,
      date: '2025-05-09T00:00:00Z',
    },
  },

  {
    act: 2,

    title: 'Define the Arsenal',

    description: 'Decide what copy formats you’ll write.',

    microSteps: [
      'Note which funnel assets they use',

      'Match to your copy expertise',

      'Finalize 3 items (e.g. 5 YT headline, short landing page, script, email, ad)',
    ],

    rewardXP: 15,

    skillReward: { writing: 1 },

    category: 'main',

    unlock: {
      level: 3,
      date: '2025-05-09T00:00:00Z',
    },
  },

  {
    act: 2,

    title: 'Bullet Engraving',

    description: 'Write 20–30 copy bullets.',

    microSteps: [
      'Refer to the Bullets in Your Notion',

      'Write 30+ bullets',

      'Filter and write 10-12 Final Bullets',
    ],

    rewardXP: 15,

    skillReward: { writing: 2 },

    category: 'main',

    unlock: {
      level: 3,
      date: '2025-05-09T00:00:00Z',
    },
  },

  {
    act: 3,

    title: 'Binge Buff (Optional)',

    description: 'Skim 1–3 similar pieces of copy for inspiration.',

    microSteps: [
      'Find 3-5 examples from your swipe file',

      'Binge 1-3 copies to get some ideas',

      'Jot quick inspiration bullets/ split the screen to copy the style',
    ],

    rewardXP: 2,

    skillReward: { binge: 1 },

    category: 'main',

    unlock: {
      level: 5,
      date: '2025-05-11T00:00:00Z',
    },
  },

  {
    act: 3,

    title: 'First Ritual',

    description: 'Write the full first draft.',

    microSteps: [
      'Start with scribbling some points on body/ HL (headline)',

      'Read it aloud and turn points or incomplete words into meaningful sentence',

      'Write 3 headlines',

      'Save for later polish',
    ],

    rewardXP: 20,

    skillReward: { writing: 1 },

    category: 'main',

    unlock: {
      level: 5,
      date: '2025-05-11T00:00:00Z',
    },
  },

  {
    act: 3,

    title: 'Arcane Buff',

    description: 'Use GPT to enhance tone and structure.',

    microSteps: [
      'Paste into GPT, ask for refinement (make it more clear/conversational, add humor/ style)',

      'Compare and copy good pieces and replace them with the original one.',
    ],

    rewardXP: 10,

    skillReward: { writing: 1 },

    category: 'main',

    unlock: {
      level: 5,
      date: '2025-05-11T00:00:00Z',
    },
  },

  {
    act: 3,

    title: 'Self Binge Read',

    description: 'Read your own copy aloud.',

    microSteps: [
      'Superbinge & skim',

      'Binge and Identify: Awareness, Sophistication, NESBee, Value Eqn, 4U’s, Rule of x and so on…',
    ],

    rewardXP: 5,

    skillReward: { binge: 1 },

    category: 'main',

    unlock: {
      level: 5,
      date: '2025-05-11T00:00:00Z',
    },
  },

  {
    act: 3,

    title: 'Second Draft',

    description: 'Rebuild and rewrite based on binge.',

    microSteps: ['Edit/ Rewrite intro', 'Restructure weak body lines', 'Improve clarity and flow'],

    rewardXP: 15,

    skillReward: { writing: 1 },

    category: 'main',

    unlock: {
      level: 5,
      date: '2025-05-11T00:00:00Z',
    },
  },

  {
    act: 3,

    title: 'Final Polish',

    description: 'Final formatting and emotional tweaks.',

    microSteps: [
      'Final clean formatting',

      'Improve flow with AI',

      'Get review from discord and AI',

      'Read once more before submitting',
    ],

    rewardXP: 10,

    skillReward: { writing: 1, analysis: 1 },

    category: 'main',

    unlock: {
      level: 5,
      date: '2025-05-11T00:00:00Z',
    },
  },

  {
    act: 3,

    title: 'Plan the Echoes',

    description: 'Build your 6-step follow-up system. 2 steps/ quest',

    microSteps: [
      'Write 1 value outreach',

      'If lead doesn’t reply send a meme msg which conveys if he/she checked or not',

      'At 3rd repetition of act 3, instead of sending meme msg, send a message showing all of your work and final goodbye.',
    ],

    rewardXP: 30,

    skillReward: { writing: 1, outreach: 2, sales: 1 },

    category: 'main',

    unlock: {
      level: 5,
      date: '2025-05-11T00:00:00Z',
    },
  },

  {
    act: 4,

    title: 'Set Stamina Cap',

    description: 'Decide outreach volume/day.',

    microSteps: [
      'Review how long last lead took',

      'Choose realistic daily number',

      'Write in your quest log',
    ],

    rewardXP: 5,

    skillReward: {},

    category: 'main',

    unlock: {
      level: 8,
      date: '2025-05-14T00:00:00Z',
    },
  },

  {
    act: 4,

    title: 'Train with Feedback',

    description: 'Study response quality + critiques.',

    microSteps: [
      'Review replies or feedback',

      'Identify weak parts in message',

      'Adjust tone/structure in future outreach',
    ],

    rewardXP: 15,

    skillReward: { binge: 1 },

    category: 'main',

    unlock: {
      level: 8,
      date: '2025-05-14T00:00:00Z',
    },
  },

  {
    act: 4,

    title: 'Run the Arena Split-Test',

    description: 'Test message types + track replies.',

    microSteps: ['Create 2 message variants', 'Send to 20 leads to test', 'Log results (later)'],

    rewardXP: 15,

    skillReward: { outreach: 1, analysis: 1 },

    category: 'main',

    unlock: {
      level: 8,
      date: '2025-05-14T00:00:00Z',
    },
  },

  {
    act: 5,

    title: 'Rules of Engagement',

    description: 'Prepare your chat philosophy.',

    microSteps: ['Write 3 don’ts', 'Write 3 do’s', 'Keep it pinned near chat app'],

    rewardXP: 20,

    skillReward: { sales: 1, analysis: 1 },

    category: 'main',

    unlock: {
      level: 10,
      date: '2025-05-16T00:00:00Z',
    },
  },

  {
    act: 5,

    title: 'The Trial of Qualification',

    description: 'Ensure lead is worth the call.',

    microSteps: [
      'Understand their problems and needs',

      'If they are qualified, ask for a quick call',
    ],

    rewardXP: 15,

    skillReward: { outreach: 1 },
    category: 'main',
    unlock: {
      level: 10,
      date: '2025-05-16T00:00:00Z',
    },
  },

  {
    act: 5,

    title: 'Seal the Call',

    description: 'Finalize and book the meeting.',

    microSteps: ['Send link or slot', 'Confirm time + timezone', 'Block it on your calendar'],

    rewardXP: 20,

    skillReward: { sales: 1 },
    category: 'main',
    unlock: {
      level: 10,
      date: '2025-05-16T00:00:00Z',
    },
  },
]

// — Combined Export —
export const m2 = [
  m2Intro,
  ...m2Quests.slice(0, 3), // Act 1 quests
  m2Intro2,
  ...m2Quests.slice(3, 9), // Act 2 quests
  m2Intro3,
  ...m2Quests.slice(9, 16), // Act 3 quests
  m2Intro4,
  ...m2Quests.slice(16, 19), // Act 4 quests
  m2Intro5,
  ...m2Quests.slice(19), // Act 5 quests
]
