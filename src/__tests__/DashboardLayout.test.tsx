import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardLayout from '../layouts/DashboardLayout'
import { useProfileSync } from '../hooks/useProfileSync'

// Mock useProfileSync
vi.mock('../hooks/useProfileSync', () => ({
    useProfileSync: vi.fn(),
}))

// Mock Clerk UserButton and useUser
vi.mock('@clerk/clerk-react', () => ({
    UserButton: () => <div data-testid="user-button">User Button</div>,
    useUser: () => ({
        user: {
            fullName: 'Test User',
            primaryEmailAddress: { emailAddress: 'test@example.com' }
        },
        isLoaded: true,
        isSignedIn: true
    }),
}))

describe('DashboardLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('calls useProfileSync', () => {
        render(
            <MemoryRouter>
                <DashboardLayout>
                    <div>Child Content</div>
                </DashboardLayout>
            </MemoryRouter>
        )
        expect(useProfileSync).toHaveBeenCalled()
    })

    it('renders children', () => {
        render(
            <MemoryRouter>
                <DashboardLayout>
                    <div>Child Content</div>
                </DashboardLayout>
            </MemoryRouter>
        )
        expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('renders sidebar and header elements', () => {
        render(
            <MemoryRouter>
                <DashboardLayout>
                    <div>Child Content</div>
                </DashboardLayout>
            </MemoryRouter>
        )
        expect(screen.getAllByTestId('user-button').length).toBeGreaterThan(0)
    })
})
