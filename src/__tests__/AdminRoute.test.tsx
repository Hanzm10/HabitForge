import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminRoute from '../components/auth/AdminRoute'

// Mock Clerk components
const mockUseUser = vi.fn()
const mockUseAuth = vi.fn()
vi.mock('@clerk/clerk-react', () => ({
    useUser: () => mockUseUser(),
    useAuth: () => mockUseAuth(),
    RedirectToSignIn: () => <div>Redirecting to Sign In...</div>,
}))

// Mock Supabase
const mockSingle = vi.fn()
const mockEq = vi.fn(() => ({ single: mockSingle }))
const mockSelect = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ select: mockSelect }))
const mockCreateClient = vi.fn((..._args: any[]) => ({ from: mockFrom }))

vi.mock('@supabase/supabase-js', () => ({
    createClient: (url: string, key: string, options: any) => mockCreateClient(url, key, options),
}))

describe('AdminRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders children if user role is admin', async () => {
        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: true, user: { id: 'admin_1' } })
        mockUseAuth.mockReturnValue({ getToken: vi.fn().mockResolvedValue('token') })

        // Mock profile fetch returning admin role
        mockSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <div>Admin Content</div>
                            </AdminRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Admin Content')).toBeInTheDocument()
        })
    })

    it('redirects to dashboard if user role is not admin', async () => {
        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: true, user: { id: 'user_1' } })
        mockUseAuth.mockReturnValue({ getToken: vi.fn().mockResolvedValue('token') })

        // Mock profile fetch returning user role
        mockSingle.mockResolvedValue({ data: { role: 'user' }, error: null })

        render(
            <MemoryRouter initialEntries={['/admin', '/dashboard']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <div>Admin Content</div>
                            </AdminRoute>
                        }
                    />
                    <Route path="/dashboard" element={<div>Dashboard Content</div>} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
            expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
        })
    })

    it('shows loading state while checking role', () => {
        mockUseUser.mockReturnValue({ isLoaded: true, isSignedIn: true, user: { id: 'user_1' } })
        mockUseAuth.mockReturnValue({ getToken: vi.fn().mockResolvedValue('token') })

        // Mock promise that never resolves (simulating loading)
        mockSingle.mockReturnValue(new Promise(() => { }))

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <div>Admin Content</div>
                            </AdminRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )

        // Should show nothing or a spinner
        expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
    })
})
