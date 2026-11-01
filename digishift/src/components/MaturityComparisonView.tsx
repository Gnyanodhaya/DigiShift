import React, { useState } from 'react';
import {
  PillarScore,
  SMEProfile,
  RoadmapMilestone,
  ProjectedMaturityState,
} from '../types/advisor';
import { calculateProjectedMaturityScores } from '../utils/roadmapEngine';
import { RadarChart } from './RadarChart';
import { ComparisonChart } from './ComparisonChart';
import {
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Package,
  DollarSign,
  Users,
  Briefcase,
  SlidersHorizontal,
  BarChart3,
} from 'lucide-react';

interface MaturityComparisonViewProps {
  pillarScores: PillarScore[];
  overallScore: number;
  profile: SMEProfile;
  roadmap: RoadmapMilestone[];
  onNavigateToRoadmap: () => void;
  onNavigateToDiagnostic: () => void;
}

const PILLAR_ICONS: Record<string, React.ReactNode> = {
  customer_sales: <Users className="w-4 h-4" />,
  operations_supply: <Package className="w-4 h-4" />,
  financials_admin: <DollarSign className="w-4 h-4" />,
  workforce_collab: <Briefcase className="w-4 h-4" />,
  data_security: <ShieldCheck className="w-4 h-4" />,
};

