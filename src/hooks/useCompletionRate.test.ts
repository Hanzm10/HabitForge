import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCompletionRate } from './useCompletionRate';

// Mock dependencies
const mockGetToken = vi.fn();
const mockUser = { id: 'test-user-id' };

vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => ({ getToken: mockGetToken }),
    useUser: () => ({ user: mockUser }),
}));

const mockFrom = vi.fn();
const mockClient = {
    from: mockFrom,
};

vi.mock('@supabase/supabase-js', () => ({
    createClient: () => mockClient,
}));

const makeThenable = (data: any, error: any = null) => {
    const mock: any = {
        select: vi.fn(() => mock),
        eq: vi.fn(() => mock),
        in: vi.fn(() => mock),
        gte: vi.fn(() => mock),
        lte: vi.fn(() => mock),
        single: vi.fn(() => Promise.resolve({ data, error })),
        order: vi.fn(() => Promise.resolve({ data, error })),
        then: (resolve: any) => resolve({ data, error })
    };
    return mock;
};

describe('useCompletionRate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetToken.mockResolvedValue('test-token');
    });

    it('should calculate 100% completion if all days are completed in 7d window', async () => {
        const profileMock = makeThenable({ id: 'profile-123' });

        // Mock completions for the last 7 days
        const completions = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return { completed_date: date.toISOString().split('T')[0] };
        });

        const completionsMock = makeThenable(completions);

        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') return profileMock;
            if (table === 'habit_completions') return completionsMock;
            return makeThenable(null);
        });

        const { result } = renderHook(() => useCompletionRate());

        await act(async () => {
            const rate = await result.current.getRate('habit-1', '7d');
            expect(rate).toBe(100);
        });
    });

    it('should calculate 0% if no completions in 7d window', async () => {
        const profileMock = makeThenable({ id: 'profile-123' });
        const completionsMock = makeThenable([]);

        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') return profileMock;
            if (table === 'habit_completions') return completionsMock;
            return makeThenable(null);
        });

        const { result } = renderHook(() => useCompletionRate());

        await act(async () => {
            const rate = await result.current.getRate('habit-1', '7d');
            expect(rate).toBe(0);
        });
    });

    it('should handle "all" time calculation based on createdAt', async () => {
        const profileMock = makeThenable({ id: 'profile-123' });

        // Created 10 days ago, 5 completions
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - 10);

        const completions = Array.from({ length: 5 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return { completed_date: date.toISOString().split('T')[0] };
        });

        const completionsMock = makeThenable(completions);

        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') return profileMock;
            if (table === 'habit_completions') return completionsMock;
            return makeThenable(null);
        });

        const { result } = renderHook(() => useCompletionRate());

        await act(async () => {
            // 5 completions / 11 days (counting today and 10 days ago) = ~45%
            const rate = await result.current.getRate('habit-1', 'all', createdAt.toISOString());
            expect(rate).toBeCloseTo(45, 0);
        });
    });
});
