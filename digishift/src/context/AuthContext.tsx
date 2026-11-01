import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserPreferences,
  SecurityRecord,
  ThemePreference,
} from '../types/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  login: (email: string, password: string) => {
    success: boolean;
    error?: string;
    remainingAttempts?: number;
    lockedSeconds?: number;
  };
  register: (data: {
    name: string;
    email: string;
    password: string;
    company: string;
    title: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  updatePreferences: (updated: Partial<UserPreferences>) => void;
  getSecurityStatus: (email: string) => {
    isLocked: boolean;
    remainingAttempts: number;
    lockedSeconds: number;
  };
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  currency: 'USD',
  compactMode: true,
  displayDensity: 'laptop',
  advisorTone: 'pragmatic',
  showComparisonOverlayByDefault: true,
  emailNotifications: true,
};

// Initial default user
const SEED_USER: UserProfile = {
  id: 'usr_seed_1',
  email: 'alex.morgan@apexprecision.com',
  name: 'Alex Morgan',
  title: 'Managing Director & Operations Head',
  company: 'Apex Precision CNC Fabricators',
  department: 'Executive Management',
  phone: '+1 (555) 234-8900',
  bio: 'Second-generation precision machine shop operator modernizing shop floor operations and digital cashflow.',
  avatarInitials: 'AM',
  avatarColor: 'bg-indigo-600',
  registeredAt: '2026-03-15T09:00:00Z',
  lastLoginAt: new Date().toISOString(),
};

const SEED_USERS_STORE: Record<string, { profile: UserProfile; passwordHash: string }> = {
  'alex.morgan@apexprecision.com': {
    profile: SEED_USER,
    passwordHash: 'Password123!',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users from localStorage or initialize
  const [usersStore, setUsersStore] = useState<Record<string, { profile: UserProfile; passwordHash: string }>>(() => {
    try {
      const saved = localStorage.getItem('digishift_users_db');
      return saved ? JSON.parse(saved) : SEED_USERS_STORE;
    } catch {
      return SEED_USERS_STORE;
    }
  });

  // Current session user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedSession = localStorage.getItem('digishift_session_user');
      return savedSession ? JSON.parse(savedSession) : SEED_USER; // default active session
    } catch {
      return SEED_USER;
    }
  });

  // User preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const savedPrefs = localStorage.getItem('digishift_user_preferences');
      return savedPrefs ? { ...DEFAULT_PREFERENCES, ...JSON.parse(savedPrefs) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Failed login attempts tracking (persisted)
  const [securityStore, setSecurityStore] = useState<Record<string, SecurityRecord>>(() => {
    try {
      const saved = localStorage.getItem('digishift_security_db');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save users db on change
  useEffect(() => {
    localStorage.setItem('digishift_users_db', JSON.stringify(usersStore));
  }, [usersStore]);

  // Save security db on change
  useEffect(() => {
    localStorage.setItem('digishift_security_db', JSON.stringify(securityStore));
  }, [securityStore]);

  // Apply Theme to DOM
  useEffect(() => {
    const applyTheme = (theme: ThemePreference) => {
      const root = document.documentElement;
      let isDark = false;

      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(preferences.theme);
    const density = preferences.displayDensity || (preferences.compactMode ? 'compact' : 'laptop');
    document.documentElement.setAttribute('data-density', density);
    localStorage.setItem('digishift_user_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Check security status for an email
  const getSecurityStatus = (email: string) => {
    const record = securityStore[email.toLowerCase().trim()];
    if (!record) {
      return { isLocked: false, remainingAttempts: MAX_LOGIN_ATTEMPTS, lockedSeconds: 0 };
    }

    const now = Date.now();
    if (record.lockedUntil && record.lockedUntil > now) {
      const lockedSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { isLocked: true, remainingAttempts: 0, lockedSeconds };
    }

    // Lockout expired, reset attempts
    if (record.lockedUntil && record.lockedUntil <= now) {
      return { isLocked: false, remainingAttempts: MAX_LOGIN_ATTEMPTS, lockedSeconds: 0 };
    }

    const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - record.failedAttempts);
    return { isLocked: remaining === 0, remainingAttempts: remaining, lockedSeconds: 0 };
  };

  // Login handler with Maximum Limits enforcement
  const login = (emailInput: string, passwordInput: string) => {
    const email = emailInput.toLowerCase().trim();
    const secStatus = getSecurityStatus(email);

    if (secStatus.isLocked) {
      return {
        success: false,
        error: `Account locked due to maximum login attempts. Please wait ${secStatus.lockedSeconds}s before retrying.`,
        lockedSeconds: secStatus.lockedSeconds,
      };
    }

    const userEntry = usersStore[email];

    if (!userEntry || userEntry.passwordHash !== passwordInput) {
      // Record failed attempt
      const now = Date.now();
      const currentFailed = (securityStore[email]?.failedAttempts || 0) + 1;
      const isNowLocked = currentFailed >= MAX_LOGIN_ATTEMPTS;
      const lockedUntil = isNowLocked ? now + LOCKOUT_DURATION_MS : null;

      const updatedRecord: SecurityRecord = {
        failedAttempts: isNowLocked ? currentFailed : currentFailed,
        lockedUntil,
        lastAttemptAt: now,
      };

      setSecurityStore((prev) => ({
        ...prev,
        [email]: updatedRecord,
      }));

      const remaining = Math.max(0, MAX_LOGIN_ATTEMPTS - currentFailed);

      if (isNowLocked) {
        return {
          success: false,
          error: `Maximum login attempts exceeded (${MAX_LOGIN_ATTEMPTS}/${MAX_LOGIN_ATTEMPTS}). Your account is locked for 60 seconds to prevent unauthorized access.`,
          remainingAttempts: 0,
          lockedSeconds: 60,
        };
      }

      return {
        success: false,
        error: `Invalid email or password. You have ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
        remainingAttempts: remaining,
      };
    }

    // Success: clear failed attempts
    setSecurityStore((prev) => {
      const copy = { ...prev };
      delete copy[email];
      return copy;
    });

    const updatedProfile: UserProfile = {
      ...userEntry.profile,
      lastLoginAt: new Date().toISOString(),
    };

    setCurrentUser(updatedProfile);
    localStorage.setItem('digishift_session_user', JSON.stringify(updatedProfile));

    return { success: true };
  };

  // Register handler
  const register = (data: {
    name: string;
    email: string;
    password: string;
    company: string;
    title: string;
  }) => {
    const email = data.email.toLowerCase().trim();

    if (usersStore[email]) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const initials = data.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'US';

    const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-blue-600', 'bg-purple-600', 'bg-rose-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      email,
      name: data.name,
      title: data.title || 'Digital Transformation Lead',
      company: data.company || 'Enterprise Partner',
      department: 'Operations',
      phone: '',
      bio: 'SME modernization leader driving operational velocity.',
      avatarInitials: initials,
      avatarColor: randomColor,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const updatedStore = {
      ...usersStore,
      [email]: {
        profile: newProfile,
        passwordHash: data.password,
      },
    };

    setUsersStore(updatedStore);
    setCurrentUser(newProfile);
    localStorage.setItem('digishift_session_user', JSON.stringify(newProfile));

    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('digishift_session_user');
  };

  // Update profile
  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const merged: UserProfile = { ...currentUser, ...updated };
    setCurrentUser(merged);
    localStorage.setItem('digishift_session_user', JSON.stringify(merged));

    // Update in store
    setUsersStore((prev) => {
      const existing = prev[merged.email.toLowerCase()];
      if (!existing) return prev;
      return {
        ...prev,
        [merged.email.toLowerCase()]: {
          ...existing,
          profile: merged,
        },
      };
    });
  };

  // Update preferences (themes, appearance, currency)
  const updatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const merged = { ...prev, ...updated };
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        preferences,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences,
        getSecurityStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
