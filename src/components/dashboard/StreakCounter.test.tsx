import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StreakCounter } from './StreakCounter';

describe('StreakCounter', () => {
    it('should render current and longest streaks', () => {
        render(<StreakCounter current={5} longest={10} />);

        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should render distinct visual elements for current and longest', () => {
        const { container } = render(<StreakCounter current={5} longest={10} />);

        // Check for icons (Lucide renders SVG)
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle zero streaks gracefully', () => {
        render(<StreakCounter current={0} longest={0} />);
        // Should still render 0 or maybe a "Start your streak!" message?
        // For now, let's assume it renders numbers.
        const zeros = screen.getAllByText('0');
        expect(zeros.length).toBeGreaterThan(0);
    });
});
