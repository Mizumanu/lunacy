// js/quests/ascension/important/e.js
const importantE = {
  title: 'Important (E) – Ascension',
  category: 'ascension',
  skillCategory: 'important',
  rank: 'E',
  keyName: 'Important (E) Key',
  splash: {
    title: 'The Dojo of Inner Refinement',
    description:
      'Only those who can discipline their thoughts, speech, and body may walk beyond.<br><br><em>Note: 16hr time limit – start in the morning. 6 Trials.</em>',
    button: 'Start Ascension',
  },
  intro:
    'A wooden gate slides open.<br>Inside, a lone figure waits, motionless — the Sensei of Inner Craft.<br>His eyes read your posture before a single word is spoken.<br>He nods toward six scrolls, each a silent challenge of self-mastery.<br><em>“Prove you are no longer ruled by noise, but guided by precision.”</em>',
  outro:
    'A gust passes as the final scroll burns itself to ash.<br>You stand taller, lighter, words and thoughts aligned.<br>The Sensei does not speak. He only bows.<br><em>Ascension Complete. Important Rank – D.</em>',
  timer: 57600, // seconds
  unlock: { level: 0, date: null },
  rewardNotification: '+1 Rank Point<br>+2 English<br>+2 Prompt<br>+2 Sleep',
  trials: [
    {
      title: 'Grammar Precision',
      description:
        'Trial 1/6: Test of Language Clarity — Answer grammar questions with accuracy and control.',
      microSteps: [
        'Open the grammar test link',
        'Answer 25 fill-in-the-blank questions within 30 minutes',
        'Pass by scoring 20 or more correct answers',
      ],
      rewardXP: 15,
      skillReward: {},
      cooldown: null,
    },
    {
      title: 'Discovery Call Simulation',

      description:
        'Trial 2/6: Test of Speech and Presence — Handle a sales call roleplay with confidence and fluency.',

      microSteps: [
        'Open the GPT link for simulation',

        'Ask AI for the roleplay context and details',

        'Build rapport and close the deal with calm, fluent speech',
      ],

      rewardXP: 15,

      skillReward: {},

      cooldown: null,
    },

    {
      title: 'Controlled Nap',

      description:
        'Trial 3/6: Test of Midday Recovery — Nap during a specified window to reset energy and focus.',

      microSteps: [
        'Take a 25-minute nap between 12 PM and 3 PM',

        'If you actually fall asleep, you pass',
      ],

      rewardXP: 10,

      skillReward: {},

      cooldown: null,
    },

    {
      title: 'Prompt Binge Analysis',

      description:
        'Trial 4/6: Test of Prompt Understanding — Break down a master prompt and interpret its design.',

      microSteps: [
        'Open the provided master prompt document',

        'Identify the role, goal, task, context, style, and output format',

        'Ask AI to evaluate your breakdown — score 8/10 or higher to pass',
      ],

      rewardXP: 10,

      skillReward: {},

      cooldown: null,
    },

    {
      title: 'Prompt Rewrite',

      description:
        'Trial 5/6: Test of Prompt Creation — Transform a basic prompt into a master-level structure.',

      microSteps: [
        'Open the provided prompt',

        'Rewrite it following the master prompt structure',

        'Ask AI to evaluate your rewrite — score 8/10 or higher to pass',
      ],

      rewardXP: 20,

      skillReward: {},

      cooldown: null,
    },
    {
      title: 'Nightfall Discipline',
      description:
        'Trial 6/6: Test of Sleep Timing — Align your rhythm by falling asleep with controlled intent.',
      microSteps: [
        'Sleep between 9 PM and 11 PM',
        'If you fall asleep within 15 minutes, you pass',
      ],
      rewardXP: 10,
      skillReward: {
        english: 2,
        prompt: 2,
        sleep: 2,
      },
      cooldown: null,
    },
  ],
}

export default importantE
