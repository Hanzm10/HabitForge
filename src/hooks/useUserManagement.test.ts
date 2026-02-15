
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserManagement } from './useUserManagement';
import { supabase } from '../lib/supabase';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(),
            update: vi.fn(),
            eq: vi.fn(),
            order: vi.fn(),
        })),
    },
}));

describe('useUserManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockUsers = [
        {
            id: 'user-1',
            email: 'user1@example.com',
            full_name: 'User One',
            role: 'user',
            is_suspended: false,
        },
        {
            id: 'user-2',
            email: 'user2@example.com',
            full_name: 'User Two',
            role: 'admin',
            is_suspended: true,
        },
    ];

    it('should fetch users initially', async () => {
        const selectMock = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
        });


        (supabase.from as any).mockImplementation(() => ({
            select: selectMock,
        }));

        const { result } = renderHook(() => useUserManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.users).toEqual(mockUsers);
        expect(selectMock).toHaveBeenCalledWith('*');
    });

    it('should handle fetch errors', async () => {
        const selectMock = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch error' } }),
        });


        (supabase.from as any).mockImplementation(() => ({
            select: selectMock,
        }));

        const { result } = renderHook(() => useUserManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Fetch error');
        expect(result.current.users).toEqual([]);
    });

    it('should update user role', async () => {
        // Setup initial fetch
        const selectMock = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
        });

        // Setup update call
        // The chain: .update({ role }).eq('id', userId) -> returns Promise
        const eqMock = vi.fn().mockResolvedValue({ data: [{ ...mockUsers[0], role: 'admin' }], error: null });
        const updateMock = vi.fn().mockReturnValue({ eq: eqMock });


        (supabase.from as any).mockImplementation((table: string) => {
            if (table === 'profiles') {
                return {
                    select: selectMock,
                    update: updateMock,
                }
            }
            return {};
        });


        const { result } = renderHook(() => useUserManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.updateUserRole('user-1', 'admin');
        });

        expect(updateMock).toHaveBeenCalledWith({ role: 'admin' });
        expect(eqMock).toHaveBeenCalledWith('id', 'user-1');

        // Check optimistic update or refetch logic - here assuming we update local state
        expect(result.current.users[0].role).toBe('admin');
    });

    it('should toggle user suspension', async () => {
        // Setup initial fetch
        const selectMock = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
        });

        // Setup update call
        // The chain: .update({ is_suspended }).eq('id', userId) -> returns Promise
        const eqMock = vi.fn().mockResolvedValue({ data: [{ ...mockUsers[0], is_suspended: true }], error: null });
        const updateMock = vi.fn().mockReturnValue({ eq: eqMock });


        (supabase.from as any).mockImplementation((table: string) => {
            if (table === 'profiles') {
                return {
                    select: selectMock,
                    update: updateMock,
                }
            }
            return {};
        });

        const { result } = renderHook(() => useUserManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.toggleUserSuspension('user-1', true);
        });

        expect(updateMock).toHaveBeenCalledWith({ is_suspended: true });
        expect(eqMock).toHaveBeenCalledWith('id', 'user-1');

        // Check local state update
        expect(result.current.users[0].is_suspended).toBe(true);
    });
});
