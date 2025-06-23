// js/quests/ascension/main/e.js

const mainE = {
  title: 'Main (E) – Ascension',
  category: 'ascension',
  skillCategory: 'main', // [main, important, efficiency, health]
  rank: 'E',
  keyName: 'Main (E) Key',
  splash: {
    title: 'Main Gate (E) Awakens',
    description: 'Will you prove worthy to rise above the ordinary?',
    button: 'Begin Ascension',
  },
  intro: [
    'The Watchers have turned their gaze.',
    'The AI is silent now.',
    'Your instincts are all you have.',
    '<em>Enter… and prove you were not merely a vessel of borrowed knowledge.</em>',
  ].join('<br>'),
  outro: 'Ascension Complete. Main Skill Rank – D',
  timer: 50000, // 50000 seconds
  unlock: { level: 0, date: null },
  rewardNotification:
    '+1 Rank Point! <br>+2 writing <br>+2 research <br>+2 binge<br>+2 sales <br>+2 analysis <br>+2 outreach<br>',

  trials: [
    {
      title: 'Trial I',
      description: 'Assign and log your process.',
      microSteps: [
        'GPT assigns a random lead from your lead list',
        'Manual Research Scroll E1 is provided to store all findings',
        'Log how you approach the process—your decisions will shape your research system',
      ],
      rewardXP: 5,
      skillReward: {},
      cooldown: null,
      url: 'www.google.com',
    },
    {
      title: 'Trial II',
      description: 'Track their online presence.',
      microSteps: ['Find all their online presence: social media, websites, and platforms'],
      rewardXP: 10,
      skillReward: {},
      cooldown: null,
      notice: 'Take notes in all trials.',
      restriction: true,
    },
    {
      title: 'Trial III',
      description: 'Break down their brand and style.',
      microSteps: [
        'Review at least 5 pieces of content (videos, reels, or posts)',
        'Identify their content type & niche',
        'Identify their tone and voice',
        'Identify their brand personality',
        'Identify their pitch strategy and frequency',
      ],
      rewardXP: 15,
      skillReward: {},
      cooldown: 5,
    },
    {
      title: 'Trial IV',
      description: 'Evaluate and improve their marketing assets.',
      microSteps: [
        'Evaluate their existing marketing assets: sales pages, ads, scripts, emails, etc.',
        'Score them using your E → S scale',
        'Identify the weakest piece and write targeted improvements',
      ],
      rewardXP: 25,
      skillReward: {},
      cooldown: null,
      restriction: true,
    },
    {
      title: 'Trial V',
      description: 'Manual market research and ICP.',
      microSteps: [
        'Research manually using online sources (no AI) to uncover ICP',
        'Identify core emotional triggers',
        'Investigate market awareness & sophistication',
        'Clarify their offer and positioning',
      ],
      rewardXP: 35,
      skillReward: {},
      cooldown: null,
    },
    {
      title: 'Trial VI',
      description: 'Final judgment and SP boost.',
      microSteps: [
        'Generate the AI version of the research for the same lead',
        'Submit both manual and AI scrolls for comparison',
        'Pass if your manual research aligns ≥ 60% (Research SP cap increases to 30 & gain +3 SP)',
      ],
      rewardXP: 10,
      skillReward: {
        writing: 2,
        research: 2,
        binge: 2,
        sales: 2,
        analysis: 2,
        outreach: 2,
      },
      cooldown: null,
    },
  ],
}

export default mainE
