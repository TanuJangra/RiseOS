import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { CHEAT_SHEETS } from '../data/staticData';

interface CheatSheetsHubProps {
  onOpenSimulatorWithScenario: (scenario: string, prompt: string) => void;
  theme?: 'light' | 'dark';
}

export const CheatSheetsHub: React.FC<CheatSheetsHubProps> = ({
  onOpenSimulatorWithScenario,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCheatSheet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-2 border-b pb-6 border-inherit">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border bg-[#F5F2EB] text-[#C2410C] dark:bg-[#EA580C]/10 dark:text-[#FB923C] border-[#E2DDD4] dark:border-[#EA580C]/20">
          <Layers className="w-3.5 h-3.5" />
          <span>Executive Index Cards</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-editorial-heading font-serif font-bold tracking-tight text-[#18181B] dark:text-[#F4F4F5]">
          Executive Cheatsheets & Index Blueprints
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A1A1AA] max-w-3xl leading-relaxed">
          One-click mental models used by Fortune 500 executives, top negotiators, and keynote speakers. Formatted as bite-sized index cards.
        </p>
      </div>

      {/* Grid of Cheat Sheets */}
      <div className="grid md:grid-cols-2 gap-6">
        {CHEAT_SHEETS.map((sheet) => {
          const isCopied = copiedId === sheet.id;
          const fullTextToCopy = `${sheet.title} (${sheet.acronym})\nTag: ${sheet.tag}\n\nBest Used For: ${sheet.bestUsedFor}\n\nSteps:\n${sheet.steps.map(s => `${s.step}: ${s.desc}\nExample: ${s.example}`).join('\n\n')}\n\nPro Tip: ${sheet.proTip}`;

          return (
            <div
              key={sheet.id}
              className={`rounded-3xl border p-6 sm:p-7 space-y-5 transition-all flex flex-col justify-between ${
                isDark 
                  ? 'bg-[#18181B] border-[#27272A] text-[#F4F4F5]' 
                  : 'bg-white border-[#E2DDD4] text-[#18181B] shadow-2xs'
              }`}
            >
              <div className="space-y-4">
                {/* Card Top Pill & Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border bg-[#F5F2EB] text-[#C2410C] dark:bg-[#EA580C]/10 dark:text-[#FB923C] border-[#E2DDD4] dark:border-[#EA580C]/20">
                      {sheet.acronym}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] dark:text-[#A1A1AA]">
                      {sheet.tag}
                    </span>
                  </div>

                  <button
                    onClick={() => copyCheatSheet(sheet.id, fullTextToCopy)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : isDark
                          ? 'bg-[#222226] hover:bg-[#27272A] border-[#27272A]'
                          : 'bg-[#FAF8F5] hover:bg-[#F5F2EB] border-[#E2DDD4]'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div>
                  <h3 className="font-editorial-heading font-serif font-bold text-xl sm:text-2xl mb-1">
                    {sheet.title}
                  </h3>
                </div>

                {/* When to Use */}
                <div className={`p-3 rounded-2xl border text-xs ${
                  isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
                }`}>
                  <strong className="text-inherit block text-[10px] uppercase font-mono tracking-wider text-[#C2410C] dark:text-[#FB923C] mb-0.5">
                    Best Use Case:
                  </strong>
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">
                    {sheet.bestUsedFor}
                  </span>
                </div>

                {/* Formula Steps */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A1A1AA] block">
                    Execution Steps:
                  </span>
                  <div className="space-y-2">
                    {sheet.steps.map((st, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          isDark ? 'bg-[#18181B] border-[#27272A]' : 'bg-white border-[#E2DDD4]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#F5F2EB] text-[#C2410C] dark:bg-[#EA580C]/20 dark:text-[#FB923C] flex items-center justify-center text-[10px] font-bold shrink-0 font-mono">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-inherit">{st.step}</span>
                        </div>
                        <p className="text-[#52525B] dark:text-[#A1A1AA] pl-6 text-[11px] leading-relaxed">
                          {st.desc}
                        </p>
                        <p className="font-serif italic text-[#2563EB] dark:text-[#60A5FA] pl-6 text-[11px] leading-relaxed">
                          {st.example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tip */}
                <div className={`p-3 rounded-2xl border text-xs ${
                  isDark ? 'bg-[#222226] border-[#27272A]' : 'bg-[#FAF8F5] border-[#E2DDD4]'
                }`}>
                  <strong className="text-inherit block text-[10px] uppercase font-mono tracking-wider text-[#15803D] dark:text-[#22C55E] mb-0.5">
                    Pro Coach Tip:
                  </strong>
                  <span className="text-[#52525B] dark:text-[#A1A1AA]">
                    {sheet.proTip}
                  </span>
                </div>
              </div>

              {/* Bottom Simulator Launcher */}
              <div className="pt-3 border-t border-inherit flex items-center justify-between">
                <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA]">
                  Ready to test with voice?
                </span>

                <button
                  onClick={() => onOpenSimulatorWithScenario(sheet.title, sheet.steps[0]?.example || sheet.bestUsedFor)}
                  className="px-4 py-2 rounded-full bg-[#18181B] dark:bg-white text-white dark:text-[#18181B] hover:opacity-90 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Practice in AI Arena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
