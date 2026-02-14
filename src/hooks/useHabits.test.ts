import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHabits } from './useHabits';

// Mock Clerk hooks
const mockGetToken = vi.fn().mockResolvedValue('mock-jwt-token');
vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => ({
        getToken: mockGetToken,
    }),
    useUser: () => ({
        user: { id: 'clerk_user_123' },
        isLoaded: true,
        isSignedIn: true,
    }),
}));

// Mock Supabase client
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

// Setup the chain: from('habits').select().eq().single() for profile lookup
// and from('habits').insert() for habit creation
const mockEq = vi.fn();

describe('useHabits', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default: profile lookup succeeds
        mockSingle.mockResolvedValue({
            data: { id: 'profile-uuid-123' },
            error: null,
        });
        mockEq.mockReturnValue({ single: mockSingle });
        mockSelect.mockReturnValue({ eq: mockEq });
        mockInsert.mockResolvedValue({ data: { id: 'new-habit-id' }, error: null });

        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') {
                return { select: mockSelect };
            }
            if (table === 'habits') {
                return { insert: mockInsert };
            }
            return {};
        });
    });

    it('createHabit inserts into Supabase with correct payload', async () => {
        const { result } = renderHook(() => useHabits());

        await act(async () => {
            await result.current.createHabit({
                name: 'Morning Run',
                description: 'Run 5km',
                color: '#10B981',
                icon: '🏃',
                frequency: 'daily',
            });
        });

        // Verify from('profiles') was called first to get profile_id
        expect(mockFrom).toHaveBeenCalledWith('profiles');
        expect(mockSelect).toHaveBeenCalledWith('id');
        expect(mockEq).toHaveBeenCalledWith('clerk_user_id', 'clerk_user_123');

        // Verify from('habits') was called with insert payload
        expect(mockFrom).toHaveBeenCalledWith('habits');
        expect(mockInsert).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Morning Run',
                description: 'Run 5km',
                color: '#10B981',
                icon: '🏃',
                frequency: 'daily',
                profile_id: 'profile-uuid-123',
            })
        );
    });

    it('returns error state on Supabase failure', async () => {
        mockInsert.mockResolvedValueOnce({
            data: null,
            error: { message: 'Insert failed' },
        });

        const { result } = renderHook(() => useHabits());

        let response: { success: boolean; error?: string };
        await act(async () => {
            response = await result.current.createHabit({
                name: 'Fail Habit',
                frequency: 'daily',
                color: '#6366F1',
            });
        });

        expect(response!.success).toBe(false);
        expect(response!.error).toBe('Insert failed');
    });

    it('sets isLoading during mutation', async () => {
        // Create a deferred promise to control resolution timing
        let resolveInsert: (value: unknown) => void;
        const insertPromise = new Promise((resolve) => {
            resolveInsert = resolve;
        });
        mockInsert.mockReturnValueOnce(insertPromise);

        const { result } = renderHook(() => useHabits());

        expect(result.current.isLoading).toBe(false);

        let createPromise: Promise<unknown>;
        act(() => {
            createPromise = result.current.createHabit({
                name: 'Test',
                frequency: 'daily',
                color: '#6366F1',
            });
        });

        // Loading should be true while insert is pending
        expect(result.current.isLoading).toBe(true);

        // Resolve the insert
        await act(async () => {
            resolveInsert!({ data: { id: '123' }, error: null });
            await createPromise;
        });

        expect(result.current.isLoading).toBe(false);
    });
});
