export const e3 = {
  id: 'e3',
  title: 'Toolchain Uplink',
  description: 'Master 5 powerful AI tools over 5 days. Learn, execute, and unlock your uplink potential.',
  unlock: '2025-08-10T00:00:00Z',
  duration: 5,
  panelName: 'uplinkPanel',
  additionDays: 3,

  sections: [
    {
      id: 'A',
      label: 'Uplink Vault',
      iconName: 'cpuChip',
      unlockDay: 5,
      tasks: [
        {
          title: 'Tier 1: Connect 2 Tools',
          description: 'Successfully explore and use at least 2 AI tools during the event.',
          reward: { skillReward: { prompt: 1 } },
          tier: 1,
          day: 5,
        },
        {
          title: 'Tier 2: Operate 4 Tools',
          description: 'Use 4 tools meaningfully with notes, screenshots, or outputs.',
          reward: { skillReward: { ultralearning: 2, system: 1 } },
          tier: 2,
          day: 5,
        },
        {
          title: 'Tier 3: Complete Uplink',
          description: 'Use all 5 tools with implementation logs or proof. System fully linked.',
          reward: { key: 'Important (D) Key', qty: 1 },
          tier: 3,
          day: 5,
        },
      ],
    },

    {
      id: 'B',
      label: 'Tool Lab',
      iconName: 'aiCircle',
      unlockDay: 1,
      dayLabels: ['Cursor', 'Google AI Studio', 'Perplexity', 'Lucidchart', 'Leonardo'],
      tasks: [
        ...[
          'Cursor',
          'NotebookLM',
          'Perplexity',
          'PiktoChart',
          'Leonardo',
        ].flatMap((tool, index) => [
          {
            title: `Tier 1: Explore ${tool} (10 min)`,
            description: `Get familiar with ${tool} by exploring the interface and features.`,
            type: 'timed_research',
            day: index + 1,
            timerMinutes: 10,
            tier: 1,
            reward: { xp: 10 },
          },
          {
            title: `Tier 2: Use ${tool} for a task (25 min)`,
            description: `Try completing a small task using ${tool}.`,
            type: 'timed_research',
            day: index + 1,
            timerMinutes: 25,
            tier: 2,
            reward: { xp: 20 },
          },
          {
            title: `Tier 3: Deep Dive ${tool} (50 min)`,
            description: `Do a focused deep dive or create something meaningful using ${tool}.`,
            type: 'timed_research',
            day: index + 1,
            timerMinutes: 50,
            tier: 3,
            reward: { xp: 30 },
          },
        ]),
      ],
    },
  ],
};