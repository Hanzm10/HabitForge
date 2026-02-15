import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompletions } from './useCompletions';

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
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

describe('useCompletions', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default: profile lookup succeeds
        mockSingle.mockResolvedValue({
            data: { id: 'profile-uuid-123' },
            error: null,
        });
        mockEq.mockReturnValue({ single: mockSingle });
        mockSelect.mockReturnValue({ eq: mockEq });

        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') {
                return { select: mockSelect };
            }
            return {};
        });
    });

    // =========================================================================
    // fetchCompletions
    // =========================================================================

    describe('fetchCompletions', () => {
        it('fetches completions for a given date and returns a map of habitId → completionId', async () => {
            const mockCompletions = [
                { id: 'comp-1', habit_id: 'habit-1' },
                { id: 'comp-2', habit_id: 'habit-2' },
            ];

            // habits chain: from('habits').select('id').eq('profile_id', ...).eq('is_archived', false)
            const mockHabitEqArchived = vi.fn().mockResolvedValue({
                data: [{ id: 'habit-1' }, { id: 'habit-2' }, { id: 'habit-3' }],
                error: null,
            });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            // completions chain: from('habit_completions').select('id, habit_id').eq('completed_date', date).in('habit_id', ids)
            const mockIn = vi.fn().mockResolvedValue({ data: mockCompletions, error: null });
            const mockCompEqDate = vi.fn().mockReturnValue({ in: mockIn });
            const mockCompSelect = vi.fn().mockReturnValue({ eq: mockCompEqDate });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { select: mockHabitSelect };
                }
                if (table === 'habit_completions') {
                    return { select: mockCompSelect };
                }
                return {};
            });

            const { result } = renderHook(() => useCompletions());

            await act(async () => {
                await result.current.fetchCompletions('2026-02-15');
            });

            expect(mockFrom).toHaveBeenCalledWith('habit_completions');
            expect(result.current.completions.get('habit-1')).toBe('comp-1');
            expect(result.current.completions.get('habit-2')).toBe('comp-2');
            expect(result.current.completions.has('habit-3')).toBe(false);
        });

        it('sets error when fetch fails', async () => {
            const mockHabitEqArchived = vi.fn().mockResolvedValue({
                data: [{ id: 'habit-1' }],
                error: null,
            });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            const mockIn = vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch failed' } });
            const mockCompEqDate = vi.fn().mockReturnValue({ in: mockIn });
            const mockCompSelect = vi.fn().mockReturnValue({ eq: mockCompEqDate });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { select: mockHabitSelect };
                }
                if (table === 'habit_completions') {
                    return { select: mockCompSelect };
                }
                return {};
            });

            const { result } = renderHook(() => useCompletions());

            await act(async () => {
                await result.current.fetchCompletions('2026-02-15');
            });

            expect(result.current.error).toBe('Fetch failed');
        });
    });

    // =========================================================================
    // toggleCompletion — INSERT (complete)
    // =========================================================================

    describe('toggleCompletion', () => {
        it('inserts a new completion when none exists for that habit', async () => {
            // Insert chain: from('habit_completions').insert({...}).select('id').single()
            const mockInsertSingle = vi.fn().mockResolvedValue({
                data: { id: 'new-comp-id' },
                error: null,
            });
            const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
            const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habit_completions') {
                    return { insert: mockInsert };
                }
                return {};
            });

            const { result } = renderHook(() => useCompletions());

            let response: { success: boolean; error?: string };
            await act(async () => {
                response = await result.current.toggleCompletion('habit-1', '2026-02-15');
            });

            expect(response!.success).toBe(true);
            expect(mockInsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    habit_id: 'habit-1',
                    completed_date: '2026-02-15',
                })
            );
            // After insert, completions map should contain the new entry
            expect(result.current.completions.get('habit-1')).toBe('new-comp-id');
        });

        it('deletes an existing completion when habit is already completed (uncomplete)', async () => {
            // Step 1: Populate completions via fetchCompletions
            const mockCompletions = [
                { id: 'existing-comp-id', habit_id: 'habit-1' },
            ];

            const mockHabitEqArchived = vi.fn().mockResolvedValue({
                data: [{ id: 'habit-1' }],
                error: null,
            });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            const mockIn = vi.fn().mockResolvedValue({ data: mockCompletions, error: null });
            const mockCompEqDate = vi.fn().mockReturnValue({ in: mockIn });
            const mockCompSelect = vi.fn().mockReturnValue({ eq: mockCompEqDate });

            // Delete chain: from('habit_completions').delete().eq('id', compId)
            const mockDeleteEq = vi.fn().mockResolvedValue({ data: null, error: null });
            const mockDeleteFn = vi.fn().mockReturnValue({ eq: mockDeleteEq });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habits') {
                    return { select: mockHabitSelect };
                }
                if (table === 'habit_completions') {
                    return { select: mockCompSelect, delete: mockDeleteFn };
                }
                return {};
            });

            const { result } = renderHook(() => useCompletions());

            // Fetch completions to populate state
            await act(async () => {
                await result.current.fetchCompletions('2026-02-15');
            });

            expect(result.current.completions.get('habit-1')).toBe('existing-comp-id');

            // Step 2: Toggle — should DELETE
            let response: { success: boolean; error?: string };
            await act(async () => {
                response = await result.current.toggleCompletion('habit-1', '2026-02-15');
            });

            expect(response!.success).toBe(true);
            expect(mockDeleteFn).toHaveBeenCalled();
            expect(mockDeleteEq).toHaveBeenCalledWith('id', 'existing-comp-id');
            // After delete, completion should be removed from map
            expect(result.current.completions.has('habit-1')).toBe(false);
        });

        it('returns error on insert failure', async () => {
            const mockInsertSingle = vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Insert failed' },
            });
            const mockInsertSelect = vi.fn().mockReturnValue({ single: mockInsertSingle });
            const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') {
                    return { select: mockSelect };
                }
                if (table === 'habit_completions') {
                    return { insert: mockInsert };
                }
                return {};
            });

            const { result } = renderHook(() => useCompletions());

            let response: { success: boolean; error?: string };
            await act(async () => {
                response = await result.current.toggleCompletion('habit-1', '2026-02-15');
            });

            expect(response!.success).toBe(false);
            expect(response!.error).toBe('Insert failed');
        });
    });

    // =========================================================================
    // fetchHistory
    // =========================================================================

    describe('fetchHistory', () => {
        it('fetches completion history for a date range and populates history map', async () => {
            const startDate = '2026-01-01';
            const endDate = '2026-01-31';

            // habits chain
            const mockHabitEqArchived = vi.fn().mockResolvedValue({
                data: [{ id: 'habit-1' }, { id: 'habit-2' }],
                error: null,
            });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            // completions chain
            const mockCompletionsData = [
                { completed_date: '2026-01-01' },
                { completed_date: '2026-01-01' }, // 2 on this day
                { completed_date: '2026-01-02' }, // 1 on this day
            ];

            const mockLte = vi.fn().mockResolvedValue({ data: mockCompletionsData, error: null });
            const mockGte = vi.fn().mockReturnValue({ lte: mockLte });
            const mockIn = vi.fn().mockReturnValue({ gte: mockGte });
            // .select('completed_date')
            const mockCompSelect = vi.fn().mockReturnValue({ in: mockIn });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') return { select: mockSelect };
                if (table === 'habits') return { select: mockHabitSelect };
                if (table === 'habit_completions') return { select: mockCompSelect };
                return {};
            });

            const { result } = renderHook(() => useCompletions());

            await act(async () => {
                await result.current.fetchHistory(startDate, endDate);
            });

            expect(result.current.history.get('2026-01-01')).toBe(2);
            expect(result.current.history.get('2026-01-02')).toBe(1);
            expect(result.current.history.has('2026-01-03')).toBe(false);
        });

        it('handles errors gracefully during fetchHistory', async () => {
            const startDate = '2026-01-01';
            const endDate = '2026-01-31';

            // habits chain success
            const mockHabitEqArchived = vi.fn().mockResolvedValue({
                data: [{ id: 'habit-1' }],
                error: null,
            });
            const mockHabitEqProfile = vi.fn().mockReturnValue({ eq: mockHabitEqArchived });
            const mockHabitSelect = vi.fn().mockReturnValue({ eq: mockHabitEqProfile });

            // completions chain fails
            const mockLte = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } });
            const mockGte = vi.fn().mockReturnValue({ lte: mockLte });
            const mockIn = vi.fn().mockReturnValue({ gte: mockGte });
            const mockCompSelect = vi.fn().mockReturnValue({ in: mockIn });

            mockFrom.mockImplementation((table: string) => {
                if (table === 'profiles') return { select: mockSelect };
                if (table === 'habits') return { select: mockHabitSelect };
                if (table === 'habit_completions') return { select: mockCompSelect };
                return {};
            });

            const { result } = renderHook(() => useCompletions());

            await act(async () => {
                await result.current.fetchHistory(startDate, endDate);
            });

            expect(result.current.error).toBe('DB Error');
            expect(result.current.history.size).toBe(0);
        });
    });

    // =========================================================================
    // initial state
    // =========================================================================

    it('initializes with empty completions map', () => {
        const { result } = renderHook(() => useCompletions());
        expect(result.current.completions).toBeInstanceOf(Map);
        expect(result.current.completions.size).toBe(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });
});
