import { useState, useCallback, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

interface WeeklyProgressData {
    actual: number;
    target: number;
    percentage: number;
}

export function useWeeklyProgress() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<WeeklyProgressData>({
        actual: 0,
        target: 0,
        percentage: 0,
    });

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

    const fetchWeeklyProgress = useCallback(async () => {
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

            // 1. Calculate the current week's range (Monday to Sunday)
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
            const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

            const monday = new Date(today);
            monday.setDate(today.getDate() - diffToMonday);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const startDate = formatDate(monday);
            const endDate = formatDate(sunday);

            // 2. Fetch all active habits
            const { data: habits, error: habitsError } = await client
                .from('habits')
                .select('*')
                .eq('profile_id', profileId)
                .eq('is_archived', false)
                .order('created_at', { ascending: false });

            if (habitsError) {
                setError(habitsError.message);
                setIsLoading(false);
                return;
            }

            if (!habits || habits.length === 0) {
                setProgress({ actual: 0, target: 0, percentage: 0 });
                setIsLoading(false);
                return;
            }

            // 3. Calculate Target
            let target = 0;
            habits.forEach((habit: any) => {
                if (habit.frequency === 'daily') {
                    target += 7;
                } else if (habit.frequency === 'weekly') {
                    target += 1;
                }
            });

            // 4. Fetch completions for this week
            const habitIds = habits.map((h: any) => h.id);
            const { data: completions, error: compError } = await client
                .from('habit_completions')
                .select('habit_id, completed_date')
                .in('habit_id', habitIds)
                .gte('completed_date', startDate)
                .lte('completed_date', endDate);

            if (compError) {
                setError(compError.message);
                setIsLoading(false);
                return;
            }

            // 5. Calculate Actual
            const actual = completions?.length || 0;
            const percentage = target > 0 ? Math.round((actual / target) * 100) : 0;

            setProgress({ actual, target, percentage });
            setIsLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setIsLoading(false);
        }
    }, [user, getAuthenticatedClient, getProfileId]);

    useEffect(() => {
        fetchWeeklyProgress();
    }, [fetchWeeklyProgress]);

    return { progress, isLoading, error, refresh: fetchWeeklyProgress };
}
