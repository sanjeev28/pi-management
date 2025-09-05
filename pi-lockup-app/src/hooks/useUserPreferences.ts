import { useState, useEffect } from 'react';
import type { UserPreferences } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.publicKey) {
      fetchPreferences();
    }
  }, [user?.publicKey]);

  const fetchPreferences = async () => {
    if (!user?.publicKey) return;

    setLoading(true);
    setError(null);

    try {
      // Set user context for RLS
      await supabase.rpc('set_current_user_id', { user_id: user.publicKey });

      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.publicKey)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw fetchError;
      }

      setPreferences(data || null);
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setError('Failed to fetch user preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user?.publicKey) return { success: false, error: 'User not authenticated' };

    setError(null);

    try {
      // Set user context for RLS
      await supabase.rpc('set_current_user_id', { user_id: user.publicKey });

      let result;
      
      if (preferences) {
        // Update existing preferences
        result = await supabase
          .from('user_preferences')
          .update(updates)
          .eq('user_id', user.publicKey)
          .select()
          .single();
      } else {
        // Create new preferences
        result = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.publicKey,
            ...updates,
          })
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      setPreferences(result.data);
      return { success: true };
    } catch (err) {
      console.error('Error updating preferences:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  };
}