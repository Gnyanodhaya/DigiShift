import React, { useState } from 'react';
import { SMEProfile, PillarScore, ProcessBottleneck, RoadmapMilestone, ExecutiveMemo } from '../types/advisor';
import { generateDeterministicMemo } from '../utils/roadmapEngine';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, Users, ArrowUpRight, RefreshCw, Printer } from 'lucide-react';

interface ExecutiveMemoViewProps {
  profile: SMEProfile;
  overallScore: number;
  pillarScores: PillarScore[];
  bottlenecks: ProcessBottleneck[];
  roadmap: RoadmapMilestone[];
  onOpenExport: () => void;
}

export const ExecutiveMemoView: React.FC<ExecutiveMemoViewProps> = ({
  profile,
  overallScore,
  pillarScores,
  bottlenecks,
  roadmap,
  onOpenExport,
}) => {
  const [memo, setMemo] = useState<ExecutiveMemo>(() =>
    generateDeterministicMemo(profile, overallScore, pillarScores, bottlenecks, roadmap)
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiGenerated, setAiGenerated] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setErrorNotice(null);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          maturityScores: pillarScores,
          bottlenecks: bottlenecks.slice(0, 5),
          currentRoadmap: roadmap.slice(0, 4),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (data.fallback) {
        // Fallback flag returned by server if no key
        const freshDeterministic = generateDeterministicMemo(profile, overallScore, pillarScores, bottlenecks, roadmap);
        setMemo(freshDeterministic);
        setErrorNotice('Server operated in offline advisory mode. Local business intelligence rules applied.');
      } else if (data.advisorMemo) {
        setMemo(data.advisorMemo);
        setAiGenerated(true);
      }
    } catch (err: any) {
      console.warn('AI call failed, applying deterministic expert engine:', err);
      const fallbackMemo = generateDeterministicMemo(profile, overallScore, pillarScores, bottlenecks, roadmap);
      setMemo(fallbackMemo);
      setErrorNotice('Connected to local deterministic advisory engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Confidential Executive Advisory Memo
              </span>
              {aiGenerated && (
                <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini 3.8 Flash Synthesized
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white font-sans mt-0.5">
              Strategic Transformation Brief for {profile.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prepared for CEO / Managing Director · Digital Maturity: {overallScore}/100
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize with Gemini AI</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
          </div>
        </div>

        {errorNotice && (
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-200 dark:border-slate-700">
            {errorNotice}
          </div>
        )}
      </div>

      {/* Main Memo Layout */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xs space-y-8">
        {/* Memo Header Strip */}
        <div className="pb-5 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Entity</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Sector Archetype</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.industry}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Operating Scale</span>
            <span className="font-bold text-slate-900 dark:text-white">{profile.employees} Staff · {profile.revenue}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Annual Recapturable Value</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{memo.estimatedAnnualSavings}</span>
          </div>
        </div>

        {/* 1. Executive Diagnosis */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
            <span>01. Executive Diagnosis & Maturity Assessment</span>
          </h3>
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            {memo.executiveDiagnosis}
          </div>
        </div>

        {/* 2. Top Strategic Risks */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
            <span>02. Top Operational & Financial Risks of Inaction</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {memo.topStrategicRisks.map((risk, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs">
                <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Risk 0{idx + 1}</span>
                </div>
                <p className="text-rose-950 dark:text-rose-200 leading-relaxed text-[11px]">
                  {risk}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. High Impact Recommendations & Change Management */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
            <span>03. High-Impact Strategic Initiatives</span>
          </h3>
          <div className="space-y-3">
            {memo.highImpactRecommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 dark:bg-indigo-600 text-white">
                      {rec.priority}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{rec.initiative}</h4>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums text-[11px]">
                    +{rec.estimatedHoursSavedWeekly} hrs/wk saved
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {rec.rationale}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Recommended Tools</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {rec.recommendedTools.map((t, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-mono text-[10px] text-slate-800 dark:text-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Tools to Avoid</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {rec.toolsToAvoid.map((a, aIdx) => (
                        <span key={aIdx} className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 font-mono text-[10px] text-amber-900 dark:text-amber-300">
                          ✕ {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Change Management Tip:</span> {rec.changeManagementTip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Quick-Win 90-Day Action Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span>04. 90-Day Action Checklist</span>
            </h3>
            <div className="space-y-2">
              {memo.quickWinActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
              <span>05. Cultural Change & Employee Buy-In Playbook</span>
            </h3>
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200 font-bold">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Overcoming Tech Anxiety</span>
              </div>
              <p className="text-indigo-900 dark:text-indigo-300 leading-relaxed text-[11px]">
                {memo.culturalChangePlaybook}
              </p>
              <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-medium pt-1">
                Rule of Thumb: Never penalize an employee for initial software mistakes during the first 30 days of migration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
