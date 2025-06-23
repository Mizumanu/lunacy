// js/events/e1.js

export const e1 = {
  id: 'e1',
  title: 'Speed Mastery Carnival',
  description: 'Challenge your typing and reading speed in 7 days of escalating trials.',
  unlock: '2025-06-13T00:00:00Z',
  duration: 7,
  additionDays: 3,

  sections: [
    {
      id: 'A',
      label: 'Final Battle',
      iconName: 'fireFlag',
      unlockDay: 7,
      tasks: [
        {
          title: 'Tier 1: Type Like A Coder',
          description: 'Type 60s with 95% Accuracy and 75WPM',
          reward: { xp: 10, skillReward: { speedtyping: 2 } },
        },
        {
          title: 'Tier 2: Speeder',
          description: 'Speedread 5mins with 300 WPM and 90% comprehension',
          reward: { xp: 10, skillReward: { speedreading: 2 } },
        },
        {
          title: 'Tier 3: Perfect Completionist',
          description:
            'Speedread 400WPM with 75% Comprehension<br>SpeedType 90WPM with 90% accuracy',
          reward: { key: 'efficiencyE', qty: 1 },
        },
      ],
    },

    // Section B: Speedtyping (timed, 3 tiers per day)
    {
      id: 'B',
      label: 'Type',
      iconName: 'fireKeyboard',
      unlockDay: 1,
      dayLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      tasks: [
        // For 7 days, each with 3 tiers
        ...[1, 2, 3, 4, 5, 6, 7].flatMap((day) => [
          {
            title: `Tier 1: Type for ${2 + day} minutes`,
            type: 'timed_typing',
            day,
            timerMinutes: 2 + day,
            tier: 1,
            reward: { xp: 5 },
          },
          {
            title: `Tier 2: Type for ${(2 + day) * 2} minutes`,
            type: 'timed_typing',
            day,
            timerMinutes: (2 + day) * 2,
            tier: 2,
            reward: { xp: 10 },
          },
          {
            title: `Tier 3: Type for ${(2 + day) * 3} minutes`,
            type: 'timed_typing',
            day,
            timerMinutes: (2 + day) * 3,
            tier: 3,
            reward: { skillReward: { speedtyping: 1 } },
            url: 'https://www.monkeytype.com',
          },
        ]),
      ],
    },

    // Section C: Speedreading (timed, 3 tiers per day)
    {
      id: 'C',
      label: 'Read',
      iconName: 'fireBook',
      unlockDay: 1,
      dayLabels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
      tasks: [
        ...[1, 2, 3, 4, 5, 6, 7].flatMap((day) => [
          {
            title: `Tier 1: Read for ${2 + day} minutes`,
            type: 'timed_reading',
            day,
            timerMinutes: 2 + day,
            tier: 1,
            reward: { xp: 5 },
          },
          {
            title: `Tier 2: Read for ${(2 + day) * 2} minutes`,
            type: 'timed_reading',
            day,
            timerMinutes: (2 + day) * 2,
            tier: 2,
            reward: { xp: 10 },
          },
          {
            title: `Tier 3: Read for ${(2 + day) * 3} minutes`,
            type: 'timed_reading',
            day,
            timerMinutes: (2 + day) * 3,
            tier: 3,
            reward: { sp: 1 },
            url: 'https://www.freereadingtest.com/',
          },
        ]),
      ],
    },
  ],
}
