import React, { useState } from 'react';
import { SMEProfile, RoadmapMilestone, ProcessBottleneck } from '../types/advisor';
import { calculateFinancialROI } from '../utils/roadmapEngine';
import { DollarSign, TrendingUp, Clock, ShieldCheck, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';

interface FinancialCalculatorProps {
  profile: SMEProfile;
  setProfile: (profile: SMEProfile) => void;
  roadmap: RoadmapMilestone[];
  bottlenecks: ProcessBottleneck[];
  onProceedToMemo: () => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  profile,
  setProfile,
  roadmap,
  bottlenecks,
  onProceedToMemo,
}) => {
  const [efficiencyCaptureRate, setEfficiencyCaptureRate] = useState<number>(65); // 65% base case
  const [customHourlyWage, setCustomHourlyWage] = useState<number>(profile.avgHourlyWage);

  // Recalculate with active slider values
  const currentProfile = {
    ...profile,
    avgHourlyWage: customHourlyWage,
  };

  const baseROI = calculateFinancialROI(currentProfile, roadmap, bottlenecks);

  // Apply efficiency capture rate
  const adjustedGrossLaborValue = Math.round(baseROI.annualLaborValueSaved * (efficiencyCaptureRate / 100));
  const adjustedTotalAnnualBenefit = adjustedGrossLaborValue + Math.round(baseROI.annualErrorWasteReduction * (efficiencyCaptureRate / 100));
  const adjustedFirstYearNet = adjustedTotalAnnualBenefit - (baseROI.annualSoftwareCost + baseROI.oneTimeImplementationCost);
  const adjustedThreeYearNet = (adjustedTotalAnnualBenefit * 3) - (baseROI.oneTimeImplementationCost + baseROI.annualSoftwareCost * 3);
  const adjustedThreeYearCost = baseROI.oneTimeImplementationCost + baseROI.annualSoftwareCost * 3;
  const adjustedROIPercent = Math.round((adjustedThreeYearNet / adjustedThreeYearCost) * 100);

  const monthlyGross = adjustedTotalAnnualBenefit / 12;
  const monthlyNet = monthlyGross - baseROI.monthlySoftwareCost;
  const adjustedPaybackMonths = monthlyNet > 0
    ? Math.max(1.1, Math.round((baseROI.oneTimeImplementationCost / monthlyNet) * 10) / 10)
    : 18;

  // 3-Year Cashflow projection data
  const cashflowYears = [
    {
      year: 'Year 1',
      cost: baseROI.oneTimeImplementationCost + baseROI.annualSoftwareCost,
      benefit: adjustedTotalAnnualBenefit,
      net: adjustedFirstYearNet,
    },
    {
      year: 'Year 2',
      cost: baseROI.annualSoftwareCost,
      benefit: adjustedTotalAnnualBenefit,
      net: adjustedTotalAnnualBenefit - baseROI.annualSoftwareCost,
    },
    {
      year: 'Year 3',
      cost: baseROI.annualSoftwareCost,
      benefit: adjustedTotalAnnualBenefit,
      net: adjustedTotalAnnualBenefit - baseROI.annualSoftwareCost,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title & Context */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white font-sans">
              Financial Impact & Modernization ROI Model
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate cashflow recovery and payback based on labor recapture, error reduction, and SaaS subscription costs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Preset Wage:</span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              ${profile.avgHourlyWage}/hr
            </span>
          </div>
        </div>

        {/* Real-time Slider Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Blended Staff Labor Rate ($/hour):</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                ${customHourlyWage}/hr
              </span>
            </div>
            <input
              type="range"
              min="18"
              max="75"
              step="1"
              value={customHourlyWage}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustomHourlyWage(val);
                setProfile({ ...profile, avgHourlyWage: val });
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              <span>$18/hr (Entry clerical)</span>
              <span>$45/hr (Skilled trade)</span>
              <span>$75/hr (Specialized)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Productivity Capture Factor (%):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {efficiencyCaptureRate}%
              </span>
            </div>
            <input
              type="range"
              min="35"
              max="95"
              step="5"
              value={efficiencyCaptureRate}
              onChange={(e) => setEfficiencyCaptureRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              <span>35% (Conservative)</span>
              <span>65% (Base Case)</span>
              <span>95% (High Discipline)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Big Impact KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white dark:bg-slate-900 p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Payback Horizon</span>
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {adjustedPaybackMonths} <span className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400">months</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Recovers initial ${baseROI.oneTimeImplementationCost} implementation spend
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Annual Gross Benefit</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            ${adjustedTotalAnnualBenefit.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Reclaimed labor + scrap/error reduction
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>3-Year Net Benefit</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 tabular-nums">
            ${adjustedThreeYearNet.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Net cash gain after all software fees
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>3-Year ROI</span>
            <BarChart2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
            {adjustedROIPercent}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Return on total technology capital
          </div>
        </div>
      </div>

      {/* Detailed Pro-Forma Projection Table & Visual Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3-Year Pro Forma Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            3-Year Pro-Forma Modernization Cashflow
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Timeline</th>
                  <th className="py-2.5 px-3 text-right">Software & Setup</th>
                  <th className="py-2.5 px-3 text-right">Gross Labor & Error Gain</th>
                  <th className="py-2.5 px-3 text-right">Net Cashflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {cashflowYears.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900 dark:text-white">
                      {item.year}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-600 dark:text-rose-400 tabular-nums">
                      -${item.cost.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +${item.benefit.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                      +${item.net.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t-2 border-slate-200 dark:border-slate-700">
                  <td className="py-3 px-3 font-sans text-slate-950 dark:text-white">
                    3-Year Cumulative
                  </td>
                  <td className="py-3 px-3 text-right text-rose-700 dark:text-rose-400 tabular-nums">
                    -${adjustedThreeYearCost.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-700 dark:text-emerald-400 tabular-nums">
                    +${(adjustedTotalAnnualBenefit * 3).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-indigo-700 dark:text-indigo-400 tabular-nums">
                    +${adjustedThreeYearNet.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Sensitivity Matrix */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Sensitivity & Scenario Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Comparing outcomes under conservative, base, and accelerated adoption discipline.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-800 dark:text-slate-200">
                  <span>Conservative (40% Capture)</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    ${Math.round((baseROI.totalAnnualBenefit * 0.4) * 3 - adjustedThreeYearCost).toLocaleString()} net
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Assumes slow employee uptake and 4.2 month payback.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs">
                <div className="flex justify-between items-center font-bold text-indigo-950 dark:text-indigo-200">
                  <span>Base Case (65% Capture)</span>
                  <span className="font-mono text-indigo-700 dark:text-indigo-400">
                    ${adjustedThreeYearNet.toLocaleString()} net
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-300 mt-0.5">
                  Standard SaaS adoption with internal department champions.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs">
                <div className="flex justify-between items-center font-bold text-emerald-950 dark:text-emerald-200">
                  <span>High Discipline (85% Capture)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">
                    ${Math.round((baseROI.totalAnnualBenefit * 0.85) * 3 - adjustedThreeYearCost).toLocaleString()} net
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Full workflow enforcement; completely paperless operations.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Ready for executive synthesis?
            </span>
            <button
              onClick={onProceedToMemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 font-semibold text-white bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>View Executive Brief</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
