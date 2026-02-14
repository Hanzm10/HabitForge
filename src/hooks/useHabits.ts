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

interface CreateHabitResult {
    success: boolean;
    error?: string;
}

export function useHabits() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createHabit = useCallback(async (input: CreateHabitInput): Promise<CreateHabitResult> => {
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        setIsLoading(true);
        setError(null);

        try {
            const token = await getToken({ template: 'supabase' });
            if (!token) {
                setIsLoading(false);
                return { success: false, error: 'Failed to get auth token' };
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            const client = createClient(supabaseUrl, supabaseAnonKey, {
                global: { headers: { Authorization: `Bearer ${token}` } },
            });

            // Look up the profile_id from the clerk_user_id
            const { data: profile, error: profileError } = await client
                .from('profiles')
                .select('id')
                .eq('clerk_user_id', user.id)
                .single();

            if (profileError || !profile) {
                const msg = profileError?.message || 'Profile not found';
                setError(msg);
                setIsLoading(false);
                return { success: false, error: msg };
            }

            // Insert the habit
            const { error: insertError } = await client.from('habits').insert({
                name: input.name,
                description: input.description || null,
                color: input.color,
                icon: input.icon || null,
                frequency: input.frequency,
                profile_id: profile.id,
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
    }, [user, getToken]);

    return { createHabit, isLoading, error };
}
