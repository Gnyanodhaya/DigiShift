import React, { useState } from 'react';
import { ProcessBottleneck, SMEProfile } from '../types/advisor';
import { calculateBottleneckMetrics } from '../data/bottlenecksCatalog';
import { AlertCircle, Plus, Filter, ArrowUpDown, ChevronRight, Layers, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface BottleneckRankerProps {
  bottlenecks: ProcessBottleneck[];
  setBottlenecks: (bottlenecks: ProcessBottleneck[]) => void;
  profile: SMEProfile;
  onProceedToRoadmap: () => void;
}

export const BottleneckRanker: React.FC<BottleneckRankerProps> = ({
  bottlenecks,
  setBottlenecks,
  profile,
  onProceedToRoadmap,
}) => {
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedBottleneck, setSelectedBottleneck] = useState<ProcessBottleneck | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New bottleneck form state
  const [newBn, setNewBn] = useState<Partial<ProcessBottleneck>>({
    title: '',
    department: 'Operations & Fulfillment',
    description: '',
    currentTool: 'Paper & Excel Spreadsheets',
    wastedHoursWeekly: 10,
    errorRate: 'High',
    revenueImpactScore: 4,
    customerFrictionScore: 3,
    urgency: 'Immediate',
    recommendedSolutions: ['Zapier automation', 'Mobile cloud app'],
  });

  // Calculate and sort bottlenecks
  const enrichedBottlenecks = bottlenecks.map((bn) => {
    const { annualCost, priorityScore } = calculateBottleneckMetrics(bn, profile.avgHourlyWage);
    return {
      ...bn,
      annualFinancialDrain: annualCost,
      priorityScore,
    };
  });

  const sortedBottlenecks = [...enrichedBottlenecks].sort((a, b) => b.priorityScore - a.priorityScore);

  const filteredBottlenecks = departmentFilter === 'all'
    ? sortedBottlenecks
    : sortedBottlenecks.filter((b) => b.department === departmentFilter);

  const totalWastedHours = sortedBottlenecks.reduce((acc, b) => acc + b.wastedHoursWeekly, 0);
  const totalFinancialDrain = sortedBottlenecks.reduce((acc, b) => acc + b.annualFinancialDrain, 0);

  const departments = ['all', 'Sales & Intake', 'Operations & Fulfillment', 'Finance & Invoicing', 'Team & Workforce'];

  const handleUpdateHours = (id: string, delta: number) => {
    setBottlenecks(
      bottlenecks.map((b) => {
        if (b.id === id) {
          const newHours = Math.max(1, Math.min(50, b.wastedHoursWeekly + delta));
          return { ...b, wastedHoursWeekly: newHours };
        }
        return b;
      })
    );
  };

  const handleSaveCustomBottleneck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBn.title) return;

    const created: ProcessBottleneck = {
      id: `custom_${Date.now()}`,
      title: newBn.title,
      department: newBn.department as any,
      description: newBn.description || 'Custom company bottleneck',
      currentTool: newBn.currentTool || 'Manual process',
      wastedHoursWeekly: Number(newBn.wastedHoursWeekly) || 10,
      errorRate: newBn.errorRate as any,
      revenueImpactScore: Number(newBn.revenueImpactScore) || 3,
      customerFrictionScore: Number(newBn.customerFrictionScore) || 3,
      urgency: newBn.urgency as any,
      annualFinancialDrain: 0,
      priorityScore: 0,
      recommendedSolutions: ['Custom API connection', 'Standardized Cloud SaaS'],
    };

    setBottlenecks([...bottlenecks, created]);
    setShowAddModal(false);
    setNewBn({
      title: '',
      department: 'Operations & Fulfillment',
      description: '',
      currentTool: '',
      wastedHoursWeekly: 10,
      errorRate: 'High',
      revenueImpactScore: 4,
      customerFrictionScore: 3,
      urgency: 'Immediate',
    });
  };

  const handleDeleteBottleneck = (id: string) => {
    setBottlenecks(bottlenecks.filter((b) => b.id !== id));
    if (selectedBottleneck?.id === id) setSelectedBottleneck(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white font-sans">
              Algorithmic Bottleneck Priority Ranking
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked by total annual financial drain: Hours Wasted × Labor Wage (${profile.avgHourlyWage}/hr) + Error Rework & Revenue Leakage
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Drain Across Bottlenecks</span>
              <div className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                ${totalFinancialDrain.toLocaleString()} / year
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Bottleneck</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 pt-3 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {departments.map((dep) => (
              <button
                key={dep}
                onClick={() => setDepartmentFilter(dep)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  departmentFilter === dep
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {dep === 'all' ? 'All Departments' : dep}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            Showing {filteredBottlenecks.length} of {bottlenecks.length} bottlenecks
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Bottleneck & Operational Friction</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Legacy Tool</th>
                <th className="py-3 px-4 text-center">Wasted Hrs/Wk</th>
                <th className="py-3 px-4">Error Rate</th>
                <th className="py-3 px-4 text-right">Annual Financial Drain</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredBottlenecks.map((bn, index) => {
                const isSelected = selectedBottleneck?.id === bn.id;
                return (
                  <tr
                    key={bn.id}
                    onClick={() => setSelectedBottleneck(bn)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60 ${
                      isSelected ? 'bg-indigo-50/40 dark:bg-indigo-950/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-500 dark:text-slate-400">
                      #{index + 1}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{bn.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {bn.description}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{bn.department}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">
                        {bn.currentTool}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateHours(bn.id, -2);
                          }}
                          className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"
                          title="Decrease hours"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{bn.wastedHoursWeekly}h</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateHours(bn.id, 2);
                          }}
                          className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"
                          title="Increase hours"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold ${
                        bn.errorRate === 'Severe'
                          ? 'text-rose-600'
                          : bn.errorRate === 'High'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}>
                        {bn.errorRate}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      ${bn.annualFinancialDrain.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 font-mono text-xs">
                        <span className={`w-2 h-2 rounded-full ${
                          bn.priorityScore >= 75
                            ? 'bg-rose-500'
                            : bn.priorityScore >= 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`} />
                        <span className="font-bold">{bn.priorityScore}/100</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBottleneck(bn);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Click '+' or '-' on hours to observe real-time recalculation of annual financial drain.
          </div>
          <button
            onClick={onProceedToRoadmap}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Proceed to Phased Technology Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selected Bottleneck Deep Dive Drawer / Inspector */}
      {selectedBottleneck && (
        <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-md">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                  Bottleneck Inspector
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-medium text-slate-500">{selectedBottleneck.department}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                {selectedBottleneck.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteBottleneck(selectedBottleneck.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
              >
                Remove
              </button>
              <button
                onClick={() => setSelectedBottleneck(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Root Cause & Friction
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedBottleneck.description}
              </p>
              <div className="mt-2 text-xs text-slate-500">
                Legacy Tool: <span className="font-mono text-slate-800 font-medium">{selectedBottleneck.currentTool}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Financial Impact Breakdown
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Wasted Labor ({selectedBottleneck.wastedHoursWeekly}h/wk):</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">
                    ${Math.round(selectedBottleneck.wastedHoursWeekly * profile.avgHourlyWage * 52).toLocaleString()}/yr
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Error & Rework Severity:</span>
                  <span className="font-semibold text-amber-600">{selectedBottleneck.errorRate}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Revenue Attrition Risk:</span>
                  <span className="font-semibold">{selectedBottleneck.revenueImpactScore} / 5</span>
                </div>
                <div className="pt-1 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                  <span>Total Calculated Drain:</span>
                  <span className="font-mono text-rose-600">${selectedBottleneck.annualFinancialDrain.toLocaleString()}/yr</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Target Technology Solutions
              </span>
              <ul className="space-y-1 text-xs">
                {selectedBottleneck.recommendedSolutions.map((sol, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-[11px] text-slate-500">
                This bottleneck is targeted in <span className="font-semibold text-indigo-600">Phase 1 & Phase 2</span> of the adoption roadmap.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Bottleneck Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Custom Operational Bottleneck</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomBottleneck} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bottleneck Title</label>
                <input
                  type="text"
                  placeholder="e.g., Manual stock checks before confirming quotes"
                  value={newBn.title}
                  onChange={(e) => setNewBn({ ...newBn, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newBn.department}
                    onChange={(e) => setNewBn({ ...newBn, department: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Sales & Intake">Sales & Intake</option>
                    <option value="Operations & Fulfillment">Operations & Fulfillment</option>
                    <option value="Finance & Invoicing">Finance & Invoicing</option>
                    <option value="Team & Workforce">Team & Workforce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Legacy Tool</label>
                  <input
                    type="text"
                    placeholder="e.g. WhatsApp / Whiteboard / Paper"
                    value={newBn.currentTool}
                    onChange={(e) => setNewBn({ ...newBn, currentTool: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hours Wasted / Wk</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newBn.wastedHoursWeekly}
                    onChange={(e) => setNewBn({ ...newBn, wastedHoursWeekly: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Error Rate</label>
                  <select
                    value={newBn.errorRate}
                    onChange={(e) => setNewBn({ ...newBn, errorRate: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Revenue Risk (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newBn.revenueImpactScore}
                    onChange={(e) => setNewBn({ ...newBn, revenueImpactScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Operational Context</label>
                <textarea
                  rows={2}
                  placeholder="Explain why this slows down operations or causes customer frustration..."
                  value={newBn.description}
                  onChange={(e) => setNewBn({ ...newBn, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Add to Ranking Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
