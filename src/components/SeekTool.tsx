import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Check, 
  Copy, 
  Volume2, 
  ArrowRight, 
  RefreshCw, 
  Lightbulb, 
  UserCheck
} from 'lucide-react';
import { SeekResult, UserProfile } from '../types';
import { SEEK_PRESET_QUERIES } from '../data/staticData';
import { speakText } from '../utils/speechUtils';

interface SeekToolProps {
  userProfile: UserProfile;
  onOpenSimulatorWithScenario: (scenario: string, prompt: string) => void;
}

export const SeekTool: React.FC<SeekToolProps> = ({
  userProfile,
  onOpenSimulatorWithScenario,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seekResult, setSeekResult] = useState<SeekResult | null>(null);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Communication & Charisma',
    'Negotiation & Pushback',
    'Public Speaking & Pitching',
    'Memory & Mental Agility',
    'Executive Presence'
  ];

  const handleSearch = async (queryToSearch?: string) => {
    const q = queryToSearch || searchQuery;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/seek-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          category: activeCategory !== 'All' ? activeCategory : undefined,
          field: userProfile.field
        })
      });

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSeekResult(data);
    } catch (err) {
      console.error('SEEK query error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyScript = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200 font-editorial-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-white via-[#FAF8F5] to-[#F3EFE6] text-[#18181B] rounded-3xl p-6 sm:p-10 border border-[#E2DDD4] shadow-xs relative overflow-hidden">
        {/* Subtle Ink Wash Seal */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-[#C2410C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F2EB] text-[#C2410C] text-[10px] font-bold uppercase tracking-[0.15em] border border-[#E2DDD4]">
            <Search className="w-3 h-3" />
            <span>SEEK Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-editorial-heading font-serif font-bold tracking-tight text-[#18181B]">
            Curated Expert Wisdom & Battle-Tested Frameworks
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
            Unlike generic search engines that return bloated web text, SEEK pulls precise distilled principles, books by master communicators, video blueprint masterclasses, and word-for-word scripts.
          </p>

          {/* Search Input Box */}
          <div className="pt-4 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ask anything: e.g. How to introduce myself in 30s? How to push back on a deadline?"
                className="w-full pl-11 pr-4 py-3 bg-white text-[#18181B] rounded-2xl border border-[#E2DDD4] text-sm focus:outline-none focus:border-[#C2410C] placeholder:text-[#94A3B8] shadow-2xs"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50 transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting Wisdom...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#FB923C]" />
                  <span>SEEK Insight</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-6 flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#18181B] text-white'
                  : 'bg-white/80 text-[#52525B] hover:text-[#18181B] hover:bg-white border border-[#E2DDD4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Curated Prompts */}
      {!seekResult && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#18181B] font-bold text-sm">
            <BookOpen className="w-4 h-4 text-[#C2410C]" />
            <span className="font-editorial-heading font-serif">Popular Expert Insights to Explore</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {SEEK_PRESET_QUERIES.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSearchQuery(preset.query);
                  handleSearch(preset.query);
                }}
                className="p-6 rounded-3xl bg-white border border-[#E2DDD4] hover:border-[#18181B] hover:shadow-2xs transition-all cursor-pointer group space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5F2EB] text-[#C2410C] border border-[#E2DDD4]">
                    {preset.category}
                  </span>
                  <span className="text-xs text-[#64748B] flex items-center gap-1 group-hover:text-[#18181B] transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <h3 className="font-editorial-heading font-serif font-bold text-base text-[#18181B] group-hover:text-[#C2410C] transition-colors">
                  {preset.query}
                </h3>

                <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>

                <div className="text-[11px] text-[#64748B] flex items-center gap-1 pt-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Curated from: <strong className="text-[#18181B]">{preset.expert}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEEK Result Container */}
      {seekResult && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Result Main Card */}
          <div className="bg-white rounded-3xl border border-[#E2DDD4] p-6 sm:p-8 shadow-2xs space-y-6">
            
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EDE9E0] pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Expert Synthesis
                </span>
                <h2 className="text-xl sm:text-2xl font-editorial-heading font-serif font-bold text-[#18181B]">
                  {seekResult.title}
                </h2>
              </div>

              <button
                onClick={() => speakText(`${seekResult.title}. ${seekResult.coreSummary}`)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] text-xs font-semibold hover:bg-[#EAE5DB] transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#C2410C]" />
                <span>Audio Summary</span>
              </button>
            </div>

            {/* Core Essence */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] text-[#18181B] text-sm sm:text-base leading-relaxed font-serif italic">
              "{seekResult.coreSummary}"
            </div>

            {/* Expert Citations */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Primary Expert Authors & Reference Sources
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {seekResult.primaryExperts.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E2DDD4] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-editorial-heading font-serif font-bold text-[#18181B]">{exp.name}</span>
                      <span className="text-[10px] text-[#52525B] bg-white px-2 py-0.5 rounded border border-[#E2DDD4]">{exp.source}</span>
                    </div>
                    <p className="text-xs text-[#52525B] italic font-serif">
                      Rule: "{exp.keyRule}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mental Model & Tactical Steps */}
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Mental Model */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-[#FAF8F5] to-[#F5F2EB] text-[#18181B] space-y-3 border border-[#E2DDD4] shadow-xs">
                <div className="flex items-center gap-2 text-[#C2410C] font-bold text-[10px] uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4" />
                  <span>Mental Model: {seekResult.mentalModel.name}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                  {seekResult.mentalModel.howItWorks}
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#E2DDD4] text-xs text-[#18181B]">
                  <strong className="text-[#C2410C]">Practical Application:</strong> {seekResult.mentalModel.exampleApplication}
                </div>
              </div>

              {/* Tactical Action Steps */}
              <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD4] space-y-3">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Actionable Steps to Execute
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-[#18181B]">
                  {seekResult.tacticalSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 font-mono">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Word-for-Word Scripts */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#15803D]" />
                <span>Word-for-Word Battle-Tested Scripts</span>
              </h3>

              <div className="space-y-3">
                {seekResult.wordForWordScripts.map((scr, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E2DDD4] space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18181B]">
                        Situation: {scr.situation}
                      </span>
                      <button
                        onClick={() => copyScript(scr.script, idx)}
                        className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#F5F2EB] text-[#18181B] border border-[#E2DDD4] hover:bg-[#EAE5DB] transition-colors cursor-pointer"
                      >
                        {copiedScriptIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-[#15803D]" />
                            <span className="text-[#15803D] font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-sm font-serif font-medium text-[#18181B] italic bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E2DDD4]">
                      "{scr.script}"
                    </p>

                    <p className="text-[11px] text-[#52525B]">
                      <strong className="text-[#18181B]">Psychological Why:</strong> {scr.psychologicalReason}
                    </p>

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => onOpenSimulatorWithScenario(scr.situation, `Deliver this response naturally: "${scr.script}"`)}
                        className="text-xs text-[#C2410C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Practice This in Simulator</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Video Masterclass Blueprint */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-[#FAF8F5] to-[#F3EFE6] text-[#18181B] space-y-4 border border-[#E2DDD4] shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DDD4] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#C2410C] text-white flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#C2410C] font-bold uppercase tracking-wider block">
                      Curated Video Masterclass Breakdown
                    </span>
                    <h4 className="text-sm sm:text-base font-editorial-heading font-serif font-bold text-[#18181B]">
                      {seekResult.curatedVideoBlueprint.videoTitle}
                    </h4>
                  </div>
                </div>

                <div className="text-xs text-[#64748B]">
                  <span>Speaker: <strong className="text-[#18181B]">{seekResult.curatedVideoBlueprint.recommendedSpeaker}</strong></span>
                  <span className="mx-2">•</span>
                  <span>Duration: {seekResult.curatedVideoBlueprint.estimatedDuration}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#64748B] uppercase block">
                  Key Video Timestamp Takeaways:
                </span>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {seekResult.curatedVideoBlueprint.keyTimestampBreakdowns.map((tb, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-[#E2DDD4] text-xs space-y-1">
                      <span className="px-2 py-0.5 rounded bg-[#F5F2EB] text-[#C2410C] font-mono text-[10px] font-bold inline-block">
                        {tb.timestamp}
                      </span>
                      <strong className="block text-[#18181B] font-semibold">{tb.topic}</strong>
                      <p className="text-[11px] text-[#52525B]">{tb.takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
