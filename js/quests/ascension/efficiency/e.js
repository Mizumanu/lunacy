// js/quests/ascension/efficiency/e.js

const efficiencyE = {
  title: 'Efficiency (E) – Ascension',
  category: 'ascension',
  skillCategory: 'efficiency',
  rank: 'E',
  keyName: 'Efficiency (E) Key',

  splash: {
    title: 'Rival Appears – Flashcut’s Challenge',
    description:
      'The storm arrives grinning. Behind him, five shadows leer in unison.<br><br><em>Defeat his crew. Then face the storm himself. 12hr limit. 6 Trials.</em>',
    button: 'Begin Challenge',
  },

  intro:
    'The silence breaks with laughter.<br>“That’s the one?” sneers Ryze. “Doesn’t even look like he can out-type a goldfish.”<br>“Let him try,” says Flashcut, stepping forward.<br>“Rookies get cocky these days… Let’s break that illusion.”<br><em>The gate seals behind you. There’s no pause now. Just pride, grit, and skill.</em>',

  outro:
    'The minions are gone. Their echoes faded.<br>Flashcut breathes heavy — then smirks.<br>“You really… broke through.”<br>He tosses his datachip on the ground and turns away.<br><em>You’ve earned your place. Efficiency Rank – D.</em>',

  timer: 43200, // 12 hours in seconds
  unlock: { level: 0, date: null },
  rankReward: 1,
  rewardNotification:
    '+1 Rank Point<br>+2 Speedtyping<br>+2 Speedreading<br>+2 Superbinging<br>+2 Ultralearning<br>+2 Thinking',

  trials: [
    {
      title: 'Clicker Ryze',
      description:
        'Trial 1/6: Type at 70 WPM with 95%+ accuracy in 60s Monkeytype to beat Clicker Ryze.',
      microSteps: [
        'Open Monkeytype and select 60-second typing mode',
        'Focus and type with precision and speed',
        'Achieve ≥70 WPM and ≥95% accuracy',
        'Take a screenshot or verify score to pass',
      ],
      rewardXP: 10,
      skillReward: {},
      cooldown: 10,
      restriction: true,
      url: 'https://monkeytype.com/',
    },
    {
      title: 'Blur Vinn',
      description:
        'Trial 2/6: Read at 300 WPM with 75%+ comprehension on freereadingtest.com (min 800-word passage) to beat Blur Vinn.',
      microSteps: [
        'Go to freereadingtest.com',
        'Choose a passage with at least 800 words',
        'Complete the test and ensure ≥75% comprehension',
        'Submit or verify your result to pass',
      ],
      rewardXP: 10,
      skillReward: {},
      cooldown: 2,
      restriction: true,
    },
    {
      title: 'Hook Zeno',
      description:
        'Trial 3/6: Speed-read a 200+ word email and mentally identify persuasive components to beat Hook Zeno.',
      microSteps: [
        'Open the provided persuasive email',
        'Within 2 minutes, mentally identify key elements:',
        'Awareness, emotions, transitions, value equation, rule of X, and structure',
        'Ask AI to verify understanding via checklist or verbal quiz',
      ],
      rewardXP: 10,
      skillReward: {},
      cooldown: 3,
      restriction: true,
    },
    {
      title: 'Stack Kei',
      description:
        'Trial 4/6: Recall all 8 steps of Ultralearning and adapt each to your efficiency skills to beat Stack Kei.',
      microSteps: [
        'List all 8 steps of Ultralearning from memory',
        'Assign each step to one efficiency skill',
        'Explain how you’d apply each practically',
        'Ask AI to evaluate accuracy and clarity (≥8/10 to pass)',
      ],
      rewardXP: 10,
      skillReward: {},
      cooldown: 3,
      restriction: true,
    },
    {
      title: 'Digits Nero',
      description:
        'Trial 5/6: Solve 3 multiplication/division problems in under 2 minutes to beat Digits Nero.',
      microSteps: [
        'Open math challenge link or generate 3 problems',
        'Solve all 3 in under 2 minutes without error',
        'Screenshot or confirm your results with AI',
        'Pass if all correct within time',
      ],
      rewardXP: 10,
      skillReward: {},
      cooldown: 3,
      restriction: true,
    },
    {
      title: 'Ryo "Flashcut" Kenzaki',
      description: 'Trial 6/6: Defeat Ryo Flashcut by passing all 5 elite skill duels at once.',
      microSteps: [
        'Type at ≥80 WPM with ≥95% accuracy (60s Monkeytype)',
        'Read at ≥350 WPM with ≥75% comprehension on freereadingtest.com',
        'Binge a 5-page Agora sales letter in 5 mins and mentally identify persuasive techniques',
        'Solve 5 math problems (logic, memory, and arithmetic) in 2 mins',
        'Apply all 8 Ultralearning steps to a real task and explain results clearly',
        'Pass all 5 to defeat Flashcut and complete the ascension',
      ],
      rewardXP: 10,
      skillReward: {
        speedtyping: 2,
        speedreading: 2,
        superbinging: 2,
        ultralearning: 2,
        thinking: 2,
      },
      cooldown: null,
      restriction: true,
    },
  ],
}

export default efficiencyE
