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
const mockUpdate = vi.fn();
const mockEq = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

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
                return { insert: mockInsert, select: mockSelect, update: mockUpdate };
            }
            return {};
        });
    });

    // =========================================================================
    // createHabit tests (existing)
    // =========================================================================

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

    // =========================================================================
    // fetchHabits tests (NEW)
    // =========================================================================

    describe('fetchHabits', () => {
        const mockHabits = [
            {
                id: 'habit-1',
                name: 'Morning Run',
                description: 'Run 5km',
                color: '#10B981',
                icon: '🏃',
                frequency: 'daily',
                is_archived: false,
                profile_id: 'profile-uuid-123',
                created_at: '2026-01-01T00:00:00Z',
                updated_at: '2026-01-01T00:00:00Z',
            },
            {
                id: 'habit-2',
                name: 'Read Books',
                description: null,
                color: '#6366F1',
                icon: '📚',
                frequency: 'daily',
                is_archived: false,
                profile_id: 'profile-uuid-123',
                created_at: '2026-01-02T00:00:00Z',
                updated_at: '2026-01-02T00:00:00Z',
            },
        ];

        it('fetches all non-archived habits for current user', async () => {
            // Chain: from('profiles').select('id').eq(...).single() → profile
            // Chain: from('habits').select('*').eq('profile_id', ...).eq('is_archived', false).order(...)
            const mockHabitOrder = vi.fn().mockResolvedValue({ data: mockHabits, error: null });
            const mockHabitEqArchived = vi.fn().mockReturnValue({ order: mockHabitOrder });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { select: mockHabitSelect };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            await act(async () => {
                await result.current.fetchHabits();
            });

            expect(mockFrom).toHaveBeenCalledWith('habits');
            expect(mockHabitSelect).toHaveBeenCalledWith('*');
            expect(mockHabitEqProfile).toHaveBeenCalledWith('profile_id', 'profile-uuid-123');
            expect(mockHabitEqArchived).toHaveBeenCalledWith('is_archived', false);
            expect(mockHabitOrder).toHaveBeenCalledWith('created_at', { ascending: false });
            expect(result.current.habits).toEqual(mockHabits);
        });

        it('returns empty array when no habits exist', async () => {
            const mockHabitOrder = vi.fn().mockResolvedValue({ data: [], error: null });
            const mockHabitEqArchived = vi.fn().mockReturnValue({ order: mockHabitOrder });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { select: mockHabitSelect };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            await act(async () => {
                await result.current.fetchHabits();
            });

            expect(result.current.habits).toEqual([]);
        });

        it('sets error when fetch fails', async () => {
            const mockHabitOrder = vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch failed' } });
            const mockHabitEqArchived = vi.fn().mockReturnValue({ order: mockHabitOrder });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { select: mockHabitSelect };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            await act(async () => {
                await result.current.fetchHabits();
            });

            expect(result.current.error).toBe('Fetch failed');
            expect(result.current.habits).toEqual([]);
        });
    });

    // =========================================================================
    // updateHabit tests (NEW)
    // =========================================================================

    describe('updateHabit', () => {
        it('updates a habit with correct payload', async () => {
            const mockUpdateEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockUpdateFn = vi.fn().mockReturnValue({ eq: mockUpdateEq });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { update: mockUpdateFn };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            let response: { success: boolean; error?: string };
            await act(async () => {
                response = await result.current.updateHabit('habit-123', {
                    name: 'Evening Run',
                    color: '#EF4444',
                });
            });

            expect(response!.success).toBe(true);
            expect(mockFrom).toHaveBeenCalledWith('habits');
            expect(mockUpdateFn).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Evening Run',
                    color: '#EF4444',
                })
            );
            expect(mockUpdateEq).toHaveBeenCalledWith('id', 'habit-123');
        });

        it('returns error when update fails', async () => {
            const mockUpdateEq = vi.fn().mockResolvedValue({ data: null, error: { message: 'Update failed' } });
            const mockUpdateFn = vi.fn().mockReturnValue({ eq: mockUpdateEq });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { update: mockUpdateFn };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            let response: { success: boolean; error?: string };
            await act(async () => {
                response = await result.current.updateHabit('habit-123', {
                    name: 'Fail Update',
                });
            });

            expect(response!.success).toBe(false);
            expect(response!.error).toBe('Update failed');
        });
    });

    // =========================================================================
    // deleteHabit tests (NEW — soft-delete via is_archived)
    // =========================================================================

    describe('deleteHabit', () => {
        it('soft-deletes a habit by setting is_archived to true', async () => {
            const mockUpdateEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockUpdateFn = vi.fn().mockReturnValue({ eq: mockUpdateEq });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { update: mockUpdateFn };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            let response: { success: boolean; error?: string };
            await act(async () => {
                response = await result.current.deleteHabit('habit-456');
            });

            expect(response!.success).toBe(true);
            expect(mockUpdateFn).toHaveBeenCalledWith({ is_archived: true });
            expect(mockUpdateEq).toHaveBeenCalledWith('id', 'habit-456');
        });

        it('returns error when delete fails', async () => {
            const mockUpdateEq = vi.fn().mockResolvedValue({ data: null, error: { message: 'Delete failed' } });
            const mockUpdateFn = vi.fn().mockReturnValue({ eq: mockUpdateEq });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { update: mockUpdateFn };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            let response: { success: boolean; error?: string };
            await act(async () => {
                response = await result.current.deleteHabit('habit-456');
            });

            expect(response!.success).toBe(false);
            expect(response!.error).toBe('Delete failed');
        });

        it('removes deleted habit from local habits state', async () => {
            // First set up habits in state via fetchHabits
            const mockHabits = [
                { id: 'habit-1', name: 'Run', is_archived: false, profile_id: 'profile-uuid-123' },
                { id: 'habit-2', name: 'Read', is_archived: false, profile_id: 'profile-uuid-123' },
            ];

            const mockHabitOrder = vi.fn().mockResolvedValue({ data: mockHabits, error: null });
            const mockHabitEqArchived = vi.fn().mockReturnValue({ order: mockHabitOrder });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            const mockUpdateEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockUpdateFn = vi.fn().mockReturnValue({ eq: mockUpdateEq });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { select: mockHabitSelect, update: mockUpdateFn };
                }
                return {};
            });

            const { result } = renderHook(() => useHabits());

            // Fetch habits first
            await act(async () => {
                await result.current.fetchHabits();
            });

            expect(result.current.habits).toHaveLength(2);

            // Delete habit-1
            await act(async () => {
                await result.current.deleteHabit('habit-1');
            });

            expect(result.current.habits).toHaveLength(1);
            expect(result.current.habits[0].id).toBe('habit-2');
        });
    });
});
