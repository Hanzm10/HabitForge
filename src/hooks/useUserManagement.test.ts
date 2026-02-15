
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserManagement } from './useUserManagement';

// Hoist mocks to be available in vi.mock
const mocks = vi.hoisted(() => {
    const mockSelect = vi.fn();
    const mockUpdate = vi.fn();
    const mockEq = vi.fn();
    const mockOrder = vi.fn();

    // Chainable mocks
    mockSelect.mockReturnValue({ order: mockOrder });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnThis();

    const mockFrom = vi.fn(() => ({
        select: mockSelect,
        update: mockUpdate,
        eq: mockEq,
        order: mockOrder,
    }));

    const mockClient = {
        from: mockFrom,
    };

    return {
        mockSelect,
        mockUpdate,
        mockEq,
        mockOrder,
        mockFrom,
        mockClient,
    };
});

// Mock Clerk
const mockGetToken = vi.fn();
vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => ({
        getToken: mockGetToken,
        isLoaded: true,
        isSignedIn: true,
    }),
}));

// Mock @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mocks.mockClient),
}));

describe('useUserManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default token response
        mockGetToken.mockResolvedValue('mock-token');

        // Reset mock return values if changed in tests
        mocks.mockSelect.mockReturnValue({ order: mocks.mockOrder });
        mocks.mockUpdate.mockReturnValue({ eq: mocks.mockEq });
        mocks.mockEq.mockResolvedValue({ data: [], error: null });
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

    it('should fetch users initially using authenticated client', async () => {
        // Setup success response for fetch
        mocks.mockOrder.mockResolvedValue({ data: mockUsers, error: null });

        const { result } = renderHook(() => useUserManagement());

        // Should start loading
        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Verify users set
        expect(result.current.users).toEqual(mockUsers);

        // Verify authentication flow
        expect(mockGetToken).toHaveBeenCalledWith({ template: 'supabase' });
        expect(mocks.mockFrom).toHaveBeenCalledWith('profiles');
        expect(mocks.mockSelect).toHaveBeenCalledWith('*');
    });

    it('should handle fetch errors', async () => {
        mocks.mockOrder.mockResolvedValue({ data: null, error: { message: 'Fetch error' } });

        const { result } = renderHook(() => useUserManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Fetch error');
        expect(result.current.users).toEqual([]);
    });

    it('should update user role', async () => {
        // Initial fetch success
        mocks.mockOrder.mockResolvedValue({ data: mockUsers, error: null });

        // Update success (chain: update -> eq -> resolved)
        mocks.mockEq.mockResolvedValue({ error: null });

        const { result } = renderHook(() => useUserManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.updateUserRole('user-1', 'admin');
        });

        expect(mocks.mockUpdate).toHaveBeenCalledWith({ role: 'admin' });
        expect(mocks.mockEq).toHaveBeenCalledWith('id', 'user-1');

        // Optimistic update verify
        expect(result.current.users[0].role).toBe('admin');
    });

    it('should toggle user suspension', async () => {
        // Initial fetch
        mocks.mockOrder.mockResolvedValue({ data: mockUsers, error: null });

        // Update success
        mocks.mockEq.mockResolvedValue({ error: null });

        const { result } = renderHook(() => useUserManagement());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.toggleUserSuspension('user-1', true);
        });

        expect(mocks.mockUpdate).toHaveBeenCalledWith({ is_suspended: true });
        expect(mocks.mockEq).toHaveBeenCalledWith('id', 'user-1');

        // Optimistic update verify
        expect(result.current.users[0].is_suspended).toBe(true);
    });
});
