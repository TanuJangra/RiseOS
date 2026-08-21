import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Type, 
  Sparkles, 
  Check, 
  HelpCircle, 
  RotateCw, 
  Bookmark, 
  BookmarkCheck,
  Maximize2,
  X,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText, stopSpeaking } from '../utils/speechUtils';

export interface EReaderCard {
  id: string;
  tag: string;
  title: string;
  subtitle?: string;
  body: string;
  bulletPoints?: string[];
  hinglishInsight?: string;
  frameworkPill?: string;
  actionTip?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

interface EReaderCardDeckProps {
  cards: EReaderCard[];
  deckTitle: string;
  categoryBadge?: string;
  onCompleteDeck?: (xpEarned: number) => void;
  onClose?: () => void;
  isDark?: boolean;
}

export const EReaderCardDeck: React.FC<EReaderCardDeckProps> = ({
  cards,
  deckTitle,
  categoryBadge = 'Micro-Lesson',
  onCompleteDeck,
  onClose,
  isDark = false
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [savedCards, setSavedCards] = useState<string[]>([]);
  
  // Card Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [completedCards, setCompletedCards] = useState<string[]>([]);

  const currentCard = cards[currentIndex] || cards[0];
  const totalCards = cards.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalCards) * 100);

  const handleNext = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setSelectedOption(null);
    setQuizSubmitted(false);

