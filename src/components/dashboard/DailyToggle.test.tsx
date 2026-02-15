import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DailyToggle } from './DailyToggle';

describe('DailyToggle', () => {
    const defaultProps = {
        habitId: 'habit-1',
        habitColor: '#10B981',
        isCompleted: false,
        onToggle: vi.fn(),
        isLoading: false,
    };

    it('renders an unchecked toggle when not completed', () => {
        render(<DailyToggle {...defaultProps} />);

        const button = screen.getByRole('button', { name: /mark.*complete/i });
        expect(button).toBeInTheDocument();
        // Should NOT have a checkmark
        expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
    });

    it('renders a filled toggle with checkmark when completed', () => {
        render(<DailyToggle {...defaultProps} isCompleted={true} />);

        const button = screen.getByRole('button', { name: /mark.*incomplete/i });
        expect(button).toBeInTheDocument();
        // Should have a checkmark
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('calls onToggle when clicked', async () => {
        const mockToggle = vi.fn();
        const user = userEvent.setup();

        render(<DailyToggle {...defaultProps} onToggle={mockToggle} />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('disables the button when isLoading is true', () => {
        render(<DailyToggle {...defaultProps} isLoading={true} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('has correct aria-label based on completion state', () => {
        const { rerender } = render(<DailyToggle {...defaultProps} />);
        expect(screen.getByRole('button', { name: /mark.*complete/i })).toBeInTheDocument();

        rerender(<DailyToggle {...defaultProps} isCompleted={true} />);
        expect(screen.getByRole('button', { name: /mark.*incomplete/i })).toBeInTheDocument();
    });
});
