import React, { useState } from 'react';
import { SMEProfile, PillarScore } from '../types/advisor';
import { SMEPreset, SME_PRESETS } from '../data/smePresets';
import { Building2, Sliders, ChevronDown, Check, Clock, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface SMEProfileBannerProps {
  profile: SMEProfile;
  setProfile: (profile: SMEProfile) => void;
  onSelectPreset: (preset: SMEPreset) => void;
  overallScore: number;
  maturityStage: { title: string; badge: string; color: string; description: string };
  weeklyHoursSaved: number;
  annualLaborValueSaved: number;
  paybackMonths: number;
}

export const SMEProfileBanner: React.FC<SMEProfileBannerProps> = ({
  profile,
  setProfile,
  onSelectPreset,
  overallScore,
  maturityStage,
  weeklyHoursSaved,
  annualLaborValueSaved,
  paybackMonths,
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Local state for editing profile
  const [tempProfile, setTempProfile] = useState<SMEProfile>({ ...profile });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(tempProfile);
    setShowEditModal(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors max-w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-3.5">
        {/* Top row: SME Identity & Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 sm:pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg shrink-0 mt-0.5">
              <Building2 className="w-4 h-4 text-indigo-400 dark:text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-950 dark:text-white font-sans">
                  {profile.name}
                </h1>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {profile.industry}
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">·</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {profile.businessModel}
                </span>
              </div>
              <div className="mt-1 p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-snug">
                <strong className="text-slate-900 dark:text-white font-semibold">Primary Goal:</strong>{' '}
                <span>{profile.primaryGoal}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions: Preset Switcher + Edit button */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 relative">
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 max-w-full"
                title="Switch SME Archetype"
              >
                <span className="text-slate-500 dark:text-slate-400 shrink-0">Archetype:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">
                  {profile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>

              {showPresets && (
                <>
                  {/* Backdrop for click-away */}
                  <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs sm:bg-transparent"
                    onClick={() => setShowPresets(false)}
                  />

                  {/* Responsive preset selector modal (mobile) & popover (desktop) */}
                  <div className="fixed inset-x-3 top-16 sm:top-auto sm:inset-x-auto sm:absolute sm:right-0 sm:mt-2 z-50 w-auto sm:w-[420px] max-h-[85vh] sm:max-h-[75vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 shrink-0">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                          Select Realistic SME Archetype
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          5 pre-calibrated operational benchmark profiles
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPresets(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                        title="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-1">
                      {SME_PRESETS.map((p) => {
                        const isSelected = profile.archetypeId === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              onSelectPreset(p);
                              setShowPresets(false);
                            }}
                            className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 shadow-xs'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                                <span>{p.name}</span>
                                {isSelected && (
                                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" />
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                                {p.archetype}
                              </div>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{p.profile.employees} staff</span>
                                <span>·</span>
                                <span>{p.profile.revenue}</span>
                                <span>·</span>
                                <span>${p.profile.avgHourlyWage}/hr avg</span>
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                                {p.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setTempProfile({ ...profile });
                setShowEditModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Edit SME Stats</span>
            </button>
          </div>
        </div>

        {/* Bottom row: 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2.5 sm:pt-3">
          {/* Card 1: Maturity Score */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 rounded-lg p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Digital Maturity</span>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {overallScore}/100
              </span>
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {maturityStage.title.split(':')[1] || maturityStage.title}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Target Phase 1: <span className="font-medium text-slate-700 dark:text-slate-200">Quick Wins</span>
            </div>
          </div>

          {/* Card 2: Reclaimable Labor */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 rounded-lg p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Wasted Labor</span>
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {weeklyHoursSaved} hrs / wk
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Manual retyping & paper
            </div>
          </div>

          {/* Card 3: Recoverable Annual Payroll */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 rounded-lg p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Labor Drain</span>
              <DollarSign className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              ${annualLaborValueSaved.toLocaleString()} / yr
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              At ${profile.avgHourlyWage}/hr wage
            </div>
          </div>

          {/* Card 4: Projected Payback */}
          <div className="bg-slate-50/70 dark:bg-slate-800/60 rounded-lg p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Payback Horizon</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
              {paybackMonths} Months
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Phased SaaS investment
            </div>
          </div>
        </div>
      </div>

      {/* Edit SME Parameters Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Customize SME Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employees (FTE)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={tempProfile.employees}
                    onChange={(e) => setTempProfile({ ...tempProfile, employees: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blended Wage ($/hr)</label>
                  <input
                    type="number"
                    min="15"
                    max="200"
                    value={tempProfile.avgHourlyWage}
                    onChange={(e) => setTempProfile({ ...tempProfile, avgHourlyWage: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Revenue</label>
                  <input
                    type="text"
                    value={tempProfile.revenue}
                    onChange={(e) => setTempProfile({ ...tempProfile, revenue: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Tech Budget ($)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={tempProfile.monthlyBudget}
                    onChange={(e) => setTempProfile({ ...tempProfile, monthlyBudget: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Operating Model</label>
                <input
                  type="text"
                  value={tempProfile.businessModel}
                  onChange={(e) => setTempProfile({ ...tempProfile, businessModel: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Modernization Goal</label>
                <textarea
                  rows={2}
                  value={tempProfile.primaryGoal}
                  onChange={(e) => setTempProfile({ ...tempProfile, primaryGoal: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Save SME Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
