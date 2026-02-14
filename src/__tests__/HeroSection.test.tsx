import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { HeroSection } from '../components/landing/HeroSection'

describe('HeroSection', () => {
    it('renders the headline', () => {
        render(<HeroSection />, { wrapper: BrowserRouter })
        expect(screen.getByText(/Build Systems/i)).toBeInTheDocument()
        expect(screen.getByText(/Not Motivation/i)).toBeInTheDocument()
    })

    it('renders a CTA link pointing to /sign-up', () => {
        render(<HeroSection />, { wrapper: BrowserRouter })
        const cta = screen.getByRole('link', { name: /start tracking/i })
        expect(cta).toHaveAttribute('href', '/sign-up')
    })

    it('renders subtext describing the value proposition', () => {
        render(<HeroSection />, { wrapper: BrowserRouter })
        expect(screen.getByText(/daily discipline into visual progress/i)).toBeInTheDocument()
    })
})
