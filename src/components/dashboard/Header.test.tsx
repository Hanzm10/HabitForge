import { render, screen } from '@testing-library/react';
import { Header } from './Header.tsx';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

// Mock Clerk UserButton
vi.mock('@clerk/clerk-react', () => ({
    UserButton: () => <div data-testid="user-button">User Button</div>,
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Menu: () => <svg data-testid="menu-icon" />,
    ChevronRight: () => <svg data-testid="chevron-right" />,
}));

const renderHeader = (path = '/dashboard') => {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Header onMenuClick={() => { }} />
        </MemoryRouter>
    );
};

describe('Header', () => {
    it('renders user button', () => {
        renderHeader();
        expect(screen.getByTestId('user-button')).toBeInTheDocument();
    });

    it('renders breadcrumbs based on path', () => {
        renderHeader('/dashboard/habits');
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Habits')).toBeInTheDocument();
    });

    it('renders menu button for mobile', () => {
        renderHeader();
        expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });
});