export const MaturityComparisonView: React.FC<MaturityComparisonViewProps> = ({
  pillarScores,
  overallScore,
  profile,
  roadmap,
  onNavigateToRoadmap,
  onNavigateToDiagnostic,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'phase1' | 'phase2' | 'full'>('full');
  const [showBaselineOverlay, setShowBaselineOverlay] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'chart' | 'cards' | 'table'>('chart');

  const projectedState: ProjectedMaturityState = calculateProjectedMaturityScores(
    pillarScores,
    overallScore,
    roadmap,
    selectedHorizon,
    profile.avgHourlyWage
  );

  const projectedScoresArray = projectedState.pillars.map((p) => ({
    pillarId: p.pillarId,
    score: p.projectedScore,
  }));

  const horizonOptions = [
    {
      id: 'phase1' as const,
      label: 'Post-Phase 1',
      timeframe: 'Month 3',
      subtitle: 'Foundations & Invoicing',
    },
    {
      id: 'phase2' as const,
      label: 'Post-Phase 2',
      timeframe: 'Month 8',
      subtitle: 'Core Integration & Barcoding',
    },
    {
      id: 'full' as const,
      label: 'Full Target State',
      timeframe: 'Month 14',
      subtitle: 'Scalable Automation & BI',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Horizon Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Transformation Projection Model
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Baseline vs Projected Modernization
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white font-sans mt-0.5">
              Digital Maturity Progression: {profile.name}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate organizational leap across 5 pillars as each roadmap phase is executed.
            </p>
          </div>

          {/* Horizon Selector (Segmented buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
            {horizonOptions.map((opt) => {
              const isSelected = selectedHorizon === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedHorizon(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="block">{opt.label}</span>
                  <span className="block text-[9px] font-mono text-slate-500 dark:text-slate-400 font-normal">
                    {opt.timeframe}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ascension Summary Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2.5 sm:pt-3">
          <div className="bg-slate-50/70 dark:bg-slate-800/50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Maturity Ascension
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 line-through">
                {overallScore}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {projectedState.projectedOverallScore}
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/80">
                +{projectedState.overallDelta} pts
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Target: <span className="font-bold text-slate-800 dark:text-slate-200">{projectedState.projectedStage.badge}</span>
            </div>
          </div>

          <div className="bg-slate-50/70 dark:bg-slate-800/50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Timeframe & Milestone
            </span>
            <div className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {projectedState.timeframe}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedHorizon === 'phase1' ? 'Quick Wins deployed' : selectedHorizon === 'phase2' ? 'Integrations active' : 'Full automation live'}
            </div>
          </div>

          <div className="bg-slate-50/70 dark:bg-slate-800/50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Cumulative Hours Saved
            </span>
            <div className="mt-0.5 text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {projectedState.annualHoursSavedCumulative.toLocaleString()} hrs / yr
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Reclaimed back into customer value
            </div>
          </div>

          <div className="bg-slate-50/70 dark:bg-slate-800/50 p-2.5 sm:p-3 rounded-lg border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Cumulative Value Recaptured
            </span>
            <div className="mt-0.5 text-xs sm:text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
              ${projectedState.annualValueRecapturedCumulative.toLocaleString()} / yr
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              At ${profile.avgHourlyWage}/hr blended wage
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparison Section: Split Radar + Transformation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left 5 Cols: Dual Radar Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Baseline vs Projected Radar
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Visualizing capacity expansion per pillar
              </p>
            </div>

            {/* Toggle Overlay checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showBaselineOverlay}
                onChange={(e) => setShowBaselineOverlay(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
              />
              <span>Overlay Baseline</span>
            </label>
          </div>

          <div className="py-1">
            <RadarChart
              pillarScores={pillarScores}
              projectedScores={projectedScoresArray}
              showBaseline={showBaselineOverlay}
              showProjected={true}
              showBenchmark={true}
              size={270}
            />
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700 space-y-1 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Strategic Takeaway:
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Implementing {projectedState.horizonLabel.toLowerCase()} expands the organization's envelope past the peer benchmark in all 5 pillars, turning historic bottlenecks (manual invoicing, clipboard travelers) into competitive advantages.
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Pillar-by-Pillar Lift Cards */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pillar Progression & Capabilities Unlocked
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed delta between baseline and projected post-adoption state
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Comparison Chart</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  viewMode === 'cards' ? 'bg-slate-900 dark:bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  viewMode === 'table' ? 'bg-slate-900 dark:bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Data Grid
              </button>
            </div>
          </div>

          {viewMode === 'chart' ? (
            <div className="pt-1">
              <ComparisonChart
                pillarScores={pillarScores}
                projectedScores={projectedScoresArray}
                overallScore={overallScore}
                projectedOverallScore={projectedState.projectedOverallScore}
              />
            </div>
          ) : viewMode === 'cards' ? (
            <div className="space-y-3">
              {projectedState.pillars.map((pillar) => (
                <div
                  key={pillar.pillarId}
                  className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200">
                        {PILLAR_ICONS[pillar.pillarId]}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{pillar.name}</h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{pillar.baselineStage}</span>
                          <span>→</span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{pillar.projectedStage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{pillar.baselineScore}</span>
                        <span className="text-slate-400 text-[11px]">→</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {pillar.projectedScore}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/80">
                          +{pillar.delta}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                        Peer Median: {pillar.peerBenchmark}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Dual Visual */}
                  <div className="mt-3 relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    {/* Baseline Bar */}
                    <div
                      style={{ width: `${pillar.baselineScore}%` }}
                      className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full z-10"
                    />
                    {/* Projected Lift Bar */}
                    <div
                      style={{ width: `${pillar.projectedScore}%` }}
                      className="absolute left-0 top-0 bottom-0 bg-emerald-500 rounded-full opacity-80"
                    />
                  </div>

                  {/* Unlocked Capabilities */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                      Capabilities Unlocked in this Horizon:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                      {pillar.unlockedCapabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table Mode */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Pillar</th>
                    <th className="py-2.5 px-3 text-center">Baseline</th>
                    <th className="py-2.5 px-3 text-center">Peer Median</th>
                    <th className="py-2.5 px-3 text-center">Projected</th>
                    <th className="py-2.5 px-3 text-right">Lift</th>
                    <th className="py-2.5 px-3 text-right">% Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {projectedState.pillars.map((p) => (
                    <tr key={p.pillarId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                        {p.name}
                      </td>
                      <td className="py-2.5 px-3 text-center text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                        {p.baselineScore}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400 tabular-nums">
                        {p.peerBenchmark}
                      </td>
                      <td className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                        {p.projectedScore}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        +{p.delta}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                        +{p.percentageLift}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                    <td className="py-2.5 px-3 font-sans text-slate-900 dark:text-white">Overall Maturity Index</td>
                    <td className="py-2.5 px-3 text-center text-indigo-600 dark:text-indigo-400 tabular-nums">{overallScore}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500 dark:text-slate-400 tabular-nums">50</td>
                    <td className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400 tabular-nums">{projectedState.projectedOverallScore}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 tabular-nums">+{projectedState.overallDelta}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white tabular-nums">
                      +{Math.round((projectedState.overallDelta / (overallScore || 1)) * 100)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={onNavigateToDiagnostic}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
            >
              ← Back to Diagnostic Questions
            </button>
            <button
              onClick={onNavigateToRoadmap}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-white bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>View Milestone Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
