import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import SignInPage from '../pages/auth/SignInPage'

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
    SignIn: () => <div data-testid="clerk-sign-in">Mock Clerk SignIn</div>,
}))

describe('SignInPage', () => {
    it('renders the sign-in form', () => {
        render(<SignInPage />, { wrapper: BrowserRouter })
        expect(screen.getByTestId('clerk-sign-in')).toBeInTheDocument()
    })

    it('renders the branding headline', () => {
        render(<SignInPage />, { wrapper: BrowserRouter })
        expect(screen.getByText(/back to habitforge/i)).toBeInTheDocument()
    })

    it('has a link back to home', () => {
        render(<SignInPage />, { wrapper: BrowserRouter })
        const link = screen.getByRole('link', { name: /back/i }) // Adjusted to flexible match
        expect(link).toHaveAttribute('href', '/')
    })
})
