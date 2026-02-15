
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useUserManagement() {
    const { getToken } = useAuth();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getSupabaseClient = useCallback(async (): Promise<SupabaseClient<Database> | null> => {
        try {
            const token = await getToken({ template: 'supabase' });
            if (!token) return null;

            return createClient<Database>(
                import.meta.env.VITE_SUPABASE_URL,
                import.meta.env.VITE_SUPABASE_ANON_KEY,
                {
                    global: { headers: { Authorization: `Bearer ${token}` } },
                }
            );
        } catch (err) {
            console.error('Error getting Supabase token:', err);
            return null;
        }
    }, [getToken]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const client = await getSupabaseClient();
            if (!client) {
                throw new Error('Failed to initialize authenticated client');
            }

            const { data, error } = await client
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            const message = err instanceof Error ? err.message : 'Failed to fetch users';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [getSupabaseClient]);

    const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
        try {
            const client = await getSupabaseClient();
            if (!client) throw new Error('Failed to authenticate');

            const { error } = await client
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            // Optimistic update
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (err) {
            console.error('Error updating user role:', err);
            const message = err instanceof Error ? err.message : 'Failed to update user role';
            setError(message);
        }
    };

    const toggleUserSuspension = async (userId: string, isSuspended: boolean) => {
        try {
            const client = await getSupabaseClient();
            if (!client) throw new Error('Failed to authenticate');

            const { error } = await client
                .from('profiles')
                .update({ is_suspended: isSuspended })
                .eq('id', userId);

            if (error) throw error;

            // Optimistic update
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, is_suspended: isSuspended } : user
                )
            );
        } catch (err) {
            console.error('Error updating user suspension:', err);
            const message = err instanceof Error ? err.message : 'Failed to update user suspension';
            setError(message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        updateUserRole,
        toggleUserSuspension,
        refetch: fetchUsers,
    };
}
