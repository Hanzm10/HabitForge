import { useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

interface CreateHabitInput {
    name: string;
    description?: string;
    color: string;
    icon?: string;
    frequency: 'daily' | 'weekly';
}

interface UpdateHabitInput {
    name?: string;
    description?: string | null;
    color?: string;
    icon?: string | null;
    frequency?: 'daily' | 'weekly';
}

interface HabitRow {
    id: string;
    profile_id: string;
    name: string;
    description: string | null;
    color: string;
    icon: string | null;
    frequency: string;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

interface MutationResult {
    success: boolean;
    error?: string;
}

export function useHabits() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [habits, setHabits] = useState<HabitRow[]>([]);

    const getAuthenticatedClient = useCallback(async () => {
        if (!user) return null;

        const token = await getToken({ template: 'supabase' });

        // Debugging
        console.log('HabitForge: Fetching Supabase client. Token present:', !!token);

        if (!token) {
            console.error('HabitForge: No Supabase token found. Check Clerk JWT template.');
            return null;
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        return createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
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
    // createHabit
    // =========================================================================

    const createHabit = useCallback(async (input: CreateHabitInput): Promise<MutationResult> => {
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

            const profileId = await getProfileId(client);
            if (!profileId) {
                const msg = 'Profile not found';
                setError(msg);
                setIsLoading(false);
                return { success: false, error: msg };
            }

            const { error: insertError } = await client.from('habits').insert({
                name: input.name,
                description: input.description || null,
                color: input.color,
                icon: input.icon || null,
                frequency: input.frequency,
                profile_id: profileId,
            });

            if (insertError) {
                setError(insertError.message);
                setIsLoading(false);
                return { success: false, error: insertError.message };
            }

            setIsLoading(false);
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setIsLoading(false);
            return { success: false, error: message };
        }
    }, [user, getAuthenticatedClient, getProfileId]);

    // =========================================================================
    // fetchHabits
    // =========================================================================

    const fetchHabits = useCallback(async (): Promise<void> => {
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

            const { data, error: fetchError } = await client
                .from('habits')
                .select('*')
                .eq('profile_id', profileId)
                .eq('is_archived', false)
                .order('created_at', { ascending: false });

            if (fetchError) {
                setError(fetchError.message);
                setHabits([]);
                setIsLoading(false);
                return;
            }

            setHabits(data || []);
            setIsLoading(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setHabits([]);
            setIsLoading(false);
        }
    }, [user, getAuthenticatedClient, getProfileId]);

    // =========================================================================
    // updateHabit
    // =========================================================================

    const updateHabit = useCallback(async (habitId: string, input: UpdateHabitInput): Promise<MutationResult> => {
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

            const { error: updateError } = await client
                .from('habits')
                .update(input)
                .eq('id', habitId);

            if (updateError) {
                setError(updateError.message);
                setIsLoading(false);
                return { success: false, error: updateError.message };
            }

            setIsLoading(false);
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setIsLoading(false);
            return { success: false, error: message };
        }
    }, [user, getAuthenticatedClient]);

    // =========================================================================
    // deleteHabit (soft-delete: set is_archived = true)
    // =========================================================================

    const deleteHabit = useCallback(async (habitId: string): Promise<MutationResult> => {
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

            const { error: deleteError } = await client
                .from('habits')
                .update({ is_archived: true })
                .eq('id', habitId);

            if (deleteError) {
                setError(deleteError.message);
                setIsLoading(false);
                return { success: false, error: deleteError.message };
            }

            // Remove from local state
            setHabits(prev => prev.filter(h => h.id !== habitId));
            setIsLoading(false);
            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            setIsLoading(false);
            return { success: false, error: message };
        }
    }, [user, getAuthenticatedClient]);

    return { habits, createHabit, fetchHabits, updateHabit, deleteHabit, isLoading, error };
}
