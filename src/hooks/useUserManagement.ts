
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useUserManagement() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setUsers(data);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
        try {
            const { error } = await supabase
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
        } catch (err: any) {
            console.error('Error updating user role:', err);
            setError(err.message || 'Failed to update user role');
        }
    };

    const toggleUserSuspension = async (userId: string, isSuspended: boolean) => {
        try {
            const { error } = await supabase
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
        } catch (err: any) {
            console.error('Error updating user suspension:', err);
            setError(err.message || 'Failed to update user suspension');
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
