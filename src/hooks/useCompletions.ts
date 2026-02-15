import { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

interface MutationResult {
    success: boolean;
    error?: string;
}

export function useCompletions() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [completions, setCompletions] = useState<Map<string, string>>(new Map());
    const [history, setHistory] = useState<Map<string, number>>(new Map());

    const getAuthenticatedClient = useCallback(async () => {
        if (!user) return null;

        const token = await getToken({ template: 'supabase' });
        if (!token) return null;

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        return createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
        });
    }, [user, getToken]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getProfileId = useCallback(async (client: any) => {
        if (!user) return null;

        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('id')
            .eq('clerk_user_id', user.id)
            .single();

        if (profileError || !profile) return null;
        return (profile as { id: string }).id;
    }, [user]);

    // =========================================================================
    // fetchCompletions — load completions for a specific date
    // =========================================================================

    const fetchCompletions = useCallback(async (date: string): Promise<void> => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const client = await getAuthenticatedClient();
            if (!client) {
                setIsLoading(false);
                return;
            }

            const profileId = await getProfileId(client);
            if (!profileId) {
                setError('Profile not found');
                setIsLoading(false);
                return;
            }

            // First get the user's habit IDs
            const { data: userHabits, error: habitsError } = await client
                .from('habits')
                .select('id')
                .eq('profile_id', profileId)
                .eq('is_archived', false);

            if (habitsError || !userHabits || userHabits.length === 0) {
                setCompletions(new Map());
                setIsLoading(false);
                return;
            }

            const habitIds = userHabits.map((h: { id: string }) => h.id);

            // Fetch completions for those habits on the given date
            const { data: completionRows, error: compError } = await client
                .from('habit_completions')
                .select('id, habit_id')
                .eq('completed_date', date)
                .in('habit_id', habitIds);

            if (compError) {
                setError(compError.message);
                setCompletions(new Map());
                setIsLoading(false);
                return;
            }

            const map = new Map<string, string>();
            (completionRows || []).forEach((row: { id: string; habit_id: string }) => {
                map.set(row.habit_id, row.id);
            });

            setCompletions(map);
            setIsLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setCompletions(new Map());
            setIsLoading(false);
        }
    }, [user, getAuthenticatedClient, getProfileId]);

    // =========================================================================
    // fetchHistory — load completion counts for a date range
    // =========================================================================

    const fetchHistory = useCallback(async (startDate: string, endDate: string): Promise<void> => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            const client = await getAuthenticatedClient();
            if (!client) {
                setIsLoading(false);
                return;
            }

            const profileId = await getProfileId(client);
            if (!profileId) {
                setError('Profile not found');
                setIsLoading(false);
                return;
            }

            // First get the user's habit IDs
            const { data: userHabits, error: habitsError } = await client
                .from('habits')
                .select('id')
                .eq('profile_id', profileId)
                .eq('is_archived', false);

            if (habitsError || !userHabits || userHabits.length === 0) {
                setHistory(new Map());
                setIsLoading(false);
                return;
            }

            const habitIds = userHabits.map((h: { id: string }) => h.id);

            // Fetch completions for those habits within date range
            const { data: completionRows, error: compError } = await client
                .from('habit_completions')
                .select('completed_date')
                .in('habit_id', habitIds)
                .gte('completed_date', startDate)
                .lte('completed_date', endDate);

            if (compError) {
                setError(compError.message);
                setHistory(new Map());
                setIsLoading(false);
                return;
            }

            // Aggregate counts per date
            const counts = new Map<string, number>();
            (completionRows || []).forEach((row: { completed_date: string }) => {
                const date = row.completed_date;
                counts.set(date, (counts.get(date) || 0) + 1);
            });

            setHistory(counts);
            setIsLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setHistory(new Map());
            setIsLoading(false);
        }
    }, [user, getAuthenticatedClient, getProfileId]);


    // =========================================================================
    // toggleCompletion — insert or delete a completion for a habit + date
    // =========================================================================

    const toggleCompletion = useCallback(async (habitId: string, date: string): Promise<MutationResult> => {
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        setIsLoading(true);
        setError(null);

        try {
            const client = await getAuthenticatedClient();
            if (!client) {
                setIsLoading(false);
                return { success: false, error: 'Failed to get auth token' };
            }

            const existingCompletionId = completions.get(habitId);

            if (existingCompletionId) {
                // DELETE — uncomplete the habit
                const { error: deleteError } = await client
                    .from('habit_completions')
                    .delete()
                    .eq('id', existingCompletionId);

                if (deleteError) {
                    setError(deleteError.message);
                    setIsLoading(false);
                    return { success: false, error: deleteError.message };
                }

                // Update local state
                setCompletions(prev => {
                    const next = new Map(prev);
                    next.delete(habitId);
                    return next;
                });

                setIsLoading(false);
                return { success: true };
            } else {
                // INSERT — complete the habit
                const { data, error: insertError } = await client
                    .from('habit_completions')
                    .insert({
                        habit_id: habitId,
                        completed_date: date,
                    })
                    .select('id')
                    .single();

                if (insertError) {
                    setError(insertError.message);
                    setIsLoading(false);
                    return { success: false, error: insertError.message };
                }

                // Update local state
                if (data) {
                    setCompletions(prev => {
                        const next = new Map(prev);
                        next.set(habitId, (data as { id: string }).id);
                        return next;
                    });
                }

                setIsLoading(false);
                return { success: true };
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setIsLoading(false);
            return { success: false, error: message };
        }
    }, [user, getAuthenticatedClient, completions]);

    return { completions, history, fetchCompletions, fetchHistory, toggleCompletion, isLoading, error };
}
