import { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

export function useCompletionRate() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const getRate = useCallback(async (
        habitId: string,
        timeframe: '7d' | '30d' | 'all' = '30d',
        createdAt?: string
    ): Promise<number> => {
        if (!user) return 0;

        setIsLoading(true);
        setError(null);

        try {
            const client = await getAuthenticatedClient();
            if (!client) {
                setIsLoading(false);
                return 0;
            }

            const endDate = new Date().toISOString().split('T')[0];
            let startDate = '';

            if (timeframe === '7d') {
                const date = new Date();
                date.setDate(date.getDate() - 6);
                startDate = date.toISOString().split('T')[0];
            } else if (timeframe === '30d') {
                const date = new Date();
                date.setDate(date.getDate() - 29);
                startDate = date.toISOString().split('T')[0];
            } else if (timeframe === 'all' && createdAt) {
                startDate = createdAt.split('T')[0];
            } else {
                // Fallback to 30d if all but no createdAt
                const date = new Date();
                date.setDate(date.getDate() - 29);
                startDate = date.toISOString().split('T')[0];
            }

            const { data, error: fetchError } = await client
                .from('habit_completions')
                .select('completed_date')
                .eq('habit_id', habitId)
                .gte('completed_date', startDate)
                .lte('completed_date', endDate);

            if (fetchError) {
                setError(fetchError.message);
                setIsLoading(false);
                return 0;
            }

            const completedCount = (data || []).length;

            // Calculate total days in timeframe
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            const rate = (completedCount / totalDays) * 100;

            setIsLoading(false);
            return rate;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setIsLoading(false);
            return 0;
        }
    }, [user, getAuthenticatedClient]);

    return { getRate, isLoading, error };
}
