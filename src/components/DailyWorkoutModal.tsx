import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  Mic, 
  MicOff, 
  Sparkles, 
  Flame, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  Award,
  Lightbulb,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyWorkout, PracticeEvaluation, UserProfile } from '../types';
import { speakText, stopSpeaking } from '../utils/speechUtils';

interface DailyWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyWorkout: DailyWorkout | null;
  isLoadingWorkout: boolean;
  onRefreshWorkout: () => void;
  userProfile: UserProfile;
  onCompleteWorkout: (minutes: number, xp: number, newVocabWord: string) => void;
}

export const DailyWorkoutModal: React.FC<DailyWorkoutModalProps> = ({
  isOpen,
  onClose,
  dailyWorkout,
  isLoadingWorkout,
  onRefreshWorkout,
  userProfile,
  onCompleteWorkout,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [timerSeconds, setTimerSeconds] = useState<number>(900); // 15 mins total
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Step 1 State: User's Vocab sentence practice
  const [vocabSentenceInput, setVocabSentenceInput] = useState<string>('');
  const [vocabSentenceSubmitted, setVocabSentenceSubmitted] = useState<boolean>(false);

  // Step 3 State: Simulator Speech/Text
  const [userSpeechInput, setUserSpeechInput] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<PracticeEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Step 4 State: Completed
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (isOpen && isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isTimerRunning, timerSeconds]);

  // Cleanup speech on modal close
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Web Speech API Voice Dictation
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your response in the box below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = userProfile.languagePreference === 'hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
        setUserSpeechInput(finalTranscript.trim());
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // Evaluate user's simulator response via API
  const handleEvaluateResponse = async () => {
    if (!userSpeechInput.trim()) {
      setEvalError('Please speak or type your response before requesting AI evaluation.');
      return;
    }

    setEvalError(null);
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/gemini/evaluate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: dailyWorkout?.step3PracticeScenario.scenarioTitle,
          prompt: dailyWorkout?.step3PracticeScenario.theChallengePrompt,
          userResponse: userSpeechInput,
          field: userProfile.field,
          targetSkills: 'Clarity, Confidence, Executive Vocabulary, Structure'
        })
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate response');
      }

      const data = await res.json();
      setEvaluationResult(data);
    } catch (err: any) {
      console.error('Evaluation error:', err);
      setEvalError('Could not connect to AI evaluation. Please check your connection or retry.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Trigger celebration upon finishing Step 4
  const handleCompleteAll = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsFinished(true);
    const vocabWord = dailyWorkout?.step1Vocab.word || 'Articulate';
    onCompleteWorkout(15, 100, vocabWord);
  };

  const stepTitles = [
    { step: 1, title: 'Power Vocab', mins: '3m' },
    { step: 2, title: 'Mental Model', mins: '4m' },
    { step: 3, title: 'AI Simulator', mins: '6m' },
    { step: 4, title: 'Field Focus', mins: '2m' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#18181B]/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 font-editorial-sans">
      <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E2DDD4] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#18181B]">
        
        {/* Header with 15-Min Timer & Stepper */}
        <div className="px-5 sm:px-8 py-4 border-b border-[#E2DDD4] bg-[#F5F2EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#18181B] text-[#FAF8F5] flex items-center justify-center font-bold text-xs">
              15m
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-editorial-heading font-serif font-bold text-[#18181B]">
                  {dailyWorkout?.dailyTheme || "Today's 15-Minute Mastery"}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#EDE9E0] text-[#4338CA] rounded-full border border-[#E2DDD4]">
                  Day {dailyWorkout?.dayNumber || 1}
                </span>
              </div>
              <p className="text-xs text-[#52525B] hidden sm:block">
                Tailored for {userProfile.field.toUpperCase()} communication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Countdown Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2DDD4] rounded-full text-[#18181B] font-mono text-xs font-semibold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>{formatTime(timerSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#18181B] rounded-full hover:bg-[#EAE5DB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-5 sm:px-8 py-2.5 bg-[#FAF8F5] border-b border-[#E2DDD4] flex items-center justify-between gap-2 overflow-x-auto">
          {stepTitles.map((st) => (
            <button
              key={st.step}
              onClick={() => setCurrentStep(st.step)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentStep === st.step
                  ? 'bg-[#18181B] text-[#FAF8F5] shadow-2xs'
                  : currentStep > st.step
                  ? 'bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]'
                  : 'text-[#52525B] hover:text-[#18181B]'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] border border-current">
                {currentStep > st.step ? '✓' : st.step}
              </span>
              <span>{st.title}</span>
              <span className="opacity-75 text-[10px]">({st.mins})</span>
            </button>
          ))}
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-[#FAF8F5]">
          
          {isLoadingWorkout && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-[#C2410C] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#52525B] font-medium font-editorial-sans text-sm">Synthesizing personalized 15-minute curriculum with Gemini AI...</p>
            </div>
          )}

          {!isLoadingWorkout && dailyWorkout && !isFinished && (
            <>
              {/* STEP 1: WORD OF THE DAY & VOCABULARY DRILL (3 mins) */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C2410C] block mb-1">
                        Step 1 of 4 • 3 Minutes
                      </span>
                      <h3 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                        Power Vocabulary Booster
                      </h3>
                      <p className="text-xs sm:text-sm text-[#52525B]">
                        Master 1 high-impact word every day to articulate thoughts with executive sharpness.
                      </p>
                    </div>

                    <button
                      onClick={() => speakText(`${dailyWorkout.step1Vocab.word}. ${dailyWorkout.step1Vocab.meaning}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#18181B] border border-[#E2DDD4] text-xs font-semibold hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-4 h-4 text-[#C2410C]" />
                      <span>Audio Pronounce</span>
                    </button>
                  </div>

                  {/* Word Card */}
                  <div className="p-6 rounded-2xl bg-white border border-[#E2DDD4] space-y-4 shadow-2xs">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EDE9E0] pb-3">
                      <div className="flex items-baseline gap-3">
                        <h4 className="text-2xl sm:text-3xl font-editorial-heading font-serif font-bold text-[#18181B] tracking-tight">
                          {dailyWorkout.step1Vocab.word}
                        </h4>
                        <span className="text-xs font-mono text-[#64748B]">
                          {dailyWorkout.step1Vocab.phonetic}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs bg-[#F5F2EB] text-[#4338CA] font-medium rounded-full border border-[#EDE9E0]">
                          {dailyWorkout.step1Vocab.partOfSpeech}
                        </span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Meaning (English)</span>
                        <p className="text-[#18181B] font-medium leading-relaxed">
                          {dailyWorkout.step1Vocab.meaning}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider">Hinglish / Intuitive Sense</span>
                        <p className="text-[#52525B] font-medium leading-relaxed">
                          {dailyWorkout.step1Vocab.hinglishExplanation}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#F5F2EB] rounded-xl border border-[#EDE9E0] text-xs sm:text-sm">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1 tracking-wider">
                        Real-World Workplace Example:
                      </span>
                      <p className="text-[#18181B] font-serif italic">
                        "{dailyWorkout.step1Vocab.exampleSentence}"
                      </p>
                    </div>
                  </div>

                  {/* Interactive Micro-Drill */}
                  <div className="p-5 bg-white rounded-2xl border border-[#E2DDD4] space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2 text-[#18181B] font-bold text-sm">
                      <Lightbulb className="w-4 h-4 text-[#C2410C]" />
                      <span>30-Second Challenge: Use "{dailyWorkout.step1Vocab.word}" in a sentence</span>
                    </div>
                    <p className="text-xs text-[#52525B]">
                      {dailyWorkout.step1Vocab.practiceSentencePrompt}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={vocabSentenceInput}
                        onChange={(e) => setVocabSentenceInput(e.target.value)}
                        placeholder={`Type a sentence using "${dailyWorkout.step1Vocab.word}"...`}
                        className="flex-1 px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl text-sm text-[#18181B] focus:outline-none focus:border-[#18181B]"
                      />
                      <button
                        onClick={() => {
                          if (vocabSentenceInput.trim()) {
                            setVocabSentenceSubmitted(true);
                          }
                        }}
                        disabled={!vocabSentenceInput.trim()}
                        className="px-5 py-2.5 bg-[#18181B] text-[#FAF8F5] rounded-xl text-xs font-bold hover:bg-black disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        {vocabSentenceSubmitted ? 'Applied ✓' : 'Test Sentence'}
                      </button>
                    </div>

                    {vocabSentenceSubmitted && (
                      <div className="flex items-center gap-2 text-xs text-[#15803D] bg-[#F0FDF4] border border-[#DCFCE7] p-3 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                        <span>
                          Sentence recorded! Actively constructing sentences locks this word into your long-term spoken vocabulary bank.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: MENTAL MODEL BITE-SIZED JOURNEY (4 mins) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1D4ED8] block mb-1">
                        Step 2 of 4 • 4 Minutes
                      </span>
                      <h3 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                        {dailyWorkout.step2JourneyLesson.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#52525B]">
                        Bite-Sized Track: {dailyWorkout.step2JourneyLesson.category}
                      </p>
                    </div>

                    <button
                      onClick={() => speakText(`${dailyWorkout.step2JourneyLesson.title}. ${dailyWorkout.step2JourneyLesson.coreConcept}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#18181B] border border-[#E2DDD4] text-xs font-semibold hover:bg-[#F5F2EB] transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#1D4ED8]" />
                      <span>Listen Lesson</span>
                    </button>
                  </div>

                  {/* Mental Model Card */}
                  <div className="p-6 bg-white text-[#18181B] rounded-2xl space-y-4 shadow-sm border border-[#E2DDD4]">
                    <div className="flex items-center justify-between border-b border-[#EDE9E0] pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C2410C]" />
                        <span className="text-[10px] font-bold tracking-wider text-[#18181B] uppercase">
                          Framework: {dailyWorkout.step2JourneyLesson.mentalModelName}
                        </span>
                      </div>
                      <span className="text-xs text-[#64748B]">
                        {dailyWorkout.step2JourneyLesson.expertCitation}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-[#18181B] leading-relaxed font-serif">
                      {dailyWorkout.step2JourneyLesson.coreConcept}
                    </p>

                    <div className="pt-2 space-y-2">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Actionable Rules to Apply:
                      </span>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {dailyWorkout.step2JourneyLesson.bulletTakeaways.map((bullet, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 bg-[#F5F2EB] p-3.5 rounded-xl border border-[#EDE9E0] text-xs text-[#18181B]">
                            <span className="w-4 h-4 rounded-full bg-[#18181B] text-[#FAF8F5] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: INTERACTIVE PRACTICE & AI SIMULATOR (6 mins) */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#15803D] block mb-1">
                      Step 3 of 4 • 6 Minutes
                    </span>
                    <h3 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                      AI Live Practice Simulator
                    </h3>
                    <p className="text-xs sm:text-sm text-[#52525B]">
                      Speak via your microphone or type your response to receive real-time scoring, filler word counts, and executive polish.
                    </p>
                  </div>

                  {/* Scenario Brief */}
                  <div className="p-5 rounded-2xl bg-white border border-[#E2DDD4] space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#EDE9E0] pb-2">
                      <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wide">
                        Scenario: {dailyWorkout.step3PracticeScenario.scenarioTitle}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F5F2EB] text-[#18181B] font-semibold border border-[#EDE9E0]">
                        Role: {dailyWorkout.step3PracticeScenario.yourRole}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#18181B] font-serif">
                      "{dailyWorkout.step3PracticeScenario.theChallengePrompt}"
                    </p>

                    <div className="flex items-center gap-2 text-xs text-[#52525B] bg-[#F5F2EB] p-2.5 rounded-lg border border-[#EDE9E0]">
                      <Lightbulb className="w-4 h-4 text-[#C2410C] shrink-0" />
                      <span><strong className="text-[#18181B]">Pro Tip:</strong> {dailyWorkout.step3PracticeScenario.coachingTip}</span>
                    </div>
                  </div>

                  {/* User Input & Audio Controls */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                        Your Spoken or Written Response
                      </label>
                      <button
                        onClick={toggleSpeechRecognition}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isRecording
                            ? 'bg-[#C2410C] text-white animate-pulse'
                            : 'bg-white hover:bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4]'
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>Listening... (Click to Stop)</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-[#C2410C]" />
                            <span>Record Voice with Mic</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={userSpeechInput}
                      onChange={(e) => setUserSpeechInput(e.target.value)}
                      placeholder="Start speaking into your mic or type how you would respond in this meeting..."
                      className="w-full p-4 text-sm bg-white border border-[#E2DDD4] rounded-2xl text-[#18181B] focus:outline-none focus:border-[#18181B] shadow-2xs"
                    />

                    {evalError && (
                      <div className="flex items-center gap-2 text-xs text-[#C2410C] bg-[#FFF7ED] p-3 rounded-xl border border-[#FFEDD5]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{evalError}</span>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={handleEvaluateResponse}
                        disabled={isEvaluating || !userSpeechInput.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold rounded-full shadow-sm disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {isEvaluating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>AI Evaluating Your Delivery...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-[#C2410C]" />
                            <span>Evaluate Response with AI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Evaluation Result Breakdown */}
                  {evaluationResult && (
                    <div className="p-6 bg-white text-[#18181B] rounded-2xl space-y-5 shadow-sm border border-[#E2DDD4] animate-in fade-in">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE9E0] pb-4">
                        <div>
                          <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                            Speech Evaluation Matrix
                          </span>
                          <h4 className="text-lg font-editorial-heading font-serif font-bold text-[#18181B]">
                            Overall Score: {evaluationResult.overallScore}/100
                          </h4>
                        </div>

                        {/* Metric Pills */}
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-[#F5F2EB] rounded-lg border border-[#EDE9E0] text-center">
                            <span className="block text-[9px] text-[#64748B]">Clarity</span>
                            <span className="text-xs font-bold text-[#15803D]">{evaluationResult.clarityScore}%</span>
                          </div>
                          <div className="px-3 py-1 bg-[#F5F2EB] rounded-lg border border-[#EDE9E0] text-center">
                            <span className="block text-[9px] text-[#64748B]">Confidence</span>
                            <span className="text-xs font-bold text-[#1D4ED8]">{evaluationResult.confidenceScore}%</span>
                          </div>
                          <div className="px-3 py-1 bg-[#F5F2EB] rounded-lg border border-[#EDE9E0] text-center">
                            <span className="block text-[9px] text-[#64748B]">Vocab</span>
                            <span className="text-xs font-bold text-[#4338CA]">{evaluationResult.vocabularyScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Filler Words Alert */}
                      {evaluationResult.fillerWordsDetected.length > 0 && (
                        <div className="p-3 bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl text-xs flex items-center gap-2 text-[#C2410C]">
                          <AlertCircle className="w-4 h-4 shrink-0 text-[#C2410C]" />
                          <span>
                            <strong>Fillers detected:</strong> {evaluationResult.fillerWordsDetected.join(', ')} — pause in silence instead of using fillers.
                          </span>
                        </div>
                      )}

                      {/* Strengths & Upgrades */}
                      <div className="grid sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-[#F5F2EB] rounded-xl border border-[#EDE9E0] space-y-2">
                          <span className="font-bold text-[#15803D] uppercase tracking-wider text-[10px]">Key Strengths</span>
                          <ul className="space-y-1 text-[#18181B]">
                            {evaluationResult.keyStrengths.map((str, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-[#F5F2EB] rounded-xl border border-[#EDE9E0] space-y-2">
                          <span className="font-bold text-[#C2410C] uppercase tracking-wider text-[10px]">Vocabulary Upgrades</span>
                          {evaluationResult.vocabularyUpgrades.map((upg, i) => (
                            <div key={i} className="text-[#18181B] border-t border-[#EDE9E0] pt-1.5 first:border-0 first:pt-0">
                              <span className="line-through text-[#64748B] mr-2">{upg.original}</span>
                              <span className="font-bold text-[#18181B]">{upg.elevated}</span>
                              <p className="text-[11px] text-[#52525B] mt-0.5">{upg.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 10/10 Model Answer */}
                      <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E2DDD4] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Executive 10/10 Model Answer
                          </span>
                          <button
                            onClick={() => speakText(evaluationResult.executiveModelAnswer)}
                            className="text-[11px] text-[#52525B] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                            <span>Listen</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-[#18181B] font-serif italic leading-relaxed">
                          "{evaluationResult.executiveModelAnswer}"
                        </p>
                      </div>

                      {/* Coaching Pep Talk */}
                      <p className="text-xs text-center text-[#52525B] font-serif italic">
                        "{evaluationResult.oneSentenceCoachingPepTalk}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: FIELD MOTIVATION & ACTIONABLE MICRO-HABIT (2 mins) */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4338CA] block mb-1">
                      Step 4 of 4 • 2 Minutes
                    </span>
                    <h3 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                      Field Motivation & Daily Actionable Habit
                    </h3>
                    <p className="text-xs sm:text-sm text-[#52525B]">
                      Apply this single micro-habit in your real interactions today for continuous compounding growth.
                    </p>
                  </div>

                  {/* Motivational Quote */}
                  <div className="p-6 rounded-2xl bg-white text-[#18181B] space-y-4 shadow-sm border border-[#E2DDD4]">
                    <p className="text-base sm:text-lg font-serif italic leading-relaxed text-[#18181B]">
                      "{dailyWorkout.step4FieldMotivation.quote}"
                    </p>
                    <span className="block text-xs text-[#64748B] font-semibold text-right">
                      — {dailyWorkout.step4FieldMotivation.author}
                    </span>
                  </div>

                  {/* Today's 1 Actionable Challenge */}
                  <div className="p-5 bg-white border border-[#E2DDD4] rounded-2xl space-y-2.5 shadow-2xs">
                    <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#C2410C]" />
                      Your Actionable Micro-Habit for Today:
                    </span>
                    <p className="text-sm font-medium text-[#18181B] leading-relaxed">
                      {dailyWorkout.step4FieldMotivation.actionableMicroHabitToday}
                    </p>
                  </div>

                  {/* Confidence Affirmation */}
                  <div className="p-4 bg-[#F5F2EB] border border-[#EDE9E0] rounded-xl text-center">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                      Daily Confidence Anchor
                    </span>
                    <p className="text-sm font-bold text-[#18181B] font-serif">
                      "{dailyWorkout.step4FieldMotivation.confidenceAffirmation}"
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={handleCompleteAll}
                      className="flex items-center gap-2 px-8 py-3.5 bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-[#C2410C]" />
                      <span>Complete 15-Min Routine & Claim +100 XP</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* FINISHED SCREEN */}
          {isFinished && (
            <div className="py-12 text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#18181B] text-[#FAF8F5] flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-8 h-8 text-[#15803D]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-editorial-heading font-serif font-bold text-[#18181B]">
                  Day {dailyWorkout?.dayNumber || 1} Routine Complete
                </h3>
                <p className="text-xs sm:text-sm text-[#52525B] max-w-md mx-auto">
                  You invested 15 focused minutes into your communication, vocabulary, and executive confidence today.
                </p>
              </div>

              <div className="inline-flex items-center gap-6 p-5 bg-white border border-[#E2DDD4] rounded-2xl text-[#18181B] text-sm shadow-2xs">
                <div className="text-center">
                  <span className="block text-[10px] uppercase font-bold text-[#64748B]">Streak</span>
                  <span className="text-base font-bold text-[#C2410C]">{userProfile.streakDays + 1} Days 🔥</span>
                </div>
                <div className="w-px h-8 bg-[#E2DDD4]"></div>
                <div className="text-center">
                  <span className="block text-[10px] uppercase font-bold text-[#64748B]">XP Earned</span>
                  <span className="text-base font-bold text-[#18181B]">+100 XP</span>
                </div>
                <div className="w-px h-8 bg-[#E2DDD4]"></div>
                <div className="text-center">
                  <span className="block text-[10px] uppercase font-bold text-[#64748B]">Word Saved</span>
                  <span className="text-base font-bold text-[#4338CA]">"{dailyWorkout?.step1Vocab.word}"</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-7 py-3 bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold rounded-full transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {!isFinished && !isLoadingWorkout && (
          <div className="px-5 sm:px-8 py-4 bg-[#F5F2EB] border-t border-[#E2DDD4] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#18181B] bg-white border border-[#E2DDD4] hover:bg-[#FAF8F5] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="flex items-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold text-[#FAF8F5] bg-[#18181B] hover:bg-black transition-colors shadow-2xs cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleCompleteAll}
                className="flex items-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold text-white bg-[#15803D] hover:bg-[#166534] transition-colors shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish Today's 15M</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
