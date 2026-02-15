import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGrowthAnalytics } from './useGrowthAnalytics';

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

describe('useGrowthAnalytics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const createMockQuery = (response: any) => {
        const query: any = {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lt: vi.fn().mockReturnThis(),
            then: vi.fn().mockImplementation((fn) => Promise.resolve(response).then(fn)),
        };
        // Ensure chainables return the query
        query.select.mockReturnValue(query);
        query.order.mockReturnValue(query);
        query.gte.mockReturnValue(query);
        query.lt.mockReturnValue(query);
        return query;
    };

    it('calculates cumulative growth correctly', async () => {
        const mockProfiles = [
            { created_at: '2026-02-01T10:00:00Z' },
            { created_at: '2026-02-01T15:00:00Z' },
            { created_at: '2026-02-03T12:00:00Z' },
        ];

        mockFrom.mockImplementation((table) => {
            if (table === 'profiles') {
                return {
                    select: vi.fn().mockImplementation((columns, options) => {
                        if (options?.count === 'exact') {
                            // This is the base count query (using .lt)
                            return createMockQuery({ count: 5, error: null });
                        }
                        // This is the new profiles query
                        return createMockQuery({ data: mockProfiles, error: null });
                    })
                };
            }
            return { select: vi.fn().mockReturnThis() };
        });

        // Mock current date as Feb 5, 2026
        vi.setSystemTime(new Date('2026-02-05T00:00:00Z'));

        const { result } = renderHook(() => useGrowthAnalytics(5)); // Last 5 days

        await act(async () => {
            await result.current.fetchGrowth();
        });

        // Expected (Feb 1-5) with baseCount = 5:
        // Feb 1: 5 + 2 = 7 users
        // Feb 2: 7 users
        // Feb 3: 7 + 1 = 8 users
        // Feb 4: 8 users
        // Feb 5: 8 users
        expect(result.current.data).toHaveLength(5);
        expect(result.current.data[0]).toEqual({ date: '2026-02-01', count: 7 });
        expect(result.current.data[1]).toEqual({ date: '2026-02-02', count: 7 });
        expect(result.current.data[2]).toEqual({ date: '2026-02-03', count: 8 });
        expect(result.current.data[3]).toEqual({ date: '2026-02-04', count: 8 });
        expect(result.current.data[4]).toEqual({ date: '2026-02-05', count: 8 });
    });

    it('handles empty states', async () => {
        mockFrom.mockImplementation(() => ({
            select: vi.fn().mockImplementation((columns, options) => {
                if (options?.count === 'exact') return createMockQuery({ count: 0, error: null });
                return createMockQuery({ data: [], error: null });
            })
        }));

        const { result } = renderHook(() => useGrowthAnalytics(30));

        await act(async () => {
            await result.current.fetchGrowth();
        });

        expect(result.current.data).toHaveLength(30);
        expect(result.current.data.every(d => d.count === 0)).toBe(true);
    });

    it('sets error when fetching fails', async () => {
        mockFrom.mockImplementation(() => ({
            select: vi.fn().mockImplementation(() => {
                return createMockQuery({ data: null, error: { message: 'Fetch fail' } });
            })
        }));

        const { result } = renderHook(() => useGrowthAnalytics());

        await act(async () => {
            await result.current.fetchGrowth();
        });

        expect(result.current.error).toBe('Fetch fail');
    });
});
