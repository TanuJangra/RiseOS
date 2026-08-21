import React from 'react';
import { 
  X, 
  Settings, 
  Flame, 
  Clock, 
  Award, 
  BookOpen, 
  Check, 
  User, 
  Globe, 
  Briefcase
} from 'lucide-react';
import { FieldCategory, UserProfile } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const fieldOptions: { id: FieldCategory; label: string; desc: string }[] = [
    { id: 'tech', label: 'Tech & Engineering', desc: 'Translating complex architecture, standups, sprint reviews, tech leadership' },
    { id: 'leadership', label: 'Management & Leadership', desc: 'Stakeholder alignment, delegating with gravitas, conflict mediation' },
    { id: 'marketing_sales', label: 'Marketing & Sales', desc: 'Persuasive pitching, value proposition framing, objection handling' },
    { id: 'student', label: 'Student & Fresh Graduate', desc: 'Campus placements, behavioral interviews (STAR), confidence building' },
    { id: 'finance', label: 'Finance & Consulting', desc: 'Data synthesis, executive brevity (BLUF), precise client presentations' },
    { id: 'creative', label: 'Creative & Design', desc: 'Defending design rationale, client feedback de-escalation, storytelling' },
    { id: 'general', label: 'Self-Mastery & Everyday Life', desc: 'Social charisma, magnetic first impressions, active listening, articulation' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#18181B]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-editorial-sans">
      <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DDD4] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#18181B]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2DDD4] bg-[#F5F2EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-[#18181B] border border-[#E2DDD4]">
              <Settings className="w-4 h-4 text-[#C2410C]" />
            </div>
            <div>
              <h2 className="font-editorial-heading font-serif font-bold text-base sm:text-lg text-[#18181B]">
                Profile & Personalization
              </h2>
              <p className="text-xs text-[#52525B]">
                Tailor your daily 15-minute exercises & AI feedback to your target field.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#18181B] rounded-full hover:bg-[#EAE5DB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF8F5]">
          
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white border border-[#E2DDD4] rounded-2xl text-center space-y-0.5 shadow-2xs">
              <Flame className="w-4 h-4 text-[#C2410C] mx-auto" />
              <span className="text-base font-bold text-[#18181B] block">{userProfile.streakDays} Days</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#64748B]">Daily Streak</span>
            </div>

            <div className="p-4 bg-white border border-[#E2DDD4] rounded-2xl text-center space-y-0.5 shadow-2xs">
              <Clock className="w-4 h-4 text-[#1D4ED8] mx-auto" />
              <span className="text-base font-bold text-[#18181B] block">{userProfile.totalMinutesPracticed}m</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#64748B]">Practiced</span>
            </div>

            <div className="p-4 bg-white border border-[#E2DDD4] rounded-2xl text-center space-y-0.5 shadow-2xs">
              <BookOpen className="w-4 h-4 text-[#7E22CE] mx-auto" />
              <span className="text-base font-bold text-[#18181B] block">{userProfile.vocabLearnedCount}</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#64748B]">Vocab Bank</span>
            </div>

            <div className="p-4 bg-white border border-[#E2DDD4] rounded-2xl text-center space-y-0.5 shadow-2xs">
              <Award className="w-4 h-4 text-[#15803D] mx-auto" />
              <span className="text-base font-bold text-[#18181B] block">{userProfile.xpPoints} XP</span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#64748B]">Mastery XP</span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Your Name / Preferred Identifier</span>
            </label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E2DDD4] rounded-xl text-sm focus:outline-none focus:border-[#18181B]"
            />
          </div>

          {/* Target Field Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Target Career Field / Domain</span>
            </label>
            <div className="grid gap-2.5">
              {fieldOptions.map((opt) => {
                const isSelected = userProfile.field === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateProfile({ field: opt.id })}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#18181B] shadow-2xs'
                        : 'bg-white border-[#E2DDD4] hover:border-[#64748B]'
                    }`}
                  >
                    <div>
                      <h4 className="font-editorial-heading font-serif font-bold text-sm text-[#18181B]">
                        {opt.label}
                      </h4>
                      <p className="text-[11px] text-[#52525B] mt-0.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Guidance & Explanation Language</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hinglish', label: 'Hinglish (Desi English)' },
                { id: 'english', label: 'Pure English' },
                { id: 'hindi', label: 'Hindi + English' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onUpdateProfile({ languagePreference: lang.id as any })}
                  className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                    userProfile.languagePreference === lang.id
                      ? 'bg-[#18181B] text-[#FAF8F5] border-[#18181B] shadow-2xs'
                      : 'bg-white text-[#52525B] border-[#E2DDD4] hover:bg-[#F5F2EB] hover:text-[#18181B]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5F2EB] border-t border-[#E2DDD4] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold rounded-full transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
