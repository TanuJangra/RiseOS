import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { VOCABULARY_POWER_BANK } from '../data/staticData';
import { speakText } from '../utils/speechUtils';

interface VocabMasterBankProps {
  userProfile: UserProfile;
  onToggleSaveVocab: (wordId: string) => void;
  onAwardXP: (xp: number) => void;
  theme?: 'light' | 'dark';
}

export const VocabMasterBank: React.FC<VocabMasterBankProps> = ({
  userProfile,
  onToggleSaveVocab,
  onAwardXP,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'flashcards' | 'quiz'>('grid');

  // Flashcard Mode state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Quiz Mode state
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [quizAnswerSubmitted, setQuizAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const categories = [
    { id: 'all', label: 'All Words' },
    { id: 'executive', label: 'Executive & Strategy' },
    { id: 'charisma', label: 'Charisma & Gravitas' },
    { id: 'clarity', label: 'Articulation & Clarity' },
    { id: 'precision', label: 'Precision & Thinking' },
    { id: 'persuasion', label: 'Persuasion & Sales' }
  ];

  const filteredWords = VOCABULARY_POWER_BANK.filter((item) => {
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hinglishMeaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const activeFlashcard = filteredWords[currentFlashcardIndex] || filteredWords[0];

  // Quiz Generation
  const activeQuizWord = VOCABULARY_POWER_BANK[quizQuestionIndex % VOCABULARY_POWER_BANK.length];
  // Generate 4 randomized options (1 correct, 3 wrong)
  const wrongOptions = VOCABULARY_POWER_BANK
    .filter((w) => w.id !== activeQuizWord.id)
    .slice(0, 3)
    .map((w) => w.meaning);
  const quizOptions = [activeQuizWord.meaning, ...wrongOptions].sort(() => Math.sin(quizQuestionIndex + 1));

  const handleQuizAnswer = (option: string) => {
    if (quizAnswerSubmitted) return;
    setSelectedQuizAnswer(option);
    setQuizAnswerSubmitted(true);

    if (option === activeQuizWord.meaning) {
      setQuizScore((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });
      onAwardXP(20);
    }
  };

  const nextQuizQuestion = () => {
    setQuizQuestionIndex((prev) => prev + 1);
    setSelectedQuizAnswer(null);
    setQuizAnswerSubmitted(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200 font-editorial-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DDD4] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2EB] text-[#C2410C] text-[10px] font-bold uppercase tracking-[0.15em] border border-[#E2DDD4]">
            <BookOpen className="w-3 h-3 text-[#C2410C]" />
            <span>Power Vocabulary Bank</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-editorial-heading font-serif font-bold text-[#18181B] tracking-tight">
            Executive Lexicon Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] max-w-2xl leading-relaxed">
            Elevate everyday conversation. Replace plain words with precise, high-conviction diction to command presence in meetings and interviews.
          </p>
        </div>

        {/* View Mode Switches */}
        <div className="flex items-center gap-1 p-1 bg-[#F5F2EB] rounded-full border border-[#E2DDD4]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#18181B] text-white shadow-2xs' : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            Word Vault
          </button>
          <button
            onClick={() => {
              setViewMode('flashcards');
              setIsFlipped(false);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'flashcards' ? 'bg-[#18181B] text-white shadow-2xs' : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setViewMode('quiz')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'quiz' ? 'bg-[#18181B] text-white shadow-2xs' : 'text-[#52525B] hover:text-[#18181B]'
            }`}
          >
            Retention Quiz
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      {viewMode === 'grid' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by word, English meaning, or Hinglish concept..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2DDD4] rounded-xl text-sm text-[#18181B] placeholder-[#64748B] focus:outline-none focus:border-[#18181B] shadow-2xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#18181B] text-white font-bold'
                    : 'bg-white text-[#52525B] border border-[#E2DDD4] hover:text-[#18181B] hover:bg-[#F5F2EB]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 1: WORD GRID */}
      {viewMode === 'grid' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((item) => {
            const isSaved = userProfile.savedVocabIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white border border-[#E5E2DC] hover:border-[#1A1A1A] hover:shadow-sm transition-all space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between border-b border-[#F0ECE4] pb-2.5">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-xl font-editorial-heading font-serif font-bold text-[#1A1A1A]">
                          {item.word}
                        </h3>
                        <span className="text-xs text-[#8C877E] font-mono">
                          {item.phonetic}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#5E35B1] uppercase tracking-wider">
                        {item.partOfSpeech}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(`${item.word}. ${item.meaning}`)}
                        className="p-1.5 rounded-lg text-[#8C877E] hover:text-[#1A1A1A] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4 text-[#5E35B1]" />
                      </button>
                      <button
                        onClick={() => onToggleSaveVocab(item.id)}
                        className="p-1.5 rounded-lg text-[#8C877E] hover:text-[#C85A32] hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                        title="Bookmark"
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 text-[#C85A32] fill-[#C85A32]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed font-medium">
                    {item.meaning}
                  </p>

                  <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#EAE5DB] text-xs text-[#3E3A34]">
                    <span className="text-[9px] font-bold uppercase text-[#5E35B1] block mb-0.5 tracking-wider">
                      Hinglish Intuition:
                    </span>
                    <p className="italic">{item.hinglishMeaning}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#F0ECE4] text-xs">
                  <p className="text-[#6B6862] font-serif italic">
                    "{item.exampleSentence}"
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {item.synonyms.map((syn, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#F5F2EB] text-[#6B6862] text-[10px] font-medium border border-[#EAE5DB]"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: FLASHCARDS MODE */}
      {viewMode === 'flashcards' && activeFlashcard && (
        <div className="max-w-xl mx-auto space-y-6 text-center animate-in zoom-in-95">
          <div className="flex items-center justify-between text-xs font-semibold text-[#8C877E]">
            <span>Card {currentFlashcardIndex + 1} of {filteredWords.length}</span>
            <span>Click card to flip</span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[340px] p-8 rounded-3xl bg-[#1A1A1A] text-[#FAF9F6] border border-[#2D2A26] shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.01] relative overflow-hidden"
          >
            {!isFlipped ? (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C85A32]">
                  {activeFlashcard.partOfSpeech} • {activeFlashcard.category}
                </span>
                <h2 className="text-4xl sm:text-5xl font-editorial-heading font-serif font-bold tracking-tight text-[#FAF9F6]">
                  {activeFlashcard.word}
                </h2>
                <p className="text-sm font-mono text-[#A6A29A]">
                  {activeFlashcard.phonetic}
                </p>
                <div className="pt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2A2723] text-[#C4C0B6] text-xs border border-[#3E3A34]">
                  <RotateCw className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>Tap to reveal meaning & example</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C85A32] block text-center">
                  Meaning & Application
                </span>
                <p className="text-base sm:text-lg font-serif italic text-[#FAF9F6] leading-relaxed text-center">
                  "{activeFlashcard.meaning}"
                </p>
                <div className="p-3 bg-[#24211D] rounded-xl border border-[#38342E] text-xs text-[#C4C0B6]">
                  <strong className="text-[#FAF9F6]">Hinglish Sense:</strong> {activeFlashcard.hinglishMeaning}
                </div>
                <div className="p-3 bg-[#24211D] rounded-xl border border-[#38342E] text-xs text-[#A6A29A] italic">
                  <strong className="text-[#FAF9F6]">Context:</strong> "{activeFlashcard.exampleSentence}"
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredWords.length - 1));
                setIsFlipped(false);
              }}
              className="px-5 py-2.5 rounded-full bg-white border border-[#E5E2DC] hover:bg-[#F5F2EB] text-[#1A1A1A] text-xs font-bold transition-colors cursor-pointer"
            >
              Previous Card
            </button>
            <button
              onClick={() => speakText(`${activeFlashcard.word}. ${activeFlashcard.meaning}`)}
              className="p-3 rounded-full bg-[#1A1A1A] text-[#FAF9F6] font-bold hover:bg-black transition-colors shadow-sm cursor-pointer"
              title="Pronounce"
            >
              <Volume2 className="w-4 h-4 text-[#C85A32]" />
            </button>
            <button
              onClick={() => {
                setCurrentFlashcardIndex((prev) => (prev < filteredWords.length - 1 ? prev + 1 : 0));
                setIsFlipped(false);
              }}
              className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] text-xs font-bold transition-colors cursor-pointer"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: RETENTION QUIZ */}
      {viewMode === 'quiz' && (
        <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95">
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5E2DC] shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0ECE4] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5E35B1]">
                Word Retention Challenge
              </span>
              <span className="text-xs font-bold text-[#C85A32] bg-[#FDF4F0] px-3 py-1 rounded-full border border-[#FADCD1]">
                Score: {quizScore} Correct
              </span>
            </div>

            <div className="space-y-2 text-center">
              <span className="text-xs text-[#8C877E] uppercase">Select the matching definition for:</span>
              <h3 className="text-3xl font-editorial-heading font-serif font-bold text-[#1A1A1A] tracking-tight">
                {activeQuizWord.word}
              </h3>
              <p className="text-xs font-mono text-[#8C877E]">{activeQuizWord.phonetic}</p>
            </div>

            <div className="space-y-2.5">
              {quizOptions.map((opt, idx) => {
                let btnStyle = 'bg-[#FAF9F6] border-[#E5E2DC] text-[#1A1A1A] hover:border-[#1A1A1A]';

                if (quizAnswerSubmitted) {
                  if (opt === activeQuizWord.meaning) {
                    btnStyle = 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32] font-bold';
                  } else if (selectedQuizAnswer === opt) {
                    btnStyle = 'bg-[#FFEBEE] border-[#C62828] text-[#C62828] line-through';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizAnswerSubmitted}
                    onClick={() => handleQuizAnswer(opt)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quizAnswerSubmitted && opt === activeQuizWord.meaning && (
                      <Check className="w-4 h-4 text-[#2E7D32] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizAnswerSubmitted && (
              <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                <span className="text-xs text-[#6B6862] italic">
                  Hinglish Sense: "{activeQuizWord.hinglishMeaning}"
                </span>
                <button
                  onClick={nextQuizQuestion}
                  className="px-5 py-2 bg-[#1A1A1A] text-[#FAF9F6] text-xs font-bold rounded-full hover:bg-black transition-colors cursor-pointer"
                >
                  Next Word Challenge →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
