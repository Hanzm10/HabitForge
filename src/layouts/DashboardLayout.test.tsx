import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

// Mock Sidebar - simplified to rely onisOpen prop only
vi.mock('../components/dashboard/Sidebar', () => ({
    Sidebar: ({ isOpen }: { isOpen: boolean }) => (
        <div data-testid="mock-sidebar">
            Sidebar is {isOpen ? 'Open' : 'Closed'}
        </div>
    )
}));

// Mock Clerk
vi.mock('@clerk/clerk-react', async () => {
    return {
        ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        UserButton: () => <div data-testid="user-button">UserButton</div>,
    };
});

// Mock Lucide
vi.mock('lucide-react', async () => {
    return {
        Menu: () => <svg data-testid="icon-menu" />,
    };
});

describe('DashboardLayout', () => {
    it('renders the mocked sidebar and children', () => {
        render(
            // @ts-expect-error - ClerkProvider mock doesn't match full props
            <ClerkProvider>
                <BrowserRouter>
                    <DashboardLayout>
                        <div data-testid="child-content">Child Content</div>
                    </DashboardLayout>
                </BrowserRouter>
            </ClerkProvider>
        );

        expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('toggles mobile menu state passed to sidebar', async () => {
        // Simulate Mobile Viewport
        window.innerWidth = 500;
        window.dispatchEvent(new Event('resize'));

        render(
            // @ts-expect-error - ClerkProvider mock doesn't match full props
            <ClerkProvider>
                <BrowserRouter>
                    <DashboardLayout>
                        <div>Content</div>
                    </DashboardLayout>
                </BrowserRouter>
            </ClerkProvider>
        );

        // Initial state: Sidebar should be closed
        expect(screen.getByText('Sidebar is Closed')).toBeInTheDocument();

        // Use data-testid for reliability
        const menuButton = screen.getByTestId('open-sidebar-btn');
        fireEvent.click(menuButton);

        // Sidebar should be open
        expect(await screen.findByText('Sidebar is Open')).toBeInTheDocument();
    });
});
