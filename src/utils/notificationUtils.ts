import { AppNotification, UserProfile } from '../types';

export const requestBrowserNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const triggerSystemNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    } catch (e) {
      console.warn('System notification failed, falling back to in-app notification', e);
    }
  }
};

export const generateDailyRetentionDigest = (userProfile: UserProfile): AppNotification[] => {
  const notifications: AppNotification[] = [];
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Vocab Retention Digest
  notifications.push({
    id: `notif-vocab-${Date.now()}`,
    type: 'vocab_recap',
    title: '🧠 Today\'s Vocab Retention Digest',
    message: 'Remember today\'s power word: "Articulate" (/ɑːrˈtɪk.jə.lət/) — Expressing ideas fluently and coherently. Tap to review your Lexicon.',
    timestamp: timeString,
    isRead: false,
    actionTab: 'vocab',
    metadata: {
      vocabWord: 'Articulate',
      vocabMeaning: 'Expressing ideas clearly and persuasively.'
    }
  });

  // 2. Speech Coach Feedback Alert
  if (userProfile.recentFeedbackList && userProfile.recentFeedbackList.length > 0) {
    const latestFeedback = userProfile.recentFeedbackList[0];
    notifications.push({
      id: `notif-feedback-${Date.now() + 1}`,
      type: 'speech_feedback',
      title: '🎯 Speech Coach Daily Feedback',
      message: `You scored ${latestFeedback.score}% on "${latestFeedback.scenario}". Coach Tip: ${latestFeedback.improvementArea}`,
      timestamp: 'Earlier today',
      isRead: false,
      actionTab: 'practice',
      metadata: {
        score: latestFeedback.score,
        feedbackSummary: latestFeedback.improvementArea
      }
    });
  } else {
    notifications.push({
      id: `notif-feedback-${Date.now() + 1}`,
      type: 'speech_feedback',
      title: '🎯 Speech Coach Practice Alert',
      message: 'You scored 86% on your last session! Remember: Pause 2 seconds before answering to eliminate filler words tomorrow.',
      timestamp: 'Yesterday',
      isRead: false,
      actionTab: 'practice',
      metadata: {
        score: 86,
        feedbackSummary: 'Use deliberate pauses instead of softening filler phrases.'
      }
    });
  }

  // 3. Streak & Tomorrow's Session Hook
  notifications.push({
    id: `notif-streak-${Date.now() + 2}`,
    type: 'streak_alert',
    title: `🔥 Protect Your ${userProfile.streakDays}-Day Streak!`,
    message: `Tomorrow's 15-minute challenge: "Consonant Precision & The 2-Second Strategic Pause". Join tomorrow morning at ${userProfile.reminderConfig?.reminderTime || '09:00 AM'}!`,
    timestamp: 'Scheduled',
    isRead: false,
    actionTab: 'articulation'
  });

  return notifications;
};
