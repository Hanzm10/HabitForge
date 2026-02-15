import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export function useAdmin() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            if (!isLoaded || !isSignedIn || !user) {
                setLoading(false);
                return;
            }

            try {
                const token = await getToken({ template: 'supabase' });
                if (!token) {
                    setLoading(false);
                    return;
                }

                const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
                const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

                const client = createClient(supabaseUrl, supabaseAnonKey, {
                    global: { headers: { Authorization: `Bearer ${token}` } }
                });

                const { data } = await client
                    .from('profiles')
                    .select('role')
                    .eq('clerk_user_id', user.id)
                    .single();

                if (data && data.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error('Role check failed:', err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkRole();
    }, [user, isLoaded, isSignedIn, getToken]);

    return { isAdmin, loading };
}
