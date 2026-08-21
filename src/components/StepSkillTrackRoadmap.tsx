import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Zap, 
  Award, 
  ArrowRight, 
  Activity, 
  Mic2, 
  Brain, 
  ShieldCheck,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';

export interface SkillNode {
  id: string;
  stageNumber: number;
  stageTitle: string;
  skillName: string;
  category: 'vocal' | 'framing' | 'storytelling' | 'gravitas';
  durationMinutes: number;
  xpReward: number;
  description: string;
  keyRule: string;
  launchType: 'card_lesson' | 'audio_drill' | 'simulator_scenario';
  actionTargetId?: string;
  unlocked: boolean;
  completed: boolean;
}

interface StepSkillTrackRoadmapProps {
  userProfile: UserProfile;
  onLaunchNode: (node: SkillNode) => void;
  isDark?: boolean;
}

export const SKILL_ROADMAP_NODES: SkillNode[] = [
  {
    id: 'node-1',
    stageNumber: 1,
    stageTitle: 'Foundation Stage',
    skillName: 'Diaphragmatic Breath & Resonance',
    category: 'vocal',
    durationMinutes: 4,
    xpReward: 50,
    description: 'Stabilize your vocal tone from the belly instead of the throat to eliminate jittery pitch under pressure.',
    keyRule: 'Exhale smoothly on a 4-7-8 count before starting any high-stakes presentation.',
    launchType: 'audio_drill',
    unlocked: true,
    completed: true
  },
  {
    id: 'node-2',
    stageNumber: 1,
    stageTitle: 'Foundation Stage',
    skillName: 'Plosives & Crisp Consonants',
    category: 'vocal',
    durationMinutes: 3,
    xpReward: 40,
    description: 'Hit the T, P, K, and B sounds with mechanical precision to stop mumbling and slurry speech.',
    keyRule: 'Over-articulate end consonants so your speech cuts through background noise and video calls.',
    launchType: 'audio_drill',
    unlocked: true,
    completed: true
  },
  {
    id: 'node-3',
    stageNumber: 2,
    stageTitle: 'Strategic Framing Stage',
    skillName: 'The PREP Framework',
    category: 'framing',
    durationMinutes: 4,
    xpReward: 60,
    description: 'Structure any impromptu question into Point, Reason, Example, Point in 5 seconds.',
    keyRule: 'State your conclusion in the very first sentence before giving background stories.',
    launchType: 'card_lesson',
    unlocked: true,
    completed: false
  },
  {
    id: 'node-4',
    stageNumber: 2,
    stageTitle: 'Strategic Framing Stage',
    skillName: 'What / So What / Now What',
    category: 'framing',
    durationMinutes: 4,
    xpReward: 60,
    description: 'The Stanford tri-part framework for project updates, emergency alerts, and cross-functional syncs.',
    keyRule: 'Never deliver a problem ("What") without an actionable recommendation ("Now What").',
    launchType: 'card_lesson',
    unlocked: true,
    completed: false
  },
  {
    id: 'node-5',
    stageNumber: 3,
    stageTitle: 'High-Stakes Arena Stage',
    skillName: 'STAR Storytelling Arc',
    category: 'storytelling',
    durationMinutes: 5,
    xpReward: 80,
    description: 'Transform mundane work experiences into compelling narrative case studies with measurable stakes.',
    keyRule: 'Spend 70% of your story on the Action & Quantifiable Result, not the problem context.',
    launchType: 'simulator_scenario',
    actionTargetId: 'story-star',
    unlocked: true,
    completed: false
  },
  {
    id: 'node-6',
    stageNumber: 3,
    stageTitle: 'High-Stakes Arena Stage',
    skillName: 'Impromptu 60-Second Challenge',
    category: 'storytelling',
    durationMinutes: 4,
    xpReward: 75,
    description: 'Speak for 60 seconds without saying "um", "like", or losing the narrative thread.',
    keyRule: 'Replace filler words with deliberate 1.5-second pauses to project gravitas.',
    launchType: 'simulator_scenario',
    unlocked: false,
    completed: false
  },
  {
    id: 'node-7',
    stageNumber: 4,
    stageTitle: 'Executive Mastery Stage',
    skillName: 'Boardroom Disagreement & Defusal',
    category: 'gravitas',
    durationMinutes: 6,
    xpReward: 100,
    description: 'De-escalate aggressive executive pushback using Chris Voss tactical empathy & labeling.',
    keyRule: 'Label the underlying emotion ("It seems like budget certainty is the core blocker here").',
    launchType: 'simulator_scenario',
    actionTargetId: 'disagreement-defusal',
    unlocked: false,
    completed: false
  }
];

