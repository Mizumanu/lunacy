// js/quests/ascension/health/e.js

const healthE = {
  title: 'Health (E) – Ascension',
  category: 'ascension',
  skillCategory: 'health',
  rank: 'E',
  keyName: 'Health (E) Key',
  splash: {
    title: 'Trial of the Warrior',
    description:
      'To awaken the warrior, you must face the silence before the world stirs.<br><br><em>Note: 1hr limit – begin at dawn (6 a.m.), 1 trial only.</em>',
    button: 'Start Ascension',
  },
  intro:
    'At the break of dawn, beneath a pale sky and upon an empty track,<br>The Player must confront the body’s resistance, the mind’s excuses, and the spirit’s silence.<br>This is a solitary ritual of endurance—no tools, no aid, only motion and resolve.<br><em>The Warrior within awakens not through comfort, but through the raw edge of discipline.</em>',
  outro:
    'The sun rises behind you—not ahead.<br>Sweat has dried. The silence inside is now stillness, not resistance.<br>You did not run to escape weakness. You ran to meet the version of you beyond it.<br><em>Ascension Complete. Health Rank – D.</em>',
  timer: 3600, // 1 hour in seconds
  unlock: { level: 0, date: null },

  rewardNotification: '+1 Rank Point<br>+2 Physical<br>+2 Mental<br>+2 Nutritional',
  trials: [
    {
      title: 'Trial of the Warrior',
      description:
        'Trial 1/1: Test of Endurance and Will — Complete the ritual without external aid.',
      microSteps: ['20 push-ups', '20 sit-ups', '20 squats', '2 km run'],
      rewardXP: 40,
      skillReward: {
        physical: 2,
        mental: 2,
        nutrition: 2,
      },
      cooldown: null,
    },
  ],
}

export default healthE
