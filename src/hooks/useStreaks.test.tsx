import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStreaks } from './useStreaks';

// Mock dependencies
const mockGetToken = vi.fn();
const mockUser = { id: 'test-user-id' };

vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => ({ getToken: mockGetToken }),
    useUser: () => ({ user: mockUser }),
}));

// Create a mock function for 'from' that we can control
const mockFrom = vi.fn();

const mockClient = {
    from: mockFrom,
};

vi.mock('@supabase/supabase-js', () => ({
    createClient: () => mockClient,
}));

// Helper to create a chainable mock object
const createChainableMock = () => {
    const mock = {
        select: vi.fn(),
        eq: vi.fn(),
        in: vi.fn(),
        single: vi.fn(),
        order: vi.fn(),
    };

    mock.select.mockReturnValue(mock);
    mock.eq.mockReturnValue(mock);
    mock.in.mockReturnValue(mock);
    mock.single.mockReturnValue(Promise.resolve({ data: null, error: null }));
    mock.order.mockReturnValue(Promise.resolve({ data: [], error: null }));

    return mock;
};

describe('useStreaks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetToken.mockResolvedValue('test-token');
        mockFrom.mockReturnValue(createChainableMock());
    });

    it('should initialize with empty streaks', () => {
        const { result } = renderHook(() => useStreaks());
        expect(result.current.streaks.size).toBe(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should calculate streaks correctly for a simple daily habit', async () => {
        // Setup mocks for specific queries

        // 1. Profile Query
        // 1. Profile Query

        // 2. Habits Query
        // 2. Habits Query
        // Wait, if I await the chain, the LAST method called needs to return a Promise.
        // But .eq() is chainable. Supabase uses a `then` method on the builder.
        // For simpler mocking, let's make every method return the mock object, 
        // AND make the mock object 'thenable' to return the data.

        const makeThenable = (data: any, error: any = null) => {
            const mock: any = {
                select: vi.fn(() => mock),
                eq: vi.fn(() => mock),
                in: vi.fn(() => mock),
                single: vi.fn(() => Promise.resolve({ data, error })),
                order: vi.fn(() => Promise.resolve({ data, error })),
                then: (resolve: any) => resolve({ data, error }) // Make it awaitable
            };
            return mock;
        };

        const profileMock = makeThenable({ id: 'profile-123' });
        const habitsMock = makeThenable([{ id: 'habit-1', frequency: 'daily' }]);

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];

        const mockCompletions = [
            { habit_id: 'habit-1', completed_date: today },
            { habit_id: 'habit-1', completed_date: yesterday },
            { habit_id: 'habit-1', completed_date: twoDaysAgo },
            { habit_id: 'habit-1', completed_date: '2020-01-01' },
        ];

        const completionsMock = makeThenable(mockCompletions);

        mockFrom.mockImplementation((table: string) => {
            if (table === 'profiles') return profileMock;
            if (table === 'habits') return habitsMock;
            if (table === 'habit_completions') return completionsMock;
            return makeThenable(null);
        });

        const { result } = renderHook(() => useStreaks());

        await act(async () => {
            await result.current.fetchStreaks();
        });

        if (result.current.error) {
            console.error('Test error:', result.current.error);
        }

        expect(result.current.error).toBeNull();
        expect(result.current.streaks.has('habit-1')).toBe(true);
        const streak = result.current.streaks.get('habit-1');

        expect(streak?.current).toBe(3);
        expect(streak?.longest).toBe(3);
    });
});
