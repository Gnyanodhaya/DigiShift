import React from 'react';
import { MaturityPillarId, PillarScore } from '../types/advisor';
import { PILLARS_CONFIG } from '../data/maturityFramework';
import {
  Users,
  Package,
  DollarSign,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ComparisonChartProps {
  pillarScores: PillarScore[];
  projectedScores?: { pillarId: MaturityPillarId; score: number }[];
  selectedPillarId?: MaturityPillarId;
  onSelectPillar?: (pillarId: MaturityPillarId) => void;
  overallScore?: number;
  projectedOverallScore?: number;
  isCompact?: boolean;
}

const PILLAR_ICONS: Record<MaturityPillarId, React.ReactNode> = {
  customer_sales: <Users className="w-3.5 h-3.5" />,
  operations_supply: <Package className="w-3.5 h-3.5" />,
  financials_admin: <DollarSign className="w-3.5 h-3.5" />,
  workforce_collab: <Briefcase className="w-3.5 h-3.5" />,
  data_security: <ShieldCheck className="w-3.5 h-3.5" />,
};

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  pillarScores,
  projectedScores,
  selectedPillarId,
  onSelectPillar,
  overallScore = 27,
  projectedOverallScore,
  isCompact = false,
}) => {
  // If projectedOverallScore isn't explicitly supplied, compute average projected
  const computedProjectedOverall = projectedOverallScore ?? (
    projectedScores && projectedScores.length > 0
      ? Math.round(
          projectedScores.reduce((acc, p) => acc + p.score, 0) / projectedScores.length
        )
      : Math.min(100, overallScore + 25)
  );

  const overallDelta = Math.max(0, computedProjectedOverall - overallScore);

  return (
    <div className="space-y-3 select-none">
      {/* Ascension Header Banner */}
      <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] block">
              Maturity Ascension
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Phased roadmap modernization
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="text-slate-500 dark:text-slate-400 text-xs line-through font-semibold">
            {overallScore}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {computedProjectedOverall}/100
          </span>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/80">
            +{overallDelta} pts
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] px-1 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 shrink-0" />
            <span className="font-medium text-emerald-700 dark:text-emerald-300">Projected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-t border-dashed border-slate-400 dark:border-slate-500 shrink-0" />
            <span>Peer Benchmark</span>
          </div>
        </div>
        <span className="font-mono text-[9px] text-slate-400">Scale: 0 - 100</span>
      </div>

      {/* Grouped Comparison Bars for each Pillar */}
      <div className="space-y-2 pt-1">
        {pillarScores.map((p) => {
          const match = projectedScores?.find((proj) => proj.pillarId === p.pillarId);
          // If no specific match found, fallback to +20-25 score lift
          const projectedScore = match ? match.score : Math.min(100, p.score + 24);
          const delta = projectedScore - p.score;
          const isSelected = selectedPillarId === p.pillarId;
          const benchmark = p.peerBenchmark;
          const beatsPeer = projectedScore >= benchmark;

          return (
            <div
              key={p.pillarId}
              onClick={() => onSelectPillar && onSelectPillar(p.pillarId)}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/60 dark:bg-slate-800 border-indigo-500/80 ring-1 ring-indigo-500/30'
                  : 'bg-white/60 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/70'
              }`}
            >
              {/* Pillar Title and Scores */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <span className={isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}>
                    {PILLAR_ICONS[p.pillarId]}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {p.name.split('&')[0].trim()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] shrink-0">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold tabular-nums">
                    {p.score}
                  </span>
                  <span className="text-slate-400 text-[10px]">→</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {projectedScore}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-200/80 dark:border-emerald-800/60 tabular-nums">
                    +{delta}
                  </span>
                </div>
              </div>

              {/* Grouped Visual Bars with Peer Benchmark Marker */}
              <div className="relative pt-1 pb-0.5 space-y-1">
                {/* 1. Baseline Bar (Indigo) */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 w-6 shrink-0 text-right">
                    Base
                  </span>
                  <div className="flex-1 relative h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(4, p.score))}%` }}
                      className="absolute top-0 bottom-0 left-0 bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 dark:text-slate-300 w-7 shrink-0 text-right font-semibold">
                    {p.score}%
                  </span>
                </div>

                {/* 2. Projected Bar (Emerald) */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 w-6 shrink-0 text-right font-semibold">
                    Proj
                  </span>
                  <div className="flex-1 relative h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(4, projectedScore))}%` }}
                      className="absolute top-0 bottom-0 left-0 bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 w-7 shrink-0 text-right font-bold">
                    {projectedScore}%
                  </span>
                </div>

                {/* Benchmark Guide line & Label indicator */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 pt-0.5 px-7">
                  <span>Peer Benchmark: <strong className="text-slate-600 dark:text-slate-300 font-mono">{benchmark}%</strong></span>
                  <span className={`font-semibold ${beatsPeer ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {beatsPeer ? '✓ Exceeds Peer Median' : 'Approaching Peer'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Takeaway */}
      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>Click any pillar to assess & answer rubric</span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">5 of 5 Modernized</span>
      </div>
    </div>
  );
};
