import type { AuthError, Session, Subscription } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

type AuthState = {
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
};

type AuthActions = {
  initialize: () => void;
  dispose: () => void;
  signInWithOtp: (email: string) => Promise<{ error: AuthError | null }>;
  verifyOtp: (
    email: string,
    token: string,
  ) => Promise<{ error: AuthError | null }>;
  signInAnonymously: () => Promise<{ error: AuthError | null }>;
  linkEmail: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
};

type AuthStore = AuthState & AuthActions;

let subscription: Subscription | null = null;

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isLoading: true,
  isInitialized: false,

  initialize: () => {
    // 多重呼び出しガード: 既存の subscription があれば先に解除
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }

    void supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          set({ session: null, isLoading: false, isInitialized: true });
          return;
        }
        set({ session, isLoading: false, isInitialized: true });
      })
      .catch(() => {
        set({ session: null, isLoading: false, isInitialized: true });
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
    subscription = data.subscription;
  },

  dispose: () => {
    subscription?.unsubscribe();
    subscription = null;
  },

  signInWithOtp: async (email) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (email, token) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },

  signInAnonymously: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInAnonymously();
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },

  linkEmail: async (email) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.updateUser({ email });
      return { error };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));
