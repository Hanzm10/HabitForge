import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import LandingPage from '../pages/LandingPage'

describe('LandingPage', () => {
    it('renders all 6 sections', () => {
        render(<LandingPage />, { wrapper: BrowserRouter })

        // Hero
        expect(screen.getByText(/Build Systems/i)).toBeInTheDocument()
        // Features
        expect(screen.getByText(/streak tracking/i)).toBeInTheDocument()
        // Social proof
        expect(screen.getAllByRole('blockquote').length).toBeGreaterThanOrEqual(3)
        // How it works
        expect(screen.getByText(/how it works/i)).toBeInTheDocument()
        // Pricing — use heading query to avoid multi-match
        const headings = screen.getAllByRole('heading')
        const headingTexts = headings.map((h) => h.textContent?.toLowerCase() || '')
        expect(headingTexts.some((t) => t.includes('free'))).toBe(true)
        // Footer
        expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument()
    })

    it('renders a navigation bar', () => {
        render(<LandingPage />, { wrapper: BrowserRouter })
        expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
})
