import React, { useState } from 'react';
import { MaturityPillarId, PillarScore } from '../types/advisor';
import { MATURITY_QUESTIONS, PILLARS_CONFIG, getMaturityStage } from '../data/maturityFramework';
import { RadarChart } from './RadarChart';
import { ComparisonChart } from './ComparisonChart';
import {
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Users,
  Package,
  DollarSign,
  Briefcase,
  ShieldCheck,
  BarChart3,
  Compass,
} from 'lucide-react';

interface MaturityDiagnosticProps {
  answers: Record<string, number>;
  onAnswerChange: (questionId: string, level: number) => void;
  pillarScores: PillarScore[];
  projectedScores?: { pillarId: MaturityPillarId; score: number }[];
  overallScore: number;
  maturityStage: ReturnType<typeof getMaturityStage>;
  onProceedToBottlenecks: () => void;
  onNavigateToComparison: () => void;
}

const PILLAR_ICONS: Record<MaturityPillarId, React.ReactNode> = {
  customer_sales: <Users className="w-4 h-4" />,
  operations_supply: <Package className="w-4 h-4" />,
  financials_admin: <DollarSign className="w-4 h-4" />,
  workforce_collab: <Briefcase className="w-4 h-4" />,
  data_security: <ShieldCheck className="w-4 h-4" />,
};

export const MaturityDiagnostic: React.FC<MaturityDiagnosticProps> = ({
  answers,
  onAnswerChange,
  pillarScores,
  projectedScores,
  overallScore,
  maturityStage,
  onProceedToBottlenecks,
  onNavigateToComparison,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<MaturityPillarId>('customer_sales');
  const [previewProjected, setPreviewProjected] = useState<boolean>(false);
  const [visualMode, setVisualMode] = useState<'radar' | 'comparison'>('radar');

  const currentQuestions = MATURITY_QUESTIONS.filter((q) => q.pillarId === selectedPillarId);
  const currentPillarMeta = PILLARS_CONFIG.find((p) => p.id === selectedPillarId)!;
  const currentPillarScore = pillarScores.find((p) => p.pillarId === selectedPillarId)!;

  return (
    <div className="space-y-4">
      {/* Top Section: Overview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left: Radar Chart or Comparison Chart & Peer Benchmarks */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs transition-colors overflow-hidden">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {visualMode === 'radar' ? '5-Pillar Maturity Radar' : 'Maturity Comparison Chart'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {visualMode === 'radar' ? 'Benchmarked against industry SME peers' : 'Baseline vs projected post-roadmap lift'}
              </p>
            </div>

            {/* Visual View Switcher (Radar vs Comparison Chart) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs shrink-0">
              <button
                type="button"
                onClick={() => setVisualMode('radar')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  visualMode === 'radar'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="View Radar Envelope"
              >
                <Compass className="w-3 h-3" />
                <span className="hidden sm:inline">Radar</span>
              </button>
              <button
                type="button"
                onClick={() => setVisualMode('comparison')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  visualMode === 'comparison'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="View Baseline vs Projected Comparison Chart"
              >
                <BarChart3 className="w-3 h-3" />
                <span>Comparison</span>
              </button>
            </div>
          </div>

          {visualMode === 'radar' ? (
            <>
              {/* Quick toggle between Baseline and Projected State on Radar */}
              <div className="flex items-center justify-between gap-1.5 mt-2.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewProjected(false)}
                  className={`flex-1 py-1 rounded font-semibold transition-colors ${
                    !previewProjected
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Current Baseline
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewProjected(true)}
                  className={`flex-1 py-1 rounded font-semibold transition-colors ${
                    previewProjected
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  + Projected Lift
                </button>
              </div>

              <div className="py-1">
                <RadarChart
                  pillarScores={pillarScores}
                  projectedScores={projectedScores}
                  showBaseline={true}
                  showProjected={previewProjected}
                  showBenchmark={true}
                  size={270}
                />
              </div>

              <div className="flex items-center justify-between pt-1.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">
                  {previewProjected ? 'Showing projected adoption envelope' : 'Compare baseline vs target horizon'}
                </span>
                <button
                  onClick={onNavigateToComparison}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Full Comparison View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Pillar Scorecards */}
              <div className="mt-2.5 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                {pillarScores.map((p) => {
                  const diff = p.score - p.peerBenchmark;
                  const isSelected = p.pillarId === selectedPillarId;
                  return (
                    <button
                      key={p.pillarId}
                      onClick={() => setSelectedPillarId(p.pillarId)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between gap-2.5 text-xs border ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={isSelected ? 'text-indigo-300 dark:text-white' : 'text-slate-500 dark:text-slate-400'}>
                          {PILLAR_ICONS[p.pillarId]}
                        </span>
                        <span className="font-semibold truncate">{p.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono">
                        <span className="tabular-nums font-bold">
                          {p.score}
                        </span>
                        <span className={`text-[10px] tabular-nums ${
                          diff >= 0
                            ? isSelected ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'
                            : isSelected ? 'text-rose-300' : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {diff >= 0 ? `+${diff}` : diff}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Dedicated Baseline vs Projected Comparison Chart */
            <div className="mt-2.5">
              <ComparisonChart
                pillarScores={pillarScores}
                projectedScores={projectedScores}
                selectedPillarId={selectedPillarId}
                onSelectPillar={setSelectedPillarId}
                overallScore={overallScore}
              />
            </div>
          )}
        </div>

        {/* Right: Interactive Questionnaire for selected pillar */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs transition-colors">
          {/* Pillar Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 border-b border-slate-100 dark:border-slate-800 scrollbar-none">
            {PILLARS_CONFIG.map((pillar) => {
              const isSelected = pillar.id === selectedPillarId;
              const scoreObj = pillarScores.find((p) => p.pillarId === pillar.id);
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {PILLAR_ICONS[pillar.id]}
                  <span>{pillar.name.split('&')[0].trim()}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    isSelected ? 'bg-indigo-700 dark:bg-indigo-700 text-indigo-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {scoreObj?.score ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Pillar Header */}
          <div className="mt-2.5 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white font-sans">
                  {currentPillarMeta.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentPillarMeta.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Pillar Score</span>
                <div className="text-base sm:text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {currentPillarScore.score}/100
                </div>
              </div>
            </div>
          </div>

          {/* Questions for Current Pillar */}
          <div className="space-y-3.5">
            {currentQuestions.map((question, qIdx) => {
              const currentLevel = answers[question.id] || 2;
              return (
                <div key={question.id} className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                      0{qIdx + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {question.question}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {question.context}
                      </p>
                    </div>
                  </div>

                  {/* 5-Level Rubric Selection Cards */}
                  <div className="grid grid-cols-1 gap-1.5 mt-2">
                    {question.options.map((opt) => {
                      const isOptionSelected = currentLevel === opt.level;
                      return (
                        <button
                          key={opt.level}
                          type="button"
                          onClick={() => onAnswerChange(question.id, opt.level)}
                          className={`w-full text-left p-2 sm:p-2.5 rounded-lg transition-all border flex items-start gap-2.5 ${
                            isOptionSelected
                              ? 'bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs'
                              : 'bg-white/80 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isOptionSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isOptionSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-xs font-bold ${
                                isOptionSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                Level {opt.level}: {opt.title}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                                {opt.scoreWeight} pts
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                              {opt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Answers automatically recalibrate the Bottleneck Engine & Roadmap
            </div>
            <button
              onClick={onProceedToBottlenecks}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <span>Analyze Bottlenecks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
