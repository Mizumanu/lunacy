// js/quests/daily/d1.js

export const d1 = [
  {
    id: 'typing-120s',
    title: 'Typing 120s',
    type: 'link',
    url: 'https://monkeytype.com',
    group: 1,
    rewardXP: 10,
    skillReward: { speedtyping: 1 },
    description: `Complete a 2-minute typing drill on Monkeytype. Focus on:
- Accuracy ≥ 93%
- Consistency ≥ 70%
- WPM ≥ 50`,
  },
  {
    id: 'typing-60s-x-2',
    title: 'Typing 60s x 2',
    type: 'link',
    url: 'https://10fastfingers.com/typing-test/english',
    group: 1,
    rewardXP: 10,
    skillReward: { speedtyping: 1 },
    description: `Complete a 1-minute typing drill twice on 10FastFingers. Focus on:
- Accuracy ≥ 93%
- Consistency ≥ 70%
- WPM ≥ 50`,
  },
  {
    id: 'speedreading-2-120s',
    title: 'Speedreading',
    type: 'link',
    url: 'https://www.freereadingtest.com/',
    group: 2,
    rewardXP: 10,
    skillReward: { speedreading: 1 },
    description: `Complete one speedreading test on FreeReadingTest:
- Avoid subvocalization
- Glance at word groups instead of word-by-word
- Maintain comprehension as speed increases`,
  },
  {
    id: 'binge-1-email',
    title: 'Binge 1 Email',
    type: 'link',
    url: 'https://docs.google.com/document/d/1w3Or8N9JawoqHobLIP-pQyNGHpXMcGHTQBc5DmKtZIw/edit?usp=drivesdk',
    group: 3,
    rewardXP: 10,
    skillReward: { binge: 1 },
    description: `Analyze one email:
- Identify emotional triggers (pain, desire, relatability)
- Determine awareness levels and transitions
- Uncover the intent behind each sentence`,
  },
  {
    id: 'rewrite-1-headline',
    title: 'Rewrite 1 Headline',
    type: 'link',
    url: 'https://docs.google.com/document/d/1HgUeDAVhbtK5W_cVwwF8ZUQpUtW0-1UW11Dd_ZwaSSU/edit?usp=drivesdk',
    group: 4,
    rewardXP: 10,
    skillReward: { writing: 1 },
    description: `Rewrite the provided headline in two ways:
- Use intensification, identification, and believability
- Craft compelling variations that drive curiosity`,
  },
  {
    id: 'convert-email-to-headline',
    title: 'Convert an Email to Headline',
    type: 'link',
    url: 'https://docs.google.com/document/d/1OiKDaDSRlc6PnMzLhkZvKyu8XuzxR17jtywdDiD87P4/edit?usp=drivesdk',
    group: 5,
    rewardXP: 10,
    skillReward: { writing: 1 },
    description: `Convert an email into a headline:
- Identify emotions, leads, and main idea
- Craft a curiosity-driven headline targeting those emotions`,
  },
  {
    id: 'write-1-short-email',
    title: 'Write 1 Short Email',
    type: 'link',
    url: 'https://chatgpt.com/c/683048c0-96e4-8012-ab5f-0c3ef46644a1',
    group: 5,
    rewardXP: 10,
    skillReward: { writing: 1 },
    description: `Write one concise email using ChatGPT-provided details:
- Follow the given ICP, emotional triggers, and offer structure`,
  },
  {
    id: 'binge-1-prompt',
    title: 'Binge 1 Prompt',
    type: 'link',
    url: 'https://docs.google.com/document/d/1wicd6X20ujc3zqGtCjTanVkWE3oFNl7EmE3j1RuWVlU/edit?usp=drivesdk',
    group: 6,
    rewardXP: 10,
    skillReward: { binge: 1 },
    description: `Binge one prompt mentally:
- Use imagination to explore ideas
- Complete three free-form rounds`,
  },
  {
    id: 'math-multiplications',
    title: 'Math Multiplications',
    type: 'link',
    url: 'https://chatgpt.com/c/68300baa-d590-8012-bb1d-75d225c42b02',
    group: 7,
    rewardXP: 10,
    skillReward: { thinking: 1 },
    description: `Solve as many multiplication problems as possible in 120 seconds mentally.`,
  },
  {
    id: 'math-divisions',
    title: 'Math Divisions',
    type: 'link',
    url: 'https://chatgpt.com/c/68301176-5e5c-8012-84f6-459b4175bf13',
    group: 7,
    rewardXP: 10,
    skillReward: { thinking: 1 },
    description: `Solve as many division problems as possible in 120 seconds mentally.`,
  },
  {
    id: 'grammar-fill-in-the-blanks',
    title: 'Grammar: Fill in the blanks',
    type: 'link',
    url: 'https://www.englishgrammar.org/exercises/',
    group: 8,
    rewardXP: 10,
    skillReward: { english: 1 },
    description: `Complete 10–15 fill-in-the-blank grammar questions on the given site.`,
  },
  {
    id: 'speaking-practice-120s',
    title: 'Speaking Practice (120s)',
    type: 'link',
    url: 'https://chatgpt.com/c/68304e7f-bfa0-8012-aeed-d04ab3700cc7',
    group: 8,
    rewardXP: 10,
    skillReward: { english: 1 },
    description: `Speak on a given topic for 120 seconds using ChatGPT guidelines to improve fluency.`,
  },
  {
    id: 'skipping-60-skips',
    title: 'Skipping 60 Skips',
    type: 'copy',
    group: 9,
    rewardXP: 10,
    skillReward: { physical: 1 },
    description: `Perform 60 skipping jumps continuously, focusing on form and endurance.`,
  },
  {
    id: 'sales-daily-practice',
    title: 'Sales Daily Practice',
    type: 'link',
    url: 'https://chatgpt.com/c/683020bd-6d3c-8012-9558-4082658178d6',
    group: 10,
    rewardXP: 10,
    skillReward: { sales: 1 },
    description: `Work through the Sales Daily Practice prompt:
- Follow step-by-step teaching
- Answer the final questions to test understanding`,
  },
]
