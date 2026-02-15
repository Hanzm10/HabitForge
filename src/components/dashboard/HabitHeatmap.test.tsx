import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HabitHeatmap } from './HabitHeatmap';

describe('HabitHeatmap', () => {
    it('renders the correct year grid', () => {
        const history = new Map<string, number>();
        const year = 2023; // Non-leap year, starts on Sunday
        render(<HabitHeatmap history={history} isLoading={false} year={year} onYearChange={vi.fn()} />);

        // 2023 has 365 days. 
        const cells = document.querySelectorAll('[data-level]');
        expect(cells.length).toBeGreaterThanOrEqual(365);
    });

    it('renders loading state', () => {
        const history = new Map<string, number>();
        render(<HabitHeatmap history={history} isLoading={true} year={2023} onYearChange={vi.fn()} />);
        expect(screen.getByTestId('heatmap-loading')).toBeInTheDocument();
    });

    it('displays tooltips with correct format', () => {
        const history = new Map<string, number>();
        const date = '2023-11-23';
        history.set(date, 5);
        render(<HabitHeatmap history={history} isLoading={false} year={2023} onYearChange={vi.fn()} />);

        const cell = document.querySelector(`[data-date="${date}"]`);
        expect(cell).toHaveAttribute('title', '5 habits done on 2023-11-23');
    });

    it('renders month labels', () => {
        const history = new Map<string, number>();
        render(<HabitHeatmap history={history} isLoading={false} year={2023} onYearChange={vi.fn()} />);
        expect(screen.getByText('Jan')).toBeInTheDocument();
        expect(screen.getByText('Dec')).toBeInTheDocument();
    });

    it('renders day labels', () => {
        const history = new Map<string, number>();
        render(<HabitHeatmap history={history} isLoading={false} year={2023} onYearChange={vi.fn()} />);
        // Mon, Wed, Fri are rendered in the component
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('Wed')).toBeInTheDocument();
        expect(screen.getByText('Fri')).toBeInTheDocument();
    });
});
