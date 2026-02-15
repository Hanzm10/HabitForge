import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GrowthGraph } from './GrowthGraph.tsx';
import { useGrowthAnalytics } from '../../hooks/useGrowthAnalytics';

// Mock the hook
vi.mock('../../hooks/useGrowthAnalytics', () => ({
    useGrowthAnalytics: vi.fn(),
}));

// Mock Recharts
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
}));

describe('GrowthGraph', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders placeholder when loading', () => {
        (useGrowthAnalytics as any).mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
            fetchGrowth: vi.fn(),
        });

        render(<GrowthGraph />);
        expect(screen.getByText(/loading/i)).toBeDefined();
    });

    it('renders error state', () => {
        (useGrowthAnalytics as any).mockReturnValue({
            data: [],
            isLoading: false,
            error: 'Failed to fetch growth',
            fetchGrowth: vi.fn(),
        });

        render(<GrowthGraph />);
        expect(screen.getByText(/failed to fetch growth/i)).toBeDefined();
    });

    it('renders graph with data', () => {
        (useGrowthAnalytics as any).mockReturnValue({
            data: [
                { date: '2026-02-01', count: 10 },
                { date: '2026-02-02', count: 12 },
            ],
            isLoading: false,
            error: null,
            fetchGrowth: vi.fn(),
        });

        render(<GrowthGraph />);
        expect(screen.getByText(/User Growth/i)).toBeDefined();
        expect(screen.getByTestId('area-chart')).toBeDefined();
    });
});
