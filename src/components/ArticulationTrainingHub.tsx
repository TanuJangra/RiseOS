import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Wind, 
  Activity, 
  Sliders, 
  CheckCircle2, 
  Award,
  BookOpen,
  VolumeX,
  Play
} from 'lucide-react';
import { ArticulationDrill, UserProfile } from '../types';
import { ARTICULATION_DRILLS } from '../data/articulationData';
import { speakText } from '../utils/speechUtils';

interface ArticulationTrainingHubProps {
  userProfile: UserProfile;
  onCompleteDrill: (drillId: string, xp: number) => void;
  onNavigateTab: (tab: any) => void;
}

export const ArticulationTrainingHub: React.FC<ArticulationTrainingHubProps> = ({
  userProfile,
  onCompleteDrill,
  onNavigateTab
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [activeDrill, setActiveDrill] = useState<ArticulationDrill>(ARTICULATION_DRILLS[0]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [articulationResult, setArticulationResult] = useState<any | null>(null);
  
  // Warmup Checklist
  const [completedWarmupSteps, setCompletedWarmupSteps] = useState<number[]>([0]);

  const recognitionRef = useRef<any>(null);

  const stages = [
    { id: 'all', name: 'Complete Roadmap' },
    { id: 'breath', name: '1. Breath & Resonance' },
    { id: 'consonants', name: '2. Consonants & Tongue' },
    { id: 'cadence', name: '3. Cadence & Pauses' },
    { id: 'structure', name: '4. Thought Structuring' },
    { id: 'gravitas', name: '5. Executive Gravitas' }
  ];

  const filteredDrills = selectedStage === 'all'
    ? ARTICULATION_DRILLS
    : ARTICULATION_DRILLS.filter((d) => d.stage === selectedStage);

  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. You can type your spoken practice.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = userProfile.languagePreference === 'hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
        setUserSpokenText(finalTranscript.trim());
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleEvaluateArticulation = async () => {
    if (!userSpokenText.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/gemini/evaluate-articulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drillTitle: activeDrill.title,
          targetPhonetics: activeDrill.targetPhonetics,
          userSpeech: userSpokenText,
          expectedSentence: activeDrill.sampleSentence
        })
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      setArticulationResult(data);
      onCompleteDrill(activeDrill.id, activeDrill.xpReward);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const toggleWarmup = (idx: number) => {
    setCompletedWarmupSteps((prev) => 
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200 font-editorial-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-white via-[#FAF8F5] to-[#F3EFE6] text-[#18181B] rounded-3xl p-6 sm:p-10 border border-[#E2DDD4] shadow-xs relative overflow-hidden">
        {/* Subtle Ink Wash Seal */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-[#C2410C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2EB] text-[#C2410C] text-[10px] font-bold uppercase tracking-[0.15em] border border-[#E2DDD4]">
            <Wind className="w-3 h-3 text-[#C2410C]" />
            <span>Structured Vocal & Articulation Mastery</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-editorial-heading font-serif font-bold tracking-tight text-[#18181B]">
            The 5-Stage Articulation Training Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            Eliminate mumbling, rushed pacing, monotone delivery, and throat fatigue. Master diaphragmatic resonance, crisp dental consonants, and the commanding 2-second executive pause.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span>{userProfile.completedArticulationDrillIds?.length || 1} of {ARTICULATION_DRILLS.length} Drills Mastered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#C2410C]" />
              <span>+{activeDrill.xpReward} XP per completed drill</span>
            </div>
          </div>
        </div>

        {/* Stage Filter Pills */}
        <div className="pt-8 flex flex-wrap items-center gap-1.5">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedStage === stage.id
                  ? 'bg-[#18181B] text-white font-bold'
                  : 'bg-white/80 text-[#52525B] hover:text-[#18181B] hover:bg-white border border-[#E2DDD4]'
              }`}
            >
              {stage.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: Roadmap List & Daily 5M Vocal Warmup */}
        <div className="space-y-6">
          
          {/* Quick 5M Warmup Routine Box */}
          <div className="p-5 rounded-3xl bg-white border border-[#E2DDD4] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C2410C]" />
                <h3 className="font-editorial-heading font-serif font-bold text-sm text-[#18181B]">
                  5-Min Daily Vocal Warmup
                </h3>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F2EB] text-[#52525B] font-bold">
                Daily Routine
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Diaphragm Belly Inflation (4s In, 4s Hold, 6s Exhale)', dur: '1 min' },
                { name: 'Lip Trill Motorboat Vibration ("Brrr" pitch glides)', dur: '1 min' },
                { name: 'Consonant Snap Drill ("Pa-Ta-Ka" x 10)', dur: '1 min' },
                { name: 'Tongue Agility Sprint ("See-She-See-She")', dur: '1 min' },
                { name: 'Intentional 2-Second Silence Cadence Test', dur: '1 min' }
              ].map((step, i) => (
                <div
                  key={i}
                  onClick={() => toggleWarmup(i)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    completedWarmupSteps.includes(i)
                      ? 'bg-[#F5F2EB] border-[#EDE9E0] text-[#18181B]'
                      : 'bg-[#FAF8F5] border-[#E2DDD4] text-[#52525B] hover:border-[#64748B]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      completedWarmupSteps.includes(i) ? 'bg-[#15803D] border-[#15803D] text-white' : 'border-[#EDE9E0]'
                    }`}>
                      {completedWarmupSteps.includes(i) && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-[11px] font-medium leading-tight">{step.name}</span>
                  </div>
                  <span className="text-[9px] text-[#64748B] font-mono shrink-0 ml-1">{step.dur}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drill Library */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Curated Articulation Drills ({filteredDrills.length})
            </span>

            <div className="space-y-2.5">
              {filteredDrills.map((drill) => {
                const isCompleted = userProfile.completedArticulationDrillIds?.includes(drill.id);
                const isSelected = activeDrill.id === drill.id;

                return (
                  <button
                    key={drill.id}
                    onClick={() => {
                      setActiveDrill(drill);
                      setUserSpokenText('');
                      setArticulationResult(null);
                    }}
                    className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#18181B] shadow-2xs'
                        : 'bg-white border-[#E2DDD4] hover:border-[#64748B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#C2410C]">
                        {drill.stageName}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                          <Check className="w-2.5 h-2.5" />
                          Mastered
                        </span>
                      )}
                    </div>

                    <h4 className="font-editorial-heading font-serif font-bold text-sm text-[#18181B] mb-1">
                      {drill.title}
                    </h4>

                    <p className="text-[11px] text-[#52525B] line-clamp-2 leading-relaxed">
                      {drill.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-[#64748B]">
                      <span>{drill.durationMinutes} mins</span>
                      <span className="font-semibold text-[#18181B]">+{drill.xpReward} XP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Active Articulation Drill & Live Enunciation Studio */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Drill Card */}
          <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 sm:p-8 space-y-6 shadow-2xs">
            
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EDE9E0] pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider">
                  {activeDrill.stageName} • {activeDrill.difficulty}
                </span>
                <h2 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                  {activeDrill.title}
                </h2>
              </div>

              <button
                onClick={() => speakText(activeDrill.sampleSentence)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] text-xs font-semibold hover:bg-[#EAE5DB] transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#C2410C]" />
                <span>Hear Master Enunciation</span>
              </button>
            </div>

            {/* Intuitive Hinglish Tip */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] text-xs sm:text-sm text-[#18181B] leading-relaxed">
              <strong className="text-[#C2410C] font-semibold block mb-0.5">💡 Vocal Mechanics Key:</strong>
              {activeDrill.hinglishTip}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                Execution Steps:
              </span>
              <ul className="space-y-1.5 text-xs text-[#18181B]">
                {activeDrill.instructions.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5 font-mono">
                      {i + 1}
                    </span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Sentence Prompt */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5F2EB] text-[#18181B] space-y-2.5 border border-[#E2DDD4] shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider">
                  Target Phonetic Drill Sentence
                </span>
                <span className="text-[10px] text-[#64748B] font-mono">
                  Phonetics: {activeDrill.targetPhonetics.join(' • ')}
                </span>
              </div>
              <p className="text-base sm:text-lg font-editorial-heading font-serif font-bold text-[#18181B] leading-relaxed italic">
                "{activeDrill.sampleSentence}"
              </p>
            </div>

            {/* Live Voice Recording & Transcript */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Speak into Mic & Verify Your Diction
                </label>

                <button
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-[#DC2626] text-white animate-pulse'
                      : 'bg-[#18181B] hover:bg-black text-white'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Record Your Drill</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={3}
                value={userSpokenText}
                onChange={(e) => setUserSpokenText(e.target.value)}
                placeholder="Click 'Record Your Drill' and pronounce the target sentence clearly..."
                className="w-full p-3.5 bg-[#FAF8F5] border border-[#E2DDD4] rounded-2xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateArticulation}
                  disabled={isEvaluating || !userSpokenText.trim()}
                  className="px-6 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold rounded-full flex items-center gap-2 shadow-2xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Grading Vocal Articulation...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze Enunciation & Cadence</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Articulation Evaluation Feedback */}
            {articulationResult && (
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] space-y-4 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE9E0] pb-3">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                      Vocal & Diction Analysis
                    </span>
                    <h4 className="text-lg font-editorial-heading font-serif font-bold text-[#18181B]">
                      Articulation Score: {articulationResult.articulationScore}%
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E2DDD4] font-bold text-[#15803D]">
                      Clarity: {articulationResult.clarityScore}%
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E2DDD4] font-bold text-[#18181B]">
                      Cadence: {articulationResult.cadenceScore}%
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#E2DDD4] space-y-1.5">
                    <strong className="text-[#15803D] block uppercase text-[10px]">Enunciation Highlights:</strong>
                    <ul className="space-y-1 text-[#18181B]">
                      {articulationResult.detectedEnunciationHighlights?.map((h: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#15803D] shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E2DDD4] space-y-1.5">
                    <strong className="text-[#C2410C] block uppercase text-[10px]">Tongue Placement Calibration:</strong>
                    <ul className="space-y-1 text-[#18181B]">
                      {articulationResult.areasNeedingCrisperTonguePlacement?.map((t: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] shrink-0"></span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#E2DDD4] text-xs text-[#52525B] space-y-1">
                  <p><strong className="text-[#18181B]">Pacing Feedback:</strong> {articulationResult.pacingFeedback}</p>
                  <p className="text-[11px] text-[#C2410C]"><strong className="text-[#18181B]">Daily Habit:</strong> {articulationResult.dailyVocalExerciseTip}</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
