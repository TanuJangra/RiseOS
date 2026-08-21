import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic2, 
  Mic, 
  MicOff, 
  Sparkles, 
  RefreshCw, 
  Volume2, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Timer, 
  Lightbulb, 
  Wand2,
  BookOpen,
  Award,
  Film
} from 'lucide-react';
import { PracticeEvaluation, SentenceElevationResult, StorytellingEvaluation, UserProfile } from '../types';
import { speakText } from '../utils/speechUtils';

interface InteractivePracticeHubProps {
  userProfile: UserProfile;
  initialScenario?: string;
  initialPrompt?: string;
  onRecordFeedback?: (feedbackItem: any) => void;
}

const PRESET_SCENARIOS = [
  {
    id: 'deadline-pushback',
    title: 'Pushing Back on an Unrealistic Deadline',
    role: 'Senior Lead',
    prompt: 'Your manager demands that a 3-week project be delivered by Friday. Respond diplomatically without sounding defiant.',
    framework: 'Empathy-Anchor + Tradeoff Calibration'
  },
  {
    id: 'impromptu-standup',
    title: 'Executive Standup: Surprise 30-Sec Status Update',
    role: 'Product Specialist',
    prompt: 'The Vice President joins your sync unexpectedly: "Give me the 30-second BLUF on where project Alpha stands right now."',
    framework: 'BLUF (Bottom Line Up Front) + PREP'
  },
  {
    id: 'salary-negotiation',
    title: 'Salary & Compensation Review Discussion',
    role: 'Valued Contributor',
    prompt: 'You have delivered 30% above targets this quarter. Articulate your request for a market compensation adjustment based on data.',
    framework: 'Value-First STAR + Future Trajectory'
  },
  {
    id: 'difficult-client',
    title: 'De-escalating an Irritated Stakeholder',
    role: 'Account Lead',
    prompt: 'A client calls complaining: "Your recent release broke our integration workflow! Fix this immediately or we cancel!"',
    framework: 'Mirroring & Emotional Labeling'
  }
];

const STORYTELLING_CHALLENGES = [
  {
    id: 'story-crisis',
    title: 'Overcoming a Critical Crisis / Failure',
    prompt: 'Tell the story of a major setback or failure you encountered, the bold pivot you initiated, and the measurable triumph that resulted.',
    structure: 'STAR+C (Situation, Task, Action, Result + Core Lesson)',
    timeGuideline: '90 - 120 Seconds',
    coachHint: 'Hook your audience immediately with the stakes: "Six months ago, our core pipeline went dark during peak traffic..."'
  },
  {
    id: 'story-vision',
    title: 'Pitching an Unpopular Innovation to Skeptical Leadership',
    prompt: 'Tell the story of why a legacy process must be abandoned in favor of a modern approach, framing the risk of inaction vs reward of change.',
    structure: 'The Hero\'s Transformation (Status Quo -> Pain Point -> Solution -> Future State)',
    timeGuideline: '60 - 90 Seconds',
    coachHint: 'Contrast the painful reality of doing nothing with the high-ROI future vision.'
  },
  {
    id: 'story-culture',
    title: 'Inspiring a Demotivated or Burned-Out Team',
    prompt: 'Deliver a rallying narrative to re-energize your team before the final sprint of the quarter.',
    structure: 'Why-How-What (Simon Sinek Golden Circle)',
    timeGuideline: '60 - 90 Seconds',
    coachHint: 'Focus on collective purpose and human impact rather than just numbers and metrics.'
  }
];

const IMPROMPTU_TOPICS = [
  'Why concise brevity is the ultimate superpower in modern business.',
  'How to maintain emotional composure when someone criticizes your work.',
  'The difference between being a manager versus being a true leader.',
  'Why continuous daily 15-minute compounding beats occasional heroic sprints.'
];

