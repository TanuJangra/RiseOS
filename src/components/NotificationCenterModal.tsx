import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Sparkles, 
  Volume2, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Mic2,
  AlertCircle
} from 'lucide-react';
import { AppNotification, UserProfile } from '../types';
import { requestBrowserNotificationPermission, triggerSystemNotification } from '../utils/notificationUtils';
import { speakText } from '../utils/speechUtils';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: any) => void;
  onUpdateReminderConfig: (config: any) => void;
  onAddTestNotification: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  notifications,
  onMarkAllAsRead,
  onNavigateTab,
  onUpdateReminderConfig,
  onAddTestNotification
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'schedule'>('inbox');
  const [reminderTime, setReminderTime] = useState<string>(userProfile.reminderConfig?.reminderTime || '09:00');
  const [notifyVocab, setNotifyVocab] = useState<boolean>(userProfile.reminderConfig?.notifyVocabRecap ?? true);
  const [notifyFeedback, setNotifyFeedback] = useState<boolean>(userProfile.reminderConfig?.notifySpeechFeedback ?? true);
  const [notifyStreak, setNotifyStreak] = useState<boolean>(userProfile.reminderConfig?.notifyStreakAlert ?? true);
  const [permissionStatus, setPermissionStatus] = useState<string>(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestBrowserNotificationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      triggerSystemNotification('🎉 RISE OS Notifications Activated!', {
        body: 'You will receive daily 15-minute vocabulary retention digests and speech feedback reminders.'
      });
    }
  };

  const handleSaveSettings = () => {
    onUpdateReminderConfig({
      enabled: true,
      reminderTime,
      notifyVocabRecap: notifyVocab,
      notifySpeechFeedback: notifyFeedback,
      notifyStreakAlert: notifyStreak,
      browserPermissionGranted: permissionStatus === 'granted'
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSendTestNow = () => {
    onAddTestNotification();
    if (permissionStatus === 'granted') {
      triggerSystemNotification('🧠 Daily Retention: "Articulate" + Speech Feedback (88%)', {
        body: 'Your coach tip: Pause 2s to replace "actually". Protect your streak today!'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-editorial-sans">
      <div className="bg-[#FAF8F5] text-[#18181B] w-full max-w-xl rounded-3xl border border-[#E2DDD4] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E2DDD4] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18181B] text-white flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial-heading font-serif font-bold text-xl text-[#18181B]">
                  Daily Retention & Alerts
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#F5F2EB] text-[#C2410C] text-[10px] font-bold border border-[#E2DDD4]">
                  Retention Engine
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Daily vocabulary recap, coach feedback & streak notifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F5F2EB] text-[#64748B] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 shrink-0 bg-[#FAF8F5]">
          <button
            onClick={() => setActiveSubTab('inbox')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'inbox'
                ? 'bg-[#18181B] text-[#FAF8F5] shadow-2xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#EAE5DB]'
            }`}
          >
            <span>Daily Digests Inbox ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'schedule'
                ? 'bg-[#18181B] text-[#FAF8F5] shadow-2xs'
                : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#EAE5DB]'
            }`}
          >
            <span>Notification Schedule & Push</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: INBOX */}
          {activeSubTab === 'inbox' && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Today & Yesterday's Retention Digests
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTestNow}
                    className="text-[11px] text-[#C2410C] font-semibold hover:underline cursor-pointer"
                  >
                    + Trigger Live Digest
                  </button>
                  <span className="text-[#E2DDD4]">|</span>
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-[11px] text-[#64748B] font-semibold hover:text-[#18181B] cursor-pointer"
                  >
                    Mark All Read
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#E2DDD4] space-y-2">
                  <Bell className="w-8 h-8 text-[#94A3B8] mx-auto" />
                  <h4 className="text-sm font-bold text-[#18181B]">No unread alerts</h4>
                  <p className="text-xs text-[#64748B]">Your daily retention digest will pop up every morning.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                      notif.type === 'vocab_recap'
                        ? 'bg-white border-[#E2DDD4] shadow-2xs'
                        : notif.type === 'speech_feedback'
                        ? 'bg-[#FAF8F5] border-[#18181B]'
                        : 'bg-[#FFFBEB] border-[#FDE68A]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {notif.type === 'vocab_recap' && <BookOpen className="w-4 h-4 text-[#C2410C]" />}
                        {notif.type === 'speech_feedback' && <Mic2 className="w-4 h-4 text-[#15803D]" />}
                        {notif.type === 'streak_alert' && <Flame className="w-4 h-4 text-[#C2410C]" />}
                        <h4 className="font-editorial-heading font-serif font-bold text-sm text-[#18181B]">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-[#64748B] shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#52525B] leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Quick Action Buttons */}
                    <div className="pt-2 flex items-center justify-between border-t border-[#EDE9E0]">
                      {notif.metadata?.vocabWord && (
                        <button
                          onClick={() => speakText(`${notif.metadata?.vocabWord}. ${notif.metadata?.vocabMeaning}`)}
                          className="text-[11px] text-[#64748B] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                          <span>Pronounce "{notif.metadata?.vocabWord}"</span>
                        </button>
                      )}

                      {notif.metadata?.score && (
                        <span className="text-[11px] font-bold text-[#15803D]">
                          Score: {notif.metadata?.score}%
                        </span>
                      )}

                      {notif.actionTab && (
                        <button
                          onClick={() => {
                            onNavigateTab(notif.actionTab);
                            onClose();
                          }}
                          className="text-xs font-bold text-[#18181B] hover:text-[#C2410C] flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <span>Open Section</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SCHEDULE & PUSH SETTINGS */}
          {activeSubTab === 'schedule' && (
            <div className="space-y-5 animate-in fade-in">
              
              {/* Browser Push Permission Alert */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DDD4] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Browser Push Notifications
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    permissionStatus === 'granted'
                      ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                      : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]'
                  }`}>
                    {permissionStatus}
                  </span>
                </div>

                <p className="text-xs text-[#52525B] leading-relaxed">
                  Enable desktop or mobile push notifications so you receive your daily 15-minute vocab review and speech feedback even when the tab is closed.
                </p>

                {permissionStatus !== 'granted' && (
                  <button
                    onClick={handleRequestPermission}
                    className="w-full py-2.5 bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>Grant Notification Permission</span>
                  </button>
                )}
              </div>

              {/* Reminder Time Picker */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DDD4] space-y-3 shadow-2xs">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Daily 15-Minute Habit Schedule
                </span>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#18181B]">
                    <Clock className="w-4 h-4 text-[#C2410C]" />
                    <span>Send Daily Morning Digest At:</span>
                  </div>

                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl text-xs font-bold text-[#18181B] focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              {/* Notification Categories */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DDD4] space-y-3 shadow-2xs text-xs">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Notification Types Included
                </span>

                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#C2410C]" />
                    <span>Today's Vocabulary Retention Recap</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyVocab}
                    onChange={(e) => setNotifyVocab(e.target.checked)}
                    className="rounded accent-[#C2410C] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Mic2 className="w-4 h-4 text-[#15803D]" />
                    <span>Yesterday's Speech Coach Feedback & Highlights</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyFeedback}
                    onChange={(e) => setNotifyFeedback(e.target.checked)}
                    className="rounded accent-[#C2410C] w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F5] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#C2410C]" />
                    <span>Streak Alert & Tomorrow's Challenge Preview</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyStreak}
                    onChange={(e) => setNotifyStreak(e.target.checked)}
                    className="rounded accent-[#C2410C] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-between pt-2">
                {saveSuccess ? (
                  <span className="text-xs text-[#15803D] font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Notification schedule saved!</span>
                  </span>
                ) : (
                  <span></span>
                )}

                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-[#18181B] hover:bg-black text-[#FAF8F5] font-bold text-xs rounded-full shadow-2xs transition-colors cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
