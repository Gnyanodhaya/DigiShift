import React from 'react';
import { ArrowUpRight, Sparkles, Printer, User, Moon, Sun, Settings, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  overallScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  onOpenSettings,
  onOpenAuth,
  overallScore,
}) => {
  const { currentUser, isAuthenticated, preferences, updatePreferences } = useAuth();

  const navItems = [
    { id: 'diagnostic', label: 'Diagnostic', fullLabel: 'Maturity Diagnostic' },
    { id: 'comparison', label: 'Comparison', fullLabel: 'Baseline vs Projected' },
    { id: 'bottlenecks', label: 'Bottlenecks', fullLabel: 'Process Bottlenecks' },
    { id: 'roadmap', label: 'Roadmap', fullLabel: 'Adoption Roadmap' },
    { id: 'roi', label: 'ROI Model', fullLabel: 'Financial ROI' },
    { id: 'memo', label: 'Exec Brief', fullLabel: 'Executive Brief' },
  ];

  const toggleTheme = () => {
    const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
    updatePreferences({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors max-w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-13 sm:h-14">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('diagnostic')}
              className="text-left group flex items-baseline gap-1.5"
            >
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 dark:text-white font-sans">
                DigiShift
              </span>
              <span className="hidden sm:inline text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono tracking-tight">
                SME ADVISOR
              </span>
            </button>
            <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <span className="hidden md:inline-flex items-center text-[11px] font-mono tabular-nums text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Score: {overallScore}/100
            </span>
          </div>

          {/* Zone 2: Single-line nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 text-xs font-semibold ${
                    isActive
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="hidden xl:inline">{item.fullLabel}</span>
                  <span className="xl:hidden">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + User Profile & Appearance toggles */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={preferences.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {preferences.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Profile Avatar or Login Trigger */}
            {isAuthenticated && currentUser ? (
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Account Settings & Preferences"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                    currentUser.avatarColor || 'bg-indigo-600'
                  }`}
                >
                  {currentUser.avatarInitials || 'US'}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <Settings className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Export CTA */}
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Export Strategic Plan</span>
              <span className="hidden sm:inline xl:hidden">Export Plan</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
