import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProtectedRoute from '../components/auth/ProtectedRoute'

// Mock useAuth
const mockUseAuth = vi.fn()
vi.mock('@clerk/clerk-react', () => ({
    useAuth: () => mockUseAuth(),
    RedirectToSignIn: () => <div data-testid="redirect-to-sign-in">Redirecting...</div>,
}))

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('redirects to sign-in when not signed in', () => {
        mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: false })

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByTestId('redirect-to-sign-in')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('renders children when signed in', () => {
        mockUseAuth.mockReturnValue({ isLoaded: true, isSignedIn: true })

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.queryByTestId('redirect-to-sign-in')).not.toBeInTheDocument()
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('renders nothing while loading', () => {
        mockUseAuth.mockReturnValue({ isLoaded: false, isSignedIn: undefined })

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.queryByTestId('redirect-to-sign-in')).not.toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
})
