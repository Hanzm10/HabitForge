import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWeeklyProgress } from './useWeeklyProgress';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
    useAuth: vi.fn(),
    useUser: vi.fn(),
}));

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(),
}));

describe('useWeeklyProgress', () => {
    const mockGetToken = vi.fn();
    const mockUser = { id: 'user_123' };

    // Mock Supabase client methods
    const mockSelect = vi.fn();
    const mockEq = vi.fn();
    const mockIn = vi.fn();
    const mockGte = vi.fn();
    const mockLte = vi.fn();
    const mockSingle = vi.fn();

    const mockSupabase: any = {
        from: vi.fn(() => ({
            select: mockSelect,
        })),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ getToken: mockGetToken });
        (useUser as any).mockReturnValue({ user: mockUser });
        (createClient as any).mockReturnValue(mockSupabase);

        mockGetToken.mockResolvedValue('fake-token');

        // Reset query chains
        mockSelect.mockReturnValue({ eq: mockEq });
        mockEq.mockReturnValue({ single: mockSingle, eq: mockEq });
        mockSingle.mockResolvedValue({ data: { id: 'profile_123' }, error: null });
    });

    it('calculates weekly progress correctly for daily and weekly habits', async () => {
        // Mock habits: 1 daily (target 7), 1 weekly (target 1) -> Total Target = 8
        const mockHabits = [
            { id: 'h1', frequency: 'daily' },
            { id: 'h2', frequency: 'weekly' },
        ];

        // Mock completions for the current week: 3 for h1, 1 for h2 -> Total Actual = 4
        const mockCompletions = [
            { habit_id: 'h1', completed_date: '2026-02-09' },
            { habit_id: 'h1', completed_date: '2026-02-10' },
            { habit_id: 'h1', completed_date: '2026-02-11' },
            { habit_id: 'h2', completed_date: '2026-02-12' },
        ];

        // Setup mock responses
        mockSelect.mockImplementation((query) => {
            if (query === '*') {
                return {
                    eq: vi.fn().mockReturnThis(),
                    order: vi.fn().mockResolvedValue({ data: mockHabits, error: null }),
                };
            }
            if (query === 'habit_id, completed_date') {
                return {
                    in: vi.fn().mockReturnThis(),
                    gte: vi.fn().mockReturnThis(),
                    lte: vi.fn().mockResolvedValue({ data: mockCompletions, error: null }),
                };
            }
            return { eq: mockEq };
        });

        // Current system time for the test: 2026-02-15 (Sunday)
        vi.setSystemTime(new Date('2026-02-15T12:00:00Z'));

        const { result } = renderHook(() => useWeeklyProgress());

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.progress.target).toBe(8);
        expect(result.current.progress.actual).toBe(4);
        expect(result.current.progress.percentage).toBe(50);

        vi.useRealTimers();
    });

    it('returns 0 percentage when there are no habits', async () => {
        mockSelect.mockImplementation((query) => {
            if (query === '*') {
                return {
                    eq: vi.fn().mockReturnThis(),
                    order: vi.fn().mockResolvedValue({ data: [], error: null }),
                };
            }
            return { eq: mockEq };
        });

        const { result } = renderHook(() => useWeeklyProgress());

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.progress.target).toBe(0);
        expect(result.current.progress.actual).toBe(0);
        expect(result.current.progress.percentage).toBe(0);
    });
});
