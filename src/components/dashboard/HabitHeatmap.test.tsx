import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HabitHeatmap } from './HabitHeatmap';

describe('HabitHeatmap', () => {
    it('renders a grid of cells representing the year', () => {
        const history = new Map<string, number>();
        render(<HabitHeatmap history={history} isLoading={false} />);

        // We expect roughly 365 cells (maybe slightly more/less depending on grid logic, but let's check for "many" cells)
        // Let's assume we render days as small squares
        const cells = document.querySelectorAll('.heatmap-cell');
        // 52 weeks * 7 days = 364
        expect(cells.length).toBeGreaterThanOrEqual(364);
    });

    it('renders loading state', () => {
        const history = new Map<string, number>();
        render(<HabitHeatmap history={history} isLoading={true} />);
        expect(screen.getByTestId('heatmap-loading')).toBeInTheDocument();
    });

    it('applies intensity classes based on completion count', () => {
        const history = new Map<string, number>();
        const today = new Date().toISOString().split('T')[0];
        history.set(today, 5); // High intensity

        render(<HabitHeatmap history={history} isLoading={false} />);

        // We need to find the specific cell for 'today'
        // Ideally, cells should have data-date attribute
        const cell = document.querySelector(`[data-date="${today}"]`);
        expect(cell).toBeInTheDocument();
        // Check for high intensity class (e.g., bg-emerald-600)
        // Exact class depends on implementation, but let's assume valid CSS
        expect(cell).toHaveAttribute('data-intensity', '4');
    });
});
