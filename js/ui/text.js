// js/ui/text.js

// —————————————————————————————————————————————
// Quest‐list headings
export const SECTION_TITLES = {
  all: 'All Quests',
  main: 'Main Quests',
  side: 'Side Quests',
  daily: 'Daily Quests',
  ascension: 'Ascension Quests',
}

// —————————————————————————————————————————————
// “No ….” empty-state lines
export const EMPTY_TEXT = {
  side: 'No side quests.',
  daily: 'No daily quests.',
  main: 'No quests. Click +',
  ascension: 'No ascension quests.',
}

// —————————————————————————————————————————————
// Button labels
export const BTN = {
  reset: '🗑 Reset',
  complete: 'Complete Quest',
  completed: 'Completed',
  next: 'Next',
  startQuest: 'Start Quest',
  startAct: (actNum) => `Start Act ${actNum}`,
  link: '<i class="fas fa-link"></i>',
}

// —————————————————————————————————————————————
// Notification / toast text
export const NOTIFY = {
  // 1) Trigger notification (when a new ascension quest unlocks):
  ascendUnlocked: 'New ascension quest unlocked!',

  // 2) Key‐consumption prompt: we’ll pass { category, rank } when calling this.
  //    e.g. category="Main", rank="E"
  ascendKeyPrompt: (category, rank) =>
    `${category} Ascension Available. Use your ${category} ${rank} key?`,

  // 3) Intro “Splash‐style” copy once the player actually enters the ascension chain:
  ascendIntro: [
    'The Watchers have turned their gaze.',
    // 'The AI is silent now.',
    'Your instincts are all you have.',
    '<em>Enter… and prove you were not merely a vessel of borrowed knowledge.</em>',
  ].join('<br>'),

  // 4) Outro after the very last trial of Ascension:
  ascendOutro: 'They say that this was the easy part. Ascension Complete. Main Skill Rank – D',

  // 5) Reward notification (we’ll interpolate skill names and amounts):
  rewardLine: (writers, outreaches, researches, binges, analyses, sales) =>
    `Rewards Obtained:<br>
     +${writers} writing<br>
     +${outreaches} outreach<br>
     +${researches} research<br>
     +${binges} binge<br>
     +${analyses} analysis<br>
     +${sales} sales`,

  // (Preserve old messages we still use elsewhere:)
  levelUp: '<em>You leveled up!</em>',
  unlockedAt: (title, lvl, date) =>
    `“${title}” unlocks at level ${lvl}${date ? ` on ${date}` : ''}`,
  dailyDone: 'You have completed today’s daily quests!',
  dailyRewards: (title) => `Daily rewards:<br><br>${title}`,
}

// —————————————————————————————————————————————
// Stats panel titles
export const STATS_TITLES = {
  all: 'All Stats',
  main: 'Main Stats',
  important: 'Important Stats',
  efficiency: 'Efficiency Stats',
  health: 'Health Stats',
}

// “Main”‐category skill names in one place:

export const MAIN_SKILLS = ['writing', 'research', 'outreach', 'analysis', 'sales', 'binge']
