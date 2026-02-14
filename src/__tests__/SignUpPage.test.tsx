import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import SignUpPage from '../pages/auth/SignUpPage'

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
    SignUp: () => <div data-testid="clerk-sign-up">Mock Clerk SignUp</div>,
}))

describe('SignUpPage', () => {
    it('renders the sign-up form', () => {
        render(<SignUpPage />, { wrapper: BrowserRouter })
        expect(screen.getByTestId('clerk-sign-up')).toBeInTheDocument()
    })

    it('renders the branding headline', () => {
        render(<SignUpPage />, { wrapper: BrowserRouter })
        expect(screen.getByText(/join habitforge/i)).toBeInTheDocument()
    })

    it('has a link back to home', () => {
        render(<SignUpPage />, { wrapper: BrowserRouter })
        const link = screen.getByRole('link', { name: /back/i })
        expect(link).toHaveAttribute('href', '/')
    })
})