export const StepSkillTrackRoadmap: React.FC<StepSkillTrackRoadmapProps> = ({
  userProfile,
  onLaunchNode,
  isDark = false
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'vocal' | 'framing' | 'storytelling' | 'gravitas'>('all');

  const filteredNodes = SKILL_ROADMAP_NODES.filter((node) => 
    activeFilter === 'all' || node.category === activeFilter
  );

  const completedCount = SKILL_ROADMAP_NODES.filter((n) => n.completed).length;
  const overallProgress = Math.round((completedCount / SKILL_ROADMAP_NODES.length) * 100);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vocal': return 'text-[#C2410C] dark:text-[#FB923C] bg-[#C2410C]/10 border-[#C2410C]/30';
      case 'framing': return 'text-[#1D4ED8] dark:text-[#60A5FA] bg-[#1D4ED8]/10 border-[#1D4ED8]/30';
      case 'storytelling': return 'text-[#15803D] dark:text-[#22C55E] bg-[#15803D]/10 border-[#15803D]/30';
      case 'gravitas': return 'text-[#7E22CE] dark:text-[#A78BFA] bg-[#7E22CE]/10 border-[#7E22CE]/30';
      default: return 'text-[#52525B] bg-[#52525B]/10 border-[#52525B]/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocal': return <Activity className="w-4 h-4" />;
      case 'framing': return <Brain className="w-4 h-4" />;
      case 'storytelling': return <Mic2 className="w-4 h-4" />;
      case 'gravitas': return <ShieldCheck className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs space-y-6 transition-all ${
      isDark ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' : 'bg-white border-[#E2DDD4] text-[#18181B]'
    }`}>
      
      {/* Header & Overall Track Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-inherit">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-mono bg-[#F5F2EB] text-[#C2410C] dark:bg-[#C2410C]/10 dark:text-[#FB923C] border border-[#E2DDD4] dark:border-[#C2410C]/20">
              Brain Fitness Progression
            </span>
            <span className="text-xs font-mono font-bold text-[#15803D] dark:text-[#22C55E]">
              {overallProgress}% Mastered
            </span>
          </div>
          <h2 className="font-editorial-heading font-serif font-bold text-xl sm:text-2xl">
            Step-by-Step Skill Tracks
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] max-w-xl mt-0.5">
            Sequential cognitive and vocal training milestones. Complete each node to unlock executive gravitas.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border bg-inherit border-inherit text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              activeFilter === 'all' 
                ? (isDark ? 'bg-[#27272A] text-white shadow-xs' : 'bg-[#18181B] text-white shadow-xs') 
                : 'text-[#64748B] dark:text-[#A1A1AA]'
            }`}
          >
            All Tracks
          </button>
          <button
            onClick={() => setActiveFilter('vocal')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              activeFilter === 'vocal' 
                ? (isDark ? 'bg-[#27272A] text-[#FB923C]' : 'bg-[#18181B] text-[#FB923C]') 
                : 'text-[#64748B] dark:text-[#A1A1AA]'
            }`}
          >
            Vocal
          </button>
          <button
            onClick={() => setActiveFilter('framing')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              activeFilter === 'framing' 
                ? (isDark ? 'bg-[#27272A] text-[#60A5FA]' : 'bg-[#18181B] text-[#60A5FA]') 
                : 'text-[#64748B] dark:text-[#A1A1AA]'
            }`}
          >
            Framing
          </button>
          <button
            onClick={() => setActiveFilter('storytelling')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              activeFilter === 'storytelling' 
                ? (isDark ? 'bg-[#27272A] text-[#22C55E]' : 'bg-[#18181B] text-[#22C55E]') 
                : 'text-[#64748B] dark:text-[#A1A1AA]'
            }`}
          >
            Story & Pitch
          </button>
          <button
            onClick={() => setActiveFilter('gravitas')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              activeFilter === 'gravitas' 
                ? (isDark ? 'bg-[#27272A] text-[#A78BFA]' : 'bg-[#18181B] text-[#A78BFA]') 
                : 'text-[#64748B] dark:text-[#A1A1AA]'
            }`}
          >
            Gravitas
          </button>
        </div>
      </div>

      {/* Vertical Step-by-Step Skill Tree */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E2DDD4] dark:before:bg-[#27272A]">
        {filteredNodes.map((node, index) => {
          return (
            <div key={node.id} className="relative group">
              
              {/* Timeline Checkpoint Node Indicator */}
              <div className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 ${
                node.completed
                  ? 'bg-[#15803D] border-[#15803D] text-white shadow-xs'
                  : node.unlocked
                  ? 'bg-[#C2410C] border-[#C2410C] text-white shadow-xs'
                  : isDark
                  ? 'bg-[#222226] border-[#3F3F46] text-[#71717A]'
                  : 'bg-white border-[#E2DDD4] text-[#94A3B8]'
              }`}>
                {node.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : node.unlocked ? (
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                ) : (
                  <Lock className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Node Card */}
              <div className={`p-5 rounded-2xl border transition-all ${
                node.completed
                  ? (isDark ? 'bg-[#18181B] border-[#27272A] opacity-90' : 'bg-white border-[#E2DDD4]')
                  : node.unlocked
                  ? (isDark ? 'bg-[#222226] border-[#3F3F46] shadow-sm' : 'bg-white border-[#18181B] shadow-xs')
                  : (isDark ? 'bg-[#18181B]/50 border-[#27272A]/50 opacity-60' : 'bg-[#FAF8F5]/80 border-[#E2DDD4] opacity-60')
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-mono border flex items-center gap-1 ${getCategoryColor(node.category)}`}>
                        {getCategoryIcon(node.category)}
                        <span>{node.category}</span>
                      </span>
                      <span className="text-[11px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
                        Stage {node.stageNumber} • {node.durationMinutes} min
                      </span>
                    </div>

                    <h3 className="font-editorial-heading font-serif font-bold text-base sm:text-lg">
                      {node.skillName}
                    </h3>

                    <p className="text-xs text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
                      {node.description}
                    </p>

                    {/* Rule pill */}
                    <div className={`p-2.5 rounded-xl border text-xs ${
                      isDark ? 'bg-[#18181B] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
                    }`}>
                      <strong className="text-[#C2410C] dark:text-[#FB923C] block text-[10px] uppercase font-mono tracking-wider">
                        Core Execution Rule:
                      </strong>
                      <span className="italic text-inherit">{node.keyRule}</span>
                    </div>
                  </div>

                  {/* Right Action CTA */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#15803D] dark:text-[#22C55E]">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{node.xpReward} XP</span>
                    </div>

                    <button
                      onClick={() => onLaunchNode(node)}
                      disabled={!node.unlocked}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                        node.completed
                          ? (isDark ? 'bg-[#27272A] hover:bg-[#3F3F46] text-[#F4F4F5]' : 'bg-[#F5F2EB] hover:bg-[#EDE9E0] text-[#18181B]')
                          : node.unlocked
                          ? 'bg-[#18181B] hover:bg-black text-[#FAF8F5] shadow-xs'
                          : 'bg-inherit border border-inherit opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span>{node.completed ? 'Review Drill' : 'Start Drill'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
