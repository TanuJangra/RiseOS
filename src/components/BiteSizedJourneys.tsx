import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Brain, 
  Sparkle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Award,
  BookOpen,
  Layers,
  Zap,
  Play
} from 'lucide-react';
import { BiteSizedTrack, JourneyUnit, UserProfile } from '../types';
import { BITE_SIZED_TRACKS } from '../data/staticData';
import { EReaderCardDeck, EReaderCard } from './EReaderCardDeck';

interface BiteSizedJourneysProps {
  userProfile: UserProfile;
  onCompleteUnit: (unitId: string, xpEarned: number) => void;
  onOpenSimulatorWithScenario: (scenario: string, prompt: string) => void;
  theme?: 'light' | 'dark';
}

export const BiteSizedJourneys: React.FC<BiteSizedJourneysProps> = ({
  userProfile,
  onCompleteUnit,
  onOpenSimulatorWithScenario,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [selectedTrack, setSelectedTrack] = useState<BiteSizedTrack>(BITE_SIZED_TRACKS[0]);
  const [activeUnit, setActiveUnit] = useState<JourneyUnit | null>(null);

  // Convert JourneyUnit to EReaderCard array
  const getUnitCardDeck = (unit: JourneyUnit): EReaderCard[] => {
    return [
      {
        id: `${unit.id}-card-1`,
        tag: 'Core Principle',
        title: unit.title,
        frameworkPill: unit.mentalModel,
        body: unit.summary,
        actionTip: unit.actionPrompt
      },
      {
        id: `${unit.id}-card-2`,
        tag: 'Tactical Rules',
        title: `${unit.mentalModel} Execution`,
        body: 'Apply these structured rules in your next communication or pitch:',
        bulletPoints: unit.keyPrinciples,
        actionTip: 'Master 1 principle at a time in real meetings.'
      },
      {
        id: `${unit.id}-card-3`,
        tag: 'Desi Intuition',
        title: 'Real-World Indian Workplace Context',
        body: 'How this mental model translates seamlessly to daily communication:',
        hinglishInsight: unit.hinglishTakeaway,
        actionTip: 'Use this framework before replying to senior leaders or clients.'
      },
      {
        id: `${unit.id}-card-4`,
        tag: 'Retention Check',
        title: '30-Second Mastery Check',
        body: 'Verify your understanding of this cognitive model:',
        quiz: {
          question: unit.quizQuestion.question,
          options: unit.quizQuestion.options,
          correctIndex: unit.quizQuestion.correctIndex,
          explanation: unit.quizQuestion.explanation
        },
        actionTip: unit.actionPrompt
      }
    ];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'charisma':
        return <Sparkles className="w-4 h-4 text-[#C2410C] dark:text-[#FB923C]" />;
      case 'intelligence':
        return <Brain className="w-4 h-4 text-[#1D4ED8] dark:text-[#60A5FA]" />;
      case 'memory':
        return <Sparkle className="w-4 h-4 text-[#15803D] dark:text-[#22C55E]" />;
      case 'decision_making':
        return <ShieldCheck className="w-4 h-4 text-[#7E22CE] dark:text-[#A78BFA]" />;
      default:
        return <Compass className="w-4 h-4 text-[#C2410C]" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-2 border-b pb-6 border-inherit">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border bg-[#C2410C]/10 text-[#C2410C] dark:text-[#FB923C] border-[#C2410C]/20">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Skill Tracks</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-editorial-heading font-serif font-bold tracking-tight">
          Bite-Sized Skill Tracks
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA] max-w-3xl leading-relaxed">
          Short, 4-minute structured micro-card decks designed to sharpen mental models, charisma, and executive communication without cognitive fatigue.
        </p>
      </div>

      {/* Track Category Selectors */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BITE_SIZED_TRACKS.map((track) => {
          const isSelected = selectedTrack.id === track.id;
          const completedCount = track.units.filter((u) => userProfile.completedJourneyUnitIds.includes(u.id)).length;
          const progressPercent = Math.round((completedCount / track.units.length) * 100);

          return (
            <button
              key={track.id}
              onClick={() => {
                setSelectedTrack(track);
                setActiveUnit(null);
              }}
              className={`p-5 rounded-2xl text-left border transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? (isDark ? 'bg-[#222226] border-[#FB923C] shadow-xs' : 'bg-white border-[#18181B] shadow-2xs')
                  : (isDark ? 'bg-[#18181B] border-[#27272A] hover:border-[#3F3F46]' : 'bg-white border-[#E2DDD4] hover:border-[#64748B]')
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl border ${
                  isDark ? 'bg-[#18181B] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
                }`}>
                  {getCategoryIcon(track.category)}
                </div>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isDark ? 'bg-[#18181B] border-[#27272A] text-[#A1A1AA]' : 'bg-[#FAF8F5] border-[#E2DDD4] text-[#18181B]'
                }`}>
                  {track.badge}
                </span>
              </div>

              <h3 className="font-editorial-heading font-serif font-bold text-base mb-1 line-clamp-1">
                {track.title}
              </h3>
              <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] line-clamp-2 mb-3 leading-relaxed">
                {track.subtitle}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#A1A1AA]">
                  <span>Progress</span>
                  <span className="font-bold text-inherit">{progressPercent}%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isDark ? 'bg-[#27272A]' : 'bg-[#EDE9E0]'
                }`}>
                  <div 
                    className="h-full bg-[#C2410C] dark:bg-[#FB923C] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE UNIT IN E-READER CARD DECK MODE */}
      {activeUnit ? (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveUnit(null)}
              className="text-xs font-bold text-[#C2410C] dark:text-[#FB923C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to {selectedTrack.title} units
            </button>
          </div>

          <EReaderCardDeck
            cards={getUnitCardDeck(activeUnit)}
            deckTitle={activeUnit.title}
            categoryBadge={activeUnit.mentalModel}
            onCompleteDeck={(xp) => onCompleteUnit(activeUnit.id, xp)}
            onClose={() => setActiveUnit(null)}
            isDark={isDark}
          />
        </div>
      ) : (
        /* Selected Track Details & Unit List */
        <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 transition-all ${
          isDark ? 'bg-[#18181B] border-[#27272A]' : 'bg-white border-[#E2DDD4] shadow-2xs'
        }`}>
          <div className="border-b pb-4 flex flex-wrap items-center justify-between gap-2 border-inherit">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#C2410C] dark:text-[#FB923C] uppercase tracking-widest block">
                Active Track
              </span>
              <h2 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold">
                {selectedTrack.title}
              </h2>
            </div>
            <span className={`text-xs font-mono font-semibold px-3.5 py-1 rounded-full border ${
              isDark ? 'bg-[#222226] border-[#27272A] text-[#A1A1AA]' : 'bg-[#FAF8F5] border-[#E2DDD4] text-[#52525B]'
            }`}>
              {selectedTrack.units.length} Bite-Sized Decks (4 min each)
            </span>
          </div>

          {/* Unit Cards */}
          <div className="grid gap-3.5">
            {selectedTrack.units.map((unit, index) => {
              const isCompleted = userProfile.completedJourneyUnitIds.includes(unit.id);

              return (
                <div
                  key={unit.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                    isDark 
                      ? 'bg-[#222226] border-[#27272A] hover:border-[#FB923C]' 
                      : 'bg-[#FAF8F5] border-[#E2DDD4] hover:border-[#18181B] hover:bg-white'
                  }`}
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-inherit border border-inherit flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                        {index + 1}
                      </span>
                      <h3 className="font-editorial-heading font-serif font-bold text-base sm:text-lg group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors">
                        {unit.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#52525B] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
                      {unit.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#64748B] dark:text-[#A1A1AA] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-inherit" />
                        <span>{unit.durationMinutes} mins</span>
                      </span>
                      <span>•</span>
                      <span className="text-inherit font-semibold">
                        Framework: {unit.mentalModel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isCompleted && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono border bg-[#15803D]/10 text-[#15803D] dark:text-[#22C55E] border-[#15803D]/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mastered</span>
                      </span>
                    )}

                    <button
                      onClick={() => setActiveUnit(unit)}
                      className="px-5 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isCompleted ? 'Review Deck' : 'Open Reader Deck'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
