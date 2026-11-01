import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemePreference, CurrencyFormat, AdvisorTone } from '../types/auth';
import {
  Sun,
  Moon,
  Laptop,
  User,
  Shield,
  Sliders,
  LogOut,
  Check,
  Save,
  DollarSign,
  Bot,
  Bell,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const { currentUser, preferences, updateProfile, updatePreferences, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'security'>('profile');

  // Local Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    title: currentUser?.title || '',
    company: currentUser?.company || '',
    department: currentUser?.department || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
  });

  const [saveFeedback, setSaveFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Account Profile & App Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage executive identity, appearance theme, and advisory configuration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 my-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Executive Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appearance')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'appearance'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Theme & Appearance</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security & Limits</span>
          </button>
        </div>

        {/* TAB 1: Profile Details */}
        {activeTab === 'profile' && (
          <div>
            {!currentUser ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  You are currently using DigiShift as a guest. Sign in to save custom profiles across devices.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-slate-800"
                >
                  Sign In / Register
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Avatar Banner */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-xs ${
                      currentUser.avatarColor || 'bg-indigo-600'
                    }`}
                  >
                    {currentUser.avatarInitials || 'AM'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {currentUser.email}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Member since {new Date(currentUser.registeredAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Title / Role
                    </label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Executive Bio / Strategic Focus
                  </label>
                  <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {saveFeedback && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 rounded-lg shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: Appearance & Preferences */}
        {activeTab === 'appearance' && (
          <div className="space-y-5">
            {/* Theme / Appearance Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                Interface Color Appearance
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light' as const, label: 'Light Mode', icon: <Sun className="w-4 h-4 text-amber-500" /> },
                  { id: 'dark' as const, label: 'Dark Mode', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
                  { id: 'system' as const, label: 'System Default', icon: <Laptop className="w-4 h-4 text-slate-500" /> },
                ].map((th) => {
                  const isSelected = preferences.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => updatePreferences({ theme: th.id })}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {th.icon}
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {th.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Density & Laptop Ratio Optimization */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    Display Density & Laptop Ratio
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Auto-calibrates 100% zoom so full cards, charts, and metrics are visible without manual 75% browser zooming.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'laptop' as const,
                    label: 'Laptop Fit (100% Zoom)',
                    tag: 'Recommended',
                    desc: 'Crisp 75-80% proportional FOV for 1366–1920px laptop screens.',
                  },
                  {
                    id: 'compact' as const,
                    label: 'Ultra Compact',
                    tag: 'High Density',
                    desc: 'Dense tabular layout for multi-tasking or split-window sidebars.',
                  },
                  {
                    id: 'standard' as const,
                    label: 'Standard Large',
                    tag: 'Default 16px',
                    desc: 'Full-size elements for large 4K / 32" external monitors.',
                  },
                ].map((den) => {
                  const currentDensity = preferences.displayDensity || 'laptop';
                  const isSelected = currentDensity === den.id;
                  return (
                    <button
                      key={den.id}
                      type="button"
                      onClick={() => updatePreferences({ displayDensity: den.id, compactMode: den.id !== 'standard' })}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-950 px-1 rounded">
                          {den.tag}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {den.label}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {den.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currency Format */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                Financial Currency Symbol
              </label>
              <div className="flex flex-wrap gap-2">
                {(['USD', 'EUR', 'GBP', 'AUD', 'SGD'] as const).map((curr) => {
                  const isSelected = preferences.currency === curr;
                  return (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => updatePreferences({ currency: curr })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {curr} ({curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '$'})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Advisor Persona Tone */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                AI Advisor Tone & Persona
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pragmatic' as const, label: 'Pragmatic & Turnkey', desc: 'Focus on immediate quick wins and easy SaaS tools.' },
                  { id: 'analytical' as const, label: 'Analytical & Rigorous', desc: 'Detailed quantitative metrics and financial math.' },
                  { id: 'executive' as const, label: 'Executive Brief', desc: 'High-level summaries formatted for CEO / Board.' },
                ].map((tone) => {
                  const isSelected = preferences.advisorTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => updatePreferences({ advisorTone: tone.id })}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold">{tone.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {tone.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security & Session */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Brute-Force Rate Limiting Active</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                DigiShift enforces a strict maximum limit of <span className="font-bold font-mono">5 failed attempts</span> per email address. Exceeding this threshold triggers a temporary 60-second lockout to protect SME operational data.
              </p>
              {currentUser && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 font-mono">
                  Active session: {currentUser.email} · Last login: {new Date(currentUser.lastLoginAt).toLocaleString()}
                </div>
              )}
            </div>

            {currentUser && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">
                  Ready to sign out of this session?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