    if (!completedCards.includes(currentCard.id)) {
      setCompletedCards((prev) => [...prev, currentCard.id]);
    }

    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all cards!
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onCompleteDeck) onCompleteDeck(40);
    }
  };

  const handlePrev = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const toggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const textToSpeak = `${currentCard.title}. ${currentCard.body}. ${currentCard.bulletPoints ? currentCard.bulletPoints.join('. ') : ''}`;
      speakText(textToSpeak);
      setIsSpeaking(true);
    }
  };

  const toggleBookmark = (id: string) => {
    setSavedCards((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuizAnswer = (optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedOption(optIndex);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null || !currentCard.quiz) return;
    setQuizSubmitted(true);
    if (selectedOption === currentCard.quiz.correctIndex) {
      confetti({ particleCount: 40, spread: 45 });
      if (onCompleteDeck) onCompleteDeck(25);
    }
  };

  // Typography font class
  const getFontClass = () => {
    switch (fontFamily) {
      case 'serif': return 'font-editorial-heading font-serif';
      case 'sans': return 'font-editorial-sans';
      case 'mono': return 'font-editorial-mono';
      default: return 'font-editorial-heading font-serif';
    }
  };

  const getBodySizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs sm:text-sm leading-relaxed';
      case 'base': return 'text-sm sm:text-base leading-relaxed';
      case 'lg': return 'text-base sm:text-lg leading-relaxed';
      case 'xl': return 'text-lg sm:text-xl leading-relaxed';
    }
  };

  return (
    <div className={`w-full rounded-3xl border shadow-xl flex flex-col overflow-hidden transition-all ${
      isDark 
        ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' 
        : 'bg-[#FAF8F5] border-[#E2DDD4] text-[#18181B]'
    }`}>
      
      {/* Top E-Reader Control Bar */}
      <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-3 text-xs font-semibold ${
        isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#F5F2EB] border-[#E2DDD4]'
      }`}>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-inherit border text-[10px] uppercase font-bold tracking-wider font-mono border-inherit">
            {categoryBadge}
          </span>
          <span className="truncate max-w-[150px] sm:max-w-[240px] font-bold">
            {deckTitle}
          </span>
        </div>

        {/* E-Reader Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Font Family Switcher */}
          <div className="flex items-center rounded-lg border p-0.5 border-inherit">
            <button
              onClick={() => setFontFamily('serif')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-serif cursor-pointer ${
                fontFamily === 'serif' ? (isDark ? 'bg-[#27272A] font-bold' : 'bg-white font-bold shadow-xs') : 'opacity-60'
              }`}
              title="Serif font (Kindle style)"
            >
              Aa
            </button>
            <button
              onClick={() => setFontFamily('sans')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-sans cursor-pointer ${
                fontFamily === 'sans' ? (isDark ? 'bg-[#27272A] font-bold' : 'bg-white font-bold shadow-xs') : 'opacity-60'
              }`}
              title="Sans-serif font"
            >
              Aa
            </button>
            <button
              onClick={() => setFontFamily('mono')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                fontFamily === 'mono' ? (isDark ? 'bg-[#27272A] font-bold' : 'bg-white font-bold shadow-xs') : 'opacity-60'
              }`}
              title="Monospace font"
            >
              Aa
            </button>
          </div>

          {/* Font Size (A- / A+) */}
          <div className="flex items-center rounded-lg border p-0.5 border-inherit">
            <button
              onClick={() => {
                if (fontSize === 'xl') setFontSize('lg');
                else if (fontSize === 'lg') setFontSize('base');
                else if (fontSize === 'base') setFontSize('sm');
              }}
              disabled={fontSize === 'sm'}
              className="px-1.5 py-0.5 text-[10px] font-bold disabled:opacity-30 cursor-pointer"
              title="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => {
                if (fontSize === 'sm') setFontSize('base');
                else if (fontSize === 'base') setFontSize('lg');
                else if (fontSize === 'lg') setFontSize('xl');
              }}
              disabled={fontSize === 'xl'}
              className="px-1.5 py-0.5 text-[12px] font-bold disabled:opacity-30 cursor-pointer"
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* Audio TTS */}
          <button
            onClick={toggleSpeak}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isSpeaking 
                ? 'bg-[#C2410C] text-white border-[#C2410C]' 
                : 'border-inherit hover:bg-inherit/80'
            }`}
            title={isSpeaking ? 'Mute' : 'Listen aloud'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(currentCard.id)}
            className="p-1.5 rounded-lg border border-inherit hover:bg-inherit/80 transition-colors cursor-pointer"
            title="Save card to notebook"
          >
            {savedCards.includes(currentCard.id) ? (
              <BookmarkCheck className="w-3.5 h-3.5 text-[#C2410C]" />
            ) : (
              <Bookmark className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>

          {/* Close button if provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-inherit hover:bg-inherit/80 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Card Body - E-Reader Style */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-[360px]">
        <div className="space-y-4">
          
          {/* Card Header & Tag */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-[#C2410C] dark:text-[#FB923C]">
              {currentCard.tag || `Insight ${currentIndex + 1}`}
            </span>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
              Card {currentIndex + 1} of {totalCards}
            </span>
          </div>

          {/* Card Title */}
          <h2 className={`${getFontClass()} text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-inherit`}>
            {currentCard.title}
          </h2>

          {/* Framework pill */}
          {currentCard.frameworkPill && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-[#4F46E5]/10 text-[#4F46E5] dark:text-[#818CF8] border border-[#4F46E5]/20">
              <Sparkles className="w-3 h-3" />
              <span>{currentCard.frameworkPill}</span>
            </div>
          )}

          {/* Body Paragraph */}
          <p className={`${getBodySizeClass()} text-[#3F3F46] dark:text-[#D4D4D8] leading-relaxed`}>
            {currentCard.body}
          </p>

          {/* Bite-Sized Bullet Points */}
          {currentCard.bulletPoints && currentCard.bulletPoints.length > 0 && (
            <div className="space-y-2 pt-1">
              {currentCard.bulletPoints.map((point, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm ${
                    isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-white border-[#E2DDD4]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-[#18181B] dark:bg-[#F4F4F5] text-white dark:text-[#18181B] flex items-center justify-center text-[10px] font-bold shrink-0 font-mono mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-inherit leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          )}

          {/* Hinglish Intuition Box */}
          {currentCard.hinglishInsight && (
            <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm italic ${
              isDark ? 'bg-[#222226] border-[#27272A] text-[#E4E4E7]' : 'bg-[#F5F2EB] border-[#E2DDD4] text-[#18181B]'
            }`}>
              <strong className="not-italic font-bold block text-[10px] uppercase font-mono tracking-wider text-[#C2410C] dark:text-[#FB923C] mb-1">
                Desi Intuition (Hinglish):
              </strong>
              "{currentCard.hinglishInsight}"
            </div>
          )}

          {/* Card Quiz (if any) */}
          {currentCard.quiz && (
            <div className={`p-4 sm:p-5 rounded-2xl border mt-3 space-y-3 ${
              isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-white border-[#E4E0D7]'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#6366F1] dark:text-[#818CF8]">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>30-SECOND RETENTION CHECK</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold">
                {currentCard.quiz.question}
              </p>

              <div className="space-y-1.5">
                {currentCard.quiz.options.map((option, optIdx) => {
                  let optStyle = isDark 
                    ? 'bg-[#18181B] border-[#27272A] hover:border-[#3F3F46]' 
                    : 'bg-[#FAF8F5] border-[#E4E0D7] hover:border-[#A1A1AA]';

                  if (quizSubmitted) {
                    if (optIdx === currentCard.quiz?.correctIndex) {
                      optStyle = 'bg-[#16A34A]/20 border-[#16A34A] text-[#16A34A] dark:text-[#22C55E] font-bold';
                    } else if (selectedOption === optIdx) {
                      optStyle = 'bg-[#DC2626]/20 border-[#DC2626] text-[#DC2626] line-through';
                    }
                  } else if (selectedOption === optIdx) {
                    optStyle = isDark ? 'bg-[#27272A] border-[#FB923C] font-bold' : 'bg-white border-[#EA580C] font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={quizSubmitted}
                      onClick={() => handleQuizAnswer(optIdx)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && optIdx === currentCard.quiz?.correctIndex && (
                        <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={selectedOption === null}
                    className="px-4 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Verify Answer
                  </button>
                </div>
              ) : (
                <div className="pt-2 text-xs text-[#71717A] dark:text-[#A1A1AA] border-t border-inherit">
                  <strong>Insight:</strong> {currentCard.quiz.explanation}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Action Tip footer */}
        {currentCard.actionTip && (
          <div className="mt-4 pt-3 border-t border-inherit flex items-center gap-2 text-xs font-medium text-[#71717A] dark:text-[#A1A1AA]">
            <Sparkles className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            <span><strong>Today's Micro-Rule:</strong> {currentCard.actionTip}</span>
          </div>
        )}
      </div>

      {/* Bottom Pagination & Progress Bar */}
      <div className={`px-6 py-4 border-t flex items-center justify-between gap-4 ${
        isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#F5F2EB] border-[#E4E0D7]'
      }`}>
        
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            currentIndex === 0 
              ? 'opacity-30 border-transparent' 
              : 'border-inherit hover:bg-inherit/80'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Progress Bar & Dots */}
        <div className="flex-1 max-w-xs flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            {cards.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-6 bg-[#EA580C] dark:bg-[#FB923C]' 
                    : idx < currentIndex 
                    ? 'w-2 bg-[#16A34A] dark:bg-[#22C55E]' 
                    : 'w-2 bg-[#D4D4D8] dark:bg-[#3F3F46]'
                }`}
                title={`Jump to Card ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#71717A] dark:text-[#A1A1AA]">
            {progressPercent}% completed
          </span>
        </div>

        {/* Next / Complete Button */}
        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <span>{currentIndex === totalCards - 1 ? 'Finish & Claim XP' : 'Next Card'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
