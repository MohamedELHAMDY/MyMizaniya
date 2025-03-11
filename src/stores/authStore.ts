import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ loading: false });
  },
  signUp: async (email: string, password: string) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    set({ loading: false });
  },
  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, session: null, loading: false });
  },
  setUser: (user) => set({ user, loading: false }),
  signInWithGoogle: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    set({ loading: false });
  },
  signInWithGithub: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) throw error;
    set({ loading: false });
  },
}));