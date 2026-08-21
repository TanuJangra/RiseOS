import React from 'react';
import { 
  Flame, 
  Activity, 
  BookOpen, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Brain
} from 'lucide-react';
import { UserProfile } from '../types';

interface BrainFitnessRingsProps {
  userProfile: UserProfile;
  todayCompleted: boolean;
  onStartWorkout: () => void;
  isDark?: boolean;
}

export const BrainFitnessRings: React.FC<BrainFitnessRingsProps> = ({
  userProfile,
  todayCompleted,
  onStartWorkout,
  isDark = false
}) => {
  // Ring 1: Vocal Stamina (Minutes goal: target e.g. 15 min)
  const targetMinutes = userProfile.targetDailyMinutes || 15;
  const currentMinutes = todayCompleted ? targetMinutes : Math.min(targetMinutes, userProfile.totalMinutesPracticed % targetMinutes || 6);
  const staminaPercent = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));

  // Ring 2: Lexicon Power (Target: 5 words active/day)
  const targetVocab = 5;
  const currentVocab = Math.min(targetVocab, userProfile.vocabLearnedCount || 3);
  const vocabPercent = Math.min(100, Math.round((currentVocab / targetVocab) * 100));

  // Ring 3: Cognitive Agility / Streak (Target: 7-day milestone)
  const streakPercent = Math.min(100, Math.round(((userProfile.streakDays % 7) / 7) * 100) || 45);

  // SVG Ring Math
  // Outer radius 78, Mid radius 60, Inner radius 42
  const outerCircumference = 2 * Math.PI * 78;
  const midCircumference = 2 * Math.PI * 60;
  const innerCircumference = 2 * Math.PI * 42;

  const outerOffset = outerCircumference - (staminaPercent / 100) * outerCircumference;
  const midOffset = midCircumference - (vocabPercent / 100) * midCircumference;
  const innerOffset = innerCircumference - (streakPercent / 100) * innerCircumference;

  // 7-day streak tracker
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
      isDark 
        ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' 
        : 'bg-white border-[#E2DDD4] text-[#18181B] shadow-xs'
    }`}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b pb-4 mb-5 border-inherit">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl border ${
            isDark 
              ? 'bg-[#27272A] border-[#3F3F46] text-[#22C55E]' 
              : 'bg-[#F0FDF4] border-[#DCFCE7] text-[#15803D]'
          }`}>
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial-heading font-serif font-bold text-base sm:text-lg leading-tight">
              Brain Fitness Vitals
            </h3>
            <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
              Daily Cognitive Readiness & Articulation Stamina
            </span>
          </div>
        </div>

        {/* Readiness Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1.5 border ${
          isDark 
            ? 'bg-[#222226] text-[#22C55E] border-[#27272A]' 
            : 'bg-[#F0FDF4] text-[#15803D] border-[#DCFCE7]'
        }`}>
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{todayCompleted ? '98% PEAK' : '88% READY'}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-center">
        
        {/* Left: 3 Interactive Fitness Rings */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
              {/* Outer Ring Background (Vocal Stamina - Ink Orange) */}
              <circle
                cx="100"
                cy="100"
                r="78"
                className={isDark ? 'stroke-[#27272A]' : 'stroke-[#F5F2EB]'}
                strokeWidth="11"
                fill="transparent"
              />
              {/* Outer Ring Active */}
              <circle
                cx="100"
                cy="100"
                r="78"
                className="stroke-[#C2410C] dark:stroke-[#FB923C] transition-all duration-1000 ease-out"
                strokeWidth="11"
                strokeDasharray={outerCircumference}
                strokeDashoffset={outerOffset}
                strokeLinecap="round"
                fill="transparent"
              />

              {/* Middle Ring Background (Lexicon Power - Slate Indigo) */}
              <circle
                cx="100"
                cy="100"
                r="60"
                className={isDark ? 'stroke-[#27272A]' : 'stroke-[#F5F2EB]'}
                strokeWidth="11"
                fill="transparent"
              />
              {/* Middle Ring Active */}
              <circle
                cx="100"
                cy="100"
                r="60"
                className="stroke-[#4338CA] dark:stroke-[#818CF8] transition-all duration-1000 ease-out"
                strokeWidth="11"
                strokeDasharray={midCircumference}
                strokeDashoffset={midOffset}
                strokeLinecap="round"
                fill="transparent"
              />

              {/* Inner Ring Background (Cognitive Agility - Emerald) */}
              <circle
                cx="100"
                cy="100"
                r="42"
                className={isDark ? 'stroke-[#27272A]' : 'stroke-[#F5F2EB]'}
                strokeWidth="11"
                fill="transparent"
              />
              {/* Inner Ring Active */}
              <circle
                cx="100"
                cy="100"
                r="42"
                className="stroke-[#15803D] dark:stroke-[#22C55E] transition-all duration-1000 ease-out"
                strokeWidth="11"
                strokeDasharray={innerCircumference}
                strokeDashoffset={innerOffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-mono font-bold tracking-tight">
                {userProfile.streakDays}d
              </span>
              <span className="text-[10px] uppercase font-bold text-[#64748B] dark:text-[#A1A1AA] tracking-wider">
                Streak
              </span>
            </div>
          </div>

          {/* Ring Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold mt-3">
            <span className="flex items-center gap-1.5 text-[#C2410C] dark:text-[#FB923C]">
              <span className="w-2 h-2 rounded-full bg-[#C2410C] dark:bg-[#FB923C]"></span>
              Vocal Stamina ({staminaPercent}%)
            </span>
            <span className="flex items-center gap-1.5 text-[#4338CA] dark:text-[#818CF8]">
              <span className="w-2 h-2 rounded-full bg-[#4338CA] dark:bg-[#818CF8]"></span>
              Lexicon ({vocabPercent}%)
            </span>
            <span className="flex items-center gap-1.5 text-[#15803D] dark:text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#15803D] dark:bg-[#22C55E]"></span>
              Agility ({userProfile.confidenceScore} pts)
            </span>
          </div>
        </div>

        {/* Right: Vitals Metrics & Streak Heatmap */}
        <div className="md:col-span-7 space-y-4">
          
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className={`p-3 rounded-2xl border text-center ${
              isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
            }`}>
              <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider block font-semibold">
                Daily Focus
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-[#C2410C] dark:text-[#FB923C]">
                {currentMinutes}/{targetMinutes}m
              </span>
            </div>

            <div className={`p-3 rounded-2xl border text-center ${
              isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
            }`}>
              <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider block font-semibold">
                Active Vocab
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-[#4338CA] dark:text-[#818CF8]">
                {userProfile.vocabLearnedCount} wds
              </span>
            </div>

            <div className={`p-3 rounded-2xl border text-center ${
              isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
            }`}>
              <span className="text-[10px] text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-wider block font-semibold">
                Brain XP
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-[#15803D] dark:text-[#22C55E]">
                {userProfile.xpPoints} XP
              </span>
            </div>
          </div>

          {/* 7-Day Cognitive Consistency Heatmap */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
          }`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
              <span className="text-[#64748B] dark:text-[#A1A1AA]">7-Day Brain Training Consistency</span>
              <span className="font-mono text-[#15803D] dark:text-[#22C55E] text-[11px] font-bold">
                {userProfile.streakDays} Consecutive Days
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day, idx) => {
                const isPastOrToday = idx <= todayDayIndex;
                const isCompleted = isPastOrToday && (idx < todayDayIndex || todayCompleted);
                const isToday = idx === todayDayIndex;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-mono text-[#64748B] dark:text-[#A1A1AA]">{day}</span>
                    <div 
                      className={`w-full aspect-square rounded-xl border flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                          : isToday
                          ? 'border-[#C2410C] bg-[#C2410C]/15 text-[#C2410C] dark:text-[#FB923C] animate-pulse'
                          : isDark
                          ? 'bg-[#18181B] border-[#27272A] text-transparent'
                          : 'bg-white border-[#E2DDD4] text-transparent'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      ) : isToday ? (
                        <Zap className="w-3 h-3 fill-current" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Bar */}
          {!todayCompleted && (
            <button
              onClick={onStartWorkout}
              className="w-full py-2.5 px-4 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#FB923C] fill-current" />
              <span>Close Today's Rings (Launch 15m Workout)</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
