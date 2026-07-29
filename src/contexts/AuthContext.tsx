import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, requireSupabase } from '../lib/supabase';
import { getUser, createUser, updateUser, upsertUserSettings, linkApplicationToUser } from '../lib/db';
import { notifyEvent } from '../lib/notifications';
import { syncProgressFromDb, clearProgressCache } from '../utils/storage';
import type { AuthUser } from '../types';

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

const DEFAULT_BATCH = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

async function ensureUserProfile(supabaseUser: { id: string; email?: string | null }): Promise<AuthUser | null> {
  let profile = await getUser(supabaseUser.id);
  if (!profile) {
    const fallback: AuthUser = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email?.split('@')[0] || 'User',
      role: 'intern',
      batch: DEFAULT_BATCH,
      joinedDate: new Date().toISOString().split('T')[0],
      onboardingComplete: false,
    };
    try {
      await createUser(fallback);
      profile = fallback;
    } catch {
      profile = await getUser(supabaseUser.id);
    }
  }
  return profile;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const profile = await ensureUserProfile(session.user);
          setUser(profile);
          if (profile) {
            syncProgressFromDb(profile.id).catch(() => {});
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await ensureUserProfile(session.user);
        setUser(profile);
        if (profile) {
          syncProgressFromDb(profile.id).catch(() => {});
        }
      } else {
        setUser(null);
        clearProgressCache();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const sb = requireSupabase();
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (!data.user) return { error: 'Sign in failed. No user returned.' };
      const profile = await ensureUserProfile(data.user);
      if (profile) {
        setUser(profile);
        syncProgressFromDb(profile.id).catch(() => {});
      }
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An unexpected error occurred.' };
    }
  }, []);

  const signUp = useCallback(async (data: SignUpData): Promise<{ error?: string }> => {
    if (data.password.length < 6) return { error: 'Password must be at least 6 characters.' };

    try {
      const sb = requireSupabase();
      const { data: authData, error } = await sb.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) return { error: error.message };
      if (!authData.user) return { error: 'Sign up failed. No user returned.' };

      const now = new Date().toISOString().split('T')[0];
      const profile: AuthUser = {
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: 'intern',
        college: data.college,
        yearOfStudy: data.yearOfStudy,
        batch: DEFAULT_BATCH,
        joinedDate: now,
        onboardingComplete: false,
      };

      await createUser(profile);
      notifyEvent('account_created', profile.id, {
        name: data.name,
      }).catch(() => {});
      await upsertUserSettings(authData.user.id, { theme: 'light', displayName: data.name });
      await linkApplicationToUser(data.email, authData.user.id).catch(() => {});

      setUser(profile);
      syncProgressFromDb(profile.id).catch(() => {});

      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An unexpected error occurred.' };
    }
  }, []);

  const signOut = useCallback(() => {
    try {
      const sb = requireSupabase();
      sb.auth.signOut();
    } catch { /* ignore */ }
    setUser(null);
    clearProgressCache();
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (!user) return;
    const updated = { ...user, onboardingComplete: true };
    try {
      await updateUser(user.id, { onboardingComplete: true });
    } catch { /* fallback: continue with local state */ }
    setUser(updated);
  }, [user]);

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
