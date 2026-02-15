import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminAnalytics } from './useAdminAnalytics';

// Mock Clerk hooks
const mockGetToken = vi.fn().mockResolvedValue('mock-jwt-token');
vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => ({
        getToken: mockGetToken,
    }),
    useUser: () => ({
        user: { id: 'admin_user_123' },
        isLoaded: true,
        isSignedIn: true,
    }),
}));

// Mock Supabase client
const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

describe('useAdminAnalytics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createMockQuery = (response: any) => {
        const query: any = {
            gte: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: vi.fn().mockImplementation((fn) => Promise.resolve(response).then(fn)),
        };
        // Ensure methods return the query object
        query.gte.mockImplementation(() => query);
        query.order.mockImplementation(() => query);
        query.eq.mockImplementation(() => query);
        return query;
    };

    it('fetches total users, new users, and DAU/MAU', async () => {
        // totalUsers: 100, new7: 10, new30: 30, dau: 40, mau: 80, 
        // habits: 200, completions: 3000, growth: ..., dailyHabits: 100
        const mockCounts = [100, 10, 30, 40, 80, 200, 3000, 100];
        let countIndex = 0;

        mockFrom.mockImplementation(() => ({
            select: vi.fn().mockImplementation((columns) => {
                // If the query includes 'created_at' and uses order, it's the growth data query
                if (columns === 'created_at') {
                    const response = {
                        data: [{ created_at: new Date().toISOString() }],
                        error: null
                    };
                    return createMockQuery(response);
                }

                // Otherwise it's one of the count queries
                const response = { count: mockCounts[countIndex++] ?? 0, error: null };
                const query = createMockQuery(response);
                query.eq = vi.fn().mockReturnThis();
                return query;
            })
        }));

        const { result } = renderHook(() => useAdminAnalytics());

        await act(async () => {
            await result.current.fetchAnalytics();
        });

        // avgHabits = 200 / 100 = 2.0
        // retentionRate = (40 / 80) * 100 = 50.0
        // Expected completions = (100 * 30) + (100 * 4.3) = 3000 + 430 = 3430
        // avgCompletionRate = (3000 / 3430) * 100 = 87.5
        expect(result.current.analytics).toEqual({
            totalUsers: 100,
            newUsers7d: 10,
            newUsers30d: 30,
            dau: 40,
            mau: 80,
            avgHabits: 2.0,
            avgCompletionRate: 87.5,
            retentionRate: 50.0,
            growthData: expect.any(Array),
        });

        // Verify growthData structure
        const growth = result.current.analytics?.growthData;
        expect(growth?.length).toBeGreaterThan(0);
        expect(growth?.[0]).toHaveProperty('date');
        expect(growth?.[0]).toHaveProperty('count');
    });

    it('sets loading state correctly', async () => {
        let resolveQuery: (value: any) => void;
        const queryPromise = new Promise((resolve) => {
            resolveQuery = resolve;
        });

        mockFrom.mockImplementation(() => ({
            select: vi.fn().mockImplementation(() => {
                const query = createMockQuery({ count: 10, error: null });
                query.then = vi.fn().mockImplementation((fn) => queryPromise.then(fn));
                return query;
            })
        }));

        const { result } = renderHook(() => useAdminAnalytics());

        let fetchPromise: Promise<void>;
        act(() => {
            fetchPromise = result.current.fetchAnalytics();
        });

        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            resolveQuery!({ count: 10, error: null });
            await fetchPromise;
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('sets error when fetching fails', async () => {
        mockFrom.mockImplementation(() => ({
            select: vi.fn().mockImplementation(() => {
                return createMockQuery({ count: null, error: { message: 'DB Error' } });
            })
        }));

        const { result } = renderHook(() => useAdminAnalytics());

        await act(async () => {
            await result.current.fetchAnalytics();
        });

        expect(result.current.error).toBe('DB Error');
    });
});
