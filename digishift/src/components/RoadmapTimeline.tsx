import React, { useState } from 'react';
import { RoadmapMilestone, SMEProfile } from '../types/advisor';
import { Calendar, Layers, CheckCircle2, AlertOctagon, ArrowRight, ShieldAlert, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface RoadmapTimelineProps {
  roadmap: RoadmapMilestone[];
  profile: SMEProfile;
  onProceedToROI: () => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  profile,
  onProceedToROI,
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(roadmap[0]?.id || '');
  const [implementationPace, setImplementationPace] = useState<'standard' | 'accelerated' | 'conservative'>('standard');

  const filteredRoadmap = selectedPhaseFilter === 'all'
    ? roadmap
    : roadmap.filter((m) => m.phase === selectedPhaseFilter);

  const activeMilestone = roadmap.find((m) => m.id === activeMilestoneId) || roadmap[0];

  const totalMonthlyCost = roadmap.reduce((acc, m) => acc + m.estimatedCostMonthly, 0);
  const totalHoursReclaimed = roadmap.reduce((acc, m) => acc + m.expectedWeeklyHoursSaved, 0);

  // Month columns for Gantt (1 to 14)
  const totalMonths = 14;
  const monthLabels = [
    'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14'
  ];

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white font-sans">
              Phased Technology Adoption Roadmap
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Structured into 3 achievable horizons to avoid operational disruption and overwhelming non-technical staff.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Total Target Reclaimed</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">{totalHoursReclaimed} hrs / week</span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Steady-State SaaS</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">${totalMonthlyCost}/mo</span>
            </div>
          </div>
        </div>

        {/* Phase Filter & Implementation Pace Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 shrink-0">Horizon:</span>
            {[
              { id: 'all', label: 'All Horizons (M1-14)' },
              { id: 1, label: 'Phase 1: Quick Wins (M1-3)' },
              { id: 2, label: 'Phase 2: Integration (M4-8)' },
              { id: 3, label: 'Phase 3: Intelligence (M9-14)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedPhaseFilter(tab.id as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  selectedPhaseFilter === tab.id
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Adoption Pace:</span>
            <div className="p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center">
              {(['standard', 'accelerated', 'conservative'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setImplementationPace(p)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                    implementationPace === p ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Timeline View */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs overflow-x-auto transition-colors">
        <div className="min-w-[720px]">
          {/* Timeline Header Months */}
          <div className="grid grid-cols-12 gap-1 pb-2 border-b border-slate-200 dark:border-slate-800 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <div className="col-span-4 text-left font-sans font-bold text-slate-700 dark:text-slate-200 text-xs pl-2">
              Modernization Initiative
            </div>
            <div className="col-span-8 grid grid-cols-14 text-center">
              {monthLabels.map((m) => (
                <div key={m} className="border-l border-slate-100 dark:border-slate-800 text-[10px]">
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Phase 1, 2, 3 rows */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {filteredRoadmap.map((milestone) => {
              const isSelected = activeMilestone?.id === milestone.id;

              // Calculate start col and span
              const startOffset = Math.max(0, milestone.startMonth - 1);
              const duration = milestone.durationMonths;
              const leftPercent = (startOffset / totalMonths) * 100;
              const widthPercent = (duration / totalMonths) * 100;

              return (
                <div
                  key={milestone.id}
                  onClick={() => setActiveMilestoneId(milestone.id)}
                  className={`grid grid-cols-12 gap-1 py-3 items-center cursor-pointer transition-colors rounded-lg px-2 ${
                    isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {/* Left Label */}
                  <div className="col-span-4 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        milestone.phase === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : milestone.phase === 2
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        P{milestone.phase}
                      </span>
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {milestone.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {milestone.category} · saves {milestone.expectedWeeklyHoursSaved}h/wk
                    </div>
                  </div>

                  {/* Gantt Bar View */}
                  <div className="col-span-8 relative h-7 bg-slate-50 rounded-md border border-slate-100 overflow-hidden flex items-center">
                    {/* Vertical month guide lines */}
                    <div className="absolute inset-0 grid grid-cols-14 pointer-events-none">
                      {monthLabels.map((_, i) => (
                        <div key={i} className="border-r border-slate-200/50 h-full" />
                      ))}
                    </div>

                    {/* Milestone Bar */}
                    <div
                      style={{
                        left: `${leftPercent}%`,
                        width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                      }}
                      className={`absolute h-5 rounded-md px-2 flex items-center justify-between text-[10px] font-bold text-white shadow-xs transition-all ${
                        milestone.phase === 1
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : milestone.phase === 2
                          ? 'bg-indigo-600 hover:bg-indigo-700'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      <span className="truncate">{milestone.timeframe}</span>
                      <span className="hidden sm:inline font-mono tabular-nums text-[9px] bg-black/20 px-1 rounded">
                        +{milestone.expectedWeeklyHoursSaved}h/wk
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Milestone Deep Dive Card */}
      {activeMilestone && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  {activeMilestone.phaseName}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeMilestone.timeframe}</span>
              </div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white font-sans mt-0.5">
                {activeMilestone.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Weekly Labor Saved</span>
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {activeMilestone.expectedWeeklyHoursSaved} hrs / week
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
            {/* Left 7 cols: Objective, Stack & Success KPI */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Initiative Scope & Outcome
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeMilestone.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Recommended SME Software Stack
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeMilestone.recommendedStack.map((tool, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{tool.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{tool.type}</div>
                      <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">
                        {tool.monthlyPricePerUser}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Success Measurement KPI</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                  {activeMilestone.successKpi}
                </p>
              </div>
            </div>

            {/* Right 5 cols: Pitfalls / Avoid Tools & Budgeting */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>SME Advisory: Tools to Avoid</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 mb-2">
                  Avoid tools that are too complex, require 6-month consulting setups, or lock your business into massive multi-year contracts:
                </p>
                <ul className="space-y-1">
                  {activeMilestone.avoidTools.map((avoid, idx) => (
                    <li key={idx} className="text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5 font-medium">
                      <span className="text-amber-500 font-bold">✕</span>
                      <span>{avoid}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Cost Breakdown Estimate
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Recurring SaaS:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    ~${activeMilestone.estimatedCostMonthly}/mo
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>One-time Setup / Hardware:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    ${activeMilestone.implementationCostOneTime}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Implementation Risk:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{activeMilestone.riskLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA to ROI calculator */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs transition-colors">
        <span className="text-slate-500 dark:text-slate-400">
          Ready to verify the cost-benefit equation and payback timeline?
        </span>
        <button
          onClick={onProceedToROI}
          className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
        >
          <span>Calculate Financial ROI & Payback</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
