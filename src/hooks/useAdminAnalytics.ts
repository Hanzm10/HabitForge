import { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

export interface AdminAnalytics {
    totalUsers: number;
    newUsers7d: number;
    newUsers30d: number;
    dau: number;
    mau: number;
    avgHabits: number;
    avgCompletionRate: number;
    growthData: { date: string; count: number }[];
}

export function useAdminAnalytics() {
    const { getToken } = useAuth();
    const { isLoaded, isSignedIn } = useUser();
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
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

            // Help calculate dates
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

            // Run queries in parallel
            // Note: For growthData, we'll fetch profiles from last 30 days to group them
            const [
                totalRes,
                new7dRes,
                new30dRes,
                dauRes,
                mauRes,
                habitsRes,
                completionsRes,
                growthRes
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', twentyFourHoursAgo),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', thirtyDaysAgo),
                supabase.from('habits').select('*', { count: 'exact', head: true }),
                supabase.from('habit_completions').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('created_at').order('created_at', { ascending: true }).gte('created_at', thirtyDaysAgo)
            ]);

            // Check for errors
            const errors = [totalRes, new7dRes, new30dRes, dauRes, mauRes, habitsRes, completionsRes, growthRes]
                .filter(res => res.error)
                .map(res => res.error?.message);

            if (errors.length > 0) {
                throw new Error(errors[0]);
            }

            const totalUsers = totalRes.count || 0;
            const avgHabits = totalUsers > 0 ? (habitsRes.count || 0) / totalUsers : 0;

            // Process growth data (group by day)
            const growthMap = new Map<string, number>();

            // Initialize last 30 days with 0
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
                growthMap.set(dateStr, 0);
            }

            // Fill with real data
            growthRes.data?.forEach(profile => {
                const dateStr = profile.created_at.split('T')[0];
                if (growthMap.has(dateStr)) {
                    growthMap.set(dateStr, (growthMap.get(dateStr) || 0) + 1);
                }
            });

            const growthData = Array.from(growthMap.entries()).map(([date, count]) => ({
                date,
                count
            }));

            setAnalytics({
                totalUsers,
                newUsers7d: new7dRes.count || 0,
                newUsers30d: new30dRes.count || 0,
                dau: dauRes.count || 0,
                mau: mauRes.count || 0,
                avgHabits: parseFloat(avgHabits.toFixed(1)),
                avgCompletionRate: 0, // Placeholder for now
                growthData
            });
        } catch (err: any) {
            console.error('Failed to fetch admin analytics:', err);
            setError(err.message || 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [isLoaded, isSignedIn, getToken]);

    return {
        analytics,
        isLoading,
        error,
        fetchAnalytics
    };
}
