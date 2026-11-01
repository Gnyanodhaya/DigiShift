import React, { useState } from 'react';
import { SMEProfile, PillarScore, ProcessBottleneck, RoadmapMilestone } from '../types/advisor';
import { generateDeterministicMemo } from '../utils/roadmapEngine';
import {
  Printer,
  FileSpreadsheet,
  FileCode,
  FileText,
  Eye,
  Download,
  X,
  CheckCircle2,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SMEProfile;
  overallScore: number;
  maturityStage?: { title: string; badge: string; color: string; description: string };
  pillarScores: PillarScore[];
  projectedScores?: { pillarId: string; score: number }[];
  bottlenecks: ProcessBottleneck[];
  roadmap: RoadmapMilestone[];
  annualSavings: number;
  paybackMonths?: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  overallScore,
  maturityStage = { title: 'Emerging Modernizer', badge: 'Stage 2', color: 'indigo', description: 'Basic digital tools in place.' },
  pillarScores,
  projectedScores = [],
  bottlenecks,
  roadmap,
  annualSavings,
  paybackMonths = 3.4,
}) => {
  const [activeTab, setActiveTab] = useState<'formats' | 'preview'>('formats');

  if (!isOpen) return null;

  const sortedBottlenecks = [...bottlenecks].sort((a, b) => b.priorityScore - a.priorityScore);
  const memo = generateDeterministicMemo(profile, overallScore, pillarScores, bottlenecks, roadmap);

  // Handle PDF / Print
  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // Handle Standalone HTML Executive Report Download
  const handleDownloadHTML = () => {
    const htmlDoc = generateStandaloneReportHtml({
      profile,
      overallScore,
      maturityStage,
      pillarScores,
      projectedScores,
      bottlenecks: sortedBottlenecks,
      roadmap,
      annualSavings,
      paybackMonths,
      memo,
    });

    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digishift_${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_executive_dossier.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle CSV Export (Pandas / Excel compatible)
  const handleDownloadCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    // Section 1: SME Profile
    csvContent += '--- SME METADATA & PROFILE ---\n';
    csvContent += `Company Name,${escapeCSV(profile.name)}\n`;
    csvContent += `Industry,${escapeCSV(profile.industry)}\n`;
    csvContent += `Revenue,${escapeCSV(profile.revenue)}\n`;
    csvContent += `Employees,${profile.employees}\n`;
    csvContent += `Blended Hourly Wage,$${profile.avgHourlyWage}\n`;
    csvContent += `Current Baseline Score,${overallScore}/100\n`;
    csvContent += `Projected Annual Savings,$${annualSavings}\n\n`;

    // Section 2: Pillar Scores & Projected Transformation
    csvContent += '--- DIGITAL MATURITY: BASELINE VS PROJECTED STATE ---\n';
    csvContent += 'Pillar ID,Pillar Name,Baseline Score,Peer Benchmark,Projected Score,Net Lift (+Pts),Status\n';
    pillarScores.forEach((p) => {
      const proj = projectedScores.find((projItem) => projItem.pillarId === p.pillarId)?.score || (p.score + 25);
      const delta = proj - p.score;
      csvContent += `${p.pillarId},${escapeCSV(p.name)},${p.score},${p.peerBenchmark},${proj},+${delta},${p.maturityStage}\n`;
    });
    csvContent += '\n';

    // Section 3: Process Bottlenecks Ranked
    csvContent += '--- RANKED PROCESS BOTTLENECKS ---\n';
    csvContent += 'Rank,Bottleneck Title,Department,Current Tool,Wasted Hours Weekly,Error Rate,Revenue Impact Score,Annual Financial Drain ($),Priority Score\n';
    sortedBottlenecks.forEach((b, idx) => {
      csvContent += `${idx + 1},${escapeCSV(b.title)},${escapeCSV(b.department)},${escapeCSV(b.currentTool)},${b.wastedHoursWeekly},${b.errorRate},${b.revenueImpactScore},${b.annualFinancialDrain},${b.priorityScore}\n`;
    });
    csvContent += '\n';

    // Section 4: Adoption Roadmap
    csvContent += '--- PHASED ADOPTION ROADMAP ---\n';
    csvContent += 'Phase,Timeframe,Milestone Title,Category,Weekly Hours Saved,Monthly SaaS Cost ($),Implementation Cost ($),Risk Level,Key KPI\n';
    roadmap.forEach((m) => {
      csvContent += `Phase ${m.phase},${escapeCSV(m.timeframe)},${escapeCSV(m.title)},${escapeCSV(m.category)},${m.expectedWeeklyHoursSaved},${m.estimatedCostMonthly},${m.implementationCostOneTime},${m.riskLevel},${escapeCSV(m.successKpi)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `digishift_${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_assessment.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle JSON Export
  const handleDownloadJSON = () => {
    const exportObject = {
      meta: {
        tool: 'DigiShift — SME Digital Transformation Advisor',
        exportDate: new Date().toISOString(),
        overallScore,
      },
      profile,
      pillarScores,
      rankedBottlenecks: bottlenecks,
      adoptionRoadmap: roadmap,
      summaryMetrics: {
        annualSavings,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `digishift_${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                Executive Strategic Output
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{profile.name}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Export Strategic Plan & Dossier
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch between Export Formats and Live Preview */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('formats')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'formats'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Formats
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              title="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'formats' ? (
            <div className="space-y-3">
              {/* Option 1: PDF / Print via Browser (Now formatted with #print-dossier) */}
              <button
                onClick={handlePrint}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all flex items-start gap-3.5 group bg-white dark:bg-slate-900/60"
              >
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <Printer className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Executive PDF Report (Print Preview)
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      Print / Save PDF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Formatted multi-page dossier configured for letter size: includes executive diagnosis, 5-pillar scorecard, ranked bottlenecks table, and phased roadmap timeline.
                  </p>
                </div>
              </button>

              {/* Option 2: Download Standalone HTML Executive Dossier */}
              <button
                onClick={handleDownloadHTML}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all flex items-start gap-3.5 group bg-white dark:bg-slate-900/60"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Download Standalone Executive Dossier (.html)
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Direct File Download
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Single self-contained HTML file with embedded professional CSS. Open in any browser, email to board members, or convert to PDF offline with zero white-space issues.
                  </p>
                </div>
              </button>

              {/* Option 3: CSV Data Export for Pandas / Excel */}
              <button
                onClick={handleDownloadCSV}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all flex items-start gap-3.5 group bg-white dark:bg-slate-900/60"
              >
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      CSV Data Export (Pandas & Excel Analysis)
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      .csv
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Clean comma-separated data ready for data science pipelines (<code className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">pd.read_csv()</code>), financial models, or board presentations.
                  </p>
                </div>
              </button>

              {/* Option 4: Full JSON Schema Export */}
              <button
                onClick={handleDownloadJSON}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-950/30 transition-all flex items-start gap-3.5 group bg-white dark:bg-slate-900/60"
              >
                <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Full JSON Data Schema
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                      .json
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Complete machine-readable schema of question weights, calculated return rates, bottleneck priority scores, and milestone definitions.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            /* Live In-Modal Dossier Preview */
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold block">
                    Confidential Executive Brief
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {profile.employees} Staff · {profile.revenue} · Blended Wage: ${profile.avgHourlyWage}/hr
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs bg-slate-900 dark:bg-indigo-600 text-white px-2 py-0.5 rounded">
                    Score: {overallScore}/100
                  </span>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Stage: {maturityStage.badge}
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] font-mono mb-1">
                  Executive Diagnosis
                </h5>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-pre-line">
                  {memo.executiveDiagnosis}
                </p>
              </div>

              {/* Top Bottlenecks Preview */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] font-mono mb-1.5">
                  Top Bottlenecks Impacting Cashflow
                </h5>
                <div className="space-y-1.5">
                  {sortedBottlenecks.slice(0, 3).map((b, idx) => (
                    <div
                      key={b.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">#{idx + 1} {b.title}</span>
                        <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                          Department: {b.department} · Current Tool: {b.currentTool}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                        -${b.annualFinancialDrain?.toLocaleString()} / yr
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phased Roadmap Snapshot */}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] font-mono mb-1.5">
                  Phased Modernization Roadmap
                </h5>
                <div className="space-y-1.5">
                  {roadmap.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Phase {m.phase}: {m.title}</span>
                        <div className="text-slate-500 dark:text-slate-400 text-[10px]">
                          Target: {m.recommendedStack.map((s) => s.name).join(', ')} · Timeframe: {m.timeframe}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        +{m.expectedWeeklyHoursSaved} hrs/wk saved
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownloadHTML}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download This Dossier</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {activeTab === 'formats' ? 'Click format above to export instantly' : 'Complete preview of executive brief'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function escapeCSV(str: string): string {
  if (!str) return '""';
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateStandaloneReportHtml(data: {
  profile: SMEProfile;
  overallScore: number;
  maturityStage: { title: string; badge: string; color: string; description: string };
  pillarScores: PillarScore[];
  projectedScores: { pillarId: string; score: number }[];
  bottlenecks: ProcessBottleneck[];
  roadmap: RoadmapMilestone[];
  annualSavings: number;
  paybackMonths: number;
  memo: any;
}): string {
  const { profile, overallScore, maturityStage, pillarScores, projectedScores, bottlenecks, roadmap, annualSavings, paybackMonths, memo } = data;

  const pillarRows = pillarScores
    .map((p) => {
      const proj = projectedScores.find((item) => item.pillarId === p.pillarId)?.score || (p.score + 25);
      const delta = proj - p.score;
      return `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; border: 1px solid #e2e8f0;">${p.name}</td>
        <td style="padding: 8px 12px; text-align: center; font-weight: bold; color: #4338ca; border: 1px solid #e2e8f0;">${p.score}/100</td>
        <td style="padding: 8px 12px; text-align: center; color: #64748b; border: 1px solid #e2e8f0;">${p.peerBenchmark}</td>
        <td style="padding: 8px 12px; text-align: center; font-weight: bold; color: #059669; border: 1px solid #e2e8f0;">${proj}/100</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #059669; border: 1px solid #e2e8f0;">+${delta} pts</td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${p.maturityStage}</td>
      </tr>`;
    })
    .join('');

  const bottleneckRows = bottlenecks
    .map((b, idx) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #e2e8f0;">#${idx + 1}</td>
        <td style="padding: 8px 12px; font-weight: 600; border: 1px solid #e2e8f0;">
          ${b.title}
          <div style="font-size: 11px; font-weight: normal; color: #64748b;">${b.description}</div>
        </td>
        <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${b.department}</td>
        <td style="padding: 8px 12px; text-align: center; color: #b91c1c; font-family: monospace; border: 1px solid #e2e8f0;">${b.currentTool}</td>
        <td style="padding: 8px 12px; text-align: right; font-family: monospace; border: 1px solid #e2e8f0;">${b.wastedHoursWeekly} hrs</td>
        <td style="padding: 8px 12px; text-align: right; font-family: monospace; font-weight: bold; color: #b91c1c; border: 1px solid #e2e8f0;">$${b.annualFinancialDrain?.toLocaleString()}</td>
      </tr>`)
    .join('');

  const roadmapBlocks = roadmap
    .map(
      (m) => `
      <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 12px; background: #f8fafc;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 6px;">
          <span style="font-size: 13px; color: #0f172a;">Phase ${m.phase}: ${m.title}</span>
          <span style="font-family: monospace; color: #475569;">${m.timeframe}</span>
        </div>
        <p style="font-size: 12px; color: #334155; margin: 0 0 10px 0;">${m.description}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          <div><strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Target Stack:</strong> <br/><span style="color: #4338ca; font-weight: 600;">${m.recommendedStack.map((s) => s.name).join(', ')}</span></div>
          <div><strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Hours Saved:</strong> <br/><span style="color: #059669; font-weight: bold;">+${m.expectedWeeklyHoursSaved} hrs/week</span></div>
          <div><strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Investment:</strong> <br/>$${m.estimatedCostMonthly}/mo · $${m.implementationCostOneTime} setup</div>
        </div>
      </div>`
    )
    .join('');

  const checklistItems = memo.quickWinActions
    .map((action: string) => `<li style="margin-bottom: 6px; font-size: 12px; color: #1e293b;">${action}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DigiShift Executive Dossier — ${profile.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #0f172a; background: #ffffff; padding: 32px; max-width: 900px; margin: 0 auto; }
    h1, h2, h3 { margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 24px; font-size: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; border: 1px solid #cbd5e1; font-weight: 700; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; background: #0f172a; color: white; }
    .metric-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc; }
    @media print {
      body { padding: 0; max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div style="border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
    <div>
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4f46e5; letter-spacing: 0.05em;">DigiShift SME Advisory Engine</div>
      <h1 style="font-size: 24px; font-weight: 900; margin: 4px 0 2px 0;">${profile.name}</h1>
      <div style="font-size: 12px; color: #64748b;">${profile.industry} · ${profile.businessModel}</div>
    </div>
    <div style="text-align: right;">
      <div class="badge">Score: ${overallScore}/100</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Stage: ${maturityStage.badge}</div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Report Date: ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
    <div class="metric-box"><div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold;">Employees</div><div style="font-size: 15px; font-weight: bold; margin-top: 4px;">${profile.employees} Staff</div></div>
    <div class="metric-box"><div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold;">Revenue</div><div style="font-size: 15px; font-weight: bold; margin-top: 4px;">${profile.revenue}</div></div>
    <div class="metric-box"><div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold;">Labor Rate</div><div style="font-size: 15px; font-weight: bold; margin-top: 4px;">$${profile.avgHourlyWage}/hr</div></div>
    <div class="metric-box"><div style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold;">Payback</div><div style="font-size: 15px; font-weight: bold; color: #059669; margin-top: 4px;">${paybackMonths} Months</div></div>
  </div>

  <div style="margin-bottom: 24px;">
    <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; color: #0f172a;">01. Executive Diagnosis</h3>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.6; white-space: pre-line;">${memo.executiveDiagnosis}</div>
  </div>

  <div style="margin-bottom: 24px;">
    <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; color: #0f172a;">02. Digital Maturity: Baseline vs Projected Target</h3>
    <table>
      <thead>
        <tr>
          <th>Pillar</th>
          <th style="text-align: center;">Baseline</th>
          <th style="text-align: center;">Peer Benchmark</th>
          <th style="text-align: center;">Target Post-Adoption</th>
          <th style="text-align: right;">Net Lift</th>
          <th>Maturity Stage</th>
        </tr>
      </thead>
      <tbody>
        ${pillarRows}
      </tbody>
    </table>
  </div>

  <div style="margin-bottom: 24px;">
    <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; color: #0f172a;">03. Process Bottlenecks Ranked by Impact</h3>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Process Bottleneck</th>
          <th>Department</th>
          <th style="text-align: center;">Current Tool</th>
          <th style="text-align: right;">Weekly Waste</th>
          <th style="text-align: right;">Annual Payroll Drain</th>
        </tr>
      </thead>
      <tbody>
        ${bottleneckRows}
      </tbody>
    </table>
  </div>

  <div style="margin-bottom: 24px;">
    <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; color: #0f172a;">04. Phased Technology Adoption Roadmap</h3>
    ${roadmapBlocks}
  </div>

  <div style="margin-bottom: 24px;">
    <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; color: #0f172a;">05. 90-Day Implementation Action Items</h3>
    <ul style="padding-left: 20px;">
      ${checklistItems}
    </ul>
    <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 12px; margin-top: 12px; font-size: 12px; color: #3730a3;">
      <strong>Change Management Tip:</strong> ${memo.culturalChangePlaybook}
    </div>
  </div>

  <div style="border-top: 2px solid #0f172a; padding-top: 12px; margin-top: 32px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b;">
    <span>DigiShift SME Digital Transformation Advisor</span>
    <span>Confidential Client Assessment</span>
  </div>
</body>
</html>`;
}