export const InteractivePracticeHub: React.FC<InteractivePracticeHubProps> = ({
  userProfile,
  initialScenario,
  initialPrompt,
  onRecordFeedback
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'storytelling' | 'elevate' | 'impromptu'>('simulator');

  // Simulator state
  const [selectedScenario, setSelectedScenario] = useState<any>(PRESET_SCENARIOS[0]);
  const [customScenarioTitle, setCustomScenarioTitle] = useState<string>('');
  const [customScenarioPrompt, setCustomScenarioPrompt] = useState<string>('');
  const [userSpeechInput, setUserSpeechInput] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<PracticeEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Storytelling state
  const [selectedStory, setSelectedStory] = useState<any>(STORYTELLING_CHALLENGES[0]);
  const [userStoryInput, setUserStoryInput] = useState<string>('');
  const [isStoryRecording, setIsStoryRecording] = useState<boolean>(false);
  const [isEvaluatingStory, setIsEvaluatingStory] = useState<boolean>(false);
  const [storyEvaluation, setStoryEvaluation] = useState<StorytellingEvaluation | null>(null);

  // Elevate Sentence state
  const [sentenceInput, setSentenceInput] = useState<string>('I dont think this idea is good and it will fail.');
  const [isElevating, setIsElevating] = useState<boolean>(false);
  const [elevationResult, setElevationResult] = useState<SentenceElevationResult | null>(null);

  // Impromptu state
  const [impromptuTopic, setImpromptuTopic] = useState<string>(IMPROMPTU_TOPICS[0]);
  const [impromptuTimer, setImpromptuTimer] = useState<number>(60);
  const [isImpromptuRunning, setIsImpromptuRunning] = useState<boolean>(false);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (initialScenario && initialPrompt) {
      setSelectedScenario({
        id: 'custom',
        title: initialScenario,
        role: userProfile.field.toUpperCase(),
        prompt: initialPrompt,
        framework: 'PREP / Custom'
      });
      setActiveTab('simulator');
    }
  }, [initialScenario, initialPrompt, userProfile.field]);

  // Impromptu countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isImpromptuRunning && impromptuTimer > 0) {
      timer = setInterval(() => {
        setImpromptuTimer((prev) => prev - 1);
      }, 1000);
    } else if (impromptuTimer === 0 && isImpromptuRunning) {
      setIsImpromptuRunning(false);
      if (isRecording) toggleSpeechRecognition();
    }
    return () => clearInterval(timer);
  }, [isImpromptuRunning, impromptuTimer, isRecording]);

  const toggleSpeechRecognition = (target: 'simulator' | 'storytelling' = 'simulator') => {
    const isCurrentlyRec = target === 'storytelling' ? isStoryRecording : isRecording;

    if (isCurrentlyRec) {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (target === 'storytelling') setIsStoryRecording(false);
      else setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. You can type your response.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = userProfile.languagePreference === 'hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        if (target === 'storytelling') setIsStoryRecording(true);
        else setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
        if (target === 'storytelling') {
          setUserStoryInput(finalTranscript.trim());
        } else {
          setUserSpeechInput(finalTranscript.trim());
        }
      };

      recognition.onerror = () => {
        if (target === 'storytelling') setIsStoryRecording(false);
        else setIsRecording(false);
      };

      recognition.onend = () => {
        if (target === 'storytelling') setIsStoryRecording(false);
        else setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      if (target === 'storytelling') setIsStoryRecording(false);
      else setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userSpeechInput.trim()) {
      setEvalError('Please speak or type your response before running evaluation.');
      return;
    }

    setEvalError(null);
    setIsEvaluating(true);

    try {
      const currentTitle = customScenarioTitle || selectedScenario?.title || 'General Practice';
      const currentPrompt = customScenarioPrompt || selectedScenario?.prompt || 'Communicate with authority';

      const res = await fetch('/api/gemini/evaluate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: currentTitle,
          prompt: currentPrompt,
          userResponse: userSpeechInput,
          field: userProfile.field,
          targetSkills: 'Clarity, Confidence, Executive Vocabulary, Structure'
        })
      });

      if (!res.ok) throw new Error('Evaluation failed');
      const data = await res.json();
      setEvaluationResult(data);

      if (onRecordFeedback) {
        onRecordFeedback({
          date: new Date().toLocaleDateString(),
          scenario: currentTitle,
          score: data.overallScore,
          strength: data.strengths?.[0] || 'Clear delivery',
          improvementArea: data.criticalCorrection || 'Refine pause cadence'
        });
      }
    } catch (err) {
      console.error(err);
      setEvalError('Evaluation could not complete. Please retry.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleEvaluateStorytelling = async () => {
    if (!userStoryInput.trim()) return;
    setIsEvaluatingStory(true);

    try {
      const res = await fetch('/api/gemini/evaluate-storytelling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyPrompt: selectedStory.prompt,
          storyTitle: selectedStory.title,
          userSpokenStory: userStoryInput,
          field: userProfile.field,
          targetStructure: selectedStory.structure
        })
      });

      if (!res.ok) throw new Error('Story evaluation failed');
      const data: StorytellingEvaluation = await res.json();
      setStoryEvaluation(data);

      if (onRecordFeedback) {
        onRecordFeedback({
          date: new Date().toLocaleDateString(),
          scenario: selectedStory.title,
          score: data.overallScore,
          strength: data.keyStrengths?.[0] || 'Compelling narrative hook',
          improvementArea: data.coachAdviceForTomorrow || 'Quantify resolution metric'
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluatingStory(false);
    }
  };

  const handleElevateSentence = async () => {
    if (!sentenceInput.trim()) return;
    setIsElevating(true);

    try {
      const res = await fetch('/api/gemini/elevate-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentence: sentenceInput,
          context: 'Workplace & Leadership',
          field: userProfile.field
        })
      });

      if (!res.ok) throw new Error('Failed to elevate sentence');
      const data = await res.json();
      setElevationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsElevating(false);
    }
  };

  const spinRandomImpromptu = () => {
    const next = IMPROMPTU_TOPICS[Math.floor(Math.random() * IMPROMPTU_TOPICS.length)];
    setImpromptuTopic(next);
    setImpromptuTimer(60);
    setIsImpromptuRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200 font-editorial-sans">
      
      {/* Header */}
      <div className="space-y-2 border-b border-[#E2DDD4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2EB] text-[#15803D] text-[10px] font-bold uppercase tracking-[0.15em] border border-[#E2DDD4]">
          <Mic2 className="w-3 h-3 text-[#15803D]" />
          <span>Interactive Practice Arena</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-editorial-heading font-serif font-bold text-[#18181B] tracking-tight">
          AI Speech & Articulation Simulator
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B] max-w-3xl leading-relaxed">
          Test real-world communication scenarios, master high-stakes executive storytelling, upgrade casual phrasing into executive polish, or take 60-second impromptu speech challenges.
        </p>
      </div>

      {/* Simulator Mode Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F5F2EB] rounded-full border border-[#E2DDD4] w-fit">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-[#18181B] text-white shadow-2xs'
              : 'text-[#52525B] hover:text-[#18181B]'
          }`}
        >
          <Mic2 className="w-3.5 h-3.5" />
          <span>1. Scenario Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('storytelling')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'storytelling'
              ? 'bg-[#18181B] text-white shadow-2xs'
              : 'text-[#52525B] hover:text-[#18181B]'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-[#C2410C]" />
          <span>2. Storytelling & Pitch Arena</span>
        </button>

        <button
          onClick={() => setActiveTab('elevate')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'elevate'
              ? 'bg-[#18181B] text-white shadow-2xs'
              : 'text-[#52525B] hover:text-[#18181B]'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>3. Elevate Sentence</span>
        </button>

        <button
          onClick={() => setActiveTab('impromptu')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'impromptu'
              ? 'bg-[#18181B] text-white shadow-2xs'
              : 'text-[#52525B] hover:text-[#18181B]'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>4. 60s Impromptu Drill</span>
        </button>
      </div>

      {/* TAB 1: SCENARIO SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column: Preset Scenarios */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Choose Workplace Scenario
            </h3>

            <div className="space-y-2.5">
              {PRESET_SCENARIOS.map((scen) => (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenario(scen);
                    setCustomScenarioTitle('');
                    setCustomScenarioPrompt('');
                    setEvaluationResult(null);
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedScenario?.id === scen.id && !customScenarioTitle
                      ? 'bg-white border-[#18181B] shadow-2xs'
                      : 'bg-white border-[#E2DDD4] hover:border-[#64748B]'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C2410C] block mb-1">
                    {scen.role}
                  </span>
                  <h4 className="font-editorial-heading font-serif font-bold text-sm text-[#18181B] mb-1">
                    {scen.title}
                  </h4>
                  <p className="text-[11px] text-[#52525B] line-clamp-2 leading-relaxed">
                    {scen.prompt}
                  </p>
                </button>
              ))}
            </div>

            {/* Or Custom Scenario */}
            <div className="p-4 bg-white rounded-2xl border border-[#E2DDD4] space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold text-[#18181B] block">Custom Scenario</span>
              <input
                type="text"
                placeholder="Scenario Title (e.g. Firing a vendor)"
                value={customScenarioTitle}
                onChange={(e) => setCustomScenarioTitle(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
              <textarea
                rows={2}
                placeholder="What is the prompt / crisis you are answering?"
                value={customScenarioPrompt}
                onChange={(e) => setCustomScenarioPrompt(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
            </div>
          </div>

          {/* Right 2 Columns: Practice Arena & AI Evaluation */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Active Challenge Brief */}
            <div className="p-6 rounded-3xl bg-white text-[#18181B] space-y-4 shadow-xs border border-[#E2DDD4]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Active Challenge
                </span>
                <span className="text-xs text-[#64748B]">
                  Target Field: <strong className="text-[#18181B]">{userProfile.field.toUpperCase()}</strong>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-editorial-heading font-serif font-bold text-[#18181B]">
                {customScenarioTitle || selectedScenario?.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#18181B] leading-relaxed italic bg-[#F5F2EB] p-4 rounded-xl border border-[#EDE9E0] font-serif">
                "{customScenarioPrompt || selectedScenario?.prompt}"
              </p>

              <div className="flex items-center gap-2 text-xs text-[#52525B] font-medium">
                <Lightbulb className="w-4 h-4 text-[#C2410C] shrink-0" />
                <span>Recommended Framework: <strong className="text-[#18181B]">{selectedScenario?.framework}</strong></span>
              </div>
            </div>

            {/* Input & Record Controls */}
            <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Your Response (Speak or Type)
                </label>

                <button
                  onClick={() => toggleSpeechRecognition('simulator')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isRecording
                      ? 'bg-[#DC2626] text-white animate-pulse'
                      : 'bg-[#F5F2EB] hover:bg-[#EAE5DB] text-[#18181B] border border-[#E2DDD4]'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Recording... (Click to Stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Record Voice</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={4}
                value={userSpeechInput}
                onChange={(e) => setUserSpeechInput(e.target.value)}
                placeholder="Click 'Record Voice' or type your response here..."
                className="w-full p-4 text-sm bg-[#FAF8F5] border border-[#E2DDD4] rounded-2xl focus:outline-none focus:border-[#18181B] text-[#18181B]"
              />

              {evalError && (
                <div className="flex items-center gap-2 text-xs text-[#DC2626] bg-[#FEF2F2] p-3 rounded-xl border border-[#FEE2E2]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{evalError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !userSpeechInput.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold rounded-full shadow-2xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Speech Dynamics...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C2410C]" />
                      <span>Evaluate & Grade Response</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Evaluation Matrix Breakdown */}
            {evaluationResult && (
              <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 sm:p-7 space-y-5 shadow-sm animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE9E0] pb-4">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                      Executive Communication Matrix
                    </span>
                    <h4 className="text-xl font-editorial-heading font-serif font-bold text-[#18181B]">
                      Overall Score: {evaluationResult.overallScore}/100
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-[#F5F2EB] rounded-xl text-center border border-[#EDE9E0]">
                      <span className="block text-[9px] text-[#64748B] uppercase font-bold">Clarity</span>
                      <strong className="text-xs text-[#18181B]">{evaluationResult.clarityScore}%</strong>
                    </div>
                    <div className="px-3 py-1.5 bg-[#F5F2EB] rounded-xl text-center border border-[#EDE9E0]">
                      <span className="block text-[9px] text-[#64748B] uppercase font-bold">Confidence</span>
                      <strong className="text-xs text-[#18181B]">{evaluationResult.confidenceScore}%</strong>
                    </div>
                    <div className="px-3 py-1.5 bg-[#F5F2EB] rounded-xl text-center border border-[#EDE9E0]">
                      <span className="block text-[9px] text-[#64748B] uppercase font-bold">Executive</span>
                      <strong className="text-xs text-[#18181B]">{evaluationResult.executivePresenceScore}%</strong>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2DDD4] space-y-2">
                    <strong className="text-[#15803D] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      Key Strengths
                    </strong>
                    <ul className="space-y-1 text-[#52525B]">
                      {evaluationResult.strengths?.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] shrink-0 mt-1.5"></span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2DDD4] space-y-2">
                    <strong className="text-[#C2410C] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Areas To Elevate
                    </strong>
                    <ul className="space-y-1 text-[#52525B]">
                      {evaluationResult.areasForImprovement?.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] shrink-0 mt-1.5"></span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 10/10 Gold Standard Version */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] text-[#18181B] space-y-2.5 border border-[#E2DDD4]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Master 10/10 Executive Script
                    </span>

                    <button
                      onClick={() => speakText(evaluationResult.improvedVersion)}
                      className="text-xs text-[#52525B] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Listen to Audio Delivery</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#18181B] italic font-serif leading-relaxed">
                    "{evaluationResult.improvedVersion}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STORYTELLING & PITCH ARENA */}
      {activeTab === 'storytelling' && (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in">
          
          {/* Story Selector Column */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Narrative & Pitch Tracks
            </span>

            <div className="space-y-2.5">
              {STORYTELLING_CHALLENGES.map((story) => (
                <button
                  key={story.id}
                  onClick={() => {
                    setSelectedStory(story);
                    setUserStoryInput('');
                    setStoryEvaluation(null);
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedStory.id === story.id
                      ? 'bg-white border-[#18181B] shadow-2xs'
                      : 'bg-white border-[#E2DDD4] hover:border-[#64748B]'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C2410C] block mb-1">
                    {story.timeGuideline}
                  </span>
                  <h4 className="font-editorial-heading font-serif font-bold text-sm text-[#18181B] mb-1">
                    {story.title}
                  </h4>
                  <p className="text-[11px] text-[#52525B] line-clamp-2 leading-relaxed">
                    {story.prompt}
                  </p>
                </button>
              ))}
            </div>

            {/* Framework Explainer */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2DDD4] space-y-2 shadow-2xs text-xs">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                Storytelling Architecture
              </span>
              <p className="text-[#52525B] leading-relaxed">
                Great leaders don't recite bullet points—they construct a <strong>Hook</strong> (Stakes), <strong>Conflict</strong> (The bottleneck), <strong>Turning Point</strong> (Action taken), and <strong>Resolution</strong> (Quantified ROI).
              </p>
            </div>
          </div>

          {/* Right 2 Columns: Pitch Studio & Narrative Evaluator */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Active Story Prompt Card */}
            <div className="p-6 rounded-3xl bg-white text-[#18181B] space-y-4 shadow-xs border border-[#E2DDD4]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Executive Narrative Challenge
                </span>
                <span className="text-xs text-[#64748B]">
                  Format: <strong className="text-[#18181B]">{selectedStory.structure}</strong>
                </span>
              </div>

              <h3 className="text-xl font-editorial-heading font-serif font-bold text-[#18181B]">
                {selectedStory.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#18181B] leading-relaxed italic bg-[#F5F2EB] p-4 rounded-xl border border-[#EDE9E0] font-serif">
                "{selectedStory.prompt}"
              </p>

              <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#EDE9E0] text-xs text-[#52525B]">
                <strong className="text-[#C2410C] block mb-0.5">Coach Hook Hint:</strong>
                {selectedStory.coachHint}
              </div>
            </div>

            {/* Live Recording Area */}
            <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Deliver Your 90-Second Story (Speak or Type)
                </label>

                <button
                  onClick={() => toggleSpeechRecognition('storytelling')}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isStoryRecording
                      ? 'bg-[#DC2626] text-white animate-pulse'
                      : 'bg-[#18181B] hover:bg-black text-[#FAF8F5]'
                  }`}
                >
                  {isStoryRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Recording Story... Click to Finish</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Record Spoken Story</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={5}
                value={userStoryInput}
                onChange={(e) => setUserStoryInput(e.target.value)}
                placeholder="Click 'Record Spoken Story' and deliver your story with emotion, pauses, and clear resolution..."
                className="w-full p-4 text-sm bg-[#FAF8F5] border border-[#E2DDD4] rounded-2xl focus:outline-none focus:border-[#18181B] text-[#18181B]"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#64748B]">
                  Word count: <strong className="text-[#18181B]">{userStoryInput.split(/\s+/).filter(Boolean).length} words</strong>
                </span>

                <button
                  onClick={handleEvaluateStorytelling}
                  disabled={isEvaluatingStory || !userStoryInput.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold rounded-full shadow-2xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isEvaluatingStory ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Evaluating Narrative Arc & Hook...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate Storytelling & Brevity</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Story Evaluation Results */}
            {storyEvaluation && (
              <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 sm:p-7 space-y-5 shadow-sm animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE9E0] pb-4">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                      Narrative Scorecard
                    </span>
                    <h4 className="text-xl font-editorial-heading font-serif font-bold text-[#18181B]">
                      Overall Narrative Impact: {storyEvaluation.overallScore}/100
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-[#F5F2EB] rounded-xl text-center border border-[#EDE9E0]">
                      <span className="block text-[9px] text-[#64748B] uppercase font-bold">Hook</span>
                      <strong className="text-xs text-[#18181B]">{storyEvaluation.hookImpactScore}%</strong>
                    </div>
                    <div className="px-3 py-1.5 bg-[#F5F2EB] rounded-xl text-center border border-[#EDE9E0]">
                      <span className="block text-[9px] text-[#64748B] uppercase font-bold">Arc</span>
                      <strong className="text-xs text-[#18181B]">{storyEvaluation.narrativeArcScore}%</strong>
                    </div>
                    <div className="px-3 py-1.5 bg-[#F5F2EB] rounded-xl text-center border border-[#EDE9E0]">
                      <span className="block text-[9px] text-[#64748B] uppercase font-bold">Brevity</span>
                      <strong className="text-xs text-[#18181B]">{storyEvaluation.executiveBrevityScore}%</strong>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2DDD4] space-y-2">
                    <strong className="text-[#15803D] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      Storytelling Strengths
                    </strong>
                    <ul className="space-y-1 text-[#52525B]">
                      {storyEvaluation.keyStrengths?.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] shrink-0 mt-1.5"></span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E2DDD4] space-y-2">
                    <strong className="text-[#C2410C] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Narrative Refinements
                    </strong>
                    <ul className="space-y-1 text-[#52525B]">
                      {storyEvaluation.areasToRefine?.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] shrink-0 mt-1.5"></span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Elevated Master Story Delivery */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] text-[#18181B] space-y-2.5 border border-[#E2DDD4]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Elevated Master Storyteller Delivery
                    </span>

                    <button
                      onClick={() => speakText(storyEvaluation.elevatedStoryVersion)}
                      className="text-xs text-[#52525B] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Hear Story Delivery</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#18181B] italic font-serif leading-relaxed">
                    "{storyEvaluation.elevatedStoryVersion}"
                  </p>

                  <div className="pt-2 border-t border-[#EDE9E0] flex items-center justify-between text-xs text-[#64748B]">
                    <span>Structure: <strong className="text-[#18181B]">{storyEvaluation.storyStructureUsed}</strong></span>
                    <span className="text-[#C2410C]">💡 Tomorrow's Goal: {storyEvaluation.coachAdviceForTomorrow}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 3: ELEVATE SENTENCE */}
      {activeTab === 'elevate' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5" />
                Sentence Re-Engineering Tool
              </span>
              <h3 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                Transform Casual Speech to Executive Impact
              </h3>
              <p className="text-xs sm:text-sm text-[#52525B]">
                Input any blunt, informal, or insecure statement to receive 3 elevated professional versions.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Enter Casual / Raw Statement:
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={sentenceInput}
                  onChange={(e) => setSentenceInput(e.target.value)}
                  placeholder="e.g. I dont think this plan will work because people will complain."
                  className="w-full p-4 text-sm bg-[#FAF8F5] border border-[#E2DDD4] rounded-2xl focus:outline-none focus:border-[#18181B] text-[#18181B]"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSentenceInput('Can you please give me an update on this project soon?')}
                  className="text-[11px] text-[#64748B] hover:text-[#18181B] underline cursor-pointer"
                >
                  Try: "Project update request"
                </button>

                <button
                  onClick={handleElevateSentence}
                  disabled={isElevating || !sentenceInput.trim()}
                  className="px-6 py-2.5 bg-[#18181B] hover:bg-black text-[#FAF8F5] text-xs font-bold rounded-full shadow-2xs disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isElevating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Elevating Phrasing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Elevate Phrasing</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Elevated 3 Tiers Result */}
            {elevationResult && (
              <div className="space-y-4 pt-4 border-t border-[#EDE9E0] animate-in fade-in">
                
                {/* 1. Casual Confident */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider">
                      Tier 1: Casual Confident (Clean & Direct)
                    </span>
                    <button
                      onClick={() => speakText(elevationResult.casualConfident)}
                      className="text-xs text-[#64748B] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Pronounce</span>
                    </button>
                  </div>
                  <p className="text-sm font-medium text-[#18181B]">
                    "{elevationResult.casualConfident}"
                  </p>
                </div>

                {/* 2. Executive Polish */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#18181B] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#18181B] uppercase tracking-wider">
                      Tier 2: Executive Polish (Authoritative & Sharp)
                    </span>
                    <button
                      onClick={() => speakText(elevationResult.executivePolish)}
                      className="text-xs text-[#64748B] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Pronounce</span>
                    </button>
                  </div>
                  <p className="text-sm font-serif font-bold text-[#18181B]">
                    "{elevationResult.executivePolish}"
                  </p>
                </div>

                {/* 3. Diplomatic Master */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider">
                      Tier 3: Diplomatic Master (Tactful & Persuasive)
                    </span>
                    <button
                      onClick={() => speakText(elevationResult.diplomaticMaster)}
                      className="text-xs text-[#64748B] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Pronounce</span>
                    </button>
                  </div>
                  <p className="text-sm font-medium text-[#18181B]">
                    "{elevationResult.diplomaticMaster}"
                  </p>
                </div>

                {/* Underlying Principle */}
                <div className="p-3 bg-[#F5F2EB] rounded-xl text-xs text-[#52525B] flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                  <span><strong>Core Communication Principle:</strong> {elevationResult.communicationPrinciple}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: 60-SECOND IMPROMPTU DRILL */}
      {activeTab === 'impromptu' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 sm:p-8 space-y-6 shadow-2xs text-center">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider flex items-center justify-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                60-Second Impromptu Speech Drill
              </span>
              <h3 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                Spontaneous Thinking Under The Clock
              </h3>
              <p className="text-xs sm:text-sm text-[#52525B] max-w-md mx-auto">
                Train your brain to formulate a crisp point without freezing. Use PREP: Point, Reason, Example, Point.
              </p>
            </div>

            {/* Random Topic Box */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] space-y-3">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Your Spontaneous Topic:
              </span>
              <h4 className="text-lg sm:text-xl font-editorial-heading font-serif font-bold text-[#18181B]">
                "{impromptuTopic}"
              </h4>
              <button
                onClick={spinRandomImpromptu}
                className="text-xs font-bold text-[#C2410C] hover:text-[#18181B] flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Spin New Random Topic</span>
              </button>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center font-mono text-2xl font-bold shadow-2xs ${
                impromptuTimer < 10
                  ? 'border-[#DC2626] text-[#DC2626] animate-pulse'
                  : isImpromptuRunning
                  ? 'border-[#18181B] text-[#18181B]'
                  : 'border-[#E2DDD4] text-[#64748B]'
              }`}>
                {impromptuTimer}s
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsImpromptuRunning(!isImpromptuRunning);
                    if (!isRecording) toggleSpeechRecognition('simulator');
                  }}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs shadow-2xs transition-all cursor-pointer ${
                    isImpromptuRunning
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#18181B] text-[#FAF8F5] hover:bg-black'
                  }`}
                >
                  {isImpromptuRunning ? 'Pause Drill' : 'Start 60s Clock & Record'}
                </button>
              </div>
            </div>

            {/* Transcript preview */}
            <div className="text-left space-y-2">
              <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Spoken Transcript:
              </label>
              <textarea
                rows={3}
                value={userSpeechInput}
                onChange={(e) => setUserSpeechInput(e.target.value)}
                placeholder="Start speaking into the mic when the clock begins..."
                className="w-full p-3 bg-[#FAF8F5] border border-[#E2DDD4] rounded-xl text-xs text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedScenario({
                      title: '60s Impromptu Topic',
                      prompt: impromptuTopic,
                      role: 'Impromptu Speaker',
                      framework: 'PREP'
                    });
                    setActiveTab('simulator');
                    handleEvaluate();
                  }}
                  disabled={!userSpeechInput.trim()}
                  className="px-5 py-2.5 bg-[#18181B] text-[#FAF8F5] text-xs font-bold rounded-full hover:bg-black disabled:opacity-40 cursor-pointer"
                >
                  Grade 60s Impromptu Response →
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
