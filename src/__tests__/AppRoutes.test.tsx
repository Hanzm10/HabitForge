import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppRoutes } from '../App'

// Mock Components and Hooks
vi.mock('../pages/LandingPage', () => ({ default: () => <div>Landing Page</div> }))
vi.mock('../pages/auth/SignInPage', () => ({ default: () => <div>Sign In Page</div> }))
vi.mock('../pages/auth/SignUpPage', () => ({ default: () => <div>Sign Up Page</div> }))
vi.mock('../layouts/DashboardLayout', () => ({ default: ({ children }: { children: any }) => <div>Dashboard Layout {children}</div> }))

// Mock Auth Guards
// We need to allow them to render children based on props or context, but since they rely on useUser/useProfileSync,
// we should probably mock the HOOKS they use, OR mock the components themselves if we want shallow testing.
// Integration testing the guards is better.

// Mock Clerk
const mockUseUser = vi.fn()
const mockUseAuth = vi.fn()
vi.mock('@clerk/clerk-react', () => ({
    useUser: () => mockUseUser(),
    useAuth: () => mockUseAuth(),
    UserButton: () => <div>UserButton</div>,
    RedirectToSignIn: () => <div>Redirecting to Sign In...</div>,
}))

// Mock Supabase for AdminRoute
const mockSingle = vi.fn()
const mockEq = vi.fn(() => ({ single: mockSingle }))
const mockSelect = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ select: mockSelect }))
const mockCreateClient = vi.fn(() => ({ from: mockFrom }))

vi.mock('@supabase/supabase-js', () => ({
    createClient: (...args: any[]) => mockCreateClient(...args),
}))

// Mock useProfileSync (DashboardLayout uses it)
vi.mock('../hooks/useProfileSync', () => ({
    useProfileSync: vi.fn(),
}))

describe('AppRoutes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders landing page on /', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        )
        expect(screen.getByText('Landing Page')).toBeInTheDocument()
    })

    it('renders protected dashboard if signed in', async () => {
        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: true, user: { id: 'user_1' } })
        mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AppRoutes />
            </MemoryRouter>
        )

        // ProtectedRoute -> DashboardLayout -> Dashboard
        await waitFor(() => {
            expect(screen.getByText(/Dashboard Layout/)).toBeInTheDocument()
            expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
        })
    })

    it('redirects to sign-in if accessing dashboard while signed out', async () => {
        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: false })
        mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <AppRoutes />
            </MemoryRouter>
        )

        await waitFor(() => {
            // ProtectedRoute uses RedirectToSignIn from Clerk which we mocked
            expect(screen.getByText('Redirecting to Sign In...')).toBeInTheDocument()
        })
    })

    it('renders admin page if admin', async () => {
        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: true, user: { id: 'admin_1' } })
        mockUseAuth.mockReturnValue({
            isLoaded: true,
            isSignedIn: true,
            getToken: vi.fn().mockResolvedValue('token')
        })
        mockSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <AppRoutes />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Admin Console')).toBeInTheDocument()
        })
    })
})
