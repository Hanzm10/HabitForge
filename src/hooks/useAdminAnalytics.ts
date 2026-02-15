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
    retentionRate: number;
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
            const thirtyDaysAgoDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

            // Run queries in parallel
            const [
                totalRes,
                new7dRes,
                new30dRes,
                dauRes,
                mauRes,
                habitsRes,
                completionsRes,
                growthRes,
                dailyHabitsRes
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', twentyFourHoursAgo),
                supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', thirtyDaysAgo),
                supabase.from('habits').select('*', { count: 'exact', head: true }),
                supabase.from('habit_completions').select('*', { count: 'exact', head: true }).gte('completed_date', thirtyDaysAgoDate),
                supabase.from('profiles').select('created_at').order('created_at', { ascending: true }).gte('created_at', thirtyDaysAgo),
                supabase.from('habits').select('*', { count: 'exact', head: true }).eq('frequency', 'daily')
            ]);

            // Check for errors
            const errors = [totalRes, new7dRes, new30dRes, dauRes, mauRes, habitsRes, completionsRes, growthRes, dailyHabitsRes]
                .filter(res => res.error)
                .map(res => res.error?.message);

            if (errors.length > 0) {
                throw new Error(errors[0]);
            }

            const totalUsers = totalRes.count || 0;
            const avgHabits = totalUsers > 0 ? (habitsRes.count || 0) / totalUsers : 0;

            const mau = mauRes.count || 0;
            const dau = dauRes.count || 0;
            const retentionRate = mau > 0 ? (dau / mau) * 100 : 0;

            // Simple avg completion rate: (total 30d completions) / (daily habits * 30 + weekly habits * 4)
            const dailyHabits = dailyHabitsRes.count || 0;
            const totalHabits = habitsRes.count || 0;
            const weeklyHabits = totalHabits - dailyHabits;
            const totalCompletions = completionsRes.count || 0;
            const expectedCompletions = (dailyHabits * 30) + (weeklyHabits * 4.3); // roughly 4.3 weeks in 30 days
            const avgCompletionRate = expectedCompletions > 0 ? (totalCompletions / expectedCompletions) * 100 : 0;

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
                dau,
                mau,
                avgHabits: parseFloat(avgHabits.toFixed(1)),
                avgCompletionRate: parseFloat(Math.min(avgCompletionRate, 100).toFixed(1)),
                retentionRate: parseFloat(Math.min(retentionRate, 100).toFixed(1)),
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
