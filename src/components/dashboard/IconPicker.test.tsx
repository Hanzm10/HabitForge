import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IconPicker } from './IconPicker';

describe('IconPicker', () => {
    const mockOnChange = vi.fn();
    const icons = ['🏃', '📚', '💧', '🧘', '💻']; // Partial list for testing presence

    it('renders all emoji options', () => {
        render(<IconPicker value="🏃" onChange={mockOnChange} />);

        icons.forEach(icon => {
            expect(screen.getByText(icon)).toBeInTheDocument();
        });
    });

    it('calls onChange when an emoji is clicked', () => {
        render(<IconPicker value="🏃" onChange={mockOnChange} />);

        const bookIcon = screen.getByText('📚');
        fireEvent.click(bookIcon);

        expect(mockOnChange).toHaveBeenCalledWith('📚');
    });

    it('highlights the selected emoji', () => {
        render(<IconPicker value="📚" onChange={mockOnChange} />);

        const selectedButton = screen.getByText('📚').closest('button');
        const unselectedButton = screen.getByText('🏃').closest('button');

        expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
        expect(unselectedButton).toHaveAttribute('aria-pressed', 'false');
    });
});
