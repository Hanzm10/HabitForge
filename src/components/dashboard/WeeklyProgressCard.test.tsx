import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeeklyProgressCard } from './WeeklyProgressCard.tsx';
import { useWeeklyProgress } from '../../hooks/useWeeklyProgress';

// Mock the hook
vi.mock('../../hooks/useWeeklyProgress', () => ({
    useWeeklyProgress: vi.fn(),
}));

describe('WeeklyProgressCard', () => {
    it('renders loading state', () => {
        (useWeeklyProgress as any).mockReturnValue({
            progress: { actual: 0, target: 0, percentage: 0 },
            isLoading: true,
            error: null,
        });

        render(<WeeklyProgressCard />);
        expect(screen.getByRole('status')).toBeDefined();
    });

    it('renders progress data correctly', () => {
        (useWeeklyProgress as any).mockReturnValue({
            progress: { actual: 12, target: 20, percentage: 60 },
            isLoading: false,
            error: null,
        });

        render(<WeeklyProgressCard />);

        expect(screen.getByText(/Weekly Progress/i)).toBeInTheDocument();
        expect(screen.getByText(/60%/)).toBeInTheDocument();
        // Use a function matcher for text split across elements
        expect(screen.getByText((_, element) => element?.textContent === '12 of 20 completions this week')).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useWeeklyProgress as any).mockReturnValue({
            progress: { actual: 0, target: 0, percentage: 0 },
            isLoading: false,
            error: 'Failed to fetch',
        });

        render(<WeeklyProgressCard />);
        expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    });

    it('displays dynamic message based on percentage', () => {
        (useWeeklyProgress as any).mockReturnValue({
            progress: { actual: 20, target: 20, percentage: 100 },
            isLoading: false,
            error: null,
        });

        render(<WeeklyProgressCard />);
        expect(screen.getByText(/Perfect week! Incredible work/i)).toBeInTheDocument();
    });
});
