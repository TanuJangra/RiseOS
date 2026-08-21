import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyDashboard } from './components/DailyDashboard';
import { DailyWorkoutModal } from './components/DailyWorkoutModal';
import { SeekTool } from './components/SeekTool';
import { BiteSizedJourneys } from './components/BiteSizedJourneys';
import { InteractivePracticeHub } from './components/InteractivePracticeHub';
import { VocabMasterBank } from './components/VocabMasterBank';
import { CheatSheetsHub } from './components/CheatSheetsHub';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { ArticulationTrainingHub } from './components/ArticulationTrainingHub';
import { AuthModal } from './components/AuthModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { UserProfile, DailyWorkout, UserAuth, AppNotification, DailyReminderConfig, ReaderPreferences } from './types';
import { generateDailyRetentionDigest, triggerSystemNotification } from './utils/notificationUtils';

const DEFAULT_READER_PREFERENCES: ReaderPreferences = {
  theme: 'light',
  fontFamily: 'serif',
  fontSize: 'base',
  eReaderCardMode: true
};

const INITIAL_PROFILE: UserProfile = {
  name: 'Tamanna',
  field: 'tech',
  customFieldTitle: 'Software & Technology Professional',
  targetDailyMinutes: 15,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalMinutesPracticed: 60,
  totalExercisesCompleted: 8,
  vocabLearnedCount: 12,
  xpPoints: 450,
  confidenceScore: 78,
  languagePreference: 'hinglish',
  savedVocabIds: ['v1', 'v2', 'v3', 'v5'],
  completedJourneyUnitIds: ['c1', 'i1'],
  readerPreferences: DEFAULT_READER_PREFERENCES,
  auth: {
    isLoggedIn: true,
    authMethod: 'google',
    email: 'tamannajangra313@gmail.com',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tamanna',
    accountCreatedDate: new Date().toISOString()
  },
  reminderConfig: {
    enabled: true,
    reminderTime: '09:00',
    notifyVocabRecap: true,
    notifySpeechFeedback: true,
    notifyStreakAlert: true,
    browserPermissionGranted: true
  },
  recentFeedbackList: [
    {
      date: 'Today',
      scenario: 'Executive Board Strategy & Disagreement',
      score: 88,
      strength: 'Firm conviction and precise vocabulary ("Trade-off", "Pragmatic")',
      improvementArea: 'Pause 2 seconds before countering rather than using "um/actually"'
    }
  ],
  completedArticulationDrillIds: ['drill-breath-1']
};

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'daily' | 'journeys' | 'seek' | 'practice' | 'vocab' | 'cheatsheets' | 'articulation'>('daily');

  // User Profile with localStorage persistence & safe merging
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('riseguide_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PROFILE,
          ...parsed,
          readerPreferences: parsed.readerPreferences || DEFAULT_READER_PREFERENCES,
          auth: parsed.auth || INITIAL_PROFILE.auth,
          reminderConfig: parsed.reminderConfig || INITIAL_PROFILE.reminderConfig,
          recentFeedbackList: parsed.recentFeedbackList || INITIAL_PROFILE.recentFeedbackList,
          completedArticulationDrillIds: parsed.completedArticulationDrillIds || INITIAL_PROFILE.completedArticulationDrillIds
        };
      } catch (e) {
        console.error('Error parsing profile', e);
      }
    }
    return INITIAL_PROFILE;
  });

  // Daily Workout state
  const [dailyWorkout, setDailyWorkout] = useState<DailyWorkout | null>(null);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState<boolean>(false);
  const [isDailyWorkoutModalOpen, setIsDailyWorkoutModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState<boolean>(false);
  const [todayCompleted, setTodayCompleted] = useState<boolean>(false);

  // In-app & System Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return generateDailyRetentionDigest(INITIAL_PROFILE);
  });

  // Simulator Scenario Hand-off state
  const [handOffScenario, setHandOffScenario] = useState<string | undefined>(undefined);
  const [handOffPrompt, setHandOffPrompt] = useState<string | undefined>(undefined);

  // Theme & Typography state derived from profile
  const theme = userProfile.readerPreferences?.theme || 'light';
  const fontFamily = userProfile.readerPreferences?.fontFamily || 'serif';

  // Toggle Dark / Light Theme
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setUserProfile((prev) => ({
      ...prev,
      readerPreferences: {
        ...(prev.readerPreferences || DEFAULT_READER_PREFERENCES),
        theme: nextTheme
      }
    }));
  };

  // Change Reader Font Family
  const handleChangeFontFamily = (newFont: 'serif' | 'sans' | 'mono') => {
    setUserProfile((prev) => ({
      ...prev,
      readerPreferences: {
        ...(prev.readerPreferences || DEFAULT_READER_PREFERENCES),
        fontFamily: newFont
      }
    }));
  };

  // Synchronize theme class to document element for Tailwind dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist Profile Changes
  useEffect(() => {
    localStorage.setItem('riseguide_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Check today completion status
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const completedToday = localStorage.getItem(`riseguide_workout_completed_${todayStr}`);
    if (completedToday === 'true') {
      setTodayCompleted(true);
    }
  }, []);

  // Fetch or generate dynamic daily workout
  const fetchDailyWorkout = async () => {
    setIsLoadingWorkout(true);
    try {
      const response = await fetch('/api/daily-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: userProfile.field,
          customFieldTitle: userProfile.customFieldTitle,
          languagePreference: userProfile.languagePreference,
          streakDays: userProfile.streakDays,
          userPreferences: userProfile
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDailyWorkout(data);
      } else {
        throw new Error('API route failed');
      }
    } catch (err) {
      console.warn('Using client-generated fallback workout', err);
      const fallback: DailyWorkout = {
        dayNumber: userProfile.streakDays + 1,
        dailyTheme: 'Strategic Conviction & Impromptu Gravitas',
        estimatedMinutes: 15,
        step1Vocab: {
          word: 'Pragmatic',
          phonetic: '/præɡˈmæt.ɪk/',
          partOfSpeech: 'adjective',
          meaning: 'Dealing with matters in a sensible, realistic way rather than theoretical.',
          hinglishExplanation: 'Khaali baatein nahi, zameeni haqeeqat aur practicality pe focus karna.',
          exampleSentence: 'Let us take a pragmatic approach to the deadline rather than over-promising.',
          practiceSentencePrompt: 'Share a situation where a pragmatic decision saved the team time.'
        },
        step2JourneyLesson: {
          title: 'The 3-Sentence Executive Update',
          category: 'Executive Presence',
          mentalModelName: 'Bottom-Line Up Front (BLUF)',
          coreConcept: 'Leaders have 15 seconds of attention. Start with the outcome, provide the metric, end with the ask.',
          bulletTakeaways: [
            'Sentence 1: The Decision or Result (BLUF)',
            'Sentence 2: The Core Evidence or Driver',
            'Sentence 3: The Next Step or Clear Ask'
          ],
          expertCitation: 'Harvard Business Review & Former McKinsey Communication Standards'
        },
        step3PracticeScenario: {
          scenarioTitle: 'Client Pushback on Deliverable Delay',
          situationContext: 'The client is upset because a module was delayed by 3 days.',
          yourRole: 'Lead Strategist / Engineer',
          theChallengePrompt: 'The client is upset because a module was delayed by 3 days. Defend the quality trade-off calmly without sounding defensive.',
          coachingTip: 'Acknowledge their concern with a calm 2-second pause, state the concrete resolution, and provide the updated milestone.',
          recommendedFramework: 'Point - Reason - Example - Point (PREP)'
        },
        step4FieldMotivation: {
          quote: 'True authority never raises its voice; it sharpens its precision.',
          author: 'Executive Communication Guild',
          actionableMicroHabitToday: 'Before speaking in any meeting today, count a silent 2-second pause.',
          confidenceAffirmation: 'I speak with calm conviction, structural brevity, and executive poise.'
        }
      };
      setDailyWorkout(fallback);
    } finally {
      setIsLoadingWorkout(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDailyWorkout();
  }, [userProfile.field]);

  // Complete workout handler
  const handleCompleteDailyWorkout = (xp: number, newVocabWord: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(`riseguide_workout_completed_${todayStr}`, 'true');
    setTodayCompleted(true);

    setUserProfile((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      lastActiveDate: todayStr,
      totalMinutesPracticed: prev.totalMinutesPracticed + 15,
      totalExercisesCompleted: prev.totalExercisesCompleted + 4,
      vocabLearnedCount: prev.vocabLearnedCount + 1,
      xpPoints: prev.xpPoints + xp,
      confidenceScore: Math.min(100, prev.confidenceScore + 3)
    }));

    // Trigger feedback notification
    const feedbackNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'speech_feedback',
      title: '🌟 15-Minute Brain Workout Mastered!',
      message: `Great focus today, ${userProfile.name}! You mastered "${newVocabWord}" and logged 15 minutes of speech fitness. +${xp} XP`,
      timestamp: 'Just now',
      isRead: false,
      actionTab: 'daily'
    };

    setNotifications((prev) => [feedbackNotif, ...prev]);

    triggerSystemNotification('🏆 15-Minute Workout Completed!', {
      body: `+${xp} XP gained! Word mastered: ${newVocabWord}. See you tomorrow for your retention recap.`
    });
  };

  const handleCompleteArticulationDrill = (drillId: string, xp: number) => {
    setUserProfile((prev) => {
      const completed = prev.completedArticulationDrillIds?.includes(drillId)
        ? prev.completedArticulationDrillIds
        : [...(prev.completedArticulationDrillIds || []), drillId];
      return {
        ...prev,
        completedArticulationDrillIds: completed,
        xpPoints: prev.xpPoints + xp,
        totalMinutesPracticed: prev.totalMinutesPracticed + 3,
        confidenceScore: Math.min(100, prev.confidenceScore + 2)
      };
    });
  };

  const handleCompleteJourneyUnit = (unitId: string, xpEarned: number) => {
    setUserProfile((prev) => {
      const completed = prev.completedJourneyUnitIds.includes(unitId)
        ? prev.completedJourneyUnitIds
        : [...prev.completedJourneyUnitIds, unitId];
      return {
        ...prev,
        completedJourneyUnitIds: completed,
        xpPoints: prev.xpPoints + xpEarned,
        totalMinutesPracticed: prev.totalMinutesPracticed + 4
      };
    });
  };

  const handleToggleSaveVocab = (wordId: string) => {
    setUserProfile((prev) => {
      const saved = prev.savedVocabIds.includes(wordId)
        ? prev.savedVocabIds.filter((id) => id !== wordId)
        : [...prev.savedVocabIds, wordId];
      return {
        ...prev,
        savedVocabIds: saved
      };
    });
  };

  const handleAwardXP = (xp: number) => {
    setUserProfile((prev) => ({
      ...prev,
      xpPoints: prev.xpPoints + xp
    }));
  };

  const handleOpenSimulatorWithScenario = (scenario: string, prompt: string) => {
    setHandOffScenario(scenario);
    setHandOffPrompt(prompt);
    setActiveTab('practice');
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleUpdateReminderConfig = (config: Partial<DailyReminderConfig>) => {
    setUserProfile((prev) => ({
      ...prev,
      reminderConfig: {
        ...prev.reminderConfig,
        ...config
      }
    }));
  };

  const handleAddTestNotification = () => {
    const newNotif: AppNotification = {
      id: `test-notif-${Date.now()}`,
      type: 'daily_kickoff',
      title: '🌅 15-Minute Daily Kickoff Reminder',
      message: `Good morning ${userProfile.name}! Your daily 15-minute vocal workout & vocabulary booster are ready.`,
      timestamp: 'Just now',
      isRead: false,
      actionTab: 'daily'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    triggerSystemNotification(newNotif.title, { body: newNotif.message });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Font family container class
  const fontClass = fontFamily === 'serif' 
    ? 'font-serif' 
    : fontFamily === 'mono' 
      ? 'font-mono' 
      : 'font-sans';

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col pb-20 lg:pb-12 ${fontClass} ${
      theme === 'dark' 
        ? 'bg-[#121214] text-[#F4F4F6]' 
        : 'bg-[#FAF8F5] text-[#18181B]'
    }`}>
      
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        fontFamily={fontFamily}
        onChangeFontFamily={handleChangeFontFamily}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsModalOpen(true)}
        onStartDailyWorkout={() => setIsDailyWorkoutModalOpen(true)}
        todayCompleted={todayCompleted}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'daily' && (
          <DailyDashboard
            userProfile={userProfile}
            dailyWorkout={dailyWorkout}
            isLoadingWorkout={isLoadingWorkout}
            onStartDailyWorkout={() => setIsDailyWorkoutModalOpen(true)}
            onRefreshWorkout={fetchDailyWorkout}
            onNavigateTab={setActiveTab}
            todayCompleted={todayCompleted}
            theme={theme}
          />
        )}

        {activeTab === 'articulation' && (
          <ArticulationTrainingHub
            userProfile={userProfile}
            onCompleteDrill={handleCompleteArticulationDrill}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'seek' && (
          <SeekTool
            userProfile={userProfile}
            onOpenSimulatorWithScenario={handleOpenSimulatorWithScenario}
          />
        )}

        {activeTab === 'journeys' && (
          <BiteSizedJourneys
            userProfile={userProfile}
            onCompleteUnit={handleCompleteJourneyUnit}
            onOpenSimulatorWithScenario={handleOpenSimulatorWithScenario}
            theme={theme}
          />
        )}

        {activeTab === 'practice' && (
          <InteractivePracticeHub
            userProfile={userProfile}
            initialScenario={handOffScenario}
            initialPrompt={handOffPrompt}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabMasterBank
            userProfile={userProfile}
            onToggleSaveVocab={handleToggleSaveVocab}
            onAwardXP={handleAwardXP}
            theme={theme}
          />
        )}

        {activeTab === 'cheatsheets' && (
          <CheatSheetsHub
            onOpenSimulatorWithScenario={handleOpenSimulatorWithScenario}
            theme={theme}
          />
        )}
      </main>

      {/* Flagship Daily 15-Minute Routine Modal */}
      <DailyWorkoutModal
        isOpen={isDailyWorkoutModalOpen}
        onClose={() => setIsDailyWorkoutModalOpen(false)}
        dailyWorkout={dailyWorkout}
        isLoadingWorkout={isLoadingWorkout}
        onRefreshWorkout={fetchDailyWorkout}
        userProfile={userProfile}
        onCompleteWorkout={handleCompleteDailyWorkout}
      />

      {/* Profile & Field Customization Modal */}
      <ProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={userProfile}
        onUpdateAuth={(auth: UserAuth) => {
          setUserProfile((prev) => ({
            ...prev,
            name: auth.email ? auth.email.split('@')[0] : prev.name,
            auth
          }));
        }}
      />

      {/* Notifications & Daily Retention Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        userProfile={userProfile}
        onMarkAllRead={handleMarkAllNotificationsAsRead}
        onUpdateReminderConfig={handleUpdateReminderConfig}
        onSendTestNotification={handleAddTestNotification}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsNotificationsModalOpen(false);
        }}
      />

    </div>
  );
}
