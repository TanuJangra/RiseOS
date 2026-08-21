import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  Flame, 
  Search, 
  Compass, 
  Mic2, 
  BookOpen, 
  ArrowRight, 
  Volume2, 
  CheckCircle2, 
  RefreshCw,
  Award,
  Activity,
  Zap,
  Layers,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { DailyWorkout, UserProfile } from '../types';
import { FIELD_MOTIVATION_CONFIG } from '../data/staticData';
import { speakText } from '../utils/speechUtils';
import { BrainFitnessRings } from './BrainFitnessRings';
import { StepSkillTrackRoadmap, SkillNode } from './StepSkillTrackRoadmap';

interface DailyDashboardProps {
  userProfile: UserProfile;
  dailyWorkout: DailyWorkout | null;
  isLoadingWorkout: boolean;
  onStartDailyWorkout: () => void;
  onRefreshWorkout: () => void;
  onNavigateTab: (tab: 'daily' | 'journeys' | 'seek' | 'practice' | 'vocab' | 'cheatsheets' | 'articulation') => void;
  todayCompleted: boolean;
  theme?: 'light' | 'dark';
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({
  userProfile,
  dailyWorkout,
  isLoadingWorkout,
  onStartDailyWorkout,
  onRefreshWorkout,
  onNavigateTab,
  todayCompleted,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const currentField = FIELD_MOTIVATION_CONFIG[userProfile.field] || FIELD_MOTIVATION_CONFIG.general;
  const [activeRoadmapView, setActiveRoadmapView] = useState<boolean>(false);

  const handleLaunchRoadmapNode = (node: SkillNode) => {
    if (node.category === 'vocal') {
      onNavigateTab('articulation');
    } else if (node.category === 'storytelling' || node.category === 'gravitas') {
      onNavigateTab('practice');
    } else {
      onNavigateTab('journeys');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Sleek Brain Fitness Tracker Vitals & Activity Rings */}
      <BrainFitnessRings
        userProfile={userProfile}
        todayCompleted={todayCompleted}
        onStartWorkout={onStartDailyWorkout}
        isDark={isDark}
      />

      {/* 2. Today's Flagship 15-Minute Brain Workout Card (E-Reader Minimalist Hero) */}
      <div className={`p-6 sm:p-9 rounded-3xl border transition-all relative overflow-hidden ${
        isDark 
          ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' 
          : 'bg-gradient-to-br from-white via-[#FAF8F5] to-[#F3EFE6] border-[#E2DDD4] text-[#18181B] shadow-sm'
      }`}>
        
        {/* Ambient Subtle Ink Wash Accent */}
        <div className={`absolute right-0 top-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-[#EA580C]/10' : 'bg-[#C2410C]/5'
        }`} />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Topic & 4-Step Bite-Sized Flow */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono border flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-[#27272A] text-[#FB923C] border-[#3F3F46]' 
                  : 'bg-[#F5F2EB] text-[#C2410C] border-[#E2DDD4]'
              }`}>
                <Clock className="w-3 h-3 text-[#C2410C] dark:text-[#FB923C]" />
                <span>15-Min Brain Workout</span>
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                isDark 
                  ? 'bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]' 
                  : 'bg-white text-[#64748B] border-[#E2DDD4]'
              }`}>
                Day {dailyWorkout?.dayNumber || userProfile.streakDays + 1} • {currentField.label}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-editorial-heading font-serif font-bold tracking-tight leading-[1.15] ${
              isDark ? 'text-white' : 'text-[#18181B]'
            }`}>
              {dailyWorkout?.dailyTheme || 'Sharpen Articulation, Gravitas & Conviction'}
            </h1>

            <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
              isDark ? 'text-[#D4D4D8]' : 'text-[#52525B]'
            }`}>
              Invest 15 focused minutes today across 4 bite-sized micro-drills: expand power vocabulary, master a strategic mental model, practice on an AI speech simulator, and boost field confidence.
            </p>

            {/* 4 Bite-Sized Step Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-white/80 border-[#E2DDD4]'
              }`}>
                <span className="text-[9px] text-[#C2410C] dark:text-[#FB923C] font-mono font-bold block uppercase tracking-wider">Step 1 (3m)</span>
                <span className="font-semibold text-xs text-inherit">Power Vocab</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-white/80 border-[#E2DDD4]'
              }`}>
                <span className="text-[9px] text-[#2563EB] dark:text-[#60A5FA] font-mono font-bold block uppercase tracking-wider">Step 2 (4m)</span>
                <span className="font-semibold text-xs text-inherit">Mental Model</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-white/80 border-[#E2DDD4]'
              }`}>
                <span className="text-[9px] text-[#15803D] dark:text-[#22C55E] font-mono font-bold block uppercase tracking-wider">Step 3 (6m)</span>
                <span className="font-semibold text-xs text-inherit">AI Simulator</span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-white/80 border-[#E2DDD4]'
              }`}>
                <span className="text-[9px] text-[#7C3AED] dark:text-[#A78BFA] font-mono font-bold block uppercase tracking-wider">Step 4 (2m)</span>
                <span className="font-semibold text-xs text-inherit">Field Habit</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartDailyWorkout}
                className={`px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2.5 shadow-sm cursor-pointer ${
                  todayCompleted
                    ? 'bg-[#15803D] hover:bg-[#166534] text-white border border-[#15803D]'
                    : isDark
                      ? 'bg-white hover:bg-[#FAF8F5] text-[#18181B] border border-white hover:scale-[1.02]'
                      : 'bg-[#18181B] hover:bg-[#27272A] text-white border border-[#18181B] hover:scale-[1.02]'
                }`}
              >
                {todayCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Review Completed Routine</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#FB923C] dark:text-[#EA580C] fill-current" />
                    <span>Launch 15-Min Brain Workout</span>
                    <ArrowRight className="w-4 h-4 text-current" />
                  </>
                )}
              </button>

              <button
                onClick={onRefreshWorkout}
                disabled={isLoadingWorkout}
                className={`px-4 py-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-[#222226] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white border-[#3F3F46]' 
                    : 'bg-white hover:bg-[#F5F2EB] text-[#64748B] hover:text-[#18181B] border-[#E2DDD4]'
                }`}
                title="Regenerate dynamic workout"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWorkout ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Deck</span>
              </button>
            </div>

          </div>

          {/* Right Column: Motivation & Field Insight Card */}
          <div className={`lg:col-span-4 rounded-2xl border p-5 space-y-4 ${
            isDark ? 'bg-[#222226]/90 border-[#27272A]' : 'bg-white/90 border-[#E2DDD4] shadow-xs'
          }`}>
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B] dark:text-[#A1A1AA]">
                Today's Focus Field
              </span>
              <div className="flex items-center gap-1 text-[#C2410C] dark:text-[#FB923C] text-xs font-bold font-mono">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{currentField.label}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA] block">
                Executive Mindset:
              </span>
              <p className={`italic text-xs sm:text-sm font-serif leading-relaxed ${
                isDark ? 'text-white' : 'text-[#18181B]'
              }`}>
                "{currentField.coreInsight}"
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              isDark ? 'bg-[#18181B] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
            }`}>
              <span className="text-[10px] font-mono font-bold text-[#C2410C] dark:text-[#FB923C] uppercase tracking-wider block">
                Target Daily Habit:
              </span>
              <p className={`text-[11px] leading-relaxed ${
                isDark ? 'text-[#D4D4D8]' : 'text-[#52525B]'
              }`}>
                {dailyWorkout?.step4FieldMotivation.actionableMicroHabitToday || currentField.dailyAffirmation}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bite-Sized Cards Bento Deck (Replaces Heavy Text Walls) */}
      <div className="grid lg:grid-cols-3 gap-5">
        
        {/* Card 1: Today's Word of the Day (Interactive Audio & Hinglish Flip) */}
        <div className={`p-6 sm:p-7 rounded-3xl border space-y-3 transition-all ${
          isDark ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' : 'bg-white border-[#E2DDD4] text-[#18181B] shadow-2xs'
        }`}>
          <div className="flex items-center justify-between border-b pb-2.5 border-inherit">
            <span className="text-[10px] font-mono font-bold text-[#4338CA] dark:text-[#A78BFA] uppercase tracking-widest">
              Power Word of the Day
            </span>
            <button
              onClick={() => speakText(`${dailyWorkout?.step1Vocab.word || 'Articulate'}. ${dailyWorkout?.step1Vocab.meaning || ''}`)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'bg-[#222226] border-[#27272A] hover:text-[#A78BFA]' : 'bg-[#F5F2EB] border-[#E2DDD4] hover:text-[#4338CA]'
              }`}
              title="Listen pronunciation"
            >
              <Volume2 className="w-4 h-4 text-[#4338CA] dark:text-[#A78BFA]" />
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-editorial-heading font-serif font-bold">
              {dailyWorkout?.step1Vocab.word || 'Articulate'}
            </h3>
            <span className="text-xs font-mono text-[#64748B] dark:text-[#A1A1AA]">
              {dailyWorkout?.step1Vocab.phonetic || '/ɑːrˈtɪk.jə.lət/'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#D4D4D8] leading-relaxed font-medium">
            {dailyWorkout?.step1Vocab.meaning || 'Expressing ideas clearly and fluidly in speech or writing.'}
          </p>

          <div className={`p-3 rounded-2xl border text-xs ${
            isDark ? 'bg-[#222226] border-[#27272A] text-[#D4D4D8]' : 'bg-[#FAF8F5] border-[#E2DDD4] text-[#52525B]'
          }`}>
            <strong className="text-inherit block text-[10px] uppercase font-mono tracking-wider text-[#C2410C] dark:text-[#FB923C] mb-0.5">
              Hinglish Intuition:
            </strong>
            {dailyWorkout?.step1Vocab.hinglishExplanation || 'Apne vichaaron ko bina kisi rukawat ke asardaar dhang se bayan karna.'}
          </div>
        </div>

        {/* Card 2: 45-Second Mental Model */}
        <div className={`p-6 sm:p-7 rounded-3xl border space-y-3 transition-all ${
          isDark ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' : 'bg-white border-[#E2DDD4] text-[#18181B] shadow-2xs'
        }`}>
          <div className="border-b pb-2.5 border-inherit">
            <span className="text-[10px] font-mono font-bold text-[#1D4ED8] dark:text-[#60A5FA] uppercase tracking-widest block">
              45-Second Mental Model
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-editorial-heading font-serif font-bold">
            {dailyWorkout?.step2JourneyLesson.title || 'The PREP Framework'}
          </h3>

          <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
            {dailyWorkout?.step2JourneyLesson.coreConcept || 'Anchor any impromptu meeting response into 4 distinct pillars: Point, Reason, Example, Point.'}
          </p>

          <div className={`p-3 rounded-2xl border text-xs ${
            isDark ? 'bg-[#222226] border-[#27272A] text-[#D4D4D8]' : 'bg-[#FAF8F5] border-[#E2DDD4] text-[#52525B]'
          }`}>
            <strong className="text-inherit block text-[10px] uppercase font-mono tracking-wider text-[#1D4ED8] dark:text-[#60A5FA] mb-0.5">
              Core Takeaway:
            </strong>
            {dailyWorkout?.step2JourneyLesson.bulletTakeaways[0] || 'Deliver your core conclusion in the first 5 seconds.'}
          </div>
        </div>

        {/* Card 3: Daily Field Rule & Gravitas Affirmation */}
        <div className={`p-6 sm:p-7 rounded-3xl border space-y-3 flex flex-col justify-between transition-all ${
          isDark 
            ? 'bg-[#222226] border-[#27272A] text-[#F4F4F5]' 
            : 'bg-white border-[#E2DDD4] text-[#18181B] shadow-2xs'
        }`}>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#C2410C] dark:text-[#FB923C] uppercase tracking-widest block">
              Daily Executive Affirmation
            </span>
            <p className={`text-sm font-serif italic leading-relaxed ${
              isDark ? 'text-white' : 'text-[#18181B]'
            }`}>
              "{dailyWorkout?.step4FieldMotivation.quote || currentField.dailyAffirmation}"
            </p>
          </div>

          <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
            isDark ? 'bg-[#18181B] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
          }`}>
            <span className="font-bold block text-[#C2410C] dark:text-[#FB923C] text-[10px] font-mono uppercase tracking-wider">
              Actionable Rule Today:
            </span>
            <p className={`text-[11px] leading-relaxed ${
              isDark ? 'text-[#D4D4D8]' : 'text-[#52525B]'
            }`}>
              {dailyWorkout?.step4FieldMotivation.actionableMicroHabitToday || 'Pause for 2 seconds before answering any question today.'}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Interactive Step-by-Step Skill Tracks Roadmap */}
      <StepSkillTrackRoadmap
        userProfile={userProfile}
        onLaunchNode={handleLaunchRoadmapNode}
        isDark={isDark}
      />

      {/* 5. Feature Shortcuts Bento Strip */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Vocal Articulation Plan */}
        <div
          onClick={() => onNavigateTab('articulation')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group space-y-2.5 ${
            isDark ? 'bg-[#18181B] border-[#27272A] hover:border-[#FB923C]' : 'bg-white border-[#E2DDD4] hover:border-[#C2410C] shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] border border-[#C2410C]/20">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-inherit text-[#C2410C] dark:text-[#FB923C]">
              6 Stages
            </span>
          </div>
          <h3 className="font-editorial-heading font-serif font-bold text-base group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors">
            Vocal Articulation
          </h3>
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
            Breath control, crisp consonants, and live speech evaluation.
          </p>
        </div>

        {/* AI Simulator Arena */}
        <div
          onClick={() => onNavigateTab('practice')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group space-y-2.5 ${
            isDark ? 'bg-[#18181B] border-[#27272A] hover:border-[#22C55E]' : 'bg-white border-[#E2DDD4] hover:border-[#15803D] shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#15803D]/10 text-[#15803D] dark:text-[#22C55E] border border-[#15803D]/20">
              <Mic2 className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-inherit text-[#15803D] dark:text-[#22C55E]">
              STAR & Pitch
            </span>
          </div>
          <h3 className="font-editorial-heading font-serif font-bold text-base group-hover:text-[#15803D] dark:group-hover:text-[#22C55E] transition-colors">
            AI Speech Arena
          </h3>
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
            Workplace crisis drills, pitch evaluation, and 60s challenges.
          </p>
        </div>

        {/* SEEK Engine */}
        <div
          onClick={() => onNavigateTab('seek')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group space-y-2.5 ${
            isDark ? 'bg-[#18181B] border-[#27272A] hover:border-[#60A5FA]' : 'bg-white border-[#E2DDD4] hover:border-[#1D4ED8] shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#1D4ED8]/10 text-[#1D4ED8] dark:text-[#60A5FA] border border-[#1D4ED8]/20">
              <Search className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-inherit text-[#1D4ED8] dark:text-[#60A5FA]">
              Audio & Models
            </span>
          </div>
          <h3 className="font-editorial-heading font-serif font-bold text-base group-hover:text-[#1D4ED8] dark:group-hover:text-[#60A5FA] transition-colors">
            SEEK Engine
          </h3>
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
            Curated blueprints from Carnegie, Chris Voss, and top coaches.
          </p>
        </div>

        {/* Lexicon Deck */}
        <div
          onClick={() => onNavigateTab('vocab')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group space-y-2.5 ${
            isDark ? 'bg-[#18181B] border-[#27272A] hover:border-[#A78BFA]' : 'bg-white border-[#E2DDD4] hover:border-[#4338CA] shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-[#4338CA]/10 text-[#4338CA] dark:text-[#A78BFA] border border-[#4338CA]/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-inherit text-[#4338CA] dark:text-[#A78BFA]">
              100+ Cards
            </span>
          </div>
          <h3 className="font-editorial-heading font-serif font-bold text-base group-hover:text-[#4338CA] dark:group-hover:text-[#A78BFA] transition-colors">
            Lexicon Vault
          </h3>
          <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
            Executive vocabulary, flashcards, and active retention quizzes.
          </p>
        </div>

      </div>

    </div>
  );
};
