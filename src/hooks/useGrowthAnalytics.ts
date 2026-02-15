import { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

export interface GrowthDataPoint {
    date: string;
    count: number;
}

export function useGrowthAnalytics(days: number = 30) {
    const { getToken } = useAuth();
    const { isLoaded, isSignedIn } = useUser();
    const [data, setData] = useState<GrowthDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGrowth = useCallback(async () => {
        if (!isLoaded || !isSignedIn) return;

        setIsLoading(true);
        setError(null);

        try {
            const token = await getToken({ template: 'supabase' });
            if (!token) throw new Error('No authentication token');

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: `Bearer ${token}` } },
            });

            // Calculate start date
            const now = new Date();
            const startDate = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
            startDate.setUTCHours(0, 0, 0, 0);

            // Fetch profiles
            // To get accurate cumulative counts, we ideally need total users before startDate
            // But for a simple growth graph of the "last X days", we can just fetch all and filter
            // or fetch count before startDate + join with daily growth.

            const [baseCountRes, newProfilesRes] = await Promise.all([
                supabase.from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .lt('created_at', startDate.toISOString()),
                supabase.from('profiles')
                    .select('created_at')
                    .gte('created_at', startDate.toISOString())
                    .order('created_at', { ascending: true })
            ]);

            if (baseCountRes.error) throw baseCountRes.error;
            if (newProfilesRes.error) throw newProfilesRes.error;

            let runningTotal = baseCountRes.count || 0;
            const dailyCounts = new Map<string, number>();

            // Initialize the range
            for (let i = 0; i < days; i++) {
                const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
                dailyCounts.set(dateStr, 0);
            }

            // Fill with real new daily users
            newProfilesRes.data?.forEach(profile => {
                const dateStr = profile.created_at.split('T')[0];
                if (dailyCounts.has(dateStr)) {
                    dailyCounts.set(dateStr, (dailyCounts.get(dateStr) || 0) + 1);
                }
            });

            // Convert to cumulative series
            const result: GrowthDataPoint[] = [];
            dailyCounts.forEach((dailyNew, dateStr) => {
                runningTotal += dailyNew;
                result.push({ date: dateStr, count: runningTotal });
            });

            setData(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn, getToken, days]);

    return {
        data,
        isLoading,
        error,
        fetchGrowth
    };
}
