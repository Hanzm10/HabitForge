import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompletionRate } from './CompletionRate';
import * as useCompletionRateHook from '../../hooks/useCompletionRate';

// Mock the hook
vi.mock('../../hooks/useCompletionRate', () => ({
    useCompletionRate: vi.fn(),
}));

describe('CompletionRate Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show placeholder initially', async () => {
        vi.mocked(useCompletionRateHook.useCompletionRate).mockReturnValue({
            getRate: vi.fn().mockResolvedValue(75),
            isLoading: true,
            error: null,
        });

        render(<CompletionRate habitId="habit-1" createdAt={new Date().toISOString()} />);
        // It shows --% during loading when rate is null
        expect(screen.getByText(/--%/)).toBeInTheDocument();
    });

    it('should render the calculated rate', async () => {
        vi.mocked(useCompletionRateHook.useCompletionRate).mockReturnValue({
            getRate: vi.fn().mockResolvedValue(75),
            isLoading: false,
            error: null,
        });

        render(<CompletionRate habitId="habit-1" createdAt={new Date().toISOString()} />);

        await waitFor(() => {
            expect(screen.getByText(/75%/)).toBeInTheDocument();
        });
    });

    it('should apply success color for high rates', async () => {
        vi.mocked(useCompletionRateHook.useCompletionRate).mockReturnValue({
            getRate: vi.fn().mockResolvedValue(90),
            isLoading: false,
            error: null,
        });

        render(<CompletionRate habitId="habit-1" createdAt={new Date().toISOString()} />);

        await waitFor(() => {
            const rateElement = screen.getByText(/90%/);
            expect(rateElement).toHaveClass('text-success');
        });
    });

    it('should apply error color for low rates', async () => {
        vi.mocked(useCompletionRateHook.useCompletionRate).mockReturnValue({
            getRate: vi.fn().mockResolvedValue(20),
            isLoading: false,
            error: null,
        });

        render(<CompletionRate habitId="habit-1" createdAt={new Date().toISOString()} />);

        await waitFor(() => {
            const rateElement = screen.getByText(/20%/);
            expect(rateElement).toHaveClass('text-error');
        });
    });
});
