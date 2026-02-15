
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useCurrentProfile() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn || !user) {
            setLoading(false);
            setProfile(null);
            return;
        }

        const fetchProfile = async () => {
            // Reset loading state on user change? No, keep previous data until new data arrives to avoid flicker, or strictly loading=true?
            // Given it's a hook, maybe better to set loading=true if user ID changes.
            // But simpler to just let it flow.

            try {
                // Initial fetch
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('clerk_user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 is code for 0 rows from .single()
                    throw error;
                }

                if (data) setProfile(data);
                else {
                    // Profile might not exist yet (race condition with Sync). 
                    // We could poll or wait, but useProfileSync handles creation.
                    // For now, null profile is fine, loading false.
                    setProfile(null);
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        // Subscription for real-time updates (e.g. suspension)
        const channel = supabase
            .channel(`profile-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `clerk_user_id=eq.${user.id}`,
                },
                (payload) => {
                    setProfile(payload.new as Profile);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, isLoaded, isSignedIn]);

    return { profile, loading, error };
}
