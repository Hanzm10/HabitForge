import { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

interface StreakData {
    current: number;
    longest: number;
}

export function useStreaks() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streaks, setStreaks] = useState<Map<string, StreakData>>(new Map());

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

    const calculateStreaks = (dates: string[]) => {
        if (dates.length === 0) return { current: 0, longest: 0 };

        // Ensure dates are unique and sorted descending (newest first)
        const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b.localeCompare(a));

        let current = 0;
        let longest = 0;
        let tempStreak = 0;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Calculate current streak
        // Check if the most recent completion is today or yesterday
        const lastCompletion = uniqueDates[0];
        let isStreakActive = false;

        if (lastCompletion === today || lastCompletion === yesterday) {
            isStreakActive = true;
        }

        if (!isStreakActive) {
            current = 0;
        } else {
            // Count backwards from the most recent date
            let currentDate = new Date(lastCompletion);

            // First day counts as 1
            current = 1;

            for (let i = 1; i < uniqueDates.length; i++) {
                const prevDate = new Date(uniqueDates[i]);
                const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    current++;
                    currentDate = prevDate;
                } else {
                    break;
                }
            }
        }

        // Calculate longest streak
        // Iterate through all dates
        if (uniqueDates.length > 0) {
            tempStreak = 1;
            longest = 1;
            let currentDate = new Date(uniqueDates[0]);

            for (let i = 1; i < uniqueDates.length; i++) {
                const prevDate = new Date(uniqueDates[i]);
                const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }

                if (tempStreak > longest) {
                    longest = tempStreak;
                }
                currentDate = prevDate;
            }
        }

        return { current, longest };
    };

    const fetchStreaks = useCallback(async (): Promise<void> => {
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

            // Get user's habits
            const { data: userHabits, error: habitsError } = await client
                .from('habits')
                .select('id')
                .eq('profile_id', profileId)
                .eq('is_archived', false);

            if (habitsError) {
                setError(habitsError.message);
                setIsLoading(false);
                return;
            }

            if (!userHabits || userHabits.length === 0) {
                setStreaks(new Map());
                setIsLoading(false);
                return;
            }

            const habitIds = userHabits.map((h: { id: string }) => h.id);

            // Fetch all completions for these habits
            const { data: completions, error: compError } = await client
                .from('habit_completions')
                .select('habit_id, completed_date')
                .in('habit_id', habitIds)
                .order('completed_date', { ascending: false });

            if (compError) {
                setError(compError.message);
                setIsLoading(false);
                return;
            }

            // Group by habit_id
            const habitCompletions = new Map<string, string[]>();
            habitIds.forEach((id: string) => habitCompletions.set(id, []));

            (completions || []).forEach((c: { habit_id: string; completed_date: string }) => {
                const dates = habitCompletions.get(c.habit_id) || [];
                dates.push(c.completed_date);
                habitCompletions.set(c.habit_id, dates);
            });

            // Calculate streaks for each habit
            const newStreaks = new Map<string, StreakData>();
            habitCompletions.forEach((dates, habitId) => {
                newStreaks.set(habitId, calculateStreaks(dates));
            });

            setStreaks(newStreaks);
            setIsLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setIsLoading(false);
        }
    }, [user, getAuthenticatedClient, getProfileId]);

    return { streaks, fetchStreaks, isLoading, error };
}
