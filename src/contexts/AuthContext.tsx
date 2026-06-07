import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type UserRole = 'intern' | 'mentor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  college?: string;
  yearOfStudy?: string;
  batch: string;
  joinedDate: string;
  onboardingComplete: boolean;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  college?: string;
  yearOfStudy?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => void;
  completeOnboarding: () => void;
}

const USERS_KEY = 'intern-training-users';
const AUTH_KEY = 'intern-training-auth';

function loadUsers(): Record<string, { profile: AuthUser; password: string }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveUsers(users: Record<string, { profile: AuthUser; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const { userId } = JSON.parse(raw);
    const users = loadUsers();
    return users[userId]?.profile || null;
  } catch { return null; }
}

function saveSession(userId: string) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ userId }));
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const users = loadUsers();
    const hashed = simpleHash(password);
    const entry = Object.values(users).find(u => u.profile.email === email);
    if (!entry) return { error: 'No account found with this email.' };
    if (entry.password !== hashed) return { error: 'Invalid password.' };
    saveSession(entry.profile.id);
    setUser(entry.profile);
    return {};
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<{ error?: string }> => {
    const users = loadUsers();
    const existing = Object.values(users).find(u => u.profile.email === data.email);
    if (existing) return { error: 'An account with this email already exists.' };
    if (data.password.length < 6) return { error: 'Password must be at least 6 characters.' };
    if (data.password !== data.password) return { error: 'Passwords do not match.' };

    const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString().split('T')[0];
    const profile: AuthUser = {
      id,
      email: data.email,
      name: data.name,
      role: 'intern',
      college: data.college,
      yearOfStudy: data.yearOfStudy,
      batch: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      joinedDate: now,
      onboardingComplete: false,
    };

    users[id] = { profile, password: simpleHash(data.password) };
    saveUsers(users);
    saveSession(id);
    setUser(profile);
    return {};
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev;
      const users = loadUsers();
      const entry = users[prev.id];
      if (!entry) return prev;
      const updated = { ...prev, onboardingComplete: true };
      users[prev.id] = { ...entry, profile: updated };
      saveUsers(users);
      saveSession(prev.id);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
