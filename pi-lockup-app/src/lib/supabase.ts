import { createClient } from '@supabase/supabase-js';
import type { Lockup, UserPreferences } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better type safety
export interface Database {
  public: {
    Tables: {
      lockups: {
        Row: Lockup;
        Insert: Omit<Lockup, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lockup, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_preferences: {
        Row: UserPreferences;
        Insert: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export type SupabaseClient = typeof supabase;