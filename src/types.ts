export type FieldCategory =
  | 'tech'
  | 'leadership'
  | 'marketing_sales'
  | 'student'
  | 'finance'
  | 'creative'
  | 'general';

export interface UserAuth {
  isLoggedIn: boolean;
  authMethod: 'google' | 'phone' | 'guest';
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  accountCreatedDate: string;
}

export interface DailyReminderConfig {
  enabled: boolean;
  reminderTime: string; // e.g. "09:00"
  notifyVocabRecap: boolean;
  notifySpeechFeedback: boolean;
  notifyStreakAlert: boolean;
  browserPermissionGranted: boolean;
}

export interface AppNotification {
  id: string;
  type: 'vocab_recap' | 'speech_feedback' | 'streak_alert' | 'daily_kickoff';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionTab?: 'daily' | 'journeys' | 'seek' | 'practice' | 'vocab' | 'cheatsheets' | 'articulation';
  metadata?: {
    vocabWord?: string;
    vocabMeaning?: string;
    score?: number;
    feedbackSummary?: string;
  };
}

export interface ReaderPreferences {
  theme: 'light' | 'dark';
  fontFamily: 'serif' | 'sans' | 'mono';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  eReaderCardMode: boolean; // bite-sized card pager vs expanded view
}

export interface UserProfile {
  name: string;
  field: FieldCategory;
  customFieldTitle: string;
  targetDailyMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  totalMinutesPracticed: number;
  totalExercisesCompleted: number;
  vocabLearnedCount: number;
  xpPoints: number;
  confidenceScore: number;
  languagePreference: 'hinglish' | 'english' | 'hindi';
  savedVocabIds: string[];
  completedJourneyUnitIds: string[];
  auth: UserAuth;
  reminderConfig: DailyReminderConfig;
  readerPreferences?: ReaderPreferences;
  recentFeedbackList: {
    date: string;
    scenario: string;
    score: number;
    strength: string;
    improvementArea: string;
  }[];
  completedArticulationDrillIds: string[];
}

export interface ArticulationDrill {
  id: string;
  title: string;
  stage: 'breath' | 'consonants' | 'cadence' | 'structure' | 'gravitas';
  stageName: string;
  durationMinutes: number;
  description: string;
  hinglishTip: string;
  instructions: string[];
  audioDrillPrompt: string;
  targetPhonetics: string[];
  sampleSentence: string;
  xpReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Master';
}

export interface StorytellingEvaluation {
  overallScore: number;
  narrativeArcScore: number;
  hookImpactScore: number;
  emotionalResonanceScore: number;
  executiveBrevityScore: number;
  keyStrengths: string[];
  areasToRefine: string[];
  fillerWordsFound: string[];
  storyStructureUsed: string; // e.g., 'STAR (Situation, Task, Action, Result)' or 'The Hero\'s Transformation'
  wordCount: number;
  pacingPraise: string;
  elevatedStoryVersion: string;
  coachAdviceForTomorrow: string;
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  hinglishMeaning: string;
  exampleSentence: string;
  category: 'executive' | 'persuasion' | 'precision' | 'charisma' | 'clarity';
  synonyms: string[];
  antonyms?: string[];
  corporateContext?: string;
  isMastered?: boolean;
}

export interface DailyWorkout {
  dayNumber: number;
  dailyTheme: string;
  estimatedMinutes: number;
  step1Vocab: {
    word: string;
    phonetic: string;
    partOfSpeech: string;
    meaning: string;
    hinglishExplanation: string;
    exampleSentence: string;
    practiceSentencePrompt: string;
  };
  step2JourneyLesson: {
    title: string;
    category: string;
    mentalModelName: string;
    coreConcept: string;
    bulletTakeaways: string[];
    expertCitation: string;
  };
  step3PracticeScenario: {
    scenarioTitle: string;
    situationContext: string;
    yourRole: string;
    theChallengePrompt: string;
    coachingTip: string;
    recommendedFramework: string;
  };
  step4FieldMotivation: {
    quote: string;
    author: string;
    actionableMicroHabitToday: string;
    confidenceAffirmation: string;
  };
}

export interface PracticeEvaluation {
  overallScore: number;
  clarityScore: number;
  confidenceScore: number;
  vocabularyScore: number;
  structureScore: number;
  fillerWordsDetected: string[];
  keyStrengths: string[];
  areasToImprove: string[];
  vocabularyUpgrades: {
    original: string;
    elevated: string;
    reason: string;
  }[];
  executiveModelAnswer: string;
  mentalModelUsed: string;
  oneSentenceCoachingPepTalk: string;
}

export interface SeekResult {
  title: string;
  coreSummary: string;
  primaryExperts: {
    name: string;
    source: string;
    keyRule: string;
  }[];
  mentalModel: {
    name: string;
    howItWorks: string;
    exampleApplication: string;
  };
  tacticalSteps: string[];
  wordForWordScripts: {
    situation: string;
    script: string;
    psychologicalReason: string;
  }[];
  curatedVideoBlueprint: {
    videoTitle: string;
    recommendedSpeaker: string;
    estimatedDuration: string;
    keyTimestampBreakdowns: {
      timestamp: string;
      topic: string;
      takeaway: string;
    }[];
  };
}

export interface JourneyUnit {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  hinglishTakeaway: string;
  mentalModel: string;
  keyPrinciples: string[];
  actionPrompt: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface BiteSizedTrack {
  id: string;
  title: string;
  subtitle: string;
  category: 'charisma' | 'intelligence' | 'memory' | 'decision_making';
  badge: string;
  iconName: string;
  colorGradient: string;
  units: JourneyUnit[];
}

export interface SentenceElevationResult {
  original: string;
  casualConfident: string;
  executivePolish: string;
  diplomaticMaster: string;
  powerWordsIntroduced: {
    word: string;
    definition: string;
    usageTip: string;
  }[];
  communicationPrinciple: string;
}

export interface CheatSheet {
  id: string;
  title: string;
  acronym: string;
  tag: string;
  bestUsedFor: string;
  steps: {
    step: string;
    desc: string;
    example: string;
  }[];
  proTip: string;
}
