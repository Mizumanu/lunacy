// js/quests/ascension/main/d.js

const mainD = {
  title: 'Main (D) – Ascension',
  category: 'ascension',
  skillCategory: 'main', // [main, important, efficiency, health]
  rank: 'D',
  keyName: 'Main (D) Key',
  splash: {
    title: 'Main Gate (D) Opens',
    description: 'You stand at the edge of a deeper abyss. Will you descend, or rise?',
    button: 'Step Into the Gate',
  },
  intro: [
    'A new storm stirs on the horizon.',
    'The trial masters whisper your name.',
    'Your tools are sharper. The shadows are thicker.',
    '<em>This time, hesitation is defeat. Step forward, Challenger.</em>',
  ].join('<br>'),
  outro: 'Ascension Complete. Main Skill Rank – C<br>New power surges within.',
  timer: 36000, // 10 hours, as a placeholder
  unlock: { level: 5, date: null },
  rewardNotification:
    '+1 Rank Point! <br>+3 writing <br>+3 research <br>+3 sales <br>+3 analysis <br>+2 binge<br>+2 outreach<br>',

  trials: [
    {
      title: 'Trial I',
      description: 'Master the Foundation.',
      microSteps: [
        'Create a personal SOP (Standard Operating Procedure) for high-ticket client research',
        'Share your SOP with your mentor or peer for feedback',
        'Revise SOP based on received feedback',
      ],
      rewardXP: 12,
      skillReward: { writing: 1, research: 1 },
      cooldown: null,
      restriction: false,
    },
    {
      title: 'Trial II',
      description: 'Audit a Competitor.',
      microSteps: [
        'Select a direct competitor to your assigned lead',
        'Analyze their marketing funnel: ads, opt-ins, follow-ups',
        'Document at least 3 differences and 3 similarities',
      ],
      rewardXP: 18,
      skillReward: { analysis: 2, sales: 1 },
      cooldown: null,
      restriction: true,
    },
    {
      title: 'Trial III',
      description: 'Synthesize and Pitch.',
      microSteps: [
        'Craft a 3-slide (or 1-page) pitch highlighting the lead’s unique advantages',
        'Suggest one major campaign improvement, backed by data or evidence',
        'Present your pitch to a mock client (mentor, peer, or record yourself)',
      ],
      rewardXP: 25,
      skillReward: { outreach: 2, sales: 2, research: 1 },
      cooldown: null,
    },
  ],
}

export default mainD
