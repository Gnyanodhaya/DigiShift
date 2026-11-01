export interface UserProfile {
  id: string;
  email: string;
  name: string;
  title: string;
  company: string;
  department: string;
  phone?: string;
  bio?: string;
  avatarInitials: string;
  avatarColor: string;
  registeredAt: string;
  lastLoginAt: string;
}

export type ThemePreference = 'light' | 'dark' | 'system';
export type CurrencyFormat = 'USD' | 'EUR' | 'GBP' | 'AUD' | 'SGD';
export type AdvisorTone = 'pragmatic' | 'analytical' | 'executive';
export type DisplayDensity = 'laptop' | 'compact' | 'standard';

export interface UserPreferences {
  theme: ThemePreference;
  currency: CurrencyFormat;
  compactMode: boolean;
  displayDensity: DisplayDensity;
  advisorTone: AdvisorTone;
  showComparisonOverlayByDefault: boolean;
  emailNotifications: boolean;
}

export interface SecurityRecord {
  failedAttempts: number;
  lockedUntil: number | null; // timestamp in ms
  lastAttemptAt: number | null;
}

export interface AuthState {
  currentUser: UserProfile | null;
  preferences: UserPreferences;
  isAuthenticated: boolean;
}
