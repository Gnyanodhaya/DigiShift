import React from 'react';
import { SMEProfile, PillarScore, ProcessBottleneck, RoadmapMilestone } from '../types/advisor';
import { generateDeterministicMemo } from '../utils/roadmapEngine';

interface PrintDossierProps {
  profile: SMEProfile;
  overallScore: number;
  maturityStage: { title: string; badge: string; color: string; description: string };
  pillarScores: PillarScore[];
  projectedScores?: { pillarId: string; score: number }[];
  bottlenecks: ProcessBottleneck[];
  roadmap: RoadmapMilestone[];
  annualSavings: number;
  paybackMonths: number;
}

export const PrintDossier: React.FC<PrintDossierProps> = ({
  profile,
  overallScore,
  maturityStage,
  pillarScores,
  projectedScores = [],
  bottlenecks,
  roadmap,
  annualSavings,
  paybackMonths,
}) => {
  const memo = generateDeterministicMemo(profile, overallScore, pillarScores, bottlenecks, roadmap);
  const sortedBottlenecks = [...bottlenecks].sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div
      id="print-dossier"
      className="hidden print:block bg-white text-slate-900 font-sans p-8 max-w-4xl mx-auto"
    >
      {/* 1. Executive Header & Metadata */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 block">
              DigiShift · SME Strategic Transformation Dossier
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 mt-1">
              {profile.name}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Sector: {profile.industry} · Operating Model: {profile.businessModel}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-slate-900 text-white font-mono px-3 py-1.5 rounded text-xs font-bold">
              Score: {overallScore}/100
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              Stage: {maturityStage.badge}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Profile Metric Strip */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Headcount</span>
            <span className="font-bold text-slate-900">{profile.employees} FTE Staff</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Annual Revenue</span>
            <span className="font-bold text-slate-900">{profile.revenue}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Blended Hourly Wage</span>
            <span className="font-mono font-bold text-slate-900">${profile.avgHourlyWage}/hr</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Payback Horizon</span>
            <span className="font-mono font-bold text-emerald-700">{paybackMonths} Months</span>
          </div>
        </div>

        <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700">
          <strong>Primary Transformation Goal:</strong> {profile.primaryGoal}
        </div>
      </div>

      {/* 2. Executive Diagnosis Summary */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
          01. Executive Diagnosis
        </h2>
        <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-200">
          {memo.executiveDiagnosis}
        </p>
      </div>

      {/* 3. 5-Pillar Digital Maturity Scorecard */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3 font-mono">
          02. Digital Maturity Assessment: Baseline vs Projected
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <th className="p-2 border border-slate-300">Pillar</th>
              <th className="p-2 text-center border border-slate-300">Baseline Score</th>
              <th className="p-2 text-center border border-slate-300">Peer Median</th>
              <th className="p-2 text-center border border-slate-300">Target Score</th>
              <th className="p-2 text-right border border-slate-300">Net Lift</th>
              <th className="p-2 border border-slate-300">Target Maturity Stage</th>
            </tr>
          </thead>
          <tbody>
            {pillarScores.map((p) => {
              const proj = projectedScores.find((item) => item.pillarId === p.pillarId)?.score || (p.score + 25);
              const delta = proj - p.score;
              return (
                <tr key={p.pillarId} className="border-b border-slate-200 font-mono">
                  <td className="p-2 font-sans font-semibold text-slate-900 border border-slate-300">{p.name}</td>
                  <td className="p-2 text-center text-indigo-700 font-bold border border-slate-300">{p.score}/100</td>
                  <td className="p-2 text-center text-slate-600 border border-slate-300">{p.peerBenchmark}</td>
                  <td className="p-2 text-center text-emerald-700 font-bold border border-slate-300">{proj}/100</td>
                  <td className="p-2 text-right text-emerald-700 font-bold border border-slate-300">+{delta} pts</td>
                  <td className="p-2 font-sans text-slate-800 border border-slate-300">{p.maturityStage}</td>
                </tr>
              );
            })}
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
              <td className="p-2 font-sans border border-slate-300">Overall Maturity Index</td>
              <td className="p-2 text-center text-indigo-800 border border-slate-300">{overallScore}/100</td>
              <td className="p-2 text-center text-slate-600 border border-slate-300">50</td>
              <td className="p-2 text-center text-emerald-800 border border-slate-300">
                {Math.min(100, overallScore + 32)}/100
              </td>
              <td className="p-2 text-right text-emerald-800 border border-slate-300">+32 pts</td>
              <td className="p-2 font-sans border border-slate-300">Scaling Automation</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Ranked Process Bottlenecks */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3 font-mono">
          03. Operational Bottlenecks Ranked by Financial Drain
        </h2>
        <table className="w-full text-xs text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <th className="p-2 border border-slate-300">Rank</th>
              <th className="p-2 border border-slate-300">Process Bottleneck</th>
              <th className="p-2 border border-slate-300">Department</th>
              <th className="p-2 text-center border border-slate-300">Current Tool</th>
              <th className="p-2 text-right border border-slate-300">Wasted Hrs/Wk</th>
              <th className="p-2 text-right border border-slate-300">Annual Payroll Drain</th>
            </tr>
          </thead>
          <tbody>
            {sortedBottlenecks.map((b, idx) => (
              <tr key={b.id} className="border-b border-slate-200">
                <td className="p-2 font-mono font-bold text-slate-900 border border-slate-300">#{idx + 1}</td>
                <td className="p-2 font-semibold text-slate-900 border border-slate-300">
                  {b.title}
                  <div className="text-[10px] text-slate-600 font-normal">{b.description}</div>
                </td>
                <td className="p-2 text-slate-700 border border-slate-300">{b.department}</td>
                <td className="p-2 text-center font-mono text-[11px] text-rose-700 border border-slate-300">{b.currentTool}</td>
                <td className="p-2 text-right font-mono text-slate-900 border border-slate-300">{b.wastedHoursWeekly} hrs</td>
                <td className="p-2 text-right font-mono font-bold text-rose-700 border border-slate-300">
                  ${b.annualFinancialDrain?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Phased Technology Adoption Roadmap */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3 font-mono">
          04. Phased Technology Adoption Roadmap
        </h2>
        <div className="space-y-3">
          {roadmap.map((m) => (
            <div key={m.id} className="border border-slate-300 rounded p-3 text-xs bg-slate-50/50">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-slate-950 font-sans">
                  Phase {m.phase}: {m.title}
                </span>
                <span className="font-mono text-slate-700 font-semibold">{m.timeframe}</span>
              </div>
              <p className="text-slate-700 text-xs mb-2">{m.description}</p>
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px]">Target Software:</span>
                  <span className="font-mono text-indigo-800">
                    {m.recommendedStack.map((s) => s.name).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px]">Weekly Time Saved:</span>
                  <span className="font-mono text-emerald-700 font-bold">+{m.expectedWeeklyHoursSaved} hrs/wk</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px]">SaaS Cost / Setup:</span>
                  <span className="font-mono text-slate-900">${m.estimatedCostMonthly}/mo · ${m.implementationCostOneTime} setup</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Strategic Recommendations & Checklist */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
          05. 90-Day Implementation Action Items
        </h2>
        <ul className="list-disc pl-5 text-xs text-slate-800 space-y-1">
          {memo.quickWinActions.map((action, idx) => (
            <li key={idx} className="leading-relaxed">{action}</li>
          ))}
        </ul>

        <div className="mt-4 p-3 bg-slate-100 rounded border border-slate-300 text-xs text-slate-700">
          <strong>Change Management Playbook:</strong> {memo.culturalChangePlaybook}
        </div>
      </div>

      {/* Document Sign-off Footer */}
      <div className="mt-8 pt-4 border-t-2 border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
        <span>Prepared by DigiShift SME Advisory Engine</span>
        <span>Confidential Internal Document · Page 1 of 1</span>
      </div>
    </div>
  );
};
