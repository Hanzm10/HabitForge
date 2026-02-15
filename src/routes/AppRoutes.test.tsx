import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../App';
import React from 'react';

// Mock Clerk
vi.mock('@clerk/clerk-react', async () => {
    return {
        ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        UserButton: () => <div data-testid="user-button">UserButton</div>,
        useUser: () => ({
            isSignedIn: true,
            user: {
                id: 'test-user-id',
                fullName: 'Test User',
            },
        }),
    };
});

// Mock ProtectedRoute to always render children for this test
vi.mock('../components/auth/ProtectedRoute', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>,
}));

// Mock AdminRoute to always render children for this test
vi.mock('../components/auth/AdminRoute', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="admin-route">{children}</div>,
}));

// Mock DashboardLayout to identify it easily
vi.mock('../layouts/DashboardLayout', () => ({
    DashboardLayout: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="dashboard-layout">
            <div data-testid="sidebar">Sidebar</div>
            <div data-testid="header">Header</div>
            <main>{children}</main>
        </div>
    ),
}));

// Mock useHabits for HabitList component
vi.mock('../hooks/useHabits', () => ({
    useHabits: () => ({
        habits: [],
        fetchHabits: vi.fn().mockResolvedValue(undefined),
        deleteHabit: vi.fn(),
        createHabit: vi.fn(),
        updateHabit: vi.fn(),
        isLoading: false,
        error: null,
    }),
}));

// Mock useCompletions for HabitList component
vi.mock('../hooks/useCompletions', () => ({
    useCompletions: () => ({
        completions: new Map(),
        fetchCompletions: vi.fn().mockResolvedValue(undefined),
        toggleCompletion: vi.fn().mockResolvedValue({ success: true }),
        isLoading: false,
        error: null,
    }),
}));

describe('AppRoutes Integration', () => {
    it('renders landing page on root route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        );
        expect(screen.queryByTestId('dashboard-layout')).not.toBeInTheDocument();
    });

    it('renders DashboardLayout on /dashboard route', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AppRoutes />
            </MemoryRouter>
        );
        expect(screen.getByTestId('protected-route')).toBeInTheDocument();
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
        expect(screen.getByText('Sidebar')).toBeInTheDocument();
        expect(screen.getByText('Header')).toBeInTheDocument();
        // HabitList renders empty state on dashboard index
        expect(screen.getByText(/no habits yet/i)).toBeInTheDocument();
    });

    it('renders DashboardLayout on /admin route', () => {
        render(
            <MemoryRouter initialEntries={['/admin']}>
                <AppRoutes />
            </MemoryRouter>
        );
        expect(screen.getByTestId('admin-route')).toBeInTheDocument();
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
        // Check for Admin content
        expect(screen.getByText('Admin Console')).toBeInTheDocument();
    });
});
