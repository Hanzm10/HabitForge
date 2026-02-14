import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppRoutes } from '../App'

// Mock Components and Hooks
vi.mock('../pages/LandingPage', () => ({ default: () => <div>Landing Page</div> }))
vi.mock('../pages/auth/SignInPage', () => ({ default: () => <div>Sign In Page</div> }))
vi.mock('../pages/auth/SignUpPage', () => ({ default: () => <div>Sign Up Page</div> }))
vi.mock('../layouts/DashboardLayout', () => ({ DashboardLayout: ({ children }: { children: any }) => <div>Dashboard Layout {children}</div> }))

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
const mockCreateClient = vi.fn((..._args: any[]) => ({ from: mockFrom }))

vi.mock('@supabase/supabase-js', () => ({
    createClient: (...args: any[]) => mockCreateClient(...args),
}))

// Mock useProfileSync (DashboardLayout uses it)
vi.mock('../hooks/useProfileSync', () => ({
    useProfileSync: vi.fn(),
}))

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

        // ProtectedRoute -> DashboardLayout -> HabitList (empty state)
        await waitFor(() => {
            expect(screen.getByText(/Dashboard Layout/)).toBeInTheDocument()
            expect(screen.getByText(/no habits yet/i)).toBeInTheDocument()
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
