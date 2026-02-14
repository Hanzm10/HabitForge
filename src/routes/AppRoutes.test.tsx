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

describe('AppRoutes Integration', () => {
    it('renders landing page on root route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        );
        // Landing page content (mock or real) - checking for something known on Landing Page
        // Assuming Landing Page has a "HabitForge" text or similar. 
        // Since we are not mocking LandingPage, it will render. 
        // Let's check for a known element from LandingPage or just that DashboardLayout is NOT present.
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
        // Check for Dashboard content
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Welcome to your habit tracking dashboard.')).toBeInTheDocument();
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
